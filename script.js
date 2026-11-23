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
    "hours.note.sat,sun": "O víkendu máme zavřeno — odpočíváme a pečeme na pondělí.",
    "hours.note.sun": "V neděli máme zavřeno — odpočíváme a pečeme na pondělí.",
    "visit.title.em": "Najdete", "visit.title": "nás",
    "visit.where": "Vinohrady · Praha 2",
    "visit.phone": "Telefon", "visit.email": "E-mail", "visit.fb.label": "Pan Bejgl Praha",
    "pull.byline": "pro lepší rána",
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
    "day.mon.short": "Po", "day.tue.short": "Út", "day.wed.short": "St", "day.thu.short": "Čt",
    "day.fri.short": "Pá", "day.sat.short": "So", "day.sun.short": "Ne",
    "page.title": "Pan Bejgl — Bistró Kafe, Vinohrady",
    "page.description": "Bio káva, čerstvé bejgly a domácí bábovky na Vinohradech. Pan Bejgl, Blanická 772/6, Praha 2.",
    "page.description.closed": "Pan Bejgl na Blanické 772/6, Praha 2, je dočasně zavřený a brzy znovu otevře. Mezitím ho najdete na farmářských trzích, třeba na Kulaťáku. Bio káva, čerstvé bejgly a domácí bábovky.",
    "og.locale": "cs_CZ",
    "skip": "Přeskočit na obsah",
    "nav.label": "Hlavní navigace",
    "lang.switch": "Přepnout do angličtiny",
    "ribbon.coffee": "Bio káva", "ribbon.bagels": "Čerstvé bejgly", "ribbon.cakes": "Domácí bábovky",
    "ribbon.where": "{street}, Vinohrady", "ribbon.open": "Otevřeno {days}",
    "gallery.open": "Zvětšit fotku: {caption}",
    "lightbox.label": "Prohlížeč fotek", "lightbox.close": "Zavřít",
    "lightbox.prev": "Předchozí fotka", "lightbox.next": "Další fotka",
    "status.temp_closed": "Dočasně zavřeno", "status.temp_closed.short": "Zavřeno",
    "nav.hours.closed": "Na trzích",
    "hours.title.em.closed": "Na", "hours.title.closed": "trzích",
    "pull.byline.closed": "Teď na trzích · pro lepší rána",
    "menu.note.closed": "Ceny jsou orientační, aktuální nabídku najdete u nás na stánku.",
    "closure.reopen": "Znovu otevřeme {when}",
    "closure.reopen_shop": "Na Blanické znovu otevřeme {when}.",
    "closure.reopen_shop_nodate": "Na Blanické zase otevřeme.",
    "closure.markets": "Najdete nás na farmářských trzích",
    "closure.where": "Kde nás najdete",
    "markets.lead": "Než znovu otevřeme, najdete nás na farmářských trzích, třeba tady:",
    "map.load": "Zobrazit mapu",
    "map.note": "Načte obsah ze služby Google Maps, kde platí zásady Googlu.",
    "map.open": "Otevřít v Google Maps",
    "map.title": "Mapa: Pan Bejgl, {address}",
    "operator.label": "Provozovatel:", "operator.ico": "IČO", "operator.dic": "DIČ",
    "privacy.link": "Ochrana soukromí",
    "privacy.close": "Zavřít",
    "privacy.title.em": "Ochrana", "privacy.title": "soukromí",
    "privacy.intro": "Tenhle web je jen naše vizitka. Nemá žádné formuláře, analytiku, reklamu ani sledovací cookies.",
    "privacy.storage": "Ve vašem prohlížeči si web pamatuje jen to, jestli ho chcete česky, nebo anglicky (v místním úložišti, tzv. local storage). Nikam se to neodesílá a smazat to můžete v nastavení prohlížeče.",
    "privacy.hosting": "Web běží na GitHub Pages. Jejich provozovatel, společnost GitHub, při doručování stránek zpracovává technické údaje, jako je IP adresa, ve svých serverových záznamech.",
    "privacy.hosting.link": "Zásady ochrany soukromí GitHubu",
    "privacy.map": "Mapa od Googlu se načte, až když kliknete na „Zobrazit mapu“ (nebo otevřete odkaz do Google Maps). Teprve pak se váš prohlížeč spojí s Googlem a platí jeho podmínky a zásady ochrany soukromí.",
    "privacy.map.link": "Zásady ochrany soukromí Googlu",
    "privacy.contact": "Když nám zavoláte nebo napíšete e-mail, použijeme vaše kontaktní údaje jen k vyřízení vašeho dotazu.",
    "privacy.controller": "Správcem vašich údajů je {controller}. Ozvat se nám můžete na {contact}.",
    "privacy.or": " nebo ",
    "privacy.complaint": "Pokud máte pocit, že s vašimi údaji nezacházíme správně, můžete si stěžovat u Úřadu pro ochranu osobních údajů (ÚOOÚ):",
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
    "hours.note.sat,sun": "We're closed at weekends — we rest, and bake for Monday.",
    "hours.note.sun": "We're closed Sundays — we rest, and bake for Monday.",
    "visit.title.em": "Find", "visit.title": "us",
    "visit.where": "Vinohrady · Prague 2",
    "visit.phone": "Phone", "visit.email": "Email", "visit.fb.label": "Pan Bejgl Praha",
    "pull.byline": "for better mornings",
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
    "day.mon.short": "Mon", "day.tue.short": "Tue", "day.wed.short": "Wed", "day.thu.short": "Thu",
    "day.fri.short": "Fri", "day.sat.short": "Sat", "day.sun.short": "Sun",
    "page.title": "Pan Bejgl — Bistro Café, Vinohrady",
    "page.description": "Organic coffee, fresh bagels and homemade bundt cakes in Vinohrady. Pan Bejgl, Blanická 772/6, Prague 2.",
    "page.description.closed": "Pan Bejgl at Blanická 772/6, Prague 2, is temporarily closed and will reopen soon. Meanwhile, find us at farmers' markets such as Kulaťák. Organic coffee, fresh bagels and homemade bundt cakes.",
    "og.locale": "en_US",
    "skip": "Skip to content",
    "nav.label": "Main navigation",
    "lang.switch": "Switch to Czech",
    "ribbon.coffee": "Organic coffee", "ribbon.bagels": "Fresh bagels", "ribbon.cakes": "Homemade bundt cakes",
    "ribbon.where": "{street}, Vinohrady", "ribbon.open": "Open {days}",
    "gallery.open": "Enlarge photo: {caption}",
    "lightbox.label": "Photo viewer", "lightbox.close": "Close",
    "lightbox.prev": "Previous photo", "lightbox.next": "Next photo",
    "status.temp_closed": "Temporarily closed", "status.temp_closed.short": "Closed",
    "nav.hours.closed": "Markets",
    "hours.title.em.closed": "At the", "hours.title.closed": "markets",
    "pull.byline.closed": "At the markets for now · for better mornings",
    "menu.note.closed": "Prices are indicative; see our market stall for today's offer.",
    "closure.reopen": "Reopening {when}",
    "closure.reopen_shop": "We'll reopen on Blanická {when}.",
    "closure.reopen_shop_nodate": "We'll reopen on Blanická.",
    "closure.markets": "Find us at farmers' markets",
    "closure.where": "Where to find us",
    "markets.lead": "Until we reopen, you'll find us at farmers' markets, including:",
    "map.load": "Show map",
    "map.note": "Loads content from Google Maps, where Google's privacy policy applies.",
    "map.open": "Open in Google Maps",
    "map.title": "Map: Pan Bejgl, {address}",
    "operator.label": "Operator:", "operator.ico": "Company ID", "operator.dic": "VAT ID",
    "privacy.link": "Privacy",
    "privacy.close": "Close",
    "privacy.title.em": "Your", "privacy.title": "privacy",
    "privacy.intro": "This website is just our calling card. It has no forms, analytics, advertising or tracking cookies.",
    "privacy.storage": "Your browser remembers only whether you want the site in Czech or English (in local storage). It isn't sent anywhere, and you can clear it in your browser settings.",
    "privacy.hosting": "The site is hosted on GitHub Pages. Its operator, GitHub, processes technical data such as IP addresses in its server logs to deliver the site.",
    "privacy.hosting.link": "GitHub's privacy statement",
    "privacy.map": "The Google map loads only when you click “Show map” (or open the Google Maps link). Only then does your browser connect to Google, and Google's own terms and privacy policy apply.",
    "privacy.map.link": "Google's privacy policy",
    "privacy.contact": "If you phone or email us, we use your contact details only to handle your enquiry.",
    "privacy.controller": "The controller of your data is {controller}. You can reach us at {contact}.",
    "privacy.or": " or ",
    "privacy.complaint": "If you feel we're not handling your data properly, you can complain to the Czech data protection authority (ÚOOÚ):",
  },
};

