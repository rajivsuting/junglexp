import Link from "next/link";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { FaLinkedin, FaPhone } from "react-icons/fa";
import Map from "@/components/Map";
import Image from "next/image"; // Added for hero image

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Junglexp.in for your safari and activity bookings.",
};

export const dynamic = "force-static";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[60dvh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="/tiger-heroi.jpg" // Using a generic hero image, can be replaced
          alt="Contact Us Hero"
          fill
          priority
          className="object-cover object-center absolute inset-0 z-0"
        />
        <div className="absolute inset-0 z-0 bg-black/50"></div>{" "}
        {/* Darker overlay */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg leading-tight">
            Contact <span className="font-normal">Us</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 text-white drop-shadow-md max-w-2xl mx-auto">
            We're here to help you plan your perfect adventure. Reach out to us
            for any queries.
          </p>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 gap-16 items-start">
            {/* Contact Information */}
            <div>
              <h2 className="text-4xl font-bold text-primary mb-8 border-b-2 border-primary-light pb-2">
                Get in Touch
              </h2>
              <div className="space-y-6 text-xl text-gray-800">
                <p>
                  <span className="font-semibold text-primary-dark">
                    Website:
                  </span>{" "}
                  <Link
                    href="/"
                    className="text-green-700 hover:underline transition-colors"
                  >
                    Junglexp.in
                  </Link>
                </p>
                <p>
                  <span className="font-semibold text-primary-dark">
                    Address:
                  </span>
                  <br />
                  Unit 6 Tribhuvan Complex,
                  <br />
                  Ishwar Nagar Block 1,
                  <br />
                  New Delhi, India, 110065
                </p>
                <p className="flex items-center space-x-3">
                  <span className="font-semibold text-primary-dark">
                    Email:
                  </span>{" "}
                  info@junglexp.in{" "}
                  <Link
                    href="mailto:info@junglexp.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 ml-2 transition-transform"
                  >
                    <FaEnvelope className="text-green-700" size={24} />
                  </Link>
                </p>
                <p className="flex items-center space-x-3">
                  <span className="font-semibold text-primary-dark">
                    Contact number:
                  </span>{" "}
                  +91-7428006473
                  <Link
                    href="tel:+917428006473"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-110 ml-2 transition-transform"
                  >
                    <FaPhone className="text-green-700" size={24} />
                  </Link>
                </p>
              </div>

              <div className="mt-12">
                <h3 className="text-3xl font-bold text-primary mb-6 border-b border-primary-light pb-2">
                  Follow Us
                </h3>
                <div className="flex space-x-6">
                  <Link
                    target="_blank"
                    href="https://www.facebook.com/share/1BbY8UgRGR/"
                    className="text-gray-600 hover:text-blue-700 transition-all hover:scale-110"
                    aria-label="Facebook"
                  >
                    <FaFacebook size={32} />
                  </Link>
                  <Link
                    target="_blank"
                    href="https://www.instagram.com/junglexpecotour?igsh=bzFseDB6ZWZsdnI4"
                    className="text-gray-600 hover:text-pink-600 transition-all hover:scale-110"
                    aria-label="Instagram"
                  >
                    <FaInstagram size={32} />
                  </Link>
                  <Link
                    target="_blank"
                    href="https://www.linkedin.com/in/junglexp-eco-tours-85a063392?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    className="text-gray-600 hover:text-blue-800 transition-all hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedin size={32} />
                  </Link>
                  <Link
                    target="_blank"
                    href="https://x.com/junglexpecotour?t=TUtDuu0ftzIiD-cjYpcFwQ&s=09"
                    className="text-gray-600 hover:text-black transition-all hover:scale-110"
                    aria-label="X (Twitter)"
                  >
                    <FaXTwitter size={32} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-4xl font-medium text-primary text-center mb-10 border-b-2 border-primary-light pb-2">
            Our Location
          </h2>
          <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-xl border-2 border-gray-200">
            <Map />
          </div>
        </div>
      </section>
    </div>
  );
}
