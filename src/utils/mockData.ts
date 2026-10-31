import {
  Task,
  Ticket,
  RevenueStats,
  WebsiteData,
  MarketingCampaign,
  MarketResearchReport,
  AgentFeedback
} from '../types';

export const getInitialTasks = (businessName: string): Task[] => [
  {
    id: 't1',
    agentId: 'ceo',
    title: 'Finalize Pricing Tiers',
    description: 'Establish standard pricing models inside Stripe checkout and match products inside the Revenue Dashboard.',
    status: 'pending_approval',
    actionType: 'add_product',
    createdAt: new Date().toLocaleDateString()
  },
  {
    id: 't2',
    agentId: 'website',
    title: 'Deploy Optimized Landing Page Copy',
    description: `Deploy custom-designed headers, features, pricing tables, and SEO meta tags generated for ${businessName || 'your business'}.`,
    status: 'pending_approval',
    actionType: 'deploy_website',
    createdAt: new Date().toLocaleDateString()
  },
  {
    id: 't3',
    agentId: 'marketing',
    title: 'Schedule Viral Tiktok Campaign',
    description: 'Approve and queue the "Solo Founder Secret" viral script to publish automatically on Monday.',
    status: 'pending_approval',
    actionType: 'publish_post',
    createdAt: new Date().toLocaleDateString()
  },
  {
    id: 't4',
    agentId: 'support',
    title: 'Establish Support Macro Responses',
    description: 'Verify and load canned help macros to handle high-frequency incoming user queries autonomously.',
    status: 'pending_approval',
    actionType: 'support_reply',
    createdAt: new Date().toLocaleDateString()
  }
];

export const getInitialTickets = (businessName: string): Ticket[] => [
  {
    id: 'tk1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sjenkins@gmail.com',
    message: `Hi there! I am interested in checking out your upcoming launch of ${businessName || 'your business'}. Do you offer a free sandbox mode or a trial tier for early testers?`,
    status: 'open',
    createdAt: new Date().toLocaleDateString()
  },
  {
    id: 'tk2',
    customerName: 'David Miller',
    customerEmail: 'david.m@innovatelabs.io',
    message: `Hello! Our marketing agency needs custom API access and volume invoices for the enterprise package. Who can we contact to discuss customized integrations?`,
    status: 'open',
    createdAt: new Date().toLocaleDateString()
  }
];

export const getInitialRevenueStats = (): RevenueStats => {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  });

  return {
    totalRevenue: 2840,
    totalOrders: 36,
    conversionRate: 3.2,
    totalCustomers: 32,
    salesHistory: [
      { date: dates[0], amount: 120, orderCount: 2 },
      { date: dates[1], amount: 240, orderCount: 3 },
      { date: dates[2], amount: 180, orderCount: 2 },
      { date: dates[3], amount: 490, orderCount: 6 },
      { date: dates[4], amount: 620, orderCount: 8 },
      { date: dates[5], amount: 390, orderCount: 5 },
      { date: dates[6], amount: 800, orderCount: 10 }
    ]
  };
};

export const getInitialWebsiteData = (businessName: string): WebsiteData => ({
  title: `Empower Your Brand with ${businessName || 'FounderPilot'}`,
  description: 'Deploy state-of-the-art AI employees to handle code creation, social copy generation, and checkout streams instantly.',
  heroTitle: `Scale Solo Without Hiring Real Human Teams`,
  heroSubtitle: 'The ultimate operating system built for modern creators, digital freelancers, and high-velocity solo developers.',
  features: [
    { title: 'Autopilot Co-Founder', description: 'Our custom-designed Sarah CEO agent runs automated background workflows.', icon: 'Cpu' },
    { title: 'Instant Stripe Setup', description: 'Configure live checkouts and sandboxes in less than 3 minutes flat.', icon: 'Zap' },
    { title: 'Support Macro Desk', description: 'Kenji Support drafts, handles, and archives tickets completely automatically.', icon: 'Shield' }
  ],
  pricingPlans: [
    { name: 'Starter Pack', price: '$19/mo', features: ['Core Employee Roster', '3 Automated Operations', 'Standard Ticket Integration'] },
    { name: 'Growth Professional', price: '$49/mo', features: ['All Employee Access', 'Unlimited Active Tasks', 'Full Custom Web Builder', 'Stripe Integrations'] }
  ],
  faqs: [
    { question: 'Do I need deep programming knowledge?', answer: 'Not at all. FounderPilot OS handles full copywriting, landing page setups, and marketing script loops for you.' },
    { question: 'Is there a setup fee?', answer: 'No, Stripe, Resend, and Supabase offer incredibly generous, pay-as-you-go free tiers.' }
  ],
  seoTitle: `${businessName || 'FounderPilot'} | The Automated Solo Operating System`,
  seoDescription: 'Supercharge your launch timelines, build viral Tiktok scripts, and handle support requests inside an all-in-one centralized command board.'
});

