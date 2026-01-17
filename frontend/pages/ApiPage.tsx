import React from 'react';

export const ApiPage: React.FC = () => {
  return (
    <div className="w-full px-6 sm:px-12 py-16">
      <div className="space-y-16">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter serif-modern">
            API Документация
          </h1>
          <p className="text-slate-500 font-medium text-xl leading-relaxed">
            Интегрируйте  Terminology Hub в ваши приложения с помощью нашего REST API.
          </p>
        </div>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Базовый URL</h2>
          <div className="bg-slate-900 rounded-3xl p-8 text-white font-mono">
            <code className="text-indigo-400">https://api.polyglot-hub.com/v1</code>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Аутентификация</h2>
          <div className="bg-white rounded-3xl border border-slate-200 p-10 space-y-6">
            <p className="text-slate-600 leading-relaxed">
              Для доступа к API требуется API ключ. Получите его в разделе настроек вашего аккаунта.
            </p>
            <div className="bg-slate-50 rounded-2xl p-6">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                Заголовок запроса
              </p>
              <code className="text-slate-900 font-mono text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Эндпоинты</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase rounded-lg">
                  GET
                </span>
                <code className="text-lg font-mono text-slate-900">/terms</code>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Получить список терминов с поддержкой фильтрации и пагинации.
              </p>
              <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Параметры запроса
                </p>
                <ul className="space-y-2 font-mono text-sm">
                  <li><code className="text-blue-900">category</code> - фильтр по категории</li>
                  <li><code className="text-blue-900">lang</code> - язык (kk, ru, en)</li>
                  <li><code className="text-blue-900">page</code> - номер страницы</li>
                  <li><code className="text-blue-900">limit</code> - количество результатов</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-blue-900 text-white text-xs font-black uppercase rounded-lg">
                  GET
                </span>
                <code className="text-lg font-mono text-slate-900">/terms/:word</code>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Получить детальную информацию о конкретном термине.
              </p>
              <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  Пример ответа
                </p>
                <pre className="text-xs text-slate-700 overflow-x-auto">
{`{
  "word": "Sovereignty",
  "pronunciation": "/ˈsɒv.rɪn.ti/",
  "translations": {
    "en": "Sovereignty",
    "ru": "Суверенитет",
    "kk": "Егемендік"
  },
  "definitions": { ... }
}`}
                </pre>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 bg-green-600 text-white text-xs font-black uppercase rounded-lg">
                  POST
                </span>
                <code className="text-lg font-mono text-slate-900">/terms</code>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Предложить новый термин для добавления в базу данных (требует аутентификации).
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Коды ответов</h2>
          <div className="bg-white rounded-3xl border border-slate-200 p-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded">
                  200
                </span>
                <span className="text-slate-700">Успешный запрос</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black rounded">
                  400
                </span>
                <span className="text-slate-700">Неверный запрос</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black rounded">
                  401
                </span>
                <span className="text-slate-700">Требуется аутентификация</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black rounded">
                  404
                </span>
                <span className="text-slate-700">Термин не найден</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-black rounded">
                  500
                </span>
                <span className="text-slate-700">Внутренняя ошибка сервера</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-indigo-50 border border-indigo-100 rounded-3xl p-10">
          <h3 className="text-2xl font-black text-slate-900 mb-4">Нужна помощь?</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            Если у вас возникли вопросы по использованию API, свяжитесь с нашей командой поддержки.
          </p>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all">
            Связаться с поддержкой
          </button>
        </section>
      </div>
    </div>
  );
};

