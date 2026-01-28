import { Store } from './store';
import { ThemeManager } from './theme';
import { Router, Route } from './router';
import { HomePage } from './pages/home';
import { WordsPage } from './pages/words';
import { WordsPracticePage } from './pages/words-practice';
import { PoetryPage } from './pages/poetry';
import { PoetryPracticePage } from './pages/poetry-practice';
import { CustomPage } from './pages/custom';
import { CustomPracticePage } from './pages/custom-practice';
import { SettingsPage } from './pages/settings';

export class App {
  private store: Store;
  private themeManager: ThemeManager;
  private router: Router;

  constructor(store: Store, themeManager: ThemeManager, router: Router) {
    this.store = store;
    this.themeManager = themeManager;
    this.router = router;

    // 监听路由变化
    this.router.onRouteChange(() => {
      this.renderContent();
    });
  }

  render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <!-- 标题栏 -->
      <div class="titlebar">
        <div class="titlebar-left">
          <div class="titlebar-icon">
            <i class="bi bi-keyboard"></i>
          </div>
          <span class="titlebar-title">Type2Learn</span>
        </div>
        <div class="titlebar-center"></div>
        <div class="titlebar-right">
          <button class="titlebar-btn theme-btn" id="btn-theme" title="切换主题">
            <i class="${this.themeManager.getThemeIcon()}"></i>
          </button>
          <button class="titlebar-btn settings-btn" id="btn-settings" title="设置">
            <i class="bi bi-gear"></i>
          </button>
          <button class="titlebar-btn" id="btn-minimize" title="最小化">
            <i class="bi bi-dash"></i>
          </button>
          <button class="titlebar-btn" id="btn-maximize" title="最大化">
            <i class="bi bi-square"></i>
          </button>
          <button class="titlebar-btn close" id="btn-close" title="关闭">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <!-- 主内容 -->
      <div class="main-container">
        <!-- 侧边栏 -->
        <div class="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-title">Type2Learn</div>
            <div class="sidebar-subtitle">通过打字学习一切</div>
          </div>
          <nav class="sidebar-nav">
            <div class="nav-group">
              <div class="nav-group-title">学习模块</div>
              <div class="nav-item ${this.router.getCurrentRoute() === 'home' ? 'active' : ''}" data-route="home">
                <i class="bi bi-house"></i>
                <span>首页</span>
              </div>
              <div class="nav-item ${this.router.getCurrentRoute() === 'words' || this.router.getCurrentRoute() === 'words-practice' ? 'active' : ''}" data-route="words">
                <i class="bi bi-book"></i>
                <span>单词学习</span>
              </div>
              <div class="nav-item ${this.router.getCurrentRoute() === 'poetry' || this.router.getCurrentRoute() === 'poetry-practice' ? 'active' : ''}" data-route="poetry">
                <i class="bi bi-feather"></i>
                <span>古诗背诵</span>
              </div>
              <div class="nav-item ${this.router.getCurrentRoute() === 'custom' || this.router.getCurrentRoute() === 'custom-practice' ? 'active' : ''}" data-route="custom">
                <i class="bi bi-collection"></i>
                <span>自定义默写</span>
              </div>
            </div>
            <div class="nav-group">
              <div class="nav-group-title">其他</div>
              <div class="nav-item ${this.router.getCurrentRoute() === 'settings' ? 'active' : ''}" data-route="settings">
                <i class="bi bi-gear"></i>
                <span>设置</span>
              </div>
            </div>
          </nav>
        </div>

        <!-- 内容区域 -->
        <div class="content-area" id="content-area">
          <!-- 动态内容 -->
        </div>
      </div>
    `;

    // 绑定事件
    this.bindEvents();

    // 渲染初始内容
    this.renderContent();
  }

  private bindEvents() {
    // 主题切换按钮
    document.getElementById('btn-theme')?.addEventListener('click', () => {
      this.themeManager.cycleTheme();
    });

    // 设置按钮
    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.router.navigate('settings');
    });

    // 导航点击
    document.querySelectorAll('.nav-item[data-route]').forEach(item => {
      item.addEventListener('click', () => {
        const route = item.getAttribute('data-route') as Route;
        if (route) {
          this.router.navigate(route);
        }
      });
    });
  }

  private renderContent() {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    // 更新侧边栏激活状态
    document.querySelectorAll('.nav-item').forEach(item => {
      const route = item.getAttribute('data-route');
      const currentRoute = this.router.getCurrentRoute();
      
      // 处理子路由
      let isActive = route === currentRoute;
      if (route === 'words' && currentRoute === 'words-practice') isActive = true;
      if (route === 'poetry' && currentRoute === 'poetry-practice') isActive = true;
      if (route === 'custom' && currentRoute === 'custom-practice') isActive = true;
      
      item.classList.toggle('active', isActive);
    });

    // 根据路由渲染内容
    const route = this.router.getCurrentRoute();
    const params = this.router.getParams();

    switch (route) {
      case 'home':
        new HomePage(contentArea, this.store, this.router).render();
        break;
      case 'words':
        new WordsPage(contentArea, this.store, this.router).render();
        break;
      case 'words-practice':
        new WordsPracticePage(contentArea, this.store, this.router, params).render();
        break;
      case 'poetry':
        new PoetryPage(contentArea, this.store, this.router).render();
        break;
      case 'poetry-practice':
        new PoetryPracticePage(contentArea, this.store, this.router, params).render();
        break;
      case 'custom':
        new CustomPage(contentArea, this.store, this.router).render();
        break;
      case 'custom-practice':
        new CustomPracticePage(contentArea, this.store, this.router, params).render();
        break;
      case 'settings':
        new SettingsPage(contentArea, this.store, this.router, this.themeManager).render();
        break;
      default:
        new HomePage(contentArea, this.store, this.router).render();
    }
  }
}
