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
        // Split third-party code into ONE leaf `vendor` chunk, separate from app
        // code, so editing the app doesn't bust the (rarely-changing) vendor
        // cache. Everything React-related stays together here on purpose:
        // splitting React from a CommonJS consumer like react-i18next breaks the
        // cross-chunk default-interop and throws "Cannot read properties of
        // undefined (reading 'createContext')" at load. One vendor chunk keeps
        // that interop intra-chunk and is a pure leaf (no circular ref to app).
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
}));
