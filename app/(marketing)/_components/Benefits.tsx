const benefits = [
  {
    title: "Sales, Not Software",
    description:
      "We’re not just tech nerds—we’ve lived the dealership grind. Basecamp’s built to fuel your Volvo sales, not bog you down in code.",
  },
  {
    title: "One Hub, Total Control",
    description:
      "No more chaos of scattered links and tools. We believe your team deserves everything in one place, under your command.",
  },
  {
    title: "Simple Over Slick",
    description:
      "Forget bloated platforms with bells and whistles you’ll never use. We keep Basecamp lean, fast, and focused on what matters—closing deals.",
  },
  {
    title: "Your Team, Our Fight",
    description:
      "We’re here to unshackle Volvo sales crews from resource hell. Our mission is your freedom to sell, not wrestle with apps.",
  },
  {
    title: "Built for the Long Haul",
    description:
      "Trends come and go—SaaS overload is just the latest. We’re crafting a tool that endures, rooted in real sales needs.",
  },
  {
    title: "Dealership DNA",
    description:
      "From Carfax to schedules, we get your world. Basecamp’s shaped by people who’ve walked the showroom floor, not just the server room.",
  },
  {
    title: "Chaos Ends Here",
    description:
      "Bookmarks, tabs, logins—we’re done with the mess. Our philosophy is clarity: one hub to cut through it all, every day.",
  },
  {
    title: "Volvo at Heart",
    description:
      "This isn’t generic software slapped with a logo. We’re obsessed with making Volvo dealerships sharper, stronger, and unstoppable.",
  },
];

export default function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="mx-auto mt-44">
      <h2
        id="benefits-title"
        className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent md:text-5xl dark:from-gray-50 dark:to-gray-300"
      >
        Why Basecamp Exists
      </h2>
      <dl className="mt-8 grid grid-cols-4 gap-x-10 gap-y-8 sm:mt-12 sm:gap-y-10">
        {benefits.map((benefit, index) => (
          <div key={index} className="col-span-4 sm:col-span-2 lg:col-span-1">
            <dt className="font-semibold text-gray-900 dark:text-gray-50">
              {benefit.title}
            </dt>
            <dd className="mt-2 leading-7 text-gray-600 dark:text-gray-400">
              {benefit.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}