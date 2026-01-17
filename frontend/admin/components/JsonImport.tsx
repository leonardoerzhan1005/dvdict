import React, { useState, useRef } from 'react';
import { adminService } from '../../services/api/adminService';
import { AdminTermResult } from '../../types/admin';
import { useTranslation } from '../../src/hooks/useTranslation';

const IconUpload = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const IconFile = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
    <polyline points="13 2 13 9 20 9"></polyline>
  </svg>
);

const IconCheck = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconX = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface JsonTerm {
  id: number;
  slug: string;
  title: {
    en?: string;
    kk?: string;
    ru?: string;
  };
  transcription?: {
    en?: string;
    kk?: string;
    ru?: string;
    la?: string;
  };
  definition?: {
    en?: string;
    kk?: string;
    ru?: string;
  };
}

interface JsonImportData {
  metadata?: {
    version?: string;
    created?: string;
    total_terms?: number;
    languages?: string[];
    domain?: string;
  };
  terms: JsonTerm[];
}

export const JsonImport: React.FC<{ onImportComplete?: () => void }> = ({ onImportComplete }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ 
    imported: number; 
    failed: number;
    created: number;
    updated: number;
    importedTerms: Array<{ title: string; action: 'created' | 'updated' | 'error'; error?: string }>;
  } | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const convertJsonTermToAdminTerm = (jsonTerm: JsonTerm, existingTerm?: AdminTermResult): AdminTermResult => {
    const titleEn = jsonTerm.title?.en || jsonTerm.title?.ru || jsonTerm.title?.kk || '';
    const titleKk = jsonTerm.title?.kk || '';
    const titleRu = jsonTerm.title?.ru || '';

    // Если definition отсутствует на каком-то языке, используем title как значение по умолчанию
    const definitionEn = jsonTerm.definition?.en || '';
    const definitionKk = jsonTerm.definition?.kk || '';
    const definitionRu = jsonTerm.definition?.ru || '';

    return {
      id: existingTerm?.id,
      word: titleEn,
      translations: {
        en: titleEn,
        kk: titleKk,
        ru: titleRu,
      },
      definitions: {
        en: {
          meaning: definitionEn || titleEn,
          examples: [],
          synonyms: [],
        },
        kk: {
          meaning: definitionKk || titleKk,
          examples: [],
          synonyms: [],
        },
        ru: {
          meaning: definitionRu || titleRu,
          examples: [],
          synonyms: [],
        },
      },
      category: existingTerm?.category || 'Technical',
      status: existingTerm?.status || 'Draft',
      tags: existingTerm?.tags || [],
      category_id: existingTerm?.category_id || 1, // Используем первую категорию по умолчанию
    };
  };

  const generateSlug = (jsonTerm: JsonTerm): string => {
    if (jsonTerm.slug) {
      return jsonTerm.slug;
    }
    const title = jsonTerm.title?.en || jsonTerm.title?.ru || jsonTerm.title?.kk || '';
    return title.toLowerCase().replace(/[^a-z0-9а-яё-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Пожалуйста, выберите файл JSON');
      return;
    }

    setSelectedFileName(file.name);
    setError(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data: JsonImportData = JSON.parse(content);

        if (!data.terms || !Array.isArray(data.terms)) {
          setError('Неверный формат JSON: отсутствует массив terms');
          return;
        }

        await importTerms(data.terms);
      } catch (err: any) {
        setError(`Ошибка при чтении файла: ${err.message}`);
      }
    };

    reader.onerror = () => {
      setError('Ошибка при чтении файла');
    };

    reader.readAsText(file);
  };

  const importTerms = async (terms: JsonTerm[]) => {
    setIsImporting(true);
    setProgress({ current: 0, total: terms.length });
    setError(null);
    setSuccess(null);

    let imported = 0;
    let created = 0;
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];
    const importedTerms: Array<{ title: string; action: 'created' | 'updated' | 'error'; error?: string }> = [];

    // Загружаем все существующие термины для проверки по slug
    let existingTermsMap: Map<string, AdminTermResult> = new Map();
    try {
      // Загружаем термины постранично для получения всех
      let page = 1;
      const pageSize = 100;
      let hasMore = true;
      
      while (hasMore) {
        const existingTerms = await adminService.getTerms(page, pageSize);
        if (existingTerms.length === 0) {
          hasMore = false;
        } else {
          existingTerms.forEach(term => {
            // Используем word для создания slug и поиска
            if (term.word) {
              const slug = term.word.toLowerCase().replace(/[^a-z0-9а-яё-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
              existingTermsMap.set(slug, term);
            }
          });
          
          // Если получили меньше чем pageSize, значит это последняя страница
          if (existingTerms.length < pageSize) {
            hasMore = false;
          } else {
            page++;
          }
        }
      }
      
      console.log(`Загружено существующих терминов: ${existingTermsMap.size}`);
    } catch (err) {
      console.error('Error loading existing terms:', err);
    }

    for (let i = 0; i < terms.length; i++) {
      const jsonTerm = terms[i];
      const termTitle = jsonTerm.title?.en || jsonTerm.title?.ru || jsonTerm.title?.kk || jsonTerm.slug || `Термин #${jsonTerm.id}`;
      
      try {
        const slug = generateSlug(jsonTerm);
        const existingTerm = existingTermsMap.get(slug);
        
        const adminTerm = convertJsonTermToAdminTerm(jsonTerm, existingTerm);

        if (existingTerm && existingTerm.id) {
          // Обновляем существующий термин
          await adminService.updateTerm(Number(existingTerm.id), adminTerm);
          updated++;
          importedTerms.push({ title: termTitle, action: 'updated' });
        } else {
          // Создаем новый термин
          await adminService.createTerm(adminTerm);
          created++;
          importedTerms.push({ title: termTitle, action: 'created' });
        }
        
        imported++;
      } catch (err: any) {
        failed++;
        const errorMsg = err.message || 'Неизвестная ошибка';
        errors.push(`${termTitle}: ${errorMsg}`);
        importedTerms.push({ title: termTitle, action: 'error', error: errorMsg });
      }

      setProgress({ current: i + 1, total: terms.length });

      // Небольшая задержка, чтобы не перегружать API
      if (i < terms.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    setIsImporting(false);

    if (failed > 0 && errors.length > 0) {
      setError(`Ошибки при импорте:\n${errors.slice(0, 10).join('\n')}${errors.length > 10 ? `\n... и еще ${errors.length - 10} ошибок` : ''}`);
    }

    setSuccess({ 
      imported, 
      failed, 
      created, 
      updated,
      importedTerms
    });

    if (onImportComplete) {
      onImportComplete();
    }

    // Очищаем выбор файла
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedFileName(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: { files: dataTransfer.files } } as any);
      }
    } else {
      setError('Пожалуйста, выберите файл JSON');
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-[#121214] border border-white/5 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-white mb-1">Импорт терминов из JSON</h2>
      <p className="text-zinc-400 text-sm mb-6">
        Загрузите JSON файл с терминами для массового импорта в систему
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm whitespace-pre-wrap">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
          <div className="flex items-center gap-2 mb-3">
            <IconCheck size={16} />
            <span className="font-medium">Импорт завершен</span>
          </div>
          <div className="text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>Всего обработано: <span className="font-semibold">{success.imported + success.failed}</span></div>
              <div className="text-green-400">Успешно: <span className="font-semibold">{success.imported}</span></div>
              <div className="text-blue-400">Создано новых: <span className="font-semibold">{success.created}</span></div>
              <div className="text-orange-400">Обновлено: <span className="font-semibold">{success.updated}</span></div>
              {success.failed > 0 && (
                <div className="text-red-400 col-span-2">Ошибок: <span className="font-semibold">{success.failed}</span></div>
              )}
            </div>
            
            {success.importedTerms.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <details className="cursor-pointer">
                  <summary className="text-zinc-400 hover:text-white transition-colors mb-2">
                    Показать список импортированных терминов ({success.importedTerms.length})
                  </summary>
                  <div className="mt-2 max-h-60 overflow-y-auto space-y-1 text-xs">
                    {success.importedTerms.map((term, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded ${
                          term.action === 'created' ? 'bg-green-500/10 text-green-400' :
                          term.action === 'updated' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-red-500/10 text-red-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{term.title}</span>
                          <span className="ml-2 text-[10px]">
                            {term.action === 'created' && '✓ Создан'}
                            {term.action === 'updated' && '↻ Обновлен'}
                            {term.action === 'error' && `✗ Ошибка: ${term.error}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors cursor-pointer bg-zinc-950/50"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isImporting ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-white font-medium">
              Импорт терминов... {progress.current} / {progress.total}
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-600 h-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center">
              <IconUpload size={32} className="text-orange-500" />
            </div>
            <div>
              <div className="text-white font-medium mb-2">
                {selectedFileName ? (
                  <span className="flex items-center justify-center gap-2">
                    <IconFile size={20} className="text-orange-500" />
                    {selectedFileName}
                  </span>
                ) : (
                  'Перетащите JSON файл сюда или нажмите для выбора'
                )}
              </div>
              <div className="text-zinc-500 text-sm">
                Поддерживается только формат JSON
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedFileName && !isImporting && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedFileName(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
          >
            <IconX size={16} className="inline mr-1" />
            Очистить
          </button>
        </div>
      )}
    </div>
  );
};
