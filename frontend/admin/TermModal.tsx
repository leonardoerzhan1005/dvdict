
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { AdminTermResult, Category, TermStatus } from '../types/admin';
import { RichEditor } from '../components/ui/RichEditor';

interface TermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (term: AdminTermResult) => void;
  initialData?: AdminTermResult | null;
}

export const TermModal: React.FC<TermModalProps> = ({ onClose, onSave, initialData }) => {
  const [activeLang, setActiveLang] = useState<Language>(Language.EN);
  const [formData, setFormData] = useState<AdminTermResult>({
    word: '',
    category: 'Technical',
    status: 'Pending',
    translations: { kk: '', ru: '', en: '' },
    definitions: {
      en: { meaning: '', description: '', examples: [], synonyms: [] },
      kk: { meaning: '', description: '', examples: [], synonyms: [] },
      ru: { meaning: '', description: '', examples: [], synonyms: [] }
    },
    morphology: '',
    etymology: '',
    pronunciation: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    }
  }, [initialData]);

  const updateTranslation = (val: string) => {
    setFormData(prev => ({
      ...prev,
      translations: { ...prev.translations, [activeLang]: val }
    }));
  };

  const updateDefinition = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      definitions: {
        ...prev.definitions,
        [activeLang]: {
          ...prev.definitions[activeLang] as any,
          [field]: value
        }
      }
    }));
  };

  const langTheme = {
    en: 'bg-white text-slate-900 border-blue-100',
    ru: 'bg-slate-50 text-slate-900 border-indigo-100',
    kk: 'bg-[#f8faf7] text-slate-900 border-emerald-100'
  }[activeLang];

  return (
    <div className="fixed inset-0 z-[100] bg-[#fdfdfd] overflow-y-auto selection:bg-blue-100">
      {/* 2026 STEALTH HEADER */}
      <nav className="sticky top-0 z-[110] bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-8 py-6">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
            <button 
              onClick={onClose} 
              className="group w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Repository Console v2.0</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 serif-modern tracking-tighter">
                {initialData ? `Lexicon / ${initialData.word}` : 'Lexicon / Initialize Entry'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-8 px-8 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity Score</span>
                   <span className="text-sm font-black text-slate-900">88/100</span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                   <span className="text-sm font-black text-emerald-500">{formData.status}</span>
                </div>
             </div>
             
             <div className="flex gap-3">
               <button onClick={onClose} className="px-8 py-4 bg-white border border-slate-200 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all duration-300">
                 Abort
               </button>
               <button 
                onClick={() => onSave(formData)}
                className="group px-10 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all duration-500 text-[10px] uppercase tracking-widest flex items-center gap-3"
               >
                 <span>Commit Master</span>
                 <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
               </button>
             </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto px-8 py-16 grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* LEFT COLUMN: GLOBAL METRICS BENTO */}
        <div className="xl:col-span-3 space-y-12">
          <section className="space-y-6">
            <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-widest ml-4">Universal Configuration</h3>
            <div className="bg-white rounded-[3.5rem] border border-slate-100 p-10 shadow-sm space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Canonical Descriptor (EN)</label>
                <input 
                  value={formData.word} 
                  onChange={e => setFormData({...formData, word: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 font-black text-slate-900 outline-none focus:bg-white focus:ring-[12px] focus:ring-blue-500/5 transition-all text-2xl serif-modern"
                  placeholder="Universal term..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hub Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Technical', 'Political', 'Strategy', 'Ecological'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setFormData({...formData, category: c})}
                      className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.category === c ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verification Tier</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value as TermStatus})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-6 font-bold text-slate-900 outline-none appearance-none"
                >
                  {['Draft', 'Pending', 'Verified'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4.5h-2V7h2v5z"/></svg>
             </div>
             <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] mb-8">Etymological Archive</h4>
             <textarea 
                value={formData.etymology || ''} 
                onChange={e => setFormData({...formData, etymology: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 outline-none text-slate-300 italic h-64 focus:border-blue-400/50 text-xl leading-relaxed placeholder:text-slate-700"
                placeholder="Document linguistic provenance..."
              />
          </section>
        </div>

        {/* RIGHT COLUMN: THE LOCALIZATION STAGE */}
        <div className="xl:col-span-9 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 ml-4">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                  {activeLang.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Localization Workspace</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Editing {activeLang === 'en' ? 'English' : activeLang === 'ru' ? 'Russian' : 'Kazakh'} definitions</p>
                </div>
             </div>
             <div className="flex bg-slate-100 p-2 rounded-3xl border border-slate-200/40">
                {(['en', 'ru', 'kk'] as Language[]).map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${activeLang === lang ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {lang === 'en' ? 'English' : lang === 'ru' ? 'Russian' : 'Kazakh'}
                  </button>
                ))}
             </div>
          </div>

          <div className={`p-10 lg:p-20 rounded-[5rem] border transition-all duration-1000 shadow-3xl relative overflow-hidden ${langTheme}`}>
            {/* Dynamic Ambient Backgrounds */}
            <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[160px] opacity-[0.07] -mr-64 -mt-64 transition-colors duration-1000 ${
              activeLang === 'en' ? 'bg-blue-600' : activeLang === 'ru' ? 'bg-indigo-600' : 'bg-emerald-600'
            }`}></div>

            <div className="max-w-5xl mx-auto space-y-24 relative z-10">
              {/* LARGE INPUT SECTION */}
              <div className="space-y-8 text-center">
                <label className="text-[11px] font-black text-slate-300 uppercase tracking-[0.5em]">Target Representation</label>
                <input 
                  value={formData.translations[activeLang] || ''} 
                  onChange={e => updateTranslation(e.target.value)}
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/40 rounded-[4rem] px-16 py-16 text-6xl lg:text-9xl font-black text-slate-900 outline-none focus:border-blue-500 focus:bg-white/60 shadow-2xl transition-all text-center serif-modern tracking-tighter leading-none"
                  placeholder="..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white/30 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/40 space-y-6 group hover:bg-white/60 transition-all duration-700">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Morphological Profile</label>
                  <input 
                    value={formData.morphology || ''} 
                    onChange={e => setFormData({...formData, morphology: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-slate-200/50 py-4 text-2xl font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    placeholder="e.g. Adjective, Neutral"
                  />
                </div>
                <div className="bg-white/30 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/40 space-y-6 group hover:bg-white/60 transition-all duration-700">
                   <div className="flex justify-between items-center px-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Phonetic Encoding</label>
                      <button className="text-blue-600 hover:scale-110 transition-transform"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg></button>
                   </div>
                  <input 
                    value={formData.pronunciation || ''} 
                    onChange={e => setFormData({...formData, pronunciation: e.target.value})}
                    className="w-full bg-transparent border-b-2 border-slate-200/50 py-4 text-2xl font-bold text-slate-900 outline-none focus:border-blue-600 transition-all"
                    placeholder="/ˈpronənsiˌāSH(ə)n/"
                  />
                </div>
              </div>

              {/* SEMANTIC CORE */}
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] shrink-0">Semantic Engine</h3>
                   <div className="h-px w-full bg-slate-200/30"></div>
                </div>
                
                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-10">Dictionary Definition</label>
                  <textarea 
                    value={formData.definitions[activeLang]?.meaning || ''} 
                    onChange={e => updateDefinition('meaning', e.target.value)}
                    className="w-full bg-white/40 backdrop-blur-md border border-white/60 rounded-[4rem] px-12 py-12 font-black text-slate-900 h-48 outline-none resize-none focus:bg-white focus:ring-[12px] focus:ring-blue-500/5 transition-all text-3xl lg:text-4xl serif-modern leading-tight shadow-xl"
                    placeholder="A precise descriptor..."
                  />
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-10">Analytic Narration & Context</label>
                  <RichEditor 
                    value={formData.definitions[activeLang]?.description || ''}
                    onChange={(val) => updateDefinition('description', val)}
                    theme={activeLang}
                    placeholder="Draft deep analysis of professional usage, semantic drift, and industry nuance..."
                  />
                </div>
              </div>

              {/* EXAMPLES & SYNONYMS BENTO */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-8">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Contextual Matrix</label>
                     <span className="text-[9px] font-black text-slate-300">Line Separated</span>
                  </div>
                  <textarea 
                    value={formData.definitions[activeLang]?.examples.join('\n') || ''} 
                    onChange={e => updateDefinition('examples', e.target.value.split('\n'))}
                    className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-[3.5rem] px-10 py-10 font-medium text-slate-600 h-64 outline-none text-xl leading-relaxed focus:bg-white/60 transition-all shadow-lg"
                    placeholder="“Usage in academic context...”"
                  />
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center px-8">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Synonym Set</label>
                     <span className="text-[9px] font-black text-slate-300">Comma Separated</span>
                  </div>
                  <textarea 
                    value={formData.definitions[activeLang]?.synonyms.join(', ') || ''} 
                    onChange={e => updateDefinition('synonyms', e.target.value.split(',').map(s => s.trim()))}
                    className="w-full bg-white/30 backdrop-blur-md border border-white/40 rounded-[3.5rem] px-10 py-10 font-medium text-slate-600 h-64 outline-none text-xl leading-relaxed focus:bg-white/60 transition-all shadow-lg"
                    placeholder="Mapping, Alignment, Correlation..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FINAL SYNC INDICATOR */}
          <div className="p-16 bg-slate-900 rounded-[5rem] text-center space-y-8 relative overflow-hidden group shadow-3xl">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
             <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.5em] relative z-10">Linguistic Protocol Enforcement</p>
             <h4 className="text-4xl font-black text-white serif-modern relative z-10">Ready for Global Distribution?</h4>
             <button 
               onClick={() => onSave(formData)}
               className="relative z-10 px-16 py-7 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95"
             >
               Commit To Repositories
             </button>
          </div>
        </div>
      </main>
      
      {/* PADDING FOR BOTTOM SCROLL */}
      <div className="h-32"></div>
    </div>
  );
};
