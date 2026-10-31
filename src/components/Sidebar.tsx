import React from 'react';
import {
  FileText,
  MessageSquare,
  Map,
  Users,
  CheckSquare,
  Globe,
  CreditCard,
  Megaphone,
  LifeBuoy,
  BarChart3,
  Settings,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingTasksCount: number;
  openTicketsCount: number;
  businessName: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  openTicketsCount,
  businessName
}: SidebarProps) {
  const menuItems = [
    { id: 'briefing', label: 'Daily Briefing', icon: FileText },
    { id: 'chat', label: 'Founder Chat', icon: MessageSquare, badge: 'AI' },
    { id: 'blueprint', label: 'Business Blueprint', icon: Map },
    { id: 'employees', label: 'AI Employees', icon: Users },
    {
      id: 'tasks',
      label: 'Task Queue',
      icon: CheckSquare,
      count: pendingTasksCount,
      countColor: 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
    },
    { id: 'website', label: 'Website Builder', icon: Globe },
    { id: 'payments', label: 'Stripe Setup', icon: CreditCard },
    { id: 'marketing', label: 'Marketing Hub', icon: Megaphone },
    {
      id: 'support',
      label: 'Support Success',
      icon: LifeBuoy,
      count: openTicketsCount,
      countColor: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
    },
    { id: 'revenue', label: 'Revenue Desk', icon: BarChart3 },
    { id: 'instructions', label: 'Setup Instructions', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 h-full">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none text-orange-500 mb-1">
              FOUNDERPILOT
            </h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold block">
              Business OS v1.0.4
            </span>
          </div>
        </div>
      </div>

      {/* Active Business Banner */}
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 block mb-1">
          Active Venture
        </span>
        <div className="text-xs font-semibold text-zinc-300 truncate">
          {businessName || 'Deploying System...'}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-all duration-150 group text-left border-l-2 ${
                isActive
                  ? 'bg-zinc-900 text-zinc-100 border-orange-500 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-400'
                  }`}
                />
                <span className="truncate text-xs font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-wider bg-orange-500 text-black">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase ${
                  isActive ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950 space-y-3">
        <div className="bg-zinc-900 p-4 rounded-sm border border-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">System Status</span>
          </div>
          <p className="text-xs text-zinc-300 font-mono">All Agents Online</p>
          <p className="text-[10px] text-zinc-500 mt-1">Supabase Connection Stable</p>
        </div>
        <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-sm flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0">
            SF
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-300 truncate">Solo Founder</p>
            <p className="text-[10px] text-zinc-500 truncate">Workspace Host</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
