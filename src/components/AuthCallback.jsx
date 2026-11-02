"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AuthCallback({ destination, failed }) {
  const router = useRouter();
  const handled = useRef(false);

  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  useEffect(() => {
    if (handled.current) return;

    if (failed) {
      handled.current = true;
      toast.error("Google login was not completed.");
      return;
    }

    if (isPending || error) return;

    handled.current = true;

    if (!session?.user) {
      toast.error("Login session could not be verified. Please try again.");
      return;
    }

    toast.success(`Welcome, ${session.user.name}!`);
    router.replace(destination);
    router.refresh();
  }, [failed, isPending, error, session, destination, router]);

  const loginHref = `/login?next=${encodeURIComponent(destination)}`;

  if (failed || (!isPending && !error && !session?.user)) {
    return (
      <section className="site-container section-space text-center">
        <h1 className="section-title">Login was not completed.</h1>
        <p className="mt-4 opacity-65">
          Please return to login and try again.
        </p>
        <Link href={loginHref} className="btn btn-primary mt-6">
          Return to login
        </Link>
      </section>
    );
  }

  if (error) {
    return (
      <section className="site-container section-space text-center">
        <h1 className="section-title">Unable to check your session.</h1>
        <p className="mt-4 opacity-65">
          Check your connection and try again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="btn btn-primary mt-6"
        >
          Retry session check
        </button>
      </section>
    );
  }

  return (
    <section
      role="status"
      className="site-container section-space text-center"
    >
      <span className="loading loading-spinner loading-lg text-primary" />
      <h1 className="mt-5 text-2xl font-bold">
        Completing your login...
      </h1>
      <p className="mt-3 opacity-65">
        Please wait while we verify your session.
      </p>
    </section>
  );
}