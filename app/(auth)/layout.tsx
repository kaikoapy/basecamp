"use client"

import { type ReactNode } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const router = useRouter()

  return (
    <>
      <div className="relative z-20 flex items-center text-lg font-medium p-4">
        <button 
          onClick={() => router.push("/")}
          className="hover:opacity-75 transition-opacity"
        >
          <Image
            src="/Basecamp-logo.png"
            alt="Basecamp"
            width={200}
            height={50}
            className="object-contain"
            priority
          />
        </button>
      </div>
      <main className="mx-auto max-w-full">{children}</main>
    </>
  )
}