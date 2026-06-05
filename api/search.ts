import type { VercelRequest, VercelResponse } from "./_types";

const HOLODEX_BASE = "https://holodex.net/api/v2";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.HOLODEX_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = await new Promise<string>((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => resolve(data));
      req.on("error", reject);
    });

    const parsed = JSON.parse(body);

    const response = await fetch(`${HOLODEX_BASE}/search/video`, {
      method: "POST",
      headers: {
        "X-APIKEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Holodex API error" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to search Holodex", detail: String(err) });
  }
}
