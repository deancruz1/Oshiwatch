import type { Branch } from "@/components/stream/BranchFilter";
import type { Video, Channel } from "@/types/holodex";

export function getChannelBranch(channel: Channel): Branch | null {
  const name = (channel.name ?? "").toLowerCase();
  const suborg = (channel.suborg ?? "").toLowerCase();

  if (name.includes("holostars") || suborg.includes("holostars")) return null;
  if (name.includes("hololive-en")) return "EN";
  if (name.includes("hololive-id")) return "ID";
  if (suborg.includes("dev_is") || name.includes("dev_is")) return "DEV_IS";
  if (name.includes("hololive")) return "JP";

  return null;
}

export function getVideoBranch(video: Video): Branch | null {
  const name = (video.channel.name ?? "").toLowerCase();
  const suborg = (video.channel.suborg ?? "").toLowerCase();

  if (name.includes("holostars") || suborg.includes("holostars")) return null;
  if (name.includes("hololive-en")) return "EN";
  if (name.includes("hololive-id")) return "ID";
  if (suborg.includes("dev_is") || name.includes("dev_is")) return "DEV_IS";
  if (name.includes("hololive")) return "JP";

  return null;
}

export function filterVideosByBranch(
  videos: Video[],
  selected: Branch[],
): Video[] {
  return videos.filter((v) => {
    const branch = getVideoBranch(v);
    return branch !== null && selected.includes(branch);
  });
}

export function filterChannelsByBranch(
  channels: Channel[],
  selected: Branch[],
): Channel[] {
  return channels.filter((c) => {
    const branch = getChannelBranch(c);
    return branch !== null && selected.includes(branch);
  });
}
