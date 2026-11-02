"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function GoogleLoginButton({
  destination = "/",
  disabled = false,
}) {
  const [busy, setBusy] = useState(false);

  async function loginWithGoogle() {
    if (busy || disabled) return;

    setBusy(true);

    try {
      const callback = new URL(
        "/auth/callback",
        window.location.origin
      );

      callback.searchParams.set("next", destination);

      const failure = new URL(
        "/auth/callback",
        window.location.origin
      );

      failure.searchParams.set("failed", "1");
      failure.searchParams.set("next", destination);

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: callback.toString(),
        errorCallbackURL: failure.toString(),
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Could not start Google login."
        );
      }

      // Browser now redirects to Google.
    } catch (error) {
      toast.error(error.message || "Google login failed.");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy || disabled}
      onClick={loginWithGoogle}
      className="btn btn-outline w-full"
    >
      {busy ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <span aria-hidden="true" className="text-lg font-bold">
          G
        </span>
      )}

      {busy ? "Opening Google..." : "Continue with Google"}
    </button>
  );
}