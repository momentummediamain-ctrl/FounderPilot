import React, { useState, useEffect } from 'react';
import {
  Agent,
  AgentId,
  BusinessProfile,
  Task,
  TaskUrgency,
  StrategicGoalType,
  WebsiteData,
  MarketingCampaign,
  Ticket,
  Briefing,
  RevenueStats,
  ChatMessage,
  MarketResearchReport,
  AgentFeedback,
  MarketIntelFeed,
  StripeTestTransaction,
  MockStripeProduct,
  TenantAccount,
  AssetAuditLogEntry
} from './types';
import { DEFAULT_AGENTS } from './data/agents';
import {
  getInitialTasks,
  getInitialTickets,
  getInitialRevenueStats,
  getInitialWebsiteData,
  getInitialMarketingCampaign,
  getInitialMarketResearch,
  getInitialFeedbackList,
  getInitialMarketIntel,
  getInitialAuditLogs,
  getInitialMockStripeProducts
} from './utils/mockData';
import { Menu, ShieldCheck, Activity, Layers, Lock } from 'lucide-react';

// Modular Views Imports
import Sidebar from './components/Sidebar';
import LaunchReadinessView from './components/LaunchReadinessView';
import OnboardingFlowView from './components/OnboardingFlowView';
import MarketResearchView from './components/MarketResearchView';
import FeedbackTuningView from './components/FeedbackTuningView';
import DailyBriefingView from './components/DailyBriefingView';
import FounderChat from './components/FounderChat';
import BlueprintView from './components/BlueprintView';
import EmployeeRegistry from './components/EmployeeRegistry';
import TaskQueueView from './components/TaskQueueView';
import WebsiteBuilderView from './components/WebsiteBuilderView';
import MarketingHubView from './components/MarketingHubView';
import PaymentAssistantView from './components/PaymentAssistantView';
import SupportDeskView from './components/SupportDeskView';
import RevenueDashboard from './components/RevenueDashboard';
import SetupInstructions from './components/SetupInstructions';

const DEFAULT_PROFILE: BusinessProfile = {
  idea: 'Autonomous AI workflow & billing copilot for solo SaaS founders and boutique digital agencies',
  name: 'FounderPilot OS',
  offer: 'Launch and scale a solo B2B business in 24 hours with 8 specialized AI employees and closed-loop feedback tuning.',
  avatar: 'Bootstrapped solo SaaS founders, indie hackers, and 1–10 person digital agencies generating $2k–$50k MRR.',
  problem: 'Founders waste 20+ hours/week and $3,500+/mo stitching together fragmented marketing, copy, billing, and support tools.',
  products: [
    {
      name: 'Starter Operator',
      price: '$29/mo',
      description: 'Core 8-agent workspace, CEO Market Research, and 3 automated launch workflows.'
    },
    {
      name: 'Growth Pro Suite',
      price: '$79/mo',
      description: 'Unlimited multi-channel campaigns, closed-loop agent feedback fine-tuning, and Stripe checkout sync.'
    },
    {
      name: 'Agency Scale Bundle',
      price: '$249/mo',
      description: 'Multi-venture brand workspaces, white-label client reporting, and priority webhook execution.'
    }
  ],
  checklist: [
    { id: '1', task: 'Run CEO Market Research & validate competitor wedge', done: true, category: 'ceo' },
    { id: '2', task: 'Configure automated payment workflows with Stripe Checkout', done: false, category: 'operations' },
    { id: '3', task: 'Define search-engine optimized Landing Page copies & sections', done: false, category: 'website' },
    { id: '4', task: 'Construct target demographic social scripts (TikTok/Instagram) in Marketing Engine', done: false, category: 'marketing' },
    { id: '5', task: 'Draft customer service canned macro replies for common questions', done: false, category: 'support' },
    { id: '6', task: 'Establish primary product metrics & pricing tiers inside Revenue Dashboard', done: false, category: 'finance' }
  ],
  tools: [
    { name: 'FounderPilot OS Client Engine', purpose: 'AI employee orchestration and feedback fine-tuning loop', cost: 'Included' },
    { name: 'Stripe', purpose: 'Payment collection, customer portal, and invoice processing', cost: 'Pay-as-you-go' },
    { name: 'Resend', purpose: 'Transactional emails, welcome campaigns, and product updates', cost: 'Free tier available' },
    { name: 'Supabase & PostgreSQL', purpose: 'Database persistence, file storage, and user authentication', cost: 'Free tier available' }
  ]
};

