import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./src/questions-data.json', 'utf-8'));

// Добавляем массив questions в каждую категорию
data.categories.forEach((category) => {
  category.questions = data.questions.filter(
    (q) => q.categorySlug === category.slug
  );
});

fs.writeFileSync('./src/questions-data.json', JSON.stringify(data, null, 2));

console.log('✅ Категории обновлены с массивами questions');
data.categories.forEach((cat) => {
  console.log(`  ${cat.name}: ${cat.questions.length} вопросов`);
});
