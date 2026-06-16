import { chromium, devices } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['Pixel 5'], viewport:{width:390,height:844}, ignoreHTTPSErrors:true, locale:'es-MX', extraHTTPHeaders:{'Accept-Language':'es-MX,es;q=0.9'} });
const p = await ctx.newPage();
await p.goto('https://www.aetherml.com', { waitUntil:'networkidle' });
await p.waitForTimeout(3500);
await p.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
await p.evaluate(()=>window.scrollTo(0,0));
await p.waitForTimeout(500);
await p.screenshot({ path:'scripts/hero-clean.png' });
// second viewport down
await p.evaluate(()=>window.scrollTo(0,844));
await p.waitForTimeout(500);
await p.screenshot({ path:'scripts/hero-2.png' });
await b.close();
console.log('done');
