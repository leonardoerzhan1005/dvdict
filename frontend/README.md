 dictionary-terms-frontend/
│
├── public/
│   ├── index.html
│   └── favicon.svg
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AdminLayout.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   └── common/
│   │       ├── LanguageSwitcher.tsx
│   │       ├── SearchBar.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   │
│   │   ├── dictionary/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   ├── TermsPage.tsx
│   │   │   ├── TermDetailsPage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   └── TermForm.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   ├── SearchPage.tsx
│   │   │   └── Autocomplete.tsx
│   │   │
│   │   ├── favorites/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── FavoritesPage.tsx
│   │   │
│   │   ├── suggestions/
│   │   │   ├── api.ts
│   │   │   ├── types.ts
│   │   │   └── SuggestionForm.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── api.ts
│   │   │   ├── types.ts
│   │   │   ├── AdminRoutes.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ModerationPage.tsx
│   │   │   ├── UsersPage.tsx
│   │   │   ├── ImportPage.tsx
│   │   │   └── ExportPage.tsx
│   │   │
│   │   └── profile/
│   │       ├── api.ts
│   │       ├── types.ts
│   │       └── ProfilePage.tsx
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── kz.json
│   │   ├── ru.json
│   │   └── en.json
│   │
│   ├── services/
│   │   ├── http.ts
│   │   ├── auth.ts
│   │   └── tokens.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   └── appStore.ts
│   │
│   ├── types/
│   │   ├── common.ts
│   │   └── api.ts
│   │
│   ├── utils/
│   │   ├── guards.tsx
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── env.d.ts
│
├── .env
├── .env.production
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md



2. Технологический стек

React 18+

TypeScript (TSX)

Vite

React Router v6

State Management: Zustand или Redux Toolkit

HTTP: Axios

UI: Tailwind CSS или MUI (по согласованию)

i18n: i18next / react-i18next

Form: React Hook Form + Zod

Auth: JWT (access + refresh)

Build: Vite

Lint/Format: ESLint, Prettier

3. Архитектура frontend
3.1 Принципы

Компонентный подход

SOLID / DRY

Разделение:

UI компоненты

бизнес-логика

API слой

Отсутствие логики доступа напрямую к БД

3.2 Структура проекта
dictionary-terms-frontend/
  src/
    app/
      App.tsx
      main.tsx
      router.tsx
    assets/
    components/
      ui/
        Button.tsx
        Input.tsx
        Select.tsx
        Modal.tsx
        Pagination.tsx
      layout/
        Header.tsx
        Footer.tsx
        Sidebar.tsx
        LanguageSwitcher.tsx
    features/
      auth/
        api.ts
        store.ts
        types.ts
        LoginPage.tsx
        RegisterPage.tsx
      dictionary/
        api.ts
        store.ts
        types.ts
        TermsPage.tsx
        TermDetailsPage.tsx
        CategoryPage.tsx
        TermForm.tsx
      search/
        api.ts
        store.ts
        SearchPage.tsx
        Autocomplete.tsx
      favorites/
        api.ts
        store.ts
        FavoritesPage.tsx
      suggestions/
        api.ts
        SuggestionForm.tsx
      admin/
        api.ts
        AdminDashboard.tsx
        UsersPage.tsx
        ModerationPage.tsx
        ImportPage.tsx
        ExportPage.tsx
    i18n/
      index.ts
      kz.json
      ru.json
      en.json
    services/
      http.ts
      auth.ts
      tokens.ts
    store/
      index.ts
    types/
      common.ts
    utils/
      guards.ts
      formatters.ts
    styles/
      globals.css

4. Роли и доступ (RBAC)
Функция	User	Editor/Moderator	Admin
Просмотр терминов	✔	✔	✔
Поиск, фильтрация	✔	✔	✔
Избранное	✔	✔	✔
Предложение терминов	✔	✔	✔
Создание/редактирование терминов	✖	✔	✔
Модерация	✖	✔	✔
Импорт / Экспорт	✖	✔	✔
Управление пользователями	✖	✖	✔

Доступ управляется:

через JWT

через ProtectedRoute компоненты

5. Мультиязычность (i18n)
5.1 Языки интерфейса

kazakh (kz)

russian (ru)

english (en)

5.2 Поведение

