/**
 * Compile lib/*.ts → lib/*.js for Vercel serverless functions.
 *
 * api/book.ts imports ../lib/* but Vercel only compiles files under api/ and
 * does not bundle those imports — the deployed function 500s with
 * ERR_MODULE_NOT_FOUND. This step emits ESM .js siblings that vercel.json
 * includeFiles ships alongside the function.
 */
import * as esbuild from "esbuild";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const entryPoints = ["lib/booking-email.ts", "lib/google-calendar.ts", "lib/zoom.ts"].map((f) =>
  path.join(root, f)
);

await esbuild.build({
  entryPoints,
  outdir: root,
  outbase: root,
  bundle: false,
  format: "esm",
  platform: "node",
  target: "node18",
  sourcemap: false,
});

console.log("Compiled lib/*.ts → lib/*.js for Vercel");
