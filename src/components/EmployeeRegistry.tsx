import React, { useState } from 'react';
import { Agent, AgentId } from '../types';
import { Users, Play, Settings, ShieldAlert, Cpu, Sparkles, Check, Loader2 } from 'lucide-react';

interface EmployeeRegistryProps {
  agents: Agent[];
  onTriggerAgentJob: (agentId: AgentId, jobType: string) => Promise<void>;
  businessName: string;
}

export default function EmployeeRegistry({ agents, onTriggerAgentJob, businessName }: EmployeeRegistryProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId>('ceo');
  const [runningJob, setRunningJob] = useState(false);
  const [jobSuccess, setJobSuccess] = useState(false);

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const agentJobs: Record<AgentId, { label: string; jobType: string; description: string }[]> = {
    ceo: [
      { label: 'Coordinate Roadmap Alignment', jobType: 'align_roadmap', description: 'Evaluate checklist compliance and update strategic goals.' }
    ],
    product: [
      { label: 'Draft Pro Feature Packaging', jobType: 'pro_packaging', description: 'Analyze offer metrics and outline tiered feature deliverables.' }
    ],
    website: [
      { label: 'Audit Landing Page SEO Tags', jobType: 'seo_audit', description: 'Optimize headings, title elements, and descriptions.' }
    ],
    marketing: [
      { label: 'Compose Launch Email Campaign', jobType: 'email_campaign', description: 'Write automatic transactional and educational launch sequences.' }
    ],
    sales: [
      { label: 'Configure Stripe Sandbox products', jobType: 'sandbox_payment', description: 'Establish sandbox prices and test checkouts.' }
    ],
    support: [
      { label: 'Synthesize FAQ Help Center', jobType: 'faq_center', description: 'Draft helpful customer service answer sheets.' }
    ],
    finance: [
      { label: 'Establish Sales Projections Model', jobType: 'finance_projections', description: 'Draft revenue models and monthly tracking schedules.' }
    ],
    operations: [
      { label: 'Perform Deployment Pre-Flight Checks', jobType: 'preflight_deploy', description: 'Scan active databases and DNS connections.' }
    ]
  };

  const handleRunJob = async (jobType: string) => {
    if (runningJob) return;
    setRunningJob(true);
    setJobSuccess(false);

    try {
      await onTriggerAgentJob(selectedAgentId, jobType);
      setJobSuccess(true);
      setTimeout(() => setJobSuccess(false), 5000); // clear banner
    } finally {
      setRunningJob(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Header */}
      <div className="pb-2">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">AI Employee Registry</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Review credentials, edit background prompt parameters, and trigger autonomous background jobs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Roster Grid */}
        <div className="md:col-span-1 space-y-3">
          <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] block mb-1">
            Active Staff List (8)
          </span>
          <div className="space-y-2">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgentId;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-none border text-left transition-all duration-150 border-l-2 cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-100 border-l-orange-500 shadow-sm'
                      : 'bg-zinc-950 hover:bg-zinc-900/40 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="text-xl shrink-0">{agent.avatar}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">{agent.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      agent.status === 'thinking' || agent.status === 'working'
                        ? 'bg-orange-500 animate-pulse'
                        : 'bg-emerald-500'
                    }`} />
                    <span className="text-[9px] font-black font-mono text-zinc-500">
                      {agent.status === 'thinking' ? 'THINK' : agent.status === 'working' ? 'RUN' : 'IDLE'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Credentials & Job Terminal */}
        <div className="md:col-span-2 space-y-6">
          {/* Employee Bio */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center space-x-3.5">
                <span className="text-3xl shrink-0">{selectedAgent.avatar}</span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200">{selectedAgent.name}</h3>
                  <p className="text-xs text-zinc-500">{selectedAgent.role}</p>
                </div>
              </div>
              <div className="px-2 py-1 rounded-none bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
                Agent ID: {selectedAgent.id}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1.5">Employee Bio</h4>
                <p className="text-zinc-400 leading-relaxed bg-zinc-950/40 p-3 border border-zinc-800 border-l-2 border-l-orange-500 rounded-none">
                  "{selectedAgent.bio}"
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1.5">System Prompt Parameters</h4>
                <div className="font-mono text-[11px] leading-relaxed text-zinc-400 bg-zinc-950 p-3.5 border border-zinc-800 rounded-none whitespace-pre-line max-h-[160px] overflow-y-auto scrollbar-thin">
                  {selectedAgent.prompt}
                </div>
              </div>
            </div>
          </div>

          {/* Trigger Agent Jobs */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-none p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-orange-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Run Autonomous Jobs</h3>
            </div>

            {jobSuccess && (
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-none text-xs flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-orange-500" />
                <span>Success! Agent {selectedAgent.name} has completed the workflow. A new task has been dispatched to your Action Queue!</span>
              </div>
            )}

            {!businessName ? (
              <p className="text-xs text-zinc-500">
                ⚠️ Define your business inside the **Founder Chat** or **Business Blueprint** first to enable autonomous work.
              </p>
            ) : (
              <div className="space-y-3">
                {agentJobs[selectedAgent.id]?.map((job, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-950/40 border border-zinc-800 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold text-zinc-300">{job.label}</div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed">{job.description}</p>
                    </div>
                    <button
                      onClick={() => handleRunJob(job.jobType)}
                      disabled={runningJob}
                      className="flex items-center justify-center space-x-2 px-4 py-2 rounded-none bg-orange-500 hover:bg-orange-400 text-black font-bold uppercase tracking-wider text-[10px] transition-all duration-150 disabled:opacity-40 cursor-pointer"
                    >
                      {runningJob ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                          <span>Executing Agent Job...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Dispatch Job</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
