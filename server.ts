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
  // Remove markdown codeblock wraps if present (e.g. ```json ... ```)
  let clean = str.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```json\s*/i, '');
    clean = clean.replace(/^```\s*/, '');
    clean = clean.replace(/\s*```$/, '');
  }
  return clean.trim();
}

// 1. API: Business Blueprint Generator
app.post('/api/generate-blueprint', async (req, res) => {
  const { idea } = req.body;
  if (!idea) {
    return res.status(400).json({ error: 'idea is required' });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const prompt = `You are the lead CEO of FounderPilot OS, an elite business accelerator AI system.
      The user describes this business idea: "${idea}".
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
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json(parsed);
    } catch (err: any) {
      console.error('Gemini error generating blueprint, falling back to mock:', err);
    }
  }

  // Fallback / Mock Blueprint
  const fallbackName = idea.trim().split(' ')[0] + 'Pilot';
  return res.json({
    name: fallbackName,
    offer: `Empower your brand with state-of-the-art automation designed for the "${idea}" category.`,
    avatar: 'Tech-savvy professionals, freelancers, and small business owners looking to scale operations using automated workflows.',
    problem: 'Sufficient scaling and operations bottlenecks that cost hundreds of human hours every single month.',
    products: [
      { name: 'Starter Tier', price: '$29/mo', description: 'Essential tools and resources to get started.' },
      { name: 'Growth Professional', price: '$79/mo', description: 'Advanced AI automation and customized campaign builders. (Most Popular)' },
      { name: 'Enterprise Enterprise', price: '$249/mo', description: 'Fully tailored workflows, custom integrations, and dedicated assistance.' }
    ],
    checklist: [
      { id: '1', task: 'Configure automated payment workflows with Stripe Checkout', done: false, category: 'operations' },
      { id: '2', task: 'Define search-engine optimized Landing Page copies & sections', done: false, category: 'website' },
      { id: '3', task: 'Construct target demographic social scripts (TikTok/Instagram) in Marketing Engine', done: false, category: 'marketing' },
      { id: '4', task: 'Draft customer service canned replies for common questions', done: false, category: 'support' },
      { id: '5', task: 'Establish primary product metrics & pricing tiers inside Revenue Dashboard', done: false, category: 'finance' },
      { id: '6', task: 'Configure custom domain and complete automated deployment', done: false, category: 'operations' }
    ],
    tools: [
      { name: 'FounderPilot OS Client Engine', purpose: 'AI employee orchestration and CRM central command', cost: 'Included' },
      { name: 'Stripe', purpose: 'Payment collection and customer portal management', cost: 'Pay-as-you-go' },
      { name: 'Resend', purpose: 'Welcome sequences and automated notifications', cost: 'Free tier available' },
      { name: 'Supabase & PostgreSQL', purpose: 'Durable user authentication and state management', cost: 'Free tier available' }
    ]
  });
});

