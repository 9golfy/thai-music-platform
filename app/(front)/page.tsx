import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesA from "@/components/features-a"
import FeaturesB from "@/components/features-b"
import AccordionSection from "@/components/accordion-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <FeaturesA />
      <FeaturesB />
      <AccordionSection />
      <Footer />
    </main>
  )
}
