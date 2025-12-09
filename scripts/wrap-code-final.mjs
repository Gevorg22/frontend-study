import fs from 'fs';

const dataPath = './src/questions-data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Функция для обертывания кода в маркдаун блоки
function wrapCodeInMarkdown(answer) {
  if (!answer) return answer;

  let result = answer;

  // Разбиваем на блоки, где уже есть ```
  let parts = result.split('```');

  for (let i = 0; i < parts.length; i++) {
    // Четные индексы - это текст вне блоков кода
    if (i % 2 === 0) {
      let textPart = parts[i];
      let lines = textPart.split('\n');
      let newLines = [];
      let codeBuffer = [];

      for (let j = 0; j < lines.length; j++) {
        let line = lines[j];

        // Признаки кода
        const isCodeLine =
          /^(document\.|const |let |var |function |if \(|.*=>\s*{|.*\{$|^\s*\}|return |for \(|while \(|.*\(.*\)\s*;|.*\[.*\];)/.test(
            line.trim()
          ) &&
          !line.trim().startsWith('##') &&
          !line.trim().startsWith('//') &&
          line.trim().length > 0;

        if (isCodeLine) {
          codeBuffer.push(line);
        } else {
          // Если буфер кода не пустой и мы встретили не-код строку
          if (codeBuffer.length > 0 && line.trim() !== '') {
            // Добавляем буфер с обернутым кодом
            newLines.push('```javascript');
            newLines.push(...codeBuffer);
            newLines.push('```');
            codeBuffer = [];
          }
          newLines.push(line);
        }
      }

      // Добавляем оставшийся код
      if (codeBuffer.length > 0) {
        newLines.push('```javascript');
        newLines.push(...codeBuffer);
        newLines.push('```');
      }

      parts[i] = newLines.join('\n');
    }
  }

  result = parts.join('```');

  // Удаляем множественные пустые строки
  result = result.replace(/\n\n\n+/g, '\n\n');

  return result;
}

// Обработаем все вопросы
let updated = 0;
const total = data.questions.length;

data.questions.forEach((question, index) => {
  const originalAnswer = question.answer;
  question.answer = wrapCodeInMarkdown(question.answer);

  if (question.answer !== originalAnswer) {
    updated++;
  }

  if ((index + 1) % 100 === 0) {
    console.log(`Обработано: ${index + 1}/${total}`);
  }
});

// Сохраняем обновленные данные
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`\n✅ Готово! Обновлено ${updated} вопросов`);
console.log(`📊 Всего вопросов: ${total}`);
