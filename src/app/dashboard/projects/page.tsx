'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  Filter,
  Search,
  X,
  Calendar,
  DollarSign,
  Clock,
  User,
  Bot,
  FileText,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Folder,
  ChevronRight,
  MoreHorizontal,
  Sparkles,
  Zap,
  Users,
  ArrowRight,
} from 'lucide-react'

// Types
type ProjectStatus = 'LEAD' | 'PROPOSAL' | 'ACTIVE' | 'REVIEW' | 'COMPLETE'
type HealthStatus = 'healthy' | 'warning' | 'critical'
type Assignee = 'botskii' | 'vantix-bot' | 'aidan' | 'kyle' | 'together'

interface Task {
  id: string
  title: string
  completed: boolean
  assignee?: Assignee
}

interface Activity {
  id: string
  type: 'status_change' | 'comment' | 'task_complete' | 'file_upload' | 'assignment'
  content: string
  timestamp: Date
  actor: string
}

interface ProjectFile {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: Date
}

interface Project {
  id: string
  name: string
  client: string
  status: ProjectStatus
  health: HealthStatus
  progress: number
  budgetSpent: number
  budgetTotal: number
  deadline: Date
  assignee: Assignee
  description: string
  tasks: Task[]
  activities: Activity[]
  files: ProjectFile[]
  notes: string
  createdAt: Date
}

// Assignee configuration
const assigneeConfig: Record<Assignee, { name: string; icon: 'bot' | 'user'; color: string; avatar: string }> = {
  'botskii': { name: 'Botskii', icon: 'bot', color: 'from-purple-500 to-pink-500', avatar: '🤖' },
  'vantix-bot': { name: 'Vantix Bot', icon: 'bot', color: 'from-cyan-500 to-blue-500', avatar: '⚡' },
  'together': { name: 'Together', icon: 'bot', color: 'from-green-500 to-emerald-500', avatar: '🤝' },
  'aidan': { name: 'Aidan', icon: 'user', color: 'from-orange-500 to-amber-500', avatar: '👤' },
  'kyle': { name: 'Kyle', icon: 'user', color: 'from-red-500 to-rose-500', avatar: '👨' },
}

