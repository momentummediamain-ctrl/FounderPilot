import React, { useState } from 'react';
import { Agent, AgentId } from '../types';
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Compass,
  Users,
  Layers,
  Sliders,
  Play,
  Loader2
} from 'lucide-react';

interface OnboardingFlowViewProps {
  agents: Agent[];
  businessIdea: string;
  businessName: string;
  onInitializeVenture: (idea: string) => Promise<void>;
  onTriggerAgentJob: (agentId: AgentId, jobType: string) => Promise<void>;
  onNavigateTab: (tab: string) => void;
  onCompleteOnboarding: () => void;
}

const AUDIENCE_OPTIONS = [
  'Solo B2B SaaS Founders',
  'Boutique Digital Agencies (1–10 staff)',
  'Independent E-Commerce Brands',
  'Freelance Consultants & Creators'
];

const PAIN_POINT_OPTIONS = [
  'spending 20+ hrs/wk stitching together fragmented marketing and billing tools',
  'losing high-intent leads due to slow manual onboarding and follow-ups',
  'paying $4,500+/mo for agency retainers that deliver generic copy',
  'drowning in repetitive customer support and invoice reconciliation tickets'
];

const MONETIZATION_OPTIONS = [
  'a $79/mo autonomous multi-agent workspace with 30-day ROI payback',
  'a tiered SaaS subscription ($29 Starter / $99 Pro / $249 Agency)',
  'an automated productized service engine with instant Stripe checkout'
];

interface AgentRoleDetail {
  id: AgentId;
  layer: string;
  purpose: string;
  inputsConsumed: string[];
  deliverablesProduced: string[];
  sampleTaskJobType: string;
  sampleTaskLabel: string;
  workspaceTab: string;
  workspaceTabLabel: string;
}

