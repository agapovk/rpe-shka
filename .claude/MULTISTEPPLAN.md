Поэтапный план
Этап 1 — Quick wins (без изменений архитектуры)
Быстрые улучшения, не трогающие логику данных
#	Задача	Файлы
1.1	Zustand devtools middleware	features/survey/survey.store.ts
1.2	Confirmation dialog при удалении сессии	components/home/SessionCard.tsx
1.3	Error Boundary в layout	app/layout.tsx → новый components/ui/ErrorBoundary.tsx
1.4	Тёмная/светлая тема — подключить next-themes	app/layout.tsx, новый ThemeToggle компонент
1.5	Оптимизация шрифтов (font-display: swap, preload)	app/layout.tsx
Этап 2 — Переезд на IndexedDB
Меняем слой хранения, не трогая бизнес-логику
#	Задача	Детали
2.1	Установить idb-keyval	адаптер для Zustand StateStorage
2.2	Создать lib/idb-storage.ts	кастомный StateStorage через idb-keyval
2.3	Заменить persist storage в стор	features/survey/survey.store.ts — один параметр
2.4	Миграция данных	при первом запуске — читаем localStorage["rpe-storage"], пишем в IDB, чистим LS
2.5	Адаптировать useHydrated	IDB асинхронный — нужно правильно ждать гидрацию
Почему IDB: localStorage синхронный, блокирует main thread, лимит ~5 МБ. IDB асинхронный, лимит сотни МБ — нужно для истории сессий и будущего ростера.

Этап 3 — Расширение типов (основа для функционала)
Один коммит меняет типы и стор, не ломая UI
#	Задача	Детали
3.1	Добавить category к Session	'game' | 'training' | 'recovery', опциональное поле
3.2	Добавить players: Player[] в стор	перенести ROSTER из константы в управляемое состояние
3.3	addPlayer, updatePlayer, removePlayer в стор	CRUD для ростера
3.4	duplicateSession в стор	копирует name + rosterIds + category, сбрасывает scores/notes/date
Этап 4 — Функционал: управление составом + категории
Ф1 + Ф7 из списка
#	Задача	Файлы
4.1	Страница/модал управления ростером	новый components/roster/RosterManager.tsx
4.2	Добавить игрока (имя + номер)	форма с валидацией
4.3	Удалить / переименовать игрока	с проверкой: нет в активных сессиях
4.4	Выбор категории при создании сессии	обновить app/page.tsx (диалог создания)
4.5	Отображение категории на SessionCard	бейдж рядом с названием
Этап 5 — Функционал: поиск, фильтр, дублирование
Ф5 + Ф6 из списка
#	Задача	Файлы
5.1	Строка поиска по названию сессии	app/page.tsx + components/home/
5.2	Фильтр по категории	таб-бар или dropdown рядом с поиском
5.3	Кнопка "Дублировать сессию" на SessionCard	вызывает duplicateSession из стора
Этап 6 — PWA + CSV + Тесты
Технический «хвост»
#	Задача	Детали
6.1	PWA манифест + service worker	next-pwa или ручной public/manifest.json
6.2	CSV экспорт	расширить features/survey/survey.export.ts
6.3	Unit-тесты (Vitest)	survey.utils.ts, session.utils.ts, idb-storage.ts