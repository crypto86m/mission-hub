import React, { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState({
    backlog: [
      { id: '1', title: 'NVCC membership renewal campaign', priority: 'high', dueDate: '2026-04-15', assignee: 'Benjamin', project: 'NVCC' },
      { id: '2', title: 'RLM bid follow-up automation', priority: 'medium', dueDate: '2026-04-18', assignee: 'Charles (CBV2)', project: 'RLM' },
      { id: '3', title: 'Mission Control — mobile optimization', priority: 'low', dueDate: '2026-04-20', assignee: 'Charles (CBV2)', project: 'Mission Control' },
      { id: '4', title: 'Twitter API upgrade (Basic plan $100/mo)', priority: 'low', dueDate: '2026-04-30', assignee: 'Benjamin', project: 'Content' },
      { id: '5', title: 'TradingView webhook integration', priority: 'medium', dueDate: '2026-04-22', assignee: 'Trading Bot', project: 'Trading' },
    ],
    inProgress: [
      { id: '6', title: 'Bennett\'s Brief Issue #7 — AI Automation Lessons', priority: 'medium', dueDate: '2026-04-10', assignee: 'Content Agent', project: 'Content' },
      { id: '7', title: 'AI Support — onboard first 3 customers', priority: 'urgent', dueDate: '2026-04-30', assignee: 'Benjamin', project: 'AI Support' },
      { id: '8', title: 'Hotel Oxbow bid — $410K estimate', priority: 'high', dueDate: '2026-04-11', assignee: 'RLM Estimator', project: 'RLM' },
      { id: '9', title: 'Live trading strategies deployment', priority: 'high', dueDate: '2026-04-10', assignee: 'Trading Bot', project: 'Trading' },
      { id: '10', title: 'Supabase real data integration', priority: 'high', dueDate: '2026-04-10', assignee: 'Charles (CBV2)', project: 'Mission Control' },
    ],
    blocked: [
      { id: '11', title: 'Prospect Research — AI Support lead gen', priority: 'medium', dueDate: '2026-04-15', assignee: 'Prospect Research', project: 'AI Support', blocker: 'Agent idle 24h+ — needs reassignment or new strategy' },
      { id: '12', title: 'Social Media auto-distribution', priority: 'low', dueDate: '2026-04-12', assignee: 'Social Media Agent', project: 'Content', blocker: 'Waiting on Content Agent to finish Issue #7' },
    ],
    done: [
      { id: '13', title: 'Deploy Mission Control dashboard', priority: 'high', dueDate: '2026-04-09', assignee: 'Charles (CBV2)', project: 'Mission Control' },
      { id: '14', title: 'Operational Excellence Standard', priority: 'high', dueDate: '2026-04-07', assignee: 'Charles (CBV2)', project: 'Operations' },
      { id: '15', title: 'Full Integrations audit (27 integrations)', priority: 'medium', dueDate: '2026-04-09', assignee: 'Charles (CBV2)', project: 'Mission Control' },
      { id: '16', title: 'Agent Intelligence Command Center', priority: 'high', dueDate: '2026-04-09', assignee: 'Charles (CBV2)', project: 'Mission Control' },
      { id: '17', title: 'Buffer tweet queue loaded (90 tweets)', priority: 'medium', dueDate: '2026-04-06', assignee: 'Social Media Agent', project: 'Content' },
      { id: '18', title: 'Email responder deployed', priority: 'high', dueDate: '2026-04-03', assignee: 'Email Responder', project: 'Operations' },
    ],
  });

  const [expandedTask, setExpandedTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragSource, setDragSource] = useState(null);

  const handleDragStart = (e, taskId, source) => {
    setDraggedTask(taskId);
    setDragSource(source);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, destination) => {
    e.preventDefault();
    if (draggedTask && dragSource && dragSource !== destination) {
      const task = tasks[dragSource].find((t) => t.id === draggedTask);
      setTasks((prev) => ({
        ...prev,
        [dragSource]: prev[dragSource].filter((t) => t.id !== draggedTask),
        [destination]: [...prev[destination], task],
      }));
    }
    setDraggedTask(null);
    setDragSource(null);
  };

  const handleDeleteTask = (taskId, column) => {
    setTasks((prev) => ({
      ...prev,
      [column]: prev[column].filter((t) => t.id !== taskId),
    }));
  };

  const columns = [
    { key: 'backlog', label: 'Backlog', color: 'from-gray-500 to-gray-600' },
    { key: 'inProgress', label: 'In Progress', color: 'from-blue-500 to-blue-600' },
    { key: 'blocked', label: 'Blocked', color: 'from-red-500 to-red-600' },
    { key: 'done', label: 'Done', color: 'from-green-500 to-green-600' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'high':
        return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'medium':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'low':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className="w-full h-full overflow-x-auto pb-24 pt-6 px-4">
      <h1 className="text-3xl font-bold glow-text mb-2 sticky left-4 top-0 bg-dark-bg pt-2 pb-4">
        Task Board
      </h1>

      <div className="flex gap-4 min-w-full overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.key}
            className="flex-shrink-0 w-80 bg-dark-card/30 rounded-lg p-4 border border-cyan/10"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.key)}
          >
            {/* Column Header */}
            <div className={`bg-gradient-to-r ${column.color} rounded-lg p-3 mb-4 text-white font-semibold text-sm flex justify-between items-center`}>
              <span>{column.label}</span>
              <span className="bg-black/30 px-2 py-1 rounded text-xs">
                {tasks[column.key].length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {tasks[column.key].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, column.key)}
                  className="task-card group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-sm font-semibold text-white flex-1 cursor-pointer hover:text-cyan"
                      onClick={() =>
                        setExpandedTask(
                          expandedTask === task.id ? null : task.id
                        )
                      }
                    >
                      {task.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteTask(task.id, column.key)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                    </button>
                  </div>

                  {/* Priority Badge */}
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-400">{task.dueDate}</span>
                  </div>

                  {/* Assignee + Project */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-300 bg-dark-bg/50 px-2 py-1 rounded">
                      {task.assignee}
                    </div>
                    {task.project && (
                      <span className="text-[9px] text-cyan px-1.5 py-0.5 rounded border border-cyan/20 bg-cyan/5 font-mono">
                        {task.project}
                      </span>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {expandedTask === task.id && (
                    <div className="mt-3 pt-3 border-t border-cyan/20">
                      {task.blocker && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded p-2 mb-2">
                          <p className="text-xs font-semibold text-red-300 mb-1">
                            Blocker
                          </p>
                          <p className="text-xs text-red-200">{task.blocker}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-400">
                        <strong>Status:</strong>{' '}
                        {column.label}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {tasks[column.key].length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No tasks yet</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
