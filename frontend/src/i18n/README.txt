СТРУКТУРА ПЕРЕВОДОВ ИНТЕРФЕЙСА
================================

ОБЩАЯ ИНФОРМАЦИЯ
----------------
Система переводов использует react-i18next для интернационализации интерфейса.
Переводы организованы по модулям и хранятся в JSON файлах для каждого языка.

СТРУКТУРА ФАЙЛОВ
----------------
frontend/src/i18n/
  ├── index.ts          - Инициализация i18n
  ├── ru.json          - Русские переводы
  ├── en.json          - Английские переводы
  └── kz.json          - Казахские переводы

ОРГАНИЗАЦИЯ ПЕРЕВОДОВ
---------------------
Переводы организованы по следующим категориям:

1. common - Общие элементы интерфейса
   - Кнопки (save, cancel, delete, edit)
   - Статусы (loading, error)
   - Действия (back, next, previous, close)

2. navigation - Навигация
   - Пункты меню (explore, catalog, about, api, contact)
   - Профиль и избранное (profile, favorites)
   - Аутентификация (login, logout, register)

3. auth - Аутентификация
   - Формы входа/регистрации
   - Поля (email, password, name)
   - Действия (login, register, forgotPassword)

4. home - Главная страница
   - Заголовки и описания
   - Поиск (searchPlaceholder)
   - Категории и термины (popularTerms, categories)
   - Сортировка (sortByUsage, sortByAlpha)

5. catalog - Каталог терминов
   - Заголовки
   - Поиск и фильтры
   - Сообщения (noTerms, tryDifferentFilters)

6. terms - Детали термина
   - Определения (definition, fullDefinition, shortDefinition)
   - Примеры и синонимы (examples, synonyms, antonyms)
   - Действия (addToFavorites, proposeCorrection)
   - Статусы (approved, pending, rejected)

7. search - Поиск
   - Плейсхолдеры
   - Результаты (results, noResults)
   - Языки перевода (from, to)

8. favorites - Избранное
   - Заголовки
   - Сообщения (empty, emptyDescription)
   - Действия (add, remove)

9. profile - Профиль пользователя
   - Информация (name, email, role)
   - Статистика (termsCreated, suggestions, favorites)

10. suggestions - Предложения терминов
    - Форма (title, description, term, definition, category)
    - Результаты (success, error)

11. admin - Админ панель
    - Разделы (dashboard, terms, categories, users)
    - Модерация и аналитика

12. footer - Футер
    - Ссылки (about, api, contact, suggest)
    - Копирайт (rights)

13. errors - Ошибки
    - Типы ошибок (generic, network, notFound, unauthorized)
    - Сообщения (tryAgain)

ИСПОЛЬЗОВАНИЕ
-------------
1. Импортируйте хук useTranslation:
   import { useTranslation } from '../src/hooks/useTranslation';

2. Используйте в компоненте:
   const { t } = useTranslation();
   <button>{t('common.save')}</button>

3. Для вложенных ключей используйте точку:
   t('navigation.explore')
   t('terms.addToFavorites')

4. Для параметров используйте объект:
   t('home.found', { count: 10 })

СИНХРОНИЗАЦИЯ С ЯЗЫКОМ
----------------------
Язык интерфейса синхронизирован с LanguageContext:
- При изменении языка в LanguageSelector автоматически меняется язык i18n
- Язык сохраняется в localStorage под ключом 'appLanguage'
- Поддерживаемые языки: 'kk', 'ru', 'en'

ДОБАВЛЕНИЕ НОВЫХ ПЕРЕВОДОВ
--------------------------
1. Добавьте ключ во все три файла (ru.json, en.json, kz.json)
2. Используйте структуру категорий для организации
3. Следуйте соглашениям именования:
   - camelCase для ключей
   - Группировка по функциональности
   - Описательные имена

ПРИМЕРЫ
-------
// Простой перевод
t('common.save')  // "Сохранить" / "Save" / "Сақтау"

// Вложенный ключ
t('terms.addToFavorites')  // "Добавить в избранное"

// С параметрами (если нужно)
t('home.found', { count: 5 })  // "Найдено: 5"
