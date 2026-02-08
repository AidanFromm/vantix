'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, User, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  project: string;
  dueDate?: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Clover POS integration', description: 'Connect Clover API for in-store inventory sync', status: 'todo', priority: 'high', assignee: 'Botskii', project: 'Secured Tampa' },
  { id: '2', title: 'Landing page scroll animations', description: 'Add framer-motion parallax effects', status: 'in-progress', priority: 'medium', assignee: 'Aidan', project: 'Vantix' },
  { id: '3', title: 'Client proposal review', description: 'Review and send proposal to new lead', status: 'todo', priority: 'medium', assignee: 'Kyle', project: 'New Lead' },
  { id: '4', title: 'StockX OAuth fix', description: 'Fixed client_id typo and callback detection', status: 'done', priority: 'high', assignee: 'Botskii', project: 'Secured Tampa' },
  { id: '5', title: 'Stripe webhook', description: 'Inventory sync on checkout', status: 'done', priority: 'high', assignee: 'Botskii', project: 'Secured Tampa' },
];

const columns = [
  { id: 'todo', title: 'To Do', color: 'var(--color-muted)' },
  { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
  { id: 'done', title: 'Done', color: '#22c55e' },
];

const priorityColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task['status']) => {
    if (draggedTask) {
      setTasks(tasks.map(t => 
        t.id === draggedTask.id ? { ...t, status } : t
      ));
      setDraggedTask(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-[var(--color-muted)] mt-1">Manage your team's work</p>
        </div>
        <button className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-4"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id as Task['status'])}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
                <h2 className="font-semibold">{column.title}</h2>
                <span className="text-xs text-[var(--color-muted)] bg-white/5 px-2 py-0.5 rounded-full">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="bg-[var(--color-primary)] border border-[var(--color-border)] rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-[var(--color-accent)] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <button className="text-[var(--color-muted)] hover:text-white">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-[var(--color-muted)] mb-3">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                        <User size={12} />
                        {task.assignee}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-[var(--color-muted)]">
                      {task.project}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
