import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import HeroSection from "../components/Hero/HeroSection";
import FeaturesSection from "../components/Features/FeaturesSection";
import BenefitsSection from "../components/BenefitsSection/BenefitsSection";
import HowItWorksSection from "../components/HowItWorks/HowItWorksSection";
import CTASection from "../components/CTA/CTASection";
import Footer from "../components/Footer/Footer";

export default function HomePage() {
  const location = useLocation();

  // Smooth scroll to hash section when navigating from another page
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <Navbar />

      <section id="home">
        <HeroSection />
      </section>

      <section id="features">
        <FeaturesSection />
      </section>

      <section id="developers">
        <BenefitsSection />
      </section>

      <section id="how-it-works">
        <HowItWorksSection />
      </section>

      <section id="recruiters">
        <CTASection />
      </section>

      <Footer />
    </div>
  );
}
