import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    title: "Modern Kitchen",
    category: "Kitchen Renovation",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Contemporary Living Space",
    category: "Interior Design",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85",
  },
  {
    title: "Elegant Bedroom",
    category: "Wardrobe & Interior",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
  },
];

export default function FeaturedProjects() {
  return (
    <section
      className="section bg-white"
      aria-labelledby="featured-projects-heading"
    >
      <div className="container">
        {/* Section heading */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Our Work
            </p>

            <h2
              id="featured-projects-heading"
              className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
            >
              Spaces we&apos;ve transformed.
            </h2>

            <p className="mt-4 leading-7 text-[#6b6b6b]">
              Explore a selection of interior spaces designed with attention
              to detail, quality materials, and practical functionality.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#8e6c43] transition hover:text-[#b18a5a]"
          >
            View full gallery
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Projects */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-3xl bg-[#f7f5f0]"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={project.image}
                  alt={`${project.title} - ${project.category}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                {/* Project information */}
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d0a66b]">
                    {project.category}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    {project.title}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Gallery button */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full border border-[#cfc8bc] px-7 py-3.5 text-sm font-semibold transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
          >
            Explore All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}