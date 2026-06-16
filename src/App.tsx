import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";

// The home route is the LCP path, so it stays in the main bundle. The legal
// pages and 404 are split out — almost no visitor hits them, so there is no
// reason to ship their markup (and their content) to everyone on first load.
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  // LazyMotion + the `m` component ship only the `domAnimation` feature set
  // (animations, variants, exit, hover/tap/focus/in-view gestures) instead of
  // framer's full bundle. `strict` makes a stray `motion` import throw in dev,
  // so the heavy feature set can never sneak back in. Drag (WorkShowcase) and
  // shared-layout (ContactSection) were re-implemented in CSS to stay inside
  // this lighter set.
  <LazyMotion features={domAnimation} strict>
    <MotionConfig reducedMotion="user">
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </MotionConfig>
  </LazyMotion>
);

export default App;
