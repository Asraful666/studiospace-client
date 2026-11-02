const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

async function readResponse(response) {
  let result;

  try {
    result = await response.json();
  } catch {
    const error = new Error(
      "The server returned an unexpected response."
    );

    error.status = response.status;
    throw error;
  }

  if (!response.ok || !result.success) {
    const error = new Error(
      result.message || "The request could not be completed."
    );

    error.status = response.status;
    throw error;
  }

  return result;
}

export async function apiRequest(path, options = {}) {
  if (!path.startsWith("/api/")) {
    throw new Error("API path must start with /api/.");
  }

  // Obtain an HTTPOnly JWT cookie using the current Better Auth session.
  const tokenResponse = await fetch(`${API_URL}/api/token`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    signal: options.signal,
  });

  await readResponse(tokenResponse);

  // Send the actual request with session and JWT cookies.
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    cache: "no-store",
  });

  return readResponse(response);
}