import React, { useRef, useEffect } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  theme: 'en' | 'ru' | 'kk';
}

export const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, placeholder, theme }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const themeClasses = {
    en: 'focus-within:ring-blue-500/5',
    ru: 'focus-within:ring-indigo-500/5',
    kk: 'focus-within:ring-emerald-500/5',
  }[theme];

  return (
    <div
      className={`w-full bg-white/40 backdrop-blur-md border border-white/60 rounded-[3rem] overflow-hidden focus-within:ring-[12px] ${themeClasses} transition-all duration-700 shadow-xl`}
    >
      <div className="flex items-center gap-3 p-5 border-b border-white/20 bg-white/20">
        <button
          onClick={() => execCommand('bold')}
          className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl text-slate-600 hover:text-blue-600 transition-all active:scale-90"
          title="Bold"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
          </svg>
        </button>
        <button
          onClick={() => execCommand('italic')}
          className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl text-slate-600 hover:text-blue-600 transition-all active:scale-90"
          title="Italic"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
          </svg>
        </button>
        <div className="w-px h-8 bg-slate-200/50 mx-2"></div>
        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl text-slate-600 hover:text-blue-600 transition-all active:scale-90"
          title="List"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z" />
          </svg>
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="px-12 py-12 min-h-[400px] outline-none text-slate-800 leading-relaxed font-medium prose prose-slate max-w-none text-xl lg:text-2xl"
        data-placeholder={placeholder}
      ></div>
    </div>
  );
};

