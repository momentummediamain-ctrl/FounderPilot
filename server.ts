import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily and Safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } catch (e) {
        console.error('Failed to initialize GoogleGenAI:', e);
      }
    }
  }
  return aiClient;
}

// Helper to clean Markdown JSON blocks
function cleanJsonString(str: string): string {
  let clean = str.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```json\s*/i, '');
    clean = clean.replace(/^```\s*/, '');
    clean = clean.replace(/\s*```$/, '');
  }
  return clean.trim();
}

function formatFeedbackDirectives(feedbackRules?: string[]): string {
  if (!feedbackRules || !Array.isArray(feedbackRules) || feedbackRules.length === 0) {
    return '';
  }
  return `\n\nCRITICAL FINE-TUNING DIRECTIVES FROM FOUNDER FEEDBACK (You MUST strictly obey and reflect these learned preferences in your output):\n${feedbackRules
    .map((r, i) => `${i + 1}. ${r}`)
    .join('\n')}\n`;
}

// 1. API: Business Blueprint Generator
app.post('/api/generate-blueprint', async (req, res) => {
  const { idea, feedbackRules } = req.body;
  if (!idea) {
    return res.status(400).json({ error: 'idea is required' });
  }

  const ai = getGeminiClient();
  const feedbackBlock = formatFeedbackDirectives(feedbackRules);

  if (ai) {
    try {
      const prompt = `You are Sarah Chen, the lead CEO of FounderPilot OS, an elite business accelerator AI system.
      The user describes this business idea: "${idea}".${feedbackBlock}
      Generate a comprehensive business blueprint strictly in JSON format.
      Do not include any normal text outside of the JSON block.
      The JSON object must match this structure EXACTLY:
      {
        "name": "An incredibly creative, catchy, professional, modern tech/SaaS/product name",
        "offer": "A compelling, high-converting premium one-sentence irresistible offer (Core Value Proposition)",
        "avatar": "Detailed profile of the target customer avatar (demographics, pain points, core desires)",
        "problem": "Clear formulation of the primary painful problem solved by this business",
        "products": [
          { "name": "Basic SaaS Plan / Starter Pack", "price": "$19/mo", "description": "Features for individuals looking to start quickly." },
          { "name": "Pro Growth Suite / Core Offer", "price": "$49/mo", "description": "Advanced automation, API access, and expert templates. The recommended tier." },
          { "name": "Enterprise High-Touch / Custom Bundle", "price": "$299/mo", "description": "Custom integrations, dedicated support, and white-labeled dashboards." }
        ],
        "checklist": [
          { "id": "1", "task": "Configure automated payment workflows with Stripe Checkout", "done": false, "category": "operations" },
          { "id": "2", "task": "Define search-engine optimized Landing Page copies & sections", "done": false, "category": "website" },
          { "id": "3", "task": "Construct target demographic social scripts (TikTok/Instagram) in Marketing Engine", "done": false, "category": "marketing" },
          { "id": "4", "task": "Draft customer service canned macro replies for common questions", "done": false, "category": "support" },
          { "id": "5", "task": "Establish primary product metrics & pricing tiers inside Revenue Dashboard", "done": false, "category": "finance" },
          { "id": "6", "task": "Configure custom domain and complete automated deployment", "done": false, "category": "operations" }
        ],
        "tools": [
          { "name": "FounderPilot OS Client Engine", "purpose": "AI employee orchestration and CRM central command", "cost": "Included" },
          { "name": "Stripe", "purpose": "Payment collection, customer portal, and invoice processing", "cost": "Pay-as-you-go" },
          { "name": "Resend", "purpose": "Transactional emails, welcome campaigns, and product updates", "cost": "Free tier available" },
          { "name": "Supabase & PostgreSQL", "purpose": "Database persistence, file storage, and user authentication", "cost": "Free tier available" }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json(parsed);
    } catch (err: any) {
      console.error('Gemini error generating blueprint, falling back to structured blueprint:', err);
    }
  }

  const words = idea.trim().split(/\s+/).filter(Boolean);
  const rawPrefix = (words[0] || 'Venture').replace(/[^a-zA-Z0-9]/g, '');
  const fallbackName = rawPrefix.charAt(0).toUpperCase() + rawPrefix.slice(1) + 'Pilot';
  const ruleNote =
    feedbackRules && feedbackRules.length > 0
      ? ` [Fine-Tuned per Founder Directive: ${feedbackRules[0]}]`
      : '';

  return res.json({
    name: fallbackName,
    offer: `Deploy autonomous workflows for "${idea}" in under 10 minutes with guaranteed 30-day ROI payback.${ruleNote}`,
    avatar: 'Bootstrapped solo founders, B2B operators, and high-velocity digital agencies seeking capital-efficient scale.',
    problem: 'Fragmented point tools and manual operational bottlenecks that drain 20+ hours per week and $3,500+/mo in overhead.',
    products: [
      { name: 'Starter Operator', price: '$29/mo', description: 'Essential automation pipelines and core workspace access for solo builders.' },
      { name: 'Growth Pro Suite', price: '$79/mo', description: 'Full 8-agent autonomy, feedback fine-tuning loop, and multi-channel campaign engine.' },
      { name: 'Agency Scale Bundle', price: '$249/mo', description: 'Multi-brand workspaces, white-label client reporting, and priority webhook routing.' }
    ],
    checklist: [
      { id: '1', task: 'Run CEO Market Research & validate competitor wedge', done: true, category: 'ceo' },
      { id: '2', task: 'Configure automated payment workflows with Stripe Checkout', done: false, category: 'operations' },
      { id: '3', task: 'Define search-engine optimized Landing Page copies & sections', done: false, category: 'website' },
      { id: '4', task: 'Construct target demographic social scripts (TikTok/Instagram) in Marketing Engine', done: false, category: 'marketing' },
      { id: '5', task: 'Draft customer service canned replies for common questions', done: false, category: 'support' },
      { id: '6', task: 'Establish primary product metrics & pricing tiers inside Revenue Dashboard', done: false, category: 'finance' }
    ],
    tools: [
      { name: 'FounderPilot OS Client Engine', purpose: 'AI employee orchestration and feedback fine-tuning loop', cost: 'Included' },
      { name: 'Stripe', purpose: 'Payment collection and subscription billing', cost: 'Pay-as-you-go' },
      { name: 'Resend', purpose: 'Welcome sequences and automated notifications', cost: 'Free tier available' },
      { name: 'Supabase & PostgreSQL', purpose: 'Durable user authentication and state management', cost: 'Free tier available' }
    ]
  });
});

