import { useState } from "react";
import { useAllChannels, useLiveVideos } from "@/hooks/useHolodex";
import BranchFilter, { type Branch } from "@/components/stream/BranchFilter";
import TalentCard from "@/components/talent/TalentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { filterChannelsByBranch, sortChannelsByGen } from "@/lib/branch";

export default function TalentsPage() {
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>([
    "EN",
    "JP",
    "ID",
    "DEV_IS",
  ]);
  const [search, setSearch] = useState("");

  const { data: channels = [], isLoading } = useAllChannels();
  const { data: liveVideos = [] } = useLiveVideos({ org: "Hololive" });

  const liveChannelIds = new Set(liveVideos.map((v) => v.channel.id));

  const filtered = sortChannelsByGen(
    filterChannelsByBranch(channels, selectedBranches).filter((c) => {
      if (!search.trim()) return true;
      const name = (c.english_name ?? c.name).toLowerCase();
      return name.includes(search.toLowerCase());
    }),
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Talents</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          All active Hololive talents
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <BranchFilter
          selected={selectedBranches}
          onChange={setSelectedBranches}
        />
        <input
          type="text"
          placeholder="Search talents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 w-full sm:w-56"
        />
      </div>

      {!isLoading && (
        <p className="text-xs text-gray-500">{filtered.length} talents</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 space-y-2"
            >
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {filtered.map((channel) => (
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
