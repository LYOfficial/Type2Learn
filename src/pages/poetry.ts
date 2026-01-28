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

    // 计算统计数据
    const totalPoems = poetryBooks.reduce((acc, book) => acc + book.poems.length, 0);
    const completedBooks = poetryBooks.filter(book => book.progress === 100).length;

    this.container.innerHTML = `
      <div class="poetry-page-v2">
        <!-- 顶部标题区域 -->
        <div class="poetry-header">
          <div class="header-content">
            <h1><i class="bi bi-feather"></i> 古文背诵</h1>
            <p>选择诗集，通过打字加深对古诗词的记忆</p>
          </div>
        </div>

        <!-- 主内容区域 -->
        <div class="poetry-main">
          <!-- 左侧：学习统计 -->
          <div class="poetry-left">
            <!-- 统计卡片 -->
            <div class="poetry-stats-card">
              <div class="stats-header">
                <i class="bi bi-bar-chart-fill"></i>
                <span>学习概览</span>
              </div>
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-number">${poetryBooks.length}</div>
                  <div class="stat-text">诗集总数</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${totalPoems}</div>
                  <div class="stat-text">诗词总数</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${completedBooks}</div>
                  <div class="stat-text">已完成</div>
                </div>
              </div>
            </div>

            <!-- 学习说明 -->
            <div class="poetry-tips-card">
              <div class="tips-header">
                <i class="bi bi-lightbulb"></i>
                <span>学习说明</span>
              </div>
              <ul class="tips-list">
                <li><i class="bi bi-check2"></i> 选择诗集后，系统会显示古诗的标题和作者</li>
                <li><i class="bi bi-check2"></i> 逐行输入古诗内容，包括标点符号</li>
                <li><i class="bi bi-check2"></i> 每行输入正确后自动跳转到下一行</li>
                <li><i class="bi bi-check2"></i> 完成整首诗后进入下一首</li>
              </ul>
            </div>
          </div>

          <!-- 右侧：诗集列表 -->
          <div class="poetry-right">
            <div class="poetry-section">
              <div class="section-title-bar">
                <h3><i class="bi bi-journal-richtext"></i> 诗集列表</h3>
                <span class="section-hint">共 ${poetryBooks.length} 个诗集</span>
              </div>
              <div class="poetry-book-list">
                ${poetryBooks.map(book => this.renderBookItem(book)).join('')}
              </div>
            </div>

            <!-- 导入自定义古文 -->
            <div class="poetry-section import-section">
              <div class="import-card" id="btn-import-poetry">
                <i class="bi bi-file-earmark-text"></i>
                <div class="import-info">
                  <h4>导入自定义古文</h4>
                  <p>支持 TXT 格式，添加自己的古诗词</p>
                </div>
                <i class="bi bi-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private bindEvents() {
    // 绑定诗集点击事件
    this.container.querySelectorAll('.poetry-book-item').forEach(item => {
      item.addEventListener('click', () => {
        const bookId = item.getAttribute('data-id');
        if (bookId) {
          this.router.navigate('poetry-practice', { bookId });
        }
      });
    });

    // 导入按钮
    const importBtn = this.container.querySelector('#btn-import-poetry');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        console.log('Import poetry');
      });
    }
  }

  private renderBookItem(book: PoetryBook): string {
    const progressPercent = book.progress || 0;
    
    return `
      <div class="poetry-book-item" data-id="${book.id}">
        <div class="book-icon icon-purple">
          <i class="bi bi-feather"></i>
        </div>
        <div class="book-info">
          <h4>${book.name}</h4>
          <p>${book.description}</p>
          <div class="book-meta">
            <span><i class="bi bi-collection"></i> ${book.poems.length} 首</span>
            ${progressPercent > 0 ? `<span><i class="bi bi-check-circle"></i> ${progressPercent}%</span>` : ''}
          </div>
        </div>
        <div class="book-progress-indicator">
          <div class="mini-progress">
            <div class="mini-progress-fill" style="width: ${progressPercent}%"></div>
          </div>
          <i class="bi bi-chevron-right"></i>
        </div>
      </div>
    `;
  }
}
