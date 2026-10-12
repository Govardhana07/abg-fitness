# ABG Android release guide

This repository contains the web app and Capacitor configuration. A signed APK/AAB cannot be produced in this environment because Android SDK/Gradle and signing credentials are not installed/configured.

## Prepare on a computer with Node.js 20+ and Android Studio

1. Extract the ZIP and open a terminal in `abg_app_project`.
2. Run `npm install` (requires internet).
3. Run `npm run check`.
4. Run `npm run android:prepare` once. This installs/synchronizes the Capacitor Android platform.
5. Run `npm run android:open` to open Android Studio.
6. Install an emulator image or connect a physical Android device with USB debugging enabled. Run the app and test every flow.
7. In Android Studio, use **Build > Generate Signed Bundle / APK**. Create and securely back up a release keystore. Never commit the keystore or passwords to Git.
8. Choose Android App Bundle (AAB) for Play Console. Test the signed build before upload.

## Important before release

- Configure a real backend and authentication first if user data must sync across devices.
- The current prototype stores data locally in browser/device storage. Clearing app/site data can erase it.
- The coach is predefined demo guidance, not live AI.
- Food macro values are estimates; validate food data and licensing.
- Complete privacy policy, account deletion, data safety, age rating, support contact, app screenshots, signing and Play Console declarations.

## PWA hosting option

The site can be hosted as a static website on any HTTPS static host. Upload `index.html`, `manifest.webmanifest`, `sw.js`, and the `icons/` directory together. Verify the hosted URL on Android Chrome and install from the browser menu. This does not configure cloud accounts or make the prototype production-ready.
