import { Store, WordBook } from '../store';
import { Router } from '../router';
import { WordService } from '../word-service';

export class WordsPage {
  private container: HTMLElement;
  private store: Store;
  private router: Router;
  private wordService: WordService;

  constructor(container: HTMLElement, store: Store, router: Router) {
    this.container = container;
    this.store = store;
    this.router = router;
    this.wordService = new WordService(store);
  }

  async render() {
    // 显示加载状态
    this.container.innerHTML = `<div class="words-loading"><i class="bi bi-arrow-repeat spin"></i> 正在加载词库...</div>`;
    
    // 预加载词数
    await this.wordService.preloadWordCounts();
    
    const wordBooks = this.store.getWordBooks();
    const userDicts = this.store.getUserDicts();
    const studyDict = this.store.getStudyDict();

    // 计算今日任务
    let todayTask = { newWords: [] as any[], reviewWords: [] as any[], reviewAllWords: [] as any[] };
    let estimatedDate = '-';
    let studyProgress = 0;
    
    if (studyDict) {
      // 加载词库数据
      if (studyDict.words.length === 0) {
        await this.wordService.loadWordBook(studyDict.id);
      }
      todayTask = this.store.getTodayTask(studyDict.id);
      estimatedDate = this.wordService.getEstimatedCompletionDate(studyDict.id);
      studyProgress = this.store.getStudyProgress(studyDict.id);
    }

    this.container.innerHTML = `
      <div class="words-page-v2">
        <!-- 顶部标题区域 -->
        <div class="words-header">
          <div class="header-content">
            <h1><i class="bi bi-translate"></i> 单词学习</h1>
            <p>选择词库，开始你的单词记忆之旅</p>
          </div>
        </div>

        <!-- 主内容区域 - 两列布局 -->
        <div class="words-main">
          <!-- 左侧：当前学习状态 -->
          <div class="words-left">
            ${studyDict ? this.renderCurrentStudy(studyDict, estimatedDate, studyProgress, todayTask) : this.renderNoStudy()}
            
            <!-- 我的词库 -->
            <div class="words-section user-section">
              <div class="section-title-bar">
                <h3><i class="bi bi-star"></i> 我的词库</h3>
                <div class="section-actions">
                  <button class="action-btn" id="btn-manage-dicts">
                    <i class="bi bi-gear"></i> 管理
                  </button>
                </div>
              </div>
              <div class="user-dict-list">
                ${userDicts.map(dict => `
                  <div class="user-dict-item" data-id="${dict.id}">
                    <i class="bi ${dict.icon}"></i>
                    <span class="dict-name">${dict.name}</span>
                    <span class="dict-count">${dict.words.length}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- 右侧：词库选择 -->
          <div class="words-right">
            <div class="words-section">
              <div class="section-title-bar">
                <h3><i class="bi bi-book"></i> 内置词库</h3>
                <span class="section-hint">点击选择要学习的词库</span>
              </div>
              <div class="wordbook-list">
                ${wordBooks.map(book => this.renderWordBookItem(book, studyDict?.id === book.id)).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // 确保 DOM 更新后再绑定事件
    setTimeout(() => {
      this.bindEvents();
    }, 0);
  }

  private renderCurrentStudy(dict: WordBook, estimatedDate: string, progress: number, todayTask: any): string {
    return `
      <div class="current-study-card">
        <div class="study-card-header">
          <div class="study-info">
            <div class="study-book-icon">
              <i class="bi bi-journal-bookmark-fill"></i>
            </div>
            <div class="study-details">
              <h2>${dict.name}</h2>
              <span class="study-meta">预计完成：${estimatedDate}</span>
            </div>
          </div>
          <button class="btn-change-book" id="btn-select-dict">
            <i class="bi bi-arrow-repeat"></i> 更换词库
          </button>
        </div>
        
        <div class="study-progress-bar">
          <div class="progress-track">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="progress-labels">
            <span>已学 ${dict.lastLearnIndex || 0} 词</span>
            <span>${progress}%</span>
            <span>共 ${dict.wordCount} 词</span>
          </div>
        </div>

        <div class="study-task-grid">
          <div class="task-stat new-words">
            <div class="task-number">${todayTask.newWords.length}</div>
            <div class="task-label">新词</div>
          </div>
          <div class="task-stat review-words">
            <div class="task-number">${todayTask.reviewWords.length}</div>
            <div class="task-label">待复习</div>
          </div>
          <div class="task-stat all-words">
            <div class="task-number">${todayTask.reviewAllWords.length}</div>
            <div class="task-label">早期复习</div>
          </div>
        </div>

        <div class="study-actions">
          <button class="btn-primary-action" id="btn-continue-study">
            <i class="bi bi-play-fill"></i>
            继续学习
          </button>
          <button class="btn-secondary-action" id="btn-free-practice">
            <i class="bi bi-shuffle"></i>
            自由练习
          </button>
          <button class="btn-icon-action" id="btn-change-goal" title="设置每日目标">
            <i class="bi bi-sliders"></i>
          </button>
          <button class="btn-icon-action" id="btn-change-progress" title="调整学习进度">
            <i class="bi bi-skip-forward"></i>
          </button>
        </div>

        <div class="daily-goal-info">
          <i class="bi bi-bullseye"></i>
          每日目标：<strong>${dict.perDayStudyNumber || 40}</strong> 个新词，<strong>${this.store.getSettings().perDayReviewNumber || 40}</strong> 个复习
        </div>
      </div>
    `;
  }

  private renderNoStudy(): string {
    return `
      <div class="no-study-card">
        <div class="no-study-icon">
          <i class="bi bi-book"></i>
        </div>
        <h3>尚未选择学习词库</h3>
        <p>从右侧选择一个词库开始学习吧！</p>
        <button class="btn-start-select" id="btn-select-dict">
          <i class="bi bi-plus-circle"></i> 选择词库
        </button>
      </div>
    `;
  }

  private renderWordBookItem(book: WordBook, isStudying: boolean): string {
    const progress = book.progress || 0;
    return `
      <div class="wordbook-item ${isStudying ? 'studying' : ''}" data-id="${book.id}">
        <div class="wordbook-icon ${this.getBookIconClass(book.id)}">
          <i class="bi bi-book-half"></i>
        </div>
        <div class="wordbook-info">
          <h4>${book.name}</h4>
          <p>${book.description}</p>
          <div class="wordbook-meta">
            <span><i class="bi bi-collection"></i> ${book.wordCount} 词</span>
            ${progress > 0 ? `<span><i class="bi bi-check-circle"></i> ${progress}%</span>` : ''}
          </div>
        </div>
        ${isStudying ? '<div class="studying-indicator"><i class="bi bi-check-lg"></i> 学习中</div>' : '<div class="select-indicator"><i class="bi bi-chevron-right"></i></div>'}
      </div>
    `;
  }

  private getBookIconClass(bookId: string): string {
    const colorMap: Record<string, string> = {
      'cet4': 'icon-blue',
      'cet6': 'icon-purple',
      'gk3500': 'icon-green',
      'ky': 'icon-orange'
    };
    return colorMap[bookId] || 'icon-blue';
  }

  private bindEvents() {
    // 选择词库按钮
    const selectDictBtn = this.container.querySelector('#btn-select-dict');
    if (selectDictBtn) {
      selectDictBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.showDictSelector();
      });
    }
    
