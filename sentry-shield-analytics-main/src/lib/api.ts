function getBackendURL() {
  const { hostname } = window.location;

  // If frontend is opened on localhost
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://127.0.0.1:8000";
  }

  // If frontend is opened via network IP
  return `http://${hostname}:8000`;
}

const BACKEND_URL = getBackendURL();

export interface PredictResponse {
  prediction: "Intrusion Detected" | "Normal Traffic";
  probability: number[];
}

export async function predictTraffic(
  data: Record<string, number>
): Promise<PredictResponse> {
  let response: Response;

  try {
    response = await fetch(`${BACKEND_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
  } catch {
    throw new Error("Backend server is not reachable");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Backend error (${response.status}): ${text}`);
  }

  return response.json();
}
