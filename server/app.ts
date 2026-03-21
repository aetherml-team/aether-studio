import express from "express";
import config from "./config";

import healthRouter from "./routes/health";
import chatRouter from "./routes/chat";
import crmRouter from "./routes/crm";
import { spaMiddleware } from "./middleware/static";

const app = express();

app.set("trust proxy", config.trustProxy);
app.use(express.json({ limit: "1mb" }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/health", healthRouter);
app.use("/api/chat", chatRouter);
app.use("/api/crm", crmRouter);

// Catch all remaining /api/* requests before falling through to static serving.
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "not_found" });
});

// ── SPA serving (host-aware) ──────────────────────────────────────────────────
app.use(spaMiddleware);

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[error]", err);
  res.status(500).type("text").send("Internal server error");
});

export default app;
