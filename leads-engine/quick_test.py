from apollo import search_leads

results = search_leads(per_page=3)
print(f"Found {len(results)} leads")
for r in results[:3]:
    org = r.get("organization", {}) or {}
    print(f"  - {org.get('name', '?')} | {r.get('name', '?')} | {r.get('email', '?')}")
