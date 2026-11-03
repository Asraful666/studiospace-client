"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

function RatingStars({ rating }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-primary"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={16}
          fill={value <= rating ? "currentColor" : "none"}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function StudioReviews({ studioId }) {
  return <ReviewList key={studioId} studioId={studioId} />;
}

function ReviewList({ studioId }) {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/reviews/studio/${encodeURIComponent(studioId)}?page=${page}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error("The server returned an unexpected response.");
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load reviews.");
        }

        if (!controller.signal.aborted) {
          setResult(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadReviews();

    return () => controller.abort();
  }, [studioId, page, attempt]);

  return (
    <section
      aria-label="Guest reviews"
      className="mt-10 border-t border-base-300 pt-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">Guest reviews</h2>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={loading}
          onClick={() => setAttempt((current) => current + 1)}
        >
          Refresh reviews
        </button>
      </div>

      <p className="mt-3 text-sm opacity-65">
        Reviews from guests with completed bookings.
      </p>

      {loading ? (
        <div
          role="status"
          aria-label="Loading reviews"
          className="mt-6 space-y-4"
        >
          <span className="sr-only">Loading reviews...</span>

          {[1, 2].map((item) => (
            <div
              key={item}
              aria-hidden="true"
              className="skeleton h-32 rounded-2xl"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl bg-base-200 p-6">
          <p role="alert">{error}</p>

          <button
            type="button"
            className="btn btn-outline btn-sm mt-4"
            onClick={() => setAttempt((current) => current + 1)}
          >
            Try again
          </button>
        </div>
      ) : !result?.data.length ? (
        <div className="mt-6 rounded-2xl border border-base-300 p-6">
          <h3 className="font-bold">No reviews yet</h3>
          <p className="mt-2 text-sm leading-7 opacity-70">
            After completing a booking, share your experience from
            My Bookings.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-base-200 p-4">
            <Star
              size={22}
              fill="currentColor"
              className="text-primary"
              aria-hidden="true"
            />

            <p>
              <span className="text-xl font-bold">
                {Number(result.summary.rating).toFixed(1)}
              </span>
              <span className="ml-2 text-sm opacity-65">
                / 5 · {result.summary.reviewCount} review(s)
              </span>
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {result.data.map((review) => (
              <article
                key={review._id}
                className="rounded-2xl border border-base-300 bg-base-100 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{review.reviewerName}</h3>

                    <time
                      dateTime={review.createdAt}
                      className="mt-1 block text-xs opacity-60"
                    >
                      {formatDate(review.createdAt)}
                    </time>
                  </div>

                  <RatingStars rating={review.rating} />
                </div>

                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 opacity-80">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>

          {result.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>

              <span className="text-sm">
                {page} / {result.pagination.totalPages}
              </span>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={page >= result.pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}