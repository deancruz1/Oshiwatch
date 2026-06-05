import type { Branch } from "@/components/stream/BranchFilter";
import type { Video, Channel } from "@/types/holodex";

const EXCLUDED_GROUPS = ["Official", "Misc", "holo-n", "CN 1st Generation"];
const HOLOSTARS_GROUPS = [
  "HOLOSTARS 1st Gen",
  "HOLOSTARS 2nd Gen (SunTempo)",
  "HOLOSTARS 3rd Gen (TriNero)",
  "HOLOSTARS English -ARMIS-",
  "HOLOSTARS English -TEMPUS- HQ",
  "HOLOSTARS English -TEMPUS- Vanguard",
  "HOLOSTARS UPROAR!!",
];

export const GEN_ORDER: Record<string, number> = {
  // JP
  "0th Generation": 0,
  "1st Generation": 1,
  GAMERS: 2,
  "2nd Generation": 3,
  "3rd Generation (Fantasy)": 4,
  "4th Generation (holoForce)": 5,
  "5th Generation (holoFive)": 6,
  "6th Generation -holoX-": 7,
  // EN
  "English -Myth-": 8,
  "English -Promise-": 9,
  "English -Advent-": 10,
  "English -Justice-": 11,
  // ID
  "Indonesia 1st Gen (AREA 15)": 12,
  "Indonesia 2nd Gen (holoro)": 13,
  "Indonesia 3rd Gen (holoh3ro)": 14,
  // DEV_IS
  "DEV_IS ReGLOSS": 15,
  "DEV_IS FLOW GLOW": 16,
  // mekPark
  mekPark: 17,
};

export function getChannelBranch(channel: Channel): Branch | null {
  const group = channel.group ?? "";

  if (EXCLUDED_GROUPS.includes(group)) return null;
  if (HOLOSTARS_GROUPS.includes(group)) return null;
  if (isSubChannel(channel)) return null;

  if (group.startsWith("DEV_IS")) return "DEV_IS";
  if (group.startsWith("English")) return "EN";
  if (group.startsWith("Indonesia")) return "ID";
  if (group === "mekPark") return "JP";

  return "JP";
}

export function isSubChannel(channel: Channel): boolean {
  const name = channel.name ?? "";
  const englishName = channel.english_name ?? "";
  return (
    /\(sub\)/i.test(name) ||
    /\(sub\)/i.test(englishName) ||
    /[-–]\s*sub\b/i.test(name) ||
    /sub\s*ch(annel)?/i.test(name)
  );
}

export function isGraduated(channel: Channel): boolean {
  return channel.inactive === true;
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

// Gen 0 debut order by channel ID
const GEN0_ORDER: Record<string, number> = {
  UCp6993wxpyDPHUpavwDFqgg: 0, // Tokino Sora
  UCDqI2jOz0weumE8s7paEk6g: 1, // Roboco
  UC35tFqLMaMFgkOzOZBflLMg: 2, // Sakura Miko
  UC5CwaMl1eIgY8h02uZw7u8A: 3, // Hoshimachi Suisei
  UC0TXe_LYZ4scaW2XMyi5_kw: 4, // AZKi
};

const MEKPARK_ORDER: Record<string, number> = {
  UChpRPsAeSZn5DistGacR3iA: 0, // ACHRORA
  UC3OH5FKQ3qtl4uRme_vZTgA: 1, // UNIT B
};

export function sortChannelsByGen(channels: Channel[]): Channel[] {
  return [...channels].sort((a, b) => {
    const genA = GEN_ORDER[a.group ?? ""] ?? 99;
    const genB = GEN_ORDER[b.group ?? ""] ?? 99;
    if (genA !== genB) return genA - genB;

    if (a.group === "0th Generation" && b.group === "0th Generation") {
      return (GEN0_ORDER[a.id] ?? 99) - (GEN0_ORDER[b.id] ?? 99);
    }

    if (a.group === "mekPark" && b.group === "mekPark") {
      return (MEKPARK_ORDER[a.id] ?? 99) - (MEKPARK_ORDER[b.id] ?? 99);
    }

    return a.id < b.id ? -1 : 1;
  });
}
