import { useState, useCallback, useEffect } from 'react';
import { Route, RouteState } from '../types/routing';

const parseHash = (): { route: Route; params: Record<string, string> } => {
  const hash = window.location.hash.slice(1);
  const [path, queryString] = hash.split('?');
  
  const params: Record<string, string> = {};
  if (queryString) {
    queryString.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });
  }

  if (path.startsWith('terms/')) {
    const id = path.split('/')[1];
    return { route: 'terms', params: { id } };
  }
  
  if (path.startsWith('categories/')) {
    const id = path.split('/')[1];
    return { route: 'categories', params: { id } };
  }

  const validRoutes: Route[] = [
    'home', 'catalog', 'about', 'api', 'contact', 'login', 'register',
    'forgot-password', 'profile', 'favorites', 'suggest', 'search', 'admin'
  ];

  if (path && validRoutes.includes(path as Route)) {
    return { route: path as Route, params };
  }

  return { route: 'home', params: {} };
};

export const useRouter = () => {
  const [routeState, setRouteState] = useState<RouteState>(() => {
    const parsed = parseHash();
    return { currentRoute: parsed.route, params: parsed.params };
  });

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash();
      setRouteState({ currentRoute: parsed.route, params: parsed.params });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((newRoute: Route, params?: Record<string, string>) => {
    let hash = newRoute;
    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      hash = `${newRoute}?${queryString}`;
    }
    window.location.hash = hash;
    setRouteState({ currentRoute: newRoute, params: params || {} });
  }, []);

  return { 
    route: routeState.currentRoute, 
    params: routeState.params || {},
    navigate 
  };
};

