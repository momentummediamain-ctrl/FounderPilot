import React, { useState } from 'react';
import { Settings, Database, Code, CreditCard, Send, ShieldCheck } from 'lucide-react';

export default function SetupInstructions() {
  const [activeTab, setActiveTab] = useState<'db' | 'api' | 'env' | 'deploy'>('db');

  const envContent = `# .env.local (Next.js & Express Configuration)

# 1. GOOGLE GEMINI DEEP REASONING API KEY
GEMINI_API_KEY="AI_STUDIO_SECRETS_KEY_GOES_HERE"

# 2. SUPABASE POSTGRES GENERAL CONNECTION (DATABASE)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY_HERE"

# 3. STRIPE MERCHANT PAYMENTS INTELLIGENCE
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 4. RESEND EMAIL API KEY
RESEND_API_KEY="re_..."

# 5. PRODUCTION HOST URL
APP_URL="https://founderpilot.app"`;

  const schemaContent = `-- PostgreSQL Database Schema (Supabase compliant)

-- 1. Create Profile Table (Tracks overall business parameters)
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  founder_email VARCHAR(255) NOT NULL,
  idea TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  offer TEXT,
  avatar TEXT,
  problem TEXT,
  pricing_plans JSONB,
  launch_checklist JSONB,
  recommended_tools JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Tasks Table (AI Employee approval queue)
CREATE TABLE IF NOT EXISTS approval_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending_approval' NOT NULL, -- pending_approval, approved, completed
  action_type VARCHAR(50) DEFAULT 'general' NOT NULL,
  external_payload JSONB,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Ticket Table (Customer support desk)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open' NOT NULL, -- open, resolved
  draft_reply TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

  const apiContent = `// Next.js Route Proxy: /app/api/ai/chat/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message,
      config: {
        systemInstruction: "You are the Co-Founder CEO of FounderPilot OS. Guide the founder in markdown.",
      }
    });

    return NextResponse.json({ text: response.text });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}`;

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Header */}
      <div className="pb-2">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">SaaS Architectural Specs</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Review clean-room specifications, Postgres database schemas, server endpoints, and production environment declarations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Sidebar specs items */}
        <div className="md:col-span-1 space-y-1 bg-zinc-900 p-2 border border-zinc-800 rounded-none">
          <button
            onClick={() => setActiveTab('db')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition cursor-pointer border-l-2 ${
              activeTab === 'db'
                ? 'bg-zinc-950 text-zinc-100 border border-zinc-800 border-l-orange-500'
                : 'text-zinc-500 hover:text-zinc-300 border-transparent border-l-transparent'
            }`}
          >
            <Database className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'db' ? 'text-orange-500' : ''}`} />
            <span>Postgres SQL</span>
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition cursor-pointer border-l-2 ${
              activeTab === 'api'
                ? 'bg-zinc-950 text-zinc-100 border border-zinc-800 border-l-orange-500'
                : 'text-zinc-500 hover:text-zinc-300 border-transparent border-l-transparent'
            }`}
          >
            <Code className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'api' ? 'text-orange-500' : ''}`} />
            <span>API Router</span>
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition cursor-pointer border-l-2 ${
              activeTab === 'env'
                ? 'bg-zinc-950 text-zinc-100 border border-zinc-800 border-l-orange-500'
                : 'text-zinc-500 hover:text-zinc-300 border-transparent border-l-transparent'
            }`}
          >
            <Settings className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'env' ? 'text-orange-500' : ''}`} />
            <span>Environment</span>
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition cursor-pointer border-l-2 ${
              activeTab === 'deploy'
                ? 'bg-zinc-950 text-zinc-100 border border-zinc-800 border-l-orange-500'
                : 'text-zinc-500 hover:text-zinc-300 border-transparent border-l-transparent'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'deploy' ? 'text-orange-500' : ''}`} />
            <span>Deploy steps</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="md:col-span-3 bg-zinc-900 border border-zinc-800 rounded-none p-6 min-h-[380px] flex flex-col justify-between">
          <div className="space-y-4">
            {activeTab === 'db' && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-widest">Supabase SQL Schema Script</h3>
                <pre className="p-4 bg-black border border-zinc-800 rounded-none text-[11px] text-zinc-400 font-mono leading-relaxed overflow-x-auto whitespace-pre scrollbar-thin max-h-[320px]">
                  {schemaContent}
                </pre>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-widest">Next.js 14+ Server-Side route handler</h3>
                <pre className="p-4 bg-black border border-zinc-800 rounded-none text-[11px] text-zinc-400 font-mono leading-relaxed overflow-x-auto whitespace-pre scrollbar-thin max-h-[320px]">
                  {apiContent}
                </pre>
              </div>
            )}

            {activeTab === 'env' && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-widest">Environment Variables Config</h3>
                <pre className="p-4 bg-black border border-zinc-800 rounded-none text-[11px] text-zinc-400 font-mono leading-relaxed overflow-x-auto whitespace-pre scrollbar-thin max-h-[320px]">
                  {envContent}
                </pre>
              </div>
            )}

            {activeTab === 'deploy' && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-widest">SaaS Deployment Roadmap</h3>
                <ul className="space-y-3 text-xs text-zinc-400 pl-1 leading-normal">
                  <li className="flex items-start space-x-2.5 p-3 bg-zinc-950 border border-zinc-850">
                    <span className="text-orange-500 mt-0.5">●</span>
                    <div>
                      <span className="font-bold text-zinc-200 block">Deploy Supabase DB:</span>
                      Initialize a free project, open the SQL Editor console, paste the schema script, and click Run.
                    </div>
                  </li>
                  <li className="flex items-start space-x-2.5 p-3 bg-zinc-950 border border-zinc-850">
                    <span className="text-orange-500 mt-0.5">●</span>
                    <div>
                      <span className="font-bold text-zinc-200 block">Stripe webhook configuration:</span>
                      Navigate to Developer &gt; Webhooks inside Stripe. Point the webhook URL back to your hosted backend route (`/api/stripe/webhook`).
                    </div>
                  </li>
                  <li className="flex items-start space-x-2.5 p-3 bg-zinc-950 border border-zinc-850">
                    <span className="text-orange-500 mt-0.5">●</span>
                    <div>
                      <span className="font-bold text-zinc-200 block">Push to Production on Vercel:</span>
                      Push the Next.js frontend to GitHub, connect Vercel to your repository, register your Env variables in project configurations, and trigger compile.
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-6 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
            <span>SaaS Architecture Draft</span>
            <span>✓ Complete specs compiled</span>
          </div>
        </div>
      </div>
    </div>
  );
}
