import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./src/questions-data.json', 'utf8'));
const q = data.questions[322];
console.log('Q', q.id, ':', q.title.substring(0, 50));
console.log('В ответе тройные бэктики:', q.answer.includes('```javascript'));
console.log('Всего таких:', (q.answer.match(/```javascript/g) || []).length);
console.log('\n=== КОНЕЦ ОТВЕТА ===');
console.log(q.answer.slice(-400));
