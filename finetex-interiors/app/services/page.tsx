
import Image from "next/image";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const services = [
  {
    number: "01",
    title: "Kitchen Renovations",
    description:
      "Transform your kitchen into a beautiful and functional space with custom cabinetry, practical storage solutions, modern finishes, and carefully planned layouts.",
    features: [
      "Kitchen cabinets",
      "Countertop solutions",
      "Storage solutions",
      "Modern finishes",
    ],
    designLink: "/designs/kitchens",
  },
  {
    number: "02",
    title: "Bathroom Renovations",
    description:
      "Create a comfortable and modern bathroom with carefully planned layouts, quality finishes, storage solutions, and attention to every detail.",
    features: [
      "Bathroom fittings",
      "Wall finishes",
      "Storage solutions",
      "Modern layouts",
    ],
    designLink: "/designs/bathrooms",
  },
  {
    number: "03",
    title: "Gypsum Ceilings",
    description:
      "Give your interior a refined finish with professionally designed gypsum ceilings that add character, depth, lighting options, and a modern look.",
    features: [
      "Custom ceiling designs",
      "Decorative details",
      "Lighting integration",
      "Modern finishes",
    ],
   designLink: "/designs/gypsum-ceilings",
  },
  {
    number: "04",
    title: "TV Cabinets",
    description:
      "Upgrade your entertainment area with custom TV cabinets designed to complement your interior while providing practical storage and a clean finish.",
    features: [
      "Custom sizing",
      "Media storage",
      "Cable management",
      "Modern designs",
    ],
    designLink: "/designs/tv-cabinets",
  },
  {
    number: "05",
    title: "Wardrobes",
    description:
      "Make better use of your bedroom space with custom wardrobes designed around your storage needs, available space, and preferred style.",
    features: [
      "Built-in wardrobes",
      "Custom storage",
      "Sliding wardrobes",
      "Interior organization",
    ],
    designLink: "/designs/wardrobes",
  },
  {
    number: "06",
    title: "Custom Cabinets",
    description:
      "From unique storage solutions to custom interior pieces, we create cabinetry designed specifically around your space and requirements.",
    features: [
      "Custom measurements",
      "Storage solutions",
      "Personalized designs",
      "Quality finishing",
    ],
    designLink: "/designs",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-[#171717] text-white">
          <Image
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85"
            alt="Modern interior renovation by FINETEX INTERIORS"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/65" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

          <div className="container relative z-10 py-24 sm:py-32 lg:py-36">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[#b18a5a]" />

                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d0a76a]">
                  Our Services
                </p>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                Interior solutions designed for the way you live.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                From complete room renovations to custom cabinetry, FINETEX
                INTERIORS creates practical, beautiful spaces using quality
                materials and professional workmanship.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center rounded-full !bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold !text-white transition hover:!bg-[#d0a76a]"
                  style={{
                    color: "#ffffff",
                    backgroundColor: "#b18a5a",
                  }}
                >
                  <span className="!text-white">Get an Estimate</span>
                </Link>

                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold !text-white transition hover:bg-white hover:!text-[#171717]"
                  style={{
                    color: "#ffffff",
                  }}
                >
                  <span className="!text-white">View Our Work</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SERVICES
        ====================================================== */}
        <section className="section bg-[#f7f5f0]">
          <div className="container">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                What We Do
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#171717] sm:text-5xl">
                Practical solutions for every part of your home.
              </h2>

              <p className="mt-5 leading-8 text-[#555555]">
                Explore our interior renovation and custom cabinetry services,
                designed to improve the look, functionality, and feel of your
                space.
              </p>
            </div>

            <div className="grid gap-6">
              {services.map((service) => (
                <article
                  key={service.number}
                  className="group rounded-3xl border border-[#ddd8ce] bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9 lg:p-10"
                >
                  <div className="grid gap-8 lg:grid-cols-[100px_1fr_auto] lg:items-start">
                    {/* NUMBER */}
                    <div>
                      <span className="text-sm font-semibold tracking-[0.2em] text-[#b18a5a]">
                        {service.number}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-[#171717] sm:text-3xl">
                        {service.title}
                      </h2>

                      <p className="mt-4 max-w-3xl leading-8 text-[#555555]">
                        {service.description}
                      </p>

                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 text-sm font-medium text-[#333333]"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1eadf] text-xs font-semibold text-[#b18a5a]">
                              ✓
                            </span>

                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col gap-3 lg:min-w-[180px] lg:pt-1">
                      {/* ESTIMATE BUTTON */}
                      <Link
                        href="/estimate"
                        className="inline-flex w-full items-center justify-center rounded-full !bg-[#171717] px-6 py-3 text-sm font-semibold !text-white transition-all duration-200 hover:!bg-[#b18a5a] hover:shadow-lg sm:w-auto"
                        style={{
                          color: "#ffffff",
                          backgroundColor: "#171717",
                        }}
                      >
                        <span className="!text-white">
                          Get an Estimate
                        </span>
                      </Link>

                      {/* DESIGN BUTTON */}
                      <Link
                        href={service.designLink}
                        className="inline-flex w-full items-center justify-center rounded-full border border-[#d8d1c6] bg-white px-6 py-3 text-sm font-semibold !text-[#171717] transition-all duration-200 hover:border-[#b18a5a] hover:bg-[#f7f5f0] sm:w-auto"
                        style={{
                          color: "#171717",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <span className="!text-[#171717]">
                          View Designs →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            QUALITY STATEMENT
        ====================================================== */}
        <section className="section bg-white">
          <div className="container">
            <div className="rounded-3xl bg-[#171717] px-7 py-12 text-center text-white sm:px-12 sm:py-16">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                Quality Comes First
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold !text-white sm:text-4xl">
                Quality materials. Quality workmanship. Beautiful results.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-8 !text-white/65">
                We believe every detail matters. That is why we focus on
                quality materials, thoughtful design, professional
                installation, and clean finishing across every project.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="section bg-[#f7f5f0]">
          <div className="container text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Start Your Renovation
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#171717] sm:text-5xl">
              Have a project in mind?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#555555]">
              Tell us what you would like to transform and we&apos;ll help you
              take the next step.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              {/* GET AN ESTIMATE */}
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center rounded-full !bg-[#171717] px-7 py-3.5 text-sm font-semibold !text-white transition-all duration-200 hover:!bg-[#b18a5a] hover:shadow-lg"
                style={{
                  color: "#ffffff",
                  backgroundColor: "#171717",
                }}
              >
                <span className="!text-white">
                  Get an Estimate →
                </span>
              </Link>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/254725408173"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#cfc8bc] bg-white px-7 py-3.5 text-sm font-semibold !text-[#171717] transition-all duration-200 hover:border-[#171717] hover:bg-[#171717] hover:!text-white"
                style={{
                  color: "#171717",
                  backgroundColor: "#ffffff",
                }}
              >
                <span className="!text-[#171717]">
                  WhatsApp FINETEX
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

