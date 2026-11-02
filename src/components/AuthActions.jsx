"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const menuLinks = [
  ["Dashboard", "/dashboard"],
  ["Add New Studio", "/add-studio"],
  ["My Studio Listings", "/my-listings"],
  ["My Bookings", "/my-bookings"],
];

export default function AuthActions({ onNavigate }) {
  const router = useRouter();
  const menuRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [failedImage, setFailedImage] = useState("");

  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  function closeMenu() {
    if (menuRef.current) menuRef.current.open = false;
    onNavigate?.();
  }

  async function logout() {
    if (busy) return;
    setBusy(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message || "Logout failed.");
      }

      closeMenu();
      toast.success("Logged out successfully.");
      router.replace("/");
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Could not log out. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (isPending) {
    return (
      <div role="status" aria-label="Checking login">
        <div className="skeleton h-10 w-24 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <button
        type="button"
        onClick={() => refetch()}
        className="btn btn-ghost btn-sm"
      >
        Retry account
      </button>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" onClick={closeMenu} className="btn btn-ghost">
          Log in
        </Link>

        <Link href="/register" onClick={closeMenu} className="btn btn-primary">
          Get started
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <details
      ref={menuRef}
      className="dropdown dropdown-end"
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          if (menuRef.current) menuRef.current.open = false;
        }
      }}
    >
      <summary
        className="btn btn-ghost gap-2"
        aria-label={`Open account menu for ${user.name}`}
      >
        {user.image && failedImage !== user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            width={32}
            height={32}
            onError={() => setFailedImage(user.image)}
            className="size-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-content">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </span>
        )}

        <span className="max-w-24 truncate">{user.name}</span>
      </summary>

      <ul className="menu dropdown-content z-[60] mt-3 w-60 rounded-2xl border border-base-300 bg-base-100 p-3 shadow-xl">
        <li className="menu-title break-all">{user.name}</li>

        {menuLinks.map(([label, href]) => (
          <li key={href}>
            <Link href={href} onClick={closeMenu}>
              {label}
            </Link>
          </li>
        ))}

        <li className="mt-2 border-t border-base-300 pt-2">
          <button
            type="button"
            disabled={busy}
            onClick={logout}
            className="text-error"
          >
            {busy ? "Logging out..." : "Log out"}
          </button>
        </li>
      </ul>
    </details>
  );
}