// 2. API: Website Content Copy Generator
app.post('/api/generate-website', async (req, res) => {
  const { name, offer, idea, problem, avatar } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are FounderPilot's elite Web Designer & Landing Page Copywriter Agent.
      Generate beautiful, professional landing page copy in JSON format for the business "${name}" based on the idea "${idea}".
      Irresistible offer: "${offer}"
      Problem solved: "${problem}"
      Target Avatar: "${avatar}"

      Provide the complete content strictly in JSON format matching this EXACT structure:
      {
        "title": "A highly punchy, SEO-optimized, display-sized H1 hero title",
        "description": "An engaging, conversion-optimized subheadline that expands on the offer.",
        "heroTitle": "Full hero main header line (6-8 words)",
        "heroSubtitle": "A persuasive 2-sentence description of how the user gets immediate value.",
        "features": [
          { "title": "Headline of Feature 1", "description": "Brief value-driven description of feature 1.", "icon": "Lucide icon name (e.g., Sparkles, Zap, Shield, TrendingUp, Layers, Cpu)" },
          { "title": "Headline of Feature 2", "description": "Brief value-driven description of feature 2.", "icon": "Lucide icon name" },
          { "title": "Headline of Feature 3", "description": "Brief value-driven description of feature 3.", "icon": "Lucide icon name" }
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
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini error generating website copy, using mock:', err);
    }
  }

  // Fallback website copy
  return res.json({
    title: `Launch ${name} Today`,
    description: `The ultimate automated tool built for solo founders targeting ${idea}.`,
    heroTitle: `Scale Your Business Effortlessly With ${name}`,
    heroSubtitle: `The single, most effective way to address the "${problem}" without hiring an entire human team.`,
    features: [
      { title: 'Full AI Autonomy', description: 'Our agents run continuous, autonomous background workflows so you sleep.', icon: 'Cpu' },
      { title: 'Automated Checkout', description: 'Stripe integrations pre-configured out-of-the-box in one click.', icon: 'Zap' },
      { title: 'Automated Operations', description: 'Checklist and task pipelines execute instantly on your command.', icon: 'TrendingUp' }
    ],
    pricingPlans: [
      { name: 'Starter Pack', price: '$29/mo', features: ['Core Dashboard Access', '3 Automated Workflows', 'Standard Support'] },
      { name: 'Growth Professional', price: '$79/mo', features: ['Everything in Starter', 'Unlimited Automated Operations', 'Stripe & Resend Integrations', '24/7 AI Support Agent'] }
    ],
    faqs: [
      { question: `How does ${name} save me time?`, answer: 'By substituting standard human tasks—like marketing drafts, landing page coding, and support tracking—with highly specialized AI employees.' },
      { question: 'Is Stripe safe?', answer: 'Yes, Stripe is the world standard in secure checkout, fully PCI compliant.' }
    ],
    seoTitle: `${name} | The Automated Operating System for ${idea}`,
    seoDescription: `Discover the ultimate automation tool built specifically to solve "${problem}". Get started in minutes.`
  });
});

// 3. API: Marketing Content Generator
app.post('/api/generate-marketing', async (req, res) => {
  const { name, offer, idea } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are FounderPilot's elite CMO & Social Media Marketing Agent.
      Generate an organic viral marketing launch bundle in JSON format for "${name}", a company built on "${idea}".
      Irresistible Offer: "${offer}"

      Provide the complete content strictly in JSON format matching this EXACT structure:
      {
        "tiktokScripts": [
          { "title": "Viral Hook Script", "hook": "The first 3 seconds to stop the scroll", "body": "The core educational / entertaining value script", "callToAction": "The precise click-to-buy call to action" }
        ],
        "instaCaptions": [
          "Caption option 1 with emoji and viral hashtag clusters",
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
          { "id": "m1", "day": "Monday", "platform": "TikTok", "content": "Publish TikTok script #1: Scroll stopping industry secret", "status": "draft" },
          { "id": "m2", "day": "Tuesday", "platform": "Instagram", "content": "Share Instagram Caption #1: Highlight the primary pain-point and bio link", "status": "draft" },
          { "id": "m3", "day": "Wednesday", "platform": "Email", "content": "Send Welcome Sequence Email #1: The value proposition overview", "status": "draft" },
          { "id": "m4", "day": "Thursday", "platform": "Facebook", "content": "Post corporate storytelling story to professional launch groups", "status": "draft" },
          { "id": "m5", "day": "Friday", "platform": "TikTok", "content": "Record behind-the-scenes screen walkthrough of the dashboard", "status": "draft" }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini error generating marketing content, using mock:', err);
    }
  }

  // Fallback marketing content
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
      `🚀 Stop trading your hours for dollars. If you are struggling to build in the "${idea}" space, it is time to deploy ${name}. Click the bio link to experience full automation. #solopreneur #indiehackers #aiemployees`,
      `Imagine waking up with Stripe notifications and drafted support replies already in your dashboard. That is the power of ${name}. Sign up today! 💸`
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
  const { name, offer, idea, taskCount, ticketCount, revenue } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are FounderPilot's elite Chief of Staff & Operations Agent.
      Generate a daily briefing report in JSON format for the business "${name}" based on the idea "${idea}".
      Current metrics:
      - Active Tasks in Approval Queue: ${taskCount}
      - Unresolved Support Tickets: ${ticketCount}
      - Simulated Today's Revenue: $${revenue}
      - Offer: "${offer}"

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
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(cleanJsonString(response.text || '{}'));
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini error generating briefing, using mock:', err);
    }
  }

  // Fallback Daily Briefing
  return res.json({
    summary: `Today we established the core blueprint for ${name}. Your AI employee roster is configured and actively generating initial assets for marketing, website construction, and Stripe checkouts.`,
    whatHappened: [
      'Successfully initialized the FounderPilot AI Operating System',
      'CEOs and Marketing Employees drafted the first multi-platform social launch campaign',
      'Product blueprints mapped and configured with corresponding pricing tiers'
    ],
    needsApproval: [
      `Review and approve ${taskCount} active items in your Task Approval Queue`,
      `Draft AI canned reply for the ${ticketCount} open customer support tickets`
    ],
    revenueSummary: `We are currently at $${revenue} today. Launching live transactions is dependent on taking your Stripe dashboard out of Sandbox mode.`,
    risks: [
      'Stripe Sandbox Key Warning: Application is in test mode. Real financial transactions are blocked.',
      'Unscheduled Marketing Posts: You have several draft campaigns awaiting approval to prevent launch latency.'
    ]
  });
});

