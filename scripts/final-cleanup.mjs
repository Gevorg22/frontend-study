import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';

const questionsDir = './questions';
const dataFile = './src/questions-data.json';

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
let updated = 0;

// Перепроцессируем ВСЕ вопросы с чистым форматированием (без ````javascript фрагментов)
async function reprocessAll() {
  for (const q of data.questions) {
    try {
      const searchTitle = q.title.split('?')[0].split(':')[0].trim();
      const files = fs.readdirSync(questionsDir);

      const matchingFile = files.find((f) => {
        const fName = f.replace('.docx', '');
        return (
          fName === searchTitle ||
          fName.toLowerCase() === searchTitle.toLowerCase()
        );
      });

      if (!matchingFile) continue;

      const result = await mammoth.extractRawText({
        path: path.join(questionsDir, matchingFile),
      });

      let text = result.value.trim();

      // Находим где заканчивается заголовок вопроса
      const lines = text.split('\n');
      let answerStart = 0;

      for (let i = 0; i < Math.min(lines.length, 3); i++) {
        if (lines[i].includes('?') && lines[i].length < 200) {
          answerStart = i + 1;
          break;
        }
      }

      const answerText = lines.slice(answerStart).join('\n').trim();

      if (answerText.length > 1000) {
        q.answer = answerText;
        updated++;
      }
    } catch (e) {
      // молча
    }
  }
}

await reprocessAll();

console.log(`✅ Переформатировано ${updated} ответов (чистый текст)`);

data.generatedAt = new Date().toISOString();
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Сохранено!`);
