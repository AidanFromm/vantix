'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, X, Clock, User, Tag, FileText, Trash2, Edit3, Check,
} from 'lucide-react';

interface CalendarEvent {
  id: string; title: string; date: string; start_time: string; end_time: string;
  client_id: string | null; type: 'consultation' | 'meeting' | 'deadline' | 'follow-up' | 'subscription' | 'task' | 'invoice';
  notes: string; created_at: string; source?: string;
}
interface ClientOption { id: string; name: string; }
type ViewMode = 'month' | 'week';

function lsGet<T>(key: string, fallback: T[] = []): T[] {
  try { if (typeof window === 'undefined') return fallback; const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; } catch { return fallback; }
}
function lsSet<T>(key: string, data: T[]) {
  try { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data)); } catch {}
}
function generateId(): string { return crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36); }

const EVENT_TYPES = ['consultation', 'meeting', 'deadline', 'follow-up'] as const;
const EVENT_COLORS: Record<string, string> = {
  consultation: '#8E5E34', meeting: '#7B9E6B', deadline: '#C75B5B', 'follow-up': '#6B8EB8',
  subscription: '#8B5CF6', task: '#3B82F6', invoice: '#F97316',
};

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDayOfMonth(y: number, m: number) { return new Date(y, m, 1).getDay(); }
function fmtDate(y: number, m: number, d: number) { return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; }
function fmtTime(t: string) { if (!t) return ''; const [h, m] = t.split(':'); const hour = parseInt(h); return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`; }

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(fmtDate(today.getFullYear(), today.getMonth(), today.getDate()));
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const todayStr = fmtDate(today.getFullYear(), today.getMonth(), today.getDate());

  const generateExtraEvents = useCallback((): CalendarEvent[] => {
    const extra: CalendarEvent[] = [];
    const startDate = fmtDate(currentYear, currentMonth, 1);
    const endDate = fmtDate(currentYear, currentMonth, getDaysInMonth(currentYear, currentMonth));

    // Subscription expenses
    try {
      const subRaw = localStorage.getItem('vantix_subscription_meta');
      const subs = subRaw ? JSON.parse(subRaw) : [];
      for (const sub of subs) {
        if (!sub.next_due_date) continue;
        const due = new Date(sub.next_due_date + 'T00:00:00');
        const increment = sub.billing_cycle === 'monthly' ? 1 : sub.billing_cycle === 'quarterly' ? 3 : 12;
        while (due > new Date(endDate + 'T23:59:59')) due.setMonth(due.getMonth() - increment);
        while (due < new Date(startDate + 'T00:00:00')) due.setMonth(due.getMonth() + increment);
        for (let i = 0; i < 3 && due <= new Date(endDate + 'T23:59:59'); i++) {
          if (due >= new Date(startDate + 'T00:00:00')) {
            const ds = fmtDate(due.getFullYear(), due.getMonth(), due.getDate());
            extra.push({ id: `sub-${sub.expense_id}-${ds}`, title: `${sub.company_name} - $${sub.amount}`, date: ds, start_time: '00:00', end_time: '00:00', client_id: null, type: 'subscription', notes: `${sub.billing_cycle} subscription`, created_at: new Date().toISOString(), source: 'subscription' });
          }
          due.setMonth(due.getMonth() + increment);
        }
      }
    } catch {}

    // Task deadlines
    try {
      const tasks = lsGet<{ id: string; title: string; due_date?: string; column: string }>('vantix_tasks');
      tasks.filter(t => t.due_date && t.column !== 'done' && t.due_date >= startDate && t.due_date <= endDate).forEach(t => {
        extra.push({ id: `task-${t.id}`, title: `Task: ${t.title}`, date: t.due_date!, start_time: '09:00', end_time: '09:30', client_id: null, type: 'task', notes: '', created_at: new Date().toISOString(), source: 'task' });
      });
    } catch {}

    // Invoice due dates
    try {
      const invoices = lsGet<{ id: string; invoice_number?: string; due_date?: string; total: number; status: string }>('vantix_invoices');
      invoices.filter(i => i.due_date && i.status !== 'paid' && i.due_date >= startDate && i.due_date <= endDate).forEach(i => {
        extra.push({ id: `inv-${i.id}`, title: `Invoice ${i.invoice_number || i.id.slice(0,6)} due - $${i.total}`, date: i.due_date!, start_time: '00:00', end_time: '00:00', client_id: null, type: 'invoice', notes: `Status: ${i.status}`, created_at: new Date().toISOString(), source: 'invoice' });
      });
    } catch {}

    return extra;
  }, [currentYear, currentMonth]);

  const loadEvents = useCallback(() => {
    setLoading(true);
    try {
      const stored = lsGet<CalendarEvent>('vantix_calendar_events');
      const startDate = fmtDate(currentYear, currentMonth, 1);
      const endDate = fmtDate(currentYear, currentMonth, getDaysInMonth(currentYear, currentMonth));
      const filtered = stored.filter(e => e.date >= startDate && e.date <= endDate);
      const extra = generateExtraEvents();
      setEvents([...filtered, ...extra]);
      setClients(lsGet<ClientOption>('vantix_clients'));
    } catch {}
    setLoading(false);
  }, [currentYear, currentMonth, generateExtraEvents]);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };
  const goToToday = () => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); setSelectedDate(todayStr); };

  const selectedDayEvents = useMemo(() => events.filter(e => e.date === selectedDate), [events, selectedDate]);
  const eventsByDate = useMemo(() => { const m: Record<string, CalendarEvent[]> = {}; events.forEach(e => { if (!m[e.date]) m[e.date] = []; m[e.date].push(e); }); return m; }, [events]);

  const handleSave = (eventData: Partial<CalendarEvent>) => {
    try {
      const items = lsGet<CalendarEvent>('vantix_calendar_events');
      if (editingEvent && eventData.id) {
        const idx = items.findIndex(e => e.id === eventData.id);
        if (idx >= 0) { const { id, ...updates } = eventData; items[idx] = { ...items[idx], ...updates }; }
      } else {
        items.unshift({ id: generateId(), created_at: new Date().toISOString(), ...eventData } as CalendarEvent);
      }
      lsSet('vantix_calendar_events', items);
    } catch {}
    setModalOpen(false); setEditingEvent(null); loadEvents();
  };

  const handleDelete = (id: string) => {
    try { lsSet('vantix_calendar_events', lsGet<CalendarEvent>('vantix_calendar_events').filter(e => e.id !== id)); } catch {}
    loadEvents();
  };

  const openCreateForDate = (dateStr: string) => { setSelectedDate(dateStr); setEditingEvent(null); setModalOpen(true); };
  const openEdit = (event: CalendarEvent) => { if (event.source) { setDetailEvent(event); return; } setEditingEvent(event); setModalOpen(true); };

  // Calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const prevMonthDays = getDaysInMonth(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1);

  const calendarCells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) { const d = prevMonthDays - i; const m = currentMonth === 0 ? 11 : currentMonth - 1; const y = currentMonth === 0 ? currentYear - 1 : currentYear; calendarCells.push({ day: d, dateStr: fmtDate(y, m, d), isCurrentMonth: false }); }
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push({ day: d, dateStr: fmtDate(currentYear, currentMonth, d), isCurrentMonth: true });
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) { const m = currentMonth === 11 ? 0 : currentMonth + 1; const y = currentMonth === 11 ? currentYear + 1 : currentYear; calendarCells.push({ day: d, dateStr: fmtDate(y, m, d), isCurrentMonth: false }); }

  const getWeekDays = () => {
    const sel = new Date(selectedDate + 'T00:00:00');
    const weekStart = new Date(sel); weekStart.setDate(sel.getDate() - sel.getDay());
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return { day: d.getDate(), dateStr: fmtDate(d.getFullYear(), d.getMonth(), d.getDate()), dayName: DAY_NAMES[d.getDay()], monthName: MONTH_NAMES[d.getMonth()].slice(0, 3) }; });
  };
  const weekDays = viewMode === 'week' ? getWeekDays() : [];

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#C89A6A] to-[#B07A45] shadow-[3px_3px_8px_#c8c4be,-3px_-3px_8px_#ffffff]">
            <CalendarIcon size={22} className="text-[#5C4033]" />
          </div>
          <div><h1 className="text-2xl font-bold text-[#1C1C1C]">Calendar</h1><p className="text-sm text-[#7A746C]">Schedule and manage events</p></div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-xl overflow-hidden border border-[#E3D9CD]">
            {(['month', 'week'] as ViewMode[]).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`px-4 py-2 text-sm font-medium transition-all ${viewMode === mode ? 'bg-[#8E5E34] text-white' : 'bg-[#EEE6DC] text-[#1C1C1C] hover:bg-[#EEE6DC]'}`}>{mode.charAt(0).toUpperCase() + mode.slice(1)}</button>
            ))}
          </div>
          <button onClick={goToToday} className="px-4 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C] hover:bg-[#EEE6DC]">Today</button>
          <button onClick={() => openCreateForDate(selectedDate)} className="px-5 py-2.5 bg-[#8E5E34] text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#A67A4B]"><Plus size={16} /> New Event</button>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {[{ label: 'Meeting', color: EVENT_COLORS.meeting }, { label: 'Task', color: EVENT_COLORS.task }, { label: 'Subscription', color: EVENT_COLORS.subscription }, { label: 'Invoice', color: EVENT_COLORS.invoice }, { label: 'Deadline', color: EVENT_COLORS.deadline }].map(l => (
          <div key={l.label} className="flex items-center gap-1.5 text-xs text-[#7A746C]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />{l.label}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
          <div className="bg-[#EEE6DC] rounded-2xl overflow-hidden shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3D9CD]">
              <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-[#EEE6DC] text-[#7A746C]"><ChevronLeft size={20} /></button>
              <h2 className="text-lg font-bold text-[#1C1C1C]">{MONTH_NAMES[currentMonth]} {currentYear}</h2>
              <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-[#EEE6DC] text-[#7A746C]"><ChevronRight size={20} /></button>
            </div>

            {viewMode === 'month' ? (
              <div className="p-3 md:p-4">
                <div className="grid grid-cols-7 mb-2">{DAY_NAMES.map(d => <div key={d} className="text-center text-xs font-semibold text-[#7A746C] py-2">{d}</div>)}</div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((cell, i) => {
                    const isToday = cell.dateStr === todayStr;
                    const isSelected = cell.dateStr === selectedDate;
                    const dayEvents = eventsByDate[cell.dateStr] || [];
                    return (
                      <button key={i} onClick={() => setSelectedDate(cell.dateStr)} onDoubleClick={() => openCreateForDate(cell.dateStr)}
                        className={`relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all ${!cell.isCurrentMonth ? 'text-[#E3D9CD]' : isSelected ? 'bg-[#8E5E34]/10 text-[#1C1C1C] font-bold' : 'text-[#1C1C1C] hover:bg-[#EEE6DC]'} ${isToday ? 'ring-2 ring-[#8E5E34] ring-offset-1' : ''}`}>
                        <span className="text-xs md:text-sm">{cell.day}</span>
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {dayEvents.slice(0, 3).map((ev, j) => <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: EVENT_COLORS[ev.type] || '#8E5E34' }} />)}
                            {dayEvents.length > 3 && <span className="text-[8px] text-[#7A746C]">+</span>}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-3 md:p-4">
                <div className="grid grid-cols-7 gap-2">
                  {weekDays.map(wd => {
                    const isToday = wd.dateStr === todayStr;
                    const isSelected = wd.dateStr === selectedDate;
                    const dayEvents = eventsByDate[wd.dateStr] || [];
                    return (
                      <div key={wd.dateStr} className="flex flex-col">
                        <button onClick={() => setSelectedDate(wd.dateStr)} onDoubleClick={() => openCreateForDate(wd.dateStr)}
                          className={`flex flex-col items-center p-2 rounded-xl transition-all ${isSelected ? 'bg-[#8E5E34]/10' : 'hover:bg-[#EEE6DC]'} ${isToday ? 'ring-2 ring-[#8E5E34]' : ''}`}>
                          <span className="text-xs text-[#7A746C] font-medium">{wd.dayName}</span>
                          <span className="text-lg font-bold text-[#1C1C1C]">{wd.day}</span>
                        </button>
                        <div className="mt-2 space-y-1 min-h-[80px]">
                          {dayEvents.map(ev => (
                            <button key={ev.id} onClick={() => openEdit(ev)} className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium truncate hover:opacity-80" style={{ backgroundColor: (EVENT_COLORS[ev.type] || '#8E5E34') + '18', color: EVENT_COLORS[ev.type] || '#8E5E34', borderLeft: `3px solid ${EVENT_COLORS[ev.type] || '#8E5E34'}` }}>
                              <div className="truncate">{ev.title}</div>
                              {ev.start_time !== '00:00' && <div className="text-[10px] opacity-70">{fmtTime(ev.start_time)}</div>}
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

        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:w-80 xl:w-96">
          <div className="bg-[#EEE6DC] rounded-2xl overflow-hidden shadow-[6px_6px_16px_#d1cdc7,-6px_-6px_16px_#ffffff]">
            <div className="px-5 py-4 border-b border-[#E3D9CD] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#1C1C1C]">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                <p className="text-xs text-[#7A746C]">{selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => openCreateForDate(selectedDate)} className="p-2 rounded-xl bg-[#8E5E34]/10 text-[#8E5E34] hover:bg-[#8E5E34]/20"><Plus size={18} /></button>
            </div>
            <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12"><div className="w-6 h-6 border-2 border-[#8E5E34]/30 border-t-[#8E5E34] rounded-full animate-spin" /></div>
              ) : selectedDayEvents.length === 0 ? (
                <div className="text-center py-12"><CalendarIcon size={36} className="mx-auto text-[#E3D9CD] mb-3" /><p className="text-sm text-[#7A746C]">No events scheduled</p></div>
              ) : selectedDayEvents.map((ev, i) => {
                const clientName = clients.find(c => c.id === ev.client_id)?.name;
                return (
                  <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border border-[#E3D9CD] hover:border-[#8E5E34]/20 transition-all group cursor-pointer" onClick={() => openEdit(ev)}
                    style={{ borderLeft: `4px solid ${EVENT_COLORS[ev.type] || '#8E5E34'}` }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#1C1C1C] text-sm truncate">{ev.title}</h4>
                        {ev.start_time !== '00:00' && <div className="flex items-center gap-1 mt-1 text-xs text-[#7A746C]"><Clock size={12} />{fmtTime(ev.start_time)} - {fmtTime(ev.end_time)}</div>}
                        {clientName && <div className="flex items-center gap-1 mt-1 text-xs text-[#7A746C]"><User size={12} />{clientName}</div>}
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[10px] font-semibold" style={{ backgroundColor: (EVENT_COLORS[ev.type] || '#8E5E34') + '18', color: EVENT_COLORS[ev.type] || '#8E5E34' }}><Tag size={10} />{ev.type}</span>
                        {ev.notes && <p className="mt-2 text-xs text-[#7A746C] line-clamp-2">{ev.notes}</p>}
                      </div>
                      {!ev.source && (
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={e => { e.stopPropagation(); openEdit(ev); }} className="p-1.5 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C] hover:text-[#8E5E34]"><Edit3 size={14} /></button>
                          <button onClick={e => { e.stopPropagation(); handleDelete(ev.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-[#7A746C] hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail modal for auto-generated events */}
      <AnimatePresence>
        {detailEvent && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#1C1C1C]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailEvent(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#EEE6DC] rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#1C1C1C]">Event Details</h2>
                <button onClick={() => setDetailEvent(null)} className="p-2 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: EVENT_COLORS[detailEvent.type] || '#8E5E34' }} /><h3 className="font-semibold text-[#1C1C1C]">{detailEvent.title}</h3></div>
                <p className="text-sm text-[#7A746C]">Date: {detailEvent.date}</p>
                <p className="text-sm text-[#7A746C]">Type: {detailEvent.type}</p>
                {detailEvent.notes && <p className="text-sm text-[#7A746C]">{detailEvent.notes}</p>}
                <p className="text-xs text-[#8E5E34]">Auto-generated from {detailEvent.source}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-[#1C1C1C]/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setModalOpen(false); setEditingEvent(null); }}>
            <EventFormInner editEvent={editingEvent} initialDate={selectedDate} clients={clients} onSave={handleSave} onClose={() => { setModalOpen(false); setEditingEvent(null); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EventFormInner({ editEvent, initialDate, clients, onSave, onClose }: { editEvent: CalendarEvent | null; initialDate: string; clients: ClientOption[]; onSave: (e: Partial<CalendarEvent>) => void; onClose: () => void }) {
  const [title, setTitle] = useState(editEvent?.title || '');
  const [date, setDate] = useState(editEvent?.date || initialDate);
  const [startTime, setStartTime] = useState(editEvent?.start_time || '09:00');
  const [endTime, setEndTime] = useState(editEvent?.end_time || '10:00');
  const [clientId, setClientId] = useState(editEvent?.client_id || '');
  const [eventType, setEventType] = useState(editEvent?.type || 'meeting');
  const [notes, setNotes] = useState(editEvent?.notes || '');

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!title.trim()) return; onSave({ ...(editEvent ? { id: editEvent.id } : {}), title: title.trim(), date, start_time: startTime, end_time: endTime, client_id: clientId || null, type: eventType as CalendarEvent['type'], notes: notes.trim() }); };
  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] focus:outline-none focus:border-[#8E5E34]/50 text-sm';

  return (
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#EEE6DC] rounded-2xl w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3D9CD]">
        <h2 className="text-lg font-bold text-[#1C1C1C]">{editEvent ? 'Edit Event' : 'New Event'}</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#EEE6DC] text-[#7A746C]"><X size={20} /></button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div><label className="block text-sm font-medium text-[#1C1C1C] mb-1">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} required className={inputCls} /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm font-medium text-[#1C1C1C] mb-1">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} /></div>
          <div><label className="block text-sm font-medium text-[#1C1C1C] mb-1">Start</label><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputCls} /></div>
          <div><label className="block text-sm font-medium text-[#1C1C1C] mb-1">End</label><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputCls} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm font-medium text-[#1C1C1C] mb-1">Type</label><select value={eventType} onChange={e => setEventType(e.target.value)} className={inputCls}>{EVENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-[#1C1C1C] mb-1">Client</label><select value={clientId} onChange={e => setClientId(e.target.value)} className={inputCls}><option value="">No client</option>{clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        </div>
        <div><label className="block text-sm font-medium text-[#1C1C1C] mb-1">Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={inputCls + ' resize-none'} /></div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-[#EEE6DC] border border-[#E3D9CD] rounded-xl text-sm text-[#1C1C1C]">Cancel</button>
          <button type="submit" className="px-5 py-2.5 bg-[#8E5E34] text-white rounded-xl text-sm font-medium flex items-center gap-2"><Check size={16} />{editEvent ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </motion.div>
  );
}
