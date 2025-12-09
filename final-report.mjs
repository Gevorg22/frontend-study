import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./src/questions-data.json', 'utf8'));

console.log('\n📋 ПРИМЕРЫ ВОССТАНОВЛЕННЫХ ОТВЕТОВ\n');

const examples = [323, 287, 461, 100, 500];

for (const id of examples) {
  const q = data.questions.find((q) => q.id === id);
  if (q) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`Q${id}: ${q.title.substring(0, 60)}`);
    console.log(`${'='.repeat(70)}`);
    console.log(`Длина: ${q.answer.length} символов`);
    console.log('\nПервые 300 символов:');
    console.log(q.answer.substring(0, 300));
    console.log('\n...');
    console.log('\nПоследние 200 символов:');
    console.log(q.answer.slice(-200));
  }
}

// Статистика
const qs = data.questions;
const lens = qs.map((q) => q.answer.length);
console.log(`\n${'='.repeat(70)}`);
console.log('📊 ИТОГОВАЯ СТАТИСТИКА:');
console.log(`${'='.repeat(70)}`);
console.log(`Всего вопросов: ${qs.length}`);
console.log(`Минимальная длина ответа: ${Math.min(...lens)} символов`);
console.log(`Максимальная длина ответа: ${Math.max(...lens)} символов`);
console.log(
  `Средняя длина ответа: ${Math.round(lens.reduce((a, b) => a + b) / lens.length)} символов`
);
const total = fs.statSync('./src/questions-data.json').size;
console.log(`Размер файла: ${(total / 1024 / 1024).toFixed(2)} MB`);
const withCode = qs.filter(
  (q) =>
    q.answer.includes('const ') ||
    q.answer.includes('function') ||
    q.answer.includes('import ')
).length;
console.log(`✅ Ответов с примерами кода: ${withCode}/${qs.length}`);
