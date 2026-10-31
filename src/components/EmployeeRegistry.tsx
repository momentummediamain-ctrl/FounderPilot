import React, { useState, useEffect } from 'react';
import { Agent, AgentId } from '../types';
import {
  Play,
  Cpu,
  Check,
  Loader2,
  Sliders,
  ArrowRightLeft,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface EmployeeRegistryProps {
  agents: Agent[];
  onTriggerAgentJob: (agentId: AgentId, jobType: string) => Promise<void>;
  onUpdateAgentSkillFocus?: (agentId: AgentId, customSkillFocus: string) => void;
  businessName: string;
}

const SKILL_FOCUS_EXAMPLES: Record<AgentId, string[]> = {
  ceo: [
    'Prioritize capital-efficient B2B wedges with <30-day payback',
    'Focus on high-ticket agency retainers ($249+/mo) over low-price consumer tiers'
  ],
  product: [
    'Prioritize features for early adopters and 60-second self-serve onboarding',
    'Design usage-based expansion triggers for power users'
  ],
  website: [
    'Anchor hero copy on 10-minute setup speed vs. $5,000/mo agencies',
    'Prioritize technical B2B social proof and security compliance FAQs'
  ],
  marketing: [
    'Focus on TikTok organic growth and 3-second scroll-stop hooks',
    'Prioritize founder build-in-public LinkedIn & cold email sequences'
  ],
  sales: [
    'Optimize 1-click self-serve Stripe checkout and annual plan upsells',
    'Focus on high-converting enterprise pilot-to-paid conversion scripts'
  ],
  support: [
    'Resolve technical onboarding blockers in <5 minutes with step-by-step macros',
    'Proactively identify upsell opportunities inside billing support tickets'
  ],
  finance: [
    'Audit LTV:CAC (>4:1 target) and strictly isolate sandbox demo data from live revenue',
    'Optimize gross margin by keeping AI token spend under $0.25 per active user'
  ],
  operations: [
    'Prioritize critical revenue-unblocking tasks with SHA-256 receipt verification',
    'Enforce zero-downtime deployment preflight checks before every release'
  ]
};

export default function EmployeeRegistry({
  agents,
  onTriggerAgentJob,
  onUpdateAgentSkillFocus,
  businessName
}: EmployeeRegistryProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('ceo');
  const [runningJob, setRunningJob] = useState(false);
  const [jobSuccess, setJobSuccess] = useState(false);
  const [skillSavedBanner, setSkillSavedBanner] = useState<string | null>(null);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const [skillInput, setSkillInput] = useState(selectedAgent.customSkillFocus || '');

  useEffect(() => {
    setSkillInput(selectedAgent.customSkillFocus || '');
    setSkillSavedBanner(null);
  }, [selectedAgentId, selectedAgent.customSkillFocus]);

  const agentJobs: Record<AgentId, { label: string; jobType: string; description: string }[]> = {
    ceo: [
      {
        label: 'Coordinate Roadmap & Market Wedge Alignment',
        jobType: 'align_roadmap',
        description: 'Validate TAM/SAM/SOM wedge and synchronize 90-day strategic goals across all 8 departments.'
      }
    ],
    product: [
      {
        label: 'Architect 3-Tier Feature & Entitlement Packaging',
        jobType: 'pro_packaging',
        description: 'Define Starter ($29), Growth Pro ($79), and Agency ($249) deliverables for Stripe & Website.'
      }
    ],
    website: [
      {
        label: 'Compile Conversion Hero Copy & SEO Head Tags',
        jobType: 'seo_audit',
        description: 'Optimize landing page headings, pricing comparison table, and technical SEO metadata.'
      }
    ],
    marketing: [
      {
        label: 'Generate Viral TikTok Hooks & Launch Email Sequence',
        jobType: 'email_campaign',
        description: 'Draft scroll-stopping short-form video scripts and Resend lifecycle onboarding emails.'
      }
    ],
    sales: [
      {
        label: 'Provision Mock Stripe Products & Checkout Funnel',
        jobType: 'sandbox_payment',
        description: 'Create test-mode product SKUs, price IDs, and subscription checkout webhook handlers.'
      }
    ],
    support: [
      {
        label: 'Synthesize SLA Support Macros & Onboarding FAQ',
        jobType: 'faq_center',
        description: 'Compile rapid-response customer support templates and technical troubleshooting guides.'
      }
    ],
    finance: [
      {
        label: 'Audit Unit Economics & Verified vs. Sandbox Ledger',
        jobType: 'finance_projections',
        description: 'Reconcile MRR/CAC payback metrics and verify quarantine of simulated sandbox revenue.'
      }
    ],
    operations: [
      {
        label: 'Run Dependency Queue & Pre-Flight Security Audit',
        jobType: 'preflight_deploy',
        description: 'Verify task dependency order, tenant isolation boundaries, and SHA-256 execution receipts.'
      }
    ]
  };

  const handleSaveSkillFocus = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!onUpdateAgentSkillFocus) return;
    onUpdateAgentSkillFocus(selectedAgent.id, skillInput.trim());
    setSkillSavedBanner(
      `${selectedAgent.name} acknowledged your custom skill focus: "${skillInput.trim() || 'Default role charter'}". All future tasks, chat responses, and generated assets will incorporate this directive.`
    );
  };

  const handleRunJob = async (jobType: string) => {
    if (runningJob) return;
    setRunningJob(true);
    setJobSuccess(false);

    try {
      await onTriggerAgentJob(selectedAgentId, jobType);
      setJobSuccess(true);
      setTimeout(() => setJobSuccess(false), 6000);
    } finally {
      setRunningJob(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-zinc-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-orange-400 mb-1">
            8-Specialist Organizational Charter · Skill Customization · Inter-Agent Handoffs
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            AI Employee Registry & Skill Customization Lab
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Inspect non-overlapping role boundaries, configure custom domain expertise for each specialist, and dispatch autonomous jobs into the prioritized Task Queue.
          </p>
        </div>
        <div className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 shrink-0">
          Active Roster: <span className="text-emerald-400 font-semibold">8 / 8 Specialists</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 8-Agent Roster */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider block">
            Select Specialist Employee (8)
          </span>
          <div className="space-y-1.5">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full flex items-center justify-between p-3 border text-left transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-orange-500/60 text-zinc-100'
                      : 'bg-zinc-950 hover:bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xl shrink-0">{agent.avatar}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight text-zinc-100">{agent.name}</p>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{agent.role}</p>
                      {agent.customSkillFocus && (
                        <p className="text-[10px] font-mono text-orange-400 truncate mt-1">
                          Focus: {agent.customSkillFocus}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'thinking' || agent.status === 'working'
                          ? 'bg-orange-500 animate-pulse'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-zinc-400">
                      {agent.status === 'thinking' ? 'THINK' : agent.status === 'working' ? 'RUN' : 'READY'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Skill Customization, Role Charter & Job Dispatcher */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Skill Customization Feature */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4 gap-4">
              <div className="flex items-center space-x-3.5">
                <span className="text-3xl p-2 bg-zinc-950 border border-zinc-800 shrink-0">
                  {selectedAgent.avatar}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-100">{selectedAgent.name}</h3>
                    <span className="text-[11px] font-mono text-orange-400 uppercase">
                      ID: {selectedAgent.id}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">{selectedAgent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 shrink-0">
                <Sliders className="w-3.5 h-3.5" />
                <span>SKILL CUSTOMIZATION ACTIVE</span>
              </div>
            </div>

            <form onSubmit={handleSaveSkillFocus} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                  <span>Custom Skill & Expertise Instructions for {selectedAgent.name}</span>
                </label>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Injected into task generation & outputs
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Specify the exact domain expertise, channel focus, or customer segment you want {selectedAgent.name} to prioritize (e.g., <em>&ldquo;focus on TikTok organic growth&rdquo;</em> or <em>&ldquo;prioritize features for early adopters&rdquo;</em>).
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder={`e.g., ${SKILL_FOCUS_EXAMPLES[selectedAgent.id]?.[0] || 'Focus on high-converting B2B workflows'}`}
                  className="flex-1 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer shrink-0 whitespace-nowrap"
                >
                  Save Skill Focus
                </button>
              </div>

              {/* Preset Quick-Fill Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500">Presets:</span>
                {(SKILL_FOCUS_EXAMPLES[selectedAgent.id] || []).map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSkillInput(preset);
                      onUpdateAgentSkillFocus?.(selectedAgent.id, preset);
                      setSkillSavedBanner(
                        `${selectedAgent.name} acknowledged your custom skill focus: "${preset}".`
                      );
                    }}
                    className="text-[11px] px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition cursor-pointer text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </form>

            {skillSavedBanner && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{skillSavedBanner}</span>
              </div>
            )}
          </div>

          {/* 2. Non-Overlapping Role Charter & Inter-Agent Interaction Protocol */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Role Charter · Non-Overlapping Scope · Collaboration Protocol
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Zero Role Overlap</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-orange-400 block">
                  Primary Objective
                </span>
                <p className="text-zinc-200 leading-relaxed">
                  {selectedAgent.coreObjective || selectedAgent.bio}
                </p>
              </div>

              <div className="p-3.5 bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-emerald-400 block">
                  Non-Overlapping Scope Boundary
                </span>
                <p className="text-zinc-300 leading-relaxed">
                  {selectedAgent.nonOverlappingScope}
                </p>
              </div>
            </div>

            {selectedAgent.deliverables && (
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">
                  Owned Deliverables & Artifacts
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedAgent.deliverables.map((item, idx) => (
                    <div key={idx} className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-200 font-medium">
                      ✓ {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedAgent.agentHandoffs && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Upstream Input From
                  </span>
                  <p className="text-zinc-200 font-medium">{selectedAgent.agentHandoffs.receivesFrom}</p>
                </div>
                <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    Downstream Handoff To
                  </span>
                  <p className="text-zinc-200 font-medium">{selectedAgent.agentHandoffs.passesTo}</p>
                </div>
                <div className="p-3 bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-orange-400 block">
                    Shared Handoff Artifact
                  </span>
                  <p className="text-zinc-200 font-medium">{selectedAgent.agentHandoffs.handoffArtifact}</p>
                </div>
              </div>
            )}

            {selectedAgent.founderInteractionProtocol && (
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 flex items-start gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-200">Founder Interaction & Approval Protocol: </span>
                  <span className="text-zinc-400">{selectedAgent.founderInteractionProtocol}</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Dispatch Autonomous Specialist Job */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-orange-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Dispatch Autonomous Specialist Job (Incorporates Custom Skill Focus)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Routes to Prioritized Task Queue
              </span>
            </div>

            {jobSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {selectedAgent.name} acknowledged your custom skill focus (&ldquo;{selectedAgent.customSkillFocus}&rdquo;) and staged a new prioritized task in the Task Approval Queue!
                </span>
              </div>
            )}

            {!businessName ? (
              <p className="text-xs text-zinc-500">
                Define your business inside Founder Chat or Business Blueprint first to enable autonomous work.
              </p>
            ) : (
              <div className="space-y-3">
                {agentJobs[selectedAgent.id]?.map((job, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-zinc-100">{job.label}</div>
                      <p className="text-zinc-400 leading-relaxed">{job.description}</p>
                      {selectedAgent.customSkillFocus && (
                        <p className="text-[11px] font-mono text-orange-400">
                          Active Skill Directive: &ldquo;{selectedAgent.customSkillFocus}&rdquo;
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRunJob(job.jobType)}
                      disabled={runningJob}
                      className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-400 text-black font-semibold text-xs transition-all duration-150 disabled:opacity-40 cursor-pointer shrink-0 whitespace-nowrap"
                    >
                      {runningJob ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                          <span>Running with Skill Focus...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Dispatch Specialist Job</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
