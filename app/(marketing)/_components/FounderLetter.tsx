import React from "react";
import Image from "next/image";

export default function Features() {
  return (
    <section
      aria-labelledby="features-title"
      className="mx-auto mt-12 w-full max-w-6xl px-3"
    >
      <div className="space-y-12 w-full py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
         
          
          {/* Letter Container */}
          <div className="relative w-full max-w-3xl shadow-lg  shadow-gray-200 rounded-lg rounded-tr-[69px] bg-none">
            <div className="relative z-10 block h-full w-full overflow-hidden rounded-lg rounded-tr-[39px] bg-[#faf9f7] p-8 md:p-12 shadow-[inset_0_0_0_1px] shadow-gray-200 transition-all duration-[180ms] ease-in-out hover:cursor-pointer hover:rounded-tr-[68px] before:absolute before:top-0 before:right-0 before:z-3 before:h-[45px] before:w-[45px] before:-translate-y-1/2 before:translate-x-1/2 before:rotate-45 before:bg-gray-50 before:shadow-[0_1px_0_0_] before:shadow-gray-200 before:transition-all before:duration-[180ms] before:ease-in-out before:content-[''] after:absolute after:top-0 after:right-0 after:z-2 after:size-[42px] after:-translate-y-2 after:translate-x-2 after:rounded-bl-lg after:border after:bg-gray-50 after:shadow-xs after:transition-all after:duration-[180ms] after:ease-in-out after:content-[''] hover:before:h-[75px] hover:before:w-[75px] hover:after:h-[63px] hover:after:w-[63px] hover:after:shadow-lg hover:after:shadow-black/5">
              {/* Paper texture effect using CSS patterns */}
              <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:100%_1.5rem] opacity-10" />
              </div>
              
              {/* Letter content */}
              <div className="relative space-y-6">
                <div className="space-y-6  font-mono">
                  <div className="text-sm text-black">Founder Memo</div>
                  <h2 className="text-xl font-mono tracking-tight text-black">
                    Everything. One place.
                  </h2>
                  <div className="h-px w-24 bg-black/40" />
                </div>
                <div className="space-y-6 text-muted-foreground md:text-lg/relaxed lg:text-sm/relaxed xl:text-lg/relaxed">
                  <p className="mb-4 text-gray-700">
                    How many tools does it take to sell a car in 2025?
                  </p>
                  <p className="mb-4 text-gray-700">
                    Every day, I watch talented sales professionals waste time searching through a dozen disconnected systems just to answer basic questions—the same questions asked yesterday, with answers lost somewhere in the mess.
                  </p>
                  <p className="mb-4 text-gray-700">
                  Training new hires means overwhelming them with a too-many-to-count number of websites instead of getting them started selling.
                  </p>
                  <p className="mb-4 text-gray-700">
                    Basecamp was born from this frustration. Not as another tool to add to your collection—but as <span className="relative inline-block bg-amber-200/20 px-1 rounded-sm before:absolute before:inset-0 text-gray-900 before:bg-amber-200/20 before:-z-10 before:rounded-sm before:rotate-[-1deg]">the solution that brings everything together</span>. One place, every link—Carfax, inventory, schedules, directory, documents, Volvo know-how—all right there.  
                  </p>
                  <p className="mb-4 text-gray-700">
                  No more leaning on managers for basic answers. No more -CRM here, inventory there, product knowledge somewhere else. That&apos;s chaos, costing deals.
                  </p>
                  <p className="mb-4 text-gray-700">
                    Welcome to Basecamp. Everything your sales team needs in  <span className="relative inline-block text-gray-900">
                      one place.
                      <svg className="absolute -bottom-1 left-0 w-full h-3" viewBox="0 0 100 10" preserveAspectRatio="none">
                        <path 
                          d="M0,5 C20,2 40,8 60,5 C80,2 100,8 100,5" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          className="text-gray-900/50"
                        />
                      </svg>
                    </span>
                  </p>
                  <p className="mb-4 text-gray-700">
                    Because there had to be a better way.
                  </p>
                </div>

                {/* Signature */}
                <div className="mt-12 space-y-3 font-mono text-black">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/Founder.JPG"
                      alt="Kai Koa - Founder"
                      width={32}
                      height={32}
                      className="size-8 rounded-full object-cover ring-1 ring-black/10"
                    />
                    <div>
                      <p className="text-base">Kai Koa</p>
                      <p className="text-xs">Founder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}