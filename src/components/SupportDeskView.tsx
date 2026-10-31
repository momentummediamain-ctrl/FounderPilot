import React, { useState } from 'react';
import { Ticket } from '../types';
import { LifeBuoy, Sparkles, MessageSquare, Send, CheckCircle, Mail, Loader2 } from 'lucide-react';

interface SupportDeskViewProps {
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  onGenerateReply: (ticketId: string, message: string, customerName: string) => Promise<string>;
  businessName: string;
}

export default function SupportDeskView({
  tickets,
  setTickets,
  onGenerateReply,
  businessName
}: SupportDeskViewProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [draftReply, setDraftReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const activeTicket = tickets.find((t) => t.id === selectedTicketId);

  const handleDraftAI = async () => {
    if (!activeTicket || loading) return;
    setLoading(true);
    try {
      const draft = await onGenerateReply(activeTicket.id, activeTicket.message, activeTicket.customerName);
      setDraftReply(draft);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = () => {
    if (!selectedTicketId || !draftReply.trim()) return;

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicketId ? { ...t, status: 'resolved', draftReply } : t
      )
    );

    const email = activeTicket?.customerEmail;
    setToastMsg(`Reply sent successfully to ${email || 'customer'}. Ticket marked resolved.`);
    setTimeout(() => {
      setToastMsg('');
    }, 4000);

    setDraftReply('');

    // Select another unresolved ticket if possible
    const nextTicket = tickets.find((t) => t.id !== selectedTicketId && t.status === 'open');
    setSelectedTicketId(nextTicket?.id || null);
  };

  const openTickets = tickets.filter((t) => t.status === 'open');
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved');

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Header */}
      <div className="pb-2">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">Customer Support Desk</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Review incoming client support tickets, draft professional empathetic replies using Kenji Sato, and track resolved queries.
        </p>
      </div>

      {!businessName ? (
        <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 rounded-none text-center space-y-4">
          <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">No Venture Active</h3>
            <p className="text-xs text-zinc-500">
              Define your business name first inside the **Founder Chat** or **Blueprint** tab to enable support ticket simulations.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Unresolved Ticket List Sidebar */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
              Active Inbox ({openTickets.length})
            </span>

            <div className="space-y-2">
              {openTickets.length === 0 ? (
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-none text-center text-xs text-zinc-500">
                  ✓ Excellent! No open customer support tickets.
                </div>
              ) : (
                openTickets.map((t) => {
                  const isSelected = t.id === selectedTicketId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTicketId(t.id);
                        setDraftReply(t.draftReply || '');
                      }}
                      className={`w-full p-4 border text-left transition duration-150 flex flex-col space-y-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-zinc-900 border-zinc-700 text-zinc-100'
                          : 'bg-zinc-950 hover:bg-zinc-900/40 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-[10px] font-bold font-mono text-zinc-500">TKT: {t.id}</span>
                        <span className="text-[9px] font-medium text-zinc-500">{t.createdAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-zinc-300">{t.customerName}</h4>
                      <p className="text-[11px] text-zinc-500 truncate w-full leading-relaxed">{t.message}</p>
                    </button>
                  );
                })
              )}
            </div>

            {/* Resolved Tickets Board */}
            {resolvedTickets.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest block">
                  Resolved History ({resolvedTickets.length})
                </span>
                <div className="space-y-2">
                  {resolvedTickets.map((t) => (
                    <div key={t.id} className="p-3 bg-zinc-950 border border-zinc-850 rounded-none text-xs flex justify-between items-center">
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-zinc-400 truncate text-[11px]">{t.customerName}</div>
                        <p className="text-[10px] text-zinc-600 truncate font-mono">{t.customerEmail}</p>
                      </div>
                      <div className="flex items-center space-x-1 font-bold text-[9px] uppercase font-mono text-orange-500 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
                        <span>Closed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Core Support Workspace Panel */}
          <div className="md:col-span-2 space-y-4">
            {toastMsg && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold uppercase tracking-wider rounded-none flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-orange-500" />
                <span>{toastMsg}</span>
              </div>
            )}
            {activeTicket ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-6">
                {/* Ticket Details */}
                <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className="p-2 bg-zinc-950 border border-zinc-850 rounded-none text-orange-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-200">{activeTicket.customerName}</h3>
                      <p className="text-[10px] text-zinc-500 font-mono">{activeTicket.customerEmail}</p>
                    </div>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    Received: {activeTicket.createdAt}
                  </div>
                </div>

                {/* Customer Message Body */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Inquiry message</span>
                  <div className="p-4 bg-zinc-950 border border-zinc-800 text-zinc-300 leading-relaxed italic">
                    "{activeTicket.message}"
                  </div>
                </div>

                {/* AI Copilot Mail Draft */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Kenji CS Draft Agent</span>
                    <button
                      onClick={handleDraftAI}
                      disabled={loading}
                      className="flex items-center space-x-1 text-[10px] px-2.5 py-1 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-zinc-300 rounded-none font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-3 animate-spin text-orange-500" />
                          <span>CS Agent Writing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-orange-500" />
                          <span>Draft Reply with AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  <textarea
                    rows={8}
                    value={draftReply}
                    onChange={(e) => setDraftReply(e.target.value)}
                    placeholder="Kenji Soto is ready to formulate. Click 'Draft Reply with AI' or start typing directly to customize your support email..."
                    className="w-full p-4 bg-zinc-950 border border-zinc-850 rounded-none text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-700 leading-relaxed resize-none"
                  />

                  {draftReply.trim() && (
                    <div className="flex justify-end border-t border-zinc-800 pt-3">
                      <button
                        onClick={handleSendReply}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-orange-500 hover:bg-orange-400 text-black text-xs font-black uppercase tracking-wider rounded-none transition shadow-sm cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Response & Archive</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 rounded-none text-center space-y-3">
                <div className="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">No ticket selected</h3>
                <p className="text-[11px] text-zinc-500">Select an active ticket from the inbox list on the left to start drafting replies.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
