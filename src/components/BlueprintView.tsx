import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { Map, Sparkles, Check, Play, Edit3, Trash, Plus, Loader2 } from 'lucide-react';

interface BlueprintViewProps {
  profile: BusinessProfile;
  setProfile: React.Dispatch<React.SetStateAction<BusinessProfile>>;
  onGenerateBlueprint: (idea: string) => Promise<void>;
}

export default function BlueprintView({ profile, setProfile, onGenerateBlueprint }: BlueprintViewProps) {
  const [ideaInput, setIdeaInput] = useState(profile.idea || '');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable fields state
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

  const handleSaveOverrides = () => {
    setProfile((prev) => ({
      ...prev,
      idea: ideaInput,
      name,
      offer,
      avatar,
      problem
    }));
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
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">Business Blueprint</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Configure the core strategy, monetization packaging, and launch guidelines for your business.
          </p>
        </div>
      </div>

      {/* Idea Inputs / Generator Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-none p-5 space-y-4">
        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] block">
          Describe your Business Idea
        </label>
        <div className="flex flex-col md:flex-row md:items-stretch gap-3">
          <input
            type="text"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            placeholder="e.g., Curated platform of automated social marketing scripts for indie hackers"
            className="flex-1 px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-medium text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 font-mono"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !ideaInput.trim()}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none bg-orange-500 hover:bg-orange-400 text-black transition-all duration-150 disabled:opacity-40 shrink-0 shadow-sm cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Architecting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Auto-Generate Blueprint</span>
              </>
            )}
          </button>
        </div>
      </div>

      {profile.name ? (
        <div className="space-y-6">
          {/* Main Strategic Settings Grid */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Map className="w-4 h-4 text-orange-500" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Core Parameters</h3>
              </div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveOverrides}
                    className="text-[10px] px-3 py-1.5 rounded-none bg-orange-500 text-black hover:bg-orange-400 font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-[10px] px-3 py-1.5 rounded-none bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleStartEditing}
                  className="flex items-center space-x-1.5 text-[10px] px-3 py-1.5 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-zinc-800 rounded-none transition font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-500" />
                  <span>Manual Overrides</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Business Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-medium text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5 col-span-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Irresistible Offer</label>
                  <input
                    type="text"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-medium text-zinc-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Target Avatar</label>
                  <textarea
                    rows={3}
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-medium text-zinc-200 focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Problem Solved</label>
                  <textarea
                    rows={3}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-medium text-zinc-200 focus:outline-none resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Venture Title</span>
                  <div className="text-sm font-semibold text-zinc-200">{profile.name}</div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Value Proposition</span>
                  <div className="text-xs text-zinc-300 bg-zinc-950/40 p-4 border border-zinc-800 border-l-2 border-l-orange-500 rounded-none font-medium leading-relaxed">
                    "{profile.offer}"
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Customer Avatar</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{profile.avatar}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Core Painpoint</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{profile.problem}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Products Packaging */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-none p-5 space-y-4">
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-wider border-b border-zinc-800 pb-2">
                Monetization Packaging
              </h4>
              <div className="space-y-3">
                {profile.products.map((prod, idx) => (
                  <div key={idx} className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-none flex items-start justify-between">
                    <div className="space-y-1 pr-4">
                      <div className="text-xs font-semibold text-zinc-200 flex items-center space-x-1.5">
                        <span>{prod.name}</span>
                        {idx === 1 && (
                          <span className="px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase bg-orange-500 text-black">
                            PRO
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal">{prod.description}</p>
                    </div>
                    <div className="text-xs font-bold font-mono text-zinc-300 shrink-0 bg-zinc-900 px-2.5 py-1 rounded-none border border-zinc-800">
                      {prod.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Checklist */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-none p-5 space-y-4">
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-wider border-b border-zinc-800 pb-2">
                Deployment Launch Checklist
              </h4>
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-none">
                {profile.checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="w-full flex items-start space-x-3 p-2 rounded-none bg-zinc-950/10 hover:bg-zinc-950/55 border border-transparent hover:border-zinc-800 transition-all text-left text-xs cursor-pointer"
                  >
                    <div className={`w-4 h-4 rounded-none mt-0.5 flex items-center justify-center shrink-0 border ${
                      item.done
                        ? 'bg-orange-500 border-orange-500 text-black'
                        : 'border-zinc-800 text-transparent'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className={`leading-normal ${item.done ? 'line-through text-zinc-500' : 'text-zinc-300 font-medium'}`}>
                      {item.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Tools */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-5">
            <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-wider border-b border-zinc-800 pb-2 mb-4">
              Infrastructure Tool recommendations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {profile.tools.map((tool, idx) => (
                <div key={idx} className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-none flex flex-col justify-between space-y-2">
                  <div>
                    <div className="text-xs font-semibold text-zinc-200">{tool.name}</div>
                    <p className="text-[10px] text-zinc-400 leading-normal mt-1">{tool.purpose}</p>
                  </div>
                  <div className="text-[9px] font-bold uppercase font-mono text-zinc-500 border-t border-zinc-800 pt-2 flex justify-between">
                    <span>Pricing:</span>
                    <span className="text-zinc-300">{tool.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 rounded-none text-center space-y-4">
          <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500 shadow-md">
            <Map className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">No Blueprint Configured</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Describe your business concept above, then click **Auto-Generate Blueprint** to let your co-founder agents structure names, product packages, tools, and checklists.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
