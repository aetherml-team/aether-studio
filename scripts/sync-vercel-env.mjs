/**
 * Push local .env values to the linked Vercel project.
 * Uses standard Production / Preview / Development targets only — not custom
 * per-domain environments.
 *
 *   bun run vercel:sync-env
 */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

const VERCEL_ORG_ID = "team_wOzwHptQfF6HGS0uhlmts7yq";
const VERCEL_PROJECT_ID = "prj_oOSmBWMaokEOjDSGyBE6AadVIDwi";

// Standard Vercel deployment targets — not custom domain environments.
const TARGETS = ["production", "preview", "development"];

// Vercel CLI metadata — never push back to the project.
const SKIP_KEYS = new Set(["VERCEL_OIDC_TOKEN", "VERCEL_URL", "VERCEL_ENV"]);

function parseEnvFile(filePath) {
  const vars = [];
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
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
    vars.push({ key, value });
  }
  return vars;
}

function vercel(args, input) {
  return execFileSync("bunx", ["vercel", ...args], {
    cwd: path.resolve(__dirname, ".."),
    env: {
      ...process.env,
      VERCEL_ORG_ID,
      VERCEL_PROJECT_ID,
      CI: "1",
    },
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
}

function vercelTry(args, input) {
  try {
    vercel(args, input);
    return true;
  } catch {
    return false;
  }
}

function upsertRemote(name, value, target) {
  const sensitive =
    target === "development" ? ["--no-sensitive"] : ["--sensitive"];

  if (
    vercelTry(
      ["env", "update", name, target, "--value", value, "--yes", ...sensitive],
      undefined,
    )
  ) {
    console.log(`updated ${name} (${target})`);
    return;
  }

  vercel(
    [
      "env",
      "add",
      name,
      target,
      "--value",
      value,
      "--yes",
      "--force",
      ...sensitive,
    ],
    undefined,
  );
  console.log(`added ${name} (${target})`);
}

const localVars = parseEnvFile(envPath).filter(({ key }) => !SKIP_KEYS.has(key));
console.log(`Local .env: ${localVars.length} variables\n`);

console.log("Uploading to Production, Preview, and Development...");
for (const { key, value } of localVars) {
  for (const target of TARGETS) {
    upsertRemote(key, value, target);
  }
}

console.log("\nDone. Redeploy production for changes to take effect:");
console.log("  bunx vercel --prod");
