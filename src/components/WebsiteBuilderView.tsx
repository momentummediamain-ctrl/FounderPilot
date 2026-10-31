import React, { useState, useEffect } from 'react';
import { WebsiteData, AgentFeedback, AssetAuditLogEntry } from '../types';
import AgentFeedbackWidget from './AgentFeedbackWidget';
import { Globe, Sparkles, Eye, Edit2, ShieldCheck, Check, Loader2, Download, Lock } from 'lucide-react';

interface WebsiteBuilderViewProps {
  websiteData: WebsiteData;
  setWebsiteData: React.Dispatch<React.SetStateAction<WebsiteData>>;
  onGenerateWebsite: () => Promise<void>;
  businessName: string;
  feedbackList: AgentFeedback[];
  onAddFeedback: (feedback: Omit<AgentFeedback, 'id' | 'createdAt' | 'appliedCount'>) => void;
  onOpenTuningLab: () => void;
  ownerApprovedLaunch?: boolean;
  activeRole?: 'OWNER' | 'OPERATOR' | 'VIEWER';
  onQueueDeployTask?: () => void;
  onLogAuditAction?: (
    action: string,
    summary: string,
    approvalStatus: AssetAuditLogEntry['approvalStatus']
  ) => void;
}

export default function WebsiteBuilderView({
  websiteData,
  setWebsiteData,
  onGenerateWebsite,
  businessName,
  feedbackList,
  onAddFeedback,
  onOpenTuningLab,
  ownerApprovedLaunch = true,
  activeRole = 'OWNER',
  onQueueDeployTask,
  onLogAuditAction
}: WebsiteBuilderViewProps) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [gateBlockedError, setGateBlockedError] = useState<string | null>(null);

  const [heroTitle, setHeroTitle] = useState(websiteData.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(websiteData.heroSubtitle || '');
  const [seoTitle, setSeoTitle] = useState(websiteData.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(websiteData.seoDescription || '');

  useEffect(() => {
    setHeroTitle(websiteData.heroTitle || '');
    setHeroSubtitle(websiteData.heroSubtitle || '');
    setSeoTitle(websiteData.seoTitle || '');
    setSeoDescription(websiteData.seoDescription || '');
  }, [websiteData]);

  const displayVentureName = businessName || 'FounderPilot';

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerateWebsite();
      onLogAuditAction?.(
        'AI Website Copy Regenerated',
        `Evelyn Gray regenerated landing page copy & SEO metadata for ${displayVentureName}.`,
        'STAGED_DRAFT'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCopies = () => {
    setWebsiteData((prev) => ({
      ...prev,
      heroTitle,
      heroSubtitle,
      seoTitle,
      seoDescription
    }));
    onLogAuditAction?.(
      'Manual Website Copy Override',
      `Updated hero headline ("${heroTitle.slice(0, 42)}...") and SEO meta tags.`,
      'STAGED_DRAFT'
    );
    setToastMessage('Website copy updated and logged to Workspace Audit Log.');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleExportHtml = () => {
    const slug = displayVentureName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const htmlContent = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${websiteData.seoTitle || heroTitle}</title>
  <meta name="description" content="${websiteData.seoDescription || heroSubtitle}" />
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-orange-500 selection:text-black">
  <header class="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-800">
    <div class="text-sm font-bold tracking-wider uppercase text-orange-500">${displayVentureName}</div>
    <nav class="flex items-center gap-6 text-xs font-medium text-zinc-400">
      <a href="#features" class="hover:text-zinc-100">Features</a>
      <a href="#pricing" class="hover:text-zinc-100">Pricing</a>
      <a href="#faq" class="hover:text-zinc-100">FAQ</a>
    </nav>
  </header>

  <main class="max-w-5xl mx-auto px-6 py-20 space-y-24">
    <section class="text-center max-w-2xl mx-auto space-y-6">
      <h1 class="text-3xl md:text-5xl font-bold tracking-tight leading-tight text-zinc-100">${websiteData.heroTitle || heroTitle}</h1>
      <p class="text-sm md:text-base text-zinc-400 leading-relaxed">${websiteData.heroSubtitle || heroSubtitle}</p>
      <div class="flex items-center justify-center gap-4 pt-2">
        <a href="#pricing" class="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-black font-semibold text-xs transition">Get Started Free</a>
        <a href="#features" class="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold text-xs">Explore Architecture</a>
      </div>
    </section>

    <section id="features" class="space-y-8 border-t border-zinc-900 pt-16">
      <h2 class="text-lg font-bold text-center text-zinc-100">Core Platform Capabilities</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${websiteData.features
          .map(
            (f) => `<div class="p-6 bg-zinc-900 border border-zinc-800 space-y-2">
          <h3 class="text-sm font-semibold text-zinc-100">${f.title}</h3>
          <p class="text-xs text-zinc-400 leading-relaxed">${f.description}</p>
        </div>`
          )
          .join('\n')}
      </div>
    </section>

    <section id="pricing" class="space-y-8 border-t border-zinc-900 pt-16">
      <h2 class="text-lg font-bold text-center text-zinc-100">Transparent Tier Pricing</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        ${websiteData.pricingPlans
          .map(
            (p) => `<div class="p-6 bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-6">
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-semibold text-zinc-100">${p.name}</span>
              <span class="text-sm font-mono font-bold text-orange-400">${p.price}</span>
            </div>
            <ul class="space-y-2 text-xs text-zinc-400">
              ${p.features.map((feat) => `<li>✓ ${feat}</li>`).join('')}
            </ul>
          </div>
          <button class="w-full py-2.5 bg-orange-500 text-black font-semibold text-xs">Select ${p.name}</button>
        </div>`
          )
          .join('\n')}
      </div>
    </section>
  </main>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-landing-page.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onLogAuditAction?.(
      'Standalone HTML Exported',
      `Downloaded production landing page bundle (${slug}-landing-page.html).`,
      'OWNER_APPROVED'
    );
    setToastMessage(`Exported standalone HTML (${slug}-landing-page.html).`);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleDeploy = () => {
    if (!ownerApprovedLaunch || activeRole !== 'OWNER') {
      setGateBlockedError(
        !ownerApprovedLaunch
          ? 'Launch Gate Lock Active: Production website deployment is blocked until the Owner unlocks Public Launch in the Launch Gate.'
          : `RBAC Guard Blocked Deployment: Current role (${activeRole}) cannot deploy to production. Requires OWNER role.`
      );
      onLogAuditAction?.(
        'Blocked Website Deployment',
        `Attempted production website deploy while Launch Gate was locked or role was ${activeRole}.`,
        'BLOCKED_BY_GATE'
      );
      return;
    }

    setGateBlockedError(null);
    setDeploying(true);
    setDeployed(false);
    setTimeout(() => {
      setDeploying(false);
      setDeployed(true);
      onQueueDeployTask?.();
      onLogAuditAction?.(
        'Production Website Deployed',
        `Owner approved and deployed ${displayVentureName} landing page to production edge.`,
        'OWNER_APPROVED'
      );
      setToastMessage('Production deployment verified and logged to Audit Trail.');
      setTimeout(() => setToastMessage(''), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>Lead Web Architect Evelyn Gray</span>
            <span>·</span>
            <span>Conversion Rate Optimization</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">AI Landing Page Builder</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure conversion copywriting, edit SEO metadata, export standalone HTML, and deploy with Owner approval.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportHtml}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-all duration-150 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export HTML (.html)</span>
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-all duration-150 disabled:opacity-40 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                <span>Generating Copies...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Regenerate with AI</span>
              </>
            )}
          </button>

          <button
            onClick={handleDeploy}
            disabled={deploying}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-orange-500 hover:bg-orange-400 text-black transition-all cursor-pointer whitespace-nowrap"
          >
            {deploying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Deploying Code...</span>
              </>
            ) : deployed ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-black" />
                <span>Live on Production</span>
              </>
            ) : !ownerApprovedLaunch || activeRole !== 'OWNER' ? (
              <>
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>Deploy Website (Owner Gate)</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 text-black" />
                <span>Deploy Website</span>
              </>
            )}
          </button>
        </div>
      </div>

      {gateBlockedError && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between gap-4">
          <span>{gateBlockedError}</span>
          <button
            onClick={() => setGateBlockedError(null)}
            className="text-[11px] underline text-rose-200 cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor/Simulator Controls Toggle */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 pl-1">Workspace Mode</span>
            <div className="flex space-x-1 bg-zinc-950 p-1 border border-zinc-800">
              <button
                onClick={() => setEditMode(true)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  editMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Edit2 className="w-3 h-3" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setEditMode(false)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  !editMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>SEO Tags</span>
              </button>
            </div>
          </div>

          {editMode ? (
            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
                Copy Parameters
              </h3>

              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Hero Main Header</label>
                  <textarea
                    rows={2}
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">Hero Subtitle</label>
                  <textarea
                    rows={4}
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">SEO Page Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400">SEO Page Description</label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleSaveCopies}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer"
                >
                  Save & Stage Copy Update
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
                Compiled SEO Head Tags
              </h3>
              <div className="space-y-3 font-mono text-xs text-zinc-400 bg-zinc-950 p-3 border border-zinc-800">
                <div>
                  <span className="text-zinc-600">&lt;title&gt;</span>
                  <p className="text-zinc-200 font-semibold mt-1">{websiteData.seoTitle || heroTitle.slice(0, 50)}</p>
                  <span className="text-zinc-600">&lt;/title&gt;</span>
                </div>
                <div>
                  <span className="text-zinc-600">&lt;meta name=&quot;description&quot; content=&quot;</span>
                  <p className="text-zinc-300 mt-1">{websiteData.seoDescription || heroSubtitle.slice(0, 100)}</p>
                  <span className="text-zinc-600">&quot; /&gt;</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Browser Iframe Simulator Column */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 overflow-hidden flex flex-col h-[540px]">
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-zinc-500">Live Viewport Preview</span>
            </div>
            <div className="flex-1 max-w-sm mx-4">
              <div className="w-full bg-zinc-950 border border-zinc-800 py-1 px-3 text-xs text-zinc-400 font-mono flex items-center space-x-1.5 truncate">
                <Globe className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>https://{displayVentureName.toLowerCase().replace(/\s+/g, '')}.founderpilot.app</span>
              </div>
            </div>
            <div className="w-10" />
          </div>

          <div className="flex-1 overflow-y-auto bg-zinc-950 text-zinc-300 p-6 space-y-10 select-none scrollbar-thin">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800 shrink-0">
              <span className="text-sm font-bold tracking-tight text-orange-500">
                {displayVentureName.toUpperCase()}
              </span>
              <div className="flex space-x-5 text-xs font-medium text-zinc-400">
                <span>Features</span>
                <span>Pricing</span>
                <span>FAQ</span>
              </div>
            </div>

            <div className="text-center py-4 max-w-lg mx-auto space-y-4">
              <h1 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight leading-snug">
                {websiteData.heroTitle || heroTitle}
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {websiteData.heroSubtitle || heroSubtitle}
              </p>
              <div className="flex justify-center space-x-3 pt-2">
                <button className="px-5 py-2 bg-orange-500 text-black font-semibold text-xs cursor-pointer">
                  Get Started Free
                </button>
                <button className="px-5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-200 font-semibold text-xs cursor-pointer">
                  Book Demo
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <div className="text-center space-y-1">
                <h2 className="text-sm font-semibold text-zinc-100">Core Platform Capabilities</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {websiteData.features.map((feat, idx) => (
                  <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800 space-y-1.5">
                    <div className="text-zinc-100 font-semibold text-xs">{feat.title}</div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-900">
              <div className="text-center space-y-1">
                <h2 className="text-sm font-semibold text-zinc-100">Transparent Tier Pricing</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                {websiteData.pricingPlans.map((plan, idx) => (
                  <div key={idx} className="p-4 bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-zinc-100 flex justify-between items-center">
                        <span>{plan.name}</span>
                        <span className="text-xs font-mono tabular-nums font-bold text-orange-400">
                          {plan.price}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-zinc-400">
                        {plan.features.map((f, fidx) => (
                          <li key={fidx} className="flex items-center space-x-1.5">
                            <span className="text-orange-500">✓</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button className="w-full py-1.5 bg-zinc-950 hover:bg-zinc-800 text-xs font-semibold text-orange-400 border border-zinc-800 transition mt-2 cursor-pointer">
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Feedback & Fine-Tuning Widget for Web Architect Evelyn Gray */}
      <AgentFeedbackWidget
        agentId="website"
        agentName="Evelyn Gray (Web Architect)"
        outputType="website_copy"
        outputSummary={`Landing Page Copy & SEO (${displayVentureName})`}
        feedbackList={feedbackList}
        onAddFeedback={onAddFeedback}
        onRegenerateWithFeedback={handleGenerate}
        onOpenTuningLab={onOpenTuningLab}
      />
    </div>
  );
}
