import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ActivityLogItem, TrackableActivityId, Frequency, CustomStack } from '../types';
import { useSubscription } from '../hooks/useSubscription';
import { LogDetailModal } from './LogDetailModal';
import { ActivityRings } from './ActivityRings';
import { QuickLog } from './QuickLog';
import { HabitSelectorModal } from './HabitSelectorModal';
import { AnalyticsSummaryCard } from './AnalyticsSummaryCard';
import { LibraryCtaCard } from './LibraryCtaCard';
import { GoalSettingsModal } from './GoalSettingsModal';
import { useUserData } from '../contexts/UserDataContext';
import { getAiInsight } from '../services/geminiService';
import { AIInsightsCard } from './AIInsightsCard';
import { SchumannResonanceCard } from './SchumannResonanceCard';
import { useIntegrations } from '../contexts/IntegrationsContext';
import { useAuth } from '../contexts/AuthContext';
import { DailyInspirationCard } from './DailyInspirationCard';
import { getIntegratedDataSummary } from '../services/integrationsService';

interface DashboardPageProps {
    activityLog: ActivityLogItem[];
    addActivityLogItem: (activityId: TrackableActivityId, details?: any) => ActivityLogItem;
    updateActivityLogItem: (item: ActivityLogItem) => void;
    deleteActivityLogItem: (itemId: string) => void;
    duplicateActivityLogItem: (itemId: string) => ActivityLogItem | null;
    allFrequencies: Frequency[];
    onPlayAiSession: (session: CustomStack) => void;
    dailyQuote: { quote: string; author: string; } | null;
}

const LOG_LIMIT_FREE = 5;
const HABIT_LIMIT_FREE = 3;


