# Dashboard Fix Plan — Feb 18, 2026

## Pages with MOCK/SEED data that needs removal:
1. **calls** — `mockCalls` hardcoded (L16)
2. **deal-room** — `mockDeals` hardcoded (L16)
3. **knowledge** — `SEED_ARTICLES` fallback (L20)
4. **media** — `SEED_MEDIA` fallback (L41)
5. **portfolio** — `mockPortfolio` hardcoded (L17)
6. **proposals** — `seedProposals` fallback (L36)
7. **seo-tracker** — `mockSites` hardcoded (L19)
8. **team-hub** — `mockTeam` hardcoded (L17)

## Pages using wrong data source:
9. **contracts** — imports `supabase` directly instead of `getData`
10. **outreach** — imports `supabase` + `getLeads` directly

## Pages that need Overview integration:
11. **Overview (page.tsx)** — doesn't load expenses, doesn't compute net profit

## Theme inconsistency:
12. **finances/page.tsx** — dark theme (`bg-[#1C1C1C]`) while rest is cream/bronze

## Action Plan:
- **Agent 1**: Fix pages 1-4 (calls, deal-room, knowledge, media) — remove mock data, wire to getData
- **Agent 2**: Fix pages 5-8 (portfolio, proposals, seo-tracker, team-hub) — remove mock data, wire to getData  
- **Agent 3**: Fix pages 9-12 (contracts, outreach, overview, finances theme) — unify data sources + theme
