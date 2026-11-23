# Pan Bejgl — website

Single-page site for **Pan Bejgl**, bagel shop on Blanická, Praha 2.
Plain HTML + CSS + vanilla JS. No build step. Hosted on GitHub Pages.

## How to edit content

**All editable text lives in [`content.json`](content.json).** Open it, change the values, commit + push. The site rebuilds automatically.

- Hours: format is `"HH:MM-HH:MM"` (24h) or `"closed"`.
- Menu prices: just text — `"55 Kč"`, `"od 65 Kč"`, etc.
- Photos: add them with `tools/photo.sh` (below), which resizes and compresses them into `images/` and appends them to the `gallery` array. To replace a photo, edit its `src` / `caption` in `gallery`.
- Hero photo: `shop.hero_image`. `index.html` also preloads `images/interier.jpg` so the hero shows sooner; if you change the hero photo, update that `<link rel="preload">` too.
- Each piece of copy has a `cs` (Czech) and `en` (English) field.

You **don't need to touch** `index.html`, `style.css`, or `script.js` for normal updates.

## Closing / reopening the shop

The `status` block in `content.json` switches the whole site into a "temporarily closed" mode:

- `temporarily_closed`: `true` shows the closure notice (ribbon, hero, status pill, "Dnes"), swaps the opening hours for the markets list and drops the hours from Google's structured data. `false` (or no `status` block at all) is the normal open site.
- `message`: the notice text in the hero, `cs` + `en`.
- `reopening`: when you reopen, e.g. `"brzy"` / `"soon"` or `"1. března"` / `"1 March"`. Leave it empty to hide the line.
- `about`: the "O nás" text shown while closed; the normal `about` comes back on reopening.
- `markets`: where to find us meanwhile. Each entry has `name`, `place` and optional `when` (`cs` + `en`); empty fields are not shown.

To reopen:

1. Set `"temporarily_closed": false` in `content.json` (you can keep the rest of the block for next time).
2. Put the normal text back into the `<meta name="description">` in `index.html` (static HTML, it can't follow the flag): `Bio káva, čerstvé bejgly a domácí bábovky na Vinohradech. Pan Bejgl, Blanická 772/6, Praha 2.`
3. In Google Business Profile, switch the listing back from "Temporarily closed" and check the hours.

## Operator details (legal footer)

Czech law (Civil Code § 435) requires a business website to show who runs it. Fill the `operator` block in `content.json`:

- `legal_name`: the business owner's legal name, i.e. the person's full name for a sole trader (OSVČ) or the company name (e.g. `… s.r.o.`).
- `registered_address`: the registered seat (sídlo / místo podnikání) as written in the register, which may differ from the shop address.
- `ico`: the 8-digit IČO.
- `dic`: the DIČ (`CZ…`), only if VAT-registered; leave it empty otherwise.
- `register_entry`: the register line, `cs` + `en`, e.g. `"Zapsáno v živnostenském rejstříku"` / `"Registered in the Trade Register"` for a sole trader, or `"Zapsáno v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 12345"` for a company.

Empty fields are skipped. While the whole block is empty, the footer shows no legal line and the privacy note names the trade name (`shop.full_name`) as the controller. Once `legal_name` is filled, the privacy note uses it, together with the address and IČO.

## Privacy

The site has no forms, analytics or cookies. Fonts are self-hosted in `fonts/` (OFL, licence texts alongside), and the Google map loads only after the visitor clicks "Zobrazit mapu". That is why there's no cookie banner. The privacy note (footer link "Ochrana soukromí") describes exactly this, so update its text in `script.js` (`privacy.*` keys) if you ever add a third-party embed, analytics or a form.

## Local preview

The site loads `content.json` over HTTP, so opening `index.html` directly with `file://` won't work. Serve it locally:

```bash
cd ~/dev/projects/web/panbejgl
tools/preview.sh
# serves on http://localhost:8123 in the background and opens it
# (or by hand: python3 -m http.server 8123)
```

## Tools

- `tools/photo.sh add <file> <slug> "Caption"`: resizes to max 1400 px, compresses, saves `images/<slug>.jpg` and appends it to `gallery`. `add-only` skips `content.json`; `list` prints the gallery.
- `tools/publish.sh "What changed"`: checks `content.json` is valid JSON (aborts if not), stages **everything** (`git add -A`), commits and pushes the current branch. Run on `main`, that deploys: GitHub Pages rebuilds in about a minute. A phone may need a hard refresh (or `?v=2` on the URL) to show it.
- To undo a published change: `git log --oneline`, then `git revert <hash>` and publish again.

## Editing notes

The site is live at `https://panbejgl.cz`. A few things to keep current when editing:

- Keep the `content.json` values accurate — address, phone, menu prices.
- Google Maps embed: Google Maps → search "Pan Bejgl" → Share → Embed a map → copy `src` into `shop.map_embed_src`.
- Confirm the IG / FB URLs still point to the live profiles.

## Hosting and domain

GitHub Pages serves the `main` branch from `/ (root)` (repo → Settings → Pages). The `CNAME` file holds the custom domain `panbejgl.cz`. At the domain's DNS provider, the records point at GitHub Pages:

```
A      @    185.199.108.153
A      @    185.199.109.153
A      @    185.199.110.153
A      @    185.199.111.153
CNAME  www  michalsvobodapro.github.io.
```

If the domain ever stops resolving, check those records (`dig panbejgl.cz`) and that **Enforce HTTPS** is still ticked in Settings → Pages.

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
fonts/                 ← self-hosted woff2 (latin + latin-ext) + OFL licences
tools/                 ← preview, photo and publish helpers
.nojekyll              ← tells GitHub Pages to serve files as-is
CNAME                  ← custom domain for GitHub Pages (panbejgl.cz)
```
