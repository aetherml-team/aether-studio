import { createRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import App from "./App.tsx";
import "./index.css";
import "./i18n.ts";

createRoot(document.getElementById("root")!).render(<App />);

// Hand the boot loader (index.html) off to the real app. We wait until React
// has actually painted AND the fonts are ready (capped at 1.2s so a slow font
// can't hang the reveal) so the overlay fades straight into fully-styled
// content — no flash of the static title, no font swap mid-view.
(() => {
  const root = document.documentElement;
  const loader = document.getElementById("app-loader");
  if (!loader) return;

  let done = false;
  const reveal = () => {
    if (done) return;
    done = true;
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
  };

  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  const cap = new Promise<void>((res) => window.setTimeout(res, 1200));
  Promise.race([fontsReady, cap]).then(reveal, reveal);
})();
