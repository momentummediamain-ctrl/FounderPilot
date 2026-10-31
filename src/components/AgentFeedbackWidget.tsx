import React, { useState } from 'react';
import { AgentId, AgentFeedback, FeedbackOutputType } from '../types';
import { Star, Sliders, Check, RefreshCw, Sparkles } from 'lucide-react';

interface AgentFeedbackWidgetProps {
  agentId: AgentId;
  agentName: string;
  outputType: FeedbackOutputType;
  outputSummary: string;
  feedbackList: AgentFeedback[];
  onAddFeedback: (feedback: Omit<AgentFeedback, 'id' | 'createdAt' | 'appliedCount'>) => void;
  onRegenerateWithFeedback?: () => Promise<void>;
  onOpenTuningLab?: () => void;
}

const PRESET_SUGGESTIONS: Record<FeedbackOutputType, { label: string; comment: string; rule: string }[]> = {
  marketing_campaign: [
    {
      label: 'Add hard ROI metrics to hooks',
      comment: 'Anchor every TikTok hook and email subject with concrete dollar or time-saved metrics instead of generic hype.',
      rule: 'Lead all hooks, captions, and email subjects with quantified ROI figures ($ saved, hours cut, % conversion lift) and zero fluff.'
    },
    {
      label: 'Shift tone to B2B contrarian',
      comment: 'Make the campaign sound like a seasoned B2B founder sharing a counter-intuitive operational playbook.',
      rule: 'Use a direct, contrarian B2B founder voice focused on unit economics and live workflow proof rather than consumer promotional language.'
    },
    {
      label: 'Shorten emails to 3-sentence plain text',
      comment: 'Keep cold and onboarding emails ultra-concise (under 65 words) with a single low-friction reply CTA.',
      rule: 'Format email sequences as concise 3-sentence plain-text notes ending with a single 1-word reply trigger.'
    }
  ],
  market_research: [
    {
      label: 'Focus on bootstrapped wedges',
      comment: 'Emphasize capital-efficient bootstrapped entry wedges with sub-30-day payback over enterprise sales motions.',
      rule: 'Prioritize bootstrapped, product-led growth wedges and self-serve SMB segments with <30-day CAC payback.'
    },
    {
      label: 'Deepen competitor pricing teardown',
      comment: 'Highlight hidden usage overages and seat-tax weaknesses in incumbent pricing models.',
      rule: 'Expose competitor usage-gating and seat-multiplier pricing vulnerabilities in every competitive analysis.'
    }
  ],
  blueprint: [
    {
      label: 'High-ticket B2B packaging',
      comment: 'Structure pricing around higher-ARPU B2B and agency tiers ($79–$299/mo) with clear ROI guarantees.',
      rule: 'Position value proposition and pricing tiers around high-margin B2B outcomes ($79–$299/mo) with explicit time-saved guarantees.'
    },
    {
      label: 'Productized service angle',
      comment: 'Frame the core offer as an instant productized automation system replacing manual retainers.',
      rule: 'Frame the offer as a turnkey automation system that replaces $4,000+/mo traditional agency retainers.'
    }
  ],
  website_copy: [
    {
      label: 'Emphasize 10-minute setup speed',
      comment: 'Make the Hero Headline contrast 10-minute autonomous deployment against weeks of manual setup.',
      rule: 'Center hero headlines and subheadlines on 10-minute time-to-value versus weeks of manual configuration.'
    },
    {
      label: 'Add risk-reversal guarantee in copy',
      comment: 'Highlight risk-free sandbox testing and 30-day ROI payback in the hero and pricing copy.',
      rule: 'Include explicit risk-reversal language and 30-day ROI guarantees across landing page hero and pricing sections.'
    }
  ],
  support_reply: [
    {
      label: 'Include proactive technical solution',
      comment: 'Always provide an immediate actionable workaround plus priority onboarding link in the first reply.',
      rule: 'Provide a concrete technical resolution step in paragraph one and offer a direct onboarding walkthrough.'
    }
  ],
  ceo_chat: [
    {
      label: 'Actionable 3-step unit economics',
      comment: 'Keep CEO responses focused on unit economics (CAC, LTV, Payback) and 3 immediate execution steps.',
      rule: 'Structure CEO advisory answers into 3 numbered execution steps anchored by CAC, LTV, and payback metrics.'
    }
  ]
};

