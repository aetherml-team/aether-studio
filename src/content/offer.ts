/**
 * Offer facts that are not copy: prices and the live systems we can show.
 * Copy for each lives in the locales under `investment.*` and `systems.items`.
 *
 * Prices: null = not published yet. The Investment section always says the
 * price is fixed after the audit, and adds "Desde $X + IVA" once
 * fase1.implementation is set. Fill these in MXN before IVA; the only
 * datapoint on record (Sismo Café) is one proposal and must not be
 * generalised, so nothing is prefilled here.
 * TODO(price): set fase1.implementation to show the "from" line.
 */
export type Price = number | null;

export const PRICING: Record<"fase1" | "recomendado", { implementation: Price; monthly: Price }> = {
  fase1: { implementation: null, monthly: null },
  recomendado: { implementation: null, monthly: null },
};

export function mxn(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Logos: public/work/logos/<slug>.png, the client's own brand mark from their site.
 * `logoDark`: the mark is light-on-transparent and needs a dark chip.
 * `site` is the client's public website. `store` is a storefront we built.
 * Tenant admin apps are private and are never linked or named by domain here.
 */
export const SYSTEMS: ReadonlyArray<{
  slug: string;
  site?: string;
  store?: string;
  /** The client's public Instagram, the profile a local owner checks first. */
  instagram?: string;
  logoDark?: boolean;
  /** Signed but not yet live: no name, logo, site or screenshots on the page. */
  upcoming?: boolean;
}> = [
  { slug: "tavros", site: "https://www.tavrosfuerza.com/", instagram: "https://instagram.com/tavrosfuerza" },
  { slug: "eternus", site: "https://eternusnow.com/", logoDark: true },
  { slug: "sismocafe", site: "https://sismocafe.com/", instagram: "https://instagram.com/sismocafe" },
  { slug: "eloisa", site: "https://eloisamontero.com.mx/", store: "https://eloisamontero.aetherml.com" },
  {
    slug: "weddingmethod",
    site: "https://thewedding-method.com/",
    store: "https://theweddingame.com/",
    logoDark: true,
  },
  { slug: "aether", site: "https://www.aetherml.com" },
  { slug: "panaderia", upcoming: true },
];

export const HERO_SHOT = "/work/tavros-2.png";

/**
 * One product screen per vertical, in the order of `nexus.items`: gym billing,
 * studio finances, café/roastery, jewellery store, mentoring leads. Live screens
 * captured 2026-10-14 with every customer name and amount covered by a solid bar.
 * null renders a marked placeholder slot.
 * TODO(screenshots): /work/demo-mentoring.jpg, the Wedding Method leads analytics.
 */
export const DEMO_SHOTS: ReadonlyArray<string | null> = [
  "/work/demo-gym.jpg",
  "/work/demo-studio.jpg",
  "/work/demo-cafe.jpg",
  "/work/demo-jewellery.jpg",
  null,
];
