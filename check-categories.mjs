import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./src/questions-data.json', 'utf8'));

console.log('Текущие категории:');
data.categories.forEach((c) => {
  console.log(`- ${c.name} (${c.slug}): ${c.questions.length} вопросов`);
});

console.log('\n\nВопросы в General:');
const generalQs = data.questions.filter((q) => q.categorySlug === 'general');
console.log('Всего в General:', generalQs.length);
console.log('\nПримеры вопросов:');
generalQs
  .slice(0, 10)
  .forEach((q) => console.log(`- ${q.id}: ${q.title.substring(0, 60)}`));
