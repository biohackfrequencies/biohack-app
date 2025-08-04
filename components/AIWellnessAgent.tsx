import React, { useState, useRef, useEffect } from 'react';
import { getAiChatResponse, AiChatResponse, generateAiCreation } from '../services/geminiService';
import { OracleIcon, SparklesIcon, PlayIcon } from './BohoIcons';
import LoadingSpinner from './LoadingSpinner';
import { CustomStack, Frequency } from '../types';
import { ProBadge } from './ProBadge';

type Message = {
    role: 'user' | 'model';
    text: string;
    sources?: AiChatResponse['sources'];
    session?: CustomStack;
};

interface AIWellnessAgentProps {
    isSubscribed: boolean;
    allFrequencies: Frequency[];
    onPlayAiSession: (session: CustomStack) => void;
}

const SessionCard: React.FC<{ session: CustomStack, onPlay: () => void }> = ({ session, onPlay }) => (
    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-dark-border">
        <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/30">
            <div className="flex items-center gap-2 mb-1">
                <SparklesIcon className="w-5 h-5 text-brand-gold"/>
                <h4 className="font-bold text-slate-800 dark:text-dark-text-primary">AI-Generated Session</h4>
            </div>
            <p className="font-semibold text-amber-800 dark:text-amber-300">{session.title}</p>
            <p className="text-xs text-slate-600 dark:text-dark-text-secondary mt-1 line-clamp-2">{session.description}</p>
            <button onClick={onPlay} className="w-full flex items-center justify-center gap-2 mt-3 py-2 bg-brand-gold text-white font-semibold rounded-lg transition-all hover:brightness-90 hover:scale-105">
                <PlayIcon className="w-5 h-5"/>
                Play Session
            </button>
        </div>
    </div>
);


export const AIWellnessAgent: React.FC<AIWellnessAgentProps> = ({ isSubscribed, allFrequencies, onPlayAiSession }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !isSubscribed) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);
        
        const isSessionRequest = /create|make|generate|build/i.test(input) && /session|protocol|stack|journey/i.test(input);

        try {
            if(isSessionRequest) {
                const response = await generateAiCreation(input, allFrequencies);
                const sessionData = response.creation;
                const newSession: CustomStack = {
                    id: `ai-stack-${Date.now()}`,
                    title: sessionData.title,
                    description: sessionData.description,
                    steps: sessionData.steps,
                    colors: { primary: '#fed7aa', secondary: '#fb923c', accent: '#C18D52' },
                    categoryId: 'guided',
                    advice: response.advice,
                };
                setMessages(prev => [...prev, { role: 'model', text: response.advice, session: newSession }]);
            } else {
                const historyForApi = messages.map(m => ({
                    role: m.role,
                    parts: [{ text: m.text }]
                }));
                const response = await getAiChatResponse(input, historyForApi);
                setMessages(prev => [...prev, { role: 'model', text: response.text, sources: response.sources }]);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section
            className="relative group p-6 rounded-3xl shadow-lg transition-all duration-300
            bg-gradient-to-br from-[#EEE8B2]/40 to-[#96CDB0]/40 dark:bg-gradient-to-br dark:from-dark-surface/80 dark:to-dark-bg/80
            hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-[0_8px_30px_-5px_var(--glow-color)]
            dark:border dark:border-brand-gold/50"
            style={{'--glow-color': '#C18D5240'} as React.CSSProperties}
        >
            <div className="absolute inset-0 bg-transparent dark:group-hover:bg-black/20 transition-colors duration-300 rounded-3xl"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <OracleIcon className="w-10 h-10 text-slate-800 dark:text-brand-gold" />
                        <div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-dark-text-primary">AI Wellness Agent</h3>
                            <p className="text-sm text-slate-700 dark:text-dark-text-secondary">Your personal bio-advisor. Ask me anything!</p>
                        </div>
                    </div>
                    {!isSubscribed && <ProBadge onClick={() => window.location.hash = '#/pricing'} />}
                </div>
                <div className="h-80 bg-black/5 dark:bg-dark-bg/50 rounded-lg border border-black/10 dark:border-dark-border overflow-y-auto p-4 space-y-4 flex flex-col">
                    {isSubscribed ? (
                        <>
                            <div className="flex-grow space-y-4">
                                {messages.length === 0 && (
                                    <div className="flex items-center justify-center h-full text-slate-700 dark:text-dark-text-secondary text-center">
                                        <p>Ask a question, or try:<br/>"Create a 15-minute session for focus."</p>
                                    </div>
                                )}
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-gold text-white' : 'bg-white dark:bg-dark-surface text-slate-800 dark:text-dark-text-primary shadow'}`}>
                                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                            {msg.session && <SessionCard session={msg.session} onPlay={() => onPlayAiSession(msg.session!)} />}
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-dark-border">
                                                    <p className="text-xs font-bold text-slate-500 dark:text-dark-text-muted mb-1">Sources:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {msg.sources.map((source, i) => (
                                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" key={i} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-dark-text-secondary dark:hover:bg-slate-500 px-2 py-1 rounded-full truncate">
                                                                {source.title || new URL(source.uri).hostname}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex items-start">
                                        <div className="max-w-md p-3 rounded-2xl bg-white dark:bg-dark-surface shadow flex items-center gap-2">
                                            <LoadingSpinner className="w-4 h-4"/>
                                            <p className="text-sm text-slate-500 dark:text-dark-text-muted animate-pulse">Thinking...</p>
                                        </div>
                                    </div>
                                )}
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                                        <strong>Error:</strong> {error}
                                    </div>
                                )}
                            </div>
                            <div ref={messagesEndRef} />
                        </>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center text-slate-700 dark:text-dark-text-secondary">
                            <OracleIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-2"/>
                            <p className="font-semibold">Unlock unlimited chat with your personal bio-advisor.</p>
                            <p className="text-xs">Ask questions and create custom sessions.</p>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSend} className="mt-4 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={isSubscribed ? "Ask your co-pilot..." : "Pro feature"}
                        className="flex-grow p-3 rounded-full border-2 border-black/10 dark:border-dark-border bg-black/5 dark:bg-dark-bg/50 text-slate-800 dark:text-dark-text-primary placeholder-slate-600 dark:placeholder-dark-text-muted focus:ring-2 focus:ring-brand-gold focus:border-brand-gold transition disabled:opacity-50"
                        disabled={isLoading || !isSubscribed}
                    />
                    <button type="submit" disabled={isLoading || !input.trim() || !isSubscribed} className="px-6 py-3 bg-brand-gold text-white font-bold rounded-full shadow-lg hover:bg-yellow-600 transition disabled:bg-slate-400 dark:disabled:bg-slate-600">
                        Send
                    </button>
                </form>
            </div>
        </section>
    );
};