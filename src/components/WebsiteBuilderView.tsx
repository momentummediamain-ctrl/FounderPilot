import React, { useState } from 'react';
import { WebsiteData } from '../types';
import { Globe, Sparkles, Layout, Monitor, Code, Eye, Edit2, ShieldCheck, Check, Loader2 } from 'lucide-react';

interface WebsiteBuilderViewProps {
  websiteData: WebsiteData;
  setWebsiteData: React.Dispatch<React.SetStateAction<WebsiteData>>;
  onGenerateWebsite: () => Promise<void>;
  businessName: string;
}

export default function WebsiteBuilderView({
  websiteData,
  setWebsiteData,
  onGenerateWebsite,
  businessName
}: WebsiteBuilderViewProps) {
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true); // Default to editing parameters side
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  // Form states
  const [heroTitle, setHeroTitle] = useState(websiteData.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState(websiteData.heroSubtitle || '');
  const [seoTitle, setSeoTitle] = useState(websiteData.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(websiteData.seoDescription || '');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerateWebsite();
      // Update form fields immediately
      setHeroTitle(websiteData.heroTitle);
      setHeroSubtitle(websiteData.heroSubtitle);
      setSeoTitle(websiteData.seoTitle);
      setSeoDescription(websiteData.seoDescription);
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
    alert('Website copy saved successfully. Toggle to Preview Mode to view updates.');
  };

  const handleDeploy = () => {
    setDeploying(true);
    setDeployed(false);
    setTimeout(() => {
      setDeploying(false);
      setDeployed(true);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">AI Landing Page Builder</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Configure automated copywriting, edit meta descriptions, and deploy high-converting pages in one click.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleGenerate}
            disabled={loading || !businessName}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-none bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-all duration-150 disabled:opacity-40 cursor-pointer"
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
            disabled={deploying || !businessName}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none bg-orange-500 hover:bg-orange-400 text-black transition-all shadow-sm cursor-pointer"
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
            ) : (
              <>
                <Globe className="w-3.5 h-3.5 text-black" />
                <span>Deploy Website</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!businessName ? (
        <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 rounded-none text-center space-y-4">
          <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500">
            <Globe className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">No Venture Active</h3>
            <p className="text-xs text-zinc-500">
              Define your business name and target audience in the **Founder Chat** or **Blueprint** tab first before editing web copies.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Editor/Simulator Controls Toggle */}
          <div className="lg:col-span-4 space-y-6">
            {/* View Mode Switcher */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-none p-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] pl-1">View Mode</span>
              <div className="flex space-x-1 bg-zinc-950 p-1 rounded-none border border-zinc-800">
                <button
                  onClick={() => setEditMode(true)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-none text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                    editMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Editor</span>
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-none text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                    !editMode ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Preview</span>
                </button>
              </div>
            </div>

            {/* Editable Copies Panel */}
            {editMode ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-none p-5 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-zinc-300 border-b border-zinc-800 pb-2 tracking-widest">Copy Parameters</h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Hero Main Header</label>
                    <textarea
                      rows={2}
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-zinc-200 placeholder-zinc-700 focus:outline-none resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Hero Subtitle</label>
                    <textarea
                      rows={4}
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-zinc-200 placeholder-zinc-700 focus:outline-none resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">SEO Page Title</label>
                    <input
                      type="text"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-zinc-200 focus:outline-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">SEO Page Description</label>
                    <textarea
                      rows={2}
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-zinc-200 focus:outline-none resize-none font-sans"
                    />
                  </div>

                  <button
                    onClick={handleSaveCopies}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-black uppercase tracking-wider rounded-none transition cursor-pointer"
                  >
                    Save & Update Landing Page
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-none p-5 space-y-4">
                <h3 className="text-[10px] font-black uppercase text-zinc-300 border-b border-zinc-800 pb-2 tracking-widest">SEO Status</h3>
                <div className="space-y-3 font-mono text-[10px] text-zinc-400 bg-zinc-950 p-3 rounded-none border border-zinc-800">
                  <div>
                    <span className="text-zinc-600">&lt;title&gt;</span>
                    <p className="text-zinc-200 font-semibold mt-1 truncate">{websiteData.seoTitle || heroTitle.slice(0, 50)}</p>
                    <span className="text-zinc-600">&lt;/title&gt;</span>
                  </div>
                  <div>
                    <span className="text-zinc-600">&lt;meta name="description" content="</span>
                    <p className="text-zinc-300 mt-1">{websiteData.seoDescription || heroSubtitle.slice(0, 100)}</p>
                    <span className="text-zinc-600">" /&gt;</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Browser Iframe Simulator Column */}
          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-none overflow-hidden shadow-md flex flex-col h-[550px]">
            {/* Header Browser Bar */}
            <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-950 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
              </div>
              <div className="flex-1 max-w-sm mx-4">
                <div className="w-full bg-black/40 border border-zinc-950 rounded-none py-1 px-3 text-[10px] text-zinc-500 font-mono flex items-center space-x-1.5 truncate">
                  <Globe className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>https://{businessName.toLowerCase().replace(/\s+/g, '')}.founderpilot.app</span>
                </div>
              </div>
              <div className="w-10"></div>
            </div>

            {/* Simulated Live Frame Content */}
            <div className="flex-1 overflow-y-auto bg-black text-zinc-300 p-6 space-y-12 select-none scrollbar-thin">
              {/* Landing Page Navbar */}
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900 shrink-0">
                <span className="text-sm font-black tracking-tighter text-orange-500">{businessName.toUpperCase()}</span>
                <div className="flex space-x-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  <span>Features</span>
                  <span>Pricing</span>
                  <span>FAQ</span>
                </div>
              </div>

              {/* Landing Hero Section */}
              <div className="text-center py-6 max-w-lg mx-auto space-y-4">
                <h1 className="text-xl md:text-2xl font-light italic text-white tracking-tight leading-tight">
                  "{websiteData.heroTitle || heroTitle}"
                </h1>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {websiteData.heroSubtitle || heroSubtitle}
                </p>
                <div className="flex justify-center space-x-3 pt-2">
                  <button className="px-5 py-2 rounded-none bg-orange-500 text-black font-bold uppercase tracking-wider text-[10px] shadow-sm cursor-pointer">
                    Get Started Free
                  </button>
                  <button className="px-5 py-2 rounded-none bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold uppercase tracking-wider text-[10px] cursor-pointer">
                    Book Demo
                  </button>
                </div>
              </div>

              {/* Landing Features Section */}
              <div className="space-y-6 pt-4 border-t border-zinc-900/60">
                <div className="text-center space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Features</span>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-white">Engineered for Solo Creators</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {websiteData.features.map((feat, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950 border border-zinc-850 rounded-none space-y-2">
                      <div className="text-zinc-200 font-bold text-xs">{feat.title}</div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed">{feat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landing Pricing Section */}
              <div className="space-y-6 pt-4 border-t border-zinc-900/60">
                <div className="text-center space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Monetization</span>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-white">Pristine Tier Pricing</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  {websiteData.pricingPlans.map((plan, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950 border border-zinc-850 rounded-none space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-white flex justify-between items-center">
                          <span>{plan.name}</span>
                          <span className="text-[10px] font-mono font-bold text-orange-500 bg-zinc-900 px-1.5 py-0.5 rounded-none border border-zinc-800">{plan.price}</span>
                        </div>
                        <ul className="space-y-1.5 text-[10px] text-zinc-500">
                          {plan.features.map((f, fidx) => (
                            <li key={fidx} className="flex items-center space-x-1.5">
                              <span className="text-orange-500">✓</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button className="w-full py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-[10px] font-bold text-orange-400 rounded-none border border-orange-500/30 transition mt-2 cursor-pointer">
                        Subscribe
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Landing FAQ Section */}
              <div className="space-y-6 pt-4 border-t border-zinc-900/60 pb-8">
                <div className="text-center space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">Support</span>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-white">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3 max-w-lg mx-auto">
                  {websiteData.faqs.map((faq, idx) => (
                    <div key={idx} className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-none text-[10px]">
                      <div className="font-semibold text-white mb-1">Q: {faq.question}</div>
                      <p className="text-zinc-500 leading-relaxed">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
