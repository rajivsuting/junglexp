import Link from "next/link";
import React from "react";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Lodges", href: "#" },
  { name: "Mobile Safaris", href: "#" },
  { name: "Day Trip", href: "#" },
  { name: "Useful Info", href: "#" },
  { name: "Contact Us", href: "#" },
];

export default function Header() {
  return (
    <>
      <input type="checkbox" id="menu-toggle" className="menu-toggle" />

      <header className="relative">
        {/* Top Bar */}
        <div className="bg-[#8B9467] text-white text-center py-3 text-xs md:text-xs tracking-[0.3em] font-medium">
          * YOUR NUMBER 1 GUIDE TO THE BEST EXPERIENCES IN JIM CORBETT NATIONAL
          PARK *
        </div>

        {/* Main Header with background image */}
        <div
          className="bg-cover w-full absolute z-50 bg-center h-[100px]"
          // style={{ backgroundImage: "url(/header-bg.jpg)" }}
        >
          {/* Overlay */}

          {/* Header Content */}
          <div className="relative z-10 h-full flex items-center justify-between px-8">
            {/* Left: Logo/Title Section */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white tracking-wider mb-1">
                eTroupers
              </h1>
              <p className="text-sm text-white font-light">
                Specialists in Jim Corbett National Park
              </p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white text-base font-medium hover:text-gray-200 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Hamburger Menu Button */}
            <label htmlFor="menu-toggle" className="menu-button">
              <span></span>
              <span></span>
              <span></span>
            </label>

            {/* Right: Start Planning Button */}
            <div className="hidden xl:block flex-shrink-0">
              <button className="px-6 py-2 border-2 border-white text-white text-base font-medium hover:bg-white hover:text-black transition-colors">
                Start Planning
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Overlay */}
      <label htmlFor="menu-toggle" className="menu-overlay"></label>

      {/* Mobile Menu */}
      <div className="mobile-menu">
        {/* Close Button */}
        <div className="flex justify-end px-6 pt-6">
          <label
            htmlFor="menu-toggle"
            className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </label>
        </div>

        <nav className="flex flex-col pt-24">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-white px-6 text-lg font-medium py-3 border-b border-white/20 hover:bg-white/10 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <button className="px-6 mx-6 mt-6 py-2 border-2 border-white text-white text-base font-medium hover:bg-white hover:text-black transition-colors">
          Start Planning
        </button>
      </div>
    </>
  );
}
