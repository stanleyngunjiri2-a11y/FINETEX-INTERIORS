
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
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
            alt="Beautiful modern interior by FINETEX INTERIORS"
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
                  Contact FINETEX
                </p>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                Let&apos;s talk about your space.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Have a renovation project in mind? Get in touch with FINETEX
                INTERIORS and let&apos;s discuss how we can transform your
                space.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://wa.me/254725408173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d0a76a]"
                >
                  WhatsApp Us
                </a>

                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center rounded-full border border-white/35 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#171717]"
                >
                  Get an Estimate
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT INFORMATION
        ====================================================== */}
        <section className="section bg-[#f7f5f0]">
          <div className="container">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Phone */}
              <a
                href="tel:+254725408173"
                className="group rounded-3xl border border-[#ddd8ce] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1eadf] text-[#b18a5a]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>

                <h2 className="mt-6 text-xl font-semibold text-[#171717]">
                  Call Us
                </h2>

                <p className="mt-3 text-[#6b6b6b]">
                  0768 176 570
                </p>

                <span className="mt-5 inline-flex text-sm font-semibold text-[#b18a5a] transition group-hover:text-[#171717]">
                  Call FINETEX →
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/254725408173"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-3xl border border-[#ddd8ce] bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f1eadf] text-[#b18a5a]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-3.84-.92L3 20l.94-4.76A8.5 8.5 0 1 1 21 11.5z" />
                    <path d="M8.5 9.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2.1.4-.1.6l-.5.6c.5.9 1.2 1.6 2.1 2.1l.6-.5c.2-.2.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.4.4-2.5-.1-1.1-.5-2.1-1.2-3-2.1-.9-.9-1.6-1.9-2.1-3-.5-1.1-.3-2.1-.1-2.5z" />
                  </svg>
                </div>

                <h2 className="mt-6 text-xl font-semibold text-[#171717]">
                  WhatsApp
                </h2>

                <p className="mt-3 text-[#6b6b6b]">
                  Chat with us directly about your project.
                </p>

                <span className="mt-5 inline-flex text-sm font-semibold text-[#b18a5a] transition group-hover:text-[#171717]">
                  Start a conversation →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================
            CONTACT / PROJECT SECTION
        ====================================================== */}
        <section className="section bg-white">
          <div className="container">
            <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              {/* Left */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  Start A Conversation
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Tell us what you&apos;re planning.
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-[#6b6b6b]">
                  Whether you&apos;re planning a kitchen renovation, bathroom
                  upgrade, custom wardrobes, gypsum ceiling, TV cabinet, or a
                  complete interior transformation, we&apos;d love to hear
                  about it.
                </p>

                <div className="mt-8 rounded-3xl bg-[#f7f5f0] p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
                    Prefer WhatsApp?
                  </p>

                  <p className="mt-3 leading-7 text-[#6b6b6b]">
                    Send us a message with a brief description of your project
                    and any inspiration images you have.
                  </p>

                  <a
                    href="https://wa.me/254725408173"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex rounded-full bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-3xl border border-[#ddd8ce] bg-[#f7f5f0] p-7 sm:p-9">
                <h2 className="text-2xl font-semibold text-[#171717]">
                  Send an enquiry
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6b6b6b]">
                  Tell us a little about what you would like to transform.
                </p>

                <form className="mt-7 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-[#333333]"
                      >
                        Your Name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        className="mt-2 w-full rounded-xl border border-[#d8d1c6] bg-white px-4 py-3 text-sm text-[#171717] outline-none transition placeholder:text-[#999] focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/15"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="text-sm font-medium text-[#333333]"
                      >
                        Phone Number
                      </label>

                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="07XX XXX XXX"
                        className="mt-2 w-full rounded-xl border border-[#d8d1c6] bg-white px-4 py-3 text-sm text-[#171717] outline-none transition placeholder:text-[#999] focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/15"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="service"
                      className="text-sm font-medium text-[#333333]"
                    >
                      Service
                    </label>

                    <select
                      id="service"
                      name="service"
                      defaultValue=""
                      className="mt-2 w-full rounded-xl border border-[#d8d1c6] bg-white px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/15"
                    >
                      <option value="" disabled>
                        Select a service
                      </option>
                      <option value="kitchen">Kitchen Renovations</option>
                      <option value="bathroom">Bathroom Renovations</option>
                      <option value="gypsum">Gypsum Ceilings</option>
                      <option value="tv-cabinets">TV Cabinets</option>
                      <option value="wardrobes">Wardrobes</option>
                      <option value="custom-cabinets">Custom Cabinets</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-[#333333]"
                    >
                      Project Details
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Tell us about your project..."
                      className="mt-2 w-full resize-none rounded-xl border border-[#d8d1c6] bg-white px-4 py-3 text-sm text-[#171717] outline-none transition placeholder:text-[#999] focus:border-[#b18a5a] focus:ring-2 focus:ring-[#b18a5a]/15"
                    />
                  </div>

                  <Link
                    href="/estimate"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
                  >
                    Continue to Estimate
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="bg-[#171717] text-white">
          <div className="container py-20 text-center sm:py-28">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Ready To Start?
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Let&apos;s create a space you&apos;ll love.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/65">
              Take the first step by telling us about your project or
              requesting an estimate.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center rounded-full bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d0a76a]"
              >
                Get an Estimate
              </Link>

              <a
                href="https://wa.me/254725408173"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#171717]"
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

