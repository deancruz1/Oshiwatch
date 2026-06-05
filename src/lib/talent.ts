export function getGenLabel(group?: string): string {
  if (!group) return "";
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

export function getBranchAccent(group?: string): string {
  if (!group) return "bg-white/10 text-gray-300 border-white/20";
  if (group.startsWith("English"))
    return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  if (group.startsWith("Indonesia"))
    return "bg-green-500/10 text-green-300 border-green-500/20";
  if (group.startsWith("DEV_IS") || group === "mekPark")
    return "bg-purple-500/10 text-purple-300 border-purple-500/20";
  return "bg-red-500/10 text-red-300 border-red-500/20";
}
