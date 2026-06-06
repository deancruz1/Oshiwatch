import { cn } from "@/lib/utils";

export type Branch = "EN" | "JP" | "ID" | "DEV_IS";

const BRANCHES: { label: string; value: Branch }[] = [
  { label: "JP", value: "JP" },
  { label: "EN", value: "EN" },
  { label: "ID", value: "ID" },
  { label: "DEV_IS", value: "DEV_IS" },
];

export const ALL_BRANCHES: Branch[] = ["EN", "JP", "ID", "DEV_IS"];

interface BranchFilterProps {
  selected: Branch[];
  onChange: (branches: Branch[]) => void;
}

export default function BranchFilter({
  selected,
  onChange,
}: BranchFilterProps) {
  const allSelected = selected.length === ALL_BRANCHES.length;

  function handleClick(branch: Branch) {
    if (allSelected) {
      onChange([branch]);
    } else if (selected.includes(branch)) {
      if (selected.length === 1) {
        onChange(ALL_BRANCHES);
      } else {
        onChange(selected.filter((b) => b !== branch));
      }
    } else {
      onChange([...selected, branch]);
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange(ALL_BRANCHES)}
        className={cn(
          "px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150",
          allSelected
            ? "bg-white text-black border-white"
            : "bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white",
        )}
      >
        All
      </button>
      {BRANCHES.map(({ label, value }) => {
        const active = selected.includes(value);
        return (
          <button
            key={value}
            onClick={() => handleClick(value)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150",
              active
                ? "bg-white text-black border-white"
                : "bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
