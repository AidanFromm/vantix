'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  Plus, ListTodo, LayoutGrid, Check, ChevronDown, X,
  Circle, Clock, CheckCircle2, AlertTriangle, Flag,
  Calendar, User, Search, MoreHorizontal, GripVertical,
  Edit3, Trash2, Users
} from 'lucide-react'
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data'

interface Task {
  id: string
  title: string
  description: string
  project: string
  assignee: string
  priority: 'Low' | 'Medium' | 'High' | 'Urgent'
  status: 'To Do' | 'In Progress' | 'Done'
  dueDate: string
  completed: boolean
}

const SEED_TASKS: Task[] = []

const PRIORITY_COLORS: Record<string, string> = {
  Urgent: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-[#F5E6D3] text-[#B07A45] border-[#E3D9CD]',
  Low: 'bg-gray-100 text-gray-500 border-gray-200',
}

const STATUS_ICONS: Record<string, typeof Circle> = {
  'To Do': Circle,
  'In Progress': Clock,
  'Done': CheckCircle2,
}

const STATUSES = ['To Do', 'In Progress', 'Done'] as const
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const
const ASSIGNEES = ['Kyle', 'Aidan']
const PROJECTS = ['SecuredTampa', 'JFK']

// Tasks loaded via getData from @/lib/data

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [view, setView] = useState<'list' | 'board'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterPriority, setFilterPriority] = useState<string>('All')
  const [filterAssignee, setFilterAssignee] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkMenu, setBulkMenu] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const data = await getData<Task>('tasks')
        setTasks(data)
      } catch { setTasks([]) }
    })()
  }, [])

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filterStatus !== 'All' && t.status !== filterStatus) return false
      if (filterPriority !== 'All' && t.priority !== filterPriority) return false
      if (filterAssignee !== 'All' && t.assignee !== filterAssignee) return false
      if (search && !(t.title || '').toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [tasks, filterStatus, filterPriority, filterAssignee, search])

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const updates = { completed: !task.completed, status: (!task.completed ? 'Done' : 'To Do') as Task['status'] }
    try { await updateRecord('tasks', id, updates) } catch {}
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const bulkComplete = async () => {
    for (const id of selected) { try { await updateRecord('tasks', id, { completed: true, status: 'Done' }) } catch {} }
    setTasks(prev => prev.map(t => selected.has(t.id) ? { ...t, completed: true, status: 'Done' as Task['status'] } : t))
    setSelected(new Set())
    setBulkMenu(false)
  }

  const bulkAssign = async (assignee: string) => {
    for (const id of selected) { try { await updateRecord('tasks', id, { assignee }) } catch {} }
    setTasks(prev => prev.map(t => selected.has(t.id) ? { ...t, assignee } : t))
    setSelected(new Set())
    setBulkMenu(false)
  }

  const deleteTask = async (id: string) => {
    try { await deleteRecord('tasks', id) } catch {}
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const saveTask = async (task: Task) => {
    const exists = tasks.find(t => t.id === task.id)
    if (exists) {
      try { await updateRecord('tasks', task.id, { ...task } as Partial<Task> & Record<string, unknown>) } catch {}
      setTasks(prev => prev.map(t => t.id === task.id ? task : t))
    } else {
      try {
        const created = await createRecord<Task>('tasks', task)
        setTasks(prev => [created, ...prev])
      } catch {
        setTasks(prev => [task, ...prev])
      }
    }
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Tasks</h1>
        <button onClick={() => { setEditingTask(null); setModalOpen(true) }} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {/* View toggle + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex bg-[#EEE6DC] rounded-xl p-1 border border-[#E3D9CD]">
          <button onClick={() => setView('list')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${view === 'list' ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C]'}`}>
            <ListTodo size={14} /> List
          </button>
          <button onClick={() => setView('board')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${view === 'board' ? 'bg-white text-[#1C1C1C] shadow-sm' : 'text-[#7A746C]'}`}>
            <LayoutGrid size={14} /> Board
          </button>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A746C]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="pl-8 pr-3 py-2 text-sm bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-[#1C1C1C] placeholder-[#7A746C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 w-48" />
        </div>

        <FilterDropdown label="Status" value={filterStatus} options={['All', ...STATUSES]} onChange={setFilterStatus} />
        <FilterDropdown label="Priority" value={filterPriority} options={['All', ...PRIORITIES]} onChange={setFilterPriority} />
        <FilterDropdown label="Assignee" value={filterAssignee} options={['All', ...ASSIGNEES]} onChange={setFilterAssignee} />

        {selected.size > 0 && (
          <div className="relative ml-auto">
            <button onClick={() => setBulkMenu(!bulkMenu)} className="flex items-center gap-1.5 px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#4B4B4B]">
              <MoreHorizontal size={14} /> {selected.size} selected
            </button>
            {bulkMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-[#E3D9CD] rounded-xl shadow-lg z-20 py-1 min-w-[180px]">
                <button onClick={bulkComplete} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F4EFE8] text-[#1C1C1C] flex items-center gap-2"><CheckCircle2 size={14} /> Mark Complete</button>
                <div className="border-t border-[#E3D9CD] my-1" />
                {ASSIGNEES.map(a => (
                  <button key={a} onClick={() => bulkAssign(a)} className="w-full text-left px-4 py-2 text-sm hover:bg-[#F4EFE8] text-[#1C1C1C] flex items-center gap-2"><User size={14} /> Assign to {a}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {view === 'list' ? (
        <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-[#7A746C] text-sm">No tasks match your filters</div>
          ) : filtered.map((task, i) => {
            const StatusIcon = STATUS_ICONS[task.status] || Circle
            return (
              <div key={task.id} className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? 'border-t border-[#E3D9CD]' : ''} hover:bg-[#E8DFD3] transition-colors`}>
                <input type="checkbox" checked={selected.has(task.id)} onChange={() => toggleSelect(task.id)} className="accent-[#B07A45] w-4 h-4 flex-shrink-0" />
                <button onClick={() => toggleComplete(task.id)} className="flex-shrink-0">
                  {task.completed ? <CheckCircle2 size={18} className="text-green-600" /> : <StatusIcon size={18} className="text-[#7A746C]" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.completed ? 'line-through text-[#7A746C]' : 'text-[#1C1C1C]'}`}>{task.title}</p>
                  <p className="text-xs text-[#7A746C]">{task.project}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#C89A6A] to-[#B07A45] flex items-center justify-center text-white text-xs font-medium" title={task.assignee || ''}>{(task.assignee || '?')[0]}</div>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                  <span className="text-xs text-[#7A746C] flex items-center gap-1"><Calendar size={12} /> {task.dueDate}</span>
                  <button onClick={() => { setEditingTask(task); setModalOpen(true) }} className="p-1 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C]"><Edit3 size={14} /></button>
                  <button onClick={() => deleteTask(task.id)} className="p-1 rounded-lg hover:bg-red-50 text-[#7A746C] hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {STATUSES.map(status => {
            const statusTasks = filtered.filter(t => t.status === status)
            const StatusIcon = STATUS_ICONS[status]
            return (
              <div key={status} className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <StatusIcon size={16} className="text-[#B07A45]" />
                  <h3 className="text-sm font-semibold text-[#1C1C1C]">{status}</h3>
                  <span className="ml-auto text-xs text-[#7A746C] bg-[#F4EFE8] px-2 py-0.5 rounded-full">{statusTasks.length}</span>
                </div>
                <div className="space-y-2.5">
                  {statusTasks.map(task => (
                    <div key={task.id} onClick={() => { setEditingTask(task); setModalOpen(true) }} className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-xl p-3 cursor-pointer hover:shadow-sm transition-shadow">
                      <p className="text-sm font-medium text-[#1C1C1C] mb-1">{task.title}</p>
                      <p className="text-xs text-[#7A746C] mb-2">{task.project}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#7A746C]">{task.dueDate}</span>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#C89A6A] to-[#B07A45] flex items-center justify-center text-white text-[10px] font-medium">{(task.assignee || '?')[0]}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && <TaskModal task={editingTask} onSave={saveTask} onClose={() => { setModalOpen(false); setEditingTask(null) }} />}
    </div>
  )
}

function FilterDropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#4B4B4B]">
        {label}: {value} <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 bg-white border border-[#E3D9CD] rounded-xl shadow-lg z-20 py-1 min-w-[140px]">
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false) }} className={`w-full text-left px-4 py-1.5 text-sm hover:bg-[#F4EFE8] ${o === value ? 'text-[#B07A45] font-medium' : 'text-[#1C1C1C]'}`}>{o}</button>
          ))}
        </div>
      )}
    </div>
  )
}

function TaskModal({ task, onSave, onClose }: { task: Task | null; onSave: (t: Task) => void; onClose: () => void }) {
  const [form, setForm] = useState<Task>(task || {
    id: Date.now().toString(),
    title: '', description: '', project: 'SecuredTampa', assignee: 'Kyle',
    priority: 'Medium', status: 'To Do', dueDate: new Date().toISOString().slice(0, 10), completed: false,
  })

  const set = (k: keyof Task, v: string | boolean) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#F4EFE8] border border-[#E3D9CD] rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#1C1C1C]">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] focus:outline-none focus:ring-2 focus:ring-[#B07A45]/30 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Project</label>
              <select value={form.project} onChange={e => set('project', e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                {PROJECTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Assignee</label>
              <select value={form.assignee} onChange={e => set('assignee', e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                {ASSIGNEES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                {PRIORITIES.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4B4B4B] mb-1">Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} className="w-full px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#4B4B4B] hover:bg-[#EEE6DC] rounded-xl">Cancel</button>
          <button onClick={() => form.title && onSave(form)} className="px-5 py-2.5 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
