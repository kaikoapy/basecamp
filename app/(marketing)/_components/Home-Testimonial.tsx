"use client"

import Image from "next/image"



export default function Testimonial() {
  return (
    <section
      className="mt-16 flex animate-slide-up-fade flex-col items-center justify-center px-4 sm:mt-32"
      style={{ animationDuration: "1500ms" }}
    >
      <figure className="mx-auto max-w-2xl">
        <div className="relative">
          <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-gray-200 dark:bg-gray-800" />
          <blockquote className="pl-6 text-left text-lg sm:text-xl font-medium tracking-tight text-gray-900 dark:text-gray-100">
            <span className="rounded-md bg-amber-100 px-2 py-1 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100">
            Basecamp is the perfect tool for any sales team.
            </span>{" "}
            <span className="text-muted-foreground">
            I can now find everything I need in one place, which means I spend less time searching and more time connecting with customers. It's made my job so much easier!
            </span>
          </blockquote>
          <figcaption className="mt-4 sm:mt-6 flex items-center gap-x-3 sm:gap-x-4 pl-6">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full">
              <Image
                className="object-cover object-top"
                src="/juan.jpg"
                alt="Avatar"
                fill
                sizes="(max-width: 640px) 40px, 48px"
                priority
              />
            </div>
            <div className="flex flex-col text-sm sm:text-base text-gray-500 dark:text-gray-400">
              <span className="font-medium">Juan Contreras</span>
              <span className="text-xs sm:text-sm">Sales Specialist at Volvo Cars North Miami</span>
            </div>
          </figcaption>
        </div>
      </figure>
    </section>
  )
}