let CONTENT = null;
const storedLang = localStorage.getItem("panbejgl.lang");
let lang = I18N[storedLang] ? storedLang : (/^(cs|sk)(-|$)/i.test(navigator.language || "") ? "cs" : "en");

function t(key, vars = {}) {
  let s = I18N[lang][key] ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

function stateText(key) {
  return (closure() ? I18N[lang][key + ".closed"] : undefined) ?? I18N[lang][key];
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

function closure() {
  const s = CONTENT.status;
  return s?.temporarily_closed ? s : null;
}

function isOpenDay(k) {
  const h = CONTENT.hours[k];
  return !!h && h !== "closed";
}

// "" unless the open days form one unbroken run, which is the only shape a short label can say truthfully.
function openDaysLabel(sep) {
  const open = DAY_KEYS.filter(isOpenDay);
  const first = DAY_KEYS.indexOf(open[0]);
  if (!open.length || DAY_KEYS.indexOf(open.at(-1)) - first !== open.length - 1) return "";
  const short = (k) => t(`day.${k}.short`);
  return open.length === 1 ? short(open[0]) : `${short(open[0])}${sep}${short(open.at(-1))}`;
}

function hoursNote() {
  return I18N[lang][`hours.note.${DAY_KEYS.filter((k) => !isOpenDay(k)).join(",")}`] ?? "";
}

function renderRibbon(items) {
  const track = document.querySelector("#ribbon .ribbon-track");
  track.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    items.forEach((text) => {
      const span = document.createElement("span");
      const star = document.createElement("span");
      star.className = "star";
      star.textContent = "✻";
      span.append(star, " " + text);
      track.appendChild(span);
    });
  }
}

function renderStatic() {
  document.documentElement.lang = lang;
  const closed = closure();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = stateText(el.dataset.i18n);
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const v = I18N[lang][el.dataset.i18nAria];
    if (v != null) el.setAttribute("aria-label", v);
  });

  document.title = t("page.title");
  document.querySelector('meta[name="description"]').content = stateText("page.description");
  document.querySelector('meta[property="og:locale"]').content = t("og.locale");
  document.querySelector('meta[property="og:locale:alternate"]').content = I18N[lang === "cs" ? "en" : "cs"]["og.locale"];

  const days = openDaysLabel(" — ");
  document.getElementById("pull-byline").textContent = closed
    ? t("pull.byline.closed")
    : [days, t("pull.byline")].filter(Boolean).join(" · ");

  document.getElementById("hero-tagline").textContent = pickLang(CONTENT.tagline);
  document.getElementById("hero-subtitle").textContent = pickLang(CONTENT.subtitle);
  document.getElementById("pull-text").textContent =
    pickLang((closed && closed.about) || CONTENT.about);

  document.querySelectorAll("#lang-toggle [data-lang]").forEach((el) => {
    el.classList.toggle("active", el.dataset.lang === lang);
  });

  if (closed) {
    const label = t("status.temp_closed");
    document.getElementById("hero-today").textContent = label;
    const pill = document.getElementById("pill-status");
    const long = document.createElement("span");
    long.className = "pill-long";
    long.textContent = label;
    const short = document.createElement("span");
    short.className = "pill-short";
    short.textContent = t("status.temp_closed.short");
    document.getElementById("pill-status-text").replaceChildren(long, short);
    pill.title = label;
    pill.classList.remove("is-open");
    pill.classList.add("is-closed");
    pill.setAttribute("aria-label", label);
    return;
  }

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

  const shop = CONTENT.shop ?? {};
  const openDays = openDaysLabel("–");
  renderRibbon([
    t("ribbon.coffee"),
    t("ribbon.bagels"),
    t("ribbon.cakes"),
    shop.address_line1 && t("ribbon.where", { street: shop.address_line1 }),
    openDays && t("ribbon.open", { days: openDays }),
  ].filter(Boolean));
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

  const address = [shop.address_line1, shop.address_line2].filter(Boolean).join(", ");
  document.getElementById("map-address").textContent = address;
  document.getElementById("map-load").hidden = !shop.map_embed_src;
  document.getElementById("map-note").hidden = !shop.map_embed_src;
  const mapLink = document.getElementById("map-link");
  mapLink.hidden = !shop.map_link;
  if (shop.map_link) mapLink.href = shop.map_link;
  const iframe = document.getElementById("map-iframe");
  if (iframe) iframe.title = t("map.title", { address });
}

