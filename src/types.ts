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
  customSkillFocus?: string;
  coreObjective?: string;
  nonOverlappingScope?: string;
  deliverables?: string[];
  agentHandoffs?: {
    receivesFrom: string;
    passesTo: string;
    handoffArtifact: string;
  };
  founderInteractionProtocol?: string;
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

export interface CompetitorAnalysis {
  name: string;
  category: string;
  marketShare: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
}

export interface MarketGap {
  title: string;
  opportunityScore: string;
  description: string;
  strategicWedge: string;
}

export interface MarketResearchReport {
  idea: string;
  businessName: string;
  executiveSummary: string;
  marketSize: {
    tam: string;
    sam: string;
    som: string;
    cagr: string;
    targetSegment: string;
    methodology: string;
  };
  competitors: CompetitorAnalysis[];
  marketGaps: MarketGap[];
  strategicRecommendations: {
    phase: string;
    action: string;
    expectedImpact: string;
  }[];
  generatedAt: string;
  citations?: MarketIntelSource[];
  groundingVerified?: boolean;
}

export interface MarketIntelItem {
  headline: string;
  summary: string;
  strategicImplication: string;
  publishedContext: string;
  sourceTitle?: string;
  sourceUrl?: string;
}

export interface MarketIntelSource {
  title: string;
  uri: string;
}

export interface MarketIntelFeed {
  idea: string;
  items: MarketIntelItem[];
  sources: MarketIntelSource[];
  updatedAt: string;
}

export type FeedbackOutputType =
  | 'market_research'
  | 'blueprint'
  | 'marketing_campaign'
  | 'website_copy'
  | 'support_reply'
  | 'ceo_chat';

export interface AgentFeedback {
  id: string;
  agentId: AgentId;
  agentName: string;
  outputType: FeedbackOutputType;
  outputSummary: string;
  rating: number;
  sentiment: 'positive' | 'neutral' | 'constructive';
  comment: string;
  extractedRule: string;
  active: boolean;
  appliedCount: number;
  createdAt: string;
}

export interface ActionReceipt {
  receiptId: string;
  taskId: string;
  taskTitle: string;
  agentId: AgentId;
  actionType: string;
  approvedBy: string;
  approvedAt: string;
  executedAt: string;
  tenantId: string;
  sha256Hash: string;
  verificationStatus: 'VERIFIED_RECEIPT';
}

export type TaskUrgency = 'critical' | 'high' | 'normal' | 'low';

export type StrategicGoalType =
  | 'revenue_acceleration'
  | 'customer_acquisition'
  | 'product_readiness'
  | 'operational_resilience';

export interface Task {
  id: string;
  agentId: AgentId;
  title: string;
  description: string;
  status: 'pending_approval' | 'approved' | 'completed';
  actionType:
    | 'stripe_setup'
    | 'publish_post'
    | 'deploy_website'
    | 'send_email'
    | 'add_product'
    | 'support_reply'
    | 'general';
  urgency?: TaskUrgency;
  strategicGoal?: StrategicGoalType;
  dependsOnTaskIds?: string[];
  customSkillApplied?: string;
  externalPayload?: any;
  result?: string;
  createdAt: string;
  approvedAt?: string;
  receipt?: ActionReceipt;
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
  verifiedLiveRevenue?: number;
  verifiedLiveOrders?: number;
  isDemoData?: boolean;
}

export interface MockStripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  amount: number;
  interval: 'month' | 'year' | 'one_time';
  active: boolean;
  createdAt: string;
}

export interface StripeTestTransaction {
  id: string;
  chargeId: string;
  subscriptionId: string;
  productId?: string;
  priceId?: string;
  customerEmail: string;
  planName: string;
  amount: number;
  status: 'purchased' | 'refunded' | 'canceled';
  entitlementStatus: 'active_trial_or_test' | 'revoked_refund' | 'canceled_period_end';
  webhookVerified: boolean;
  refundId?: string;
  canceledAt?: string;
  timestamp: string;
  mode: 'STRIPE_TEST_MODE';
}

export interface TenantAccount {
  tenantId: string;
  ownerName: string;
  ownerEmail: string;
  role: 'OWNER' | 'OPERATOR' | 'VIEWER';
  businessName: string;
  planEntitlement: 'sandbox_free' | 'starter_test' | 'growth_pro_test';
  isolatedNamespace: string;
}

export interface PilotCustomerRecord {
  id: string;
  founderName: string;
  company: string;
  cohortWeek: string;
  onboardingCompleted: boolean;
  coreWorkflowCompleted: boolean;
  aiOperatingCostUsd: number;
  supportTicketsCount: number;
  willingnessToPayTier: '$29/mo Starter' | '$79/mo Growth Pro' | '$249/mo Agency';
  retryRecoveryPassed: boolean;
  feedbackQuote: string;
}

export interface UsageMeterSummary {
  totalApiCalls: number;
  dailyQuotaLimit: number;
  estimatedAiCostUsd: number;
  monthlyCostCapUsd: number;
  schemaValidationsPassed: number;
  schemaFailuresCaught: number;
  rateLimitStatus: 'HEALTHY' | 'THROTTLED';
}

export interface LaunchGateItem {
  id: string;
  stage:
    | 'Stage 1 · Truth & Safety'
    | 'Stage 2 · Secure Foundation'
    | 'Stage 3 · Operational Workflow'
    | 'Stage 4 · Commercial MVP'
    | 'Stage 5 · Closed Pilot'
    | 'Stage 6 · Controlled Public Launch';
  label: string;
  category: 'engineering' | 'security' | 'financial' | 'governance';
  checked: boolean;
  evidenceSummary: string;
  lastVerifiedAt: string;
}

export interface AssetAuditLogEntry {
  id: string;
  timestamp: string;
  agentId: AgentId | 'founder' | 'system';
  agentName: string;
  action: string;
  assetModule: string;
  summary: string;
  approvalStatus:
    | 'STAGED_DRAFT'
    | 'PENDING_OWNER_APPROVAL'
    | 'OWNER_APPROVED'
    | 'BLOCKED_BY_GATE';
  receiptId?: string;
}

export interface IdeaValidationMetadata {
  step: 'probing_questions' | 'synthesis_and_pivot';
  originalIdea: string;
  questions?: string[];
  refinedOriginalIdea?: string;
  alternativeConcept?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ceo' | 'system' | AgentId;
  agentId?: AgentId;
  agentName?: string;
  collaborators?: AgentId[];
  text: string;
  timestamp: string;
  proposedActionTitle?: string;
  proposedActionType?: Task['actionType'];
  targetAsset?: 'blueprint' | 'website' | 'marketing' | 'tasks';
  queuedTaskId?: string;
  validationMetadata?: IdeaValidationMetadata;
}
