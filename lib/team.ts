export type TeamMember = {
  name: string;
  color: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  { name: "Alice Chen", color: "bg-indigo-500" },
  { name: "Bob Singh", color: "bg-emerald-500" },
  { name: "Priya R.", color: "bg-rose-500" },
  { name: "You", color: "bg-amber-500" },
];

export function memberColor(name: string) {
  return TEAM_MEMBERS.find((m) => m.name === name)?.color ?? "bg-slate-500";
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
