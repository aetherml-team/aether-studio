import express from "express";
import { resolveClient, distForClient } from "../lib/hosts";
import { hasIndexHtml, createSpaHandler } from "../lib/spa";

const NOT_BUILT_HTML = (client: string, dist: string) =>
  `<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Not built</title></head><body style="font-family:sans-serif;padding:2rem"><h1>${client} not deployed</h1><p>Build the <code>${client}</code> client so that <code>${dist}</code> exists.</p></body></html>`;

/**
 * Host-aware SPA middleware.
 *
 * Inspects the request Host header, resolves it to a client dist directory,
 * and serves that SPA (static assets + index.html fallback).
 *
 * Handles gracefully:
 *  - Missing builds (503 with a helpful message instead of a crash)
 *  - Any number of clients: add entries to lib/hosts.ts to extend
 */
export const spaMiddleware: express.RequestHandler = (req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    next();
    return;
  }

  const client = resolveClient(req.get("host"));
  const dist = distForClient(client);

  if (!hasIndexHtml(dist)) {
    res.status(503).type("html").send(NOT_BUILT_HTML(client, dist));
    return;
  }

  createSpaHandler(dist)(req, res, next);
};
