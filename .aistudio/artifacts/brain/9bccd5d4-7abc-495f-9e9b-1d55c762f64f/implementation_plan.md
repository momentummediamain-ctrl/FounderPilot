# FounderPilot OS — Production Upgrade & Multi-Agent Architecture Plan

This plan upgrades **FounderPilot OS** into an audit-verifiable, multi-agent AI business operating system featuring Google Search–grounded market research with citations, direct 1-on-1 specialist chat plus collaborative multi-agent task assignment, a 1-click full venture cascade, categorized desktop sidebar and collapsible mobile navigation drawer, exportable HTML/Markdown deliverables, and durable disk-backed multi-tenant storage where Launch Gate and Owner Approval locks strictly govern all publishing, spending, deployments, and external service modifications.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX decisions incorporate all confirmed selections and governance requirements:

- **Confirmed Decision 1 — Direct Specialist Chat & Collaborative Multi-Agent Tasks**: Founders can chat 1-on-1 with any of the **8 AI Specialists** (each maintaining role-specific context and shared access to approved business assets) OR select multiple agents to run a **Collaborative Multi-Agent Task** (e.g., CEO + CMO + Web Architect jointly updating positioning, landing page copy, and campaign scripts).
- **Confirmed Decision 2 — Asset Audit Log & Strict Owner Approval Gate**: Every asset modification is logged in an immutable **Workspace Change & Audit Log**, and any consequential action (publishing posts, spending/billing changes, website deployment, or external service triggers) is locked until explicitly approved by the `OWNER` role, producing a cryptographic **SHA-256 Action Receipt**.
- **Confirmed Decision 3 — Categorized Desktop Sidebar & Touch-Friendly Mobile Drawer**: Desktop viewports render a structured 4-category sidebar (**01. Command & Strategy**, **02. Growth & Assets**, **03. Operations & Billing**, **04. Governance & Specs**), while mobile/tablet viewports provide a collapsible, touch-friendly navigation drawer ($\ge 44\text{px}$ tap targets) with **Command Center** and **Launch Gate (12/12)** always pinned in the top bar.
- **Confirmed Decision 4 — Verified Market Research Citations, Deliverable Exports & Disk Persistence**: Market research and Market Intel include clickable Google Search citations; founders can export standalone **Landing Page HTML** and **Executive Dossier Markdown** files; and all tenant records persist to a durable server-side disk store (`.data/founderpilot-store.json`).

---

## 1. Overview & Core Concept

- **What It Does**: Enables solo founders to research a market with live Google Search citations, collaborate with individual or multi-agent AI teams that share approved venture context, draft and update business assets with full change logging, and enforce strict Owner Approval and Launch Gate locks before any publishing, payment, or deployment action executes.
- **Target Audience / Persona**: Bootstrapped solo SaaS founders, technical operators, and lean digital agencies managing isolated venture workspaces across desktop and mobile devices.
- **Key Value**: Combines multi-agent collaboration and 1-click asset synchronization with institutional-grade safety—separating demo simulations from verified financial ledgers and guaranteeing zero unapproved external actions or spend.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Command Center & Launch Gate Top Bar (Desktop & Mobile)**: Pinned header provides 1-click access to the **Command Center**, **Launch Gate (12/12)**, **1-Click Venture Cascade**, and **Authenticated Tenant/Role Switcher** (`OWNER` vs. `VIEWER`), plus a touch-friendly hamburger trigger on mobile that opens the collapsible categorized navigation drawer.
  2. **Verified Market Research with Citations & 1-Click Cascade**: Founder runs a Google Search–grounded market analysis returning TAM/SAM/SOM sizing, competitor matrices, live news trends, and clickable source citations, then triggers a **Full Venture Cascade** to draft synchronized updates across Blueprint, Website, and Marketing assets.
  3. **Direct Specialist Chat & Collaborative Multi-Agent Assignment**: In **Founder Chat**, the founder toggles between **1-on-1 Specialist Mode** (chatting with Sarah CEO, Marcus Product, Evelyn Website, Rohan Marketing, Diana Sales, Kenji Support, Aisha Finance, or Liam Operations with role-specific memory) and **Collaborative Squad Mode** (selecting 2+ agents to jointly draft business asset updates and queue coordinated approval tasks).
  4. **Owner Approval & Launch Gate Enforcement Lock**: Attempting to publish marketing campaigns, deploy the website, or modify Stripe billing while unapproved or while the Launch Gate lock is unverified is blocked with a clear governance prompt. Once approved by the `OWNER`, execution issues a signed **SHA-256 Action Receipt** and logs the change in the **Workspace Audit Log**.
  5. **Deliverable Export Suite**: One-click export of a standalone **Landing Page HTML/Tailwind file** and a **Complete Executive Venture Dossier (.md)** including citations and audit receipts.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: High-contrast industrial precision (**Artistic Flair** dark slate/zinc palette) with zero decorative pill clutter.
  - *Color Palette & Mood*: Deep carbon canvas (`bg-zinc-950`), elevated surface panels (`bg-zinc-900`), crisp 1px structural borders (`border-zinc-800`), vibrant orange primary action accent (`bg-orange-500`, `text-orange-400`), and semantic status tokens (`text-emerald-400` for verified/approved, `text-amber-400` for pending approval/sandbox demo, `text-rose-400` for Launch Gate/RBAC blocks).
  - *Typography & Hierarchy*: Crisp sans-serif headings paired with strict monospace tabular numerals (`font-mono tabular-nums`) for all financial metrics, citation indices, SHA-256 hashes, and audit timestamps.
  - *Component Styling & Layout*: Single-elevation flat cards with 1px borders, categorized desktop sidebar ($256\text{px}$ width), responsive slide-over mobile drawer with $\ge 44\text{px}$ touch targets, and unboxed inline metadata separated by middle dots (`·`).
