import Link from "next/link";
import { SearchX } from "lucide-react";

export default function StudioNotFound() {
  return (
    <section className="site-container section-space text-center">
      <SearchX size={54} className="mx-auto text-primary" />

      <p className="mt-6 text-sm font-semibold text-primary">404</p>

      <h1 className="section-title mt-3">Studio not found.</h1>

      <p className="mx-auto mt-5 max-w-md leading-7 opacity-65">
        This studio may have been removed, or the link may be incorrect.
        Explore other spaces for your next project.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/studios" className="btn btn-primary">
          Explore studios
        </Link>

        <Link href="/" className="btn btn-outline">
          Return to Home
        </Link>
      </div>
    </section>
  );
}