import express from "express";
import fs from "fs";
import path from "path";

export function hasIndexHtml(dir: string): boolean {
  return fs.existsSync(path.join(dir, "index.html"));
}

/**
 * Returns an Express request handler that:
 *  1. Serves static assets from `dist` (JS, CSS, images, etc.)
 *  2. Falls back to `dist/index.html` for every unknown path so the SPA
 *     router can handle it client-side.
 */
export function createSpaHandler(dist: string): express.RequestHandler {
  const staticMiddleware = express.static(dist, { index: false });

  return (req, res, next) => {
    staticMiddleware(req, res, () => {
      res.sendFile(path.join(dist, "index.html"), (err) => {
        if (err) next(err);
      });
    });
  };
}
