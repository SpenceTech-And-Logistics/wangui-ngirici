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
- **Selected work**: title, category, year, place, one headline result, main photo, more photos, optional link. Arrows reorder; top four show on Profile.
  "More photos": upload several, or "Choose from the Gallery". Visitors click the project picture to see them all ("3 photos").
- **Press**: headline, type, outlet, date, link to the original, image.
- **How the Gallery is built**: standalone gallery photos, project photos (each linked back to its project), every project's main
  photo, and every press image (linked to the article). Project and press pictures are added automatically, so you never upload them twice.
  A gallery photo can be linked to a project later with "Linked project" when editing it.
- **Gallery**: "Upload several photos" adds many at once; then add captions and albums. Albums become filters.
  **Videos**: click "+ Add photo or video" and paste a YouTube, Facebook or TikTok link (upload the video there first).
  YouTube videos get their thumbnail automatically; for Facebook and TikTok, add a cover photo or a dark tile is shown.
  A "Videos" filter appears once there is at least one video. Videos play in the gallery viewer.
- **Profile and career**: name, title, current position, opening sentence, portrait, wide photo and quote, headline numbers, career, education, committees, vision, contact, colours.
- **Social and other links** (Profile and career > Contact and social links): Facebook, X, Instagram, YouTube, TikTok,
  LinkedIn, Threads and WhatsApp show as icons; "Other links" adds any page with its own name (party site, Wikipedia...).
  Both appear in the footer and on the Contact page. Empty boxes are hidden.
- **Messages**: contact form submissions.
- **Import** (/admin/import): load Selected work, Press, Career, Education, Committees and Vision from an Excel file in one go.
  Download the blank template from that screen (`public/content-template.xlsx`), fill one row per item, upload, check the summary,
  then choose Add or Replace for each section. Rows starting with `[` are placeholders and are skipped. Photos are added afterwards.

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
Public Investments committees, KEWOPA chair, Kenya Seed Company board chair July 2023 to April 2026, education and business roles from the Parliament page, DCP member, governor bid announced 29 April 2026 at Kanjai.
The wide-photo quote is her public statement of that date; remove it in /admin if she prefers. Vision, contact details and professional bodies are blank until she adds them.
Education follows the Parliament page (Gretsa University BCom); Wikipedia says University of London: confirm with her.
