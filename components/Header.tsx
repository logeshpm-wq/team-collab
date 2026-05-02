"use client";

import { Search, Plus, Bell } from "lucide-react";
import { useStore } from "../lib/store";

export default function Header() {
  const { search, setSearch, openCreate, isOnline } = useStore();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 lg:px-8 flex items-center gap-4 sticky top-0 z-10">
      <div className="min-w-0 flex items-center gap-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-slate-900 leading-tight truncate">
            Project Board
          </h1>
          <p className="text-xs text-slate-500 truncate">
            Track tasks across your team
          </p>
        </div>
        {isOnline && (
          <span
            role="status"
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 rounded-full"
            aria-label="Realtime sync active"
            title="Realtime sync active"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
            Live
          </span>
        )}
      </div>

      <div className="flex-1 max-w-md mx-auto hidden md:block">
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <div className="relative">
          <Search
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            id="task-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <Bell className="w-[18px] h-[18px]" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => openCreate()}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden />
          <span>New Task</span>
        </button>
        <div
          className="w-9 h-9 rounded-full bg-amber-500 text-white text-sm font-semibold flex items-center justify-center"
          aria-label="Your profile"
        >
          YO
        </div>
      </div>
    </header>
  );
}
