import { Store, PoetryBook } from '../store';
import { Router } from '../router';

export class PoetryPage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;

  constructor(container: HTMLElement, store: Store, router: Router) {
    this.container = container;
    this.store = store;
    this.router = router;
  }

  render() {
    const poetryBooks = this.store.getPoetryBooks();

    this.container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">古诗背诵</h1>
        <p class="content-desc">选择诗集开始默写练习，通过打字加深对古诗词的记忆</p>
      </div>
      <div class="content-body">
        <div class="list-container fade-in">
          <div class="list-header">
            <span class="list-title">诗集列表</span>
            <span style="font-size: 13px; color: var(--text-muted);">共 ${poetryBooks.length} 个诗集</span>
          </div>
          ${poetryBooks.map(book => this.renderBookItem(book)).join('')}
        </div>

        <div style="margin-top: 24px; padding: 20px; background: var(--bg-secondary); border-radius: 8px;">
          <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px;">
            <i class="bi bi-info-circle" style="margin-right: 8px;"></i>
            学习说明
          </h3>
          <ul style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; padding-left: 20px; margin: 0;">
            <li>选择诗集后，系统会显示古诗的标题和作者</li>
            <li>逐行输入古诗内容，包括标点符号</li>
            <li>每行输入正确后自动跳转到下一行</li>
            <li>完成整首诗后进入下一首</li>
          </ul>
        </div>
      </div>
    `;

    // 绑定点击事件
    this.container.querySelectorAll('.list-item').forEach(item => {
      item.addEventListener('click', () => {
        const bookId = item.getAttribute('data-id');
        if (bookId) {
          this.router.navigate('poetry-practice', { bookId });
        }
      });
    });
  }

  private renderBookItem(book: PoetryBook): string {
    const progressPercent = book.progress || 0;
    
    return `
      <div class="list-item" data-id="${book.id}">
        <div class="list-item-left">
          <div class="list-item-icon" style="background-color: rgba(156, 39, 176, 0.1); color: #9c27b0;">
            <i class="bi bi-feather"></i>
          </div>
          <div class="list-item-info">
            <div class="list-item-name">${book.name}</div>
            <div class="list-item-meta">${book.description}</div>
          </div>
        </div>
        <div class="list-item-right">
          <div style="text-align: right;">
            <div class="list-item-progress">${book.poems.length} 首</div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <div class="progress-bar" style="width: 80px; height: 4px;">
                <div class="progress-fill" style="width: ${progressPercent}%; background-color: #9c27b0;"></div>
              </div>
              <span style="font-size: 12px; color: var(--text-muted);">${progressPercent}%</span>
            </div>
          </div>
          <i class="bi bi-chevron-right" style="color: var(--text-muted); margin-left: 12px;"></i>
        </div>
      </div>
    `;
  }
}
