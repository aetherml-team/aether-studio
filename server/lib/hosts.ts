import config from "../config";

export type ClientName = "landing" | "app";

/**
 * Map an incoming Host header to a named client.
 *
 * Rules:
 *   app.*    → "app"   (e.g. app.example.com, app.localhost)
 *   anything else → "landing"  (apex, www, preview hosts, etc.)
 *
 * Add more entries here as you add new clients (e.g. "admin", "docs").
 */
export function resolveClient(hostHeader: string | undefined): ClientName {
  const host = (hostHeader ?? "").split(":")[0].toLowerCase();
  const sub = host.split(".")[0];

  if (sub === "app") return "app";
  return "landing";
}

/** Return the dist directory for a given client. */
export function distForClient(client: ClientName): string {
  return config.dists[client];
}