const AGENT_ROLE_DETAILS: Record<AgentId, AgentRoleDetail> = {
  ceo: {
    id: 'ceo',
    layer: 'Layer 01 · Strategic Command Core',
    purpose:
      'Acts as your strategic co-founder. Synthesizes raw ideas into quantitative TAM/SAM/SOM market research, competitor teardowns, and the master Business Blueprint.',
    inputsConsumed: ['Founder raw business idea', 'Target audience & pain point', 'Founder feedback directives'],
    deliverablesProduced: [
      'TAM / SAM / SOM Market Size & CAGR Report',
      'Competitor Strengths & Weaknesses Matrix',
      'Master Business Blueprint & 90-Day Roadmap'
    ],
    sampleTaskJobType: 'align_roadmap',
    sampleTaskLabel: 'Dispatch CEO Roadmap Alignment Audit',
    workspaceTab: 'research',
    workspaceTabLabel: 'Open Market Research'
  },
  product: {
    id: 'product',
    layer: 'Layer 01 · Strategic Command Core',
    purpose:
      'Structures your monetization architecture. Designs Starter, Pro, and Enterprise pricing tiers, feature gating, and high-margin upsell levers.',
    inputsConsumed: ['CEO Market Gaps report', 'Competitor pricing benchmarks', 'Target customer avatar'],
    deliverablesProduced: [
      '3-Tier SaaS / Productized Service Packaging',
      'Feature Value Matrix & Pro Tier Anchoring',
      'Expansion Revenue & Upsell Hooks'
    ],
    sampleTaskJobType: 'pro_packaging',
    sampleTaskLabel: 'Dispatch Pro Tier Packaging Task',
    workspaceTab: 'blueprint',
    workspaceTabLabel: 'Open Business Blueprint'
  },
  website: {
    id: 'website',
    layer: 'Layer 02 · Revenue & Growth Engine',
    purpose:
      'Translates your value proposition into conversion-engineered landing page copy, feature grids, FAQ objection handlers, and SEO metadata.',
    inputsConsumed: ['Irresistible offer', 'Product pricing tiers', 'Website fine-tuning feedback rules'],
    deliverablesProduced: [
      'Above-the-Fold Hero Headline & Subheadline',
      'Conversion Pricing Cards & FAQ Section',
      'Search-Optimized <title> & Meta Description'
    ],
    sampleTaskJobType: 'seo_audit',
    sampleTaskLabel: 'Dispatch Landing Page SEO Audit',
    workspaceTab: 'website',
    workspaceTabLabel: 'Open Website Builder'
  },
  marketing: {
    id: 'marketing',
    layer: 'Layer 02 · Revenue & Growth Engine',
    purpose:
      'Builds multi-channel customer acquisition campaigns across TikTok scripts, Instagram/LinkedIn posts, email sequences, and paid ad directives.',
    inputsConsumed: ['Business Blueprint offer', 'Competitor weaknesses', 'Marketing feedback rules'],
    deliverablesProduced: [
      '3-Part Viral TikTok Scripts (Hook, Body, CTA)',
      'Automated Lifecycle & Cold Email Sequences',
      'Paid Retargeting Ad Copy & 5-Day Content Calendar'
    ],
    sampleTaskJobType: 'email_campaign',
    sampleTaskLabel: 'Dispatch Launch Email Sequence Task',
    workspaceTab: 'marketing',
    workspaceTabLabel: 'Open Marketing Hub'
  },
  sales: {
    id: 'sales',
    layer: 'Layer 02 · Revenue & Growth Engine',
    purpose:
      'Eliminates checkout friction. Configures Stripe payment links, webhook verification steps, and cart-abandonment recovery flows.',
    inputsConsumed: ['Marcus Product pricing tiers', 'Stripe checkout configuration'],
    deliverablesProduced: [
      'Stripe Checkout Session & Webhook Blueprint',
      'High-Ticket Sales Conversion Checklist',
      'Order & Conversion Rate Telemetry'
    ],
    sampleTaskJobType: 'sandbox_payment',
    sampleTaskLabel: 'Dispatch Stripe Sandbox Verification',
    workspaceTab: 'payments',
    workspaceTabLabel: 'Open Stripe Setup'
  },
  support: {
    id: 'support',
    layer: 'Layer 03 · Autonomous Operations & Retention',
    purpose:
      'Triages incoming customer inquiries, drafts empathetic technical responses, and maintains zero-inbox response velocity.',
    inputsConsumed: ['Live customer support tickets', 'Product FAQ knowledge base', 'Support feedback rules'],
    deliverablesProduced: [
      'Personalized Customer Ticket Replies',
      'Canned Help Center Macros',
      'Resolved Ticket Archive & CSAT Tracking'
    ],
    sampleTaskJobType: 'faq_center',
    sampleTaskLabel: 'Dispatch Support Macro Compilation',
    workspaceTab: 'support',
    workspaceTabLabel: 'Open Support Desk'
  },
  finance: {
    id: 'finance',
    layer: 'Layer 03 · Autonomous Operations & Retention',
    purpose:
      'Monitors unit economics, daily revenue velocity, conversion rates, and cash-flow runway across your Stripe ledger.',
    inputsConsumed: ['Daily order volume', 'Conversion rate metrics', 'Pricing tier mix'],
    deliverablesProduced: [
      '7-Day Revenue & Order Velocity Ledger',
      'MRR & Conversion Lift Simulations',
      'Unit Economics & Margin Projections'
    ],
    sampleTaskJobType: 'finance_projections',
    sampleTaskLabel: 'Dispatch CFO Revenue Projection Model',
    workspaceTab: 'revenue',
    workspaceTabLabel: 'Open Revenue Desk'
  },
  operations: {
    id: 'operations',
    layer: 'Layer 03 · Autonomous Operations & Retention',
    purpose:
      'Orchestrates cross-agent handoffs, compiles the Daily Executive Briefing, and stages high-impact actions in the Task Approval Queue.',
    inputsConsumed: ['Pending task queue state', 'Open support ticket count', 'System deployment checklist'],
    deliverablesProduced: [
      'Daily Executive Operations Briefing',
      'Human-in-the-Loop Task Approval Staging',
      'Production SQL, API & Deployment Specs'
    ],
    sampleTaskJobType: 'preflight_deploy',
    sampleTaskLabel: 'Dispatch Production Pre-Flight Check',
    workspaceTab: 'briefing',
    workspaceTabLabel: 'Open Daily Briefing'
  }
};

