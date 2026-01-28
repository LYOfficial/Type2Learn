// 单词类型
export interface Word {
  id: string;
  word: string;
  phonetic?: string;
  meaning: string;
  example?: string;
}

// 单词本
export interface WordBook {
  id: string;
  name: string;
  description: string;
  words: Word[];
  progress: number;
  lastPractice?: number;
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
}

// 应用设置
export interface AppSettings {
  soundEnabled: boolean;
  autoNext: boolean;
  showHint: boolean;
  practiceCount: number;
}

// 默认单词本数据
const defaultWordBooks: WordBook[] = [
  {
    id: 'cet4',
    name: 'CET-4 核心词汇',
    description: '大学英语四级核心词汇 2000 词',
    progress: 0,
    words: [
      { id: '1', word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃，遗弃' },
      { id: '2', word: 'ability', phonetic: '/əˈbɪləti/', meaning: 'n. 能力，才能' },
      { id: '3', word: 'abroad', phonetic: '/əˈbrɔːd/', meaning: 'adv. 在国外' },
      { id: '4', word: 'absence', phonetic: '/ˈæbsəns/', meaning: 'n. 缺席，缺乏' },
      { id: '5', word: 'absolute', phonetic: '/ˈæbsəluːt/', meaning: 'adj. 绝对的，完全的' },
      { id: '6', word: 'absorb', phonetic: '/əbˈzɔːrb/', meaning: 'v. 吸收，吸引' },
      { id: '7', word: 'abstract', phonetic: '/ˈæbstrækt/', meaning: 'adj. 抽象的 n. 摘要' },
      { id: '8', word: 'abundant', phonetic: '/əˈbʌndənt/', meaning: 'adj. 丰富的，充裕的' },
      { id: '9', word: 'academic', phonetic: '/ˌækəˈdemɪk/', meaning: 'adj. 学术的，学院的' },
      { id: '10', word: 'accelerate', phonetic: '/əkˈseləreɪt/', meaning: 'v. 加速，促进' },
    ]
  },
  {
    id: 'cet6',
    name: 'CET-6 核心词汇',
    description: '大学英语六级核心词汇 2500 词',
    progress: 0,
    words: [
      { id: '1', word: 'abolish', phonetic: '/əˈbɒlɪʃ/', meaning: 'v. 废除，取消' },
      { id: '2', word: 'abrupt', phonetic: '/əˈbrʌpt/', meaning: 'adj. 突然的，唐突的' },
      { id: '3', word: 'absurd', phonetic: '/əbˈsɜːrd/', meaning: 'adj. 荒谬的，可笑的' },
      { id: '4', word: 'accumulate', phonetic: '/əˈkjuːmjəleɪt/', meaning: 'v. 积累，积聚' },
      { id: '5', word: 'accurate', phonetic: '/ˈækjərət/', meaning: 'adj. 准确的，精确的' },
    ]
  },
  {
    id: 'ielts',
    name: '雅思核心词汇',
    description: '雅思考试高频词汇 3000 词',
    progress: 0,
    words: [
      { id: '1', word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', meaning: 'v. 承认，感谢' },
      { id: '2', word: 'acquire', phonetic: '/əˈkwaɪər/', meaning: 'v. 获得，学到' },
      { id: '3', word: 'adapt', phonetic: '/əˈdæpt/', meaning: 'v. 适应，改编' },
      { id: '4', word: 'adequate', phonetic: '/ˈædɪkwət/', meaning: 'adj. 足够的，适当的' },
      { id: '5', word: 'adjacent', phonetic: '/əˈdʒeɪsnt/', meaning: 'adj. 邻近的，毗连的' },
    ]
  }
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
    settings: {
      soundEnabled: true,
      autoNext: true,
      showHint: true,
      practiceCount: 20
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

    // 如果没有数据，使用默认数据
    if (this.state.wordBooks.length === 0) {
      this.state.wordBooks = defaultWordBooks;
    }
    if (this.state.poetryBooks.length === 0) {
      this.state.poetryBooks = defaultPoetryBooks;
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

  // 更新单词本进度
  updateWordBookProgress(id: string, progress: number) {
    const book = this.state.wordBooks.find(b => b.id === id);
    if (book) {
      book.progress = progress;
      book.lastPractice = Date.now();
      this.save();
    }
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
