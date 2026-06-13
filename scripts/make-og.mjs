import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Hanken+Grotesk:wght@300..600&family=JetBrains+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
.card{width:1200px;height:630px;background:#09090c;position:relative;overflow:hidden;
  padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;
  font-family:'Hanken Grotesk',sans-serif;color:#e3e1de}
.glow{position:absolute;width:900px;height:900px;left:-200px;top:-380px;border-radius:50%;
  background:radial-gradient(circle,rgba(166,166,207,0.16),rgba(166,166,207,0) 60%)}
.glow2{position:absolute;width:700px;height:700px;right:-220px;bottom:-340px;border-radius:50%;
  background:radial-gradient(circle,rgba(166,166,207,0.10),rgba(166,166,207,0) 60%)}
.top{display:flex;align-items:center;gap:18px;position:relative}
.wm{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:34px;letter-spacing:0.01em}
.rule{width:46px;height:1px;background:#a6a6cf;opacity:0.6}
.tag{font-family:'JetBrains Mono',monospace;font-size:15px;letter-spacing:0.18em;text-transform:uppercase;color:#75757f}
.mid{position:relative}
.h1{font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:82px;line-height:1.04;letter-spacing:-0.02em}
.h1 .accent{color:#a6a6cf}
.sub{margin-top:26px;font-size:27px;font-weight:300;line-height:1.45;color:#9f9fa8;max-width:880px}
.foot{display:flex;justify-content:space-between;align-items:flex-end;position:relative}
.foot .site{font-family:'JetBrains Mono',monospace;font-size:17px;letter-spacing:0.06em;color:#9f9fa8}
.foot .loc{font-family:'JetBrains Mono',monospace;font-size:15px;letter-spacing:0.12em;text-transform:uppercase;color:#5f5f69}
.hair{position:absolute;left:0;right:0;top:-26px;height:1px;background:linear-gradient(90deg,#a6a6cf,rgba(166,166,207,0) 55%)}
</style></head>
<body><div class="card">
  <div class="glow"></div><div class="glow2"></div>
  <div class="top">
    <span class="wm">&AElig;ther</span><span class="rule"></span><span class="tag">Automation Studio</span>
  </div>
  <div class="mid">
    <div class="h1">Manual work,<br><span class="accent">engineered away.</span></div>
    <div class="sub">Custom automations, system integrations, and payment reconciliation for teams that have outgrown the spreadsheet.</div>
  </div>
  <div class="foot">
    <div class="hair"></div>
    <span class="site">aetherml.com</span>
    <span class="loc">Guadalajara &middot; LatAm &amp; beyond</span>
  </div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: "public/og-image.png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log("wrote public/og-image.png");
