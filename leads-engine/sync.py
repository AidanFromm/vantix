"""Supabase Sync — Push leads and update activity timelines."""
import logging
import json
from datetime import datetime, timezone
import requests
from config import SUPABASE_URL, SUPABASE_KEY

log = logging.getLogger("leads.sync")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}
TABLE_URL = f"{SUPABASE_URL}/rest/v1/leads"


def _now():
    return datetime.now(timezone.utc).isoformat()


def upsert_lead(lead: dict) -> dict | None:
    """Insert or update a lead by email. Returns the upserted row."""
    now = _now()
    row = {
        "company_name": lead.get("company_name", ""),
        "contact_name": lead.get("contact_name", ""),
        "email": lead["email"],
        "phone": lead.get("phone", ""),
        "website": lead.get("website", ""),
        "score": lead.get("score", 0),
        "stage": lead.get("stage", "new"),  # enum: new, contacted, qualified, lost
        "source": lead.get("source", "cold_outreach"),  # enum: cold_outreach, website, referral, social_media, other
        "ai_audit": lead.get("insight", ""),
        "notes": lead.get("notes", ""),
        "industry": lead.get("industry", ""),
        "city": lead.get("city", ""),
        "state": lead.get("state", ""),
        "employee_count": lead.get("employee_count", 0),
        "updated_at": now,
    }

    # Check if exists
    existing = get_lead_by_email(lead["email"])
    if existing:
        # Update
        lead_id = existing["id"]
        resp = requests.patch(
            f"{TABLE_URL}?id=eq.{lead_id}",
            headers={**HEADERS, "Prefer": "return=representation"},
            json=row,
            timeout=15,
        )
    else:
        # Insert
        row["created_at"] = now
        row["activity"] = json.dumps([{"event": "Lead created", "timestamp": now, "source": "apollo"}])
        resp = requests.post(TABLE_URL, headers=HEADERS, json=row, timeout=15)

    if resp.status_code in (200, 201):
        data = resp.json()
        result = data[0] if isinstance(data, list) and data else data
        log.info(f"{'Updated' if existing else 'Created'} lead: {lead['email']}")
        return result
    else:
        log.error(f"Supabase upsert failed ({resp.status_code}): {resp.text[:300]}")
        return None


def get_lead_by_email(email: str) -> dict | None:
    """Fetch a lead by email."""
    resp = requests.get(
        f"{TABLE_URL}?email=eq.{email}&limit=1",
        headers=HEADERS, timeout=10,
    )
    if resp.status_code == 200:
        data = resp.json()
        return data[0] if data else None
    return None


def get_leads_by_stage(stage: str) -> list[dict]:
    """Fetch all leads with a given stage."""
    resp = requests.get(
        f"{TABLE_URL}?stage=eq.{stage}&order=updated_at.desc",
        headers=HEADERS, timeout=15,
    )
    if resp.status_code == 200:
        return resp.json()
    log.error(f"Failed to fetch leads by stage ({resp.status_code}): {resp.text[:200]}")
    return []


def update_lead(lead_id, updates: dict) -> bool:
    """Update specific fields on a lead."""
    updates["updated_at"] = _now()
    resp = requests.patch(
        f"{TABLE_URL}?id=eq.{lead_id}",
        headers=HEADERS, json=updates, timeout=10,
    )
    if resp.status_code in (200, 204):
        log.info(f"Updated lead {lead_id}: {list(updates.keys())}")
        return True
    log.error(f"Update failed ({resp.status_code}): {resp.text[:200]}")
    return False


def add_activity(lead_id: str, event: str, existing_activity: list = None):
    """Append an activity event to a lead's timeline."""
    if existing_activity is None:
        existing_activity = []
    existing_activity.append({"event": event, "timestamp": _now()})
    update_lead(lead_id, {"activity": json.dumps(existing_activity)})


def update_email_history(lead_id: str, history_entry: dict, existing_history: list = None):
    """Append to a lead's email_history jsonb field."""
    if existing_history is None:
        existing_history = []
    existing_history.append(history_entry)
    update_lead(lead_id, {
        "email_history": json.dumps(existing_history),
        "last_contacted": _now(),
    })


def sync_leads(leads: list[dict]) -> tuple[int, int]:
    """Sync a batch of leads to Supabase. Returns (created, updated) counts."""
    created, updated = 0, 0
    for lead in leads:
        existing = get_lead_by_email(lead["email"])
        result = upsert_lead(lead)
        if result:
            if existing:
                updated += 1
            else:
                created += 1
    log.info(f"Sync complete: {created} created, {updated} updated")
    return created, updated


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    test = {
        "company_name": "Test Co",
        "contact_name": "Jane Doe",
        "email": "test-vantix@example.com",
        "score": 7,
        "source": "test",
    }
    result = upsert_lead(test)
    print(f"Result: {result}")
