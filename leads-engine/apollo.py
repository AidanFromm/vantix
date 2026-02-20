"""Lead Sourcing — Uses Brave Search API to find businesses matching Vantix ICP.
Apollo.io free plan doesn't have API access, so we use Brave Search + website analysis."""
import logging
import re
import requests
import time
from config import TARGET_INDUSTRIES, TARGET_LOCATIONS, LEADS_PER_RUN

log = logging.getLogger("leads.apollo")

BRAVE_API_KEY = "BSAgTRbc_7GspMdM1cINSiiz6CIW-Mm"  # Free tier, 2000 queries/mo
BRAVE_URL = "https://api.search.brave.com/res/v1/web/search"

# Cities to rotate through
US_CITIES = [
    "Tampa FL", "Orlando FL", "Miami FL", "Jacksonville FL",
    "Newark NJ", "Jersey City NJ", "Trenton NJ", "Edison NJ",
    "Austin TX", "Dallas TX", "Houston TX", "San Antonio TX",
    "Charlotte NC", "Raleigh NC", "Nashville TN", "Atlanta GA",
    "Phoenix AZ", "Denver CO", "Portland OR", "Seattle WA",
    "Chicago IL", "Detroit MI", "Columbus OH", "Indianapolis IN",
    "Los Angeles CA", "San Diego CA", "Sacramento CA",
    "Boston MA", "Philadelphia PA", "Pittsburgh PA",
    "Las Vegas NV", "Salt Lake City UT", "Minneapolis MN"
]

NICHES = [
    "restaurant", "dental office", "law firm", "auto repair",
    "fitness gym", "real estate agency", "landscaping company",
    "construction company", "medical practice", "retail store",
    "barbershop", "salon", "plumber", "electrician",
    "cleaning service", "roofing company", "accounting firm",
    "pet grooming", "daycare", "chiropractor"
]


def search_leads(city=None, niche=None, per_page=None):
    """Search for businesses without websites using Brave Search."""
    per_page = per_page or LEADS_PER_RUN
    leads = []

    if city and niche:
        queries = [f'site:facebook.com "{niche}" "{city}" -site:yelp.com']
    else:
        # Auto-generate queries from rotation
        import random
        cities = random.sample(US_CITIES, min(5, len(US_CITIES)))
        niches = random.sample(NICHES, min(4, len(NICHES)))
        queries = []
        for c in cities:
            for n in niches[:2]:
                queries.append(f'site:facebook.com "{n}" "{c}" -site:yelp.com')

    for query in queries:
        if len(leads) >= per_page:
            break

        try:
            r = requests.get(BRAVE_URL, headers={"X-Subscription-Token": BRAVE_API_KEY},
                           params={"q": query, "count": 10})
            time.sleep(1.1)  # Rate limit: 1 req/sec

            if not r.ok:
                log.warning(f"Brave search error {r.status_code}: {r.text[:200]}")
                continue

            results = r.json().get("web", {}).get("results", [])
            for item in results:
                lead = _parse_brave_result(item, query)
                if lead and lead["email"] != "?" and not _is_duplicate(lead, leads):
                    leads.append(lead)

        except Exception as e:
            log.error(f"Search error: {e}")
            continue

    log.info(f"Found {len(leads)} leads from Brave Search")
    return leads[:per_page]


def _parse_brave_result(item, query):
    """Parse a Brave search result into a lead dict."""
    title = item.get("title", "")
    desc = item.get("description", "")
    url = item.get("url", "")

    # Skip non-business results
    if not any(x in url.lower() for x in ["facebook.com", "fb.com"]):
        return None

    # Extract business name from title
    name = title.split(" - ")[0].split(" | ")[0].strip()
    if not name or len(name) < 3:
        return None

    # Try to extract phone from description
    phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', desc)
    phone = phone_match.group(0) if phone_match else None

    # Extract city from query
    city_match = re.search(r'"([^"]+)"', query)
    niche_match = re.findall(r'"([^"]+)"', query)
    city = niche_match[1] if len(niche_match) > 1 else "Unknown"
    niche = niche_match[0] if niche_match else "Unknown"

    # Parse state from city
    parts = city.split()
    state = parts[-1] if len(parts) > 1 else ""
    city_name = " ".join(parts[:-1]) if len(parts) > 1 else city

    return {
        "company_name": name,
        "contact_name": "",
        "email": "?",  # Will be enriched later
        "phone": phone,
        "website": url,
        "industry": niche,
        "city": city_name,
        "state": state,
        "employee_count": None,
        "source": "Brave",
        "facebook_url": url,
    }


def enrich_lead(lead):
    """Try to find email and website for a lead using Brave Search."""
    name = lead.get("company_name", "")
    city = lead.get("city", "")

    try:
        # Search for the business directly
        query = f'"{name}" "{city}" email contact'
        r = requests.get(BRAVE_URL, headers={"X-Subscription-Token": BRAVE_API_KEY},
                       params={"q": query, "count": 5})
        time.sleep(1.1)

        if r.ok:
            results = r.json().get("web", {}).get("results", [])
            for item in results:
                desc = item.get("description", "")
                url = item.get("url", "")

                # Find email
                email_match = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', desc)
                if email_match and "facebook" not in url:
                    lead["email"] = email_match.group(0)

                # Find real website (not social media)
                if not any(s in url for s in ["facebook", "yelp", "instagram", "twitter", "linkedin"]):
                    lead["website"] = url
                    break

    except Exception as e:
        log.error(f"Enrich error for {name}: {e}")

    return lead


def _is_duplicate(lead, existing):
    """Check if lead already exists by name."""
    name = lead.get("company_name", "").lower()
    return any(l.get("company_name", "").lower() == name for l in existing)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    results = search_leads(city="Tampa FL", niche="restaurant", per_page=5)
    print(f"\nFound {len(results)} leads:")
    for r in results:
        print(f"  {r['company_name']} | {r['city']}, {r['state']} | {r['phone'] or 'no phone'}")
