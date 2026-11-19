import { describe, expect, it } from "vitest";
import { KEEP_DAYS, choose, fromUrl, keptVisit } from "@/lib/attribution";

const DAY = 86_400_000;

describe("the ad that brought the visitor", () => {
  it("reads Meta's parameters from the landing URL", () => {
    const href = "https://www.aetherml.com/contact?utm_source=meta&utm_campaign=111&utm_content=222";
    expect(fromUrl(href)).toEqual({ source: "meta", campaign: "111", ad: "222", link: href });
  });

  it("keeps Meta's click id as fbc, and nothing from a plain visit", () => {
    expect(fromUrl("https://www.aetherml.com/?fbclid=IwAR1x_y", 1700000000000)).toEqual({
      link: "https://www.aetherml.com/?fbclid=IwAR1x_y",
      fbc: "fb.1.1700000000000.IwAR1x_y",
    });
    expect(fromUrl("https://www.aetherml.com/")).toBeNull();
    expect(fromUrl("not a url")).toBeNull();
  });

  it("keeps the first visit of a campaign and lets a new campaign replace it", () => {
    const first = { campaign: "111", link: "a" };
    expect(choose({ campaign: "111", link: "b" }, first)).toBe(first);
    expect(choose({ campaign: "333", link: "c" }, first)).toEqual({ campaign: "333", link: "c" });
    expect(choose(null, first)).toBe(first);
  });

  it("forgets a visit after the window and survives garbage in storage", () => {
    const now = Date.now();
    const stored = (at: number) => JSON.stringify({ campaign: "111", at });
    expect(keptVisit(stored(now - (KEEP_DAYS - 1) * DAY), now)).toEqual({ campaign: "111" });
    expect(keptVisit(stored(now - (KEEP_DAYS + 1) * DAY), now)).toBeNull();
    expect(keptVisit("{not json", now)).toBeNull();
    expect(keptVisit(null, now)).toBeNull();
  });
});
