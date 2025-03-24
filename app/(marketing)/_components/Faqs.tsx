"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./Accordion"

const faqs = [
  {
    question:
      "How secure is your platform for storing dealership and customer data?",
    answer:
      "Our platform employs enterprise-grade encryption and security protocols to protect all dealership and customer information. We're compliant with automotive industry data protection standards and conduct regular security audits to ensure your sensitive information remains safe. All data is encrypted both in transit and at rest, giving you peace of mind that your Volvo dealership's information is fully protected.",
  },
  {
    question: "Can I access the platform on multiple devices?",
    answer:
      "Yes, our platform is fully responsive and accessible across all devices. Whether you're using a desktop at the dealership, a tablet on the showroom floor, or a smartphone while with a customer, you'll have full access to your centralized bookmarks, Volvo resources, and integrated tools. Your dashboard synchronizes in real-time across all your devices, ensuring you always have the most up-to-date information regardless of how you access it.",
  },
  {
    question:
      "How does the Carfax integration work with your platform?",
    answer:
      "Our Carfax integration allows you to access vehicle history reports directly from your dashboard without needing to log in separately. With a single click, you can pull up comprehensive vehicle history for any VIN. The advanced integration in our Sales Team and Dealership Pro plans includes batch lookups and automatic flagging of vehicles with concerning history items, helping your sales team make informed decisions quickly while working with customers.",
  },
  {
    question:
      "What kind of Volvo-specific resources are included in the platform?",
    answer:
      "Our platform includes a comprehensive library of Volvo-specific resources tailored to your subscription level. The Single Agent plan provides basic specifications and pricing guides. The Sales Team plan adds advanced product comparisons, sales scripts, and promotional materials. The Dealership Pro plan includes complete access to all Volvo documentation, training materials, certification resources, and early access to information about upcoming models and features to keep your entire dealership ahead of the curve.",
  },
  {
    question:
      "What level of training and support do you provide for new users?",
    answer:
      "Our support options vary by plan. Single Agent subscribers receive email support with 48-hour response times. Sales Team plans include both email and live chat support with 24-hour response times and a group training session for your team. Dealership Pro subscribers enjoy our highest level of support with a dedicated account manager, priority response times, and personalized training sessions for your entire staff to ensure everyone can maximize the platform's capabilities for your specific dealership needs.",
  },
]

export function Faqs() {
  return (
    <section className="mt-20 sm:mt-36 px-4" aria-labelledby="faq-title">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-14">
        <div className="col-span-full sm:col-span-5">
          <h2
            id="faq-title"
            className="inline-block scroll-my-24 bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 pr-2 text-2xl font-bold tracking-tighter text-transparent lg:text-3xl dark:from-gray-50 dark:to-gray-300"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
            Can&rsquo;t find the answer you&rsquo;re looking for? Don&rsquo;t
            hesitate to get in touch with our{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-300 dark:text-indigo-400"
            >
              customer support
            </a>{" "}
            team.
          </p>
        </div>
        <div className="col-span-full mt-6 lg:col-span-7 lg:mt-0">
          <Accordion type="multiple" className="mx-auto">
            {faqs.map((item) => (
              <AccordionItem
                value={item.question}
                key={item.question}
                className="py-3 first:pb-3 first:pt-0"
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
