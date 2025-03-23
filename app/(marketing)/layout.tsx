import Footer from "./_components/Footer"
import { Navigation } from "./_components/Navbar"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-full">{children}</main>
      <Footer />
    </>
  )
}
