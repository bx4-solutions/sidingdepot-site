import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Siding Depot" },
      {
        name: "description",
        content: "How Siding Depot LLC collects, uses, and protects your personal information.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.sidingdepot.com/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-3xl px-4 lg:px-8 py-16 lg:py-24">
        <h1 className="font-display text-3xl sm:text-4xl text-sd-black">
          Privacy Policy — Siding Depot
        </h1>

        <div className="mt-10 space-y-8 text-sd-gray-text leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">1. Introduction</h2>
            <p>
              Siding Depot LLC ("we," "us," or "our") respects your privacy and is committed to
              protecting your personal information. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your data when you visit our website sidingdepot.com (the
              "Site") or communicate with us by email, SMS, or WhatsApp.
            </p>
            <p className="mt-3">
              By using our Site, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">2. Information We Collect</h2>
            <p>
              We may collect the following information when you interact with our Site or submit a
              contact form:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>
                <strong className="text-sd-black">Personal identification data:</strong> Full name,
                phone number, email address, physical address, ZIP code, city, and state.
              </li>
              <li>
                <strong className="text-sd-black">Communication data:</strong> Messages sent through
                our forms, email, SMS, or WhatsApp.
              </li>
              <li>
                <strong className="text-sd-black">Technical data:</strong> browser type, IP address,
                operating system, and analytics data obtained through cookies or similar
                technologies.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Respond to your questions or quote requests;</li>
              <li>Schedule consultations or appointments;</li>
              <li>
                Send follow-up messages, service updates, and marketing messages by email, SMS, or
                WhatsApp;
              </li>
              <li>Improve our services, website, and customer experience;</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">4. Legal Basis and Consent</h2>
            <p>
              By submitting your information on our Site, you agree to the collection and use of
              your personal data for the purposes described above, including receiving
              communications from us by email, SMS, and WhatsApp.
            </p>
            <p className="mt-3">
              You may opt out of marketing communications at any time by following the unsubscribe
              instructions or by contacting{" "}
              <a href={`mailto:${SITE.email}`} className="text-sd-green hover:underline">
                {SITE.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">5. Data Sharing and Disclosure</h2>
            <p>We may only share your data with:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>
                Service providers who help us operate our business (for example, marketing
                automation, hosting, and analytics providers);
              </li>
              <li>Contractors and partners directly involved in fulfilling your requests;</li>
              <li>Legal authorities, if required by law.</li>
            </ul>
            <p className="mt-3">We do not sell your personal data.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">
              6. Cookies and Tracking Technologies
            </h2>
            <p>
              Our website uses cookies and analytics tools to understand how visitors interact
              with our content and to improve performance. These include Google Analytics and
              Google Tag Manager, Meta (Facebook) Pixel, Metricool, and our customer-relationship
              platform GoHighLevel / ClickOne, which records site-navigation activity and may
              associate it with your contact record once you submit a form or otherwise identify
              yourself, so we can follow up on your request.
            </p>
            <p className="mt-3">
              You can disable cookies in your browser settings, but this may affect some site
              functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">7. Data Retention</h2>
            <p>
              We retain your information only for as long as necessary for the purposes described in
              this Policy or as required by law.
            </p>
            <p className="mt-3">
              When no longer needed, your data will be securely deleted or anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">8. Data Security</h2>
            <p>
              We implement appropriate administrative, technical, and physical safeguards to protect
              your personal data against unauthorized access, alteration, disclosure, or
              destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">9. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Access and obtain a copy of your personal data;</li>
              <li>Request correction or deletion of your data;</li>
              <li>Withdraw consent for marketing communications;</li>
              <li>File a complaint with a data protection authority.</li>
            </ul>
            <p className="mt-3">
              Requests can be made at{" "}
              <a href={`mailto:${SITE.email}`} className="text-sd-green hover:underline">
                {SITE.email}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">10. Children's Privacy</h2>
            <p>
              Our website is not directed to individuals under the age of 18. We do not knowingly
              collect information from minors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">11. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on
              this page with an updated "Effective Date."
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">12. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or how we handle your data, please
              contact us:
            </p>
            <p className="mt-3">
              Email:{" "}
              <a href={`mailto:${SITE.email}`} className="text-sd-green hover:underline">
                {SITE.email}
              </a>
              <br />
              Mailing address: {SITE.address.full}
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
