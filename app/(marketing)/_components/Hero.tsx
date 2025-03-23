import { RiPlayCircleFill } from "@remixicon/react"
import Link from "next/link"
import { Button } from "./Button"
import HeroImage from "./HeroImage"

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mt-32 flex flex-col items-center justify-center text-center sm:mt-30"
    >
      <Link
        href="#"
        className="group mb-8 inline-flex max-w-full items-center gap-3 rounded-full bg-white/5 px-2.5 py-0.5 pr-3 pl-0.5 text-gray-900 ring-1 ring-black/10 shadow-lg shadow-[#6a68f1]/20 backdrop-blur-[1px] transition-colors hover:bg-[#6a68f1]/[2.5%]"
      >
        <span className="shrink-0 rounded-full border bg-gray-50 px-2.5 py-1 text-sm text-gray-600 sm:text-xs">
          New
        </span>
        <span className="flex items-center gap-1 truncate text-sm">
          <span className="w-full truncate">
            Powering modern Volvo dealerships
          </span>
          <svg
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </span>
      </Link>
      <h1
        id="hero-title"
        className="inline-block animate-slide-up-fade bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text p-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-7xl dark:from-gray-50 dark:to-gray-300"
        style={{ animationDuration: "700ms" }}
      >
        Everything your sales team needs <br /> in one place
      </h1>
      <p
        className="mt-6 max-w-lg animate-slide-up-fade text-lg text-gray-700 dark:text-gray-400"
        style={{ animationDuration: "900ms" }}
      >
        Basecamp unites your dealership&apos;s resources and tools. No more tabs, no more searching — just everything in one place.
      </p>
      <div
        className="mt-8 flex w-full animate-slide-up-fade flex-col justify-center gap-3 px-3 sm:flex-row"
        style={{ animationDuration: "1100ms" }}
      >
        <Button className="inline-flex h-10 cursor-pointer items-center justify-center gap-1 rounded-xl border-b-[1.5px] border-[#5553d4] bg-gradient-to-b from-[#6a68f1] to-[#5553d4] px-5 py-3 font-medium tracking-wide text-white shadow-[0_0_0_2px_rgba(0,0,0,0.04),0_0_14px_0_rgba(106,104,241,0.19)] transition-all duration-200 ease-in-out hover:shadow-[#6a68f1]/30 active:scale-[0.98]">
          <Link href="/waitlist">Request Access</Link>
        </Button>
        <Button
          asChild
          variant="light"
          className="group gap-x-2 bg-transparent font-semibold hover:bg-transparent dark:bg-transparent hover:dark:bg-transparent"
        >
          <Link
            href="https://www.youtube.com/watch?v=QRZ_l7cVzzU"
            className="ring-1 ring-gray-200 sm:ring-0 dark:ring-gray-900"
            target="_blank"
          >
            <span className="mr-1 flex size-6 items-center justify-center rounded-full bg-gray-50 transition-all group-hover:bg-gray-200 dark:bg-gray-800 dark:group-hover:bg-gray-700">
              <RiPlayCircleFill
                aria-hidden="true"
                className="size-5 shrink-0 text-gray-900 dark:text-gray-50"
              />
            </span>
            Watch video
          </Link>
        </Button>
      </div>
      <div
        className="relative mx-auto ml-3 mt-20 h-fit w-[40rem] max-w-6xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2"
        style={{ animationDuration: "1400ms" }}
      >
        <HeroImage />
        <div
          className="absolute inset-x-0 -bottom-20 -mx-10 h-2/4 bg-gradient-to-t from-white via-white to-transparent lg:h-1/4 dark:from-gray-950 dark:via-gray-950"
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
