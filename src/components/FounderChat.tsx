import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Sparkles, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';

interface FounderChatProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onTriggerBlueprint: (idea: string) => Promise<void>;
  businessIdea: string;
}

export default function FounderChat({
  chatHistory,
  onSendMessage,
  onTriggerBlueprint,
  businessIdea
}: FounderChatProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [blueprintLoading, setBlueprintLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const textToSend = input;
    setInput('');
    setLoading(true);

    try {
      await onSendMessage(textToSend);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (text: string) => {
    setInput('');
    setLoading(true);
    try {
      await onSendMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const handleBlueprintTrigger = async () => {
    if (!businessIdea) return;
    setBlueprintLoading(true);
    try {
      await onTriggerBlueprint(businessIdea);
    } finally {
      setBlueprintLoading(false);
    }
  };

  const suggestions = [
    'Define premium high-ticket upsells for our pro tier.',
    'Draft a search engine marketing strategy.',
    'Write a TikTok video hook to drive bio link traffic.',
    'Draft a cold email sequence targeting small agencies.'
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl animate-fade-in">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase flex items-center space-x-2">
            <span>Co-Founder Brainstorming</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Real-time strategic consulting with Sarah, your Chief Executive Officer Agent.
          </p>
        </div>

        {/* Blueprint Quick Button if we have an idea but no fully finalized blueprint yet */}
        {businessIdea && (
          <button
            onClick={handleBlueprintTrigger}
            disabled={blueprintLoading}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-none bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition-all duration-150 disabled:opacity-50 cursor-pointer"
          >
            {blueprintLoading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                <span>Assembling Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Assemble Business Blueprint</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto py-6 pr-2 space-y-4 scrollbar-thin">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500 shadow-md shadow-zinc-950">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">Start Your Business Venture</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Describe your business idea in detail below. What do you want to build? Who are you selling to? 
                Your AI CEO Sarah will instantly begin mapping out pricing structures, offers, and calendars.
              </p>
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[80%] rounded-none px-4 py-3 text-xs leading-relaxed border ${
                    isUser
                      ? 'bg-zinc-900/60 text-zinc-100 border-zinc-800 border-l-2 border-l-orange-500 shadow-sm'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-850'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5 border-b border-zinc-800/60 pb-1">
                    <span className={`font-black text-[9px] uppercase tracking-wider ${isUser ? 'text-orange-500' : 'text-zinc-400'}`}>
                      {isUser ? 'Founder (You)' : 'AI CEO Sarah'}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            );
          })
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-950 text-zinc-400 border border-zinc-800 rounded-none px-4 py-3 text-xs flex items-center space-x-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
              <span>Sarah is formulating response...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions Tray */}
      {chatHistory.length > 0 && !loading && (
        <div className="py-3 border-t border-zinc-800 shrink-0">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 block mb-2">
            Ask Sarah CEO
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(s)}
                className="text-[10px] px-3 py-1.5 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-150 text-left cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSend} className="pt-3 border-t border-zinc-800 flex items-center space-x-3 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            chatHistory.length === 0
              ? "e.g., A subscription newsletter delivering curated AI tools and workflows for solo agencies..."
              : "Ask Sarah a question or guide the strategy..."
          }
          className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-medium text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 rounded-none bg-orange-500 hover:bg-orange-400 text-black transition-all duration-150 disabled:opacity-40 shadow-sm flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
