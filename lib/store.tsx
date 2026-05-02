"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { tasks as seedTasks, type Task, type Status } from "./mockData";
import { auth, db, isFirebaseConfigured } from "./firebase";

const STORAGE_KEY = "synapse:v1";

export type ActivityEntry = {
  id: string;
  message: string;
  at: number;
};

export type ModalRequest =
  | { kind: "create"; defaultStatus?: Status }
  | { kind: "edit"; task: Task }
  | null;

type StoreState = {
  tasks: Task[];
  search: string;
  setSearch: (q: string) => void;
  activity: ActivityEntry[];
  modal: ModalRequest;
  openCreate: (defaultStatus?: Status) => void;
  openEdit: (task: Task) => void;
  closeModal: () => void;
  createTask: (t: Omit<Task, "id">) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id">>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: Status) => void;
  isReady: boolean;
  isOnline: boolean;
};

const StoreContext = createContext<StoreState | null>(null);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalRequest>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isReady, setIsReady] = useState(!isFirebaseConfigured);
  const [isOnline] = useState(isFirebaseConfigured);
  const seededRef = useRef(false);

  const openCreate = useCallback(
    (defaultStatus?: Status) => setModal({ kind: "create", defaultStatus }),
    []
  );
  const openEdit = useCallback((task: Task) => setModal({ kind: "edit", task }), []);
  const closeModal = useCallback(() => setModal(null), []);

  useEffect(() => {
    if (isFirebaseConfigured) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          tasks?: Task[];
          activity?: ActivityEntry[];
        };
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        if (Array.isArray(parsed.activity)) setActivity(parsed.activity);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured || !hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks, activity: activity.slice(0, 20) })
    );
  }, [tasks, activity, hydrated]);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        try {
          await signInAnonymously(auth!);
        } catch (err) {
          console.error("Anonymous sign-in failed", err);
        }
        return;
      }

      const tasksQ = query(collection(db!, "tasks"), orderBy("createdAt", "desc"));
      const unsubTasks = onSnapshot(tasksQ, async (snap) => {
        if (snap.empty && !seededRef.current) {
          seededRef.current = true;
          const batch = writeBatch(db!);
          seedTasks.forEach((t, i) => {
            const ref = doc(collection(db!, "tasks"));
            batch.set(ref, {
              title: t.title,
              description: t.description ?? "",
              status: t.status,
              priority: t.priority,
              assignee: t.assignee,
              due: t.due,
              createdAt: Date.now() - i * 1000,
            });
          });
          try {
            await batch.commit();
          } catch (err) {
            console.error("Seed failed", err);
          }
          return;
        }
        const next: Task[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Task, "id">;
          return {
            id: d.id,
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            assignee: data.assignee,
            due: data.due,
          };
        });
        setTasks(next);
        setIsReady(true);
      });

      const actQ = query(collection(db!, "activity"), orderBy("at", "desc"));
      const unsubAct = onSnapshot(actQ, (snap) => {
        const next: ActivityEntry[] = snap.docs.slice(0, 20).map((d) => {
          const data = d.data() as { message: string; at: number };
          return { id: d.id, message: data.message, at: data.at };
        });
        setActivity(next);
      });

      return () => {
        unsubTasks();
        unsubAct();
      };
    });
    return () => unsub();
  }, []);

  const logRemote = useCallback(async (message: string) => {
    if (!isFirebaseConfigured || !db) return;
    try {
      const ref = doc(collection(db, "activity"));
      await setDoc(ref, { message, at: Date.now() });
    } catch (err) {
      console.error("activity log failed", err);
    }
  }, []);

  const logLocal = useCallback((message: string) => {
    setActivity((prev) =>
      [{ id: uid(), message, at: Date.now() }, ...prev].slice(0, 20)
    );
  }, []);

  const log = useCallback(
    (message: string) => {
      if (isFirebaseConfigured) logRemote(message);
      else logLocal(message);
    },
    [logRemote, logLocal]
  );

  const createTask = useCallback(
    async (t: Omit<Task, "id">) => {
      if (isFirebaseConfigured && db) {
        const ref = doc(collection(db, "tasks"));
        try {
          await setDoc(ref, { ...t, createdAt: Date.now() });
          log(`Created "${t.title}"`);
        } catch (err) {
          console.error(err);
        }
        return;
      }
      const task: Task = { ...t, id: uid() };
      setTasks((prev) => [task, ...prev]);
      log(`Created "${task.title}"`);
    },
    [log]
  );

  const updateTask = useCallback(
    async (id: string, patch: Partial<Omit<Task, "id">>) => {
      if (isFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, "tasks", id), patch);
          const t = tasks.find((x) => x.id === id);
          if (t) log(`Updated "${t.title}"`);
        } catch (err) {
          console.error(err);
        }
        return;
      }
      setTasks((prev) => {
        const before = prev.find((t) => t.id === id);
        const next = prev.map((t) => (t.id === id ? { ...t, ...patch } : t));
        if (before) log(`Updated "${before.title}"`);
        return next;
      });
    },
    [log, tasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const target = tasks.find((t) => t.id === id);
      if (isFirebaseConfigured && db) {
        try {
          await deleteDoc(doc(db, "tasks", id));
          if (target) log(`Deleted "${target.title}"`);
        } catch (err) {
          console.error(err);
        }
        return;
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (target) log(`Deleted "${target.title}"`);
    },
    [log, tasks]
  );

  const moveTask = useCallback(
    async (id: string, status: Status) => {
      const target = tasks.find((t) => t.id === id);
      const labels: Record<Status, string> = {
        todo: "To Do",
        inprogress: "In Progress",
        done: "Done",
      };
      if (isFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, "tasks", id), { status });
          if (target && target.status !== status) {
            log(`Moved "${target.title}" to ${labels[status]}`);
          }
        } catch (err) {
          console.error(err);
        }
        return;
      }
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
      if (target && target.status !== status) {
        log(`Moved "${target.title}" to ${labels[status]}`);
      }
    },
    [log, tasks]
  );

  const value = useMemo<StoreState>(
    () => ({
      tasks,
      search,
      setSearch,
      activity,
      modal,
      openCreate,
      openEdit,
      closeModal,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      isReady,
      isOnline,
    }),
    [
      tasks,
      search,
      activity,
      modal,
      openCreate,
      openEdit,
      closeModal,
      createTask,
      updateTask,
      deleteTask,
      moveTask,
      isReady,
      isOnline,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
