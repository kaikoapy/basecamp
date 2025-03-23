import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Waitlist",
  description: "Join our waitlist to get early access to our platform.",
}

export default function WaitlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 