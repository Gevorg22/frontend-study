import fs from 'fs';

const dataPath = './src/questions-data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Функция для обертывания кода в маркдаун блоки
function wrapCodeInMarkdown(answer) {
  if (!answer) return answer;

  let result = answer;

  // Находим примеры кода, которые НЕ обернуты в ```
  // Это может быть текст, содержащий скобки, точки с запятой и другие признаки кода

  // Паттерн: строка со скобками и точкой с запятой, которая не находится в ```
  const codePatterns = [
    // document.getElementById(...).addEventListener(...)
    /(?<!`)(document\.[a-zA-Z]+\([^)]*\)\.[a-zA-Z]+\([^)]*\)\s*[{;])/g,
    // const/let/var = ...;
    /(?<!`)((?:const|let|var)\s+\w+\s*=\s*[^;]*;)/g,
    // function(...) { ... }
    /(?<!`)(function\s+\w*\s*\([^)]*\)\s*\{[^}]*\})/g,
    // =>  (стрелочные функции)
    /(?<!`)((\w+)\s*=>\s*\{[^}]*\})/g,
    // if (...) { ... }
    /(?<!`)(if\s*\([^)]*\)\s*\{[^}]*\})/g,
  ];

  // Более простой подход: если строка содержит типичные признаки кода (скобки, точка с запятой),
  // и не находится уже в блоке кода, оберни её

  let lines = result.split('\n');
  let inCodeBlock = false;
  let wrappedLines = [];
  let tempCodeBlock = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Проверяем, начинается ли блок кода
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Конец блока кода
        inCodeBlock = false;
      } else {
        // Начало блока кода
        inCodeBlock = true;
      }
      wrappedLines.push(line);
      continue;
    }

    // Если уже в блоке кода, не трогаем
    if (inCodeBlock) {
      wrappedLines.push(line);
      continue;
    }

    // Проверяем, выглядит ли строка как код
    const isCodeLine =
      /(\{|\}|\(|\)|\[\]|=>|const |let |var |function |if \(|document\.|addEventListener|getElementById)/.test(
        line.trim()
      );
    const isAlreadyWrapped = line.includes('```');
    const isHeading = line.trim().startsWith('##');
    const isEmpty = !line.trim();

    if (
      isCodeLine &&
      !isAlreadyWrapped &&
      !isHeading &&
      !isEmpty &&
      line.trim().length > 10
    ) {
      // Это похоже на код, но не обернут
      if (tempCodeBlock.length === 0) {
        wrappedLines.push('```javascript');
      }
      tempCodeBlock.push(line);
    } else {
      // Если у нас накопился блок кода, добавляем его закрытие
      if (tempCodeBlock.length > 0) {
        tempCodeBlock.forEach((codeLine) => wrappedLines.push(codeLine));
        wrappedLines.push('```');
        tempCodeBlock = [];
      }
      wrappedLines.push(line);
    }
  }

  // Закрываем оставшийся блок кода
  if (tempCodeBlock.length > 0) {
    tempCodeBlock.forEach((codeLine) => wrappedLines.push(codeLine));
    wrappedLines.push('```');
  }

  result = wrappedLines.join('\n');

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
