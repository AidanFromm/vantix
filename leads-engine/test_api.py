import requests

key = 'TU4WRlbPfswcfLDWqC-i_w'

# Try organization search
r = requests.post('https://api.apollo.io/api/v1/mixed_organizations/search', json={
    'api_key': key,
    'organization_num_employees_ranges': ['1,50'],
    'organization_locations': ['United States'],
    'per_page': 3
})
print('Org search:', r.status_code)
if r.ok:
    data = r.json()
    orgs = data.get('organizations', [])
    print(f'Found {len(orgs)} orgs')
    for o in orgs[:3]:
        name = o.get('name', '?')
        url = o.get('website_url', '?')
        emp = o.get('estimated_num_employees', '?')
        print(f'  {name} | {url} | {emp} emp')
else:
    print(r.text[:500])

# Try people enrich (free endpoint)
print('\n--- People Enrich ---')
r2 = requests.post('https://api.apollo.io/api/v1/people/match', json={
    'api_key': key,
    'domain': 'google.com',
    'first_name': 'Sundar',
    'last_name': 'Pichai'
})
print('People match:', r2.status_code)
if r2.ok:
    person = r2.json().get('person', {})
    print(f'  {person.get("name")} | {person.get("email")}')
else:
    print(r2.text[:500])
