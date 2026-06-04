import { cn } from "@/lib/utils";

export type Branch = "EN" | "JP" | "ID" | "DEV_IS";

const BRANCHES: { label: string; value: Branch }[] = [
  { label: "EN", value: "EN" },
  { label: "JP", value: "JP" },
  { label: "ID", value: "ID" },
  { label: "DEV_IS", value: "DEV_IS" },
];

interface BranchFilterProps {
  selected: Branch[];
  onChange: (branches: Branch[]) => void;
}

export default function BranchFilter({
  selected,
  onChange,
}: BranchFilterProps) {
  function toggle(branch: Branch) {
    if (selected.includes(branch)) {
      // don't allow deselecting all
      if (selected.length === 1) return;
      onChange(selected.filter((b) => b !== branch));
    } else {
      onChange([...selected, branch]);
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {BRANCHES.map(({ label, value }) => {
        const active = selected.includes(value);
        return (
          <button
            key={value}
            onClick={() => toggle(value)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer",
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
