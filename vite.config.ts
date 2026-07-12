import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "http";

/**
 * Dev-only bridge that runs the Vercel serverless functions in `api/*` inside
 * Vite's dev server. Without this, `/api/*` requests under `bun run dev` have no
 * handler (Vite only serves the client), so the booking flow and contact form
 * can't be exercised locally — that needs `vercel dev`, which is finicky with this
 * repo's SPA rewrite. This plugin executes the real local handler code instead, so
 * `bun run dev` is a complete full-stack dev environment.
 *
 * It adapts a Node request/response to the small slice of the Vercel handler
 * contract our endpoints use: req.query, req.body (raw string — the handlers parse
 * it themselves), and res.status().json()/.send(). Server-side env (TIDYCAL_TOKEN,
 * RESEND_API_KEY, …) is loaded from .env into process.env below, mirroring Vercel.
 *
 * NOTE: this applies to `vite` (dev) only. `vite preview` serves the static build
 * and still has no API — deploy, or use `vercel dev`, to test against that.
 */
function vercelApiDev(): Plugin {
  return {
    name: "vercel-api-dev",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next) => {
        const url = req.url;
        if (!url || !url.startsWith("/api/")) return next();

        const parsed = new URL(url, "http://localhost");
        const name = parsed.pathname.replace(/^\/api\//, "").replace(/\/+$/, "");
        // Resolve to a handler file; underscore-prefixed modules aren't routes.
        const file = path.resolve(__dirname, "api", `${name}.ts`);
        if (!name || name.startsWith("_") || !fs.existsSync(file)) return next();

        // Buffer the request body for non-GET so handlers can parse it. Our
        // handlers accept a raw string body (book.ts/lead.ts JSON.parse it).
        let body: string | undefined;
        if (req.method && req.method !== "GET" && req.method !== "HEAD") {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(chunk as Buffer);
          body = Buffer.concat(chunks).toString("utf8");
        }

        // Augment req/res to the shape the Vercel handlers expect.
        const vreq = req as IncomingMessage & { query: Record<string, string>; body?: string };
        vreq.query = Object.fromEntries(parsed.searchParams);
        vreq.body = body;

        const vres = res as ServerResponse & {
          status: (code: number) => typeof vres;
          json: (data: unknown) => typeof vres;
          send: (data: unknown) => typeof vres;
        };
        vres.status = (code: number) => {
          res.statusCode = code;
          return vres;
        };
        vres.json = (data: unknown) => {
          if (!res.headersSent) res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(data));
          return vres;
        };
        vres.send = (data: unknown) => {
          res.end(typeof data === "string" ? data : JSON.stringify(data));
          return vres;
        };

        try {
          // ssrLoadModule transpiles the TS handler and resolves its imports.
          const mod = await server.ssrLoadModule(file);
          const handler = mod.default as (q: typeof vreq, s: typeof vres) => unknown;
          if (typeof handler !== "function") return next();
          await handler(vreq, vres);
        } catch (err) {
          server.config.logger.error(`[api] /api/${name} threw: ${(err as Error).message}`);
          if (!res.writableEnded) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Dev API error" }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Load .env (all keys, no VITE_ prefix filter) into process.env so the dev API
  // plugin's handlers see TIDYCAL_TOKEN / RESEND_API_KEY etc., as they would on
  // Vercel. Only the server-side dev plugin reads these — they are NOT exposed to
  // the client bundle (that still only sees VITE_-prefixed import.meta.env vars).
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      vercelApiDev(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Split third-party code into ONE leaf `vendor` chunk, separate from app
          // code, so editing the app doesn't bust the (rarely-changing) vendor
          // cache. Everything React-related stays together here on purpose:
          // splitting React from a CommonJS consumer like react-i18next breaks the
          // cross-chunk default-interop and throws "Cannot read properties of
          // undefined (reading 'createContext')" at load. One vendor chunk keeps
          // that interop intra-chunk and is a pure leaf (no circular ref to app).
          manualChunks(id) {
            if (id.includes("node_modules")) return "vendor";
          },
        },
      },
    },
  };
});
