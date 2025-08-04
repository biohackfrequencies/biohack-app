import { IntegratedDataSummary, OuraData, CalendarEvent, CgmData } from '../types';

type IntegrationId = 'oura' | 'calendar' | 'cgm';

const simulateOuraData = (): OuraData => {
  const readinessScore = 70 + Math.floor(Math.random() * 25); // 70-95
  return {
    readinessScore,
    sleepScore: 65 + Math.floor(Math.random() * 30), // 65-95
    bodyTemperature: +(Math.random() * 1.2 - 0.6).toFixed(1), // -0.6 to +0.6
  };
};

const simulateCalendarData = (): CalendarEvent[] => {
  const now = new Date();
  const events: CalendarEvent[] = [];
  
  // Simulate a focus block
  const focusStart = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  const focusEnd = new Date(focusStart.getTime() + 90 * 60 * 1000); // 90 min long
  events.push({
    title: 'Deep Work Block',
    startTime: focusStart.toISOString(),
    endTime: focusEnd.toISOString(),
    isFocusBlock: true,
  });

  // Simulate a regular meeting
  const meetingStart = new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours from now
  const meetingEnd = new Date(meetingStart.getTime() + 60 * 60 * 1000); // 60 min long
  events.push({
    title: 'Team Sync',
    startTime: meetingStart.toISOString(),
    endTime: meetingEnd.toISOString(),
  });

  return events;
};

const simulateCgmData = (): CgmData => {
  return {
    currentGlucose: 80 + Math.floor(Math.random() * 40), // 80-120
    trend: ['flat', 'up', 'down'][Math.floor(Math.random() * 3)] as 'flat' | 'up' | 'down',
  };
};


export const getIntegratedDataSummary = async (connectedIntegrations: Set<IntegrationId>): Promise<IntegratedDataSummary> => {
  const summary: IntegratedDataSummary = {};

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
  
  if (connectedIntegrations.has('oura')) {
    summary.oura = simulateOuraData();
  }
  if (connectedIntegrations.has('calendar')) {
    summary.calendar = simulateCalendarData();
  }
  if (connectedIntegrations.has('cgm')) {
    summary.cgm = simulateCgmData();
  }

  return summary;
};
