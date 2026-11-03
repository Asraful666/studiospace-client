"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "@/components/Logo";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const navigation = [
  { label: "Explore studios", href: "/studios" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About us", href: "/#about" },
  { label: "Creator support", href: "/#creator-support" },
  { label: "Host your space", href: "/add-studio" },
  { label: "Terms & platform notice", href: "/terms" },
];

function GithubIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.52 11.52 0 0 1 12 6.098c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.807 5.628-5.479 5.925.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.597 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932 6.064-6.933ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const savingRef = useRef(false);

  async function handleSubscribe(event) {
    event.preventDefault();

    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    setMessage("");
    setError("");

    try {
      // Public endpoint: no login or JWT is required.
      const response = await fetch(`${API_URL}/api/newsletter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          consent,
        }),
      });

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error("The server returned an unexpected response.");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save your email.");
      }

      setMessage(result.message);
      setEmail("");
      setConsent(false);
      toast.success("Your email is on the interest list.");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  function shareOnX() {
    const query = new URLSearchParams({
      text: "Discover creative spaces with StudioSpace.",
    });

    const localHosts = ["localhost", "127.0.0.1", "[::1]"];

    if (!localHosts.includes(window.location.hostname)) {
      query.set("url", window.location.origin);
    }

    window.open(
      `https://x.com/intent/tweet?${query.toString()}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="site-container py-14">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Logo />

            <p className="mt-5 max-w-sm text-sm leading-7 opacity-70">
              A space for every creative idea. Discover studios for your
              next shoot, recording session, or hands-on workshop.
            </p>

            <p className="mt-4 text-sm font-semibold">
              Find your space. Make your mark.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://github.com/Asraful666"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-square btn-sm"
                aria-label="Visit the developer's GitHub profile"
                title="Developer GitHub"
              >
                <GithubIcon />
              </a>

              <button
                type="button"
                className="btn btn-outline btn-square btn-sm"
                onClick={shareOnX}
                aria-label="Share StudioSpace on X"
                title="Share on X"
              >
                <XIcon />
              </button>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-base font-bold">
              Explore StudioSpace
            </h2>

            <ul className="mt-5 space-y-3">
              {navigation.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="link link-hover text-sm opacity-75 hover:opacity-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Studio categories">
            <h2 className="text-base font-bold">
              Studio categories
            </h2>

            <ul className="mt-5 space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="link link-hover text-sm opacity-75 hover:opacity-100"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-base font-bold">Stay inspired</h2>

            <p className="mt-5 text-sm leading-7 opacity-70">
              Join the interest list for future studio updates.
              Newsletter emails are not being sent yet.
            </p>

            <form onSubmit={handleSubscribe} className="mt-5">
              <fieldset disabled={saving}>
                <label
                  htmlFor="newsletter-email"
                  className="text-sm font-medium"
                >
                  Email address
                </label>

                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="input input-bordered mt-2 w-full"
                  placeholder="you@example.com"
                  maxLength={254}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />

                <label className="mt-4 flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm mt-1"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    required
                  />

                  <span className="text-xs leading-6 opacity-75">
                    I agree to have my email stored on the StudioSpace
                    newsletter interest list.
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn btn-primary mt-4 w-full"
                >
                  {saving ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <ArrowUpRight size={17} aria-hidden="true" />
                  )}

                  {saving ? "Saving..." : "Join interest list"}
                </button>
              </fieldset>

              {message && (
                <p role="status" className="mt-3 text-sm text-success">
                  {message}
                </p>
              )}

              {error && (
                <p role="alert" className="mt-3 text-sm text-error">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-base-300 pt-6 text-sm opacity-65 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 StudioSpace. All rights reserved.</p>

          <Link href="/terms" className="link link-hover">
            Educational demo · Terms & platform notice
          </Link>
        </div>
      </div>
    </footer>
  );
}