import fs from 'fs';
import prettier from 'prettier';

const dataPath = './src/questions-data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Функция для форматирования кода в ответах
async function formatAnswerCode(answer) {
  if (!answer) return answer;

  let result = answer;

  // Находим все блоки кода и форматируем их
  const codeBlockRegex =
    /```(javascript|js|jsx|typescript|ts|tsx)?\n([\s\S]*?)```/g;

  result = result.replace(codeBlockRegex, (match, lang, code) => {
    try {
      // Форматируем код с помощью Prettier
      const formatted = prettier.format(code.trim(), {
        parser: 'babel',
        printWidth: 70,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'always',
      });

      // Возвращаем блок кода с правильным форматированием
      return `\`\`\`${lang || 'javascript'}\n${formatted}\`\`\``;
    } catch (error) {
      // Если форматирование не сработало, возвращаем оригинальный блок
      console.warn(`Ошибка форматирования кода: ${error.message}`);
      return match;
    }
  });

  return result;
}

// Обработаем все вопросы
let updated = 0;
const total = data.questions.length;

for (let i = 0; i < data.questions.length; i++) {
  const question = data.questions[i];
  const originalAnswer = question.answer;

  question.answer = await formatAnswerCode(question.answer);

  if (question.answer !== originalAnswer) {
    updated++;
  }

  if ((i + 1) % 100 === 0) {
    console.log(`Обработано: ${i + 1}/${total}`);
  }
}

// Сохраняем обновленные данные
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`\n✅ Готово! Форматировано ${updated} вопросов`);
console.log(`📊 Всего вопросов: ${total}`);
