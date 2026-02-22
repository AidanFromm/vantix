'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

const TIME_SLOTS = [
  '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM',
  '7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM','10:00 PM',
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function getCalendarDays(month: number, year: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

function isWeekend(d: Date) {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDateStr(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

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
    const booking = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: dateStr,
      time: selectedTime,
      notes: '',
    };
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
    } catch { /* noop */ }
    try {
      const full = { id: 'booking-' + Date.now(), ...booking, created_at: new Date().toISOString(), dismissed: false };
      const existing = JSON.parse(localStorage.getItem('vantix_bookings') || '[]');
      existing.push(full);
      localStorage.setItem('vantix_bookings', JSON.stringify(existing));
    } catch { /* noop */ }
    fetch('/api/bookings/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerEvent: 'BOOKING_CREATED',
        payload: {
          attendees: [{ name: form.name, email: form.email, phone: form.phone }],
          startTime: toISO(selectedDate, selectedTime),
          responses: { notes: '' },
        },
      }),
    }).catch(() => {});
    setSubmitted(true);
  };

  const step = submitted ? 3 : selectedTime ? 2 : selectedDate ? 1 : 0;

  return (
    <section id="booking" className="py-12 sm:py-16 lg:py-20 bg-[#F4EFE8]">
      <div className="max-w-4xl mx-auto px-5 sm:px-6" ref={ref}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="text-center mb-6 sm:mb-10">
          <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-[#8E5E34] mb-4" style={{ fontFamily: "'Satoshi', sans-serif" }}>Start This Week</motion.p>
          <motion.h2 variants={fadeUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>Book Your Free Consultation</motion.h2>
          <motion.p variants={fadeUp} className="text-[#7A746C] text-base leading-relaxed max-w-2xl mx-auto" style={{ fontFamily: "'Satoshi', sans-serif" }}>Pick a time that works for you. 30 minutes, zero pressure.</motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="rounded-xl bg-[#EEE6DC] shadow-sm border border-[#E3D9CD] overflow-hidden p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {step === 3 ? (
              <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center py-12">
                <CheckCircle2 className="mx-auto mb-4 text-[#8E5E34]" size={48} />
                <h3 className="text-2xl font-bold text-[#B07A45] mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>You&apos;re booked!</h3>
                <p className="text-[#7A746C]" style={{ fontFamily: "'Satoshi', sans-serif" }}>We&apos;ll email you to confirm your {selectedTime} slot on {selectedDate ? formatDateStr(selectedDate) : ''}.</p>
              </motion.div>
            ) : (
              <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Calendar Grid */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={goPrev} disabled={!canGoPrev}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${canGoPrev ? 'hover:bg-[#E3D9CD] text-[#B07A45]' : 'text-[#E3D9CD] cursor-not-allowed'}`}>
                      <ChevronDown size={18} className="rotate-90" />
                    </button>
                    <p className="text-sm font-semibold text-[#1C1C1C] tracking-wide" style={{ fontFamily: "'Clash Display', sans-serif" }}>{monthNames[viewMonth]} {viewYear}</p>
                    <button onClick={goNext}
                      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#E3D9CD] text-[#B07A45] transition-all">
                      <ChevronDown size={18} className="-rotate-90" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {dayHeaders.map((dh) => (
                      <div key={dh} className="text-center text-[10px] font-semibold text-[#A39B90] uppercase tracking-wider py-2">{dh}</div>
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
                          className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all
                            ${active ? 'bg-[#8E5E34] text-white shadow-md' :
                              disabled ? 'text-[#E3D9CD] cursor-not-allowed' :
                              isToday ? 'bg-[#B07A45]/10 text-[#B07A45] font-bold' :
                              'text-[#4B4B4B] hover:bg-[#E3D9CD] cursor-pointer'}`}>
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <AnimatePresence mode="wait">
                  {step >= 1 && (
                    <motion.div key="times" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
                      <p className="text-sm font-medium text-[#B07A45] mb-3" style={{ fontFamily: "'Satoshi', sans-serif" }}>Select a time <span className="text-[#A39B90] font-normal">(Eastern Time)</span></p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TIME_SLOTS.map((t) => {
                          const active = selectedTime === t;
                          return (
                            <button key={t} onClick={() => setSelectedTime(t)}
                              className={`py-2.5 rounded-lg text-sm font-medium transition-all
                                ${active ? 'bg-[#8E5E34] text-white shadow-md' : 'bg-[#F4EFE8] text-[#B07A45] hover:bg-[#E3D9CD]'}`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <AnimatePresence mode="wait">
                  {step >= 2 && (
                    <motion.form key="form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleSubmit} className="overflow-hidden">
                      <p className="text-sm font-medium text-[#B07A45] mb-3" style={{ fontFamily: "'Satoshi', sans-serif" }}>Your details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <input type="text" required placeholder="Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="px-4 py-2.5 rounded-lg border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] placeholder-[#7A746C] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E5E34]/30" />
                        <input type="email" required placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="px-4 py-2.5 rounded-lg border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] placeholder-[#7A746C] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E5E34]/30" />
                        <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="px-4 py-2.5 rounded-lg border border-[#E3D9CD] bg-[#F4EFE8] text-[#1C1C1C] placeholder-[#7A746C] text-sm focus:outline-none focus:ring-2 focus:ring-[#8E5E34]/30" />
                      </div>
                      <button type="submit"
                        className="w-full bg-[#B07A45] hover:bg-[#8E5E34] text-white font-semibold rounded-xl px-8 py-4 shadow-md hover:shadow-lg transition-all">
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