    // 继续学习按钮
    const continueStudyBtn = this.container.querySelector('#btn-continue-study');
    if (continueStudyBtn) {
      continueStudyBtn.addEventListener('click', () => {
        const studyDict = this.store.getStudyDict();
        if (studyDict) {
          this.router.navigate('words-practice', { bookId: studyDict.id, mode: 'study' });
        }
      });
    }
    
    // 自由练习按钮
    const freePracticeBtn = this.container.querySelector('#btn-free-practice');
    if (freePracticeBtn) {
      freePracticeBtn.addEventListener('click', () => {
        const studyDict = this.store.getStudyDict();
        if (studyDict) {
          this.router.navigate('words-practice', { bookId: studyDict.id, mode: 'free' });
        }
      });
    }
    
    // 更改每日目标按钮
    const changeGoalBtn = this.container.querySelector('#btn-change-goal');
    if (changeGoalBtn) {
      changeGoalBtn.addEventListener('click', () => {
        this.showGoalDialog();
      });
    }
    
    // 更改进度按钮
    const changeProgressBtn = this.container.querySelector('#btn-change-progress');
    if (changeProgressBtn) {
      changeProgressBtn.addEventListener('click', () => {
        this.showProgressDialog();
      });
    }
    
    // 管理词典按钮
    const manageDictsBtn = this.container.querySelector('#btn-manage-dicts');
    if (manageDictsBtn) {
      manageDictsBtn.addEventListener('click', () => {
        this.showManageDialog();
      });
    }

    // 词库项点击
    this.container.querySelectorAll('.wordbook-item').forEach(item => {
      item.addEventListener('click', () => {
        const bookId = item.getAttribute('data-id');
        if (bookId) {
          this.showBookDetail(bookId);
        }
      });
    });
    
