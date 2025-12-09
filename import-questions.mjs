import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Скрипт для парсинга файлов вопросов из папки /questions
 * и обновления questions-data.json
 * 
 * Используй: node import-questions.mjs
 */

function extractCategory(filename: string): string {
  const categoryMap: { [key: string]: string } = {
    // JavaScript & основы
    'javascript': 'javascript',
    'замыкание': 'javascript',
    'прототип': 'javascript',
    'this': 'javascript',
    
    // React
    'react': 'react',
    'хук': 'react',
    'компонент': 'react',
    'memo': 'react',
    'useeffect': 'react',
    
    // Асинхронность
    'async': 'asynchronous',
    'promise': 'asynchronous',
    'await': 'asynchronous',
    'event loop': 'asynchronous',
    'микротаск': 'asynchronous',
    'макротаск': 'asynchronous',
    
    // TypeScript
    'typescript': 'typescript',
    'type': 'typescript',
    'interface': 'typescript',
    'generic': 'typescript',
    
    // CSS
    'css': 'css',
    'flexbox': 'css',
    'grid': 'css',
    'bem': 'css',
    'специфичность': 'css',
    
    // HTTP & API
    'http': 'http',
    'rest': 'http',
    'cors': 'http',
    'websocket': 'http',
    'запрос': 'http',
    
    // Производительность
    'производительность': 'performance',
    'оптимизация': 'performance',
    'кэш': 'performance',
    'бандл': 'performance',
    
    // Git
    'git': 'git',
    'merge': 'git',
    'rebase': 'git',
    'commit': 'git',
    
    // Тестирование
    'тест': 'testing',
    'jest': 'testing',
    'unit': 'testing',
    
    // Алгоритмы
    'алгоритм': 'algorithms',
    'сложность': 'algorithms',
    'поиск': 'algorithms',
    'сортировка': 'algorithms',
  };

  const lowerFilename = filename.toLowerCase();
  
  for (const [keyword, category] of Object.entries(categoryMap)) {
    if (lowerFilename.includes(keyword)) {
      return category;
    }
  }

  return 'javascript'; // Default category
}

function generateAnswer(filename: string): string {
  // Если нужно реально парсить .docx файлы, используй библиотеку mammoth
  // Здесь просто возвращаем плейсхолдер
  return `Полный ответ на этот вопрос находится в файле ${filename}. Для импорта содержимого из .docx файлов используй библиотеку mammoth.`;
}

function importQuestions(): void {
  const questionsDir = path.join(__dirname, 'questions');
  const dataPath = path.join(__dirname, 'questions-data.json');

  // Проверяем существование папки
  if (!fs.existsSync(questionsDir)) {
    console.log('❌ Папка /questions не найдена');
    return;
  }

  // Читаем текущие данные
  let data = {
    categories: [],
    questions: [] as any[],
  };

  if (fs.existsSync(dataPath)) {
    const content = fs.readFileSync(dataPath, 'utf-8');
    data = JSON.parse(content);
  }

  // Читаем все .docx файлы
  const files = fs.readdirSync(questionsDir)
    .filter(f => f.endsWith('.docx'))
    .sort();

  if (files.length === 0) {
    console.log('⚠️  Нет .docx файлов в папке /questions');
    return;
  }

  const newQuestions = files.map((filename, index) => {
    const categoryId = extractCategory(filename);
    const title = filename.replace(/\.docx$/, '').replace(/^\d+\.\s*/, '');
    const answer = generateAnswer(filename);

    return {
      id: (data.questions.length || 0) + index + 1,
      categoryId,
      title,
      answer,
    };
  });

  // Добавляем новые вопросы
  data.questions.push(...newQuestions);

  // Убираем дубликаты по названию
  const uniqueQuestions = new Map();
  data.questions.forEach(q => {
    if (!uniqueQuestions.has(q.title)) {
      uniqueQuestions.set(q.title, q);
    }
  });

  // Перепрессиваем ID
  let id = 1;
  data.questions = Array.from(uniqueQuestions.values()).map(q => ({
    ...q,
    id: id++,
  }));

  // Сортируем по категориям
  data.questions.sort((a, b) => {
    const catCompare = a.categoryId.localeCompare(b.categoryId);
    return catCompare !== 0 ? catCompare : a.title.localeCompare(b.title);
  });

  // Сохраняем
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

  console.log('✅ Успешно!');
  console.log(`📊 Добавлено: ${newQuestions.length} новых вопросов`);
  console.log(`📋 Всего вопросов: ${data.questions.length}`);
  console.log(`📁 Файл сохранён: ${dataPath}`);
  console.log('\n📌 Категории:');
  data.categories.forEach(cat => {
    const count = data.questions.filter(q => q.categoryId === cat.id).length;
    console.log(`   ${cat.name}: ${count} вопросов`);
  });
}

importQuestions();
