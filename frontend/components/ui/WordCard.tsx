import React from 'react';
import { Badge } from './Badge';

interface WordCardItem {
  word: string;
  tag: string;
  translation: string;
  usageCount: number;
  snippet: string;
}

interface WordCardProps {
  item: WordCardItem;
  onClick: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="pop-card group bg-white p-8 rounded-3xl border border-slate-200 cursor-pointer flex flex-col justify-between min-h-[350px]"
    >
      <div className="space-y-5 flex-1">
        <div className="flex justify-between items-start">
          <Badge>{item.tag}</Badge>
          <span className="text-xs font-bold text-slate-300">#{item.usageCount} lookups</span>
        </div>
        <div className="space-y-4">
          <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-900 transition-colors serif-modern">
            {item.word}
          </h4>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Описание</p>
            <p className="text-base text-slate-600 leading-relaxed font-medium">{item.snippet}</p>
          </div>
        </div>
      </div>
      <div className="pt-5 mt-5 border-t border-slate-50 flex items-center justify-between">
        <span className="text-base font-bold text-slate-500">{item.translation}</span>
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-900 group-hover:text-white transition-all">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

