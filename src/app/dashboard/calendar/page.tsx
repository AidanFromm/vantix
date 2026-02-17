'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  User,
  Tag,
  FileText,
  Trash2,
  Edit3,
  Check,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  client_id: string | null;
  type: 'consultation' | 'meeting' | 'deadline' | 'follow-up';
  notes: string;
  created_at: string;
}

interface ClientOption {
  id: string;
  name: string;
}

type ViewMode = 'month' | 'week';

const EVENT_TYPES = ['consultation', 'meeting', 'deadline', 'follow-up'] as const;

const EVENT_COLORS: Record<string, string> = {
  consultation: '#B8895A',
  meeting: '#7B9E6B',
  deadline: '#C75B5B',
  'follow-up': '#6B8EB8',
};

// ============================================
// HELPERS
// ============================================
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatTime(time: string) {
  if (!time) return '';
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ============================================
// SUPABASE QUERIES
// ============================================
async function fetchEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('start_time', { ascending: true });
    if (error) throw error;
    return (data as CalendarEvent[]) || [];
  } catch {
    return [];
  }
}

async function fetchClients(): Promise<ClientOption[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('id, name')
      .order('name');
    if (error) throw error;
    return (data as ClientOption[]) || [];
  } catch {
    return [];
  }
}

async function saveEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data as CalendarEvent;
  } catch {
    return null;
  }
}

async function updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as CalendarEvent;
  } catch {
    return null;
  }
}

async function deleteEvent(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch {
    return false;
  }
}

// ============================================
// WOOD BUTTON COMPONENT
// ============================================
function WoodButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md';
  type?: 'button' | 'submit';
}) {
  const base =
    variant === 'danger'
      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
      : variant === 'secondary'
      ? 'bg-white text-[#2D2A26] border border-gray-200 hover:bg-gray-50'
      : 'text-[#5C4033] font-semibold';

  const woodBg =
    variant === 'primary'
      ? {
          background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139,90,43,0.04) 2px, rgba(139,90,43,0.04) 4px), linear-gradient(135deg, #E8CFA0 0%, #D4B07C 30%, #C9A06E 50%, #DDB98A 70%, #E8CFA0 100%)`,
        }
      : {};

  const shadow =
    variant === 'primary'
      ? 'shadow-[4px_4px_10px_#c8c4be,-4px_-4px_10px_#ffffff] hover:shadow-[inset_2px_2px_4px_#b8965f,inset_-2px_-2px_4px_#e8d4a8]'
      : '';

  const pad = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-5 py-2.5 text-sm';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl transition-all duration-200 ${base} ${shadow} ${pad} ${className}`}
      style={woodBg}
    >
      {children}
    </button>
  );
}

