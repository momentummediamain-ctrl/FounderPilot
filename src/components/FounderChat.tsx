import React, { useState, useRef, useEffect } from 'react';
import { Agent, AgentId, ChatMessage } from '../types';
import {
  Send,
  Sparkles,
  MessageSquare,
  Users,
  CheckCircle2,
  Lock,
  Loader2,
  ArrowUpRight,
  Compass,
  Sliders
} from 'lucide-react';

interface FounderChatProps {
  agents: Agent[];
  chatHistory: ChatMessage[];
  onSendMessage: (
    text: string,
    agentId: AgentId,
    collaborators: AgentId[],
    validationOptions?: {
      validationStep: 'probe' | 'synthesize';
      originalIdea: string;
    }
  ) => Promise<void>;
  onTriggerBlueprint: (idea: string) => Promise<void>;
  onStageChatActionForApproval: (msg: ChatMessage) => void;
  onNavigateTab: (tab: string) => void;
  businessIdea: string;
  businessName: string;
  businessOffer: string;
  activeRulesCount: number;
}

const ROLE_SUGGESTIONS: Record<AgentId, string[]> = {
  ceo: [
    'Define our high-margin B2B beachhead wedge and 90-day GTM sequence.',
    'Identify how we beat Zapier and Jasper on unit economics.'
  ],
  product: [
    'Structure feature entitlements across $29 Starter, $79 Growth Pro, and $249 Agency tiers.',
    'Design a 60-second activation loop for early adopters.'
  ],
  website: [
    'Rewrite our above-the-fold Hero headline to emphasize 10-minute setup vs. $5k retainers.',
    'Draft 3 high-converting FAQ answers addressing security and billing.'
  ],
  marketing: [
    'Write a 3-second TikTok hook anchored on $4,200/mo saved in agency retainers.',
    'Draft a 2-step outbound founder case-study email sequence.'
  ],
  sales: [
    'Create a high-ticket outbound script for agencies upgrading to the $249/mo plan.',
    'Map our Stripe test-to-paid checkout conversion funnel.'
  ],
  support: [
    'Draft a 60-minute SLA response macro for enterprise API & billing inquiries.',
    'Build a proactive onboarding check-in message for new trial accounts.'
  ],
  finance: [
    'Calculate our CAC payback period and gross margin at $79/mo Growth Pro.',
    'Audit our $25/mo AI token cost cap per workspace.'
  ],
  operations: [
    'Verify multi-tenant isolation and SHA-256 task execution receipt coverage.',
    'Prepare our pre-launch DNS, webhook, and rollback checklist.'
  ]
};

