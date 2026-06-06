import type { Video } from "@/types/holodex";
import { Link } from "react-router-dom";

function formatViewers(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K watching`;
  return `${count} watching`;
}

function formatScheduled(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (diffHrs > 0) return `Starts in ${diffHrs}h ${diffMins}m`;
  if (diffMins > 0) return `Starts in ${diffMins}m`;
  return "Starting soon";
}

interface LiveBannerProps {
  video: Video;
}

export default function LiveBanner({ video }: LiveBannerProps) {
  const isLive = video.status === "live";
  const thumbnail = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
  const scheduledTime = video.start_scheduled ?? video.available_at;

  return (
    <Link
      to={`/watch/${video.id}?from=${video.channel.id}&live=${isLive}`}
      className="group block rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25"
      style={{
        background: isLive
          ? "linear-gradient(to right, rgba(239,68,68,0.15), transparent)"
          : "linear-gradient(to right, rgba(255,255,255,0.05), transparent)",
        borderColor: isLive ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex gap-4 p-4 items-center">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-40 sm:w-52 aspect-video rounded-lg overflow-hidden bg-black">
          <img
            src={thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isLive && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                Live Now
              </span>
            ) : (
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Upcoming
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base font-semibold text-white line-clamp-2 leading-snug">
            {video.title}
          </p>
          <p className="text-sm text-gray-400">
            {isLive && video.live_viewers
              ? formatViewers(video.live_viewers)
              : formatScheduled(scheduledTime)}
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 hidden sm:block">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              isLive
                ? "bg-red-600 text-white group-hover:bg-red-500"
                : "bg-white/10 text-white group-hover:bg-white/20"
            }`}
          >
            {isLive ? "Watch Live" : "Set Reminder"}
          </span>
        </div>
      </div>
    </Link>
  );
}
