"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export default function EditStudioForm({ studioId }) {
  const router = useRouter();

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudio() {
      setLoading(true);
      setLoadError("");

      try {
        const result = await apiRequest(
          `/api/manage/studios/${studioId}`,
          { signal: controller.signal }
        );

        if (!controller.signal.aborted) {
          setStudio(result.data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadStudio();

    return () => controller.abort();
  }, [studioId, attempt]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;

    const form = new FormData(event.currentTarget);

    const payload = {
      title: form.get("title").trim(),
      category: form.get("category"),
      hourlyRate: Number(form.get("hourlyRate")),
      securityDeposit: Number(form.get("securityDeposit")),
      maxCapacity: Number(form.get("maxCapacity")),
      location: form.get("location").trim(),
      imageUrl: form.get("imageUrl").trim(),
      overview: form.get("overview").trim(),
      amenities: [
        ...new Set(
          form
            .get("amenities")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        ),
      ],
    };

    if (
      payload.amenities.length > 20 ||
      payload.amenities.some((item) => item.length > 60)
    ) {
      setError("Use up to 20 amenities, each no longer than 60 characters.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await apiRequest(`/api/manage/studios/${studioId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("Studio updated successfully.");
      router.replace("/my-listings");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="site-container section-space">
        <div className="skeleton mx-auto h-96 max-w-3xl rounded-2xl" />
      </section>
    );
  }

  if (loadError || !studio) {
    return (
      <section className="site-container section-space">
        <div className="rounded-2xl border border-base-300 p-8">
          <p role="alert">{loadError || "Studio could not be loaded."}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setAttempt((current) => current + 1)}
            >
              Try again
            </button>
            <Link href="/my-listings" className="btn btn-outline">
              My Listings
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="site-container section-space">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 font-semibold text-primary">Manage your space</p>
        <h1 className="section-title">Edit studio</h1>

        <form
          key={studio._id}
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8"
        >
          <fieldset disabled={saving} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-medium">Host name</span>
                <input
                  className="input input-bordered w-full"
                  value={studio.ownerName ?? ""}
                  readOnly
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-medium">Host email</span>
                <input
                  className="input input-bordered w-full"
                  value={studio.ownerEmail ?? ""}
                  readOnly
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block font-medium">Studio title</span>
              <input
                name="title"
                className="input input-bordered w-full"
                defaultValue={studio.title}
                minLength={3}
                maxLength={120}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-medium">Category</span>
              <select
                name="category"
                className="select select-bordered w-full"
                defaultValue={studio.category}
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-5 sm:grid-cols-3">
              {[
                {
                  name: "hourlyRate",
                  label: "Hourly rate ($)",
                  min: 0.01,
                  max: 100000,
                  step: 0.01,
                },
                {
                  name: "securityDeposit",
                  label: "Security deposit ($)",
                  min: 0,
                  max: 100000,
                  step: 0.01,
                },
                {
                  name: "maxCapacity",
                  label: "Maximum capacity",
                  min: 1,
                  max: 1000,
                  step: 1,
                },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-2 block font-medium">{field.label}</span>
                  <input
                    type="number"
                    name={field.name}
                    className="input input-bordered w-full"
                    defaultValue={studio[field.name]}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    required
                  />
                </label>
              ))}
            </div>

            <label className="block">
              <span className="mb-2 block font-medium">Location</span>
              <input
                name="location"
                className="input input-bordered w-full"
                defaultValue={studio.location}
                minLength={3}
                maxLength={300}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-medium">Cover image URL</span>
              <input
                type="url"
                name="imageUrl"
                className="input input-bordered w-full"
                defaultValue={studio.imageUrl}
                maxLength={2000}
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-medium">Amenities</span>
              <textarea
                name="amenities"
                className="textarea textarea-bordered min-h-32 w-full"
                defaultValue={(studio.amenities ?? []).join("\n")}
                aria-describedby="amenities-help"
              />
              <span
                id="amenities-help"
                className="mt-2 block text-sm opacity-65"
              >
                One amenity per line. Maximum 20 amenities, 60 characters each.
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block font-medium">Overview</span>
              <textarea
                name="overview"
                className="textarea textarea-bordered min-h-40 w-full"
                defaultValue={studio.overview}
                minLength={20}
                maxLength={5000}
                required
              />
            </label>

            {error && (
              <p role="alert" className="text-sm text-error">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <button type="submit" className="btn btn-primary">
                {saving && (
                  <span className="loading loading-spinner loading-sm" />
                )}
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => router.push("/my-listings")}
              >
                Cancel
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}