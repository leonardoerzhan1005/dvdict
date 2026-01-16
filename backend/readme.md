Техническое задание (Backend) — Dictionary-Terms
1) Цель системы
Создать backend для веб-приложения “Словарь и Термины”, где:
* создаются и управляются категории (в т.ч. подкатегории);
* создаются термины, каждый термин имеет переводы на разные языки (kz/ru/en);
* термины проходят модерацию по статусам;
* пользователи могут искать термины с фильтрацией и открывать детальную страницу;
* пользователи могут добавлять термины в избранное;
* поддерживаются массовый импорт/экспорт.

2) Стек и ограничения
* FastAPI (REST API)
* SQLAlchemy 2.x (ORM)
* Pydantic v2 (валидация, схемы)
* SQLite (основная БД)
* Alembic (миграции)
* JWT Access + Refresh (OAuth2 Password Flow)
* Код без комментариев
* Языки данных/контента: kz/ru/en
* Требования к качеству: ООП, DRY, SOLID-подход, слоистая архитектура, безопасные практики

3) Архитектура
3.1 Тип
* Микросервисная архитектура (обязательно)
3.2 Сервисы (обязательно)
1. Auth Service
    * регистрация/логин/refresh/logout
    * email подтверждение
    * восстановление пароля
    * роли и RBAC
2. Dictionary Service
    * CRUD терминов и переводов
    * CRUD категорий и их переводов
    * модерация статусов
    * теги
3. Search Service
    * поиск по title/definition/examples/tags
    * фильтры, сортировки, пагинация
    * autocomplete
4. Admin/Moderation Service
    * управление пользователями и ролями
    * модерация терминов
    * аудит действий
5. Import/Export Service
    * импорт CSV/Excel/JSON
    * экспорт CSV/JSON
    * проверка дублей и валидация данных
3.3 Общие принципы
* REST API, JSON
* Контракты API стабильные
* Разделение слоев: API → Service → Repository → DB
* Валидация входных данных через Pydantic
* Единый формат ошибок (error_code/message/details)

4) Роли и доступ (RBAC)
4.1 Роли
* admin: полный доступ ко всем сервисам
* editor/moderator: создание/редактирование терминов, модерация, импорт
* user: просмотр, поиск, избранное, предложения терминов
4.2 Матрица доступа (минимум)
* Термины:
    * user: read (только approved)
    * editor: create/update (draft/pending), submit to pending
    * moderator/admin: approve/reject, edit, archive
* Категории:
    * user: read
    * editor/admin: create/update
* Импорт/экспорт:
    * editor/admin: import/export
* Пользователи:
    * admin: manage users/roles
    * user: profile read/update (ограниченно)

5) Пользователи (Auth)
5.1 Функции
* Регистрация: email (+ имя), пароль
* Логин: JWT access + refresh
* Refresh токен
* Logout (инвалидация refresh)
* Подтверждение email (token-based)
* Сброс пароля (token-based)
* (Опционально) телефон/SSO — как расширение
5.2 Профиль пользователя
* Избранные термины
* История поиска
* История просмотров (минимум: last viewed)
* Отправленные предложения терминов
* (Опционально) комментарии

6) Термины (Core)
6.1 Требования
* Один термин = логическая запись (terms)
* Тексты на разных языках = term_translations
* Термин относится к категории
* Термин имеет статус модерации
* Поддержка soft delete
6.2 Статусы модерации
* draft
* pending
* approved
* rejected
* (опционально) archived
6.3 Карточка термина (логика)
* Должно быть возможно хранить:
    * title/definition/short_definition/examples/synonyms/antonyms для каждого языка
* Просмотры (views) увеличиваются при открытии детальной страницы
* Slug уникален на уровне terms

7) Мультиязычность
7.1 Языки
* Поддержка минимум: kz, ru, en
* lang как параметр API: ?lang=ru
7.2 Хранение переводов
* Отдельные таблицы:
    * term_translations
    * category_translations
7.3 Поведение API
* Если lang указан:
    * возвращать данные на этом языке
    * если перевода нет — fallback (по приоритету: ru → en → kz или настраиваемый порядок)

