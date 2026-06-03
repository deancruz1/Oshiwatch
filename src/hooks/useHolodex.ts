import { useQuery } from '@tanstack/react-query'
import { getLiveVideos, getChannels, getChannel, getVideos } from '../api/holodex'
import type { LiveVideosParams, VideosParams, ChannelsParams } from '../types/holodex'

export function useLiveVideos(params: LiveVideosParams = {}) {
  return useQuery({
    queryKey: ['live', params],
    queryFn: () => getLiveVideos(params),
    refetchInterval: 5 * 60 * 1000, // poll every 5 minutes
    staleTime: 60 * 1000,
  })
}

export function useChannels(params: ChannelsParams = {}) {
  return useQuery({
    queryKey: ['channels', params],
    queryFn: () => getChannels(params),
    staleTime: 10 * 60 * 1000, // channels don't change often
  })
}

export function useChannel(id: string) {
  return useQuery({
    queryKey: ['channel', id],
    queryFn: () => getChannel(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  })
}

export function useVideos(params: VideosParams = {}) {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: () => getVideos(params),
    staleTime: 5 * 60 * 1000,
    enabled: Object.keys(params).length > 0,
  })
}
