# BuildVVO Technologies — Website & Lead Dashboard

## Original problem statement
Premium, conversion-focused B2B lead-generation website for BuildVVO Technologies Pvt Ltd (Indian custom software company): Home, Services, Industries, Our Work (GymBoss_VVO), About, Contact/Get a Quote; multi-step lead form; floating WhatsApp; thank-you page; secure admin dashboard with lead statuses, sources, notes, follow-ups, search/filters, charts; SEO; GA4/Google Ads/Meta Pixel when configured; no fabricated stats/testimonials; dark/light mode; palette Navy #101D35, Cream #F7F4ED, White, Blue #4965E9; no "Made with Emergent" watermark.

## User choices
- No email notifications — track leads in admin dashboard only
- Admin login: username `buildvvo` / `buildvvo@2026` (JWT)
- Contact details are placeholders, editable from admin Settings
- GymBoss_VVO: designed mockups + generic description
- No booking calendar — consultation is a checkbox in the lead form

## Architecture
- Backend: FastAPI + MongoDB (`leads`, `users`, `settings`, `events`, `login_attempts`); JWT Bearer auth, bcrypt, brute-force lockout (5 attempts/15 min)
- Frontend: React + Tailwind + framer-motion + recharts; fonts Cabinet Grotesk / DM Sans / JetBrains Mono
- Tracking: lib/tracking.js loads GA4/Ads/Pixel from admin settings; first-touch source attribution (utm/gclid/fbclid/referrer)

## Implemented (2026-06)
- All public pages + 6 SEO service pages (/services/:slug), thank-you, 404
- 4-step lead form w/ validation, honeypot, ?service= preselect
- Floating WhatsApp (clicks tracked to DB + analytics)
- Admin: overview stats & charts (real data), leads table w/ search/filters/inline status, lead sheet (notes, follow-up, source edit, delete), CSV export, Settings (contact + tracking IDs)
- Removed Emergent badge script & posthog from index.html
- Tested: backend 22/22, frontend all flows pass

## Backlog
- P1: Email/WhatsApp notification on new lead (optional)
- P1: Real GymBoss_VVO screenshots, more case studies when available
- P2: Prerendering / sitemap.xml with final domain for stronger SEO
- P2: Multiple admin users / roles

## Iteration 2 (2026-06) — Responsiveness
- Global overflow-x clip; GymBoss mockup stacks on mobile
- Admin: mobile bottom tab bar, lead cards on mobile, compact stat cards, chart label fixes, Recent enquiries + Upcoming follow-ups cards, shadcn calendar for follow-up date
- Tested: backend 23/23, all pages 0 horizontal overflow at 390/768/1920
