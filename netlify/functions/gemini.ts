import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { createClient } from '@supabase/supabase-js';
import type { Frequency, HealthDataSummary, IntegratedDataSummary, PlayableItem, ProfileUpdate, Database } from '../../types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const apiKey = process.env.API_KEY;

if (!apiKey || !supabaseUrl || !supabaseAnonKey) {
    console.error("Environment variables are not configured correctly.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });
const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!);

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
        
        const { data: { user }, error: userError } = await supabase.auth.getUser(token);
        if (userError || !user) {
            return { statusCode: 401, body: JSON.stringify({ error: 'Invalid or expired token.' }) };
        }
        
        const { action, payload } = JSON.parse(event.body || '{}');

        if (action === 'generateCreation') {
            const cachedResponse = findCachedResponse(payload.prompt);
            if (cachedResponse) {
                return { statusCode: 200, body: JSON.stringify(cachedResponse) };
            }
        }

        // --- Rate Limiting & Credit Check ---
        const { data: profile, error: profileError } = await supabase.from('profiles').select('api_requests, ai_credits_remaining, pro_access_expires_at, ai_credits_reset_at').eq('id', user.id).single();

        if (profileError) throw new Error('Could not retrieve user profile.');

        // Rate Limit Check
        const requests = profile.api_requests || [];
        const fiveMinsAgo = Date.now() - 5 * 60 * 1000;
        const recentRequests = requests.filter(ts => ts > fiveMinsAgo);
        if (recentRequests.length >= 10) {
            return { statusCode: 429, body: JSON.stringify({ error: 'Too many requests. Please wait a few minutes.' }) };
        }

        // Credit Check & Pro Logic
        let credits = profile.ai_credits_remaining ?? 0;
        let resetAt = profile.ai_credits_reset_at ? new Date(profile.ai_credits_reset_at) : new Date(0);
        const proExpiresAt = profile.pro_access_expires_at ? new Date(profile.pro_access_expires_at) : null;
        const isPro = proExpiresAt && proExpiresAt > new Date();
        const updatePayload: ProfileUpdate = {};

        if (isPro) {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            if (resetAt < oneMonthAgo) {
                credits = 50;
                updatePayload.ai_credits_remaining = 50;
                updatePayload.ai_credits_reset_at = new Date().toISOString();
            }
        }
        
        if (credits <= 0) {
            return { statusCode: 402, body: JSON.stringify({ error: "You've used all your AI generations. Please upgrade to Pro for more." }) };
        }
        
        updatePayload.ai_credits_remaining = (credits - 1);
        updatePayload.api_requests = [...recentRequests, Date.now()];
        
        await supabase.from('profiles').update(updatePayload).eq('id', user.id);
        // --- End of checks ---


        switch (action) {
            case 'generateCreation': {
                const { prompt, allFrequencies } = payload;
                const validFrequenciesString = allFrequencies.map((f: Frequency) => {
                    const props = [
                        `id: "${f.id}"`,
                        `name: "${f.name}"`,
                        `category: "${f.categoryId}"`,
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
                        maxOutputTokens: 800,
                        thinkingConfig: { thinkingBudget: 200 },
                    },
                });
                
                return { statusCode: 200, body: response.text.trim() };
            }

            case 'getCodexReflection': {
                const { intention, allPlayableItems } = payload;
                const validItemsString = allPlayableItems.map((item: PlayableItem) => {
                    const id = item.id;
                    const name = 'title' in item ? item.title : item.name;
                    const description = item.description || ('energeticAssociation' in item ? item.energeticAssociation : '');
                    return `{ id: "${id}", name: "${name}", description: "${description}" }`;
                }).join(',\n');

                const systemInstruction = `You are an oracle embedded within the Architect’s Portal — a sacred digital space. Your language is poetic, symbolic, and archetypal. Your purpose is to generate a deeply resonant “Codex Transmission” based on a user’s intention. Your transmission should be symbolic and poetic, but no more than three paragraphs.

Speak like a guide from an ancient temple who sees through time. Use themes of light, geometry, harmonic fields, inner sovereignty, remembrance, and divine blueprinting. Avoid generic advice.

Your task is to generate a JSON object that adheres to the provided schema.

- For the 'title' field, create a short, symbolic, and poetic title for the transmission.
- For the 'transmission' field, structure your response in 3 parts, flowing together as a single message:
    1. **Invocation:** A brief, poetic opening that acknowledges the user's intention.
    2. **Symbolic Message:** A multi-paragraph symbolic interpretation that introduces an archetypal object or force (e.g., a crystalline key, a golden thread, a resonant chamber).
    3. **Integration Guidance:** A concluding paragraph offering guidance on how to integrate the message's wisdom.
- For the 'recommendedSessionId' field, select the single best sound session from the provided list that resonates with the user's intention and your symbolic message.
- For the 'imagePrompt' field, generate a highly symbolic, detailed, and artistic prompt for an image generation model, based on the transmission's core archetype. Describe a visual scene with specific elements, colors, and mood. It should be evocative and non-literal. Example: 'A single, luminous key made of crystal, resting on ancient moss-covered stone, glowing with soft golden light in an ethereal forest.'

**CRITICAL RULES:**
1.  Your entire response MUST be a single, valid JSON object that matches the schema.
2.  The \`recommendedSessionId\` MUST be a valid ID from the list provided.
3.  Your tone must remain consistently mystical and sacred throughout the title and transmission.
4. The \`imagePrompt\` must be creative and visually rich.`;

                // Step 1: Generate text and image prompt
                const textResponse: GenerateContentResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `User Intention: "${intention}".\n\nHere is the list of available sessions and frequencies you must choose your recommendation from:\n[${validItemsString}]`,
                    config: {
                        systemInstruction,
                        responseMimeType: 'application/json',
                        responseSchema: reflectionSchema,
                        maxOutputTokens: 800,
                        thinkingConfig: { thinkingBudget: 200 },
                    },
                });
                
                const reflectionData = JSON.parse(textResponse.text.trim());
                const { imagePrompt, ...textData } = reflectionData;
                
                // Step 2: Generate image from the prompt
                const imageResponse = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: imagePrompt,
                    config: {
                      numberOfImages: 1,
                      outputMimeType: 'image/png',
                      aspectRatio: '1:1',
                    },
                });
                
                const imageData = imageResponse.generatedImages[0].image.imageBytes;

                const finalResponse = {
                    ...textData,
                    imageData
                };

                return { statusCode: 200, body: JSON.stringify(finalResponse) };
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
                const systemInstruction = `You are an AI assistant for Biohack Frequencies, an app that helps users discover their 'Harmonic Blueprint'. 
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
                        maxOutputTokens: 200,
                        thinkingConfig: { thinkingBudget: 50 },
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