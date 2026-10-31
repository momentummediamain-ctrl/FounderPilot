import React, { useState, useEffect } from 'react';
import { RevenueStats } from '../types';
import { BarChart3, Users, DollarSign, TrendingUp, AlertCircle, ShoppingCart, Play, Pause, Loader2 } from 'lucide-react';

interface RevenueDashboardProps {
  stats: RevenueStats;
  setStats: React.Dispatch<React.SetStateAction<RevenueStats>>;
  businessName: string;
}

export default function RevenueDashboard({ stats, setStats, businessName }: RevenueDashboardProps) {
  const [simulating, setSimulating] = useState(false);
  const [purchaseAlerts, setPurchaseAlerts] = useState<{ id: string; msg: string }[]>([]);

  useEffect(() => {
    if (!simulating) return;

    const interval = setInterval(() => {
      // Choose random product purchase
      const packages = [
        { name: 'Starter Pack', price: 29 },
        { name: 'Pro Growth Suite', price: 79 },
        { name: 'Enterprise Bundle', price: 249 }
      ];
      const purchase = packages[Math.floor(Math.random() * packages.length)];
      const names = ['Michael R.', 'Sophia K.', 'Amir T.', 'Clara L.', 'Oliver S.', 'Fatima B.', 'Yuki H.'];
      const buyer = names[Math.floor(Math.random() * names.length)];

      const alertId = Date.now().toString();
      const alertMsg = `🎉 ${buyer} purchased ${purchase.name} ($${purchase.price})!`;

      // Trigger Alert Toast
      setPurchaseAlerts((prev) => [...prev, { id: alertId, msg: alertMsg }]);
      setTimeout(() => {
        setPurchaseAlerts((prev) => prev.filter((a) => a.id !== alertId));
      }, 4000);

      // Increment stats
      setStats((prev) => {
        const updatedHistory = [...prev.salesHistory];
        if (updatedHistory.length > 0) {
          const lastIndex = updatedHistory.length - 1;
          updatedHistory[lastIndex] = {
            ...updatedHistory[lastIndex],
            amount: updatedHistory[lastIndex].amount + purchase.price,
            orderCount: updatedHistory[lastIndex].orderCount + 1
          };
        }
        return {
          ...prev,
          totalRevenue: prev.totalRevenue + purchase.price,
          totalOrders: prev.totalOrders + 1,
          totalCustomers: prev.totalCustomers + 1,
          salesHistory: updatedHistory
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [simulating, setStats]);

  const statsCards = [
    { label: 'Total Earnings', val: `$${stats.totalRevenue}`, desc: 'Simulated checkouts', icon: DollarSign, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
    { label: 'Order Volume', val: stats.totalOrders.toString(), desc: 'Completed checkouts', icon: ShoppingCart, color: 'text-zinc-300 bg-zinc-950 border-zinc-800' },
    { label: 'Conversion rate', val: `${stats.conversionRate}%`, desc: 'Opt-in conversion percentage', icon: TrendingUp, color: 'text-zinc-300 bg-zinc-950 border-zinc-800' },
    { label: 'Subscribers', val: stats.totalCustomers.toString(), desc: 'Durable customer records', icon: Users, color: 'text-zinc-300 bg-zinc-950 border-zinc-800' }
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in relative">
      {/* Floating purchase notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {purchaseAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-zinc-950/95 text-zinc-100 px-4 py-3 rounded-none border border-orange-500 shadow-xl pointer-events-auto text-xs font-semibold flex items-center space-x-2.5 animate-slide-up"
          >
            <DollarSign className="w-4 h-4 text-orange-500 animate-bounce" />
            <span>{alert.msg}</span>
          </div>
        ))}
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">Revenue Dashboard</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Track sandbox transactional metrics, manage orders, and trigger mock traffic to simulate launch checkouts.
          </p>
        </div>

        {businessName && (
          <button
            onClick={() => setSimulating(!simulating)}
            className={`flex items-center space-x-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none transition-all shadow-sm cursor-pointer ${
              simulating
                ? 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-700'
                : 'bg-orange-500 hover:bg-orange-400 text-black'
            }`}
          >
            {simulating ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Live Traffic</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Live Traffic</span>
              </>
            )}
          </button>
        )}
      </div>

      {!businessName ? (
        <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 rounded-none text-center space-y-4">
          <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">No Venture Active</h3>
            <p className="text-xs text-zinc-500">
              Define your business name first inside the **Founder Chat** or **Blueprint** tab to activate the transactional dashboard.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-none p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">{card.label}</span>
                    <div className={`p-1 rounded-none border ${card.color}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-zinc-100 font-mono tracking-tight">{card.val}</div>
                    <span className="text-[10px] text-zinc-500 mt-1 block">{card.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Visual SVGs Chart */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 md:col-span-2 space-y-4">
              <h3 className="text-[10px] font-black uppercase text-zinc-300 border-b border-zinc-800 pb-2 tracking-widest">Sales Velocity History</h3>
              {/* Minimalist SVG bar graph representation */}
              <div className="h-48 flex items-end justify-between gap-2.5 pt-6 font-mono text-[9px] text-zinc-600">
                {stats.salesHistory.map((day, idx) => {
                  const maxAmt = Math.max(...stats.salesHistory.map((s) => s.amount), 1);
                  const barHeight = (day.amount / maxAmt) * 120; // scale max height to 120px
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center space-y-2 group">
                      <span className="text-[9px] font-bold text-orange-500 opacity-0 group-hover:opacity-100 transition duration-150">
                        ${day.amount}
                      </span>
                      <div
                        style={{ height: `${Math.max(barHeight, 8)}px` }}
                        className="w-full bg-zinc-950 group-hover:bg-zinc-900 border border-zinc-800 rounded-none transition duration-150 flex items-end justify-center shadow-none"
                      />
                      <span className="text-[9px] font-bold text-zinc-500">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sandbox Notice / Simulation Ticker log */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
              <h3 className="text-[10px] font-black uppercase text-zinc-300 border-b border-zinc-800 pb-2 tracking-widest">Operations Monitor</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-2 text-xs leading-relaxed text-zinc-400 bg-zinc-950 p-3 border border-zinc-850 rounded-none">
                  <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[9px] text-zinc-300 block mb-0.5">Sandbox Integration Active</span>
                    Transactions are fully simulated for testing and validation. No real billing setups will charge bank records.
                  </div>
                </div>

                {simulating && (
                  <div className="p-3 bg-zinc-950 rounded-none border border-zinc-850 font-mono text-[10px] text-zinc-500 flex items-center space-x-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                    <span>Listening to simulated web checkout webhooks...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
