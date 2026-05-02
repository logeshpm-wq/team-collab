"use client";

import {
  LayoutDashboard,
  KanbanSquare,
  CheckCircle2,
  Users,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { TEAM_MEMBERS, initials } from "../lib/team";

type NavItem = {
  key: string;
  label: string;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { key: "board", label: "Board", Icon: KanbanSquare },
  { key: "my-tasks", label: "My Tasks", Icon: CheckCircle2 },
  { key: "team", label: "Team", Icon: Users },
  { key: "settings", label: "Settings", Icon: Settings },
];

export default function Sidebar() {
  const [active, setActive] = useState("board");

  return (
    <aside
      className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col"
      aria-label="Primary navigation"
    >
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-slate-100">
        <div
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-sm"
          aria-hidden
        >
          S
        </div>
        <div>
          <div className="font-semibold text-slate-900 leading-tight">Synapse</div>
          <div className="text-xs text-slate-500">Acme Workspace</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4" aria-label="Sections">
        <ul className="space-y-1">
          {navItems.map(({ key, label, Icon }) => {
            const isActive = active === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setActive(key)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] ${
                      isActive ? "text-indigo-600" : "text-slate-400"
                    }`}
                    aria-hidden
                  />
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-5 py-4 border-t border-slate-100">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Team
        </div>
        <ul className="space-y-2">
          {TEAM_MEMBERS.map((m) => (
            <li key={m.name} className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full ${m.color} text-white text-xs font-semibold flex items-center justify-center`}
                aria-hidden
              >
                {initials(m.name)}
              </div>
              <span className="text-sm text-slate-700">{m.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
