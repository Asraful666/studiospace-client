"use client";

import Link from "next/link";
import StudioCard from "@/components/StudioCard";
import WishlistButton from "@/components/WishlistButton";
import { useWishlist } from "@/components/WishlistProvider";

export default function SavedStudios() {
  const { items, loading, error, reload } = useWishlist();

  return (
    <section className="site-container section-space">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-3 text-sm font-semibold text-primary">
            Keep your next creative space close
          </p>

          <h1 className="section-title">Saved Studios</h1>
        </div>

        <Link href="/studios" className="btn btn-primary">
          Explore studios
        </Link>
      </div>

      {loading ? (
        <div
          role="status"
          aria-label="Loading saved studios"
          className="grid gap-6 md:grid-cols-3"
        >
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="skeleton h-80 rounded-2xl"
            />
          ))}
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl bg-base-200 p-8"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={reload}
            className="btn btn-primary mt-4"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-base-300 p-10 text-center">
          <h2 className="text-2xl font-bold">
            Your wishlist starts here
          </h2>

          <p className="mt-3 opacity-70">
            Tap the heart on a studio to save it for later.
          </p>

          <Link
            href="/studios"
            className="btn btn-primary mt-6"
          >
            Find a studio
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) =>
            item.studio ? (
              <StudioCard
                key={item.studioId}
                studio={item.studio}
              />
            ) : (
              <article
                key={item.studioId}
                className="rounded-2xl border border-base-300 p-6"
              >
                <h2 className="text-xl font-bold">
                  Studio no longer available
                </h2>

                <p className="my-4 opacity-70">
                  You can remove this entry from your saved
                  studios.
                </p>

                <WishlistButton
                  studioId={item.studioId}
                  title="unavailable studio"
                />
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
}