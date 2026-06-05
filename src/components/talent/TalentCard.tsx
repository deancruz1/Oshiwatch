import { Link } from "react-router-dom";
import type { Channel } from "@/types/holodex";
import { cn } from "@/lib/utils";
import { isGraduated } from "@/lib/branch";

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

function getGenLabel(group?: string): string {
  if (!group) return "";
  // Shorten common ones
  const map: Record<string, string> = {
    "0th Generation": "Gen 0",
    "1st Generation": "Gen 1",
    "2nd Generation": "Gen 2",
    "3rd Generation (Fantasy)": "Gen 3",
    "4th Generation (holoForce)": "Gen 4",
    "5th Generation (holoFive)": "Gen 5",
    "6th Generation -holoX-": "holoX",
    GAMERS: "GAMERS",
    "English -Myth-": "Myth",
    "English -Promise-": "Promise",
    "English -Advent-": "Advent",
    "English -Justice-": "Justice",
    "Indonesia 1st Gen (AREA 15)": "ID Gen 1",
    "Indonesia 2nd Gen (holoro)": "ID Gen 2",
    "Indonesia 3rd Gen (holoh3ro)": "ID Gen 3",
    "DEV_IS ReGLOSS": "ReGLOSS",
    "DEV_IS FLOW GLOW": "FLOW GLOW",
    mekPark: "mekPark",
  };
  return map[group] ?? group;
}

function getBranchAccent(group?: string): string {
  if (!group) return "bg-white/10 text-gray-300 border-white/20";
  if (group.startsWith("English"))
    return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  if (group.startsWith("Indonesia"))
    return "bg-green-500/10 text-green-300 border-green-500/20";
  if (group.startsWith("DEV_IS") || group === "mekPark")
    return "bg-purple-500/10 text-purple-300 border-purple-500/20";
  return "bg-red-500/10 text-red-300 border-red-500/20";
}

export default function TalentCard({
  channel,
  isLive = false,
}: TalentCardProps) {
  const graduated = isGraduated(channel);

  return (
    <Link
      to={`/talents/${channel.id}`}
      className={cn(
        "group flex flex-col items-center text-center p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5",
        graduated
          ? "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-80"
          : "bg-white/5 border-white/10 hover:border-white/25",
      )}
    >
      {/* Avatar */}
      <div className="relative mb-3">
        <img
          src={channel.photo}
          alt={channel.english_name ?? channel.name}
          className={cn(
            "w-16 h-16 rounded-full object-cover",
            graduated && "grayscale",
          )}
          loading="lazy"
        />
        {isLive && !graduated && (
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
      {channel.subscriber_count && !graduated && (
        <p className="text-xs text-gray-500">
          {formatSubs(channel.subscriber_count)} subs
        </p>
      )}
    </Link>
  );
}
