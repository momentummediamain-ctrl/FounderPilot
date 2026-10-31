import { Task, Ticket, RevenueStats, WebsiteData, MarketingCampaign } from '../types';

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
    'Stop trading hours for dollars. Build a scalable system that drives checkouts while you sleep. Bio link has the cheat code. 💸 #solopreneur #indiehackers',
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