// ============================================
// EVENT FORM MODAL
// ============================================
function EventFormModal({
  isOpen,
  onClose,
  onSave,
  initialDate,
  editEvent,
  clients,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<CalendarEvent>) => void;
  initialDate: string;
  editEvent: CalendarEvent | null;
  clients: ClientOption[];
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [clientId, setClientId] = useState<string>('');
  const [eventType, setEventType] = useState<CalendarEvent['type']>('meeting');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setDate(editEvent.date);
      setStartTime(editEvent.start_time || '09:00');
      setEndTime(editEvent.end_time || '10:00');
      setClientId(editEvent.client_id || '');
      setEventType(editEvent.type);
      setNotes(editEvent.notes || '');
    } else {
      setTitle('');
      setDate(initialDate);
      setStartTime('09:00');
      setEndTime('10:00');
      setClientId('');
      setEventType('meeting');
      setNotes('');
    }
  }, [editEvent, initialDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      ...(editEvent ? { id: editEvent.id } : {}),
      title: title.trim(),
      date,
      start_time: startTime,
      end_time: endTime,
      client_id: clientId || null,
      type: eventType,
      notes: notes.trim(),
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            style={{
              boxShadow: '8px 8px 20px #c8c4be, -8px -8px 20px #ffffff',
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#2D2A26]">
                {editEvent ? 'Edit Event' : 'New Event'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Event title"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[#2D2A26] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B8895A]/40 focus:border-[#B8895A] transition-all"
                />
              </div>

              {/* Date + Time Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/40 focus:border-[#B8895A] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">Start</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/40 focus:border-[#B8895A] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">End</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/40 focus:border-[#B8895A] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Type + Client Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as CalendarEvent['type'])}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/40 focus:border-[#B8895A] transition-all text-sm"
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2A26] mb-1">Client</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[#2D2A26] focus:outline-none focus:ring-2 focus:ring-[#B8895A]/40 focus:border-[#B8895A] transition-all text-sm"
                  >
                    <option value="">No client</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#2D2A26] mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-[#FAFAFA] text-[#2D2A26] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B8895A]/40 focus:border-[#B8895A] transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <WoodButton variant="secondary" onClick={onClose}>
                  Cancel
                </WoodButton>
                <WoodButton type="submit">
                  <Check size={16} />
                  {editEvent ? 'Update' : 'Create'}
                </WoodButton>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// MAIN CALENDAR PAGE
// ============================================
export default function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(
    formatDate(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  // Load events for current view
  const loadEvents = useCallback(async () => {
    setLoading(true);
    const startDate = formatDate(currentYear, currentMonth, 1);
    const endDate = formatDate(currentYear, currentMonth, getDaysInMonth(currentYear, currentMonth));
    const data = await fetchEvents(startDate, endDate);
    setEvents(data);
    setLoading(false);
  }, [currentYear, currentMonth]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    fetchClients().then(setClients);
  }, []);

  // Navigation
  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Events for selected date
  const selectedDayEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate),
    [events, selectedDate]
  );

  // Events grouped by date for calendar dots
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  // Save handler
  const handleSave = async (eventData: Partial<CalendarEvent>) => {
    if (editingEvent && eventData.id) {
      const { id, ...updates } = eventData;
      await updateEvent(id, updates);
    } else {
      await saveEvent(eventData);
    }
    setModalOpen(false);
    setEditingEvent(null);
    loadEvents();
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    loadEvents();
  };

  // Open create modal for a specific day
  const openCreateForDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setEditingEvent(null);
    setModalOpen(true);
  };

  // Open edit modal
  const openEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  // ============================================
  // CALENDAR GRID (MONTH)
  // ============================================
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Previous month days to fill the grid
  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );

  const calendarCells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarCells.push({ day: d, dateStr: formatDate(y, m, d), isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, dateStr: formatDate(currentYear, currentMonth, d), isCurrentMonth: true });
  }

  // Next month leading days
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    calendarCells.push({ day: d, dateStr: formatDate(y, m, d), isCurrentMonth: false });
  }

  // ============================================
  // WEEK VIEW
  // ============================================
  const getWeekDays = () => {
    const sel = new Date(selectedDate + 'T00:00:00');
    const dayOfWeek = sel.getDay();
    const weekStart = new Date(sel);
    weekStart.setDate(sel.getDate() - dayOfWeek);
    const days: { day: number; dateStr: string; dayName: string; monthName: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push({
        day: d.getDate(),
        dateStr: formatDate(d.getFullYear(), d.getMonth(), d.getDate()),
        dayName: DAY_NAMES[d.getDay()],
        monthName: MONTH_NAMES[d.getMonth()].slice(0, 3),
      });
    }
    return days;
  };

  const weekDays = viewMode === 'week' ? getWeekDays() : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, #E8CFA0, #C9A06E)`,
              boxShadow: '3px 3px 8px #c8c4be, -3px -3px 8px #ffffff',
            }}
          >
            <CalendarIcon size={22} className="text-[#5C4033]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#2D2A26]">Calendar</h1>
            <p className="text-sm text-gray-500">Schedule and manage appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            {(['month', 'week'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-[#B8895A] text-white'
                    : 'bg-white text-[#2D2A26] hover:bg-gray-50'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <WoodButton variant="secondary" onClick={goToToday}>
            Today
          </WoodButton>

          <WoodButton onClick={() => openCreateForDate(selectedDate)}>
            <Plus size={16} />
            New Event
          </WoodButton>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '6px 6px 16px #d1cdc7, -6px -6px 16px #ffffff' }}
          >
            {/* Month/Year Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#2D2A26] transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-[#2D2A26]">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-[#2D2A26] transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {viewMode === 'month' ? (
              /* MONTH VIEW */
              <div className="p-3 md:p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, i) => {
                    const isToday = cell.dateStr === todayStr;
                    const isSelected = cell.dateStr === selectedDate;
                    const dayEvents = eventsByDate[cell.dateStr] || [];

                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDate(cell.dateStr)}
                        onDoubleClick={() => openCreateForDate(cell.dateStr)}
                        className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all ${
                          !cell.isCurrentMonth
                            ? 'text-gray-300'
                            : isSelected
                            ? 'bg-[#B8895A]/10 text-[#2D2A26] font-bold'
                            : 'text-[#2D2A26] hover:bg-gray-50'
                        } ${isToday ? 'ring-2 ring-[#B8895A] ring-offset-1' : ''}`}
                      >
                        <span className="text-xs md:text-sm">{cell.day}</span>
                        {/* Event dots */}
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 3).map((ev, j) => (
                              <div
                                key={j}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: EVENT_COLORS[ev.type] || '#B8895A' }}
                              />
                            ))}
                            {dayEvents.length > 3 && (
                              <span className="text-[8px] text-gray-400 leading-none">+</span>
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* WEEK VIEW */
              <div className="p-3 md:p-4">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map((wd) => {
                    const isToday = wd.dateStr === todayStr;
                    const isSelected = wd.dateStr === selectedDate;
                    const dayEvents = eventsByDate[wd.dateStr] || [];

                    return (
                      <div key={wd.dateStr} className="flex flex-col">
                        <button
                          onClick={() => setSelectedDate(wd.dateStr)}
                          onDoubleClick={() => openCreateForDate(wd.dateStr)}
                          className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                            isSelected
                              ? 'bg-[#B8895A]/10'
                              : 'hover:bg-gray-50'
                          } ${isToday ? 'ring-2 ring-[#B8895A]' : ''}`}
                        >
                          <span className="text-xs text-gray-400 font-medium">{wd.dayName}</span>
                          <span className="text-lg font-bold text-[#2D2A26]">{wd.day}</span>
                          <span className="text-[10px] text-gray-400">{wd.monthName}</span>
                        </button>

                        {/* Events list for this day */}
                        <div className="mt-2 space-y-1 min-h-[80px]">
                          {dayEvents.map((ev) => (
                            <button
                              key={ev.id}
                              onClick={() => openEdit(ev)}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium truncate transition-all hover:opacity-80"
                              style={{
                                backgroundColor: EVENT_COLORS[ev.type] + '18',
                                color: EVENT_COLORS[ev.type],
                                borderLeft: `3px solid ${EVENT_COLORS[ev.type]}`,
                              }}
                            >
                              <div className="truncate">{ev.title}</div>
                              <div className="text-[10px] opacity-70">
                                {formatTime(ev.start_time)}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar: Selected Day Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-80 xl:w-96"
        >
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '6px 6px 16px #d1cdc7, -6px -6px 16px #ffffff' }}
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#2D2A26]">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h3>
                <p className="text-xs text-gray-400">
                  {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => openCreateForDate(selectedDate)}
                className="p-2 rounded-xl bg-[#B8895A]/10 text-[#B8895A] hover:bg-[#B8895A]/20 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-[#B8895A]/30 border-t-[#B8895A] rounded-full"
                  />
                </div>
              ) : selectedDayEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon size={36} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-gray-400 mb-1">No events scheduled</p>
                  <p className="text-xs text-gray-300">Double-click a day to add one</p>
                </div>
              ) : (
                <AnimatePresence>
                  {selectedDayEvents.map((ev, i) => {
                    const clientName = clients.find((c) => c.id === ev.client_id)?.name;
                    return (
                      <motion.div
                        key={ev.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all group"
                        style={{
                          borderLeft: `4px solid ${EVENT_COLORS[ev.type]}`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[#2D2A26] text-sm truncate">
                              {ev.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {formatTime(ev.start_time)} - {formatTime(ev.end_time)}
                              </span>
                            </div>
                            {clientName && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                <User size={12} />
                                {clientName}
                              </div>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                style={{
                                  backgroundColor: EVENT_COLORS[ev.type] + '18',
                                  color: EVENT_COLORS[ev.type],
                                }}
                              >
                                <Tag size={10} />
                                {ev.type}
                              </span>
                            </div>
                            {ev.notes && (
                              <p className="mt-2 text-xs text-gray-400 flex items-start gap-1">
                                <FileText size={12} className="flex-shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{ev.notes}</span>
                              </p>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(ev)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#B8895A] transition-colors"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(ev.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSave}
        initialDate={selectedDate}
        editEvent={editingEvent}
        clients={clients}
      />
    </div>
  );
}
