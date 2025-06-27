import { Facebook, Heart, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Resort Information */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-4 text-amber-400">eTroupers</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Experience luxury and tranquility at our exclusive beachfront
              resort. Where every moment becomes a cherished memory in paradise.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="p-2 border-gray-700 hover:bg-gray-800"
              >
                <Facebook size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 border-gray-700 hover:bg-gray-800"
              >
                <Instagram size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 border-gray-700 hover:bg-gray-800"
              >
                <Twitter size={16} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="p-2 border-gray-700 hover:bg-gray-800"
              >
                <Linkedin size={16} />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Accommodations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Dining
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Spa & Wellness
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Activities
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Guest Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Guest Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Reservations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Concierge
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Transportation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Room Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  Housekeeping
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin
                  size={16}
                  className="text-amber-400 mt-1 flex-shrink-0"
                />
                <div className="text-gray-300">
                  123 Paradise Beach Drive
                  <br />
                  Tropical Island, TI 12345
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-amber-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16} className="text-amber-400" />
                <span className="text-gray-300">info@paradiseresort.com</span>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-medium mb-2">Office Hours</h5>
              <div className="text-sm text-gray-300">
                <p>Mon - Fri: 8:00 AM - 10:00 PM</p>
                <p>Sat - Sun: 9:00 AM - 9:00 PM</p>
                <p className="text-amber-400 mt-1">24/7 Emergency Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © 2025 eTroupers. All rights reserved.
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-400">
              Made with <Heart size={14} className="text-red-500 mx-1" /> for
              unforgettable experiences
            </div>

            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
