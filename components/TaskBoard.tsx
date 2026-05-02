"use client";

import { useMemo, useState } from "react";
import {
  ListTodo,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Filter,
} from "lucide-react";
import TaskCard from "./TaskCard";
import ActivityFeed from "./ActivityFeed";
import { useStore } from "../lib/store";
import { TEAM_MEMBERS } from "../lib/team";
import type { Task, Status, Priority } from "../lib/mockData";

const columns: { key: Status; title: string; accent: string }[] = [
  { key: "todo", title: "To Do", accent: "bg-slate-400" },
  { key: "inprogress", title: "In Progress", accent: "bg-indigo-500" },
  { key: "done", title: "Done", accent: "bg-emerald-500" },
];

function StatCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number;
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tone: "indigo" | "amber" | "emerald" | "rose";
}) {
  const toneClass = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  }[tone];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneClass}`}>
        <Icon className="w-5 h-5" aria-hidden />
      </div>
      <div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        <div className="text-xl font-semibold text-slate-900 leading-tight">{value}</div>
      </div>
    </div>
  );
}

function Column({
  title,
  accent,
  items,
  onAdd,
}: {
  title: string;
  accent: string;
  items: Task[];
  onAdd: () => void;
}) {
  return (
    <section
      className="bg-slate-100/70 rounded-2xl p-3 border border-slate-200/70 flex flex-col min-h-[400px]"
      aria-label={`${title} column`}
    >
      <header className="flex items-center justify-between px-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${accent}`} aria-hidden />
          <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
          <span className="text-xs font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
            {items.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add task to ${title}`}
          className="w-6 h-6 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-white flex items-center justify-center transition-colors"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden />
        </button>
      </header>

      <div className="flex-1">
        {items.length === 0 ? (
          <div className="text-xs text-slate-400 text-center py-8 border border-dashed border-slate-300 rounded-lg">
            No tasks yet
          </div>
        ) : (
          items.map((t) => <TaskCard key={t.id} task={t} />)
        )}
      </div>
    </section>
  );
}

export default function TaskBoard() {
  const { tasks, search, openCreate } = useStore();
  const hasTasks = tasks.length > 0;
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      if (assigneeFilter !== "all" && t.assignee !== assigneeFilter) return false;
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [tasks, search, priorityFilter, assigneeFilter]);

  const grouped: Record<Status, Task[]> = {
    todo: filtered.filter((t) => t.status === "todo"),
    inprogress: filtered.filter((t) => t.status === "inprogress"),
    done: filtered.filter((t) => t.status === "done"),
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = tasks.filter(
    (t) => t.status !== "done" && new Date(t.due) < today
  ).length;

  const filtersActive =
    priorityFilter !== "all" || assigneeFilter !== "all" || search.length > 0;

  if (!hasTasks) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
          <ListTodo className="w-7 h-7" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">
          Your board is empty
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          Create your first task to get the team moving.
        </p>
        <button
          type="button"
          onClick={() => openCreate()}
          className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
        >
          <Plus className="w-4 h-4" aria-hidden />
          Create your first task
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tasks" value={tasks.length} Icon={ListTodo} tone="indigo" />
        <StatCard
          label="In Progress"
          value={tasks.filter((t) => t.status === "inprogress").length}
          Icon={Loader2}
          tone="amber"
        />
        <StatCard
          label="Completed"
          value={tasks.filter((t) => t.status === "done").length}
          Icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard label="Overdue" value={overdue} Icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" aria-hidden />
              <span>Filter:</span>
            </div>
            <label className="sr-only" htmlFor="priority-filter">
              Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | "all")}
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:border-indigo-400 focus:outline-none capitalize"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <label className="sr-only" htmlFor="assignee-filter">
              Assignee
            </label>
            <select
              id="assignee-filter"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:border-indigo-400 focus:outline-none"
            >
              <option value="all">All assignees</option>
              {TEAM_MEMBERS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
            {filtersActive && (
              <button
                type="button"
                onClick={() => {
                  setPriorityFilter("all");
                  setAssigneeFilter("all");
                }}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear
              </button>
            )}
            <span className="ml-auto text-xs text-slate-500">
              Showing {filtered.length} of {tasks.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((c) => (
              <Column
                key={c.key}
                title={c.title}
                accent={c.accent}
                items={grouped[c.key]}
                onAdd={() => openCreate(c.key)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