function loadMap() {
  const shop = CONTENT.shop;
  const iframe = document.createElement("iframe");
  iframe.id = "map-iframe";
  iframe.src = shop.map_embed_src;
  iframe.title = t("map.title", { address: document.getElementById("map-address").textContent });
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  document.getElementById("map-consent").hidden = true;
  document.getElementById("map-wrap").append(iframe);
  iframe.focus();
}

function renderOperator() {
  const op = CONTENT.operator ?? {};
  const shop = CONTENT.shop ?? {};
  const parts = [
    op.legal_name,
    op.registered_address,
    op.ico && `${t("operator.ico")}\u00a0${op.ico}`,
    op.dic && `${t("operator.dic")}\u00a0${op.dic}`,
    pickLang(op.register_entry),
  ].filter(Boolean);
  const legal = document.getElementById("footer-legal");
  legal.hidden = !parts.length;
  legal.textContent = parts.length ? `${t("operator.label")} ${parts.join(" · ")}` : "";

  const controller = op.legal_name
    ? [op.legal_name, op.registered_address, op.ico && `${t("operator.ico")}\u00a0${op.ico}`].filter(Boolean).join(", ")
    : (shop.full_name || shop.name);
  const contacts = [];
  if (shop.email) contacts.push(link(`mailto:${shop.email}`, shop.email));
  if (shop.phone) contacts.push(link(`tel:${shop.phone.replace(/\s+/g, "")}`, shop.phone));
  const contactNodes = contacts.flatMap((a, i) => (i ? [t("privacy.or"), a] : [a]));
  fillTemplate(document.getElementById("privacy-controller"), t("privacy.controller"), {
    controller,
    contact: contactNodes,
  });
}

