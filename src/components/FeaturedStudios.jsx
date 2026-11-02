"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Camera, RefreshCw } from "lucide-react";
import StudioCard from "@/components/StudioCard";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export default function FeaturedStudios() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudios() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/api/studios/featured`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load studios. Please try again.");
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("The server returned an unexpected response.");
        }

        if (!controller.signal.aborted) {
          setStudios(result.data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof TypeError
              ? "Unable to connect to the studio server. Please try again."
              : err.message
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudios();

    return () => controller.abort();
  }, [attempt]);

  return (
    <section className="site-container section-space">
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-sm font-semibold text-primary">
            Discover your next creative setting
          </p>

          <h2 className="section-title">Spaces worth exploring.</h2>

          <p className="section-description mt-4">
            Explore the latest additions to our creative community.
          </p>
        </div>

        <Link href="/studios" className="btn btn-outline shrink-0 self-start">
          View all studios
          <ArrowUpRight size={17} />
        </Link>
      </div>

      {loading ? (
        <div role="status" aria-label="Loading studios">
          <span className="sr-only">Loading featured studios...</span>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="overflow-hidden rounded-2xl border border-base-300 bg-base-100"
              >
                <div className="skeleton aspect-[4/3] rounded-none" />

                <div className="space-y-4 p-5">
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-6 w-3/4" />
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
          <h3 className="text-xl font-bold">Studios could not be loaded</h3>
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
      ) : studios.length === 0 ? (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-10 text-center">
          <Camera size={36} className="mx-auto text-primary" />
          <h3 className="mt-4 text-xl font-bold">Room for the first studio</h3>
          <p className="mt-3 opacity-65">
            Share a creative space and help someone start their next project.
          </p>
          <Link href="/add-studio" className="btn btn-primary mt-5">
            List your studio
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </section>
  );
}