// 5. API: Support Reply Generator
app.post('/api/generate-support-reply', async (req, res) => {
  const { name, message, customerName } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are FounderPilot's dedicated, highly empathetic, and professional Customer Support Agent.
      Draft a gorgeous, personalized customer support response email for our company "${name}".
      Customer name: "${customerName}"
      Inquiry received: "${message}"

      Generate only the text of the email reply. Do not include any normal system markers or JSON. Just draft the polite customer support text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      return res.json({ reply: response.text?.trim() });
    } catch (err) {
      console.error('Gemini error generating support reply, using mock:', err);
    }
  }

  // Fallback support reply
  return res.json({
    reply: `Hi ${customerName},\n\nThank you for reaching out to us at ${name}! We received your message: "${message}".\n\nOne of our team members is currently looking into this for you. We typically resolve all inquiries within 1-2 hours. If you have any additional details to share, please reply directly to this email.\n\nThank you for your patience and for choosing ${name}!\n\nBest regards,\nCustomer Support Team\n${name}`
  });
});

// 6. API: Founder Chat / CEO Brainstorming
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  const ai = getGeminiClient();

  if (ai) {
    try {
      // Reconstruct chat history in a format suitable for gemini-3.5-flash
      // If history is provided, we can pass it. The SDK supports chat:
      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction: `You are the lead AI Co-Founder and CEO of FounderPilot OS, a state-of-the-art interactive simulator and command center for solo business owners.
          Your tone is highly elite, strategic, structured, and deeply encouraging.
          Help the solo founder brainstorm, refine their business plan, define pricing, explore customer pain-points, and formulate marketing channels.
          Provide clear, structured bullet points and practical suggestions. Keep responses concise (under 250 words) to avoid visual noise.`,
        },
      });

      // Send the chat message
      // Note: chat.sendMessage can take history if configured or we can send a custom prompt containing history
      // To be safe and compliant with standard SDK without state mismatch, let's pass a compiled history block to generateContent or use standard chats.
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
        model: 'gemini-3.5-flash',
        contents: promptWithHistory,
        config: {
          systemInstruction: `You are the lead AI Co-Founder and CEO of FounderPilot OS. Respond elegantly and strategically in plain text or markdown.`,
        }
      });

      return res.json({ text: response.text || 'Understood. Let me look into that.' });
    } catch (err) {
      console.error('Gemini error during chat, using mock:', err);
    }
  }

  // Fallback Chat Response
  return res.json({
    text: `That is an excellent idea! As your AI Co-Founder, I recommend we capture this immediately inside our **Business Blueprint**. Let's align on your starter pricing models and target demographics to ensure immediate traction. I've automatically added a launch checklist task for us to complete.`
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
