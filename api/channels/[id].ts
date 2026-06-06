import type { VercelRequest, VercelResponse } from "../_types";

const HOLODEX_BASE = "https://holodex.net/api/v2";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.HOLODEX_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const url = new URL(req.url ?? "/", "http://localhost");
  const segments = url.pathname.split("/");
  const id = segments[segments.length - 1];

  if (!id) {
    return res.status(400).json({ error: "Channel ID required" });
  }

  try {
    const response = await fetch(`${HOLODEX_BASE}/channels/${id}`, {
      headers: { "X-APIKEY": apiKey },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Holodex API error" });
    }

    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: "Failed to fetch from Holodex" });
  }
}
