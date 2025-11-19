DEMO - [https://getcash-balance-service.vercel.app/](https://getcash-balance-service.vercel.app/)

---

# 1. Правила зависимостей

- `app/*` может импортировать из всех слоёв
- `pages/*` может импортировать `entities/*` и `shared/*` и `pages/*/model` (локальные модели других страниц — запрещено)
- `entities/*` может импортировать только `shared/*` и `entities/*` (другие сущности допускаются, но осторожно)
- `shared/*` не должен импортировать `entities/*`, `pages/*` или `app/*`

---

# 2. Public API: где и зачем `index.ts`

**Идея:** `index.ts` — контракт слоя. Экспортирует _только_ то, что разрешено внешним слоям. Это уменьшает связность и упрощает рефакторинг

**Где делаем public API:**

- `shared/api`
- `shared/utils`
- `shared/types`
- `entities/<name>`
- `pages/*`

**Формат index.ts:**

```ts
// shared/api/index.ts
export { api } from "./api"
```

---

# 3. Нэйминг (файлы и папки)

**Папки:** только kebab-case (`orders`, `user-profile`, `page-home`)

**Файлы:** camelCase для логики, PascalCase для компонентов

### Форматы имён по типам файлов

| Тип файла                 | Формат                                    | Примеры                                            |
| ------------------------- | ----------------------------------------- | -------------------------------------------------- |
| React компоненты          | **PascalCase**                            | `OrdersPage.tsx`, `UserCard.tsx`, `EmptyState.tsx` |
| Хуки                      | **camelCase** (всегда начинаются с `use`) | `useOrders.ts`, `usePagination.ts`                 |
| Утилиты / функции         | **camelCase**                             | `formatDate.ts`, `buildHeaders.ts`                 |
| Конфигурации / метаданные | **kebab-case**                            | `vite.config.ts`, `routes-meta.ts`                 |
| Типы / интерфейсы         | `types.ts`                                | `types.ts`                                         |
| Константы                 | `constants.ts`                            | `constants.ts`                                     |
| Публичные точки входа     | `index.ts`                                | `index.ts`                                         |

---