Язык выбирается пользователем

Сохраняется в localStorage

Передается в API как ?lang=ru

5.3 Пример
i18n.changeLanguage("ru")
axios.get(`/api/terms?lang=ru`)

6. Основные страницы и функционал
6.1 Главная страница

Поисковая строка

Быстрые категории

Часто используемые термины

Автодополнение (autocomplete)

6.2 Поиск терминов

URL: /search

Функции:

поиск по слову и определению

фильтры:

категория (с подкатегориями)

язык

первая буква

популярность

дата добавления

пагинация

сортировка

6.3 Категории

URL: /categories/:id

список терминов в категории

фильтры и сортировка

локализация названий

6.4 Детальная страница термина

URL: /terms/:id

Поля:

название (title)

определение

короткое определение

примеры

синонимы / антонимы

теги

категория

просмотры

кнопка «Добавить в избранное»

вкладки языков (kz / ru / en)

6.5 Авторизация
Страницы:

/login

/register

/forgot-password

Функции:

JWT логин

обновление токена

защита маршрутов

6.6 Профиль пользователя

URL: /profile

Разделы:

личные данные

избранные термины

история поиска

предложения терминов

6.7 Избранное

URL: /favorites

список сохраненных терминов

удаление из избранного

6.8 Предложения терминов

URL: /suggest

Форма:

язык

текст термина

определение

категория

7. Админ-панель
7.1 Дашборд

URL: /admin

статистика

количество терминов, пользователей, предложений

7.2 Модерация терминов

URL: /admin/moderation

Функции:

просмотр терминов со статусами pending

approve / reject (с комментарием)

редактирование

7.3 Управление пользователями

URL: /admin/users

список пользователей

смена ролей

7.4 Импорт / Экспорт

URL: /admin/import, /admin/export

загрузка CSV / JSON / Excel

статус загрузки

выгрузка словаря

8. API взаимодействие
8.1 Пример API слоя
export const getTerms = (params) =>
  api.get("/api/terms", { params })

export const searchTerms = (params) =>
  api.get("/api/search", { params })

export const getTermById = (id, lang) =>
  api.get(`/api/terms/${id}?lang=${lang}`)

9. Безопасность

Access Token хранится в памяти

Refresh Token в httpOnly cookie

Защита маршрутов через ProtectedRoute

Проверка ролей

<ProtectedRoute roles={["admin"]}>
  <AdminDashboard />
</ProtectedRoute>

10. UX требования

адаптивность (desktop / tablet / mobile)

skeleton-загрузки

debounce для поиска

ошибки отображаются через toast/alert

пагинация обязательна

11. Типы данных (Frontend)
export interface Term {
  id: number
  slug: string
  category_id: number
  status: string
  views: number
  language: "kz" | "ru" | "en"
  title: string
  definition: string
  short_definition?: string
  examples?: string
  synonyms?: string
  antonyms?: string
}

12. Нефункциональные требования

Поддержка минимум 10k терминов

Быстрая работа поиска (autocomplete < 300мс)

SSR не требуется

Код без inline-комментариев

Строгая типизация TypeScript

13. Минимально обязательные функции

Поиск и фильтрация

Детальные страницы терминов

Мультиязычность

Авторизация и роли

Избранное

Модерация

Импорт / Экспорт

Если хочешь, дальше могу:

🔹 сгенерировать Figma-структуру страниц

🔹 дать готовый шаблон проекта (Vite + TS + Router + i18n)

🔹 или собрать пример компонентов: SearchPage, TermDetailsPage, AdminPanel с типами и API-слоем.

AdminPanel с типами и API-слоем.

Ниже — готовый AdminPanel (React + TypeScript) с типами, API-слоем и страницами модерации/пользователей/импорта/экспорта, совместимый с твоим backend.

Без комментариев в коде, строгая типизация.

1) Типы (src/types/admin.ts)
export type Role = "admin" | "editor" | "user"

export type TermStatus = "draft" | "pending" | "approved" | "rejected" | "archived"

export interface User {
  id: number
  name: string
  email: string
  role: Role
  is_email_verified: boolean
  created_at: string
}

export interface TermModerationItem {
  id: number
  slug: string
  category_id: number
  status: TermStatus
  created_at: string
  updated_at: string
  language: "kz" | "ru" | "en"
  title: string
  short_definition?: string
  views: number
}

