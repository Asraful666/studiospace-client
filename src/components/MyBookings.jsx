"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";

const statusClasses = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Cancelled: "badge-neutral",
};

function money(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function hourLabel(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

export default function MyBookings() {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const dialogRef = useRef(null);
  const cancellingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(
          `/api/bookings/mine?page=${page}`,
          { signal: controller.signal }
        );

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

    loadBookings();

    return () => controller.abort();
  }, [page, attempt]);

  function openCancel(booking) {
    setSelected(booking);
    dialogRef.current?.showModal();
  }

  async function cancelBooking() {
    if (!selected || cancellingRef.current) return;

    cancellingRef.current = true;
    setCancelling(true);

    try {
      await apiRequest(`/api/bookings/${selected._id}/cancel`, {
        method: "PATCH",
      });

      toast.success("Booking cancelled.");
      dialogRef.current?.close();
      setAttempt((current) => current + 1);
    } catch (error) {
      toast.error(error.message);

      // Reload if the booking was removed or its status changed.
      if (error.status === 404 || error.status === 409) {
        dialogRef.current?.close();
        setAttempt((current) => current + 1);
      }
    } finally {
      cancellingRef.current = false;
      setCancelling(false);
    }
  }

  return (
    <section className="site-container section-space">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 font-semibold text-primary">
            Your upcoming creative sessions
          </p>
          <h1 className="section-title">My Bookings</h1>
        </div>

        <Link href="/studios" className="btn btn-primary">
          Explore studios
        </Link>
      </div>

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton h-56 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-base-200 p-8">
          <p role="alert">{error}</p>
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => setAttempt((current) => current + 1)}
          >
            Try again
          </button>
        </div>
      ) : !result?.data.length ? (
        <div className="rounded-2xl border border-base-300 p-10 text-center">
          <h2 className="text-2xl font-bold">No bookings yet</h2>
          <p className="mt-3 opacity-70">
            Find a creative space and plan your first session.
          </p>
          <Link href="/studios" className="btn btn-primary mt-6">
            Find a studio
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm opacity-70">
            {result.pagination.total} booking(s) · Bangladesh time
            (Asia/Dhaka)
          </p>

          <div className="space-y-5">
            {result.data.map((booking) => (
              <article
                key={booking._id}
                className="rounded-2xl border border-base-300 bg-base-100 p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {booking.studioTitle}
                    </h2>
                    <p className="mt-2 text-sm opacity-65">
                      {booking.studioLocation}
                    </p>
                  </div>

                  <span
                    className={`badge ${
                      statusClasses[booking.status] ?? "badge-outline"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <dl className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
                  <div>
                    <dt className="text-sm opacity-65">Date</dt>
                    <dd className="mt-1 font-semibold">{booking.date}</dd>
                  </div>

                  <div>
                    <dt className="text-sm opacity-65">Time</dt>
                    <dd className="mt-1 font-semibold">
                      {hourLabel(booking.startHour)}–
                      {hourLabel(booking.endHour)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm opacity-65">Duration / guests</dt>
                    <dd className="mt-1 font-semibold">
                      {booking.hours} hour(s) / {booking.guests} guest(s)
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm opacity-65">Total quoted</dt>
                    <dd className="mt-1 font-semibold text-primary">
                      {money(booking.totalAmount)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-5 text-sm opacity-65">
                  Rental: {money(booking.rentalAmount)} · Security deposit:{" "}
                  {money(booking.securityDeposit)}
                </p>

                {booking.note && (
                  <p className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-base-200 p-4 text-sm">
                    {booking.note}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="btn btn-outline btn-sm"
                  >
                    View studio
                  </Link>

                  {booking.status === "Pending" && (
                    <button
                      type="button"
                      className="btn btn-outline btn-error btn-sm"
                      onClick={() => openCancel(booking)}
                    >
                      Cancel booking
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          {result.pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
              >
                Previous
              </button>

              <span>
                {page} / {result.pagination.totalPages}
              </span>

              <button
                type="button"
                className="btn btn-outline"
                disabled={page >= result.pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <dialog
        ref={dialogRef}
        className="modal"
        aria-labelledby="cancel-booking-title"
        onCancel={(event) => {
          if (cancellingRef.current) event.preventDefault();
        }}
        onClose={() => setSelected(null)}
      >
        <div className="modal-box">
          <h2 id="cancel-booking-title" className="text-xl font-bold">
            Cancel this booking?
          </h2>

          <p className="mt-4 opacity-75">
            Your request for “{selected?.studioTitle}” on {selected?.date}
            {" "}will be marked Cancelled.
          </p>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              disabled={cancelling}
              onClick={() => dialogRef.current?.close()}
              autoFocus
            >
              Keep booking
            </button>

            <button
              type="button"
              className="btn btn-error"
              disabled={cancelling}
              onClick={cancelBooking}
            >
              {cancelling && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {cancelling ? "Cancelling..." : "Cancel booking"}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}