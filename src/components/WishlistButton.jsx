"use client";

import { Heart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { useWishlist } from "@/components/WishlistProvider";

export default function WishlistButton({
  studioId,
  title = "studio",
}) {
  const {
    userId,
    items,
    loading,
    error,
    busy,
    reload,
    toggle,
  } = useWishlist();

  const router = useRouter();
  const pathname = usePathname();

  const saved = items.some(
    (item) => item.studioId === studioId
  );

  const pending = busy.includes(studioId);

  async function onClick() {
    if (!userId) {
      toast.error("Please log in to save studios.");

      router.push(
        `/login?next=${encodeURIComponent(pathname)}`
      );

      return;
    }

    if (error) {
      reload();
      return;
    }

    try {
      const message = await toggle(studioId);

      if (message) toast.success(message);
    } catch (err) {
      toast.error(
        err.message || "Could not update saved studios."
      );
    }
  }

  const label = error
    ? "Retry loading saved studios"
    : `${saved ? "Unsave" : "Save"} ${title}`;

  return (
    <button
      type="button"
      className="btn btn-circle btn-sm bg-base-100 text-primary shadow"
      aria-label={label}
      title={label}
      aria-pressed={saved}
      disabled={loading || pending}
      onClick={onClick}
    >
      {pending || loading ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        <Heart
          size={18}
          fill={saved ? "currentColor" : "none"}
          aria-hidden="true"
        />
      )}
    </button>
  );
}