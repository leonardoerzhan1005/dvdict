import React, { useState, useEffect, useCallback } from 'react';
import { AddCategoryWizard } from './components/AddCategoryWizard';
import { Category } from '../services/api/dictionaryService';
import { dictionaryService } from '../services/api/dictionaryService';
import { Language } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const IconEdit = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const IconTrash = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
  </svg>
);

export const CategoryManager: React.FC = () => {
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    loadCategories();
  }, [language]);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedCategories = await dictionaryService.getCategories(language);
      setCategories(loadedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const refreshCategories = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  const handleAdd = useCallback(() => {
    setSelectedCategory(null);
    setIsWizardMode(true);
  }, []);

  const handleEdit = useCallback((category: Category) => {
    setSelectedCategory(category);
    setIsWizardMode(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить эту категорию? Это действие необратимо.')) {
      try {
        await dictionaryService.deleteCategory(id);
        refreshCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Ошибка при удалении категории');
      }
    }
  }, [refreshCategories]);

  const handleSave = useCallback(async (category: Category) => {
    refreshCategories();
    setIsWizardMode(false);
  }, [refreshCategories]);

  if (isWizardMode) {
    return (
      <AddCategoryWizard
        onBack={() => setIsWizardMode(false)}
        onSave={handleSave}
        initialData={selectedCategory}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto animate-fade-up flex items-center justify-center py-20">
        <div className="text-white text-lg">Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto animate-fade-up">
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
              <span className="text-[11px] font-black text-purple-500 uppercase tracking-[0.4em]">Node / Categories</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white serif-modern tracking-tighter">Category Index</h1>
            <p className="text-zinc-400 font-medium mt-3 text-lg">Управление категориями словаря ({categories.length} записей).</p>
          </div>
          <button 
            onClick={handleAdd}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-500 text-white font-black px-10 py-6 rounded-[2rem] shadow-lg shadow-purple-900/40 hover:from-purple-500 hover:to-purple-400 transition-all flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] border border-purple-400/20"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <svg className="w-5 h-5 group-hover:rotate-90 transition-all relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" /></svg>
            <span className="relative z-10">Add Category</span>
          </button>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-[3.5rem] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-900/50">
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5">ID</th>
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5">Title</th>
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5">Slug</th>
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5">Parent</th>
                  <th className="px-12 py-8 text-[11px] font-black text-zinc-400 uppercase tracking-widest border-b border-white/5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.length > 0 ? categories.map((category) => (
                  <tr key={category.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-12 py-10 font-mono text-zinc-400 text-sm">{category.id}</td>
                    <td className="px-12 py-10 font-black text-white text-xl tracking-tight">{category.title}</td>
                    <td className="px-12 py-10 text-zinc-400 font-mono text-sm">{category.slug}</td>
                    <td className="px-12 py-10">
                      {category.parent_id ? (
                        <span className="text-zinc-500 text-sm">
                          {categories.find(c => c.id === category.parent_id)?.title || `ID: ${category.parent_id}`}
                        </span>
                      ) : (
                        <span className="text-zinc-600 italic text-sm">Root</span>
                      )}
                    </td>
                    <td className="px-12 py-10">
                      <div className="flex gap-4 justify-end">
                        <button 
                          onClick={() => handleEdit(category)} 
                          className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-purple-500 hover:border-purple-500/50 hover:shadow-xl transition-all flex items-center justify-center"
                        >
                          <IconEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)} 
                          className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-red-500 hover:border-red-500/50 hover:shadow-xl transition-all flex items-center justify-center"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-12 py-32 text-center">
                      <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-600 border border-white/5">
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>
                        </div>
                        <p className="text-zinc-400 font-bold uppercase text-[11px] tracking-widest">No categories found</p>
                        <button onClick={handleAdd} className="text-purple-500 font-black text-xs uppercase tracking-widest hover:text-purple-400 transition-colors">Add first category</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
