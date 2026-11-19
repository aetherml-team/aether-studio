/**
 * Which ad brought the visitor. A Meta ad links here with
 * `utm_source=meta&utm_campaign={{campaign.id}}&utm_content={{ad.id}}`; the forms send what is kept
 * here so the CRM lead names its campaign and ad.
 *
 * The first paid visit is kept for KEEP_DAYS; a later visit from another campaign replaces it.
 * Storage can throw (private mode, blocked site data): every read and write is guarded, and the
 * current URL is the fallback.
 */

const KEY = "aether.attribution";
export const KEEP_DAYS = 30;
const DAY_MS = 86_400_000;

export interface Attribution {
  source?: string;
  campaign?: string;
  ad?: string;
  link?: string;
  /** Meta's click id as the fbc value the Conversions API takes: fb.1.<ms>.<fbclid>. */
  fbc?: string;
}

interface Stored extends Attribution {
  at: number;
}

/** What the URL says, or null when it carries no campaign and no Meta click id. */
export function fromUrl(href: string, now = Date.now()): Attribution | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const campaign = url.searchParams.get("utm_campaign")?.trim();
  const fbclid = url.searchParams.get("fbclid")?.trim();
  if (!campaign && !fbclid) return null;
  const out: Attribution = { link: href.slice(0, 500) };
  if (campaign) out.campaign = campaign;
  if (fbclid && /^[A-Za-z0-9_-]{1,400}$/.test(fbclid)) out.fbc = `fb.1.${now}.${fbclid}`;
  const source = url.searchParams.get("utm_source")?.trim();
  const ad = url.searchParams.get("utm_content")?.trim();
  if (source) out.source = source;
  if (ad) out.ad = ad;
  return out;
}

/** The stored visit still in its window, or null. */
export function keptVisit(raw: string | null, now: number): Attribution | null {
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw) as Stored;
    if (typeof stored.at !== "number" || now - stored.at > KEEP_DAYS * DAY_MS) return null;
    const { at: _at, ...rest } = stored;
    return rest;
  } catch {
    return null;
  }
}

/** Which visit to keep: a new campaign replaces the stored one; the same campaign keeps the first. */
export function choose(current: Attribution | null, kept: Attribution | null): Attribution | null {
  if (!current) return kept;
  if (kept && kept.campaign === current.campaign) return kept;
  return current;
}

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(value: Attribution, now: number): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...value, at: now }));
  } catch {
    // Storage blocked: attribution() falls back to the current URL.
  }
}

/** Runs once on load. */
export function captureAttribution(): void {
  const now = Date.now();
  const current = fromUrl(window.location.href);
  const kept = keptVisit(read(), now);
  const chosen = choose(current, kept);
  if (chosen && chosen !== kept) write(chosen, now);
}

/** What the forms send. */
export function attribution(): Attribution {
  return keptVisit(read(), Date.now()) ?? fromUrl(window.location.href) ?? {};
}

/** `?test=1` files the lead as a test the CRM ignores. */
export function isTestVisit(): boolean {
  try {
    return new URL(window.location.href).searchParams.get("test") === "1";
  } catch {
    return false;
  }
}
