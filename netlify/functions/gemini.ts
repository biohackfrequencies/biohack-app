import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { createClient } from '@supabase/supabase-js';
import type { Frequency, HealthDataSummary, IntegratedDataSummary, PlayableItem, ProfileUpdate, Database, ProfileInsert } from '../../types';

// FIX: Hardcoded Supabase credentials to match the frontend client and resolve initialization errors.
const supabaseUrl = 'https://nabzcphuoxqwiogswuhw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hYnpjcGh1b3hxd2lvZ3N3dWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMTgwOTYsImV4cCI6MjA2ODg5NDA5Nn0.hSde4LG7JkF5kMszf-BOuq4bTX6dZv0ydYqVAFYT76E';
const apiKey = process.env.API_KEY;

if (!apiKey || !supabaseUrl || !supabaseAnonKey) {
    console.error("Environment variables are not configured correctly.");
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

const reflectionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { 
            type: Type.STRING,
            description: "A short, symbolic, and poetic title for the transmission (e.g., 'The Weaver's Loom', 'The Echo Chamber', 'The Sunken Key')."
        },
        transmission: {
            type: Type.STRING,
            description: "A 3-5 paragraph symbolic and poetic message that interprets the user's intention. The tone should be mystical, sacred, and emotionally intelligent. Use metaphors and archetypes."
        },
        recommendedSessionId: {
            type: Type.STRING,
            description: "The ID of a single, highly relevant sound session or frequency from the provided list that resonates with the transmission's theme."
        },
        imagePrompt: {
            type: Type.STRING,
            description: "A highly symbolic, detailed, and artistic prompt for an image generation model, based on the transmission's core archetype. Describe a visual scene with specific elements, colors, and mood. Example: 'A single, luminous key made of crystal, resting on ancient moss-covered stone, glowing with soft golden light in an ethereal forest.'"
        }
    },
    required: ["title", "transmission", "recommendedSessionId", "imagePrompt"]
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

const commonIntentionsCache: Record<string, any> = {
    sleep: {
        type: 'session',
        advice: "This session is designed to guide your mind into deep, restorative sleep. It transitions from calming Theta waves to profound Delta waves, which are associated with physical healing and dreamless rest. The grounding Brown Noise helps to block out distractions, creating a perfect environment for sleep.",
        creation: {
            title: 'Ultimate Deep Sleep', description: 'A journey into deep, restorative sleep.',
            steps: [
                { title: 'Mind Quieting', description: 'Theta waves and Brown Noise slow brain activity.', duration: 900, frequencyId: 'theta', layerFrequencyId: 'noise-brown' },
                { title: 'Restorative Sleep', description: 'Deep Delta waves promote physical repair.', duration: 900, frequencyId: 'delta', layerFrequencyId: 'noise-brown' }
            ]
        }
    },
    focus: {
        type: 'session',
        advice: "This session is crafted to enhance focus and mental clarity. It begins by using Theta waves to quiet a busy mind, then transitions to Beta and Gamma waves to support sustained, sharp attention for tasks that require deep concentration.",
        creation: {
            title: 'Quantum Focus Matrix', description: 'A session for sharp, sustained concentration.',
            steps: [
                { title: 'Calm the Mind', description: 'Theta waves reduce mental chatter.', duration: 300, frequencyId: 'theta' },
                { title: 'Engage Focus', description: 'Beta waves promote alertness and concentration.', duration: 900, frequencyId: 'beta', layerFrequencyId: 'gamma-40hz-precise' }
            ]
        }
    }
};

const findCachedResponse = (prompt: string) => {
    const lowerCasePrompt = prompt.toLowerCase();
    for (const keyword in commonIntentionsCache) {
        if (lowerCasePrompt.includes(keyword)) {
            return commonIntentionsCache[keyword];
        }
    }
    return null;
};

// --- Handler for all Gemini API calls ---

