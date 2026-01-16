import React, { useState, useCallback, useEffect } from 'react';
import { AdminTermResult } from '../types/admin';
import { adminService } from '../services/api/adminService';
import { Language } from '../types';
import { AddCollectionWizard } from './components/AddCollectionWizard';

const IconSearch = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const IconX = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const IconBookOpen = ({ size = 10, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const IconClock = ({ size = 10, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconPlay = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5v14l11-7z"></path>
  </svg>
);

const IconChevronRight = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const IconDatabase = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const IconBarChart = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const IconMessageCircle = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

const IconShare = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
  </svg>
);

const IconPlus = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const AdminDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All terms');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [terms, setTerms] = useState<AdminTermResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTerms = async () => {
      setIsLoading(true);
      try {
        const loadedTerms = await adminService.getTerms();
        setTerms(loadedTerms);
      } catch (error) {
        console.error('Error loading terms:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTerms();
  }, []);

  const filters = [
    { label: 'All terms', count: terms.length },
    { label: 'Verified', count: terms.filter(t => t.status === 'Verified').length },
    { label: 'Pending', count: terms.filter(t => t.status === 'Pending').length },
    { label: 'Draft', count: terms.filter(t => t.status === 'Draft').length },
    { label: 'Technical', count: terms.filter(t => t.category === 'Technical').length },
    { label: 'Political', count: terms.filter(t => t.category === 'Political').length },
  ];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.translations.kk?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.translations.ru?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter !== 'All terms') {
      if (activeFilter === 'Verified' || activeFilter === 'Pending' || activeFilter === 'Draft') {
        matchesFilter = term.status === activeFilter;
      } else {
        matchesFilter = term.category === activeFilter;
      }
    }

    return matchesSearch && matchesFilter;
  });

  const popularTerms = terms.slice(0, 4);

  const hubItems = [
    { title: 'Term repository', subtitle: `${terms.length} entries`, icon: IconDatabase },
    { title: 'Analytics', subtitle: 'Usage statistics', icon: IconBarChart },
    { title: 'Discussion', subtitle: 'Community feedback', icon: IconMessageCircle },
    { title: 'Export data', subtitle: 'CSV, JSON formats', icon: IconShare },
  ];

  const handleCollectionSave = useCallback(async (collection: { title: string; description: string; category: string; terms: AdminTermResult[] }) => {
    try {
      for (const term of collection.terms) {
        await adminService.createTerm(term);
      }
      setIsCreatingCollection(false);
      const updatedTerms = await adminService.getTerms();
      setTerms(updatedTerms);
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Ошибка при сохранении коллекции');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto animate-fade-up flex items-center justify-center py-20">
        <div className="text-white text-lg">Загрузка данных...</div>
      </div>
    );
  }

  if (isCreatingCollection) {
    return (
      <AddCollectionWizard
        onBack={() => setIsCreatingCollection(false)}
        onSave={handleCollectionSave}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in duration-500 admin-scrollbar">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* LEFT COLUMN - MAIN CONTENT */}
        <div className="xl:col-span-3 space-y-8">
          {/* Header Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium text-white mb-1">Terminology Repository</h2>
                <p className="text-zinc-500 text-sm">Manage and explore your trilingual terminology.</p>
              </div>
              
              {/* Search Component */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IconSearch className="text-zinc-500 group-focus-within:text-orange-500 transition-colors" size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Search terms..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-2.5 bg-[#121214] border border-white/10 rounded-full text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500/50 focus:bg-[#18181b] w-full md:w-64 transition-all shadow-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white transition-colors"
                  >
                    <IconX size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {filters.map((filter) => (
                <button 
                  key={filter.label}
                  onClick={() => setActiveFilter(filter.label)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 border ${
                    activeFilter === filter.label 
                    ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-900/40' 
                    : 'bg-[#121214] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                  }`}
                >
                  {filter.label}
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    activeFilter === filter.label 
                    ? 'bg-orange-500/50 text-white' 
                    : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Terms Grid */}
          {filteredTerms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTerms.slice(0, 6).map((term, idx) => {
                const progress = term.status === 'Verified' ? 100 : term.status === 'Pending' ? 50 : 0;
                return (
                  <div 
                    key={term.id || idx}
                    className="group bg-[#121214] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all cursor-pointer hover:-translate-y-1 duration-300 flex flex-col h-full"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden shrink-0 bg-gradient-to-br from-zinc-800 to-zinc-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl font-black text-white/20">{term.word[0]}</div>
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <div className="bg-white/90 backdrop-blur text-black px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold shadow-lg">
                          <IconBookOpen size={10} />
                          {term.category || 'General'}
                        </div>
                        <div className="bg-white/90 backdrop-blur text-black px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold shadow-lg">
                          <IconClock size={10} />
                          {term.status || 'Draft'}
                        </div>
                      </div>

                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                          <IconPlay size={16} />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="text-orange-500 text-[11px] font-medium mb-1.5">{term.word}</h4>
                      
                      <h3 className="text-white text-sm font-medium leading-snug mb-4 line-clamp-2 flex-1">
                        {term.translations.kk || term.translations.ru || term.translations.en || 'No translation'}
                      </h3>

                      <div className="flex items-center gap-3 mt-auto">
                        <span className="text-[10px] text-zinc-500 font-medium">Status:</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000" 
                            style={{ 
                              width: `${progress}%`,
                              backgroundColor: progress > 50 ? '#10b981' : '#f97316'
                            }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono w-8 text-right">{progress}%</span>
                        <div className="text-zinc-600 group-hover:text-white transition-colors">
                          <IconChevronRight size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#121214] border border-white/5 rounded-3xl border-dashed">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                <IconSearch size={24} />
              </div>
              <h3 className="text-zinc-300 font-medium mb-1">No terms found</h3>
              <p className="text-zinc-500 text-sm">Try adjusting your search or filter.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveFilter('All terms');}}
                className="mt-6 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - SIDEBAR WIDGETS */}
        <div className="xl:col-span-1 space-y-8">
          {/* Popular Terms Widget */}
          <div className="bg-[#121214] border border-white/5 rounded-3xl p-6">
            <h3 className="text-base font-medium text-white mb-2">Popular Terms</h3>
            <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
              Most frequently accessed terminology entries.
            </p>

            <div className="space-y-3">
              {popularTerms.length > 0 ? popularTerms.map((term, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-2xl border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 hover:border-white/10 transition-all group text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <IconDatabase size={14} />
                    </div>
                    <span className="text-xs text-zinc-300 font-medium line-clamp-1">{term.word}</span>
                  </div>
                  <IconChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                </button>
              )) : (
                <p className="text-zinc-500 text-xs text-center py-4">No terms yet</p>
              )}
            </div>
          </div>

          {/* Hub Widget */}
          <div className="bg-[#121214] border border-white/5 rounded-3xl p-6">
            <h3 className="text-base font-medium text-white mb-2">Quick Access</h3>
            <p className="text-zinc-500 text-xs mb-6 leading-relaxed">
              Navigate to key sections of the admin panel.
            </p>

            <div className="space-y-4">
              {hubItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button key={i} className="w-full flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={18} fill={i === 0 ? "currentColor" : "none"} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-zinc-200 font-medium group-hover:text-white">{item.title}</div>
                        <div className="text-[10px] text-zinc-500">{item.subtitle}</div>
                      </div>
                    </div>
                    <IconChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsCreatingCollection(true)}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-orange-900/40 border border-orange-400/20 flex items-center justify-center gap-2"
            >
              <IconPlus size={14} />
              Create Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
