import React, { useState } from 'react';
import { BusinessProfile, AgentFeedback, AssetAuditLogEntry } from '../types';
import AgentFeedbackWidget from './AgentFeedbackWidget';
import { Map, Sparkles, Check, Edit3, Loader2, Compass, Download, Layers } from 'lucide-react';

interface BlueprintViewProps {
  profile: BusinessProfile;
  setProfile: React.Dispatch<React.SetStateAction<BusinessProfile>>;
  onGenerateBlueprint: (idea: string) => Promise<void>;
  onCascadeVenture?: (idea: string) => Promise<void>;
  onExportDossier?: () => void;
  onOpenMarketResearch: () => void;
  feedbackList: AgentFeedback[];
  onAddFeedback: (feedback: Omit<AgentFeedback, 'id' | 'createdAt' | 'appliedCount'>) => void;
  onOpenTuningLab: () => void;
  onLogAuditAction?: (
    action: string,
    summary: string,
    approvalStatus: AssetAuditLogEntry['approvalStatus']
  ) => void;
}

export default function BlueprintView({
  profile,
  setProfile,
  onGenerateBlueprint,
  onCascadeVenture,
  onExportDossier,
  onOpenMarketResearch,
  feedbackList,
  onAddFeedback,
  onOpenTuningLab,
  onLogAuditAction
}: BlueprintViewProps) {
  const [ideaInput, setIdeaInput] = useState(
    profile.idea || 'Autonomous AI workflow & billing copilot for solo SaaS founders and boutique digital agencies'
  );
  const [loading, setLoading] = useState(false);
  const [cascading, setCascading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(profile.name || '');
  const [offer, setOffer] = useState(profile.offer || '');
  const [avatar, setAvatar] = useState(profile.avatar || '');
  const [problem, setProblem] = useState(profile.problem || '');

  const handleGenerate = async () => {
    if (!ideaInput.trim()) return;
    setLoading(true);
    try {
      await onGenerateBlueprint(ideaInput);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCascade = async () => {
    if (!ideaInput.trim() || !onCascadeVenture) return;
    setCascading(true);
    try {
      await onCascadeVenture(ideaInput);
    } finally {
      setCascading(false);
    }
  };

  const handleSaveOverrides = () => {
    setProfile((prev) => ({
      ...prev,
      idea: ideaInput,
      name,
      offer,
      avatar,
      problem
    }));
    onLogAuditAction?.(
      'Manual Business Blueprint Override',
      `Updated Venture Name ("${name}") and core offer positioning.`,
      'STAGED_DRAFT'
    );
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setName(profile.name);
    setOffer(profile.offer);
    setAvatar(profile.avatar);
    setProblem(profile.problem);
    setIsEditing(true);
  };

  const toggleChecklistItem = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    }));
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Business Blueprint</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Configure the core strategy, monetization packaging, and launch guidelines for your venture.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onExportDossier && (
            <button
              type="button"
              onClick={onExportDossier}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Dossier (.md)</span>
            </button>
          )}
          <button
            type="button"
            onClick={onOpenMarketResearch}
            className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <Compass className="w-3.5 h-3.5 text-orange-500" />
            <span>View CEO Market Research →</span>
          </button>
        </div>
      </div>

      {/* Idea Inputs / Generator Panel */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-3">
        <label className="text-xs font-semibold text-zinc-300 block">
          Describe Your Business Idea
        </label>
        <div className="flex flex-col md:flex-row md:items-stretch gap-3">
          <input
            type="text"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            placeholder="e.g., Curated platform of automated social marketing scripts for indie hackers"
            className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || cascading || !ideaInput.trim()}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 transition-all duration-150 disabled:opacity-40 shrink-0 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                <span>Architecting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Auto-Generate Blueprint</span>
              </>
            )}
          </button>
          {onCascadeVenture && (
            <button
              onClick={handleCascade}
              disabled={loading || cascading || !ideaInput.trim()}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 text-xs font-semibold bg-orange-500 hover:bg-orange-400 text-black transition-all duration-150 disabled:opacity-40 shrink-0 cursor-pointer whitespace-nowrap"
            >
              {cascading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>Cascading All Modules...</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-black" />
                  <span>1-Click Full Venture Cascade</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {profile.name ? (
        <div className="space-y-6">
          {/* Main Strategic Settings Grid */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Map className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-semibold text-zinc-100">Core Venture Parameters</h3>
              </div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveOverrides}
                    className="text-xs px-3 py-1.5 bg-orange-500 text-black hover:bg-orange-400 font-semibold transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-semibold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartEditing}
                  className="flex items-center space-x-1.5 text-xs px-3 py-1.5 bg-zinc-950 text-zinc-300 hover:text-zinc-100 border border-zinc-800 transition font-semibold cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                  <span>Manual Overrides</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Business Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-xs font-medium text-zinc-400">Irresistible Offer</label>
                  <input
                    type="text"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Target Avatar</label>
                  <textarea
                    rows={3}
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Problem Solved</label>
                  <textarea
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-zinc-500">Venture Title</span>
                  <div className="text-sm font-semibold text-zinc-100">{profile.name}</div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <span className="text-xs font-medium text-zinc-500">Value Proposition</span>
                  <div className="text-xs text-zinc-200 bg-zinc-950 p-4 border border-zinc-800 font-medium leading-relaxed">
                    &#34;{profile.offer}&#34;
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-zinc-500">Customer Avatar</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{profile.avatar}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-zinc-500">Core Painpoint</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">{profile.problem}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Products Packaging */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
              <h4 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
                Monetization Packaging (Marcus Vance · VP Product)
              </h4>
              <div className="space-y-3">
                {profile.products.map((prod, idx) => (
                  <div key={idx} className="p-3.5 bg-zinc-950 border border-zinc-800 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-zinc-100 flex items-center gap-2">
                        <span>{prod.name}</span>
                        {idx === 1 && (
                          <span className="text-[11px] font-mono text-orange-400">Recommended</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{prod.description}</p>
                    </div>
                    <div className="text-xs font-bold font-mono tabular-nums text-orange-400 shrink-0 bg-zinc-900 px-2.5 py-1 border border-zinc-800">
                      {prod.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Checklist */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
              <h4 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
                Deployment Launch Checklist
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-none">
                {profile.checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="w-full flex items-start space-x-3 p-2.5 bg-zinc-950/50 hover:bg-zinc-950 border border-zinc-800/60 hover:border-zinc-700 transition-all text-left text-xs cursor-pointer"
                  >
                    <div
                      className={`w-4 h-4 mt-0.5 flex items-center justify-center shrink-0 border ${
                        item.done
                          ? 'bg-orange-500 border-orange-500 text-black'
                          : 'border-zinc-700 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={`leading-normal ${item.done ? 'line-through text-zinc-500' : 'text-zinc-200 font-medium'}`}>
                      {item.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Tools */}
          <div className="bg-zinc-900 border border-zinc-800 p-5">
            <h4 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2 mb-4">
              Infrastructure Stack Recommendations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {profile.tools.map((tool, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="text-xs font-semibold text-zinc-100">{tool.name}</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">{tool.purpose}</p>
                  </div>
                  <div className="text-[11px] font-mono tabular-nums text-zinc-500 border-t border-zinc-800 pt-2 flex justify-between">
                    <span>Cost:</span>
                    <span className="text-zinc-300">{tool.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inline Feedback Widget for CEO Blueprint */}
          <AgentFeedbackWidget
            agentId="ceo"
            agentName="Sarah Chen (CEO)"
            outputType="blueprint"
            outputSummary={`Business Blueprint for ${profile.name}`}
            feedbackList={feedbackList}
            onAddFeedback={onAddFeedback}
            onRegenerateWithFeedback={handleGenerate}
            onOpenTuningLab={onOpenTuningLab}
          />
        </div>
      ) : (
        <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 text-center space-y-4">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500">
            <Map className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-zinc-200">No Blueprint Configured Yet</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Describe your business concept above and click <strong>Auto-Generate Blueprint</strong> to let Sarah Chen (CEO) and Marcus Vance (Product) structure your offer, pricing tiers, and launch checklist.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
