import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';

const questionsDir = './questions';
const dataFile = './src/questions-data.json';

// Загружаем текущие данные
const currentData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const questions = currentData.questions;

// Ищем обрезанные ответы - те, которые заканчиваются на неполные строки
const truncatedQuestions = questions.filter((q) => {
  const lastChar = q.answer.trim().slice(-1);
  // Проверяем, заканчивается ли на скобке или очень коротко
  return (
    q.answer.length < 2000 ||
    q.answer.trim().endsWith('{') ||
    q.answer.trim().endsWith('(') ||
    q.answer.trim().endsWith('try {') ||
    (q.answer.includes('const fetch') && !q.answer.includes('userData'))
  );
});

console.log(
  `🔍 Найдено ${truncatedQuestions.length} потенциально обрезанных ответов`
);

let fixed = 0;

// Обработка обрезанных ответов
async function processAllQuestions() {
  for (const question of truncatedQuestions) {
    try {
      // Находим файл по названию
      const searchTitle = question.title.split('?')[0].trim();

      const files = fs.readdirSync(questionsDir);
      const matchingFile = files.find((f) =>
        f.toLowerCase().includes(searchTitle.toLowerCase().substring(0, 20))
      );

      if (!matchingFile) continue;

      const filePath = path.join(questionsDir, matchingFile);
      const result = await mammoth.extractRawText({ path: filePath });
      const rawText = result.value;

      if (rawText.length > question.answer.length) {
        console.log(
          `✏️ Восстанавливаю Q${question.id}: ${question.title.substring(0, 50)}...`
        );
        console.log(
          `   Было: ${question.answer.length} → Будет: ${rawText.length} символов`
        );

        // Преобразуем в красивый формат
        let formatted = formatAnswer(rawText);
        question.answer = formatted;
        fixed++;
      }
    } catch (error) {
      // Молча пропускаем ошибки
    }
  }
}

await processAllQuestions();

console.log(`\n✅ Восстановлено ${fixed} ответов`);

// Сохраняем обновленные данные
currentData.questions = questions;
currentData.generatedAt = new Date().toISOString();
fs.writeFileSync(dataFile, JSON.stringify(currentData, null, 2), 'utf8');

console.log(`✅ Файл обновлен: ${dataFile}`);

function formatAnswer(text) {
  // Удаляем лишние пробелы в начале/конце
  text = text.trim();

  // Добавляем структуру с заголовками если их нет
  if (!text.includes('## 🎯')) {
    const lines = text.split('\n');
    const titleLine = lines[0];
    const restText = lines.slice(1).join('\n').trim();

    text = `${titleLine}\n\n## 🎯 Что хотят услышать интервьюеры\n\n${restText}`;
  }

  // Оборачиваем код блоки
  text = wrapCodeBlocks(text);

  return text;
}

function wrapCodeBlocks(text) {
  // Ищем строки с кодом и оборачиваем их в блоки
  const lines = text.split('\n');
  let result = [];
  let inCodeBlock = false;
  let codeBuffer = [];

  const codePatterns = [
    /^import\s+/,
    /^const\s+\w+\s*=/,
    /^let\s+\w+\s*=/,
    /^var\s+\w+\s*=/,
    /^function\s+\w+/,
    /^class\s+\w+/,
    /^\s*(async\s+)?function/,
    /^\s*const\s+\w+\s*=\s*(async\s+)?\(/,
    /^\/\//,
    /^\s*try\s*{/,
    /^\s*catch\s*{/,
    /^\s*if\s*\(/,
    /^\s*for\s*\(/,
    /^\s*while\s*\(/,
    /^\s*return\s+/,
    /^\s*await\s+/,
    /^\s*\.then\(/,
    /^\s*\.catch\(/,
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Проверяем, это ли строка кода
    const isCode =
      codePatterns.some((pattern) => pattern.test(trimmed)) ||
      trimmed.includes('=>') ||
      trimmed.includes('async') ||
      trimmed.includes('await');

    if (
      isCode &&
      trimmed &&
      !trimmed.startsWith('##') &&
      !trimmed.startsWith('-') &&
      !trimmed.startsWith('*')
    ) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBuffer = [line];
      } else {
        codeBuffer.push(line);
      }
    } else {
      if (inCodeBlock && codeBuffer.length > 0) {
        // Завершаем блок кода
        result.push('```javascript');
        result.push(...codeBuffer);
        result.push('```');
        inCodeBlock = false;
        codeBuffer = [];
      }
      result.push(line);
    }
  }

  // Завершаем последний блок если он есть
  if (inCodeBlock && codeBuffer.length > 0) {
    result.push('```javascript');
    result.push(...codeBuffer);
    result.push('```');
  }

  return result.join('\n');
}
