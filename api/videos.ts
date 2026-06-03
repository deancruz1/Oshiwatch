import type { VercelRequest, VercelResponse } from './_types'

const HOLODEX_BASE = 'https://holodex.net/api/v2'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.HOLODEX_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const params = new URLSearchParams(req.query as Record<string, string>)

  try {
    const response = await fetch(`${HOLODEX_BASE}/videos?${params.toString()}`, {
      headers: { 'X-APIKEY': apiKey },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Holodex API error' })
    }

    const data = await response.json()
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300')
    return res.status(200).json(data)
  } catch {
    return res.status(500).json({ error: 'Failed to fetch from Holodex' })
  }
}