export default function FounderChat({
  agents,
  chatHistory,
  onSendMessage,
  onTriggerBlueprint,
  onStageChatActionForApproval,
  onNavigateTab,
  businessIdea,
  businessName,
  businessOffer,
  activeRulesCount
}: FounderChatProps) {
  const [chatMode, setChatMode] = useState<'specialist' | 'squad' | 'validate_idea'>('specialist');
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('ceo');
  const [selectedSquadIds, setSelectedSquadIds] = useState<AgentId[]>(['ceo', 'website', 'marketing']);
  const [input, setInput] = useState('');
  const [ideaToValidate, setIdeaToValidate] = useState(
    businessIdea || 'Autonomous AI workflow & billing copilot for solo SaaS founders and boutique digital agencies'
  );
  const [validationStage, setValidationStage] = useState<'idle' | 'awaiting_answers' | 'completed'>('idle');
  const [loading, setLoading] = useState(false);
  const [blueprintLoading, setBlueprintLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const toggleSquadMember = (id: AgentId) => {
    setSelectedSquadIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  // Start Step 1 of Idea Validation: AI asks 2-3 probing questions on uniqueness, market demand & feasibility
  const handleStartIdeaValidation = async () => {
    if (!ideaToValidate.trim() || loading) return;
    setChatMode('validate_idea');
    setLoading(true);
    try {
      await onSendMessage(
        `Validate my business idea: "${ideaToValidate}"`,
        'ceo',
        ['ceo', 'product'],
        {
          validationStep: 'probe',
          originalIdea: ideaToValidate
        }
      );
      setValidationStage('awaiting_answers');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const textToSend = input;
    setInput('');
    setLoading(true);

    try {
      if (chatMode === 'validate_idea') {
        if (validationStage === 'awaiting_answers') {
          await onSendMessage(textToSend, 'ceo', ['ceo', 'product'], {
            validationStep: 'synthesize',
            originalIdea: ideaToValidate
          });
          setValidationStage('completed');
        } else {
          setIdeaToValidate(textToSend);
          await onSendMessage(textToSend, 'ceo', ['ceo', 'product'], {
            validationStep: 'probe',
            originalIdea: textToSend
          });
          setValidationStage('awaiting_answers');
        }
      } else {
        const collaborators = chatMode === 'squad' ? selectedSquadIds : [selectedAgentId];
        const primaryId = chatMode === 'squad' ? selectedSquadIds[0] : selectedAgentId;
        await onSendMessage(textToSend, primaryId, collaborators);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (text: string) => {
    setInput('');
    setLoading(true);
    try {
      if (chatMode === 'validate_idea' && validationStage === 'awaiting_answers') {
        await onSendMessage(text, 'ceo', ['ceo', 'product'], {
          validationStep: 'synthesize',
          originalIdea: ideaToValidate
        });
        setValidationStage('completed');
      } else {
        const collaborators = chatMode === 'squad' ? selectedSquadIds : [selectedAgentId];
        const primaryId = chatMode === 'squad' ? selectedSquadIds[0] : selectedAgentId;
        await onSendMessage(text, primaryId, collaborators);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectValidatedConcept = async (chosenIdea: string) => {
    setBlueprintLoading(true);
    try {
      await onTriggerBlueprint(chosenIdea);
    } finally {
      setBlueprintLoading(false);
    }
  };

  const currentSuggestions = ROLE_SUGGESTIONS[selectedAgentId] || ROLE_SUGGESTIONS.ceo;

  return (
    <div className="flex flex-col h-[calc(100vh-115px)] max-w-5xl animate-fade-in">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-zinc-800 shrink-0">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>Shared Venture Context Active</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{activeRulesCount} Fine-Tuning Rules</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">Idea Validator + 8 Specialists</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Founder Command Chat & Idea Validation Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Validate your business idea with targeted probing questions & alternative concept pivots, chat 1-on-1 with any specialist, or run a collaborative squad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex bg-zinc-900 p-1 border border-zinc-800">
            <button
              type="button"
              onClick={() => setChatMode('validate_idea')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                chatMode === 'validate_idea'
                  ? 'bg-orange-500 text-black font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Idea Validation Flow</span>
            </button>
            <button
              type="button"
              onClick={() => setChatMode('specialist')}
              className={`px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                chatMode === 'specialist'
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              1-on-1 Specialist
            </button>
            <button
              type="button"
              onClick={() => setChatMode('squad')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                chatMode === 'squad'
                  ? 'bg-orange-500 text-black font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Squad ({selectedSquadIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Sub-Header: Either Idea Validation Bar OR 8-Agent Selector Bar */}
      {chatMode === 'validate_idea' ? (
        <div className="py-3 border-b border-zinc-800 shrink-0 bg-zinc-900/60 px-4 my-2 border space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-orange-500" />
              <span>
                2-Step Idea Validation Protocol (Uniqueness · Market Demand · Feasibility → Refined Idea or Alternative Pivot)
              </span>
            </div>
            <span className="text-[11px] font-mono text-orange-400">
              {validationStage === 'idle'
                ? 'STEP 1: DESCRIBE IDEA'
                : validationStage === 'awaiting_answers'
                ? 'STEP 2: ANSWER 3 PROBING QUESTIONS'
                : 'STEP 3: SELECT CONCEPT & GENERATE PLAN'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={ideaToValidate}
              onChange={(e) => setIdeaToValidate(e.target.value)}
              placeholder="Describe your business idea to probe uniqueness, demand, and feasibility..."
              className="flex-1 px-3.5 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700"
            />
            <button
              type="button"
              onClick={handleStartIdeaValidation}
              disabled={loading || !ideaToValidate.trim()}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer shrink-0 whitespace-nowrap disabled:opacity-50"
            >
              {validationStage === 'idle' ? 'Start Idea Validation (Ask 3 Questions)' : 'Re-Probe Idea'}
            </button>
          </div>
        </div>
      ) : (
        <div className="py-3 border-b border-zinc-800 shrink-0 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-zinc-400">
            <span>
              {chatMode === 'squad'
                ? 'Select 2 or more AI specialists to collaborate on your next command:'
                : `Active Specialist: ${activeAgent?.name} · ${activeAgent?.role}`}
            </span>
            {activeAgent?.customSkillFocus && chatMode === 'specialist' && (
              <span className="font-mono text-orange-400 flex items-center gap-1 truncate max-w-md">
                <Sliders className="w-3 h-3 shrink-0" />
                <span>Custom Skill Focus: &ldquo;{activeAgent.customSkillFocus}&rdquo;</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
            {agents.map((ag) => {
              const isSelected =
                chatMode === 'squad'
                  ? selectedSquadIds.includes(ag.id)
                  : selectedAgentId === ag.id;

              return (
                <button
                  key={ag.id}
                  type="button"
                  onClick={() => {
                    if (chatMode === 'squad') {
                      toggleSquadMember(ag.id);
                    } else {
                      setSelectedAgentId(ag.id);
                    }
                  }}
                  className={`p-2 text-left border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-orange-500/60 text-zinc-100'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm">{ag.avatar}</span>
                    <span className="text-[9px] font-mono uppercase text-orange-400">
                      {ag.id}
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="text-[11px] font-semibold truncate">{ag.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{ag.role.split(' ')[0]}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto py-4 pr-2 space-y-4 scrollbar-thin">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-orange-500">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-2 max-w-lg">
              <h3 className="text-sm font-semibold text-zinc-100">
                {chatMode === 'validate_idea'
                  ? 'Stress-Test & Validate Your Business Idea Before Generating a Plan'
                  : chatMode === 'squad'
                  ? `Collaborative Squad Ready (${selectedSquadIds.map((id) => id.toUpperCase()).join(' + ')})`
                  : `Direct Specialist Channel: ${activeAgent?.name}`}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {chatMode === 'validate_idea'
                  ? 'Click "Start Idea Validation" above. Sarah Chen (CEO) and Marcus Vance (Product) will ask 3 targeted questions probing uniqueness, market demand, and feasibility, then offer a Refined Original Idea and an Alternative Business Concept.'
                  : `Active Skill Directive: "${activeAgent?.customSkillFocus || 'Standard Role Charter'}". Ask a question below—any asset changes are logged and staged for Owner approval.`}
              </p>
            </div>
          </div>
        ) : (
          chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            const valMeta = msg.validationMetadata;
            return (
              <div
                key={msg.id}
                className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-[88%] px-4 py-3.5 text-xs leading-relaxed border space-y-3 ${
                    isUser
                      ? 'bg-zinc-900 text-zinc-100 border-zinc-700'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-[11px] ${
                          isUser ? 'text-orange-400' : 'text-zinc-200'
                        }`}
                      >
                        {isUser ? 'Founder (You)' : msg.agentName || 'AI Specialist'}
                      </span>
                      {!isUser && msg.collaborators && msg.collaborators.length > 1 && (
                        <span className="text-[10px] font-mono text-orange-400">
                          · Collaborative Squad ({msg.collaborators.join(', ')})
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Interactive Decision Cards when Idea Validation Step 2 Synthesis is Returned */}
                  {!isUser && valMeta?.step === 'synthesis_and_pivot' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 block">
                            OPTION A · REFINED ORIGINAL IDEA
                          </span>
                          <p className="text-xs text-zinc-200 leading-relaxed">
                            {valMeta.refinedOriginalIdea}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={blueprintLoading}
                          onClick={() =>
                            handleSelectValidatedConcept(
                              valMeta.refinedOriginalIdea || valMeta.originalIdea
                            )
                          }
                          className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition cursor-pointer"
                        >
                          {blueprintLoading
                            ? 'Generating Plan...'
                            : 'Lock Refined Idea & Generate Plan →'}
                        </button>
                      </div>

                      <div className="p-3.5 bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-orange-400 block">
                            OPTION B · ALTERNATIVE BUSINESS CONCEPT
                          </span>
                          <p className="text-xs text-zinc-200 leading-relaxed">
                            {valMeta.alternativeConcept}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={blueprintLoading}
                          onClick={() =>
                            handleSelectValidatedConcept(
                              valMeta.alternativeConcept || valMeta.originalIdea
                            )
                          }
                          className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-black font-semibold text-xs transition cursor-pointer"
                        >
                          {blueprintLoading
                            ? 'Generating Plan...'
                            : 'Pivot to Alternative & Generate Plan →'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Quick-Answer Chip when Probing Questions are Asked */}
                  {!isUser && valMeta?.step === 'probing_questions' && (
                    <div className="pt-2 border-t border-zinc-800 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-orange-400 block">
                        Quick-Fill Validation Answers (Or type your own below):
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(
                            '1. Uniqueness: We replace 5 fragmented tools with 1 closed-loop multi-agent workspace. 2. Demand: Solo SaaS founders & 1-10 person agencies willing to pay $79/mo today. 3. Feasibility: Day-1 self-serve blueprint, landing page, and Stripe checkout generator.'
                          )
                        }
                        className="w-full p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-left text-[11px] text-zinc-200 transition cursor-pointer"
                      >
                        Submit Sample Answers: &ldquo;1. Replaces 5 tools with closed-loop tuning · 2. Solo founders & agencies @ $79/mo · 3. Day-1 self-serve generator&rdquo; →
                      </button>
                    </div>
                  )}

                  {/* Action Staging & Approval Controls on Agent Responses */}
                  {!isUser && (
                    <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                        <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>
                          Target Asset: {(msg.targetAsset || 'blueprint').toUpperCase()} · Owner Approval Required
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {msg.queuedTaskId ? (
                          <button
                            type="button"
                            onClick={() => onNavigateTab('tasks')}
                            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Staged in Task Queue (View)</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onStageChatActionForApproval(msg)}
                            className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 text-[11px] font-semibold transition cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 text-orange-500" />
                            <span>Stage Asset Update & Queue for Owner Approval</span>
                          </button>
                        )}

                        {msg.targetAsset && msg.targetAsset !== 'tasks' && (
                          <button
                            type="button"
                            onClick={() => onNavigateTab(msg.targetAsset!)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-[11px] font-mono cursor-pointer"
                          >
                            <span>Open {msg.targetAsset}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-950 text-zinc-400 border border-zinc-800 px-4 py-3 text-xs flex items-center space-x-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
              <span>
                {chatMode === 'validate_idea'
                  ? 'Sarah Chen (CEO) & Marcus Vance (Product) are running Idea Validation analysis...'
                  : chatMode === 'squad'
                  ? `Collaborative Squad (${selectedSquadIds.join(' + ')}) is synthesizing recommendations...`
                  : `${activeAgent?.name} is formulating a role-specific response...`}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Role-Specific Quick Prompts */}
      <div className="py-2.5 border-t border-zinc-800 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono uppercase text-zinc-500">
            {chatMode === 'validate_idea'
              ? 'Validation Shortcuts:'
              : chatMode === 'squad'
              ? 'Squad Prompts:'
              : `Ask ${activeAgent?.name.split(' ')[0]}:`}
          </span>
          {chatMode === 'validate_idea' ? (
            <>
              <button
                type="button"
                onClick={handleStartIdeaValidation}
                disabled={loading}
                className="text-[11px] px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-orange-400 hover:text-zinc-100 hover:border-zinc-700 transition cursor-pointer"
              >
                1. Probe Uniqueness, Demand & Feasibility (3 Questions)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSuggestionClick(
                    'Our wedge is closed-loop agent fine-tuning for solo SaaS founders ($79/mo) with a 10-minute self-serve MVP.'
                  )
                }
                disabled={loading}
                className="text-[11px] px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition cursor-pointer"
              >
                2. Submit Answers & Generate Alternative Concept Pivot
              </button>
            </>
          ) : (
            currentSuggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                disabled={loading}
                className="text-[11px] px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition text-left cursor-pointer"
              >
                {s}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="pt-2.5 border-t border-zinc-800 flex items-center space-x-2.5 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            chatMode === 'validate_idea'
              ? validationStage === 'awaiting_answers'
                ? 'Type your answers to the 3 validation questions to receive Refined & Alternative concepts...'
                : 'Describe your business idea to begin the 2-step validation flow...'
              : chatMode === 'squad'
              ? `Assign a collaborative task to ${selectedSquadIds.map((id) => id.toUpperCase()).join(' + ')}...`
              : `Ask ${activeAgent?.name} (${activeAgent?.role}) to draft or update ${businessName} assets...`
          }
          className="flex-1 px-4 py-3 bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-4 py-3 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition disabled:opacity-40 flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{chatMode === 'validate_idea' && validationStage === 'awaiting_answers' ? 'Submit Answers' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
}
