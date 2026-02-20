"""HUNTER Agent — Main orchestrator for lead generation pipeline."""
import sys
import logging
import argparse
from datetime import datetime, timezone

from apollo import search_leads, enrich_lead
from scorer import score_leads
from sync import sync_leads, upsert_lead
from emailer import draft_email

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("leads-engine.log", encoding="utf-8"),
    ]
)
log = logging.getLogger("leads.hunter")


def run(city=None, niche=None, per_page=50, dry_run=True):
    """Full pipeline: source -> enrich -> score -> sync -> draft emails."""
    log.info(f"=== HUNTER RUN {datetime.now(timezone.utc).isoformat()} ===")
    log.info(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")

    # 1. Pull leads from Brave Search
    log.info("Step 1: Sourcing leads from Brave Search...")
    leads = search_leads(city=city, niche=niche, per_page=per_page)
    if not leads:
        log.warning("No leads found.")
        print("\nNo leads found. Try different city/niche.")
        return

    log.info(f"Found {len(leads)} raw leads")

    # 2. Enrich leads (find emails, websites)
    log.info("Step 2: Enriching leads...")
    enriched = []
    for lead in leads:
        lead = enrich_lead(lead)
        enriched.append(lead)
    
    # Filter to leads with emails
    with_email = [l for l in enriched if l.get("email") and l["email"] != "?"]
    log.info(f"Enriched: {len(with_email)}/{len(enriched)} have emails")

    # 3. Score each lead
    log.info("Step 3: Scoring leads...")
    scored = score_leads(with_email)

    # 4. Sync to Supabase
    log.info("Step 4: Syncing to Supabase...")
    created, updated = sync_leads(scored)

    # 5. Draft Email 1 for new high-scoring leads
    log.info("Step 5: Drafting outreach emails...")
    ready_count = 0
    high_score_count = 0
    for lead in scored:
        if lead["score"] >= 7:
            high_score_count += 1
        draft = draft_email(lead, email_number=1)
        lead["email_draft"] = draft
        lead["stage"] = "New"
        ready_count += 1

    # Update stages in Supabase
    for lead in scored:
        upsert_lead(lead)

    # Summary
    print(f"\n{'='*50}")
    print(f"  HUNTER RUN COMPLETE")
    print(f"{'='*50}")
    print(f"  Leads found:        {len(leads)}")
    print(f"  With email:         {len(with_email)}")
    print(f"  Scored 7+:          {high_score_count}")
    print(f"  Ready for outreach: {ready_count}")
    print(f"  Synced (new/upd):   {created}/{updated}")
    print(f"  Mode:               {'DRY RUN' if dry_run else 'LIVE'}")
    print(f"{'='*50}\n")

    # Top leads
    top = sorted(scored, key=lambda x: x["score"], reverse=True)[:10]
    if top:
        print("  Top Leads:")
        for i, l in enumerate(top, 1):
            print(f"  {i}. [{l['score']}/10] {l.get('contact_name', '?')} @ {l['company_name']} - {l['email']}")
    print()

    log.info(f"Run complete: {len(leads)} found, {len(with_email)} enriched, {high_score_count} scored 7+")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="HUNTER - Vantix Lead Generation Agent")
    parser.add_argument("--live", action="store_true", help="Run in LIVE mode")
    parser.add_argument("--city", type=str, help="Target city (e.g. 'Tampa FL')")
    parser.add_argument("--niche", type=str, help="Target niche (e.g. 'restaurant')")
    parser.add_argument("--count", type=int, default=20, help="Leads per run")
    args = parser.parse_args()

    run(city=args.city, niche=args.niche, per_page=args.count, dry_run=not args.live)
