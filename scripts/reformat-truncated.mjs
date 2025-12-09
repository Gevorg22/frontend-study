import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';

const questionsDir = './questions';
const dataFile = './src/questions-data.json';

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const questions = data.questions;

let fixed = 0;

// Идентифицируем обрезанные ответы
const truncatedIds = [
  55, 68, 69, 72, 75, 82, 124, 132, 140, 155, 174, 182, 193, 210, 236, 239, 263,
  267, 275, 285, 287, 288, 289, 290, 293, 294, 323, 326, 327, 336, 353, 367,
  373, 377, 380, 407, 424, 427, 438, 439, 443, 461, 468, 469, 474, 475, 478,
  484, 492, 494, 500, 502, 503, 512, 520, 523, 536, 537, 541, 543, 545, 549,
  550, 556, 569, 570, 575, 580, 583, 703, 758, 776, 791, 826, 828, 833, 834,
  835, 842, 851, 854, 900, 937, 938, 940, 942, 954, 975, 978, 992, 1007, 1017,
  1036, 1084, 1128, 1165, 1177, 1226,
];

async function reprocessAnswers() {
  for (const q of questions) {
    if (!truncatedIds.includes(q.id)) continue;

    try {
      const searchTitle = q.title.split('?')[0].split(':')[0].trim();

      const files = fs.readdirSync(questionsDir);
      const matchingFile = files.find((f) => {
        const fileTitle = f.replace('.docx', '').toLowerCase();
        const searchLower = searchTitle.toLowerCase();
        return (
          fileTitle.includes(searchLower) ||
          searchLower.includes(fileTitle.substring(0, 10))
        );
      });

      if (!matchingFile) {
        console.log(
          `⚠️ Q${q.id}: файл не найден для "${q.title.substring(0, 40)}"`
        );
        continue;
      }

      const filePath = path.join(questionsDir, matchingFile);
      const result = await mammoth.extractRawText({ path: filePath });
      const rawText = result.value.trim();

      if (rawText.length > q.answer.length + 50) {
        const oldLen = q.answer.length;
        q.answer = formatAnswer(rawText);
        console.log(`✏️ Q${q.id}: ${oldLen} → ${q.answer.length} символов`);
        fixed++;
      }
    } catch (error) {
      // Молча пропускаем
    }
  }
}

function formatAnswer(text) {
  // Убираем лишние пробелы
  text = text.replace(/\n\n\n+/g, '\n\n').trim();

  // Преобразуем структуру ответа
  const lines = text.split('\n');
  const result = [];

  let i = 0;

  // Первая строка - заголовок
  if (lines[i]) {
    result.push(lines[i]);
    i++;
  }

  // Пропускаем пустые строки
  while (i < lines.length && !lines[i].trim()) {
    i++;
  }

  // Добавляем заголовок если его нет
  if (i < lines.length && !result.join('\n').includes('## 🎯')) {
    result.push('');
    result.push('## 🎯 Что хотят услышать интервьюеры');
    result.push('');
  }

  // Добавляем весь остальной контент
  while (i < lines.length) {
    result.push(lines[i]);
    i++;
  }

  return result.join('\n');
}

await reprocessAnswers();

console.log(`\n✅ Переобработано ${fixed} ответов`);

data.generatedAt = new Date().toISOString();
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Файл обновлен!`);
