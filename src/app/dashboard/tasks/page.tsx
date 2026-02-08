'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Plus, 
  MoreHorizontal, 
  User, 
  Calendar, 
  GripVertical,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  FolderOpen,
  Flag,
  X
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  project: string;
  createdAt: string;
  dueDate?: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Clover POS integration', description: 'Connect Clover API for in-store inventory sync', status: 'todo', priority: 'high', assignee: 'Botskii', project: 'Secured Tampa', createdAt: '2026-02-08' },
  { id: '2', title: 'Dashboard UI overhaul', description: 'Refresh Projects, Clients, Tasks pages', status: 'in-progress', priority: 'high', assignee: 'Botskii', project: 'Vantix', createdAt: '2026-02-08' },
  { id: '3', title: 'Client proposal review', description: 'Review and send proposal to new lead', status: 'todo', priority: 'medium', assignee: 'Kyle', project: 'New Lead', createdAt: '2026-02-07' },
  { id: '4', title: 'StockX OAuth fix', description: 'Fixed client_id typo and callback detection', status: 'done', priority: 'high', assignee: 'Botskii', project: 'Secured Tampa', createdAt: '2026-02-07' },
  { id: '5', title: 'Stripe webhook', description: 'Inventory sync on checkout', status: 'done', priority: 'high', assignee: 'Botskii', project: 'Secured Tampa', createdAt: '2026-02-07' },
  { id: '6', title: 'Landing page 3D effects', description: 'Mouse parallax, floating shapes, animated counters', status: 'done', priority: 'high', assignee: 'Botskii', project: 'Vantix', createdAt: '2026-02-08' },
];

const columns = [
  { id: 'todo', title: 'To Do', icon: Circle, color: 'from-gray-500 to-gray-600' },
  { id: 'in-progress', title: 'In Progress', icon: Loader2, color: 'from-amber-500 to-orange-500' },
  { id: 'done', title: 'Done', icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
];

const priorityConfig = {
  low: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Low' },
  medium: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Medium' },
  high: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'High' },
};

const assigneeColors: Record<string, string> = {
  'Botskii': 'bg-blue-500/20 text-blue-400',
  'Aidan': 'bg-purple-500/20 text-purple-400',
  'Kyle': 'bg-cyan-500/20 text-cyan-400',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignee: 'Aidan',
    project: '',
  });

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

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    setTasks([
      {
        id: Date.now().toString(),
        ...newTask,
        status: 'todo',
        createdAt: new Date().toISOString().split('T')[0],
      },
      ...tasks,
    ]);
    setNewTask({ title: '', description: '', priority: 'medium', assignee: 'Aidan', project: '' });
    setShowAddModal(false);
  };

  const getTaskCount = (status: string) => tasks.filter(t => t.status === status).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-[var(--color-muted)] mt-1">
            {tasks.length} total • {getTaskCount('done')} completed
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnTasks = tasks.filter(t => t.status === column.id);
          
          return (
            <div
              key={column.id}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id as Task['status'])}
            >
              {/* Column Header */}
              <div className={`p-4 bg-gradient-to-r ${column.color} bg-opacity-10`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${column.color} flex items-center justify-center`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{column.title}</h2>
                      <p className="text-xs text-[var(--color-muted)]">{columnTasks.length} tasks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-4 space-y-3 min-h-[300px] max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {columnTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      className={`group bg-[var(--color-primary)] border border-[var(--color-border)] rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all ${
                        draggedTask?.id === task.id ? 'opacity-50 scale-95' : ''
                      }`}
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                            <GripVertical size={16} className="text-[var(--color-muted)]" />
                          </div>
                          <div>
                            <h3 className="font-medium leading-tight">{task.title}</h3>
                            <p className="text-sm text-[var(--color-muted)] mt-1">{task.description}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-[var(--color-muted)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Task Meta */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-lg border ${priorityConfig[task.priority].color}`}>
                            <Flag size={10} className="inline mr-1" />
                            {priorityConfig[task.priority].label}
                          </span>
                        </div>
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg ${assigneeColors[task.assignee] || 'bg-white/5 text-white/60'}`}>
                          <User size={10} />
                          {task.assignee}
                        </div>
                      </div>

                      {/* Project Tag */}
                      <div className="mt-3 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                        <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                          <FolderOpen size={12} />
                          {task.project}
                        </span>
                        <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
                          <Clock size={12} />
                          {task.createdAt}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {columnTasks.length === 0 && (
                  <div className="text-center py-10 text-[var(--color-muted)]">
                    <Circle size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No tasks here</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">New Task</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    placeholder="What needs to be done?"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/70">Assignee</label>
                    <select
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors"
                    >
                      <option value="Aidan">Aidan</option>
                      <option value="Kyle">Kyle</option>
                      <option value="Botskii">Botskii</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Project</label>
                  <input
                    type="text"
                    value={newTask.project}
                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                    className="w-full bg-white/5 border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Project name..."
                  />
                </div>

                <button
                  onClick={addTask}
                  disabled={!newTask.title.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
