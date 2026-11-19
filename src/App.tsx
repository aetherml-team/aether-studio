import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { pixelPageView } from "@/lib/pixel";
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
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Start = lazy(() => import("./pages/Start.tsx"));
const Thanks = lazy(() => import("./pages/Thanks.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

/** A pixel page view on every in-app navigation; initPixel counts the first load. */
function PixelPageViews() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pixelPageView();
  }, [pathname]);
  return null;
}

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
                <PixelPageViews />
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/start" element={<Start />} />
                    <Route path="/thanks" element={<Thanks />} />
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
