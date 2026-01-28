// 单词类型 - 扩展版，支持完整的单词信息
export interface Word {
  id: string;
  word: string;
  phonetic?: string;      // 音标①
  phonetic2?: string;     // 音标②
  meaning: string;        // 翻译/释义
  example?: string;       // 例句
  phrase?: string;        // 短语
  synonym?: string;       // 近义词
  cognate?: string;       // 同根词
  etymology?: string;     // 词源
}

// 学习记录
export interface WordLearningRecord {
  wordId: string;
  word: string;
  learnedAt: number;      // 学习时间
  reviewCount: number;    // 复习次数
  correctCount: number;   // 正确次数
  wrongCount: number;     // 错误次数
  nextReviewAt: number;   // 下次复习时间
  mastered: boolean;      // 是否已掌握
}

// 每日学习统计
export interface DailyStats {
  date: string;           // YYYY-MM-DD
  newWords: number;       // 新学单词数
  reviewWords: number;    // 复习单词数
  correctCount: number;   // 正确次数
  wrongCount: number;     // 错误次数
  studyTime: number;      // 学习时长(秒)
}

// 单词本
export interface WordBook {
  id: string;
  name: string;
  description: string;
  words: Word[];
  wordCount: number;           // 总词数
  progress: number;            // 进度百分比
  lastPractice?: number;       // 上次练习时间
  lastLearnIndex: number;      // 上次学习位置
  perDayStudyNumber: number;   // 每日学习新词数
  complete: boolean;           // 是否已学完
  custom?: boolean;            // 是否为自定义词库
}

// 用户词典（收藏、错词、已掌握等）
export interface UserDict {
  id: string;
  name: string;
  icon: string;
  words: Word[];
}

// 古诗类型
export interface Poetry {
  id: string;
  title: string;
  author: string;
  dynasty?: string;
  content: string[];
  translation?: string[];
}

// 古诗集
export interface PoetryBook {
  id: string;
  name: string;
  description: string;
  poems: Poetry[];
  progress: number;
  lastPractice?: number;
}

// 自定义默写项
export interface CustomItem {
  id: string;
  content: string;
  hint?: string;
}

// 自定义默写库
export interface CustomBook {
  id: string;
  name: string;
  description: string;
  items: CustomItem[];
  progress: number;
  lastPractice?: number;
}

// 应用状态
export interface AppState {
  wordBooks: WordBook[];
  poetryBooks: PoetryBook[];
  customBooks: CustomBook[];
  currentWordBookId?: string;
  currentPoetryBookId?: string;
  currentCustomBookId?: string;
  settings: AppSettings;
  // 新增：单词学习相关
  userDicts: UserDict[];           // 用户词典（收藏、错词、已掌握）
  learningRecords: WordLearningRecord[]; // 学习记录
  dailyStats: DailyStats[];        // 每日统计
  studyDictId?: string;            // 当前正在学习的词典ID
  wordReviewRatio: number;         // 复习比例
}

// 应用设置
export interface AppSettings {
  soundEnabled: boolean;
  autoNext: boolean;
  showHint: boolean;
  practiceCount: number;
  perDayStudyNumber: number;       // 每日学习新词数，默认40
}

// 默认单词本数据 - 四大默认词库
const defaultWordBooks: WordBook[] = [
  {
    id: 'cet4',
    name: 'CET-4',
    description: '大学英语四级词汇',
    progress: 0,
    wordCount: 2607,
    words: [],
    lastLearnIndex: 0,
    perDayStudyNumber: 40,
    complete: false,
    custom: false
  },
  {
    id: 'cet6',
    name: 'CET-6',
    description: '大学英语六级词汇',
    progress: 0,
    wordCount: 2345,
    words: [],
    lastLearnIndex: 0,
    perDayStudyNumber: 40,
    complete: false,
    custom: false
  },
  {
    id: 'gk3500',
    name: '高考3500词',
    description: '高考英语核心词汇',
    progress: 0,
    wordCount: 3893,
    words: [],
    lastLearnIndex: 0,
    perDayStudyNumber: 40,
    complete: false,
    custom: false
  },
  {
    id: 'ky',
    name: '考研英语',
    description: '考研英语词汇',
    progress: 0,
    wordCount: 3728,
    words: [],
    lastLearnIndex: 0,
    perDayStudyNumber: 40,
    complete: false,
    custom: false
  }
];

