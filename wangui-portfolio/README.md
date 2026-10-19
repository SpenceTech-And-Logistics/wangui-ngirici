# Hon. Wangui Ngirici: portfolio site

A portfolio in the person's own words: Profile, Selected work, Career, Vision, Press and Gallery,
with a private dashboard at `/admin` for updating work, press and photos. No CV page.

## Run it
```
npm install
npm run dev        # http://localhost:5173
npm run build      # output in dist/
```
Without Firebase the site shows sample content, so every page can be previewed.

## 1. Connect the dashboard (Firebase, free plan)
1. console.firebase.google.com: Add project. Build > Firestore Database > Create (production mode).
2. Build > Authentication > Get started > Email/Password > enable. Users tab: Add user (the owner's email and a password).
3. Project settings > General > Your apps > Web (`</>`). Copy `apiKey`, `authDomain`, `projectId`, `appId` into `firebase` in `site.config.js`.
4. Firestore > Rules: paste the contents of `firestore.rules`, Publish.
5. Firestore > Start collection `admins`. Document ID = the user's UID (Authentication > Users > User UID). Add any field, e.g. `ok = true`.
6. Open `/admin`, sign in.

## 2. What the dashboard edits
- **Selected work**: title, category, year, place, one headline result, photo, optional link. Arrows reorder; top four show on Profile.
- **Press**: headline, type, outlet, date, link to the original, image.
- **Gallery**: "Upload several photos" adds many at once; then add captions and albums. Albums become filters.
- **Profile and career**: name, title, current position, opening sentence, portrait, wide photo and quote, headline numbers, career, education, committees, vision, contact, colours.
- **Messages**: contact form submissions.

Photos are shrunk in the browser and stored in the database (no paid storage needed).

## 3. Before going live
- Set `siteUrl` in `site.config.js` to the real domain.
- Search engines read the built pages, so if the **current position** or **opening sentence** changes, update `role` in `site.config.js` and `intro` in `src/data/defaults.js`, then redeploy.
- Hosting: any static host (Cloudflare Pages, Netlify, Firebase Hosting). Build command `npm run build`, output `dist`. Set the SPA fallback to `/index.html` if the host does not do it by default.

## Position changes
In /admin > Profile and career: "Current position" and "Running for". After the election, set the position to "Governor of Kirinyaga County" and clear "Running for".
Google reads the built pages, so also update `role` and `aspiration` in `site.config.js` and `intro` in `src/data/defaults.js`, then redeploy.

## Facts used
Parliament of Kenya member page, Wikipedia and Citizen Digital (18 June 2026): Woman Representative for Kirinyaga 2017 to 2022 (Jubilee ticket), Finance and Planning and
Public Investments committees, KEWOPA chair, Kenya Seed Company board chair from 2023, education and business roles from the Parliament page, DCP member, governor bid announced 29 April 2026 at Kanjai.
The wide-photo quote is her public statement of that date; remove it in /admin if she prefers. Vision, contact details and professional bodies are blank until she adds them.
Education follows the Parliament page (Gretsa University BCom); Wikipedia says University of London: confirm with her.
