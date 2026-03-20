import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ClientsMarquee from "@/components/ClientsMarquee";
import SelectedWork from "@/components/SelectedWork";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ClientsMarquee />
      <SelectedWork />
      <ServicesSection />
      <AboutSection />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
