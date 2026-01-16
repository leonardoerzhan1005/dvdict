import React, { useState } from 'react';
import { authService } from './api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { validateEmail } from '../../utils/validators';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Некорректный email');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.error?.message || 'Ошибка отправки письма');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#dbeafe] flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white/60 rounded-[3.5rem] p-10 md:p-16 shadow-xl border border-white/50 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">Письмо отправлено</h1>
          <p className="text-slate-600 mb-6">
            Если email существует, мы отправили инструкции по восстановлению пароля.
          </p>
          <Button onClick={() => (window.location.href = '/#login')}>
            Вернуться к входу
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dbeafe] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/60 rounded-[3.5rem] p-10 md:p-16 shadow-xl border border-white/50">
        <div className="flex flex-col items-center mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Восстановление пароля</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-sm font-bold">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full">
            Отправить
          </Button>

          <div className="text-center">
            <a href="/#login" className="text-sm text-blue-600 hover:underline">
              Вернуться к входу
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
