'use client';

import { useState, useEffect, useMemo } from 'react';
import { CalendarDays, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Mail, Phone, User, Plus, X, MessageSquare } from 'lucide-react';
import { getData, createRecord, updateRecord, deleteRecord } from '@/lib/data';

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  status: BookingStatus;
  notes?: string;
  created_at: string;
}

const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending: 'bg-[#B07A45]/15 text-[#B07A45] border-[#B07A45]/20',
  Confirmed: 'bg-green-50 text-green-700 border-green-200',
  Completed: 'bg-gray-100 text-gray-600 border-gray-200',
  Cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const SEED: Booking[] = [
  { id: '1', name: 'Marcus Johnson', email: 'marcus@example.com', phone: '813-555-0101', date: '2026-02-20', time: '10:00', status: 'Pending', notes: 'Interested in web app development', created_at: '2026-02-15T09:00:00Z' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@startup.io', phone: '727-555-0202', date: '2026-02-19', time: '14:00', status: 'Confirmed', notes: 'AI chatbot integration', created_at: '2026-02-13T11:30:00Z' },
  { id: '3', name: 'David Park', email: 'david@corp.com', phone: '407-555-0303', date: '2026-02-14', time: '11:00', status: 'Completed', notes: 'E-commerce consultation', created_at: '2026-02-10T08:00:00Z' },
  { id: '4', name: 'Lisa Ramirez', email: 'lisa@gmail.com', phone: '954-555-0404', date: '2026-02-12', time: '15:30', status: 'Cancelled', notes: 'Rescheduled to next month', created_at: '2026-02-08T14:00:00Z' },
];

function lsGet<T>(key: string, fb: T[]): T[] { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch { return fb; } }
function lsSet<T>(key: string, d: T[]) { try { localStorage.setItem(key, JSON.stringify(d)); } catch {} }

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const d = await getData<Booking>('bookings');
        setBookings(d.length ? d : lsGet('vantix_bookings', SEED));
      } catch { setBookings(lsGet('vantix_bookings', SEED)); }
    })();
  }, []);

  useEffect(() => { lsSet('vantix_bookings', bookings); }, [bookings]);

  const now = new Date();
  const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);
  const thisWeekStr = weekEnd.toISOString().slice(0, 10);
  const todayStr = now.toISOString().slice(0, 10);

  const total = bookings.length;
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const thisWeek = bookings.filter(b => b.date >= todayStr && b.date <= thisWeekStr).length;

  const updateStatus = async (id: string, status: BookingStatus) => {
    try { await updateRecord<Booking>('bookings', id, { status } as Partial<Booking>); } catch {}
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const addNote = async (id: string) => {
    if (!noteInput.trim()) return;
    const booking = bookings.find(b => b.id === id);
    const notes = (booking?.notes ? booking.notes + '\n' : '') + noteInput;
    try { await updateRecord<Booking>('bookings', id, { notes } as Partial<Booking>); } catch {}
    setBookings(prev => prev.map(b => b.id === id ? { ...b, notes } : b));
    setNoteInput('');
  };

  const sendEmail = (email: string) => { window.open(`mailto:${email}`, '_blank'); };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-[#F4EFE8]">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Bookings</h1>
        <p className="text-sm text-[#7A746C]">Manage consultation bookings from your landing page</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: total, icon: CalendarDays, color: 'text-[#B07A45]' },
          { label: 'Pending', value: pending, icon: Clock, color: 'text-[#B07A45]' },
          { label: 'Confirmed', value: confirmed, icon: CheckCircle2, color: 'text-green-600' },
          { label: 'This Week', value: thisWeek, icon: CalendarDays, color: 'text-blue-500' },
        ].map(s => (
          <div key={s.label} className="bg-[#EEE6DC] rounded-xl p-5 border border-[#E3D9CD]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#7A746C] uppercase tracking-wide font-medium">{s.label}</span>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-[#1C1C1C]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#EEE6DC] rounded-xl border border-[#E3D9CD] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E3D9CD] text-left text-[#7A746C]">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <>
                  <tr key={b.id} className="border-b border-[#E3D9CD]/60 hover:bg-[#E3D9CD]/30 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}>
                    <td className="px-4 py-3 text-[#1C1C1C] font-medium">{b.name}</td>
                    <td className="px-4 py-3 text-[#4B4B4B]">{b.email}</td>
                    <td className="px-4 py-3 text-[#4B4B4B]">{b.phone}</td>
                    <td className="px-4 py-3 text-[#4B4B4B]">{b.date}</td>
                    <td className="px-4 py-3 text-[#4B4B4B]">{b.time}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3 text-[#7A746C] text-xs">{new Date(b.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        {b.status === 'Pending' && (
                          <button onClick={() => updateStatus(b.id, 'Confirmed')} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors">Confirm</button>
                        )}
                        {b.status === 'Confirmed' && (
                          <button onClick={() => updateStatus(b.id, 'Completed')} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">Complete</button>
                        )}
                        {(b.status === 'Pending' || b.status === 'Confirmed') && (
                          <button onClick={() => updateStatus(b.id, 'Cancelled')} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors">Cancel</button>
                        )}
                        <button onClick={() => sendEmail(b.email)} className="p-1.5 rounded-lg hover:bg-[#E3D9CD] text-[#7A746C] hover:text-[#B07A45] transition-colors"><Mail size={14} /></button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === b.id && (
                    <tr key={`${b.id}-detail`} className="border-b border-[#E3D9CD]/60 bg-[#F4EFE8]/50">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="space-y-3">
                          <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2 text-[#4B4B4B]"><User size={14} /> {b.name}</div>
                            <div className="flex items-center gap-2 text-[#4B4B4B]"><Mail size={14} /> {b.email}</div>
                            <div className="flex items-center gap-2 text-[#4B4B4B]"><Phone size={14} /> {b.phone}</div>
                          </div>
                          {b.notes && (
                            <div className="bg-[#EEE6DC] rounded-lg p-3 border border-[#E3D9CD]">
                              <p className="text-xs font-medium text-[#7A746C] mb-1">Notes</p>
                              <p className="text-sm text-[#4B4B4B] whitespace-pre-wrap">{b.notes}</p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Add a note..." className="flex-1 px-3 py-2 bg-[#EEE6DC] border border-[#E3D9CD] rounded-lg text-sm text-[#1C1C1C] focus:outline-none focus:ring-1 focus:ring-[#B07A45]" onKeyDown={e => e.key === 'Enter' && addNote(b.id)} />
                            <button onClick={() => addNote(b.id)} className="px-4 py-2 bg-gradient-to-b from-[#C89A6A] to-[#B07A45] text-white rounded-xl text-sm font-medium">Add</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-[#7A746C]">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
