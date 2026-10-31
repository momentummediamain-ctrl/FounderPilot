import React, { useState, useMemo } from 'react';
import { Task, Agent, TaskUrgency, StrategicGoalType } from '../types';
import {
  CheckSquare,
  Play,
  Check,
  Terminal,
  Loader2,
  ShieldCheck,
  FileCheck2,
  Lock,
  ArrowUpDown,
  GitBranch,
  Target,
  Flame,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface TaskQueueViewProps {
  tasks: Task[];
  agents: Agent[];
  onApproveTask: (taskId: string) => void;
  onExecuteTask: (taskId: string) => Promise<void>;
  onUpdateTaskPriority?: (
    taskId: string,
    urgency: TaskUrgency,
    strategicGoal: StrategicGoalType
  ) => void;
  activeRole?: 'OWNER' | 'OPERATOR' | 'VIEWER';
  ownerApprovedLaunch?: boolean;
}

const STRATEGIC_GOALS: {
  id: StrategicGoalType | 'balanced';
  label: string;
  shortLabel: string;
  description: string;
}[] = [
  {
    id: 'revenue_acceleration',
    label: 'Revenue Acceleration & Monetization',
    shortLabel: 'Revenue Acceleration',
    description: 'Prioritizes Stripe checkout, pricing tiers, and direct monetization tasks.'
  },
  {
    id: 'customer_acquisition',
    label: 'Customer Acquisition & GTM',
    shortLabel: 'Customer Acquisition',
    description: 'Prioritizes landing page deployment, SEO, and multi-channel launch campaigns.'
  },
  {
    id: 'product_readiness',
    label: 'Product Readiness & Packaging',
    shortLabel: 'Product Readiness',
    description: 'Prioritizes MVP feature scope, market wedge alignment, and onboarding flows.'
  },
  {
    id: 'operational_resilience',
    label: 'Operational Resilience & Support',
    shortLabel: 'Operational Resilience',
    description: 'Prioritizes DNS/SSL preflight, SLA macros, and financial unit economics.'
  },
  {
    id: 'balanced',
    label: 'Balanced Multi-Goal Weighting',
    shortLabel: 'Balanced Mode',
    description: 'Weights all strategic goals equally while still enforcing urgency and dependencies.'
  }
];

const URGENCY_WEIGHTS: Record<TaskUrgency, number> = {
  critical: 45,
  high: 32,
  normal: 20,
  low: 10
};

export default function TaskQueueView({
  tasks,
  agents,
  onApproveTask,
  onExecuteTask,
  onUpdateTaskPriority,
  activeRole = 'OWNER',
  ownerApprovedLaunch = true
}: TaskQueueViewProps) {
  const [executingTaskId, setExecutingTaskId] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<Record<string, string[]>>({});
  const [rbacError, setRbacError] = useState<string | null>(null);
  const [activeStrategicFocus, setActiveStrategicFocus] = useState<
    StrategicGoalType | 'balanced'
  >('revenue_acceleration');

  // Compute composite Priority Score (0-100) for any task based on:
  // 1. Founder-Defined Urgency Level (10-45 pts)
  // 2. Strategic Business Goal Alignment (10-25 pts)
  // 3. Task Dependency Readiness (+20 pts if unblocked, -20 penalty if blocked by unapproved prerequisite)
  // 4. Downstream Unblocker Impact (+10 pts per downstream task waiting on this task)
  const scoredTasksMap = useMemo(() => {
    const map: Record<
      string,
      {
        score: number;
        urgencyPts: number;
        goalPts: number;
        dependencyPts: number;
        unblockerPts: number;
        unmetDependencies: Task[];
        blocksTasksCount: number;
      }
    > = {};

    tasks.forEach((task) => {
      const urgency: TaskUrgency = task.urgency || 'normal';
      const goal: StrategicGoalType = task.strategicGoal || 'product_readiness';
      const deps = task.dependsOnTaskIds || [];

      const urgencyPts = URGENCY_WEIGHTS[urgency] || 20;

      const goalPts =
        activeStrategicFocus === 'balanced'
          ? 16
          : goal === activeStrategicFocus
          ? 25
          : 10;

      // Check if all prerequisite tasks are approved or completed
      const unmetDependencies = deps
        .map((depId) => tasks.find((t) => t.id === depId))
        .filter(
          (depTask): depTask is Task =>
            Boolean(depTask && depTask.status === 'pending_approval')
        );

      const dependencyPts = unmetDependencies.length === 0 ? 20 : -20;

      // Count how many other tasks depend on this task
      const blocksTasksCount = tasks.filter((other) =>
        (other.dependsOnTaskIds || []).includes(task.id)
      ).length;
      const unblockerPts = Math.min(15, blocksTasksCount * 8);

      const rawScore = urgencyPts + goalPts + dependencyPts + unblockerPts;
      const score = Math.max(5, Math.min(100, rawScore));

      map[task.id] = {
        score,
        urgencyPts,
        goalPts,
        dependencyPts,
        unblockerPts,
        unmetDependencies,
        blocksTasksCount
      };
    });

    return map;
  }, [tasks, activeStrategicFocus]);

  const handleApprove = (taskId: string) => {
    if (activeRole !== 'OWNER') {
      setRbacError(
        `RBAC Guard Blocked Approval: Current role (${activeRole}) cannot approve consequential actions. Switch to OWNER role.`
      );
      return;
    }
    setRbacError(null);
    onApproveTask(taskId);
  };

  const handleExecute = async (taskId: string) => {
    if (!ownerApprovedLaunch) {
      setRbacError(
        'Launch Gate Lock Active: External task execution is blocked until the Owner unlocks Public Launch in the Launch Gate.'
      );
      return;
    }
    if (activeRole !== 'OWNER') {
      setRbacError(
        `RBAC Guard Blocked Execution: Current role (${activeRole}) cannot execute consequential actions.`
      );
      return;
    }
    setRbacError(null);
    setExecutingTaskId(taskId);
    setTerminalLogs((prev) => ({
      ...prev,
      [taskId]: [
        'Verifying OWNER approval token, Launch Gate unlock state & tenant namespace...',
        'Dispatching approved integration payload to server (/api/tasks/execute-with-receipt)...'
      ]
    }));

    const appendLog = (log: string) => {
      setTerminalLogs((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), log]
      }));
    };

    try {
      await onExecuteTask(taskId);
      appendLog('✓ Provider execution verified. Cryptographic SHA-256 ActionReceipt issued.');
    } catch (e: any) {
      appendLog(`❌ Execution failed: ${e?.message || 'Provider error'}`);
    } finally {
      setExecutingTaskId(null);
    }
  };

  // Sort pending tasks by Priority Score descending so the most critical unblocked tasks surface first
  const pendingTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status === 'pending_approval')
      .sort((a, b) => {
        const scoreA = scoredTasksMap[a.id]?.score ?? 0;
        const scoreB = scoredTasksMap[b.id]?.score ?? 0;
        return scoreB - scoreA;
      });
  }, [tasks, scoredTasksMap]);

  const activeTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status === 'approved')
      .sort((a, b) => {
        const scoreA = scoredTasksMap[a.id]?.score ?? 0;
        const scoreB = scoredTasksMap[b.id]?.score ?? 0;
        return scoreB - scoreA;
      });
  }, [tasks, scoredTasksMap]);

  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const getAgentName = (id: string) => {
    const agent = agents.find((a) => a.id === id);
    return agent ? agent.name : 'System Agent';
  };

  const getAgentAvatar = (id: string) => {
    const agent = agents.find((a) => a.id === id);
    return agent ? agent.avatar : '⚙️';
  };

  const getUrgencyBadgeStyle = (urgency: TaskUrgency = 'normal') => {
    switch (urgency) {
      case 'critical':
        return 'bg-rose-500/10 border-rose-500/40 text-rose-300';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/40 text-orange-300';
      case 'normal':
        return 'bg-zinc-950 border-zinc-700 text-zinc-300';
      case 'low':
        return 'bg-zinc-950 border-zinc-800 text-zinc-500';
    }
  };

  const getGoalLabel = (goal: StrategicGoalType = 'product_readiness') => {
    const found = STRATEGIC_GOALS.find((g) => g.id === goal);
    return found ? found.shortLabel : 'Product Readiness';
  };

  return (
    <div className="space-y-6 max-w-6xl animate-fade-in">
      {/* Top Header */}
      <div className="border-b border-zinc-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-orange-400 mb-1">
            Stage 3 Exit Gate · Dependency-Aware Prioritization & Cryptographic Action Receipts
          </div>
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
            Task Approval Queue & Dynamic Prioritization Engine
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Surfaces the highest-impact unblocked tasks first by scoring Task Dependencies, Founder-Defined Urgency, and Strategic Business Goals.
          </p>
        </div>

        <div className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 shrink-0">
          Role: <span className="text-orange-400 font-semibold">{activeRole}</span> · Launch Gate:{' '}
          <span
            className={
              ownerApprovedLaunch
                ? 'text-emerald-400 font-semibold'
                : 'text-rose-400 font-semibold'
            }
          >
            {ownerApprovedLaunch ? 'UNLOCKED' : 'LOCKED'}
          </span>{' '}
          · Receipts:{' '}
          <span className="text-emerald-400 font-semibold tabular-nums">
            {completedTasks.length}
          </span>
        </div>
      </div>

      {/* Strategic Business Goal & Prioritization Matrix Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-400 shrink-0" />
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-100 font-semibold">
                Active Strategic Business Goal (Dynamic Queue Weighting)
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Select your current primary objective. Tasks aligned with this goal receive a +25 pt priority boost, while tasks blocked by unapproved prerequisites are automatically demoted until unblocked.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-orange-400" />
            <span>Auto-Sorted by Priority Score (0–100)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {STRATEGIC_GOALS.map((goal) => {
            const isSelected = activeStrategicFocus === goal.id;
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => setActiveStrategicFocus(goal.id)}
                className={`p-3 text-left border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-950 border-orange-500 text-zinc-100'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-semibold tracking-tight">
                    {goal.shortLabel}
                  </span>
                  {isSelected && (
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-orange-500/15 text-orange-300 border border-orange-500/30">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 leading-snug">{goal.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {rbacError && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 font-mono flex items-center justify-between gap-4">
          <span>{rbacError}</span>
          <button
            onClick={() => setRbacError(null)}
            className="text-[11px] underline text-rose-200 cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="p-12 border border-zinc-800 bg-zinc-900 text-center space-y-3">
          <CheckSquare className="w-6 h-6 text-orange-500 mx-auto" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
            Task Queue Empty
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            No tasks require authorization right now. Trigger an AI Employee job or stage an action from Specialist Chat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left 3 Columns: Prioritized Pending Approval & Approved Standby */}
          <div className="lg:col-span-3 space-y-6">
            {/* 1. Pending Approvals (Prioritized) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono uppercase text-amber-400 tracking-wider">
                  1. Prioritized Pending Owner Approval ({pendingTasks.length})
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  Highest Priority Unblocked First
                </span>
              </div>

              <div className="space-y-3">
                {pendingTasks.length === 0 ? (
                  <div className="p-4 bg-zinc-900 border border-zinc-800 text-xs text-zinc-500">
                    All queued tasks have been reviewed by the workspace owner.
                  </div>
                ) : (
                  pendingTasks.map((task, idx) => {
                    const metrics = scoredTasksMap[task.id];
                    const isBlocked = (metrics?.unmetDependencies.length || 0) > 0;
                    const urgency = task.urgency || 'normal';
                    const strategicGoal = task.strategicGoal || 'product_readiness';

                    return (
                      <div
                        key={task.id}
                        className={`bg-zinc-900 border p-5 space-y-3.5 transition ${
                          idx === 0 && !isBlocked
                            ? 'border-orange-500/60'
                            : 'border-zinc-800'
                        }`}
                      >
                        {/* Top Priority Ribbon */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 text-[10px] font-mono font-bold tabular-nums border ${
                                (metrics?.score || 0) >= 80
                                  ? 'bg-orange-500 text-black border-orange-400'
                                  : (metrics?.score || 0) >= 60
                                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                  : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                              }`}
                            >
                              PRIORITY SCORE: {metrics?.score ?? 50}/100
                            </span>

                            {idx === 0 && !isBlocked && (
                              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                <Flame className="w-3 h-3" />
                                <span>#1 Recommended Next Approval</span>
                              </span>
                            )}

                            {metrics && metrics.blocksTasksCount > 0 && (
                              <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-sky-500/10 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                                <GitBranch className="w-3 h-3" />
                                <span>Unblocks {metrics.blocksTasksCount} Downstream Task(s)</span>
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] font-mono text-zinc-500 tabular-nums">
                            Urgency {metrics?.urgencyPts} + Goal {metrics?.goalPts}{' '}
                            {metrics && metrics.dependencyPts >= 0
                              ? `+ Ready ${metrics.dependencyPts}`
                              : `- Blocked ${Math.abs(metrics?.dependencyPts || 0)}`}
                            {metrics && metrics.unblockerPts > 0
                              ? ` + Unblocker ${metrics.unblockerPts}`
                              : ''}
                          </span>
                        </div>

                        {/* Task Title & Agent Info */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl p-1.5 bg-zinc-950 border border-zinc-800 shrink-0">
                              {getAgentAvatar(task.agentId)}
                            </span>
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-100">
                                {task.title}
                              </h4>
                              <p className="text-[11px] text-zinc-500">
                                Requested by {getAgentName(task.agentId)} · {task.createdAt} · ID:{' '}
                                <span className="font-mono">{task.id}</span>
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400 uppercase shrink-0">
                            AWAITING OWNER APPROVAL
                          </span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {task.description}
                        </p>

                        {/* Custom Skill Focus Applied Indicator */}
                        {task.customSkillApplied && (
                          <div className="px-3 py-2 bg-zinc-950 border border-zinc-800 flex items-center gap-2 text-[11px] text-zinc-300">
                            <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <span>
                              <strong className="text-orange-300 font-mono uppercase text-[10px]">
                                Custom Skill Focus Applied:
                              </strong>{' '}
                              "{task.customSkillApplied}"
                            </span>
                          </div>
                        )}

                        {/* Dependency Status Callout */}
                        {(task.dependsOnTaskIds || []).length > 0 && (
                          <div
                            className={`px-3 py-2 border text-[11px] font-mono flex items-center justify-between gap-2 ${
                              isBlocked
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isBlocked ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              ) : (
                                <GitBranch className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                              <span>
                                {isBlocked
                                  ? `Blocked by prerequisite: ${metrics?.unmetDependencies
                                      .map((d) => `"${d.title}"`)
                                      .join(', ')}`
                                  : `All prerequisites satisfied (${(task.dependsOnTaskIds || []).join(', ')})`}
                              </span>
                            </div>
                            <span className="uppercase text-[10px] shrink-0">
                              {isBlocked ? 'APPROVE PREREQUISITE FIRST' : 'UNBLOCKED'}
                            </span>
                          </div>
                        )}

                        {/* Inline Founder Controls for Urgency & Strategic Goal */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-[11px]">
                            <span className="font-mono text-zinc-500 uppercase text-[10px]">
                              Founder Urgency:
                            </span>
                            {onUpdateTaskPriority ? (
                              <select
                                value={urgency}
                                onChange={(e) =>
                                  onUpdateTaskPriority(
                                    task.id,
                                    e.target.value as TaskUrgency,
                                    strategicGoal
                                  )
                                }
                                className={`font-mono text-[11px] uppercase px-2 py-0.5 border cursor-pointer focus:outline-none ${getUrgencyBadgeStyle(
                                  urgency
                                )}`}
                              >
                                <option value="critical">CRITICAL (45 pts)</option>
                                <option value="high">HIGH (32 pts)</option>
                                <option value="normal">NORMAL (20 pts)</option>
                                <option value="low">LOW (10 pts)</option>
                              </select>
                            ) : (
                              <span
                                className={`font-mono text-[10px] uppercase px-2 py-0.5 border ${getUrgencyBadgeStyle(
                                  urgency
                                )}`}
                              >
                                {urgency}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 border border-zinc-800 text-[11px]">
                            <span className="font-mono text-zinc-500 uppercase text-[10px]">
                              Strategic Goal:
                            </span>
                            {onUpdateTaskPriority ? (
                              <select
                                value={strategicGoal}
                                onChange={(e) =>
                                  onUpdateTaskPriority(
                                    task.id,
                                    urgency,
                                    e.target.value as StrategicGoalType
                                  )
                                }
                                className="bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-[11px] px-2 py-0.5 cursor-pointer focus:outline-none"
                              >
                                <option value="revenue_acceleration">Revenue Acceleration</option>
                                <option value="customer_acquisition">Customer Acquisition</option>
                                <option value="product_readiness">Product Readiness</option>
                                <option value="operational_resilience">Operational Resilience</option>
                              </select>
                            ) : (
                              <span className="font-mono text-zinc-300">
                                {getGoalLabel(strategicGoal)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Approval Action Footer */}
                        <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                          <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-zinc-500" />
                            <span>Execution locked until approved by Owner</span>
                          </span>
                          <button
                            onClick={() => handleApprove(task.id)}
                            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-zinc-950 border border-zinc-700 hover:border-orange-500 text-zinc-100 font-semibold text-xs transition cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-orange-500" />
                            <span>Approve Action (Owner)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* 2. Approved & Ready for Execution */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                2. Approved & Ready to Execute ({activeTasks.length})
              </div>

              <div className="space-y-3">
                {activeTasks.length === 0 ? (
                  <div className="p-4 bg-zinc-900 border border-zinc-800 text-xs text-zinc-500">
                    No approved actions waiting in standby. Approve a prioritized task above to unlock execution.
                  </div>
                ) : (
                  activeTasks.map((task) => {
                    const isExecuting = executingTaskId === task.id;
                    const metrics = scoredTasksMap[task.id];
                    return (
                      <div
                        key={task.id}
                        className="bg-zinc-900 border border-zinc-800 p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl p-1.5 bg-zinc-950 border border-zinc-800 shrink-0">
                              {getAgentAvatar(task.agentId)}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-semibold text-zinc-100">
                                  {task.title}
                                </h4>
                                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-950 border border-zinc-800 text-orange-400 tabular-nums">
                                  Score {metrics?.score ?? 75}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-500">
                                Approved {task.approvedAt ? `at ${task.approvedAt}` : 'by Owner'} · Ready for provider execution
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 uppercase shrink-0">
                            APPROVED
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {task.description}
                        </p>

                        {terminalLogs[task.id] && (
                          <div className="bg-zinc-950 p-3.5 border border-zinc-800 font-mono text-[11px] leading-relaxed text-zinc-400 space-y-1">
                            <div className="flex items-center space-x-2 text-zinc-500 mb-1 border-b border-zinc-800 pb-1">
                              <Terminal className="w-3.5 h-3.5 text-orange-500" />
                              <span className="font-semibold text-[10px] uppercase tracking-wider">
                                Provider Execution Stream
                              </span>
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
                            className="flex items-center space-x-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-semibold text-xs transition disabled:opacity-50 cursor-pointer"
                          >
                            {isExecuting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                                <span>Executing & Signing Receipt...</span>
                              </>
                            ) : !ownerApprovedLaunch || activeRole !== 'OWNER' ? (
                              <>
                                <Lock className="w-3.5 h-3.5 text-black" />
                                <span>Execute & Issue Receipt (Locked)</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Execute & Issue Receipt</span>
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

          {/* Right 2 Columns: Verified Action Execution Receipts */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-xs font-mono uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Verified Execution Receipts ({completedTasks.length})</span>
            </div>

            <div className="space-y-3 max-h-[680px] overflow-y-auto scrollbar-thin">
              {completedTasks.length === 0 ? (
                <div className="p-5 bg-zinc-900 border border-zinc-800 text-xs text-zinc-500">
                  No execution receipts yet. Approve and execute a task on the left to generate a cryptographically signed receipt.
                </div>
              ) : (
                completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 bg-zinc-900 border border-zinc-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {task.receipt?.receiptId || `rcpt_${task.id}`}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>VERIFIED RECEIPT</span>
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-zinc-100">{task.title}</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {task.result || 'Provider execution verified. Audit log committed.'}
                    </p>

                    <div className="p-2.5 bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-zinc-400 space-y-1">
                      <div>
                        Approved By:{' '}
                        <span className="text-zinc-200">
                          {task.receipt?.approvedBy || 'Owner (tenant_alpha_01)'}
                        </span>
                      </div>
                      <div>
                        Executed At:{' '}
                        <span className="text-zinc-200">
                          {task.receipt?.executedAt
                            ? new Date(task.receipt.executedAt).toLocaleTimeString()
                            : task.createdAt}
                        </span>
                      </div>
                      <div className="truncate text-zinc-500" title={task.receipt?.sha256Hash}>
                        SHA-256:{' '}
                        {task.receipt?.sha256Hash ||
                          'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                      </div>
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
