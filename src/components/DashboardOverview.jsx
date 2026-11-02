"use client";

import Link from "next/link";
import {
  Plus,
  Building2,
  CalendarDays,
  CalendarCheck,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const actions = [
  {
    title: "Host a creative space",
    description:
      "Share your studio, equipment, and amenities with fellow creators.",
    href: "/add-studio",
    label: "Add new studio",
    icon: Plus,
  },
  {
    title: "Manage your listings",
    description:
      "Keep your studio information, hourly rates, and images up to date.",
    href: "/my-listings",
    label: "My studio listings",
    icon: Building2,
  },
  {
    title: "Plan your next session",
    description:
      "Review your reservations and follow their booking status.",
    href: "/my-bookings",
    label: "My bookings",
    icon: CalendarDays,
  },
  {
    title: "Manage guest requests",
    description:
      "Review, confirm, or reject booking requests for your studios.",
    href: "/host-bookings",
    label: "Booking Requests",
    icon: CalendarCheck,
  },
];

export default function DashboardOverview() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <section className="site-container section-space">
      <div className="mb-10">
        <p className="mb-3 text-sm font-semibold text-primary">
          Your creative workspace
        </p>

        <h1 className="section-title">
          Welcome, {user.name}.
        </h1>

        <p className="section-description mt-4">
          Manage your spaces and make room for your next creative project.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-base-300 bg-base-100 p-6">
        <h2 className="text-lg font-bold">Account details</h2>

        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm opacity-60">Name</dt>
            <dd className="mt-1 break-words font-semibold">
              {user.name}
            </dd>
          </div>

          <div>
            <dt className="text-sm opacity-60">Email address</dt>
            <dd className="mt-1 break-all font-semibold">
              {user.email}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map(({ title, description, href, label, icon: Icon }) => (
          <article
            key={href}
            className="flex flex-col rounded-2xl border border-base-300 bg-base-100 p-6"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon size={24} aria-hidden="true" />
            </span>

            <h2 className="mt-5 text-xl font-bold">{title}</h2>

            <p className="mt-3 text-sm leading-7 opacity-65">
              {description}
            </p>

            <div className="mt-auto pt-6">
              <Link href={href} className="btn btn-outline w-full">
                {label}
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/studios" className="btn btn-primary">
          Explore studios
          <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}