"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const categories = [
  "All",
  "Kitchens",
  "Bathrooms",
  "Gypsum",
  "TV Cabinets",
  "Wardrobes",
];

const projects = [
  {
    title: "Modern Kitchen",
    category: "Kitchens",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Contemporary Kitchen",
    category: "Kitchens",
    image:
      "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Modern Bathroom",
    category: "Bathrooms",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Luxury Bathroom",
    category: "Bathrooms",
    image:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Decorative Gypsum Ceiling",
    category: "Gypsum",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Modern TV Area",
    category: "TV Cabinets",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Custom TV Cabinet",
    category: "TV Cabinets",
    image:
      "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1600&q=85",
  },
  {
    title: "Built-in Wardrobe",
    category: "Wardrobes",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=85",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-[#171717] text-white">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
            alt="Elegant interior design by FINETEX INTERIORS"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />

          <div className="container relative z-10 py-28">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d0a76a]">
                FINETEX INTERIORS
              </p>

              <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Spaces designed to make an impression.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Explore our interior design inspiration and discover the
                possibilities for your kitchen, bathroom, ceiling, TV area,
                wardrobes, and custom cabinetry.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center rounded-full bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold transition hover:bg-[#d0a76a]"
                >
                  Start Your Project
                </Link>

                <a
                  href="https://wa.me/254768176570"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold transition hover:bg-white hover:text-[#171717]"
                >
                  WhatsApp FINETEX
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Introduction */}
        <section className="bg-white py-20 sm:py-24">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  Our Gallery
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Explore the possibilities.
                </h2>
              </div>

              <p className="max-w-2xl leading-8 text-[#6b6b6b]">
                Every home is different. Our approach is to create interior
                solutions that combine your personal style with practical
                functionality and quality finishing.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-[#f7f5f0] py-8">
          <div className="container">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#171717] text-white"
                        : "border border-[#d8d1c6] bg-white text-[#555] hover:border-[#b18a5a] hover:text-[#b18a5a]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Image Gallery */}
        <section className="bg-[#f7f5f0] pb-24 sm:pb-32">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-2">
              {filteredProjects.map((project, index) => (
                <article
                  key={`${project.title}-${project.category}`}
                  className={`group relative overflow-hidden rounded-[2rem] bg-[#171717] ${
                    index === 0 ? "md:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      index === 0
                        ? "aspect-[16/8] min-h-[380px]"
                        : "aspect-[4/3] min-h-[320px]"
                    }`}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} interior design - FINETEX INTERIORS`}
                      fill
                      sizes={
                        index === 0
                          ? "(max-width: 768px) 100vw, 100vw"
                          : "(max-width: 768px) 100vw, 50vw"
                      }
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d0a76a]">
                        {project.category}
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                        {project.title}
                      </h3>

                      <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
                        Custom interior solutions created with attention to
                        detail, functionality, and quality finishing.
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Quality Section */}
        <section className="relative overflow-hidden bg-[#171717] text-white">
          <div className="container py-24 sm:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  Quality Materials
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Built with quality. Finished with care.
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-white/65">
                  At FINETEX INTERIORS, we believe beautiful interiors start
                  with quality materials and careful workmanship. Every detail
                  matters, from the initial design to the final installation.
                </p>

                <Link
                  href="/services"
                  className="mt-8 inline-flex rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition hover:bg-white hover:text-[#171717]"
                >
                  Explore Our Services
                </Link>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85"
                  alt="Quality interior finishing"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-[#f7f5f0]">
          <div className="container py-24 text-center sm:py-32">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Your Space. Your Vision.
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Let&apos;s create something beautiful together.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6b6b6b]">
              Have a design idea or renovation project in mind? Get in touch
              with FINETEX INTERIORS and let&apos;s discuss your space.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
              >
                Get an Estimate
              </Link>

              <a
                href="tel:+254768176570"
                className="inline-flex items-center justify-center rounded-full border border-[#cfc8bc] px-7 py-3.5 text-sm font-semibold transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
              >
                Call 0768 176 570
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}