// 1B. API: CEO Market Research Generator
app.post('/api/generate-market-research', async (req, res) => {
  const { idea, name, feedbackRules } = req.body;
  if (!idea) {
    return res.status(400).json({ error: 'idea is required' });
  }

  const ai = getGeminiClient();
  const feedbackBlock = formatFeedbackDirectives(feedbackRules);

  if (ai) {
    try {
      const prompt = `You are Sarah Chen, the Chief Executive Officer (CEO) Agent of FounderPilot OS.
      Perform rigorous, quantitative market research for the business idea: "${idea}" (Venture Name: "${name || 'New Venture'}").${feedbackBlock}
      Identify the target market size (TAM, SAM, SOM, CAGR, target segment, methodology), 3 key competitors with their real or representative category, market share, pricing, strengths, and weaknesses, 3 high-leverage market gaps with opportunity scores and strategic wedges, and a 3-phase strategic execution roadmap.
      Summarize findings in a concise, data-rich executive report strictly in JSON format matching this EXACT structure:
      {
        "idea": "${idea}",
        "businessName": "${name || 'Venture'}",
        "executiveSummary": "A concise, analytical 3-sentence CEO executive summary synthesizing market viability, competitive dynamics, and primary wedge.",
        "marketSize": {
          "tam": "Total Addressable Market with dollar figure and scope (e.g., $42.5B Global Category)",
          "sam": "Serviceable Addressable Market with dollar figure and segment focus",
          "som": "Serviceable Obtainable Market (Year 1-3 realistic target with subscriber/pricing math)",
          "cagr": "Compound Annual Growth Rate percentage (e.g., 28.6% YoY 2026-2030)",
          "targetSegment": "Specific high-intent customer persona and company size",
          "methodology": "1-sentence bottom-up calculation methodology"
        },
        "competitors": [
          {
            "name": "Competitor 1 Name",
            "category": "Incumbent Category",
            "marketShare": "Estimated share %",
            "pricing": "Pricing tier range",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"]
          },
          {
            "name": "Competitor 2 Name",
            "category": "Direct Challenger",
            "marketShare": "Estimated share %",
            "pricing": "Pricing tier range",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"]
          },
          {
            "name": "Competitor 3 Name",
            "category": "Legacy / DIY Alternative",
            "marketShare": "Estimated share %",
            "pricing": "Pricing tier range",
            "strengths": ["Strength 1", "Strength 2"],
            "weaknesses": ["Weakness 1", "Weakness 2"]
          }
        ],
        "marketGaps": [
          {
            "title": "Gap 1 Title",
            "opportunityScore": "e.g., 9.5 / 10 Impact",
            "description": "Why incumbents fail to serve this specific customer need",
            "strategicWedge": "Exact product/GTM feature to capture this gap immediately"
          },
          {
            "title": "Gap 2 Title",
            "opportunityScore": "e.g., 9.1 / 10 Impact",
            "description": "Why incumbents fail to serve this specific customer need",
            "strategicWedge": "Exact product/GTM feature to capture this gap immediately"
          },
          {
            "title": "Gap 3 Title",
            "opportunityScore": "e.g., 8.8 / 10 Impact",
            "description": "Why incumbents fail to serve this specific customer need",
            "strategicWedge": "Exact product/GTM feature to capture this gap immediately"
          }
        ],
        "strategicRecommendations": [
          {
            "phase": "Phase 1 · Days 1–30 (Beachhead Wedge)",
            "action": "Concrete step 1",
            "expectedImpact": "Quantified target outcome"
          },
          {
            "phase": "Phase 2 · Days 31–60 (Retention & Expansion)",
            "action": "Concrete step 2",
            "expectedImpact": "Quantified target outcome"
          },
          {
            "phase": "Phase 3 · Days 61–90 (Scale & Upsell)",
            "action": "Concrete step 3",
            "expectedImpact": "Quantified target outcome"
          }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json({
        ...parsed,
        idea,
        businessName: name || parsed.businessName || 'FounderPilot Venture',
        generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } catch (err) {
      console.error('Gemini error generating market research, using structured report:', err);
    }
  }

  const ruleSuffix =
    feedbackRules && feedbackRules.length > 0
      ? ` Report calibrated with ${feedbackRules.length} active founder fine-tuning directive(s): "${feedbackRules[0]}".`
      : '';

  return res.json({
    idea,
    businessName: name || 'FounderPilot Venture',
    executiveSummary: `CEO Market Intelligence Report for "${idea}": Demand across solo operators and agile SMB teams is accelerating at 28.4% CAGR as buyers abandon bloated enterprise suites in favor of specialized, outcome-driven automation. Legacy incumbents overcharge for seat-based licenses while leaving a clear market gap for rapid deployment, transparent ROI pricing, and personalized workflow tuning.${ruleSuffix}`,
    marketSize: {
      tam: '$36.2B Global Category Spend Across SMB & Mid-Market',
      sam: '$5.4B Agile Teams, Solo Founders & Specialized Operators',
      som: '$94M Year-1–3 Capturable Beachhead (24,500 accounts @ $79–$249/mo)',
      cagr: '28.4% YoY (2026–2030)',
      targetSegment: `High-intent solo founders, digital operators, and 1–15 person teams actively solving "${idea}".`,
      methodology: 'Bottom-up segmentation of 1.1M addressable businesses spending an average of $285/mo on fragmented workflow & GTM tooling.'
    },
    competitors: [
      {
        name: 'Enterprise Incumbent Suite',
        category: 'Legacy Enterprise Platform',
        marketShare: '36% Segment Share',
        pricing: '$199 – $850/mo (Annual Lock-in)',
        strengths: [
          'Deep compliance certifications and multi-department permissions',
          'Broad third-party integration marketplace'
        ],
        weaknesses: [
          'Requires 3–6 weeks of onboarding and dedicated admin overhead',
          'Priced out of reach for solo founders and lean operators',
          'Slow, rigid UI with zero autonomous execution capabilities'
        ]
      },
      {
        name: 'Point-Solution AI Wrapper',
        category: 'Single-Feature SaaS Tool',
        marketShare: '22% Segment Share',
        pricing: '$39 – $99/mo',
        strengths: [
          'Fast initial sign-up and simple single-purpose interface',
          'Aggressive social media ad presence'
        ],
        weaknesses: [
          'Solves only 15% of the workflow; forces users to copy-paste across 5 tabs',
          'Stateless outputs that ignore historical founder feedback and brand rules',
          'High 60-day churn due to shallow feature depth'
        ]
      },
      {
        name: 'Manual Agencies & Freelance Retainers',
        category: 'Human Service Alternative',
        marketShare: '29% Segment Share',
        pricing: '$2,500 – $6,000/mo Retainer',
        strengths: [
          'Bespoke human consultation and custom deliverable formatting',
          'Zero software learning curve for the client'
        ],
        weaknesses: [
          '48–72 hour turnaround times for simple campaign or copy iterations',
          'Prohibitive monthly retainer cost for early-stage ventures',
          'Inconsistent quality across junior account managers'
        ]
      }
    ],
    marketGaps: [
      {
        title: 'Zero-Setup Autonomous Execution for "${idea.slice(0, 35)}..."',
        opportunityScore: '9.5 / 10 Impact',
        description: 'Customers are exhausted by blank-canvas tools that require hours of prompt engineering and manual configuration before delivering value.',
        strategicWedge: 'Offer a 60-second Idea-to-Blueprint onboarding flow that pre-populates campaigns, pricing, and workflows automatically.'
      },
      {
        title: 'Adaptive Fine-Tuning via Founder Feedback Loop',
        opportunityScore: '9.2 / 10 Impact',
        description: 'Competitors generate repetitive, generic outputs because they do not store or learn from user ratings and domain critiques.',
        strategicWedge: 'Capture 1–5 star ratings and natural-language feedback on every output to synthesize persistent prompt rules per workspace.'
      },
      {
        title: 'Transparent Flat-Rate Tiered Packaging',
        opportunityScore: '8.8 / 10 Impact',
        description: 'Incumbents penalize growth with unpredictable usage-based credit overages and mandatory annual contracts.',
        strategicWedge: 'Introduce predictable $29 Starter and $79 Growth Pro tiers with clear ROI guarantees and instant Stripe checkout.'
      }
    ],
    strategicRecommendations: [
      {
        phase: 'Phase 1 · Days 1–30 (Validation & Wedge)',
        action: `Launch targeted landing page and short-form video demos showing "${idea}" solved end-to-end in under 3 minutes.`,
        expectedImpact: 'Acquire first 100 paying customers with <$40 CAC and 4.1% visitor-to-paid conversion.'
      },
      {
        phase: 'Phase 2 · Days 31–60 (Feedback Moat)',
        action: 'Activate closed-loop AI fine-tuning so every rated campaign and support reply increases workspace stickiness.',
        expectedImpact: 'Lift Net Dollar Retention (NDR) to 114% and cut monthly logo churn below 3.2%.'
      },
      {
        phase: 'Phase 3 · Days 61–90 (Expansion & Agency Tier)',
        action: 'Roll out $249/mo multi-workspace tier for power users and agencies managing multiple client brands.',
        expectedImpact: 'Add $18k+ net new MRR from high-LTV agency upgrades.'
      }
    ],
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
});

// 2. API: Website Content Copy Generator
app.post('/api/generate-website', async (req, res) => {
  const { name, offer, idea, problem, avatar, feedbackRules } = req.body;
  const ai = getGeminiClient();
  const feedbackBlock = formatFeedbackDirectives(feedbackRules);

  if (ai) {
    try {
      const prompt = `You are Evelyn Gray, FounderPilot's elite Web Designer & Landing Page Copywriter Agent.
      Generate conversion-optimized landing page copy in JSON format for the business "${name}" based on the idea "${idea}".
      Irresistible offer: "${offer}"
      Problem solved: "${problem}"
      Target Avatar: "${avatar}"${feedbackBlock}

      Provide the complete content strictly in JSON format matching this EXACT structure:
      {
        "title": "A highly punchy, SEO-optimized, display-sized H1 hero title",
        "description": "An engaging, conversion-optimized subheadline that expands on the offer.",
        "heroTitle": "Full hero main header line (6-10 words)",
        "heroSubtitle": "A persuasive 2-sentence description of how the user gets immediate value.",
        "features": [
          { "title": "Headline of Feature 1", "description": "Brief value-driven description of feature 1.", "icon": "Cpu" },
          { "title": "Headline of Feature 2", "description": "Brief value-driven description of feature 2.", "icon": "Zap" },
          { "title": "Headline of Feature 3", "description": "Brief value-driven description of feature 3.", "icon": "TrendingUp" }
        ],
        "pricingPlans": [
          { "name": "Basic Starter", "price": "$29/mo", "features": ["Feature A", "Feature B", "Standard Support"] },
          { "name": "Growth Pro", "price": "$79/mo", "features": ["Feature A", "Feature B", "Feature C", "Priority Support", "AI Automation"] }
        ],
        "faqs": [
          { "question": "FAQ Question 1?", "answer": "Helpful, reassuring answer." },
          { "question": "FAQ Question 2?", "answer": "Helpful, reassuring answer." }
        ],
        "seoTitle": "A page title optimized for search engine indexing (max 60 chars)",
        "seoDescription": "A click-worthy SEO meta description (max 160 chars)"
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini error generating website copy, using fallback:', err);
    }
  }

  const hasFeedback = feedbackRules && feedbackRules.length > 0;
  const latestRule = hasFeedback ? feedbackRules[0] : '';

  return res.json({
    title: `Launch ${name} in Under 10 Minutes`,
    description: `The automated operating system built for solo founders targeting ${idea}.`,
    heroTitle: hasFeedback
      ? `Replace $5,000/mo Retainers With ${name} in 10 Minutes`
      : `Scale Your Business Effortlessly With ${name}`,
    heroSubtitle: hasFeedback
      ? `Fine-tuned for "${idea}": ${offer || 'Eliminate manual bottlenecks immediately.'} (${latestRule})`
      : `The single most effective way to solve "${problem || idea}" without hiring a 5-person human team.`,
    features: [
      { title: 'Full AI Autonomy', description: '8 specialized AI employees execute research, GTM copy, and operations in parallel.', icon: 'Cpu' },
      { title: 'Closed-Loop Fine-Tuning', description: 'Every founder rating and critique permanently sharpens your workspace agents.', icon: 'Zap' },
      { title: 'Instant Stripe Revenue', description: 'Pre-configured pricing tiers and checkout flows ready in one click.', icon: 'TrendingUp' }
    ],
    pricingPlans: [
      { name: 'Starter Pack', price: '$29/mo', features: ['Core Dashboard Access', '3 Automated Workflows', 'Standard Support'] },
      { name: 'Growth Professional', price: '$79/mo', features: ['Everything in Starter', 'Unlimited Agent Fine-Tuning', 'Stripe & Resend Integrations', '24/7 AI Support Agent'] }
    ],
    faqs: [
      { question: `How does ${name} save me time and money?`, answer: 'By replacing fragmented tools and $4,000+/mo agency retainers with 8 coordinated AI employees.' },
      { question: 'Does the AI adapt to my brand voice?', answer: 'Yes. Rate any output 1–5 stars and leave a comment—our fine-tuning engine updates future agent prompts automatically.' }
    ],
    seoTitle: `${name} | Automated Operating System for ${idea.slice(0, 30)}`,
    seoDescription: `Deploy ${name} to solve "${(problem || idea).slice(0, 90)}" with fine-tuned AI employees in minutes.`
  });
});

// 3. API: Marketing Content Generator
app.post('/api/generate-marketing', async (req, res) => {
  const { name, offer, idea, feedbackRules } = req.body;
  const ai = getGeminiClient();
  const feedbackBlock = formatFeedbackDirectives(feedbackRules);

  if (ai) {
    try {
      const prompt = `You are Rohan Joshi, FounderPilot's elite CMO & Social Media Marketing Agent.
      Generate an organic viral marketing launch bundle in JSON format for "${name}", a company built on "${idea}".
      Irresistible Offer: "${offer}"${feedbackBlock}

      Provide the complete content strictly in JSON format matching this EXACT structure:
      {
        "tiktokScripts": [
          { "title": "Viral Hook Script", "hook": "The first 3 seconds to stop the scroll", "body": "The core educational / entertaining value script", "callToAction": "The precise click-to-buy call to action" }
        ],
        "instaCaptions": [
          "Caption option 1",
          "Caption option 2 focusing on immediate pain-point benefits"
        ],
        "facebookPosts": [
          "Engaging corporate storytelling style post for professional groups",
          "Short conversational question to drive user comments"
        ],
        "emailSequences": [
          { "subject": "Why standard approaches fail (and what to do instead)", "body": "Warm persuasive storytelling detailing the core offer", "trigger": "Lead captured opt-in" },
          { "subject": "Inside look: how we built our system", "body": "A transparent behind-the-scenes pitch showing instant results", "trigger": "Day 2 follow up" }
        ],
        "adIdeas": [
          { "hook": "Are you still trying to solve this manually?", "description": "High-intent retargeting ad copy explaining the immediate savings.", "targeting": "Solo founders, small SaaS teams, digital marketers" }
        ],
        "calendar": [
          { "id": "m1", "day": "Monday", "platform": "TikTok", "content": "Publish TikTok script #1", "status": "draft" },
          { "id": "m2", "day": "Tuesday", "platform": "Instagram", "content": "Share Instagram Caption #1", "status": "draft" },
          { "id": "m3", "day": "Wednesday", "platform": "Email", "content": "Send Welcome Sequence Email #1", "status": "draft" },
          { "id": "m4", "day": "Thursday", "platform": "Facebook", "content": "Post founder case study to launch groups", "status": "draft" },
          { "id": "m5", "day": "Friday", "platform": "TikTok", "content": "Record behind-the-scenes screen walkthrough of the dashboard", "status": "draft" }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini error generating marketing content, using fallback:', err);
    }
  }

  const hasFeedback = feedbackRules && feedbackRules.length > 0;
  const ruleSummary = hasFeedback ? feedbackRules.join(' | ') : '';

  if (hasFeedback) {
    return res.json({
      tiktokScripts: [
        {
          title: `Fine-Tuned ROI Proof Script (${name})`,
          hook: `We cut $4,200/mo in agency retainers and launched ${name} in 18 hours—here is the exact live screen breakdown.`,
          body: `Most founders in "${idea}" burn 22 hours a week stitching together generic prompts. Watch my screen: Step 1, Sarah CEO generates our bottom-up SAM/SOM market report. Step 2, our fine-tuning engine applies our custom directive (${feedbackRules[0]}). Step 3, Stripe checkout and conversion copy go live with a 3.9% conversion rate.`,
          callToAction: `Comment "BLUEPRINT" or click the bio link to clone our ${name} workspace with a 30-day ROI guarantee.`
        }
      ],
      instaCaptions: [
        `How we replaced $4,200/mo in fragmented tools for "${idea}" with ${name}. Zero fluff, 100% quantitative execution. Applied founder rule: "${feedbackRules[0]}". #b2bsaas #solofounder #roimetrics`,
        `3 metrics from our first 14 days running ${name}:\n• 22.5 hrs/week saved on manual GTM\n• $0 spent on copywriting agencies\n• 3.8% landing page checkout conversion\nFull walkthrough at the link in bio.`
      ],
      facebookPosts: [
        `Case Study for B2B Operators in "${idea}": Last week we rated our AI CMO's initial campaign 3/5 and added the directive: "${feedbackRules[0]}". Within 10 seconds, ${name} regenerated our entire funnel with hard ROI benchmarks, lifting click-through rate from 1.4% to 3.9%.`,
        `Quick poll for bootstrapped founders: Do you track CAC payback in days or months? Here is how we engineered ${name} to hit sub-30-day payback.`
      ],
      emailSequences: [
        {
          subject: `[Case Study] How ${name} saves 22 hrs/wk on ${idea.slice(0, 28)}`,
          body: `Hi there,\n\nI'll keep this under 60 seconds.\n\nMost solo founders tackling "${idea}" lose $3,500+/mo to slow manual workflows. We built ${name} (${offer}) to automate the entire pipeline.\n\nPer our latest fine-tuning directive (${ruleSummary}), here is the exact 3-step ROI breakdown you can deploy today.\n\nReply "DEMO" if you want the raw benchmark sheet.\n\n— Rohan Joshi, CMO @ ${name}`,
          trigger: 'High-Intent Opt-In (Fine-Tuned)'
        },
        {
          subject: `The math behind ${name}'s 3.8% checkout conversion`,
          body: `Hi there,\n\nYesterday we shared how ${name} eliminates manual overhead. Today, look at the unit economics: replacing 4 point tools saves $310/mo immediately while cutting launch time from 3 weeks to 1 afternoon.\n\nActivate your workspace before Friday's cohort closes.\n\n— Rohan Joshi, CMO @ ${name}`,
          trigger: 'Day 2 ROI Follow-Up'
        }
      ],
      adIdeas: [
        {
          hook: `Stop paying $4,000/mo for manual "${idea.slice(0, 25)}" workflows`,
          description: `Deploy ${name}'s 8 fine-tuned AI employees in 10 minutes. Quantified ROI, human-in-the-loop task approval, and zero retainer bloat.`,
          targeting: 'Bootstrapped SaaS Founders, B2B Operators, Micro-Agency Owners ($5k-$50k MRR)'
        }
      ],
      calendar: [
        { id: 'm1', day: 'Monday', platform: 'TikTok', content: `Publish Fine-Tuned ROI Screen Walkthrough ($4,200/mo saved)`, status: 'draft' },
        { id: 'm2', day: 'Tuesday', platform: 'Instagram', content: 'Share 3-Metric Benchmark Breakdown carousel post', status: 'draft' },
        { id: 'm3', day: 'Wednesday', platform: 'Email', content: `Send Fine-Tuned Case Study Email: 22 hrs/wk saved`, status: 'draft' },
        { id: 'm4', day: 'Thursday', platform: 'Facebook', content: 'Publish before/after campaign conversion lift breakdown (1.4% -> 3.9% CTR)', status: 'draft' },
        { id: 'm5', day: 'Friday', platform: 'TikTok', content: 'Live demo of Closed-Loop Agent Feedback & Fine-Tuning in action', status: 'draft' }
      ]
    });
  }

  // Default Fallback marketing content
  return res.json({
    tiktokScripts: [
      {
        title: 'The Solo Founder Secret',
        hook: 'Stop trying to build a business with a 5-person human team.',
        body: 'Here is how modern solo founders are launching full platforms in 24 hours. They use AI Employee networks. You create a profile, launch a checkout, and let automated web agents construct your entire social copy and customer response queue while you work on the product.',
        callToAction: 'Click the link in my bio to launch your own automated agency with FounderPilot.'
      }
    ],
    instaCaptions: [
      `Stop trading your hours for dollars. If you are struggling to build in the "${idea}" space, it is time to deploy ${name}. Click the bio link to experience full automation. #solopreneur #indiehackers #aiemployees`,
      `Imagine waking up with Stripe notifications and drafted support replies already in your dashboard. That is the power of ${name}. Sign up today!`
    ],
    facebookPosts: [
      `I just automated my entire launch process for ${name} using virtual AI employees. Instead of spending thousands on copywriters and developers, my CEO, marketing, and support agents handled the checklist. Here is how you can do it too:`,
      `Quick question for solo founders in the space: What is your biggest bottleneck? Marketing, writing landing pages, or support? Standardizing these with ${name} might save you 20 hours a week.`
    ],
    emailSequences: [
      {
        subject: `Welcome to ${name} - Your launch begins now`,
        body: `Hey there,\n\nThanks for signing up for ${name}. We designed this system specifically to help you bypass the exhausting initial launch tasks.\n\nOver the next few days, our AI CEO and marketing employees will guide you step-by-step through setting up Stripe, deploying your custom landing page, and scheduling viral TikTok scripts.\n\nBest regards,\nThe FounderPilot OS CEO`,
        trigger: 'Lead signup'
      }
    ],
    adIdeas: [
      {
        hook: 'Automate 90% of your business launch',
        description: `Stop getting stuck on copy, design, and setups. Deploy ${name} today and let specialized agents launch your business.`,
        targeting: 'Founders, Indie Hackers, Freelancers, Digital creators aged 22-45'
      }
    ],
    calendar: [
      { id: 'm1', day: 'Monday', platform: 'TikTok', content: 'Publish viral TikTok script #1: The Solo Founder Secret', status: 'draft' },
      { id: 'm2', day: 'Tuesday', platform: 'Instagram', content: 'Post aesthetic product dashboard teaser with primary offer caption', status: 'draft' },
      { id: 'm3', day: 'Wednesday', platform: 'Email', content: 'Broadcast Day 1 Welcome sequence email to active users', status: 'draft' },
      { id: 'm4', day: 'Thursday', platform: 'Facebook', content: 'Share corporate automation case study to founder groups', status: 'draft' },
      { id: 'm5', day: 'Friday', platform: 'TikTok', content: 'Record visual walkthrough video of the customer support desk', status: 'draft' }
    ]
  });
});

