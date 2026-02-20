"""Email Sequence Runner — Send follow-up emails to contacted leads."""
import sys
import json
import logging
import time
import argparse
from datetime import datetime, timezone, timedelta

from sync import get_leads_by_stage, update_lead, update_email_history, add_activity
from emailer import send_sequence_email
from config import MAX_EMAILS_PER_DAY, DELAY_BETWEEN_EMAILS_SEC, EMAIL_SEQUENCE_DAYS

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("leads-engine.log", encoding="utf-8"),
    ]
)
log = logging.getLogger("leads.sequence")


def _parse_history(lead: dict) -> list:
    """Parse email_history from lead (could be json string or list)."""
    hist = lead.get("email_history")
    if not hist:
        return []
    if isinstance(hist, str):
        try:
            return json.loads(hist)
        except json.JSONDecodeError:
            return []
    return hist


def _parse_activity(lead: dict) -> list:
    activity = lead.get("activity")
    if not activity:
        return []
    if isinstance(activity, str):
        try:
            return json.loads(activity)
        except json.JSONDecodeError:
            return []
    return activity


def run_sequence(dry_run: bool = True):
    """Check contacted leads and send next email if due."""
    log.info(f"=== SEQUENCE RUN {'(DRY RUN)' if dry_run else '(LIVE)'} ===")

    # Get leads in "contacted" and "new" stages
    contacted = get_leads_by_stage("contacted")
    new_leads = get_leads_by_stage("new")
    leads = contacted + new_leads

    if not leads:
        log.info("No leads in Contacted/Ready stage.")
        print("No leads to process.")
        return

    sent_today = 0
    now = datetime.now(timezone.utc)

    for lead in leads:
        if sent_today >= MAX_EMAILS_PER_DAY:
            log.warning(f"Daily send limit reached ({MAX_EMAILS_PER_DAY})")
            break

        # Skip if stage is "qualified" (replied/converted)
        if lead.get("stage") in ("qualified", "lost"):
            continue

        history = _parse_history(lead)
        activity = _parse_activity(lead)

        # Determine next email number
        sent_numbers = [h.get("email_number", 0) for h in history if h.get("status") in ("sent", "dry_run")]
        if not sent_numbers:
            next_email = 1
        else:
            last_sent = max(sent_numbers)
            if last_sent >= 3:
                continue  # Sequence complete
            next_email = last_sent + 1

        # Check timing
        if next_email > 1 and history:
            last_entry = max(history, key=lambda h: h.get("sent_at", ""))
            last_sent_at = datetime.fromisoformat(last_entry["sent_at"].replace("Z", "+00:00"))
            days_required = EMAIL_SEQUENCE_DAYS.get(next_email, 3)
            if now - last_sent_at < timedelta(days=days_required):
                continue  # Not time yet

        # Send
        log.info(f"Sending email #{next_email} to {lead['email']}")
        entry = send_sequence_email(lead, next_email, dry_run=dry_run)
        sent_today += 1

        # Update records
        update_email_history(lead["id"], entry, history)
        new_stage = "contacted" if lead.get("stage") == "new" else lead.get("stage")
        add_activity(lead["id"], f"Email #{next_email} {'sent' if not dry_run else 'drafted (dry run)'}", activity)
        update_lead(lead["id"], {"stage": new_stage})

        print(f"  {'📧' if not dry_run else '📝'} Email #{next_email} → {lead['email']} ({lead.get('company_name', '?')})")

        if not dry_run and sent_today < MAX_EMAILS_PER_DAY:
            time.sleep(DELAY_BETWEEN_EMAILS_SEC)

    print(f"\nSequence run complete: {sent_today} emails {'sent' if not dry_run else 'drafted'}")
    log.info(f"Sequence run done: {sent_today} processed")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Vantix Email Sequence Runner")
    parser.add_argument("--live", action="store_true", help="Actually send emails (default: dry run)")
    args = parser.parse_args()
    run_sequence(dry_run=not args.live)
