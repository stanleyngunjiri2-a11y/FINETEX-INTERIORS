import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#171717] text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2200&q=85')",
        }}
        aria-hidden="true"
      />

      {/* Image Overlay */}
      <div
        className="absolute inset-0 bg-black/65"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container relative z-10 pt-28 pb-16">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#d0a66b]">
            FINETEX INTERIORS
          </p>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
            Transforming Spaces.
            <span className="mt-2 block text-[#d0a66b]">
              Creating Beautiful Homes.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
            We bring your interior ideas to life through quality workmanship,
            carefully selected materials, and designs tailored to your space.
            From kitchens and bathrooms to gypsum ceilings, TV cabinets, and
            wardrobes, we create interiors designed around you.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center rounded-full bg-[#b18a5a] px-7 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#8e6c43]"
            >
              Get an Estimate
            </Link>

            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition duration-300 hover:bg-white hover:text-[#171717]"
            >
              Explore Our Work
            </Link>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid max-w-3xl grid-cols-2 gap-6 border-t border-white/20 pt-7 sm:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold text-white sm:text-3xl">
              Quality
            </p>
            <p className="mt-1 text-sm text-white/60">
              Materials & Finishes
            </p>
          </div>

          <div>
            <p className="text-2xl font-semibold text-white sm:text-3xl">
              Custom
            </p>
            <p className="mt-1 text-sm text-white/60">
              Designs & Solutions
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-2xl font-semibold text-white sm:text-3xl">
              Detail
            </p>
            <p className="mt-1 text-sm text-white/60">
              Focused Workmanship
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}