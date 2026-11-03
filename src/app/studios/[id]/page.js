import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  Check,
  UserRound,
  Clock3,
} from "lucide-react";
import StudioGallery from "@/components/StudioGallery";
import BookingModal from "@/components/BookingModal";
import StudioReviews from "@/components/StudioReviews";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export const metadata = {
  title: "Studio Details",
};

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export default async function StudioDetailsPage({ params }) {
  const { id } = await params;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }

  const response = await fetch(`${API_URL}/api/studios/${id}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });

  if (response.status === 404 || response.status === 400) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Unable to load studio details.");
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error("Unexpected studio response.");
  }

  const studio = result.data;

  const amenities = Array.isArray(studio.amenities)
    ? studio.amenities
    : [];

  const images = [
    studio.imageUrl,
    ...(Array.isArray(studio.gallery) ? studio.gallery : []),
  ];

  return (
    <section className="site-container py-10 sm:py-14">
      <Link
        href="/studios"
        className="mb-7 inline-flex items-center gap-2 text-sm font-semibold hover:text-primary"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to studios
      </Link>

      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="badge badge-primary badge-outline">
            {studio.category}
          </span>

          {studio.isDemo && (
            <span className="badge badge-ghost">Demo listing</span>
          )}
        </div>

        <h1 className="section-title">{studio.title}</h1>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm opacity-70">
          <span className="flex items-center gap-2">
            <MapPin size={17} aria-hidden="true" />
            {studio.location}
          </span>

          <span className="flex items-center gap-2">
            <Users size={17} aria-hidden="true" />
            Up to {studio.maxCapacity} guests
          </span>

          <span className="flex items-center gap-2">
            <Star
              size={17}
              className="text-primary"
              aria-hidden="true"
            />
            {studio.reviewCount > 0
              ? `${Number(studio.rating).toFixed(1)} (${studio.reviewCount} reviews)`
              : "New — no reviews yet"}
          </span>
        </div>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-8">
          <StudioGallery images={images} title={studio.title} />

          <section className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold">About this space</h2>

            <p className="mt-5 whitespace-pre-line leading-8 opacity-75">
              {studio.overview}
            </p>

            {studio.isDemo && (
              <p className="mt-5 rounded-xl bg-base-200 p-4 text-sm leading-6 opacity-70">
                This is a fictional demonstration listing with illustrative
                photography.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold">
              What this space offers
            </h2>

            {amenities.length > 0 ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-3">
                    <span className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Check size={17} aria-hidden="true" />
                    </span>

                    <span className="text-sm">{amenity}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 opacity-65">
                No amenities have been listed yet.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Meet your host</h2>

            <div className="mt-5 flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound size={28} aria-hidden="true" />
              </span>

              <div>
                <h3 className="font-bold">{studio.ownerName}</h3>

                <p className="mt-1 text-sm opacity-65">
                  {studio.isDemo ? "Demonstration host" : "Studio owner"}
                </p>
              </div>
            </div>
          </section>

          <StudioReviews studioId={String(studio._id)} />
        </div>

        <aside className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm lg:sticky lg:top-28">
          <p className="text-sm opacity-65">Hourly studio rental</p>

          <p className="mt-2">
            <span className="text-4xl font-extrabold tracking-tight">
              {money(studio.hourlyRate)}
            </span>

            <span className="ml-2 text-sm opacity-65">/ hour</span>
          </p>

          <dl className="mt-7 space-y-4 border-y border-base-300 py-5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="opacity-65">Security deposit</dt>
              <dd className="font-semibold">
                {money(studio.securityDeposit)}
              </dd>
            </div>

            <div className="flex justify-between gap-3">
              <dt className="opacity-65">Maximum capacity</dt>
              <dd className="font-semibold">
                {studio.maxCapacity} guests
              </dd>
            </div>
          </dl>

          <p className="mt-5 flex items-start gap-2 text-sm leading-6 opacity-65">
            <Clock3
              size={18}
              className="mt-1 shrink-0"
              aria-hidden="true"
            />
            Rental cost depends on the number of hours selected.
            The security deposit is added to the rental amount.
          </p>

          <BookingModal studio={studio} />

          <p className="mt-3 text-center text-xs leading-5 opacity-60">
            Requests start as Pending and require host confirmation.
            No online payment is collected.
          </p>
        </aside>
      </div>
    </section>
  );
}