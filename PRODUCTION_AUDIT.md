# VANTIX PRODUCTION AUDIT — usevantix.com

**Audit Date:** February 18, 2026  
**Auditor:** Subagent (production-audit)

---

## Summary

**Total Tasks: 68**

| Category | Count |
|---|---|
| 🔴 Critical / Security | 8 |
| 🟠 Email & Contact Info | 6 |
| 🟡 Google Analytics & Tracking | 3 |
| 🔵 Landing Page | 7 |
| 🟢 Public Pages | 8 |
| 🟣 Dashboard | 6 |
| ⚙️ Technical / Build | 8 |
| 📝 Content & Copy | 6 |
| 🔍 SEO | 7 |
| 📱 Social Media Readiness | 5 |
| 🧹 Cleanup | 4 |

---

## 🔴 Critical / Security

- [ ] **1. Hardcoded login credentials exposed in client code** — `src/app/login/page.tsx` contains `TEMP_USERS` with passwords (`vantix2024`) visible to anyone viewing page source. Move auth to Supabase or at minimum a server-side API route. This is a **showstopper**.
- [ ] **2. `typescript: { ignoreBuildErrors: true }` in next.config.ts** — This masks real type errors that could cause runtime crashes. Remove this and fix all TS errors before launch.
- [ ] **3. No `.env.local` file exists** — Supabase URL/keys, Resend API key, and other secrets are not configured locally or (likely) on Vercel. All API routes fall back to placeholder values and silently fail.
- [ ] **4. Verify Vercel environment variables are set** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `RESEND_API_KEY` must be set in Vercel dashboard. Without them, contact form, booking webhook, audit submission, and lead capture all silently fail.
- [ ] **5. Supabase tables don't exist yet** — `contact_submissions`, `chat_leads`, `leads`, and other tables referenced in API routes need to be created. Run the `supabase-schema.sql` or create tables manually.
- [ ] **6. Contact form API route writes to filesystem (`data/leads.json`)** — Vercel serverless functions have read-only filesystems. The `fs.writeFileSync` in `api/contact/route.ts` will crash in production. Remove filesystem writes; use Supabase only.
- [ ] **7. Social media links in footer go to `#`** — Twitter, LinkedIn, Instagram links are all `href="#"`. Either create real social profiles and link them, or remove the icons entirely. Dead links look unprofessional.
- [ ] **8. Booking data only saved to localStorage** — Bookings from the landing page calendar are stored in `localStorage` (client-side only) and fire a webhook to `/api/bookings/webhook`. If the webhook fails, the booking is lost. Need server-side persistence.

---

## 🟠 Email & Contact Info

- [ ] **9. Primary email `usevantix@gmail.com` is SUSPENDED** — Referenced in layout.tsx JSON-LD, footer, multiple landing page variants, and several components. Need a working replacement (e.g., `hello@usevantix.com` via Resend or a new domain email).
- [ ] **10. Inconsistent email addresses across pages** — Contact page uses `hello@usevantix.com`, footer uses `usevantix@gmail.com`, JSON-LD uses `usevantix@gmail.com`. Pick ONE working email and use it everywhere.
- [ ] **11. Set up `hello@usevantix.com` as actual working email** — Contact page already references it. Configure via Resend (already have API key) or Google Workspace on the `usevantix.com` domain.
- [ ] **12. Update JSON-LD structured data email** — `layout.tsx` lines 80 and 95 reference `usevantix@gmail.com`. Update to the working email address.
- [ ] **13. Update all landing page variants** — `CinematicLanding.tsx`, `ConsultantLanding.tsx`, `FuturisticLanding.tsx`, `InteractiveSections.tsx`, `LightLanding.tsx`, `StoryLanding.tsx` all reference `usevantix@gmail.com`. Global find-and-replace needed.
- [ ] **14. Communications inbox page hardcodes `usevantix@gmail.com` as sender** — Dashboard inbox compose uses the suspended email. Update to working email.

---

## 🟡 Google Analytics & Tracking

