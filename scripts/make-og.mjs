import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const dataUrl = (path, mime) => `data:${mime};base64,${readFileSync(path).toString("base64")}`;

const bricolage = dataUrl(
  "node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  "font/woff2",
);
const hanken = dataUrl(
  "node_modules/@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2",
  "font/woff2",
);
const logo = dataUrl("public/logo.png", "image/png");
const nexus = dataUrl("public/work/tavros-2.png", "image/png");

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>
@font-face{font-family:Bricolage;src:url('${bricolage}') format('woff2');font-weight:200 800}
@font-face{font-family:Hanken;src:url('${hanken}') format('woff2');font-weight:100 900}
*{box-sizing:border-box}html,body{width:1200px;height:630px;margin:0}
.card{position:relative;width:1200px;height:630px;overflow:hidden;background:#fafaf9;color:#141c28;font-family:Hanken,sans-serif}
.grid{position:absolute;inset:0;background-image:radial-gradient(rgba(73,73,162,.20) 1px,transparent 1px);background-size:18px 18px;mask-image:linear-gradient(to right,#000 0%,rgba(0,0,0,.75) 55%,transparent 100%)}
.orbit{position:absolute;width:1040px;height:430px;right:-365px;top:88px;border:1.5px solid rgba(76,44,208,.52);border-radius:50%;transform:rotate(-8deg)}
.node{position:absolute;width:11px;height:11px;border-radius:50%;background:#4c2cd0;right:137px;top:118px}
.logo{position:absolute;left:68px;top:36px;width:174px;height:auto}
.copy{position:absolute;left:68px;top:181px;width:560px}
.title{font-family:Bricolage,sans-serif;font-size:76px;font-weight:650;line-height:.95;letter-spacing:-.055em}
.accent{color:#4c2cd0}
.body{margin-top:28px;width:480px;font-size:23px;line-height:1.42;color:#5d626b}
.screen{position:absolute;right:-34px;top:180px;width:620px;height:322px;padding:8px;border:1px solid rgba(73,73,162,.35);background:#09090c;box-shadow:0 30px 80px -42px rgba(20,28,40,.72)}
.screen img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
.label{position:absolute;right:382px;top:523px;font:500 12px/1.2 Hanken,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#4949a2}
.footer{position:absolute;left:68px;right:68px;bottom:34px;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(20,28,40,.14);padding-top:18px;font-size:16px;color:#5d626b}
.site{font-weight:600;color:#141c28}
</style></head><body><div class="card">
  <div class="grid"></div><div class="orbit"></div><div class="node"></div>
  <img class="logo" src="${logo}" alt="">
  <div class="copy">
    <div class="title">Un sistema<br>que trabaja<br><span class="accent">como tú.</span></div>
    <div class="body">Nexus es la app de tu negocio, hecha a tu manera. Nosotros la mantenemos.</div>
  </div>
  <div class="screen"><img src="${nexus}" alt=""></div>
  <div class="label">Nexus · app para dueño y equipo</div>
  <div class="footer"><span class="site">aetherml.com</span><span>Guadalajara, Jalisco</span></div>
</div></body></html>`;

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "public/og-image.png", clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log("wrote public/og-image.png");
