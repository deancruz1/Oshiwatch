import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  getLiveVideos,
  getChannels,
  getChannel,
  getVideos,
} from "../api/holodex";
import type {
  LiveVideosParams,
  VideosParams,
  ChannelsParams,
  Channel,
} from "../types/holodex";

export function useLiveVideos(params: LiveVideosParams = {}) {
  return useQuery({
    queryKey: ["live", params],
    queryFn: () => getLiveVideos(params),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}

export function useChannels(params: ChannelsParams = {}) {
  return useQuery({
    queryKey: ["channels", params],
    queryFn: () => getChannels(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function useAllChannels() {
  return useQuery({
    queryKey: ["channels", "all"],
    queryFn: async (): Promise<Channel[]> => {
      const [page1, page2, page3] = await Promise.all([
        getChannels({ org: "Hololive", limit: 50, offset: 0, type: "vtuber" }),
        getChannels({ org: "Hololive", limit: 50, offset: 50, type: "vtuber" }),
        getChannels({
          org: "Hololive",
          limit: 50,
          offset: 100,
          type: "vtuber",
        }),
      ]);
      const all = [...page1, ...page2, ...page3];
      return all.sort((a, b) => {
        const nameA = (a.english_name ?? a.name).toLowerCase();
        const nameB = (b.english_name ?? b.name).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    },
    staleTime: 10 * 60 * 1000,
  });
}
export function useChannel(id: string) {
  return useQuery({
    queryKey: ["channel", id],
    queryFn: () => getChannel(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}

export function useVideos(params: VideosParams = {}) {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: () => getVideos(params),
    staleTime: 5 * 60 * 1000,
    enabled: Object.keys(params).length > 0,
  });
}

export function useInfiniteVideos(params: VideosParams = {}) {
  return useInfiniteQuery({
    queryKey: ["videos-infinite", params],
    queryFn: ({ pageParam = 0 }) =>
      getVideos({ ...params, limit: 50, offset: pageParam }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length === 50 ? pages.length * 50 : undefined,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
    enabled: Object.keys(params).length > 0,
  });
}

export function useChannelLiveStatus(channelId: string) {
  return useQuery({
    queryKey: ["live", "channel", channelId],
    queryFn: () =>
      getLiveVideos({ channel_id: channelId, include: "live_info" }),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
    enabled: !!channelId,
  });
}
