import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import type { Frequency, HealthDataSummary, IntegratedDataSummary } from '../../types';

// This is a server-side function, so process.env can be used securely.
// The API_KEY must be set in your Netlify build environment variables.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    // This will cause the function to fail gracefully if the API key is not set
    console.error("API_KEY is not configured.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// --- Schemas for structured responses from Gemini ---

const sessionCreationSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ["session"] },
        advice: { 
            type: Type.STRING,
            description: "Friendly advice or context for the user about the generated session. Explain why it was created this way."
        },
        creation: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING, description: "A creative and descriptive title for the session." },
                description: { type: Type.STRING, description: "A brief, one or two sentence description of the session's purpose." },
                steps: {
                    type: Type.ARRAY,
                    description: "The sequence of steps in the session.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "A short, descriptive title for the step (e.g., 'Warm-up', 'Deep Focus')." },
                            description: { type: Type.STRING, description: "A brief explanation of this step's purpose." },
                            duration: { type: Type.INTEGER, description: "The duration of this step in seconds. Should be a multiple of 60." },
                            frequencyId: { type: Type.STRING, description: "The ID of the primary frequency for this step. Must be one of the provided valid frequency IDs." },
                            layerFrequencyId: { type: Type.STRING, description: "Optional ID of a secondary frequency to layer. Must be one of the provided valid frequency IDs." }
                        },
                        required: ["title", "description", "duration", "frequencyId"]
                    }
                }
            },
            required: ["title", "description", "steps"]
        }
    },
    required: ["type", "advice", "creation"]
};

const insightSchema = {
    type: Type.OBJECT,
    properties: {
        insight: {
            type: Type.STRING,
            description: "A concise, actionable insight for the user based on their health data and activity log. It can be an observation or a recommendation. Keep it under 200 characters."
        }
    },
    required: ["insight"]
};


// --- Handler for all Gemini API calls ---

export const handler = async (event: { httpMethod: string, body: string | null }) => {
    if (!apiKey) {
        return { statusCode: 500, body: JSON.stringify({ error: 'API_KEY is not configured on the server. Please contact the site administrator.' }) };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const { action, payload } = JSON.parse(event.body || '{}');

        switch (action) {
            case 'generateCreation': {
                const { prompt, allFrequencies } = payload;
                const validFrequencyIds = allFrequencies.map((f: Frequency) => `id: ${f.id}, name: ${f.name}`).join('; ');
                const systemInstruction = `You are a bio-acoustic expert creating personalized sound therapy sessions.
- The user will provide a request. Generate a session based on it.
- Use the provided list of valid frequencies ONLY for the 'frequencyId' and 'layerFrequencyId' fields.
- The 'duration' for each step must be in seconds (e.g., 5 minutes is 300).
- Provide helpful advice explaining your choices.
- Ensure the response strictly adheres to the provided JSON schema.
- Layering frequencies is a powerful tool; use it thoughtfully for synergistic effects.`;

                const response: GenerateContentResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `User Request: "${prompt}". Valid Frequencies: [${validFrequencyIds}]`,
                    config: {
                        systemInstruction,
                        responseMimeType: 'application/json',
                        responseSchema: sessionCreationSchema,
                    },
                });
                
                return { statusCode: 200, body: response.text.trim() };
            }

            case 'getChatResponse': {
                const { prompt, history } = payload;
                const systemInstruction = `You are a friendly and knowledgeable AI Wellness Co-pilot. 
- Answer user questions about wellness, biohacking, and sound therapy.
- If the question is about recent events, news, or requires up-to-date info, rely on your search tool.
- ALWAYS cite your sources when using the search tool by providing the URLs.
- Keep your tone supportive and encouraging.`;

                const chatHistory = history && history.length > 0 ? { history } : {};
                
                const response: GenerateContentResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        systemInstruction,
                        tools: [{googleSearch: {}}],
                        ...chatHistory,
                    },
                });

                const text = response.text;
                const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
                const sources = (rawSources?.map(s => s.web).filter((s): s is { uri: string; title: string } => !!(s && s.uri))) || [];
                
                return { statusCode: 200, body: JSON.stringify({ text, sources }) };
            }

            case 'getInsight': {
                const { healthData, activitySummary, integratedData } = payload;
                const systemInstruction = `You are an AI Biohacking Co-pilot. 
- Analyze the user's health metrics (HRV, RHR, Sleep) from HealthKit/Health Connect.
- Analyze data from integrated services like Oura Ring (readiness, sleep scores), Google Calendar (events, focus blocks), and CGM (glucose levels).
- Correlate this data with their logged activities from today/yesterday.
- Generate a single, actionable insight, a proactive recommendation, or a piece of positive reinforcement.
- Be specific and data-driven.
- Keep your tone concise, supportive, and easy to understand.
- Return ONLY the insight string in the specified JSON format.`;

                const prompt = `User HealthKit Data: ${JSON.stringify(healthData)}\nUser Activity: ${JSON.stringify(activitySummary)}\nIntegrated Services Data: ${JSON.stringify(integratedData)}`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: {
                        systemInstruction,
                        responseMimeType: "application/json",
                        responseSchema: insightSchema,
                    },
                });

                return { statusCode: 200, body: response.text.trim() };
            }

            default:
                return { statusCode: 400, body: JSON.stringify({ error: 'Invalid action specified.' }) };
        }
    } catch (error: any) {
        console.error("Error in Gemini serverless function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'An internal server error occurred.' }),
        };
    }
};