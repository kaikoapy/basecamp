import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Imprint | Basecamp",
  description: "Legal information and company details for Basecamp.",
}

export default function ImprintPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Imprint</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
          <p>
            Basecamp<br />
            [Your Company Address]<br />
            [City, State ZIP]<br />
            [Country]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <p>
            Email: [contact@example.com]<br />
            Phone: [Your Phone Number]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Legal Representatives</h2>
          <p>
            [Name of Legal Representative]<br />
            Position: [Position]<br />
            Email: [representative@example.com]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Registration Details</h2>
          <p>
            Registration Number: [Your Registration Number]<br />
            VAT ID: [Your VAT ID if applicable]<br />
            Chamber of Commerce: [Your Chamber of Commerce]
          </p>
        </section>
      </div>
    </div>
  )
} 