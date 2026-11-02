"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  MapPin,
  Star,
  Users,
} from "lucide-react";

export default function StudioCard({ studio }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-base-300">
        {studio.imageUrl && !imageFailed ? (
          // External uploaded images; image optimization will be configured later.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={studio.imageUrl}
            alt={studio.title}
            width={800}
            height={600}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            role="img"
            aria-label="Studio image unavailable"
            className="flex h-full items-center justify-center text-base-content/40"
          >
            <Camera size={44} />
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-base-100 px-3 py-1.5 text-xs font-semibold">
          {studio.category}
        </span>

        {studio.isDemo && (
          <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-xs text-white">
            Demo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-1.5 text-xs opacity-65">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate">{studio.location}</span>
          </p>

          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold">
            <Star size={14} className="text-primary" />
            {studio.reviewCount > 0
              ? Number(studio.rating).toFixed(1)
              : "New"}
          </span>
        </div>

        <h3 className="mt-3 text-xl font-bold tracking-tight">
          <Link href={`/studios/${studio._id}`} className="hover:text-primary">
            {studio.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 opacity-65">
          {studio.overview}
        </p>

        <p className="mt-4 flex items-center gap-2 text-xs opacity-65">
          <Users size={15} />
          Up to {studio.maxCapacity} people
        </p>

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 border-t border-base-300 pt-4">
            <p>
              <span className="text-2xl font-extrabold">
                ${studio.hourlyRate}
              </span>
              <span className="ml-1 text-sm opacity-60">/ hr</span>
            </p>

            <Link
              href={`/studios/${studio._id}`}
              className="btn btn-primary btn-sm"
              aria-label={`View details for ${studio.title}`}
            >
              View details
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}