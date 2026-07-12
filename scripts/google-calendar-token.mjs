/**
 * One-time OAuth helper — run after creating a Google Cloud Desktop OAuth client.
 *
 *   GOOGLE_CALENDAR_CLIENT_ID=... GOOGLE_CALENDAR_CLIENT_SECRET=... \
 *     node scripts/google-calendar-token.mjs
 *
 * Sign in with the Google account connected to TidyCal (the calendar that
 * receives bookings). Copy the printed refresh token into .env and Vercel.
 */

import http from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { URL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

// Load .env so `bun run google-calendar:token` works without exporting vars manually.
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
} catch {
  // .env optional if vars are exported in the shell
}

const clientId = process.env.GOOGLE_CALENDAR_CLIENT_ID?.trim();
const clientSecret = process.env.GOOGLE_CALENDAR_CLIENT_SECRET?.trim();
const port = Number(process.env.GOOGLE_OAUTH_PORT || 3333);
const scope = "https://www.googleapis.com/auth/calendar.events";

if (!clientId || !clientSecret) {
  console.error("Set GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET first.");
  process.exit(1);
}

const redirectUri = `http://127.0.0.1:${port}/oauth/callback`;

const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", clientId);
authUrl.searchParams.set("redirect_uri", redirectUri);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", scope);
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
  if (url.pathname !== "/oauth/callback") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error || !code) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization failed: ${error ?? "missing code"}`);
    server.close();
    process.exit(1);
    return;
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const body = await tokenRes.text();
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end("<h1>Success</h1><p>You can close this tab and return to the terminal.</p>");

  server.close();

  if (!tokenRes.ok) {
    console.error("Token exchange failed:", body);
    process.exit(1);
  }

  const json = JSON.parse(body);
  if (!json.refresh_token) {
    console.error("No refresh_token in response. Revoke app access at");
    console.error("https://myaccount.google.com/permissions and run again with prompt=consent.");
    console.error(body);
    process.exit(1);
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
  try {
    let env = readFileSync(envPath, "utf8");
    if (/^GOOGLE_CALENDAR_REFRESH_TOKEN=.*/m.test(env)) {
      env = env.replace(/^GOOGLE_CALENDAR_REFRESH_TOKEN=.*/m, `GOOGLE_CALENDAR_REFRESH_TOKEN=${json.refresh_token}`);
    } else {
      env += `\nGOOGLE_CALENDAR_REFRESH_TOKEN=${json.refresh_token}\n`;
    }
    writeFileSync(envPath, env);
    console.log(`\nSaved GOOGLE_CALENDAR_REFRESH_TOKEN to ${envPath}`);
  } catch (err) {
    console.error("Could not write .env:", err);
  }

  console.log("\nValues for Vercel production:\n");
  console.log(`GOOGLE_CALENDAR_CLIENT_ID=${clientId}`);
  console.log(`GOOGLE_CALENDAR_CLIENT_SECRET=${clientSecret}`);
  console.log(`GOOGLE_CALENDAR_REFRESH_TOKEN=${json.refresh_token}`);
  console.log(`GOOGLE_CALENDAR_ID=${calendarId}\n`);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Open this URL in your browser (use the TidyCal-linked Google account):\n\n${authUrl}\n`);
});
