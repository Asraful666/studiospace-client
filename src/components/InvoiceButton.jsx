"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { apiRequest } from "@/lib/api";

export default function InvoiceButton({ booking }) {
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);

  if (!["Confirmed", "Completed"].includes(booking.status)) {
    return null;
  }

  async function download() {
    if (locked.current) return;

    locked.current = true;
    setBusy(true);

    try {
      const blob = await apiRequest(
        `/api/bookings/${booking._id}/invoice`,
        {},
        "blob"
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `StudioSpace-booking-${booking._id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 60000);

      toast.success("Booking PDF download started.");
    } catch (error) {
      toast.error(
        error.message || "Could not download the receipt."
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-outline btn-sm"
      disabled={busy}
      onClick={download}
    >
      {busy ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        <Download size={16} aria-hidden="true" />
      )}

      {busy ? "Preparing PDF..." : "Download receipt PDF"}
    </button>
  );
}