'use client';

import { useState, useEffect, useMemo } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, X, Clock, MapPin } from 'lucide-react';
import { getData, createRecord, deleteRecord } from '@/lib/data';

type EventType = 'meeting' | 'deadline' | 'task' | 'followup';

interface CalEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string;
  notes: string;
  client: string;
}

const EVENT_COLORS: Record<EventType, string> = {
  meeting: '#B07A45',
  deadline: '#DC2626',
  task: '#2563EB',
  followup: '#9CA3AF',
};

const EVENT_LABELS: Record<EventType, string> = {
  meeting: 'Meeting',
  deadline: 'Deadline',
  task: 'Task',
  followup: 'Follow-up',
};

function getToday() { return new Date(); }
function fmt(d: Date) { return d.toISOString().split('T')[0]; }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

function seedEvents(): CalEvent[] {
  const today = getToday();
  const dow = today.getDay();
  const monday = addDays(today, -dow + 1);
  return [
    { id: '1', title: 'Client Strategy Call', type: 'meeting', date: fmt(addDays(monday, 0)), time: '10:00', notes: 'Q1 review', client: 'Apex Holdings' },
    { id: '2', title: 'Design Review', type: 'meeting', date: fmt(addDays(monday, 2)), time: '14:00', notes: 'Website mockups', client: 'Summit Digital' },
    { id: '3', title: 'Sprint Planning', type: 'meeting', date: fmt(addDays(monday, 4)), time: '09:00', notes: 'Next sprint scope', client: '' },
    { id: '4', title: 'Proposal Due', type: 'deadline', date: fmt(addDays(monday, 1)), time: '17:00', notes: 'Metro Finance proposal', client: 'Metro Finance' },
    { id: '5', title: 'Invoice Submission', type: 'deadline', date: fmt(addDays(monday, 3)), time: '12:00', notes: 'Monthly invoices', client: '' },
    { id: '6', title: 'Follow up with lead', type: 'followup', date: fmt(addDays(monday, 2)), time: '11:00', notes: 'Check interest level', client: 'Peak Industries' },
  ];
}

