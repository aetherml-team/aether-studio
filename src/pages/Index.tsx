import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/HeroSection";
import IntegrationsMarquee from "@/components/IntegrationsMarquee";
import WorkDisappearsSection from "@/components/WorkDisappearsSection";
import ServicesSection from "@/components/ServicesSection";
import WorkShowcase from "@/components/WorkShowcase";
import ProcessSection from "@/components/ProcessSection";
import CheckFitSection from "@/components/CheckFitSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Restores the homepage tab title after SPA navigation back from a
          sub-route. The full social/meta set stays static in index.html so
          non-JS crawlers and link unfurlers always see it. */}
      <Helmet>
        <title>Æther · Automation Studio</title>
        <link rel="canonical" href="https://www.aetherml.com/" />
      </Helmet>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <HeroSection />
        <IntegrationsMarquee />
        <WorkDisappearsSection />
        <ServicesSection />
        <WorkShowcase />
        <ProcessSection />
        <CheckFitSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
