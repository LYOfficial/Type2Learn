import { Store, CustomItem } from '../store';
import { Router, RouteParams } from '../router';

export class CustomPracticePage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;
  private params: RouteParams;

  private currentIndex: number = 0;
  private items: CustomItem[] = [];
  private bookId: string = '';
  private showHint: boolean = false;

  constructor(container: HTMLElement, store: Store, router: Router, params: RouteParams) {
    this.container = container;
    this.store = store;
    this.router = router;
    this.params = params;
  }

  render() {
    this.bookId = this.params.bookId as string;
    const book = this.store.getCustomBook(this.bookId);

    if (!book) {
      this.container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-exclamation-circle empty-state-icon"></i>
          <p class="empty-state-title">默写库不存在</p>
          <p class="empty-state-desc">请返回选择其他默写库</p>
          <button class="btn btn-primary" id="btn-back">
            <i class="bi bi-arrow-left"></i> 返回
          </button>
        </div>
      `;
      document.getElementById('btn-back')?.addEventListener('click', () => {
        this.router.navigate('custom');
      });
      return;
    }

    if (book.items.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-inbox empty-state-icon"></i>
          <p class="empty-state-title">默写库为空</p>
          <p class="empty-state-desc">该默写库中没有任何内容</p>
          <button class="btn btn-primary" id="btn-back">
            <i class="bi bi-arrow-left"></i> 返回
          </button>
        </div>
      `;
      document.getElementById('btn-back')?.addEventListener('click', () => {
        this.router.navigate('custom');
      });
      return;
    }

    this.items = book.items;
    this.currentIndex = Math.floor(book.progress / 100 * this.items.length);
    if (this.currentIndex >= this.items.length) this.currentIndex = 0;

    this.renderPractice(book.name);
  }

  private renderPractice(bookName: string) {
    const item = this.items[this.currentIndex];
    const progress = Math.round((this.currentIndex / this.items.length) * 100);

    // 生成提示：显示每个字的首字母或首字符
    const hintText = this.generateHint(item.content);

    this.container.innerHTML = `
      <div class="content-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 class="content-title">${bookName}</h1>
          <p class="content-desc">根据记忆输入内容</p>
        </div>
        <button class="btn btn-secondary" id="btn-back">
          <i class="bi bi-arrow-left"></i> 返回列表
        </button>
      </div>
      <div class="content-body">
        <div class="practice-container fade-in">
          <div class="practice-header">
            <div class="practice-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%; background-color: #28a745;"></div>
              </div>
              <span class="progress-text">${this.currentIndex + 1} / ${this.items.length}</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-icon" id="btn-prev" title="上一个" ${this.currentIndex === 0 ? 'disabled' : ''}>
                <i class="bi bi-chevron-left"></i>
              </button>
              <button class="btn-icon" id="btn-next" title="下一个">
                <i class="bi bi-chevron-right"></i>
              </button>
              <button class="btn-icon" id="btn-hint" title="显示提示">
                <i class="bi bi-lightbulb"></i>
              </button>
            </div>
          </div>

          <div class="practice-word" style="padding: 60px 20px;">
            <div style="font-size: 24px; color: var(--text-muted); margin-bottom: 24px;">
              第 ${this.currentIndex + 1} 条
            </div>
            ${item.hint ? `
              <div style="font-size: 16px; color: var(--text-secondary); margin-bottom: 16px;">
                提示：${item.hint}
              </div>
            ` : ''}
            <div id="hint-display" style="font-size: 20px; color: var(--text-muted); margin-bottom: 24px; display: ${this.showHint ? 'block' : 'none'};">
              ${hintText}
            </div>
          </div>

          <div class="input-area">
            <input 
              type="text" 
              class="practice-input" 
              id="custom-input" 
              placeholder="输入内容..." 
              autocomplete="off"
              autofocus
              style="letter-spacing: 1px; font-family: 'Microsoft YaHei', sans-serif;"
            />
            <div class="typing-hint">按 Tab 键显示提示</div>
          </div>

          <div id="feedback" style="text-align: center; margin-top: 24px; font-size: 18px; min-height: 30px;"></div>
          
          <div id="answer-display" style="text-align: center; margin-top: 16px; font-size: 16px; color: var(--success-color); display: none;">
          </div>
        </div>
      </div>
    `;

    this.bindPracticeEvents();
  }

  private generateHint(content: string): string {
    // 显示首字符，其余用下划线代替
    const chars = content.split('');
    let hint = '';
    let wordStart = true;
    
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === ' ' || /[，。？！、；：""'',.!?;:]/.test(char)) {
        hint += char;
        wordStart = true;
      } else if (wordStart) {
        hint += char;
        wordStart = false;
      } else {
        hint += '_';
      }
    }
    
    return hint;
  }

  private bindPracticeEvents() {
    const input = document.getElementById('custom-input') as HTMLInputElement;
    const item = this.items[this.currentIndex];

    // 返回按钮
    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.saveProgress();
      this.router.navigate('custom');
    });

    // 上一个
    document.getElementById('btn-prev')?.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.showHint = false;
        this.renderPractice(this.store.getCustomBook(this.bookId)?.name || '');
      }
    });

    // 下一个
    document.getElementById('btn-next')?.addEventListener('click', () => {
      this.goNext();
    });

    // 显示提示
    document.getElementById('btn-hint')?.addEventListener('click', () => {
      this.showHint = !this.showHint;
      const hintDisplay = document.getElementById('hint-display');
      if (hintDisplay) {
        hintDisplay.style.display = this.showHint ? 'block' : 'none';
      }
    });

    // 输入事件
    input?.addEventListener('input', () => {
      const value = input.value.trim();
      const correct = item.content.trim();

      if (value === correct) {
        input.classList.remove('error');
        input.classList.add('correct');
        document.getElementById('feedback')!.innerHTML = `
          <span style="color: var(--success-color);">
            <i class="bi bi-check-circle"></i> 正确！
          </span>
        `;
        // 自动跳转下一个
        setTimeout(() => this.goNext(), 800);
      } else if (correct.startsWith(value)) {
        input.classList.remove('error', 'correct');
        document.getElementById('feedback')!.innerHTML = '';
      } else {
        input.classList.remove('correct');
        input.classList.add('error');
        document.getElementById('feedback')!.innerHTML = '';
      }
    });

    // 键盘事件
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        this.showHint = true;
        const hintDisplay = document.getElementById('hint-display');
        if (hintDisplay) {
          hintDisplay.style.display = 'block';
        }
      }
    });

    // 自动聚焦
    input?.focus();
  }

  private goNext() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      this.showHint = false;
      this.renderPractice(this.store.getCustomBook(this.bookId)?.name || '');
    } else {
      // 完成所有内容
      this.store.updateCustomBookProgress(this.bookId, 100);
      this.showComplete();
    }
  }

  private saveProgress() {
    const progress = Math.round((this.currentIndex / this.items.length) * 100);
    this.store.updateCustomBookProgress(this.bookId, progress);
  }

  private showComplete() {
    this.container.innerHTML = `
      <div class="content-body">
        <div class="empty-state" style="padding-top: 100px;">
          <i class="bi bi-trophy" style="font-size: 80px; color: #28a745; margin-bottom: 24px;"></i>
          <h2 class="empty-state-title" style="font-size: 24px;">恭喜完成！</h2>
          <p class="empty-state-desc">你已经完成了这个默写库的所有内容</p>
          <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="btn btn-secondary" id="btn-restart">
              <i class="bi bi-arrow-repeat"></i> 重新练习
            </button>
            <button class="btn btn-primary" id="btn-back">
              <i class="bi bi-list"></i> 返回列表
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-restart')?.addEventListener('click', () => {
      this.currentIndex = 0;
      this.store.updateCustomBookProgress(this.bookId, 0);
      this.renderPractice(this.store.getCustomBook(this.bookId)?.name || '');
    });

    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.router.navigate('custom');
    });
  }
}
