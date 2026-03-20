import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSolutionSection from "@/components/ProblemSolutionSection";
import ServicesSection from "@/components/ServicesSection";
import ClientShowcase from "@/components/ClientShowcase";
import ProcessSection from "@/components/ProcessSection";
import CheckFitSection from "@/components/CheckFitSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div className="gradient-strip opacity-80" aria-hidden />
      <ProblemSolutionSection />
      <ServicesSection />
      <ClientShowcase />
      <ProcessSection />
      <CheckFitSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
