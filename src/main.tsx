import { createRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import App from "./App.tsx";
import "./index.css";
import "./i18n.ts";

createRoot(document.getElementById("root")!).render(<App />);

// Hand the boot loader (index.html) off to the real app the moment React has
// painted — we no longer wait on document.fonts.ready. Holding the overlay for
// fonts added up to ~1.2s of dead time to LCP on throttled mobile; instead we
// reveal as soon as React's first commit paints and let the (font-display:
// swap) webfonts swap in over the system-font fallback the loader and static
// markup already use. The visitor sees real content far sooner.
(() => {
  const root = document.documentElement;
  const loader = document.getElementById("app-loader");
  if (!loader) return;

  // Two RAFs: ensure React's first commit has painted before we fade.
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      root.classList.add("app-loaded");
      // Signal the page is actually on screen now. The hero headline waits
      // for this before it starts writing/correcting, so its self-correction
      // never plays hidden behind the loader — the visitor always catches it
      // from the first character.
      (window as unknown as { __appRevealed?: boolean }).__appRevealed = true;
      window.dispatchEvent(new Event("app:revealed"));
      // Remove after the fade (or immediately if motion is reduced).
      const remove = () => loader.remove();
      loader.addEventListener("transitionend", remove, { once: true });
      window.setTimeout(remove, 700);
    }),
  );
})();
