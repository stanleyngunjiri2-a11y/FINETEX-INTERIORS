"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const tvCabinetDesigns = [
  {
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=90",
    alt: "Modern TV cabinet and feature wall",
  },
  {
    image:
      "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1800&q=90",
    alt: "Minimal TV cabinet design",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90",
    alt: "Contemporary TV wall design",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=90",
    alt: "Elegant TV wall interior",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=90",
    alt: "Modern entertainment wall",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=90",
    alt: "Built-in TV cabinet inspiration",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=90",
    alt: "Contemporary living room cabinet",
  },
  {
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=90",
    alt: "Modern living room TV feature wall",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=90",
    alt: "Custom TV cabinet interior",
  },
];

export default function TVCabinetsPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const showPrevious = () => {
    if (selectedImage === null) return;

    setSelectedImage(
      selectedImage === 0
        ? tvCabinetDesigns.length - 1
        : selectedImage - 1
    );
  };

  const showNext = () => {
    if (selectedImage === null) return;

    setSelectedImage(
      selectedImage === tvCabinetDesigns.length - 1
        ? 0
        : selectedImage + 1
    );
  };

  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#171717] text-white">
          <div className="container py-20 sm:py-28">
            <Link
              href="/designs"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/65 transition hover:text-[#d0a76a]"
            >
              <ArrowLeft size={16} />
              Back to Designs
            </Link>

            <div className="mt-12 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d0a76a]">
                FINETEX INTERIORS
              </p>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
                TV Cabinet Designs
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Explore TV wall and cabinet designs from FINETEX INTERIORS.
              </p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="bg-[#f7f5f0] py-16 sm:py-24">
          <div className="container">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tvCabinetDesigns.map((design, index) => (
                <button
                  key={design.image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`group relative overflow-hidden rounded-[1.75rem] bg-[#171717] text-left ${
                    index === 0
                      ? "sm:col-span-2 lg:col-span-2 lg:row-span-2"
                      : ""
                  }`}
                  aria-label={`View TV cabinet design ${index + 1}`}
                >
                  <div
                    className={`relative ${
                      index === 0
                        ? "aspect-[4/3] h-full min-h-[400px] lg:min-h-[600px]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={design.image}
                      alt={design.alt}
                      fill
                      sizes={
                        index === 0
                          ? "(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 66vw"
                          : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      }
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/15" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white">
          <div className="container py-20 text-center sm:py-28">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b18a5a]">
              Create Your TV Wall
            </p>

            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Give your living room a statement piece.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#6b6b6b]">
              Share your ideas with FINETEX INTERIORS and let&apos;s create a
              TV cabinet designed around your space.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/estimate"
                className="inline-flex items-center justify-center rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#b18a5a]"
              >
                Get an Estimate
              </Link>

              <a
                href="https://wa.me/254768176570"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#cfc8bc] px-7 py-3.5 text-sm font-semibold text-[#171717] transition hover:border-[#171717] hover:bg-[#171717] hover:text-white"
              >
                WhatsApp FINETEX
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="TV cabinet design preview"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-[#171717]"
            aria-label="Close image viewer"
          >
            <X size={22} />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-[#171717] sm:left-7"
            aria-label="Previous TV cabinet design"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div
            className="relative h-[80vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={tvCabinetDesigns[selectedImage].image}
              alt={tvCabinetDesigns[selectedImage].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white hover:text-[#171717] sm:right-7"
            aria-label="Next TV cabinet design"
          >
            <ChevronRight size={24} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur">
            {selectedImage + 1} / {tvCabinetDesigns.length}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}