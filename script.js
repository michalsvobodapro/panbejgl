// Pan Bejgl — site logic.
// Loads content.json (single source of truth) and renders the design.
// Adapted from the Claude Design handoff, keeping fetch-from-JSON flow.

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const I18N = {
  cs: {
    "brand.sub": "Bistró Kafe — Praha 2",
    "nav.about": "O nás", "nav.menu": "Menu", "nav.catering": "Catering", "nav.hours": "Otevřeno", "nav.visit": "Najdete nás",
    "catering.title.em": "Catering", "catering.title": "a pohoštění", "catering.by": "od Pana Bejgla",
    "hero.eyebrow": "BLANICKÁ · PRAHA 2 · VINOHRADY",
    "meta.address": "Adresa", "meta.today": "Dnes", "meta.serving": "Podáváme", "meta.coffee": "Káva",
    "meta.serving.val": "Snídaně & oběd", "meta.coffee.val": "Bio · Fair Trade",
    "gallery.title.em": "Z naší", "gallery.title": "vitríny",
    "gallery.kicker": "Pečené ráno · Foceno u nás",
    "gallery.more": "Zobrazit více fotek",
    "gallery.less": "Méně fotek",
    "menu.title.em": "Naše", "menu.title": "menu",
    "menu.kicker": "Sedm kategorií · Asi dvacet pět položek",
    "menu.note": "Ceny jsou orientační — aktuální nabídku najdete na tabuli u nás. Cokoliv připravíme i s sebou.",
    "hours.title.em": "Otevírací", "hours.title": "doba",
    "hours.note": "V neděli máme zavřeno — odpočíváme a pečeme na pondělí.",
    "visit.title.em": "Najdete", "visit.title": "nás",
    "visit.where": "Vinohrady · Praha 2",
    "visit.phone": "Telefon", "visit.email": "E-mail", "visit.fb.label": "Pan Bejgl Praha",
    "pull.byline": "Po — Pá · pro lepší rána",
    "footer.tag": "Pečeno na Vinohradech",
    "status.open": "Otevřeno",
    "status.closed": "Zavřeno",
    "status.opens_at": "Otevírá {time}",
    "status.opens_at_full": "Otevírá v {time}",
    "social.nav": "Sociální sítě a objednávky",
    "social.instagram": "Instagram",
    "social.facebook": "Facebook",
    "social.bolt": "Objednat na Bolt Food",
    "closed": "Zavřeno",
    "day.mon": "Pondělí", "day.tue": "Úterý", "day.wed": "Středa", "day.thu": "Čtvrtek",
    "day.fri": "Pátek", "day.sat": "Sobota", "day.sun": "Neděle",
  },
  en: {
    "brand.sub": "Bistro Café — Prague 2",
    "nav.about": "About", "nav.menu": "Menu", "nav.catering": "Catering", "nav.hours": "Hours", "nav.visit": "Visit",
    "catering.title.em": "Catering", "catering.title": "& boxes", "catering.by": "by Pan Bejgl",
    "hero.eyebrow": "BLANICKÁ · PRAGUE 2 · VINOHRADY",
    "meta.address": "Address", "meta.today": "Today", "meta.serving": "Serving", "meta.coffee": "Coffee",
    "meta.serving.val": "Breakfast & lunch", "meta.coffee.val": "Organic · Fair Trade",
    "gallery.title.em": "From the", "gallery.title": "counter",
    "gallery.kicker": "Baked this morning · Shot in the shop",
    "gallery.more": "Show more photos",
    "gallery.less": "Show fewer",
    "menu.title.em": "Our", "menu.title": "menu",
    "menu.kicker": "Seven categories · About twenty-five items",
    "menu.note": "Prices are indicative — see the chalkboard for today. Everything is available to take away.",
    "hours.title.em": "Opening", "hours.title": "hours",
    "hours.note": "We're closed Sundays — we rest, and bake for Monday.",
    "visit.title.em": "Find", "visit.title": "us",
    "visit.where": "Vinohrady · Prague 2",
    "visit.phone": "Phone", "visit.email": "Email", "visit.fb.label": "Pan Bejgl Praha",
    "pull.byline": "Mon — Fri · for better mornings",
    "footer.tag": "Baked in Vinohrady",
    "status.open": "Open now",
    "status.closed": "Closed",
    "status.opens_at": "Opens {time}",
    "status.opens_at_full": "Opens at {time}",
    "social.nav": "Social & ordering",
    "social.instagram": "Instagram",
    "social.facebook": "Facebook",
    "social.bolt": "Order on Bolt Food",
    "closed": "Closed",
    "day.mon": "Monday", "day.tue": "Tuesday", "day.wed": "Wednesday", "day.thu": "Thursday",
    "day.fri": "Friday", "day.sat": "Saturday", "day.sun": "Sunday",
  },
};

