import { Store, WordBook } from '../store';
import { Router } from '../router';

export class WordsPage {
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

    this.container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">单词学习</h1>
        <p class="content-desc">选择一个词库开始练习，通过打字加深对单词的记忆</p>
      </div>
      <div class="content-body">
        <div class="list-container fade-in">
          <div class="list-header">
            <span class="list-title">词库列表</span>
            <span style="font-size: 13px; color: var(--text-muted);">共 ${wordBooks.length} 个词库</span>
          </div>
          ${wordBooks.map(book => this.renderBookItem(book)).join('')}
        </div>

        <div style="margin-top: 24px; padding: 20px; background: var(--bg-secondary); border-radius: 8px;">
          <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px;">
            <i class="bi bi-info-circle" style="margin-right: 8px;"></i>
            学习说明
          </h3>
          <ul style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; padding-left: 20px; margin: 0;">
            <li>选择词库后，系统会显示单词和释义</li>
            <li>根据显示的内容，在输入框中正确输入单词</li>
            <li>输入正确后自动跳转到下一个单词</li>
            <li>支持随时暂停和继续学习</li>
          </ul>
        </div>
      </div>
    `;

    // 绑定点击事件
    this.container.querySelectorAll('.list-item').forEach(item => {
      item.addEventListener('click', () => {
        const bookId = item.getAttribute('data-id');
        if (bookId) {
          this.router.navigate('words-practice', { bookId });
        }
      });
    });
  }

  private renderBookItem(book: WordBook): string {
    const progressPercent = book.progress || 0;
    
    return `
      <div class="list-item" data-id="${book.id}">
        <div class="list-item-left">
          <div class="list-item-icon" style="background-color: rgba(0, 120, 212, 0.1); color: #0078d4;">
            <i class="bi bi-book"></i>
          </div>
          <div class="list-item-info">
            <div class="list-item-name">${book.name}</div>
            <div class="list-item-meta">${book.description}</div>
          </div>
        </div>
        <div class="list-item-right">
          <div style="text-align: right;">
            <div class="list-item-progress">${book.words.length} 词</div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <div class="progress-bar" style="width: 80px; height: 4px;">
                <div class="progress-fill" style="width: ${progressPercent}%;"></div>
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
