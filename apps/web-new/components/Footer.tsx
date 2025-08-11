import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#3C553D] text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">eTroupers</h2>
            <p className="text-sm mb-4">
              Specialists in Jim Corbett National Park
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="hover:text-gray-300">
                <FaFacebook size={24} />
              </Link>
              <Link
                href="https://instagram.com"
                className="hover:text-gray-300"
              >
                <FaInstagram size={24} />
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
              <Link href="/info" className="hover:text-gray-300">
                Useful Info
              </Link>
              <Link href="/specials" className="hover:text-gray-300">
                Specials
              </Link>
              <Link href="/directions" className="hover:text-gray-300">
                Directions
              </Link>
              <Link href="/terms" className="hover:text-gray-300">
                Terms & Conditions
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
              <p>Victoria Falls, Zimbabwe</p>
              <p>info@hwangesafaris.com</p>
              <p>Phone: +27 73 168 0048</p>
              <div className="flex items-center space-x-2">
                <span>Whatsapp: +27 82 475 3496</span>
                <FaWhatsapp className="text-green-400" size={20} />
              </div>
              <div className="mt-4">
                <Link
                  href="https://www.google.com/reviews"
                  className="flex items-center space-x-2 hover:text-gray-300"
                >
                  <span className="text-[#E5C992]">★★★★★</span>
                  <span className="underline text-[#E5C992]">
                    Google Reviews
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-600 text-sm">
          <p>© {new Date().getFullYear()} eTroupers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