function link(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  return a;
}

function fillTemplate(el, template, vars) {
  const nodes = template.split(/\{(\w+)\}/).flatMap((piece, i) => (i % 2 ? vars[piece] ?? [] : [piece]));
  el.replaceChildren(...nodes);
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
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", item.caption ? t("gallery.open", { caption: item.caption }) : t("lightbox.label"));
    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
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
  const note = document.getElementById("hours-note");
  note.textContent = hoursNote();
  note.hidden = !note.textContent;
}

function renderClosure() {
  const closed = closure();
  const notice = document.getElementById("hero-notice");
  const hoursList = document.getElementById("hours-list");
  const markets = document.getElementById("markets");
  notice.hidden = !closed;
  hoursList.hidden = !!closed;
  markets.hidden = !closed;
  if (!closed) return;

  const when = pickLang(closed.reopening);
  const marketList = Array.isArray(closed.markets) ? closed.markets : [];

  document.getElementById("hero-notice-text").textContent = pickLang(closed.message);
  const reopen = document.getElementById("hero-notice-reopen");
  reopen.textContent = when ? t("closure.reopen", { when }) : "";
  reopen.hidden = !when;

  const note = document.getElementById("hours-note");
  note.textContent = when ? t("closure.reopen_shop", { when }) : t("closure.reopen_shop_nodate");
  note.hidden = false;

  const list = document.getElementById("markets-list");
  list.innerHTML = "";
  marketList.forEach((m) => {
    const li = document.createElement("li");
    [["market-name", m.name], ["market-place", m.place], ["market-when", m.when]].forEach(([cls, val]) => {
      const text = pickLang(val);
      if (!text) return;
      const span = document.createElement("span");
      span.className = cls;
      span.textContent = text;
      li.appendChild(span);
    });
    if (li.childNodes.length) list.appendChild(li);
  });

  renderRibbon([
    t("status.temp_closed"),
    when && t("closure.reopen", { when }),
    t("closure.markets"),
    ...marketList.map((m) => [pickLang(m.name), pickLang(m.place)].filter(Boolean).join(", ")),
  ].filter(Boolean));
}