8) Поиск и фильтрация
8.1 Поиск
* По title, definition, short_definition, examples, synonyms, tags
* Режимы:
    * стандартный поиск
    * autocomplete
8.2 Фильтры (обязательно)
* категория (включая подкатегории)
* язык
* первая буква
* популярность (views/добавления в избранное)
* дата добавления (created_at)
8.3 Пагинация и сортировка
* limit/offset или page/size (единый стандарт)
* sort: newest, oldest, popularity, alphabetical
8.4 Реализация в SQLite
* Использовать SQLite FTS5 для полнотекстового поиска (обязательно)
* Поддержка индексации по нужным полям translations
* Синхронизация FTS таблицы при изменениях терминов/переводов

9) Категории
9.1 Требования
* CRUD категорий
* Иерархия: parent_id
* Переводы: category_translations по языкам
* slug уникален

10) Теги
10.1 Требования
* CRUD тегов (минимум: create/list)
* Привязка many-to-many: term_tags
* Поиск по тегам должен поддерживаться

11) Избранное и персонализация
* Пользователь может добавить/удалить термин в избранное
* Список избранного с пагинацией
* Уникальность: один term в избранном один раз
* История поиска (запись query + lang + filters + created_at)
* История просмотров (term_id + timestamp)

12) Предложения терминов (User Suggestions)
* Пользователь может отправить предложение:
    * term_text, language, category(optional), definition(optional)
* Статусы:
    * pending, approved, rejected
* Editor/Moderator:
    * преобразует предложение в реальный термин
    * отклоняет с причиной

13) Версионирование и аудит
13.1 Revisions
* Таблица term_revisions:
    * term_id, user_id, old_data(json), created_at
* Запись ревизии при изменениях термина/переводов
13.2 Логирование действий админов
* Таблица admin_audit_log:
    * actor_id, action, entity_type, entity_id, metadata(json), created_at

14) Импорт / Экспорт
14.1 Импорт (обязательно)
* Форматы: CSV / JSON / Excel(xlsx) (xlsx допускается через отдельный парсер; если не реализуется — Excel принимается как CSV)
* Массовая загрузка:
    * terms + translations + tags + category assignment
* Проверка дублей:
    * по slug или по (language + title + category)
* Режимы импорта:
    * strict (ошибка на первой проблеме)
    * tolerant (сбор ошибок, частичный импорт)
14.2 Экспорт (обязательно)
* Экспорт словаря:
    * CSV
    * JSON
* Экспорт по:
    * категории
    * языку
    * статусу

15) API эндпоинты (минимальный набор)
15.1 Auth Service
* POST /api/auth/register
* POST /api/auth/login
* POST /api/auth/refresh
* POST /api/auth/logout
* POST /api/auth/password/forgot
* POST /api/auth/password/reset
* POST /api/auth/email/verify
15.2 Users/Profile
* GET /api/profile
* PATCH /api/profile
* GET /api/profile/favorites
* GET /api/profile/search-history
15.3 Categories
* GET /api/categories?lang=ru
* GET /api/categories/{id}?lang=ru
* POST /api/categories
* PUT /api/categories/{id}
* DELETE /api/categories/{id} (soft delete, если нужно)
15.4 Terms
* GET /api/terms?lang=ru&category_id=&letter=&status=&sort=&page=&size=
* GET /api/terms/{id}?lang=ru
* POST /api/terms
* PUT /api/terms/{id}
* DELETE /api/terms/{id} (soft delete)
* POST /api/terms/{id}/submit (draft→pending)
* POST /api/terms/{id}/approve
* POST /api/terms/{id}/reject
15.5 Search
* GET /api/search?q=...&lang=ru&category_id=&letter=&sort=&page=&size=
* GET /api/search/autocomplete?q=...&lang=ru
15.6 Favorites
* POST /api/favorites/{term_id}
* DELETE /api/favorites/{term_id}
15.7 Suggestions
* POST /api/suggestions
* GET /api/suggestions (editor/admin)
* POST /api/suggestions/{id}/approve
* POST /api/suggestions/{id}/reject
15.8 Import/Export
* POST /api/import (editor/admin)
* GET /api/export?format=csv|json&lang=&category_id=&status=