export default function AgentFeedbackWidget({
  agentId,
  agentName,
  outputType,
  outputSummary,
  feedbackList,
  onAddFeedback,
  onRegenerateWithFeedback,
  onOpenTuningLab
}: AgentFeedbackWidgetProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [customRule, setCustomRule] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [regenerating, setRegenerating] = useState<boolean>(false);

  const agentFeedback = feedbackList.filter((f) => f.agentId === agentId && f.active);
  const suggestions = PRESET_SUGGESTIONS[outputType] || PRESET_SUGGESTIONS.marketing_campaign;

  const synthesizeRuleFromComment = (rawComment: string, stars: number): string => {
    if (customRule.trim()) return customRule.trim();
    const cleaned = rawComment.trim();
    if (!cleaned) {
      return stars >= 4
        ? `Maintain current ${outputType.replace('_', ' ')} structure, quantitative depth, and executive tone.`
        : `Increase specificity, quantitative proof points, and actionable clarity in ${outputType.replace('_', ' ')}.`;
    }
    return `Founder Directive (${stars}/5★): ${cleaned}`;
  };

  const handleSelectSuggestion = (s: { label: string; comment: string; rule: string }) => {
    setComment(s.comment);
    setCustomRule(s.rule);
    if (rating === 5) setRating(4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const sentiment: AgentFeedback['sentiment'] =
      rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'constructive';

    const extractedRule = synthesizeRuleFromComment(comment, rating);

    onAddFeedback({
      agentId,
      agentName,
      outputType,
      outputSummary,
      rating,
      sentiment,
      comment: comment.trim(),
      extractedRule,
      active: true
    });

    setComment('');
    setCustomRule('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  const handleApplyAndRegenerate = async () => {
    if (comment.trim()) {
      const sentiment: AgentFeedback['sentiment'] =
        rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'constructive';
      const extractedRule = synthesizeRuleFromComment(comment, rating);

      onAddFeedback({
        agentId,
        agentName,
        outputType,
        outputSummary,
        rating,
        sentiment,
        comment: comment.trim(),
        extractedRule,
        active: true
      });
      setComment('');
      setCustomRule('');
    }

    if (onRegenerateWithFeedback) {
      setRegenerating(true);
      try {
        await onRegenerateWithFeedback();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
      } finally {
        setRegenerating(false);
      }
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
            <Sliders className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>Rate & Fine-Tune {agentName}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-400 font-mono tabular-nums">
              {agentFeedback.length} Active Fine-Tuning {agentFeedback.length === 1 ? 'Rule' : 'Rules'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Your ratings and critique comments are stored in memory and injected into {agentName}&#39;s system prompt on every future generation.
          </p>
        </div>

        {onOpenTuningLab && (
          <button
            type="button"
            onClick={onOpenTuningLab}
            className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            View Fine-Tuning Lab →
          </button>
        )}
      </div>

      {/* Active Rules Summary Strip */}
      {agentFeedback.length > 0 && (
        <div className="bg-zinc-950 border border-zinc-800 p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300">Active Learned Directives Shaping {agentName}:</span>
            <span className="font-mono tabular-nums text-zinc-500">Applied automatically</span>
          </div>
          <div className="space-y-1.5">
            {agentFeedback.slice(0, 3).map((item) => (
              <div key={item.id} className="text-[11px] text-zinc-400 flex items-start justify-between gap-3">
                <span className="font-mono text-zinc-300">• {item.extractedRule}</span>
                <span className="text-zinc-500 font-mono tabular-nums shrink-0">{item.rating}/5★</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating + Quick Tuning Presets + Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">Output Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-zinc-500 hover:text-orange-400 transition cursor-pointer"
                  aria-label={`Rate ${star} out of 5 stars`}
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= rating ? 'fill-orange-500 text-orange-500' : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-mono tabular-nums text-zinc-400 ml-1">{rating}.0 / 5.0</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 mr-1">Quick Tuning Presets:</span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 transition cursor-pointer whitespace-nowrap shrink-0"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Comment on ${agentName}'s output to fine-tune future responses (e.g., "Use concrete ROI numbers, shorten paragraphs, target B2B SaaS buyers")...`}
            className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {submitted ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Check className="w-4 h-4 shrink-0" />
              <span>Feedback stored and synthesized into {agentName}&#39;s prompt memory.</span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-500">
              Target context: <span className="text-zinc-400">{outputSummary}</span>
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!comment.trim()}
              className="px-3.5 py-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
            >
              Save Feedback Rule
            </button>

            {onRegenerateWithFeedback && (
              <button
                type="button"
                onClick={handleApplyAndRegenerate}
                disabled={regenerating}
                className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
              >
                {regenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Fine-Tuning Output...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply & Regenerate Output</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
