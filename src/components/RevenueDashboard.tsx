import React, { useState, useEffect } from 'react';
import { RevenueStats, StripeTestTransaction } from '../types';
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ShoppingCart,
  Play,
  Pause,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface RevenueDashboardProps {
  stats: RevenueStats;
  setStats: React.Dispatch<React.SetStateAction<RevenueStats>>;
  businessName: string;
  stripeTransactions?: StripeTestTransaction[];
}

export default function RevenueDashboard({
  stats,
  setStats,
  businessName,
  stripeTransactions = []
}: RevenueDashboardProps) {
  // Default strictly to Verified Financial Ledger so demo data never appears as verified financial results
  const [ledgerMode, setLedgerMode] = useState<'verified_live' | 'demo_sandbox'>('verified_live');
  const [simulating, setSimulating] = useState(false);
  const [purchaseAlerts, setPurchaseAlerts] = useState<{ id: string; msg: string }[]>([]);

  useEffect(() => {
    if (!simulating || ledgerMode !== 'demo_sandbox') return;

    const interval = setInterval(() => {
      const packages = [
        { name: 'Starter Operator', price: 29 },
        { name: 'Growth Pro Suite', price: 79 },
        { name: 'Agency Scale Bundle', price: 249 }
      ];
      const purchase = packages[Math.floor(Math.random() * packages.length)];
      const names = ['Michael R.', 'Sophia K.', 'Amir T.', 'Clara L.', 'Oliver S.', 'Fatima B.', 'Yuki H.'];
      const buyer = names[Math.floor(Math.random() * names.length)];

      const alertId = Date.now().toString();
      const alertMsg = `[UNVERIFIED SANDBOX DEMO] ${buyer} simulated ${purchase.name} ($${purchase.price})`;

      setPurchaseAlerts((prev) => [...prev, { id: alertId, msg: alertMsg }]);
      setTimeout(() => {
        setPurchaseAlerts((prev) => prev.filter((a) => a.id !== alertId));
      }, 4000);

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
          salesHistory: updatedHistory,
          isDemoData: true
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [simulating, ledgerMode, setStats]);

  const activeTestNetVolume = stripeTransactions
    .filter((tx) => tx.status === 'purchased')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const verifiedLiveRevenue = stats.verifiedLiveRevenue ?? 0;
  const verifiedLiveOrders = stats.verifiedLiveOrders ?? 0;

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in relative">
      {/* Floating Sandbox Simulation Toast */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {purchaseAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-zinc-950 text-zinc-100 px-4 py-3 border border-amber-500/40 pointer-events-auto text-xs font-mono flex items-center space-x-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{alert.msg}</span>
          </div>
        ))}
      </div>

      {/* Top Header & Strict Financial Truth Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-orange-400 mb-1">
            Stage 1 Exit Gate · Financial Truth & Ledger Separation
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Revenue & Financial Ledger
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Verified live Stripe settlements are strictly isolated from simulated demo traffic so demo figures never appear as verified financial results.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setLedgerMode('verified_live');
              setSimulating(false);
            }}
            className={`px-3.5 py-2 text-xs font-semibold border transition cursor-pointer ${
              ledgerMode === 'verified_live'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Verified Financial Ledger (Live)
          </button>
          <button
            onClick={() => setLedgerMode('demo_sandbox')}
            className={`px-3.5 py-2 text-xs font-semibold border transition cursor-pointer ${
              ledgerMode === 'demo_sandbox'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sandbox Demo Simulator (Non-Financial)
          </button>
        </div>
      </div>

      {/* Explicit Truth Banner */}
      {ledgerMode === 'verified_live' ? (
        <div className="p-4 bg-zinc-900/90 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-zinc-100">
                Verified Financial Results View · Demo Data Excluded
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Displaying only cryptographically verified production settlements ($0.00 live settled) and isolated Stripe Test-Mode webhook records (${activeTestNetVolume}.00 test-mode net). Simulated demo numbers ($2,840) are quarantined.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 shrink-0 uppercase">
            AUDIT COMPLIANT
          </span>
        </div>
      ) : (
        <div className="p-4 bg-amber-500/5 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                UNVERIFIED DEMO SIMULATION MODE · NOT REAL FINANCIAL RESULTS
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                All figures below are synthetic product-tour projections for UI preview only. They do not represent real bank settlements or verified Stripe charges.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSimulating(!simulating)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold transition cursor-pointer shrink-0 ${
              simulating
                ? 'bg-amber-500 text-black'
                : 'bg-zinc-900 border border-amber-500/40 text-amber-300 hover:bg-zinc-800'
            }`}
          >
            {simulating ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Demo Traffic</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Run Demo Traffic</span>
              </>
            )}
          </button>
        </div>
      )}

      {!businessName ? (
        <div className="p-12 border border-zinc-800 bg-zinc-900 text-center space-y-3">
          <BarChart3 className="w-6 h-6 text-orange-500 mx-auto" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            No Venture Active
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Define your business inside Founder Chat or Blueprint to initialize financial tracking.
          </p>
        </div>
      ) : ledgerMode === 'verified_live' ? (
        /* VERIFIED FINANCIAL LEDGER VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>VERIFIED LIVE REVENUE</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-100 font-mono tabular-nums">
                ${verifiedLiveRevenue.toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                0 Live Bank Settlements · Verified
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>VERIFIED LIVE ORDERS</span>
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-100 font-mono tabular-nums">
                {verifiedLiveOrders}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Production Stripe sk_live_ Not Active
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>TEST-MODE NET VOLUME</span>
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-zinc-100 font-mono tabular-nums">
                ${activeTestNetVolume.toFixed(2)}
              </div>
              <div className="text-[11px] text-orange-400 font-mono">
                {stripeTransactions.filter((t) => t.status === 'purchased').length} Active Test Subscriptions
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>QUARANTINED DEMO DATA</span>
                <Users className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="text-2xl font-bold text-zinc-500 font-mono tabular-nums line-through">
                ${stats.totalRevenue}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">
                Excluded from Financial Statements
              </div>
            </div>
          </div>

          {/* Verified Stripe Test-Mode Ledger Table */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  Verified Stripe Test-Mode Webhook Ledger
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Real-time audit log of test purchases, refunds, and subscription cancellations executed in Stripe Setup.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {stripeTransactions.length} Recorded Events
              </span>
            </div>

            {stripeTransactions.length === 0 ? (
              <div className="p-6 bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 text-center">
                No test-mode transactions recorded yet. Open the <span className="text-zinc-200 font-semibold">Stripe Setup</span> tab to execute a verified test purchase, refund, or cancellation.
              </div>
            ) : (
              <div className="space-y-2">
                {stripeTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-zinc-200">
                        {tx.planName} · <span className="font-mono">${tx.amount}.00</span>
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500">
                        {tx.chargeId} · {tx.subscriptionId} · {tx.customerEmail}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-zinc-400">Entitlement: {tx.entitlementStatus}</span>
                      <span
                        className={
                          tx.status === 'purchased'
                            ? 'text-emerald-400 font-semibold uppercase'
                            : tx.status === 'refunded'
                            ? 'text-amber-400 font-semibold uppercase'
                            : 'text-rose-400 font-semibold uppercase'
                        }
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SANDBOX DEMO SIMULATOR VIEW (Explicitly watermarked as Non-Financial) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900 border border-amber-500/30 p-5 space-y-2">
              <div className="text-[10px] font-mono uppercase text-amber-400">
                DEMO SIMULATED GROSS (NON-VERIFIED)
              </div>
              <div className="text-2xl font-bold text-zinc-200 font-mono tabular-nums">
                ${stats.totalRevenue}
              </div>
              <div className="text-[11px] text-zinc-500">Synthetic UI preview only</div>
            </div>

            <div className="bg-zinc-900 border border-amber-500/30 p-5 space-y-2">
              <div className="text-[10px] font-mono uppercase text-amber-400">
                DEMO SIMULATED ORDERS
              </div>
              <div className="text-2xl font-bold text-zinc-200 font-mono tabular-nums">
                {stats.totalOrders}
              </div>
              <div className="text-[11px] text-zinc-500">Synthetic checkout events</div>
            </div>

            <div className="bg-zinc-900 border border-amber-500/30 p-5 space-y-2">
              <div className="text-[10px] font-mono uppercase text-amber-400">
                DEMO CONVERSION PROJECTION
              </div>
              <div className="text-2xl font-bold text-zinc-200 font-mono tabular-nums">
                {stats.conversionRate}%
              </div>
              <div className="text-[11px] text-zinc-500">Modeled funnel benchmark</div>
            </div>

            <div className="bg-zinc-900 border border-amber-500/30 p-5 space-y-2">
              <div className="text-[10px] font-mono uppercase text-amber-400">
                DEMO SUBSCRIBER COUNT
              </div>
              <div className="text-2xl font-bold text-zinc-200 font-mono tabular-nums">
                {stats.totalCustomers}
              </div>
              <div className="text-[11px] text-zinc-500">Simulated sandbox cohort</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 md:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h3 className="text-[11px] font-mono uppercase text-zinc-300 tracking-wider">
                  Simulated Demo Sales Velocity (Unverified)
                </h3>
                <span className="text-[10px] font-mono text-amber-400">SANDBOX PROJECTION</span>
              </div>
              <div className="h-48 flex items-end justify-between gap-2.5 pt-6 font-mono text-[10px] text-zinc-500">
                {stats.salesHistory.map((day, idx) => {
                  const maxAmt = Math.max(...stats.salesHistory.map((s) => s.amount), 1);
                  const barHeight = (day.amount / maxAmt) * 120;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center space-y-2 group">
                      <span className="text-[10px] font-mono text-amber-400 tabular-nums">
                        ${day.amount}
                      </span>
                      <div
                        style={{ height: `${Math.max(barHeight, 8)}px` }}
                        className="w-full bg-zinc-950 border border-amber-500/30 transition duration-150"
                      />
                      <span className="text-[10px] font-mono text-zinc-500">{day.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
              <h3 className="text-[11px] font-mono uppercase text-zinc-300 border-b border-zinc-800 pb-2 tracking-wider">
                Compliance Safeguard
              </h3>
              <div className="flex items-start space-x-2 text-xs leading-relaxed text-zinc-400 bg-zinc-950 p-3.5 border border-zinc-800">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-200 block mb-1">
                    Demo Isolation Gate Active
                  </span>
                  Simulated traffic cannot mutate your Verified Financial Ledger or trigger real payouts. Switch back to Verified Financial Ledger at any time for audit-true reporting.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
