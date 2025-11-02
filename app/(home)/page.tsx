import Footer from "@/components/Footer";
import Cta from "../_components/cta";
import Hero from "../_components/hero";
import WhyUs from "../_components/why-us";
import Testimonials from "../_components/testimonials";
import HeroBottom from "../_components/hero-bottom";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <Hero />
          {/* About PIRLS Section */}
          <HeroBottom />

          {/* Why Choose PIRLS EDU Section */}
          <WhyUs />

          {/* CTA Section */}
          <Cta />
          {/* Testimonials Section */}
          <Testimonials />
        </main>

        <Footer />
      </div>
    </div>
  );
}