- **Interactive Feedback & Motion**: Smooth drawer transitions on mobile, step-by-step progress indicators during multi-agent collaboration and venture cascades, and real-time audit log entries on every asset mutation.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1 — Shared Approved Context + Per-Agent Role Memory**:
  - *Chosen Approach*: Maintain per-agent conversation threads and role-specific system instructions while injecting the venture's approved `BusinessProfile`, `MarketResearchReport`, active `AgentFeedback` rules, and recent `AuditLogEntry` history into every specialist or multi-agent prompt.
  - *Why*: Ensures Evelyn (Website) and Rohan (Marketing) automatically know what Sarah (CEO) and Marcus (Product) established without manual copy-pasting, while respecting each specialist's domain lens.
- **Decision 2 — Hard Launch Gate & Owner Approval Locks on Consequential Actions**:
  - *Chosen Approach*: Enforce both client-side and server-side guards on website deployment, marketing publication, Stripe setup changes, and task execution so they require `role === 'OWNER'`, explicit task approval, and an active Launch Gate sign-off.
  - *Why*: Guarantees no accidental or unauthorized publishing, spending, or external service modifications can occur.
- **Decision 3 — Durable Disk-Backed Multi-Tenant Storage (`.data/founderpilot-store.json`)**:
  - *Chosen Approach*: Persist all tenant workspaces, agent chat histories, asset change logs, and SHA-256 execution receipts to a server-side JSON store on disk with checksum verification.
  - *Why*: Ensures complete durability across server restarts and browser sessions while enforcing strict tenant isolation.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│        Responsive Top Bar (Command Center · Launch Gate · Mobile Menu)       │
│  [☰ Mobile Drawer] [Tenant · Role: OWNER] [Command Center] [Launch Gate]     │
└───────────────────┬──────────────────────────────────────────────────────────┘
                    │
┌───────────────────┴───────────────────┐  ┌───────────────────────────────────┐
│   Categorized Nav (Desktop & Drawer)  │  │       Main Workspace Viewport     │
│  01. Command & Strategy               │  │  • CEO Market Research + Citations│
│      - Command Center (Briefing)      │  │  • Specialist & Multi-Agent Chat  │
│      - Founder Onboarding             │  │  • Business Blueprint + Export    │
│      - CEO Market Research (Cited)    │  │  • Website Builder + HTML Export  │
│      - Specialist & Squad Chat        │  │  • Marketing Hub (Approval-Gated) │
│      - Business Blueprint             │  │  • Task Queue + SHA-256 Receipts  │
│  02. Growth & Assets                  │  │  • Stripe Test-Mode Lifecycle     │
│      - Website Builder (Approval Lock)│  │  • Revenue Desk (Live vs. Demo)   │
│      - Marketing Hub (Approval Lock)  │  │  • Launch Readiness & Audit Log   │
│      - Feedback & Fine-Tuning Lab     │  └─────────────────┬─────────────────┘
│  03. Operations & Billing             │                    │
│      - Task Queue & Receipts          │                    ▼
│      - AI Employees Roster            │  ┌───────────────────────────────────┐
│      - Stripe Test-Mode Setup         │  │   Express Server Proxy (/api/*)   │
│      - Support Success Desk           │  │  • /api/generate-market-research  │
│      - Revenue Desk (Verified Ledger) │  │  • /api/market-intel (Grounded)   │
│  04. Governance & Architecture        │  │  • /api/cascade-venture           │
│      - Launch Gate & Audit Log (12/12)│  │  • /api/chat (1-on-1 & Multi-Ag.) │
│      - Architecture & CI Specs        │  │  • /api/tasks/execute-with-receipt│
└───────────────────────────────────────┘  │  • /api/records/save & /restore   │
                                           └─────────────────┬─────────────────┘
                                                             │
                                                             ▼
                                           ┌───────────────────────────────────┐
                                           │ Durable Multi-Tenant Disk Storage │
                                           │   (.data/founderpilot-store.json) │
                                           │  + Asset Audit Log & SHA-256 Hash │
                                           └───────────────────────────────────┘
```

- **Data Model & State**:
  - `MarketResearchReport`: Includes `citations: { title: string; uri: string }[]` and `groundingVerified: boolean` from Google Search grounding.
  - `ChatMessage`: Includes `agentId?: AgentId`, `collaborators?: AgentId[]`, `proposedAssetUpdate?: { target: 'blueprint' | 'website' | 'marketing'; summary: string; payload: any }`, and `queuedTaskId?: string`.
  - `AssetAuditLogEntry`: Tracks `{ id, timestamp, actor, agentId, action, targetAsset, summary, approvalStatus, receiptId }` for every change across the workspace.
  - `LaunchGateState`: Tracks `ownerApprovedLaunch: boolean` and blocks publishing, spending, or deploying to external services unless explicit owner approval is granted.
- **Interactive Component & State Mapping**:
  - **Specialist & Collaborative Squad Chat (`FounderChat.tsx` + `POST /api/chat`)**: Supports selecting a single specialist or a multi-agent squad; agent responses can propose asset updates that are logged to `auditLogs` and require Owner approval before publishing or deploying.
  - **Approval-Gated Publishing & Deployment (`WebsiteBuilderView.tsx`, `MarketingHubView.tsx`, `PaymentAssistantView.tsx`)**: Clicking Deploy Website, Publish Campaign, or Modify Billing checks `ownerApprovedLaunch` and `activeTenant.role === 'OWNER'`, queuing or executing a verified task with a cryptographic `ActionReceipt`.
