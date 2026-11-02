"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

function formatMoney(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function dhakaToday() {
  // Bangladesh is UTC+06:00.
  return new Date(Date.now() + 6 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

function hourLabel(hour) {
  return hour === 24
    ? "24:00 — end of day"
    : `${String(hour).padStart(2, "0")}:00`;
}

export default function BookingModal({ studio }) {
  const router = useRouter();
  const { data: session, isPending, error: sessionError, refetch } =
    authClient.useSession();

  const dialogRef = useRef(null);
  const submittingRef = useRef(false);

  const [date, setDate] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const [startHour, setStartHour] = useState(10);
  const [endHour, setEndHour] = useState(11);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const hours = endHour - startHour;
  const hourlyCents = Math.round(studio.hourlyRate * 100);
  const depositCents = Math.round(studio.securityDeposit * 100);
  const rentalAmount = (hourlyCents * hours) / 100;
  const totalAmount = (hourlyCents * hours + depositCents) / 100;

  const isOwner =
    session?.user &&
    (studio.ownerId === session.user.id ||
      studio.ownerEmail === session.user.email);

  function openBooking() {
    if (isPending) return;

    if (sessionError) {
      toast.error("Could not check your account. Please try again.");
      refetch();
      return;
    }

    if (!session?.user) {
      toast.error("Please log in to book a studio.", {
        id: "login-required",
      });

      router.push(
        `/login?next=${encodeURIComponent(`/studios/${studio._id}`)}`
      );
      return;
    }

    if (isOwner) return;

    setMinimumDate(dhakaToday());
    setError("");
    dialogRef.current?.showModal();
  }

  function closeBooking() {
    if (submittingRef.current) return;
    dialogRef.current?.close();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = new FormData(event.currentTarget);

    const payload = {
      studioId: studio._id,
      date,
      startHour,
      endHour,
      guests: Number(form.get("guests")),
      note: form.get("note").trim(),
    };

    submittingRef.current = true;
    setSaving(true);
    setError("");

    try {
      await apiRequest("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      dialogRef.current?.close();
      toast.success("Booking request submitted!");
      router.push("/my-bookings");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);

      if (error.status === 401) {
        dialogRef.current?.close();
        refetch();
        router.push(
          `/login?next=${encodeURIComponent(`/studios/${studio._id}`)}`
        );
      }
    } finally {
      submittingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary mt-6 w-full"
        disabled={isPending || Boolean(isOwner)}
        onClick={openBooking}
      >
        {isPending
          ? "Checking account..."
          : isOwner
            ? "This is your studio"
            : "Book Workspace Now"}
      </button>

      <dialog
        ref={dialogRef}
        className="modal"
        aria-labelledby="booking-title"
        onCancel={(event) => {
          if (submittingRef.current) event.preventDefault();
        }}
      >
        <div className="modal-box max-w-xl">
          <h2 id="booking-title" className="text-2xl font-bold">
            Book your studio
          </h2>

          <p className="mt-2 opacity-70">{studio.title}</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <fieldset disabled={saving} className="space-y-5">
              <div className="rounded-xl bg-base-200 p-4 text-sm">
                <p className="font-semibold">{session?.user?.name}</p>
                <p className="mt-1 break-all opacity-70">
                  {session?.user?.email}
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block font-medium">Booking date</span>
                <input
                  type="date"
                  className="input input-bordered w-full"
                  min={minimumDate}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-2 block font-medium">Start time</span>
                  <select
                    className="select select-bordered w-full"
                    value={startHour}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setStartHour(value);

                      if (endHour <= value) {
                        setEndHour(value + 1);
                      }
                    }}
                  >
                    {Array.from({ length: 24 }, (_, hour) => (
                      <option key={hour} value={hour}>
                        {hourLabel(hour)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block font-medium">End time</span>
                  <select
                    className="select select-bordered w-full"
                    value={endHour}
                    onChange={(event) =>
                      setEndHour(Number(event.target.value))
                    }
                  >
                    {Array.from(
                      { length: 24 - startHour },
                      (_, index) => startHour + index + 1
                    ).map((hour) => (
                      <option key={hour} value={hour}>
                        {hourLabel(hour)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="text-sm opacity-65">
                All times are Bangladesh time (Asia/Dhaka). Bookings use
                full hours within one calendar day.
              </p>

              <label className="block">
                <span className="mb-2 block font-medium">
                  Guests — maximum {studio.maxCapacity}
                </span>
                <input
                  type="number"
                  name="guests"
                  className="input input-bordered w-full"
                  min={1}
                  max={studio.maxCapacity}
                  step={1}
                  defaultValue={1}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-medium">
                  Note to host (optional)
                </span>
                <textarea
                  name="note"
                  className="textarea textarea-bordered w-full"
                  maxLength={1000}
                  rows={3}
                  placeholder="Tell the host about your session."
                />
              </label>

              <div
                className="space-y-3 rounded-xl bg-base-200 p-4 text-sm"
                aria-live="polite"
              >
                <div className="flex justify-between gap-3">
                  <span>
                    {formatMoney(studio.hourlyRate)} × {hours} hour(s)
                  </span>
                  <span>{formatMoney(rentalAmount)}</span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Security deposit</span>
                  <span>{formatMoney(studio.securityDeposit)}</span>
                </div>

                <div className="flex justify-between gap-3 border-t border-base-300 pt-3 font-bold">
                  <span>Estimated total</span>
                  <span>{formatMoney(totalAmount)}</span>
                </div>
              </div>

              <p className="text-sm opacity-65">
                This submits a Pending request. No payment is collected.
                Final pricing is calculated when you submit.
              </p>

              {error && (
                <p role="alert" className="text-sm text-error">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeBooking}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {saving && (
                    <span className="loading loading-spinner loading-sm" />
                  )}
                  {saving ? "Submitting..." : "Submit booking"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </dialog>
    </>
  );
}