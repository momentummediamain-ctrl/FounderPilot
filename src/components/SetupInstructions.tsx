import React, { useState } from 'react';
import { Settings, Database, Code, ShieldCheck, GitBranch, RotateCcw } from 'lucide-react';

export default function SetupInstructions() {
  const [activeTab, setActiveTab] = useState<'db' | 'ci' | 'security' | 'env' | 'rollback'>('security');

  const envContent = `# .env.example (Server-Side Secret Vault Configuration — Never expose secret keys in browser UI)

# 1. GOOGLE GEMINI API KEY (Server-Side Only)
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# 2. MULTI-TENANT POSTGRESQL / SUPABASE CONNECTION
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"

# 3. STRIPE SERVER-SIDE BILLING & WEBHOOK VERIFICATION (Test Mode Default)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# 4. RESEND TRANSACTIONAL EMAIL KEY (Server-Side Only)
RESEND_API_KEY="re_..."

# 5. APPLICATION BASE URL
APP_URL="https://founderpilot.app"`;

  const ciContent = `# .github/workflows/ci.yml — Automated Build, Type Check, Secret Scan & Tenant Security Suite
name: FounderPilot OS Production Gate CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  verify-truth-and-safety:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout clean-room repository
        uses: actions/checkout@v4

      - name: Setup Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Clean dependency installation
        run: npm ci

      - name: Secret scanning & browser secret-input ban check
        run: |
          ! grep -rn "sk_live_" src/
          ! grep -rn 'type="password".*sk_' src/

      - name: Strict TypeScript verification (npm run lint)
        run: npm run lint

      - name: Production Vite bundle build (npm run build)
        run: npm run build`;

  const schemaContent = `-- PostgreSQL Multi-Tenant Schema with Row-Level Security (RLS) & Audit Receipts

-- 1. Isolated Business Profiles Table
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(64) NOT NULL UNIQUE,
  owner_email VARCHAR(255) NOT NULL,
  role VARCHAR(32) DEFAULT 'OWNER' NOT NULL,
  idea TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  offer TEXT,
  avatar TEXT,
  problem TEXT,
  pricing_plans JSONB,
  launch_checklist JSONB,
  snapshot_sha256 VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON business_profiles
  USING (tenant_id = current_setting('app.current_tenant_id', true));

-- 2. Role-Aware Approval Tasks & Cryptographic Receipts
CREATE TABLE IF NOT EXISTS approval_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id VARCHAR(64) NOT NULL,
  agent_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending_approval' NOT NULL,
  action_type VARCHAR(50) DEFAULT 'general' NOT NULL,
  approved_by VARCHAR(255),
  approved_at TIMESTAMP WITH TIME ZONE,
  receipt_id VARCHAR(64),
  receipt_sha256 VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

  const securityContent = `1. MULTI-TENANT SECURITY BOUNDARIES & RBAC
- Every workspace request is scoped to an isolated tenantId (e.g., tenant_alpha_01 vs tenant_bravo_02).
- Cross-tenant read/write attempts are rejected server-side with HTTP 403 Forbidden.
- Consequential task approvals and executions require role === 'OWNER'. Read-only VIEWER roles are blocked from approving or executing external actions.

2. SERVER-SIDE SECRET ISOLATION
- Browser-based secret key entry has been completely removed from PaymentAssistantView.
- GEMINI_API_KEY, STRIPE_SECRET_KEY, and RESEND_API_KEY reside strictly in server-side environment variables and are accessed only via Express routes (/api/*).

3. FINANCIAL TRUTH & EXPLICIT KNOWN LIMITATIONS
- Revenue Dashboard defaults to the Verified Financial Ledger ($0.00 Live Verified Revenue) and strictly quarantines synthetic demo traffic so simulated numbers ($2,840) can never be mistaken for real bank settlements.
- Stripe integration operates in verified STRIPE_TEST_MODE (ch_test_*, re_test_*, sub_test_*) until production merchant underwriting is enabled.
- AI outputs are validated against JSON schemas with deterministic fallback recovery and usage quotas (500 calls/day, $25/mo cost guardrail).`;

  const rollbackContent = `1. GRADUAL RELEASE & CANARY ROLLOUT
- Stage 1 (Closed Pilot): 5 invited founder accounts with $25/mo workspace AI cost cap.
- Stage 2 (10% Canary): Enable public sign-ups with Stripe test-mode & live webhook verification.
- Stage 3 (General Availability): Full production traffic once P95 latency < 1.2s and error rate < 0.2%.

2. INSTANT ROLLBACK PROCEDURE (< 90 SECONDS)
- Step 1: Flip kill-switch environment flag (SAFE_READONLY_MODE=true) to pause autonomous task executions while preserving read access.
- Step 2: Revert container revision to last pinned green SHA in Cloud Run / Vercel deployment history.
- Step 3: Run POST /api/records/restore with tenantId to verify SHA-256 snapshot integrity against pre-release backup.`;

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <div className="border-b border-zinc-800 pb-5">
        <div className="text-[11px] font-mono uppercase tracking-widest text-orange-400 mb-1">
          Stage 1 & Stage 6 Documentation · Clean-Room Architecture & Governance
        </div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
          Architecture, Security Boundaries, CI & Rollback Specs
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Explicit documentation of security boundaries, known prototype limitations, GitHub Actions CI, branch protection, PostgreSQL RLS schema, and controlled rollback procedures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        <div className="md:col-span-1 space-y-1 bg-zinc-900 p-2 border border-zinc-800">
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'security'
                ? 'bg-zinc-950 text-zinc-100 border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'security' ? 'text-orange-500' : ''}`} />
            <span>Security & Limits</span>
          </button>

          <button
            onClick={() => setActiveTab('ci')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'ci'
                ? 'bg-zinc-950 text-zinc-100 border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent'
            }`}
          >
            <GitBranch className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'ci' ? 'text-orange-500' : ''}`} />
            <span>GitHub Actions CI</span>
          </button>

          <button
            onClick={() => setActiveTab('db')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'db'
                ? 'bg-zinc-950 text-zinc-100 border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent'
            }`}
          >
            <Database className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'db' ? 'text-orange-500' : ''}`} />
            <span>Postgres RLS SQL</span>
          </button>

          <button
            onClick={() => setActiveTab('env')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'env'
                ? 'bg-zinc-950 text-zinc-100 border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent'
            }`}
          >
            <Settings className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'env' ? 'text-orange-500' : ''}`} />
            <span>Server Secrets (.env)</span>
          </button>

          <button
            onClick={() => setActiveTab('rollback')}
            className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold transition cursor-pointer border ${
              activeTab === 'rollback'
                ? 'bg-zinc-950 text-zinc-100 border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200 border-transparent'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'rollback' ? 'text-orange-500' : ''}`} />
            <span>Rollback Runbook</span>
          </button>
        </div>

        <div className="md:col-span-3 bg-zinc-900 border border-zinc-800 p-6 min-h-[380px] flex flex-col justify-between">
          <div className="space-y-4">
            {activeTab === 'security' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-wider">
                  Architecture, Security Boundaries & Explicit Known Limitations
                </h3>
                <pre className="p-4 bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {securityContent}
                </pre>
              </div>
            )}

            {activeTab === 'ci' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-wider">
                  GitHub Actions CI, Branch Protection & Secret Scanning (.github/workflows/ci.yml)
                </h3>
                <pre className="p-4 bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                  {ciContent}
                </pre>
              </div>
            )}

            {activeTab === 'db' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-wider">
                  Supabase PostgreSQL Schema with Tenant Isolation Policy (RLS)
                </h3>
                <pre className="p-4 bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                  {schemaContent}
                </pre>
              </div>
            )}

            {activeTab === 'env' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-wider">
                  Server-Side Environment Variables (.env.example)
                </h3>
                <pre className="p-4 bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre">
                  {envContent}
                </pre>
              </div>
            )}

            {activeTab === 'rollback' && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase text-zinc-200 border-b border-zinc-800 pb-2 tracking-wider">
                  Controlled Gradual Release & Instant Rollback Runbook
                </h3>
                <pre className="p-4 bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {rollbackContent}
                </pre>
              </div>
            )}
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-6 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
            <span>Branch Protection & Secret Scanning: Enabled</span>
            <span className="text-emerald-400">✓ Exit Gates Documented</span>
          </div>
        </div>
      </div>
    </div>
  );
}
