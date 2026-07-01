# Pan Bejgl — website

Single-page site for **Pan Bejgl**, bagel shop on Blanická, Praha 2.
Plain HTML + CSS + vanilla JS. No build step. Hosted on GitHub Pages.

## How to edit content

**All editable text lives in [`content.json`](content.json).** Open it, change the values, commit + push. The site rebuilds automatically.

- Hours: format is `"HH:MM-HH:MM"` (24h) or `"closed"`.
- Menu prices: just text — `"55 Kč"`, `"od 65 Kč"`, etc.
- Photos: put files into `images/` and reference them in the `gallery` array.
- Each piece of copy has a `cs` (Czech) and `en` (English) field.

You **don't need to touch** `index.html`, `style.css`, or `script.js` for normal updates.

## Local preview

The site loads `content.json` over HTTP, so opening `index.html` directly with `file://` won't work. Serve it locally:

```bash
cd ~/dev/projects/panbejgl
python3 -m http.server 8000
# open http://localhost:8000
```

## Editing notes

The site is live at `https://panbejgl.cz`. A few things to keep current when editing:

- Keep the `content.json` values accurate — address, phone, menu prices.
- Google Maps embed: Google Maps → search "Pan Bejgl" → Share → Embed a map → copy `src` into `shop.map_embed_src`.
- Confirm the IG / FB URLs still point to the live profiles.

## Deploy to GitHub Pages

1. Create GitHub repo `panbejgl` (public).
2. Push this folder to it.
3. Repo → Settings → Pages → Source: `Deploy from a branch` → `main` → `/ (root)`.
4. Site live at `https://<username>.github.io/panbejgl/` within a minute.

## Custom domain (`panbejgl.cz`)

1. Register `panbejgl.cz` at [Wedos](https://wedos.cz) (~149 Kč/year, Czech registrar).
2. In the repo, create a file called `CNAME` (no extension) with one line: `panbejgl.cz`. Commit + push.
3. In Wedos DNS panel, add records pointing the domain at GitHub Pages:

   ```
   A    @    185.199.108.153
   A    @    185.199.109.153
   A    @    185.199.110.153
   A    @    185.199.111.153
   CNAME www  <username>.github.io.
   ```

4. GitHub repo → Settings → Pages → Custom domain → `panbejgl.cz` → wait for DNS check → tick **Enforce HTTPS**.
5. Propagation: 10 min – 24 h. Verify with `dig panbejgl.cz`.

## Google Business Profile (most important for findability)

A website without a Google Business Profile is invisible to "bagel Vinohrady" searches. Help the owner:

1. Visit [google.com/business](https://google.com/business) and search for "Pan Bejgl".
2. Claim the listing → verification (postcard or phone).
3. Add: hours, photos (same set as the site), website URL, menu link.
4. This is what populates the right-hand panel on Google search and the Maps card.

The `LocalBusiness` JSON-LD in `index.html` reinforces this — Google reads it on crawl.

## File map

```
content.json           ← edit this
index.html             ← page structure (rarely edited)
style.css              ← visual design
script.js              ← renders content.json, language toggle, open-now
images/                ← photos
.nojekyll              ← tells GitHub Pages to serve files as-is
CNAME                  ← (add when domain is registered)
```
