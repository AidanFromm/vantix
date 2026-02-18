"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  ArrowLeft,
  ExternalLink,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  quickReplies?: string[];
  linkLabel?: string;
  linkHref?: string;
  collectField?: CollectField;
}

type CollectField = "name" | "email" | "phone";

interface Lead {
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  timestamp?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const uid = () => Math.random().toString(36).slice(2, 10);

const TYPING_DELAY = 900;

const STORAGE_KEY = "vantix_chat_leads";

async function saveLeadToStorage(lead: Lead) {
  // Save to localStorage as fallback
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const leads: Lead[] = raw ? JSON.parse(raw) : [];
    leads.push({ ...lead, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    /* noop */
  }
  // Save to Supabase
  try {
    const { createLead } = await import('@/lib/supabase');
    await createLead({
      name: lead.name || 'Chat Visitor',
      email: lead.email || undefined,
      phone: lead.phone || undefined,
      source: 'Chat Widget',
      status: 'new',
      notes: lead.interest ? `Interest: ${lead.interest}` : undefined,
      score: 0,
      tags: ['chat-widget'],
    });
  } catch {
    /* Supabase may not be available */
  }
}

// ---------------------------------------------------------------------------
// Flows
// ---------------------------------------------------------------------------

function buildFlow(
  choice: string
): { messages: Message[]; nextCollect?: CollectField } {
  switch (choice) {
    case "I need a website":
      return {
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "We design and develop high-performance websites tailored to your brand — from landing pages to full-stack web applications. Every project includes responsive design, SEO optimization, and a custom CMS so you stay in control.",
          },
          {
            id: uid(),
            role: "bot",
            text: "Tell us a bit about your business so we can scope the right solution. What is your name?",
            collectField: "name",
          },
        ],
      };

    case "I want AI automation":
      return {
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "We build AI-powered automations that save hours of manual work — intelligent chatbots, automated lead qualification, smart scheduling, data pipelines, and more. If a process is repetitive, we can probably automate it.",
          },
          {
            id: uid(),
            role: "bot",
            text: "What kind of task or workflow are you looking to automate? First, drop your name so we know who we are talking to.",
            collectField: "name",
          },
        ],
      };

    case "Tell me about pricing":
      return {
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Every project is custom-quoted. We typically start at $899 for websites and scale based on complexity. AI automations vary depending on scope.",
          },
          {
            id: uid(),
            role: "bot",
            text: "Want a free consultation to get an exact quote? Drop your name and we will set it up.",
            collectField: "name",
          },
        ],
      };

    case "Book a consultation":
      return {
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "You can book a free consultation directly using the link below. We will walk through your project, answer questions, and give you a clear roadmap.",
            linkLabel: "Book on Cal.com",
            linkHref: "/#booking",
          },
        ],
      };

    default:
      return {
        messages: [
          {
            id: uid(),
            role: "bot",
            text: "Great question! Let me connect you with our team. Drop your email and we will get back to you within 24 hours.",
            collectField: "email",
          },
        ],
      };
  }
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "bot",
    text: "Hey! I'm Vantix AI. What can I help you with today?",
    quickReplies: [
      "I need a website",
      "I want AI automation",
      "Tell me about pricing",
      "Book a consultation",
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [currentLead, setCurrentLead] = useState<Lead>({});
  const [awaitingField, setAwaitingField] = useState<CollectField | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const addBotMessages = useCallback(
    (msgs: Message[]) => {
      let delay = 0;
      msgs.forEach((msg, i) => {
        delay += TYPING_DELAY;
        setTimeout(() => {
          if (i === msgs.length - 1) setTyping(false);
          setMessages((prev) => [...prev, msg]);
          if (msg.collectField) setAwaitingField(msg.collectField);
        }, delay);
      });
      if (msgs.length) setTyping(true);
    },
    []
  );

  const handleQuickReply = useCallback(
    (text: string) => {
      const userMsg: Message = { id: uid(), role: "user", text };
      setMessages((prev) => [...prev, userMsg]);

      const flow = buildFlow(text);
      setCurrentLead((prev) => ({ ...prev, interest: text }));
      addBotMessages(flow.messages);
    },
    [addBotMessages]
  );

  const nextCollectPrompt = useCallback(
    (field: CollectField, lead: Lead): Message | null => {
      if (field === "name" && !lead.email) {
        return {
          id: uid(),
          role: "bot",
          text: "Thanks! What is your email address?",
          collectField: "email",
        };
      }
      if (
        (field === "name" || field === "email") &&
        !lead.phone &&
        lead.email
      ) {
        return {
          id: uid(),
          role: "bot",
          text: "And a phone number where we can reach you?",
          collectField: "phone",
        };
      }
      if (field === "phone" || (field === "email" && lead.phone)) {
        saveLeadToStorage(lead);
        return {
          id: uid(),
          role: "bot",
          text: "Perfect — we have everything we need. Someone from our team will be in touch shortly. Thanks for reaching out!",
        };
      }
      return null;
    },
    []
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const userMsg: Message = { id: uid(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    if (awaitingField) {
      const updatedLead = { ...currentLead, [awaitingField]: text };
      setCurrentLead(updatedLead);
      setAwaitingField(null);

      const next = nextCollectPrompt(awaitingField, updatedLead);
      if (next) addBotMessages([next]);
      return;
    }

    const flow = buildFlow(text);
    addBotMessages(flow.messages);
  }, [input, awaitingField, currentLead, addBotMessages, nextCollectPrompt]);

  const handleReset = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setCurrentLead({});
    setAwaitingField(null);
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
            style={{
              backgroundColor: '#B07A45',
            }}
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
              w-[calc(100vw-3rem)] max-w-[400px] h-[500px]
              sm:w-[400px]
              max-sm:bottom-0 max-sm:right-0 max-sm:w-full max-sm:h-full max-sm:rounded-none max-sm:border-0"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E3D9CD] bg-[#EEE6DC] px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="text-[#E3D9CD] hover:text-[#B07A45] transition-colors"
                  aria-label="Reset chat"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#8E5E34]" />
                  <span className="text-sm font-medium text-[#B07A45]">
                    Vantix AI
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#E3D9CD] hover:text-[#B07A45] transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "bot"
                        ? "bg-[#EEE6DC] text-[#B07A45] shadow-sm"
                        : "ml-auto text-[#8E5E34]"
                    }`}
                    style={
                      msg.role === "user"
                        ? { background: '#B07A45', color: '#fff' }
                        : undefined
                    }
                  >
                    {msg.text}
                    {msg.linkHref && (
                      <a
                        href={msg.linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex items-center gap-1.5 text-[#8E5E34] underline underline-offset-2 hover:text-[#B07A45]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {msg.linkLabel || "Open link"}
                      </a>
                    )}
                  </div>
                  {/* Quick replies */}
                  {msg.quickReplies && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.quickReplies.map((qr) => (
                        <button
                          key={qr}
                          onClick={() => handleQuickReply(qr)}
                          className="rounded-full border border-[#E3D9CD] bg-[#EEE6DC] px-3 py-1.5 text-xs text-[#7A746C] hover:border-[#8E5E34] hover:text-[#8E5E34] transition-colors shadow-xs"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex items-center gap-1.5 px-3.5 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-[#8E5E34]" />
                  <span className="text-xs text-[#E3D9CD]">
                    Vantix AI is typing...
                  </span>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 border-t border-[#E3D9CD] bg-[#EEE6DC] px-4 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full bg-[#F4EFE8] px-4 py-2 text-sm text-[#B07A45] placeholder-[#E3D9CD] outline-none focus:ring-1 focus:ring-[#8E5E34]/50 shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim()}
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