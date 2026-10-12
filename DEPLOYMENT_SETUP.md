# ABG deployment and cloud setup

## 1. Static HTTPS hosting

The project is deployable as a static site (for example Netlify or Cloudflare Pages). Publish the entire project root so `index.html`, `cloud-sync.js`, `supabase-config.js`, `sw.js`, `manifest.webmanifest`, and `icons/` stay together. HTTPS is required for PWA service workers.

## 2. Supabase auth and cloud backup

1. Create a Supabase project and copy its Project URL and publishable/anon key.
2. Edit `supabase-config.js` with those two public values only. Do not place service-role keys or AI keys there.
3. Run `supabase/schema.sql` in the Supabase SQL editor; check the results and test using two separate accounts.
4. In Authentication settings, configure the site URL and allowed redirect URLs to the deployed HTTPS URL. Choose whether email confirmation is required.
5. Create an account, sign in, upload a local backup, sign in with a second account, and verify it cannot read the first account's backup.
6. Cloud restore overwrites local state only after confirmation. Export a local JSON backup before restoring.

## 3. Optional live AI coach

Install and authenticate the Supabase CLI, link your project, then configure secrets on the server:

```bash
supabase secrets set AI_API_KEY=YOUR_PROVIDER_KEY
supabase secrets set AI_MODEL=gpt-4.1-mini
supabase functions deploy abg-coach
```

Never commit provider keys. The Edge Function requires a signed-in Supabase user and limits each question to 1,200 characters. Restrict the Edge Function CORS origin to your actual app domain before public release. Add provider billing limits, rate limiting, monitoring and abuse controls before public release. Check current provider model availability and pricing before deployment.

## 4. Android

Requires a computer with Android Studio + Android SDK + internet:

```bash
npm install
npm run check
npm run android:prepare
npm run android:open
```

Test on a real Android device. In Android Studio use **Build > Generate Signed Bundle / APK** and create a secure release keystore. Keep the keystore and passwords in secure storage, not in this project. Use an AAB for Play Console unless there is a reason to distribute an APK directly.

## 5. Before public release

Complete `docs/PRIVACY_POLICY_TEMPLATE.md`, add a real support contact and privacy URL, implement account deletion and data export/deletion procedures, review nutrition data licensing, run accessibility/security checks, test poor-network/offline behavior, and complete Play Console Data safety and age-rating declarations. Do not publish with placeholder policy or without verifying actual behavior.
