import React, { useState, useCallback } from 'react';
import { AdminLayout, AdminTab } from '../admin/AdminLayout';
import { AdminDashboard } from '../admin/Dashboard';
import { AdminAnalytics } from '../admin/Analytics';
import { AdminSettings } from '../admin/Settings';
import { TerminologyManager } from '../admin/TerminologyManager';
import { CategoryManager } from '../admin/CategoryManager';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const handleExit = useCallback(() => {
    window.location.hash = 'home';
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'terms':
        return <TerminologyManager />;
      case 'categories':
        return <CategoryManager />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onExit={handleExit}>
      {renderContent()}
    </AdminLayout>
  );
};

