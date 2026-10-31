import React, { useState } from 'react';
import { Task, Agent } from '../types';
import { CheckSquare, ArrowRight, Play, Check, ShieldAlert, Sparkles, Terminal, Loader2 } from 'lucide-react';

interface TaskQueueViewProps {
  tasks: Task[];
  agents: Agent[];
  onApproveTask: (taskId: string) => void;
  onExecuteTask: (taskId: string) => Promise<void>;
}

export default function TaskQueueView({ tasks, agents, onApproveTask, onExecuteTask }: TaskQueueViewProps) {
  const [executingTaskId, setExecutingTaskId] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<Record<string, string[]>>({});

  const handleExecute = async (taskId: string) => {
    setExecutingTaskId(taskId);
    setTerminalLogs((prev) => ({
      ...prev,
      [taskId]: ['Initializing execution agent...', 'Opening SSH tunnel connection...']
    }));

    // Simulated streaming logs
    const appendLog = (log: string) => {
      setTerminalLogs((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), log]
      }));
    };

    setTimeout(() => appendLog('Verifying database persistence credentials...'), 500);
    setTimeout(() => appendLog('Uploading metadata parameters to cloud server...'), 1100);
    setTimeout(() => appendLog('Verifying SSL configuration checks...'), 1700);

    setTimeout(async () => {
      try {
        await onExecuteTask(taskId);
        appendLog('✓ Deployment payload executed successfully.');
      } catch (e) {
        appendLog('❌ Execution failed: API authentication failure.');
      } finally {
        setExecutingTaskId(null);
      }
    }, 2400);
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending_approval');
  const activeTasks = tasks.filter((t) => t.status === 'approved');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const getAgentName = (id: string) => {
    const agent = agents.find((a) => a.id === id);
    return agent ? agent.name : 'System Agent';
  };

  const getAgentAvatar = (id: string) => {
    const agent = agents.find((a) => a.id === id);
    return agent ? agent.avatar : '⚙️';
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Top Header */}
      <div className="pb-2">
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight uppercase">Task Approval Queue</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Review tasks generated autonomously by your AI employee roster. Approve and trigger live system deployments.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="p-12 border border-dashed border-zinc-800 bg-zinc-950 rounded-none text-center space-y-4">
          <div className="w-12 h-12 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-orange-500">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-200">Task Queue Empty</h3>
            <p className="text-xs text-zinc-500">
              No tasks require authorization right now. Your AI Employees will populate this queue when you run jobs or guide strategy in chat.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Action Queue List */}
          <div className="md:col-span-2 space-y-6">
            {/* 1. Pending Approvals */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em] flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>Pending Authorization ({pendingTasks.length})</span>
              </span>

              <div className="space-y-3">
                {pendingTasks.length === 0 ? (
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-none text-center text-xs text-zinc-500">
                    No tasks awaiting owner approval.
                  </div>
                ) : (
                  pendingTasks.map((task) => (
                    <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-none p-5 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl p-1.5 bg-zinc-950 border border-zinc-800 rounded-none shrink-0">{getAgentAvatar(task.agentId)}</span>
                          <div>
                            <h4 className="text-xs font-semibold text-zinc-200">{task.title}</h4>
                            <p className="text-[10px] text-zinc-500">Created by {getAgentName(task.agentId)} • {task.createdAt}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-none text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase">
                          Action Required
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed pl-1">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-end border-t border-zinc-800 pt-3">
                        <button
                          onClick={() => onApproveTask(task.id)}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-none bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 font-bold uppercase tracking-wider text-[10px] cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-orange-500" />
                          <span>Approve Action</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. Approved & Ready for Execution */}
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Approved & Standby ({activeTasks.length})</span>
              </span>

              <div className="space-y-3">
                {activeTasks.length === 0 ? (
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-none text-center text-xs text-zinc-500">
                    No approved operations waiting in standby.
                  </div>
                ) : (
                  activeTasks.map((task) => {
                    const isExecuting = executingTaskId === task.id;
                    return (
                      <div key={task.id} className="bg-zinc-900 border border-zinc-800 rounded-none p-5 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl p-1.5 bg-zinc-950 border border-zinc-800 rounded-none shrink-0">{getAgentAvatar(task.agentId)}</span>
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-200">{task.title}</h4>
                              <p className="text-[10px] text-zinc-500">Authorized by you • Ready to deploy</p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-none text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                            Approved
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed pl-1">
                          {task.description}
                        </p>

                        {/* Live Terminal Log Board */}
                        {terminalLogs[task.id] && (
                          <div className="bg-black p-3.5 rounded-none border border-zinc-800 font-mono text-[10px] leading-relaxed text-zinc-400 space-y-1">
                            <div className="flex items-center space-x-2 text-zinc-600 mb-1 border-b border-zinc-800 pb-1">
                              <Terminal className="w-3.5 h-3.5 text-orange-500" />
                              <span className="font-bold text-[9px] uppercase tracking-wider">Execution Console</span>
                            </div>
                            {terminalLogs[task.id].map((log, lidx) => (
                              <div key={lidx}>{log}</div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-end border-t border-zinc-800 pt-3">
                          <button
                            onClick={() => handleExecute(task.id)}
                            disabled={isExecuting}
                            className="flex items-center space-x-1.5 px-4 py-2 rounded-none bg-orange-500 hover:bg-orange-400 text-black font-bold uppercase tracking-wider text-[10px] transition duration-150 disabled:opacity-50 shadow-sm cursor-pointer"
                          >
                            {isExecuting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                                <span>Running Deployment...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Deploy Live Action</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Side Complete Log */}
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] block">
              Completed Actions Log ({completedTasks.length})
            </span>

            <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
              {completedTasks.length === 0 ? (
                <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-none text-center text-xs text-zinc-600">
                  No actions completed yet.
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-none space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500 font-mono">ID: {task.id}</span>
                      <span className="text-[9px] font-mono font-black text-emerald-500 uppercase">✓ Success</span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-300 truncate">{task.title}</div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">{task.description}</p>
                    <div className="text-[9px] font-mono text-zinc-600 border-t border-zinc-800 pt-1">
                      Executed successfully on cloud container.
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
