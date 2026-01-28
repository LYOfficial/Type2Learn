import { Store, CustomBook, CustomItem } from '../store';
import { Router } from '../router';

export class CustomPage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;

  constructor(container: HTMLElement, store: Store, router: Router) {
    this.container = container;
    this.store = store;
    this.router = router;
  }

  render() {
    const customBooks = this.store.getCustomBooks();

    this.container.innerHTML = `
      <div class="content-header">
        <h1 class="content-title">自定义默写库</h1>
        <p class="content-desc">上传或创建自己的默写内容，可以是课文、公式、代码等</p>
      </div>
      <div class="content-body">
        <div style="margin-bottom: 24px;">
          <button class="btn btn-primary" id="btn-create">
            <i class="bi bi-plus-lg"></i> 创建默写库
          </button>
          <button class="btn btn-secondary" id="btn-import" style="margin-left: 8px;">
            <i class="bi bi-upload"></i> 导入文件
          </button>
        </div>

        ${customBooks.length > 0 ? `
          <div class="list-container fade-in">
            <div class="list-header">
              <span class="list-title">我的默写库</span>
              <span style="font-size: 13px; color: var(--text-muted);">共 ${customBooks.length} 个</span>
            </div>
            ${customBooks.map(book => this.renderBookItem(book)).join('')}
          </div>
        ` : `
          <div class="empty-state fade-in">
            <i class="bi bi-collection empty-state-icon"></i>
            <p class="empty-state-title">暂无自定义默写库</p>
            <p class="empty-state-desc">点击上方按钮创建或导入默写内容</p>
          </div>
        `}

        <div style="margin-top: 24px; padding: 20px; background: var(--bg-secondary); border-radius: 8px;">
          <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 12px;">
            <i class="bi bi-info-circle" style="margin-right: 8px;"></i>
            使用说明
          </h3>
          <ul style="font-size: 13px; color: var(--text-secondary); line-height: 1.8; padding-left: 20px; margin: 0;">
            <li><strong>创建默写库</strong>：手动输入需要默写的内容</li>
            <li><strong>导入文件</strong>：支持 .txt 文件，每行一条内容</li>
            <li>可以添加提示信息帮助记忆</li>
            <li>支持导出和分享默写库</li>
          </ul>
        </div>
      </div>

      <!-- 创建弹窗 -->
      <div class="modal-overlay" id="create-modal">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">创建默写库</h3>
            <button class="modal-close" id="modal-close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="modal-body">
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px;">
                名称 <span style="color: var(--error-color);">*</span>
              </label>
              <input type="text" id="book-name" class="practice-input" style="font-size: 14px; padding: 12px; text-align: left; letter-spacing: normal;" placeholder="例如：高中语文必背课文">
            </div>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px;">
                描述
              </label>
              <input type="text" id="book-desc" class="practice-input" style="font-size: 14px; padding: 12px; text-align: left; letter-spacing: normal;" placeholder="简单描述一下这个默写库">
            </div>
            <div>
              <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px;">
                内容 <span style="color: var(--error-color);">*</span>
                <span style="font-weight: normal; color: var(--text-muted);">（每行一条）</span>
              </label>
              <textarea id="book-content" style="width: 100%; height: 150px; padding: 12px; border: 2px solid var(--input-border); border-radius: 8px; background: var(--input-bg); color: var(--text-primary); font-size: 14px; resize: vertical; font-family: inherit;" placeholder="输入需要默写的内容，每行一条&#10;例如：&#10;床前明月光&#10;疑是地上霜"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btn-cancel">取消</button>
            <button class="btn btn-primary" id="btn-save">创建</button>
          </div>
        </div>
      </div>

      <!-- 导入文件输入 -->
      <input type="file" id="file-input" accept=".txt" style="display: none;">
    `;

    this.bindEvents();
  }

  private renderBookItem(book: CustomBook): string {
    const progressPercent = book.progress || 0;
    
    return `
      <div class="list-item" data-id="${book.id}">
        <div class="list-item-left">
          <div class="list-item-icon" style="background-color: rgba(40, 167, 69, 0.1); color: #28a745;">
            <i class="bi bi-collection"></i>
          </div>
          <div class="list-item-info">
            <div class="list-item-name">${book.name}</div>
            <div class="list-item-meta">${book.description || '暂无描述'}</div>
          </div>
        </div>
        <div class="list-item-right">
          <div style="text-align: right;">
            <div class="list-item-progress">${book.items.length} 条</div>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
              <div class="progress-bar" style="width: 80px; height: 4px;">
                <div class="progress-fill" style="width: ${progressPercent}%; background-color: #28a745;"></div>
              </div>
              <span style="font-size: 12px; color: var(--text-muted);">${progressPercent}%</span>
            </div>
          </div>
          <button class="btn-icon delete-btn" data-id="${book.id}" title="删除" style="margin-left: 8px;">
            <i class="bi bi-trash"></i>
          </button>
          <i class="bi bi-chevron-right" style="color: var(--text-muted); margin-left: 4px;"></i>
        </div>
      </div>
    `;
  }

  private bindEvents() {
    // 创建按钮
    document.getElementById('btn-create')?.addEventListener('click', () => {
      document.getElementById('create-modal')?.classList.add('active');
    });

    // 关闭弹窗
    document.getElementById('modal-close')?.addEventListener('click', () => {
      document.getElementById('create-modal')?.classList.remove('active');
    });

    document.getElementById('btn-cancel')?.addEventListener('click', () => {
      document.getElementById('create-modal')?.classList.remove('active');
    });

    // 保存
    document.getElementById('btn-save')?.addEventListener('click', () => {
      this.saveBook();
    });

    // 导入文件
    document.getElementById('btn-import')?.addEventListener('click', () => {
      document.getElementById('file-input')?.click();
    });

    document.getElementById('file-input')?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        this.importFile(file);
      }
    });

    // 点击列表项
    this.container.querySelectorAll('.list-item').forEach(item => {
      item.addEventListener('click', (e) => {
        // 如果点击的是删除按钮，不触发跳转
        if ((e.target as HTMLElement).closest('.delete-btn')) {
          return;
        }
        const bookId = item.getAttribute('data-id');
        if (bookId) {
          this.router.navigate('custom-practice', { bookId });
        }
      });
    });

    // 删除按钮
    this.container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const bookId = btn.getAttribute('data-id');
        if (bookId && confirm('确定要删除这个默写库吗？')) {
          this.store.deleteCustomBook(bookId);
          this.render();
        }
      });
    });

    // 点击遮罩关闭
    document.getElementById('create-modal')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
        document.getElementById('create-modal')?.classList.remove('active');
      }
    });
  }

  private saveBook() {
    const nameInput = document.getElementById('book-name') as HTMLInputElement;
    const descInput = document.getElementById('book-desc') as HTMLInputElement;
    const contentInput = document.getElementById('book-content') as HTMLTextAreaElement;

    const name = nameInput.value.trim();
    const desc = descInput.value.trim();
    const content = contentInput.value.trim();

    if (!name) {
      alert('请输入名称');
      return;
    }

    if (!content) {
      alert('请输入内容');
      return;
    }

    const lines = content.split('\n').filter(line => line.trim());
    const items: CustomItem[] = lines.map((line, index) => ({
      id: String(index + 1),
      content: line.trim()
    }));

    const book: CustomBook = {
      id: `custom_${Date.now()}`,
      name,
      description: desc,
      items,
      progress: 0
    };

    this.store.addCustomBook(book);
    document.getElementById('create-modal')?.classList.remove('active');
    this.render();
  }

  private async importFile(file: File) {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        alert('文件内容为空');
        return;
      }

      const items: CustomItem[] = lines.map((line, index) => ({
        id: String(index + 1),
        content: line.trim()
      }));

      const name = file.name.replace(/\.[^/.]+$/, '');

      const book: CustomBook = {
        id: `custom_${Date.now()}`,
        name,
        description: `从文件 ${file.name} 导入`,
        items,
        progress: 0
      };

      this.store.addCustomBook(book);
      this.render();
    } catch (error) {
      console.error('Import failed:', error);
      alert('导入失败，请检查文件格式');
    }
  }
}
