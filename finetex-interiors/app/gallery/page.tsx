"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Bath,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { projects } from "@/lib/gallery";

const serviceCategories = [
  {
    name: "Kitchens",
    description:
      "Functional and beautifully finished kitchen spaces designed around your lifestyle.",
    image: "/images/gallery/kitchens/FB_IMG_1789927717078.jpg",
  },
  {
    name: "Gypsum",
    description:
      "Elegant gypsum ceiling designs that transform the character of your space.",
    image: "/images/gallery/gypsum/FB_IMG_1789930686842.jpg",
  },
  {
    name: "TV Cabinets",
    description:
      "Custom TV units designed to bring style, storage and clean lines together.",
    image: "/images/gallery/tv-cabinets/FB_IMG_1789930059301.jpg",
  },
  {
    name: "Wardrobes",
    description:
      "Custom wardrobe solutions designed for practical storage and a refined finish.",
    image: "/images/gallery/wardrobes/FB_IMG_1789931390475.jpg",
  },
  {
    name: "Bathrooms",
    description:
      "Bathroom projects and transformations from FINETEX INTERIORS.",
    image: "/images/gallery/bathrooms/IMG-20260921-WA0010.jpg",
  },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const selectedProjects = selectedCategory
    ? projects.filter((project) => project.category === selectedCategory)
    : [];

  const openCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedIndex(null);

    window.scrollTo({
      top: document.getElementById("gallery-projects")?.offsetTop
        ? (document.getElementById("gallery-projects")?.offsetTop ?? 0) - 100
        : 0,
      behavior: "smooth",
    });
  };

  const closeCategory = () => {
    setSelectedCategory(null);
    setSelectedIndex(null);
  };

  const openImage = (index: number) => {
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  const showPrevious = () => {
    if (selectedIndex === null || selectedProjects.length === 0) return;

    setSelectedIndex(
      selectedIndex === 0
        ? selectedProjects.length - 1
        : selectedIndex - 1
    );
  };

  const showNext = () => {
    if (selectedIndex === null || selectedProjects.length === 0) return;

    setSelectedIndex(
      selectedIndex === selectedProjects.length - 1
        ? 0
        : selectedIndex + 1
    );
  };

  const getCategoryCount = (category: string) => {
    return projects.filter((project) => project.category === category).length;
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-neutral-900">
      <Header />

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative h-[70vh] min-h-[560px] overflow-hidden">
        {/* KEEP THIS HERO IMAGE UNCHANGED */}
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
          alt="Elegant interior design by FINETEX INTERIORS"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-4xl text-white">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#d2b17c]">
              FINETEX INTERIORS
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              Our Work
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
              Explore our interior design and renovation projects across
              kitchens, gypsum ceilings, TV cabinets, wardrobes and bathrooms.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
            Project Gallery
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore Our Interior Projects
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-600">
            Browse our work by service. Choose a category below to see the
            complete collection of projects available in that area.
          </p>
        </div>
      </section>

      {/* =========================================================
          SERVICE BUCKETS / SELECTED CATEGORY
      ========================================================= */}
      <section
        id="gallery-projects"
        className="px-6 pb-24 sm:pb-28"
      >
        <div className="mx-auto max-w-7xl">
          {!selectedCategory ? (
            <>
              <div className="mb-10">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
                  Browse by Service
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Choose a project category
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {serviceCategories.map((service) => {
                  const count = getCategoryCount(service.name);

                  return (
                    <button
                      key={service.name}
                      type="button"
                      onClick={() => openCategory(service.name)}
                      className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={`${service.name} projects by FINETEX INTERIORS`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-neutral-200">
                            <div className="text-center">
                              <Bath
                                size={46}
                                strokeWidth={1.3}
                                className="mx-auto text-neutral-500"
                              />

                              <p className="mt-3 text-sm font-medium text-neutral-500">
                                Coming Soon
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />

                        <div className="absolute bottom-4 left-4">
                          <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-neutral-800 shadow-sm">
                            {count > 0
                              ? `${count} ${count === 1 ? "Project" : "Projects"}`
                              : "Coming Soon"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="text-xl font-semibold">
                            {service.name}
                          </h3>

                          <span className="text-[#b18a5a] transition-transform duration-300 group-hover:translate-x-1">
                            →
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                          {service.description}
                        </p>

                        <div className="mt-5 text-sm font-semibold text-[#b18a5a]">
                          {count > 0
                            ? `View ${service.name} projects`
                            : `View ${service.name}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Back */}
              <button
                type="button"
                onClick={closeCategory}
                className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 transition hover:text-[#b18a5a]"
              >
                <ArrowLeft size={17} />
                All Services
              </button>

              {/* Category heading */}
              <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
                    Project Collection
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {selectedCategory}
                  </h2>

                  <p className="mt-3 max-w-2xl text-neutral-600">
                    {
                      serviceCategories.find(
                        (service) => service.name === selectedCategory
                      )?.description
                    }
                  </p>
                </div>

                {selectedProjects.length > 0 && (
                  <div className="text-sm font-medium text-neutral-500">
                    {selectedProjects.length}{" "}
                    {selectedProjects.length === 1 ? "project" : "projects"}
                  </div>
                )}
              </div>

              {/* No projects */}
              {selectedProjects.length === 0 ? (
                <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm ring-1 ring-black/5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1ece4]">
                    <Bath
                      size={30}
                      strokeWidth={1.4}
                      className="text-[#b18a5a]"
                    />
                  </div>

                  <h3 className="mt-6 text-2xl font-semibold">
                    Bathroom projects coming soon
                  </h3>

                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-600">
                    We are currently preparing our bathroom project collection.
                    Check back soon to explore FINETEX INTERIORS bathroom
                    transformations.
                  </p>

                  <Link
                    href="/estimate"
                    className="mt-7 inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
                  >
                    Start Your Project
                  </Link>
                </div>
              ) : (
                /* Project photos */
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedProjects.map((project, index) => (
                    <button
                      key={`${project.image}-${index}`}
                      type="button"
                      onClick={() => openImage(index)}
                      className={`group relative overflow-hidden rounded-2xl bg-neutral-200 text-left ${
                        index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                      }`}
                    >
                      <div
                        className={`relative ${
                          index === 0
                            ? "aspect-[4/3] lg:h-full lg:min-h-[520px]"
                            : "aspect-[4/3]"
                        }`}
                      >
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes={
                            index === 0
                              ? "(max-width: 1024px) 100vw, 66vw"
                              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          }
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/30" />

                        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/75 to-transparent px-5 pb-5 pt-12 transition duration-300 group-hover:translate-y-0">
                          <p className="text-sm font-semibold text-white">
                            {project.title}
                          </p>

                          <p className="mt-1 text-xs text-white/75">
                            View project
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* =========================================================
          QUALITY SECTION
      ========================================================= */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image
              src="/images/gallery/gypsum/FB_IMG_1789930686842.jpg"
              alt="Quality interior finishing by FINETEX INTERIORS"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b18a5a]">
                Quality & Craftsmanship
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Designed with purpose. Finished with care.
              </h2>

              <p className="mt-5 leading-7 text-neutral-600">
                Every FINETEX INTERIORS project is approached with attention to
                detail, practical functionality and clean finishing. From
                custom kitchens to wardrobes, ceilings and TV units, we focus
                on creating spaces that look beautiful and work for everyday
                life.
              </p>

              <Link
                href="/estimate"
                className="mt-8 inline-flex rounded-full bg-neutral-900 px-7 py-3.5 text-sm font-semibold !text-white transition hover:bg-[#b18a5a] hover:!text-white"
              >
                Get a Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="bg-neutral-900 px-6 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#d2b17c]">
            Ready to Transform Your Space?
          </p>

          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Let&apos;s create an interior you&apos;ll love.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/70">
            Tell us about your project and our team will help you take the
            next step.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/estimate"
              className="rounded-full bg-[#b18a5a] px-7 py-3.5 text-sm font-semibold !text-white transition hover:bg-[#c19b6c] hover:!text-white"
            >
              Get a Free Estimate
            </Link>

            <a
              href="https://wa.me/254725408173"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-neutral-900"
            >
              WhatsApp Us
            </a>
          </div>

          <a
            href="tel:+254725408173"
            className="mt-7 inline-block text-sm text-white/70 transition hover:text-white"
          >
            Call 0725 408 173
          </a>
        </div>
      </section>

      <Footer />

      {/* =========================================================
          FULL-SCREEN IMAGE VIEWER
      ========================================================= */}
      {selectedIndex !== null && selectedProjects.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95">
          {/* Close */}
          <button
            type="button"
            onClick={closeImage}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X size={22} />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-6"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={showNext}
            aria-label="Next image"
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-6"
          >
            <ChevronRight size={28} />
          </button>

          {/* Image */}
          <div className="flex h-full w-full items-center justify-center px-16 py-16 sm:px-24">
            <div className="relative h-full w-full max-w-6xl">
              <Image
                src={selectedProjects[selectedIndex].image}
                alt={selectedProjects[selectedIndex].title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-center">
            <p className="text-sm font-semibold text-white">
              {selectedProjects[selectedIndex].title}
            </p>

            <p className="mt-1 text-xs text-white/60">
              {selectedIndex + 1} / {selectedProjects.length}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}