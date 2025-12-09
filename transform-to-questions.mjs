import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function extractCategoryFromFilename(filename) {
  // Remove .docx extension
  const name = filename.replace(/\.docx$/, "");

  // Try to detect category from common patterns
  const keywords = {
    JavaScript: [
      "async",
      "promise",
      "callback",
      "closure",
      "hoisting",
      "this",
      "spread",
      "typeof",
      "event",
      "dom",
      "console",
      "setTimeout",
      "json",
    ],
    React: [
      "react",
      "component",
      "hook",
      "usestate",
      "useeffect",
      "useref",
      "usereducer",
      "props",
      "state",
      "render",
      "memo",
      "context",
    ],
    TypeScript: [
      "typescript",
      "interface",
      "type",
      "generic",
      "enum",
      "decorator",
      "utility",
      "pick",
      "partial",
      "omit",
    ],
    CSS: [
      "css",
      "flexbox",
      "grid",
      "position",
      "display",
      "transition",
      "animation",
      "selector",
      "specificity",
      "box-sizing",
    ],
    "HTTP & Network": [
      "http",
      "fetch",
      "cors",
      "rest",
      "graphql",
      "websocket",
      "request",
      "response",
      "cookie",
      "auth",
    ],
    Performance: [
      "performance",
      "optimization",
      "lazy",
      "cache",
      "bundle",
      "reflow",
      "repaint",
      "critical",
      "tree shaking",
    ],
    Git: ["git", "branch", "merge", "rebase", "commit", "push", "fetch", "cherry-pick"],
    Algorithms: ["algorithm", "sorting", "search", "big o", "complexity", "recursion", "two pointers", "range"],
  };

  const nameLower = name.toLowerCase();

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((word) => nameLower.includes(word))) {
      return category;
    }
  }

  // Default category
  return "General";
}

function formatAnswerContent(content) {
  // Clean up the content
  let formatted = content.trim();

  // Split sentences into lines for better readability
  formatted = formatted.replace(/(?<=[.!?])\s+(?=[А-Я])/g, "\n\n");

  // Add line breaks before code examples
  formatted = formatted.replace(/([^\n])(Пример|Example|const|let|var|function|class|import|export)/gi, "$1\n$2");

  // Add line breaks and indentation for code blocks
  formatted = formatted.replace(/(const|let|var)\s+/g, "\n$1 ");
  formatted = formatted.replace(/(\{|\}|=>)/g, " $1 ");

  // Clean up multiple spaces
  formatted = formatted.replace(/\s{2,}/g, " ");

  // Restore intentional line breaks
  formatted = formatted.replace(/\n+/g, "\n");

  // Add indentation to code-like lines
  const lines = formatted.split("\n");
  const formattedLines = lines.map((line) => {
    const trimmed = line.trim();

    // Check if line looks like code
    if (
      /^(const|let|var|function|class|interface|type|import|export|if|for|while|return|async|await|\/\/|=>|\{|\})/.test(
        trimmed,
      )
    ) {
      return "  " + trimmed; // Two spaces indentation for code
    }

    // Add proper spacing for readability
    if (trimmed && !trimmed.match(/^[\d\-•]/)) {
      return trimmed;
    }

    return trimmed;
  });

  return formattedLines.join("\n");
}

function createQuestionFromFile(filename, content) {
  // Extract question title from filename
  const questionTitle = filename.replace(/\.docx$/, "");

  // Extract category
  const category = extractCategoryFromFilename(filename);

  // Clean up and format content
  let cleanContent = content.trim();

  // Split into paragraphs
  cleanContent = cleanContent
    .replace(/\s+/g, " ") // First normalize spaces
    .replace(/([.!?])\s+([А-Я])/g, "$1\n\n$2") // Paragraphs on capitals
    .replace(/(Пример|Example|Код|Code|javascript|jsx|typescript|css|html)/gi, "\n$1") // Examples on new line
    .replace(/(const|let|var|function|class|import|export|interface|type)\s+/g, "\n$1 "); // Keywords on new lines

  // Apply formatting
  const formattedAnswer = formatAnswerContent(cleanContent);

  // Limit length but preserve readability
  const answer = formattedAnswer.length > 2500 ? formattedAnswer.substring(0, 2500) + "..." : formattedAnswer;

  return {
    questionTitle,
    answer,
    category,
  };
}

async function transformToStructuredData() {
  const inputPath = path.join(__dirname, "all-questions-extracted.json");
  const outputPath = path.join(__dirname, "all-questions-structured.json");

  console.log("Reading extracted data...");
  const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  const categoryMap = {};
  const questions = [];
  let id = 1;

  console.log(`Processing ${rawData.length} items...`);

  for (const item of rawData) {
    const question = createQuestionFromFile(item.filename, item.content);

    // Build category map
    if (!categoryMap[question.category]) {
      categoryMap[question.category] = {
        id: Object.keys(categoryMap).length + 1,
        name: question.category,
        slug: question.category.toLowerCase().replace(/\s+/g, "-"),
        questions: [],
      };
    }

    // Add question
    const questionObj = {
      id,
      title: question.questionTitle,
      answer: question.answer,
      categoryId: categoryMap[question.category].id,
      categorySlug: categoryMap[question.category].slug,
    };

    questions.push(questionObj);
    categoryMap[question.category].questions.push(id);
    id++;
  }

  // Create final structure
  const categories = Object.values(categoryMap);

  const finalData = {
    categories,
    questions,
    totalQuestions: questions.length,
    totalCategories: categories.length,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2), "utf-8");

  console.log(`\n✅ Transformation complete!`);
  console.log(`📊 Statistics:`);
  console.log(`  - Total questions: ${questions.length}`);
  console.log(`  - Categories:`);

  for (const cat of categories) {
    console.log(`    • ${cat.name}: ${cat.questions.length} questions`);
  }

  console.log(`\n📝 Output: ${outputPath}`);
}

transformToStructuredData().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
