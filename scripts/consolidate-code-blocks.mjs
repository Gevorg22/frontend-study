import fs from 'fs';

const dataFile = './src/questions-data.json';
const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const qs = data.questions;

let fixed = 0;

// Проблема: ````javascript\n````javascript (пустые/однострочные блоки кода)
// Решение: слить их в один большой блок

for (const q of qs) {
  let answer = q.answer;

  // Ищем паттерны: ````javascript\n...\n```\n\n````javascript
  // или ````javascript\n(одна-две строки)\n```

  let newAnswer = answer;

  // Убираем порты ``````javascript...\n`````` на одну линию
  newAnswer = newAnswer.replace(/```javascript\n(```)/g, '```javascript\n');

  // Объединяем несколько блоков в один
  while (
    newAnswer.includes('```\n```javascript') ||
    newAnswer.includes('```javascript\n```javascript')
  ) {
    newAnswer = newAnswer.replace(/```\n```javascript/g, '\n');
    newAnswer = newAnswer.replace(/```javascript\n```javascript/g, '\n');
  }

  // Убираем пустые ````javascript блоки
  newAnswer = newAnswer.replace(/```javascript\s*```/g, '');

  // Убираем порты:
  newAnswer = newAnswer.replace(/```javascript\n\n```/g, '');

  if (
    newAnswer !== answer &&
    (newAnswer.match(/```javascript/g) || []).length <
      (answer.match(/```javascript/g) || []).length
  ) {
    const oldCount = (answer.match(/```javascript/g) || []).length;
    const newCount = (newAnswer.match(/```javascript/g) || []).length;
    q.answer = newAnswer;
    console.log(`✏️ Q${q.id}: ${oldCount} → ${newCount} блоков кода`);
    fixed++;
  }
}

console.log(`\n✅ Очищено ${fixed} ответов`);

data.generatedAt = new Date().toISOString();
fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Сохранено!`);
