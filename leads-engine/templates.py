"""Vantix Outreach Email Templates — Research-backed, high-conversion.

KEY PRINCIPLES (from top cold email research):
1. Plain text only — no HTML buttons, no images, no fancy formatting
   (Plain text emails get 2-3x higher reply rates than HTML)
2. Short — under 125 words (optimal is 50-100 words)
3. One CTA only — don't give multiple options
4. Personalized first line — reference their specific business
5. No "we" heavy language — focus on THEM
6. Subject line under 7 words — curiosity-driven, lowercase
7. Sent from a real person's name, not a company name
8. No unsubscribe link in first email (CAN-SPAM allows if legitimate B2B)
9. Follow-up emails are even shorter than the first
"""


def email_1_intro(lead: dict) -> dict:
    """Email 1: The Opener — sent Day 0.
    Uses PAS framework (Problem-Agitate-Solve)."""
    
    name = lead.get("contact_name", "").split()[0] if lead.get("contact_name") else "there"
    if name.lower() in ("owner", "manager", "unknown", ""): 
        name = "there"
    
    company = lead.get("company_name", "your business")
    city = lead.get("city", "")
    state = lead.get("state", "")
    industry = lead.get("industry", "business")
    audit = lead.get("ai_audit", "")
    
    # Pick the best personalized opener based on what we know
    if audit:
        # Use the AI audit insight as the opener
        opener = audit.split(".")[0] + "."
    elif city:
        opener = f"I was looking at {industry} businesses in {city} and came across {company}."
    else:
        opener = f"I came across {company} and had a quick thought."
    
    location = f"{city}, {state}" if city and state else city or state or ""
    
    subject = f"{company} — quick thought"
    
    body = f"""Hi {name},

{opener}

Right now, when someone in {location or 'your area'} searches Google for a {industry} near them, they're finding your competitors instead of you. That's real money walking out the door every week.

We just built a full online system for a retail store in Tampa — took 3 weeks, and they're already picking up customers they were invisible to before.

Would it make sense to do a quick 10-minute call so I can show you what we'd do for {company}? No pitch, just an honest look at what you're missing.

Aidan Fromm
Vantix | 914-888-6610 | usevantix.com"""
    
    return {"subject": subject, "body": body}


def email_2_value(lead: dict) -> dict:
    """Email 2: The Value Add — sent Day 3.
    Shorter, provides specific value, references Email 1."""
    
    name = lead.get("contact_name", "").split()[0] if lead.get("contact_name") else "there"
    if name.lower() in ("owner", "manager", "unknown", ""): 
        name = "there"
    
    company = lead.get("company_name", "your business")
    industry = lead.get("industry", "business")
    
    subject = f"re: {company} — quick thought"
    
    body = f"""Hi {name},

Wanted to follow up on my last email — I know you're busy running {company}, so I'll keep this short.

I ran a quick check on how {company} shows up online right now. Here's what I found:

- No website means Google can't send you customers
- Your competitors with websites are ranking above you in local search
- You're relying 100% on word of mouth and social media, which caps your growth

We fix this in about 3 weeks — website, online booking, Google visibility, the works. Our clients see results in the first month.

Worth a 10-minute conversation?

Aidan
914-888-6610 | usevantix.com"""
    
    return {"subject": subject, "body": body}


def email_3_final(lead: dict) -> dict:
    """Email 3: The Breakup — sent Day 7.
    Shortest email. Creates urgency without being pushy."""
    
    name = lead.get("contact_name", "").split()[0] if lead.get("contact_name") else "there"
    if name.lower() in ("owner", "manager", "unknown", ""): 
        name = "there"
    
    company = lead.get("company_name", "your business")
    
    subject = f"closing the loop"
    
    body = f"""Hi {name},

I've reached out a couple times about helping {company} get found online — I don't want to be a pest, so this will be my last email.

If getting more customers through Google and having a professional online presence is something you'd want to explore, I'm here. Just reply to this email or call me at 914-888-6610.

Either way, wishing you the best with {company}.

Aidan
914-888-6610 | usevantix.com"""
    
    return {"subject": subject, "body": body}


def get_template(lead: dict, email_number: int) -> dict:
    """Get the right template for the email sequence number."""
    templates = {1: email_1_intro, 2: email_2_value, 3: email_3_final}
    fn = templates.get(email_number, email_1_intro)
    return fn(lead)


def to_html(body: str) -> str:
    """Convert plain text email to minimal HTML (just preserves line breaks).
    No fancy styling — looks like a real email from a real person."""
    lines = body.strip().split("\n")
    html_lines = []
    for line in lines:
        if line.strip() == "":
            html_lines.append("<br>")
        else:
            html_lines.append(f"<p style='margin:0 0 2px 0;color:#1a1a1a;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;'>{line}</p>")
    return f"<div style='max-width:600px;'>{chr(10).join(html_lines)}</div>"


# Preview
if __name__ == "__main__":
    test_lead = {
        "company_name": "Pete's Lawn Service LLC",
        "contact_name": "Pete",
        "city": "Toms River",
        "state": "NJ",
        "industry": "landscaping",
        "ai_audit": "10+ years in business with 1000+ clients but zero website presence."
    }
    
    for i in [1, 2, 3]:
        t = get_template(test_lead, i)
        print(f"\n{'='*50}")
        print(f"EMAIL {i}")
        print(f"Subject: {t['subject']}")
        print(f"{'='*50}")
        print(t["body"])
