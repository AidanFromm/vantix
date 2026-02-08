'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2,
  Clock,
  CheckCircle2,
  Circle,
  Bot,
  Users,
  Flag,
  X,
  GripVertical
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'done';
  assignee: 'bot1' | 'bot2' | 'shared';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Clover POS integration', description: 'Connect Clover API for in-store sync', status: 'todo', assignee: 'bot1', priority: 'high', createdAt: '2026-02-08' },
  { id: '2', title: 'Client outreach - new leads', description: 'Follow up on contact form submissions', status: 'todo', assignee: 'bot2', priority: 'medium', createdAt: '2026-02-08' },
  { id: '3', title: 'Weekly analytics report', description: 'Compile sales data for Dave', status: 'todo', assignee: 'shared', priority: 'medium', createdAt: '2026-02-08' },
  { id: '4', title: 'Landing page rebrand', description: 'Green-teal theme, smooth animations', status: 'done', assignee: 'bot1', priority: 'high', createdAt: '2026-02-08' },
  { id: '5', title: 'Supabase leads setup', description: 'Database + API for contact form', status: 'done', assignee: 'bot1', priority: 'high', createdAt: '2026-02-08' },
  { id: '6', title: 'Social media setup', description: 'Create Vantix accounts', status: 'todo', assignee: 'bot2', priority: 'low', createdAt: '2026-02-07' },
];

const assigneeConfig = {
  bot1: { 
    label: 'Vantix Bot #1', 
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
  },
  bot2: { 
    label: 'Vantix Bot #2', 
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
  },
  shared: { 
    label: 'Together', 
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
  },
};