// 默认用户词典
const defaultUserDicts: UserDict[] = [
  { id: 'collect', name: '收藏', icon: 'bi-star', words: [] },
  { id: 'wrong', name: '错词', icon: 'bi-x-circle', words: [] },
  { id: 'mastered', name: '已掌握', icon: 'bi-check-circle', words: [] }
];

// 默认古诗数据
const defaultPoetryBooks: PoetryBook[] = [
  {
    id: 'tangshi',
    name: '唐诗三百首精选',
    description: '唐代经典诗歌精选',
    progress: 0,
    poems: [
      {
        id: '1',
        title: '静夜思',
        author: '李白',
        dynasty: '唐',
        content: ['床前明月光，', '疑是地上霜。', '举头望明月，', '低头思故乡。'],
        translation: ['明亮的月光洒在床前，', '好像地上泛起了一层霜。', '我抬起头望着那天上的明月，', '不由得低下头来思念起故乡。']
      },
      {
        id: '2',
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐',
        content: ['春眠不觉晓，', '处处闻啼鸟。', '夜来风雨声，', '花落知多少。'],
        translation: ['春天睡眠正好，不知不觉天就亮了，', '醒来听到处处都有鸟儿在啼叫。', '想起昨夜曾听到风雨的声音，', '不知道有多少花儿被吹落了呢？']
      },
      {
        id: '3',
        title: '登鹳雀楼',
        author: '王之涣',
        dynasty: '唐',
        content: ['白日依山尽，', '黄河入海流。', '欲穷千里目，', '更上一层楼。'],
        translation: ['夕阳依傍着山峰慢慢沉没，', '滔滔黄河朝着大海汹涌奔流。', '想要看到千里之外的风光，', '那就要再登上更高的一层城楼。']
      },
      {
        id: '4',
        title: '相思',
        author: '王维',
        dynasty: '唐',
        content: ['红豆生南国，', '春来发几枝。', '愿君多采撷，', '此物最相思。'],
        translation: ['红豆生长在南方的土地上，', '每逢春天就长出新的枝条。', '希望你多多采摘一些吧，', '它最能寄托相思之情。']
      },
      {
        id: '5',
        title: '江雪',
        author: '柳宗元',
        dynasty: '唐',
        content: ['千山鸟飞绝，', '万径人踪灭。', '孤舟蓑笠翁，', '独钓寒江雪。'],
        translation: ['所有的山上，飞鸟的身影已经绝迹，', '所有的小路，都不见行人的踪迹。', '江面上有一叶孤舟，一个披着蓑戴着笠的老翁，', '独自在大雪覆盖的寒冷江面上垂钓。']
      }
    ]
  },
  {
    id: 'songci',
    name: '宋词精选',
    description: '宋代经典词作精选',
    progress: 0,
    poems: [
      {
        id: '1',
        title: '水调歌头·明月几时有',
        author: '苏轼',
        dynasty: '宋',
        content: [
          '明月几时有？把酒问青天。',
          '不知天上宫阙，今夕是何年。',
          '我欲乘风归去，又恐琼楼玉宇，高处不胜寒。',
          '起舞弄清影，何似在人间。',
          '转朱阁，低绮户，照无眠。',
          '不应有恨，何事长向别时圆？',
          '人有悲欢离合，月有阴晴圆缺，此事古难全。',
          '但愿人长久，千里共婵娟。'
        ]
      },
      {
        id: '2',
        title: '如梦令',
        author: '李清照',
        dynasty: '宋',
        content: [
          '昨夜雨疏风骤，',
          '浓睡不消残酒。',
          '试问卷帘人，',
          '却道海棠依旧。',
          '知否，知否？',
          '应是绿肥红瘦。'
        ]
      }
    ]
  },
  {
    id: 'xiaoxue',
    name: '小学必背古诗',
    description: '小学阶段必背古诗词',
    progress: 0,
    poems: [
      {
        id: '1',
        title: '咏鹅',
        author: '骆宾王',
        dynasty: '唐',
        content: ['鹅，鹅，鹅，', '曲项向天歌。', '白毛浮绿水，', '红掌拨清波。']
      },
      {
        id: '2',
        title: '悯农',
        author: '李绅',
        dynasty: '唐',
        content: ['锄禾日当午，', '汗滴禾下土。', '谁知盘中餐，', '粒粒皆辛苦。']
      }
    ]
  }
];