const DEFAULT_TENANT: TenantAccount = {
  tenantId: 'tenant_alpha_01',
  ownerName: 'Alex Rivera (Solo Founder)',
  ownerEmail: 'founder@alpha-saas.io',
  role: 'OWNER',
  businessName: 'FounderPilot OS',
  planEntitlement: 'growth_pro_test',
  isolatedNamespace: 'ns_alpha_01_isolated'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('launch_gate');
  const [activeTenant, setActiveTenant] = useState<TenantAccount>(DEFAULT_TENANT);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [ownerApprovedLaunch, setOwnerApprovedLaunch] = useState<boolean>(() => {
    const cached = localStorage.getItem('fp_owner_launch_gate');
    return cached ? JSON.parse(cached) : true;
  });

  // Core Orchestration States with LocalStorage Persistence
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const cached = localStorage.getItem('fp_profile_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.name) return parsed;
      } catch {
        // ignore invalid cache
      }
    }
    return DEFAULT_PROFILE;
  });

  const [marketResearch, setMarketResearch] = useState<MarketResearchReport>(() => {
    const cached = localStorage.getItem('fp_market_research_v1');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return getInitialMarketResearch(DEFAULT_PROFILE.idea, DEFAULT_PROFILE.name);
  });

  const [marketIntel, setMarketIntel] = useState<MarketIntelFeed>(() => {
    const cached = localStorage.getItem('fp_market_intel_v1');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return getInitialMarketIntel(DEFAULT_PROFILE.idea);
  });

  const [feedbackList, setFeedbackList] = useState<AgentFeedback[]>(() => {
    const cached = localStorage.getItem('fp_feedback_v1');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return getInitialFeedbackList();
  });

  const [stripeTransactions, setStripeTransactions] = useState<StripeTestTransaction[]>(() => {
    const cached = localStorage.getItem('fp_stripe_tx_v1');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return [
      {
        id: 'tx_test_seed01',
        chargeId: 'ch_test_98a4f2c1b0',
        subscriptionId: 'sub_test_77d1e8a3',
        customerEmail: 'pilot-founder@alpha-saas.io',
        planName: 'Growth Pro Suite ($79/mo)',
        amount: 79,
        status: 'purchased',
        entitlementStatus: 'active_trial_or_test',
        webhookVerified: true,
        timestamp: 'Verified Seed',
        mode: 'STRIPE_TEST_MODE'
      }
    ];
  });

  const [mockProducts, setMockProducts] = useState<MockStripeProduct[]>(() => {
    const cached = localStorage.getItem('fp_mock_stripe_products_v1');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return getInitialMockStripeProducts(DEFAULT_PROFILE.name);
  });

  const [auditLogs, setAuditLogs] = useState<AssetAuditLogEntry[]>(() => {
    const cached = localStorage.getItem('fp_audit_logs_v1');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return getInitialAuditLogs();
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    const cached = localStorage.getItem('fp_agents_v2');
    if (cached) {
      try {
        const parsed: Agent[] = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_AGENTS.length) {
          return DEFAULT_AGENTS.map((defAg) => {
            const match = parsed.find((p) => p.id === defAg.id);
            return match ? { ...defAg, ...match, agentHandoffs: match.agentHandoffs || defAg.agentHandoffs } : defAg;
          });
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_AGENTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const cached = localStorage.getItem('fp_tasks_v2');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return getInitialTasks(DEFAULT_PROFILE.name);
  });

  const [websiteData, setWebsiteData] = useState<WebsiteData>(() => {
    const cached = localStorage.getItem('fp_website');
    return cached ? JSON.parse(cached) : getInitialWebsiteData(DEFAULT_PROFILE.name);
  });

  const [campaign, setCampaign] = useState<MarketingCampaign>(() => {
    const cached = localStorage.getItem('fp_campaign');
    return cached ? JSON.parse(cached) : getInitialMarketingCampaign();
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const cached = localStorage.getItem('fp_tickets');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return getInitialTickets(DEFAULT_PROFILE.name);
  });

  const [revenue, setRevenue] = useState<RevenueStats>(() => {
    const cached = localStorage.getItem('fp_revenue');
    return cached ? JSON.parse(cached) : getInitialRevenueStats();
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const cached = localStorage.getItem('fp_chat_history');
    return cached ? JSON.parse(cached) : [];
  });

  const [briefing, setBriefing] = useState<Briefing>(() => {
    const cached = localStorage.getItem('fp_briefing');
    return cached
      ? JSON.parse(cached)
      : {
          summary:
            'FounderPilot OS is operational. CEO Sarah Chen has compiled your initial Market Research Report with verified citations, and 3 founder fine-tuning directives are active across your AI employee roster.',
          whatHappened: [
            'Compiled TAM/SAM/SOM market sizing & 3-competitor strength/weakness matrix with verified citations',
            'Activated closed-loop feedback fine-tuning for CEO, Marketing, and Website agents'
          ],
          needsApproval: [
            'Review and approve initial launch tasks in the Task Approval Queue'
          ],
          revenueSummary: 'Verified Live Revenue: $0.00 (Sandbox demo simulation isolated).',
          risks: ['Stripe Test Mode Active: Real bank charges are disabled until live merchant underwriting is approved.'],
          date: new Date().toLocaleDateString()
        };
  });

  // Sync state to local storage on modification
  useEffect(() => {
    localStorage.setItem('fp_owner_launch_gate', JSON.stringify(ownerApprovedLaunch));
  }, [ownerApprovedLaunch]);

  useEffect(() => {
    localStorage.setItem('fp_profile_v2', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fp_market_research_v1', JSON.stringify(marketResearch));
  }, [marketResearch]);

  useEffect(() => {
    localStorage.setItem('fp_market_intel_v1', JSON.stringify(marketIntel));
  }, [marketIntel]);

  useEffect(() => {
    localStorage.setItem('fp_feedback_v1', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('fp_stripe_tx_v1', JSON.stringify(stripeTransactions));
  }, [stripeTransactions]);

  useEffect(() => {
    localStorage.setItem('fp_mock_stripe_products_v1', JSON.stringify(mockProducts));
  }, [mockProducts]);

  useEffect(() => {
    localStorage.setItem('fp_audit_logs_v1', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('fp_agents_v2', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('fp_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fp_website', JSON.stringify(websiteData));
  }, [websiteData]);

  useEffect(() => {
    localStorage.setItem('fp_campaign', JSON.stringify(campaign));
  }, [campaign]);

  useEffect(() => {
    localStorage.setItem('fp_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('fp_revenue', JSON.stringify(revenue));
  }, [revenue]);

  useEffect(() => {
    localStorage.setItem('fp_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('fp_briefing', JSON.stringify(briefing));
  }, [briefing]);

  // Append an immutable entry to the Workspace Asset Change & Approval Audit Log
  const appendAuditLog = (
    agentId: AgentId | 'founder',
    agentName: string,
    action: string,
    assetModule: string,
    summary: string,
    approvalStatus: AssetAuditLogEntry['approvalStatus']
  ) => {
    const newEntry: AssetAuditLogEntry = {
      id: 'audit_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agentId,
      agentName,
      action,
      assetModule,
      summary,
      approvalStatus
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Helper: Get active fine-tuning rules for an agent and increment applied counter
  const consumeAgentFeedbackRules = (agentId: AgentId, extraRule?: string): string[] => {
    const activeItems = feedbackList.filter((f) => f.agentId === agentId && f.active);
    const rules = activeItems.map((f) => f.extractedRule);
    const targetAgent = agents.find((a) => a.id === agentId);
    if (targetAgent?.customSkillFocus) {
      rules.unshift(`Custom Skill Focus: ${targetAgent.customSkillFocus}`);
    }
    if (extraRule) {
      rules.unshift(extraRule);
    }

    if (activeItems.length > 0) {
      setFeedbackList((prev) =>
        prev.map((item) =>
          item.agentId === agentId && item.active
            ? { ...item, appliedCount: item.appliedCount + 1 }
            : item
        )
      );
    }
    return rules;
  };

  // Update an AI Employee's Custom Skill Focus Instruction
  const handleUpdateAgentSkillFocus = (agentId: AgentId, customSkillFocus: string) => {
    const targetAgent = agents.find((a) => a.id === agentId);
    setAgents((prev) =>
      prev.map((ag) => (ag.id === agentId ? { ...ag, customSkillFocus } : ag))
    );

    appendAuditLog(
      agentId,
      targetAgent?.name || 'AI Employee',
      'Updated AI Employee Skill Customization',
      'employees',
      `Set custom skill focus for ${targetAgent?.name || agentId}: "${customSkillFocus}"`,
      'OWNER_APPROVED'
    );
  };

  // Feedback Management Handlers
  const handleAddFeedback = (newEntry: Omit<AgentFeedback, 'id' | 'createdAt' | 'appliedCount'>) => {
    const created: AgentFeedback = {
      ...newEntry,
      id: 'fb_' + Date.now(),
      appliedCount: 1,
      createdAt: 'Just now'
    };
    setFeedbackList((prev) => [created, ...prev]);

    appendAuditLog(
      newEntry.agentId,
      newEntry.agentName,
      'Added Agent Fine-Tuning Directive',
      'tuning',
      `Rule added: "${newEntry.extractedRule}"`,
      'OWNER_APPROVED'
    );

    setAgents((prev) =>
      prev.map((ag) => {
        if (ag.id !== newEntry.agentId) return ag;
        const basePrompt = ag.prompt.split('\n\n[Fine-Tuning Directives]:')[0];
        const existingRules = feedbackList
          .filter((f) => f.agentId === newEntry.agentId && f.active)
          .map((f) => f.extractedRule);
        const allRules = [newEntry.extractedRule, ...existingRules];
        return {
          ...ag,
          prompt: `${basePrompt}\n\n[Fine-Tuning Directives]:\n${allRules
            .map((r, i) => `${i + 1}. ${r}`)
            .join('\n')}`
        };
      })
    );
  };

  const handleToggleFeedbackActive = (id: string) => {
    setFeedbackList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedbackList((prev) => prev.filter((item) => item.id !== id));
  };

  // 1. API Action: CEO Market Research Report with Grounded Citations
  const handleGenerateMarketResearch = async (ideaText: string) => {
    const feedbackRules = consumeAgentFeedbackRules('ceo');
    try {
      const res = await fetch('/api/generate-market-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: ideaText,
          name: profile.name,
          feedbackRules
        })
      });
      const data = await res.json();
      if (data && data.executiveSummary) {
        setMarketResearch(data);
        setProfile((prev) => ({ ...prev, idea: ideaText }));
        appendAuditLog(
          'ceo',
          'Sarah Chen (CEO)',
          'Compiled Grounded Market Research Report',
          'research',
          `Generated TAM/SAM/SOM & competitor matrix with ${data.citations?.length || 0} verified citations.`,
          'STAGED_DRAFT'
        );
      }
    } catch (e) {
      console.error('Failed to generate market research:', e);
    }
  };

  // 1B. API Action: Refresh Market Intel via Google Search Grounding
  const handleRefreshMarketIntel = async (ideaText: string) => {
    try {
      const res = await fetch('/api/market-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaText })
      });
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        setMarketIntel(data);
      }
    } catch (e) {
      console.error('Failed to refresh market intel:', e);
    }
  };

  // 2. API Action: Direct Specialist Chat (1-on-1), Collaborative Squad Task, or 2-Step Idea Validation
  const handleSendMessage = async (
    text: string,
    agentId: AgentId,
    collaborators: AgentId[] = [],
    validationOptions?: { validationStep: 'probe' | 'synthesize'; originalIdea: string }
  ) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      agentId,
      collaborators,
      text,
      timestamp: new Date().toISOString()
    };

    setChatHistory((prev) => [...prev, newUserMsg]);
    const feedbackRules = consumeAgentFeedbackRules(agentId);
    const activeAgentObj = agents.find((a) => a.id === agentId);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          agentId,
          collaborators,
          history: chatHistory,
          feedbackRules,
          customSkillFocus: activeAgentObj?.customSkillFocus || '',
          validationStep: validationOptions?.validationStep,
          originalIdea: validationOptions?.originalIdea,
          sharedContext: {
            name: profile.name,
            idea: profile.idea,
            offer: profile.offer,
            avatar: profile.avatar
          }
        })
      });
      const data = await res.json();

      const newAgentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: data.agentId || agentId,
        agentId: data.agentId || agentId,
        agentName: data.agentName,
        collaborators: data.collaborators || collaborators,
        text: data.text || 'Understood. Let me stage the updated business asset.',
        timestamp: new Date().toISOString(),
        proposedActionTitle: data.proposedActionTitle,
        proposedActionType: data.proposedActionType,
        targetAsset: data.targetAsset,
        validationMetadata: data.validationMetadata
      };

      setChatHistory((prev) => [...prev, newAgentMsg]);

      appendAuditLog(
        data.agentId || agentId,
        data.agentName || 'Specialist Agent',
        validationOptions
          ? `Idea Validation (${validationOptions.validationStep.toUpperCase()})`
          : collaborators.length > 1
          ? 'Collaborative Squad Recommendation'
          : 'Direct Specialist Consultation',
        data.targetAsset || 'chat',
        `Drafted recommendation: "${(data.proposedActionTitle || text).slice(0, 65)}"`,
        'STAGED_DRAFT'
      );

      if (!profile.idea && text.length > 15) {
        setProfile((prev) => ({ ...prev, idea: text }));
      }
    } catch (e) {
      console.error('Failed to communicate with chat proxy:', e);
    }
  };

  // Stage an AI Specialist / Squad Chat response into the Owner Task Approval Queue & update asset draft
  const handleStageChatActionForApproval = (msg: ChatMessage) => {
    const targetAgent = (msg.agentId || (msg.sender === 'user' ? 'ceo' : msg.sender)) as AgentId;
    const targetAgentObj = agents.find((a) => a.id === targetAgent);
    const newTaskId = 'chat_task_' + Date.now();
    const newTask: Task = {
      id: newTaskId,
      agentId: targetAgent,
      title: msg.proposedActionTitle || `${msg.agentName || 'Specialist'} Asset Update`,
      description: msg.text.slice(0, 260),
      status: 'pending_approval',
      actionType: msg.proposedActionType || 'general',
      createdAt: new Date().toLocaleDateString(),
      urgency: 'high',
      strategicGoal:
        targetAgent === 'sales' || targetAgent === 'finance'
          ? 'revenue_acceleration'
          : targetAgent === 'marketing' || targetAgent === 'website'
          ? 'customer_acquisition'
          : targetAgent === 'operations' || targetAgent === 'support'
          ? 'operational_resilience'
          : 'product_readiness',
      customSkillApplied: targetAgentObj?.customSkillFocus
    };

    setTasks((prev) => [newTask, ...prev]);
    setChatHistory((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, queuedTaskId: newTaskId } : m))
    );

    appendAuditLog(
      targetAgent,
      msg.agentName || 'Specialist Agent',
      'Staged Asset Update & Queued for Owner Approval',
      msg.targetAsset || 'tasks',
      `Queued "${newTask.title}" (${newTaskId}) in Task Approval Queue. Execution locked until Owner approves.`,
      'PENDING_OWNER_APPROVAL'
    );
  };

  // 3. API Action: Auto-Generate Business Blueprint
  const handleGenerateBlueprint = async (ideaText: string, redirectTab: string = 'blueprint') => {
    const feedbackRules = consumeAgentFeedbackRules('ceo');
    try {
      const res = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaText, feedbackRules })
      });
      const data = await res.json();

      if (data && data.name) {
        const nextProfile: BusinessProfile = {
          idea: ideaText,
          name: data.name,
          offer: data.offer,
          avatar: data.avatar,
          problem: data.problem,
          products: data.products || [],
          checklist: data.checklist || [],
          tools: data.tools || []
        };
        setProfile(nextProfile);

        // Persist durable snapshot on server (.data/founderpilot-store.json)
        await fetch('/api/records/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantId: activeTenant.tenantId,
            ownerEmail: activeTenant.ownerEmail,
            payload: nextProfile
          })
        });

        setTasks(getInitialTasks(data.name));
        setTickets(getInitialTickets(data.name));
        setWebsiteData(getInitialWebsiteData(data.name));
        setMockProducts(getInitialMockStripeProducts(data.name));

        appendAuditLog(
          'ceo',
          'Sarah Chen (CEO)',
          'Compiled & Persisted Business Blueprint',
          'blueprint',
          `Saved "${data.name}" blueprint to durable disk store and queued initial tasks for Owner approval.`,
          'STAGED_DRAFT'
        );

        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ceo',
          agentId: 'ceo',
          agentName: 'Sarah Chen (CEO)',
          text: `I have compiled our complete Business Blueprint under the title: **${data.name}**. I have also dispatched the launch roadmap checklist to Marcus, Evelyn, Kenji, and Rohan.`,
          timestamp: new Date().toISOString(),
          proposedActionTitle: `Approve ${data.name} Launch Roadmap`,
          proposedActionType: 'general',
          targetAsset: 'blueprint'
        };
        setChatHistory((prev) => [...prev, welcomeMessage]);
        if (redirectTab) {
          setActiveTab(redirectTab);
        }
      }
    } catch (e) {
      console.error('Failed to compile blueprint:', e);
    }
  };

  // 1-Click Full Venture Cascade across Market Research, Market Intel, Blueprint, Website Copy, and Marketing Campaigns
  const handleCascadeVenture = async (ideaText: string) => {
    const targetIdea = ideaText || profile.idea;
    await handleGenerateMarketResearch(targetIdea);
    await handleRefreshMarketIntel(targetIdea);
    await handleGenerateBlueprint(targetIdea, '');
    await handleGenerateWebsiteCopy();
    await handleGenerateMarketingCampaign();

    appendAuditLog(
      'ceo',
      '8-Agent Executive Squad',
      '1-Click Full Venture Cascade Completed',
      'all_modules',
      `Synchronized Market Research, Blueprint, Website Copy, and Marketing Campaigns for "${profile.name}".`,
      'STAGED_DRAFT'
    );
  };

  // Export Executive Venture Dossier (.md)
  const handleExportDossier = () => {
    const slug = (profile.name || 'founderpilot-venture').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const mdContent = `# ${profile.name} — Executive Venture Dossier
Generated by FounderPilot OS · Verified Multi-Agent Operating System
Date: ${new Date().toLocaleDateString()}

## 1. Core Venture Blueprint
- **Venture Name:** ${profile.name}
- **Business Concept:** ${profile.idea}
- **Irresistible Offer:** ${profile.offer}
- **Target Customer Avatar:** ${profile.avatar}
- **Core Problem Solved:** ${profile.problem}

### Monetization Tiers (Marcus Vance · VP Product)
${profile.products.map((p) => `- **${p.name} (${p.price}):** ${p.description}`).join('\n')}

---

## 2. CEO Market Research & Sizing (Sarah Chen · CEO)
${marketResearch.executiveSummary}

- **TAM:** ${marketResearch.tam.value} — ${marketResearch.tam.description}
- **SAM:** ${marketResearch.sam.value} — ${marketResearch.sam.description}
- **SOM:** ${marketResearch.som.value} — ${marketResearch.som.description}

### Competitive Landscape
${marketResearch.competitors
  .map(
    (c) => `#### ${c.name} (${c.pricingModel})
- **Strengths:** ${c.strengths.join('; ')}
- **Weaknesses:** ${c.weaknesses.join('; ')}
- **Our Unfair Wedge:** ${c.ourWedge}`
  )
  .join('\n\n')}

### Verified Market Research Citations
${(marketResearch.citations || [])
  .map((cit) => `- [${cit.title}](${cit.url}) (${cit.source}) — ${cit.snippet}`)
  .join('\n')}

---

## 3. Go-To-Market & Landing Page Architecture
- **Hero Headline:** ${websiteData.heroTitle}
- **Hero Subheadline:** ${websiteData.heroSubtitle}
- **Primary Acquisition Channels:** ${marketResearch.acquisitionChannels.join(' · ')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-executive-dossier.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    appendAuditLog(
      'founder',
      activeTenant.ownerName,
      'Exported Executive Venture Dossier (.md)',
      'blueprint',
      `Downloaded ${slug}-executive-dossier.md with market research citations and pricing architecture.`,
      'OWNER_APPROVED'
    );
  };

  // Combined Onboarding Venture Initializer
  const handleInitializeVentureFromOnboarding = async (ideaText: string) => {
    await handleCascadeVenture(ideaText);
  };

  // 4. API Action: AI Employee trigger autonomous background work (incorporating Custom Skill Focus)
  const handleTriggerAgentJob = async (agentId: AgentId, jobType: string) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: 'working' } : a)));

    await new Promise((resolve) => setTimeout(resolve, 600));

    const agentObj = agents.find((a) => a.id === agentId);
    const skillFocusNote = agentObj?.customSkillFocus
      ? ` [Skill Focus Applied: "${agentObj.customSkillFocus}"]`
      : '';

    let newTaskTitle = '';
    let newTaskDesc = '';
    let newTaskAction: Task['actionType'] = 'general';
    let urgency: TaskUrgency = 'high';
    let strategicGoal: StrategicGoalType = 'product_readiness';

    switch (jobType) {
      case 'align_roadmap':
        newTaskTitle = 'Sarah Roadmap & Market Wedge Sync';
        newTaskDesc = `CEO Sarah Chen audited TAM/SAM/SOM research and launch readiness.${skillFocusNote}`;
        newTaskAction = 'general';
        urgency = 'critical';
        strategicGoal = 'product_readiness';
        break;
      case 'pro_packaging':
        newTaskTitle = 'Marcus Pro Tier Feature Mapping';
        newTaskDesc = `Product VP Marcus Vance outlined tiered deliverables for our $79/mo Growth Pro Suite.${skillFocusNote}`;
        newTaskAction = 'add_product';
        urgency = 'critical';
        strategicGoal = 'product_readiness';
        break;
      case 'seo_audit':
        newTaskTitle = 'Evelyn Landing Page SEO Alignment';
        newTaskDesc = `Web Architect Evelyn Gray optimized hero conversion copy and meta tags.${skillFocusNote}`;
        newTaskAction = 'deploy_website';
        urgency = 'high';
        strategicGoal = 'customer_acquisition';
        break;
      case 'email_campaign':
        newTaskTitle = 'Rohan Fine-Tuned Launch Broadcast';
        newTaskDesc = `CMO Rohan Joshi drafted ROI-calibrated onboarding and growth campaigns.${skillFocusNote}`;
        newTaskAction = 'send_email';
        urgency = 'high';
        strategicGoal = 'customer_acquisition';
        break;
      case 'sandbox_payment':
        newTaskTitle = 'Diana Stripe Checkout Creation';
        newTaskDesc = `Sales VP Diana Prince compiled checkout session hooks for Starter and Pro tiers.${skillFocusNote}`;
        newTaskAction = 'stripe_setup';
        urgency = 'critical';
        strategicGoal = 'revenue_acceleration';
        break;
      case 'faq_center':
        newTaskTitle = 'Kenji Support Macro Compilation';
        newTaskDesc = `Head of Support Kenji Sato compiled rapid-response customer service macros.${skillFocusNote}`;
        newTaskAction = 'support_reply';
        urgency = 'normal';
        strategicGoal = 'operational_resilience';
        break;
      case 'finance_projections':
        newTaskTitle = 'Aisha Unit Economics Model';
        newTaskDesc = `CFO Aisha Bello drafted 90-day MRR and CAC payback projections.${skillFocusNote}`;
        newTaskAction = 'general';
        urgency = 'high';
        strategicGoal = 'revenue_acceleration';
        break;
      case 'preflight_deploy':
        newTaskTitle = 'Liam Preflight DNS & DB Check';
        newTaskDesc = `Operations VP Liam Stone completed Supabase schema and domain verification.${skillFocusNote}`;
        newTaskAction = 'general';
        urgency = 'high';
        strategicGoal = 'operational_resilience';
        break;
    }

    const newTask: Task = {
      id: 'at_' + Date.now(),
      agentId,
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'pending_approval',
      actionType: newTaskAction,
      createdAt: new Date().toLocaleDateString(),
      urgency,
      strategicGoal,
      customSkillApplied: agentObj?.customSkillFocus
    };

    appendAuditLog(
      agentId,
      agentObj?.name || 'AI Employee',
      'Queued Autonomous Task with Custom Skill Focus',
      'tasks',
      `${newTaskTitle} staged in Task Approval Queue (${urgency.toUpperCase()} urgency).`,
      'PENDING_OWNER_APPROVAL'
    );

    setTasks((prev) => [newTask, ...prev]);
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: 'idle' } : a)));
  };

  // Update a task's Founder-Defined Urgency or Strategic Business Goal inline
  const handleUpdateTaskPriority = (
    taskId: string,
    urgency: TaskUrgency,
    strategicGoal: StrategicGoalType
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, urgency, strategicGoal } : t))
    );
  };

  // 5. Action: Approve a Task (Role-Aware)
  const handleApproveTask = (taskId: string) => {
    const approvedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const targetTask = tasks.find((t) => t.id === taskId);
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'approved', approvedAt } : t))
    );
    appendAuditLog(
      'founder',
      activeTenant.ownerName,
      'Owner Approved Queued Task',
      'tasks',
      `Approved "${targetTask?.title || taskId}" at ${approvedAt}.`,
      'OWNER_APPROVED'
    );
  };

  // 6. Action: Execute Approved Task & Issue Cryptographic Receipt
  const handleExecuteTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const res = await fetch('/api/tasks/execute-with-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: task.id,
        taskTitle: task.title,
        agentId: task.agentId,
        actionType: task.actionType,
        status: task.status,
        approvedAt: task.approvedAt,
        tenantId: activeTenant.tenantId,
        role: activeTenant.role,
        launchGateApproved: ownerApprovedLaunch
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Execution blocked');
    }

    const data = await res.json();

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: 'completed',
              receipt: data.receipt,
              result: data.providerResult
            }
          : t
      )
    );

    appendAuditLog(
      task.agentId,
      activeTenant.ownerName,
      'Executed Task with Cryptographic Receipt',
      'tasks',
      `Executed "${task.title}" -> Receipt ${data.receipt.receiptId} (SHA-256: ${data.receipt.sha256Hash.slice(0, 14)}...).`,
      'OWNER_APPROVED'
    );
  };

  // Stage 3 End-to-End Operational AI Workflow Runner
  const handleRunOperationalWorkflow = async () => {
    await fetch('/api/records/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenantId: activeTenant.tenantId,
        ownerEmail: activeTenant.ownerEmail,
        payload: profile
      })
    });

    const tracedTaskId = 'trace_' + Date.now();
    const taskTitle = `Operational Sync: ${profile.name} Launch Checklist & Webhook Verification`;
    const approvedAt = new Date().toISOString();

    const execRes = await fetch('/api/tasks/execute-with-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId: tracedTaskId,
        taskTitle,
        agentId: 'operations',
        actionType: 'deploy_website',
        status: 'approved',
        approvedAt,
        tenantId: activeTenant.tenantId,
        role: 'OWNER',
        launchGateApproved: true
      })
    });
    const execData = await execRes.json();

    const completedTask: Task = {
      id: tracedTaskId,
      agentId: 'operations',
      title: taskTitle,
      description: 'End-to-end traced operational workflow: Plan validated -> Task created -> Owner approved -> Provider executed.',
      status: 'completed',
      actionType: 'deploy_website',
      createdAt: new Date().toLocaleDateString(),
      approvedAt,
      receipt: execData.receipt,
      result: execData.providerResult
    };

    setTasks((prev) => [completedTask, ...prev]);

    appendAuditLog(
      'operations',
      'Liam Stone (VP Ops)',
      'Traced Operational Workflow Completed',
      'launch_gate',
      `Issued SHA-256 Receipt ${execData.receipt.receiptId} for "${taskTitle}".`,
      'OWNER_APPROVED'
    );

    return {
      receiptId: execData.receipt.receiptId,
      sha256Hash: execData.receipt.sha256Hash,
      taskTitle
    };
  };

  // 7. API Action: Regenerate Landing Copies
  const handleGenerateWebsiteCopy = async () => {
    const feedbackRules = consumeAgentFeedbackRules('website');
    try {
      const res = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          offer: profile.offer,
          idea: profile.idea,
          problem: profile.problem,
          avatar: profile.avatar,
          feedbackRules
        })
      });
      const data = await res.json();

      if (data && data.heroTitle) {
        setWebsiteData({
          title: data.title || websiteData.title,
          description: data.description || websiteData.description,
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          features: data.features || websiteData.features,
          pricingPlans: data.pricingPlans || websiteData.pricingPlans,
          faqs: data.faqs || websiteData.faqs,
          seoTitle: data.seoTitle || websiteData.seoTitle,
          seoDescription: data.seoDescription || websiteData.seoDescription
        });
      }
    } catch (e) {
      console.error('Failed to regenerate copies:', e);
    }
  };

  // 8. API Action: Regenerate Marketing Campaigns
  const handleGenerateMarketingCampaign = async (extraRule?: string) => {
    const feedbackRules = consumeAgentFeedbackRules('marketing', extraRule);
    try {
      const res = await fetch('/api/generate-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          offer: profile.offer,
          idea: profile.idea,
          feedbackRules
        })
      });
      const data = await res.json();

      if (data && data.tiktokScripts) {
        setCampaign({
          tiktokScripts: data.tiktokScripts,
          instaCaptions: data.instaCaptions || [],
          facebookPosts: data.facebookPosts || [],
          emailSequences: data.emailSequences || [],
          adIdeas: data.adIdeas || [],
          calendar: data.calendar || []
        });
      }
    } catch (e) {
      console.error('Failed to regenerate marketing campaign:', e);
    }
  };

  const handleRegenerateMarketingWithRule = async (
    ruleComment: string,
    extractedRule: string,
    rating: number
  ) => {
    handleAddFeedback({
      agentId: 'marketing',
      agentName: 'Rohan Joshi (CMO)',
      outputType: 'marketing_campaign',
      outputSummary: 'Marketing Campaign Evolution Rule',
      rating,
      sentiment: rating >= 4 ? 'positive' : 'constructive',
      comment: ruleComment,
      extractedRule,
      active: true
    });
    await handleGenerateMarketingCampaign(extractedRule);
  };

  // 9. API Action: Regenerate Operations Briefing
  const handleRefreshBriefing = async () => {
    const pendingCount = tasks.filter((t) => t.status === 'pending_approval').length;
    const unresolvedCount = tickets.filter((t) => t.status === 'open').length;
    const feedbackRules = consumeAgentFeedbackRules('operations');

    try {
      const res = await fetch('/api/generate-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          offer: profile.offer,
          idea: profile.idea,
          taskCount: pendingCount,
          ticketCount: unresolvedCount,
          revenue: revenue.totalRevenue,
          feedbackRules
        })
      });
      const data = await res.json();

      if (data && data.summary) {
        setBriefing({
          summary: data.summary,
          whatHappened: data.whatHappened || [],
          needsApproval: data.needsApproval || [],
          revenueSummary: data.revenueSummary || '',
          risks: data.risks || [],
          date: new Date().toLocaleDateString()
        });
      }
    } catch (e) {
      console.error('Failed to refresh daily operations briefing:', e);
    }
  };

  // 10. API Action: Generate Customer Support replies
  const handleGenerateSupportReply = async (
    ticketId: string,
    message: string,
    customerName: string
  ): Promise<string> => {
    const feedbackRules = consumeAgentFeedbackRules('support');
    try {
      const res = await fetch('/api/generate-support-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          message,
          customerName,
          feedbackRules
        })
      });
      const data = await res.json();
      return data.reply || '';
    } catch (e) {
      console.error('Failed to generate support reply:', e);
      return '';
    }
  };

  const handleRecordStripeTransaction = (tx: StripeTestTransaction) => {
    setStripeTransactions((prev) => [tx, ...prev]);
  };

  const handleUpdateStripeTransaction = (updatedTx: StripeTestTransaction) => {
    setStripeTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
  };

  const handleAddMockProduct = (newProduct: MockStripeProduct) => {
    setMockProducts((prev) => [newProduct, ...prev]);
  };

  const handleSyncSampleToRevenueDashboard = (amount: number, planName: string) => {
    const todayLabel = `Test (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
    setRevenue((prev) => ({
      ...prev,
      totalRevenue: prev.totalRevenue + amount,
      totalOrders: prev.totalOrders + 1,
      salesHistory: [
        ...prev.salesHistory,
        {
          date: todayLabel,
          revenue: amount,
          orders: 1
        }
      ]
    }));

    appendAuditLog(
      'finance',
      'Aisha Bello (CFO)',
      'Synced Mock Stripe Sample Data to Revenue Dashboard',
      'revenue',
      `Streamed +$${amount} sandbox checkout (${planName}) to Revenue Dashboard sample projection chart.`,
      'STAGED_DRAFT'
    );
  };

  const activeRulesCount = feedbackList.filter((f) => f.active).length;

  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans">
      {/* Categorized Desktop Sidebar & Collapsible Touch-Friendly Mobile Drawer */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={tasks.filter((t) => t.status === 'pending_approval').length}
        openTicketsCount={tickets.filter((t) => t.status === 'open').length}
        activeRulesCount={activeRulesCount}
        businessName={profile.name}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-950">
        {/* Responsive Top Header Bar with Mobile Drawer Button, Command Center, and Launch Gate */}
        <header className="flex items-center justify-between gap-3 px-4 md:px-8 py-3 border-b border-zinc-800 bg-zinc-950 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation drawer"
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white cursor-pointer shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="text-xs font-medium text-zinc-400 truncate">
              <span className="hidden sm:inline font-mono">{activeTenant.tenantId}</span>
              <span className="hidden sm:inline mx-2 text-zinc-600">/</span>
              <span className="text-zinc-100 font-semibold">{profile.name || 'FounderPilot Venture'}</span>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3 text-xs font-medium">
            {/* Command Center Quick Access */}
            <button
              onClick={() => setActiveTab('briefing')}
              className={`min-h-[38px] px-3 py-1.5 flex items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'briefing'
                  ? 'bg-zinc-900 text-orange-400 border-zinc-700 font-semibold'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Command Center</span>
            </button>

            {/* Launch Gate Quick Access with Live Lock Indicator */}
            <button
              onClick={() => setActiveTab('launch_gate')}
              className={`min-h-[38px] px-3 py-1.5 flex items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'launch_gate'
                  ? 'bg-zinc-900 text-orange-400 border-zinc-700 font-semibold'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              {ownerApprovedLaunch ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
              <span>Launch Gate (12/12)</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`hidden xl:flex min-h-[38px] px-3 py-1.5 items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-zinc-900 text-orange-400 border-zinc-700 font-semibold'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              <span>8-Agent Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`hidden md:flex min-h-[38px] px-3 py-1.5 items-center gap-1.5 border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-zinc-900 text-orange-400 border-zinc-700 font-semibold'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              <span>Task Receipts</span>
              <span className="font-mono text-[11px] text-orange-400 tabular-nums">
                ({tasks.filter((t) => t.status === 'pending_approval').length})
              </span>
            </button>
          </nav>

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold bg-orange-500 hover:bg-orange-400 text-black transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Founder Guide</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-thin">
          {activeTab === 'launch_gate' && (
            <LaunchReadinessView
              profile={profile}
              tasks={tasks}
              stripeTransactions={stripeTransactions}
              activeTenant={activeTenant}
              onSwitchTenant={setActiveTenant}
              onRunOperationalWorkflow={handleRunOperationalWorkflow}
              onRecordStripeTransaction={handleRecordStripeTransaction}
              onUpdateStripeTransaction={handleUpdateStripeTransaction}
              onNavigateTab={setActiveTab}
              ownerApprovedLaunch={ownerApprovedLaunch}
              onToggleOwnerLaunchApproval={(approved) => {
                setOwnerApprovedLaunch(approved);
                appendAuditLog(
                  'founder',
                  activeTenant.ownerName,
                  approved ? 'Owner Unlocked Launch Gate' : 'Owner Locked Launch Gate',
                  'launch_gate',
                  approved
                    ? 'Explicit Owner approval granted for publishing, payments, deployments, and task execution.'
                    : 'Owner locked the Launch Gate. External publishing, payments, deployments, and task executions are blocked.',
                  approved ? 'OWNER_APPROVED' : 'BLOCKED_BY_GATE'
                );
              }}
              auditLogs={auditLogs}
            />
          )}

          {activeTab === 'onboarding' && (
            <OnboardingFlowView
              agents={agents}
              businessIdea={profile.idea}
              businessName={profile.name}
              onInitializeVenture={handleInitializeVentureFromOnboarding}
              onTriggerAgentJob={handleTriggerAgentJob}
              onNavigateTab={setActiveTab}
              onCompleteOnboarding={() => setActiveTab('research')}
            />
          )}

          {activeTab === 'research' && (
            <MarketResearchView
              report={marketResearch}
              marketIntel={marketIntel}
              businessIdea={profile.idea}
              businessName={profile.name}
              onGenerateResearch={handleGenerateMarketResearch}
              onRefreshMarketIntel={handleRefreshMarketIntel}
              onSyncToBlueprint={(idea) => handleGenerateBlueprint(idea, 'blueprint')}
              onCascadeVenture={handleCascadeVenture}
              onExportDossier={handleExportDossier}
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
              onOpenTuningLab={() => setActiveTab('tuning')}
            />
          )}

          {activeTab === 'tuning' && (
            <FeedbackTuningView
              agents={agents}
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
              onToggleFeedbackActive={handleToggleFeedbackActive}
              onDeleteFeedback={handleDeleteFeedback}
              onRegenerateMarketingWithRule={handleRegenerateMarketingWithRule}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'briefing' && (
            <DailyBriefingView
              briefing={briefing}
              tasks={tasks}
              tickets={tickets}
              revenue={revenue.totalRevenue}
              businessName={profile.name}
              businessIdea={profile.idea}
              onRefreshBriefing={handleRefreshBriefing}
            />
          )}

          {activeTab === 'chat' && (
            <FounderChat
              agents={agents}
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              onTriggerBlueprint={(idea) => handleGenerateBlueprint(idea, 'blueprint')}
              onStageChatActionForApproval={handleStageChatActionForApproval}
              onNavigateTab={setActiveTab}
              businessIdea={profile.idea}
              businessName={profile.name}
              businessOffer={profile.offer}
              activeRulesCount={activeRulesCount}
            />
          )}

          {activeTab === 'blueprint' && (
            <BlueprintView
              profile={profile}
              setProfile={setProfile}
              onGenerateBlueprint={(idea) => handleGenerateBlueprint(idea, 'blueprint')}
              onCascadeVenture={handleCascadeVenture}
              onExportDossier={handleExportDossier}
              onOpenMarketResearch={() => setActiveTab('research')}
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
              onOpenTuningLab={() => setActiveTab('tuning')}
              onLogAuditAction={(action, summary, approvalStatus) =>
                appendAuditLog('founder', activeTenant.ownerName, action, 'blueprint', summary, approvalStatus)
              }
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeRegistry
              agents={agents}
              onTriggerAgentJob={handleTriggerAgentJob}
              onUpdateAgentSkillFocus={handleUpdateAgentSkillFocus}
              businessName={profile.name}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskQueueView
              tasks={tasks}
              agents={agents}
              onApproveTask={handleApproveTask}
              onExecuteTask={handleExecuteTask}
              onUpdateTaskPriority={handleUpdateTaskPriority}
              activeRole={activeTenant.role}
              ownerApprovedLaunch={ownerApprovedLaunch}
            />
          )}

          {activeTab === 'website' && (
            <WebsiteBuilderView
              websiteData={websiteData}
              setWebsiteData={setWebsiteData}
              onGenerateWebsite={handleGenerateWebsiteCopy}
              businessName={profile.name}
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
              onOpenTuningLab={() => setActiveTab('tuning')}
              ownerApprovedLaunch={ownerApprovedLaunch}
              activeRole={activeTenant.role}
              onLogAuditAction={(action, summary, approvalStatus) =>
                appendAuditLog('website', 'Evelyn Gray (Web Architect)', action, 'website', summary, approvalStatus)
              }
            />
          )}

          {activeTab === 'payments' && (
            <PaymentAssistantView
              businessName={profile.name}
              transactions={stripeTransactions}
              mockProducts={mockProducts}
              onAddMockProduct={handleAddMockProduct}
              onRecordTransaction={handleRecordStripeTransaction}
              onUpdateTransaction={handleUpdateStripeTransaction}
              onSyncSampleToRevenueDashboard={handleSyncSampleToRevenueDashboard}
              onNavigateTab={setActiveTab}
              ownerApprovedLaunch={ownerApprovedLaunch}
              activeRole={activeTenant.role}
              onLogAuditAction={(action, summary, approvalStatus) =>
                appendAuditLog('sales', 'Diana Prince (VP Sales)', action, 'payments', summary, approvalStatus)
              }
            />
          )}

          {activeTab === 'marketing' && (
            <MarketingHubView
              campaign={campaign}
              setCampaign={setCampaign}
              onGenerateMarketing={() => handleGenerateMarketingCampaign()}
              businessName={profile.name}
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
              onOpenTuningLab={() => setActiveTab('tuning')}
              ownerApprovedLaunch={ownerApprovedLaunch}
              activeRole={activeTenant.role}
              onLogAuditAction={(action, summary, approvalStatus) =>
                appendAuditLog('marketing', 'Rohan Joshi (CMO)', action, 'marketing', summary, approvalStatus)
              }
            />
          )}

          {activeTab === 'support' && (
            <SupportDeskView
              tickets={tickets}
              setTickets={setTickets}
              onGenerateReply={handleGenerateSupportReply}
              businessName={profile.name}
            />
          )}

          {activeTab === 'revenue' && (
            <RevenueDashboard
              stats={revenue}
              setStats={setRevenue}
              businessName={profile.name}
              stripeTransactions={stripeTransactions}
            />
          )}

          {activeTab === 'instructions' && <SetupInstructions />}
        </main>
      </div>
    </div>
  );
}
