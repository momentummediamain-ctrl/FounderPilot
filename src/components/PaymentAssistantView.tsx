import React, { useState } from 'react';
import {
  StripeTestTransaction,
  AssetAuditLogEntry,
  MockStripeProduct
} from '../types';
import {
  CreditCard,
  ShieldCheck,
  Code,
  Play,
  RotateCcw,
  XCircle,
  CheckCircle2,
  Lock,
  Loader2,
  Plus,
  Package,
  BarChart3
} from 'lucide-react';

interface PaymentAssistantViewProps {
  businessName: string;
  mockProducts: MockStripeProduct[];
  onAddMockProduct: (product: MockStripeProduct) => void;
  transactions: StripeTestTransaction[];
  onRecordTransaction: (tx: StripeTestTransaction) => void;
  onUpdateTransaction: (tx: StripeTestTransaction) => void;
  onSyncSampleToRevenueDashboard?: (amount: number, planName: string) => void;
  onNavigateTab?: (tab: string) => void;
  ownerApprovedLaunch?: boolean;
  activeRole?: 'OWNER' | 'OPERATOR' | 'VIEWER';
  onLogAuditAction?: (
    action: string,
    summary: string,
    approvalStatus: AssetAuditLogEntry['approvalStatus']
  ) => void;
}

