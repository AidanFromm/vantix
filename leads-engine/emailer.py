"""Email Sequence System — Send personalized email sequences via Resend API."""
import logging
import time
import json
from datetime import datetime, timezone
import requests
from config import (
    RESEND_API_KEY, EMAIL_FROM, EMAIL_FROM_FALLBACK,
    MAX_EMAILS_PER_DAY, DELAY_BETWEEN_EMAILS_SEC,
    EMAIL_SEQUENCE_DAYS, BOOKING_URL
)

log = logging.getLogger("leads.emailer")


def _email_templates(lead: dict) -> dict[int, dict]:
    """Return email templates for the 3-email sequence, personalized per lead.
    
    RULES (anti-spam, high-conversion):
    - Plain text style only (simple <p> tags, no <a>, <strong>, <ul>, <pre>)
    - Under 125 words (50-100 optimal)
    - One CTA only — reply or call
    - From a real person (Aidan), not "The Vantix Team"
    - No HTML links — just plain URLs
    - No images, buttons, or fancy formatting
    - Signature: Aidan Fromm / Vantix / phone / url
    """
    first = lead.get("first_name") or (lead.get("contact_name", "").split()[0] if lead.get("contact_name") else "there")
    if first.lower() in ("owner", "manager", "unknown", ""):
        first = "there"
    company = lead.get("company_name", "your business")
    industry = lead.get("industry", "business")
    city = lead.get("city", "")
    state = lead.get("state", "")
    location = f"{city}, {state}" if city and state else city or state or "your area"
    insight = lead.get("insight", "")

    def _to_html(text: str) -> str:
        """Convert plain text to minimal HTML — looks like a real email."""
        lines = text.strip().split("\n")
        out = []
        for line in lines:
            if line.strip() == "":
                out.append("<br>")
            else:
                out.append(f"<p style='margin:0 0 2px 0;color:#1a1a1a;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;'>{line}</p>")
        return f"<div style='max-width:600px;'>{chr(10).join(out)}</div>"

    return {
        1: {
            "subject": f"{company} — quick thought",
            "html": _to_html(f"""Hi {first},

I was looking at {industry} businesses in {location} and came across {company}.

Right now, when someone searches Google for a {industry} near them, they're finding your competitors instead of you. That's real money walking out the door every week.

We just built a full online system for a retail store in Tampa — took 3 weeks, and they're already picking up customers they were invisible to before.

Would it make sense to do a quick 10-minute call so I can show you what we'd do for {company}? No pitch, just an honest look at what you're missing.

Aidan Fromm
Vantix | 914-888-6610 | usevantix.com""")
        },
        2: {
            "subject": f"re: {company} — quick thought",
            "html": _to_html(f"""Hi {first},

Wanted to follow up on my last email — I know you're busy running {company}, so I'll keep this short.

I ran a quick check on how {company} shows up online right now:

- No website means Google can't send you customers
- Your competitors with websites are ranking above you
- You're relying 100% on word of mouth, which caps your growth

We fix this in about 3 weeks — website, online booking, Google visibility, the works. Our clients see results in the first month.

Worth a 10-minute conversation?

Aidan
914-888-6610 | usevantix.com""")
        },
        3: {
            "subject": "closing the loop",
            "html": _to_html(f"""Hi {first},

I've reached out a couple times about helping {company} get found online — I don't want to be a pest, so this will be my last email.

If getting more customers through Google and having a professional online presence is something you'd want to explore, I'm here. Just reply to this email or text me at 914-888-6610.

Either way, wishing you the best with {company}.

Aidan
914-888-6610 | usevantix.com""")
        },
    }


def send_email(to: str, subject: str, html: str, dry_run: bool = True) -> dict:
    """Send a single email via Resend API. Returns API response or dry_run marker."""
    if dry_run:
        log.info(f"[DRY RUN] Would send to {to}: {subject}")
        return {"id": "dry_run", "status": "dry_run"}

    payload = {
        "from": EMAIL_FROM,
        "to": [to],
        "subject": subject,
        "html": html,
    }
    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        resp = requests.post("https://api.resend.com/emails", headers=headers, json=payload, timeout=15)
        if resp.status_code == 403 and "domain" in resp.text.lower():
            log.warning(f"Domain not verified, falling back to {EMAIL_FROM_FALLBACK}")
            payload["from"] = EMAIL_FROM_FALLBACK
            resp = requests.post("https://api.resend.com/emails", headers=headers, json=payload, timeout=15)
        resp.raise_for_status()
        result = resp.json()
        log.info(f"Email sent to {to}: {result.get('id', 'ok')}")
        return result
    except requests.RequestException as e:
        log.error(f"Failed to send email to {to}: {e}")
        return {"error": str(e)}


def draft_email(lead: dict, email_number: int = 1) -> dict:
    """Prepare an email for a lead without sending. Returns email data."""
    templates = _email_templates(lead)
    template = templates.get(email_number, templates[1])
    return {
        "to": lead["email"],
        "subject": template["subject"],
        "html": template["html"],
        "email_number": email_number,
        "drafted_at": datetime.now(timezone.utc).isoformat(),
    }


def send_sequence_email(lead: dict, email_number: int, dry_run: bool = True) -> dict:
    """Send a specific email in the sequence for a lead."""
    templates = _email_templates(lead)
    template = templates.get(email_number)
    if not template:
        log.error(f"No template for email #{email_number}")
        return {"error": "invalid_email_number"}

    result = send_email(lead["email"], template["subject"], template["html"], dry_run=dry_run)

    # Build history entry
    history_entry = {
        "email_number": email_number,
        "subject": template["subject"],
        "sent_at": datetime.now(timezone.utc).isoformat(),
        "status": "sent" if not dry_run else "dry_run",
        "resend_id": result.get("id", ""),
    }
    return history_entry


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    test_lead = {
        "first_name": "John",
        "contact_name": "John Doe",
        "company_name": "Acme Restaurant",
        "email": "test@example.com",
        "industry": "restaurants",
        "insight": "Acme Restaurant lacks a mobile-optimized website.",
    }
    draft = draft_email(test_lead, 1)
    print(f"Draft: {draft['subject']}")
    result = send_sequence_email(test_lead, 1, dry_run=True)
    print(f"Result: {result}")
