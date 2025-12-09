import fs from 'fs';

const dataPath = './src/questions-data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Функция для удаления дублированных заголовков
function cleanAnswers(answer) {
  if (!answer) return answer;

  let result = answer;
  let lines = result.split('\n');
  let cleanedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : null;

    // Если текущая строка это заголовок с одним эмодзи и следующая строка такой же заголовок, пропускаем текущую
    if (
      line.trim().match(/^##\s+[^\w\s]+\s*$/) &&
      nextLine &&
      nextLine.trim() === line.trim()
    ) {
      continue; // Пропускаем дублированный заголовок
    }

    cleanedLines.push(line);
  }

  result = cleanedLines.join('\n');

  // Удаляем множественные пустые строки
  result = result.replace(/\n\n\n+/g, '\n\n');

  // Убираем пробелы в начале и конце
  result = result.trim();

  return result;
}

// Обработаем все вопросы
let updated = 0;
const total = data.questions.length;

data.questions.forEach((question, index) => {
  const originalAnswer = question.answer;
  question.answer = cleanAnswers(question.answer);

  if (question.answer !== originalAnswer) {
    updated++;
  }

  if ((index + 1) % 100 === 0) {
    console.log(`Обработано: ${index + 1}/${total}`);
  }
});

// Сохраняем обновленные данные
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`\n✅ Готово! Очищено ${updated} вопросов`);
console.log(`📊 Всего вопросов: ${total}`);
