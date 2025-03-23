import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Data Processing Agreement | Basecamp",
  description: "Data processing agreement for Basecamp services.",
}

export default function DPAPage() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Data Processing Agreement</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            This Data Processing Agreement (&quot;DPA&quot;) forms part of our commitment to protect your personal data in accordance with applicable data protection laws, including the General Data Protection Regulation (&quot;GDPR&quot;).
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Definitions</h2>
          <ul className="list-disc pl-6">
            <li>&quot;Personal Data&quot; means any information relating to an identified or identifiable natural person</li>
            <li>&quot;Processing&quot; means any operation performed on Personal Data</li>
            <li>&quot;Data Controller&quot; means the entity determining the purposes and means of Processing Personal Data</li>
            <li>&quot;Data Processor&quot; means the entity Processing Personal Data on behalf of the Controller</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Processing of Personal Data</h2>
          <p>
            We process Personal Data on your behalf as follows:
          </p>
          <ul className="list-disc pl-6">
            <li>Purpose: Providing and improving our services</li>
            <li>Duration: For the duration of our service agreement</li>
            <li>Nature: Automated and manual processing</li>
            <li>Type of Personal Data: Contact information, usage data, and other data you provide</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Security Measures</h2>
          <p>
            We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
          </p>
          <ul className="list-disc pl-6">
            <li>Encryption of personal data</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Regular backups</li>
            <li>Staff training on data protection</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Sub-processors</h2>
          <p>
            We may engage sub-processors to process Personal Data. We ensure that any sub-processor we engage is bound by similar obligations as those in this DPA.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Subject Rights</h2>
          <p>
            We assist you in fulfilling your obligations to respond to requests from data subjects exercising their rights under applicable data protection laws, including:
          </p>
          <ul className="list-disc pl-6">
            <li>Right to access</li>
            <li>Right to rectification</li>
            <li>Right to erasure</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
          <p>
            For any questions regarding this DPA, please contact our Data Protection Officer at:
          </p>
          <p>
            Email: support@dealerbasecamp.com<br />
            Address: 2921 SW 11th Street, Miami, FL 33135
          </p>
        </section>
      </div>
    </div>
  )
} 