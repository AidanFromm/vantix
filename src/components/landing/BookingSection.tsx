'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { colors, fonts, animations } from '@/lib/design-tokens';

const ease = animations.easing as unknown as [number, number, number, number];

const TIME_SLOTS = [
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM',
];

function getCalendarDays(month: number, year: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

function isWeekend(d: Date) { const dow = d.getDay(); return dow === 0 || dow === 6; }
function isSameDay(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function formatDateStr(d: Date) { return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }

function toISO(d: Date, timeStr: string) {
  const [time, ampm] = timeStr.split(' ');
  const [hStr, mStr] = time.split(':');
  let h = parseInt(hStr);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, parseInt(mStr));
  return dt.toISOString();
}

export default function BookingSection() {
  const ref = useRef(null);
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const calendarDays = getCalendarDays(viewMonth, viewYear);
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayHeaders = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const canGoPrev = viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth());
  const goNext = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };
  const goPrev = () => { if (!canGoPrev) return; if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !selectedDate || !selectedTime) return;
    const dateStr = formatDateStr(selectedDate);
    const booking = { name: form.name, email: form.email, phone: form.phone, date: dateStr, time: selectedTime, notes: '' };
    try {
      await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(booking) });
    } catch { /* noop */ }
    try {
      const full = { id: 'booking-' + Date.now(), ...booking, created_at: new Date().toISOString(), dismissed: false };
      const existing = JSON.parse(localStorage.getItem('vantix_bookings') || '[]');
      existing.push(full);
      localStorage.setItem('vantix_bookings', JSON.stringify(existing));
    } catch { /* noop */ }
    fetch('/api/bookings/webhook', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerEvent: 'BOOKING_CREATED',
        payload: { attendees: [{ name: form.name, email: form.email, phone: form.phone }], startTime: toISO(selectedDate, selectedTime), responses: { notes: '' } },
      }),
    }).catch(() => {});
    setSubmitted(true);
  };

  const step = submitted ? 3 : selectedTime ? 2 : selectedDate ? 1 : 0;

  return (
    <section id="booking" className="py-28 lg:py-36" style={{ backgroundColor: colors.bg }}>
      <div className="max-w-4xl mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
            <span className="text-[11px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: fonts.body, color: colors.bronze }}>
              Get Started
            </span>
            <span className="h-px w-8" style={{ backgroundColor: colors.bronze }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-[3.25rem] font-bold mb-5 tracking-tight"
            style={{ fontFamily: fonts.display, color: colors.text }}
          >
            Let&apos;s Talk
          </h2>
          <p
            className="text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: fonts.body, color: colors.muted }}
          >
            Book a free 30-minute strategy call. We&apos;ll map your operations, identify AI opportunities, and give you a clear action plan — whether you work with us or not.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="rounded-3xl overflow-hidden p-8 sm:p-12"
          style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            boxShadow: `0 24px 64px ${colors.bronze}08`,
          }}
        >
          <AnimatePresence mode="wait">
            {step === 3 ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${colors.bronze}15` }}>
                  <CheckCircle2 size={32} style={{ color: colors.bronze }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: fonts.display, color: colors.text }}>You&apos;re booked!</h3>
                <p style={{ fontFamily: fonts.body, color: colors.muted }}>
                  We&apos;ll email you to confirm your {selectedTime} slot on {selectedDate ? formatDateStr(selectedDate) : ''}.
                </p>
              </motion.div>
            ) : (
              <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={goPrev} disabled={!canGoPrev}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${canGoPrev ? 'hover:bg-[#E3D9CD] text-[#B07A45]' : 'text-[#E3D9CD] cursor-not-allowed'}`}>
                      <ChevronDown size={20} className="rotate-90" />
                    </button>
                    <p className="text-lg font-bold tracking-wide" style={{ fontFamily: fonts.display, color: colors.text }}>
                      {monthNames[viewMonth]} {viewYear}
                    </p>
                    <button onClick={goNext} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#E3D9CD] transition-all" style={{ color: colors.bronze }}>
                      <ChevronDown size={20} className="-rotate-90" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {dayHeaders.map((dh) => (
                      <div key={dh} className="text-center text-[11px] font-semibold uppercase tracking-wider py-2" style={{ color: colors.muted }}>{dh}</div>
                    ))}
                    {calendarDays.map((d, i) => {
                      if (!d) return <div key={`empty-${i}`} />;
                      const past = d <= today;
                      const weekend = isWeekend(d);
                      const disabled = past || weekend;
                      const active = selectedDate && isSameDay(d, selectedDate);
                      const isToday = isSameDay(d, today);
                      return (
                        <button key={d.toISOString()} disabled={disabled}
                          onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                            ${active
                              ? 'text-white shadow-lg scale-105'
                              : disabled
                                ? 'cursor-not-allowed'
                                : isToday
                                  ? 'font-bold ring-1'
                                  : 'hover:bg-[#E3D9CD] cursor-pointer'
                            }`}
                          style={{
                            backgroundColor: active ? colors.bronze : undefined,
                            boxShadow: active ? `0 8px 24px ${colors.bronze}30` : undefined,
                            color: active ? '#fff' : disabled ? colors.border : isToday ? colors.bronze : colors.textSecondary,
                            ...(isToday && !active ? { ringColor: `${colors.bronze}30`, backgroundColor: `${colors.bronze}10` } : {}),
                          }}
                        >
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {step >= 1 && (
                    <motion.div key="times" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-10 overflow-hidden">
                      <p className="text-sm font-semibold mb-4" style={{ fontFamily: fonts.display, color: colors.text }}>
                        Select a time <span className="font-normal" style={{ fontFamily: fonts.body, color: colors.muted }}>(Eastern Time)</span>
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((t) => (
                          <button key={t} onClick={() => setSelectedTime(t)}
                            className="py-3 rounded-xl text-sm font-medium transition-all"
                            style={{
                              backgroundColor: selectedTime === t ? colors.bronze : colors.bg,
                              color: selectedTime === t ? '#fff' : colors.textSecondary,
                              boxShadow: selectedTime === t ? `0 8px 24px ${colors.bronze}30` : undefined,
                              border: selectedTime === t ? 'none' : `1px solid ${colors.border}`,
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step >= 2 && (
                    <motion.form key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleSubmit} className="overflow-hidden">
                      <p className="text-sm font-semibold mb-4" style={{ fontFamily: fonts.display, color: colors.text }}>Your details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        {[
                          { type: 'text', required: true, placeholder: 'Name *', value: form.name, key: 'name' as const },
                          { type: 'email', required: true, placeholder: 'Email *', value: form.email, key: 'email' as const },
                          { type: 'tel', required: false, placeholder: 'Phone', value: form.phone, key: 'phone' as const },
                        ].map((field) => (
                          <input
                            key={field.key}
                            type={field.type}
                            required={field.required}
                            placeholder={field.placeholder}
                            value={field.value}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            className="px-5 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                            style={{
                              backgroundColor: colors.bg,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                              fontFamily: fonts.body,
                            }}
                          />
                        ))}
                      </div>
                      <button type="submit"
                        className="w-full font-semibold rounded-xl px-8 py-4 text-white text-base transition-all hover:brightness-110"
                        style={{
                          background: `linear-gradient(135deg, ${colors.bronze}, ${colors.bronzeDark})`,
                          boxShadow: `0 8px 32px ${colors.bronze}25`,
                          fontFamily: fonts.body,
                        }}
                      >
                        Confirm Booking — {selectedDate && selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {selectedTime}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
