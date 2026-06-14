# Статус разработки

## Фазы

| Фаза | Что | Статус |
|------|-----|--------|
| 1 | Каркас: Vite + TanStack Router + Tailwind v4 + тема | ✓ |
| 2 | Слой данных: Dexie + seed | ✓ |
| 3 | Все срезы + UX-проход + ревизия | ✓ |
| 4 | PWA + тесты + деплой | ✓ |
| 5 | Мелкие UI-улучшения | ▶ |

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

## Фаза 4 — сделано

```
✓ vite-plugin-pwa: manifest, иконки 192/512/maskable, theme_color
✓ Workbox: precache app shell, registerType: 'autoUpdate'
✓ Vitest: rpeBucket, calcSessionStats, calcSessionSummary, calcHomeStats — 22 теста зелёные
✓ pnpm typecheck / check — чисто
✓ Деплой: Vercel → https://rpe-shka.vercel.app
✓ README: краткий, портфолио-уровня
```

## Фаза 5 — UI-полироль

```
✓ active: тач-фидбэк (карточки, строки, фильтры, чипы, кнопки, RPE-шкала)
✓ ScoreSheet: slide-up + fade подложки, утилиты --animate-* в @theme
✓ prefers-reduced-motion: глобальный сброс анимаций
✓ Результаты: AVG RPE + Distribution в ряд, под ними 4 стата; calcDistribution + 2 теста
✓ Заметки: иконка у счёта + раскрытие текста в строке (results + опрос)
✓ Опрос: оценённая строка заливается светло-зелёным (bg-accent/10), галочка убрана
✓ ScoreSheet: счётчик остатка символов у лимита заметки
✓ Единый нижний отступ: main pt-5 + sticky-футер pb-5 (убран двойной паддинг)
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