const CASCADE_SCENARIOS = [
  {
    id: 'cascade_launch',
    directive: 'Launch a $79/mo B2B Pro Tier with a 5-day TikTok & Email acquisition sprint',
    steps: [
      {
        agent: 'Sarah Chen (CEO)',
        action: 'Validates $5.4B SAM and identifies competitor seat-tax weakness in Market Research.'
      },
      {
        agent: 'Marcus Vance (Product)',
        action: 'Packages the $79/mo Growth Pro tier with a 30-day ROI payback guarantee.'
      },
      {
        agent: 'Evelyn Gray (Website)',
        action: 'Updates landing page hero headline and pricing comparison matrix.'
      },
      {
        agent: 'Rohan Joshi (Marketing)',
        action: 'Generates 3 ROI-anchored TikTok scripts and a 2-step founder plain-text email sequence.'
      },
      {
        agent: 'Liam Stone (Operations)',
        action: 'Stages all 4 deliverables in your Task Approval Queue for 1-click founder authorization.'
      }
    ]
  },
  {
    id: 'cascade_churn',
    directive: 'Resolve enterprise API support inquiries and tighten landing page conversion rate',
    steps: [
      {
        agent: 'Kenji Sato (Support)',
        action: 'Drafts technical API onboarding replies for open enterprise tickets in Support Desk.'
      },
      {
        agent: 'Evelyn Gray (Website)',
        action: 'Adds enterprise FAQ objection handling and security compliance copy to Website Builder.'
      },
      {
        agent: 'Diana Prince (Sales)',
        action: 'Verifies custom volume invoice webhook routing inside Stripe Setup.'
      },
      {
        agent: 'Aisha Bello (Finance)',
        action: 'Updates conversion rate (+0.4%) and daily MRR trajectory inside Revenue Desk.'
      }
    ]
  }
];

