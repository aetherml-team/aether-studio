import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.aetherml.com";

type Props = {
  /** Full document title, e.g. "Privacy Notice · Æther". */
  title: string;
  /** Meta description for this route. */
  description?: string;
  /** Route path beginning with "/", used for the self-referential canonical. */
  path: string;
  /** Render-time language ("en" | "es") for og:locale. */
  lang?: "en" | "es";
  /** Keep the page out of the index (e.g. thin or duplicate pages). */
  noindex?: boolean;
};

/**
 * Per-route <head> tags. The homepage's full social/meta set lives statically
 * in index.html so non-JS crawlers and social scrapers always see it; this
 * component overrides the per-route bits (title, description, canonical) for
 * client-rendered routes and keeps the browser tab title correct during SPA
 * navigation. When the blog lands, every post gets correct metadata for free.
 */
export function Seo({ title, description, path, lang = "en", noindex }: Props) {
  const url = `${SITE_URL}${path}`;
  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />

      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:locale" content={lang === "es" ? "es_MX" : "en_US"} />

      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}

      {noindex && <meta name="robots" content="noindex, follow" />}
    </Helmet>
  );
}
