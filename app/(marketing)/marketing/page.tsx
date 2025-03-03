import CodeExample from "./_components/CodeExample"
import Cta from "./_components/Cta"
import Features from "./_components/Features"
import { VolvoSalesHub } from "./_components/GlobalDatabase"
import Hero from "./_components/Hero"
import LogoCloud from "./_components/LogoCloud"
export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Hero />
      <LogoCloud />
      <VolvoSalesHub />
      <CodeExample />
      <Features />
      <Cta />
    </main>
  )
}