export const getInitialMarketingCampaign = (): MarketingCampaign => ({
  tiktokScripts: [
    {
      title: 'Solo Founder Cheat Code',
      hook: 'I am launching a full SaaS business in exactly 24 hours...',
      body: 'No development team, no copywriters, and zero agencies. I am using FounderPilot OS to spin up my Stripe pricing plans, draft high-converting landing page headings, and layout my social media schedules instantly. It is literally like having 8 elite staff members working in parallel while I focus on the product.',
      callToAction: 'Hit the link in bio to deploy your first AI employee network today.'
    }
  ],
  instaCaptions: [
    'Stop trading hours for dollars. Build a scalable system that drives checkouts while you sleep. Bio link has the cheat code. #solopreneur #indiehackers',
    '8 elite AI staff members working on your business 24/7. That is not science fiction—it is FounderPilot. Try it today.'
  ],
  facebookPosts: [
    'I just completed the blueprint for my upcoming project using customized virtual employees. Here is the exact checklist we executed to launch payments, copy, and support macros in record time...',
    'Question for the community: What is your absolute biggest bottleneck when spinning up new digital products? Here is how automated tools can solve it.'
  ],
  emailSequences: [
    {
      subject: 'Welcome to the future of solo execution',
      body: 'Hi there,\n\nWe designed FounderPilot to prove that solo developers do not need huge venture budgets or expensive human teams to scale. Your autonomous co-founder network is active and waiting for your commands.\n\nBest regards,\nSarah Chen, CEO',
      trigger: 'First signup'
    }
  ],
  adIdeas: [
    {
      hook: 'Automate your entire startup workflow',
      description: 'Create high-converting copies, payment setups, viral marketing guides, and support reply queues in minutes.',
      targeting: 'Digital Creators, Founders, Freelancers, Software Engineers'
    }
  ],
  calendar: [
    { id: 'm1', day: 'Monday', platform: 'TikTok', content: 'Publish "Solo Founder Cheat Code" script walk-through video', status: 'draft' },
    { id: 'm2', day: 'Tuesday', platform: 'Instagram', content: 'Post aesthetic command dashboard teaser with Bio Link CTA', status: 'draft' },
    { id: 'm3', day: 'Wednesday', platform: 'Email', content: 'Broadcast Day 1 Welcome sequence email to active users', status: 'draft' }
  ]
});

