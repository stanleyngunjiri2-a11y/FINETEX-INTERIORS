import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import {
  ArrowRight,
  Bath,
  Check,
  Home as HomeIcon,
  Layers3,
  Sofa,
} from "lucide-react";

const featuredServices = [
  {
    icon: <Sofa size={22} strokeWidth={1.7} />,
    title: "Kitchen Renovations",
    description:
      "Functional, modern kitchens designed around your space, lifestyle, and storage needs.",
  },
  {
    icon: <Bath size={22} strokeWidth={1.7} />,
    title: "Bathroom Renovations",
    description:
      "Comfortable and refined bathrooms with practical layouts and quality finishes.",
  },
  {
    icon: <Layers3 size={22} strokeWidth={1.7} />,
    title: "Gypsum Ceilings",
    description:
      "Elegant ceiling designs that add character, depth, and modern lighting options.",
  },
  {
    icon: <HomeIcon size={22} strokeWidth={1.7} />,
    title: "Custom Cabinetry",
    description:
      "Tailored wardrobes, TV units, and cabinets designed specifically for your space.",
  },
];

const trustPoints = [
  "Quality Materials",
  "Professional Workmanship",
  "Custom Interior Solutions",
  "Attention to Detail",
];

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="relative min-h-[720px] overflow-hidden text-white">
          <Image
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85"
            alt="Modern interior renovation and interior design by FINETEX INTERIORS in Nairobi"
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />

          {/* Image overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
          />

          <div
            className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20"
            aria-hidden="true"
          />

          <div className="container relative z-10 flex min-h-[720px] items-center py-24">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <span
                  className="h-px w-12 bg-[#d0a76a]"
                  aria-hidden="true"
                />

                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#d0a76a] sm:text-sm">
                  FINETEX INTERIORS
                </p>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                Quality interior solutions for{" "}
                <span className="text-[#d0a76a]">modern spaces.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                From kitchens and bathrooms to custom wardrobes, TV cabinets,
                and gypsum ceilings, we transform everyday spaces into
                beautiful, functional interiors.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#d0a76a]"
                >
                  Get a Free Estimate
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>

                <a
                  href="https://wa.me/254725408173"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with FINETEX INTERIORS on WhatsApp"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-[#171717]"
                >
                  Chat on WhatsApp
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/65">
                <span>Kitchen</span>
                <span>Bathroom</span>
                <span>Gypsum</span>
                <span>Wardrobes</span>
                <span>TV Cabinets</span>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section
          className="border-b border-[#e5e1d9] bg-white"
          aria-label="Why choose FINETEX INTERIORS"
        >
          <div className="container">
            <div className="grid divide-y divide-[#e5e1d9] py-2 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              {trustPoints.map((point, index) => (
                <div
                  key={point}
                  className={`flex items-center gap-3 px-5 py-5 ${
                    index === 0 ? "lg:pl-0" : ""
                  }`}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1eadf] text-[#b18a5a]">
                    <Check size={15} strokeWidth={2.2} aria-hidden="true" />
                  </span>

                  <span className="text-sm font-medium text-[#333333]">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  About FINETEX
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Thoughtful interiors. Practical living.
                </h2>
              </div>

              <div className="max-w-2xl lg:justify-self-end">
                <p className="leading-8 text-[#6b6b6b]">
                  FINETEX INTERIORS transforms homes through carefully planned
                  renovations, custom cabinetry, and modern interior
                  solutions.
                </p>

                <p className="mt-5 leading-8 text-[#6b6b6b]">
                  From kitchens and bathrooms to wardrobes, TV cabinets, and
                  gypsum ceilings, we bring together thoughtful design,
                  quality materials, and professional workmanship.
                </p>

                <Link
                  href="/about"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a]"
                >
                  Learn more about us
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="section bg-[#f7f5f0]">
          <div className="container">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  What We Do
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Spaces designed with purpose.
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-[#6b6b6b]">
                  Professional interior renovation and custom solutions
                  designed to make your home more beautiful and functional.
                </p>
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a]"
              >
                View all services
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredServices.map((service) => (
                <article
                  key={service.title}
                  className="rounded-3xl border border-[#ddd8ce] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-[#b18a5a]/40 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1eadf] text-[#b18a5a]">
                    {service.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#6b6b6b]">
                    {service.description}
                  </p>

                  <Link
                    href="/services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#171717] transition hover:text-[#b18a5a]"
                  >
                    Learn more
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <FeaturedProjects />

        {/* WHY FINETEX */}
        <section className="section bg-white">
          <div className="container">
            <div className="overflow-hidden rounded-3xl bg-[#171717] px-7 py-12 text-white sm:px-12 sm:py-16">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                    Why FINETEX
                  </p>

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Built around your space.
                  </h2>

                  <p className="mt-5 max-w-xl leading-8 text-white/65">
                    Every project deserves attention to detail, clear
                    communication, and a finish that feels right.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    "Thoughtful design",
                    "Quality materials",
                    "Professional workmanship",
                    "Attention to detail",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 border-b border-white/10 pb-4"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#b18a5a]/15 text-[#b18a5a]">
                        <Check size={15} aria-hidden="true" />
                      </span>

                      <span className="text-sm font-medium text-white/85">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="section bg-[#f7f5f0]">
          <div className="container text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Your Space. Your Vision.
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Ready to transform your space?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6b6b6b]">
              Tell us what you have in mind and let&apos;s create an interior
              that works beautifully for you.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
              >
                Get an Estimate
                <ArrowRight size={17} aria-hidden="true" />
              </Link>

              <a
                href="https://wa.me/254725408173"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with FINETEX INTERIORS on WhatsApp"
                className="inline-flex items-center justify-center rounded-full border border-[#cfc8bc] px-7 py-3.5 text-sm font-semibold text-[#171717] transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
              >
                WhatsApp FINETEX
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}