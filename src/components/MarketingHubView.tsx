import React, { useState } from 'react';
import { MarketingCampaign, AgentFeedback } from '../types';
import AgentFeedbackWidget from './AgentFeedbackWidget';
import {
  Megaphone,
  Sparkles,
  Video,
  Instagram,
  Facebook,
  Mail,
  Layout,
  Calendar,
  Check,
  Loader2
} from 'lucide-react';

interface MarketingHubViewProps {
  campaign: MarketingCampaign;
  setCampaign: React.Dispatch<React.SetStateAction<MarketingCampaign>>;
  onGenerateMarketing: () => Promise<void>;
  businessName: string;
  feedbackList: AgentFeedback[];
  onAddFeedback: (feedback: Omit<AgentFeedback, 'id' | 'createdAt' | 'appliedCount'>) => void;
  onOpenTuningLab: () => void;
}

export default function MarketingHubView({
  campaign,
  setCampaign,
  onGenerateMarketing,
  businessName,
  feedbackList,
  onAddFeedback,
  onOpenTuningLab
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

  const activeMarketingRules = feedbackList.filter(
    (f) => f.agentId === 'marketing' && f.active
  );

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
            <span>CMO Agent Rohan Joshi</span>
            <span>·</span>
            <span className="font-mono tabular-nums">
              {activeMarketingRules.length} Active Fine-Tuning {activeMarketingRules.length === 1 ? 'Rule' : 'Rules'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            AI Viral Marketing Hub
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Generate conversion-calibrated TikTok scripts, Instagram captions, email sequences, and ad copies using AI CMO Rohan Joshi.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold bg-orange-500 hover:bg-orange-400 text-black transition-all duration-150 disabled:opacity-40 cursor-pointer whitespace-nowrap shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
              <span>Regenerating Campaign...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Regenerate with Active Rules</span>
            </>
          )}
        </button>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex space-x-1 bg-zinc-950 p-1 border border-zinc-800 overflow-x-auto scrollbar-none">
        {[
          { id: 'tiktok', label: 'TikTok Scripts', icon: Video },
          { id: 'insta', label: 'Instagram Captions', icon: Instagram },
          { id: 'facebook', label: 'Founder Storytelling', icon: Facebook },
          { id: 'email', label: 'Email Sequences', icon: Mail },
          { id: 'ads', label: 'Ad Copywriting', icon: Layout },
          { id: 'calendar', label: 'Content Calendar', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold transition shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-zinc-900 text-zinc-100 border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300 border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-orange-500' : ''}`} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab Content Panels */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 min-h-[280px]">
        {/* 1. TikTok Scripts */}
        {activeSubTab === 'tiktok' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-xs font-semibold text-zinc-200">
                TikTok & Reels Short-Form Video Scripts
              </h3>
              <span className="text-xs text-zinc-500">Calibrated for high 3-second scroll hold</span>
            </div>
            <div className="space-y-4">
              {campaign.tiktokScripts.map((script, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-800 p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-semibold text-zinc-100">{script.title || 'Video Draft'}</span>
                    <span className="text-xs font-mono tabular-nums text-orange-400">
                      Target Hold Ratio: 82%
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3.5 bg-zinc-900 border border-zinc-800">
                      <span className="text-[11px] font-semibold text-orange-400 block mb-1">
                        0:00 – 0:03 Scroll-Stop Hook
                      </span>
                      <p className="text-zinc-200 leading-relaxed">&#34;{script.hook}&#34;</p>
                    </div>
                    <div className="p-3.5 bg-zinc-900 border border-zinc-800">
                      <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                        0:03 – 0:25 Value & Proof Body
                      </span>
                      <p className="text-zinc-300 leading-relaxed whitespace-pre-line">{script.body}</p>
                    </div>
                    <div className="p-3.5 bg-zinc-900 border border-zinc-800">
                      <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                        0:25 – 0:30 Conversion Call-to-Action
                      </span>
                      <p className="text-zinc-200 leading-relaxed">&#34;{script.callToAction}&#34;</p>
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
            <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
              Instagram Copywriting Drafts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaign.instaCaptions.map((cap, idx) => (
                <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 text-xs leading-relaxed text-zinc-300 space-y-2">
                  <div className="text-[11px] font-semibold text-orange-400">Caption Option 0{idx + 1}</div>
                  <p className="whitespace-pre-line text-zinc-300">{cap}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Facebook Storytelling */}
        {activeSubTab === 'facebook' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
              Founder Case Study & Storytelling Posts
            </h3>
            <div className="space-y-4">
              {campaign.facebookPosts.map((post, idx) => (
                <div key={idx} className="p-4 bg-zinc-950 border border-zinc-800 text-xs leading-relaxed text-zinc-300 space-y-2">
                  <div className="text-[11px] font-semibold text-orange-400">
                    LinkedIn / Facebook Longform Post 0{idx + 1}
                  </div>
                  <p className="whitespace-pre-line text-zinc-300">{post}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Email Sequences */}
        {activeSubTab === 'email' && (
          <div className="space-y-5">
            <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
              Lifecycle & Outbound Email Sequences
            </h3>
            <div className="space-y-4">
              {campaign.emailSequences.map((email, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-800 p-5 space-y-3 text-xs text-zinc-300">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <span className="font-semibold text-orange-400">Trigger: {email.trigger}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">Resend Automated Hook</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-zinc-500">Subject Line</span>
                    <div className="p-2.5 bg-zinc-900 border border-zinc-800 font-semibold text-zinc-100">
                      {email.subject}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-zinc-500">Email Body Copy</span>
                    <pre className="p-3.5 bg-zinc-900 border border-zinc-800 text-zinc-300 leading-relaxed font-sans whitespace-pre-line max-h-[180px] overflow-y-auto scrollbar-thin">
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
            <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
              Paid Acquisition Ad Directives
            </h3>
            <div className="space-y-4">
              {campaign.adIdeas.map((ad, idx) => (
                <div key={idx} className="p-5 bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-3">
                  <div>
                    <span className="text-[11px] font-medium text-zinc-500">Primary Ad Headline / Hook</span>
                    <div className="font-semibold text-orange-400 text-sm mt-0.5">&#34;{ad.hook}&#34;</div>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-zinc-500">Body Copy Pitch</span>
                    <p className="text-zinc-300 mt-0.5 leading-relaxed">{ad.description}</p>
                  </div>
                  <div className="border-t border-zinc-800 pt-2 flex justify-between text-xs">
                    <span className="text-zinc-500">Audience Targeting Parameters</span>
                    <span className="font-medium text-zinc-300">{ad.targeting}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Content Calendar Scheduler */}
        {activeSubTab === 'calendar' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-zinc-200 border-b border-zinc-800 pb-2">
              Social Launch Content Scheduler
            </h3>
            <div className="space-y-3">
              {campaign.calendar.map((event) => (
                <div key={event.id} className="p-3.5 bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs gap-4">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-center font-mono shrink-0">
                      <span className="text-[10px] text-zinc-500 block">DAY</span>
                      <span className="font-bold text-zinc-200">{event.day.slice(0, 3)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="text-orange-400 font-semibold">{event.platform}</span>
                        <span>·</span>
                        <span className="capitalize">{event.status}</span>
                      </div>
                      <p className="text-zinc-200 font-medium truncate mt-0.5">{event.content}</p>
                    </div>
                  </div>

                  {/* Interactive Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {event.status === 'draft' && (
                      <button
                        onClick={() => handleUpdateStatus(event.id, 'scheduled')}
                        className="text-xs font-semibold px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition cursor-pointer"
                      >
                        Schedule
                      </button>
                    )}
                    {event.status !== 'published' && (
                      <button
                        onClick={() => handleUpdateStatus(event.id, 'published')}
                        className="text-xs font-semibold px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-black transition cursor-pointer"
                      >
                        Publish Now
                      </button>
                    )}
                    {event.status === 'published' && (
                      <div className="flex items-center space-x-1 text-emerald-400 text-xs font-semibold px-2">
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

      {/* Inline Feedback & Fine-Tuning Widget for CMO Rohan Joshi */}
      <AgentFeedbackWidget
        agentId="marketing"
        agentName="Rohan Joshi (CMO)"
        outputType="marketing_campaign"
        outputSummary={`Multi-Channel Marketing Campaign (${businessName || 'FounderPilot Venture'})`}
        feedbackList={feedbackList}
        onAddFeedback={onAddFeedback}
        onRegenerateWithFeedback={handleGenerate}
        onOpenTuningLab={onOpenTuningLab}
      />
    </div>
  );
}
