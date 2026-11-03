"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";

export default function ReviewModal({ booking, onSubmitted }) {
  const dialogRef = useRef(null);
  const savingRef = useRef(false);

  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const titleId = `review-title-${booking._id}`;

  function openModal() {
    setError("");
    dialogRef.current?.showModal();
  }

  function closeModal() {
    if (savingRef.current) return;
    dialogRef.current?.close();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (savingRef.current) return;

    const form = new FormData(event.currentTarget);
    const rating = Number(form.get("rating"));
    const comment = String(form.get("comment") ?? "").trim();

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5 ||
      comment.length < 10 ||
      comment.length > 2000
    ) {
      setError(
        "Choose a rating and write a review of 10–2000 characters."
      );
      return;
    }

    savingRef.current = true;
    setSaving(true);
    setError("");

    try {
      await apiRequest("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: booking._id,
          rating,
          comment,
        }),
      });
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
      return;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }

    dialogRef.current?.close();
    setSubmitted(true);
    toast.success("Your review has been published.");
    onSubmitted?.();
  }

  if (booking.status !== "Completed") return null;

  if (booking.reviewId || submitted) {
    return <span className="badge badge-success">Review submitted</span>;
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={openModal}
      >
        Write review
      </button>

      <dialog
        ref={dialogRef}
        className="modal"
        aria-labelledby={titleId}
        onCancel={(event) => {
          if (savingRef.current) event.preventDefault();
        }}
      >
        <div className="modal-box">
          <h2 id={titleId} className="text-2xl font-bold">
            Share your experience
          </h2>

          <p className="mt-3 opacity-70">{booking.studioTitle}</p>

          <form onSubmit={handleSubmit} className="mt-6">
            <fieldset disabled={saving} className="space-y-5">
              <label className="block">
                <span className="mb-2 block font-semibold">
                  Your rating
                </span>

                <select
                  name="rating"
                  className="select select-bordered w-full"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Choose a rating
                  </option>
                  <option value="5">5 — Excellent</option>
                  <option value="4">4 — Good</option>
                  <option value="3">3 — Average</option>
                  <option value="2">2 — Below expectations</option>
                  <option value="1">1 — Poor</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block font-semibold">
                  Your review
                </span>

                <textarea
                  name="comment"
                  className="textarea textarea-bordered min-h-36 w-full"
                  minLength={10}
                  maxLength={2000}
                  placeholder="Describe the space, equipment, and your experience."
                  required
                />
              </label>

              <p className="text-sm opacity-65">
                Your name, rating, and review will be public. Avoid
                including personal contact details.
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
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {saving && (
                    <span className="loading loading-spinner loading-sm" />
                  )}
                  {saving ? "Publishing..." : "Publish review"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </dialog>
    </>
  );
}