"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const amenities = [
  "WiFi",
  "Air Conditioning",
  "Natural Light",
  "Parking",
  "Changing Room",
  "Lighting Equipment",
  "Backdrops",
  "Microphones",
  "Headphones",
  "Audio Interface",
  "Work Tables",
  "Wash Area",
];

export default function AddStudioForm() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const busy = uploading || saving;

  async function uploadImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      toast.error("Choose a JPEG, PNG, or WebP image up to 5 MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("image", file);

      const result = await apiRequest("/api/uploads", {
        method: "POST",
        body: form,
      });

      setImageUrl(result.imageUrl);
      toast.success("Image uploaded.");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      if (err.status === 401) refetch();
    } finally {
      setUploading(false);
    }
  }

  async function submitStudio(event) {
    event.preventDefault();
    if (busy) return;

    const form = new FormData(event.currentTarget);

    const payload = {
      title: String(form.get("title")).trim(),
      category: String(form.get("category")),
      hourlyRate: Number(form.get("hourlyRate")),
      securityDeposit: Number(form.get("securityDeposit")),
      maxCapacity: Number(form.get("maxCapacity")),
      location: String(form.get("location")).trim(),
      overview: String(form.get("overview")).trim(),
      imageUrl: imageUrl.trim(),
      amenities: form.getAll("amenities"),
    };

    setSaving(true);
    setError("");

    try {
      await apiRequest("/api/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("Studio added successfully!");
      router.replace("/my-listings");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      if (err.status === 401) refetch();
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="site-container section-space">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-sm font-semibold text-primary">
          Make room for other creators
        </p>
        <h1 className="section-title">List your studio.</h1>
        <p className="section-description mt-4">
          Share the details that help creators find the right space.
        </p>

        <form
          onSubmit={submitStudio}
          className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8"
        >
          <fieldset disabled={busy} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Host name
                <input
                  readOnly
                  value={session?.user.name || ""}
                  className="input input-bordered mt-2 w-full bg-base-200"
                />
              </label>

              <label className="block text-sm font-semibold">
                Host email
                <input
                  readOnly
                  value={session?.user.email || ""}
                  className="input input-bordered mt-2 w-full bg-base-200"
                />
              </label>
            </div>

            <label className="block text-sm font-semibold">
              Studio title
              <input
                name="title"
                required
                minLength={3}
                maxLength={120}
                placeholder="e.g. Riverside Photography Studio"
                className="input input-bordered mt-2 w-full"
              />
            </label>

            <label className="block text-sm font-semibold">
              Category
              <select
                name="category"
                required
                defaultValue=""
                className="select select-bordered mt-2 w-full"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-5 sm:grid-cols-3">
              {[
                ["hourlyRate", "Hourly rate ($)", "0.01", "100000", "0.01"],
                ["securityDeposit", "Security deposit ($)", "0", "100000", "0.01"],
                ["maxCapacity", "Maximum guests", "1", "1000", "1"],
              ].map(([name, label, min, max, step]) => (
                <label key={name} className="block text-sm font-semibold">
                  {label}
                  <input
                    name={name}
                    type="number"
                    required
                    min={min}
                    max={max}
                    step={step}
                    defaultValue={name === "securityDeposit" ? 0 : undefined}
                    className="input input-bordered mt-2 w-full"
                  />
                </label>
              ))}
            </div>

            <label className="block text-sm font-semibold">
              Location / address
              <input
                name="location"
                required
                minLength={3}
                maxLength={300}
                placeholder="Street, area, city"
                className="input input-bordered mt-2 w-full"
              />
            </label>

            <div className="rounded-xl border border-dashed border-base-300 p-5">
              <label className="block text-sm font-semibold">
                <span className="mb-3 flex items-center gap-2">
                  <Upload size={18} />
                  Upload studio image
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={uploadImage}
                  className="file-input file-input-bordered w-full"
                />
              </label>
              <p className="mt-2 text-xs opacity-65">
                JPEG, PNG or WebP. Maximum 5 MB. Uploaded images are hosted on ImgBB.
              </p>

              {uploading && (
                <p role="status" className="mt-3 text-sm text-primary">
                  Uploading image...
                </p>
              )}
            </div>

            <label className="block text-sm font-semibold">
              Image URL
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Upload a photo above or paste its URL"
                className="input input-bordered mt-2 w-full"
              />
            </label>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">
                Amenities
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block text-sm font-semibold">
              Detailed overview
              <textarea
                name="overview"
                required
                minLength={20}
                maxLength={5000}
                rows={6}
                placeholder="Describe the space, suitable projects, equipment, and important house rules."
                className="textarea textarea-bordered mt-2 w-full"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-xl bg-error/10 p-4 text-sm text-error">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary w-full">
              {busy ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <Plus size={18} />
              )}
              {uploading ? "Uploading..." : saving ? "Saving studio..." : "Publish studio"}
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
}