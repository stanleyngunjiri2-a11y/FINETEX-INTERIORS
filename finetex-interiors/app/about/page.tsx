"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import {
  kitchenDesigns,
  bathroomDesigns,
  gypsumDesigns,
  tvCabinetDesigns,
  wardrobeDesigns,
} from "@/lib/designs";

const categories = [
  "All",
  "Kitchens",
  "Bathrooms",
  "Gypsum Ceilings",
  "TV Cabinets",
  "Wardrobes",
];

const designCategories = [
  {
    title: "Kitchen Designs",
    category: "Kitchens",
    description:
      "Explore modern kitchen layouts, cabinetry, finishes, islands, and practical storage ideas.",
    image: kitchenDesigns[0],
    href: "/designs/kitchens",
  },
  {
    title: "Bathroom Designs",
    category: "Bathrooms",
    description:
      "Discover contemporary bathroom styles, finishes, layouts, and elegant interior ideas.",
    image: bathroomDesigns[0],
    href: "/designs/bathrooms",
  },
  {
    title: "Gypsum Ceiling Designs",
    category: "Gypsum Ceilings",
    description:
      "Explore decorative ceiling concepts, modern lighting ideas, and elegant gypsum finishes.",
    image: gypsumDesigns[0],
    href: "/designs/gypsum-ceilings",
  },
  {
    title: "TV Cabinet Designs",
    category: "TV Cabinets",
    description:
      "Browse modern TV walls, entertainment units, custom cabinetry, and storage solutions.",
    image: tvCabinetDesigns[0],
    href: "/designs/tv-cabinets",
  },
  {
    title: "Wardrobe Designs",
    category: "Wardrobes",
    description:
      "Explore built-in wardrobes, modern storage solutions, and bedroom cabinetry ideas.",
    image: wardrobeDesigns[0],
    href: "/designs/wardrobes",
  },
];

export default function DesignsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCategories =
    activeCategory === "All"
      ? designCategories
      : designCategories.filter(
          (design) => design.category === activeCategory
        );

  return (
    <>
      <Header />

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}
        <section className="relative flex min-h-[75vh] items-center overflow-hidden bg-[#171717] text-white">
          <Image
            src={kitchenDesigns[0]}
            alt="FINETEX INTERIORS interior design"
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
                Design Inspiration
              </p>

              <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Imagine your space. We&apos;ll help bring it to life.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Explore different interior design possibilities and find
                inspiration for your next renovation with FINETEX INTERIORS.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/estimate"
                  className="inline-flex items-center justify-center rounded-full bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d0a76a]"
                >
                  Estimate My Project
                </Link>

                <a
                  href="https://wa.me/254725408173"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold transition hover:bg-white hover:text-[#171717]"
                >
                  Discuss Your Design
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRODUCTION
        ====================================================== */}
        <section className="bg-white py-20 sm:py-24">
          <div className="container">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  Our Design Ideas
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Find a style that feels like home.
                </h2>
              </div>

              <p className="max-w-2xl leading-8 text-[#6b6b6b]">
                Browse our interior design categories for inspiration. From
                kitchens and bathrooms to wardrobes, TV cabinets, and gypsum
                ceilings, discover ideas that can help shape your next project.
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATEGORY FILTERS
        ====================================================== */}
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

        {/* =====================================================
            DESIGN CATEGORIES
        ====================================================== */}
        <section className="bg-[#f7f5f0] pb-24 sm:pb-32">
          <div className="container">
            <div className="grid gap-7 md:grid-cols-2">
              {filteredCategories.map((design) => (
                <Link
                  key={design.category}
                  href={design.href}
                  className="group block overflow-hidden rounded-[2rem] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#171717]">
                    <Image
                      src={design.image}
                      alt={`${design.title} - FINETEX INTERIORS`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-7 sm:p-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d0a76a]">
                        {design.category}
                      </p>

                      <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                        {design.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-7 sm:p-8">
                    <p className="leading-7 text-[#6b6b6b]">
                      {design.description}
                    </p>

                    <span className="mt-5 inline-flex text-sm font-semibold text-[#b18a5a] transition group-hover:text-[#171717]">
                      Explore designs →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CUSTOM DESIGN
        ====================================================== */}
        <section className="relative overflow-hidden bg-[#171717] text-white">
          <div className="container py-24 sm:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                <Image
                  src={tvCabinetDesigns[20]}
                  alt="Custom interior design by FINETEX INTERIORS"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
                  Custom Designs
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
                  Your home doesn&apos;t have to look like everyone else&apos;s.
                </h2>

                <p className="mt-6 max-w-xl leading-8 text-white/65">
                  Have something specific in mind? Share your ideas, reference
                  images, preferred materials, colours, and measurements with
                  us. We can work with you to develop an interior solution
                  around your needs.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/estimate"
                    className="inline-flex items-center justify-center rounded-full bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#d0a76a]"
                  >
                    Start My Design
                  </Link>

                  <a
                    href="https://wa.me/254725408173"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition hover:bg-white hover:text-[#171717]"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}
        <section className="bg-white">
          <div className="container py-24 text-center sm:py-32">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Ready To Renovate?
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              A better interior starts with a good plan.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6b6b6b]">
              Tell us what you want to transform and let FINETEX INTERIORS
              help you plan the next step.
            </p>

            <Link
              href="/estimate"
              className="mt-8 inline-flex rounded-full bg-[#171717] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
            >
              Get Your Estimate
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}