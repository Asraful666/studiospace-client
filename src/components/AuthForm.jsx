"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Aperture } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

function safeDestination(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020]/.test(value)
  ) {
    return "/";
  }

  try {
    const base = "https://studiospace.example";
    const url = new URL(value, base);

    if (
      url.origin !== base ||
      ["/login", "/register"].includes(url.pathname)
    ) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export default function AuthForm({ mode, next = "/" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const destination = safeDestination(next);

  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;

    setError("");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "").trim();
    const image = String(form.get("image") || "").trim();

    if (
      isRegister &&
      (
        password.length < 6 ||
        password.length > 128 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      )
    ) {
      const message =
        "Password must be 6–128 characters with uppercase and lowercase letters.";

      setError(message);
      toast.error(message);
      return;
    }

    if (isRegister && !name) {
      setError("Please enter your name.");
      return;
    }

    if (isRegister && image) {
      try {
        const url = new URL(image);

        if (!["https:", "http:"].includes(url.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        setError("Please enter a valid HTTP or HTTPS photo URL.");
        return;
      }
    }

    setBusy(true);

    try {
      if (isRegister) {
        const result = await authClient.signUp.email({
          name,
          email,
          password,
          ...(image ? { image } : {}),
        });

        if (result.error) {
          throw new Error(result.error.message || "Registration failed.");
        }

        toast.success("Account created! Please log in.");

        router.replace(
          `/login?next=${encodeURIComponent(destination)}`
        );
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
          rememberMe: true,
        });

        if (result.error) {
          throw new Error(result.error.message || "Login failed.");
        }

        toast.success("Welcome back!");
        router.replace(destination);
        router.refresh();
      }
    } catch (err) {
      const message =
        err instanceof TypeError
          ? "Unable to connect. Please check your connection and try again."
          : err.message || "Something went wrong.";

      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  const alternateLink = isRegister
    ? `/login?next=${encodeURIComponent(destination)}`
    : `/register?next=${encodeURIComponent(destination)}`;

  return (
    <section className="site-container section-space">
      <div className="mx-auto max-w-lg rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-10">
        <div className="mb-7">
          <span className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Aperture size={28} />
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight">
            {isRegister ? "Make room for creativity." : "Welcome back."}
          </h1>

          <p className="mt-3 text-sm leading-7 opacity-65">
            {isRegister
              ? "Create your StudioSpace account and discover your next creative setting."
              : "Log in to manage your spaces and upcoming creative sessions."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <fieldset disabled={busy} className="space-y-5">
            {isRegister && (
              <>
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-semibold">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={100}
                    className="input input-bordered w-full"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="image" className="mb-2 block text-sm font-semibold">
                    Photo URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    required
                    className="input input-bordered w-full"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input input-bordered w-full"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  required
                  maxLength={128}
                  aria-describedby={isRegister ? "password-help" : undefined}
                  className="input input-bordered w-full pr-14"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded-lg p-3"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isRegister ? (
                <p id="password-help" className="mt-2 text-xs leading-5 opacity-65">
                  Use 6–128 characters, including uppercase and lowercase letters.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    toast("Password reset is not available yet.")
                  }
                  className="mt-3 text-sm font-semibold text-primary"
                >
                  Forgot Password?
                </button>
              )}
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-error/10 p-3 text-sm text-error"
              >
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary w-full">
              {busy && <span className="loading loading-spinner loading-sm" />}
              {busy
                ? "Please wait..."
                : isRegister
                  ? "Create account"
                  : "Log in"}
            </button>
          </fieldset>
        </form>

        <p className="mt-7 text-center text-sm opacity-80">
          {isRegister ? "Already have an account? " : "New to StudioSpace? "}
          <Link href={alternateLink} className="font-semibold text-primary">
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}