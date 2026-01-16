export type Route = 
  | 'home'
  | 'catalog'
  | 'about'
  | 'api'
  | 'contact'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'profile'
  | 'favorites'
  | 'suggest'
  | 'search'
  | 'terms'
  | 'categories'
  | 'admin';

export interface RouteState {
  currentRoute: Route;
  params?: Record<string, string>;
}

