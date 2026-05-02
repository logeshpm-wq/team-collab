export type Priority = "low" | "medium" | "high";
export type Status = "todo" | "inprogress" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  assignee: string;
  due: string; // ISO date
};

export const tasks: Task[] = [
  {
    id: "1",
    title: "Design landing page hero",
    description: "Final hero section with CTA and product screenshot.",
    status: "todo",
    priority: "high",
    assignee: "Alice Chen",
    due: "2026-05-05",
  },
  {
    id: "2",
    title: "Draft onboarding emails",
    description: "Three-email welcome sequence for new signups.",
    status: "todo",
    priority: "medium",
    assignee: "Priya R.",
    due: "2026-05-08",
  },
  {
    id: "3",
    title: "Set up Firebase project",
    description: "Firestore, anonymous auth, and security rules.",
    status: "inprogress",
    priority: "high",
    assignee: "Bob Singh",
    due: "2026-05-03",
  },
  {
    id: "4",
    title: "Build Kanban board UI",
    description: "Three columns with task cards and filters.",
    status: "inprogress",
    priority: "medium",
    assignee: "You",
    due: "2026-05-04",
  },
  {
    id: "5",
    title: "Write API contract doc",
    description: "Document task endpoints and payload shapes.",
    status: "inprogress",
    priority: "low",
    assignee: "Alice Chen",
    due: "2026-05-09",
  },
  {
    id: "6",
    title: "Deploy to Firebase Hosting",
    description: "Static export and custom domain configured.",
    status: "done",
    priority: "low",
    assignee: "You",
    due: "2026-05-02",
  },
  {
    id: "7",
    title: "Set up CI workflow",
    description: "GitHub Actions running lint + tests on PRs.",
    status: "done",
    priority: "medium",
    assignee: "Bob Singh",
    due: "2026-05-01",
  },
];
