import React from 'react';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  color?: 'orange' | 'purple';
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
  color = 'orange',
}) => {
  if (totalPages <= 1) return null;

  const colorClasses = {
    orange: {
      active: 'bg-orange-500 text-white border-orange-500',
      hover: 'hover:border-orange-500/50 hover:text-orange-500',
      disabled: 'border-white/5 text-zinc-600',
    },
    purple: {
      active: 'bg-purple-500 text-white border-purple-500',
      hover: 'hover:border-purple-500/50 hover:text-purple-500',
      disabled: 'border-white/5 text-zinc-600',
    },
  };

  const colors = colorClasses[color];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-2 py-8 px-12 border-t border-white/5">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={`w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 transition-all flex items-center justify-center ${
          page <= 1
            ? colors.disabled + ' cursor-not-allowed'
            : colors.hover + ' hover:bg-zinc-800'
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="flex items-center gap-2">
        {getVisiblePages().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`dots-${idx}`} className="px-4 text-zinc-600 font-bold">
                ...
              </span>
            );
          }

          const pageNum = p as number;
          const isActive = pageNum === page;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-12 h-12 rounded-2xl border transition-all flex items-center justify-center font-black text-sm ${
                isActive
                  ? colors.active
                  : `bg-zinc-900 border-white/5 text-zinc-400 ${colors.hover} hover:bg-zinc-800`
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={`w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 transition-all flex items-center justify-center ${
          page >= totalPages
            ? colors.disabled + ' cursor-not-allowed'
            : colors.hover + ' hover:bg-zinc-800'
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};
