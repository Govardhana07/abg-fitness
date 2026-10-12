# ABG production launch checklist

## Before real users
- [ ] Pick and configure hosting with HTTPS and a custom domain.
- [ ] Create Supabase project; review `supabase/schema.sql`, run it in a test project, test RLS with two separate users.
- [ ] Implement email/password or OAuth auth, password reset, session expiry, logout and account deletion.
- [ ] Connect app UI to database; add loading/error/empty states, retry, conflict handling and migration strategy.
- [ ] Add server-side AI endpoint with rate limits, request validation, timeout, abuse controls and secret management. Do not send service keys to the browser.
- [ ] Choose a nutrition data provider, verify licensing, serving sizes, local Indian foods, and display source/confidence. Never present estimates as medical facts.
- [ ] Add privacy policy, terms, consent, data export/deletion, contact details and age-appropriate safeguards.
- [ ] Test offline, slow networks, screen sizes, keyboard/screen reader, timezone/date boundaries and data loss scenarios.
- [ ] Run dependency/security scans, accessibility audit and automated tests.
- [ ] Android: build signed release, test on physical devices, configure app signing, icons/splash, permissions and Play Console disclosures.
- [ ] Verify all Play Store declarations, data safety, privacy URL and screenshots before submission.

## Acceptance tests
1. A workout can be created, edited, completed and remains after reload.
2. A meal's macro totals equal the sum of its logged items; unknown nutrition values are clearly marked.
3. User A cannot read/update User B's profile or logs (RLS test).
4. Export and import round-trip without silently dropping records.
5. Offline mode shows cached shell and a clear message when cloud features are unavailable.
6. AI endpoint rejects unauthenticated/oversized requests and never exposes provider secrets.
7. Account deletion removes or anonymizes personal records as documented.

## Release status
This folder is a starter project, not a certified or production-ready release. Backend, AI integration, live nutrition data, signing and real-device tests must be completed before public launch.
