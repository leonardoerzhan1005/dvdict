import React, { useState, useEffect, useRef } from 'react';
import { Route } from '../types/routing';
import { LanguageSelector } from './LanguageSelector';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../src/hooks/useTranslation';

interface HeaderProps {
  currentRoute: Route;
  onNavigate: (route: Route, params?: Record<string, string>) => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, onLogoClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems: Array<{ route: Route; label: string; displayLabel: string }> = [
    { route: 'home', label: 'Dictionary', displayLabel: t('navigation.explore') as string },
    { route: 'catalog', label: 'Catalog', displayLabel: t('navigation.catalog') as string },
    { route: 'about', label: 'About', displayLabel: t('navigation.learn') as string },
    { route: 'api', label: 'API', displayLabel: t('navigation.api') as string },
    { route: 'contact', label: 'Contact', displayLabel: t('navigation.contact') as string },
  ];

  const handleNavClick = (route: Route) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* HEADER - NEW DESIGN INSPIRED BY REFERENCE */}
      <div className=" from-blue-200 via-blue-100 to-blue-200 px-4 pt-4 pb-4 sticky top-0 z-[100]">
        <header className="max-w-[1440px] mx-auto bg-white/30 backdrop-blur-md rounded-[2.5rem] px-8 h-24 flex justify-between items-center  border-2 border-blue-250">
          <div className="flex items-center gap-16">
            {/* LOGO */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={onLogoClick}
            >
              <div className="flex gap-1.5 items-center">
                <div className="w-4 h-9 bg-blue-600 rounded-full rotate-[15deg] opacity-90"></div>
                <div className="w-4 h-9 bg-blue-500 rounded-full rotate-[15deg]"></div>
                <div className="w-3 h-3 bg-blue-700 rounded-full self-end mb-1"></div>
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-blue-900 ml-1">Polyglot</span>
            </div>
            
            {/* NAVIGATION PILLS */}
            <nav className="hidden lg:flex items-center gap-4">
              {navItems.map((item) => (
                <button 
                  key={item.route}
                  onClick={() => onNavigate(item.route)}
                  className={`px-8 py-3 rounded-full flex items-center gap-2 text-sm font-semibold transition-all ${
                    currentRoute === item.route 
                      ? 'bg-white/80 text-blue-700 shadow-sm' 
                      : 'text-blue-900/70 hover:bg-white/40 hover:text-blue-900'
                  }`}
                >
                  {currentRoute === item.route && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
                  {item.displayLabel}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <LanguageSelector />
            </div>
            
            {isAuthenticated ? (
              <>
                {(user?.role === 'admin' || user?.role === 'editor' || user?.role === 'moderator') && (
                  <button 
                    onClick={() => onNavigate('admin')}
                    className="px-6 py-3 border border-white/50 rounded-full text-sm font-bold text-blue-900 hover:bg-white/40 transition-all flex items-center gap-2"
                    title={t('admin.title') as string}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                    {t('navigation.admin') as string}
                  </button>
                )}
                <button 
                  onClick={() => onNavigate('favorites')}
                  className="px-6 py-3 border border-white/50 rounded-full text-sm font-bold text-blue-900 hover:bg-white/40 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t('navigation.favorites') as string}
                </button>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="px-6 py-3 border border-white/50 rounded-full text-sm font-bold text-blue-900 hover:bg-white/40 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('navigation.profile') as string}
                </button>
                <button 
                  onClick={async () => {
                    await logout();
                    onNavigate('home');
                  }}
                  className="px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                >
                  {t('navigation.logout') as string}
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => onNavigate('login')}
                  className="px-8 py-3.5 border border-white/50 rounded-full text-sm font-bold text-blue-900 hover:bg-white/40 transition-all"
                >
                  {t('navigation.login') as string}
                </button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                >
                  {t('auth.register') as string}
                </button>
              </>
            )}
            
            <button 
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-white/40 border border-white/50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </header>
      </div>
      
      

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div ref={menuRef} className="fixed inset-0 z-[150] bg-white lg:hidden animate-in slide-in-from-right duration-300">
          <div className="p-8 space-y-12">
            <div className="flex justify-between items-center">
              <span className="font-black text-2xl tracking-tighter text-blue-900">Menu</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-12 h-12 border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-8 text-3xl font-black text-blue-900 serif-modern">
              {navItems.map((item) => (
                <button 
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`text-left transition-colors ${
                    currentRoute === item.route 
                      ? 'text-blue-700' 
                      : 'hover:text-blue-600'
                  }`}
                >
                  {item.displayLabel}
                </button>
              ))}
            </nav>
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <div className="flex justify-center pb-4">
                <LanguageSelector />
              </div>
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => handleNavClick('favorites')}
                    className="w-full px-8 py-4 border border-slate-200 rounded-full text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    {t('navigation.favorites') as string}
                  </button>
                  <button 
                    onClick={() => handleNavClick('profile')}
                    className="w-full px-8 py-4 border border-slate-200 rounded-full text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    {t('navigation.profile') as string}
                  </button>
                  {(user?.role === 'admin' || user?.role === 'editor' || user?.role === 'moderator') && (
                    <button 
                      onClick={() => handleNavClick('admin')}
                      className="w-full px-8 py-4 bg-blue-600 text-white rounded-full text-sm font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                      Admin Panel
                    </button>
                  )}
                  <button 
                    onClick={async () => {
                      await logout();
                      handleNavClick('home');
                    }}
                    className="w-full px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all"
                  >
                    {t('navigation.logout') as string}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleNavClick('login')}
                    className="w-full px-8 py-4 bg-slate-900 text-white rounded-full text-sm font-bold hover:bg-slate-800 transition-all"
                  >
                    {t('navigation.login') as string}
                  </button>
                  <button 
                    onClick={() => handleNavClick('register')}
                    className="w-full px-8 py-4 border border-slate-200 rounded-full text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    {t('auth.register') as string}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
