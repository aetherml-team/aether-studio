/**
 * Files a website lead in Æther's Zoho CRM through a Web-to-Lead form, with the ad that brought
 * the visitor. Nexus reads the lead's Description as `Label: value` lines; the labels in
 * DESCRIPTION_LABELS are that contract and stay in English on both languages of the site.
 *
 * The webform is `aetherml-website` (id 7505197000001442021) in Æther's CRM org `ther`. Its two
 * tokens are public: Zoho's own embed code puts them in the page's HTML. Saving that webform in
 * Zoho gives it new tokens; paste the new ones into WEBFORM below, or set ZOHO_WEBFORM_XNQSJSDP and
 * ZOHO_WEBFORM_XMIWTLD in Vercel to override them without a code change.
 *
 * Every failure here is logged and swallowed: the team email stays the lead's fallback.
 */

export const DESCRIPTION_LABELS = {
  service: "Service",
  phone: "WhatsApp",
  campaign: "Ad",
  ad: "Ad id",
  link: "Source link",
  callDate: "Call date",
  callTime: "Call time",
  notes: "Notes",
} as const;

export const STATUS = {
  form: "Conversation Started",
  booked: "Call Booked",
  test: "Junk Lead",
} as const;

const WEBFORM_URL = "https://crm.zoho.com/crm/WebToLeadForm";
const WEBFORM = {
  xnQsjsdp: "57d2f3c1fcf7d93728214c3b4cadbadfd378f845a64feb01f589d40d2d401d60",
  xmIwtLD:
    "c9066130bdc71c29a8a91dee2808ceed3692206f979cbe44d872436b4f29f8f75112e6d2c3c20626dbcb9368323ff866",
};
const TIMEOUT_MS = 5000;
const META_ID = /^\d{1,32}$/;
const SOURCE = /^[a-z0-9_.-]{1,40}$/i;

/** What the visitor wants solved, by the key the site sends; the CRM gets the English label. */
export const NEED_LABEL: Record<string, string> = {
  payments: "Payments and collections",
  sales: "Sales and clients",
  inventory: "Inventory and purchasing",
  accounting: "Accounting and invoicing",
  other: "Something else",
};

/** A known need's label, or "" for anything the site does not offer. */
export function needLabel(raw: unknown): string {
  return typeof raw === "string" && Object.prototype.hasOwnProperty.call(NEED_LABEL, raw) ? NEED_LABEL[raw] : "";
}

/** A phone as typed, kept when it holds 8 to 15 digits; a leading + stays. Mexican 10 digits get +52. */
export function parsePhone(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return "";
  if (raw.trim().startsWith("+")) return `+${digits}`;
  return digits.length === 10 ? `+52${digits}` : `+${digits}`;
}

export interface Attribution {
  source?: string;
  campaign?: string;
  ad?: string;
  link?: string;
  fbc?: string;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** One line: a newline inside a value would start a new label in the block. */
function oneLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** What the browser sent, kept only where it looks like Meta's ids; anything else is dropped. */
export function parseAttribution(raw: unknown): Attribution {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const out: Attribution = {};
  const source = text(o.source, 40);
  const campaign = text(o.campaign, 32);
  const ad = text(o.ad, 32);
  const link = oneLine(text(o.link, 500));
  if (SOURCE.test(source)) out.source = source.toLowerCase();
  if (META_ID.test(campaign)) out.campaign = campaign;
  if (META_ID.test(ad)) out.ad = ad;
  if (/^https?:\/\//i.test(link)) out.link = link;
  const fbc = text(o.fbc, 500);
  if (/^fb\.\d\.\d{10,16}\.[A-Za-z0-9_-]+$/.test(fbc)) out.fbc = fbc;
  return out;
}

/** "Ana María López" → Ana / María López; one word goes whole to Last Name, which Zoho requires. */
export function splitName(name: string): { first: string; last: string } {
  const words = oneLine(name).split(/\s+/).filter(Boolean);
  if (words.length < 2) return { first: "", last: words.join(" ") };
  return { first: words[0].slice(0, 40), last: words.slice(1).join(" ").slice(0, 80) };
}

const PERSONAL_MAIL = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.es",
  "outlook.com",
  "outlook.es",
  "live.com",
  "live.com.mx",
  "yahoo.com",
  "yahoo.com.mx",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
]);

