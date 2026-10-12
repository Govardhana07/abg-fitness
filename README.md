# ABG — All About Gym

Mobile-first fitness web app starter with black/neon-yellow branding. The current UI supports local workout tracking, approximate food logging, check-ins, profile targets and JSON backup/restore. A PWA shell and Capacitor configuration are included. Optional Supabase email authentication/cloud backup and a server-side AI coach Edge Function template are included but require your own project credentials and deployment.

## Run and check

Requires Node.js 18+. From this directory:

```bash
npm install
npm run check
npm start
```

Open the local URL in Chrome. For PWA install/offline features, serve over HTTPS (localhost is also treated as secure by browsers). On Android Chrome, use **Install app** / **Add to Home screen** after HTTPS deployment.

## Android build path

After installing dependencies and ensuring Android Studio + Android SDK are installed:

```bash
npm run android:prepare  # once; requires internet + Android tooling
npm run android:open
```

Then build and test from Android Studio. Configure application signing before making a release. The repository does not contain a signed APK/AAB; it must be built with an Android SDK and signing credentials.

## Included

- `index.html` — responsive ABG UI and browser-local interactions
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA metadata, cache and icon
- `capacitor.config.json` — Android wrapper configuration
- `supabase/schema.sql` — database schema/RLS for logs and per-user cloud backup; review and test before use
- `cloud-sync.js`, `supabase-config.js` — optional email auth, password reset, cloud backup/restore; configure with public Supabase URL/key
- `supabase/functions/abg-coach/` — authenticated AI coach Edge Function template; requires server-side provider secret
- `DEPLOYMENT_SETUP.md`, `netlify.toml` — deployment setup guide and static hosting headers
- `.env.example` — placeholders only; no credentials
- `docs/PRODUCTION_CHECKLIST.md` — backend, security, QA and release checklist
- `docs/PRIVACY_POLICY_TEMPLATE.md` — draft to complete and review before launch
- `scripts/check-project.mjs` — static project validation

See `DEPLOYMENT_SETUP.md` for hosting/cloud/AI setup and `ANDROID_RELEASE_GUIDE.md` for Android build steps.

## Important status

This is a working local prototype/starter, **not yet a production service**. Data is stored in this browser/device and can be lost if site data is cleared. Cloud sync and live AI are implemented as configurable templates, but they are not active until you create/configure Supabase, run the SQL, set server secrets, and deploy the Edge Function. No hosted backend, signed Android package, or Play Store release is configured here. SQL and environment placeholders are not a connected backend. Never put service-role or AI provider secrets in frontend code.

## Production sequence

1. Create a Supabase project and apply/review the SQL in a test environment.
2. Implement authentication and real CRUD; verify row-level security using at least two test accounts.
3. Add server-side AI integration using Edge Functions/secrets and usage limits.
4. Choose a licensed food/nutrition provider and show serving-size/source caveats.
5. Add automated/browser tests, accessibility and Android device tests.
6. Complete privacy/data-safety disclosures, signing, backup/recovery and release review.
