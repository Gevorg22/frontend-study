import fs from 'fs';
import path from 'path';

const dataPath = './src/questions-data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Функция для правильного форматирования кода в ответах
function formatCodeBlocks(answer) {
  if (!answer) return answer;

  let result = answer;

  // Находим все блоки кода и форматируем их
  const codeBlockRegex =
    /```(javascript|js|jsx|typescript|ts|tsx)?\n([\s\S]*?)\n```/g;

  result = result.replace(codeBlockRegex, (match, lang, code) => {
    // Удаляем лишние пробелы в начале/конце
    const lines = code.split('\n');

    // Находим минимальный отступ
    let minIndent = Infinity;
    lines.forEach((line) => {
      if (line.trim()) {
        const indent = line.match(/^\s*/)[0].length;
        minIndent = Math.min(minIndent, indent);
      }
    });

    if (minIndent === Infinity) minIndent = 0;

    // Удаляем минимальный отступ со всех строк
    const formattedLines = lines.map((line) => {
      if (line.trim()) {
        return line.substring(minIndent);
      }
      return '';
    });

    // Удаляем пустые строки в начале и конце
    while (formattedLines.length > 0 && !formattedLines[0].trim()) {
      formattedLines.shift();
    }
    while (
      formattedLines.length > 0 &&
      !formattedLines[formattedLines.length - 1].trim()
    ) {
      formattedLines.pop();
    }

    const formatted = formattedLines.join('\n');
    return `\`\`\`${lang || 'javascript'}\n${formatted}\n\`\`\``;
  });

  return result;
}

// Обработаем все вопросы
let updated = 0;
const total = data.questions.length;

data.questions.forEach((question, index) => {
  const originalAnswer = question.answer;
  question.answer = formatCodeBlocks(question.answer);

  if (question.answer !== originalAnswer) {
    updated++;
  }

  if ((index + 1) % 100 === 0) {
    console.log(`Обработано: ${index + 1}/${total}`);
  }
});

// Сохраняем обновленные данные
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`\n✅ Готово! Отформатировано ${updated} вопросов`);
console.log(`📊 Всего вопросов: ${total}`);
