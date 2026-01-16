import React, { useState } from 'react';
import { dictionaryService } from '../../../services/api/dictionaryService';
import { useAuth } from '../../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Language } from '../../../types';

export const SuggestionForm: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [termText, setTermText] = useState('');
  const [definition, setDefinition] = useState('');
  const [language, setLanguage] = useState<Language>(Language.RU);
  const [categoryId, setCategoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = '/#login';
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const langMap: Record<Language, 'kz' | 'ru' | 'en'> = {
        [Language.KK]: 'kz',
        [Language.RU]: 'ru',
        [Language.EN]: 'en',
      };
      
      await dictionaryService.createSuggestion({
        term_text: termText,
        definition: definition || undefined,
        language: langMap[language],
        category_id: categoryId ? parseInt(categoryId) : undefined,
      });
      
      setSuccess(true);
      setTermText('');
      setDefinition('');
      setCategoryId('');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.error?.message || 'Ошибка отправки предложения');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Для отправки предложений необходимо войти</p>
        <Button onClick={() => (window.location.href = '/#login')}>
          Войти
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-black text-slate-900 mb-6">Предложить термин</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/60 rounded-2xl p-8 shadow-lg border border-white/50">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Язык</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3"
          >
            <option value={Language.KK}>Қазақша</option>
            <option value={Language.RU}>Русский</option>
            <option value={Language.EN}>English</option>
          </select>
        </div>

        <Input
          label="Текст термина"
          value={termText}
          onChange={(e) => setTermText(e.target.value)}
          required
          minLength={1}
          maxLength={255}
          placeholder="Введите термин"
        />

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Определение (необязательно)</label>
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            className="w-full bg-white/60 border border-slate-200 rounded-lg px-4 py-3 min-h-[100px]"
            placeholder="Определение термина"
          />
        </div>

        <Input
          label="ID категории (необязательно)"
          type="number"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          placeholder="Оставьте пустым для автоматической категории"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-sm font-bold">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-sm font-bold">
            Предложение успешно отправлено!
          </div>
        )}

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Отправить предложение
        </Button>
      </form>
    </div>
  );
};
