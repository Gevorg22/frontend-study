import fs from "fs";
import path from "path";

const dataPath = "./src/questions-data.json";
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

// Функция для улучшения форматирования ответа
function improveAnswerFormatting(answer) {
  if (!answer) return answer;

  // Сначала защищаем блоки кода
  const codeBlocks = [];
  let safed = answer.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Заменяем повторяющиеся заголовки на маркдаун
  let improved = safed;

  // **Что хотят услышать интервьюеры:**
  improved = improved.replace(/Что хотят услышать интервьюеры:\s*/g, "\n## 🎯 Что хотят услышать интервьюеры\n\n");

  // **Определение:**
  improved = improved.replace(/Определение[:\s]*/g, "\n## 📝 Определение\n\n");

  // **Как это работает:**
  improved = improved.replace(/Как это работает[:\s]*/g, "\n## ⚙️ Как это работает\n\n");

  // **Пример реализации:**
  improved = improved.replace(/Пример реализации[:\s]*/g, "\n## 💻 Пример реализации\n\n");

  // **Пример использования:**
  improved = improved.replace(/Пример использования[:\s]*/g, "\n## 💡 Пример использования\n\n");

  // **Преимущества и недостатки:**
  improved = improved.replace(/Преимущества и недостатки[:\s]*/g, "\n## ⚖️ Преимущества и недостатки\n\n");

  // **Различия между:**
  improved = improved.replace(/Различия между[:\s]*/g, "\n## 🔄 Различия между\n\n");

  // **Сравнение:**
  improved = improved.replace(/Сравнение[:\s]*/g, "\n## 📊 Сравнение\n\n");

  // **Заключение:**
  improved = improved.replace(/Заключение[:\s]*/g, "\n## ✅ Заключение\n\n");

  // Исправляем множественные пробелы в начале строк (кроме защищенных блоков)
  improved = improved.replace(/^[ ]{4,}(?!__CODE_BLOCK)/gm, "  ");

  // Удаляем множественные пустые строки
  improved = improved.replace(/\n{3,}/g, "\n\n");

  // Восстанавливаем блоки кода
  codeBlocks.forEach((block, index) => {
    improved = improved.replace(`__CODE_BLOCK_${index}__`, block);
  });

  // Убираем пробелы в начале и конце
  improved = improved.trim();

  return improved;
}

// Обработаем все вопросы
let updated = 0;
data.questions.forEach((question, index) => {
  const originalLength = question.answer.length;
  question.answer = improveAnswerFormatting(question.answer);

  if (question.answer !== originalLength) {
    updated++;
  }

  if ((index + 1) % 100 === 0) {
    console.log(`Обработано: ${index + 1}/${data.questions.length}`);
  }
});

// Сохраняем обновленные данные
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");

console.log(`\n✅ Готово! Обновлено ${updated} вопросов`);
console.log(`📊 Всего вопросов: ${data.questions.length}`);