const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  'LEAD': { label: 'Lead', color: 'text-slate-400', bgColor: 'bg-slate-500/20' },
  'PROPOSAL': { label: 'Proposal', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  'ACTIVE': { label: 'Active', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  'REVIEW': { label: 'Review', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  'COMPLETE': { label: 'Complete', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
}

const healthConfig: Record<HealthStatus, { icon: string; color: string; label: string }> = {
  'healthy': { icon: '🟢', color: 'text-green-400', label: 'On Track' },
  'warning': { icon: '🟡', color: 'text-yellow-400', label: 'At Risk' },
  'critical': { icon: '🔴', color: 'text-red-400', label: 'Critical' },
}

// Real Vantix Projects
const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Dave App',
    client: 'Secured Tampa (Dave)',
    status: 'REVIEW',
    health: 'healthy',
    progress: 90,
    budgetSpent: 4000,
    budgetTotal: 4500,
    deadline: new Date('2026-02-28'),
    assignee: 'together',
    description: 'E-commerce/retail application for Secured Tampa. Almost complete, in final review stage.',
    tasks: [
      { id: 't1', title: 'Core app development', completed: true, assignee: 'together' },
      { id: 't2', title: 'UI/UX implementation', completed: true, assignee: 'together' },
      { id: 't3', title: 'Backend integration', completed: true, assignee: 'botskii' },
      { id: 't4', title: 'Final review & testing', completed: false, assignee: 'together' },
    ],
    activities: [
      { id: 'a1', type: 'status_change', content: 'Moved to Review - 90% complete', timestamp: new Date('2026-02-10'), actor: 'Together' },
      { id: 'a2', type: 'task_complete', content: 'Backend integration completed', timestamp: new Date('2026-02-08'), actor: 'Botskii' },
    ],
    files: [],
    notes: 'Dave has paid $2,000. $500 outstanding. Almost done!',
    createdAt: new Date('2025-01-01'),
  },
  {
    id: '2',
    name: 'CardLedger V2',
    client: 'CardLedger (Internal)',
    status: 'ACTIVE',
    health: 'warning',
    progress: 65,
    budgetSpent: 0,
    budgetTotal: 0,
    deadline: new Date('2026-04-01'),
    assignee: 'botskii',
    description: 'Internal fintech project - sports card portfolio and collectibles tracking platform. Version 2 development.',
    tasks: [
      { id: 't5', title: 'V2 architecture planning', completed: true, assignee: 'botskii' },
      { id: 't6', title: 'Database redesign', completed: true, assignee: 'botskii' },
      { id: 't7', title: 'New dashboard UI', completed: false, assignee: 'botskii' },
      { id: 't8', title: 'API improvements', completed: false, assignee: 'botskii' },
    ],
    activities: [
      { id: 'a3', type: 'comment', content: 'V2 development ongoing - needs attention', timestamp: new Date('2026-02-11'), actor: 'Botskii' },
    ],
    files: [],
    notes: 'Internal project. Website: usecardledger.com',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: '3',
    name: 'J4K Platform Maintenance',
    client: 'Just Four Kicks (Kyle)',
    status: 'ACTIVE',
    health: 'healthy',
    progress: 100,
    budgetSpent: 0,
    budgetTotal: 0,
    deadline: new Date('2026-12-31'),
    assignee: 'vantix-bot',
    description: 'Ongoing platform maintenance and support for J4K B2B wholesale sneaker business.',
    tasks: [
      { id: 't9', title: 'Platform monitoring', completed: true, assignee: 'vantix-bot' },
      { id: 't10', title: 'Bug fixes as needed', completed: true, assignee: 'vantix-bot' },
    ],
    activities: [
      { id: 'a4', type: 'status_change', content: 'Partnership started', timestamp: new Date('2026-01-15'), actor: 'Aidan' },
    ],
    files: [],
    notes: 'Ongoing partnership with Kyle. Website: justfourkicks.store',
    createdAt: new Date('2025-01-15'),
  },
]

// Sortable Project Card Component
function SortableProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const assignee = assigneeConfig[project.assignee]
  const health = healthConfig[project.health]
  const daysUntilDeadline = Math.ceil((project.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group cursor-grab active:cursor-grabbing"
      onClick={onClick}
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
              {project.name}
            </h3>
            <p className="text-sm text-slate-400 truncate">{project.client}</p>
          </div>
          <span className="text-lg ml-2" title={health.label}>{health.icon}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                project.progress >= 80 ? 'from-green-500 to-emerald-500' :
                project.progress >= 50 ? 'from-blue-500 to-cyan-500' :
                project.progress >= 25 ? 'from-amber-500 to-yellow-500' :
                'from-red-500 to-orange-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <DollarSign className="w-3 h-3" />
          <span>${project.budgetSpent.toLocaleString()} / ${project.budgetTotal.toLocaleString()}</span>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-xs mb-3">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span className={
            daysUntilDeadline < 0 ? 'text-red-400' :
            daysUntilDeadline <= 7 ? 'text-amber-400' :
            'text-slate-400'
          }>
            {daysUntilDeadline < 0 
              ? `${Math.abs(daysUntilDeadline)} days overdue`
              : daysUntilDeadline === 0 
                ? 'Due today'
                : `${daysUntilDeadline} days left`
            }
          </span>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${assignee.color} flex items-center justify-center text-sm`}>
            {assignee.avatar}
          </div>
          <span className="text-sm text-slate-300">{assignee.name}</span>
          {assignee.icon === 'bot' && (
            <Bot className="w-3 h-3 text-purple-400 ml-auto" />
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Project Card for Drag Overlay
function ProjectCard({ project }: { project: Project }) {
  const assignee = assigneeConfig[project.assignee]
  const health = healthConfig[project.health]

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-purple-500/50 rounded-xl p-4 shadow-xl shadow-purple-500/20 w-[280px]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{project.name}</h3>
          <p className="text-sm text-slate-400 truncate">{project.client}</p>
        </div>
        <span className="text-lg ml-2">{health.icon}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          style={{ width: `${project.progress}%` }}
        />
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${assignee.color} flex items-center justify-center text-xs`}>
          {assignee.avatar}
        </div>
        <span className="text-sm text-slate-300">{assignee.name}</span>
      </div>
    </div>
  )
}

