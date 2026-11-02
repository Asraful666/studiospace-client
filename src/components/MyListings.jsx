"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import StudioCard from "@/components/StudioCard";
import { apiRequest } from "@/lib/api";

export default function MyListings() {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadListings() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(
          `/api/studios/mine?page=${page}`,
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

    loadListings();

    return () => controller.abort();
  }, [page, attempt]);

  function openDelete(studio) {
    setSelected(studio);
    dialogRef.current?.showModal();
  }

  function closeDelete() {
    if (deleting) return;
    dialogRef.current?.close();
    setSelected(null);
  }

  async function deleteStudio() {
    if (!selected || deleting) return;

    setDeleting(true);

    try {
      await apiRequest(`/api/manage/studios/${selected._id}`, {
        method: "DELETE",
      });

      toast.success("Studio deleted successfully.");
      dialogRef.current?.close();
      setSelected(null);

      if (result?.data.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        setAttempt((current) => current + 1);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="site-container section-space">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 font-semibold text-primary">Your creative spaces</p>
          <h1 className="section-title">My Listings</h1>
        </div>

        <Link href="/add-studio" className="btn btn-primary">
          Add studio
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="skeleton h-80 rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div role="alert" className="rounded-2xl bg-base-200 p-8">
          <p>{error}</p>
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
          <h2 className="text-2xl font-bold">No studios yet</h2>
          <p className="mt-3 opacity-70">
            Publish your first studio to start hosting creators.
          </p>
          <Link href="/add-studio" className="btn btn-primary mt-6">
            Add your first studio
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm opacity-70">
            {result.pagination.total} studio(s) in your listings
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((studio) => (
              <div key={studio._id} className="flex flex-col gap-3">
                <StudioCard studio={studio} />

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className="btn btn-outline"
                    aria-label={`Edit ${studio.title}`}
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    className="btn btn-outline btn-error"
                    onClick={() => openDelete(studio)}
                    aria-label={`Delete ${studio.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
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
        aria-labelledby="delete-studio-title"
        aria-describedby="delete-studio-description"
        onCancel={(event) => {
          if (deleting) event.preventDefault();
        }}
        onClose={() => setSelected(null)}
      >
        <div className="modal-box">
          <h2 id="delete-studio-title" className="text-xl font-bold">
            Delete this studio?
          </h2>

          <p id="delete-studio-description" className="mt-4 opacity-75">
            “{selected?.title}” will be permanently removed from your
            listings. This cannot be undone.
          </p>

          <div className="modal-action">
            <button
              type="button"
              className="btn"
              disabled={deleting}
              onClick={closeDelete}
              autoFocus
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-error"
              disabled={deleting}
              onClick={deleteStudio}
            >
              {deleting && (
                <span className="loading loading-spinner loading-sm" />
              )}
              {deleting ? "Deleting..." : "Delete studio"}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}