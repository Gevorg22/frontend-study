import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Функция для извлечения категории из названия файла
function extractCategory(filename: string): string | null {
  const categories: Record<string, string> = {
    javascript: "javascript",
    react: "react",
    async: "asynchronous",
    promise: "asynchronous",
    "event loop": "asynchronous",
    typescript: "typescript",
    type: "typescript",
    interface: "typescript",
    css: "css",
    flexbox: "css",
    grid: "css",
    http: "http",
    cors: "http",
    rest: "http",
    websocket: "http",
    производительность: "performance",
    оптимизация: "performance",
    кэш: "performance",
    git: "git",
    merge: "git",
    rebase: "git",
    тест: "testing",
    jest: "testing",
    алгоритм: "algorithms",
    сложность: "algorithms",
  };

  const lowerFilename = filename.toLowerCase();
  for (const [key, category] of Object.entries(categories)) {
    if (lowerFilename.includes(key)) {
      return category;
    }
  }

  // По умолчанию - javascript
  return "javascript";
}

// Функция для парсинга .docx названия как вопроса
function parseFilenameAsQuestion(filename: string): string {
  // Убираем расширение .docx
  let question = filename.replace(/\.docx$/, "");
  // Убираем номер в начале если есть
  question = question.replace(/^\d+\.\s*/, "");
  return question;
}

// Функция для генерации простого ответа на основе имени файла
function generateAnswer(filename: string): string {
  const question = parseFilenameAsQuestion(filename);

  // Простая стратегия: возвращаем краткий ответ на основе вопроса
  const answers: Record<string, string> = {
    javascript: "JavaScript - это динамический язык программирования, используемый в браузере и на серверах.",
    react: "React - это библиотека для создания пользовательских интерфейсов с помощью компонентов.",
    typescript: "TypeScript - это надмножество JavaScript, добавляющее статическую типизацию.",
    css: "CSS используется для стилизации HTML элементов и управления внешним видом веб-страниц.",
  };

  for (const [key, answer] of Object.entries(answers)) {
    if (question.toLowerCase().includes(key)) {
      return answer;
    }
  }

  return "Полный ответ на этот вопрос требует более подробного изучения темы. Обратитесь к документации и учебным материалам.";
}

// Основная функция для обновления JSON
function updateQuestionsJson() {
  const questionsDir = path.join(__dirname, "questions");
  const outputPath = path.join(__dirname, "questions-data.json");

  // Читаем существующий JSON
  let data = {
    categories: [
      {
        id: "javascript",
        name: "JavaScript",
        slug: "javascript",
        description: "Основы JavaScript, прототипы, замыкания, асинхронность",
      },
      {
        id: "react",
        name: "React",
        slug: "react",
        description: "React компоненты, хуки, оптимизация рендеринга",
      },
      {
        id: "asynchronous",
        name: "Асинхронность",
        slug: "asynchronous",
        description: "Promise, async/await, Event Loop, микротаски",
      },
      {
        id: "typescript",
        name: "TypeScript",
        slug: "typescript",
        description: "Типы, интерфейсы, обобщения (generics)",
      },
      {
        id: "css",
        name: "CSS",
        slug: "css",
        description: "Flexbox, Grid, позиционирование, селекторы",
      },
      {
        id: "http",
        name: "HTTP & API",
        slug: "http",
        description: "HTTP методы, CORS, REST, WebSocket",
      },
      {
        id: "performance",
        name: "Производительность",
        slug: "performance",
        description: "Оптимизация, кэширование, бандлинг",
      },
      {
        id: "git",
        name: "Git",
        slug: "git",
        description: "Команды Git, ветки, конфликты слияния",
      },
      {
        id: "testing",
        name: "Тестирование",
        slug: "testing",
        description: "Unit тесты, E2E, Jest",
      },
      {
        id: "algorithms",
        name: "Алгоритмы & структуры",
        slug: "algorithms",
        description: "Сложность алгоритмов, структуры данных",
      },
    ],
    questions: [],
  };

  // Читаем файлы из папки questions
  if (!fs.existsSync(questionsDir)) {
    console.log("Папка questions не найдена");
    return;
  }

  const files = fs.readdirSync(questionsDir).filter((f) => f.endsWith(".docx"));

  let questionId = 1;
  for (const file of files) {
    const categoryId = extractCategory(file) || "javascript";
    const title = parseFilenameAsQuestion(file);
    const answer = generateAnswer(file);

    data.questions.push({
      id: questionId++,
      categoryId,
      title,
      answer,
    });
  }

  // Сортируем вопросы по категориям
  data.questions.sort((a, b) => {
    const catCompare = a.categoryId.localeCompare(b.categoryId);
    if (catCompare !== 0) return catCompare;
    return a.title.localeCompare(b.title);
  });

  // Переписываем ID после сортировки
  data.questions.forEach((q, index) => {
    q.id = index + 1;
  });

  // Записываем в файл
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✓ Обновлено ${data.questions.length} вопросов`);
  console.log(`✓ Файл сохранён в ${outputPath}`);
}

updateQuestionsJson();
