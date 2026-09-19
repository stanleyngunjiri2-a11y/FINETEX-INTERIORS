import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  Check,
  Compass,
  Layers3,
  Sparkles,
} from "lucide-react";

const values = [
  {
    icon: <Compass size={22} strokeWidth={1.7} />,
    title: "Thoughtful Design",
    description:
      "We consider how a space looks, feels, and functions before bringing the design to life.",
  },
  {
    icon: <Layers3 size={22} strokeWidth={1.7} />,
    title: "Quality Workmanship",
    description:
      "We pay attention to details, finishes, measurements, and installation that make a project complete.",
  },
  {
    icon: <Sparkles size={22} strokeWidth={1.7} />,
    title: "Beautiful Results",
    description:
      "Our goal is to create interiors that feel refined, practical, comfortable, and built around you.",
  },
];

const reasons = [
  "Personalized interior solutions",
  "Quality materials and finishes",
  "Attention to detail",
  "Practical and functional designs",
  "Professional workmanship",
  "Clear communication throughout the project",
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-[#171717] text-white">
          <Image
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85"
            alt="Elegant modern interior designed by FINETEX INTERIORS"
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
                  About FINETEX
                </p>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                Creating spaces that feel{" "}
                <span className="text-[#d0a76a]">like home.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                FINETEX INTERIORS helps homeowners transform their spaces
                through thoughtful renovation, custom cabinetry, and practical
                interior solutions.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d0a76a]"
                >
                  Explore Our Services
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#171717]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  Who We Are
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Interiors designed around real life.
                </h2>
              </div>

              <div className="max-w-3xl">
                <p className="text-lg leading-8 text-[#333333]">
                  FINETEX INTERIORS is an interior renovation and custom
                  cabinetry company focused on helping homeowners create
                  spaces that are both beautiful and practical.
                </p>

                <p className="mt-6 leading-8 text-[#6b6b6b]">
                  We work across different areas of the home, including
                  kitchens, bathrooms, wardrobes, TV cabinets, gypsum
                  ceilings, and custom storage solutions. Every project starts
                  with understanding the space and what the client wants to
                  achieve.
                </p>

                <p className="mt-6 leading-8 text-[#6b6b6b]">
                  Our approach is simple: thoughtful planning, quality
                  materials, careful workmanship, and attention to the details
                  that make an interior feel complete.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="section bg-[#f7f5f0]">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                Our Approach
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Simple ideas. Thoughtful execution.
              </h2>

              <p className="mt-5 leading-8 text-[#6b6b6b]">
                We believe a successful renovation doesn't have to be
                complicated. Good planning and attention to detail can make
                all the difference.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {values.map((value) => (
                <article
                  key={value.title}
                  className="rounded-3xl border border-[#ddd8ce] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-[#b18a5a]/40 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1eadf] text-[#b18a5a]">
                    {value.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#6b6b6b]">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section bg-white">
          <div className="container">
            <div className="rounded-3xl bg-[#171717] px-7 py-12 text-white sm:px-12 sm:py-16">
              <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                    Why Choose FINETEX
                  </p>

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                    We care about the details.
                  </h2>

                  <p className="mt-5 max-w-xl leading-8 text-white/65">
                    From the first conversation to the final finishing touch,
                    our focus is on creating an interior that works for your
                    space and reflects your vision.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {reasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-center gap-3 border-b border-white/10 pb-4"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#b18a5a]/15 text-[#b18a5a]">
                        <Check size={15} strokeWidth={2.5} />
                      </span>

                      <span className="text-sm font-medium text-white/85">
                        {reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-[#f7f5f0]">
          <div className="container text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Let's Work Together
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Your space deserves a thoughtful transformation.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6b6b6b]">
              Whether you are planning a complete renovation or need a custom
              interior solution, we'd love to hear about your project.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
              >
                Get an Estimate
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[#cfc8bc] px-7 py-3.5 text-sm font-semibold text-[#171717] transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}