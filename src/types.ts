export type AgentId =
  | 'ceo'
  | 'product'
  | 'website'
  | 'marketing'
  | 'sales'
  | 'support'
  | 'finance'
  | 'operations';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  avatar: string;
  status: 'idle' | 'thinking' | 'working';
  bio: string;
  prompt: string;
}

export interface BusinessProfile {
  idea: string;
  name: string;
  offer: string;
  avatar: string;
  problem: string;
  products: { name: string; price: string; description: string }[];
  checklist: { id: string; task: string; done: boolean; category: string }[];
  tools: { name: string; purpose: string; cost: string }[];
}

export interface Task {
  id: string;
  agentId: AgentId;
  title: string;
  description: string;
  status: 'pending_approval' | 'approved' | 'completed';
  actionType: 'stripe_setup' | 'publish_post' | 'deploy_website' | 'send_email' | 'add_product' | 'support_reply' | 'general';
  externalPayload?: any;
  result?: string;
  createdAt: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface WebsiteData {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  features: FeatureItem[];
  pricingPlans: PricingPlan[];
  faqs: FaqItem[];
  seoTitle: string;
  seoDescription: string;
}

export interface TiktokScript {
  title: string;
  hook: string;
  body: string;
  callToAction: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  trigger: string;
}

export interface AdIdea {
  hook: string;
  description: string;
  targeting: string;
}

export interface CalendarEvent {
  id: string;
  day: string;
  platform: 'TikTok' | 'Instagram' | 'Facebook' | 'Email' | 'Ad';
  content: string;
  status: 'draft' | 'scheduled' | 'published';
}

export interface MarketingCampaign {
  tiktokScripts: TiktokScript[];
  instaCaptions: string[];
  facebookPosts: string[];
  emailSequences: EmailTemplate[];
  adIdeas: AdIdea[];
  calendar: CalendarEvent[];
}

export interface Ticket {
  id: string;
  customerName: string;
  customerEmail: string;
  message: string;
  status: 'open' | 'resolved';
  draftReply?: string;
  createdAt: string;
}

export interface Briefing {
  summary: string;
  whatHappened: string[];
  needsApproval: string[];
  revenueSummary: string;
  risks: string[];
  date: string;
}

export interface SalesHistoryEntry {
  date: string;
  amount: number;
  orderCount: number;
}

export interface RevenueStats {
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  totalCustomers: number;
  salesHistory: SalesHistoryEntry[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ceo' | 'system' | AgentId;
  text: string;
  timestamp: string;
}