const priorityConfig = {
  low: { color: 'text-gray-400', bg: 'bg-gray-500/10' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  high: { color: 'text-red-400', bg: 'bg-red-500/10' },
};

function TaskCard({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  const config = assigneeConfig[task.assignee];
  const priority = priorityConfig[task.priority];
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group p-4 rounded-xl border ${config.borderColor} ${config.bgColor} hover:border-opacity-60 transition-all`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="mt-0.5 shrink-0"
        >
          {task.status === 'done' ? (
            <CheckCircle2 size={20} className="text-[var(--color-accent)]" />
          ) : (
            <Circle size={20} className="text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${task.status === 'done' ? 'line-through text-[var(--color-muted)]' : ''}`}>
            {task.title}
          </p>
          <p className="text-sm text-[var(--color-muted)] mt-1 truncate">{task.description}</p>
          
          <div className="flex items-center gap-2 mt-3">
            <span className={`text-xs px-2 py-0.5 rounded-full ${priority.bg} ${priority.color}`}>
              {task.priority}
            </span>
            <span className="text-xs text-[var(--color-muted)]">{task.createdAt}</span>
          </div>
        </div>
        
        <button
          onClick={onDelete}
          className="p-1 opacity-0 group-hover:opacity-100 text-[var(--color-muted)] hover:text-red-400 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function TaskColumn({ 
  title, 
  tasks, 
  assignee, 
  onToggle, 
  onDelete 
}: { 
  title: string; 
  tasks: Task[]; 
  assignee: 'bot1' | 'bot2' | 'shared';
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const config = assigneeConfig[assignee];
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');
  
  return (
    <div className="flex-1 min-w-[280px]">
      {/* Header */}
      <div className={`p-4 rounded-t-2xl bg-gradient-to-r ${config.color}`}>
        <div className="flex items-center gap-2">
          {assignee === 'shared' ? (
            <Users size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-white" />
          )}
          <h3 className="font-bold text-white">{title}</h3>
        </div>
        <p className="text-white/70 text-sm mt-1">
          {todoTasks.length} to do • {doneTasks.length} done
        </p>
      </div>
      
      {/* Content */}
      <div className="border border-t-0 border-[var(--color-border)] rounded-b-2xl p-4 space-y-6 min-h-[400px] bg-[var(--color-card)]">
        {/* To Do */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Circle size={14} className="text-[var(--color-muted)]" />
            <span className="text-sm font-medium text-[var(--color-muted)]">To Do</span>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {todoTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggle={() => onToggle(task.id)}
                  onDelete={() => onDelete(task.id)}
                />
              ))}
            </AnimatePresence>
            {todoTasks.length === 0 && (
              <p className="text-sm text-[var(--color-muted)] text-center py-4 opacity-50">
                No tasks
              </p>
            )}
          </div>
        </div>
        
        {/* Done */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-[var(--color-accent)]" />
            <span className="text-sm font-medium text-[var(--color-muted)]">Done</span>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            <AnimatePresence>
              {doneTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onToggle={() => onToggle(task.id)}
                  onDelete={() => onDelete(task.id)}
                />
              ))}
            </AnimatePresence>
            {doneTasks.length === 0 && (
              <p className="text-sm text-[var(--color-muted)] text-center py-4 opacity-50">
                Nothing yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: 'bot1' as 'bot1' | 'bot2' | 'shared',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: t.status === 'todo' ? 'done' : 'todo' } : t
    ));
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
    setNewTask({ title: '', description: '', assignee: 'bot1', priority: 'medium' });
    setShowAddModal(false);
  };

  const bot1Tasks = tasks.filter(t => t.assignee === 'bot1');
  const bot2Tasks = tasks.filter(t => t.assignee === 'bot2');
  const sharedTasks = tasks.filter(t => t.assignee === 'shared');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-[var(--color-muted)] mt-1">
            {tasks.filter(t => t.status === 'todo').length} active • {tasks.filter(t => t.status === 'done').length} completed
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/80 text-black px-4 py-2 rounded-xl font-medium transition-all"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Venn-style Layout */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        <TaskColumn 
          title="Vantix Bot #1" 
          tasks={bot1Tasks} 
          assignee="bot1"
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
        <TaskColumn 
          title="Together" 
          tasks={sharedTasks} 
          assignee="shared"
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
        <TaskColumn 
          title="Vantix Bot #2" 
          tasks={bot2Tasks} 
          assignee="bot2"
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </div>

      {/* Venn Diagram Visual */}
      <div className="flex justify-center py-8">
        <div className="relative w-[400px] h-[200px]">
          {/* Bot 1 Circle */}
          <div className="absolute left-0 top-0 w-[200px] h-[200px] rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-start pl-8">
            <div className="text-center">
              <Bot size={24} className="text-emerald-400 mx-auto mb-1" />
              <p className="text-xs text-emerald-400 font-medium">Bot #1</p>
              <p className="text-2xl font-bold text-emerald-400">{bot1Tasks.filter(t => t.status === 'todo').length}</p>
            </div>
          </div>
          
          {/* Bot 2 Circle */}
          <div className="absolute right-0 top-0 w-[200px] h-[200px] rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 flex items-center justify-end pr-8">
            <div className="text-center">
              <Bot size={24} className="text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-blue-400 font-medium">Bot #2</p>
              <p className="text-2xl font-bold text-blue-400">{bot2Tasks.filter(t => t.status === 'todo').length}</p>
            </div>
          </div>
          
          {/* Overlap / Shared */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/50 flex items-center justify-center z-10">
            <div className="text-center">
              <Users size={20} className="text-purple-400 mx-auto mb-1" />
              <p className="text-2xl font-bold text-purple-400">{sharedTasks.filter(t => t.status === 'todo').length}</p>
            </div>
          </div>
        </div>
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
                  <label className="block text-sm font-medium mb-2 text-[var(--color-muted)]">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    placeholder="Task title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-muted)]">Description</label>
                  <input
                    type="text"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-muted)]">Assign To</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['bot1', 'bot2', 'shared'] as const).map((assignee) => {
                      const config = assigneeConfig[assignee];
                      return (
                        <button
                          key={assignee}
                          onClick={() => setNewTask({ ...newTask, assignee })}
                          className={`p-3 rounded-xl border transition-all ${
                            newTask.assignee === assignee 
                              ? `${config.borderColor} ${config.bgColor}` 
                              : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {assignee === 'shared' ? (
                              <Users size={18} className={newTask.assignee === assignee ? config.textColor : 'text-[var(--color-muted)]'} />
                            ) : (
                              <Bot size={18} className={newTask.assignee === assignee ? config.textColor : 'text-[var(--color-muted)]'} />
                            )}
                            <span className={`text-xs ${newTask.assignee === assignee ? config.textColor : 'text-[var(--color-muted)]'}`}>
                              {assignee === 'bot1' ? 'Bot #1' : assignee === 'bot2' ? 'Bot #2' : 'Both'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--color-muted)]">Priority</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => {
                      const config = priorityConfig[priority];
                      return (
                        <button
                          key={priority}
                          onClick={() => setNewTask({ ...newTask, priority })}
                          className={`p-2 rounded-xl border transition-all capitalize ${
                            newTask.priority === priority 
                              ? `border-[var(--color-accent)] ${config.bg}` 
                              : 'border-[var(--color-border)] hover:border-[var(--color-muted)]'
                          }`}
                        >
                          <span className={newTask.priority === priority ? config.color : 'text-[var(--color-muted)]'}>
                            {priority}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={addTask}
                  disabled={!newTask.title.trim()}
                  className="w-full bg-[var(--color-accent)] text-black py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-accent)]/80"
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