16) Схема БД (SQLite)
Обязательные сущности (как ты описал) + расширения:
16.1 users
* id (INTEGER PK)
* name
* email UNIQUE
* password_hash
* role (admin/editor/user)
* is_email_verified
* created_at, updated_at
16.2 categories
* id
* parent_id NULL FK(categories.id)
* slug UNIQUE
* created_at, updated_at
16.3 category_translations
* id
* category_id FK
* language ('kz','ru','en')
* title
* description
* UNIQUE(category_id, language)
16.4 terms
* id
* slug UNIQUE
* category_id FK
* status ('draft','pending','approved','rejected','archived' optional)
* author_id FK(users.id)
* views INT default 0
* is_deleted BOOL default false
* created_at, updated_at
16.5 term_translations
* id
* term_id FK
* language
* title
* definition
* short_definition
* examples
* synonyms
* antonyms
* UNIQUE(term_id, language)
16.6 favorites
* id
* user_id FK
* term_id FK
* created_at
* UNIQUE(user_id, term_id)
16.7 tags
* id
* slug UNIQUE
16.8 term_tags
* term_id FK
* tag_id FK
* PRIMARY KEY(term_id, tag_id)
16.9 search_history
* id
* user_id FK
* query TEXT
* lang TEXT
* filters_json TEXT
* created_at
16.10 term_views
* id
* user_id NULL (если гость)
* term_id FK
* created_at
16.11 term_revisions
* id
* term_id FK
* user_id FK
* old_data_json TEXT
* created_at
16.12 term_suggestions
* id
* user_id FK
* category_id NULL FK
* language
* term_text
* definition NULL
* status ('pending','approved','rejected')
* moderator_comment NULL
* created_at, updated_at
16.13 admin_audit_log
* id
* actor_id FK(users.id)
* action
* entity_type
* entity_id
* metadata_json
* created_at
16.14 FTS5 (обязательно)
* Виртуальная таблица FTS5 для поиска по translations:
    * term_id
    * language
    * title
    * definition
    * examples
    * synonyms
    * tags_text (денормализовано)
* Механизм обновления (триггеры или обновление в сервисе при CRUD)

17) Безопасность (обязательно)
* JWT access/refresh, refresh хранить как:
    * httpOnly cookie (предпочтительно) или в body + хранение в клиенте (описать явно в реализации)
* Пароли: bcrypt/argon2
* Rate limiting на:
    * auth endpoints
    * search endpoints
* Защита от SQL-инъекций: только ORM/параметризованные запросы
* CORS настройки по окружениям
* Валидация и ограничения:
    * длины строк
    * допустимые значения языка/статуса/роли
* Логирование:
    * audit лог для admin/moderation действий
* Разделение прав через зависимости FastAPI (Depends) и RBAC

18) Производительность
* Пагинация на списках и поиске
* Индексация:
    * terms.slug, terms.category_id, terms.status, terms.created_at
    * term_translations(term_id, language) UNIQUE
    * favorites(user_id, term_id) UNIQUE
    * category_translations(category_id, language) UNIQUE
* Поиск через FTS5 вместо LIKE

