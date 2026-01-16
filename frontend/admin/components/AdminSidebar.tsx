import React from 'react';
import { AdminTab } from '../AdminLayout';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onNavigate: (tab: AdminTab) => void;
  className?: string;
  onClose?: () => void;
}

const IconDashboard = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconDatabase = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
  </svg>
);

const IconBarChart = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const IconSettings = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m16.364-6.364l-4.243 4.243m0-8.485l4.243 4.243M4.636 19.364l4.243-4.243m0 8.485l-4.243-4.243"></path>
  </svg>
);

const IconFolder = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconX = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  currentTab, 
  onNavigate, 
  className = '',
  onClose 
}) => {
  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Overview', icon: IconDashboard },
    { id: 'terms' as AdminTab, label: 'Terms', icon: IconDatabase },
    { id: 'categories' as AdminTab, label: 'Categories', icon: IconFolder },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: IconBarChart },
    { id: 'settings' as AdminTab, label: 'Settings', icon: IconSettings },
  ];

  return (
    <div className={`w-64 bg-zinc-950/70 backdrop-blur-2xl border-r border-white/5 flex flex-col ${className}`}>
      {/* Logo Area */}
      <div className="p-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
                <div className="w-4 h-9 bg-blue-600 rounded-full rotate-[15deg] opacity-90"></div>
                <div className="w-4 h-9 bg-blue-500 rounded-full rotate-[15deg]"></div>
                <div className="w-3 h-3 bg-blue-700 rounded-full self-end mb-1"></div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-zinc-400 hover:text-white transition-colors"
          >
            <IconX size={20} />
          </button>
        )}
      </div>

      <div className="px-4 py-2 flex-1 overflow-y-auto">
        <p className="px-4 text-[10px] text-zinc-500 uppercase tracking-[0.2em] mb-4 font-medium">Menu</p>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-orange-500 bg-white/5 border border-white/5 shadow-lg shadow-black/20 backdrop-blur-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] hover:translate-x-1'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'text-zinc-500'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 shrink-0">
        <div className="relative overflow-hidden rounded-2xl p-0.5 bg-gradient-to-b from-white/10 to-transparent">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-5 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="mb-4 relative">
                <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full"></div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg border border-white/10 relative z-10 rotate-3 group-hover:rotate-6 transition-transform duration-500">
                  <IconDatabase size={24} className="text-white" />
                </div>
              </div>
              <h4 className="text-white font-semibold mb-1 text-sm">Domestic Volience </h4>
              <p className="text-zinc-400 text-xs mb-4 leading-relaxed font-light">
                Manage your domestic volience with precision and ease.
              </p>
              <button 
                onClick={() => {
                  onNavigate('terms');
                  onClose?.();
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white text-xs font-bold py-2.5 rounded-lg transition-all shadow-lg shadow-orange-900/40 border border-orange-400/20"
              >
                Open Volience
              </button>
            </div>
            <div className="absolute top-[-50%] right-[-50%] w-32 h-32 bg-orange-500/20 blur-3xl rounded-full pointer-events-none group-hover:bg-orange-500/30 transition-colors duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