let CONTENT = null;
let lang = localStorage.getItem("panbejgl.lang") || (navigator.language?.startsWith("cs") ? "cs" : "cs");

function t(key, vars = {}) {
  let s = I18N[lang][key] ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

function pickLang(o) {
  return typeof o === "string" ? o : (o?.[lang] ?? o?.cs ?? o?.en ?? "");
}

function parseHHMM(s) {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

function computeOpenStatus(hours, now = new Date()) {
  const idx = (now.getDay() + 6) % 7;
  const key = DAY_KEYS[idx];
  const h = hours[key];
  const mins = now.getHours() * 60 + now.getMinutes();
  if (h && h !== "closed") {
    const [open, close] = h.split("-").map(parseHHMM);
    if (mins >= open && mins < close) return { open: true, closes: h.split("-")[1] };
    if (mins < open) return { open: false, opensAt: h.split("-")[0] };
  }
  return { open: false, closedToday: true };
}

function renderStatic() {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.dataset.i18n;
    if (I18N[lang][k] != null) el.textContent = I18N[lang][k];
  });

  document.getElementById("hero-tagline").textContent = pickLang(CONTENT.tagline);
  document.getElementById("hero-subtitle").textContent = pickLang(CONTENT.subtitle);
  document.getElementById("pull-text").textContent = pickLang(CONTENT.about);

  document.querySelectorAll("#lang-toggle [data-lang]").forEach((el) => {
    el.classList.toggle("active", el.dataset.lang === lang);
  });

  const idx = (new Date().getDay() + 6) % 7;
  const todayKey = DAY_KEYS[idx];
  const todayHours = CONTENT.hours[todayKey];
  document.getElementById("hero-today").textContent =
    (todayHours && todayHours !== "closed") ? todayHours : t("closed");

  const pill = document.getElementById("pill-status");
  const txt = document.getElementById("pill-status-text");
  const s = computeOpenStatus(CONTENT.hours);
  pill.classList.remove("is-open", "is-closed");
  if (s.open) {
    txt.textContent = t("status.open");
    pill.title = t("status.open");
    pill.classList.add("is-open");
  } else if (s.opensAt) {
    txt.textContent = t("status.opens_at", { time: s.opensAt });
    pill.title = t("status.opens_at_full", { time: s.opensAt });
    pill.classList.add("is-closed");
  } else {
    txt.textContent = t("status.closed");
    pill.title = t("status.closed");
    pill.classList.add("is-closed");
  }
  pill.setAttribute("aria-label", pill.title);
}

