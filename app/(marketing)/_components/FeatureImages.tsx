"use client"

import { motion } from "framer-motion"
import { BookOpen, Calendar, LayoutDashboard, Library, Users } from "lucide-react"
import { useState } from "react"

const ImageSection = () => {
  const [activeImage, setActiveImage] = useState(1)

  const ImageTabs = [
    {
      name: "Seamless Dashboard",
      icon: <LayoutDashboard />,
    },
    {
      name: "Product Knowledge",
      icon: <BookOpen />,
    },
    {
      name: "Document Library",
      icon: <Library />,
    },
    {
      name: "Contact Directory",
      icon: <Users />,
    },
    {
      name: "Schedule Builder",
      icon: <Calendar />,
    },
  ]

  // Images taken from https://dashboardsdesign.com/
  const Images = [
    {
      imageNumber: 1,
      imageSource: "/BC-Dashboard-FeatureImages.png",
    },
    {
      imageNumber: 2,
      imageSource: "/BC-Training-FeatureImages.png",
    },
    {
      imageNumber: 3,
      imageSource: "/BC-Documents-FeatureImages.png",
    },
    {
      imageNumber: 4,
      imageSource: "/BC-Directory-FeatureImages.png",
    },
    {
      imageNumber: 5,
      imageSource: "/BC-Schedule-FeatureImages.png",
    },
  ]

  const handleImageChange = (index: number) => {
    setActiveImage(index)
  }

  return (
    <div className="px-3">
      <section
        aria-labelledby="syntax-ui-title"
        className="relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 pt-24 shadow-xl shadow-black/30 md:mt-40"
      >
        {/* Glow effect - positioned lower */}
        <div className="absolute top-[40rem] h-[30rem] w-[90%] rounded-2xl bg-indigo-800/50 blur-3xl md:top-[44rem]" />

        {/* Top pill/badge */}
        <div className="z-10 inline-block rounded-lg border border-indigo-400/20 bg-indigo-800/20 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tight sm:text-sm">
          <span className="bg-gradient-to-b from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            Core Features
          </span>
        </div>

        {/* Main heading */}
        <h2
          id="syntax-ui-title"
          className="z-10 mt-6 inline-block bg-gradient-to-b from-white to-indigo-100 bg-clip-text px-2 text-center text-5xl font-bold tracking-tighter text-transparent md:text-6xl"
        >
          See Basecamp <br /> in action
        </h2>

        {/* Feature selection tabs */}
        <div className="z-20 mt-8 w-full max-w-4xl px-6">
          <div className="flex justify-center gap-4">
            {ImageTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleImageChange(index + 1)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all duration-200 hover:bg-indigo-900/20 ${
                  activeImage === index + 1
                    ? "border-indigo-500/50 bg-indigo-900/30"
                    : "border-white/5 bg-transparent"
                }`}
              >
                <span
                  className={`rounded-md p-1.5 ${
                    activeImage === index + 1 ? "bg-indigo-600 text-indigo-100" : "bg-gray-800 text-indigo-400"
                  }`}
                >
                  {tab.icon}
                </span>
                <span className="text-sm font-medium text-indigo-200">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image display area */}
        <div className="z-10 mt-10 h-[36rem] w-full overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-6">
            {Images.map((image, index) => (
              <div key={index} data-image-number={image.imageNumber} className="relative">
                {activeImage === image.imageNumber && (
                  <>
                    <motion.img
                      src={image.imageSource}
                      alt={`Image ${image.imageNumber}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full rounded-xl border border-white/5 shadow-2xl"
                    />
                    <div className="absolute bottom-0 h-1/2 w-full rounded-b-xl bg-gradient-to-b from-transparent via-gray-950/70 to-gray-950" />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ImageSection

