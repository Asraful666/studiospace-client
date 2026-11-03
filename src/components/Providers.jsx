"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import WishlistProvider from "@/components/WishlistProvider";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark"]}
      storageKey="studiospace-theme"
      disableTransitionOnChange
    >
     <WishlistProvider>{children}</WishlistProvider>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-base-100)",
            color: "var(--color-base-content)",
            border: "1px solid var(--color-base-300)",
            borderRadius: "14px",
          },
        }}
      />
    </ThemeProvider>
  );
}