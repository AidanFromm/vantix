"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ArrowLeft, Loader2 } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface Lead {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  timestamp?: string;
}

const uid = () => Math.random().toString(36).slice(2, 10);
const STORAGE_KEY = "vantix_chat_leads";

// Try to extract lead info from conversation
function extractLeadInfo(messages: Message[]): Lead {
  const lead: Lead = {};
  const allText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join(" ");

  // Email pattern
  const emailMatch = allText.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) lead.email = emailMatch[0];

  // Phone pattern
  const phoneMatch = allText.match(/[\d()+-]{7,}/);
  if (phoneMatch) lead.phone = phoneMatch[0];

  // Name — first user message that's short and not a question
  const firstMsg = messages.find(
    (m) =>
      m.role === "user" &&
      m.content.length < 40 &&
      !m.content.includes("?") &&
      !m.content.includes("@") &&
      !/\d{3}/.test(m.content)
  );
  if (firstMsg) lead.name = firstMsg.content;

  return lead;
}

async function saveLeadIfReady(messages: Message[]) {
  const lead = extractLeadInfo(messages);
  if (!lead.email && !lead.phone) return; // Need at least email or phone

  lead.timestamp = new Date().toISOString();

  // Save to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const leads: Lead[] = raw ? JSON.parse(raw) : [];
    // Dedupe by email
    if (lead.email && leads.some((l) => l.email === lead.email)) return;
    leads.push(lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {}

  // Send email notification
  try {
    const { chatLeadNotificationEmail } = await import(
      "@/lib/email-templates"
    );
    await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "hello@usevantix.com",
        subject: `Chat lead: ${lead.name || "Anonymous"} — ${lead.email || lead.phone}`,
        html: chatLeadNotificationEmail(
          lead.name || "",
          lead.email || "",
          lead.phone || "",
          lead.interest || ""
        ),
      }),
    });
  } catch {}

  // Save to Supabase
  try {
    const { createLead } = await import("@/lib/supabase");
    await createLead({
      name: lead.name || "Chat Visitor",
      email: lead.email || undefined,
      phone: lead.phone || undefined,
      source: "Chat Widget",
      status: "new",
      notes: `Chat conversation (${messages.length} messages)`,
      score: 0,
      tags: ["chat-widget"],
    });
  } catch {}
}

// ---------------------------------------------------------------------------
// Quick replies for initial engagement
// ---------------------------------------------------------------------------
const QUICK_REPLIES = [
  "I need a website",
  "Tell me about AI automation",
  "What's your pricing?",
  "Book a consultation",
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! I'm the Vantix AI assistant. I can answer questions about our services, pricing, process, or help you get started. What can I help you with?",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      setShowQuickReplies(false);
      const userMsg: Message = { id: uid(), role: "user", content: text.trim() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) throw new Error("API error");

        const data = await res.json();
        const botMsg: Message = {
          id: uid(),
          role: "assistant",
          content: data.reply || "Sorry, I had trouble with that. Try again?",
        };

        const finalMessages = [...newMessages, botMsg];
        setMessages(finalMessages);

        // Background: try to extract and save lead info
        saveLeadIfReady(finalMessages).catch(() => {});
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: "assistant",
            content:
              "I'm having a moment — try again, or book a free consultation directly at the booking section below!",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const handleReset = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setShowQuickReplies(true);
    setInput("");
  }, []);

  return (
    <>
      {/* Trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: "#B07A45" }}
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B07A45] opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden rounded-3xl border border-[#E3D9CD] bg-[#F4EFE8] shadow-lg
              w-[calc(100vw-3rem)] max-w-[400px] h-[520px]
              sm:w-[400px]
              max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:border-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E3D9CD] bg-[#EEE6DC] px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="text-[#A39B90] hover:text-[#B07A45] transition-colors"
                  aria-label="Reset chat"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#28C840] animate-pulse" />
                  <span className="text-sm font-semibold text-[#1C1C1C]">
                    Vantix AI
                  </span>
                  <span className="text-[10px] text-[#7A746C] bg-[#F4EFE8] px-1.5 py-0.5 rounded-full">
                    powered by AI
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#A39B90] hover:text-[#B07A45] transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-[#EEE6DC] text-[#4B4B4B] shadow-sm"
                        : "bg-[#B07A45] text-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Quick replies */}
              {showQuickReplies && messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => sendMessage(qr)}
                      className="rounded-full border border-[#D8C2A8] bg-[#EEE6DC] px-3 py-1.5 text-xs text-[#7A746C] hover:border-[#B07A45] hover:text-[#B07A45] transition-colors shadow-sm"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}

              {/* Loading indicator */}
              {loading && (
                <div className="flex items-center gap-2 px-1">
                  <div className="bg-[#EEE6DC] rounded-2xl px-3.5 py-2.5 shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#B07A45] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-[#B07A45] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-[#B07A45] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 border-t border-[#E3D9CD] bg-[#EEE6DC] px-4 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about Vantix..."
                disabled={loading}
                className="flex-1 rounded-full bg-[#F4EFE8] px-4 py-2 text-sm text-[#1C1C1C] placeholder-[#A39B90] outline-none focus:ring-1 focus:ring-[#B07A45]/50 shadow-inner disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-full bronze-btn hover:brightness-110 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
