/**
 * Meta Pixel. Off unless VITE_META_PIXEL_ID holds the dataset id. The server sends the same
 * Lead through the Conversions API (lib/meta-capi.ts) with the same event id, so Meta counts
 * each lead once and still sees it when a browser blocks the pixel.
 */

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const PIXEL_ID = ((import.meta.env.VITE_META_PIXEL_ID as string | undefined) ?? "").replace(/\D/g, "");
export const pixelEnabled = PIXEL_ID.length >= 10;

/** Loads Meta's script once and counts the first page view. */
export function initPixel(): void {
  if (!pixelEnabled || typeof window === "undefined" || window.fbq) return;
  const queue: unknown[][] = [];
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) (fbq.callMethod as (...a: unknown[]) => void)(...args);
    else queue.push(args);
  }) as Fbq;
  fbq.queue = queue;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  fbq("init", PIXEL_ID);
  fbq("track", "PageView");
}

/** A page view after an in-app navigation. */
export function pixelPageView(): void {
  window.fbq?.("track", "PageView");
}

/** One id per lead, shared by the browser event and the server event. */
export function newEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/** A sent message is a Lead; a booked call is a Schedule. */
export function pixelLead(kind: "message" | "booked", eventId: string): void {
  window.fbq?.("track", kind === "booked" ? "Schedule" : "Lead", {}, { eventID: eventId });
}

/** Meta's browser id cookie, when the pixel set one. */
export function fbp(): string {
  try {
    return document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/)?.[1] ?? "";
  } catch {
    return "";
  }
}
