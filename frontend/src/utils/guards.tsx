import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  roles?: string[];
  children: React.ReactElement;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roles,
  children,
  redirectTo = '/#login',
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    window.location.href = redirectTo;
    return null;
  }

  if (roles && user && !roles.includes(user.role)) {
    window.location.href = '/#home';
    return null;
  }

  return children;
};
