import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split big, stable vendors into their own long-cached chunks so a
        // content change doesn't bust the whole bundle, and the browser can
        // fetch them in parallel with the app code on first load.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (
            id.includes("/react/") ||
            id.includes("/react-dom/") ||
            id.includes("/react-router") ||
            id.includes("/scheduler/")
          )
            return "react";
          if (id.includes("framer-motion")) return "framer";
          if (id.includes("@radix-ui")) return "radix";
          if (
            id.includes("i18next") ||
            id.includes("react-i18next")
          )
            return "i18n";
          if (id.includes("@tanstack")) return "query";
        },
      },
    },
  },
}));
