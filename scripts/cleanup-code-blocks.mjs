import fs from 'fs';

const dataFile = './src/questions-data.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const questions = data.questions;

let cleaned = 0;

// Проходим по каждому ответу и удаляем лишние ````javascript разделители
for (const q of questions) {
  let answer = q.answer;

  // Проблема: код разбит на несколько ````javascript блоков вместо одного
  // Ищем паттерны типа:
  // ```javascript
  // code line 1
  // ```
  //
  // ```javascript
  // code line 2
  // ```

  const hasMultipleCodeBlocks =
    (answer.match(/```javascript/g) || []).length > 5;

  if (hasMultipleCodeBlocks) {
    console.log(
      `🔧 Очищаю Q${q.id}: ${q.title.substring(0, 50)}... (${(answer.match(/```javascript/g) || []).length} блоков кода)`
    );

    // Собираем весь код воедино
    let result = [];
    const lines = answer.split('\n');
    let inCode = false;
    let codeLines = [];
    let currentBlockCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() === '```javascript') {
        if (!inCode) {
          inCode = true;
          currentBlockCount++;
          // Если это уже не первый блок кода подряд, добавляем separator
          if (currentBlockCount > 1 && codeLines.length > 0) {
            // Ничего не делаем - просто продолжаем
          } else if (currentBlockCount === 1) {
            result.push('```javascript');
          }
        } else {
          inCode = false;
          // Не закрываем код если это часть длинного блока
        }
      } else if (inCode) {
        codeLines.push(line);
      } else {
        // Не в коде - обычный текст
        if (codeLines.length > 0) {
          // Завершаем накопленный код
          result.push(...codeLines);
          codeLines = [];
          result.push('```');
        }
        currentBlockCount = 0;
        result.push(line);
      }
    }

    // Завершаем последний блок кода если есть
    if (codeLines.length > 0) {
      result.push(...codeLines);
      result.push('```');
    }

    q.answer = result.join('\n');
    cleaned++;
  }
}

console.log(`\n✅ Очищено ${cleaned} ответов от многих блоков кода`);

data.generatedAt = new Date().toISOString();
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Файл обновлен: ${dataFile}`);