function renderShop() {
  const shop = CONTENT.shop ?? {};

  if (shop.logo) {
    document.getElementById("brand-logo").src = shop.logo;
    document.getElementById("hero-logo").src = shop.logo;
    document.getElementById("footer-logo").src = shop.logo;
    // NOTE: the favicon is intentionally NOT set from shop.logo. The
    // declared /favicon.ico + favicon.png (square, crawler-friendly)
    // must stay authoritative for search-result site icons.
  }
  if (shop.hero_image) {
    document.getElementById("hero-bg").style.backgroundImage = `url("${shop.hero_image}")`;
  }
  if (shop.address_line1) {
    document.getElementById("meta-address").textContent = shop.address_line1;
    document.getElementById("visit-address-street").textContent = shop.address_line1;
  }
  if (shop.address_line2) {
    document.getElementById("visit-address-city").textContent = shop.address_line2;
  }
  if (shop.phone) {
    const phoneEl = document.getElementById("visit-phone");
    phoneEl.textContent = shop.phone;
    phoneEl.href = `tel:${shop.phone.replace(/\s+/g, "")}`;
  }
  if (shop.email) {
    const emailEl = document.getElementById("visit-email");
    emailEl.textContent = shop.email;
    emailEl.href = `mailto:${shop.email}`;
  }
  if (shop.instagram) {
    const ig = document.getElementById("visit-ig");
    ig.href = shop.instagram;
    const handle = shop.instagram.match(/instagram\.com\/([^/?#]+)/)?.[1];
    if (handle) ig.textContent = `@${handle}`;
  }
  if (shop.facebook) {
    document.getElementById("visit-fb").href = shop.facebook;
  }

  // Social/delivery icons — wires every [data-social] link (hero + footer
  // copies) from one map. Each shows only when its URL is set, so Bolt Food
  // stays hidden until shop.bolt_food is filled in content.json.
  const social = {
    instagram: [shop.instagram, "social.instagram"],
    facebook: [shop.facebook, "social.facebook"],
    bolt: [shop.bolt_food, "social.bolt"],
  };
  document.querySelectorAll("[data-social]").forEach((el) => {
    const entry = social[el.dataset.social];
    if (!entry) return;
    const [url, labelKey] = entry;
    el.setAttribute("aria-label", t(labelKey));
    if (url) {
      el.href = url;
      el.hidden = false;
    } else {
      el.hidden = true;
    }
  });
  document.querySelectorAll(".footer-social, .hero-social").forEach((nav) => {
    nav.setAttribute("aria-label", t("social.nav"));
  });

  if (shop.map_embed_src) {
    document.getElementById("map-iframe").src = shop.map_embed_src;
  }
}

function renderMenu() {
  const grid = document.getElementById("menu-grid");
  // Preserve which categories were open across re-renders (e.g. lang toggle)
  const previouslyOpen = new Set(
    Array.from(grid.querySelectorAll(".menu-cat[open]")).map((el) => el.dataset.catIdx)
  );
  grid.innerHTML = "";
  CONTENT.menu.forEach((cat, i) => {
    const wrap = document.createElement("details");
    wrap.className = "menu-cat";
    wrap.dataset.catIdx = String(i);
    if (previouslyOpen.has(String(i))) wrap.open = true;

    const head = document.createElement("summary");
    head.className = "menu-cat-head";

    const title = document.createElement("span");
    title.className = "menu-cat-title";
    title.textContent = pickLang(cat.category);

    const icon = document.createElement("span");
    icon.className = "menu-cat-icon";
    icon.setAttribute("aria-hidden", "true");

    head.appendChild(title);
    head.appendChild(icon);
    wrap.appendChild(head);

    const body = document.createElement("div");
    body.className = "menu-cat-body";

    cat.items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "menu-item";

      const nameWrap = document.createElement("div");
      nameWrap.className = "menu-item-name";
      const name = document.createElement("span");
      name.textContent = pickLang(item.name);
      const leader = document.createElement("span");
      leader.className = "leader";
      nameWrap.appendChild(name);
      nameWrap.appendChild(leader);

      const price = document.createElement("div");
      price.className = "menu-item-price";
      price.textContent = item.price ?? "";

      row.appendChild(nameWrap);
      row.appendChild(price);

      const dtxt = pickLang(item.desc);
      if (dtxt) {
        const d = document.createElement("div");
        d.className = "menu-item-desc";
        d.textContent = dtxt;
        row.appendChild(d);
      }
      body.appendChild(row);
    });
    wrap.appendChild(body);
    grid.appendChild(wrap);
  });
}

function renderCatering() {
  const grid = document.getElementById("catering-grid");
  if (!grid || !CONTENT.catering) return;
  const c = CONTENT.catering;
  document.getElementById("catering-intro").textContent = pickLang(c.intro);

  grid.innerHTML = "";
  (c.groups || []).forEach((cat, i) => {
    const wrap = document.createElement("details");
    wrap.className = "menu-cat";
    wrap.dataset.catIdx = String(i);
    wrap.open = true;                       // only 3 groups — show all (přehledně)

    const head = document.createElement("summary");
    head.className = "menu-cat-head";
    const title = document.createElement("span");
    title.className = "menu-cat-title";
    title.textContent = pickLang(cat.category);
    const icon = document.createElement("span");
    icon.className = "menu-cat-icon";
    icon.setAttribute("aria-hidden", "true");
    head.append(title, icon);
    wrap.appendChild(head);

    const body = document.createElement("div");
    body.className = "menu-cat-body";
    const dtxt = pickLang(cat.desc);
    if (dtxt) {
      const note = document.createElement("p");
      note.className = "menu-cat-note";
      note.textContent = dtxt;
      body.appendChild(note);
    }
    (cat.items || []).forEach((item) => {
      const row = document.createElement("div");
      row.className = "menu-item";
      const nameWrap = document.createElement("div");
      nameWrap.className = "menu-item-name";
      const name = document.createElement("span");
      name.textContent = pickLang(item.name);
      nameWrap.appendChild(name);           // no leader, no price
      row.appendChild(nameWrap);
      body.appendChild(row);
    });
    wrap.appendChild(body);
    grid.appendChild(wrap);
  });

  const info = document.getElementById("catering-info");
  info.innerHTML = "";
  (c.ordering || []).forEach((r) => {
    const row = document.createElement("div");
    row.className = "ci-row";
    const l = document.createElement("span");
    l.className = "ci-label";
    l.textContent = pickLang(r.label);
    const tx = document.createElement("span");
    tx.className = "ci-text";
    tx.textContent = pickLang(r.text);
    row.append(l, tx);
    info.appendChild(row);
  });
  if (c.cta && CONTENT.shop?.phone) {
    const cta = document.createElement("a");
    cta.className = "catering-cta";
    cta.href = `tel:${CONTENT.shop.phone.replace(/\s+/g, "")}`;
    cta.textContent = pickLang(c.cta);
    info.appendChild(cta);
  }
}

function renderGallery() {
  const grid = document.getElementById("gallery");
  if (!grid || !Array.isArray(CONTENT.gallery)) return;
  grid.innerHTML = "";
  CONTENT.gallery.forEach((item, i) => {
    const fig = document.createElement("figure");
    fig.className = "g" + (i + 1);
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = item.src;
    img.alt = item.caption || "";
    const cap = document.createElement("figcaption");
    cap.textContent = item.caption || "";
    fig.appendChild(img);
    fig.appendChild(cap);
    grid.appendChild(fig);
  });
}

function renderHours() {
  const list = document.getElementById("hours-list");
  list.innerHTML = "";
  const todayIdx = (new Date().getDay() + 6) % 7;
  DAY_KEYS.forEach((k, i) => {
    const li = document.createElement("li");
    if (i === todayIdx) li.classList.add("today");
    const h = CONTENT.hours[k];
    const isClosed = !h || h === "closed";
    if (isClosed) li.classList.add("closed");
    const day = document.createElement("span");
    day.className = "day";
    day.textContent = t("day." + k);
    const dots = document.createElement("span");
    dots.className = "dots";
    const hrs = document.createElement("span");
    hrs.className = "hrs";
    hrs.textContent = isClosed ? t("closed") : h;
    li.appendChild(day);
    li.appendChild(dots);
    li.appendChild(hrs);
    list.appendChild(li);
  });
}

function injectSchema() {
  const s = CONTENT.shop ?? {};
  const openingSpecs = DAY_KEYS
    .filter((k) => CONTENT.hours[k] && CONTENT.hours[k] !== "closed")
    .map((k) => {
      const [open, close] = CONTENT.hours[k].split("-");
      const dayName = {
        mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
        fri: "Friday", sat: "Saturday", sun: "Sunday",
      }[k];
      return { "@type": "OpeningHoursSpecification", dayOfWeek: dayName, opens: open, closes: close };
    });
  const ld = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: s.full_name || s.name,
    url: "https://panbejgl.cz/",
    image: "https://panbejgl.cz/images/bagel-snidanovy.jpg",
    logo: "https://panbejgl.cz/images/favicon.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address_line1,
      addressLocality: s.city || "Praha",
      postalCode: s.postal_code || "120 00",
      addressCountry: "CZ",
    },
    telephone: s.phone,
    email: s.email,
    openingHoursSpecification: openingSpecs,
    sameAs: [s.instagram, s.facebook].filter(Boolean),
  };
  document.getElementById("ld-business").textContent = JSON.stringify(ld);
}

