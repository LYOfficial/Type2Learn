import { Store, Poetry } from '../store';
import { Router, RouteParams } from '../router';

export class PoetryPracticePage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;
  private params: RouteParams;

  private currentPoemIndex: number = 0;
  private currentLineIndex: number = 0;
  private poems: Poetry[] = [];
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
    const book = this.store.getPoetryBook(this.bookId);

    if (!book) {
      this.container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-exclamation-circle empty-state-icon"></i>
          <p class="empty-state-title">诗集不存在</p>
          <p class="empty-state-desc">请返回选择其他诗集</p>
          <button class="btn btn-primary" id="btn-back">
            <i class="bi bi-arrow-left"></i> 返回
          </button>
        </div>
      `;
      document.getElementById('btn-back')?.addEventListener('click', () => {
        this.router.navigate('poetry');
      });
      return;
    }

    this.poems = book.poems;
    this.currentPoemIndex = Math.floor(book.progress / 100 * this.poems.length);
    if (this.currentPoemIndex >= this.poems.length) this.currentPoemIndex = 0;
    this.currentLineIndex = 0;

    this.renderPractice(book.name);
  }

  private renderPractice(bookName: string) {
    const poem = this.poems[this.currentPoemIndex];
    const totalLines = poem.content.length;
    const overallProgress = Math.round(
      ((this.currentPoemIndex + this.currentLineIndex / totalLines) / this.poems.length) * 100
    );

    this.container.innerHTML = `
      <div class="content-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 class="content-title">${bookName}</h1>
          <p class="content-desc">第 ${this.currentPoemIndex + 1} / ${this.poems.length} 首</p>
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
                <div class="progress-fill" style="width: ${overallProgress}%; background-color: #9c27b0;"></div>
              </div>
              <span class="progress-text">整体进度 ${overallProgress}%</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn-icon" id="btn-prev-poem" title="上一首" ${this.currentPoemIndex === 0 ? 'disabled' : ''}>
                <i class="bi bi-skip-backward"></i>
              </button>
              <button class="btn-icon" id="btn-next-poem" title="下一首">
                <i class="bi bi-skip-forward"></i>
              </button>
              <button class="btn-icon" id="btn-hint" title="显示提示">
                <i class="bi bi-lightbulb"></i>
              </button>
            </div>
          </div>

          <div class="poetry-display">
            <h2 class="poetry-title">${poem.title}</h2>
            <p class="poetry-author">${poem.dynasty ? `【${poem.dynasty}】` : ''}${poem.author}</p>
            <div class="poetry-content">
              ${poem.content.map((line, index) => {
                let className = 'poetry-line';
                if (index < this.currentLineIndex) className += ' completed';
                if (index === this.currentLineIndex) className += ' current';
                
                // 如果是已完成的行或当前行且显示提示，显示内容，否则显示占位符
                let displayText = line;
                if (index > this.currentLineIndex) {
                  displayText = '·'.repeat(line.replace(/[，。？！、；：""'']/g, '').length);
                }
                
                return `<div class="${className}" data-line="${index}">${displayText}</div>`;
              }).join('')}
            </div>
          </div>

          <div class="input-area">
            <input 
              type="text" 
              class="practice-input" 
              id="poetry-input" 
              placeholder="输入当前行内容..." 
              autocomplete="off"
              autofocus
              style="letter-spacing: 2px; font-family: 'Microsoft YaHei', sans-serif;"
            />
            <div class="typing-hint">
              当前第 ${this.currentLineIndex + 1} / ${totalLines} 行，按 Tab 键显示提示
            </div>
          </div>

          <div id="feedback" style="text-align: center; margin-top: 24px; font-size: 18px; min-height: 30px;"></div>
          
          <div id="hint-display" style="text-align: center; margin-top: 16px; font-size: 16px; color: var(--text-muted); display: ${this.showHint ? 'block' : 'none'};">
            提示：${poem.content[this.currentLineIndex]}
          </div>
        </div>
      </div>
    `;

    this.bindPracticeEvents();
  }

  private bindPracticeEvents() {
    const input = document.getElementById('poetry-input') as HTMLInputElement;
    const poem = this.poems[this.currentPoemIndex];
    const currentLine = poem.content[this.currentLineIndex];

    // 返回按钮
    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.saveProgress();
      this.router.navigate('poetry');
    });

    // 上一首
    document.getElementById('btn-prev-poem')?.addEventListener('click', () => {
      if (this.currentPoemIndex > 0) {
        this.currentPoemIndex--;
        this.currentLineIndex = 0;
        this.renderPractice(this.store.getPoetryBook(this.bookId)?.name || '');
      }
    });

    // 下一首
    document.getElementById('btn-next-poem')?.addEventListener('click', () => {
      this.goNextPoem();
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
      const correct = currentLine.trim();

      if (value === correct) {
        input.classList.remove('error');
        input.classList.add('correct');
        document.getElementById('feedback')!.innerHTML = `
          <span style="color: var(--success-color);">
            <i class="bi bi-check-circle"></i> 正确！
          </span>
        `;
        // 自动跳转下一行
        setTimeout(() => this.goNextLine(), 600);
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

  private goNextLine() {
    const poem = this.poems[this.currentPoemIndex];
    
    if (this.currentLineIndex < poem.content.length - 1) {
      this.currentLineIndex++;
      this.showHint = false;
      this.renderPractice(this.store.getPoetryBook(this.bookId)?.name || '');
    } else {
      // 完成当前诗
      this.goNextPoem();
    }
  }

  private goNextPoem() {
    if (this.currentPoemIndex < this.poems.length - 1) {
      this.currentPoemIndex++;
      this.currentLineIndex = 0;
      this.showHint = false;
      this.renderPractice(this.store.getPoetryBook(this.bookId)?.name || '');
    } else {
      // 完成所有诗
      this.store.updatePoetryBookProgress(this.bookId, 100);
      this.showComplete();
    }
  }

  private saveProgress() {
    const totalPoems = this.poems.length;
    const currentPoem = this.poems[this.currentPoemIndex];
    const totalLines = currentPoem.content.length;
    const progress = Math.round(
      ((this.currentPoemIndex + this.currentLineIndex / totalLines) / totalPoems) * 100
    );
    this.store.updatePoetryBookProgress(this.bookId, progress);
  }

  private showComplete() {
    this.container.innerHTML = `
      <div class="content-body">
        <div class="empty-state" style="padding-top: 100px;">
          <i class="bi bi-trophy" style="font-size: 80px; color: #9c27b0; margin-bottom: 24px;"></i>
          <h2 class="empty-state-title" style="font-size: 24px;">恭喜完成！</h2>
          <p class="empty-state-desc">你已经完成了这个诗集的所有古诗背诵</p>
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
      this.currentPoemIndex = 0;
      this.currentLineIndex = 0;
      this.store.updatePoetryBookProgress(this.bookId, 0);
      this.renderPractice(this.store.getPoetryBook(this.bookId)?.name || '');
    });

    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.router.navigate('poetry');
    });
  }
}
