const reasons = [
  {
    number: "01",
    title: "Quality Materials",
    description:
      "We believe great interiors start with quality. We carefully select materials that deliver durability, functionality, and a beautiful finish.",
  },
  {
    number: "02",
    title: "Professional Workmanship",
    description:
      "Our work focuses on precision, clean finishing, and attention to the small details that make a big difference.",
  },
  {
    number: "03",
    title: "Custom Designs",
    description:
      "Every home is different. We create solutions around your space, preferences, lifestyle, and project requirements.",
  },
  {
    number: "04",
    title: "Client Satisfaction",
    description:
      "Your vision matters. We work closely with you throughout the project to ensure the final result meets your expectations.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className="section bg-[#f7f5f0]"
      aria-labelledby="why-choose-us-heading"
    >
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Introduction */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Why FINETEX
            </p>

            <h2
              id="why-choose-us-heading"
              className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              A good space deserves
              <span className="block text-[#b18a5a]">
                great workmanship.
              </span>
            </h2>

            <p className="mt-6 max-w-lg leading-8 text-[#6b6b6b]">
              Choosing the right team for your renovation matters. At FINETEX
              INTERIORS, we combine thoughtful design, quality materials, and
              professional workmanship to create spaces that feel right for
              you.
            </p>

            <p className="mt-4 max-w-lg leading-8 text-[#6b6b6b]">
              Whether you are upgrading one room or transforming your entire
              home, we approach every project with care and attention to
              detail.
            </p>
          </div>

          {/* Reasons */}
          <div className="grid gap-px overflow-hidden rounded-3xl border border-[#ddd8ce] bg-[#ddd8ce] sm:grid-cols-2">
            {reasons.map((reason) => (
              <article
                key={reason.number}
                className="bg-white p-7 sm:p-8"
              >
                <span className="text-sm font-semibold tracking-[0.15em] text-[#b18a5a]">
                  {reason.number}
                </span>

                <h3 className="mt-8 text-xl font-semibold">
                  {reason.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#6b6b6b]">
                  {reason.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Trust Statement */}
        <div className="mt-12 rounded-3xl bg-[#171717] px-7 py-10 text-center text-white sm:px-10">
          <p className="mx-auto max-w-3xl text-xl font-medium leading-8 sm:text-2xl">
            &quot;You made a good choice choosing FINETEX INTERIORS for your
            project.&quot;
          </p>

          <p className="mt-4 text-sm text-white/55">
            Quality materials • Professional workmanship • Designs made for
            you
          </p>
        </div>
      </div>
    </section>
  );
}