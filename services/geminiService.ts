import { Frequency, CustomStack, HealthDataSummary, IntegratedDataSummary } from '../types';

export type AiCreationResponse = {
  type: 'session';
  advice: string;
  creation: Omit<CustomStack, 'id' | 'colors' | 'categoryId'>;
}

export type AiChatResponse = {
    text: string;
    sources?: Array<{ uri: string; title: string; }>;
}

/**
 * A helper function to call our Netlify serverless function.
 * @param action The specific AI action to perform (e.g., 'generateCreation').
 * @param payload The data required for the action.
 * @returns The JSON response from the serverless function.
 */
async function callGeminiFunction(action: string, payload: any) {
    try {
        const response = await fetch('/.netlify/functions/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action, payload }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `Server error: ${response.status}` }));
            throw new Error(errorData.error || 'An unknown error occurred while contacting the AI service.');
        }

        return response.json();
    } catch (error) {
        console.error(`Error calling serverless function action '${action}':`, error);
        // Re-throw the error to be caught by the calling component
        throw error;
    }
}


export const generateAiCreation = async (prompt: string, allFrequencies: Frequency[]): Promise<AiCreationResponse> => {
    return callGeminiFunction('generateCreation', { prompt, allFrequencies });
};

export const getAiChatResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<AiChatResponse> => {
    return callGeminiFunction('getChatResponse', { prompt, history });
}

export const getAiInsight = async (healthData: HealthDataSummary, activitySummary: Record<string, number>, integratedData: IntegratedDataSummary): Promise<string | null> => {
    try {
        const result = await callGeminiFunction('getInsight', { healthData, activitySummary, integratedData });
        return result.insight || "Couldn't generate an insight right now. Check back later!";
    } catch (error) {
        console.error("Error generating AI insight:", error);
        return "Couldn't generate an insight at this time.";
    }
};
