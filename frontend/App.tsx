import React, { useState, useCallback } from 'react';
import { useRouter } from './hooks/useRouter';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AboutPage } from './pages/AboutPage';
import { ApiPage } from './pages/ApiPage';
import { ContactPage } from './pages/ContactPage';
import { Login } from './components/Login';
import { AdminPage } from './pages/AdminPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { RegisterPage } from './src/features/auth/RegisterPage';
import { ForgotPasswordPage } from './src/features/auth/ForgotPasswordPage';
import { ProfilePage } from './src/features/profile/ProfilePage';
import { FavoritesPage } from './src/features/favorites/FavoritesPage';
import { SuggestionForm } from './src/features/suggestions/SuggestionForm';
import { SearchPage } from './src/features/search/SearchPage';
import { TermDetailsPage } from './src/features/dictionary/TermDetailsPage';
import { CategoryPage } from './src/features/dictionary/CategoryPage';
import { ProtectedRoute } from './src/components/common/ProtectedRoute';

const AppContent: React.FC = () => {
  const { route, params, navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  const handleNavigateToHome = useCallback(() => {
    navigate('home');
    setSearchQuery('');
  }, [navigate]);

  const handleTermClick = useCallback(
    (word: string) => {
      setSearchQuery(word);
      navigate('home');
    },
    [navigate]
  );

  const handleHomePageMounted = useCallback(() => {
    if (searchQuery) {
      setSearchQuery('');
    }
  }, [searchQuery]);

  const handleLogin = useCallback((email: string) => {
    // После успешного входа перенаправляем на главную
    navigate('home');
  }, [navigate]);

  const renderPage = () => {
    switch (route) {
      case 'home':
        return (
          <HomePage
            onNavigateToCatalog={() => navigate('catalog')}
            initialQuery={searchQuery || undefined}
            onMounted={handleHomePageMounted}
          />
        );
      case 'catalog':
        return <CatalogPage onTermClick={handleTermClick} />;
      case 'about':
        return <AboutPage />;
      case 'api':
        return <ApiPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'register':
        return <RegisterPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'profile':
        return (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        );
      case 'favorites':
        return (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        );
      case 'suggest':
        return <SuggestionForm />;
      case 'search':
        return <SearchPage initialQuery={params.q} />;
      case 'terms':
        return params.id ? (
          <TermDetailsPage termId={parseInt(params.id)} />
        ) : (
          <HomePage onNavigateToCatalog={() => navigate('catalog')} />
        );
      case 'categories':
        return params.id ? (
          <CategoryPage categoryId={parseInt(params.id)} />
        ) : (
          <HomePage onNavigateToCatalog={() => navigate('catalog')} />
        );
      case 'admin':
        return (
          <ProtectedRoute roles={['admin', 'editor', 'moderator']}>
            <AdminPage />
          </ProtectedRoute>
        );
      default:
        return <HomePage onNavigateToCatalog={() => navigate('catalog')} />;
    }
  };

  const isLoginPage = route === 'login' || route === 'register' || route === 'forgot-password';
  const isAdminPage = route === 'admin';

  return (
    <div className="flex flex-col min-h-screen relative">
      {!isLoginPage && !isAdminPage && (
        <Header
          currentRoute={route}
          onNavigate={navigate}
          onLogoClick={handleNavigateToHome}
        />
      )}
      <main className="flex-1 relative z-10">{renderPage()}</main>
      {!isLoginPage && !isAdminPage && <Footer onNavigate={navigate} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
