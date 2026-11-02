"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    label: "Photography & visual storytelling",
    title: "Your vision.",
    highlight: "The right space.",
    description:
      "Find inspiring spaces for portraits, product shoots, and the stories you have been waiting to tell.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=85",
  },
  {
    label: "Podcasts & music sessions",
    title: "Make yourself",
    highlight: "heard.",
    description:
      "Discover rooms for meaningful conversations, fresh sounds, and your next recording session.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1920&q=85",
  },
  {
    label: "Film & creative production",
    title: "Big ideas.",
    highlight: "Room to happen.",
    description:
      "Bring your team together in a creative setting that fits your next production.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=85",
  },
];

export default function HeroSlider() {
  return (
    <section
      aria-label="Discover creative spaces"
      className="site-container pt-6"
    >
      <h1 className="sr-only">
        StudioSpace — Find your creative workspace
      </h1>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        slidesPerView={1}
        spaceBetween={0}
        navigation
        pagination={{ clickable: true }}
        rewind
        speed={350}
        className="studio-hero overflow-hidden rounded-[2rem]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.label}>
            {({ isActive }) => (
              <div
                inert={!isActive}
                aria-hidden={!isActive}
                className="relative isolate flex min-h-[560px] items-center bg-[#171322] px-10 py-24 text-white sm:min-h-[600px] sm:px-20"
              >
                {/* Decorative image; text remains readable if it fails. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt=""
                  width={1920}
                  height={1080}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="absolute inset-0 -z-20 h-full w-full object-cover"
                />

                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />

                <div className="max-w-2xl">
                  <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                    {slide.label}
                  </p>

                  <h2 className="text-4xl font-extrabold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
                    {slide.title}
                    <span className="mt-2 block text-violet-300">
                      {slide.highlight}
                    </span>
                  </h2>

                  <p className="mt-6 max-w-lg text-base leading-8 text-white/80 sm:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary">
                      Explore Studios
                      <ArrowUpRight size={18} />
                    </Link>

                    <Link
                      href="/studios"
                      className="btn border-white/50 bg-transparent text-white shadow-none hover:border-white hover:bg-white/15"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}