19) Требования к качеству кода
* ООП и слои (API/Service/Repository)
* DRY (общие валидаторы, общие схемы пагинации/ошибок)
* Единый стиль ошибок
* Конфигурация через переменные окружения (pydantic-settings)
* OpenAPI документация через FastAPI, версии API (/api/v1/...)
* Тестируемость (структура, позволяющая unit/integration tests)

 
dictionary-terms-backend/
  apps/
    auth_service/
      app/
        api/
          v1/
            routes/
              auth.py
              profile.py
              admin_users.py
            deps.py
        core/
          config.py
          security.py
          tokens.py
          rbac.py
          rate_limit.py
          errors.py
          logging.py
        db/
          base.py
          session.py
          models/
            user.py
            refresh_token.py
            audit_log.py
          migrations/
        repositories/
          user_repo.py
          token_repo.py
          audit_repo.py
        services/
          auth_service.py
          user_service.py
          email_service.py
        schemas/
          auth.py
          user.py
          common.py
        main.py
      tests/
      pyproject.toml

    dictionary_service/
      app/
        api/
          v1/
            routes/
              categories.py
              terms.py
              tags.py
              moderation.py
              favorites.py
              suggestions.py
            deps.py
        core/
          config.py
          rbac.py
          errors.py
          logging.py
        db/
          base.py
          session.py
          models/
            category.py
            category_translation.py
            term.py
            term_translation.py
            tag.py
            term_tag.py
            favorite.py
            term_revision.py
            term_suggestion.py
          migrations/
        repositories/
          category_repo.py
          term_repo.py
          tag_repo.py
          favorite_repo.py
          revision_repo.py
          suggestion_repo.py
        services/
          category_service.py
          term_service.py
          moderation_service.py
          favorite_service.py
          suggestion_service.py
          revision_service.py
          outbox_service.py
        schemas/
          category.py
          term.py
          tag.py
          favorite.py
          suggestion.py
          moderation.py
          common.py
        main.py
      tests/
      pyproject.toml

    search_service/
      app/
        api/
          v1/
            routes/
              search.py
            deps.py
        core/
          config.py
          errors.py
          logging.py
          ranking.py
        db/
          base.py
          session.py
          models/
            fts_term.py
            search_history.py
          migrations/
        repositories/
          search_repo.py
          history_repo.py
        services/
          search_service.py
          indexing_service.py
          autocomplete_service.py
        schemas/
          search.py
          common.py
        main.py
      tests/
      pyproject.toml

    import_export_service/
      app/
        api/
          v1/
            routes/
              import_.py
              export.py
            deps.py
        core/
          config.py
          errors.py
          logging.py
        db/
          base.py
          session.py
          models/
            import_job.py
            import_row_error.py
          migrations/
        repositories/
          import_repo.py
          export_repo.py
        services/
          import_service.py
          export_service.py
          dedupe_service.py
          validation_service.py
        schemas/
          import_export.py
          common.py
        main.py
      tests/
      pyproject.toml

    admin_service/
      app/
        api/
          v1/
            routes/
              dashboard.py
              audits.py
              moderation.py
            deps.py
        core/
          config.py
          rbac.py
          errors.py
          logging.py
        db/
          base.py
          session.py
          models/
            admin_audit.py
          migrations/
        repositories/
          audit_repo.py
        services/
          audit_service.py
          moderation_service.py
        schemas/
          admin.py
          common.py
        main.py
      tests/
      pyproject.toml

  libs/
    shared/
      shared/
        dto/
          common.py
          pagination.py
          filters.py
          language.py
          ids.py
        security/
          jwt_claims.py
          roles.py
        errors/
          error_codes.py
          exceptions.py
        utils/
          slug.py
          time.py
          normalizers.py
      pyproject.toml

  infra/
    docker/
      Dockerfile.auth
      Dockerfile.dictionary
      Dockerfile.search
      Dockerfile.import_export
      Dockerfile.admin
    compose.yml
    nginx/
      nginx.conf

  scripts/
    seed.py
    dev.sh

 
Важные правила для микросервисов

Каждый сервис владеет своей БД и своей схемой.

Межсервисное взаимодействие:

минимум: HTTP (REST) + “service-to-service” JWT

для индексации поиска: Outbox pattern (см. ниже в FTS5 стратегии)




2.1 Общие DTO (libs/shared/shared/dto)
Language

from enum import Enum

class Lang(str, Enum):
    kz = "kz"
    ru = "ru"
    en = "en"



Pagination
from pydantic import BaseModel, Field

class PageParams(BaseModel):
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)

class PageMeta(BaseModel):
    page: int
    size: int
    total: int
    pages: int

class PageResponse(BaseModel):
    meta: PageMeta
    items: list


Sorting
from enum import Enum

class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"

class TermSort(str, Enum):
    newest = "newest"
    oldest = "oldest"
    popularity = "popularity"
    alphabetical = "alphabetical"


Error
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    error_code: str
    message: str
    details: dict | None = None


