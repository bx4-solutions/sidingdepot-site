import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/data/site";

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Siding Depot" },
      {
        name: "description",
        content: "The terms and conditions governing your use of sidingdepot.com.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.sidingdepot.com/terms-of-use" }],
  }),
  component: TermsOfUsePage,
});

function TermsOfUsePage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-3xl px-4 lg:px-8 py-16 lg:py-24">
        <h1 className="font-display text-3xl sm:text-4xl text-sd-black">
          Terms of Use — Siding Depot LLC
        </h1>

        <div className="mt-10 space-y-8 text-sd-gray-text leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using sidingdepot.com ("Site"), you agree to comply with and be bound
              by these Terms of Use. If you do not agree, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">2. About the Company</h2>
            <p>
              Siding Depot LLC provides residential and commercial exterior remodeling services,
              including siding installation, windows, painting, and related construction work.
            </p>
            <p className="mt-3">
              The Site serves informational and promotional purposes and allows users to request
              quotes and contact our team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">3. Use of the Site</h2>
            <p>You agree to use this Site only for lawful purposes and not to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Provide false or misleading information;</li>
              <li>Interfere with or disrupt the functionality of the Site;</li>
              <li>Attempt unauthorized access to systems or data;</li>
              <li>Use automated tools or bots to extract data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">4. User Submissions</h2>
            <p>When you submit personal information via our forms, you represent that:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>The data is accurate and up to date;</li>
              <li>You consent to our use of the information as described in the Privacy Policy;</li>
              <li>
                You allow us to contact you through email, SMS, and WhatsApp for business and
                marketing purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">5. Communications and Marketing</h2>
            <p>
              By providing your contact details, you agree that Siding Depot LLC may reach out
              through email, phone, SMS, and WhatsApp for follow-ups, quotes, and promotional
              messages.
            </p>
            <p className="mt-3">
              You may opt out at any time by replying "STOP" to SMS/WhatsApp or using unsubscribe
              links in emails.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">6. Intellectual Property</h2>
            <p>
              All content, graphics, logos, text, and other materials on the Site are owned or
              licensed by Siding Depot LLC and protected by intellectual property laws.
            </p>
            <p className="mt-3">
              You may not copy, reproduce, or distribute any content without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">7. Disclaimer of Warranties</h2>
            <p>
              The Site and its content are provided "as is." Siding Depot LLC makes no warranties,
              express or implied, regarding accuracy, reliability, or availability.
            </p>
            <p className="mt-3">Use of the Site is at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Siding Depot LLC shall not be liable for any
              direct, indirect, incidental, or consequential damages arising from the use or
              inability to use the Site or its content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">9. Third-Party Links</h2>
            <p>
              Our Site may contain links to external websites. We are not responsible for their
              content or privacy practices. Accessing third-party sites is at your own discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">10. Modifications to the Terms</h2>
            <p>
              We may update these Terms of Use at any time without prior notice. The revised version
              will be posted on this page and will be effective immediately upon posting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Georgia, USA, without regard to
              conflict-of-law principles.
            </p>
            <p className="mt-3">
              Any dispute shall be resolved in the courts located in Cobb County, Georgia.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-sd-navy mb-2">12. Contact Information</h2>
            <p>For questions regarding these Terms, please contact us at:</p>
            <p className="mt-3">
              Siding Depot LLC
              <br />
              {SITE.address.full}
              <br />
              <a href={`mailto:${SITE.email}`} className="text-sd-green hover:underline">
                {SITE.email}
              </a>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
