"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  useEffect(() => {
    if (isPending || error || session?.user) return;

    const destination =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    toast.error("Please log in to continue.", {
      id: "login-required",
    });

    router.replace(
      `/login?next=${encodeURIComponent(destination)}`
    );
  }, [isPending, error, session, pathname, router]);

  if (error) {
    return (
      <section className="site-container section-space text-center">
        <h1 className="section-title">
          Unable to verify your session.
        </h1>

        <p className="mt-4 opacity-65">
          Please check your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="btn btn-primary mt-6"
        >
          Try again
        </button>
      </section>
    );
  }

  if (isPending || !session?.user) {
    return (
      <section
        role="status"
        className="site-container section-space"
      >
        <span className="sr-only">Checking your session...</span>

        <div className="skeleton mb-5 h-12 w-64" />
        <div className="skeleton mb-8 h-5 w-48" />

        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              aria-hidden="true"
              className="skeleton h-48 rounded-2xl"
            />
          ))}
        </div>
      </section>
    );
  }

  return children;
}