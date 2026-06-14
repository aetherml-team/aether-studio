import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      {/* Localizes the homepage title + meta for the visitor's detected language.
          The static English social/meta set stays in index.html so non-JS
          crawlers and link unfurlers always see a complete default. */}
      <Helmet>
        <title>{t("seo.title")}</title>
        <meta name="description" content={t("seo.description")} />
        <meta property="og:title" content={t("seo.title")} />
        <meta property="og:description" content={t("seo.description")} />
        <meta name="twitter:title" content={t("seo.title")} />
        <meta name="twitter:description" content={t("seo.description")} />
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
