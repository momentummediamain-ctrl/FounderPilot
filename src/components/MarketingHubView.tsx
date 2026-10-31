import React, { useState } from 'react';
import { MarketingCampaign, CalendarEvent } from '../types';
import { Megaphone, Sparkles, Video, Instagram, Facebook, Mail, Layout, Calendar, Check, Loader2 } from 'lucide-react';

interface MarketingHubViewProps {
  campaign: MarketingCampaign;
  setCampaign: React.Dispatch<React.SetStateAction<MarketingCampaign>>;
  onGenerateMarketing: () => Promise<void>;
  businessName: string;
}

export default function MarketingHubView({
  campaign,
  setCampaign,
  onGenerateMarketing,
  businessName
}: MarketingHubViewProps) {
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'tiktok' | 'insta' | 'facebook' | 'email' | 'ads' | 'calendar'>('tiktok');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await onGenerateMarketing();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: 'draft' | 'scheduled' | 'published') => {
    setCampaign((prev) => ({
      ...prev,
      calendar: prev.calendar.map((event) =>
        event.id === id ? { ...event, status: newStatus } : event
      )
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">AI Viral Marketing Hub</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Generate high-converting TikTok scripts, Instagram post captions, cold sequences, and ad copies using AI CMO Rohan.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || !businessName}
          className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-none bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-all duration-150 disabled:opacity-40 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
              <span>Generating Marketing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Regenerate Campaigns</span>
            </>
          )}
        </button>
      </div>

      {!businessName ? (
        <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 rounded-none text-center space-y-4">
          <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500">
            <Megaphone className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">No Venture Active</h3>
            <p className="text-xs text-zinc-500">
              Define your business name and value propositions first to enable the social campaign engine.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sub Navigation Bar */}
          <div className="flex space-x-1 bg-zinc-950 p-1 rounded-none border border-zinc-800 overflow-x-auto scrollbar-none">
            {[
              { id: 'tiktok', label: 'TikTok Scripts', icon: Video },
              { id: 'insta', label: 'Instagram Captions', icon: Instagram },
              { id: 'facebook', label: 'Facebook storytelling', icon: Facebook },
              { id: 'email', label: 'Email sequences', icon: Mail },
              { id: 'ads', label: 'Ad copywriting', icon: Layout },
              { id: 'calendar', label: 'Content Calendar', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-none text-xs font-bold uppercase tracking-wider transition shrink-0 cursor-pointer border-b-2 ${
                    isActive
                      ? 'bg-zinc-900 text-zinc-100 border-zinc-800 border-b-orange-500 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-300 border-b-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-orange-500' : ''}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-tab Content Panels */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 min-h-[300px]">
            {/* 1. TikTok Scripts */}
            {activeSubTab === 'tiktok' && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-850 pb-2 tracking-widest">TikTok & Reels Video Scripts</h3>
                <div className="space-y-4">
                  {campaign.tiktokScripts.map((script, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-850 rounded-none p-5 space-y-4 text-xs">
                      <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                        <span className="font-bold text-zinc-300">{script.title || 'Video Draft'}</span>
                        <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded-none border border-zinc-800 font-mono text-orange-500 font-bold">HOOK RATIO: 82%</span>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-orange-500/5 border border-zinc-800 border-l-2 border-l-orange-500 rounded-none">
                          <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider block mb-1">0:00 - 0:03 Scroll Stop Hook</span>
                          <p className="text-zinc-300 italic leading-relaxed">"{script.hook}"</p>
                        </div>
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-none">
                          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-1">0:03 - 0:25 Body Content</span>
                          <p className="text-zinc-400 leading-relaxed whitespace-pre-line">{script.body}</p>
                        </div>
                        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-none">
                          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block mb-1">0:25 - 0:30 CTA Loop</span>
                          <p className="text-zinc-300 italic leading-relaxed">"{script.callToAction}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Instagram Captions */}
            {activeSubTab === 'insta' && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-850 pb-2 tracking-widest">Instagram Copywriting Drafts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.instaCaptions.map((cap, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950 border border-zinc-850 rounded-none text-xs leading-relaxed text-zinc-300 space-y-2 border-l-2 border-l-orange-500">
                      <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Caption Block #{idx + 1}</div>
                      <p className="whitespace-pre-line text-zinc-400">{cap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Facebook Storytelling */}
            {activeSubTab === 'facebook' && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-850 pb-2 tracking-widest">Conversational Storytelling Copies</h3>
                <div className="space-y-4">
                  {campaign.facebookPosts.map((post, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950 border border-zinc-850 rounded-none text-xs leading-relaxed text-zinc-300 space-y-2 border-l-2 border-l-orange-500">
                      <div className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Facebook/LinkedIn Longform #{idx + 1}</div>
                      <p className="whitespace-pre-line text-zinc-400">{post}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Email Sequences */}
            {activeSubTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-850 pb-2 tracking-widest">Transactional Email Marketing Sequences</h3>
                <div className="space-y-4">
                  {campaign.emailSequences.map((email, idx) => (
                    <div key={idx} className="bg-zinc-950 border border-zinc-850 rounded-none p-5 space-y-3 text-xs text-zinc-300">
                      <div className="flex justify-between items-center border-b border-zinc-850 pb-1">
                        <span className="font-bold text-orange-500">Trigger Workflow: {email.trigger}</span>
                        <span className="text-[9px] text-zinc-500 uppercase font-mono">Resend Template</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Subject Title</span>
                        <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-none font-semibold text-zinc-200">
                          {email.subject}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Email Body Copy</span>
                        <pre className="p-3 bg-zinc-900 border border-zinc-800 rounded-none text-zinc-400 leading-relaxed font-sans whitespace-pre-line resize-none max-h-[160px] overflow-y-auto scrollbar-thin">
                          {email.body}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Ads proposals */}
            {activeSubTab === 'ads' && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-850 pb-2 tracking-widest">Paid Advertising Directives</h3>
                <div className="space-y-4">
                  {campaign.adIdeas.map((ad, idx) => (
                    <div key={idx} className="p-5 bg-zinc-950 border border-zinc-850 rounded-none text-xs text-zinc-300 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Ad Display Headline / Hook</span>
                        <div className="font-bold text-orange-500 text-sm mt-0.5">"{ad.hook}"</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Body Copy Pitch</span>
                        <p className="text-zinc-400 mt-0.5 leading-relaxed">{ad.description}</p>
                      </div>
                      <div className="border-t border-zinc-850 pt-2 flex justify-between text-[11px]">
                        <span className="text-zinc-500 font-bold uppercase text-[9px]">Targeting Filters</span>
                        <span className="font-semibold text-zinc-400">{ad.targeting}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Content Calendar Scheduler */}
            {activeSubTab === 'calendar' && (
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-zinc-200 border-b border-zinc-850 pb-2 tracking-widest">Social Launch Scheduler</h3>
                <div className="space-y-3">
                  {campaign.calendar.map((event) => (
                    <div key={event.id} className="p-3.5 bg-zinc-950 border border-zinc-850 rounded-none flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-none text-center font-mono shrink-0">
                          <span className="text-[9px] font-black uppercase text-zinc-500 block">DAY</span>
                          <span className="font-bold text-zinc-300">{event.day.slice(0, 3)}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded-none text-[9px] font-bold uppercase bg-zinc-900 text-orange-500 border border-zinc-800 shrink-0">
                              {event.platform}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded-none text-[8px] font-bold uppercase shrink-0 ${
                              event.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : event.status === 'scheduled'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-zinc-800 text-zinc-500 border border-zinc-800'
                            }`}>
                              {event.status}
                            </span>
                          </div>
                          <p className="text-zinc-300 font-medium truncate mt-1 leading-relaxed">{event.content}</p>
                        </div>
                      </div>

                      {/* Interactive Actions */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {event.status === 'draft' && (
                          <button
                            onClick={() => handleUpdateStatus(event.id, 'scheduled')}
                            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-none transition cursor-pointer"
                          >
                            Schedule
                          </button>
                        )}
                        {event.status !== 'published' && (
                          <button
                            onClick={() => handleUpdateStatus(event.id, 'published')}
                            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 bg-orange-500 hover:bg-orange-400 text-black rounded-none transition cursor-pointer"
                          >
                            Publish Now
                          </button>
                        )}
                        {event.status === 'published' && (
                          <div className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold uppercase px-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Live</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
