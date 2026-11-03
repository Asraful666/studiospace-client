import Link from "next/link";
import { Aperture, ArrowUpRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="site-container section-space">
      <div className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center text-center">
        <div className="flex size-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Aperture size={54} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.25em] text-primary">
          Error 404
        </p>

        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          This space could not be found.
        </h1>

        <p className="mt-5 max-w-lg leading-7 opacity-70">
          The page may have moved, or the address may be incorrect.
          Find your way back and discover a space for your next idea.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <Home size={18} aria-hidden="true" />
            Back to home
          </Link>

          <Link href="/studios" className="btn btn-outline">
            Explore studios
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}