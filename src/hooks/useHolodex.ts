import { useQuery } from "@tanstack/react-query";
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
      console.log(
        "Mel:",
        JSON.stringify(
          all.find((c) => c.english_name?.toLowerCase().includes("mel")),
          null,
          2,
        ),
      );
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