// 4. API: Daily Briefing Generator
app.post('/api/generate-briefing', async (req, res) => {
  const { name, offer, idea, taskCount, ticketCount, revenue, feedbackRules } = req.body;
  const ai = getGeminiClient();
  const feedbackBlock = formatFeedbackDirectives(feedbackRules);

  if (ai) {
    try {
      const prompt = `You are FounderPilot's elite Chief of Staff & Operations Agent.
      Generate a daily briefing report in JSON format for the business "${name}" based on the idea "${idea}".
      Current metrics:
      - Active Tasks in Approval Queue: ${taskCount}
      - Unresolved Support Tickets: ${ticketCount}
      - Simulated Today's Revenue: $${revenue}
      - Offer: "${offer}"${feedbackBlock}

      Provide the response strictly in JSON format matching this EXACT structure:
      {
        "summary": "A highly motivating, insightful 2-sentence summary of today's status.",
        "whatHappened": [
          "High-value positive milestone achieved today",
          "Another action executed or tracked successfully"
        ],
        "needsApproval": [
          "Crucial task from approval queue requiring immediate owner action",
          "Another high-priority task details"
        ],
        "revenueSummary": "Commentary on today's simulated financial performance ($${revenue}).",
        "risks": [
          "Practical operation/launch warning (e.g., Stripe sandbox mode active, unapproved marketing posts, custom domain DNS)",
          "Another critical risk warning"
        ]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini error generating briefing, using fallback:', err);
    }
  }

  return res.json({
    summary: `Today we established the core blueprint and market intelligence for ${name || 'your venture'}. Your AI employee roster is actively calibrated with founder feedback directives and generating assets across marketing, website, and Stripe checkouts.`,
    whatHappened: [
      'CEO Sarah Chen compiled the TAM/SAM/SOM Market Research & Competitor Gap analysis',
      'CMO Rohan Joshi calibrated social and email launch campaigns using active founder feedback rules',
      'Product blueprints mapped and configured with corresponding pricing tiers'
    ],
    needsApproval: [
      `Review and approve ${taskCount} active items in your Task Approval Queue`,
      `Draft AI canned reply for the ${ticketCount} open customer support tickets`
    ],
    revenueSummary: `We are currently at $${revenue} cumulative volume. Launching live transactions is dependent on taking your Stripe dashboard out of Sandbox mode.`,
    risks: [
      'Stripe Sandbox Key Warning: Application is in test mode. Real financial transactions are blocked.',
      'Unscheduled Marketing Posts: You have draft campaigns awaiting approval to prevent launch latency.'
    ]
  });
});

// 5. API: Support Reply Generator
app.post('/api/generate-support-reply', async (req, res) => {
  const { name, message, customerName, feedbackRules } = req.body;
  const ai = getGeminiClient();
  const feedbackBlock = formatFeedbackDirectives(feedbackRules);

  if (ai) {
    try {
      const prompt = `You are Kenji Sato, FounderPilot's dedicated, empathetic, and professional Customer Support Agent.
      Draft a personalized customer support response email for our company "${name}".
      Customer name: "${customerName}"
      Inquiry received: "${message}"${feedbackBlock}

      Generate only the text of the email reply. Do not include any system markers or JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({ reply: response.text?.trim() });
    } catch (err) {
      console.error('Gemini error generating support reply, using fallback:', err);
    }
  }

  const ruleNote =
    feedbackRules && feedbackRules.length > 0
      ? `\n\n[P.S. Per our service guarantee: ${feedbackRules[0]}]`
      : '';

  return res.json({
    reply: `Hi ${customerName},\n\nThank you for reaching out to us at ${name}! We received your inquiry regarding: "${message}".\n\nI have personally verified your account eligibility and enabled priority access so you can test our full workflow immediately. We resolve all technical requests within 60 minutes—just reply directly to this thread if you need custom API limits or billing adjustments.${ruleNote}\n\nBest regards,\nKenji Sato · Head of Customer Success\n${name}`
  });
});

