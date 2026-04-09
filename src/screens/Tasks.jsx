import React, { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState({
    backlog: [
      {
        id: '1',
        title: 'Implement trading dashboard',
        priority: 'high',
        dueDate: '2026-04-15',
        assignee: 'Codex',
      },
      {
        id: '2',
        title: 'Update RLM estimating system',
        priority: 'high',
        dueDate: '2026-04-12',
        assignee: 'Claude Code',
      },
    ],
    inProgress: [
      {
        id: '3',
        title: 'Write Bennett\'s Brief newsletter',
        priority: 'medium',
        dueDate: '2026-04-10',
        assignee: 'Writer Agent',
      },
      {
        id: '4',
        title: 'Analyze Q1 trading performance',
        priority: 'high',
        dueDate: '2026-04-11',
        assignee: 'Research Agent',
      },
    ],
    blocked: [
      {
        id: '5',
        title: 'Integrate Superhuman API',
        priority: 'medium',
        dueDate: '2026-04-13',
        assignee: 'Operations',
        blocker: 'Waiting for API key from Benjamin',
      },
    ],
    done: [
      {
        id: '6',
        title: 'Deploy Mission Control dashboard',
        priority: 'high',
        dueDate: '2026-04-09',
        assignee: 'Charles (CBV2)',
      },
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
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-low';
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

                  {/* Assignee */}
                  <div className="text-xs text-gray-300 bg-dark-bg/50 px-2 py-1 rounded">
                    {task.assignee}
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
