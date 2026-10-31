import React, { useState, useEffect } from 'react';
import {
  Agent,
  AgentId,
  BusinessProfile,
  Task,
  WebsiteData,
  MarketingCampaign,
  Ticket,
  Briefing,
  RevenueStats,
  ChatMessage,
  MarketResearchReport,
  AgentFeedback
} from './types';
import { DEFAULT_AGENTS } from './data/agents';
import {
  getInitialTasks,
  getInitialTickets,
  getInitialRevenueStats,
  getInitialWebsiteData,
  getInitialMarketingCampaign,
  getInitialMarketResearch,
  getInitialFeedbackList
} from './utils/mockData';

// Modular Views Imports
import Sidebar from './components/Sidebar';
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
import { Compass, Sliders, Layers } from 'lucide-react';

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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('research');

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

  const [agents, setAgents] = useState<Agent[]>(() => {
    const cached = localStorage.getItem('fp_agents');
    return cached ? JSON.parse(cached) : DEFAULT_AGENTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const cached = localStorage.getItem('fp_tasks');
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
            'FounderPilot OS is operational. CEO Sarah Chen has compiled your initial Market Research Report, and 3 founder fine-tuning directives are active across your AI employee roster.',
          whatHappened: [
            'Compiled TAM/SAM/SOM market sizing & 3-competitor strength/weakness matrix',
            'Activated closed-loop feedback fine-tuning for CEO, Marketing, and Website agents'
          ],
          needsApproval: [
            'Review and approve initial launch tasks in the Task Approval Queue'
          ],
          revenueSummary: 'Simulated Stripe pipeline active ($2,840 tracked across 36 orders).',
          risks: ['Stripe Sandbox Mode Active: Real financial checkouts are blocked until live keys are connected.'],
          date: new Date().toLocaleDateString()
        };
  });

  // Sync state to local storage on modification
  useEffect(() => {
    localStorage.setItem('fp_profile_v2', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fp_market_research_v1', JSON.stringify(marketResearch));
  }, [marketResearch]);

  useEffect(() => {
    localStorage.setItem('fp_feedback_v1', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('fp_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('fp_tasks', JSON.stringify(tasks));
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

  // Helper: Get active fine-tuning rules for an agent and increment applied counter
  const consumeAgentFeedbackRules = (agentId: AgentId, extraRule?: string): string[] => {
    const activeItems = feedbackList.filter((f) => f.agentId === agentId && f.active);
    const rules = activeItems.map((f) => f.extractedRule);
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

  // Feedback Management Handlers
  const handleAddFeedback = (newEntry: Omit<AgentFeedback, 'id' | 'createdAt' | 'appliedCount'>) => {
    const created: AgentFeedback = {
      ...newEntry,
      id: 'fb_' + Date.now(),
      appliedCount: 1,
      createdAt: 'Just now'
    };
    setFeedbackList((prev) => [created, ...prev]);

    // Also update the agent's visible system prompt in EmployeeRegistry so the user sees the learned rule reflected there too
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

  // 1. API Action: CEO Market Research Report
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
      }
    } catch (e) {
      console.error('Failed to generate market research:', e);
    }
  };

  // 2. API Action: Send Message in Co-founder Chat
  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setChatHistory((prev) => [...prev, newUserMsg]);
    const feedbackRules = consumeAgentFeedbackRules('ceo');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory, feedbackRules })
      });
      const data = await res.json();

      const newAgentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ceo',
        text: data.text || 'Understood. Let me guide our staff.',
        timestamp: new Date().toISOString()
      };

      setChatHistory((prev) => [...prev, newAgentMsg]);

      if (!profile.idea && text.length > 15) {
        setProfile((prev) => ({ ...prev, idea: text }));
      }
    } catch (e) {
      console.error('Failed to communicate with chat proxy:', e);
    }
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
        setProfile({
          idea: ideaText,
          name: data.name,
          offer: data.offer,
          avatar: data.avatar,
          problem: data.problem,
          products: data.products || [],
          checklist: data.checklist || [],
          tools: data.tools || []
        });

        setTasks(getInitialTasks(data.name));
        setTickets(getInitialTickets(data.name));
        setWebsiteData(getInitialWebsiteData(data.name));

        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ceo',
          text: `I have compiled our complete Business Blueprint under the title: **${data.name}**. I have also dispatched the launch roadmap checklist to Marcus, Evelyn, Kenji, and Rohan.`,
          timestamp: new Date().toISOString()
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

  // Combined Onboarding Venture Initializer (runs both Market Research + Blueprint)
  const handleInitializeVentureFromOnboarding = async (ideaText: string) => {
    await handleGenerateMarketResearch(ideaText);
    await handleGenerateBlueprint(ideaText, '');
  };

  // 4. API Action: AI Employee trigger autonomous background work
  const handleTriggerAgentJob = async (agentId: AgentId, jobType: string) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: 'working' } : a)));

    await new Promise((resolve) => setTimeout(resolve, 1000));

    let newTaskTitle = '';
    let newTaskDesc = '';
    let newTaskAction: Task['actionType'] = 'general';

    switch (jobType) {
      case 'align_roadmap':
        newTaskTitle = 'Sarah Roadmap & Market Wedge Sync';
        newTaskDesc = 'CEO Sarah Chen audited TAM/SAM/SOM research and launch readiness. Ready for approval.';
        newTaskAction = 'general';
        break;
      case 'pro_packaging':
        newTaskTitle = 'Marcus Pro Tier Feature Mapping';
        newTaskDesc = 'Product VP Marcus Vance outlined tiered deliverables for our $79/mo Growth Pro Suite.';
        newTaskAction = 'add_product';
        break;
      case 'seo_audit':
        newTaskTitle = 'Evelyn Landing Page SEO Alignment';
        newTaskDesc = 'Web Architect Evelyn Gray optimized hero conversion copy and meta tags.';
        newTaskAction = 'deploy_website';
        break;
      case 'email_campaign':
        newTaskTitle = 'Rohan Fine-Tuned Launch Broadcast';
        newTaskDesc = 'CMO Rohan Joshi drafted ROI-calibrated onboarding emails ready for Resend.';
        newTaskAction = 'send_email';
        break;
      case 'sandbox_payment':
        newTaskTitle = 'Diana Stripe Checkout Creation';
        newTaskDesc = 'Sales VP Diana Prince compiled checkout session hooks for Starter and Pro tiers.';
        newTaskAction = 'stripe_setup';
        break;
      case 'faq_center':
        newTaskTitle = 'Kenji Support Macro Compilation';
        newTaskDesc = 'Head of Support Kenji Sato compiled rapid-response customer service macros.';
        newTaskAction = 'support_reply';
        break;
      case 'finance_projections':
        newTaskTitle = 'Aisha Unit Economics Model';
        newTaskDesc = 'CFO Aisha Bello drafted 90-day MRR and CAC payback projections.';
        newTaskAction = 'general';
        break;
      case 'preflight_deploy':
        newTaskTitle = 'Liam Preflight DNS & DB Check';
        newTaskDesc = 'Operations VP Liam Stone completed Supabase schema and domain verification.';
        newTaskAction = 'general';
        break;
    }

    const newTask: Task = {
      id: 'at_' + Date.now(),
      agentId,
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'pending_approval',
      actionType: newTaskAction,
      createdAt: new Date().toLocaleDateString()
    };

    setTasks((prev) => [newTask, ...prev]);
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: 'idle' } : a)));
  };

  // 5. Action: Approve a Task
  const handleApproveTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'approved' } : t))
    );
  };

  // 6. Action: Execute Approved Task
  const handleExecuteTask = async (taskId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
    );

    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      if (task.actionType === 'deploy_website') {
        setRevenue((prev) => ({
          ...prev,
          conversionRate: parseFloat((prev.conversionRate + 0.4).toFixed(1))
        }));
      } else if (task.actionType === 'publish_post') {
        setRevenue((prev) => ({
          ...prev,
          totalRevenue: prev.totalRevenue + 120,
          totalOrders: prev.totalOrders + 2
        }));
      }
    }
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

  // Handler used by FeedbackTuningView to apply a marketing example rule & regenerate campaign live
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

  const activeRulesCount = feedbackList.filter((f) => f.active).length;

  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans">
      {/* Central Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={tasks.filter((t) => t.status === 'pending_approval').length}
        openTicketsCount={tickets.filter((t) => t.status === 'open').length}
        activeRulesCount={activeRulesCount}
        businessName={profile.name}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-zinc-950">
        {/* Clean Workspace Top Bar Contract */}
        <header className="flex items-center justify-between gap-8 px-8 py-3.5 border-b border-zinc-800 bg-zinc-950 shrink-0">
          <div className="text-xs font-medium text-zinc-400 truncate">
            <span>Workspace</span>
            <span className="mx-2 text-zinc-600">/</span>
            <span className="text-zinc-100 font-semibold">{profile.name || 'FounderPilot Venture'}</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <button
              onClick={() => setActiveTab('onboarding')}
              className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'onboarding' ? 'text-orange-400 font-semibold' : ''
              }`}
            >
              Onboarding Tour
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'research' ? 'text-orange-400 font-semibold' : ''
              }`}
            >
              Market Research
            </button>
            <button
              onClick={() => setActiveTab('tuning')}
              className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'tuning' ? 'text-orange-400 font-semibold' : ''
              }`}
            >
              Feedback & Tuning ({activeRulesCount})
            </button>
            <button
              onClick={() => setActiveTab('marketing')}
              className={`hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'marketing' ? 'text-orange-400 font-semibold' : ''
              }`}
            >
              Marketing Hub
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="px-3.5 py-1.5 text-xs font-semibold bg-orange-500 hover:bg-orange-400 text-black transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Founder Guide
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin">
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
              businessIdea={profile.idea}
              businessName={profile.name}
              onGenerateResearch={handleGenerateMarketResearch}
              onSyncToBlueprint={(idea) => handleGenerateBlueprint(idea, 'blueprint')}
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
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              onTriggerBlueprint={(idea) => handleGenerateBlueprint(idea, 'blueprint')}
              businessIdea={profile.idea}
            />
          )}

          {activeTab === 'blueprint' && (
            <BlueprintView
              profile={profile}
              setProfile={setProfile}
              onGenerateBlueprint={(idea) => handleGenerateBlueprint(idea, 'blueprint')}
              onOpenMarketResearch={() => setActiveTab('research')}
              feedbackList={feedbackList}
              onAddFeedback={handleAddFeedback}
              onOpenTuningLab={() => setActiveTab('tuning')}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeRegistry
              agents={agents}
              onTriggerAgentJob={handleTriggerAgentJob}
              businessName={profile.name}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskQueueView
              tasks={tasks}
              agents={agents}
              onApproveTask={handleApproveTask}
              onExecuteTask={handleExecuteTask}
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
            />
          )}

          {activeTab === 'payments' && (
            <PaymentAssistantView businessName={profile.name} />
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
            />
          )}

          {activeTab === 'instructions' && <SetupInstructions />}
        </main>
      </div>
    </div>
  );
}
