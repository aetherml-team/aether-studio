import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  NEED_LABEL,
  callSlot,
  companyFor,
  describeLead,
  needLabel,
  parseAttribution,
  parsePhone,
  shouldFile,
  splitName,
  webformBody,
} from "../../lib/crm-lead";
import { capiBody, parseEventId, parseFbp, requestFacts } from "../../lib/meta-capi";
import { NEEDS } from "@/lib/needs";

const TOKENS = { xnQsjsdp: "t1", xmIwtLD: "t2" };

describe("the Description block Nexus reads", () => {
  it("writes one line per value, the message last", () => {
    expect(
      describeLead({
        attribution: { campaign: "120245553912340123", ad: "120245553912340999", link: "https://www.aetherml.com/contact?utm_campaign=1" },
        message: "Queremos automatizar\ncobranza",
        call: { date: "2026-11-20", time: "17:00" },
      }),
    ).toBe(
      [
        "Ad: 120245553912340123",
        "Ad id: 120245553912340999",
        "Source link: https://www.aetherml.com/contact?utm_campaign=1",
        "Call date: 2026-11-20",
        "Call time: 17:00",
        "Notes: Queremos automatizar\ncobranza",
      ].join("\n"),
    );
  });

  it("writes nothing for a visit no ad brought", () => {
    expect(describeLead({ attribution: {}, message: "  " })).toBe("");
  });
});

describe("what the browser sends", () => {
  it("keeps only Meta-shaped ids and an http link on one line", () => {
    expect(
      parseAttribution({
        source: "meta",
        campaign: "123",
        ad: "abc<script>",
        link: "https://x.com/?a=1\nAd: 999",
      }),
    ).toEqual({ source: "meta", campaign: "123", link: "https://x.com/?a=1 Ad: 999" });
  });

  it("ignores a body with no attribution", () => {
    expect(parseAttribution(undefined)).toEqual({});
    expect(parseAttribution({ campaign: "{{campaign.id}}" })).toEqual({});
  });
});

describe("the webform POST", () => {
  it("splits the name and files a form lead in the first stage", () => {
    const body = webformBody(
      { name: "Ana María López", email: "ana@x.com", attribution: { source: "meta", campaign: "1" }, kind: "form", test: false },
      TOKENS,
    );
    expect(body.get("First Name")).toBe("Ana");
    expect(body.get("Last Name")).toBe("María López");
    expect(body.get("Lead Status")).toBe("Conversation Started");
    expect(body.get("Lead Source")).toBe("Facebook");
    expect(body.get("Description")).toBe("Ad: 1");
  });

  it("puts a one-word name in Last Name and files a test as Junk Lead", () => {
    const body = webformBody({ name: "Ana", email: "ana@x.com", attribution: {}, kind: "booked", test: true }, TOKENS);
    expect(body.get("First Name")).toBeNull();
    expect(body.get("Last Name")).toBe("Ana");
    expect(body.get("Lead Status")).toBe("Junk Lead");
    expect(body.get("Lead Source")).toBe("Website");
    expect(body.get("Description")).toBeNull();
  });

  it("files a booked call as Call Booked", () => {
    const body = webformBody({ name: "Ana Ruiz", email: "a@x.com", attribution: {}, kind: "booked", test: false }, TOKENS);
    expect(body.get("Lead Status")).toBe("Call Booked");
  });
});

describe("where a lead is filed", () => {
  it("files from production, and tests from anywhere, never a preview", () => {
    expect(shouldFile(false, "production")).toBe(true);
    expect(shouldFile(false, "preview")).toBe(false);
    expect(shouldFile(false, undefined)).toBe(false);
    expect(shouldFile(true, "preview")).toBe(true);
  });

  it("names the call in Mexico City time", () => {
    expect(callSlot(Date.parse("2026-11-20T23:00:00Z"))).toEqual({ date: "2026-11-20", time: "17:00" });
  });
});

describe("splitName", () => {
  it("collapses spaces and newlines", () => {
    expect(splitName("  Luis \n Hernández ")).toEqual({ first: "Luis", last: "Hernández" });
  });
});

describe("Company, which Zoho requires", () => {
  it("is the business domain, or the name for a personal address", () => {
    expect(companyFor("Ana Ruiz", "ana@acme.mx")).toBe("acme.mx");
    expect(companyFor("Ana Ruiz", "ana@Gmail.com")).toBe("Ana Ruiz");
    expect(companyFor("", "ana@hotmail.com")).toBe("ana@hotmail.com");
  });
});

describe("phone and need", () => {
  it("normalizes a Mexican number and keeps an international one", () => {
    expect(parsePhone("33 1234 5678")).toBe("+523312345678");
    expect(parsePhone("+1 (415) 555-0100")).toBe("+14155550100");
    expect(parsePhone("1234")).toBe("");
    expect(parsePhone(undefined)).toBe("");
  });

  it("files only a need the site offers, in English", () => {
    expect(needLabel("payments")).toBe("Payments and collections");
    expect(needLabel("toString")).toBe("");
    expect(needLabel("<b>")).toBe("");
  });

  it("offers the same needs the server knows", () => {
    expect([...NEEDS].sort()).toEqual(Object.keys(NEED_LABEL).sort());
  });

  it("puts the need and the WhatsApp first in the block, and the phone in Phone", () => {
    const body = webformBody(
      { name: "Ana Ruiz", email: "a@x.com", phone: "+523312345678", need: "Sales and clients", attribution: { campaign: "9" }, kind: "form", test: false },
      TOKENS,
    );
    expect(body.get("Phone")).toBe("+523312345678");
    expect(body.get("Description")).toBe("Service: Sales and clients\nWhatsApp: +523312345678\nAd: 9");
  });
});

describe("the Conversions API event", () => {
  it("hashes every personal value and carries the browser's event id", () => {
    const body = capiBody(
      { name: "Lead", eventId: "abc-12345", email: " Ana@X.com ", phone: "+52 33 1234 5678", firstName: "Ana", fbc: "fb.1.1700000000000.x", url: "https://www.aetherml.com/start", test: true },
      "TEST123",
      1_700_000_000_000,
    );
    const event = (body.data as Record<string, unknown>[])[0];
    const user = event.user_data as Record<string, string[] | string>;
    expect(event.event_id).toBe("abc-12345");
    expect(event.event_time).toBe(1_700_000_000);
    expect(user.em[0]).toMatch(/^[0-9a-f]{64}$/);
    expect(user.em[0]).not.toContain("ana");
    expect(user.ph[0]).toBe(createHash("sha256").update("523312345678").digest("hex"));
    expect(user.fbc).toBe("fb.1.1700000000000.x");
    expect(body.test_event_code).toBe("TEST123");
  });

  it("sends no test code on a real lead", () => {
    expect(capiBody({ name: "Lead", eventId: "abcdefgh", email: "a@x.com", url: "", test: false }, "TEST123")).not.toHaveProperty("test_event_code");
  });

  it("drops a malformed event id or cookie", () => {
    expect(parseEventId("not valid!")).toBe("");
    expect(parseFbp("fb.1.1700000000000.123456789")).toBe("fb.1.1700000000000.123456789");
    expect(parseFbp("evil")).toBe("");
  });

  it("keeps only an aetherml.com page as the event's page", () => {
    expect(requestFacts({ referer: "https://evil.com/x", "x-forwarded-for": "1.2.3.4, 5.6.7.8" })).toEqual({
      ip: "1.2.3.4",
      userAgent: undefined,
      url: "https://www.aetherml.com/",
    });
  });
});
