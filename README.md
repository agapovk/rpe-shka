# RPE Tracker

Офлайн PWA для тренера: собирает оценки нагрузки (RPE 1–10) от игроков после тренировки. Работает без интернета — все данные в IndexedDB.

**[Live demo →](https://rpe-shka.vercel.app)**

---

**Стек:** Vite + React 19 · TanStack Router · Dexie.js · Tailwind CSS v4 · vite-plugin-pwa

**Архитектура:** Vertical Slice Architecture — каждый срез (record-rpe, view-results, manage-session, manage-roster) изолирован и содержит UI / model / queries / mutations.

---

```bash
pnpm install
pnpm dev      # :3000
pnpm build
pnpm test     # vitest, 22 теста
```