export const DashboardPage: React.FC<DashboardPageProps> = ({ 
    activityLog, addActivityLogItem, updateActivityLogItem, deleteActivityLogItem, duplicateActivityLogItem,
    allFrequencies, onPlayAiSession, dailyQuote
}) => {
    const { isSubscribed } = useSubscription();
    const [editingItem, setEditingItem] = useState<ActivityLogItem | null>(null);
    const [isHabitSelectorOpen, setIsHabitSelectorOpen] = useState(false);
    const { activities, addCustomActivity, removeCustomActivity, trackedHabits, setTrackedHabits, userGoals, setUserGoals } = useUserData();
    const [isManageMode, setIsManageMode] = useState(false);
    const [isGoalSettingsOpen, setIsGoalSettingsOpen] = useState(false);
    
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [isInsightLoading, setIsInsightLoading] = useState(false);
    const { connectedIntegrations } = useIntegrations();
    const { user } = useAuth();

    const userName = useMemo(() => {
        if (!user?.email) return null;
        const namePart = user.email.split('@')[0];
        // A simple check to avoid weird names from hashes or UUIDs
        if (namePart.length > 15 || /[\d]/.test(namePart.slice(0, 4))) return null;
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }, [user]);

    const fetchAiInsightData = useCallback(async () => {
        if (!isSubscribed) {
            setAiInsight(null);
            return;
        }
        setIsInsightLoading(true);
        try {
            const integratedData = await getIntegratedDataSummary(connectedIntegrations);
            const summary: Record<string, number> = {};
            activityLog
                .filter((item: ActivityLogItem) => new Date(item.timestamp) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) // last 2 days
                .forEach((item: ActivityLogItem) => {
                    summary[item.activityId] = (summary[item.activityId] || 0) + 1;
                });
            // Pass empty health data for web version
            const insight = await getAiInsight({}, summary, integratedData);
            setAiInsight(insight);
        } catch (err) {
            console.error('Failed to fetch AI insight:', err);
            setAiInsight("Could not fetch an insight at this time.");
        } finally {
            setIsInsightLoading(false);
        }
    }, [isSubscribed, activityLog, connectedIntegrations]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAiInsightData();
    }, [fetchAiInsightData]);

    const todayLog = useMemo(() => {
        const todayStart = new Date().setHours(0, 0, 0, 0);
        return activityLog.filter((item: ActivityLogItem) => item.timestamp >= todayStart);
    }, [activityLog]);

    const handleSaveLogItem = (item: ActivityLogItem) => {
        updateActivityLogItem(item);
        setEditingItem(null);
    };
    
    const handleDuplicateLogItem = () => {
        if (!editingItem) return;
        const newItem = duplicateActivityLogItem(editingItem.id);
        if (newItem) setEditingItem(newItem);
        else setEditingItem(null);
    }
    
    const handleLogActivity = (activityId: TrackableActivityId) => {
        if (!isSubscribed && todayLog.length >= LOG_LIMIT_FREE) {
            window.location.hash = '#/pricing';
            return;
        }

        const activity = activities.find(a => a.id === activityId);
        if(!activity) {
            console.error(`Could not find activity with ID: ${activityId}`);
            return;
        };
        
        const newItem = addActivityLogItem(activityId, activity.custom ? { name: activity.name } : {});
        setEditingItem(newItem);
    };
    
    const handleEditLog = (item: ActivityLogItem) => {
        setEditingItem(item);
    }
    
    const editingActivity = editingItem ? activities.find(a => a.id === editingItem.activityId) : null;

    const dashboardGoals = useMemo(() => {
        const mindMinutes = todayLog
            .filter((item: ActivityLogItem) => item.activityId === 'session' || item.activityId === 'meditation')
            .reduce((total: number, item: ActivityLogItem) => total + (item.details?.duration || 0), 0);
        
        const loggedHabitsCount = new Set(todayLog.map((item: ActivityLogItem) => item.activityId).filter((id: TrackableActivityId) => trackedHabits.includes(id))).size;

        return {
            mindGoal: userGoals.mind,
            mindProgress: userGoals.mind > 0 ? Math.min(mindMinutes / userGoals.mind, 1) : 1,
            moveGoal: userGoals.move,
            moveProgress: 0, // This is calculated inside ActivityRings for web
            consistencyGoal: trackedHabits.length,
            consistencyProgress: trackedHabits.length > 0 ? Math.min(loggedHabitsCount / trackedHabits.length, 1) : 0,
            mindMinutes,
            loggedHabitsCount,
        };
    }, [todayLog, trackedHabits, userGoals]);

    return (
        <div className="animate-fade-in max-w-7xl mx-auto space-y-8">
             {editingItem && editingActivity && (
                <LogDetailModal 
                    item={editingItem}
                    activity={editingActivity}
                    onClose={() => setEditingItem(null)}
                    onSave={handleSaveLogItem}
                    onDuplicate={handleDuplicateLogItem}
                />
            )}
            
            {isHabitSelectorOpen && (
                <HabitSelectorModal
                    currentHabits={trackedHabits}
                    activities={activities}
                    addCustomActivity={addCustomActivity}
                    removeCustomActivity={removeCustomActivity}
                    onSave={(newHabits) => {
                        setTrackedHabits(newHabits);
                        setIsHabitSelectorOpen(false);
                    }}
                    onClose={() => setIsHabitSelectorOpen(false)}
                    isSubscribed={isSubscribed}
                    habitLimit={HABIT_LIMIT_FREE}
                />
            )}
            
            {isGoalSettingsOpen && (
                <GoalSettingsModal
                    initialGoals={userGoals}
                    onSave={(newGoals) => {
                        setUserGoals(newGoals);
                        setIsGoalSettingsOpen(false);
                    }}
                    onClose={() => setIsGoalSettingsOpen(false)}
                />
            )}

            {dailyQuote && (
                <DailyInspirationCard 
                    quote={dailyQuote.quote}
                    author={dailyQuote.author}
                    userName={userName}
                />
            )}

            <LibraryCtaCard />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3 space-y-8">
                    <ActivityRings 
                        goals={dashboardGoals}
                        onOpenSettings={() => setIsGoalSettingsOpen(true)}
                    />
                    <AnalyticsSummaryCard 
                        activityLog={activityLog} 
                        trackedHabits={trackedHabits}
                        isSubscribed={isSubscribed}
                    />
                    <QuickLog
                        activities={activities}
                        habits={trackedHabits}
                        onLogActivity={handleLogActivity}
                        onEditLog={handleEditLog}
                        deleteActivityLogItem={deleteActivityLogItem}
                        todayLog={todayLog}
                        onOpenCustomizer={() => setIsHabitSelectorOpen(true)}
                        isManageMode={isManageMode}
                        setIsManageMode={setIsManageMode}
                        isSubscribed={isSubscribed}
                        logLimit={LOG_LIMIT_FREE}
                    />
                </div>
                <div className="space-y-8 lg:col-span-2">
                    <SchumannResonanceCard />
                    <AIInsightsCard 
                        insight={aiInsight}
                        isLoading={isInsightLoading}
                        isSubscribed={isSubscribed}
                    />
                </div>
            </div>
        </div>
    );
};