import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IntegrationsMarquee from "@/components/IntegrationsMarquee";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import ServicesSection from "@/components/ServicesSection";
import ClientShowcase from "@/components/ClientShowcase";
import ProcessSection from "@/components/ProcessSection";
import CheckFitSection from "@/components/CheckFitSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main">
        <HeroSection />
        <IntegrationsMarquee />
        <div className="gradient-strip opacity-80" aria-hidden />
        <ProblemSolutionSection />
        <ServicesSection />
        <ClientShowcase />
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