2.2 Auth Service схемы
Register
from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class UserPublic(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_email_verified: bool

class RegisterResponse(BaseModel):
    user: UserPublic


Login / Tokens
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class LoginResponse(BaseModel):
    user: UserPublic
    tokens: TokenPair


Refresh
class RefreshRequest(BaseModel):
    refresh_token: str

class RefreshResponse(BaseModel):
    tokens: TokenPair


Password reset
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


Profile
class ProfileResponse(BaseModel):
    user: UserPublic

class ProfileUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=150)

2.3 Dictionary Service схемы
Categories
from pydantic import BaseModel, Field
from libs.shared.shared.dto.language import Lang

class CategoryTranslationIn(BaseModel):
    language: Lang
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None

class CategoryCreateRequest(BaseModel):
    slug: str = Field(min_length=1, max_length=150)
    parent_id: int | None = None
    translations: list[CategoryTranslationIn]

class CategoryUpdateRequest(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=150)
    parent_id: int | None = None
    translations: list[CategoryTranslationIn] | None = None

class CategoryOut(BaseModel):
    id: int
    slug: str
    parent_id: int | None
    title: str
    description: str | None



Tags
class TagOut(BaseModel):
    id: int
    slug: str

class TagCreateRequest(BaseModel):
    slug: str = Field(min_length=1, max_length=100)


Terms + Translations
class TermTranslationIn(BaseModel):
    language: Lang
    title: str = Field(min_length=1, max_length=255)
    definition: str = Field(min_length=1)
    short_definition: str | None = None
    examples: str | None = None
    synonyms: str | None = None
    antonyms: str | None = None

class TermCreateRequest(BaseModel):
    slug: str = Field(min_length=1, max_length=255)
    category_id: int
    translations: list[TermTranslationIn]
    tag_slugs: list[str] = Field(default_factory=list)

class TermUpdateRequest(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=255)
    category_id: int | None = None
    translations: list[TermTranslationIn] | None = None
    tag_slugs: list[str] | None = None


TermOut (локализованный)
class TermOut(BaseModel):
    id: int
    slug: str
    category_id: int
    status: str
    views: int
    created_at: str
    updated_at: str
    language: Lang
    title: str
    definition: str
    short_definition: str | None
    examples: str | None
    synonyms: str | None
    antonyms: str | None
    tags: list[TagOut]


TermOutFull (все переводы)
class TermTranslationOut(BaseModel):
    language: Lang
    title: str
    definition: str
    short_definition: str | None
    examples: str | None
    synonyms: str | None
    antonyms: str | None

class TermOutFull(BaseModel):
    id: int
    slug: str
    category_id: int
    status: str
    views: int
    created_at: str
    updated_at: str
    translations: list[TermTranslationOut]
    tags: list[TagOut]


Moderation
class RejectRequest(BaseModel):
    reason: str = Field(min_length=1, max_length=500)

class StatusOut(BaseModel):
    id: int
    status: str

Favorites
class FavoriteOut(BaseModel):
    term_id: int
    created_at: str

Suggestions
class SuggestionCreateRequest(BaseModel):
    category_id: int | None = None
    language: Lang
    term_text: str = Field(min_length=1, max_length=255)
    definition: str | None = None

class SuggestionOut(BaseModel):
    id: int
    user_id: int
    category_id: int | None
    language: Lang
    term_text: str
    definition: str | None
    status: str
    moderator_comment: str | None
    created_at: str


2.4 Search Service схемы
Search query + filters
from pydantic import BaseModel, Field
from libs.shared.shared.dto.language import Lang
from libs.shared.shared.dto.common import TermSort

class SearchFilters(BaseModel):
    category_id: int | None = None
    include_children: bool = True
    letter: str | None = Field(default=None, min_length=1, max_length=1)
    status: str | None = None

class SearchRequestParams(BaseModel):
    q: str = Field(min_length=1, max_length=200)
    lang: Lang
    filters: SearchFilters = Field(default_factory=SearchFilters)
    sort: TermSort = TermSort.popularity
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)



Search result item
class SearchHit(BaseModel):
    term_id: int
    slug: str
    title: str
    short_definition: str | None
    category_id: int
    rank: float


