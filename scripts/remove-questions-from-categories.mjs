import fs from 'fs';

const data = JSON.parse(fs.readFileSync('./src/questions-data.json', 'utf-8'));

// Удаляем поле questions из категорий
data.categories.forEach((category) => {
  delete category.questions;
});

fs.writeFileSync('./src/questions-data.json', JSON.stringify(data, null, 2));

console.log('✅ Поле questions удалено из всех категорий');
console.log(`Размер файла теперь должен быть меньше`);
