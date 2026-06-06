import type { VercelRequest, VercelResponse } from "./_types";

const HOLODEX_BASE = "https://holodex.net/api/v2";

async function parseBody(req: VercelRequest): Promise<unknown> {
  // If Vercel already parsed it
  if (req.body) return req.body;

  // Manual parse
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: Buffer) => {
      data += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.HOLODEX_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const body = await parseBody(req);

    const response = await fetch(`${HOLODEX_BASE}/search/video`, {
      method: "POST",
      headers: {
        "X-APIKEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    console.log("holodex raw response:", response.status, text.slice(0, 500));

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
