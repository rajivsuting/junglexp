import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - JungleXp",
  description:
    "Terms and conditions for using JungleXp platform and booking services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#3C553D] to-[#2F2F2F]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            <span className="font-bold">TERMS</span> & CONDITIONS
          </h1>
          <p className="text-lg text-white/80 font-light">
            Please read these terms carefully before using our services
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            {/* Section 1 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                1. Introduction and Acceptance
              </h2>
              <p className="text-primary font-light leading-relaxed">
                Welcome to Junglexp.in, a platform owned and operated by
                JungleXp. These Terms and Conditions constitute a legally
                binding agreement between you (the "User") and JungleXp. By
                accessing, browsing, or using this platform, you acknowledge
                that you have read, understood, and agree to be bound by these
                terms. If you do not agree, you may not use our services.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                2. Services Offered & Our Role
              </h2>
              <p className="text-primary font-light leading-relaxed">
                JungleXp operates as a travel aggregator and booking
                facilitator. We provide an online platform to enable you to book
                accommodations, safaris, and related experiences offered by our
                trusted third-party partners ("Service Providers"). Our role is
                limited to connecting you with these Service Providers and
                processing your booking. We do not own, operate, or control the
                services provided on-ground by our partners.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                3. User Obligations
              </h2>
              <p className="text-primary font-light leading-relaxed mb-4">
                As a User, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-3 text-primary font-light ml-4">
                <li>
                  Be at least 18 years of age and possess the legal authority to
                  enter into this agreement.
                </li>
                <li>
                  Provide accurate, complete, and up-to-date information for all
                  bookings and account creation.
                </li>
                <li>
                  Use this platform for lawful, non-commercial purposes only.
                </li>
                <li>
                  Comply with the rules and regulations of all Service Providers
                  (resorts, guides, etc.) during your trip.
                </li>
                <li>
                  Ensure that all members of your group also agree to and comply
                  with these terms.
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                4. Booking, Payments, and Confirmation
              </h2>
              <div className="space-y-4 text-primary font-light">
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-2">
                    Pricing:
                  </h3>
                  <p>
                    Prices listed on the platform are subject to change until a
                    booking is confirmed. We reserve the right to amend prices
                    due to currency fluctuations, changes in government taxes,
                    or other unforeseen circumstances.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-2">
                    Booking Process:
                  </h3>
                  <p>
                    All bookings are subject to availability. A booking is
                    confirmed only after full payment is received and you have
                    been issued a confirmation voucher via email.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-2">
                    Payment:
                  </h3>
                  <p>
                    We use secure third-party payment gateways. You are
                    responsible for any bank fees, taxes, or surcharges
                    associated with your payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                5. Cancellations and Refunds
              </h2>
              <p className="text-primary font-light leading-relaxed mb-4">
                This is a critical section for any travel company. Our policy is
                designed to be as fair and transparent as possible while
                protecting our commitments to our partners.
              </p>
              <div className="space-y-4 text-primary font-light">
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-2">
                    Cancellation by User:
                  </h3>
                  <p className="mb-3">
                    All cancellation requests must be made in writing via email
                    to{" "}
                    <a
                      href="mailto:bookings@junglexp.in"
                      className="text-[#9B8B6C] underline hover:text-[#877B4E]"
                    >
                      bookings@junglexp.in
                    </a>
                    . The refund amount will be calculated based on the date we
                    receive your cancellation email. The following charges will
                    apply:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>30 days or more before the trip:</strong> Full
                      refund (less any non-refundable service fees or
                      third-party charges, such as airline tickets or specific
                      hotel deposits).
                    </li>
                    <li>
                      <strong>15-29 days before the trip:</strong> 50% of the
                      total cost will be refunded.
                    </li>
                    <li>
                      <strong>Less than 15 days before the trip:</strong> No
                      refund will be provided, as our partners have already made
                      commitments for your booking.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-2">
                    Cancellation by JungleXp:
                  </h3>
                  <p>
                    We almost never cancel bookings. However, in the rare event
                    of a cancellation due to unforeseen circumstances (e.g.,
                    natural disasters, political unrest), we will offer a full
                    refund of all amounts paid. We are not liable for any
                    additional expenses or consequential loss suffered by the
                    user.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                6. Liability & Disclaimers
              </h2>
              <div className="space-y-4 text-primary font-light">
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-2">
                    JungleXp's Role:
                  </h3>
                  <p>
                    We are not responsible for any personal injury, death,
                    property damage, loss, or delay that may occur during your
                    trip. Our liability is limited to our role as a booking
                    facilitator.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-2">
                    Service Provider Responsibility:
                  </h3>
                  <p>
                    The services provided on the ground (accommodation,
                    transportation, guiding, etc.) are the sole responsibility
                    of the respective Service Providers. We are not liable for
                    their acts, omissions, or negligence.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-[#877B4E] mb-2">
                    Force Majeure:
                  </h3>
                  <p>
                    We are not liable for any failure or delay in performance
                    due to events beyond our reasonable control, including but
                    not limited to natural disasters, government actions,
                    pandemics, or civil unrest.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                7. Intellectual Property
              </h2>
              <p className="text-primary font-light leading-relaxed">
                All content on this platform, including text, logos, images, and
                brand-specific terms like "Sensitized Traveler," is the property
                of JungleXp. Unauthorized use, reproduction, or distribution is
                prohibited.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                8. Governing Law and Jurisdiction
              </h2>
              <p className="text-primary font-light leading-relaxed">
                Any disputes arising from or in connection with these Terms and
                Conditions will be governed by the laws of India. The courts in
                [Your City, India] will have exclusive jurisdiction over any
                such disputes.
              </p>
            </div>

            {/* Section 9 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#9B8B6C] mb-6 border-b border-[#9B8B6C]/20 pb-3">
                9. Contact Us
              </h2>
              <p className="text-primary font-light leading-relaxed">
                For any questions about these terms, please contact us at:
              </p>
              <p className="mt-4">
                <a
                  href="mailto:contact@junglexp.in"
                  className="text-[#9B8B6C] underline hover:text-[#877B4E] font-medium"
                >
                  contact@junglexp.in
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