/** Zoho requires Company on a lead: the email's domain, or the person's name for a personal address. */
export function companyFor(name: string, email: string): string {
  const domain = email.split("@")[1]?.trim().toLowerCase() ?? "";
  if (domain && !PERSONAL_MAIL.has(domain)) return domain.slice(0, 200);
  return oneLine(name).slice(0, 200) || email.slice(0, 200);
}

export interface CallSlot {
  date: string;
  time: string;
}

/** The booked slot in Mexico City time, as `2026-11-20` and `17:00`. */
export function callSlot(startMs: number): CallSlot | null {
  if (!Number.isFinite(startMs)) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(startMs));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour")}:${get("minute")}` };
}

/** The Description block: one `Label: value` line per known value, the message last. */
export function describeLead(d: {
  attribution: Attribution;
  message?: string;
  call?: CallSlot | null;
  need?: string;
  phone?: string;
}): string {
  const L = DESCRIPTION_LABELS;
  const lines: string[] = [];
  if (d.need) lines.push(`${L.service}: ${d.need}`);
  if (d.phone) lines.push(`${L.phone}: ${d.phone}`);
  if (d.attribution.campaign) lines.push(`${L.campaign}: ${d.attribution.campaign}`);
  if (d.attribution.ad) lines.push(`${L.ad}: ${d.attribution.ad}`);
  if (d.attribution.link) lines.push(`${L.link}: ${d.attribution.link}`);
  if (d.call) {
    lines.push(`${L.callDate}: ${d.call.date}`);
    lines.push(`${L.callTime}: ${d.call.time}`);
  }
  const message = (d.message ?? "").trim();
  if (message) lines.push(`${L.notes}: ${message}`);
  return lines.join("\n");
}

export interface LeadInput {
  name: string;
  email: string;
  message?: string;
  /** Already parsed with parsePhone. */
  phone?: string;
  /** Already resolved with needLabel. */
  need?: string;
  attribution: Attribution;
  kind: "form" | "booked";
  test: boolean;
  call?: CallSlot | null;
}

/** The webform POST body, field names as the Zoho webform declares them. */
export function webformBody(lead: LeadInput, tokens: { xnQsjsdp: string; xmIwtLD: string }): URLSearchParams {
  const { first, last } = splitName(lead.name);
  const body = new URLSearchParams();
  body.set("xnQsjsdp", tokens.xnQsjsdp);
  body.set("xmIwtLD", tokens.xmIwtLD);
  body.set("actionType", "TGVhZHM=");
  body.set("returnURL", "https://www.aetherml.com/");
  // Zoho's own honeypot field: an empty value marks a person.
  body.set("aG9uZXlwb3Q", "");
  body.set("Company", companyFor(lead.name, lead.email));
  if (first) body.set("First Name", first);
  body.set("Last Name", last || lead.email);
  body.set("Email", lead.email.slice(0, 100));
  if (lead.phone) body.set("Phone", lead.phone);
  body.set("Lead Source", lead.attribution.source === "meta" ? "Facebook" : "Website");
  body.set("Lead Status", lead.test ? STATUS.test : STATUS[lead.kind]);
  const description = describeLead(lead);
  if (description) body.set("Description", description);
  return body;
}

function tokens(): { xnQsjsdp: string; xmIwtLD: string } {
  return {
    xnQsjsdp: process.env.ZOHO_WEBFORM_XNQSJSDP?.trim() || WEBFORM.xnQsjsdp,
    xmIwtLD: process.env.ZOHO_WEBFORM_XMIWTLD?.trim() || WEBFORM.xmIwtLD,
  };
}

/** Previews never file a real lead; a `?test=1` submit files a Junk Lead anywhere. */
export function shouldFile(test: boolean, env = process.env.VERCEL_ENV): boolean {
  return test || env === "production";
}

/** Files the lead. Never throws; resolves to whether Zoho accepted the POST. */
export async function fileCrmLead(lead: LeadInput): Promise<boolean> {
  if (!shouldFile(lead.test)) return false;
  const keys = tokens();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(process.env.ZOHO_WEBFORM_URL?.trim() || WEBFORM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: webformBody(lead, keys).toString(),
      redirect: "manual",
      signal: controller.signal,
    });
    // Zoho answers with a redirect to returnURL; it does so even when it files nothing, so the
    // record in Zoho is the only real proof. A 4xx/5xx is a certain failure.
    if (res.status >= 400) {
      console.error(`crm_lead_failed: Zoho answered ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("crm_lead_failed:", err instanceof Error ? err.name : err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