function renderAll() {
  renderShop();
  renderStatic();
  renderGallery();
  renderMenu();
  renderCatering();
  renderHours();
  injectSchema();
}

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lang-toggle").addEventListener("click", () => {
  lang = lang === "cs" ? "en" : "cs";
  localStorage.setItem("panbejgl.lang", lang);
  renderAll();
});

document.getElementById("gallery-more-btn").addEventListener("click", () => {
  const gallery = document.querySelector(".gallery");
  const label = document.getElementById("gallery-more-label");
  const expanded = gallery.classList.toggle("expanded");
  label.dataset.i18n = expanded ? "gallery.less" : "gallery.more";
  label.textContent = t(label.dataset.i18n);
});

// ---------- Lightbox ----------
(() => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const counter = document.getElementById("lightbox-counter");
  const gallery = document.getElementById("gallery");
  let idx = 0;
  let currentPhotos = [];

  function refreshPhotos() {
    const figs = Array.from(gallery.querySelectorAll("figure"));
    currentPhotos = figs.map((f) => ({
      src: f.querySelector("img").src,
      caption: f.querySelector("figcaption")?.textContent ?? "",
    }));
  }

  function show(i) {
    if (!currentPhotos.length) refreshPhotos();
    idx = (i + currentPhotos.length) % currentPhotos.length;
    lightboxImg.src = currentPhotos[idx].src;
    lightboxImg.alt = currentPhotos[idx].caption;
    counter.textContent = `${idx + 1} / ${currentPhotos.length}`;
  }
  function open(i) {
    refreshPhotos();
    show(i);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Event delegation — works even after gallery re-renders
  gallery.addEventListener("click", (e) => {
    const fig = e.target.closest("figure");
    if (!fig) return;
    const figs = Array.from(gallery.querySelectorAll("figure"));
    open(figs.indexOf(fig));
  });
  document.getElementById("lightbox-close").addEventListener("click", close);
  document.getElementById("lightbox-prev").addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
  document.getElementById("lightbox-next").addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(idx + 1);
    else if (e.key === "ArrowLeft") show(idx - 1);
  });
})();

fetch("content.json")
  .then((r) => r.json())
  .then((data) => {
    CONTENT = data;
    renderAll();

    // Subtle fade-in on scroll for sections (runs after content is rendered)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document
      .querySelectorAll(".pull, .gallery figure, .menu-cat, .hours-list li, .pane-visit")
      .forEach((el, i) => {
        el.classList.add("fade-in");
        el.style.transitionDelay = (Math.min(i, 8) * 40) + "ms";
        io.observe(el);
      });
  })
  .catch((err) => {
    console.error("Failed to load content.json", err);
    document.querySelector(".hero-inner").innerHTML =
      "<p style='color:#fff;padding:2rem;text-align:center'>Content failed to load. Serve via a local web server (e.g. <code>python3 -m http.server</code>), not <code>file://</code>.</p>";
  });
