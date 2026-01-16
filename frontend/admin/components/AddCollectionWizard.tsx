import React, { useState } from 'react';
import { AdminTermResult } from '../../types/admin';

const IconChevronLeft = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const IconChevronRight = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconPlus = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const IconTrash2 = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const IconUpload = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const IconImage = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const IconListOrdered = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="10" y1="6" x2="21" y2="6"></line>
    <line x1="10" y1="12" x2="21" y2="12"></line>
    <line x1="10" y1="18" x2="21" y2="18"></line>
    <line x1="4" y1="6" x2="4" y2="6"></line>
    <line x1="4" y1="12" x2="4" y2="12"></line>
    <line x1="4" y1="18" x2="4" y2="18"></line>
  </svg>
);

const IconSettings = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m16.364-6.364l-4.243 4.243m0-8.485l4.243 4.243M4.636 19.364l4.243-4.243m0 8.485l-4.243-4.243"></path>
  </svg>
);

const IconSave = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const IconCheckCircle2 = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const IconAlertCircle = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

interface TermEntry {
  id: string;
  word: string;
  translation: string;
}

interface AddCollectionWizardProps {
  onBack: () => void;
  onSave: (collection: { title: string; description: string; category: string; terms: AdminTermResult[] }) => void;
}

export const AddCollectionWizard: React.FC<AddCollectionWizardProps> = ({ onBack, onSave }) => {
  const [step, setStep] = useState(1);
  const [collectionData, setCollectionData] = useState({
    title: '',
    category: 'Technical',
    description: '',
    image: null as string | null,
    terms: [] as TermEntry[]
  });

  const categories = ['Technical', 'Political', 'Strategy', 'Ecological'];

  const addTerm = () => {
    const newTerm: TermEntry = {
      id: Date.now().toString(),
      word: '',
      translation: ''
    };
    setCollectionData({ ...collectionData, terms: [...collectionData.terms, newTerm] });
  };

  const removeTerm = (id: string) => {
    setCollectionData({
      ...collectionData,
      terms: collectionData.terms.filter(t => t.id !== id)
    });
  };

  const updateTerm = (id: string, field: keyof TermEntry, value: string) => {
    setCollectionData({
      ...collectionData,
      terms: collectionData.terms.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const handleFinish = () => {
    const adminTerms: AdminTermResult[] = collectionData.terms.map(term => ({
      word: term.word,
      category: collectionData.category as any,
      status: 'Draft',
      translations: { en: term.word, kk: term.translation, ru: term.translation },
      definitions: {
        en: { meaning: '', examples: [], synonyms: [] },
        kk: { meaning: '', examples: [], synonyms: [] },
        ru: { meaning: '', examples: [], synonyms: [] }
      }
    }));
    
    onSave({
      title: collectionData.title,
      description: collectionData.description,
      category: collectionData.category,
      terms: adminTerms
    });
    onBack();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all"
          >
            <IconChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Create Term Collection</h1>
            <p className="text-zinc-500 text-sm font-light">Build a curated set of related terminology entries.</p>
          </div>
        </div>

        {/* Stepper UI */}
        <div className="hidden md:flex items-center gap-3">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                step >= s ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {step > s ? <IconCheckCircle2 size={16} /> : s}
              </div>
              {s < 3 && <div className={`w-8 h-[2px] ${step > s ? 'bg-orange-600' : 'bg-zinc-800'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Step 1: General Information */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 text-orange-500 mb-6">
              <IconSettings size={18} />
              <h2 className="text-lg font-semibold text-white">Collection Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Collection Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Political Terminology Set" 
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-colors"
                  value={collectionData.title}
                  onChange={(e) => setCollectionData({ ...collectionData, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Category</label>
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCollectionData({ ...collectionData, category: cat })}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                        collectionData.category === cat 
                        ? 'bg-orange-600/10 border-orange-500 text-orange-500' 
                        : 'bg-zinc-950 border-white/10 text-zinc-500 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Description</label>
              <textarea 
                rows={4}
                placeholder="What terms are included in this collection?"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                value={collectionData.description}
                onChange={(e) => setCollectionData({ ...collectionData, description: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 2: Media & Assets */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 text-orange-500">
              <IconImage size={18} />
              <h2 className="text-lg font-semibold text-white">Collection Media</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Thumbnail Image</label>
                <div 
                  className="aspect-video bg-zinc-950 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/30 transition-all group overflow-hidden relative"
                  onClick={() => setCollectionData({...collectionData, image: 'https://picsum.photos/seed/collection/800/450'})}
                >
                  {collectionData.image ? (
                    <>
                      <img src={collectionData.image} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <IconUpload size={32} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 mb-4 group-hover:scale-110 group-hover:text-orange-500 transition-all">
                        <IconUpload size={24} />
                      </div>
                      <p className="text-zinc-500 text-sm">Click to upload or drag & drop</p>
                      <p className="text-zinc-700 text-[10px] mt-2 font-mono">JPG, PNG up to 5MB</p>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Collection Preview</label>
                <div className="aspect-video bg-zinc-950 border border-white/5 rounded-2xl flex flex-col items-center justify-center text-zinc-700 p-8 text-center">
                  <IconImage size={32} className="mb-4 text-zinc-800" />
                  <p className="text-sm font-light">Visual representation of your term collection.</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl flex items-start gap-3">
              <IconAlertCircle size={18} className="text-orange-500 mt-0.5 shrink-0" />
              <p className="text-xs text-orange-200/70 leading-relaxed">
                High-quality thumbnails help users quickly identify your collection. We recommend a resolution of 1920x1080 pixels.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Terms Builder */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-500">
                <IconListOrdered size={18} />
                <h2 className="text-lg font-semibold text-white">Term Entries</h2>
              </div>
              <button 
                onClick={addTerm}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-orange-900/20"
              >
                <IconPlus size={16} /> Add Term
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 admin-scrollbar">
              {collectionData.terms.length === 0 ? (
                <div className="py-20 text-center bg-zinc-950/50 rounded-2xl border border-white/5 border-dashed">
                  <p className="text-zinc-600 text-sm">No terms added yet. Start by clicking "Add Term".</p>
                </div>
              ) : (
                collectionData.terms.map((term, idx) => (
                  <div 
                    key={term.id} 
                    className="flex items-center gap-4 p-4 bg-zinc-950 border border-white/5 rounded-2xl group hover:border-white/10 transition-all"
                  >
                    <div className="text-zinc-700 font-mono text-sm w-6">{(idx + 1).toString().padStart(2, '0')}</div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input 
                          type="text" 
                          placeholder="Term (EN)" 
                          className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/30 placeholder:text-zinc-700"
                          value={term.word}
                          onChange={(e) => updateTerm(term.id, 'word', e.target.value)}
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          placeholder="Translation (KK/RU)" 
                          className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/30 placeholder:text-zinc-700"
                          value={term.translation}
                          onChange={(e) => updateTerm(term.id, 'translation', e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      onClick={() => removeTerm(term.id)}
                      className="p-2 text-zinc-700 hover:text-red-500 transition-colors"
                    >
                      <IconTrash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-white/5">
          <button 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              step === 1 ? 'opacity-0 pointer-events-none' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <IconChevronLeft size={18} /> Previous
          </button>
          
          <button 
            onClick={() => step < 3 ? setStep(step + 1) : handleFinish()}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-zinc-200 transition-all shadow-xl"
          >
            {step === 3 ? (
              <><IconSave size={18} /> Create Collection</>
            ) : (
              <>Next Step <IconChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

