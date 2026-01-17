
import React, { useState, useEffect, useCallback } from 'react';
import { AddTermWizard } from './components/AddTermWizard';
import { AdminTermResult } from '../types/admin';
import { adminService } from '../services/api/adminService';
import { useTranslation } from '../src/hooks/useTranslation';
import { AdminPagination } from './components/AdminPagination';

const ITEMS_PER_PAGE = 20;

export const TerminologyManager: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<AdminTermResult | null>(null);
  const [allTerms, setAllTerms] = useState<AdminTermResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedTerms = await adminService.getTerms();
      setAllTerms(loadedTerms);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading terms:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTerms = useCallback(() => {
    loadTerms();
  }, [loadTerms]);

  const handleAdd = useCallback(() => {
    setSelectedTerm(null);
    setIsWizardMode(true);
  }, []);

  const handleEdit = useCallback(async (term: AdminTermResult) => {
    if (term.id) {
      try {
        // Загружаем полные данные термина со всеми переводами
        const fullTerm = await adminService.getTerm(Number(term.id));
        setSelectedTerm(fullTerm);
        setIsWizardMode(true);
      } catch (error) {
        console.error('Error loading term for edit:', error);
        alert(t('admin.terminology.loadError'));
      }
    } else {
      setSelectedTerm(term);
      setIsWizardMode(true);
    }
  }, []);

  const handleDelete = useCallback(async (id: number | string) => {
    if (confirm(t('admin.terminology.deleteConfirm'))) {
      try {
        await adminService.deleteTerm(Number(id));
        refreshTerms();
      } catch (error) {
        console.error('Error deleting term:', error);
        alert(t('admin.terminology.deleteError'));
      }
    }
  }, [refreshTerms, t]);

  const handleSave = useCallback(async (data: AdminTermResult) => {
    try {
      if (selectedTerm && selectedTerm.id) {
        console.log('Updating term:', selectedTerm.id, data);
        const updated = await adminService.updateTerm(Number(selectedTerm.id), data);
        console.log('Term updated successfully:', updated);
      } else {
        console.log('Creating new term:', data);
        const created = await adminService.createTerm(data);
        console.log('Term created successfully:', created);
      }
      refreshTerms();
      setIsWizardMode(false);
    } catch (error) {
      console.error('Error saving term:', error);
      alert(t('admin.terminology.saveError') + ': ' + (error as Error).message);
    }
  }, [selectedTerm, refreshTerms, t]);

  if (isWizardMode) {
    return (
      <AddTermWizard
        onBack={() => setIsWizardMode(false)}
        onSave={handleSave}
        initialData={selectedTerm}
      />
    );
  }

  const filteredTerms = search.trim()
    ? allTerms.filter(term => 
        term.word.toLowerCase().includes(search.toLowerCase()) ||
        term.translations.kk?.toLowerCase().includes(search.toLowerCase()) ||
        term.translations.ru?.toLowerCase().includes(search.toLowerCase()) ||
        term.translations.en?.toLowerCase().includes(search.toLowerCase())
      )
    : allTerms;

  const totalPages = Math.ceil(filteredTerms.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTerms = filteredTerms.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto animate-fade-up flex items-center justify-center py-20">
        <div className="text-white text-lg">{t('admin.terminology.loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto animate-fade-up">
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
               <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.4em]">{t('admin.terminology.badge')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white serif-modern tracking-tighter">{t('admin.terminology.title')}</h1>
            <p className="text-zinc-400 font-medium mt-3 text-lg">{t('admin.terminology.subtitle', { count: allTerms.length })}</p>
          </div>
          <button 
            onClick={handleAdd}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black px-10 py-6 rounded-[2rem] shadow-lg shadow-orange-900/40 hover:from-orange-500 hover:to-orange-400 transition-all flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] border border-orange-400/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <svg className="w-5 h-5 group-hover:rotate-90 transition-all relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
            <span className="relative z-10">{t('admin.terminology.initializeNewEntry')}</span>
          </button>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-sm">
          <div className="p-10 border-b border-white/5 bg-zinc-900/30">
            <div className="relative">
              <input 
                type="text"
                placeholder={t('admin.terminology.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-white/5 rounded-[1.5rem] px-12 py-5 text-lg font-bold text-white outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all placeholder:text-zinc-500"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-900/50">
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5">{t('admin.terminology.table.coreDescriptor')}</th>
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5">{t('admin.terminology.table.localKk')}</th>
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5">{t('admin.terminology.table.localRu')}</th>
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5">{t('admin.terminology.table.category')}</th>
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 text-right">{t('admin.terminology.table.operations')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedTerms.length > 0 ? paginatedTerms.map((term) => (
                  <tr key={term.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-12 py-10 font-black text-white text-xl tracking-tight">{term.word}</td>
                    <td className="px-12 py-10 text-zinc-300 font-bold">{term.translations.kk || <span className="text-zinc-600 italic font-medium">{t('admin.terminology.undefined')}</span>}</td>
                    <td className="px-12 py-10 text-zinc-300 font-bold">{term.translations.ru || <span className="text-zinc-600 italic font-medium">{t('admin.terminology.undefined')}</span>}</td>
                    <td className="px-12 py-10">
                      <span className="px-4 py-1.5 bg-zinc-900 text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">{term.category || t('admin.terminology.uncategorized')}</span>
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex gap-4 justify-end">
                        <button onClick={() => handleEdit(term)} className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 hover:shadow-xl transition-all flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={() => handleDelete(term.id!)} className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-red-500 hover:border-red-500/50 hover:shadow-xl transition-all flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-12 py-32 text-center">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-600 border border-white/5">
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <p className="text-zinc-400 font-bold uppercase text-[11px] tracking-widest">{t('admin.terminology.empty')}</p>
                        <button onClick={handleAdd} className="text-orange-500 font-black text-xs uppercase tracking-widest hover:text-orange-400 transition-colors">{t('admin.terminology.addFirstRecord')}</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <AdminPagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              color="orange"
            />
          )}
        </div>
      </div>
    </div>
  );
};
