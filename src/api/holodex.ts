import type {
  Channel,
  Video,
  LiveVideosParams,
  VideosParams,
  ChannelsParams,
} from "../types/holodex";

async function apiFetch<T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) searchParams.set(k, String(v));
    });
  }

  const url = `${path}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  console.log("apiFetch:", url); // add this

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json = await res.json();
  return json;
  // return res.json();
}

export async function getLiveVideos(
  params: LiveVideosParams = {},
): Promise<Video[]> {
  return apiFetch<Video[]>(
    "/api/live",
    params as Record<string, string | number>,
  );
}

export async function getChannels(
  params: ChannelsParams = {},
): Promise<Channel[]> {
  return apiFetch<Channel[]>(
    "/api/channels",
    params as Record<string, string | number>,
  );
}

export async function getChannel(id: string): Promise<Channel> {
  return apiFetch<Channel>(`/api/channels/${id}`);
}

export async function getVideos(params: VideosParams = {}): Promise<Video[]> {
  return apiFetch<Video[]>(
    "/api/videos",
    params as Record<string, string | number>,
  );
}

export async function searchVideos(body: {
  q?: string;
  channel_id?: string[];
  target?: string[];
  topic?: string[];
  offset?: number;
  limit?: number;
}): Promise<Video[]> {
  const bodyPayload = JSON.stringify(body);
  console.log("search body:", bodyPayload);
  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Search error: ${res.status}`);
  return res.json();
}