export default function OnboardingFlowView({
  agents,
  businessIdea,
  businessName,
  onInitializeVenture,
  onTriggerAgentJob,
  onNavigateTab,
  onCompleteOnboarding
}: OnboardingFlowViewProps) {
  const [step, setStep] = useState<number>(1);

  // Step 1 Interactive Idea Builder states
  const [selectedAudience, setSelectedAudience] = useState<string>(AUDIENCE_OPTIONS[0]);
  const [selectedPain, setSelectedPain] = useState<string>(PAIN_POINT_OPTIONS[0]);
  const [selectedMonetization, setSelectedMonetization] = useState<string>(MONETIZATION_OPTIONS[0]);
  const [customIdea, setCustomIdea] = useState<string>(
    businessIdea ||
      `An autonomous operating system helping ${AUDIENCE_OPTIONS[0]} eliminate ${PAIN_POINT_OPTIONS[0]} via ${MONETIZATION_OPTIONS[0]}.`
  );
  const [initializing, setInitializing] = useState<boolean>(false);
  const [initializedSuccess, setInitializedSuccess] = useState<boolean>(false);

  // Step 2 Interactive Cascade Simulator state
  const [selectedCascadeId, setSelectedCascadeId] = useState<string>('cascade_launch');
  const [activeCascadeStep, setActiveCascadeStep] = useState<number>(5);

  // Step 3 Interactive Agent Explorer state
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('ceo');
  const [dispatchingAgent, setDispatchingAgent] = useState<boolean>(false);
  const [dispatchedMessage, setDispatchedMessage] = useState<string>('');

  const handleSynthesizeIdeaFromPillars = (aud: string, pain: string, mon: string) => {
    setSelectedAudience(aud);
    setSelectedPain(pain);
    setSelectedMonetization(mon);
    setCustomIdea(`An autonomous platform helping ${aud} solve ${pain} through ${mon}.`);
  };

  const handleRunVentureInitialization = async () => {
    if (!customIdea.trim()) return;
    setInitializing(true);
    try {
      await onInitializeVenture(customIdea.trim());
      setInitializedSuccess(true);
    } finally {
      setInitializing(false);
    }
  };

  const handleTestDispatchAgent = async (agentId: AgentId, jobType: string, agentName: string) => {
    setDispatchingAgent(true);
    setDispatchedMessage('');
    try {
      await onTriggerAgentJob(agentId, jobType);
      setDispatchedMessage(
        `${agentName} executed "${jobType}" and staged a new deliverable in your Task Approval Queue.`
      );
    } finally {
      setDispatchingAgent(false);
    }
  };

  const activeCascade =
    CASCADE_SCENARIOS.find((c) => c.id === selectedCascadeId) || CASCADE_SCENARIOS[0];
  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];
  const selectedAgentDetail = AGENT_ROLE_DETAILS[selectedAgentId] || AGENT_ROLE_DETAILS.ceo;

  const stepsMeta = [
    { num: 1, title: '01. Idea Incubator', subtitle: 'Synthesize venture thesis' },
    { num: 2, title: '02. AI OS Architecture', subtitle: '3-layer command loop' },
    { num: 3, title: '03. Meet the 8 Agents', subtitle: 'Roles & deliverables' },
    { num: 4, title: '04. Feedback & Launch', subtitle: 'Fine-tuning & execution' }
  ];

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>Solo Founder Interactive Walkthrough</span>
            <span>·</span>
            <span className="font-mono tabular-nums">Step {step} of 4</span>
            {businessName && (
              <>
                <span>·</span>
                <span className="text-orange-400 font-medium">Active Venture: {businessName}</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            FounderPilot OS · Interactive Onboarding Guide
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Go from raw business idea to orchestrating 8 specialized AI employees with closed-loop feedback fine-tuning.
          </p>
        </div>

        <button
          onClick={onCompleteOnboarding}
          className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
        >
          Skip to Command Briefing →
        </button>
      </div>

      {/* Interactive Stepper Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-zinc-900 border border-zinc-800 p-2">
        {stepsMeta.map((s) => {
          const isCurrent = step === s.num;
          const isCompleted = step > s.num;
          return (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className={`p-3 text-left border transition cursor-pointer ${
                isCurrent
                  ? 'bg-zinc-950 border-orange-500/60 text-zinc-100'
                  : isCompleted
                  ? 'bg-zinc-950/60 border-zinc-800 text-zinc-300'
                  : 'bg-zinc-950/20 border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={isCurrent ? 'text-orange-400' : ''}>{s.title}</span>
                {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
              </div>
              <div className="text-[11px] text-zinc-500 mt-0.5 truncate">{s.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* STEP 1: Interactive Idea Generation & Venture Framing */}
      {step === 1 && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
          <div className="border-b border-zinc-800 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold">
              <Compass className="w-4 h-4" />
              <span>Stage 01 · From Raw Concept to Structured Venture Thesis</span>
            </div>
            <h3 className="text-base font-bold text-zinc-100">
              Generate or Refine Your Solo Business Idea
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every AI employee in FounderPilot OS reads from your central Venture Thesis. Use the interactive combinator below to construct a high-converting concept, or type your own custom business idea directly.
            </p>
          </div>

          {/* Interactive 3-Pillar Combinator */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-2.5">
              <span className="text-xs font-semibold text-zinc-200 block">
                1. Select Target Customer Persona
              </span>
              <div className="space-y-1.5">
                {AUDIENCE_OPTIONS.map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() =>
                      handleSynthesizeIdeaFromPillars(aud, selectedPain, selectedMonetization)
                    }
                    className={`w-full text-left px-3 py-2 text-xs border transition cursor-pointer ${
                      selectedAudience === aud
                        ? 'bg-zinc-900 border-orange-500/50 text-orange-400 font-semibold'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-2.5">
              <span className="text-xs font-semibold text-zinc-200 block">
                2. Select Core Pain Point Solved
              </span>
              <div className="space-y-1.5">
                {PAIN_POINT_OPTIONS.map((pain) => (
                  <button
                    key={pain}
                    type="button"
                    onClick={() =>
                      handleSynthesizeIdeaFromPillars(selectedAudience, pain, selectedMonetization)
                    }
                    className={`w-full text-left px-3 py-2 text-xs border transition cursor-pointer leading-snug ${
                      selectedPain === pain
                        ? 'bg-zinc-900 border-orange-500/50 text-orange-400 font-semibold'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {pain}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 space-y-2.5">
              <span className="text-xs font-semibold text-zinc-200 block">
                3. Select Monetization Wedge
              </span>
              <div className="space-y-1.5">
                {MONETIZATION_OPTIONS.map((mon) => (
                  <button
                    key={mon}
                    type="button"
                    onClick={() =>
                      handleSynthesizeIdeaFromPillars(selectedAudience, selectedPain, mon)
                    }
                    className={`w-full text-left px-3 py-2 text-xs border transition cursor-pointer leading-snug ${
                      selectedMonetization === mon
                        ? 'bg-zinc-900 border-orange-500/50 text-orange-400 font-semibold'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {mon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Synthesized Venture Thesis Input + Live Initialize Button */}
          <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200">
                Your Synthesized Business Idea (Editable)
              </label>
              <span className="text-[11px] text-zinc-500">
                Broadcasts to CEO Sarah Chen & all 7 department agents
              </span>
            </div>

            <textarea
              rows={2}
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {initializedSuccess ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>
                    Venture initialized! Market Research & Business Blueprint compiled for{' '}
                    <strong>{businessName || 'your venture'}</strong>.
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-zinc-500">
                  Click to run CEO Market Research & Business Blueprint generation now, or continue the tour.
                </span>
              )}

              <button
                type="button"
                onClick={handleRunVentureInitialization}
                disabled={initializing || !customIdea.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
              >
                {initializing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sarah CEO Initializing Venture...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Initialize Venture & Run Market Research</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Understanding the AI Employee System Architecture */}
      {step === 2 && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
          <div className="border-b border-zinc-800 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold">
              <Layers className="w-4 h-4" />
              <span>Stage 02 · How the AI Employee Operating System Works</span>
            </div>
            <h3 className="text-base font-bold text-zinc-100">
              One Solo Founder Orchestrating Three Autonomous Layers
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Instead of prompting a generic chatbot from scratch every morning, FounderPilot OS structures 8 specialized AI employees into three coordinated departments that share a single workspace memory and stage actions in your Approval Queue.
            </p>
          </div>

          {/* 3 Architectural Layers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-3">
              <div className="text-xs font-mono text-orange-400 font-semibold">
                Layer 01 · Strategic Core
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                CEO Sarah Chen & Product VP Marcus Vance
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Transforms your raw idea into TAM/SAM/SOM market research, competitor teardowns, value propositions, and 3-tier pricing packaging.
              </p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                Outputs: <span className="text-zinc-300">Market Research Report · Business Blueprint</span>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-3">
              <div className="text-xs font-mono text-orange-400 font-semibold">
                Layer 02 · Growth & Conversion Engine
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Web Evelyn, CMO Rohan & Sales VP Diana
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Consumes the Blueprint to automatically write landing page copy, TikTok scripts, email sequences, paid ad hooks, and Stripe checkout links.
              </p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                Outputs: <span className="text-zinc-300">Landing Page · 5-Channel Marketing · Stripe Setup</span>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-3">
              <div className="text-xs font-mono text-orange-400 font-semibold">
                Layer 03 · Autonomous Ops & Governance
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Support Kenji, CFO Aisha & Ops VP Liam
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drafts customer support ticket replies, tracks MRR and conversion telemetry, and stages every action in your Human-in-the-Loop Task Queue.
              </p>
              <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
                Outputs: <span className="text-zinc-300">Task Approval Queue · Support Desk · Daily Briefing</span>
              </div>
            </div>
          </div>

          {/* Interactive Command Cascade Simulator */}
          <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h4 className="text-xs font-semibold text-zinc-100">
                  Interactive Command Cascade Simulator
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Select a founder command below to trace how work cascades automatically across your AI employees:
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CASCADE_SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => {
                      setSelectedCascadeId(sc.id);
                      setActiveCascadeStep(sc.steps.length);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium border transition cursor-pointer ${
                      selectedCascadeId === sc.id
                        ? 'bg-zinc-900 border-orange-500/50 text-orange-400'
                        : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {sc.id === 'cascade_launch' ? 'Scenario A: Product Launch' : 'Scenario B: Enterprise Support & CRO'}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-zinc-300 bg-zinc-900 p-3 border border-zinc-800 font-mono">
              Founder Command: &#34;{activeCascade.directive}&#34;
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {activeCascade.steps.map((st, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveCascadeStep(idx + 1)}
                  className={`p-3.5 border transition cursor-pointer space-y-1.5 ${
                    idx < activeCascadeStep
                      ? 'bg-zinc-900 border-zinc-700 text-zinc-200'
                      : 'bg-zinc-900/30 border-zinc-800 text-zinc-500'
                  }`}
                >
                  <div className="text-[11px] font-mono tabular-nums text-orange-400 font-semibold">
                    Step 0{idx + 1}
                  </div>
                  <div className="text-xs font-semibold text-zinc-100">{st.agent}</div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{st.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Interactive Meet-the-Agents Roster & Purpose Explorer */}
      {step === 3 && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
          <div className="border-b border-zinc-800 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold">
              <Users className="w-4 h-4" />
              <span>Stage 03 · Deep-Dive Into Each AI Employee&#39;s Purpose</span>
            </div>
            <h3 className="text-base font-bold text-zinc-100">
              Explore All 8 Specialized AI Employees & Test Their Workflows
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Click any AI employee on the left to inspect their exact responsibility, inputs consumed, deliverables produced, and test-dispatch an autonomous job.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Agent Selector Grid */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {agents.map((ag) => {
                const isSelected = ag.id === selectedAgentId;
                return (
                  <button
                    key={ag.id}
                    type="button"
                    onClick={() => {
                      setSelectedAgentId(ag.id);
                      setDispatchedMessage('');
                    }}
                    className={`p-3 border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-950 border-orange-500/60 text-zinc-100'
                        : 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{ag.avatar}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{ag.name}</div>
                        <div className="text-[11px] text-zinc-500 truncate">{ag.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 shrink-0 ml-2">
                      {ag.id}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Agent Role & Deliverables Inspector */}
            <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl">{selectedAgent.avatar}</span>
                  <div>
                    <div className="text-xs font-mono text-orange-400">
                      {selectedAgentDetail.layer}
                    </div>
                    <h4 className="text-base font-bold text-zinc-100">
                      {selectedAgent.name} · {selectedAgent.role}
                    </h4>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab(selectedAgentDetail.workspaceTab)}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 transition cursor-pointer whitespace-nowrap shrink-0"
                >
                  {selectedAgentDetail.workspaceTabLabel} →
                </button>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-300">Core Purpose & Mission</span>
                <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900 p-3.5 border border-zinc-800">
                  {selectedAgentDetail.purpose}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-2">
                  <span className="text-xs font-semibold text-zinc-200 block">
                    Workspace Context Consumed
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    {selectedAgentDetail.inputsConsumed.map((inp, idx) => (
                      <li key={idx}>• {inp}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-4 space-y-2">
                  <span className="text-xs font-semibold text-emerald-400 block">
                    Concrete Deliverables Produced
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {selectedAgentDetail.deliverablesProduced.map((del, idx) => (
                      <li key={idx}>✓ {del}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-zinc-400">Base System Instruction</span>
                <div className="p-3 bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-400 leading-relaxed">
                  {selectedAgent.prompt}
                </div>
              </div>

              {dispatchedMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{dispatchedMessage}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">
                  Test this agent&#39;s autonomous queue execution:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleTestDispatchAgent(
                      selectedAgent.id,
                      selectedAgentDetail.sampleTaskJobType,
                      selectedAgent.name
                    )
                  }
                  disabled={dispatchingAgent}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
                >
                  {dispatchingAgent ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Dispatching Task...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{selectedAgentDetail.sampleTaskLabel}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Closed-Loop Feedback Fine-Tuning & Launch Readiness */}
      {step === 4 && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
          <div className="border-b border-zinc-800 pb-4 space-y-1">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-semibold">
              <Sliders className="w-4 h-4" />
              <span>Stage 04 · Closed-Loop Fine-Tuning & Launch Execution</span>
            </div>
            <h3 className="text-base font-bold text-zinc-100">
              How Your Ratings & Comments Make Your AI Staff Smarter Every Day
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every major workspace view (Market Research, Blueprint, Marketing Hub, Website Builder) includes an inline Feedback & Fine-Tuning bar. When you rate an output 1–5 stars and leave a comment, FounderPilot OS extracts a persistent rule and injects it into that agent&#39;s prompt on every future run.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-2">
              <div className="text-xs font-mono text-orange-400 font-semibold">
                01. Rate & Comment Inline
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Evaluate Any Deliverable (1–5 ★)
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Whether reviewing Sarah&#39;s Market Research or Rohan&#39;s TikTok scripts, rate the output and note what to change (e.g., &#34;Lead hooks with $4,200/mo saved&#34;).
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-2">
              <div className="text-xs font-mono text-orange-400 font-semibold">
                02. Automatic Rule Synthesis
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                Stored in Persistent Agent Memory
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your feedback is converted into a structured system directive inside the Fine-Tuning Lab and automatically attached to future API requests for that agent.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-2">
              <div className="text-xs font-mono text-orange-400 font-semibold">
                03. Compounding Output Quality
              </div>
              <h4 className="text-sm font-semibold text-zinc-100">
                One-Click Fine-Tuned Regeneration
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click &#34;Apply & Regenerate Output&#34; to watch the agent immediately rewrite the campaign, website copy, or market report following your exact rules.
              </p>
            </div>
          </div>

          {/* Launch Destination Cards */}
          <div className="bg-zinc-950 border border-zinc-800 p-5 space-y-4">
            <h4 className="text-xs font-semibold text-zinc-200">
              Choose Your First Command Center Destination:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab('research')}
                className="p-4 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 text-left space-y-1 transition cursor-pointer"
              >
                <div className="text-xs font-semibold text-orange-400">01. CEO Market Research →</div>
                <p className="text-[11px] text-zinc-400">
                  Analyze TAM/SAM/SOM, competitor strengths/weaknesses, and market gaps.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('tuning')}
                className="p-4 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 text-left space-y-1 transition cursor-pointer"
              >
                <div className="text-xs font-semibold text-orange-400">02. Agent Fine-Tuning Lab →</div>
                <p className="text-[11px] text-zinc-400">
                  See before/after marketing campaign evolution examples and manage rules.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('blueprint')}
                className="p-4 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 text-left space-y-1 transition cursor-pointer"
              >
                <div className="text-xs font-semibold text-orange-400">03. Business Blueprint →</div>
                <p className="text-[11px] text-zinc-400">
                  Configure your venture offer, pricing tiers, and launch checklist.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Step Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep((prev) => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition disabled:opacity-40 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous Stage</span>
        </button>

        <div className="flex items-center gap-3">
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer"
            >
              <span>Next Stage: {stepsMeta[step].title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigateTab('research')}
              className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer"
            >
              <span>Complete Onboarding & Open Market Research</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
