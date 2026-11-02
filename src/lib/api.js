const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    cache: "no-store",
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("The server returned an unexpected response.");
  }

  if (!response.ok || !result.success) {
    const error = new Error(
      result.message || "Request failed. Please try again."
    );
    error.status = response.status;
    throw error;
  }

  return result;
}