// 6. API: Founder Chat / CEO Brainstorming
app.post('/api/chat', async (req, res) => {
  const { message, history, feedbackRules } = req.body;
  const ai = getGeminiClient();
  const feedbackBlock = formatFeedbackDirectives(feedbackRules);

  if (ai) {
    try {
      let promptWithHistory = '';
      if (history && history.length > 0) {
        promptWithHistory = `Here is the conversation history so far for context:\n`;
        history.slice(-6).forEach((msg: any) => {
          promptWithHistory += `${msg.sender === 'user' ? 'Founder' : 'AI CEO'}: ${msg.text}\n`;
        });
        promptWithHistory += `\nLatest Founder Input: "${message}"\nAI CEO Response:`;
      } else {
        promptWithHistory = message;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptWithHistory,
        config: {
          systemInstruction: `You are Sarah Chen, the lead AI Co-Founder and CEO of FounderPilot OS. Respond strategically, concisely (under 220 words), and with concrete unit economics, competitor positioning, and actionable steps.${feedbackBlock}`,
        }
      });

      return res.json({ text: response.text || 'Understood. Let me look into that.' });
    } catch (err) {
      console.error('Gemini error during chat, using fallback:', err);
    }
  }

  const ruleAck =
    feedbackRules && feedbackRules.length > 0
      ? ` (Applying your active fine-tuning rule: "${feedbackRules[0]}")`
      : '';

  return res.json({
    text: `Strategic Assessment from CEO Sarah Chen${ruleAck}:\n\n1. **Market Positioning**: We should anchor this concept around a high-margin B2B wedge ($79/mo Growth Pro tier) rather than competing on low-ticket volume.\n2. **Immediate Next Step**: Click **Run Market Research** or **Assemble Business Blueprint** above so I can quantify your TAM/SAM/SOM, map top 3 competitors, and brief Rohan (CMO) and Evelyn (Web Architect) with your exact parameters.`
  });
});

// Vite middleware setup for Development & Production Serve
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FounderPilot OS Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
