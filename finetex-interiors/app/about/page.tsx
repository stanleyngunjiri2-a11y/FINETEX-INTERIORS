import Image from "next/image";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const services = [
  {
    title: "Kitchens",
    description:
      "Functional and modern kitchen spaces designed around your lifestyle, storage needs, and preferred style.",
  },
  {
    title: "Bathrooms",
    description:
      "Contemporary bathroom solutions that combine practical layouts, quality finishes, and a clean modern feel.",
  },
  {
    title: "Gypsum Ceilings",
    description:
      "Elegant gypsum ceiling designs with thoughtful lighting details that add character to your space.",
  },
  {
    title: "TV Cabinets",
    description:
      "Custom TV walls and entertainment units designed to improve both the appearance and functionality of your living space.",
  },
  {
    title: "Wardrobes",
    description:
      "Practical and stylish wardrobe solutions created to maximize storage while complementing your interior.",
  },
];

const values = [
  {
    number: "01",
    title: "Quality",
    description:
      "We focus on quality workmanship, carefully selected finishes, and solutions designed to last.",
  },
  {
    number: "02",
    title: "Functionality",
    description:
      "Good interiors should not only look beautiful. They should work naturally for the people using them.",
  },
  {
    number: "03",
    title: "Personalization",
    description:
      "Every space is different, so we work around your needs, preferences, measurements, and vision.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-[#171717] text-white">
          <Image
            src="/images/gallery/kitchens/IMG-20260921-WA0001.jpg"
            alt="FINETEX INTERIORS interior project"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />

          <div className="container relative z-10 py-24">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d0a76a]">
                About FINETEX INTERIORS
              </p>

              <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Spaces designed around the way you live.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                We create beautiful, functional interior spaces that reflect
                your style, improve everyday living, and make your space feel
                truly yours.
              </p>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}
        <section className="bg-white py-20 sm:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  Who We Are
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Transforming ordinary spaces into places you are proud to
                  call home.
                </h2>
              </div>

              <div className="space-y-5 leading-8 text-[#6b6b6b]">
                <p>
                  FINETEX INTERIORS is an interior solutions company focused on
                  transforming residential and commercial spaces through
                  thoughtful design, quality workmanship, and practical
                  solutions.
                </p>

                <p>
                  From kitchens and bathrooms to gypsum ceilings, TV cabinets,
                  and wardrobes, we help clients turn their ideas into
                  finished spaces that are both beautiful and functional.
                </p>

                <p>
                  Our approach is simple: understand what you need, develop a
                  solution around your space, and deliver an interior that
                  feels personal, practical, and well finished.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section className="bg-[#f7f5f0] py-20 sm:py-28">
          <div className="container">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                What We Do
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                Interior solutions for every important space.
              </h2>

              <p className="mt-5 leading-8 text-[#6b6b6b]">
                Whether you are renovating one room or transforming an entire
                property, our services are designed to bring together style,
                functionality, and quality.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="rounded-[1.5rem] bg-white p-7 shadow-sm"
                >
                  <span className="text-sm font-semibold text-[#b18a5a]">
                    0{index + 1}
                  </span>

                  <h3 className="mt-4 text-xl font-semibold">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-[#6b6b6b]">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APPROACH */}
        <section className="bg-white py-20 sm:py-28">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  Our Approach
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Good design should look good and work well.
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-[#6b6b6b]">
                  We believe the best interiors balance appearance with
                  everyday practicality. That means considering how you use
                  your space, how much storage you need, the finishes you
                  prefer, and how everything comes together as one design.
                </p>

                <Link
                  href="/estimate"
                  className="mt-8 inline-flex rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
                >
                  Get a Free Estimate
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {values.map((value) => (
                  <div
                    key={value.number}
                    className="rounded-[1.5rem] border border-[#e6e1d8] p-6"
                  >
                    <span className="text-sm font-semibold text-[#b18a5a]">
                      {value.number}
                    </span>

                    <h3 className="mt-3 text-xl font-semibold">
                      {value.title}
                    </h3>

                    <p className="mt-2 leading-7 text-[#6b6b6b]">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#171717] text-white">
          <div className="container py-20 text-center sm:py-28">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d0a76a]">
              Start Your Transformation
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Ready to transform your space?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/65">
              Tell us what you have in mind and let&apos;s create an interior
              that works for you.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/estimate"
                className="inline-flex rounded-full bg-[#b18a5a] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#d0a76a]"
              >
                Get Your Estimate
              </Link>

              <a
                href="https://wa.me/254725408173"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-white/25 px-8 py-4 text-sm font-semibold transition hover:bg-white hover:text-[#171717]"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}