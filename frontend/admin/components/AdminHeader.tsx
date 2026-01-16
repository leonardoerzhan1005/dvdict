import React, { useState, useRef, useEffect } from 'react';
import { AdminSearchModal } from './AdminSearchModal';
import { AdminTab } from '../AdminLayout';

const IconSearch = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const IconBell = ({ size = 18, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const IconMenu = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="18" x2="20" y2="18"></line>
  </svg>
);

const IconCheck = ({ size = 12, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconSettings = ({ size = 14, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m16.364-6.364l-4.243 4.243m0-8.485l4.243 4.243M4.636 19.364l4.243-4.243m0 8.485l-4.243-4.243"></path>
  </svg>
);

const IconFileText = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const IconMessageCircle = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

interface AdminHeaderProps {
  title: React.ReactNode;
  toggleSidebar?: () => void;
  onNavigate: (tab: AdminTab) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, toggleSidebar, onNavigate }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-20 flex items-center justify-between px-8 sticky top-0 z-20 bg-zinc-950 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="md:hidden text-zinc-400 hover:text-white transition-colors">
            <IconMenu size={24} />
          </button>
          <div className="text-xl md:text-2xl text-white font-medium tracking-tight">
            {title}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors group"
            title="Search (⌘K)"
          >
            <IconSearch size={18} className="group-hover:scale-110 transition-transform" />
          </button>

          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-10 h-10 rounded-full border border-white/5 bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors relative group ${showNotifications ? 'bg-white/10 text-white' : ''}`}
            >
              <IconBell size={18} className={!showNotifications ? "group-hover:rotate-12 transition-transform duration-300" : ""} />
              <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-orange-600 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-zinc-950 shadow-lg shadow-orange-500/50">2</span>
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-4 w-96 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-white/10">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900/50">
                  <h3 className="text-white font-medium text-sm">Notifications</h3>
                  <div className="flex items-center gap-4">
                    <button className="text-[10px] text-orange-500 font-medium flex items-center gap-1.5 hover:text-orange-400 transition-colors">
                      <IconCheck size={12} /> Mark as read
                    </button>
                    <IconSettings size={14} className="text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                  </div>
                </div>
                <div className="px-4 pt-3 flex gap-4 text-sm border-b border-white/5 bg-zinc-950/80">
                  <button className="pb-3 text-orange-500 font-medium border-b-2 border-orange-500 text-xs">All <span className="bg-orange-500/20 text-orange-500 text-[10px] px-1.5 py-0.5 rounded-full ml-1">12</span></button>
                  <button className="pb-3 text-zinc-500 hover:text-zinc-300 font-medium text-xs">Unread <span className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0.5 rounded-full ml-1 border border-white/5">3</span></button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 flex gap-3 relative group">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/10 transition-colors">
                      <IconFileText size={16} className="text-zinc-300" />
                    </div>
                    <div className="pr-4">
                      <p className="text-xs font-medium text-white mb-0.5 leading-snug">New term added: Sovereignty</p>
                      <p className="text-[10px] text-zinc-500">2h ago</p>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                  </div>

                  <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 flex gap-3 relative group">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/10 transition-colors">
                      <IconMessageCircle size={16} className="text-zinc-300" />
                    </div>
                    <div className="pr-4">
                      <p className="text-xs font-medium text-white mb-0.5 leading-snug">Repository sync completed</p>
                      <p className="text-[10px] text-zinc-500">3h ago</p>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => onNavigate('settings')}
            className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700/50 overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all duration-300 flex items-center justify-center"
          >
            <IconSettings size={18} className="text-zinc-400" />
          </button>
        </div>
      </header>

      <AdminSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={onNavigate} 
      />
    </>
  );
};

