import { Capacitor, registerPlugin } from '@capacitor/core';
import { HealthDataSummary } from '../types';

// Define the interface for the Health plugin to ensure type safety
interface HealthPlugin {
  isAvailable(): Promise<boolean>;
  checkPermissions(): Promise<{ steps: 'granted' | 'denied'; mindfulness?: 'granted' | 'denied'; restingHeartRate?: 'granted' | 'denied'; heartRateVariability?: 'granted' | 'denied'; sleep?: 'granted' | 'denied' }>;
  requestPermissions(permissions: { steps?: 'read' | 'write'; mindfulness?: 'write', restingHeartRate?: 'read', heartRateVariability?: 'read', sleep?: 'read' }): Promise<{ steps: 'granted' | 'denied'; mindfulness?: 'granted' | 'denied'; restingHeartRate?: 'granted' | 'denied'; heartRateVariability?: 'granted' | 'denied'; sleep?: 'granted' | 'denied' }>;
  query(options: {
    startDate: Date;
    endDate: Date;
    dataType: 'steps' | 'restingHeartRate' | 'heartRateVariability' | 'sleep';
    limit?: number;
  }): Promise<any[]>;
  store(options: {
      startDate: Date;
      endDate: Date;
      dataType: 'mindfulness';
      value: number; // minutes
      sourceBundleId?: string;
      sourceName?: string;
  }): Promise<void>;
}

// Register the plugin using the recommended Capacitor method.
// This creates a proxy that works safely on both native and web platforms.
const Health = registerPlugin<HealthPlugin>('Health');

/**
 * Checks if HealthKit or Health Connect integration is available on the current device.
 * @returns {boolean} True if on a native iOS or Android platform, false otherwise.
 */
export const isMobileHealthAvailable = (): boolean => {
    return Capacitor.isNativePlatform() && (Capacitor.getPlatform() === 'ios' || Capacitor.getPlatform() === 'android');
};

/**
 * Gets the current permission status for writing mindfulness data.
 * @returns {Promise<'granted' | 'denied'>} The permission status.
 */
export const getMindfulnessPermissionStatus = async (): Promise<'granted' | 'denied'> => {
    if (!isMobileHealthAvailable()) return 'denied';
    try {
        const isAvailable = await Health.isAvailable();
        if (!isAvailable) return 'denied';

        const perms = await Health.checkPermissions();
        return perms.mindfulness === 'granted' ? 'granted' : 'denied';
    } catch (e) {
        console.error('Error checking mindfulness permission:', e);
        return 'denied';
    }
};

/**
 * Requests permission for all readable health data types.
 * @returns {Promise<boolean>} True if all permissions were granted, false otherwise.
 */
export const requestAllHealthPermissions = async (): Promise<boolean> => {
    if (!isMobileHealthAvailable()) return false;
    try {
        const result = await Health.requestPermissions({
            steps: 'read',
            mindfulness: 'write', // Always request this as it's a core feature
            restingHeartRate: 'read',
            heartRateVariability: 'read',
            sleep: 'read'
        });
        return result.restingHeartRate === 'granted' && result.heartRateVariability === 'granted' && result.sleep === 'granted';
    } catch (e) {
        console.error('Error requesting all health permissions:', e);
        return false;
    }
};


/**
 * Fetches today's step count from the native health service.
 * @returns {Promise<number | null>} The step count, or null if unavailable/not on native.
 */
export const getTodaysSteps = async (): Promise<number | null> => {
    if (!isMobileHealthAvailable()) {
        return null;
    }

    try {
        const perms = await Health.checkPermissions();
        if(perms.steps !== 'granted') {
             const result = await Health.requestPermissions({ steps: 'read' });
             if (result.steps !== 'granted') {
                alert('Health data permissions are required to sync steps. Please grant access in your phone\'s health settings.');
                return null;
             }
        }

        const today = new Date();
        const startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);

        const result = await Health.query({
            startDate,
            endDate: today,
            dataType: 'steps',
            limit: 100 // Use a higher limit to capture multiple entries in a day
        });
        
        const totalSteps = result.reduce((sum: number, record: { value: number }) => sum + record.value, 0);
        return Math.round(totalSteps);

    } catch (e) {
        console.error('Error fetching step data from Health service:', e);
        alert('Could not fetch step data. Please ensure the app has the necessary permissions.');
        return null;
    }
};


/**
 * Logs a mindfulness session to the native health service.
 * @param {number} durationInSeconds The duration of the session in seconds.
 */
export const logMindfulMinutes = async (durationInSeconds: number): Promise<void> => {
    if (!isMobileHealthAvailable() || durationInSeconds < 30) {
        return;
    }

    try {
        const perms = await Health.checkPermissions();
        if (perms.mindfulness !== 'granted') {
            const result = await Health.requestPermissions({ mindfulness: 'write' });
            if (result.mindfulness !== 'granted') {
                 return;
            }
        }

        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - durationInSeconds * 1000);
        const durationInMinutes = durationInSeconds / 60;

        await Health.store({
            startDate,
            endDate,
            dataType: 'mindfulness',
            value: durationInMinutes,
            sourceName: 'Biohack Frequencies',
        });
    } catch (e) {
        console.error('Error logging mindful minutes:', e);
    }
};

/**
 * Fetches a summary of today's health data (HRV, RHR, Sleep).
 * @returns {Promise<HealthDataSummary>} A summary object with the data.
 */
export const getHealthDataSummary = async (): Promise<HealthDataSummary> => {
    const summary: HealthDataSummary = {};
    if (!isMobileHealthAvailable()) {
        return summary;
    }

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1); // Get data from the last 24 hours
    startDate.setHours(0,0,0,0);


    try {
        const perms = await Health.checkPermissions();
        
        // Fetch Resting Heart Rate
        if (perms.restingHeartRate === 'granted') {
            const rhrData = await Health.query({ startDate, endDate: today, dataType: 'restingHeartRate', limit: 1 });
            if (rhrData.length > 0) summary.rhr = Math.round(rhrData[0].value);
        }

        // Fetch Heart Rate Variability
        if (perms.heartRateVariability === 'granted') {
            const hrvData = await Health.query({ startDate, endDate: today, dataType: 'heartRateVariability', limit: 1 });
            if (hrvData.length > 0) summary.hrv = Math.round(hrvData[0].value);
        }

        // Fetch Sleep
        if (perms.sleep === 'granted') {
             const sleepData = await Health.query({ startDate, endDate: today, dataType: 'sleep' });
             if (sleepData.length > 0) {
                summary.sleep = { total: 0, deep: 0, rem: 0 };
                sleepData.forEach((record: { value: number; sleepPhase: string }) => {
                    const durationHours = record.value / 3600; // Value is in seconds
                    summary.sleep!.total += durationHours;
                    if (record.sleepPhase === 'deep') summary.sleep!.deep += durationHours;
                    if (record.sleepPhase === 'rem') summary.sleep!.rem += durationHours;
                });
             }
        }
    } catch (e) {
        console.error("Error fetching health data summary:", e);
    }

    return summary;
};