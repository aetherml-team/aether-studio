import LegalPage from "@/components/LegalPage";
import ContactSection from "@/components/ContactSection";
import { contactDoc } from "@/content/pages";

// The booking panel, message form and FAQ are the same ones the landing page
// uses — no second implementation to keep in sync.
const Contact = () => (
  <LegalPage doc={contactDoc} path="/contact">
    <ContactSection />
  </LegalPage>
);

export default Contact;
