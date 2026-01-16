import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { authService } from '../auth/api';
import { dictionaryService } from '../../../services/api/dictionaryService';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (user) {
        setName(user.name);
        const favs = await dictionaryService.getFavorites();
        setFavorites(favs);
      }
    } catch (err: any) {
      setError(err?.error?.message || 'Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await authService.updateProfile({ name });
      await refreshUser();
    } catch (err: any) {
      setError(err?.error?.message || 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-black text-slate-900">Профиль</h1>

      <div className="bg-white/60 rounded-2xl p-8 shadow-lg border border-white/50">
        <h2 className="text-2xl font-bold mb-6">Личные данные</h2>
        
        <form onSubmit={handleSave} className="space-y-6">
          <Input
            label="Имя"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={150}
          />

          <Input
            label="Email"
            type="email"
            value={user?.email || ''}
            disabled
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={isSaving}>
            Сохранить изменения
          </Button>
        </form>
      </div>

      <div className="bg-white/60 rounded-2xl p-8 shadow-lg border border-white/50">
        <h2 className="text-2xl font-bold mb-6">Избранные термины</h2>
        {favorites.length === 0 ? (
          <p className="text-slate-600">Нет избранных терминов</p>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => (
              <div key={fav.term_id} className="border rounded-lg p-4">
                <a
                  href={`/#terms/${fav.term_id}`}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Термин #{fav.term_id}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
