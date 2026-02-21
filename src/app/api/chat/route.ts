import { NextRequest, NextResponse } from 'next/server';

// Groq API (OpenAI-compatible) — free tier, Llama 3.1 70B
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are the Vantix AI assistant on usevantix.com — the website for Vantix, an AI-first consulting agency.

## About Vantix
- AI-first consulting agency that builds websites, web apps, dashboards, and AI automation systems
- Founded by Aidan Fromm and Kyle — two humans plus two AI assistants working 24/7
- Based in the US, serving clients worldwide
- Phone: (908) 498-7753
- Email: hello@usevantix.com
- Website: usevantix.com

## Services
1. **Custom Websites & Web Apps** — Full-stack development (React, Next.js, Supabase, Vercel). From landing pages to complex platforms. Starting around $899.
2. **AI Automation** — Chatbots, lead qualification, automated workflows, data pipelines, AI agents. If it's repetitive, we automate it.
3. **Dashboards & Analytics** — Real-time business intelligence dashboards, CRM systems, inventory management.
4. **E-Commerce Platforms** — Custom Shopify replacements, inventory systems, POS integrations, payment processing.
5. **Ongoing Maintenance** — $100/month plans for hosting, updates, monitoring, and support.

## Tech Stack
Next.js, React, TypeScript, Supabase, Vercel, Tailwind CSS, Stripe, Resend, n8n, and 15+ other tools.

## Key Facts
- Every project is custom-quoted — no cookie-cutter templates
- Average delivery: 2-4 weeks depending on scope
- Free 30-minute consultation available (book at usevantix.com)
- We've built 122+ pages for a single client project
- AI agents run 24/7 monitoring, lead gen, and operations
- Recent client: SecuredTampa — 122-page e-commerce platform with Clover POS integration, built in 3 weeks

## Your Behavior
- Be helpful, friendly, and concise (2-3 sentences max per response)
- Answer questions about Vantix services, pricing, process, and capabilities
- If someone seems interested, encourage them to book a free consultation at the booking section (scroll down on the site or go to usevantix.com/#booking)
- If they want to leave contact info, collect their name, email, and what they need — say you'll have someone reach out
- Never make up specific pricing — say "every project is custom-quoted" and suggest booking a call
- Never pretend to be human — you're an AI assistant for Vantix
- Keep responses short and conversational — this is a chat widget, not an essay
- If asked about competitors or other agencies, be professional — focus on what makes Vantix unique (AI-first, 24/7 operations, fast delivery)
- If you don't know something specific, say "I'd recommend chatting with our team directly" and point to booking

## Lead Capture
When a visitor shows buying intent or asks about getting started, naturally guide them to share:
1. Their name
2. Their email
3. What they're looking for

Don't be pushy — work it into the conversation naturally.`;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Chat service not configured' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !messages.length) {
      return NextResponse.json(
        { error: 'Messages required' },
        { status: 400 }
      );
    }

    // Prepend system prompt
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-20), // Keep last 20 messages for context window
    ];

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: fullMessages,
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Groq API error:', err);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm having trouble right now. Please try again or book a consultation at usevantix.com/#booking";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
