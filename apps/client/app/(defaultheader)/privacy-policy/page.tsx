import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - JungleXp",
  description:
    "Privacy policy for JungleXp platform - how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#3C553D] to-[#2F2F2F]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            <span className="font-bold">PRIVACY</span> POLICY
          </h1>
          <p className="text-lg text-white/80 font-light">
            How we collect, use, and protect your personal information
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                Introduction
              </h2>
              <p className="text-primary font-light leading-relaxed">
                Welcome to JungleXp. Your privacy is a priority for us, and this
                Privacy Policy outlines how we collect, use, and protect your
                personal information when you use our platform at Junglexp.in.
                We are committed to transparency and to handling your data with
                the care and respect it deserves. By using our services, you
                agree to the terms of this policy.
              </p>
            </div>

            {/* Section 1 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                1. Information We Collect
              </h2>
              <p className="text-primary font-light leading-relaxed mb-6">
                To provide a seamless and secure booking experience, we collect
                various types of information. We only collect data that is
                necessary for our specified purposes.
              </p>

              <div className="space-y-6 text-primary font-light">
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    Personal Information:
                  </h3>
                  <p>
                    This includes data you provide to us directly when you make
                    a booking, create an account, or contact us. It may include
                    your name, email address, phone number, physical address,
                    and government-issued ID details (such as passport or Aadhar
                    number) required for resort and safari bookings.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    Transaction Information:
                  </h3>
                  <p>
                    When you make a purchase, we collect payment details,
                    including your credit card number or other payment
                    information. This data is processed securely by our
                    third-party payment gateways and is not stored on our
                    servers.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    Technical & Usage Data:
                  </h3>
                  <p>
                    We automatically collect data about your use of our website,
                    such as your IP address, browser type, device information,
                    and pages visited. This helps us analyze website traffic,
                    improve our services, and personalize your experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                2. How We Use Your Information
              </h2>
              <p className="text-primary font-light leading-relaxed mb-6">
                We use your data exclusively for lawful purposes directly
                related to our services and our mission of promoting conscious
                travel.
              </p>

              <div className="space-y-6 text-primary font-light">
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    To Fulfill Bookings:
                  </h3>
                  <p>
                    We share your necessary personal and travel information with
                    our trusted partners, including resorts, safari operators,
                    and certified guides, to process your booking and ensure a
                    smooth experience.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    To Improve Our Services:
                  </h3>
                  <p>
                    We use data to understand user behavior, preferences, and
                    trends. This allows us to innovate and tailor our offerings
                    to better serve our community of mindful travelers.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    For Communication:
                  </h3>
                  <p>
                    We use your contact information to send you booking
                    confirmations, trip details, important updates, and customer
                    support messages.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    For Marketing:
                  </h3>
                  <p>
                    With your explicit consent, we may send you personalized
                    offers, newsletters, and information about new experiences
                    or conservation initiatives that we believe align with your
                    interests. You can opt-out of these communications at any
                    time.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                3. Data Sharing and Disclosure
              </h2>
              <p className="text-primary font-light leading-relaxed mb-6">
                We will never sell or rent your personal information to third
                parties for their marketing purposes. We only share your data as
                necessary to provide our services and ensure legal compliance.
              </p>

              <div className="space-y-6 text-primary font-light">
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    Third-Party Service Providers:
                  </h3>
                  <p>
                    We share information with our on-ground partners (resorts,
                    guides, etc.) on a "need-to-know" basis to facilitate your
                    booking. We ensure these partners are bound by
                    confidentiality agreements and are committed to data
                    security.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-3">
                    Legal Compliance:
                  </h3>
                  <p>
                    We may disclose your information if required by law, a
                    government request, or to protect our rights or the safety
                    of our users.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                4. Data Security
              </h2>
              <p className="text-primary font-light leading-relaxed">
                We are committed to protecting your data. We have implemented
                industry-standard security measures, including encryption,
                secure servers, and regular security audits to safeguard your
                personal information from unauthorized access, loss, or misuse.
                However, no electronic transmission or storage is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                5. Your Rights
              </h2>
              <p className="text-primary font-light leading-relaxed mb-6">
                As a user, you have rights over your data in accordance with
                Indian data protection laws.
              </p>

              <ul className="list-disc list-inside space-y-3 text-primary font-light ml-4">
                <li>
                  <strong className="text-[#877B4E]">Right to Access:</strong>{" "}
                  You can request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong className="text-[#877B4E]">
                    Right to Rectification:
                  </strong>{" "}
                  You can ask us to correct any inaccurate or incomplete
                  information.
                </li>
                <li>
                  <strong className="text-[#877B4E]">Right to Erasure:</strong>{" "}
                  You can request that we delete your personal data, subject to
                  any legal or contractual obligations we may have.
                </li>
                <li>
                  <strong className="text-[#877B4E]">
                    Right to Withdraw Consent:
                  </strong>{" "}
                  You can withdraw your consent for any data processing at any
                  time, which may affect our ability to provide certain
                  services.
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                6. Cookies
              </h2>
              <p className="text-primary font-light leading-relaxed">
                Our website uses cookies to enhance your experience. Cookies are
                small files placed on your device that help us remember your
                preferences, analyze website usage, and personalize content. You
                have the option to accept or decline cookies through your
                browser settings.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                7. Changes to This Policy
              </h2>
              <p className="text-primary font-light leading-relaxed">
                We may update this Privacy Policy from time to time. Any changes
                will be posted on this page, and we encourage you to review it
                periodically. Your continued use of the platform after any
                changes signifies your acceptance of the updated terms.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                8. Contact Us
              </h2>
              <p className="text-primary font-light leading-relaxed mb-4">
                If you have any questions or concerns about this Privacy Policy
                or your data, please contact us at:
              </p>
              <p>
                <a
                  href="mailto:privacy@junglexp.in"
                  className="text-[#9B8B6C] underline hover:text-[#877B4E] font-medium"
                >
                  privacy@junglexp.in
                </a>
              </p>
            </div>

            {/* Decorative Divider */}
            <div className="pt-8">
              <div className="w-72 h-[1px] bg-[#9B8B6C] mx-auto"></div>
            </div>

            {/* Last Updated */}
            <div className="text-center pt-8">
              <p className="text-sm text-muted-foreground">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