export class Store {
  private state: AppState = {
    wordBooks: [],
    poetryBooks: [],
    customBooks: [],
    userDicts: [],
    learningRecords: [],
    dailyStats: [],
    wordReviewRatio: 1,
    settings: {
      soundEnabled: true,
      autoNext: true,
      showHint: true,
      practiceCount: 20,
      perDayStudyNumber: 40
    }
  };

  async init() {
    // 从 localStorage 加载数据
    const savedState = localStorage.getItem('type2learn-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }

    // 总是使用默认词库列表，但保留用户的学习进度
    const oldWordBooks = this.state.wordBooks;
    this.state.wordBooks = defaultWordBooks.map(defaultBook => {
      const oldBook = oldWordBooks.find(b => b.id === defaultBook.id);
      if (oldBook) {
        // 保留用户进度，但使用新的名称和描述
        return {
          ...defaultBook,
          progress: oldBook.progress,
          lastLearnIndex: oldBook.lastLearnIndex,
          lastPractice: oldBook.lastPractice,
          words: oldBook.words
        };
      }
      return defaultBook;
    });

    if (this.state.poetryBooks.length === 0) {
      this.state.poetryBooks = defaultPoetryBooks;
    }
    if (!this.state.userDicts || this.state.userDicts.length === 0) {
      this.state.userDicts = defaultUserDicts;
    }

    this.save();
  }

  private save() {
    localStorage.setItem('type2learn-state', JSON.stringify(this.state));
  }

  // 获取所有单词本
  getWordBooks(): WordBook[] {
    return this.state.wordBooks;
  }

  // 获取单个单词本
  getWordBook(id: string): WordBook | undefined {
    return this.state.wordBooks.find(book => book.id === id);
  }

  // 更新单词本
  updateWordBook(id: string, updates: Partial<WordBook>) {
    const book = this.state.wordBooks.find(b => b.id === id);
    if (book) {
      Object.assign(book, updates);
      this.save();
    }
  }

  // 更新单词本进度
  updateWordBookProgress(id: string, progress: number, lastLearnIndex?: number) {
    const book = this.state.wordBooks.find(b => b.id === id);
    if (book) {
      book.progress = progress;
      book.lastPractice = Date.now();
      if (lastLearnIndex !== undefined) {
        book.lastLearnIndex = lastLearnIndex;
      }
      if (progress >= 100) {
        book.complete = true;
      }
      this.save();
    }
  }

  // 设置当前学习的词典
  setStudyDict(id: string) {
    this.state.studyDictId = id;
    this.save();
  }

  // 获取当前学习的词典
  getStudyDict(): WordBook | undefined {
    if (!this.state.studyDictId) return undefined;
    return this.state.wordBooks.find(b => b.id === this.state.studyDictId);
  }

  // 获取用户词典
  getUserDicts(): UserDict[] {
    return this.state.userDicts || [];
  }

  // 获取单个用户词典
  getUserDict(id: string): UserDict | undefined {
    return this.state.userDicts?.find(d => d.id === id);
  }

  // 添加单词到用户词典
  addWordToUserDict(dictId: string, word: Word) {
    const dict = this.state.userDicts?.find(d => d.id === dictId);
    if (dict && !dict.words.find(w => w.word === word.word)) {
      dict.words.push(word);
      this.save();
    }
  }

  // 从用户词典移除单词
  removeWordFromUserDict(dictId: string, wordId: string) {
    const dict = this.state.userDicts?.find(d => d.id === dictId);
    if (dict) {
      dict.words = dict.words.filter(w => w.id !== wordId);
      this.save();
    }
  }

  // 记录学习数据
  recordLearning(wordId: string, word: string, correct: boolean) {
    let record = this.state.learningRecords.find(r => r.wordId === wordId);
    if (!record) {
      record = {
        wordId,
        word,
        learnedAt: Date.now(),
        reviewCount: 0,
        correctCount: 0,
        wrongCount: 0,
        nextReviewAt: Date.now() + 24 * 60 * 60 * 1000, // 1天后复习
        mastered: false
      };
      this.state.learningRecords.push(record);
    }
    
    record.reviewCount++;
    if (correct) {
      record.correctCount++;
      // 计算下次复习时间（艾宾浩斯遗忘曲线）
      const intervals = [1, 2, 4, 7, 15, 30]; // 天数
      const level = Math.min(record.correctCount, intervals.length - 1);
      record.nextReviewAt = Date.now() + intervals[level] * 24 * 60 * 60 * 1000;
      if (record.correctCount >= 5) {
        record.mastered = true;
      }
    } else {
      record.wrongCount++;
      record.nextReviewAt = Date.now() + 24 * 60 * 60 * 1000; // 错了就明天复习
    }
    
    this.save();
  }

  // 获取今日任务
  getTodayTask(bookId: string): { newWords: Word[], reviewWords: Word[], reviewAllWords: Word[] } {
    const book = this.getWordBook(bookId);
    if (!book || !book.words.length) {
      return { newWords: [], reviewWords: [], reviewAllWords: [] };
    }

    const perDay = book.perDayStudyNumber || this.state.settings.perDayStudyNumber || 40;
    const now = Date.now();
    const today = new Date().toDateString();
    
    // 获取新词：从lastLearnIndex开始取perDay个
    const startIndex = book.lastLearnIndex || 0;
    const newWords = book.words.slice(startIndex, startIndex + perDay);
    
    // 获取需要复习的单词（上次学习的）
    const reviewStartIndex = Math.max(0, startIndex - perDay);
    const reviewWords = book.words.slice(reviewStartIndex, startIndex);
    
    // 获取之前所有需要复习的单词
    const reviewAllWords = this.state.learningRecords
      .filter(r => r.nextReviewAt <= now && !r.mastered)
      .map(r => book.words.find(w => w.id === r.wordId))
      .filter(w => w) as Word[];
    
    return { newWords, reviewWords, reviewAllWords };
  }

  // 计算预计完成日期
  getEstimatedCompletionDate(bookId: string): string {
    const book = this.getWordBook(bookId);
    if (!book) return '-';
    
    const remainingWords = book.wordCount - (book.lastLearnIndex || 0);
    const perDay = book.perDayStudyNumber || this.state.settings.perDayStudyNumber || 40;
    const daysNeeded = Math.ceil(remainingWords / perDay);
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysNeeded);
    
    return `${completionDate.getFullYear()}-${String(completionDate.getMonth() + 1).padStart(2, '0')}-${String(completionDate.getDate()).padStart(2, '0')}`;
  }

