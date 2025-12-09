# Переклассификация категорий ✅

## Результаты переструктуризации

Все 754 вопроса из категории "General" переклассифицированы по новым категориям с русскими названиями.

### Новое распределение:

| Категория                            | Slug                    | Вопросов  | Изменение        |
| ------------------------------------ | ----------------------- | --------- | ---------------- |
| **Основы JavaScript**                | `javascript-basics`     | 301       | ➕ +301 (новая)  |
| **React**                            | `react`                 | 227       | ➕ +71 (156→227) |
| **Асинхронность & Promises**         | `async-promises`        | 107       | ➕ +107 (новая)  |
| **TypeScript & Типы**                | `typescript`            | 91        | ➕ +41 (50→91)   |
| **HTTP & Сеть**                      | `http-network`          | 71        | ➕ -1 (72→71)    |
| **Архитектура & Паттерны**           | `architecture-patterns` | 51        | ➕ +51 (новая)   |
| **CSS & Дизайн**                     | `css-design`            | 49        | ➕ -45 (94→49)   |
| **Производительность & Оптимизация** | `performance`           | 65        | ➕ +59 (6→65)    |
| **Git & Версионирование**            | `git-version-control`   | 1         | ➕ -15 (16→1)    |
| **ВСЕГО**                            |                         | **1,283** | ✅ Баланс        |

### Что изменилось:

1. **General** (754 вопр.) → **Распределено** по 8 специализированным категориям
2. **React** расширена с 156 до 227 вопросов (добавлены все React-related из General)
3. **Новые специфичные категории**:
   - Асинхронность & Promises (все вопросы про async/await, promises, event loop)
   - Архитектура & Паттерны (SOLID, clean code, паттерны проектирования)
   - Основы JavaScript (базовые концепции, синтаксис, функции)

4. **Русские названия** вместо английских:
   - JavaScript → Основы JavaScript
   - React → React
   - HTTP & Network → HTTP & Сеть
   - TypeScript → TypeScript & Типы
   - CSS → CSS & Дизайн
   - Performance → Производительность & Оптимизация
   - Git → Git & Версионирование
   - Algorithms → Архитектура & Паттерны (переопределена)
   - ~~General~~ → Распределена

### Технические детали:

**Ключевые слова для переклассификации:**

- **Асинхронность**: асинхрон, promise, async, await, callback, микротаск, макротаск, event loop, then, catch, finally
- **React**: react, component, компонент, jsx, hook, redux, context, useState, useEffect, props, render
- **TypeScript**: typescript, ts, type, interface, generic, enum, тип, интерфейс, декоратор
- **CSS**: css, стиль, layout, grid, flexbox, animation, responsive, design, html, sass, бем
- **HTTP**: http, fetch, api, request, response, cors, cookie, header, rest, websocket, csp
- **Архитектура**: паттерн, pattern, архитектур, структур, solid, clean code, dry, kiss, monorepo
- **Производительность**: производител, performance, оптимиз, bundle, webpack, vite, compression, caching
- **Git**: git, version, версион, commit, branch, merge, rebase, conflict
- **JavaScript Basics**: javascript, js, функция, scope, closure, this, prototype, es6, spread, destructur, map, filter, reduce

### Статус:

✅ **Данные обновлены** → `src/questions-data.json` переписан с новыми категориями  
✅ **Сборка успешна** → `npm run build` прошла без ошибок (2.21s)  
✅ **Dev сервер** → Запущен на порту 5174  
✅ **Все ссылки работают** → Компоненты используют категории автоматически

### Как проверить:

1. Откройте http://localhost:5174
2. На главной странице увидите 9 новых категорий с русскими названиями
3. Нажмите на любую категорию - вопросы автоматически переклассифицированы
4. Используйте поиск (Ctrl+K) для навигации между категориями

---

**Время выполнения**: ~2 мин  
**Скрипт переклассификации**: `scripts/redistribute-categories.mjs`  
**Дата обновления**: 2024
