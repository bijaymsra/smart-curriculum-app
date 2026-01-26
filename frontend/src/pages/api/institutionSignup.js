import API_BASE from "../../config/api";

export async function registerInstitution(payload) {
  const response = await fetch(
    `${API_BASE}/api/signup/institution`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Registration failed");
  }

  return response.text();
}
