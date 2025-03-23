import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Basecamp",
  description: "Our privacy policy and data protection practices.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. By using our service, you consent to the practices described in this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold mb-2">2.1 Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Register for an account</li>
            <li>Sign up for our newsletter</li>
            <li>Contact us for support</li>
            <li>Participate in our surveys or promotions</li>
          </ul>

          <h3 className="text-xl font-semibold mb-2">2.2 Automatically Collected Information</h3>
          <p>
            When you access our service, we may automatically collect certain information about your device, including:
          </p>
          <ul className="list-disc pl-6">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Access times and dates</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6">
            <li>Provide and maintain our service</li>
            <li>Improve and personalize your experience</li>
            <li>Communicate with you about updates and support</li>
            <li>Analyze usage patterns and trends</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc pl-6">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Email: [privacy@example.com]<br />
            Address: [Your Company Address]
          </p>
        </section>
      </div>
    </div>
  )
} 