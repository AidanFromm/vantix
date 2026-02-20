import requests

key = 'TU4WRlbPfswcfLDWqC-i_w'
headers = {'X-Api-Key': key, 'Content-Type': 'application/json'}

# People search with header auth
r = requests.post('https://api.apollo.io/api/v1/mixed_people/search', 
    headers=headers,
    json={'person_locations': ['United States'], 'per_page': 3, 'person_titles': ['owner']})
print('People search:', r.status_code)
print(r.text[:500])

print('\n--- Org search ---')
r2 = requests.post('https://api.apollo.io/api/v1/mixed_organizations/search',
    headers=headers,
    json={'per_page': 3})
print('Org search:', r2.status_code)
print(r2.text[:500])

print('\n--- People match ---')
r3 = requests.post('https://api.apollo.io/api/v1/people/match',
    headers=headers,
    json={'domain': 'google.com'})
print('People match:', r3.status_code)
print(r3.text[:500])
