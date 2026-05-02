# Synapse — Team Collaboration Tool · Build Workflow

A 3-hour hackathon plan for an AI-evaluated **Team Collaboration Tool** built with Next.js + Tailwind, deployed to GCP. Frontend-first with mock data, then Firebase on top.

**Scoring focuses on:** code quality, security, efficiency, testing, accessibility, problem-statement alignment, and Google/GCP service usage.

---

## Product Snapshot

**Synapse** — a clean Kanban board for small teams. Three columns (**To Do / In Progress / Done**), task cards showing title, description, assignee, due date, and priority. Lightweight collaboration: team panel, activity feed, search + filters. No chat, no video, no docs.

**Stack**
- Next.js (App Router, static export) + TypeScript
- Tailwind CSS v4
- `lucide-react` icons
- React Context store + `localStorage` (fallback) → **Firebase Firestore** (primary)
- **Firebase Anonymous Auth** for identity
- Deploy target: **Firebase Hosting** (GCP)

---

## Progress Tracker

| Session | Status |
|---|---|
| 1 — UI Foundation & Polished Layout | ✅ Done |
| 2 — Interactive Task Management (Local State) | ✅ Done |
| 3 — Firebase Integration, Realtime, Deploy | 🟢 Firebase live — awaiting deploy |

---

## Session 1 — UI Foundation ✅ DONE

- [x] Inter font, slate background, indigo accent, focus rings
- [x] Sidebar: Synapse branding, nav items with icons, active state, team panel
- [x] Header: title/subtitle, search, notifications, "New Task" button, avatar — sticky
- [x] Stats row: Total / In Progress / Completed / Overdue
- [x] Polished task cards: title, description, priority pill, due date, assignee initials, hover lift
- [x] Empty state, semantic landmarks, aria labels, visible focus

---

## Session 2 — Interactive Task Management ✅ DONE

- [x] React Context store (`lib/store.tsx`) — single source of truth
- [x] Create / Edit / Delete task via modal (with validation)
- [x] Move-to-column via card `…` menu
- [x] Live search + priority/assignee filters with Clear, "Showing X of Y"
- [x] Activity feed — last events with relative timestamps
- [x] `localStorage` persistence (key `synapse:v1`) as offline fallback
- [x] Esc + backdrop close, focus management, accessible modal

---

## Session 3 — Firebase + Realtime + Deploy 🟡 IN PROGRESS

### Step A — Firebase wiring ✅ DONE

- [x] `lib/firebase.ts` — initializes Firestore + Auth from env vars; safely no-ops if env is missing
- [x] `.env.local.example` — documents required env vars
- [x] `firestore.rules` — auth-required reads/writes + payload validation
- [x] `firestore.indexes.json`, `firebase.json` (hosting + firestore config)
- [x] `next.config.ts` set to `output: "export"` for static hosting
- [x] Store rewritten with dual mode: Firestore when configured, `localStorage` otherwise
- [x] Anonymous sign-in on app load
- [x] One-time seed: if Firestore is empty on first connect, write the mock tasks
- [x] Realtime `onSnapshot` listeners for `tasks` and `activity`
- [x] `npm install firebase` (done)
- [x] Firebase project created, Anonymous auth + Firestore enabled (done)
- [x] `.env.local` filled with config values (done)
- [x] Hydration fix — deterministic date format
- [x] Firestore `undefined` fix — empty description sent as `""`
- [x] Status menu now shows only the *other* two columns (current excluded)
- [ ] Verify: open localhost in two browsers; changes sync live

### Step B — Security 🟡 Rules written, not yet deployed

- [x] `firestore.rules` requires auth, validates payload shape
- [x] `.env*` already in `.gitignore` (no secrets in repo)
- [ ] **YOU:** Deploy rules with `firebase deploy --only firestore:rules`

### Step C — Deploy to GCP ⏳

- [x] `firebase.json` configured for static export from `out/`
- [ ] **YOU:** `npm install -g firebase-tools` (or use `npx firebase-tools`)
- [ ] **YOU:** `firebase login`
- [ ] **YOU:** `firebase use --add` (pick the project)
- [ ] **YOU:** `npm run build` → produces `out/`
- [ ] **YOU:** `firebase deploy` → public GCP URL
- [ ] Add the URL to README

### Step D — Polish & submit ✅

- [x] Skip-to-content link, `prefers-reduced-motion` support
- [x] Live realtime indicator in header (Firestore connection signal, `role="status"`)
- [x] Empty-board CTA for first-run UX
- [x] Two test files (board render + team helpers) + `vitest.config.ts` + `npm test`
- [x] Full README — features, architecture, GCP services, run + deploy instructions
- [x] Hardened `firestore.rules`: `keys().hasOnly()`, length caps, ISO date regex, default-deny catch-all
- [x] `aria-live="polite"` on activity feed for screen-reader announcements
- [x] `React.memo` on `TaskCard` to skip re-renders when its task prop is unchanged

---

## Next steps for YOU (in WSL)

```bash
cd ~/team-collab

# 1. Install firebase
npm install firebase

# 2. Create your env file (then fill in values from Firebase console)
cp .env.local.example .env.local

# 3. Run the dev server to verify everything still works
npm run dev
```

In the **Firebase Console** (browser):
1. Create a project (any name, e.g. `synapse-collab`)
2. Add a **Web app** → copy the config into `.env.local`
3. **Authentication → Sign-in method** → enable **Anonymous**
4. **Firestore Database** → Create database → Production mode → pick a region

When you refresh localhost after that, the app will sign you in anonymously, seed the initial tasks into Firestore, and switch to realtime mode.

---

## Submission Checklist

- [ ] Public GCP URL loads with no console errors
- [ ] Create / edit / delete / move all work end-to-end
- [ ] Two browsers see realtime updates
- [ ] Firestore rules require auth (deployed)
- [ ] At least one passing test
- [ ] README explains setup + features + GCP services used
