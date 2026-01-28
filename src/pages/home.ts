import { Store } from '../store';
import { Router } from '../router';

export class HomePage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;

  constructor(container: HTMLElement, store: Store, router: Router) {
    this.container = container;
    this.store = store;
    this.router = router;
  }

  render() {
    const wordBooks = this.store.getWordBooks();
    const poetryBooks = this.store.getPoetryBooks();
    const customBooks = this.store.getCustomBooks();

    const totalWords = wordBooks.reduce((acc, book) => acc + book.words.length, 0);
    const totalPoems = poetryBooks.reduce((acc, book) => acc + book.poems.length, 0);
    const totalCustom = customBooks.reduce((acc, book) => acc + book.items.length, 0);

    this.container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">欢迎使用 Type2Learn</h1>
        <p class="content-desc">通过打字学习一切，让学习更高效、更有趣</p>
      </div>
      <div class="content-body">
        <div class="card-grid fade-in">
          <div class="card" data-route="words">
            <div class="card-icon words">
              <i class="bi bi-book"></i>
            </div>
            <h3 class="card-title">单词学习</h3>
            <p class="card-desc">通过打字练习记忆英语单词，支持 CET-4、CET-6、雅思等多种词库，让背单词更轻松。</p>
            <div style="margin-top: 12px; font-size: 13px; color: var(--text-muted);">
              <i class="bi bi-collection"></i> ${wordBooks.length} 个词库 · ${totalWords} 个单词
            </div>
          </div>
          
          <div class="card" data-route="poetry">
            <div class="card-icon poetry">
              <i class="bi bi-feather"></i>
            </div>
            <h3 class="card-title">古诗背诵</h3>
            <p class="card-desc">打字默写古诗词，边打边记，轻松掌握唐诗宋词，传承中华文化精髓。</p>
            <div style="margin-top: 12px; font-size: 13px; color: var(--text-muted);">
              <i class="bi bi-collection"></i> ${poetryBooks.length} 个诗集 · ${totalPoems} 首诗词
            </div>
          </div>
          
          <div class="card" data-route="custom">
            <div class="card-icon custom">
              <i class="bi bi-collection"></i>
            </div>
            <h3 class="card-title">自定义默写</h3>
            <p class="card-desc">上传自己的默写库，可以是课文、公式、代码片段等任何需要记忆的内容。</p>
            <div style="margin-top: 12px; font-size: 13px; color: var(--text-muted);">
              <i class="bi bi-collection"></i> ${customBooks.length} 个自定义库 · ${totalCustom} 条内容
            </div>
          </div>
        </div>

        <div style="margin-top: 40px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: var(--text-primary);">
            <i class="bi bi-clock-history" style="margin-right: 8px;"></i>
            最近学习
          </h2>
          ${this.renderRecentActivity()}
        </div>

        <div style="margin-top: 40px;">
          <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: var(--text-primary);">
            <i class="bi bi-lightbulb" style="margin-right: 8px;"></i>
            使用技巧
          </h2>
          <div class="card-grid">
            <div class="card" style="cursor: default;">
              <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">🎯 专注练习</h4>
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                每次练习专注于一个小目标，持续的小进步会累积成大成就。
              </p>
            </div>
            <div class="card" style="cursor: default;">
              <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">⌨️ 盲打练习</h4>
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                尽量不看键盘打字，这样既能提高打字速度，也能加深记忆。
              </p>
            </div>
            <div class="card" style="cursor: default;">
              <h4 style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">🔄 定期复习</h4>
              <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                遵循遗忘曲线规律，及时复习已学内容，巩固记忆效果。
              </p>
            </div>
          </div>
        </div>
      </div>
    `;

    // 绑定卡片点击事件
    this.container.querySelectorAll('.card[data-route]').forEach(card => {
      card.addEventListener('click', () => {
        const route = card.getAttribute('data-route');
        if (route) {
          this.router.navigate(route as any);
        }
      });
    });
  }

  private renderRecentActivity(): string {
    const allBooks = [
      ...this.store.getWordBooks().map(b => ({ ...b, type: 'word' as const })),
      ...this.store.getPoetryBooks().map(b => ({ ...b, type: 'poetry' as const })),
      ...this.store.getCustomBooks().map(b => ({ ...b, type: 'custom' as const }))
    ];

    const recentBooks = allBooks
      .filter(b => b.lastPractice)
      .sort((a, b) => (b.lastPractice || 0) - (a.lastPractice || 0))
      .slice(0, 5);

    if (recentBooks.length === 0) {
      return `
        <div class="empty-state" style="padding: 40px;">
          <i class="bi bi-inbox empty-state-icon" style="font-size: 48px;"></i>
          <p class="empty-state-title">暂无学习记录</p>
          <p class="empty-state-desc">选择一个模块开始你的学习之旅吧！</p>
        </div>
      `;
    }

    return `
      <div class="list-container">
        ${recentBooks.map(book => {
          const icon = book.type === 'word' ? 'bi-book' : book.type === 'poetry' ? 'bi-feather' : 'bi-collection';
          const color = book.type === 'word' ? '#0078d4' : book.type === 'poetry' ? '#9c27b0' : '#28a745';
          const timeAgo = this.getTimeAgo(book.lastPractice || 0);
          
          return `
            <div class="list-item" data-type="${book.type}" data-id="${book.id}">
              <div class="list-item-left">
                <div class="list-item-icon" style="background-color: ${color}20; color: ${color};">
                  <i class="bi ${icon}"></i>
                </div>
                <div class="list-item-info">
                  <div class="list-item-name">${book.name}</div>
                  <div class="list-item-meta">${timeAgo}</div>
                </div>
              </div>
              <div class="list-item-right">
                <span class="list-item-progress">${book.progress}%</span>
                <i class="bi bi-chevron-right" style="color: var(--text-muted);"></i>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  private getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 30) return `${days} 天前`;
    return '很久以前';
  }
}
