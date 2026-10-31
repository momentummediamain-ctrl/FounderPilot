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
  Compass,
  Sliders,
  Layers
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingTasksCount: number;
  openTicketsCount: number;
  activeRulesCount: number;
  businessName: string;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  openTicketsCount,
  activeRulesCount,
  businessName
}: SidebarProps) {
  const menuItems = [
    { id: 'onboarding', label: 'Founder Onboarding', icon: Layers, badge: 'START' },
    { id: 'research', label: 'CEO Market Research', icon: Compass, badge: 'CEO' },
    {
      id: 'tuning',
      label: 'Feedback & Tuning',
      icon: Sliders,
      count: activeRulesCount
    },
    { id: 'briefing', label: 'Daily Briefing', icon: FileText },
    { id: 'chat', label: 'Founder Chat', icon: MessageSquare },
    { id: 'blueprint', label: 'Business Blueprint', icon: Map },
    { id: 'employees', label: 'AI Employees', icon: Users },
    {
      id: 'tasks',
      label: 'Task Queue',
      icon: CheckSquare,
      count: pendingTasksCount
    },
    { id: 'website', label: 'Website Builder', icon: Globe },
    { id: 'payments', label: 'Stripe Setup', icon: CreditCard },
    { id: 'marketing', label: 'Marketing Hub', icon: Megaphone },
    {
      id: 'support',
      label: 'Support Success',
      icon: LifeBuoy,
      count: openTicketsCount
    },
    { id: 'revenue', label: 'Revenue Desk', icon: BarChart3 },
    { id: 'instructions', label: 'Setup Instructions', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 h-full">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight leading-none text-orange-500">
            FOUNDERPILOT OS
          </h1>
          <span className="text-[11px] text-zinc-500 font-medium block mt-1">
            Solo Founder AI Command
          </span>
        </div>
      </div>

      {/* Active Business Banner */}
      <div className="px-5 py-3.5 border-b border-zinc-800 bg-zinc-950/50">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block mb-0.5">
          Active Venture
        </span>
        <div className="text-xs font-semibold text-zinc-200 truncate">
          {businessName || 'FounderPilot Venture'}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 transition-colors duration-150 group text-left border cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-zinc-100 border-zinc-700 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-orange-500' : 'text-zinc-500 group-hover:text-zinc-400'
                  }`}
                />
                <span className="truncate text-xs whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono text-orange-400 shrink-0 ml-2">
                  {item.badge}
                </span>
              )}
              {item.count !== undefined && item.count > 0 && (
                <span className="text-[11px] font-mono tabular-nums text-zinc-400 shrink-0 ml-2">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950">
        <div className="p-3 bg-zinc-900/50 border border-zinc-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-200 shrink-0">
            SF
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-200 truncate">Solo Founder</p>
            <p className="text-[11px] text-zinc-500 truncate">8 AI Employees Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
