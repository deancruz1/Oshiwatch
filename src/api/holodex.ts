import type { Channel, Video, LiveVideosParams, VideosParams, ChannelsParams } from '../types/holodex'

async function apiFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const searchParams = new URLSearchParams()
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) searchParams.set(k, String(v))
    })
  }

  const url = `${path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

export async function getLiveVideos(params: LiveVideosParams = {}): Promise<Video[]> {
  return apiFetch<Video[]>('/api/live', params as Record<string, string | number>)
}

export async function getChannels(params: ChannelsParams = {}): Promise<Channel[]> {
  return apiFetch<Channel[]>('/api/channels', params as Record<string, string | number>)
}

export async function getChannel(id: string): Promise<Channel> {
  return apiFetch<Channel>(`/api/channels/${id}`)
}

export async function getVideos(params: VideosParams = {}): Promise<Video[]> {
  return apiFetch<Video[]>('/api/videos', params as Record<string, string | number>)
}
