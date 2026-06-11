# Статус разработки

## Фазы

| Фаза | Что | Статус |
|------|-----|--------|
| 1 | Каркас: Vite + TanStack Router + Tailwind v4 + тема | ✓ |
| 2 | Слой данных: Dexie + seed | ✓ |
| 3 | Все срезы + UX-проход + ревизия | ✓ |
| 4 | PWA + тесты + деплой | ⬜ |

Ветка текущей фазы: `feat/phase-N-…` → PR → `main`.

---

## Принятые решения

| Вопрос | Решение | Причина |
|--------|---------|---------|
| TanStack Start | Убран, чистый Vite | SPA без сервера — Start давал только обёртку |
| XLSX | Dynamic `import('xlsx')` | 282 КБ грузятся по клику, не раздувают precache |
| SW стратегия | CacheFirst | На поле связь мерцает — NetworkFirst висел бы до таймаута |
| Сид | `db.on('populate')` | count-check: гонка в StrictMode → задвоение ростера |
| Каскад удаления | Транзакция: rpeEntries + rosterIds | Без каскада зомби-оценки искажали avg |
| Категории | Привязаны к сессиям | Раньше CRUD был, но categoryId нигде не присваивался |
| RPE словарь | `shared/lib/rpe.ts` | Бакеты использовали 3 среза — одно место изменения |
| ScoreSheet | Тап по баллу = сохранить+закрыть, тап снова = сброс | Скорость опроса: 2 тапа на игрока |
| «Did not train» | Убирает игрока из сессии прямо в ScoreSheet | Без входа в Edit roster |

---

## Фаза 4 — что осталось

```
□ vite-plugin-pwa: manifest, иконки 192/512/maskable, theme_color
□ Workbox: precache app shell, CacheFirst, registerType: 'autoUpdate'
□ Lighthouse: installable + offline works
□ Vitest: rpeBucket, calcSessionStats, calcSessionSummary, calcHomeStats
□ pnpm test зелёный
□ Деплой (Netlify / Cloudflare Pages / Vercel)
□ README: задача, VSA-диаграмма, стек, офлайн-гиф, ссылка на демо
```

## Чек-лист перед деплоем

```
□ pnpm build — без ошибок
□ tsc --noEmit — без ошибок
□ pnpm check — чист
□ pnpm test — зелёный
□ Флоу: создать сессию → оценить → результаты → XLSX
□ Офлайн: DevTools Offline → работает, данные сохраняются
□ PWA: Lighthouse installable
```
