import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Kitchen Renovations",
    description:
      "Create a kitchen that combines practical storage, modern design, quality materials, and a finish that fits your home.",
    href: "/services/kitchen",
  },
  {
    number: "02",
    title: "Bathroom Renovations",
    description:
      "Transform your bathroom with carefully planned layouts, quality finishes, modern fittings, and a clean professional look.",
    href: "/services/bathroom",
  },
  {
    number: "03",
    title: "Gypsum Ceilings",
    description:
      "Enhance your interior with modern gypsum ceiling designs, elegant details, lighting solutions, and professional finishing.",
    href: "/services/gypsum",
  },
  {
    number: "04",
    title: "TV Cabinets",
    description:
      "Give your entertainment area a refined appearance with custom TV cabinets designed around your space and storage needs.",
    href: "/services/tv-cabinets",
  },
  {
    number: "05",
    title: "Wardrobes & Cabinets",
    description:
      "Maximize your storage with custom wardrobes and cabinets designed for your room, lifestyle, and preferred finish.",
    href: "/services/wardrobes",
  },
  {
    number: "06",
    title: "Custom Interior Designs",
    description:
      "Have something specific in mind? We work with your ideas to create personalized interior solutions made for your space.",
    href: "/services/custom-interiors",
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="section bg-[#f7f5f0]"
      aria-labelledby="services-heading"
    >
      <div className="container">
        {/* Section Heading */}
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              What We Do
            </p>

            <h2
              id="services-heading"
              className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              Designed for your space.
              <span className="block text-[#b18a5a]">
                Built around your needs.
              </span>
            </h2>
          </div>

          <p className="max-w-xl leading-8 text-[#6b6b6b] lg:ml-auto">
            From individual rooms to complete interior transformations,
            FINETEX INTERIORS delivers thoughtful designs, quality materials,
            and professional workmanship tailored to every project.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-[#ddd8ce] bg-[#ddd8ce] sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.number}
              className="group relative bg-white p-7 transition duration-300 hover:bg-[#171717] hover:text-white sm:p-8"
            >
              {/* Number */}
              <span className="text-sm font-semibold tracking-[0.15em] text-[#b18a5a]">
                {service.number}
              </span>

              {/* Service title */}
              <h3 className="mt-12 text-xl font-semibold tracking-tight sm:text-2xl">
                {service.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-sm leading-7 text-[#6b6b6b] transition group-hover:text-white/65">
                {service.description}
              </p>

              {/* Link */}
              <Link
                href={service.href}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#8e6c43] transition group-hover:text-[#d0a66b]"
              >
                Explore service
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col gap-5 rounded-3xl bg-[#171717] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xl font-semibold sm:text-2xl">
              Have a project in mind?
            </p>

            <p className="mt-2 max-w-xl text-sm leading-7 text-white/60">
              Tell us what you would like to transform and we&apos;ll help you
              explore the right solution for your space.
            </p>
          </div>

          <Link
            href="/estimate"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#b18a5a] px-6 py-3.5 text-sm font-semibold transition hover:bg-[#8e6c43]"
          >
            Get an Estimate
          </Link>
        </div>
      </div>
    </section>
  );
}