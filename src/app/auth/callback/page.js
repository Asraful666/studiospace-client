import AuthCallback from "@/components/AuthCallback";

export const metadata = {
  title: "Completing Login",
};

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
      ["/login", "/register"].includes(url.pathname) ||
      url.pathname.startsWith("/auth/")
    ) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export default async function CallbackPage({ searchParams }) {
  const params = await searchParams;

  return (
    <AuthCallback
      destination={safeDestination(params.next)}
      failed={params.failed === "1" || Boolean(params.error)}
    />
  );
}