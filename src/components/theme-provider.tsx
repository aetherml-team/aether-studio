import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useTheme } from "next-themes";
import { useEffect, type ReactNode } from "react";

const STORAGE_KEY = "aether-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={STORAGE_KEY}
      disableTransitionOnChange
    >
      {children}
      <ThemeColorMeta />
    </NextThemesProvider>
  );
}

/** Keeps browser chrome (status bar, PWA) aligned with resolved light/dark. */
function ThemeColorMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const el = document.getElementById("theme-color-meta");
    if (!el || !resolvedTheme) return;
    el.setAttribute(
      "content",
      resolvedTheme === "dark" ? "#08080A" : "#f6f5f3",
    );
  }, [resolvedTheme]);

  return null;
}