  // 获取学习进度
  getStudyProgress(bookId: string): number {
    const book = this.getWordBook(bookId);
    if (!book || !book.wordCount) return 0;
    return Math.round((book.lastLearnIndex || 0) / book.wordCount * 100);
  }

  // 更新每日统计
  updateDailyStats(newWords: number, reviewWords: number, correct: number, wrong: number, time: number) {
    const today = new Date().toISOString().split('T')[0];
    let stat = this.state.dailyStats.find(s => s.date === today);
    if (!stat) {
      stat = { date: today, newWords: 0, reviewWords: 0, correctCount: 0, wrongCount: 0, studyTime: 0 };
      this.state.dailyStats.push(stat);
    }
    stat.newWords += newWords;
    stat.reviewWords += reviewWords;
    stat.correctCount += correct;
    stat.wrongCount += wrong;
    stat.studyTime += time;
    this.save();
  }

  // 获取所有古诗集
  getPoetryBooks(): PoetryBook[] {
    return this.state.poetryBooks;
  }

  // 获取单个古诗集
  getPoetryBook(id: string): PoetryBook | undefined {
    return this.state.poetryBooks.find(book => book.id === id);
  }

  // 更新古诗集进度
  updatePoetryBookProgress(id: string, progress: number) {
    const book = this.state.poetryBooks.find(b => b.id === id);
    if (book) {
      book.progress = progress;
      book.lastPractice = Date.now();
      this.save();
    }
  }

  // 获取所有自定义库
  getCustomBooks(): CustomBook[] {
    return this.state.customBooks;
  }

  // 获取单个自定义库
  getCustomBook(id: string): CustomBook | undefined {
    return this.state.customBooks.find(book => book.id === id);
  }

  // 添加自定义库
  addCustomBook(book: CustomBook) {
    this.state.customBooks.push(book);
    this.save();
  }

  // 删除自定义库
  deleteCustomBook(id: string) {
    this.state.customBooks = this.state.customBooks.filter(b => b.id !== id);
    this.save();
  }

  // 更新自定义库进度
  updateCustomBookProgress(id: string, progress: number) {
    const book = this.state.customBooks.find(b => b.id === id);
    if (book) {
      book.progress = progress;
      book.lastPractice = Date.now();
      this.save();
    }
  }

  // 获取设置
  getSettings(): AppSettings {
    return this.state.settings;
  }

  // 更新设置
  updateSettings(settings: Partial<AppSettings>) {
    this.state.settings = { ...this.state.settings, ...settings };
    this.save();
  }
}
