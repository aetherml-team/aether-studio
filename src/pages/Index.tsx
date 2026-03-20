import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhoWeHelpSection from "@/components/WhoWeHelpSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import ServicesSection from "@/components/ServicesSection";
import ProcessSection from "@/components/ProcessSection";
import ClientShowcase from "@/components/ClientShowcase";
import MetricsSection from "@/components/MetricsSection";
import WhyAetherSection from "@/components/WhyAetherSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div className="gradient-strip opacity-80" aria-hidden />
      <WhoWeHelpSection />
      <ProblemSolutionSection />
      <ServicesSection />
      <ProcessSection />
      <ClientShowcase />
      <MetricsSection />
      <WhyAetherSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
