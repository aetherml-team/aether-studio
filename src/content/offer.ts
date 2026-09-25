/**
 * Offer facts that are not copy: prices and the live systems we can show.
 * Copy for each lives in the locales under `investment.*` and `systems.items`.
 *
 * Prices: null = not published yet. The Investment section renders
 * "precio fijo después de la auditoría" for a null price. Fill these in
 * MXN before IVA; the only datapoint on record (Sismo Café) is one proposal and
 * must not be generalised, so nothing is prefilled here.
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
 * Screenshots: public/work/<slug>-1.png … -<shots>.png, blurred, cycled in the card.
 * Logos: public/work/logos/<slug>.png, the client's own brand mark from their site.
 * `logoDark`: the mark is light-on-transparent and needs a dark chip.
 * `site` is the client's public website. `store` is a storefront we built.
 * Tenant admin apps are private and are never linked or named by domain here.
 */
export const SYSTEMS: ReadonlyArray<{
  slug: string;
  shots: number;
  site?: string;
  store?: string;
  /** The client's public Instagram, the profile a local owner checks first. */
  instagram?: string;
  logoDark?: boolean;
  /** Signed but not yet live: no name, logo, site or screenshots on the page. */
  upcoming?: boolean;
}> = [
  { slug: "tavros", shots: 3, site: "https://www.tavrosfuerza.com/", instagram: "https://instagram.com/tavrosfuerza" },
  { slug: "eternus", shots: 3, site: "https://eternusnow.com/", logoDark: true },
  { slug: "sismocafe", shots: 3, site: "https://sismocafe.com/", instagram: "https://instagram.com/sismocafe" },
  { slug: "eloisa", shots: 2, site: "https://eloisamontero.com.mx/", store: "https://eloisamontero.aetherml.com" },
  {
    slug: "weddingmethod",
    shots: 2,
    site: "https://thewedding-method.com/",
    store: "https://theweddingame.com/",
    logoDark: true,
  },
  { slug: "aether", shots: 2, site: "https://www.aetherml.com" },
  { slug: "panaderia", shots: 1, upcoming: true },
];

export const HERO_SHOT = "/work/tavros-2.png";
