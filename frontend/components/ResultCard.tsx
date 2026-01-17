import React from 'react';
import { TermResult, Language } from '../types';
import { getLanguageName } from '../utils/languageUtils';
import { useTranslation } from '../src/hooks/useTranslation';
interface ResultCardProps {
  result: TermResult;
  targetLang: Language;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, targetLang }) => {
  const def = result.definitions[targetLang];
  const trans = result.translations[targetLang];
  const { t } = useTranslation();
  return (
    <div className="w-[1440px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-8">
      
      {/* WORD HEADER BLOCK */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/5 border border-slate-200 overflow-hidden">
        <div className="p-12 md:p-20 border-b border-slate-100 bg-slate-50/30">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            <div className="space-y-6 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-blue-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">Standardized</span>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-lg">Source: {getLanguageName(targetLang)}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 serif-modern tracking-tighter leading-none">{result.word}</h1>
              {result.pronunciation && (
                <div className="flex items-center gap-6">
                  <span className="text-3xl text-slate-400 font-medium italic">/{result.pronunciation}/</span>
                  <button className="w-12 h-12 bg-white rounded-2xl border border-slate-200 text-blue-900 hover:bg-blue-800 hover:text-white transition-all shadow-xl shadow-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-blue-900 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200 min-w-[280px] text-center text-white space-y-4">
              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block opacity-70">Primary Translation</span>
              <p className="text-5xl font-black tracking-tighter">{trans}</p>
              <div className="pt-4 border-t border-indigo-500/30">
                 <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">{getLanguageName(targetLang)} Context</span>
              </div>
            </div>
          </div>
        </div>

        {/* DEFINITIONS SECTION */}
        <div className="p-12 md:p-20 space-y-20">
          
          <section className="space-y-10">
            <div className="flex items-center gap-6">
               <h3 className="text-[11px] font-black text-blue-900 uppercase tracking-[0.3em] whitespace-nowrap">{t('fullDefinitionTitle')}</h3>
               <div className="h-px w-full bg-slate-100"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="text-2xl font-black text-slate-300 italic">01</span>
                </div>
                <div className="space-y-10 flex-1">
                  <p className="text-3xl md:text-4xl text-slate-800 font-bold leading-[1.2] serif-modern">
                    {def?.meaning}
                  </p>
                  
                  {def?.examples && def.examples.length > 0 && (
                    <div className="space-y-6 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative">
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.808-1.238L3 20l1.307-4.113C3.408 14.383 3 12.744 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </div>
                      {def.examples.map((ex, i) => (
                        <p key={i} className="text-slate-500 text-xl font-medium italic pl-4 border-l-4 border-indigo-100">
                          "{ex}"
                        </p>
                      ))}
                    </div>
                  )}
                </div>
            </div>
          </section>

          {/* METADATA & RELATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {result.etymology && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Origins</h3>
                   <div className="h-px w-full bg-slate-100"></div>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed italic text-lg">{result.etymology}</p>
              </section>
            )}

            {def?.synonyms && def.synonyms.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Related Concepts</h3>
                   <div className="h-px w-full bg-slate-100"></div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {def.synonyms.map((s, i) => (
                    <span key={i} className="px-5 py-2.5 bg-white text-slate-600 rounded-2xl text-sm font-bold border border-slate-200 hover:border-blue-900 hover:text-blue-900 transition-all cursor-default shadow-sm uppercase tracking-widest">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* CROSS-LANGUAGE COMPARISON */}
          <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10 space-y-12">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Translation</h3>
               </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {Object.entries(result.translations).map(([lang, val]) => {
                  if (!val) return null;
                  return (
                    <div key={lang} className="space-y-4 group/lang cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-700 group-hover/lang:bg-indigo-400 transition-colors"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{getLanguageName(lang as Language)}</span>
                      </div>
                      <p className="text-4xl font-black text-white tracking-tighter group-hover/lang:translate-x-2 transition-transform">{val}</p>
                      <div className="h-1 w-8 bg-slate-800 group-hover/lang:w-full group-hover/lang:bg-indigo-800 transition-all duration-500"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* ACTIONS FOOTER */}
       
    </div>
  );
};
