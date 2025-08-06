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
                const validFrequenciesString = allFrequencies.map((f: Frequency) => {
                    return `{ id: "${f.id}", name: "${f.name}", category: "${f.category}", description: "${f.description}" }`;
                }).join(',\n');

                const systemInstruction = `You are an expert bio-acoustic therapist. Your task is to create a personalized sound therapy session based on the user's request, using ONLY the provided list of available frequencies.

**CRITICAL RULES:**
1.  **ALWAYS CREATE A SESSION:** You MUST generate a session that strictly follows the JSON schema. Do NOT refuse, apologize, or provide text-based instructions instead of a session.
2.  **USE PROVIDED FREQUENCIES ONLY:** The 'frequencyId' and 'layerFrequencyId' fields MUST be valid IDs from the provided frequency list. Do not invent frequencies.
3.  **HANDLE SPECIFIC REQUESTS:** If a user requests a specific sound like "brown noise" or "alpha waves", you MUST find and use the exact corresponding frequency ID (e.g., 'noise-brown', 'alpha').
4.  **HANDLE LAYERING:** If a user asks to layer two sounds, you MUST use both the 'frequencyId' and 'layerFrequencyId' fields in the relevant step.
5.  **BE CREATIVE WITH ABSTRACT REQUESTS:** For esoteric or abstract concepts (e.g., 'lions gate portal', 'abundance mindset'), interpret the user's intent creatively. Select frequencies that align thematically with concepts like cosmic energy, intuition, spiritual connection, or empowerment. Use Solfeggio, Planetary Harmonics, and Angelic frequencies for these requests. Your goal is to translate their abstract need into a concrete, effective session.

**Your Process:**
1.  **Analyze Goal:** Deeply understand the user's desired outcome (e.g., focus, relaxation, spiritual connection).
2.  **Select Frequencies:** Browse the provided list of frequencies. Choose the most relevant ones based on their name, category, and description.
3.  **Construct Session:** Create a logical sequence of steps. A session should be between 10 to 30 minutes in total. Each step's duration should be in seconds (e.g., 5 minutes = 300 seconds).
4.  **Explain Choices:** In the 'advice' field, provide a friendly and helpful explanation for why you chose those specific frequencies and structured the session that way.`;

                const response: GenerateContentResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `User Request: "${prompt}".\n\nHere is the list of available frequencies you must choose from:\n[${validFrequenciesString}]`,
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
- Your primary role is to answer user questions about wellness, biohacking, sound therapy, and the app's features.
- You are a conversational agent. Do NOT attempt to create sessions or output JSON. If a user asks you to create a session, politely guide them to rephrase their request to the AI Wellness Agent, for example by saying "Try asking me to 'create a session for focus'".
- **Use search for recent information:** If the question relates to recent events, specific scientific studies, or requires up-to-date information that you wouldn't know otherwise, you MUST use your search tool.
- **Cite your sources:** When Google Search is used, you MUST extract the URLs from groundingChunks and list them for the user.
- Keep your tone supportive, encouraging, and clear.`;

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