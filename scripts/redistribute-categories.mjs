import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./src/questions-data.json', 'utf-8'));

// Новые категории на русском
const newCategories = [
  {
    id: 1,
    name: 'Основы JavaScript',
    slug: 'javascript-basics',
    color: '#F7DF1E',
  },
  { id: 2, name: 'React', slug: 'react', color: '#61DAFB' },
  {
    id: 3,
    name: 'Асинхронность & Promises',
    slug: 'async-promises',
    color: '#FF6B6B',
  },
  { id: 4, name: 'TypeScript & Типы', slug: 'typescript', color: '#3178C6' },
  { id: 5, name: 'CSS & Дизайн', slug: 'css-design', color: '#1572B6' },
  { id: 6, name: 'HTTP & Сеть', slug: 'http-network', color: '#0099CC' },
  {
    id: 7,
    name: 'Архитектура & Паттерны',
    slug: 'architecture-patterns',
    color: '#9933FF',
  },
  {
    id: 8,
    name: 'Производительность & Оптимизация',
    slug: 'performance',
    color: '#FF9900',
  },
  {
    id: 9,
    name: 'Git & Версионирование',
    slug: 'git-version-control',
    color: '#F1502F',
  },
];

// Ключевые слова для переклассификации
const categoryKeywords = {
  'async-promises': [
    'асинхрон',
    'promise',
    'async',
    'await',
    'callback',
    'микротаск',
    'макротаск',
    'event loop',
    'then',
    'catch',
    'finally',
  ],
  react: [
    'react',
    'component',
    'компонент',
    'jsx',
    'hook',
    'redux',
    'context',
    'useState',
    'useEffect',
    'props',
    'render',
  ],
  typescript: [
    'typescript',
    'ts',
    'type',
    'interface',
    'generic',
    'enum',
    'тип',
    'интерфейс',
    'декоратор',
    'type safe',
  ],
  'css-design': [
    'css',
    'стиль',
    'layout',
    'grid',
    'flexbox',
    'animation',
    'responsive',
    'design',
    'html',
    'sass',
    'бем',
  ],
  'http-network': [
    'http',
    'fetch',
    'api',
    'request',
    'response',
    'cors',
    'cookie',
    'header',
    'rest',
    'websocket',
    'csp',
    'same-origin',
  ],
  'architecture-patterns': [
    'паттерн',
    'pattern',
    'архитектур',
    'структур',
    'solid',
    'clean code',
    'принцип',
    'dry',
    'kiss',
    'monorepo',
    'микрофронтенд',
  ],
  performance: [
    'производител',
    'performance',
    'оптимиз',
    'optimize',
    'bundle',
    'bundler',
    'webpack',
    'vite',
    'минификац',
    'compression',
    'caching',
    'memory',
  ],
  'git-version-control': [
    'git',
    'version',
    'версион',
    'commit',
    'branch',
    'merge',
    'rebase',
    'conflict',
  ],
  'javascript-basics': [
    'javascript',
    'js',
    'переменн',
    'function',
    'функци',
    'object',
    'array',
    'string',
    'number',
    'scope',
    'closure',
    'this',
    'prototype',
    'es6',
    'spread',
    'destructur',
    'map',
    'filter',
    'reduce',
  ],
};

// Переклассифицировать вопросы
const generalQuestions = data.questions.filter(
  (q) => q.categorySlug === 'general' || q.categoryId === 1
);
console.log(`Обработка ${generalQuestions.length} вопросов из General...`);

let redistributed = 0;

generalQuestions.forEach((question) => {
  const fullText = (
    question.title +
    ' ' +
    (question.answer || '')
  ).toLowerCase();

  // Ищем лучшую категорию
  let bestCategory = 'javascript-basics'; // по умолчанию
  let maxMatches = 0;

  for (const [slug, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter((kw) =>
      fullText.includes(kw.toLowerCase())
    ).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = slug;
    }
  }

  // Если найдена категория, обновляем
  if (bestCategory !== 'javascript-basics' || maxMatches > 0) {
    const newCat = newCategories.find((c) => c.slug === bestCategory);
    question.categoryId = newCat.id;
    question.categorySlug = newCat.slug;
    redistributed++;
  }
});

// Обновляем категории
data.categories = newCategories;

// Сохраняем
fs.writeFileSync('./src/questions-data.json', JSON.stringify(data, null, 2));

console.log(`✅ Переклассифицировано: ${redistributed} вопросов`);

// Статистика
console.log('\nНовое распределение:');
newCategories.forEach((cat) => {
  const count = data.questions.filter(
    (q) => q.categorySlug === cat.slug
  ).length;
  console.log(`- ${cat.name} (${cat.slug}): ${count} вопросов`);
});
