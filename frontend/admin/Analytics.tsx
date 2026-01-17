import React from 'react';
import { useTranslation } from '../src/hooks/useTranslation';

export const AdminAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const topTerms = [
    { word: 'Artificial Intelligence', searches: 1204, growth: '+14%', color: 'blue' },
    { word: 'Суверенитет', searches: 982, growth: '+2%', color: 'indigo' },
    { word: 'Цифрландыру', searches: 854, growth: '+22%', color: 'emerald' },
    { word: 'Blockchain', searches: 721, growth: '-5%', color: 'amber' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">{t('admin.analytics.title').split(' ')[0]} <span className="text-zinc-500">{t('admin.analytics.title').split(' ').slice(1).join(' ')}</span></h1>
        <p className="text-zinc-400 text-sm mt-2">{t('admin.analytics.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#121214] border border-white/5 rounded-2xl p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-white">{t('admin.analytics.searchVolumeTrends')}</h3>
            <select className="bg-zinc-900 border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none text-zinc-300 focus:border-orange-500/50 transition-colors">
              <option>{t('admin.analytics.last30Days')}</option>
              <option>{t('admin.analytics.lastQuarter')}</option>
            </select>
          </div>
          <div className="h-[300px] flex items-end gap-4">
            {[60, 40, 80, 50, 90, 70, 100, 85, 65, 75, 55, 95].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div 
                  style={{ height: `${h}%` }} 
                  className="bg-zinc-800 group-hover:bg-orange-600 transition-all rounded-t-xl"
                ></div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-950 border border-white/5 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                  {h * 10} pts
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-10 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('admin.analytics.languageAffinity')}</h3>
            <div className="space-y-8">
              {[
                { lang: t('admin.analytics.english'), perc: 45, color: 'bg-blue-500' },
                { lang: t('admin.analytics.kazakh'), perc: 35, color: 'bg-emerald-500' },
                { lang: t('admin.analytics.russian'), perc: 20, color: 'bg-orange-500' }
              ].map((l) => (
                <div key={l.lang} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span>{l.lang}</span>
                    <span>{l.perc}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${l.color}`} style={{ width: `${l.perc}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-12">
            {t('admin.analytics.basedOnEvents', { count: 12.4 })}
          </p>
        </div>
      </div>

      <div className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden mt-8">
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">{t('admin.analytics.topSearchedTerms')}</h3>
          <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:text-orange-400 transition-colors">{t('admin.analytics.exportCsv')}</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('admin.analytics.termIdentity')}</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('admin.analytics.globalRequests')}</th>
              <th className="px-8 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">{t('admin.analytics.momentum')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {topTerms.map((term, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6 font-bold text-white">{term.word}</td>
                <td className="px-8 py-6 text-zinc-400 font-medium">{term.searches.toLocaleString()} {t('admin.analytics.hits')}</td>
                <td className={`px-8 py-6 font-black text-[10px] ${term.growth.startsWith('+') ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {term.growth}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
