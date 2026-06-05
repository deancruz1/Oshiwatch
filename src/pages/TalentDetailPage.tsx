import { useParams, Link } from "react-router-dom";
import { useChannel, useInfiniteVideos } from "@/hooks/useHolodex";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VideoCard from "@/components/talent/VideoCard";
import { getGenLabel, getBranchAccent } from "@/lib/talent";
import { cn } from "@/lib/utils";

const MUSIC_TOPICS = ["Original_Song", "Music_Cover"];
const SHORT_TOPICS = ["shorts"];

export default function TalentDetailPage() {
  const { channelId } = useParams<{ channelId: string }>();

  const { data: channel, isLoading: channelLoading } = useChannel(channelId!);

  const {
    data: streamsData,
    fetchNextPage: fetchMoreStreams,
    hasNextPage: hasMoreStreams,
    isFetchingNextPage: loadingMoreStreams,
  } = useInfiniteVideos({
    channel_id: channelId,
    type: "stream",
    status: "past",
  });

  const {
    data: shortsData,
    fetchNextPage: fetchMoreShorts,
    hasNextPage: hasMoreShorts,
    isFetchingNextPage: loadingMoreShorts,
  } = useInfiniteVideos({
    channel_id: channelId,
    type: "stream",
    status: "past",
    topic: "shorts",
  });

  const {
    data: musicData,
    fetchNextPage: fetchMoreMusic,
    hasNextPage: hasMoreMusic,
    isFetchingNextPage: loadingMoreMusic,
  } = useInfiniteVideos({
    channel_id: channelId,
    topic: "Original_Song",
  });

  const {
    data: musicCoversData,
    fetchNextPage: fetchMoreCovers,
    hasNextPage: hasMoreCovers,
    isFetchingNextPage: loadingMoreCovers,
  } = useInfiniteVideos({
    channel_id: channelId,
    topic: "Music_Cover",
  });

  const allStreamVideos = streamsData?.pages.flat() ?? [];
  const allShortsVideos = shortsData?.pages.flat() ?? [];
  const musicFlat = musicData?.pages.flat() ?? [];
  const coversFlat = musicCoversData?.pages.flat() ?? [];

  const allMusic = [
    ...musicFlat,
    ...coversFlat.filter((v) => !musicFlat.find((m) => m.id === v.id)),
  ].sort(
    (a, b) =>
      new Date(b.published_at ?? b.available_at).getTime() -
      new Date(a.published_at ?? a.available_at).getTime(),
  );

  const streams = allStreamVideos
    .filter(
      (v) =>
        !MUSIC_TOPICS.includes(v.topic_id ?? "") &&
        !SHORT_TOPICS.includes(v.topic_id ?? "") &&
        v.duration > 60,
    )
    .sort(
      (a, b) =>
        new Date(b.published_at ?? b.available_at).getTime() -
        new Date(a.published_at ?? a.available_at).getTime(),
    );

  const shorts = allShortsVideos
    .filter((v) => SHORT_TOPICS.includes(v.topic_id ?? "") || v.duration <= 60)
    .sort(
      (a, b) =>
        new Date(b.published_at ?? b.available_at).getTime() -
        new Date(a.published_at ?? a.available_at).getTime(),
    );

  function formatSubs(count?: number): string {
    if (!count) return "";
    if (count >= 1_000_000)
      return `${(count / 1_000_000).toFixed(1)}M subscribers`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K subscribers`;
    return `${count} subscribers`;
  }

  if (channelLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-6">
        <div className="flex gap-5 items-center">
          <Skeleton className="w-24 h-24 rounded-full flex-shrink-0" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-8">
        <p className="text-gray-400">Talent not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 space-y-8">
      tsx
      <div>
        <Link
          to="/talents"
          className="text-sm text-gray-500 hover:text-white transition-colors"
        >
          ← Back to Talents
        </Link>
      </div>
      {/* Header */}
      <div className="flex gap-6 items-center">
        <img
          src={channel.photo}
          alt={channel.english_name ?? channel.name}
          className="w-24 h-24 rounded-full object-cover flex-shrink-0"
        />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            {channel.english_name ?? channel.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                getBranchAccent(channel.group),
              )}
            >
              {getGenLabel(channel.group)}
            </span>
            {channel.subscriber_count && (
              <span className="text-sm text-gray-400">
                {formatSubs(channel.subscriber_count)}
              </span>
            )}
          </div>
          <div className="flex gap-3 text-sm">
            <a
              href={`https://www.youtube.com/channel/${channel.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              YouTube ↗
            </a>
            {channel.twitter && (
              <a
                href={`https://twitter.com/${channel.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Twitter ↗
              </a>
            )}
          </div>
        </div>
      </div>
      {/* Tabs */}
      <Tabs defaultValue="streams">
        <TabsList className="mb-6">
          <TabsTrigger value="streams">Streams</TabsTrigger>
          <TabsTrigger value="shorts">Shorts</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
        </TabsList>

        <TabsContent value="streams">
          {streams.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              No archived streams found.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {streams.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
              {hasMoreStreams && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => fetchMoreStreams()}
                    disabled={loadingMoreStreams}
                    className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg hover:border-white/25 transition-colors disabled:opacity-50"
                  >
                    {loadingMoreStreams ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="shorts">
          {shorts.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              No shorts found.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {shorts.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
              {hasMoreShorts && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => fetchMoreShorts()}
                    disabled={loadingMoreShorts}
                    className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg hover:border-white/25 transition-colors disabled:opacity-50"
                  >
                    {loadingMoreShorts ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="music">
          {allMusic.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              No music found.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allMusic.map((v) => (
                  <VideoCard key={v.id} video={v} />
                ))}
              </div>
              {(hasMoreMusic || hasMoreCovers) && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => {
                      if (hasMoreMusic) fetchMoreMusic();
                      if (hasMoreCovers) fetchMoreCovers();
                    }}
                    disabled={loadingMoreMusic || loadingMoreCovers}
                    className="px-4 py-2 text-sm bg-white/5 border border-white/10 rounded-lg hover:border-white/25 transition-colors disabled:opacity-50"
                  >
                    {loadingMoreMusic || loadingMoreCovers
                      ? "Loading..."
                      : "Load More"}
                  </button>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
