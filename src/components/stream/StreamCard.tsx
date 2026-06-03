import type { Video } from "@/types/holodex";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StreamCardProps {
  video: Video;
}

function formatViewers(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

function formatScheduled(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHrs > 0) return `in ${diffHrs}h ${diffMins}m`;
  if (diffMins > 0) return `in ${diffMins}m`;
  return "starting soon";
}

function getBranchColor(group?: string): string {
  if (!group) return "text-gray-400";
  const g = group.toLowerCase();
  if (g.includes("english")) return "text-blue-400";
  if (g.includes("indonesia")) return "text-green-400";
  if (g.includes("dev_is") || g.includes("devis")) return "text-purple-400";
  return "text-red-400"; // JP
}

export default function StreamCard({ video }: StreamCardProps) {
  const isLive = video.status === "live";
  const thumbnail = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;
  const scheduledTime = video.start_scheduled ?? video.available_at;

  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/25 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-black">
        <img
          src={thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
        )}
        {isLive && video.live_viewers !== undefined && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full">
            {formatViewers(video.live_viewers)} watching
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex gap-3">
        <img
          src={video.channel.photo}
          alt={video.channel.english_name ?? video.channel.name}
          className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white line-clamp-2 leading-snug mb-1">
            {video.title}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn("text-xs", getBranchColor(video.channel.group))}
            >
              {video.channel.english_name ?? video.channel.name}
            </span>
            {!isLive && scheduledTime && (
              <Badge className="bg-white/10 text-gray-300 text-xs">
                {formatScheduled(scheduledTime)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
