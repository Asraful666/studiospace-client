"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";

const WishlistContext = createContext(null);

export default function WishlistProvider({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const userId = session?.user?.id;

  return (
    <WishlistStore
      key={userId || "guest"}
      userId={userId}
      authPending={isPending}
    >
      {children}
    </WishlistStore>
  );
}

function WishlistStore({ userId, authPending, children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState([]);

  const locks = useRef(new Set());
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    const controller = new AbortController();

    if (userId) {
      apiRequest("/api/wishlist", {
        signal: controller.signal,
      })
        .then((result) => {
          if (!controller.signal.aborted) {
            setItems(result.data);
          }
        })
        .catch((err) => {
          if (!controller.signal.aborted) {
            setError(err.message);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });
    }

    return () => {
      active.current = false;
      controller.abort();
    };
  }, [userId, attempt]);

  function reload() {
    if (locks.current.size) return;

    setError("");
    setLoading(true);
    setAttempt((value) => value + 1);
  }

  async function toggle(id) {
    if (
      !userId ||
      loading ||
      error ||
      locks.current.has(id)
    ) {
      return;
    }

    const saved = items.some((item) => item.studioId === id);

    locks.current.add(id);
    setBusy([...locks.current]);

    try {
      const result = await apiRequest(`/api/wishlist/${id}`, {
        method: saved ? "DELETE" : "PUT",
      });

      if (active.current) {
        setItems((current) =>
          saved
            ? current.filter((item) => item.studioId !== id)
            : [
                result.data,
                ...current.filter((item) => item.studioId !== id),
              ]
        );
      }

      return saved
        ? "Studio removed from saved studios."
        : "Studio saved.";
    } finally {
      locks.current.delete(id);

      if (active.current) {
        setBusy([...locks.current]);
      }
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        userId,
        items,
        loading: loading || authPending,
        error,
        busy,
        reload,
        toggle,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}