// 主题模式类型
export type ThemeMode = 'light' | 'dark' | 'system';

export class ThemeManager {
  private currentMode: ThemeMode = 'system';
  private systemTheme: 'light' | 'dark' = 'light';

  constructor() {
    // 获取系统主题
    this.systemTheme = this.getSystemTheme();
  }

  init() {
    // 从本地存储加载主题设置
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
      this.currentMode = savedMode;
    }

    // 应用主题
    this.applyTheme();

    // 监听系统主题变化
    this.listenToSystemTheme();
  }

  // 获取系统主题
  private getSystemTheme(): 'light' | 'dark' {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // 监听系统主题变化
  private listenToSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.systemTheme = e.matches ? 'dark' : 'light';
      if (this.currentMode === 'system') {
        this.applyTheme();
      }
    });
  }

  // 应用主题
  applyTheme() {
    const effectiveTheme = this.getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    this.updateThemeButton();
  }

  // 获取实际生效的主题
  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentMode === 'system') {
      return this.systemTheme;
    }
    return this.currentMode;
  }

  // 获取当前模式
  getCurrentMode(): ThemeMode {
    return this.currentMode;
  }

  // 设置主题模式
  setMode(mode: ThemeMode) {
    this.currentMode = mode;
    localStorage.setItem('theme-mode', mode);
    this.applyTheme();
  }

  // 切换主题（循环切换：light -> dark -> system -> light）
  cycleTheme() {
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.setMode(modes[nextIndex]);
  }

  // 更新主题按钮图标
  updateThemeButton() {
    const btn = document.getElementById('btn-theme');
    if (!btn) return;

    const icon = btn.querySelector('i');
    if (!icon) return;

    switch (this.currentMode) {
      case 'light':
        icon.className = 'bi bi-sun';
        btn.title = '当前: 白天模式';
        break;
      case 'dark':
        icon.className = 'bi bi-moon';
        btn.title = '当前: 黑夜模式';
        break;
      case 'system':
        icon.className = 'bi bi-circle-half';
        btn.title = '当前: 跟随系统';
        break;
    }
  }

  // 获取主题图标类名
  getThemeIcon(): string {
    switch (this.currentMode) {
      case 'light':
        return 'bi bi-sun';
      case 'dark':
        return 'bi bi-moon';
      case 'system':
        return 'bi bi-circle-half';
    }
  }
}
