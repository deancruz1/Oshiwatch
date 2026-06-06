import { Link } from "react-router-dom";
import type { Channel } from "@/types/holodex";
import { cn } from "@/lib/utils";
import { isGraduated } from "@/lib/branch";
import { LOCAL_TALENT_IMAGES } from "@/assets/talent-images";
import { getGenLabel, getBranchAccent } from "@/lib/talent";

interface TalentCardProps {
  channel: Channel;
  isLive?: boolean;
}

function formatSubs(count?: number): string {
  if (!count) return "";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return String(count);
}

export default function TalentCard({
  channel,
  isLive = false,
}: TalentCardProps) {
  const graduated = isGraduated(channel);

  return (
    <Link
      to={`/talents/${channel.id}`}
      className="group flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Avatar */}
      <div className="relative mb-3">
        <img
          src={LOCAL_TALENT_IMAGES[channel.id] ?? channel.photo}
          alt={channel.english_name ?? channel.name}
          className="w-24 h-24 rounded-full object-cover"
          loading="lazy"
          onError={(e) => {
            if (LOCAL_TALENT_IMAGES[channel.id]) {
              (e.target as HTMLImageElement).src =
                LOCAL_TALENT_IMAGES[channel.id];
            }
          }}
        />
        {isLive && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-gray-950 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </span>
        )}
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-white leading-tight mb-1 line-clamp-1">
        {channel.english_name ?? channel.name}
      </p>

      {/* Gen badge */}
      <span
        className={cn(
          "text-xs px-2 py-0.5 rounded-full border mb-2",
          getBranchAccent(channel.group),
        )}
      >
        {getGenLabel(channel.group)}
      </span>

      {/* Graduated badge */}
      {graduated && (
        <span className="text-xs px-2 py-0.5 rounded-full border bg-gray-500/10 text-gray-400 border-gray-500/20 mb-2">
          Graduated
        </span>
      )}

      {/* Sub count */}
      {channel.subscriber_count && (
        <p className="text-xs text-gray-500">
          {formatSubs(channel.subscriber_count)} subs
        </p>
      )}
    </Link>
  );
}
