import React from 'react';
import { Route } from '../types/routing';
import { useTranslation } from '../src/hooks/useTranslation';

interface FooterProps {
  onNavigate: (route: Route, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-white border-t border-slate-100 py-20 px-6 sm:px-12">
      <div className="max-w-[1440px] mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-slate-900 rounded-lg"></div>
              <span className="font-black text-xl tracking-tighter">dvdictionary </span>
            </div>
            <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed">
              The unified platform for professional trilingual terminology management and
              linguistic discovery.
            </p>
          </div>
          <div>
            <h5 className="font-black text-[10px] text-slate-900 uppercase tracking-[0.2em] mb-8">
              {t('navigation.catalog') as string}
            </h5>
            <ul className="text-xs text-slate-500 font-black space-y-5 uppercase tracking-widest">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-blue-900 transition-colors"
                >
                  {t('navigation.catalog') as string}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('api')}
                  className="hover:text-blue-900 transition-colors"
                >
                  {t('navigation.api') as string}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-900 transition-colors"
                >
                  {t('navigation.learn') as string}
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-[10px] text-slate-900 uppercase tracking-[0.2em] mb-8">
              {t('footer.about') as string}
            </h5>
            <ul className="text-xs text-slate-500 font-black space-y-5 uppercase tracking-widest">
              <li>
                <button
                  onClick={() => onNavigate('suggest')}
                  className="hover:text-blue-900 transition-colors"
                >
                  {t('footer.suggest') as string}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-blue-900 transition-colors"
                >
                  {t('footer.contact') as string}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            © 2024 dvdictionary . {t('footer.rights') as string}
          </span>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300">
              fb
            </div>
            <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300">
              tw
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

