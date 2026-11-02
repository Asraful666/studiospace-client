"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";

const statuses = [
  "All",
  "Pending",
  "Confirmed",
  "Cancelled",
  "Rejected",
];

const statusClasses = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Cancelled: "badge-neutral",
  Rejected: "badge-error",
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

export default function HostBookings() {
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selection, setSelection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const dialogRef = useRef(null);
  const savingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBookings() {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({
          page: String(page),
          status,
        });

        const data = await apiRequest(
          `/api/host/bookings?${query.toString()}`,
          { signal: controller.signal }
        );

        if (controller.signal.aborted) return;

        // Return to the last available page if this page became empty.
        if (page > 1 && data.data.length === 0) {
          setPage(Math.max(1, data.pagination.totalPages));
          return;
        }

        setResult(data);
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
  }, [page, status, attempt]);

  function openDecision(booking, nextStatus) {
    setSelection({ booking, nextStatus });
    setActionError("");
    dialogRef.current?.showModal();
  }

  function closeDecision() {
    if (savingRef.current) return;
    dialogRef.current?.close();
  }

  async function submitDecision() {
    if (!selection || savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    setActionError("");

    try {
      const response = await apiRequest(
        `/api/host/bookings/${selection.booking._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: selection.nextStatus,
          }),
        }
      );

      toast.success(response.message);
      dialogRef.current?.close();
      setAttempt((current) => current + 1);
    } catch (error) {
      toast.error(error.message);
      setActionError(error.message);

      if (error.status === 404 || error.status === 409) {
        dialogRef.current?.close();
        setAttempt((current) => current + 1);
      }
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <section className="site-container section-space">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 font-semibold text-primary">
            Manage requests for your spaces
          </p>

          <h1 className="section-title">Booking Requests</h1>

          <p className="mt-3 text-sm opacity-65">
            All booking times are Bangladesh time (Asia/Dhaka).
          </p>
        </div>

        <Link href="/my-listings" className="btn btn-outline">
          My Listings
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">
            Filter by status
          </span>

          <select
            className="select select-bordered w-full sm:w-56"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="btn btn-ghost"
          disabled={loading}
          onClick={() => setAttempt((current) => current + 1)}
        >
          Refresh requests
        </button>
      </div>

      {loading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton h-64 rounded-2xl" />
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
          <h2 className="text-2xl font-bold">
            {status === "All"
              ? "No booking requests yet"
              : `No ${status.toLowerCase()} requests`}
          </h2>

          <p className="mt-3 opacity-70">
            {status === "All"
              ? "Requests will appear here when someone books your studio."
              : "Choose another status to see more requests."}
          </p>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm opacity-65">
            {result.pagination.total} matching request(s)
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

                <div className="mt-5 rounded-xl bg-base-200 p-4">
                  <p className="font-semibold">{booking.userName}</p>
                  <p className="mt-1 break-all text-sm opacity-70">
                    {booking.userEmail}
                  </p>
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
                    <dt className="text-sm opacity-65">
                      Duration / guests
                    </dt>
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
                  Rental: {money(booking.rentalAmount)} · Deposit:{" "}
                  {money(booking.securityDeposit)}
                </p>

                {booking.note && (
                  <div className="mt-5">
                    <p className="text-sm font-semibold">Guest note</p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm opacity-75">
                      {booking.note}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/studios/${booking.studioId}`}
                    className="btn btn-outline btn-sm"
                  >
                    View studio
                  </Link>

                  {booking.status === "Pending" && (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => openDecision(booking, "Confirmed")}
                      >
                        Confirm
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline btn-error btn-sm"
                        onClick={() => openDecision(booking, "Rejected")}
                      >
                        Reject
                      </button>
                    </>
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
        aria-labelledby="booking-decision-title"
        onCancel={(event) => {
          if (savingRef.current) event.preventDefault();
        }}
        onClose={() => {
          setSelection(null);
          setActionError("");
        }}
      >
        <div className="modal-box">
          <h2 id="booking-decision-title" className="text-xl font-bold">
            {selection?.nextStatus === "Confirmed"
              ? "Confirm this booking?"
              : "Reject this request?"}
          </h2>

          <p className="mt-4 opacity-75">
            {selection?.booking.userName} requested “
            {selection?.booking.studioTitle}” on{" "}
            {selection?.booking.date}.
          </p>

          {selection && (
            <p className="mt-3 text-sm opacity-65">
              {hourLabel(selection.booking.startHour)}–
              {hourLabel(selection.booking.endHour)} · Bangladesh time
            </p>
          )}

          <p className="mt-4 text-sm opacity-65">
            {selection?.nextStatus === "Confirmed"
              ? "Confirming reserves this time slot. No payment is collected."
              : "Rejecting closes this request. The guest can submit a new request."}
          </p>

          {actionError && (
            <p role="alert" className="mt-4 text-sm text-error">
              {actionError}
            </p>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              disabled={saving}
              onClick={closeDecision}
              autoFocus
            >
              Go back
            </button>

            <button
              type="button"
              className={`btn ${
                selection?.nextStatus === "Confirmed"
                  ? "btn-primary"
                  : "btn-error"
              }`}
              disabled={saving}
              onClick={submitDecision}
            >
              {saving && (
                <span className="loading loading-spinner loading-sm" />
              )}

              {saving
                ? "Saving..."
                : selection?.nextStatus === "Confirmed"
                  ? "Confirm booking"
                  : "Reject request"}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}