export interface ModerationRejectPayload {
  reason: string
}

export interface ImportJob {
  job_id: string
  status: string
}

export interface ImportStatus {
  job_id: string
  status: string
  imported: number
  failed: number
  errors: { row_number: number; field: string; message: string }[]
}

export interface ExportResult {
  format: "csv" | "json"
  url: string
}

export interface PageMeta {
  page: number
  size: number
  total: number
  pages: number
}

export interface PageResponse<T> {
  meta: PageMeta
  items: T[]
}

2) HTTP-клиент (src/services/http.ts)
import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = await api.post("/api/auth/refresh")
      const access = refresh.data?.tokens?.access_token
      if (access) {
        sessionStorage.setItem("access_token", access)
        error.config.headers.Authorization = `Bearer ${access}`
        return api.request(error.config)
      }
    }
    return Promise.reject(error)
  }
)

3) API-слой админки (src/features/admin/api.ts)
import { api } from "@/services/http"
import {
  PageResponse,
  User,
  TermModerationItem,
  ModerationRejectPayload,
  ImportJob,
  ImportStatus,
  ExportResult
} from "@/types/admin"

export const adminApi = {
  getUsers: (page = 1, size = 20) =>
    api.get<PageResponse<User>>("/api/admin/users", { params: { page, size } }),

  updateUserRole: (userId: number, role: "admin" | "editor" | "user") =>
    api.patch(`/api/admin/users/${userId}/role`, { role }),

  getPendingTerms: (page = 1, size = 20) =>
    api.get<PageResponse<TermModerationItem>>("/api/admin/moderation", { params: { page, size } }),

  approveTerm: (id: number) =>
    api.post(`/api/terms/${id}/approve`),

  rejectTerm: (id: number, payload: ModerationRejectPayload) =>
    api.post(`/api/terms/${id}/reject`, payload),

  startImport: (file: File) => {
    const form = new FormData()
    form.append("file", file)
    return api.post<ImportJob>("/api/import", form, {
      headers: { "Content-Type": "multipart/form-data" }
    })
  },

  getImportStatus: (jobId: string) =>
    api.get<ImportStatus>(`/api/import/${jobId}`),

  exportData: (format: "csv" | "json", params: Record<string, any>) =>
    api.get<ExportResult>("/api/export", { params: { format, ...params } })
}

4) Роутинг админки (src/features/admin/AdminRoutes.tsx)
import { Routes, Route, Navigate } from "react-router-dom"
import { AdminDashboard } from "./AdminDashboard"
import { ModerationPage } from "./ModerationPage"
import { UsersPage } from "./UsersPage"
import { ImportPage } from "./ImportPage"
import { ExportPage } from "./ExportPage"

export const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="/moderation" element={<ModerationPage />} />
    <Route path="/users" element={<UsersPage />} />
    <Route path="/import" element={<ImportPage />} />
    <Route path="/export" element={<ExportPage />} />
    <Route path="*" element={<Navigate to="/admin" />} />
  </Routes>
)

5) Дашборд (src/features/admin/AdminDashboard.tsx)
import { Link } from "react-router-dom"

export const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/admin/moderation" className="p-4 border rounded">Moderation</Link>
        <Link to="/admin/users" className="p-4 border rounded">Users</Link>
        <Link to="/admin/import" className="p-4 border rounded">Import</Link>
        <Link to="/admin/export" className="p-4 border rounded">Export</Link>
      </div>
    </div>
  )
}

6) Модерация терминов (src/features/admin/ModerationPage.tsx)
import { useEffect, useState } from "react"
import { adminApi } from "./api"
import { TermModerationItem, PageMeta } from "@/types/admin"