- [ ] **15. Google Analytics has placeholder ID `GA_MEASUREMENT_ID`** — In `layout.tsx`, the GA script loads with a literal string `GA_MEASUREMENT_ID`. Either get a real GA4 measurement ID or remove the script entirely (it's making a broken request on every page load).
- [ ] **16. Plausible Analytics script included but may not be configured** — `layout.tsx` includes `plausible.io/js/script.js` with `data-domain="usevantix.com"`. Verify you have an active Plausible account, or remove the script.
- [ ] **17. Decide on ONE analytics provider** — Having both GA and Plausible is redundant and adds page weight. Pick one.

---

## 🔵 Landing Page

- [ ] **18. Animated counters show "0" before scrolling into view** — The live site shows "0+ Hours Saved", "0 Pages Built", "0 Week Average Delivery" in the counter section before animation triggers. Users who don't scroll past will see zeros. Consider starting with target values or using a placeholder.
- [ ] **19. "Explore Platform" and "Explore Infrastructure" buttons both go to `#booking`** — These CTAs in the Product Showcase section imply they'll show the platform/infrastructure, but they just scroll to booking. Either link to `/dashboard` (demo) or rename the buttons to "Book a Demo".
- [ ] **20. Missing `©` symbol in footer copyright** — Footer says `{year} Vantix. All rights reserved.` — should be `© {year}`.
- [ ] **21. Booking calendar time slots start at 3:00 PM** — All slots are afternoon/evening (3 PM–10 PM). No morning slots. Is this intentional? Could lose leads who want morning calls.
- [ ] **22. Booking calendar has no timezone indicator** — Users don't know if times are ET, PT, etc. Add "(Eastern Time)" or auto-detect timezone.
- [ ] **23. Booking confirmation says "We'll call you"** — But no phone number is collected as required. The phone field is optional. Either make it required or change the confirmation text to "We'll email you."
- [ ] **24. ContactForm on landing page tries to insert into Supabase `chat_leads` table** — This table doesn't exist. Form will silently fail to persist data server-side.

---

## 🟢 Public Pages

- [ ] **25. /services page "Book Your Free Audit" button has no visible background** — The CTA buttons on the services page use `text-[#8E5E34] shadow-sm` but no `bg-` class, making them potentially invisible or just text. Add proper button styling.
- [ ] **26. /case-studies has only ONE case study** — SecuredTampa is the only entry. For credibility, either add more (even hypothetical/anonymized) or rename the page to "Featured Work" (singular).
- [ ] **27. /about page uses icon placeholders instead of team photos** — The about page shows Settings/Code icons instead of Kyle and Aidan's actual photos (which exist at `/team-kyle.jpg` and `/team-aidan.jpg`). Add the real photos.
- [ ] **28. /blog has real content (good!)** — Blog posts exist in `data/blog-posts.ts` with substantive content. Verify all blog post slugs render correctly at `/blog/[slug]`.
- [ ] **29. /portfolio page exists but may be redundant with /case-studies** — Both pages showcase work. Decide if you need both or consolidate.
- [ ] **30. /story page renders `StoryLanding` component** — This appears to be an alternate landing page theme, not a real "Our Story" page. Either repurpose or remove from sitemap.
- [ ] **31. /roi-calculator and /ai-assessment pages exist and are interactive** — Verify they work end-to-end and capture leads properly.
- [ ] **32. /audit page submits to `/api/audit-submit`** — Verify this API route works and data is persisted (same Supabase dependency issue).

---

## 🟣 Dashboard

- [ ] **33. Dashboard auth is localStorage-only with hardcoded credentials** — Anyone who knows the passwords can log in. Not suitable for production with real client data. Implement Supabase Auth.
- [ ] **34. All dashboard data is localStorage-only** — Clients, leads, projects, tasks, finances, etc. are all in browser storage. Data is lost if cache is cleared. Fine for demo, not for real use.
- [ ] **35. Dashboard should be hidden from public/search engines** — Add `noindex` meta tag to dashboard layout or put it behind proper auth. Currently, anyone who navigates to `/dashboard` and has credentials can access it.
- [ ] **36. Multiple duplicate dashboard pages** — Both `/dashboard/finances` AND `/dashboard/financial` exist. `/dashboard/inbox` AND `/dashboard/communications/inbox` exist. `/dashboard/invoices` AND `/dashboard/finances/invoices` exist. `/dashboard/revenue` AND `/dashboard/finances/revenue` exist. Clean up duplicates.
- [ ] **37. Dashboard has 30+ pages** — This is impressive but ensure all sidebar links match actual pages. Verify no 404s within dashboard navigation.
- [ ] **38. Verify dashboard mobile responsiveness** — With this many pages, sidebar behavior on mobile (hamburger menu) needs to work reliably.

---

## ⚙️ Technical / Build

- [ ] **39. Run `next build` and fix all errors** — With `ignoreBuildErrors: true`, actual build errors are hidden. Run a clean build with this flag removed to find real issues.
- [ ] **40. robots.txt allows all crawling** — Currently `Allow: /` which means search engines can crawl `/login`, `/dashboard`, etc. Add `Disallow: /dashboard` and `Disallow: /login`.
- [ ] **41. sitemap.xml includes `/audit` page** — Verify this is intentional — the audit page is a lead-gen form, which is fine to index, but make sure it looks polished.
- [ ] **42. sitemap.xml doesn't include `/blog/[slug]` URLs** — Individual blog posts aren't in the sitemap. Add them for SEO.
- [ ] **43. No custom 404 page** — Next.js has a default 404 but you should create `src/app/not-found.tsx` with branded Vantix styling.
- [ ] **44. www redirect is working** — Confirmed: `usevantix.com` redirects to `www.usevantix.com`. ✅ But verify canonical URLs match (they currently point to `usevantix.com` without www).
- [ ] **45. Canonical URL mismatch** — `layout.tsx` sets canonical to `https://usevantix.com` but site redirects to `https://www.usevantix.com`. These must match or you'll have SEO issues. Update canonical to include `www`.
- [ ] **46. OG image — verify `/og-image.jpg` exists and looks good** — File exists in public folder. Test by sharing URL on Twitter/Facebook/LinkedIn preview tools.

---

## 📝 Content & Copy

- [ ] **47. "122 Pages Built" stat is SecuredTampa-specific but presented as general** — Hero section shows "122 Pages Built" as a company stat. This is actually one project's metric. Clarify or use a more general stat.
- [ ] **48. Testimonial is from "Dave" at SecuredTampa** — Only one testimonial. For credibility, add more (even if paraphrased from conversations). One testimonial looks thin.
- [ ] **49. FAQ mentions "$4,500 starting price"** — Make sure this is still accurate and intentional to publish publicly. Competitors can see your floor pricing.
- [ ] **50. "We take on 3 new clients per month" claim** — Used in both landing page and about page. Make sure this scarcity messaging is credible for a brand-new company.
- [ ] **51. No lorem ipsum found** — ✅ All content appears to be real, written copy.
- [ ] **52. Phone number is consistent** — ✅ `(908) 498-7753` used correctly across landing page, services, contact page.

---

## 🔍 SEO

- [ ] **53. Root layout has good meta tags** — ✅ Title, description, OG, Twitter cards, JSON-LD all present.
- [ ] **54. Subpages need unique meta descriptions** — `/services`, `/case-studies`, `/contact`, `/blog`, `/portfolio`, `/story`, `/roi-calculator`, `/ai-assessment`, `/audit` — verify each has unique `<title>` and `<meta description>`. Many are client components (`'use client'`) which can't export `metadata`. Add metadata via `generateMetadata` or convert to server components where possible.
- [ ] **55. Privacy and Terms pages have proper metadata** — ✅ Both export `Metadata` objects.
- [ ] **56. Blog posts need individual meta tags** — Check that `/blog/[slug]/page.tsx` generates unique titles and descriptions per post. The `blogPosts` data includes `metaDescription` field which is good.
- [ ] **57. JSON-LD `SearchAction` points to non-existent search** — The WebSite schema includes a SearchAction targeting `usevantix.com/?q={search}` but the site has no search functionality. Remove this or implement search.
- [ ] **58. Image alt text is generally good** — ✅ Mockup images have descriptive alt text. Team photos have proper alt text.
- [ ] **59. Add `lastmod` dates to sitemap.xml** — Currently missing `<lastmod>` tags which help search engines prioritize crawling.

---

## 📱 Social Media Readiness

- [ ] **60. Create actual social media profiles** — Twitter, LinkedIn, Instagram links in footer are all `#`. Create profiles and link them. LinkedIn is especially important for B2B AI consulting.
- [ ] **61. JSON-LD `sameAs` array is empty** — Once social profiles are created, add URLs to the `sameAs` field in the Organization schema.
- [ ] **62. Test OG image sharing** — Share `usevantix.com` on Twitter, LinkedIn, Facebook and verify the preview card looks correct. Use https://cards-dev.twitter.com/validator and https://developers.facebook.com/tools/debug/.
- [ ] **63. Create branded social media content/templates** — For launch, have 5-10 ready-to-post graphics or screenshots of the platform.
- [ ] **64. Consider Google Business Profile** — For local SEO and credibility, create a Google Business Profile for Vantix.

---

## 🧹 Cleanup

- [ ] **65. Remove unused landing page variants** — `CinematicLanding.tsx`, `ConsultantLanding.tsx`, `LightLanding.tsx`, `StoryLanding.tsx`, `HeroSection.tsx`, `InteractiveSections.tsx`, `StaticSections.tsx`, `UltimateSections.tsx` are all unused (only `FuturisticLanding` is active). They add to bundle size and contain outdated email/info.
- [ ] **66. Remove `/story` page or make it a real page** — It currently renders `StoryLanding`, an alternate homepage variant. Confusing for users.
- [ ] **67. Clean up extra directories** — `contracts/`, `leads-scraper/`, `metabase/`, `uptime-kuma/`, `social-images/` are in the repo root. Ensure these aren't deployed or leaking info.
- [ ] **68. Remove `supabase-schema.sql` from repo root** — Contains database schema. Not sensitive per se, but cleaner to keep in `supabase/` directory and reference from there.

---

## Priority Order for Launch

### Do First (Blockers)
1. #1 — Remove hardcoded credentials
2. #9-14 — Fix email situation
3. #15 — Fix GA placeholder
4. #4-5 — Set up Vercel env vars + Supabase tables
5. #6 — Fix filesystem writes in API routes
6. #7 — Fix social media links (remove or add real URLs)
7. #2 — Remove `ignoreBuildErrors` and fix TS errors
8. #40 — Update robots.txt to block dashboard

### Do Next (Important)
9. #45 — Fix canonical URL (www mismatch)
10. #33 — Implement real auth (or accept dashboard is demo-only)
11. #25 — Fix services page button styling
12. #27 — Add real team photos to about page
13. #43 — Create branded 404 page
14. #54 — Add meta descriptions to all pages
15. #22 — Add timezone to booking calendar

### Do Before Marketing Push
16. #60-64 — Social media profiles and content
17. #48 — Add more testimonials
18. #42 — Add blog posts to sitemap
19. #65-66 — Remove unused code/pages
20. #62 — Test OG image sharing