Autocomplete
class AutocompleteHit(BaseModel):
    term_id: int
    slug: str
    title: str


2.5 Import/Export схемы
from pydantic import BaseModel, Field

class ImportStartResponse(BaseModel):
    job_id: str
    status: str

class ImportErrorRow(BaseModel):
    row_number: int
    field: str
    message: str

class ImportStatusResponse(BaseModel):
    job_id: str
    status: str
    imported: int
    failed: int
    errors: list[ImportErrorRow] = Field(default_factory=list)

class ExportResponse(BaseModel):
    format: str
    url: str


3) Стратегия SQLite FTS5 (виртуальная таблица, обновление, ранжирование)

SQLite не поддерживает GIN/to_tsvector как PostgreSQL. Правильный путь — FTS5.

3.1 Что индексируем

Индексируем term_translations + теги, отдельно по языкам.

Цель: один термин может иметь 3 перевода → в индексе должны быть 3 строки (term_id + language).

Индексируем поля:

title

definition

short_definition

examples

synonyms

tags_text (денормализованная строка)

3.2 Схема FTS5 (в Search Service)

Виртуальная таблица:

term_id (UNINDEXED)

language (UNINDEXED)

title

definition

short_definition

examples

synonyms

tags_text

Рекомендуемая конфигурация:

tokenizer: unicode61 (норм для ru/en/kz)

prefix='2 3 4' для autocomplete

content='' (контентless) или обычная (зависит от выбранной стратегии обновления)

3.3 Обновление индекса (2 варианта)
Вариант A (рекомендуемый для микросервисов): Outbox события

Dictionary Service при изменениях терминов пишет событие в таблицу outbox:

event_id, type, payload_json, created_at, processed_at

Типы:

TERM_UPSERTED (создан/обновлен/одобрен)

TERM_DELETED (soft delete)

TERM_STATUS_CHANGED

Search Service по расписанию/фоновой задаче:

читает новые outbox события через HTTP endpoint Dictionary Service или через общую шину (если появится брокер)

применяет изменения в FTS5:

upsert по (term_id, language)

delete по term_id (все языки)

Плюсы: чистые границы микросервисов, нет shared-db, индекс всегда можно пересобрать.

Вариант B: Триггеры внутри одной БД

Подходит только если Search и Dictionary используют одну SQLite. Для микросервисов обычно плохо, но возможно в dev.

создаются triggers на term_translations/tags/term_tags

triggers обновляют FTS таблицу

3.4 Условия видимости в поиске

Search Service должен выдавать:

user: только terms со статусом approved и not deleted

editor/moderator/admin: опционально режим include_unpublished=true

Поэтому Search Service должен иметь минимум метаданных:

term_id, status, category_id, is_deleted, views, created_at
Это можно хранить:

либо в собственной таблице term_meta (обновляется также через outbox),

либо получать из Dictionary Service при запросе (дороже).

Рекомендация: term_meta локально в Search Service.

3.5 Ранжирование (rank)

В FTS5 можно сортировать через bm25().

Рекомендованный скоринг:

bm25(fts, w_title, w_def, w_short, w_examples, w_syn, w_tags)
Где title важнее.

Дополнительный boost:

популярность: views, favorites_count
Итоговый rank:

final_rank = text_rank * 0.75 + popularity_rank * 0.25
Где popularity_rank нормализован (например log1p).

3.6 Autocomplete

Используем FTS5 prefix + запрос:

искать по title MATCH 'con*' (звездочка для prefix)

ограничение top N (например 10)

Отдельное правило:

autocomplete только по title + (опционально) tags_text.

3.7 Пересборка индекса

Должен быть endpoint/admin command:

POST /api/admin/search/reindex
Который:

вытягивает approved terms + translations + tags из Dictionary Service

пересоздает FTS таблицу и term_meta.

4) Минимальные контрактные ответы API (важно для фронта)
4.1 Список терминов

возвращает локализованную карточку (title + short_definition) и slug/id.

4.2 Детальная страница термина

GET /terms/{id}?lang=ru → локализованные поля + tags + категория (локализованная).

Опционально: GET /terms/{id}/full → все переводы.