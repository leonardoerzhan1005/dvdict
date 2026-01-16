
import React, { useState } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

export type AdminTab = 'dashboard' | 'terms' | 'categories' | 'analytics' | 'settings';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onExit: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, setActiveTab, onExit }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': 
        return <span className="font-light">Terminology <span className="font-medium text-white">Terms</span></span>;
      case 'terms': 
        return <span className="font-medium">Term <span className="text-zinc-500">Index</span></span>;
      case 'categories': 
        return <span className="font-medium">Category <span className="text-zinc-500">Management</span></span>;
      case 'analytics': 
        return <span className="font-medium">Linguistic <span className="text-zinc-500">Analytics</span></span>;
      case 'settings': 
        return <span className="font-medium">Control your <span className="text-zinc-500">preferences!</span></span>;
      default: 
        return <span className="font-medium">Polyglot <span className="text-zinc-500">Management</span></span>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex font-sans selection:bg-orange-500/30 relative overflow-hidden">
      {/* Ambient Background - The "Liquid" Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] mix-blend-screen animate-pulse duration-[10000ms]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
      </div>

      <div className="relative z-10 flex w-full min-h-screen">
        {/* Desktop Sidebar */}
        <AdminSidebar 
          currentTab={activeTab} 
          onNavigate={setActiveTab} 
          className="fixed left-0 top-0 z-20 hidden md:flex h-screen shadow-2xl" 
        />
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <div className="h-full w-64" onClick={e => e.stopPropagation()}>
              <AdminSidebar 
                currentTab={activeTab} 
                onNavigate={setActiveTab} 
                className="h-full shadow-2xl"
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:ml-64 relative w-full">
          <AdminHeader 
            title={getPageTitle()} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            onNavigate={setActiveTab}
          />

          <main className="flex-1 overflow-y-auto admin-scrollbar">
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
