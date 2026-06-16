/**
 * Scheduling config for the native Calendly booking flow (src/components/BookCall.tsx).
 *
 * The Calendly token and event type live server-side only (CALENDLY_TOKEN /
 * CALENDLY_EVENT_TYPE, see api/_calendly.ts) — the browser never sees them and
 * talks to /api/availability + /api/book instead. The client only needs to know
 * whether to surface the "Book a call" path at all.
 *
 * Scheduling is on by default. Set VITE_SCHEDULING_ENABLED="false" to hide the
 * booking tab and fall back to the contact form (e.g. before Calendly is wired
 * up). Vite only reads env vars at startup — restart `npm run dev` after changing.
 */
export const schedulingEnabled =
  (import.meta.env.VITE_SCHEDULING_ENABLED as string | undefined)?.trim().toLowerCase() !== "false";
