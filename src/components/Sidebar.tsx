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
  Layers,
  ShieldCheck,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingTasksCount: number;
  openTicketsCount: number;
  activeRulesCount: number;
  businessName: string;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  ownerApprovedLaunch?: boolean;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  openTicketsCount,
  activeRulesCount,
  businessName,
  mobileOpen = false,
  onCloseMobile,
  ownerApprovedLaunch = true
}: SidebarProps) {
  const categoryGroups = [
    {
      title: '01. Command & Strategy',
      items: [
        { id: 'briefing', label: 'Command Center', icon: FileText },
        { id: 'onboarding', label: 'Founder Onboarding', icon: Layers, meta: 'START' },
        { id: 'research', label: 'CEO Market Research', icon: Compass, meta: 'CITED' },
        { id: 'chat', label: 'Specialist & Squad Chat', icon: MessageSquare, meta: '8 AGENTS' },
        { id: 'blueprint', label: 'Business Blueprint', icon: Map }
      ]
    },
    {
      title: '02. Growth & Assets',
      items: [
        { id: 'website', label: 'Website Builder', icon: Globe },
        { id: 'marketing', label: 'Marketing Hub', icon: Megaphone },
        { id: 'tuning', label: 'Feedback & Tuning', icon: Sliders, count: activeRulesCount }
      ]
    },
    {
      title: '03. Operations & Billing',
      items: [
        { id: 'tasks', label: 'Task Queue & Receipts', icon: CheckSquare, count: pendingTasksCount },
        { id: 'employees', label: 'AI Employees Roster', icon: Users },
        { id: 'payments', label: 'Stripe Setup', icon: CreditCard },
        { id: 'support', label: 'Support Success', icon: LifeBuoy, count: openTicketsCount },
        { id: 'revenue', label: 'Revenue Desk', icon: BarChart3 }
      ]
    },
    {
      title: '04. Governance & Specs',
      items: [
        {
          id: 'launch_gate',
          label: 'Launch Gate & Audit',
          icon: ShieldCheck,
          meta: ownerApprovedLaunch ? '12/12' : 'LOCKED'
        },
        { id: 'instructions', label: 'Architecture & CI Specs', icon: Settings }
      ]
    }
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col shrink-0 h-full select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black tracking-tight leading-none text-orange-500">
            FOUNDERPILOT OS
          </h1>
          <span className="text-[11px] text-zinc-500 font-medium block mt-1">
            Multi-Agent Business Command
          </span>
        </div>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation drawer"
            className="md:hidden w-11 h-11 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Business Banner */}
      <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-950/60">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block mb-0.5">
          Active Venture Workspace
        </span>
        <div className="text-xs font-semibold text-zinc-200 truncate">
          {businessName || 'FounderPilot Venture'}
        </div>
      </div>

      {/* Categorized Navigation Groups */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
        {categoryGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-2.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              {group.title}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`w-full min-h-[42px] md:min-h-[36px] flex items-center justify-between px-3 py-2 transition-colors duration-150 group text-left border cursor-pointer ${
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
                  {item.meta && (
                    <span
                      className={`text-[10px] font-mono shrink-0 ml-2 ${
                        item.meta === 'LOCKED' ? 'text-rose-400' : 'text-orange-400'
                      }`}
                    >
                      {item.meta}
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
          </div>
        ))}
      </nav>

      {/* Bottom Footer */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950">
        <div className="p-3 bg-zinc-900/50 border border-zinc-800 flex items-center space-x-3">
          <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-200 shrink-0">
            SF
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-200 truncate">Solo Founder</p>
            <p className="text-[11px] text-zinc-500 truncate">
              8 Specialists · {ownerApprovedLaunch ? 'Gate Verified' : 'Gate Locked'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Categorized Sidebar */}
      <div className="hidden md:flex h-full shrink-0">{navContent}</div>

      {/* Mobile Touch-Friendly Collapsible Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full max-w-xs w-64 shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
