import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import middleware, { resolveRequest } from "../../middleware";
import { MARKDOWN_PAGES } from "@/content/agent-md";

const root = resolve(__dirname, "../..");
const read = (p: string) => readFileSync(resolve(root, p), "utf8");

describe("middleware routing", () => {
  it("passes known routes through to the app", () => {
    for (const path of Object.keys(MARKDOWN_PAGES)) {
      expect(resolveRequest(path, "text/html")).toEqual({ kind: "pass" });
    }
  });

  it("answers unknown paths with a real 404, not the soft-200 shell", () => {
    expect(resolveRequest("/does-not-exist", "text/html")).toEqual({ kind: "shell404" });
  });

  it("serves Markdown when the client asks for it", () => {
    const res = resolveRequest("/", "text/markdown, text/html;q=0.9");
    expect(res).toMatchObject({ kind: "markdown", status: 200 });
    expect(res.kind === "markdown" && res.body).toContain("# Æther");
  });

  it("serves a Markdown body with the 404 for unknown paths", () => {
    const res = resolveRequest("/nope", "text/markdown");
    expect(res).toMatchObject({ kind: "markdown", status: 404 });
    expect(res.kind === "markdown" && res.body.length).toBeGreaterThan(20);
    expect(res.kind === "markdown" && res.body).toContain("llms.txt");
  });

  it("ignores a trailing slash and a missing Accept header", () => {
    expect(resolveRequest("/about/", null)).toEqual({ kind: "pass" });
    expect(resolveRequest("/", null)).toEqual({ kind: "pass" });
  });

  it("gives every Markdown page real content", () => {
    for (const [path, body] of Object.entries(MARKDOWN_PAGES)) {
      expect(body.length, path).toBeGreaterThan(500);
      expect(body.startsWith("# "), path).toBe(true);
    }
  });
});

describe("index.html, as an agent without JavaScript sees it", () => {
  const html = read("index.html");
  const rootMarkup = html.split('<div id="root">')[1].split("<!-- Boot loader")[0];
  const text = rootMarkup.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  it("serves more than 500 characters of readable content", () => {
    expect(text.length).toBeGreaterThan(500);
  });

  it("has one h1 and sequential headings below it", () => {
    expect(rootMarkup.match(/<h1/g)).toHaveLength(1);
    expect(rootMarkup.match(/<h2/g)!.length).toBeGreaterThan(0);
    expect(rootMarkup).not.toMatch(/<h[3-6]/);
  });

  it("carries all four entity-resolution signals", () => {
    expect(html).toContain('<link id="static-canonical" rel="canonical"');
    expect(html).toMatch(/<html lang="en"/);
    expect(html).toContain('property="og:image"');
    expect(html).toContain('property="og:type"');
  });

  it("gives the Organization schema an address and a contact point", () => {
    const schema = JSON.parse(
      html.split('<script type="application/ld+json">')[1].split("</script>")[0],
    );
    const org = schema["@graph"].find((n: { "@type": string }) => n["@type"] === "Organization");
    expect(org.address["@type"]).toBe("PostalAddress");
    expect(org.address.addressCountry).toBe("MX");
    expect(org.contactPoint[0].contactType).toBeTruthy();
    expect(org.contactPoint[0].email).toBeTruthy();
  });
});

describe("machine-readable files", () => {
  it("tells agents when to use Æther in llms.txt", () => {
    const llms = read("public/llms.txt");
    expect(llms).toMatch(/^# Æther/);
    expect(llms).toContain("## When to use Æther");
    expect(llms).toContain("help@aetherml.com");
  });

  it("lists every public page in the sitemap", () => {
    const sitemap = read("public/sitemap.xml");
    for (const path of Object.keys(MARKDOWN_PAGES)) {
      expect(sitemap).toContain(`<loc>https://www.aetherml.com${path === "/" ? "/" : path}</loc>`);
    }
  });
});

describe("middleware responses", () => {
  it("returns Markdown with Vary: Accept", async () => {
    const res = await middleware(
      new Request("https://www.aetherml.com/", { headers: { accept: "text/markdown" } }),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(res.headers.get("vary")).toBe("Accept");
    expect(await res.text()).toContain("Nexus");
  });

  it("returns 404 with the app shell for an unknown path in a browser", async () => {
    const shell = "<html><body>shell</body></html>";
    const original = globalThis.fetch;
    globalThis.fetch = (async () => new Response(shell)) as typeof fetch;
    try {
      const res = await middleware(
        new Request("https://www.aetherml.com/nope", { headers: { accept: "text/html" } }),
      );
      expect(res.status).toBe(404);
      expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
      expect(await res.text()).toBe(shell);
    } finally {
      globalThis.fetch = original;
    }
  });
});
