import React, { useState } from 'react';
import { CreditCard, Terminal, Sparkles, AlertTriangle, Key, ShieldCheck, Check, Code } from 'lucide-react';

interface PaymentAssistantViewProps {
  businessName: string;
}

export default function PaymentAssistantView({ businessName }: PaymentAssistantViewProps) {
  const [stripeLive, setStripeLive] = useState(false);
  const [publishableKey, setPublishableKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [connected, setConnected] = useState(false);

  const handleConnectKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishableKey.trim() || !secretKey.trim()) return;
    setConnected(true);
    setStripeLive(true);
  };

  const handleDisconnect = () => {
    setPublishableKey('');
    setSecretKey('');
    setConnected(false);
    setStripeLive(false);
  };

  const setupSteps = [
    {
      id: 1,
      title: 'Register Stripe Developer Profile',
      desc: 'Register a free merchant/developer account at stripe.com to gain immediate sandbox clearance.'
    },
    {
      id: 2,
      title: 'Configure Pricing Products',
      desc: `Create 'Starter Pack' ($29/mo) and 'Pro growth Suite' ($79/mo) inside your Stripe Dashboard 'Products' tab.`
    },
    {
      id: 3,
      title: 'Define Checkout Webhook Endpoints',
      desc: 'Connect Stripe webhook events like "checkout.session.completed" back to your server-side database router.'
    },
    {
      id: 4,
      title: 'Synchronize Keys with Environment Variables',
      desc: 'Input Publishable and Secret keys inside your central `.env` settings to enable persistent operations.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Header */}
      <div className="pb-2">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">Payment Integration Assistant</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Prepare Stripe transaction setups, configure sandbox checkout loops, and manage keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step-by-Step Instructions */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-3">
              <CreditCard className="w-4 h-4 text-orange-500" />
              <h3 className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">Stripe Integration Checklist</h3>
            </div>

            <div className="space-y-4">
              {setupSteps.map((step) => (
                <div key={step.id} className="flex items-start space-x-4 p-3 bg-zinc-950 border border-zinc-850 rounded-none">
                  <div className="w-6 h-6 rounded-none bg-zinc-900 border border-zinc-800 text-orange-500 font-bold text-xs flex items-center justify-center shrink-0">
                    {step.id}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold text-zinc-200">{step.title}</h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhook API reference code */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-3">
              <Code className="w-4 h-4 text-orange-500" />
              <h3 className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">Express Stripe Webhook Implementation</h3>
            </div>

            <div className="bg-black p-4 border border-zinc-800 rounded-none text-xs text-zinc-400 font-mono overflow-x-auto whitespace-pre leading-relaxed scrollbar-thin max-h-[220px]">
{`// server/stripe-webhook.ts
import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const amount = session.amount_total;

    console.log(\`✓ Payment of \${amount} successfully received from \${customerEmail}\`);
    // Database trigger: Update user subscription tier in PostgreSQL schema
  }

  res.json({ received: true });
});`}
            </div>
          </div>
        </div>

        {/* Right Sandbox/Live Keys Sync Panel */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
            <div className="flex items-center space-x-2.5 border-b border-zinc-800 pb-3">
              <Key className="w-4 h-4 text-orange-500" />
              <h3 className="text-[10px] font-black uppercase text-zinc-300 tracking-widest">Stripe Sandbox Keys</h3>
            </div>

            {connected ? (
              <div className="space-y-4 animate-fade-in text-xs">
                <div className="p-3 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-none flex items-center space-x-2 font-medium">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-orange-500" />
                  <span>Stripe Sandbox Connected (Live Mode)</span>
                </div>

                <div className="space-y-1 bg-zinc-950 p-3 rounded-none border border-zinc-800 font-mono text-[10px] text-zinc-400">
                  <div>
                    <span className="text-zinc-600">PK:</span>
                    <p className="truncate mt-0.5 text-zinc-300">{publishableKey.slice(0, 16)}...</p>
                  </div>
                  <div className="mt-2">
                    <span className="text-zinc-600">SK:</span>
                    <p className="truncate mt-0.5 text-zinc-300">••••••••••••••••</p>
                  </div>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full py-1.5 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 text-xs font-bold uppercase tracking-wider rounded-none transition cursor-pointer"
                >
                  Disconnect Keys
                </button>
              </div>
            ) : (
              <form onSubmit={handleConnectKeys} className="space-y-4 text-xs">
                <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-none text-zinc-400 text-[11px] leading-relaxed flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Entering mock keys will trigger complete simulated production checkouts inside the Revenue Dashboard!</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Publishable Key</label>
                  <input
                    type="text"
                    value={publishableKey}
                    onChange={(e) => setPublishableKey(e.target.value)}
                    placeholder="pk_test_..."
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Secret Key</label>
                  <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="sk_test_..."
                    required
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-none text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-black uppercase tracking-wider rounded-none transition cursor-pointer"
                >
                  Connect Keys
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
