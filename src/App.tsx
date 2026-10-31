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
  ChatMessage
} from './types';
import { DEFAULT_AGENTS } from './data/agents';
import {
  getInitialTasks,
  getInitialTickets,
  getInitialRevenueStats,
  getInitialWebsiteData,
  getInitialMarketingCampaign
} from './utils/mockData';

// Modular Views Imports
import Sidebar from './components/Sidebar';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('briefing');

  // Core Orchestration States with LocalStorage Persistence
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const cached = localStorage.getItem('fp_profile');
    return cached
      ? JSON.parse(cached)
      : { idea: '', name: '', offer: '', avatar: '', problem: '', products: [], checklist: [], tools: [] };
  });

  const [agents, setAgents] = useState<Agent[]>(() => {
    const cached = localStorage.getItem('fp_agents');
    return cached ? JSON.parse(cached) : DEFAULT_AGENTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const cached = localStorage.getItem('fp_tasks');
    return cached ? JSON.parse(cached) : [];
  });

  const [websiteData, setWebsiteData] = useState<WebsiteData>(() => {
    const cached = localStorage.getItem('fp_website');
    return cached ? JSON.parse(cached) : getInitialWebsiteData('');
  });

  const [campaign, setCampaign] = useState<MarketingCampaign>(() => {
    const cached = localStorage.getItem('fp_campaign');
    return cached ? JSON.parse(cached) : getInitialMarketingCampaign();
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const cached = localStorage.getItem('fp_tickets');
    return cached ? JSON.parse(cached) : [];
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
          summary: 'FounderPilot OS is fully booted. Enter your venture description inside Co-Founder Chat to deploy staff agents.',
          whatHappened: ['System operational, awaiting strategic directions.'],
          needsApproval: [],
          revenueSummary: 'Sandbox mode active.',
          risks: ['Stripe Sandbox Mode Active: Real financial checkouts are blocked.'],
          date: new Date().toLocaleDateString()
        };
  });

  // Sync state to local storage on modification
  useEffect(() => {
    localStorage.setItem('fp_profile', JSON.stringify(profile));
  }, [profile]);

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

  // 1. API Action: Send Message in Co-founder Chat
  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setChatHistory((prev) => [...prev, newUserMsg]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistory })
      });
      const data = await res.json();

      const newAgentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ceo',
        text: data.text || 'Understood. Let me guide our staff.',
        timestamp: new Date().toISOString()
      };

      setChatHistory((prev) => [...prev, newAgentMsg]);

      // If the founder describes an idea and no business profile has been generated yet, save the idea parameter
      if (!profile.idea && text.length > 15) {
        setProfile((prev) => ({ ...prev, idea: text }));
      }
    } catch (e) {
      console.error('Failed to communicate with chat proxy:', e);
    }
  };

  // 2. API Action: Auto-Generate Business Blueprint
  const handleGenerateBlueprint = async (ideaText: string) => {
    try {
      const res = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: ideaText })
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

        // Initialize lists
        setTasks(getInitialTasks(data.name));
        setTickets(getInitialTickets(data.name));
        setWebsiteData(getInitialWebsiteData(data.name));

        // Create Welcome Chat Message from Sarah
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'ceo',
          text: `🎯 Phenomenal! I have compiled our complete Business Blueprint under the title: **${data.name}**. I've also dispatched the launch roadmap checklist to Marcus, Evelyn, Kenji, and Rohan. Head to the **Task Queue** to authorize our initial setup tasks.`,
          timestamp: new Date().toISOString()
        };
        setChatHistory((prev) => [...prev, welcomeMessage]);
        setActiveTab('blueprint');
      }
    } catch (e) {
      console.error('Failed to compile blueprint:', e);
    }
  };

  // 3. API Action: AI Employee trigger autonomous background work
  const handleTriggerAgentJob = async (agentId: AgentId, jobType: string) => {
    // Set agent status to working
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: 'working' } : a)));

    await new Promise((resolve) => setTimeout(resolve, 2000)); // simulate thinking

    let newTaskTitle = '';
    let newTaskDesc = '';
    let newTaskAction: Task['actionType'] = 'general';

    switch (jobType) {
      case 'align_roadmap':
        newTaskTitle = 'Sarah Roadmap Sync';
        newTaskDesc = 'CEO Sarah Chen has audited launch readiness. Final custom domain connection recommended.';
        newTaskAction = 'general';
        break;
      case 'pro_packaging':
        newTaskTitle = 'Marcus Feature Mapping';
        newTaskDesc = 'Product Agent Marcus Vance has outlined tiered deliverables for our Pro Suite.';
        newTaskAction = 'add_product';
        break;
      case 'seo_audit':
        newTaskTitle = 'Evelyn SEO Alignment';
        newTaskDesc = 'Web Agent Evelyn Gray audited landing copies. Recommend compiling title elements.';
        newTaskAction = 'deploy_website';
        break;
      case 'email_campaign':
        newTaskTitle = 'Rohan Welcoming Broadcast';
        newTaskDesc = 'CMO Rohan Joshi drafted onboarding emails. Ready to broadcast to Resend mail hook.';
        newTaskAction = 'send_email';
        break;
      case 'sandbox_payment':
        newTaskTitle = 'Diana Sandbox Creation';
        newTaskDesc = 'Sales Agent Diana Prince compiled checkout hooks. Verify products inside Stripe dashboard.';
        newTaskAction = 'stripe_setup';
        break;
      case 'faq_center':
        newTaskTitle = 'Kenji FAQ Matrix Compilation';
        newTaskDesc = 'CS Agent Kenji Sato compiled customer service sheets. Ready to cache inside support macros.';
        newTaskAction = 'support_reply';
        break;
      case 'finance_projections':
        newTaskTitle = 'Aisha Projections Model';
        newTaskDesc = 'CFO Aisha Bello drafted financial growth parameters. Review accounting files.';
        newTaskAction = 'general';
        break;
      case 'preflight_deploy':
        newTaskTitle = 'Liam Preflight DNS Mapping';
        newTaskDesc = 'Operations Agent Liam Stone completed domain scan. Configure nameserver pointers.';
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

    // Reset status to idle
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: 'idle' } : a)));
  };

  // 4. Action: Approve a Task
  const handleApproveTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'approved' } : t))
    );
  };

  // 5. Action: Execute Approved Task
  const handleExecuteTask = async (taskId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate deployment latency

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'completed' } : t))
    );

    // Dynamic Simulator Side Effects
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      if (task.actionType === 'deploy_website') {
        // Boost conversion rate when website copy is deployed
        setRevenue((prev) => ({
          ...prev,
          conversionRate: parseFloat((prev.conversionRate + 0.4).toFixed(1))
        }));
      } else if (task.actionType === 'publish_post') {
        // Boost orders/traffic when social marketing is published
        setRevenue((prev) => ({
          ...prev,
          totalRevenue: prev.totalRevenue + 120,
          totalOrders: prev.totalOrders + 2
        }));
      }
    }
  };

  // 6. API Action: Regenerate Landing Copies
  const handleGenerateWebsiteCopy = async () => {
    try {
      const res = await fetch('/api/generate-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          offer: profile.offer,
          idea: profile.idea,
          problem: profile.problem,
          avatar: profile.avatar
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

  // 7. API Action: Regenerate Marketing Campaigns
  const handleGenerateMarketingCampaign = async () => {
    try {
      const res = await fetch('/api/generate-marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          offer: profile.offer,
          idea: profile.idea
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

  // 8. API Action: Regenerate Operations Briefing
  const handleRefreshBriefing = async () => {
    const pendingCount = tasks.filter((t) => t.status === 'pending_approval').length;
    const unresolvedCount = tickets.filter((t) => t.status === 'open').length;

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
          revenue: revenue.totalRevenue
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

  // 9. API Action: Generate Customer Support replies
  const handleGenerateSupportReply = async (ticketId: string, message: string, customerName: string): Promise<string> => {
    try {
      const res = await fetch('/api/generate-support-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          message,
          customerName
        })
      });
      const data = await res.json();
      return data.reply || '';
    } catch (e) {
      console.error('Failed to generate support reply:', e);
      return '';
    }
  };

  return (
    <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans">
      {/* Central Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={tasks.filter((t) => t.status === 'pending_approval').length}
        openTicketsCount={tickets.filter((t) => t.status === 'open').length}
        businessName={profile.name}
      />

      {/* Main Execution Work Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-8 scrollbar-thin">
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
            onTriggerBlueprint={handleGenerateBlueprint}
            businessIdea={profile.idea}
          />
        )}

        {activeTab === 'blueprint' && (
          <BlueprintView
            profile={profile}
            setProfile={setProfile}
            onGenerateBlueprint={handleGenerateBlueprint}
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
          />
        )}

        {activeTab === 'payments' && (
          <PaymentAssistantView businessName={profile.name} />
        )}

        {activeTab === 'marketing' && (
          <MarketingHubView
            campaign={campaign}
            setCampaign={setCampaign}
            onGenerateMarketing={handleGenerateMarketingCampaign}
            businessName={profile.name}
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
  );
}
