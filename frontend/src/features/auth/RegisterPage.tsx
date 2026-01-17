import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { validateEmail, validatePassword } from '../../utils/validators';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError(t('auth.invalidEmail') as string || 'Некорректный email');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      window.location.href = '/#home';
    } catch (err: any) {
      console.error('Register error:', err);
      let errorMessage = t('auth.registerError') as string || 'Ошибка регистрации';
      if (err?.error?.message) {
        errorMessage = err.error.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dbeafe] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-lg animate-fade-up">
        <div className="glass-header rounded-[3.5rem] p-10 md:p-16 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>
          
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="flex gap-1.5 items-center mb-8">
              <div className="w-6 h-12 bg-blue-600 rounded-full rotate-[12deg]"></div>
              <div className="w-6 h-12 bg-blue-400 rounded-full rotate-[12deg] -ml-2 opacity-80"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 serif-modern tracking-tighter mb-4">
              {t('auth.register') as string}
            </h1>
            <div className="flex gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-600/60">
              <span>{t('auth.register') as string}</span>
              <span>•</span>
              <span>Регистрация</span>
              <span>•</span>
              <span>Register</span>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                {t('auth.name') as string}
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  minLength={2}
                  maxLength={150}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/60 border border-slate-200 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                  placeholder={t('auth.namePlaceholder') as string || "John Doe"}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                {t('auth.email') as string}
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/60 border border-slate-200 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                  placeholder="validator@dvdictionary.io"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                {t('auth.password') as string}
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/60 border border-slate-200 rounded-[1.5rem] px-8 py-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-900 placeholder:text-slate-300 tracking-[0.3em]" 
                  placeholder="••••••••"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest ml-4">
                {t('auth.passwordMinLength') as string || 'Минимум 8 символов'}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-[1.5rem] text-sm font-bold">
                {error}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 text-white font-black py-6 rounded-[1.5rem] shadow-2xl shadow-slate-900/20 hover:bg-blue-600 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{t('auth.signUp') as string}</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-slate-100/50 flex flex-col items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {t('auth.alreadyHaveAccount') as string}
            </p>
            <a 
              href="/#login" 
              className="text-blue-600 font-black text-xs uppercase tracking-widest hover:underline transition-all"
            >
              {t('auth.signIn') as string}
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100/50 flex flex-col items-center gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Linguistic Standards Compliant</p>
            <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
               <div className="w-6 h-6 bg-slate-400 rounded-md"></div>
               <div className="w-6 h-6 bg-slate-400 rounded-md"></div>
               <div className="w-6 h-6 bg-slate-400 rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
