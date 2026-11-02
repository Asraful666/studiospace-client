"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function StudioError({ reset }) {
  return (
    <section className="site-container section-space text-center">
      <h1 className="section-title">
        This space could not be loaded.
      </h1>

      <p className="mt-5 leading-7 opacity-65">
        Please try again in a moment.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="btn btn-primary"
        >
          <RefreshCw size={17} />
          Try again
        </button>

        <Link href="/studios" className="btn btn-outline">
          Back to studios
        </Link>
      </div>
    </section>
  );
}