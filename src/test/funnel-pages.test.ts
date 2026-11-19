import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveRequest } from "../../middleware";
import { UNLISTED_PAGES } from "@/content/agent-md";

const sitemap = readFileSync(resolve(__dirname, "../../public/sitemap.xml"), "utf8");

describe("the ad landing and thank-you pages", () => {
  it("answer 200 so Meta accepts the ad link", () => {
    expect(resolveRequest("/start", "text/html")).toEqual({ kind: "pass" });
    expect(resolveRequest("/thanks/", null)).toEqual({ kind: "pass" });
    expect(resolveRequest("/thanks", "text/markdown")).toMatchObject({ kind: "markdown", status: 200 });
  });

  it("stay out of the sitemap", () => {
    for (const path of Object.keys(UNLISTED_PAGES)) {
      expect(sitemap).not.toContain(`https://www.aetherml.com${path}<`);
    }
  });
});
