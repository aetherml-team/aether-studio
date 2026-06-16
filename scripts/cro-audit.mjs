import { chromium, devices } from 'playwright';

const URL = 'https://www.aetherml.com';

const browser = await chromium.launch();
// Mid-range Android, 390px viewport, mobile data throttling
const ctx = await browser.newContext({
  ...devices['Pixel 5'],
  viewport: { width: 390, height: 844 },
  ignoreHTTPSErrors: true,
  locale: 'es-MX',
  geolocation: { latitude: 20.6597, longitude: -103.3496 }, // Guadalajara
  extraHTTPHeaders: { 'Accept-Language': 'es-MX,es;q=0.9,en;q=0.5' },
});
const page = await ctx.newPage();

// Throttle CPU + network to mimic mid-range Android on mobile data
const client = await ctx.newCDPSession(page);
await client.send('Network.enable');
await client.send('Network.emulateNetworkConditions', {
  offline: false,
  latency: 150,                       // ms RTT
  downloadThroughput: (1.6 * 1024 * 1024) / 8, // ~1.6 Mbps (slow 4G)
  uploadThroughput: (750 * 1024) / 8,
});
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });

const t0 = Date.now();
await page.goto(URL, { waitUntil: 'domcontentloaded' });

// Capture when the loader overlay is gone (app painted)
let appLoadedAt = null;
try {
  await page.waitForFunction(
    () => document.documentElement.classList.contains('app-loaded') ||
          !document.getElementById('app-loader'),
    { timeout: 20000 }
  );
  appLoadedAt = Date.now() - t0;
} catch { appLoadedAt = 'TIMEOUT >20s'; }

await page.waitForTimeout(2500); // let animations settle

// Performance metrics
const perf = await page.evaluate(() => {
  const nav = performance.getEntriesByType('navigation')[0] || {};
  const paints = {};
  performance.getEntriesByType('paint').forEach(p => paints[p.name] = Math.round(p.startTime));
  let lcp = null;
  try {
    const lcps = performance.getEntriesByType('largest-contentful-paint');
    if (lcps.length) lcp = Math.round(lcps[lcps.length - 1].startTime);
  } catch {}
  return {
    domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
    load: Math.round(nav.loadEventEnd || 0),
    firstPaint: paints['first-paint'] ?? null,
    firstContentfulPaint: paints['first-contentful-paint'] ?? null,
    lcp,
  };
});

// What's visible above the fold (within first 844px)
const aboveFold = await page.evaluate(() => {
  const fold = 844;
  const out = [];
  const walk = el => {
    for (const node of el.children) {
      const r = node.getBoundingClientRect();
      if (r.top < fold && r.bottom > 0 && r.width > 0 && r.height > 0) {
        const txt = (node.innerText || '').trim();
        if (txt && node.children.length === 0) out.push(txt);
      }
      walk(node);
    }
  };
  walk(document.body);
  return [...new Set(out)].slice(0, 40);
});

// Headings, buttons, links
const structure = await page.evaluate(() => {
  const grab = sel => [...document.querySelectorAll(sel)].map(e => (e.innerText || e.textContent || '').trim()).filter(Boolean);
  const buttons = [...document.querySelectorAll('button, a[role="button"], a.btn, [class*="button" i] a, a[class*="button" i]')]
    .map(e => {
      const r = e.getBoundingClientRect();
      return { text: (e.innerText||'').trim(), href: e.getAttribute('href')||'', w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) };
    }).filter(b => b.text);
  const allLinks = [...document.querySelectorAll('a')].map(a => ({ text:(a.innerText||'').trim(), href:a.getAttribute('href')||'' })).filter(l=>l.text);
  return {
    h1: grab('h1'),
    h2: grab('h2'),
    h3: grab('h3'),
    buttons,
    links: allLinks,
    htmlLang: document.documentElement.lang,
  };
});

// Sticky CTA detection: scroll and see if any fixed/sticky element with a CTA stays
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
await page.waitForTimeout(800);
const stickyEls = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if ((cs.position === 'fixed' || cs.position === 'sticky') && el.offsetHeight > 0 && el.offsetWidth > 0) {
      const txt = (el.innerText || '').trim().slice(0, 80);
      if (txt) out.push({ pos: cs.position, txt });
    }
  });
  return [...new Map(out.map(o => [o.txt, o])).values()].slice(0, 15);
});

// Full visible text (rendered)
await page.evaluate(() => window.scrollTo(0, 0));
const fullText = await page.evaluate(() => document.body.innerText);

// Detect any analytics/pixels present
const trackers = await page.evaluate(() => {
  const scripts = [...document.scripts].map(s => s.src).filter(Boolean);
  return {
    plausible: scripts.some(s => s.includes('plausible')) || !!window.plausible,
    gtag: !!window.gtag || scripts.some(s => s.includes('googletagmanager') || s.includes('google-analytics')),
    meta_pixel: !!window.fbq || scripts.some(s => s.includes('connect.facebook')),
    posthog: !!window.posthog || scripts.some(s => s.includes('posthog')),
    scripts,
  };
});

// Language toggle present?
const langToggle = await page.evaluate(() => {
  const cands = [...document.querySelectorAll('button, a')].map(e => (e.innerText||'').trim());
  return cands.filter(t => /^(ES|EN|Español|English|ES \/ EN|EN \/ ES)$/i.test(t));
});

await page.screenshot({ path: 'scripts/aether-hero-mobile.png' });
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: 'scripts/aether-fullpage-mobile.png', fullPage: true });

console.log(JSON.stringify({
  timing: { appLoadedAt, perf },
  structure,
  langToggle,
  aboveFold,
  stickyEls,
  trackers,
  fullText,
}, null, 2));

await browser.close();
