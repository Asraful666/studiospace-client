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

export async function apiRequest(
  path,
  options = {},
  responseType = "json"
) {
  if (!path.startsWith("/api/")) {
    throw new Error("API path must start with /api/.");
  }

  const tokenResponse = await fetch(`${API_URL}/api/token`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    signal: options.signal,
  });

  await readResponse(tokenResponse);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    cache: "no-store",
  });

  if (responseType === "blob" && response.ok) {
    if (
      !response.headers
        .get("content-type")
        ?.includes("application/pdf")
    ) {
      throw new Error(
        "The server did not return a PDF. Please try again."
      );
    }

    return response.blob();
  }

  return readResponse(response);
}