function injectSchema() {
  const s = CONTENT.shop ?? {};
  const closed = closure();
  const dayNames = {
    mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
    fri: "Friday", sat: "Saturday", sun: "Sunday",
  };
  const openingSpecs = DAY_KEYS
    .filter((k) => CONTENT.hours[k] && CONTENT.hours[k] !== "closed")
    .map((k) => {
      const [open, close] = CONTENT.hours[k].split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: dayNames[k], opens: open, closes: close };
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
    openingHoursSpecification: closed ? undefined : openingSpecs,
    sameAs: [s.instagram, s.facebook].filter(Boolean),
  };
  if (closed) {
    const message = closed.message?.cs || pickLang(closed.message);
    if (message) ld.description = message;
    // Google documents a closed day as opens = closes = "00:00"; there is no schema.org "temporarily closed" status.
    ld.specialOpeningHoursSpecification = {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: Object.values(dayNames),
      opens: "00:00",
      closes: "00:00",
    };
  }
  document.getElementById("ld-business").textContent = JSON.stringify(ld);
}

function renderAll() {
  renderShop();
  renderStatic();
  renderGallery();
  renderMenu();
  renderCatering();
  renderHours();
  renderClosure();
  renderOperator();
  injectSchema();
}

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lang-toggle").addEventListener("click", () => {
  lang = lang === "cs" ? "en" : "cs";
  localStorage.setItem("panbejgl.lang", lang);
  renderAll();
});

document.getElementById("map-load").addEventListener("click", loadMap);

(() => {
  const dialog = document.getElementById("privacy");
  const open = () => { if (!dialog.open) dialog.showModal(); };
  document.getElementById("privacy-open").addEventListener("click", (e) => {
    e.preventDefault();
    open();
  });
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    if (location.hash === "#privacy") history.replaceState(null, "", location.pathname + location.search);
  });
  if (location.hash === "#privacy") open();
})();

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
  let opener = null;

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
    opener = document.activeElement;
    refreshPhotos();
    show(i);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    document.getElementById("lightbox-close").focus();
  }
  function close() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    opener?.focus();
  }

  // Event delegation — works even after gallery re-renders
  function openFrom(e) {
    const fig = e.target.closest("figure");
    if (!fig) return;
    e.preventDefault();
    open(Array.from(gallery.querySelectorAll("figure")).indexOf(fig));
  }
  gallery.addEventListener("click", openFrom);
  gallery.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") openFrom(e); });
  document.getElementById("lightbox-close").addEventListener("click", close);
  document.getElementById("lightbox-prev").addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
  document.getElementById("lightbox-next").addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") show(idx + 1);
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "Tab") {
      const buttons = Array.from(lightbox.querySelectorAll("button"));
      const at = buttons.indexOf(document.activeElement);
      e.preventDefault();
      buttons[(at + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
    }
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