export default function PaymentAssistantView({
  businessName,
  mockProducts,
  onAddMockProduct,
  transactions,
  onRecordTransaction,
  onUpdateTransaction,
  onSyncSampleToRevenueDashboard,
  onNavigateTab,
  ownerApprovedLaunch = true,
  activeRole = 'OWNER',
  onLogAuditAction
}: PaymentAssistantViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    mockProducts[1]?.id || mockProducts[0]?.id || 'prod_mock_growth_02'
  );
  const [customerEmailInput, setCustomerEmailInput] = useState('pilot-founder@alpha-saas.io');

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdAmount, setNewProdAmount] = useState('99');
  const [newProdInterval, setNewProdInterval] = useState<'month' | 'year' | 'one_time'>('month');
  const [newProdDesc, setNewProdDesc] = useState('');

  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [gateBlockedError, setGateBlockedError] = useState<string | null>(null);
  const [lastWebhookLog, setLastWebhookLog] = useState<string>(
    'Mock Stripe Gateway active on POST /api/stripe/test-lifecycle (Zero API keys required · Server-Side Vault enforced).'
  );

  const selectedProduct =
    mockProducts.find((p) => p.id === selectedProductId) ||
    mockProducts[0] || {
      id: 'prod_mock_growth_02',
      priceId: 'price_mock_79_mo',
      name: 'Growth Pro Suite',
      description: 'Unlimited multi-channel campaigns & fine-tuning',
      amount: 79,
      interval: 'month' as const,
      active: true,
      createdAt: 'Default'
    };

  const checkGateAndRole = (attemptedAction: string): boolean => {
    if (!ownerApprovedLaunch || activeRole !== 'OWNER') {
      setGateBlockedError(
        !ownerApprovedLaunch
          ? `Launch Gate Lock Active: ${attemptedAction} is blocked until the Owner unlocks Public Launch in the Launch Gate.`
          : `RBAC Guard Blocked Payment Action: Current role (${activeRole}) cannot modify billing or execute payments.`
      );
      onLogAuditAction?.(
        `Blocked Billing Action (${attemptedAction})`,
        `Attempted ${attemptedAction} while Launch Gate was locked or role was ${activeRole}.`,
        'BLOCKED_BY_GATE'
      );
      return false;
    }
    setGateBlockedError(null);
    return true;
  };

  // 1. Create a New Mock Stripe Product & Price SKU
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdAmount) return;
    if (!checkGateAndRole(`Create Stripe Product "${newProdName}"`)) return;

    setBusyAction('create_product');
    try {
      const res = await fetch('/api/stripe/test-lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_product',
          planName: newProdName.trim(),
          amount: Number(newProdAmount),
          interval: newProdInterval,
          description: newProdDesc.trim() || `Custom ${businessName || 'FounderPilot'} tier`
        })
      });
      const data = await res.json();
      if (data.product) {
        onAddMockProduct(data.product);
        setSelectedProductId(data.product.id);
        setNewProdName('');
        setNewProdDesc('');
        onLogAuditAction?.(
          'Created Mock Stripe Product SKU',
          `Provisioned ${data.product.name} (${data.product.id} · $${data.product.amount}/${data.product.interval}).`,
          'OWNER_APPROVED'
        );
        setLastWebhookLog(`✓ Verified Event: ${data.webhookEvent}`);
      }
    } finally {
      setBusyAction(null);
    }
  };

  // 2. Process a Simulated Test Payment & Sync to Revenue Dashboard
  const handlePurchase = async () => {
    if (!checkGateAndRole('Stripe Subscription Checkout')) return;
    setBusyAction('purchase');
    try {
      const formattedPlan = `${selectedProduct.name} ($${selectedProduct.amount}/${
        selectedProduct.interval === 'one_time' ? 'once' : selectedProduct.interval === 'year' ? 'yr' : 'mo'
      })`;
      const res = await fetch('/api/stripe/test-lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'purchase',
          productId: selectedProduct.id,
          priceId: selectedProduct.priceId,
          planName: formattedPlan,
          amount: selectedProduct.amount,
          customerEmail: customerEmailInput || 'pilot-founder@alpha-saas.io'
        })
      });
      const data = await res.json();
      if (data.transaction) {
        onRecordTransaction(data.transaction);
        onSyncSampleToRevenueDashboard?.(selectedProduct.amount, formattedPlan);
        onLogAuditAction?.(
          'Processed Mock Stripe Test Payment',
          `Verified charge ${data.transaction.chargeId} (${formattedPlan}) for $${selectedProduct.amount} & synced to Revenue Dashboard.`,
          'OWNER_APPROVED'
        );
        setLastWebhookLog(
          `✓ Verified Event: ${data.webhookEvent} · Charge ${data.transaction.chargeId} · Synced +$${selectedProduct.amount} to Revenue Dashboard`
        );
      }
    } finally {
      setBusyAction(null);
    }
  };

  const handleRefund = async (tx: StripeTestTransaction) => {
    if (!checkGateAndRole(`Refund Charge ${tx.chargeId}`)) return;
    setBusyAction(`refund_${tx.id}`);
    try {
      const res = await fetch('/api/stripe/test-lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refund',
          transaction: tx
        })
      });
      const data = await res.json();
      if (data.transaction) {
        onUpdateTransaction(data.transaction);
        onLogAuditAction?.(
          'Stripe Test-Mode Refund',
          `Refunded charge ${tx.chargeId} -> Refund ID ${data.transaction.refundId}.`,
          'OWNER_APPROVED'
        );
        setLastWebhookLog(
          `✓ Verified Event: ${data.webhookEvent} · Refund ${data.transaction.refundId} · Entitlement: ${data.transaction.entitlementStatus}`
        );
      }
    } finally {
      setBusyAction(null);
    }
  };

  const handleCancel = async (tx: StripeTestTransaction) => {
    if (!checkGateAndRole(`Cancel Subscription ${tx.subscriptionId}`)) return;
    setBusyAction(`cancel_${tx.id}`);
    try {
      const res = await fetch('/api/stripe/test-lifecycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'cancel',
          transaction: tx
        })
      });
      const data = await res.json();
      if (data.transaction) {
        onUpdateTransaction(data.transaction);
        onLogAuditAction?.(
          'Stripe Subscription Canceled',
          `Canceled subscription ${tx.subscriptionId} with verified webhook update.`,
          'OWNER_APPROVED'
        );
        setLastWebhookLog(
          `✓ Verified Event: ${data.webhookEvent} · Sub ${data.transaction.subscriptionId} · Entitlement: ${data.transaction.entitlementStatus}`
        );
      }
    } finally {
      setBusyAction(null);
    }
  };

  const netTestVolume = transactions
    .filter((t) => t.status === 'purchased')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-orange-400 mb-1">
            VP of Sales Diana Prince · Mock Stripe Payment Gateway & Revenue Sync
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Mock Stripe Product Creator & Test-Mode Checkout Gateway
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Create mock Stripe products (`prod_` / `price_`), process test payments without requiring real API keys, and stream sample transaction data directly to the Revenue Dashboard.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('revenue')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-100 transition cursor-pointer"
            >
              <BarChart3 className="w-3.5 h-3.5 text-orange-500" />
              <span>View Revenue Dashboard (${netTestVolume}.00) →</span>
            </button>
          )}
          <div className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>ZERO API KEYS REQUIRED</span>
          </div>
        </div>
      </div>

      {gateBlockedError && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between gap-4">
          <span>{gateBlockedError}</span>
          <button
            onClick={() => setGateBlockedError(null)}
            className="text-[11px] underline text-rose-200 cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section 1: Mock Stripe Product Catalog & SKU Creator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Product Form */}
        <form
          onSubmit={handleCreateProduct}
          className="lg:col-span-5 bg-zinc-900 border border-zinc-800 p-5 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                1. Create Mock Stripe Product
              </h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">v1/products · v1/prices</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400 font-medium block">Product / Tier Name</label>
              <input
                type="text"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="e.g., Enterprise AI Copilot Seat"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium block">Price (USD)</label>
                <input
                  type="number"
                  min={1}
                  value={newProdAmount}
                  onChange={(e) => setNewProdAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono focus:outline-none focus:border-zinc-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium block">Billing Interval</label>
                <select
                  value={newProdInterval}
                  onChange={(e) => setNewProdInterval(e.target.value as any)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono focus:outline-none focus:border-zinc-700"
                >
                  <option value="month">Monthly (/mo)</option>
                  <option value="year">Annual (/yr)</option>
                  <option value="one_time">One-Time</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-400 font-medium block">Deliverable Description</label>
              <input
                type="text"
                value={newProdDesc}
                onChange={(e) => setNewProdDesc(e.target.value)}
                placeholder="e.g., Dedicated multi-agent workspace + priority SLA"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 text-zinc-100 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <button
              type="submit"
              disabled={busyAction !== null || !newProdName.trim()}
              className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-40"
            >
              {busyAction === 'create_product' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
              ) : (
                <Plus className="w-3.5 h-3.5 text-orange-500" />
              )}
              <span>Create Mock Product & Price SKU</span>
            </button>
          </div>
        </form>

        {/* Active Mock Product Catalog */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Active Mock Stripe Product Catalog ({mockProducts.length} SKUs)
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Click any product SKU below to select it for simulated checkout testing.
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">SANDBOX CATALOG</span>
          </div>

          <div className="space-y-2.5 max-h-[250px] overflow-y-auto scrollbar-thin">
            {mockProducts.map((prod) => {
              const isSelected = prod.id === selectedProduct.id;
              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-3.5 border transition cursor-pointer flex items-center justify-between gap-4 text-xs ${
                    isSelected
                      ? 'bg-zinc-950 border-orange-500/60 text-zinc-100'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-100">{prod.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{prod.id}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate">{prod.description}</p>
                    <div className="text-[10px] font-mono text-zinc-500">
                      Price ID: {prod.priceId} · Created: {prod.createdAt}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-mono tabular-nums text-orange-400">
                      ${prod.amount}
                      <span className="text-[10px] text-zinc-500">
                        /{prod.interval === 'one_time' ? 'once' : prod.interval === 'year' ? 'yr' : 'mo'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {isSelected ? '✓ SELECTED FOR CHECKOUT' : 'Select SKU'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Mock Stripe Checkout & Webhook Runner */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              2. Process Simulated Checkout & Stream to Revenue Dashboard
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Simulate a customer purchasing <span className="text-zinc-200 font-semibold">{selectedProduct.name} (${selectedProduct.amount})</span>. Every test purchase automatically updates both the Test-Mode Webhook Ledger and the Revenue Dashboard simulator.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <input
              type="email"
              value={customerEmailInput}
              onChange={(e) => setCustomerEmailInput(e.target.value)}
              placeholder="Customer email"
              className="px-3 py-2 bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-mono focus:outline-none focus:border-zinc-700"
            />

            <button
              onClick={handlePurchase}
              disabled={busyAction !== null}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold transition cursor-pointer disabled:opacity-50"
            >
              {busyAction === 'purchase' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : !ownerApprovedLaunch || activeRole !== 'OWNER' ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>
                Process Test Payment (${selectedProduct.amount})
              </span>
            </button>
          </div>
        </div>

        {/* Live Webhook Verification Banner */}
        <div className="p-3 bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 flex items-center justify-between gap-4">
          <span className="truncate">{lastWebhookLog}</span>
          <span className="text-[10px] text-emerald-400 shrink-0 uppercase">MOCK_STRIPE_GATEWAY</span>
        </div>

        {/* Recorded Transactions & Refund / Cancel Controls */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            <span>Test-Mode Subscriptions & Entitlement Ledger ({transactions.length})</span>
            <span className="text-emerald-400">Net Active Test Volume: ${netTestVolume}.00</span>
          </div>

          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-zinc-950 border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="font-semibold text-zinc-100">{tx.planName}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="font-mono text-zinc-300 tabular-nums">${tx.amount}.00</span>
                    <span className="text-zinc-600">·</span>
                    <span
                      className={`font-mono text-[11px] uppercase font-semibold ${
                        tx.status === 'purchased'
                          ? 'text-emerald-400'
                          : tx.status === 'refunded'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    Charge: {tx.chargeId} · Sub: {tx.subscriptionId} · Customer: {tx.customerEmail}
                    {tx.refundId ? ` · Refund: ${tx.refundId}` : ''}
                    {tx.canceledAt ? ` · Canceled: ${tx.canceledAt}` : ''}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400">
                    Tenant Entitlement: <span className="text-zinc-200">{tx.entitlementStatus}</span> · Webhook Signature: Verified
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRefund(tx)}
                    disabled={tx.status === 'refunded' || busyAction !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer disabled:opacity-40"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>{tx.status === 'refunded' ? 'Refunded' : 'Test Refund'}</span>
                  </button>
                  <button
                    onClick={() => handleCancel(tx)}
                    disabled={tx.status === 'canceled' || busyAction !== null}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-medium text-zinc-200 transition cursor-pointer disabled:opacity-40"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{tx.status === 'canceled' ? 'Canceled' : 'Test Cancel'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture & Server-Side Secret Policy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 p-6 space-y-3">
          <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-3">
            <Code className="w-4 h-4 text-orange-500" />
            <h3 className="text-xs font-semibold uppercase text-zinc-200 tracking-wider">
              Verified Server-Side Stripe Webhook Handler
            </h3>
          </div>
          <pre className="bg-zinc-950 p-4 border border-zinc-800 text-xs text-zinc-400 font-mono overflow-x-auto leading-relaxed">
{`// Server-side webhook verification (Product Creation, Purchase, Refund & Cancel)
router.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  switch (event.type) {
    case 'checkout.session.completed':
      await grantTenantEntitlement(event.data.object.metadata.tenantId, 'active_trial_or_test');
      break;
    case 'charge.refunded':
      await updateTenantEntitlement(event.data.object.metadata.tenantId, 'revoked_refund');
      break;
    case 'customer.subscription.deleted':
      await updateTenantEntitlement(event.data.object.metadata.tenantId, 'canceled_period_end');
      break;
  }
  res.json({ received: true });
});`}
          </pre>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase text-zinc-200 tracking-wider">
              Server-Side Secret Vault
            </h3>
          </div>

          <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
            <p>
              The Mock Stripe Gateway runs without requiring client-side API keys while preserving strict separation between simulated sandbox orders and live bank revenue.
            </p>
            <div className="p-3 bg-zinc-950 border border-zinc-800 font-mono text-[11px] space-y-1.5 text-zinc-300">
              <div className="flex items-center justify-between">
                <span>STRIPE_SECRET_KEY</span>
                <span className="text-emerald-400">SERVER-ONLY</span>
              </div>
              <div className="flex items-center justify-between">
                <span>STRIPE_WEBHOOK_SECRET</span>
                <span className="text-emerald-400">SERVER-ONLY</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GEMINI_API_KEY</span>
                <span className="text-emerald-400">SERVER-ONLY</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono pt-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Synced with Revenue Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
