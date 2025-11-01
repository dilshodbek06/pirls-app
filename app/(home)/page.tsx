import Footer from "@/components/Footer";
import Cta from "../_components/cta";
import Hero from "../_components/hero";
import WhyUs from "../_components/why-us";

export default function Home() {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {/* Hero Section */}
          <Hero />

          {/* Why Choose PIRLS EDU Section */}
          <WhyUs />

          {/* CTA Section */}
          <Cta />
        </main>

        <Footer />
      </div>
    </div>
  );
}
