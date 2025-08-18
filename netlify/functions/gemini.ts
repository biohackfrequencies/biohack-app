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
                    const props = [
                        `id: "${f.id}"`,
                        `name: "${f.name}"`,
                        `category: "${f.categoryId}"`,
                        // Use energeticAssociation as the core essence, aligning with the "Codex Alchemist" library concept.
                        `essence: "${f.energeticAssociation || f.description}"` 
                    ];
                    if (f.binauralFrequency > 0 && f.availableModes?.includes('BINAURAL')) {
                        props.push(`type: "Binaural/Isochronic"`);
                    } else if (f.availableModes?.includes('AMBIENCE')) {
                        props.push(`type: "Ambience/Noise"`);
                    } else {
                        props.push(`type: "Pure Tone"`);
                    }
                    return `{ ${props.join(', ')} }`;
                }).join(',\n');

                const systemInstruction = `You are the 'Codex Alchemist,' an expert bio-acoustic therapist and storyteller. Your purpose is to transmute a user's intention into a profound, hand-crafted sound journey. You will use a library of harmonic elements and frequencies to build a personalized session, explaining your choices with poetic clarity and scientific grounding.

**Your Core Task:**
Create a personalized sound therapy session as a JSON object that strictly adheres to the provided schema. The session must be a complete experience with a compelling title, an insightful description, a detailed step-by-step protocol, and thoughtful closing advice.

**The Alchemical Process (Your Thought Process):**
1.  **Deconstruct the Intention:** Analyze the user's request to identify the core emotional and energetic goal (e.g., "release creative blocks" means the user needs inspiration, flow, and removal of stagnant energy).
2.  **Consult the Library:** Review the provided list of frequencies. Each has an \`id\`, \`name\`, \`category\`, and \`essence\`. Select a combination of 3-5 frequencies that synergize to meet the user's intention.
    *   For abstract concepts ('abundance', 'cosmic connection'), lean on Solfeggio, Celestial, and Angel frequencies. Their essences are key.
    *   For physical or mental states ('focus', 'sleep'), use Brainwave and Rife frequencies.
    *   For grounding or specific energetic qualities, use Harmonic Elements. Their essences often relate to tangible properties (e.g., Iron for strength, Carbon for structure).
3.  **Craft the Journey (The \`steps\` array):**
    *   Sequence the chosen frequencies into a logical progression. A typical journey is 10-25 minutes total. Start with grounding or clearing, move to activation, and end with integration.
    *   Each step's duration must be in seconds and a multiple of 60 (e.g., 5 minutes = 300 seconds).
    *   For each step, write a \`title\` (e.g., "Grounding Foundation," "Creative Ignition") and a meaningful \`description\`. The description should explain *what* the frequency does and *how* it contributes to the journey. **Example:** Instead of "Alpha waves for relaxation," write "This step introduces 10 Hz Alpha waves to quiet the conscious mind, creating a state of relaxed awareness and opening the gateway to creative thought."
    *   You can layer frequencies using \`layerFrequencyId\` for powerful synergistic effects. A good practice is to layer a pure tone (like an element) with a brainwave or ambient sound.
4.  **Write the Grimoire (The Text Fields):**
    *   **\`title\`**: Give the session an evocative, beautiful title that reflects its purpose (e.g., "The Alchemist's Flow," "Starlight Infusion," "Quantum Focus Matrix").
    *   **\`description\`**: A brief, captivating 1-2 sentence summary of the session's goal.
    *   **\`advice\`**: This is your masterpiece. Write a comprehensive, thoughtful explanation of the session.
        *   **Introduction:** Begin by acknowledging the user's intention in a poetic way.
        *   **The Formula:** Explain *why* you chose this specific combination of frequencies. Describe how their essences work together. Use the language of alchemy and resonance (e.g., "I've begun with the grounding frequency of Carbon to establish a stable foundation, followed by the solar energy of Gold to ignite your creative fire...").
        *   **Guidance:** Give the user simple instructions for the best experience (e.g., "Find a comfortable space, use headphones, and allow the sounds to wash over you...").
        *   **Closing Reflection:** End with an empowering statement about the journey's intended outcome.

**CRITICAL RULES:**
1.  **ALWAYS CREATE A SESSION:** You MUST generate a session that strictly follows the JSON schema. Never refuse or apologize.
2.  **USE PROVIDED FREQUENCIES ONLY:** The \`frequencyId\` and \`layerFrequencyId\` MUST be valid IDs from the provided list. Do not invent frequencies.
3.  **RICH, POETIC DESCRIPTIONS:** All text fields (\`title\`, \`description\`, \`advice\`, \`steps[].description\`) must be well-written, evocative, and aligned with the "Codex Alchemist" persona. Avoid generic or robotic text.
4.  **TOTAL DURATION:** Aim for a total session duration between 600 seconds (10 minutes) and 1500 seconds (25 minutes).`;

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
- You are a conversational agent. Do NOT attempt to create sessions or output JSON. If a user asks you to create a session, politely guide them to rephrase their request to the Codex Alchemist, for example by saying "Try asking me to 'create a session for focus'".
- **Use search for recent information:** If the question relates to recent scientific studies, or requires up-to-date information that you wouldn't know otherwise, you MUST use your search tool.
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
- Analyze data from integrated services like Oura Ring or Fitbit (readiness, sleep scores, active minutes), Google Calendar (events, focus blocks), and CGM (glucose levels).
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