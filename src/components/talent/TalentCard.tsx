import { Link } from "react-router-dom";
import type { Channel } from "@/types/holodex";
import { cn } from "@/lib/utils";

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

function getSuborgLabel(channel: Channel): string {
  const suborg = channel.suborg ?? "";
  // suborg format is like "ihEnglish -Advent-" or "oeHOLOSTARS English -ARMIS-"
  // extract the part in dashes if present
  const match = suborg.match(/-([^-]+)-$/);
  if (match) return match[1].trim();
  const name = channel.name ?? "";
  if (name.toLowerCase().includes("hololive-en")) return "EN";
  if (name.toLowerCase().includes("hololive-id")) return "ID";
  return "JP";
}

function getBranchAccent(channel: Channel): string {
  const name = (channel.name ?? "").toLowerCase();
  const suborg = (channel.suborg ?? "").toLowerCase();
  if (name.includes("hololive-en"))
    return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  if (name.includes("hololive-id"))
    return "bg-green-500/10 text-green-300 border-green-500/20";
  if (suborg.includes("dev_is") || name.includes("dev_is"))
    return "bg-purple-500/10 text-purple-300 border-purple-500/20";
  return "bg-red-500/10 text-red-300 border-red-500/20";
}

export default function TalentCard({
  channel,
  isLive = false,
}: TalentCardProps) {
  return (
    <Link
      to={`/talents/${channel.id}`}
      className="group flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/25 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Avatar */}
      <div className="relative mb-3">
        <img
          src={channel.photo}
          alt={channel.english_name ?? channel.name}
          className="w-16 h-16 rounded-full object-cover"
          loading="lazy"
        />
        {isLive && (
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-gray-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
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
          getBranchAccent(channel),
        )}
      >
        {getSuborgLabel(channel)}
      </span>

      {/* Sub count */}
      {channel.subscriber_count && (
        <p className="text-xs text-gray-500">
          {formatSubs(channel.subscriber_count)} subs
        </p>
      )}
    </Link>
  );
}