// Kanban Column Component
function KanbanColumn({ 
  status, 
  projects, 
  onProjectClick 
}: { 
  status: ProjectStatus
  projects: Project[]
  onProjectClick: (project: Project) => void
}) {
  const config = statusConfig[status]
  
  return (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      {/* Column Header */}
      <div className={`${config.bgColor} backdrop-blur-xl border border-white/10 rounded-xl p-3 mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${config.color}`}>{config.label}</span>
            <span className="text-xs text-slate-500 bg-white/10 px-2 py-0.5 rounded-full">
              {projects.length}
            </span>
          </div>
          <button className="p-1 hover:bg-white/10 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          <AnimatePresence mode="popLayout">
            {projects.map((project) => (
              <SortableProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => onProjectClick(project)}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  )
}

// Slide-over Panel Component
function ProjectSlideOver({ 
  project, 
  onClose,
  onStatusChange,
  onAssigneeChange,
}: { 
  project: Project
  onClose: () => void
  onStatusChange: (status: ProjectStatus) => void
  onAssigneeChange: (assignee: Assignee) => void
}) {
  const [activeTab, setActiveTab] = useState<'details' | 'tasks' | 'activity' | 'files'>('details')
  const assignee = assigneeConfig[project.assignee]
  const health = healthConfig[project.health]
  const daysUntilDeadline = Math.ceil((project.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-50 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{health.icon}</span>
                <h2 className="text-xl font-bold text-white">{project.name}</h2>
              </div>
              <p className="text-slate-400">{project.client}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{project.progress}%</p>
              <p className="text-xs text-slate-400">Complete</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">
                ${(project.budgetTotal - project.budgetSpent).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400">Remaining</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <p className={`text-2xl font-bold ${
                daysUntilDeadline < 0 ? 'text-red-400' :
                daysUntilDeadline <= 7 ? 'text-amber-400' :
                'text-blue-400'
              }`}>
                {Math.abs(daysUntilDeadline)}
              </p>
              <p className="text-xs text-slate-400">
                {daysUntilDeadline < 0 ? 'Days Over' : 'Days Left'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-b border-white/10 flex gap-3">
          {/* Status Dropdown */}
          <select
            value={project.status}
            onChange={(e) => onStatusChange(e.target.value as ProjectStatus)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key} className="bg-slate-900">
                {config.label}
              </option>
            ))}
          </select>

          {/* Assignee Dropdown */}
          <select
            value={project.assignee}
            onChange={(e) => onAssigneeChange(e.target.value as Assignee)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
          >
            {Object.entries(assigneeConfig).map(([key, config]) => (
              <option key={key} value={key} className="bg-slate-900">
                {config.avatar} {config.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="flex gap-1">
            {[
              { id: 'details', label: 'Details', icon: FileText },
              { id: 'tasks', label: 'Tasks', icon: CheckCircle2 },
              { id: 'activity', label: 'Activity', icon: Clock },
              { id: 'files', label: 'Files', icon: Folder },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Description</h3>
                <p className="text-white">{project.description}</p>
              </div>

              {/* Assignee */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Assigned To</h3>
                <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${assignee.color} flex items-center justify-center text-lg`}>
                    {assignee.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium">{assignee.name}</p>
                    <p className="text-xs text-slate-400">
                      {assignee.icon === 'bot' ? 'AI Assistant' : 'Team Member'}
                    </p>
                  </div>
                  {assignee.icon === 'bot' && (
                    <Bot className="w-5 h-5 text-purple-400 ml-auto" />
                  )}
                </div>
              </div>

              {/* Budget Breakdown */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Budget</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-400">Spent</span>
                    <span className="text-white">${project.budgetSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-slate-400">Total</span>
                    <span className="text-white">${project.budgetTotal.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${
                        (project.budgetSpent / project.budgetTotal) > 0.9
                          ? 'bg-gradient-to-r from-red-500 to-orange-500'
                          : 'bg-gradient-to-r from-emerald-500 to-green-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(project.budgetSpent / project.budgetTotal) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2 text-right">
                    {Math.round((project.budgetSpent / project.budgetTotal) * 100)}% used
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Notes</h3>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white">{project.notes || 'No notes yet.'}</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Timeline</h3>
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Created</span>
                    <span className="text-white">{project.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Deadline</span>
                    <span className={
                      daysUntilDeadline < 0 ? 'text-red-400' :
                      daysUntilDeadline <= 7 ? 'text-amber-400' :
                      'text-white'
                    }>
                      {project.deadline.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {project.tasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No tasks yet</p>
                </div>
              ) : (
                project.tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      task.completed ? 'bg-emerald-500/10' : 'bg-white/5'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'border-emerald-500 bg-emerald-500' 
                        : 'border-slate-500'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`flex-1 ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                      {task.title}
                    </span>
                    {task.assignee && (
                      <span className="text-xs text-slate-400">
                        {assigneeConfig[task.assignee].avatar}
                      </span>
                    )}
                  </motion.div>
                ))
              )}
              <button className="w-full p-3 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              {project.activities.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No activity yet</p>
                </div>
              ) : (
                project.activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'task_complete' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-blue-400" />}
                      {activity.type === 'status_change' && <ArrowRight className="w-4 h-4 text-purple-400" />}
                      {activity.type === 'file_upload' && <Folder className="w-4 h-4 text-amber-400" />}
                      {activity.type === 'assignment' && <User className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.content}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.actor} • {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-3">
              {project.files.length === 0 ? (
                <div className="text-center py-12">
                  <Folder className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No files yet</p>
                </div>
              ) : (
                project.files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.size}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </motion.div>
                ))
              )}
              <button className="w-full p-3 border border-dashed border-white/20 rounded-lg text-slate-400 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Upload File
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

// Add Project Modal
function AddProjectModal({ onClose, onAdd }: { onClose: () => void; onAdd: (project: Partial<Project>) => void }) {
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [budget, setBudget] = useState('')
  const [assignee, setAssignee] = useState<Assignee>('botskii')
  const [deadline, setDeadline] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      name,
      client,
      budgetTotal: parseFloat(budget) || 0,
      assignee,
      deadline: new Date(deadline),
    })
    onClose()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div 
          className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">New Project</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Client</label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                placeholder="Client name"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Budget</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                placeholder="$0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Assign To</label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(assigneeConfig).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAssignee(key as Assignee)}
                    className={`p-2 rounded-lg border transition-all ${
                      assignee === key
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    title={config.name}
                  >
                    <span className="text-xl">{config.avatar}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium py-2.5 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Create Project
            </button>
          </form>
        </div>
      </motion.div>
    </>
  )
}

// Main Page Component
export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterAssignee, setFilterAssignee] = useState<Assignee | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesAssignee = filterAssignee === 'all' || project.assignee === filterAssignee
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesAssignee && matchesSearch
  })

  // Group by status
  const projectsByStatus = {
    LEAD: filteredProjects.filter((p) => p.status === 'LEAD'),
    PROPOSAL: filteredProjects.filter((p) => p.status === 'PROPOSAL'),
    ACTIVE: filteredProjects.filter((p) => p.status === 'ACTIVE'),
    REVIEW: filteredProjects.filter((p) => p.status === 'REVIEW'),
    COMPLETE: filteredProjects.filter((p) => p.status === 'COMPLETE'),
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeProject = projects.find((p) => p.id === active.id)
    const overProject = projects.find((p) => p.id === over.id)

    if (!activeProject) return

    // If dropped on another project, swap positions and potentially change status
    if (overProject && activeProject.id !== overProject.id) {
      setProjects((prev) => {
        const oldIndex = prev.findIndex((p) => p.id === active.id)
        const newIndex = prev.findIndex((p) => p.id === over.id)
        
        const newProjects = arrayMove(prev, oldIndex, newIndex)
        
        // Update status if moved to different column
        if (activeProject.status !== overProject.status) {
          return newProjects.map((p) =>
            p.id === active.id ? { ...p, status: overProject.status } : p
          )
        }
        
        return newProjects
      })
    }
  }

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    )
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  const handleAssigneeChange = (projectId: string, newAssignee: Assignee) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, assignee: newAssignee } : p))
    )
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => prev ? { ...prev, assignee: newAssignee } : null)
    }
  }

  const handleAddProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      name: projectData.name || 'New Project',
      client: projectData.client || 'Unknown Client',
      status: 'LEAD',
      health: 'healthy',
      progress: 0,
      budgetSpent: 0,
      budgetTotal: projectData.budgetTotal || 0,
      deadline: projectData.deadline || new Date(),
      assignee: projectData.assignee || 'botskii',
      description: '',
      tasks: [],
      activities: [],
      files: [],
      notes: '',
      createdAt: new Date(),
    }
    setProjects((prev) => [newProject, ...prev])
  }

  const activeProject = activeId ? projects.find((p) => p.id === activeId) : null

  // Stats
  const stats = {
    total: filteredProjects.length,
    active: filteredProjects.filter((p) => p.status === 'ACTIVE').length,
    atRisk: filteredProjects.filter((p) => p.health !== 'healthy').length,
    botAssigned: filteredProjects.filter((p) => 
      assigneeConfig[p.assignee].icon === 'bot'
    ).length,
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
            <p className="text-slate-400">Manage and track all your projects</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-5 py-2.5 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Folder className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-xs text-slate-400">Total Projects</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
                <p className="text-xs text-slate-400">Active</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.atRisk}</p>
                <p className="text-xs text-slate-400">At Risk</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.botAssigned}</p>
                <p className="text-xs text-slate-400">Bot Assigned</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setFilterAssignee('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterAssignee === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-1" />
              All
            </button>
            {Object.entries(assigneeConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setFilterAssignee(key as Assignee)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                  filterAssignee === key
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={config.name}
              >
                <span>{config.avatar}</span>
                <span className="hidden sm:inline">{config.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {filteredProjects.length === 0 && !searchQuery && filterAssignee === 'all' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
            <Folder className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-slate-400 max-w-md mb-6">
            Create your first project to start tracking work, managing tasks, and collaborating with your team.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-5 h-5" />
            Create Your First Project
          </button>
        </motion.div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {(['LEAD', 'PROPOSAL', 'ACTIVE', 'REVIEW', 'COMPLETE'] as ProjectStatus[]).map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                projects={projectsByStatus[status]}
                onProjectClick={setSelectedProject}
              />
            ))}
          </div>

          <DragOverlay>
            {activeProject && <ProjectCard project={activeProject} />}
          </DragOverlay>
        </DndContext>
      )}

      {/* Slide-over Panel */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectSlideOver
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            onStatusChange={(status) => handleStatusChange(selectedProject.id, status)}
            onAssigneeChange={(assignee) => handleAssigneeChange(selectedProject.id, assignee)}
          />
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddProjectModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddProject}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
