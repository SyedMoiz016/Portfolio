const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
export async function submitContact(data) {
  if (!API_URL)
    throw new Error(
      "The contact service is not configured yet. Please try again once the site owner connects the backend.",
    );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    let body;
    try {
      body = await response.json();
    } catch {
      throw new Error(
        "The contact service returned an unexpected response. Please try again later.",
      );
    }
    if (!response.ok) {
      const error = new Error(
        body.message || "Your message could not be sent. Please try again.",
      );
      error.fields = body.errors;
      throw error;
    }
    return body;
  } catch (error) {
    if (error.name === "AbortError")
      throw new Error("The request timed out. Please try again.");
    if (error instanceof TypeError)
      throw new Error(
        "Unable to reach the contact service. Check your connection and try again.",
      );
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
