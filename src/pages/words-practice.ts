import { Store, Word } from '../store';
import { Router, RouteParams } from '../router';
import { WordService } from '../word-service';

// 练习模式
type PracticeMode = 'study' | 'review' | 'shuffle' | 'free';

// 单词信息标签
const WORD_TABS = [
  { id: 'meaning', name: '翻译', icon: 'bi-translate' },
  { id: 'phonetic', name: '音标', icon: 'bi-volume-up' },
  { id: 'example', name: '例句', icon: 'bi-chat-quote' },
  { id: 'phrase', name: '短语', icon: 'bi-collection' },
  { id: 'synonym', name: '近义词', icon: 'bi-diagram-3' },
  { id: 'cognate', name: '同根词', icon: 'bi-tree' },
  { id: 'etymology', name: '词源', icon: 'bi-book' }
];

export class WordsPracticePage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;
  private params: RouteParams;
  private wordService: WordService;

  private currentIndex: number = 0;
  private words: Word[] = [];
  private bookId: string = '';
  private mode: PracticeMode = 'study';
  private inputCorrect: boolean = false;
  private showWord: boolean = false;
  private activeTab: string = 'meaning';
  private wrongWords: Word[] = [];
  private startTime: number = 0;
  private correctCount: number = 0;
  private wrongCount: number = 0;

  constructor(container: HTMLElement, store: Store, router: Router, params: RouteParams) {
    this.container = container;
    this.store = store;
    this.router = router;
    this.params = params;
    this.wordService = new WordService(store);
  }

  async render() {
    this.bookId = this.params.bookId as string;
    this.mode = (this.params.mode as PracticeMode) || 'study';
    
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

    // 加载词库数据
    if (book.words.length === 0) {
      this.container.innerHTML = `<div class="loading-spinner"><i class="bi bi-arrow-repeat"></i> 加载词库中...</div>`;
      await this.wordService.loadWordBook(this.bookId);
    }

    // 根据模式获取单词列表
    this.loadWords();
    
    if (this.words.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-check-circle empty-state-icon" style="color: var(--success-color);"></i>
          <p class="empty-state-title">没有需要学习的单词</p>
          <p class="empty-state-desc">当前词库没有可学习的内容</p>
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

    this.startTime = Date.now();
    this.renderPractice(book.name);
  }

  private loadWords() {
    const book = this.store.getWordBook(this.bookId);
    if (!book) return;

    const task = this.store.getTodayTask(this.bookId);
    
    switch (this.mode) {
      case 'study':
        // 新词 + 复习词
        this.words = [...task.newWords, ...task.reviewWords];
        break;
      case 'review':
        // 只复习
        this.words = [...task.reviewWords, ...task.reviewAllWords];
        break;
      case 'shuffle':
        // 随机复习已学过的
        const learnedWords = book.words.slice(0, book.lastLearnIndex || 0);
        this.words = this.shuffleArray([...learnedWords]);
        break;
      case 'free':
        // 自由练习所有词
        this.words = [...book.words];
        break;
      default:
        this.words = [...task.newWords, ...task.reviewWords];
    }

    this.currentIndex = 0;
    this.wrongWords = [];
    this.correctCount = 0;
    this.wrongCount = 0;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private getModeText(): string {
    switch (this.mode) {
      case 'study': return '学习模式';
      case 'review': return '复习模式';
      case 'shuffle': return '随机复习';
      case 'free': return '自由练习';
      default: return '学习模式';
    }
  }

  private renderPractice(bookName: string) {
    const word = this.words[this.currentIndex];
    const progress = Math.round((this.currentIndex / this.words.length) * 100);

    this.container.innerHTML = `
      <div class="practice-page">
        <!-- 顶部导航栏 -->
        <div class="practice-header">
          <div class="header-left">
            <button class="btn-icon" id="btn-back" title="返回">
              <i class="bi bi-arrow-left"></i>
            </button>
            <div class="book-info">
              <span class="book-name">${bookName}</span>
              <span class="practice-mode">${this.getModeText()}</span>
            </div>
          </div>
          <div class="header-center">
            <div class="progress-indicator">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%;"></div>
              </div>
              <span class="progress-text">${this.currentIndex + 1} / ${this.words.length}</span>
            </div>
          </div>
          <div class="header-right">
            <button class="btn-icon" id="btn-prev" title="上一个" ${this.currentIndex === 0 ? 'disabled' : ''}>
              <i class="bi bi-chevron-left"></i>
            </button>
            <button class="btn-icon" id="btn-next" title="下一个">
              <i class="bi bi-chevron-right"></i>
            </button>
            <button class="btn-icon ${this.store.getUserDict('collect')?.words.find(w => w.word === word.word) ? 'active' : ''}" id="btn-collect" title="收藏">
              <i class="bi bi-star${this.store.getUserDict('collect')?.words.find(w => w.word === word.word) ? '-fill' : ''}"></i>
            </button>
            <button class="btn-icon" id="btn-known" title="标记为已掌握">
              <i class="bi bi-check-circle"></i>
            </button>
          </div>
        </div>

        <!-- 单词展示区域 -->
        <div class="word-display-area">
          <div class="word-main">
            <div class="word-text ${this.showWord ? '' : 'hidden'}" id="word-text">
              ${word.word}
            </div>
            <div class="word-phonetics">
              ${word.phonetic ? `<span class="phonetic">${word.phonetic}</span>` : ''}
              ${word.phonetic2 ? `<span class="phonetic">${word.phonetic2}</span>` : ''}
              <button class="btn-icon btn-play" id="btn-play" title="播放发音">
                <i class="bi bi-volume-up"></i>
              </button>
            </div>
          </div>

          <!-- 单词信息标签页 -->
          <div class="word-tabs">
            ${WORD_TABS.map(tab => `
              <div class="word-tab ${this.activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
                <i class="bi ${tab.icon}"></i>
                <span>${tab.name}</span>
              </div>
            `).join('')}
          </div>

          <!-- 标签内容 -->
          <div class="word-tab-content">
            ${this.renderTabContent(word)}
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="input-section">
          <div class="typing-area">
            <input 
              type="text" 
              class="word-input" 
              id="word-input" 
              placeholder="输入单词..." 
              autocomplete="off"
              autofocus
            />
            <div class="input-hint">
              <span>按 <kbd>Enter</kbd> 确认</span>
              <span>按 <kbd>Tab</kbd> 显示答案</span>
              <span>按 <kbd>Space</kbd> 跳过</span>
            </div>
          </div>
        </div>

        <!-- 底部状态栏 -->
        <div class="practice-footer">
          <div class="stats-bar">
            <div class="stat">
              <i class="bi bi-check-circle text-success"></i>
              <span>${this.correctCount}</span>
            </div>
            <div class="stat">
              <i class="bi bi-x-circle text-danger"></i>
              <span>${this.wrongCount}</span>
            </div>
            <div class="stat">
              <i class="bi bi-clock"></i>
              <span id="timer">00:00</span>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-secondary" id="btn-show-word">
              <i class="bi bi-eye"></i> 显示单词
            </button>
            <button class="btn btn-secondary" id="btn-skip">
              <i class="bi bi-skip-forward"></i> 跳过
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindPracticeEvents();
    this.startTimer();
  }

  private renderTabContent(word: Word): string {
    switch (this.activeTab) {
      case 'meaning':
        return `<div class="tab-meaning">${word.meaning || '暂无释义'}</div>`;
      case 'phonetic':
        return `
          <div class="tab-phonetic">
            ${word.phonetic ? `<div class="phonetic-item"><span class="label">英式:</span> ${word.phonetic}</div>` : ''}
            ${word.phonetic2 ? `<div class="phonetic-item"><span class="label">美式:</span> ${word.phonetic2}</div>` : ''}
            ${!word.phonetic && !word.phonetic2 ? '暂无音标' : ''}
          </div>
        `;
      case 'example':
        return `<div class="tab-example">${word.example || '暂无例句'}</div>`;
      case 'phrase':
        return `<div class="tab-phrase">${word.phrase || '暂无短语'}</div>`;
      case 'synonym':
        return `<div class="tab-synonym">${word.synonym || '暂无近义词'}</div>`;
      case 'cognate':
        return `<div class="tab-cognate">${word.cognate || '暂无同根词'}</div>`;
      case 'etymology':
        return `<div class="tab-etymology">${word.etymology || '暂无词源'}</div>`;
      default:
        return `<div class="tab-meaning">${word.meaning || '暂无释义'}</div>`;
    }
  }

  private startTimer() {
    const timerEl = document.getElementById('timer');
    if (!timerEl) return;

    const update = () => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const seconds = (elapsed % 60).toString().padStart(2, '0');
      timerEl.textContent = `${minutes}:${seconds}`;
    };

    update();
    setInterval(update, 1000);
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
        this.showWord = false;
        this.renderPractice(this.store.getWordBook(this.bookId)?.name || '');
      }
    });

    // 下一个
    document.getElementById('btn-next')?.addEventListener('click', () => {
      this.goNext(false);
    });

    // 收藏
    document.getElementById('btn-collect')?.addEventListener('click', () => {
      const collectDict = this.store.getUserDict('collect');
      if (collectDict?.words.find(w => w.word === word.word)) {
        this.store.removeWordFromUserDict('collect', word.id);
      } else {
        this.store.addWordToUserDict('collect', word);
      }
      this.renderPractice(this.store.getWordBook(this.bookId)?.name || '');
    });

    // 标记为已掌握
    document.getElementById('btn-known')?.addEventListener('click', () => {
      this.store.addWordToUserDict('mastered', word);
      this.goNext(true);
    });

    // 显示单词
    document.getElementById('btn-show-word')?.addEventListener('click', () => {
      this.showWord = true;
      const wordText = document.getElementById('word-text');
      if (wordText) {
        wordText.classList.remove('hidden');
      }
    });

    // 跳过
    document.getElementById('btn-skip')?.addEventListener('click', () => {
      this.goNext(false);
    });

    // 播放发音
    document.getElementById('btn-play')?.addEventListener('click', () => {
      this.playPronunciation(word.word);
    });

    // 标签切换
    this.container.querySelectorAll('.word-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeTab = tab.getAttribute('data-tab') || 'meaning';
        this.container.querySelectorAll('.word-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const content = this.container.querySelector('.word-tab-content');
        if (content) {
          content.innerHTML = this.renderTabContent(word);
        }
      });
    });

    // 输入事件
    input?.addEventListener('input', () => {
      const value = input.value.trim().toLowerCase();
      const correct = word.word.toLowerCase();

      if (value === correct) {
        input.classList.remove('error');
        input.classList.add('correct');
        this.inputCorrect = true;
        this.correctCount++;
        this.store.recordLearning(word.id, word.word, true);
        
        // 自动跳转下一个
        setTimeout(() => this.goNext(true), 500);
      } else if (correct.startsWith(value)) {
        input.classList.remove('error', 'correct');
      } else {
        input.classList.remove('correct');
        input.classList.add('error');
      }
    });

    // 键盘事件
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        this.showWord = true;
        const wordText = document.getElementById('word-text');
        if (wordText) {
          wordText.classList.remove('hidden');
        }
      }
      if (e.key === 'Enter' && this.inputCorrect) {
        this.goNext(true);
      }
      if (e.key === ' ' && input.value === '') {
        e.preventDefault();
        this.goNext(false);
      }
    });

    // 自动聚焦
    input?.focus();
  }

  private playPronunciation(word: string) {
    // 使用浏览器的 Speech Synthesis API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  }

  private goNext(correct: boolean) {
    const word = this.words[this.currentIndex];
    
    if (!correct) {
      this.wrongCount++;
      this.wrongWords.push(word);
      this.store.addWordToUserDict('wrong', word);
      this.store.recordLearning(word.id, word.word, false);
    }

    if (this.currentIndex < this.words.length - 1) {
      this.currentIndex++;
      this.inputCorrect = false;
      this.showWord = false;
      this.renderPractice(this.store.getWordBook(this.bookId)?.name || '');
    } else {
      // 完成所有单词
      this.saveProgress();
      this.showComplete();
    }
  }

  private saveProgress() {
    const book = this.store.getWordBook(this.bookId);
    if (!book) return;

    // 更新学习进度
    if (this.mode === 'study') {
      const newLearnIndex = Math.min(
        (book.lastLearnIndex || 0) + this.words.length,
        book.wordCount
      );
      const progress = Math.round(newLearnIndex / book.wordCount * 100);
      this.store.updateWordBookProgress(this.bookId, progress, newLearnIndex);
    }

    // 更新每日统计
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this.store.updateDailyStats(
      this.mode === 'study' ? this.words.length : 0,
      this.mode !== 'study' ? this.words.length : 0,
      this.correctCount,
      this.wrongCount,
      elapsed
    );
  }

  private showComplete() {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const accuracy = this.words.length > 0 
      ? Math.round((this.correctCount / this.words.length) * 100) 
      : 0;

    this.container.innerHTML = `
      <div class="complete-page">
        <div class="complete-header">
          <div class="complete-icon">🎉</div>
          <h2 class="complete-title">学习完成！</h2>
          <p class="complete-subtitle">${this.getEncouragementText(accuracy)}</p>
        </div>

        <div class="complete-stats">
          <div class="stat-card">
            <div class="stat-icon"><i class="bi bi-clock"></i></div>
            <div class="stat-value">${minutes}分${seconds}秒</div>
            <div class="stat-label">学习时长</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="bi bi-bullseye"></i></div>
            <div class="stat-value">${accuracy}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="bi bi-lightning"></i></div>
            <div class="stat-value">${this.words.length}</div>
            <div class="stat-label">学习单词</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon"><i class="bi bi-x-circle"></i></div>
            <div class="stat-value">${this.wrongWords.length}</div>
            <div class="stat-label">错误数</div>
          </div>
        </div>

        ${this.wrongWords.length > 0 ? `
          <div class="wrong-words-section">
            <h3>错误单词</h3>
            <div class="wrong-words-list">
              ${this.wrongWords.map(w => `
                <div class="wrong-word-item">
                  <span class="word">${w.word}</span>
                  <span class="meaning">${w.meaning}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="complete-actions">
          <button class="btn btn-secondary" id="btn-restart">
            <i class="bi bi-arrow-repeat"></i> 重学一遍
          </button>
          <button class="btn btn-primary" id="btn-continue">
            <i class="bi bi-play"></i> 继续下一组
          </button>
          <button class="btn btn-outline" id="btn-back">
            <i class="bi bi-house"></i> 返回首页
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-restart')?.addEventListener('click', () => {
      this.loadWords();
      this.startTime = Date.now();
      this.renderPractice(this.store.getWordBook(this.bookId)?.name || '');
    });

    document.getElementById('btn-continue')?.addEventListener('click', () => {
      this.loadWords();
      this.startTime = Date.now();
      if (this.words.length > 0) {
        this.renderPractice(this.store.getWordBook(this.bookId)?.name || '');
      } else {
        this.router.navigate('words');
      }
    });

    document.getElementById('btn-back')?.addEventListener('click', () => {
      this.router.navigate('words');
    });
  }

  private getEncouragementText(accuracy: number): string {
    if (accuracy >= 95) return '太棒了！继续保持！';
    if (accuracy >= 85) return '表现很好，再接再厉！';
    if (accuracy >= 70) return '不错的成绩，继续加油！';
    return '每次练习都是进步，坚持下去！';
  }
}
