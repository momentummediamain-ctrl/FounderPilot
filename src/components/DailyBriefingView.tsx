import React, { useState } from 'react';
import { Briefing, Task, Ticket } from '../types';
import { FileText, Calendar, TrendingUp, AlertTriangle, CheckSquare, Sparkles, Loader2 } from 'lucide-react';

interface DailyBriefingViewProps {
  briefing: Briefing;
  tasks: Task[];
  tickets: Ticket[];
  revenue: number;
  businessName: string;
  businessIdea: string;
  onRefreshBriefing: () => Promise<void>;
}

export default function DailyBriefingView({
  briefing,
  tasks,
  tickets,
  revenue,
  businessName,
  businessIdea,
  onRefreshBriefing
}: DailyBriefingViewProps) {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await onRefreshBriefing();
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending_approval').length;
  const unresolvedCount = tickets.filter((t) => t.status === 'open').length;

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Welcome Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">Daily Business Briefing</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Operations intelligence and strategic recommendations compiled by your chief staff agents.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading || !businessName}
          className="flex items-center space-x-2 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-none bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
              <span>Analyzing Operations...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Regenerate Briefing</span>
            </>
          )}
        </button>
      </div>

      {!businessName ? (
        <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 rounded-none text-center space-y-4">
          <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            You haven't defined a business yet! Head to the **Founder Chat** or **Business Blueprint** tab, enter your business idea, and let the AI compile your initial operating blueprints.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Hero Briefing Section */}
          <div className="bg-zinc-900 border border-zinc-800 flex flex-col relative overflow-hidden rounded-none">
            <div className="absolute top-0 right-0 p-4">
              <div className="text-[10px] text-zinc-600 font-mono">REF: {briefing.date ? briefing.date.replace(/\//g, '-') : 'DAILY-INFO'}</div>
            </div>
            <div className="p-8 flex-1 flex flex-col justify-end space-y-6">
              <div className="max-w-2xl space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-black">
                  Daily Briefing / {briefing.date || 'TODAY'}
                </p>
                <h2 className="text-2xl md:text-3xl font-light leading-tight italic text-zinc-200">
                  "{briefing.summary}"
                </h2>
              </div>

              <div className="flex flex-wrap gap-8 md:gap-12 border-t border-zinc-800 pt-6">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Conversion</p>
                  <p className="text-xl font-medium text-zinc-100 font-mono">
                    4.8% <span className="text-xs text-emerald-500 font-bold font-mono">+1.2%</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Pending Tasks</p>
                  <p className="text-xl font-medium text-zinc-100 font-mono">
                    {pendingCount < 10 ? `0${pendingCount}` : pendingCount} <span className="text-[8px] bg-orange-500 text-black px-1.5 font-black uppercase tracking-wider rounded-sm align-middle ml-1">CRITICAL</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Revenue Est.</p>
                  <p className="text-xl font-medium text-zinc-100 font-mono">${revenue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Customer Support</p>
                  <p className="text-xl font-medium text-zinc-100 font-mono">
                    {unresolvedCount < 10 ? `0${unresolvedCount}` : unresolvedCount} <span className="text-xs text-zinc-500">INBOX</span>
                  </p>
                </div>
              </div>
            </div>
            {/* Orange gauge meter at the bottom of the section */}
            <div className="h-1 bg-zinc-800 w-full flex">
              <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${Math.min(100, Math.max(15, (revenue / 500) * 100))}%` }}></div>
            </div>
          </div>

          {/* Grids under Hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Milestones & Action Queue */}
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Milestones Achieved Today</span>
                </div>
                <ul className="space-y-3">
                  {briefing.whatHappened.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2.5 text-xs text-zinc-400 leading-relaxed">
                      <span className="text-orange-500 mt-0.5 font-black shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Action Queue Details</span>
                  <span className="bg-orange-500 text-black text-[9px] px-2 font-black rounded-full">
                    {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
                  </span>
                </div>
                {pendingCount > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Staff agents have compiled setup requirements awaiting your owner authorization.
                    </p>
                    <ul className="space-y-2">
                      {briefing.needsApproval.map((item, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-zinc-950 p-3 border border-zinc-800 rounded-none">
                          <span className="text-orange-500 font-bold font-mono">!</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">No actions pending. All systems clear.</p>
                )}
              </div>
            </div>

            {/* Right Column: Risks & Roadmap Goal */}
            <div className="space-y-6">
              <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Risk Mitigation Plan</span>
                </div>
                <ul className="space-y-3">
                  {briefing.risks.map((risk, index) => (
                    <li key={index} className="flex items-start space-x-2.5 text-xs text-zinc-400 leading-relaxed bg-zinc-950/40 p-3 border border-zinc-800 rounded-none">
                      <span className="text-orange-500 font-black shrink-0">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Core Goal Roadmap</span>
                  <span className="text-[9px] font-mono font-bold text-orange-500 uppercase tracking-widest">PHASE 1</span>
                </div>
                <div className="bg-orange-500 p-4 rounded-none text-black space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-900/80">Active Venture Target</p>
                  <p className="text-sm font-black leading-tight">Complete initial setup and launch product in sandbox.</p>
                  <div className="w-full bg-black/20 h-1 mt-3">
                    <div className="w-[55%] bg-black h-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
