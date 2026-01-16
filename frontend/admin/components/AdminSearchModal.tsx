import React, { useState, useEffect, useMemo } from 'react';
import { AdminTab } from '../AdminLayout';
import { adminService } from '../../services/api/adminService';
import { AdminTermResult } from '../../types/admin';

const IconSearch = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const IconHistory = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
    <path d="M21 3v5h-5"></path>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
    <path d="M3 21v-5h5"></path>
  </svg>
);

const IconDatabase = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const IconChevronRight = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface SearchItem {
  id: string;
  type: 'term' | 'page';
  title: string;
  subtitle?: string;
  tab: AdminTab;
}

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: AdminTab) => void;
}

const RECENT_SEARCHES = [
  'Sovereignty',
  'Digitalization',
  'Infrastructure'
];

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [allTerms, setAllTerms] = useState<AdminTermResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadTerms();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setQuery(''), 200);
    }
  }, [isOpen]);

  const loadTerms = async () => {
    setIsLoading(true);
    try {
      const terms = await adminService.getTerms();
      setAllTerms(terms);
    } catch (error) {
      console.error('Error loading terms for search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredResults = useMemo(() => {
    if (!query) return [];
    const lowerQuery = query.toLowerCase();
    
    const termResults: SearchItem[] = allTerms
      .filter(term => 
        term.word.toLowerCase().includes(lowerQuery) ||
        term.translations.kk?.toLowerCase().includes(lowerQuery) ||
        term.translations.ru?.toLowerCase().includes(lowerQuery) ||
        term.translations.en?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map(term => ({
        id: `term-${term.id}`,
        type: 'term' as const,
        title: term.word,
        subtitle: `${term.translations.kk || ''} • ${term.translations.ru || ''}`,
        tab: 'repository' as AdminTab,
      }));

    const pageResults: SearchItem[] = [
      { id: 'page-dashboard', type: 'page', title: 'Dashboard', subtitle: 'Overview and statistics', tab: 'dashboard' },
      { id: 'page-repository', type: 'page', title: 'Repository', subtitle: 'Manage terminology', tab: 'repository' },
      { id: 'page-analytics', type: 'page', title: 'Analytics', subtitle: 'Usage statistics', tab: 'analytics' },
      { id: 'page-settings', type: 'page', title: 'Settings', subtitle: 'System configuration', tab: 'settings' },
    ].filter(page => 
      page.title.toLowerCase().includes(lowerQuery) ||
      page.subtitle?.toLowerCase().includes(lowerQuery)
    );

    return [...termResults, ...pageResults];
  }, [query, allTerms]);

  if (!isOpen) return null;

  const handleSelect = (tab: AdminTab) => {
    onNavigate(tab);
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'term': return <IconDatabase size={16} />;
      case 'page': return <IconSearch size={16} />;
      default: return <IconSearch size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[70vh] ring-1 ring-white/5">
        <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3 bg-zinc-900/50">
          <IconSearch className="text-zinc-500" size={20} />
          <input 
            autoFocus
            type="text"
            placeholder="Search terms, pages..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-500 text-lg h-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-xs font-medium px-3 border border-white/5"
          >
            ESC
          </button>
        </div>

        <div className="overflow-y-auto p-2 bg-[#0c0c0e]">
          {query === '' && (
            <div className="p-4">
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2">Recent Searches</h3>
              <div className="space-y-1">
                {RECENT_SEARCHES.map((term, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setQuery(term)}
                    className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-white/5 rounded-lg flex items-center gap-3 transition-colors group"
                  >
                    <IconHistory size={16} className="text-zinc-600 group-hover:text-zinc-400" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
              
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-3 px-2">Quick Links</h3>
              <div className="flex gap-2 px-2 flex-wrap">
                <button onClick={() => handleSelect('dashboard')} className="px-3 py-2 bg-zinc-800 hover:bg-orange-600 hover:text-white text-zinc-300 rounded-lg text-sm border border-white/5 transition-colors">Dashboard</button>
                <button onClick={() => handleSelect('repository')} className="px-3 py-2 bg-zinc-800 hover:bg-orange-600 hover:text-white text-zinc-300 rounded-lg text-sm border border-white/5 transition-colors">Repository</button>
                <button onClick={() => handleSelect('analytics')} className="px-3 py-2 bg-zinc-800 hover:bg-orange-600 hover:text-white text-zinc-300 rounded-lg text-sm border border-white/5 transition-colors">Analytics</button>
                <button onClick={() => handleSelect('settings')} className="px-3 py-2 bg-zinc-800 hover:bg-orange-600 hover:text-white text-zinc-300 rounded-lg text-sm border border-white/5 transition-colors">Settings</button>
              </div>
            </div>
          )}

          {query !== '' && (
            <div className="space-y-1 p-1">
              {filteredResults.length > 0 ? (
                filteredResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.tab)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group text-left border border-transparent hover:border-white/5"
                  >
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/10 transition-colors shrink-0">
                      {getTypeIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white truncate">{item.title}</span>
                        {item.type === 'term' && <span className="text-[10px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded border border-orange-500/20 font-medium tracking-wide">TERM</span>}
                        {item.type === 'page' && <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/20 font-medium tracking-wide">PAGE</span>}
                      </div>
                      {item.subtitle && <div className="text-xs text-zinc-500 truncate">{item.subtitle}</div>}
                    </div>
                    <IconChevronRight size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
                  </button>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-600 border border-white/5">
                    <IconSearch size={24} />
                  </div>
                  <p className="text-zinc-400 text-sm">No results found for "{query}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-zinc-900/80 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><span className="bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700 text-zinc-400 font-mono">↵</span> to select</span>
            <span className="flex items-center gap-1"><span className="bg-zinc-800 px-1 py-0.5 rounded border border-zinc-700 text-zinc-400 font-mono">↑↓</span> to navigate</span>
          </div>
          <div>Polyglot Search</div>
        </div>
      </div>
    </div>
  );
};

