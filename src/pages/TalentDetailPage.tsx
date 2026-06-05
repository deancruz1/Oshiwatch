import { useParams, Link } from "react-router-dom";
import { useChannel, useVideos } from "@/hooks/useHolodex";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VideoCard from "@/components/talent/VideoCard";
import { getGenLabel, getBranchAccent } from "@/lib/talent";
import { cn } from "@/lib/utils";

const MUSIC_TOPICS = ["Original_Song", "Music_Cover"];

export default function TalentDetailPage() {
  const { channelId } = useParams<{ channelId: string }>();

  const { data: channel, isLoading: channelLoading } = useChannel(channelId!);

  const { data: streams = [] } = useVideos({
    channel_id: channelId,
    type: "stream",
    status: "past",
    limit: 50,
  });

  const { data: clips = [] } = useVideos({
    channel_id: channelId,
    type: "clip",
    limit: 50,
  });

  const { data: music = [] } = useVideos({
    channel_id: channelId,
    topic: "Original_Song",
    limit: 50,
  });

  const { data: musicCovers = [] } = useVideos({
    channel_id: channelId,
    topic: "Music_Cover",
    limit: 50,
  });

  const allMusic = [
    ...music,
    ...musicCovers.filter((v) => !music.find((m) => m.id === v.id)),
  ].sort(
    (a, b) =>
      new Date(b.published_at ?? b.available_at).getTime() -
      new Date(a.published_at ?? a.available_at).getTime(),
  );

  const nonMusicStreams = streams.filter(
    (v) => !MUSIC_TOPICS.includes(v.topic_id ?? ""),
  );

  const allVideos = [
    ...clips,
    ...nonMusicStreams.filter((v) => !clips.find((c) => c.id === v.id)),
  ].sort(
    (a, b) =>
      new Date(b.published_at ?? b.available_at).getTime() -
      new Date(a.published_at ?? a.available_at).getTime(),
  );

  const archivedStreams = nonMusicStreams.sort(
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

  console.log("streams raw:", streams.length, streams[0]);
  console.log("clips raw:", clips.length, clips[0]);

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
      {/* Back */}
      <Link
        to="/talents"
        className="text-sm text-gray-500 hover:text-white transition-colors"
      >
        ← Back to Talents
      </Link>

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
          {/* Socials */}
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
          <TabsTrigger value="streams">
            Streams{" "}
            {archivedStreams.length > 0 && (
              <span className="ml-1.5 text-xs opacity-50">
                {archivedStreams.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="videos">
            Videos{" "}
            {allVideos.length > 0 && (
              <span className="ml-1.5 text-xs opacity-50">
                {allVideos.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="music">
            Music{" "}
            {allMusic.length > 0 && (
              <span className="ml-1.5 text-xs opacity-50">
                {allMusic.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="streams">
          {archivedStreams.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              No archived streams found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {archivedStreams.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos">
          {allVideos.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              No videos found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allVideos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="music">
          {allMusic.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 text-center">
              No music found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allMusic.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
