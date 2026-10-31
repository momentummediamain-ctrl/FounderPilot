import React, { useState } from 'react';
import { Agent, AgentId, AgentFeedback, FeedbackOutputType } from '../types';
import {
  Sliders,
  Star,
  Sparkles,
  Check,
  Trash2,
  ArrowRight,
  RefreshCw,
  MessageSquarePlus
} from 'lucide-react';

interface FeedbackTuningViewProps {
  agents: Agent[];
  feedbackList: AgentFeedback[];
  onAddFeedback: (feedback: Omit<AgentFeedback, 'id' | 'createdAt' | 'appliedCount'>) => void;
  onToggleFeedbackActive: (id: string) => void;
  onDeleteFeedback: (id: string) => void;
  onRegenerateMarketingWithRule: (ruleComment: string, extractedRule: string, rating: number) => Promise<void>;
  onNavigateTab: (tab: string) => void;
}

interface MarketingEvolutionExample {
  id: string;
  title: string;
  channel: string;
  initialOutput: {
    label: string;
    content: string;
    weakness: string;
  };
  founderFeedback: {
    rating: number;
    comment: string;
    synthesizedDirective: string;
  };
  improvedOutput: {
    label: string;
    content: string;
    measurableLift: string;
  };
}

const MARKETING_EVOLUTION_EXAMPLES: MarketingEvolutionExample[] = [
  {
    id: 'ex_tiktok',
    title: 'Example 01 · TikTok Viral Hook & Script Evolution',
    channel: 'Short-Form Video (Rohan Joshi · CMO)',
    initialOutput: {
      label: 'Campaign v1 (Before Founder Feedback)',
      content:
        'Hook: "Want to grow your business faster with AI? 🚀"\nBody: "Our platform has 8 awesome AI agents that help you build websites and write social posts effortlessly so you can relax!"\nCTA: "Sign up at the link in bio today!"',
      weakness: 'Generic consumer buzzwords, no quantified proof, sounds like every other AI wrapper.'
    },
    founderFeedback: {
      rating: 3,
      comment:
        'Too generic and hype-heavy. Lead the first 3 seconds with exact dollar savings ($4,200/mo agency retainer replaced), show a live screen walkthrough, and remove emojis.',
      synthesizedDirective:
        'Anchor all video hooks with concrete dollar/time savings ($4,200/mo saved, 18-hour launch), structure body around live screen proof, and ban generic hype emojis.'
    },
    improvedOutput: {
      label: 'Campaign v2 (Fine-Tuned Next Generation)',
      content:
        'Hook: "We cut $4,200/mo in agency retainers and launched our entire B2B funnel in 18 hours—here is the raw screen breakdown."\nBody: "Watch my terminal: Step 1, Sarah CEO calculates our bottom-up SAM/SOM wedge. Step 2, Evelyn deploys our Stripe-wired landing page. Step 3, checkout conversion hits 3.9% in 48 hours."\nCTA: "Comment BLUEPRINT or use the bio link to clone this exact 8-agent workspace."',
      measurableLift: '+178% Scroll-Hold Rate (from 19% to 52.8%) · 3.9% Bio-Link CTR'
    }
  },
  {
    id: 'ex_email',
    title: 'Example 02 · Cold & Onboarding Email Sequence Evolution',
    channel: 'Lifecycle & Outbound Email (Rohan Joshi · CMO)',
    initialOutput: {
      label: 'Campaign v1 (Before Founder Feedback)',
      content:
        'Subject: "Welcome to our revolutionary AI platform!"\nBody: "Dear Valued Customer, We are thrilled to welcome you to the future of work. Over the next 7 days we will send you comprehensive guides on how our state-of-the-art features work..."',
      weakness: 'Corporate newsletter tone; 4 paragraphs of fluff before any actionable value.'
    },
    founderFeedback: {
      rating: 2,
      comment:
        'Rewrite as a 3-sentence plain-text founder note under 60 words. Put the hours saved in the subject line and end with a 1-word reply trigger.',
      synthesizedDirective:
        'Constrain all email sequences to <60 words in plain-text founder style, feature "hours/week saved" in the subject line, and end with a single-word reply CTA.'
    },
    improvedOutput: {
      label: 'Campaign v2 (Fine-Tuned Next Generation)',
      content:
        'Subject: "[Case Study] How solo founders save 22.5 hrs/wk on GTM"\nBody: "Most solo operators lose $3,500/mo stitching together Webflow, Stripe, and copywriters manually. We pre-wired 8 specialized AI employees so you can deploy your blueprint, landing page, and checkout in 10 minutes.\n\nReply DEMO if you want the raw ROI benchmark sheet."',
      measurableLift: '48.4% Open Rate · 11.2% Positive Reply Rate (vs. 1.8% baseline)'
    }
  },
  {
    id: 'ex_ads',
    title: 'Example 03 · Paid Retargeting Ad Copy & Positioning Evolution',
    channel: 'Paid Acquisition Ads (Rohan Joshi · CMO)',
    initialOutput: {
      label: 'Campaign v1 (Before Founder Feedback)',
      content:
        'Headline: "Automate 90% of Your Business Launch"\nCopy: "Stop getting stuck on copy and design. Use our all-in-one platform to launch faster."\nTargeting: "General entrepreneurs aged 22–50"',
      weakness: 'Broad targeting and vague promise lead to high CPC and low-intent clicks.'
    },
    founderFeedback: {
      rating: 3,
      comment:
        'Call out the pain of paying $5,000/mo retainers vs. a flat $79/mo Growth Pro tier, and narrow targeting strictly to bootstrapped SaaS founders and micro-agencies ($5k–$50k MRR).',
      synthesizedDirective:
        'Contrast flat $79/mo Growth Pro pricing directly against $5,000/mo human retainers and restrict ad targeting to bootstrapped B2B SaaS & micro-agencies ($5k–$50k MRR).'
    },
    improvedOutput: {
      label: 'Campaign v2 (Fine-Tuned Next Generation)',
      content:
        'Headline: "Replace $5,000/mo Agency Retainers With an $79/mo AI Executive Team"\nCopy: "Built for bootstrapped SaaS & micro-agencies ($5k–$50k MRR). Get CEO market research, Stripe-ready landing copy, and 7-day social scripts with human-in-the-loop approval."\nTargeting: "Bootstrapped B2B SaaS Founders & Micro-Agency Owners ($5k–$50k MRR)"',
      measurableLift: '-44% Customer Acquisition Cost ($34 CAC) · 24-Day Payback Window'
    }
  }
];

