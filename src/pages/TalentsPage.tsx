import { useState } from "react";
import { useAllChannels, useLiveVideos } from "@/hooks/useHolodex";
import BranchFilter, { type Branch } from "@/components/stream/BranchFilter";
import TalentCard from "@/components/talent/TalentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { filterChannelsByBranch, sortChannelsByGen } from "@/lib/branch";
import type { Channel } from "@/types/holodex";
import { getGenLabel } from "@/lib/talent";

type SortOption = "gen" | "subs";

export default function TalentsPage() {
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([
    "EN",
    "JP",
    "ID",
    "DEV_IS",
  ]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("gen");

  const { data: channels = [], isLoading } = useAllChannels();
  const { data: liveVideos = [] } = useLiveVideos({ org: "Hololive" });

  const liveChannelIds = new Set(
    liveVideos.filter((v) => v.status === "live").map((v) => v.channel.id),
  );

  const filtered = filterChannelsByBranch(channels, selectedBranches).filter(
    (c) => {
      if (!search.trim()) return true;
      const name = (c.english_name ?? c.name).toLowerCase();
      return name.includes(search.toLowerCase());
    },
  );

  const sorted =
    sort === "subs"
      ? [...filtered].sort(
          (a, b) => (b.subscriber_count ?? 0) - (a.subscriber_count ?? 0),
        )
      : sortChannelsByGen(filtered);

  // Group by gen for gen sort only
  const grouped: { label: string; channels: Channel[] }[] = [];
  if (sort === "gen") {
    const seen = new Map<string, Channel[]>();
    for (const channel of sorted) {
      const group = channel.group ?? "Other";
      if (!seen.has(group)) seen.set(group, []);
      seen.get(group)!.push(channel);
    }
    for (const [group, channels] of seen) {
      grouped.push({ label: getGenLabel(group), channels });
    }
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Talents</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          All active Hololive talents
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <BranchFilter
          selected={selectedBranches}
          onChange={setSelectedBranches}
        />
        <div className="flex gap-2 items-center">
          {/* Sort */}
          <div className="flex rounded-lg overflow-hidden border border-white/10 text-xs">
            <button
              onClick={() => setSort("gen")}
              className={`px-3 py-1.5 transition-colors ${sort === "gen" ? "bg-white text-black font-semibold" : "text-gray-400 hover:text-white"}`}
            >
              By Gen
            </button>
            <button
              onClick={() => setSort("subs")}
              className={`px-3 py-1.5 transition-colors ${sort === "subs" ? "bg-white text-black font-semibold" : "text-gray-400 hover:text-white"}`}
            >
              By Subs
            </button>
          </div>
          {/* Search */}
          <input
            type="text"
            placeholder="Search talents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 w-full sm:w-48"
          />
        </div>
      </div>

      {!isLoading && (
        <p className="text-xs text-gray-500">{filtered.length} talents</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 space-y-2"
            >
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      ) : sort === "gen" ? (
        // Grouped by gen
        <div className="space-y-8">
          {grouped.map(({ label, channels }) => (
            <div key={label}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-sm font-semibold text-gray-400">{label}</h2>
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-600">{channels.length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {channels.map((channel) => (
                  <TalentCard
                    key={channel.id}
                    channel={channel}
                    isLive={liveChannelIds.has(channel.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Flat grid for subs sort
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sorted.map((channel) => (
            <TalentCard
              key={channel.id}
              channel={channel}
              isLive={liveChannelIds.has(channel.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
