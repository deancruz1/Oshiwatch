import type { VercelRequest, VercelResponse } from "./_types";

const HOLODEX_BASE = "https://holodex.net/api/v2";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.HOLODEX_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch(`${HOLODEX_BASE}/search/video`, {
      method: "POST",
      headers: {
        "X-APIKEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Holodex API error", detail: text });
    }

    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to search Holodex", detail: String(err) });
  }
}
