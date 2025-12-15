import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  return (
    <footer className="bg-[#3C553D] text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Image
              src="/LogoWhite.svg"
              alt="logo"
              className="mb-4"
              width={150}
              height={80}
            />
            <div className="flex space-x-4">
              <Link
                target="_blank"
                href="https://www.facebook.com/share/1BbY8UgRGR/"
                className="hover:text-gray-300"
              >
                <FaFacebook size={24} />
              </Link>
              <Link
                target="_blank"
                href="https://www.instagram.com/junglexpecotour?igsh=bzFseDB6ZWZsdnI4"
                className="hover:text-gray-300"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/junglexp-eco-tours-85a063392?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                className="hover:text-gray-300"
              >
                <FaLinkedin size={24} />
              </Link>

              <Link
                target="_blank"
                href="https://x.com/junglexpecotour?t=TUtDuu0ftzIiD-cjYpcFwQ&s=09"
                className="hover:text-gray-300"
              >
                <FaXTwitter size={24} />
              </Link>
            </div>
          </div>

          {/* Useful Links */}
          <div className="flex">
            <div className="w-8">
              <h3 className="text-lg font-bold uppercase tracking-wider origin-top-left -rotate-90 translate-y-20 whitespace-nowrap">
                USEFUL
              </h3>
            </div>
            <div className="flex flex-col space-y-1 ml-4">
              {/* <Link href="/info" className="hover:text-gray-300">
                Useful Info
              </Link>
              <Link href="/specials" className="hover:text-gray-300">
                Specials
              </Link> */}
              <Link
                href="https://www.google.com/maps?q=29.404825,79.127213"
                className="hover:text-gray-300"
              >
                Directions
              </Link>
              <Link
                href="/terms-and-conditions"
                className="hover:text-gray-300"
              >
                Terms & Conditions
              </Link>
              <Link href="/privacy-policy" className="hover:text-gray-300">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex">
            <div className="w-8">
              <h3 className="text-lg font-bold uppercase tracking-wider origin-top-left -rotate-90 translate-y-20 whitespace-nowrap">
                CONTACT
              </h3>
            </div>
            <div className="flex flex-col space-y-1 ml-4">
              <Link href="/" className="text-green-400">
                Junglexp.in
              </Link>
              <p>Near PWD Guest house Ward no 1</p>
              <p>Pampa Puri Ranikhet Road, Ramnagar,</p>
              <p>Nainital, Uttarakhand, India</p>
              <div className="flex items-center space-x-2">
                <span>Whatsapp: +91-7428006473</span>
                <Link href="https://wa.me/917428006473">
                  <FaWhatsapp className="text-green-400" size={20} />
                </Link>
              </div>
              {/* <div className="mt-4">
                <Link
                  href="https://www.google.com/reviews"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <span className="text-[#E5C992]">★★★★★</span>
                  <span className="underline text-[#E5C992]">
                    Google Reviews
                  </span>
                </Link>
              </div> */}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Junglexp</p>
        </div>
      </div>

      <Script id="chat-widget-config" strategy="afterInteractive">
        {`
          window.ChatWidgetConfig = {
            webhook: {
              url: 'https://n8n.branofy.com/webhook/34f6f873-5839-4c5c-99e1-fa791d44711c/chat',
              route: 'general'
            },
            branding: {
              logo: 'https://ik.imagekit.io/teggaadfo/3.png',
              name: 'JungleXP AI Assistant',
              welcomeText: 'Hi 👋, how can we help?',
              responseTimeText: 'We typically respond right away'
            },
            style: {
              primaryColor: '#8b9467',
              secondaryColor: '#2e2e2e',
              position: 'right',
              backgroundColor: '#ffffff',
              fontColor: '#333333'
            }
          };
        `}
      </Script>
      <Script
        src="https://cdn.jsdelivr.net/gh/WayneSimpson/n8n-chatbot-template@ba944c3/chat-widget.js"
        strategy="lazyOnload"
      />
    </footer>
  );
};

export default Footer;
