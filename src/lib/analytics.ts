/**
 * Thin wrapper over Plausible's custom-event API. The script + queue stub are
 * loaded in index.html; this stays a safe no-op when analytics isn't present
 * (dev, ad-blockers, or before the Plausible site is configured).
 */

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: EventProps; callback?: () => void }
    ) => void;
  }
}

export function track(event: string, props?: EventProps): void {
  if (typeof window === "undefined") return;
  window.plausible?.(event, props ? { props } : undefined);
}
