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
    """Return email templates for the 3-email sequence, personalized per lead."""
    first = lead.get("first_name") or lead.get("contact_name", "").split()[0] if lead.get("contact_name") else "there"
    company = lead.get("company_name", "your business")
    insight = lead.get("insight", "")
    industry = lead.get("industry", "your industry")

    return {
        1: {
            "subject": f"Free AI Audit for {company}",
            "html": f"""<p>Hi {first},</p>
<p>I came across {company} and was impressed by what you've built in the {industry} space.</p>
<p>At <strong>Vantix</strong>, we help businesses like yours leverage AI to automate operations, 
boost customer engagement, and drive revenue — without the enterprise price tag.</p>
<p>I'd love to offer you a <strong>free AI audit</strong> — a quick analysis of where AI could 
save you time and money. No strings attached.</p>
<p><a href="{BOOKING_URL}">Book your free 30-minute consultation →</a></p>
<p>Best,<br>The Vantix Team</p>
<p style="color:#888;font-size:12px;">Reply STOP to unsubscribe.</p>"""
        },
        2: {
            "subject": f"Quick insight about {company}'s digital presence",
            "html": f"""<p>Hi {first},</p>
<p>Following up on my last note — I took a quick look at {company}'s online presence and noticed something:</p>
<p><em>{insight}</em></p>
<p>We recently helped a similar {industry} business increase their leads by 40% in just 30 days 
using AI-powered automation. Happy to share how.</p>
<p><a href="{BOOKING_URL}">Grab a free consultation →</a></p>
<p>Best,<br>The Vantix Team</p>
<p style="color:#888;font-size:12px;">Reply STOP to unsubscribe.</p>"""
        },
        3: {
            "subject": f"Last chance: Free AI strategy session for {company}",
            "html": f"""<p>Hi {first},</p>
<p>I know you're busy running {company}, so I'll keep this short.</p>
<p>We recently helped a {industry} business:</p>
<ul>
<li>Automate 80% of their customer follow-ups</li>
<li>Reduce response time from hours to seconds</li>
<li>Increase monthly revenue by 25%</li>
</ul>
<p>I have a few free consultation slots left this week. If you're curious how AI could 
work for {company}, let's chat.</p>
<p><a href="{BOOKING_URL}">Book your spot →</a></p>
<p>After this week, I won't be able to offer the free audit. Let's connect!</p>
<p>Best,<br>The Vantix Team</p>
<p style="color:#888;font-size:12px;">Reply STOP to unsubscribe.</p>"""
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
