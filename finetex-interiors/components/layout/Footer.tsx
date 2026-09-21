import Link from "next/link";
import { MapPin, Phone } from "lucide-react";

const services = [
  { name: "Kitchen Renovations", href: "/#kitchen" },
  { name: "Bathroom Renovations", href: "/#bathroom" },
  { name: "Gypsum Ceilings", href: "/#gypsum" },
  { name: "TV Cabinets", href: "/#tv-cabinets" },
  { name: "Wardrobes & Cabinets", href: "/#wardrobes" },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/#services" },
  { name: "Gallery", href: "/gallery" },
  { name: "Designs", href: "/designs" },
  { name: "Estimate", href: "/estimate" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr]">

          {/* Company */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
              aria-label="FINETEX INTERIORS home"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#b18a5a] text-sm font-bold text-[#b18a5a]">
                FI
              </span>

              <span>
                <span className="block text-sm font-bold tracking-[0.18em]">
                  FINETEX
                </span>

                <span className="block text-[10px] font-medium tracking-[0.3em] text-[#b18a5a]">
                  INTERIORS
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              Transforming homes through thoughtful interior design, quality
              materials, and professional workmanship. Your space deserves
              the FINETEX touch.
            </p>

            {/* Social Media */}
            <div className="mt-7 flex items-center gap-3">

              {/* Instagram */}
              <a
                href="https://www.instagram.com/finetex_interiors?utm_source=ig_web_button_share_sheet&igsi=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FINETEX INTERIORS on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-[#b18a5a] hover:text-[#b18a5a]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/100087753003652/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FINETEX INTERIORS on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-[#b18a5a] hover:text-[#b18a5a]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a19 19 0 0 0-2.4-.2c-2.4 0-4 1.5-4 4.1V10H8v3h2.4v8h3.1Z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/254725408173"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact FINETEX INTERIORS on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-[#b18a5a] hover:text-[#b18a5a]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.6-4A8 8 0 1 1 20 11.5Z" />
                  <path d="M9 8.5c.2-.4.4-.4.7-.4h.4c.2 0 .3.1.4.4l.7 1.5c.1.2.1.4-.1.6l-.5.6c.5 1 1.3 1.7 2.3 2.2l.6-.5c.2-.2.4-.2.6-.1l1.4.7c.3.1.4.3.3.6-.2.8-.8 1.2-1.5 1.2-1.1 0-2.6-.8-3.9-2-1.4-1.3-2.3-2.8-2.4-3.9-.1-.4.2-.7.4-.9Z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@finetexinteriors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="FINETEX INTERIORS on TikTok"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/65 transition hover:border-[#b18a5a] hover:text-[#b18a5a]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M15.7 4c.3 1.8 1.3 3 3.3 3.2v2.8a7 7 0 0 1-3.3-1v5.8a5.2 5.2 0 1 1-4.5-5.1v2.9a2.3 2.3 0 1 0 1.7 2.2V4h2.8Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
              Quick Links
            </h2>

            <nav className="mt-5" aria-label="Footer navigation">
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
              Our Services
            </h2>

            <nav className="mt-5" aria-label="Footer services">
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="text-sm text-white/55 transition hover:text-white"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
              Contact Us
            </h2>

            <div className="mt-5 space-y-4">
              <a
                href="tel:+254725408173"
                className="flex items-start gap-3 text-sm text-white/55 transition hover:text-white"
              >
                <Phone
                  size={18}
                  className="mt-0.5 shrink-0 text-[#b18a5a]"
                />
                <span>+254 725 408 173</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-white/55">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#b18a5a]"
                />
                <span>Nairobi, Kenya</span>
              </div>
            </div>

            <Link
              href="/estimate"
              className="mt-7 inline-flex rounded-full bg-[#b18a5a] px-5 py-3 text-sm font-semibold transition hover:bg-[#8e6c43]"
            >
              Request an Estimate
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} FINETEX INTERIORS. All rights
            reserved.
          </p>

          <div className="flex gap-5">
            <Link
              href="/privacy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}