export default function FeedbackTuningView({
  agents,
  feedbackList,
  onAddFeedback,
  onToggleFeedbackActive,
  onDeleteFeedback,
  onRegenerateMarketingWithRule,
  onNavigateTab
}: FeedbackTuningViewProps) {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('all');
  const [selectedExampleId, setSelectedExampleId] = useState<string>('ex_tiktok');
  const [applyingExampleId, setApplyingExampleId] = useState<string | null>(null);
  const [appliedBanner, setAppliedBanner] = useState<string>('');

  // Custom feedback form state
  const [targetAgentId, setTargetAgentId] = useState<AgentId>('marketing');
  const [targetOutputType, setTargetOutputType] = useState<FeedbackOutputType>('marketing_campaign');
  const [rating, setRating] = useState<number>(4);
  const [comment, setComment] = useState<string>('');
  const [extractedRule, setExtractedRule] = useState<string>('');

  const filteredFeedback =
    selectedAgentFilter === 'all'
      ? feedbackList
      : feedbackList.filter((f) => f.agentId === selectedAgentFilter);

  const activeExample =
    MARKETING_EVOLUTION_EXAMPLES.find((ex) => ex.id === selectedExampleId) ||
    MARKETING_EVOLUTION_EXAMPLES[0];

  const averageRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((acc, item) => acc + item.rating, 0) / feedbackList.length).toFixed(1)
      : '5.0';

  const activeRulesCount = feedbackList.filter((f) => f.active).length;

  const handleCreateCustomFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const agentObj = agents.find((a) => a.id === targetAgentId);
    const agentLabel = agentObj ? `${agentObj.name} (${agentObj.role})` : targetAgentId.toUpperCase();
    const sentiment: AgentFeedback['sentiment'] =
      rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'constructive';

    const finalRule =
      extractedRule.trim() ||
      `Founder Directive (${rating}/5★): ${comment.trim()}`;

    onAddFeedback({
      agentId: targetAgentId,
      agentName: agentLabel,
      outputType: targetOutputType,
      outputSummary: `Manual Fine-Tuning Directive (${targetOutputType.replace('_', ' ')})`,
      rating,
      sentiment,
      comment: comment.trim(),
      extractedRule: finalRule,
      active: true
    });

    setComment('');
    setExtractedRule('');
    setAppliedBanner(`New fine-tuning directive saved for ${agentLabel}. Future generations will obey this rule.`);
    setTimeout(() => setAppliedBanner(''), 4500);
  };

  const handleApplyMarketingExample = async (ex: MarketingEvolutionExample) => {
    setApplyingExampleId(ex.id);
    try {
      await onRegenerateMarketingWithRule(
        ex.founderFeedback.comment,
        ex.founderFeedback.synthesizedDirective,
        ex.founderFeedback.rating
      );
      setAppliedBanner(
        `Applied "${ex.title}" rule to CMO Rohan Joshi and regenerated your live Marketing Campaign.`
      );
    } finally {
      setApplyingExampleId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>Reinforcement Fine-Tuning Engine</span>
            <span>·</span>
            <span className="font-mono tabular-nums">{activeRulesCount} Active Prompt Rules</span>
            <span>·</span>
            <span className="font-mono tabular-nums">Avg Agent Rating: {averageRating} / 5.0</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            AI Employee Feedback & Fine-Tuning Lab
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Rate and critique outputs from CEO, Marketing, Website, and Support agents. Stored feedback is synthesized into persistent rules that fine-tune subsequent responses.
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-zinc-500">Total Stored Feedback Entries</span>
          <div className="text-xl font-bold text-zinc-100 font-mono tabular-nums">
            {feedbackList.length} Reviews
          </div>
          <span className="text-[11px] text-zinc-400">Persisted in workspace memory</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-zinc-500">Active Fine-Tuning Directives</span>
          <div className="text-xl font-bold text-orange-400 font-mono tabular-nums">
            {activeRulesCount} Live Rules
          </div>
          <span className="text-[11px] text-zinc-400">Injected into Gemini system prompts</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-1">
          <span className="text-xs text-zinc-500">Mean Output Quality Score</span>
          <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">
            {averageRating} / 5.0 ★
          </div>
          <span className="text-[11px] text-zinc-400">Across 8 specialized AI employees</span>
        </div>
      </div>

      {appliedBanner && (
        <div className="p-4 bg-zinc-900 border border-orange-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-zinc-100">
            <Check className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{appliedBanner}</span>
          </div>
          <button
            onClick={() => onNavigateTab('marketing')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Inspect Updated Marketing Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Section 1: Concrete Examples of How Marketing Campaign Feedback Improves the Next Campaign */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              01. How Marketing Campaign Feedback Fine-Tunes the Next Iteration
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select a real-world campaign scenario below to inspect the initial output, the founder&#39;s rating & critique, the synthesized prompt rule, and the resulting v2 output.
            </p>
          </div>
        </div>

        {/* Scenario Selector Tabs */}
        <div className="flex flex-wrap gap-2">
          {MARKETING_EVOLUTION_EXAMPLES.map((ex) => {
            const isSelected = ex.id === selectedExampleId;
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExampleId(ex.id)}
                className={`px-3.5 py-2 text-xs font-semibold border transition cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-zinc-950 text-orange-400 border-orange-500/50'
                    : 'bg-zinc-950/50 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {ex.title}
              </button>
            );
          })}
        </div>

        {/* Before -> Feedback -> After Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Column 1: Initial Output (v1) */}
          <div className="bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-semibold text-zinc-400">{activeExample.initialOutput.label}</span>
                <span className="text-[11px] font-mono text-zinc-500">Baseline Prompt</span>
              </div>
              <pre className="text-xs text-zinc-300 font-mono whitespace-pre-line leading-relaxed">
                {activeExample.initialOutput.content}
              </pre>
            </div>
            <div className="pt-3 border-t border-zinc-800 text-xs text-amber-400">
              <span className="font-semibold">Diagnosed Weakness: </span>
              <span className="text-zinc-400">{activeExample.initialOutput.weakness}</span>
            </div>
          </div>

          {/* Column 2: Founder Rating + Comment + Synthesized Prompt Rule */}
          <div className="bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-semibold text-orange-400">Founder Feedback & Rule Synthesis</span>
                <span className="text-xs font-mono tabular-nums text-orange-400">
                  {activeExample.founderFeedback.rating}.0 / 5.0 ★
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 font-medium">Founder Critique Comment:</span>
                <p className="text-xs text-zinc-200 leading-relaxed bg-zinc-900 p-3 border border-zinc-800">
                  &#34;{activeExample.founderFeedback.comment}&#34;
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-zinc-500 font-medium">
                  Extracted System Prompt Directive (Injected into Agent):
                </span>
                <p className="text-xs font-mono text-emerald-400 leading-relaxed bg-zinc-900 p-3 border border-zinc-800">
                  {activeExample.founderFeedback.synthesizedDirective}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleApplyMarketingExample(activeExample)}
              disabled={applyingExampleId === activeExample.id}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer whitespace-nowrap"
            >
              {applyingExampleId === activeExample.id ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fine-Tuning Live Campaign...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Rule & Regenerate Live Campaign</span>
                </>
              )}
            </button>
          </div>

          {/* Column 3: Fine-Tuned Output (v2) */}
          <div className="bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-semibold text-emerald-400">{activeExample.improvedOutput.label}</span>
                <span className="text-[11px] font-mono text-emerald-400">Fine-Tuned</span>
              </div>
              <pre className="text-xs text-zinc-100 font-mono whitespace-pre-line leading-relaxed">
                {activeExample.improvedOutput.content}
              </pre>
            </div>
            <div className="pt-3 border-t border-zinc-800 text-xs">
              <span className="font-semibold text-emerald-400">Measured Outcome Lift: </span>
              <span className="font-mono tabular-nums text-zinc-300">{activeExample.improvedOutput.measurableLift}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Log New Agent Feedback & Manage Stored Fine-Tuning Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Submit Feedback / Directive for Any Agent */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <MessageSquarePlus className="w-4 h-4 text-orange-500 shrink-0" />
            <h3 className="text-sm font-semibold text-zinc-100">02. Submit Agent Rating & Fine-Tuning Directive</h3>
          </div>

          <form onSubmit={handleCreateCustomFeedback} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Target AI Employee</label>
              <select
                value={targetAgentId}
                onChange={(e) => setTargetAgentId(e.target.value as AgentId)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Deliverable / Output Category</label>
              <select
                value={targetOutputType}
                onChange={(e) => setTargetOutputType(e.target.value as FeedbackOutputType)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none"
              >
                <option value="marketing_campaign">Marketing Campaign (TikTok, Email, Ads)</option>
                <option value="market_research">CEO Market Research & Competitor Report</option>
                <option value="blueprint">Business Blueprint & Pricing Tiers</option>
                <option value="website_copy">Website Landing Page & SEO Copy</option>
                <option value="support_reply">Customer Support Ticket Replies</option>
                <option value="ceo_chat">CEO Co-Founder Advisory Chat</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Output Quality Rating (1–5 Stars)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        s <= rating ? 'fill-orange-500 text-orange-500' : 'text-zinc-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="font-mono tabular-nums text-zinc-300 ml-2">{rating}.0 / 5.0</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">Founder Critique & Comment</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What should this AI employee improve on the next generation?"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium block">
                Synthesized Prompt Rule (Optional Override)
              </label>
              <input
                type="text"
                value={extractedRule}
                onChange={(e) => setExtractedRule(e.target.value)}
                placeholder="Auto-extracted from comment if left blank..."
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={!comment.trim()}
              className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-400 text-black font-semibold transition disabled:opacity-40 cursor-pointer"
            >
              Store Feedback & Activate Prompt Rule
            </button>
          </form>
        </div>

        {/* Right List: Stored Feedback & Active Fine-Tuning Memory */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-orange-500 shrink-0" />
              <h3 className="text-sm font-semibold text-zinc-100">
                03. Stored Feedback & Active Prompt Memory ({filteredFeedback.length})
              </h3>
            </div>

            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: 'All Agents' },
                { id: 'ceo', label: 'CEO' },
                { id: 'marketing', label: 'Marketing' },
                { id: 'website', label: 'Website' },
                { id: 'support', label: 'Support' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAgentFilter(tab.id)}
                  className={`px-2.5 py-1 text-[11px] font-medium border transition cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedAgentFilter === tab.id
                      ? 'bg-zinc-950 text-zinc-100 border-zinc-700'
                      : 'bg-zinc-950/40 text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {filteredFeedback.length === 0 ? (
            <div className="p-8 bg-zinc-950 border border-zinc-800 text-center space-y-2">
              <p className="text-xs text-zinc-400">No feedback entries recorded for this agent filter yet.</p>
              <p className="text-[11px] text-zinc-500">
                Use the form on the left or rate any output directly inside Market Research, Blueprint, or Marketing Hub.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {filteredFeedback.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-950 border border-zinc-800 p-4 space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <span className="font-semibold text-zinc-100">{item.agentName}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-400">{item.outputSummary}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums text-orange-400 font-semibold">
                        {item.rating}.0 / 5.0 ★
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-mono tabular-nums text-zinc-500">{item.createdAt}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-500">Founder Comment:</span>
                    <p className="text-zinc-300 leading-relaxed">&#34;{item.comment}&#34;</p>
                  </div>

                  <div className="p-3 bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-emerald-400">
                        Synthesized Fine-Tuning Directive
                      </span>
                      <span className="font-mono tabular-nums text-zinc-500">
                        Injected {item.appliedCount}x
                      </span>
                    </div>
                    <p className="font-mono text-zinc-200 leading-relaxed">{item.extractedRule}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onToggleFeedbackActive(item.id)}
                      className={`px-2.5 py-1 text-[11px] font-medium border transition cursor-pointer ${
                        item.active
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                      }`}
                    >
                      {item.active ? 'Rule Active in Agent Prompt' : 'Rule Paused (Click to Enable)'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteFeedback(item.id)}
                      className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-red-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
