import fs from 'fs';
import mammoth from 'mammoth';
import path from 'path';

const questionsDir = './questions';
const dataFile = './src/questions-data.json';

const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const questions = data.questions;

let updated = 0;

async function fullRecovery() {
  const files = fs.readdirSync(questionsDir).filter((f) => f.endsWith('.docx'));

  console.log(`📂 Найдено ${files.length} .docx файлов`);
  console.log(`📋 Всего вопросов в БД: ${questions.length}`);

  for (const file of files) {
    try {
      const filePath = path.join(questionsDir, file);
      const result = await mammoth.extractRawText({ path: filePath });
      const rawText = result.value.trim();

      // Находим вопрос по названию файла
      const fileTitle = file.replace('.docx', '').toLowerCase();
      const question = questions.find((q) => {
        const qTitle = q.title.toLowerCase();
        return (
          qTitle === fileTitle ||
          fileTitle.includes(qTitle.substring(0, 15)) ||
          qTitle.includes(fileTitle.substring(0, 15))
        );
      });

      if (!question) {
        continue;
      }

      // Извлекаем новый ответ (весь текст после заголовка)
      const lines = rawText.split('\n');
      let answerStartIdx = 0;

      // Находим где заканчивается заголовок вопроса
      for (let i = 0; i < lines.length; i++) {
        if (
          lines[i].trim().endsWith('?') ||
          lines[i].trim() === question.title
        ) {
          answerStartIdx = i + 1;
          break;
        }
      }

      const answerText = lines.slice(answerStartIdx).join('\n').trim();

      if (answerText.length === 0) continue;

      // Проверяем есть ли улучшение
      if (answerText.length > question.answer.length * 0.95) {
        // Достаточно полный ответ
        const oldLen = question.answer.length;
        question.answer = answerText;

        if (Math.abs(answerText.length - oldLen) > 100) {
          console.log(
            `✏️ Q${question.id}: ${oldLen} → ${answerText.length} символов`
          );
          updated++;
        }
      }
    } catch (error) {
      // Молча пропускаем
    }
  }
}

await fullRecovery();

console.log(`\n✅ Обновлено ${updated} ответов`);

data.generatedAt = new Date().toISOString();
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Сохранено!`);
