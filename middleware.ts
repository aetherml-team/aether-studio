import { next } from "@vercel/functions";
import { MARKDOWN_PAGES, NOT_FOUND_MARKDOWN } from "./src/content/agent-md";

/**
 * Vercel Routing Middleware. It runs before the CDN cache and before the static
 * file lookup, which is the only place we can answer two things this SPA cannot:
 *
 * 1. `Accept: text/markdown` — serve the page as Markdown (acceptmarkdown.com)
 *    instead of an app shell an agent cannot read. Browsers still get the HTML.
 * 2. Unknown paths — the SPA rewrite in vercel.json answers every path with
 *    index.html and a 200, so an agent probing for pages concludes they all
 *    exist. We return a real 404 here, with the shell still in the body so a
 *    person lands on the app's own 404 page.
 *
 * The matcher skips /api, build assets and anything with a file extension, so
 * static files (including the /index.html we fetch below) never re-enter here.
 */

export type Resolution =
  | { kind: "pass" }
  | { kind: "markdown"; status: 200 | 404; body: string }
  | { kind: "shell404" };

/** Pure routing decision, so it can be tested without a Vercel runtime. */
export function resolveRequest(pathname: string, accept: string | null): Resolution {
  const path = pathname.replace(/\/+$/, "") || "/";
  const page = MARKDOWN_PAGES[path];
  if ((accept ?? "").includes("text/markdown")) {
    return page
      ? { kind: "markdown", status: 200, body: page }
      : { kind: "markdown", status: 404, body: NOT_FOUND_MARKDOWN };
  }
  return page ? { kind: "pass" } : { kind: "shell404" };
}

const markdownHeaders = {
  "content-type": "text/markdown; charset=utf-8",
  vary: "Accept",
  "cache-control": "public, max-age=0, s-maxage=600",
};

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const resolution = resolveRequest(url.pathname, request.headers.get("accept"));

  if (resolution.kind === "pass") return next();

  if (resolution.kind === "markdown") {
    return new Response(resolution.body, {
      status: resolution.status,
      headers: markdownHeaders,
    });
  }

  try {
    const shell = await fetch(new URL("/index.html", url));
    return new Response(await shell.text(), {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8", vary: "Accept" },
    });
  } catch {
    return new Response(NOT_FOUND_MARKDOWN, { status: 404, headers: markdownHeaders });
  }
}

export const config = {
  matcher: ["/((?!api/|assets/|_vercel/|.*\\.).*)"],
};