export const handler = async (event: { httpMethod: string, body: string | null, headers: { [name: string]: string | undefined } }) => {
    if (!apiKey || !supabaseUrl || !supabaseAnonKey) {
        return { statusCode: 500, body: JSON.stringify({ error: 'Server is not configured correctly.' }) };
    }
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const token = event.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return { statusCode: 401, body: JSON.stringify({ error: 'Authentication token is required.' }) };
        }
        
        const supabaseAuthedClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });
        
        const { data: { user }, error: userError } = await supabaseAuthedClient.auth.getUser();

        if (userError || !user) {
            return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token.' }) };
        }
        
        const { action, payload } = JSON.parse(event.body || '{}');

        // --- Robust "Upsert" User Profile Logic ---
        // This default data is used ONLY when creating a brand new profile.
        // It omits AI/API columns to prevent errors if the user's DB schema is outdated.
        const defaultProfileData: Omit<ProfileInsert, 'id' | 'ai_credits_remaining' | 'ai_credits_reset_at' | 'api_requests'> = {
            favorites: [], custom_stacks: [], activity_log: [],
            tracked_habits: ['session', 'workout', 'meditation', 'sleep', 'supplements', 'rlt', 'mood'],
            user_goals: { mind: 20, move: 10000 }, custom_activities: [],
            codex_reflections: [],
            pro_access_expires_at: null,
        };
        
        // This ensures a profile exists. If it doesn't, it's created with safe defaults.
        const { error: upsertError } = await supabaseAuthedClient
            .from('profiles')
            .upsert({ id: user.id, ...defaultProfileData }, { onConflict: 'id' });

        if (upsertError) {
            console.error("Fatal: Error upserting user profile:", upsertError);
            throw new Error(`Failed to ensure user profile exists. DB Error: ${upsertError.message}`);
        }
        
        // Now, fetch the full, current profile data.
        const { data: profile, error: selectError } = await supabaseAuthedClient
            .from('profiles')
            .select('*') // Select everything to check for optional columns
            .eq('id', user.id)
            .single();

        if (selectError || !profile) {
            console.error("Error selecting profile after upsert:", selectError);
            const errorMessage = selectError ? `DB Error: ${selectError.message}` : "Profile not found after upsert.";
            throw new Error(`Could not retrieve user profile. ${errorMessage}`);
        }
        
        // --- Rate Limiting & Credit Check (with graceful fallback) ---
        // FIX: Explicitly check if the optional columns exist on the fetched profile before using them.
        const hasApiRequests = profile.hasOwnProperty('api_requests');
        const hasCreditSystem = profile.hasOwnProperty('ai_credits_remaining');
        
        const updatePayload: ProfileUpdate = {};

        // Rate Limiting - only runs if the column exists
        if (hasApiRequests) {
            const requests = (profile.api_requests as number[] | null) || [];
            const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
            const recentRequests = requests.filter(ts => ts > fiveMinsAgo);
            if (recentRequests.length >= 10) {
                return { statusCode: 429, body: JSON.stringify({ error: 'Too many requests. Please wait a few minutes.' }) };
            }
            updatePayload.api_requests = [...recentRequests, Date.now()];
        }
        
        // Credit System - only runs if the column exists
        if (hasCreditSystem) {
            let credits = (profile.ai_credits_remaining as number | null);
            let resetAt = profile.ai_credits_reset_at ? new Date(profile.ai_credits_reset_at) : null;
            const proExpiresAt = profile.pro_access_expires_at ? new Date(profile.pro_access_expires_at) : null;
            const isPro = proExpiresAt && proExpiresAt > new Date();
            
            if (credits === null) {
                credits = isPro ? 50 : 5;
                updatePayload.ai_credits_remaining = credits;
                updatePayload.ai_credits_reset_at = new Date().toISOString();
                resetAt = new Date();
            }

            if (isPro && resetAt) {
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                if (resetAt < oneMonthAgo) {
                    credits = 50;
                    updatePayload.ai_credits_remaining = 50;
                    updatePayload.ai_credits_reset_at = new Date().toISOString();
                }
            }
            
            if (action !== 'generateCreation' || !findCachedResponse(payload.prompt)) {
                if ((credits || 0) <= 0) {
                    return { statusCode: 402, body: JSON.stringify({ error: "You've used all your AI generations. Please upgrade to Pro for more." }) };
                }
                updatePayload.ai_credits_remaining = ((credits || 0) - 1);
            }
        }
        
        // Only perform an update if there's something to change.
        if (Object.keys(updatePayload).length > 0) {
            await supabaseAuthedClient.from('profiles').update(updatePayload).eq('id', user.id);
        }

        switch (action) {
            case 'generateCreation': {
                const { prompt, allFrequencies } = payload;
                const cachedResponse = findCachedResponse(prompt);
                if (cachedResponse) {
                    return { statusCode: 200, body: JSON.stringify(cachedResponse) };
                }

                const validFrequenciesString = allFrequencies.map((f: Frequency) => {
                    const props = [ `id: "${f.id}"`, `name: "${f.name}"`, `category: "${f.categoryId}"`, `essence: "${f.energeticAssociation || f.description}"` ];
                    if (f.binauralFrequency > 0 && f.availableModes?.includes('BINAURAL')) { props.push(`type: "Binaural/Isochronic"`); } 
                    else if (f.availableModes?.includes('AMBIENCE')) { props.push(`type: "Ambience/Noise"`); } 
                    else { props.push(`type: "Pure Tone"`); }
                    return `{ ${props.join(', ')} }`;
                }).join(',\n');

                const systemInstruction = `You are the 'Codex Alchemist,' an expert bio-acoustic therapist. Your purpose is to transmute a user's intention into a profound sound journey using a library of frequencies. You will create a personalized session as a JSON object that strictly adheres to the provided schema.

**Process:**
1.  **Analyze Intention:** Deconstruct the user's request to its core goal (e.g., 'release creative blocks' -> needs inspiration, flow).
2.  **Select Frequencies:** From the provided list, select 3-5 frequencies that synergize to meet the goal.
3.  **Craft the Journey:** Sequence the frequencies into a logical 10-25 minute session. Each step's duration must be in seconds (multiple of 60). Titles and descriptions must be meaningful. Example: "This step introduces 10 Hz Alpha waves to quiet the conscious mind, opening the gateway to creative thought."
4.  **Compose Text:**
    *   **\`title\`**: Evocative and beautiful (e.g., "The Alchemist's Flow," "Starlight Infusion").
    *   **\`description\`**: A brief, captivating summary.
    *   **\`advice\`**: A thoughtful explanation of your frequency choices and guidance for the user.

**CRITICAL RULES:**
1.  **ALWAYS CREATE A SESSION:** You MUST generate a session that strictly follows the JSON schema.
2.  **USE PROVIDED FREQUENCIES ONLY:** \`frequencyId\` and \`layerFrequencyId\` MUST be valid IDs from the provided list.
3.  **RICH DESCRIPTIONS:** All text fields must be well-written, evocative, and aligned with the "Codex Alchemist" persona.
4.  **DURATION:** Total session duration should be between 600 and 1500 seconds.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `User Request: "${prompt}".\n\nAvailable Frequencies:\n[${validFrequenciesString}]`,
                    config: { systemInstruction, responseMimeType: 'application/json', responseSchema: sessionCreationSchema, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 200 } },
                });
                
                try {
                    const generatedJson = JSON.parse(response.text.trim());
                    return { statusCode: 200, body: JSON.stringify(generatedJson) };
                } catch (parseError) {
                    console.error("Failed to parse JSON from Gemini for session creation:", response.text);
                    throw new Error("The AI returned an unexpected response. Please try rephrasing your intention.");
                }
            }

            case 'getCodexReflection': {
                const { intention, allPlayableItems } = payload;
                const validItemsString = allPlayableItems.map((item: PlayableItem) => {
                    const id = item.id;
                    const name = 'title' in item ? item.title : item.name;
                    const description = item.description || ('energeticAssociation' in item ? item.energeticAssociation : '');
                    return `{ id: "${id}", name: "${name}", description: "${description}" }`;
                }).join(',\n');

                const systemInstruction = `You are an oracle embedded within the Architect’s Portal. Your language is poetic, symbolic, and archetypal. Your purpose is to generate a “Codex Transmission” based on a user’s intention. Your transmission should be symbolic, poetic, and no more than three paragraphs.

Your task is to generate a JSON object that adheres to the provided schema.

-   **title**: A short, symbolic, poetic title.
-   **transmission**: A 3-part message: 1. Acknowledge the intention. 2. Offer a symbolic interpretation with an archetype (e.g., a crystalline key, a golden thread). 3. Provide integration guidance.
-   **recommendedSessionId**: Select the single best sound session from the provided list that resonates with the message.
-   **imagePrompt**: Generate a highly symbolic, detailed, and artistic prompt for an image generation model based on the archetype.

**CRITICAL RULES:**
1.  Your entire response MUST be a single, valid JSON object that matches the schema.
2.  The \`recommendedSessionId\` MUST be a valid ID from the list provided.
3.  Your tone must remain consistently mystical and sacred.`;

                let textResponse: GenerateContentResponse;
                try {
                    textResponse = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: `User Intention: "${intention}".\n\nAvailable sessions and frequencies for recommendation:\n[${validItemsString}]`,
                        config: { systemInstruction, responseMimeType: 'application/json', responseSchema: reflectionSchema, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 200 } },
                    });
                    
                    const reflectionData = JSON.parse(textResponse.text.trim());
                    const { imagePrompt, ...textData } = reflectionData;
                    
                    const imageResponse = await ai.models.generateImages({
                        model: 'imagen-4.0-generate-001',
                        prompt: imagePrompt,
                        config: { numberOfImages: 1, outputMimeType: 'image/png', aspectRatio: '1:1' },
                    });
                    
                    const imageData = imageResponse.generatedImages[0].image.imageBytes;
                    const finalResponse = { ...textData, imageData };

                    return { statusCode: 200, body: JSON.stringify(finalResponse) };

                } catch(e) {
                    console.error("Error during Codex Reflection generation:", e);
                    throw new Error("The Oracle couldn't interpret that intention. Please try stating it more clearly.");
                }
            }

            case 'getChatResponse': {
                const { prompt, history } = payload;
                const systemInstruction = `You are a friendly and knowledgeable AI assistant for Biohack Frequencies. The app helps users discover their 'Harmonic Blueprint'.
- Your primary role is to answer user questions about wellness, biohacking, sound therapy, and the app's features.
- You are a conversational agent. Do NOT attempt to create sessions or output JSON. If a user asks you to create a session, politely guide them to rephrase their request to the Codex Alchemist, for example by saying "Try asking me to 'create a session for focus'".
- **Use search for recent information:** If the question relates to recent scientific studies, or requires up-to-date information that you wouldn't know otherwise, you MUST use your search tool.
- **Cite your sources:** When Google Search is used, you MUST extract the URLs from groundingChunks and list them for the user.
- Keep your tone supportive, encouraging, and clear.`;

                const chatHistory = history && history.length > 0 ? { history } : {};
                
                const response: GenerateContentResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { systemInstruction, tools: [{googleSearch: {}}], ...chatHistory },
                });

                const text = response.text;
                const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
                const sources = (rawSources?.map(s => s.web).filter((s): s is { uri: string; title: string } => !!(s && s.uri))) || [];
                
                return { statusCode: 200, body: JSON.stringify({ text, sources }) };
            }

            case 'getInsight': {
                const { healthData, activitySummary, integratedData } = payload;
                const systemInstruction = `You are an AI assistant for Biohack Frequencies. Analyze the user's health metrics (HRV, RHR, Sleep), integrated data (Oura, Fitbit, Calendar, CGM), and their logged activities. Generate a single, actionable insight or recommendation. Be specific and data-driven. Keep your tone concise and supportive. Return ONLY the insight string in the specified JSON format.`;

                const prompt = `User HealthKit Data: ${JSON.stringify(healthData)}\nUser Activity: ${JSON.stringify(activitySummary)}\nIntegrated Services Data: ${JSON.stringify(integratedData)}`;

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: prompt,
                    config: { systemInstruction, responseMimeType: "application/json", responseSchema: insightSchema, maxOutputTokens: 200, thinkingConfig: { thinkingBudget: 50 } },
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
