import Features from "./_components/FounderLetter"
import ImageSection from "./_components/FeatureImages"
import Hero from "./_components/Hero"
import LogoCloud from "./_components/LogoCloud"
import { BentoDemo } from "./_components/bento-grid"

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Hero />
      <LogoCloud />
      <ImageSection />
      <BentoDemo />
      <Features />
  
    </main>
  )
}
