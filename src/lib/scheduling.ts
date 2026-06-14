/**
 * Scheduling config, kept separate from the Cal.com embed so callers can read it
 * synchronously without pulling the (heavy) embed bundle. BookCall is lazy-loaded;
 * this module is not.
 *
 * VITE_CAL_LINK is the Cal.com booking link in "username/event-type" form
 * (e.g. "aether-studio/audit"). When unset, scheduling is disabled and the
 * contact section shows the message form only.
 */
export const CAL_LINK = (import.meta.env.VITE_CAL_LINK as string | undefined)?.trim() || "";
export const schedulingEnabled = CAL_LINK.length > 0;