export const getInitialMarketResearch = (idea?: string, businessName?: string): MarketResearchReport => {
  const resolvedIdea = idea || 'Autonomous AI workflow & billing copilot for solo SaaS founders and boutique digital agencies';
  const resolvedName = businessName || 'FounderPilot OS';

  return {
    idea: resolvedIdea,
    businessName: resolvedName,
    executiveSummary: `CEO Intelligence Assessment for "${resolvedIdea}": The solo-founder and micro-agency automation sector is experiencing rapid structural expansion driven by lean software operators replacing fragmented point tools ($400+/mo stack) with unified multi-agent operating systems. While horizontal automation platforms dominate enterprise workflows, a high-margin wedge exists for an opinionated, verticalized AI co-founder platform that unifies GTM copywriting, Stripe monetization, and customer support triage out of the box.`,
    marketSize: {
      tam: '$48.4B Global SMB & Solo-Creator Workflow Automation Market',
      sam: '$6.8B Solo SaaS Founders, Indie Hackers & Micro-Agencies (1–5 seats)',
      som: '$142M Year-1–3 Capturable Beachhead (38,000 Pro/Agency subscribers at $79–$299/mo)',
      cagr: '29.4% YoY (2026–2030)',
      targetSegment: 'Technical solo founders, bootstrapped B2B SaaS operators, and productized service agencies generating $2k–$50k MRR.',
      methodology: 'Bottom-up sizing combining global Stripe Atlas / indie SaaS registrations (~1.4M active micro-ventures) with average software tool spend ($310/mo).'
    },
    competitors: [
      {
        name: 'Zapier / Make Enterprise',
        category: 'Horizontal Workflow Glue',
        marketShare: '34% Segment Share',
        pricing: '$49 – $399/mo (Usage-gated)',
        strengths: [
          '6,000+ third-party webhook and app connectors',
          'High brand trust and entrenched developer ecosystem',
          'Reliable multi-step trigger execution'
        ],
        weaknesses: [
          'Zero native strategic intelligence or autonomous copy generation',
          'Steep configuration fatigue; requires manual node-by-node wiring',
          'Punitive task-based pricing spikes during viral launch campaigns'
        ]
      },
      {
        name: 'Jasper / Copy.ai Studio',
        category: 'AI Marketing & Content Point Tool',
        marketShare: '21% Segment Share',
        pricing: '$49 – $125/seat/mo',
        strengths: [
          'Polished multi-channel marketing templates and brand voice controls',
          'Strong enterprise marketing team collaboration workflows'
        ],
        weaknesses: [
          'Disconnected from live Stripe revenue, product packaging, and support tickets',
          'Produces generic copy without CEO-level business blueprint context',
          'Too expensive and bloated for a 1-person bootstrapped operator'
        ]
      },
      {
        name: 'Notion AI + Custom GPT Wrappers',
        category: 'DIY Knowledge & Prompt Workspace',
        marketShare: '28% Segment Share',
        pricing: '$20 – $60/mo combined',
        strengths: [
          'Low entry cost and flexible blank-canvas documentation',
          'Familiar interface for early ideation and note-taking'
        ],
        weaknesses: [
          'Blank-page paralysis; founder must engineer every prompt manually',
          'No structured task approval queue, landing page deployer, or feedback tuning loop',
          'No closed-loop reinforcement learning from founder ratings'
        ]
      }
    ],
    marketGaps: [
      {
        title: 'Closed-Loop Feedback Fine-Tuning Per Venture',
        opportunityScore: '9.4 / 10 Impact',
        description: 'Existing AI tools treat every prompt as stateless. Solo founders waste hours repeating brand constraints, tone rules, and pricing positioning across sessions.',
        strategicWedge: 'Persist founder ratings (1–5 stars) and natural-language critiques to automatically synthesize durable fine-tuning rules injected into every subsequent agent run.'
      },
      {
        title: 'Unified Blueprint-to-Checkout Execution Pipeline',
        opportunityScore: '9.1 / 10 Impact',
        description: 'Founders currently stitch together 6+ tools (ChatGPT for ideation, Webflow for landing pages, Stripe for billing, Intercom for support, Buffer for social).',
        strategicWedge: 'Single-click propagation from CEO Business Blueprint directly into pre-wired Website Builder copy, Stripe pricing tiers, and 7-day viral social scripts.'
      },
      {
        title: 'Human-in-the-Loop Executive Approval Queue',
        opportunityScore: '8.7 / 10 Impact',
        description: 'Founders distrust fully autonomous black-box agents that publish unvetted social posts or reply to customers without oversight.',
        strategicWedge: 'Stage all AI employee deliverables inside a central Task Approval Queue where the founder approves and executes actions with one click.'
      }
    ],
    strategicRecommendations: [
      {
        phase: 'Phase 1 · Days 1–30 (Beachhead Wedge)',
        action: 'Position around "Launch in 24 Hours with 8 AI Employees" targeting solo technical builders who hate marketing and support overhead.',
        expectedImpact: '3.8%+ landing page conversion rate and sub-$45 CAC via organic TikTok/LinkedIn build-in-public demos.'
      },
      {
        phase: 'Phase 2 · Days 31–60 (Retention & Expansion)',
        action: 'Lock in switching costs via the Agent Feedback & Fine-Tuning Engine—the more a founder rates outputs, the smarter their custom staff becomes.',
        expectedImpact: 'Reduces 90-day churn by ~38% and drives 42% upgrade conversion from Starter ($29) to Growth Pro ($79).'
      },
      {
        phase: 'Phase 3 · Days 61–90 (High-Ticket Monetization)',
        action: 'Introduce multi-venture Agency Workspaces ($249/mo) allowing boutique studios to clone tuned AI employee rosters across client brands.',
        expectedImpact: 'Expands blended ARPU from $54/mo to $118/mo.'
      }
    ],
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

export const getInitialFeedbackList = (): AgentFeedback[] => [
  {
    id: 'fb_1',
    agentId: 'marketing',
    agentName: 'Rohan Joshi (CMO)',
    outputType: 'marketing_campaign',
    outputSummary: 'TikTok & Email Launch Campaign v1',
    rating: 4,
    sentiment: 'constructive',
    comment: 'Lead every TikTok hook with a concrete time-or-dollar metric (e.g., "$4,200 saved" or "24 hours") and replace generic hype words with proof-driven B2B language.',
    extractedRule: 'Always anchor hooks and email subjects with specific quantitative metrics ($ saved, hours reduced, % conversion lift) and eliminate generic buzzwords.',
    active: true,
    appliedCount: 3,
    createdAt: 'Today, 09:15 AM'
  },
  {
    id: 'fb_2',
    agentId: 'ceo',
    agentName: 'Sarah Chen (CEO)',
    outputType: 'market_research',
    outputSummary: 'Market Research & Competitor Matrix',
    rating: 5,
    sentiment: 'positive',
    comment: 'Excellent bottom-up SAM/SOM calculation. Keep emphasizing high-margin bootstrapped wedges rather than venture-scale burn strategies.',
    extractedRule: 'Prioritize capital-efficient, bootstrapped B2B wedges with immediate 30-day payback periods over high-burn enterprise sales motions.',
    active: true,
    appliedCount: 4,
    createdAt: 'Today, 10:02 AM'
  },
  {
    id: 'fb_3',
    agentId: 'website',
    agentName: 'Evelyn Gray (Web Architect)',
    outputType: 'website_copy',
    outputSummary: 'Hero Section & Pricing Tier Copy',
    rating: 4,
    sentiment: 'constructive',
    comment: 'Make the Hero Headline speak directly to the cost of hiring human agencies vs. deploying AI staff in under 10 minutes.',
    extractedRule: 'Frame landing page headlines around speed-to-value (under 10 minutes) and direct cost comparison against $5,000/mo human retainers.',
    active: true,
    appliedCount: 2,
    createdAt: 'Today, 10:40 AM'
  }
];
