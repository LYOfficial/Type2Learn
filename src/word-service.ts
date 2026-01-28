import * as XLSX from 'xlsx';
import { Word, WordBook, Store } from './store';

// Excel 列名映射
const COLUMN_MAP: { [key: string]: keyof Word } = {
  '单词': 'word',
  'word': 'word',
  'Word': 'word',
  '音标①': 'phonetic',
  '音标': 'phonetic',
  'phonetic': 'phonetic',
  '音标②': 'phonetic2',
  '翻译': 'meaning',
  '释义': 'meaning',
  'meaning': 'meaning',
  'translation': 'meaning',
  '例句': 'example',
  'example': 'example',
  '短语': 'phrase',
  'phrase': 'phrase',
  '近义词': 'synonym',
  'synonym': 'synonym',
  '同根词': 'cognate',
  'cognate': 'cognate',
  '词源': 'etymology',
  'etymology': 'etymology'
};

// 词库文件路径映射
const WORDBOOK_FILES: { [key: string]: string } = {
  'cet4': '/words/CET-4.xlsx',
  'cet6': '/words/CET-6.xlsx',
  'gk3500': '/words/gk3500.xlsx',
  'ky': '/words/ky3728.xlsx'
};

export class WordService {
  private store: Store;
  private loadedBooks: Set<string> = new Set();

  constructor(store: Store) {
    this.store = store;
  }

  // 加载词库数据
  async loadWordBook(bookId: string): Promise<Word[]> {
    const filePath = WORDBOOK_FILES[bookId];
    if (!filePath) {
      console.error(`Unknown wordbook: ${bookId}`);
      return [];
    }

    // 如果已加载过，直接返回
    const book = this.store.getWordBook(bookId);
    if (book && book.words.length > 0) {
      return book.words;
    }

    try {
      const response = await fetch(filePath);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // 读取第一个工作表
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // 转换为 JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (jsonData.length === 0) {
        return [];
      }

      // 获取表头
      const headers = jsonData[0] as string[];
      const columnIndices: { [key: string]: number } = {};
      
      headers.forEach((header, index) => {
        const normalizedHeader = String(header).trim();
        if (COLUMN_MAP[normalizedHeader]) {
          columnIndices[COLUMN_MAP[normalizedHeader]] = index;
        }
      });

      // 解析数据行
      const words: Word[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (!row || !row[columnIndices['word']]) continue;

        const word: Word = {
          id: `${bookId}-${i}`,
          word: String(row[columnIndices['word']] || '').trim(),
          meaning: String(row[columnIndices['meaning']] || '').trim()
        };

        // 添加可选字段
        if (columnIndices['phonetic'] !== undefined) {
          word.phonetic = String(row[columnIndices['phonetic']] || '').trim();
        }
        if (columnIndices['phonetic2'] !== undefined) {
          word.phonetic2 = String(row[columnIndices['phonetic2']] || '').trim();
        }
        if (columnIndices['example'] !== undefined) {
          word.example = String(row[columnIndices['example']] || '').trim();
        }
        if (columnIndices['phrase'] !== undefined) {
          word.phrase = String(row[columnIndices['phrase']] || '').trim();
        }
        if (columnIndices['synonym'] !== undefined) {
          word.synonym = String(row[columnIndices['synonym']] || '').trim();
        }
        if (columnIndices['cognate'] !== undefined) {
          word.cognate = String(row[columnIndices['cognate']] || '').trim();
        }
        if (columnIndices['etymology'] !== undefined) {
          word.etymology = String(row[columnIndices['etymology']] || '').trim();
        }

        if (word.word) {
          words.push(word);
        }
      }

      // 更新 store 中的词库
      this.store.updateWordBook(bookId, {
        words,
        wordCount: words.length
      });
      this.loadedBooks.add(bookId);

      return words;
    } catch (error) {
      console.error(`Failed to load wordbook ${bookId}:`, error);
      return [];
    }
  }

  // 预加载所有默认词库的词数
  async preloadWordCounts(): Promise<void> {
    for (const [bookId, filePath] of Object.entries(WORDBOOK_FILES)) {
      const book = this.store.getWordBook(bookId);
      if (book && book.wordCount === 0) {
        try {
          const response = await fetch(filePath);
          const arrayBuffer = await response.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          // 更新词数（减去表头）
          const wordCount = jsonData.length - 1;
          this.store.updateWordBook(bookId, { wordCount });
        } catch (error) {
          console.error(`Failed to preload word count for ${bookId}:`, error);
        }
      }
    }
  }

  // 检查词库是否已加载
  isBookLoaded(bookId: string): boolean {
    return this.loadedBooks.has(bookId);
  }

  // 获取今日学习任务
  getTodayStudyTask(bookId: string) {
    return this.store.getTodayTask(bookId);
  }

  // 获取预计完成日期
  getEstimatedCompletionDate(bookId: string): string {
    return this.store.getEstimatedCompletionDate(bookId);
  }

  // 计算剩余天数
  getRemainingDays(bookId: string): number {
    const book = this.store.getWordBook(bookId);
    if (!book) return 0;
    
    const remainingWords = book.wordCount - (book.lastLearnIndex || 0);
    const perDay = book.perDayStudyNumber || 40;
    return Math.ceil(remainingWords / perDay);
  }
}
