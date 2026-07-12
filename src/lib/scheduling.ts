/**
 * Scheduling config for the native TidyCal booking flow (src/components/BookCall.tsx).
 *
 * The TidyCal token and booking type ID live server-side only (TIDYCAL_TOKEN /
 * TIDYCAL_BOOKING_TYPE_ID, read by api/availability.ts + api/book.ts) — the browser
 * never sees them and talks to those endpoints instead. The client only needs to know
 * whether to surface the "Book a call" path at all.
 *
 * Scheduling is on by default. Set VITE_SCHEDULING_ENABLED="false" to hide the
 * booking tab and fall back to the contact form (e.g. before TidyCal is wired
 * up). Vite only reads env vars at startup — restart `npm run dev` after changing.
 */
export const schedulingEnabled =
  (import.meta.env.VITE_SCHEDULING_ENABLED as string | undefined)?.trim().toLowerCase() !== "false";
