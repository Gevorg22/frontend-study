import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function extractCategoryFromFilename(filename) {
  const name = filename.replace(/\.docx$/, "").toLowerCase();

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
      "settimeout",
      "json",
      "object",
      "array",
      "function",
      "variable",
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
      "functional",
      "class component",
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
      "readonly",
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
      "pseudo",
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
      "api",
      "tcp",
      "udp",
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
      "debounce",
      "throttle",
    ],
    Git: ["git", "branch", "merge", "rebase", "commit", "push", "fetch", "cherry-pick", "stash"],
    Algorithms: ["algorithm", "sorting", "search", "big o", "complexity", "recursion", "two pointers", "range", "oop"],
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some((word) => name.includes(word))) {
      return category;
    }
  }

  return "General";
}

function smartFormatContent(rawText) {
  // Remove extreme whitespace but preserve structure
  let text = rawText.trim();

  // Split into sections by common patterns
  const sections = [];

  // First, identify major sections
  let parts = text.split(
    /(?=Что хотят|Ответ:|Пример|Код:|javascript|jsx|typescript|const |let |function |class |interface )/i,
  );

  for (let part of parts) {
    let section = part.trim();
    if (!section) continue;

    // Check if this looks like code
    if (/^(const|let|var|function|class|interface|type|import|export)/i.test(section)) {
      // Format as code block
      section = section.replace(/([;{}()\[\]])/g, "$1\n  ");
      section = "```javascript\n" + section + "\n```";
    } else if (section.includes("javascript") || section.includes("jsx") || section.includes("typescript")) {
      // Preserve existing code block markers
      section = section.replace(/\n{3,}/g, "\n\n");
    } else {
      // Regular text - add paragraph breaks
      section = section.replace(/([.!?])\s+([А-Я])/g, "$1\n\n$2");
    }

    sections.push(section.trim());
  }

  return sections
    .filter((s) => s.length > 20)
    .join("\n\n")
    .substring(0, 2500);
}

async function createBeautifulQuestionsData() {
  const inputPath = path.join(__dirname, "all-questions-extracted.json");
  const outputPath = path.join(__dirname, "src", "questions-data.json");

  console.log("Reading extracted data...");
  const rawData = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  const categoryMap = {};
  const questions = [];
  let id = 1;

  console.log(`Processing ${rawData.length} items for beautiful formatting...`);

  for (const item of rawData) {
    const title = item.filename.replace(/\.docx$/, "");
    const category = extractCategoryFromFilename(item.filename);
    const formattedAnswer = smartFormatContent(item.content);

    // Build category map
    if (!categoryMap[category]) {
      categoryMap[category] = {
        id: Object.keys(categoryMap).length + 1,
        name: category,
        slug: category.toLowerCase().replace(/\s+/g, "-"),
        questions: [],
      };
    }

    // Create question
    const questionObj = {
      id,
      title,
      answer: formattedAnswer,
      categoryId: categoryMap[category].id,
      categorySlug: categoryMap[category].slug,
    };

    questions.push(questionObj);
    categoryMap[category].questions.push(id);
    id++;

    if (id % 200 === 0) {
      console.log(`Progress: ${id}/${rawData.length}`);
    }
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

  console.log(`\n✅ Beautiful formatting complete!`);
  console.log(`📊 Statistics:`);
  console.log(`  - Total questions: ${questions.length}`);
  console.log(`  - Categories:`);

  for (const cat of categories) {
    console.log(`    • ${cat.name}: ${cat.questions.length} questions`);
  }

  console.log(`\n📝 Output: ${outputPath}`);
}

createBeautifulQuestionsData().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