async function loadEvents(): Promise<CalEvent[]> {
  try {
    const data = await getData<CalEvent>('calendar_events');
    return data.length ? data : seedEvents();
  } catch { return seedEvents(); }
}

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [viewDate, setViewDate] = useState(getToday());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'meeting' as EventType, date: '', time: '09:00', notes: '', client: '' });

  useEffect(() => { loadEvents().then(setEvents); }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [firstDay, daysInMonth]);

  const eventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr);
  const dateStr = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const todayStr = fmt(getToday());

  const upcoming = useMemo(() => {
    const today = getToday();
    const end = addDays(today, 7);
    return events
      .filter(e => e.date >= fmt(today) && e.date <= fmt(end))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [events]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const addEvent = async () => {
    if (!form.title || !form.date) return;
    const ev = await createRecord<CalEvent>('calendar_events', { ...form });
    setEvents(prev => [...prev, ev]);
    setShowModal(false);
    setForm({ title: '', type: 'meeting', date: '', time: '09:00', notes: '', client: '' });
  };

  const deleteEvent = async (id: string) => {
    await deleteRecord('calendar_events', id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];

  return (
    <div className="min-h-screen bg-[#F4EFE8] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C] flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-[#B07A45]" /> Calendar
          </h1>
          <p className="text-[#7A746C] text-sm mt-1">Schedule, deadlines, and follow-ups</p>
        </div>
        <button onClick={() => { setForm({ ...form, date: selectedDate || todayStr }); setShowModal(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="flex-1">
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#E3D9CD] transition">
                <ChevronLeft className="w-5 h-5 text-[#4B4B4B]" />
              </button>
              <h2 className="text-lg font-semibold text-[#1C1C1C]">{MONTH_NAMES[month]} {year}</h2>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#E3D9CD] transition">
                <ChevronRight className="w-5 h-5 text-[#4B4B4B]" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-medium text-[#7A746C] py-2">{d}</div>
              ))}
              {calendarCells.map((day, i) => {
                if (day === null) return <div key={i} />;
                const ds = dateStr(day);
                const dayEvents = eventsForDate(ds);
                const isToday = ds === todayStr;
                const isSelected = ds === selectedDate;
                return (
                  <button key={i} onClick={() => setSelectedDate(ds)}
                    className={`relative p-2 rounded-xl text-sm transition min-h-[56px] flex flex-col items-center
                      ${isSelected ? 'bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white' : isToday ? 'bg-[#F4EFE8] border-2 border-[#B07A45] text-[#1C1C1C]' : 'hover:bg-[#F4EFE8] text-[#1C1C1C]'}`}>
                    <span className="font-medium">{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dayEvents.slice(0, 3).map((e, j) => (
                          <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isSelected ? '#fff' : EVENT_COLORS[e.type] }} />
                        ))}
                        {dayEvents.length > 3 && <span className="text-[8px]">+{dayEvents.length - 3}</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex gap-4 mt-4 pt-3 border-t border-[#E3D9CD]">
              {(Object.entries(EVENT_LABELS) as [EventType, string][]).map(([type, label]) => (
                <div key={type} className="flex items-center gap-1.5 text-xs text-[#7A746C]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: EVENT_COLORS[type] }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5 mt-6">
            <h3 className="text-base font-semibold text-[#1C1C1C] mb-3">Upcoming (Next 7 Days)</h3>
            {upcoming.length === 0 ? (
              <p className="text-sm text-[#7A746C]">No upcoming events</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map(e => (
                  <div key={e.id} className="flex items-center gap-3 bg-[#F4EFE8] rounded-xl p-3">
                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: EVENT_COLORS[e.type] }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1C1C1C] truncate">{e.title}</p>
                      <p className="text-xs text-[#7A746C]">{e.date} at {e.time}{e.client ? ` — ${e.client}` : ''}</p>
                    </div>
                    <span className="text-[10px] font-medium text-[#7A746C] uppercase">{EVENT_LABELS[e.type]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — selected day */}
        <div className="w-full lg:w-80">
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-5 sticky top-6">
            <h3 className="text-base font-semibold text-[#1C1C1C] mb-3">
              {selectedDate ? new Date(selectedDate + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a day'}
            </h3>
            {selectedDate ? (
              selectedEvents.length === 0 ? (
                <p className="text-sm text-[#7A746C]">No events this day</p>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map(e => (
                    <div key={e.id} className="bg-[#F4EFE8] rounded-xl p-3 border border-[#E3D9CD]">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: EVENT_COLORS[e.type] }} />
                          <div>
                            <p className="text-sm font-medium text-[#1C1C1C]">{e.title}</p>
                            <p className="text-xs text-[#7A746C] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" /> {e.time}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => deleteEvent(e.id)} className="text-[#7A746C] hover:text-red-600 transition">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {e.client && <p className="text-xs text-[#7A746C] mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.client}</p>}
                      {e.notes && <p className="text-xs text-[#4B4B4B] mt-1">{e.notes}</p>}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="text-sm text-[#7A746C]">Click a date on the calendar to view events</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-[#EEE6DC] border border-[#E3D9CD] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1C1C1C]">Add Event</h3>
              <button onClick={() => setShowModal(false)} className="text-[#7A746C] hover:text-[#1C1C1C]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] outline-none focus:border-[#B07A45]" />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as EventType })}
                className="w-full px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] outline-none focus:border-[#B07A45]">
                {Object.entries(EVENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] outline-none focus:border-[#B07A45]" />
                <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] outline-none focus:border-[#B07A45]" />
              </div>
              <input placeholder="Linked Client (optional)" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] outline-none focus:border-[#B07A45]" />
              <textarea placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3}
                className="w-full px-3 py-2 rounded-xl bg-[#F4EFE8] border border-[#E3D9CD] text-sm text-[#1C1C1C] outline-none focus:border-[#B07A45] resize-none" />
              <button onClick={addEvent} className="w-full py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium hover:opacity-90 transition">
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
