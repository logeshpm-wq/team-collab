"use client";

import { Activity } from "lucide-react";
import { useStore } from "../lib/store";

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function ActivityFeed() {
  const { activity } = useStore();

  return (
    <aside
      className="bg-white border border-slate-200 rounded-2xl p-4"
      aria-label="Recent activity"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-indigo-600" aria-hidden />
        <h2 className="text-sm font-semibold text-slate-900">Recent activity</h2>
      </div>
      {activity.length === 0 ? (
        <p className="text-xs text-slate-400">
          No activity yet. Create or move a task to see updates here.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {activity.slice(0, 5).map((a) => (
            <li key={a.id} className="flex items-start gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" aria-hidden />
              <div className="min-w-0">
                <p className="text-slate-700 leading-snug">{a.message}</p>
                <p className="text-slate-400 mt-0.5">{timeAgo(a.at)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
