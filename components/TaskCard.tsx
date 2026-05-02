"use client";

import { Calendar, MoreHorizontal } from "lucide-react";
import { memo, useState, useRef, useEffect } from "react";
import type { Task, Status } from "../lib/mockData";
import { memberColor, initials } from "../lib/team";
import { useStore } from "../lib/store";

const priorityStyle: Record<Task["priority"], string> = {
  high: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  low: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

const statusOptions: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDue(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

function isOverdue(iso: string, status: Task["status"]) {
  if (status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(iso) < today;
}

function TaskCardImpl({ task }: { task: Task }) {
  const { moveTask, deleteTask, openEdit } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overdue = isOverdue(task.due, task.status);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-open]")) return;
    openEdit(task);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEdit(task);
    }
  };

  return (
    <article
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKey}
      className="group relative bg-white p-3.5 rounded-xl border border-slate-200 mb-2.5 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all cursor-pointer"
      aria-label={`Task: ${task.title}. Press Enter to edit.`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-semibold text-sm text-slate-900 leading-snug">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${priorityStyle[task.priority]}`}
          >
            {task.priority}
          </span>
          <div data-no-open className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              aria-label="Task actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="w-6 h-6 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-3.5 h-3.5" aria-hidden />
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-7 z-20 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-1"
              >
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Move to
                </div>
                {statusOptions
                  .filter((s) => s.value !== task.status)
                  .map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      role="menuitem"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task.id, s.value);
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {s.label}
                    </button>
                  ))}
                <div className="border-t border-slate-100 my-1" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${task.title}"?`)) {
                      deleteTask(task.id);
                    }
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div
          className={`flex items-center gap-1.5 text-xs ${
            overdue ? "text-rose-600 font-medium" : "text-slate-500"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" aria-hidden />
          <time dateTime={task.due}>{formatDue(task.due)}</time>
          {overdue && <span className="sr-only">(overdue)</span>}
        </div>
        <div
          className={`w-7 h-7 rounded-full ${memberColor(task.assignee)} text-white text-[10px] font-semibold flex items-center justify-center ring-2 ring-white shadow-sm`}
          aria-label={`Assigned to ${task.assignee}`}
          title={task.assignee}
        >
          {initials(task.assignee)}
        </div>
      </div>
    </article>
  );
}

const TaskCard = memo(TaskCardImpl);
export default TaskCard;