export const ModerationPage = () => {
  const [items, setItems] = useState<TermModerationItem[]>([])
  const [meta, setMeta] = useState<PageMeta | null>(null)
  const [page, setPage] = useState(1)
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [reason, setReason] = useState("")

  const load = async () => {
    const { data } = await adminApi.getPendingTerms(page, 20)
    setItems(data.items)
    setMeta(data.meta)
  }

  useEffect(() => { load() }, [page])

  const approve = async (id: number) => {
    await adminApi.approveTerm(id)
    await load()
  }

  const reject = async () => {
    if (!rejectId) return
    await adminApi.rejectTerm(rejectId, { reason })
    setRejectId(null)
    setReason("")
    await load()
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Moderation</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Lang</th>
            <th className="border p-2">Views</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.id}</td>
              <td className="border p-2">{t.title}</td>
              <td className="border p-2">{t.language}</td>
              <td className="border p-2">{t.views}</td>
              <td className="border p-2 space-x-2">
                <button className="px-3 py-1 border" onClick={() => approve(t.id)}>Approve</button>
                <button className="px-3 py-1 border" onClick={() => setRejectId(t.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta && (
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span>{meta.page} / {meta.pages}</span>
          <button disabled={page >= meta.pages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}

      {rejectId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 space-y-2 w-96">
            <h2 className="text-lg">Reject term #{rejectId}</h2>
            <textarea
              className="w-full border p-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setRejectId(null)}>Cancel</button>
              <button onClick={reject}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

7) Управление пользователями (src/features/admin/UsersPage.tsx)
import { useEffect, useState } from "react"
import { adminApi } from "./api"
import { User, PageMeta } from "@/types/admin"

export const UsersPage = () => {
  const [items, setItems] = useState<User[]>([])
  const [meta, setMeta] = useState<PageMeta | null>(null)
  const [page, setPage] = useState(1)

  const load = async () => {
    const { data } = await adminApi.getUsers(page, 20)
    setItems(data.items)
    setMeta(data.meta)
  }

  useEffect(() => { load() }, [page])

  const changeRole = async (id: number, role: "admin" | "editor" | "user") => {
    await adminApi.updateUserRole(id, role)
    await load()
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Users</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Verified</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value as any)}
                  className="border p-1"
                >
                  <option value="user">user</option>
                  <option value="editor">editor</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="border p-2">{u.is_email_verified ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta && (
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span>{meta.page} / {meta.pages}</span>
          <button disabled={page >= meta.pages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}

8) Импорт (src/features/admin/ImportPage.tsx)
import { useState } from "react"
import { adminApi } from "./api"
import { ImportStatus } from "@/types/admin"

export const ImportPage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<ImportStatus | null>(null)

  const start = async () => {
    if (!file) return
    const { data } = await adminApi.startImport(file)
    poll(data.job_id)
  }

  const poll = async (jobId: string) => {
    const timer = setInterval(async () => {
      const { data } = await adminApi.getImportStatus(jobId)
      setStatus(data)
      if (data.status === "finished" || data.status === "failed") clearInterval(timer)
    }, 1500)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Import</h1>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button className="border px-3 py-1" onClick={start}>Start Import</button>

      {status && (
        <div className="border p-3">
          <div>Status: {status.status}</div>
          <div>Imported: {status.imported}</div>
          <div>Failed: {status.failed}</div>
          {status.errors.length > 0 && (
            <ul className="list-disc pl-6">
              {status.errors.map((e, i) => (
                <li key={i}>Row {e.row_number}: {e.field} — {e.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

9) Экспорт (src/features/admin/ExportPage.tsx)
import { useState } from "react"
import { adminApi } from "./api"

export const ExportPage = () => {
  const [format, setFormat] = useState<"csv" | "json">("csv")
  const [lang, setLang] = useState<"kz" | "ru" | "en">("ru")
  const [categoryId, setCategoryId] = useState<string>("")
  const [url, setUrl] = useState<string | null>(null)

  const run = async () => {
    const { data } = await adminApi.exportData(format, {
      lang,
      category_id: categoryId || undefined,
      status: "approved"
    })
    setUrl(data.url)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Export</h1>

      <div className="flex gap-2">
        <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="border p-1">
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>

        <select value={lang} onChange={(e) => setLang(e.target.value as any)} className="border p-1">
          <option value="kz">kz</option>
          <option value="ru">ru</option>
          <option value="en">en</option>
        </select>

        <input
          className="border p-1"
          placeholder="Category ID"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        />

        <button className="border px-3 py-1" onClick={run}>Export</button>
      </div>

      {url && (
        <div>
          <a className="text-blue-600 underline" href={url} target="_blank">Download</a>
        </div>
      )}
    </div>
  )
}

10) Защита маршрутов по ролям (src/utils/guards.tsx)
import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth"

export const ProtectedRoute = ({ roles, children }: { roles: string[]; children: JSX.Element }) => {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" />
  if (!roles.includes(user.role)) return <Navigate to="/" />
  return children
}


Использование:

<ProtectedRoute roles={["admin"]}>
  <AdminRoutes />
</ProtectedRoute>


Если хочешь, следующим шагом могу:

собрать единый AdminLayout с Sidebar и Breadcrumbs,

добавить i18n для всей админки (kz/ru/en),

или дать готовый mock API + MSW для разработки без backend.

нужно структура проекта фронтенд

Вот чёткая и масштабируемая структура проекта для frontend (React + TypeScript / TSX) под твой backend (микросервисы, i18n, поиск, модерация, избранное, импорт/экспорт).

Формат — production-ready архитектура.

📁 Структура проекта Frontend

Stack: React 18 + TypeScript + Vite + Router + i18n + Zustand/Redux

dictionary-terms-frontend/
│
├── public/
│   ├── index.html
│   └── favicon.svg
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AdminLayout.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── Spinner.tsx
│   │   │
│   │   └── common/
│   │       ├── LanguageSwitcher.tsx
│   │       ├── SearchBar.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── ForgotPasswordPage.tsx
│   │   │
│   │   ├── dictionary/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   ├── TermsPage.tsx
│   │   │   ├── TermDetailsPage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   └── TermForm.tsx
│   │   │
│   │   ├── search/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   ├── SearchPage.tsx
│   │   │   └── Autocomplete.tsx
│   │   │
│   │   ├── favorites/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   ├── types.ts
│   │   │   └── FavoritesPage.tsx
│   │   │
│   │   ├── suggestions/
│   │   │   ├── api.ts
│   │   │   ├── types.ts
│   │   │   └── SuggestionForm.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── api.ts
│   │   │   ├── types.ts
│   │   │   ├── AdminRoutes.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ModerationPage.tsx
│   │   │   ├── UsersPage.tsx
│   │   │   ├── ImportPage.tsx
│   │   │   └── ExportPage.tsx
│   │   │
│   │   └── profile/
│   │       ├── api.ts
│   │       ├── types.ts
│   │       └── ProfilePage.tsx
│   │
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── kz.json
│   │   ├── ru.json
│   │   └── en.json
│   │
│   ├── services/
│   │   ├── http.ts
│   │   ├── auth.ts
│   │   └── tokens.ts
│   │
│   ├── store/
│   │   ├── index.ts
│   │   └── appStore.ts
│   │
│   ├── types/
│   │   ├── common.ts
│   │   └── api.ts
│   │
│   ├── utils/
│   │   ├── guards.tsx
│   │   ├── formatters.ts
│   │   └── validators.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   └── env.d.ts
│
├── .env
├── .env.production
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md

🧠 Логика архитектуры
🔹 app/

Точка входа:

main.tsx — bootstrap React

App.tsx — layout + router

router.tsx — маршруты (public/admin/protected)

🔹 components/

Переиспользуемые UI и layout-компоненты:

ui/ — кнопки, таблицы, модалки

layout/ — Header, Sidebar, AdminLayout

common/ — LanguageSwitcher, SearchBar, ProtectedRoute

🔹 features/ — Feature-based архитектура

Каждый домен:

api.ts — REST вызовы

types.ts — интерфейсы

store.ts — состояние

Page.tsx — UI

Пример:

features/dictionary/
  api.ts
  types.ts
  store.ts
  TermsPage.tsx

🔹 i18n/

Мультиязычность:

i18n/
  index.ts
  kz.json
  ru.json
  en.json


Использование:

t("search.placeholder")

🔹 services/

Общие сервисы:

http.ts — Axios клиент

auth.ts — login/refresh/logout

tokens.ts — работа с JWT

🔹 utils/

guards.tsx — RBAC и ProtectedRoute

validators.ts — формы

formatters.ts — форматирование

🔹 types/

Глобальные типы:

пагинация

ошибки

api responses

 

🌍 Мультиязычность

язык хранится в localStorage

передаётся в API как ?lang=ru

переключатель в components/common/LanguageSwitcher.tsx

 