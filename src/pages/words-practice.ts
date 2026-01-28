import { Store, Word } from '../store';
import { Router, RouteParams } from '../router';

export class WordsPracticePage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;
  private params: RouteParams;

  private currentIndex: number = 0;
  private words: Word[] = [];
  private bookId: string = '';
  private inputCorrect: boolean = false;

  constructor(container: HTMLElement, store: Store, router: Router, params: RouteParams) {
    this.container = container;
    this.store = store;
    this.router = router;
    this.params = params;
  }

  render() {
    this.bookId = this.params.bookId as string;
    const book = this.store.getWordBook(this.bookId);

    if (!book) {
      this.container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-exclamation-circle empty-state-icon"></i>
          <p class="empty-state-title">词库不存在</p>
          <p class="empty-state-desc">请返回选择其他词库</p>
          <button class="btn btn-primary" id="btn-back">
            <i class="bi bi-arrow-left"></i> 返回
          </button>
        </div>
      `;
      document.getElementById('btn-back')?.addEventListener('click', () => {
        this.router.navigate('words');
      });
      return;
    }

    this.words = book.words;
    this.currentIndex = Math.floor(book.progress / 100 * this.words.length);
    if (this.currentIndex >= this.words.length) this.currentIndex = 0;

    this.renderPractice(book.name);
  }

  private renderPractice(bookName: string) {
    const word = this.words[this.currentIndex];
    const progress = Math.round((this.currentIndex / this.words.length) * 100);

    this.container.innerHTML = `
      <div class="content-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 class="content-title">${bookName}</h1>
          <p class="content-desc">认真看释义，输入对应的英文单词</p>
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
                <div class="progress-fill" style="width: ${progress}%;"></div>
              </div>
              <span class="progress-text">${this.currentIndex + 1} / ${this.words.length}</span>
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

          <div class="practice-word">
            <div class="word-meaning">${word.meaning}</div>
            ${word.phonetic ? `<div class="word-phonetic">${word.phonetic}</div>` : ''}
            <div class="word-display" id="word-hint" style="visibility: hidden; color: var(--text-muted); font-size: 32px;">
              ${word.word}
            </div>
          </div>

          <div class="input-area">
            <input 
              type="text" 
              class="practice-input" 
              id="word-input" 
              placeholder="输入单词..." 
              autocomplete="off"
              autofocus
            />
            <div class="typing-hint">按 Enter 键确认，按 Tab 键显示提示</div>
          </div>

          <div id="feedback" style="text-align: center; margin-top: 24px; font-size: 18px; min-height: 30px;"></div>
        </div>
      </div>
    `;

    this.bindPracticeEvents();
  }

  private bindPracticeEvents() {
    const input = document.getElementById('word-input') as HTMLInputElement;
    const word = this.words[this.currentIndex];

    // 返回按钮
    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.saveProgress();
      this.router.navigate('words');
    });

    // 上一个
    document.getElementById('btn-prev')?.addEventListener('click', () => {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.renderPractice(this.store.getWordBook(this.bookId)?.name || '');
      }
    });

    // 下一个
    document.getElementById('btn-next')?.addEventListener('click', () => {
      this.goNext();
    });

    // 显示提示
    document.getElementById('btn-hint')?.addEventListener('click', () => {
      const hint = document.getElementById('word-hint');
      if (hint) {
        hint.style.visibility = hint.style.visibility === 'visible' ? 'hidden' : 'visible';
      }
    });

    // 输入事件
    input?.addEventListener('input', () => {
      const value = input.value.trim().toLowerCase();
      const correct = word.word.toLowerCase();

      if (value === correct) {
        input.classList.remove('error');
        input.classList.add('correct');
        this.inputCorrect = true;
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
        const hint = document.getElementById('word-hint');
        if (hint) {
          hint.style.visibility = 'visible';
        }
      }
      if (e.key === 'Enter' && this.inputCorrect) {
        this.goNext();
      }
    });

    // 自动聚焦
    input?.focus();
  }

  private goNext() {
    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++;
      this.inputCorrect = false;
      this.renderPractice(this.store.getWordBook(this.bookId)?.name || '');
    } else {
      // 完成所有单词
      this.store.updateWordBookProgress(this.bookId, 100);
      this.showComplete();
    }
  }

  private saveProgress() {
    const progress = Math.round((this.currentIndex / this.words.length) * 100);
    this.store.updateWordBookProgress(this.bookId, progress);
  }

  private showComplete() {
    this.container.innerHTML = `
      <div class="content-body">
        <div class="empty-state" style="padding-top: 100px;">
          <i class="bi bi-trophy" style="font-size: 80px; color: #ffc107; margin-bottom: 24px;"></i>
          <h2 class="empty-state-title" style="font-size: 24px;">恭喜完成！</h2>
          <p class="empty-state-desc">你已经完成了这个词库的所有单词练习</p>
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
      this.store.updateWordBookProgress(this.bookId, 0);
      this.renderPractice(this.store.getWordBook(this.bookId)?.name || '');
    });

    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.router.navigate('words');
    });
  }
}
