"use client";

import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";
import type { Task, Status, Priority } from "../lib/mockData";
import { useStore } from "../lib/store";
import { TEAM_MEMBERS } from "../lib/team";

export type TaskModalMode =
  | { kind: "create"; defaultStatus?: Status }
  | { kind: "edit"; task: Task };

type Props = {
  open: boolean;
  mode: TaskModalMode | null;
  onClose: () => void;
};

const statuses: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorities: Priority[] = ["low", "medium", "high"];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function TaskModal({ open, mode, onClose }: Props) {
  const { createTask, updateTask, deleteTask } = useStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>("todo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [assignee, setAssignee] = useState<string>(TEAM_MEMBERS[0].name);
  const [due, setDue] = useState<string>(todayIso());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !mode) return;
    if (mode.kind === "edit") {
      const t = mode.task;
      setTitle(t.title);
      setDescription(t.description ?? "");
      setStatus(t.status);
      setPriority(t.priority);
      setAssignee(t.assignee);
      setDue(t.due);
    } else {
      setTitle("");
      setDescription("");
      setStatus(mode.defaultStatus ?? "todo");
      setPriority("medium");
      setAssignee(TEAM_MEMBERS[0].name);
      setDue(todayIso());
    }
    setError(null);
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mode) return null;

  const isEdit = mode.kind === "edit";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assignee,
      due,
    };
    if (isEdit) {
      updateTask(mode.task.id, payload);
    } else {
      createTask(payload);
    }
    onClose();
  };

  const handleDelete = () => {
    if (mode.kind !== "edit") return;
    if (confirm(`Delete "${mode.task.title}"?`)) {
      deleteTask(mode.task.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 id="task-modal-title" className="font-semibold text-slate-900">
            {isEdit ? "Edit task" : "New task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to get done?"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-400 focus:outline-none"
            />
            {error && (
              <p className="text-xs text-rose-600 mt-1" role="alert">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add a few details..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-400 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-400 focus:outline-none bg-white"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-400 focus:outline-none bg-white capitalize"
              >
                {priorities.map((p) => (
                  <option key={p} value={p} className="capitalize">
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-400 focus:outline-none bg-white"
              >
                {TEAM_MEMBERS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Due date
              </label>
              <input
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 font-medium"
              >
                <Trash2 className="w-4 h-4" aria-hidden />
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              {isEdit ? "Save changes" : "Create task"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
