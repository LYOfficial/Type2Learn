import { Store } from '../store';
import { Router } from '../router';
import { ThemeManager, ThemeMode } from '../theme';

export class SettingsPage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;
  private themeManager: ThemeManager;

  constructor(container: HTMLElement, store: Store, router: Router, themeManager: ThemeManager) {
    this.container = container;
    this.store = store;
    this.router = router;
    this.themeManager = themeManager;
  }

  render() {
    const settings = this.store.getSettings();
    const currentTheme = this.themeManager.getCurrentMode();

    this.container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">设置</h1>
        <p class="content-desc">自定义你的学习体验</p>
      </div>
      <div class="content-body">
        <div class="settings-section fade-in">
          <h3 class="settings-section-title">
            <i class="bi bi-palette" style="margin-right: 8px;"></i>
            外观设置
          </h3>
          
          <div class="settings-item">
            <div>
              <div class="settings-item-label">主题模式</div>
              <div class="settings-item-desc">选择你喜欢的界面主题</div>
            </div>
            <div class="theme-selector">
              <div class="theme-option ${currentTheme === 'light' ? 'active' : ''}" data-theme="light">
                <i class="bi bi-sun"></i>
                <span>白天</span>
              </div>
              <div class="theme-option ${currentTheme === 'dark' ? 'active' : ''}" data-theme="dark">
                <i class="bi bi-moon"></i>
                <span>黑夜</span>
              </div>
              <div class="theme-option ${currentTheme === 'system' ? 'active' : ''}" data-theme="system">
                <i class="bi bi-circle-half"></i>
                <span>跟随系统</span>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">
            <i class="bi bi-gear" style="margin-right: 8px;"></i>
            练习设置
          </h3>
          
          <div class="settings-item">
            <div>
              <div class="settings-item-label">音效</div>
              <div class="settings-item-desc">打字正确/错误时播放音效</div>
            </div>
            <div class="toggle-switch ${settings.soundEnabled ? 'active' : ''}" id="toggle-sound"></div>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">自动播放发音</div>
              <div class="settings-item-desc">打开新单词时自动播放发音</div>
            </div>
            <div class="toggle-switch ${settings.autoPlayAudio !== false ? 'active' : ''}" id="toggle-auto-play-audio"></div>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">自动下一个</div>
              <div class="settings-item-desc">输入正确后自动跳转到下一个</div>
            </div>
            <div class="toggle-switch ${settings.autoNext ? 'active' : ''}" id="toggle-auto-next"></div>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">显示提示</div>
              <div class="settings-item-desc">练习时显示提示按钮</div>
            </div>
            <div class="toggle-switch ${settings.showHint ? 'active' : ''}" id="toggle-hint"></div>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">单词信息切换方式</div>
              <div class="settings-item-desc">切换翻译/音标/例句等标签的方式</div>
            </div>
            <select id="tab-switch-key" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--input-bg); color: var(--text-primary); font-size: 14px;">
              <option value="both" ${settings.tabSwitchKey === 'both' ? 'selected' : ''}>上下键 + 滚轮</option>
              <option value="arrow" ${settings.tabSwitchKey === 'arrow' ? 'selected' : ''}>仅上下键</option>
              <option value="scroll" ${settings.tabSwitchKey === 'scroll' ? 'selected' : ''}>仅滚轮</option>
              <option value="none" ${settings.tabSwitchKey === 'none' ? 'selected' : ''}>仅鼠标点击</option>
            </select>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">每日新词数量</div>
              <div class="settings-item-desc">默认每天学习的新单词数量</div>
            </div>
            <select id="per-day-study" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--input-bg); color: var(--text-primary); font-size: 14px;">
              <option value="20" ${settings.perDayStudyNumber === 20 ? 'selected' : ''}>20</option>
              <option value="30" ${settings.perDayStudyNumber === 30 ? 'selected' : ''}>30</option>
              <option value="40" ${settings.perDayStudyNumber === 40 || !settings.perDayStudyNumber ? 'selected' : ''}>40</option>
              <option value="50" ${settings.perDayStudyNumber === 50 ? 'selected' : ''}>50</option>
              <option value="80" ${settings.perDayStudyNumber === 80 ? 'selected' : ''}>80</option>
              <option value="100" ${settings.perDayStudyNumber === 100 ? 'selected' : ''}>100</option>
            </select>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">每日复习数量</div>
              <div class="settings-item-desc">默认每天复习的单词数量</div>
            </div>
            <select id="per-day-review" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--input-bg); color: var(--text-primary); font-size: 14px;">
              <option value="20" ${settings.perDayReviewNumber === 20 ? 'selected' : ''}>20</option>
              <option value="30" ${settings.perDayReviewNumber === 30 ? 'selected' : ''}>30</option>
              <option value="40" ${settings.perDayReviewNumber === 40 || !settings.perDayReviewNumber ? 'selected' : ''}>40</option>
              <option value="50" ${settings.perDayReviewNumber === 50 ? 'selected' : ''}>50</option>
              <option value="80" ${settings.perDayReviewNumber === 80 ? 'selected' : ''}>80</option>
              <option value="100" ${settings.perDayReviewNumber === 100 ? 'selected' : ''}>100</option>
            </select>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">每组练习数量</div>
              <div class="settings-item-desc">每次练习的单词/句子数量</div>
            </div>
            <select id="practice-count" style="padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; background: var(--input-bg); color: var(--text-primary); font-size: 14px;">
              <option value="10" ${settings.practiceCount === 10 ? 'selected' : ''}>10</option>
              <option value="20" ${settings.practiceCount === 20 ? 'selected' : ''}>20</option>
              <option value="30" ${settings.practiceCount === 30 ? 'selected' : ''}>30</option>
              <option value="50" ${settings.practiceCount === 50 ? 'selected' : ''}>50</option>
              <option value="100" ${settings.practiceCount === 100 ? 'selected' : ''}>100</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">
            <i class="bi bi-database" style="margin-right: 8px;"></i>
            数据管理
          </h3>
          
          <div class="settings-item">
            <div>
              <div class="settings-item-label">导出数据</div>
              <div class="settings-item-desc">导出所有学习数据和进度</div>
            </div>
            <button class="btn btn-secondary" id="btn-export">
              <i class="bi bi-download"></i> 导出
            </button>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">导入数据</div>
              <div class="settings-item-desc">从备份文件恢复数据</div>
            </div>
            <button class="btn btn-secondary" id="btn-import">
              <i class="bi bi-upload"></i> 导入
            </button>
          </div>

          <div class="settings-item">
            <div>
              <div class="settings-item-label">清除所有数据</div>
              <div class="settings-item-desc" style="color: var(--error-color);">清除所有学习记录和进度，此操作不可恢复</div>
            </div>
            <button class="btn btn-secondary" id="btn-clear" style="color: var(--error-color);">
              <i class="bi bi-trash"></i> 清除
            </button>
          </div>
        </div>

        <div class="settings-section">
          <h3 class="settings-section-title">
            <i class="bi bi-info-circle" style="margin-right: 8px;"></i>
            关于
          </h3>
          <div class="settings-item" style="flex-direction: column; align-items: flex-start; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #0078d4, #106ebe); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <img src="/img/type2learn.png" alt="Type2Learn" style="width: 32px; height: 32px; display: block;" />
              </div>
              <div>
                <div style="font-size: 18px; font-weight: 600;">Type2Learn</div>
                <div style="font-size: 13px; color: var(--text-muted);">版本 1.0.0</div>
              </div>
            </div>
            <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0;">
              Type2Learn 是一款通过打字学习的工具，支持单词学习、古诗背诵和自定义默写。
              本项目参考了 <a href="https://github.com/zyronon/typing-word" target="_blank" style="color: var(--accent-color);">TypeWords</a> 开源项目。
            </p>
          </div>
        </div>

        <!-- 隐藏的文件输入 -->
        <input type="file" id="import-file" accept=".json" style="display: none;">
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    // 主题切换
    document.querySelectorAll('.theme-option').forEach(option => {
      option.addEventListener('click', () => {
        const theme = option.getAttribute('data-theme') as ThemeMode;
        if (theme) {
          this.themeManager.setMode(theme);
          // 更新选中状态
          document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
          option.classList.add('active');
        }
      });
    });

    // 音效开关
    document.getElementById('toggle-sound')?.addEventListener('click', (e) => {
      const toggle = e.currentTarget as HTMLElement;
      toggle.classList.toggle('active');
      this.store.updateSettings({ soundEnabled: toggle.classList.contains('active') });
    });

    // 自动下一个
    document.getElementById('toggle-auto-next')?.addEventListener('click', (e) => {
      const toggle = e.currentTarget as HTMLElement;
      toggle.classList.toggle('active');
      this.store.updateSettings({ autoNext: toggle.classList.contains('active') });
    });

    // 显示提示
    document.getElementById('toggle-hint')?.addEventListener('click', (e) => {
      const toggle = e.currentTarget as HTMLElement;
      toggle.classList.toggle('active');
      this.store.updateSettings({ showHint: toggle.classList.contains('active') });
    });

    // 自动播放发音
    document.getElementById('toggle-auto-play-audio')?.addEventListener('click', (e) => {
      const toggle = e.currentTarget as HTMLElement;
      toggle.classList.toggle('active');
      this.store.updateSettings({ autoPlayAudio: toggle.classList.contains('active') });
    });

    // Tab切换方式
    document.getElementById('tab-switch-key')?.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value;
      this.store.updateSettings({ tabSwitchKey: value });
    });

    // 每日新词数量
    document.getElementById('per-day-study')?.addEventListener('change', (e) => {
      const count = parseInt((e.target as HTMLSelectElement).value);
      this.store.updateSettings({ perDayStudyNumber: count });
    });

    // 每日复习数量
    document.getElementById('per-day-review')?.addEventListener('change', (e) => {
      const count = parseInt((e.target as HTMLSelectElement).value);
      this.store.updateSettings({ perDayReviewNumber: count });
    });

    // 练习数量
    document.getElementById('practice-count')?.addEventListener('change', (e) => {
      const count = parseInt((e.target as HTMLSelectElement).value);
      this.store.updateSettings({ practiceCount: count });
    });

    // 导出数据
    document.getElementById('btn-export')?.addEventListener('click', () => {
      const data = localStorage.getItem('type2learn-state');
      if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `type2learn-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });

    // 导入数据
    document.getElementById('btn-import')?.addEventListener('click', () => {
      document.getElementById('import-file')?.click();
    });

    document.getElementById('import-file')?.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          localStorage.setItem('type2learn-state', JSON.stringify(data));
          alert('数据导入成功，页面将刷新');
          window.location.reload();
        } catch (error) {
          alert('导入失败，请检查文件格式');
        }
      }
    });

    // 清除数据
    document.getElementById('btn-clear')?.addEventListener('click', () => {
      if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
        if (confirm('再次确认：清除后所有学习记录和自定义内容都将丢失，是否继续？')) {
          localStorage.removeItem('type2learn-state');
          alert('数据已清除，页面将刷新');
          window.location.reload();
        }
      }
    });
  }
}
