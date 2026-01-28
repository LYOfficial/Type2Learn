// 路由类型定义
export type Route = 
  | 'home' 
  | 'words' 
  | 'words-practice'
  | 'poetry' 
  | 'poetry-practice'
  | 'custom' 
  | 'custom-practice'
  | 'settings';

export interface RouteParams {
  [key: string]: string | number;
}

export class Router {
  private currentRoute: Route = 'home';
  private params: RouteParams = {};
  private listeners: ((route: Route, params: RouteParams) => void)[] = [];

  getCurrentRoute(): Route {
    return this.currentRoute;
  }

  getParams(): RouteParams {
    return this.params;
  }

  navigate(route: Route, params: RouteParams = {}) {
    this.currentRoute = route;
    this.params = params;
    this.notifyListeners();
  }

  goBack() {
    // 简单的返回逻辑
    if (this.currentRoute.includes('practice')) {
      const baseRoute = this.currentRoute.replace('-practice', '') as Route;
      this.navigate(baseRoute);
    } else if (this.currentRoute !== 'home') {
      this.navigate('home');
    }
  }

  onRouteChange(callback: (route: Route, params: RouteParams) => void) {
    this.listeners.push(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentRoute, this.params));
  }
}