    // 用户词典项点击
    this.container.querySelectorAll('.user-dict-item').forEach(item => {
      item.addEventListener('click', () => {
        const dictId = item.getAttribute('data-id');
        if (dictId) {
          this.router.navigate('words-practice', { bookId: dictId, mode: 'free' });
        }
      });
    });
  }

  private showManageDialog() {
    const userDicts = this.store.getUserDicts();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    
    const renderDictContent = (dictId: string) => {
      const dict = this.store.getUserDicts().find(d => d.id === dictId);
      if (!dict) return '';
      if (dict.words.length === 0) return '<div class="empty-list">暂无单词</div>';
      
      return dict.words.map(word => `
        <div class="manage-word-item">
          <div class="word-info">
            <div class="word-text">${word.word}</div>
            <div class="word-meaning">${word.meaning}</div>
          </div>
          <button class="btn-icon text-danger btn-delete-word" data-id="${word.id}" title="删除">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `).join('');
    };

    modal.innerHTML = `
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3><i class="bi bi-gear"></i> 管理词库</h3>
          <button class="btn-close" id="close-modal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="manage-layout">
            <div class="manage-sidebar">
              ${userDicts.map((dict, index) => `
                <div class="manage-nav-item ${index === 0 ? 'active' : ''}" data-id="${dict.id}">
                  <i class="bi ${dict.icon}"></i> ${dict.name}
                  <span class="badge">${dict.words.length}</span>
                </div>
              `).join('')}
            </div>
            <div class="manage-content">
              <div class="dict-actions">
                 <button class="btn btn-primary btn-sm" id="btn-practice-dict">
                   <i class="bi bi-play-fill"></i> 练习此词库
                 </button>
              </div>
              <div class="word-list" id="manage-word-list">
                ${userDicts.length > 0 ? renderDictContent(userDicts[0].id) : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    let currentDictId = userDicts.length > 0 ? userDicts[0].id : '';

    const updateList = () => {
      const list = modal.querySelector('#manage-word-list');
      if (list) {
        list.innerHTML = renderDictContent(currentDictId);
        bindDeleteEvents();
      }
      // UPDATE BADGES
      userDicts.forEach(d => {
        const bg = modal.querySelector(`.manage-nav-item[data-id="${d.id}"] .badge`);
        if (bg) bg.textContent = this.store.getUserDicts().find(x => x.id === d.id)?.words.length.toString() || '0';
      });
    };

    const bindDeleteEvents = () => {
      modal.querySelectorAll('.btn-delete-word').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const wordId = btn.getAttribute('data-id');
          if (wordId && currentDictId) {
            this.store.removeWordFromUserDict(currentDictId, wordId);
            updateList();
            this.render(); // Refresh background
          }
        });
      });
    };

    bindDeleteEvents();

    modal.querySelectorAll('.manage-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        modal.querySelectorAll('.manage-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        currentDictId = item.getAttribute('data-id') || '';
        updateList();
      });
    });

    modal.querySelector('#btn-practice-dict')?.addEventListener('click', () => {
       if (currentDictId) {
         modal.remove();
         this.router.navigate('words-practice', { bookId: currentDictId, mode: 'free' });
       }
    });

    modal.querySelector('#close-modal')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
  }

  private showDictSelector() {
    const wordBooks = this.store.getWordBooks();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content modal-dict-selector">
        <div class="modal-header">
          <h3><i class="bi bi-book"></i> 选择词库</h3>
          <button class="btn-close" id="close-modal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="dict-selector-list">
            ${wordBooks.map(book => `
              <div class="dict-selector-item" data-id="${book.id}">
                <div class="dict-selector-icon ${this.getBookIconClass(book.id)}">
                  <i class="bi bi-book-half"></i>
                </div>
                <div class="dict-selector-info">
                  <h4>${book.name}</h4>
                  <p>${book.description}</p>
                </div>
                <div class="dict-selector-count">${book.wordCount} 词</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);

    modal.querySelector('#close-modal')?.addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelectorAll('.dict-selector-item').forEach(item => {
      item.addEventListener('click', async () => {
        const bookId = item.getAttribute('data-id');
        if (bookId) {
          this.store.setStudyDict(bookId);
          await this.wordService.loadWordBook(bookId);
          modal.remove();
          this.render();
        }
      });
    });
  }

  private showGoalDialog() {
    const studyDict = this.store.getStudyDict();
    if (!studyDict) return;

    const settings = this.store.getSettings();
    const currentGoal = studyDict.perDayStudyNumber || 40;
    const currentReviewGoal = settings.perDayReviewNumber || 40;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3><i class="bi bi-bullseye"></i> 每日目标</h3>
          <button class="btn-close" id="close-modal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="goal-input-group">
            <label>每天学习新词数量</label>
            <div class="goal-slider-group">
              <input type="range" id="goal-slider" value="${currentGoal}" min="10" max="200" step="10">
              <input type="number" id="goal-input" value="${currentGoal}" min="10" max="200" step="10">
            </div>
            <p class="goal-hint" id="goal-hint">预计 ${this.wordService.getRemainingDays(studyDict.id)} 天完成</p>
          </div>
          <div class="goal-input-group" style="margin-top: 24px;">
            <label>每天复习词数量</label>
            <div class="goal-slider-group">
              <input type="range" id="review-slider" value="${currentReviewGoal}" min="10" max="200" step="10">
              <input type="number" id="review-input" value="${currentReviewGoal}" min="10" max="200" step="10">
            </div>
            <p class="goal-hint">巩固已学过的单词</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" id="cancel-btn">取消</button>
          <button class="btn-primary" id="save-btn">保存</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);

    const input = modal.querySelector('#goal-input') as HTMLInputElement;
    const slider = modal.querySelector('#goal-slider') as HTMLInputElement;
    const reviewInput = modal.querySelector('#review-input') as HTMLInputElement;
    const reviewSlider = modal.querySelector('#review-slider') as HTMLInputElement;
    const hint = modal.querySelector('#goal-hint') as HTMLElement;

    const updateHint = () => {
      const book = this.store.getWordBook(studyDict.id);
      if (!book) return;
      const remaining = book.wordCount - (book.lastLearnIndex || 0);
      const days = Math.ceil(remaining / parseInt(input.value));
      hint.textContent = `预计 ${days} 天完成`;
    };

    input.addEventListener('input', () => {
      slider.value = input.value;
      updateHint();
    });

    slider.addEventListener('input', () => {
      input.value = slider.value;
      updateHint();
    });

    reviewInput.addEventListener('input', () => {
      reviewSlider.value = reviewInput.value;
    });

    reviewSlider.addEventListener('input', () => {
      reviewInput.value = reviewSlider.value;
    });

    modal.querySelector('#close-modal')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#cancel-btn')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#save-btn')?.addEventListener('click', () => {
      const newGoal = parseInt(input.value);
      const newReviewGoal = parseInt(reviewInput.value);
      if (newGoal >= 10 && newGoal <= 200) {
        this.store.updateWordBook(studyDict.id, { perDayStudyNumber: newGoal });
        this.store.updateSettings({ perDayReviewNumber: newReviewGoal });
        modal.remove();
        this.render();
      }
    });
  }

  private showProgressDialog() {
    const studyDict = this.store.getStudyDict();
    if (!studyDict) return;

    const currentIndex = studyDict.lastLearnIndex || 0;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3><i class="bi bi-skip-forward"></i> 调整进度</h3>
          <button class="btn-close" id="close-modal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="progress-input-group">
            <label>从第几个单词开始学习</label>
            <input type="number" id="progress-input" value="${currentIndex}" min="0" max="${studyDict.wordCount}">
            <p class="progress-hint">共 ${studyDict.wordCount} 个单词</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" id="cancel-btn">取消</button>
          <button class="btn-primary" id="save-btn">保存</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);

    modal.querySelector('#close-modal')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#cancel-btn')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#save-btn')?.addEventListener('click', () => {
      const input = modal.querySelector('#progress-input') as HTMLInputElement;
      const newIndex = parseInt(input.value);
      if (newIndex >= 0 && newIndex <= studyDict.wordCount) {
        const progress = Math.round(newIndex / studyDict.wordCount * 100);
        this.store.updateWordBookProgress(studyDict.id, progress, newIndex);
        modal.remove();
        this.render();
      }
    });
  }

  private showBookDetail(bookId: string) {
    const book = this.store.getWordBook(bookId);
    if (!book) return;

    const estimatedDate = this.wordService.getEstimatedCompletionDate(bookId);
    const days = this.wordService.getRemainingDays(bookId);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3><i class="bi bi-book"></i> ${book.name}</h3>
          <button class="btn-close" id="close-modal"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-body">
          <div class="book-detail-content">
            <p class="book-desc">${book.description}</p>
            <div class="book-stats-grid">
              <div class="book-stat">
                <div class="stat-value">${book.wordCount}</div>
                <div class="stat-label">总词数</div>
              </div>
              <div class="book-stat">
                <div class="stat-value">${days}</div>
                <div class="stat-label">预计天数</div>
              </div>
              <div class="book-stat">
                <div class="stat-value">${estimatedDate}</div>
                <div class="stat-label">完成日期</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" id="cancel-btn">取消</button>
          <button class="btn-primary" id="start-btn"><i class="bi bi-play-fill"></i> 开始学习</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);

    modal.querySelector('#close-modal')?.addEventListener('click', () => modal.remove());
    modal.querySelector('#cancel-btn')?.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    modal.querySelector('#start-btn')?.addEventListener('click', async () => {
      this.store.setStudyDict(bookId);
      await this.wordService.loadWordBook(bookId);
      modal.remove();
      this.render();
    });
  }
}
