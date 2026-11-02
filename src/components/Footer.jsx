import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/Logo";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="site-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />

          <p className="mt-5 text-sm leading-7 opacity-70">
            A space for every creative idea. Discover studios for your next
            shoot, recording session, or hands-on workshop.
          </p>

          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">
            Find your space. Make your mark.
          </p>
        </div>

        <div>
          <h2 className="mb-5 font-bold">Explore StudioSpace</h2>

          <ul className="space-y-3">
            <li>
              <Link href="/studios" className="footer-link">
                Explore studios
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="footer-link">
                How it works
              </Link>
            </li>
            <li>
              <Link href="/#about" className="footer-link">
                About us
              </Link>
            </li>
            <li>
              <Link href="/add-studio" className="footer-link">
                Host your space
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-5 font-bold">Studio categories</h2>

          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/studios?category=${encodeURIComponent(category)}`}
                  className="footer-link"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 font-bold">Stay inspired</h2>

          <p className="mb-4 text-sm leading-7 opacity-70">
            Studio discoveries and ideas for your next creative project.
          </p>

          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>

          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="Your email address"
            className="input input-bordered w-full bg-base-200"
            aria-describedby="newsletter-status"
          />

          <button
            type="button"
            className="btn btn-primary mt-3 w-full"
            disabled
          >
            Subscribe
            <ArrowUpRight size={17} />
          </button>

          <p id="newsletter-status" className="mt-2 text-xs opacity-60">
            Newsletter subscriptions are coming soon.
          </p>
        </div>
      </div>

      <div className="border-t border-base-300">
        <div className="site-container flex flex-col gap-3 py-6 text-xs opacity-65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>A place to create something extraordinary.</p>
        </div>
      </div>
    </footer>
  );
}