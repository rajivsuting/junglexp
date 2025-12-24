import Image from "next/image";
import Link from "next/link";
import React from "react";

import TopBar from "./TopBar";

const parkName = "jim-corbet-national-park";
const navLinks = [
  { name: "Home", href: "/" },
  // {
  //   name: "Stays",
  //   href: `/parks/${parkName}/stays?stay-type=resort`,
  // },
  {
    name: "Activities & Safaris",
    href: `/parks/${parkName}/activities`,
  },
  {
    name: "Blogs",
    href: `/blogs`,
  },
  { name: "Contact Us", href: "/contact-us" },
];

export default async function Header({
  transparent = true,
}: {
  transparent?: boolean;
}) {
  return (
    <>
      <input type="checkbox" id="menu-toggle" className="menu-toggle" />

      <header className="relative">
        <TopBar />

        {/* Main Header with background image */}
        <div
          className={`bg-cover w-full z-50 bg-center h-[100px] ${transparent ? "absolute" : "bg-[#2A2B20]"}`}
          // style={{ backgroundImage: "url(/header-bg.jpg)" }}
        >
          {/* Overlay */}

          {/* Header Content */}
          <div className="relative z-10 h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left: Logo/Title Section */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white tracking-wider mb-1">
                <Image
                  src="/LogoWhite.svg"
                  alt="Junglexp Logo"
                  width={150}
                  height={40}
                />
              </h1>
            </Link>
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
            <div className="hidden xl:block px-6 flex-shrink-0">
              {/* <button className="px-6 py-2 border-2 border-white text-white text-base font-medium hover:bg-white hover:text-black transition-colors">
                Start Planning
              </button> */}
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
        {/* <button className="px-6 mx-6 mt-6 py-2 border-2 border-white text-white text-base font-medium hover:bg-white hover:text-black transition-colors">
          Start Planning
        </button> */}
      </div>
    </>
  );
}
