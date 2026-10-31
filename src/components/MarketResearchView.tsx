import React, { useState } from 'react';
import { MarketResearchReport, AgentFeedback } from '../types';
import AgentFeedbackWidget from './AgentFeedbackWidget';
import {
  Compass,
  Sparkles,
  TrendingUp,
  Target,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Loader2,
  FileText
} from 'lucide-react';

interface MarketResearchViewProps {
  report: MarketResearchReport;
  businessIdea: string;
  businessName: string;
  onGenerateResearch: (idea: string) => Promise<void>;
  onSyncToBlueprint: (idea: string) => Promise<void>;
  feedbackList: AgentFeedback[];
  onAddFeedback: (feedback: Omit<AgentFeedback, 'id' | 'createdAt' | 'appliedCount'>) => void;
  onOpenTuningLab: () => void;
}

const SAMPLE_IDEAS = [
  'Autonomous AI workflow & billing copilot for solo SaaS founders and boutique digital agencies',
  'Automated tax compliance & real-time receipt reconciliation agent for freelance creators',
  'B2B customer churn prediction and automated win-back outreach platform for Stripe SaaS apps',
  'Vertical AI patient intake, insurance verification, and follow-up scheduler for independent dental clinics'
];

export default function MarketResearchView({
  report,
  businessIdea,
  businessName,
  onGenerateResearch,
  onSyncToBlueprint,
  feedbackList,
  onAddFeedback,
  onOpenTuningLab
}: MarketResearchViewProps) {
  const [ideaInput, setIdeaInput] = useState<string>(businessIdea || report.idea || SAMPLE_IDEAS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncingBlueprint, setSyncingBlueprint] = useState<boolean>(false);

  const handleRunResearch = async (overrideIdea?: string) => {
    const targetIdea = (overrideIdea ?? ideaInput).trim();
    if (!targetIdea) return;
    if (overrideIdea) setIdeaInput(overrideIdea);
    setLoading(true);
    try {
      await onGenerateResearch(targetIdea);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncBlueprint = async () => {
    const targetIdea = ideaInput.trim() || report.idea;
    if (!targetIdea) return;
    setSyncingBlueprint(true);
    try {
      await onSyncToBlueprint(targetIdea);
    } finally {
      setSyncingBlueprint(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>CEO Agent Sarah Chen</span>
            <span>·</span>
            <span>Strategic Intelligence Division</span>
            <span>·</span>
            <span className="font-mono tabular-nums">Updated {report.generatedAt}</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            CEO Market Research & Competitive Intelligence
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Quantify TAM/SAM/SOM market size, benchmark key competitors&#39; strengths and weaknesses, and isolate high-margin market gaps.
          </p>
        </div>

        <button
          onClick={handleSyncBlueprint}
          disabled={syncingBlueprint}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-100 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
        >
          {syncingBlueprint ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
              <span>Compiling Blueprint...</span>
            </>
          ) : (
            <>
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <span>Generate Blueprint from Findings</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </>
          )}
        </button>
      </div>

      {/* Business Idea Research Input Panel */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-semibold text-zinc-300">
            Target Business Idea for CEO Market Analysis
          </label>
          <span className="text-[11px] text-zinc-500">
            Active Venture: <span className="text-zinc-300 font-medium">{businessName || report.businessName}</span>
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            placeholder="Describe your business idea (e.g., AI bookkeeping & tax automation for solo e-commerce founders)..."
            className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
          />
          <button
            onClick={() => handleRunResearch()}
            disabled={loading || !ideaInput.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Sarah CEO Researching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Run CEO Market Research</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Idea Quick-Loaders */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] text-zinc-500 block">
            Or test with a sample venture thesis:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_IDEAS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleRunResearch(sample)}
                disabled={loading}
                className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-400 hover:text-zinc-200 transition text-left cursor-pointer truncate max-w-xs"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 1: Concise Executive Report Summary */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-500 shrink-0" />
            <h3 className="text-sm font-semibold text-zinc-100">01. Executive Market Summary</h3>
          </div>
          <span className="text-xs text-zinc-500">Prepared by Sarah Chen · Chief Executive Officer</span>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed">
          {report.executiveSummary}
        </p>
      </div>

      {/* Section 2: Target Market Size (TAM / SAM / SOM / CAGR) */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
            <h3 className="text-sm font-semibold text-zinc-100">02. Target Market Size & Growth Trajectory</h3>
          </div>
          <span className="text-xs font-mono tabular-nums text-orange-400">
            Projected Growth: {report.marketSize.cagr}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1.5">
            <div className="text-xs text-zinc-500">Total Addressable Market (TAM)</div>
            <div className="text-sm font-semibold text-zinc-100 font-mono tabular-nums leading-snug">
              {report.marketSize.tam}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1.5">
            <div className="text-xs text-zinc-500">Serviceable Addressable Market (SAM)</div>
            <div className="text-sm font-semibold text-zinc-100 font-mono tabular-nums leading-snug">
              {report.marketSize.sam}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1.5">
            <div className="text-xs text-zinc-500">Serviceable Obtainable Market (SOM)</div>
            <div className="text-sm font-semibold text-orange-400 font-mono tabular-nums leading-snug">
              {report.marketSize.som}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
          <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1">
            <span className="text-zinc-500 font-medium">Primary Target Customer Segment</span>
            <p className="text-zinc-300 leading-relaxed">{report.marketSize.targetSegment}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-1">
            <span className="text-zinc-500 font-medium">Sizing Methodology</span>
            <p className="text-zinc-300 leading-relaxed">{report.marketSize.methodology}</p>
          </div>
        </div>
      </div>

      {/* Section 3: Key Competitors, Strengths & Weaknesses */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0" />
            <h3 className="text-sm font-semibold text-zinc-100">03. Key Competitors: Strengths & Weaknesses Matrix</h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono tabular-nums">
            {report.competitors.length} Direct & Indirect Alternatives
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {report.competitors.map((comp, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-800 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-3 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-100">{comp.name}</h4>
                    <span className="text-xs font-mono tabular-nums text-zinc-400">{comp.marketShare}</span>
                  </div>
                  <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <span>{comp.category}</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums text-zinc-300">{comp.pricing}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-400">Core Strengths</div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {comp.strengths.map((s, sIdx) => (
                      <li key={sIdx} className="leading-relaxed">
                        + {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-amber-400">Exploitable Weaknesses</div>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    {comp.weaknesses.map((w, wIdx) => (
                      <li key={wIdx} className="leading-relaxed">
                        − {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Market Gaps & Strategic Wedges */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500 shrink-0" />
            <h3 className="text-sm font-semibold text-zinc-100">04. Unmet Market Gaps & Strategic Wedges</h3>
          </div>
          <span className="text-xs text-zinc-500">High-Leverage Entry Opportunities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.marketGaps.map((gap, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-800 p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono tabular-nums text-orange-400 font-semibold">
                    Gap 0{idx + 1} · {gap.opportunityScore}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-100">{gap.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{gap.description}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-300 block">Recommended Product Wedge:</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{gap.strategicWedge}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: 30-60-90 Day CEO Action Plan */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
            <h3 className="text-sm font-semibold text-zinc-100">05. Concise CEO Action Roadmap</h3>
          </div>
          <span className="text-xs text-zinc-500">90-Day Execution Sequence</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.strategicRecommendations.map((rec, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-800 p-4 space-y-2">
              <div className="text-xs font-semibold text-orange-400 font-mono tabular-nums">{rec.phase}</div>
              <p className="text-xs text-zinc-200 leading-relaxed">{rec.action}</p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400">
                <span className="text-zinc-500">Target Impact: </span>
                <span className="font-mono tabular-nums text-zinc-300">{rec.expectedImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inline Feedback & Fine-Tuning Widget for CEO Sarah Chen */}
      <AgentFeedbackWidget
        agentId="ceo"
        agentName="Sarah Chen (CEO)"
        outputType="market_research"
        outputSummary={`Market Research Report for "${report.idea.slice(0, 45)}..."`}
        feedbackList={feedbackList}
        onAddFeedback={onAddFeedback}
        onRegenerateWithFeedback={() => handleRunResearch(ideaInput)}
        onOpenTuningLab={onOpenTuningLab}
      />
    </div>
  );
}
