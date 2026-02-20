"""Lead Scoring — Score leads 1-10 and generate personalized insights."""
import logging
import requests
from config import (
    SCORE_BASE, SCORE_NO_WEBSITE, SCORE_EMPLOYEE_SWEET_SPOT,
    SCORE_TITLE_OWNER_CEO, SCORE_TITLE_DIRECTOR,
    SCORE_EMAIL_VERIFIED, SCORE_INDUSTRY_FIT, TARGET_INDUSTRIES
)

log = logging.getLogger("leads.scorer")

OWNER_TITLES = {"owner", "ceo", "founder", "president", "co-founder", "co-owner"}
DIRECTOR_TITLES = {"director", "general manager", "director of operations", "vp", "vice president"}


def _check_website(url: str) -> dict:
    """Basic website quality check."""
    result = {"exists": False, "load_time": None, "has_viewport": False, "content_length": 0}
    if not url:
        return result
    if not url.startswith("http"):
        url = f"https://{url}"
    try:
        resp = requests.get(url, timeout=8, headers={"User-Agent": "Mozilla/5.0"}, allow_redirects=True)
        result["exists"] = resp.status_code == 200
        result["load_time"] = resp.elapsed.total_seconds()
        html = resp.text[:10000].lower()
        result["has_viewport"] = "viewport" in html
        result["content_length"] = len(resp.content)
    except Exception:
        pass
    return result


def score_lead(lead: dict) -> dict:
    """Score a lead 1-10 and add insight. Returns lead with 'score' and 'insight' fields."""
    score = SCORE_BASE
    reasons = []

    # Website check
    website = lead.get("website", "")
    if not website:
        score += SCORE_NO_WEBSITE  # Negative = easy sell (they NEED a website)
        reasons.append("No website detected — strong need for digital presence")
        site_info = {"exists": False}
    else:
        site_info = _check_website(website)
        if not site_info["exists"]:
            score += SCORE_NO_WEBSITE
            reasons.append("Website unreachable — may need rebuild")
        elif not site_info["has_viewport"]:
            score += 1
            reasons.append("Website not mobile-optimized")
        elif site_info["load_time"] and site_info["load_time"] > 3:
            score += 1
            reasons.append(f"Slow website ({site_info['load_time']:.1f}s load)")
        else:
            reasons.append("Website appears functional")

    # Employee sweet spot
    emp = lead.get("employee_count", 0)
    if 5 <= emp <= 50:
        score += SCORE_EMPLOYEE_SWEET_SPOT
        reasons.append(f"Sweet spot size ({emp} employees)")

    # Title scoring
    title = lead.get("title", "").lower()
    if any(t in title for t in OWNER_TITLES):
        score += SCORE_TITLE_OWNER_CEO
        reasons.append("Decision maker (C-level/Owner)")
    elif any(t in title for t in DIRECTOR_TITLES):
        score += SCORE_TITLE_DIRECTOR
        reasons.append("Decision maker (Director)")

    # Email verified
    if lead.get("email_status") in ("verified", "valid"):
        score += SCORE_EMAIL_VERIFIED
        reasons.append("Email verified")

    # Industry fit
    industry = lead.get("industry", "").lower()
    if any(ind in industry for ind in TARGET_INDUSTRIES):
        score += SCORE_INDUSTRY_FIT
        reasons.append(f"Target industry ({lead.get('industry', '')})")

    # Clamp score
    score = max(1, min(10, score))

    # Generate insight
    company = lead.get("company_name", "the company")
    if not website or not site_info.get("exists"):
        insight = (
            f"{company} currently lacks a strong online presence, making them an ideal candidate "
            f"for Vantix's AI-powered digital transformation. A modern website with automation "
            f"could significantly boost their customer acquisition."
        )
    elif site_info.get("load_time", 0) > 3 or not site_info.get("has_viewport"):
        insight = (
            f"{company}'s current website has room for improvement in speed and mobile experience. "
            f"Vantix could help modernize their digital presence and automate customer workflows."
        )
    else:
        insight = (
            f"{company} has an existing digital presence but could benefit from AI-powered automation. "
            f"Vantix can help them scale operations and improve customer engagement with smart tools."
        )

    lead["score"] = score
    lead["insight"] = insight
    lead["score_reasons"] = reasons
    log.info(f"Scored {lead.get('company_name', '?')}: {score}/10 — {', '.join(reasons)}")
    return lead


def score_leads(leads: list[dict]) -> list[dict]:
    """Score a batch of leads."""
    log.info(f"Scoring {len(leads)} leads...")
    return [score_lead(lead) for lead in leads]


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    test = {
        "company_name": "Test Restaurant",
        "contact_name": "John Doe",
        "email": "john@test.com",
        "website": "",
        "employee_count": 15,
        "title": "Owner",
        "industry": "restaurants",
        "email_status": "verified",
    }
    result = score_lead(test)
    print(f"Score: {result['score']}/10")
    print(f"Insight: {result['insight']}")
    print(f"Reasons: {result['score_reasons']}")
