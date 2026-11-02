"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import StudioCard from "@/components/StudioCard";

export default function MyListings() {
  const { data: session } = authClient.useSession();

  // Account changes also reset the list.
  return session?.user ? (
    <Listings key={session.user.id} />
  ) : null;
}

function Listings() {
  const { refetch } = authClient.useSession();
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/api/studios/mine?page=${page}`, {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) setResult(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
          if (err.status === 401) refetch();
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, attempt, refetch]);

  return (
    <section className="site-container section-space">
      <div className="mb-9 flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="mb-3 text-sm font-semibold text-primary">
            Your spaces, your creativity
          </p>
          <h1 className="section-title">My studio listings.</h1>
        </div>

        <Link href="/add-studio" className="btn btn-primary">
          <Plus size={18} />
          Add studio
        </Link>
      </div>

      {loading ? (
        <div role="status">
          <span className="sr-only">Loading your listings</span>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="skeleton h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div role="alert" className="rounded-2xl bg-base-100 p-10 text-center">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
            className="btn btn-primary mt-5"
          >
            Try again
          </button>
        </div>
      ) : result?.data.length === 0 ? (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-12 text-center">
          <Building2 size={44} className="mx-auto text-primary" />
          <h2 className="mt-5 text-2xl font-bold">No studios here yet.</h2>
          <p className="mt-3 opacity-65">
            List your first space and help a creator start their next project.
          </p>
          <Link href="/add-studio" className="btn btn-primary mt-6">
            Add your first studio
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm opacity-65">
            {result.pagination.total} studio listings
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>

          <nav
            aria-label="My listings pagination"
            className="mt-8 flex items-center justify-center gap-4"
          >
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="btn btn-outline"
            >
              Previous
            </button>

            <span className="text-sm">
              Page {page} of {result.pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={page >= result.pagination.totalPages}
              onClick={() => setPage((value) => value + 1)}
              className="btn btn-outline"
            >
              Next
            </button>
          </nav>
        </>
      )}
    </section>
  );
}