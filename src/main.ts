import { getCurrentWindow } from '@tauri-apps/api/window';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { App } from './app';
import { ThemeManager } from './theme';
import { Router } from './router';
import { Store } from './store';

// 初始化应用
async function init() {
  // 初始化数据存储
  const store = new Store();
  await store.init();

  // 初始化主题管理器
  const themeManager = new ThemeManager();
  themeManager.init();

  // 初始化路由
  const router = new Router();

  // 初始化应用
  const app = new App(store, themeManager, router);
  app.render();

  // 设置窗口控制
  setupWindowControls();
}

// 设置窗口控制按钮
async function setupWindowControls() {
  const appWindow = getCurrentWindow();
  
  // 监听最小化按钮
  document.getElementById('btn-minimize')?.addEventListener('click', async () => {
    await appWindow.minimize();
  });

  // 监听最大化/还原按钮
  document.getElementById('btn-maximize')?.addEventListener('click', async () => {
    const isMaximized = await appWindow.isMaximized();
    if (isMaximized) {
      await appWindow.unmaximize();
    } else {
      await appWindow.maximize();
    }
    updateMaximizeButton();
  });

  // 监听关闭按钮
  document.getElementById('btn-close')?.addEventListener('click', async () => {
    await appWindow.close();
  });

  // 设置标题栏拖动
  document.querySelector('.titlebar')?.addEventListener('mousedown', async (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.titlebar-right')) {
      await appWindow.startDragging();
    }
  });

  // 监听窗口大小变化更新按钮状态
  appWindow.onResized(updateMaximizeButton);
}

// 更新最大化按钮图标
async function updateMaximizeButton() {
  const appWindow = getCurrentWindow();
  const isMaximized = await appWindow.isMaximized();
  const btn = document.getElementById('btn-maximize');
  if (btn) {
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = isMaximized ? 'bi bi-window-stack' : 'bi bi-square';
    }
  }
}

// 启动应用
init().catch((error) => {
  console.error('Failed to initialize app:', error);
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `<div style="padding: 20px; color: red;">应用初始化失败: ${error.message}</div>`;
  }
});
