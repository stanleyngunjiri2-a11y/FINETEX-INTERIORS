"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Designs", href: "/designs" },
  { name: "Estimate", href: "/estimate" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const activePage = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e5e0d8] bg-white">
      <div className="container">
        <div className="flex min-h-[80px] items-center justify-between gap-6">

          {/* =====================================================
              LOGO
          ====================================================== */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => setIsOpen(false)}
            aria-label="FINETEX INTERIORS"
          >
            <Image
              src="/images/finetex-logo.png"
              alt="FINETEX INTERIORS"
              width={180}
              height={65}
              priority
              className="h-11 w-auto object-contain sm:h-12"
            />
          </Link>

          {/* =====================================================
              DESKTOP NAVIGATION
          ====================================================== */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const active = activePage(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative rounded-full px-4 py-3 text-sm font-medium transition-all duration-200"
                  style={{
                    color: active ? "#a47d4d" : "#333333",
                    backgroundColor: active ? "#f1eadf" : "transparent",
                  }}
                >
                  {item.name}

                  {/* Active indicator */}
                  {active && (
                    <span
                      className="absolute bottom-1 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full"
                      style={{
                        backgroundColor: "#b18a5a",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* =====================================================
              PHONE
          ====================================================== */}
          <div className="hidden lg:block">
            <a
              href="tel:+254768176570"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200"
              style={{
                backgroundColor: "#171717",
                color: "#ffffff",
              }}
            >
              <Phone size={16} />
              <span>0768 176 570</span>
            </a>
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ====================================================== */}
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border lg:hidden"
            style={{
              borderColor: "#d8d1c6",
              backgroundColor: "#ffffff",
              color: "#171717",
              scrollBehavior: "smooth",
            }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* =====================================================
            MOBILE NAVIGATION
        ====================================================== */}
        {isOpen && (
          <div
            id="mobile-navigation"
            className="border-t py-5 lg:hidden"
            style={{
              borderColor: "#eeeae3",
              backgroundColor: "#ffffff",
            }}
          >
            <nav aria-label="Mobile navigation">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const active = activePage(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-xl px-4 py-3.5 text-sm font-medium"
                      style={{
                        backgroundColor: active
                          ? "#f1eadf"
                          : "transparent",
                        color: active ? "#a47d4d" : "#333333",
                      }}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* =================================================
                MOBILE PHONE
            ================================================== */}
            <a
              href="tel:+254768176570"
              className="mt-4 flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold"
              style={{
                backgroundColor: "#171717",
                color: "#ffffff",
              }}
            >
              <Phone size={17} />
              <span>Call 0768 176 570</span>
            </a>

            {/* =================================================
                MOBILE WHATSAPP
            ================================================== */}
            <a
              href="https://wa.me/254768176570"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center rounded-full border px-5 py-3.5 text-sm font-semibold"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#d8d1c6",
                color: "#333333",
              }}
            >
              WhatsApp FINETEX
            </a>
          </div>
        )}
      </div>
    </header>
  );
}