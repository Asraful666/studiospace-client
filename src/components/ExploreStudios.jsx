"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, RefreshCw, SlidersHorizontal } from "lucide-react";
import StudioCard from "@/components/StudioCard";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export default function ExploreStudios({ filters }) {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  const query = new URLSearchParams({
    ...filters,
    limit: "6",
  }).toString();

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/api/studios?${query}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        const body = await response.json();

        if (!response.ok || !body.success) {
          throw new Error(body.message || "Could not load studios.");
        }

        if (!Array.isArray(body.data) || !body.pagination) {
          throw new Error("Unexpected response from the server.");
        }

        if (!controller.signal.aborted) {
          setResult(body);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError
              ? "Unable to connect to the studio server."
              : err.message
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [query, attempt]);

  function applyFilters(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const search = String(form.get("search") || "").trim();
    const category = String(form.get("category") || "");
    const sort = String(form.get("sort") || "newest");

    if (search) params.set("search", search);
    if (category) params.set("category", category);
    params.set("sort", sort);

    // New filters always start from page 1.
    router.push(`/studios?${params.toString()}`, { scroll: false });
  }

  function goToPage(page) {
    const params = new URLSearchParams({
      ...filters,
      page: String(page),
    });

    router.push(`/studios?${params.toString()}`, { scroll: false });
  }

  const pagination = result?.pagination;

  return (
    <section className="site-container section-space">
      <div className="mb-9 max-w-2xl">
        <p className="mb-3 text-sm font-semibold text-primary">
          Find your next creative setting
        </p>

        <h1 className="section-title">Explore studios.</h1>

        <p className="section-description mt-4">
          Discover spaces for photography, filmmaking, music,
          conversations, and hands-on creativity.
        </p>
      </div>

      <form
        onSubmit={applyFilters}
        className="mb-8 grid gap-4 rounded-2xl border border-base-300 bg-base-100 p-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]"
      >
        <div>
          <label htmlFor="studio-search" className="mb-2 block text-sm font-semibold">
            Search
          </label>
          <input
            id="studio-search"
            name="search"
            type="search"
            maxLength={100}
            defaultValue={filters.search}
            placeholder="Studio name or location"
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="studio-category" className="mb-2 block text-sm font-semibold">
            Category
          </label>
          <select
            id="studio-category"
            name="category"
            defaultValue={filters.category}
            className="select select-bordered w-full"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="studio-sort" className="mb-2 block text-sm font-semibold">
            Sort by
          </label>
          <select
            id="studio-sort"
            name="sort"
            defaultValue={filters.sort}
            className="select select-bordered w-full"
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Highest rated</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary self-end">
          <SlidersHorizontal size={17} />
          Apply filters
        </button>
      </form>

      <div className="mb-6 flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm opacity-65">
          {loading
            ? "Finding your spaces..."
            : error
              ? "Results unavailable"
              : `${pagination.total} studios found`}
        </p>

        <Link href="/studios" className="btn btn-ghost btn-sm">
          Reset filters
        </Link>
      </div>

      {loading ? (
        <div role="status">
          <span className="sr-only">Loading studios</span>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="overflow-hidden rounded-2xl border border-base-300 bg-base-100"
              >
                <div className="skeleton aspect-[4/3] rounded-none" />
                <div className="space-y-4 p-5">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-base-300 bg-base-100 p-10 text-center"
        >
          <h2 className="text-xl font-bold">Unable to load studios</h2>
          <p className="mt-3 opacity-65">{error}</p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="btn btn-primary mt-5"
          >
            <RefreshCw size={17} />
            Try again
          </button>
        </div>
      ) : result.data.length === 0 ? (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-12 text-center">
          <Search size={40} className="mx-auto text-primary" />
          <h2 className="mt-5 text-2xl font-bold">
            No studios on this page
          </h2>
          <p className="mt-3 opacity-65">
            Try a different search or reset your filters to explore all spaces.
          </p>
          <Link href="/studios" className="btn btn-primary mt-6">
            Explore all studios
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>

          <nav
            aria-label="Studio pagination"
            className="mt-10 flex items-center justify-center gap-4"
          >
            <button
              type="button"
              className="btn btn-outline"
              disabled={pagination.page <= 1}
              onClick={() => goToPage(pagination.page - 1)}
            >
              Previous
            </button>

            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              className="btn btn-outline"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => goToPage(pagination.page + 1)}
            >
              Next
            </button>
          </nav>
        </>
      )}
    </section>
  );
}