import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function extractAllQuestions() {
  const questionsDir = path.join(__dirname, "questions");
  const outputPath = path.join(__dirname, "all-questions-extracted.json");

  console.log("Starting extraction...");

  if (!fs.existsSync(questionsDir)) {
    console.error("ERROR: Folder questions not found!");
    return;
  }

  const files = fs
    .readdirSync(questionsDir)
    .filter((f) => f.endsWith(".docx"))
    .sort();

  console.log(`Found ${files.length} .docx files`);

  const results = [];
  let successCount = 0;
  let errorCount = 0;

  // Process all files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(questionsDir, file);
    try {
      console.log(`Processing: ${file}`);
      const result = await mammoth.extractRawText({ path: filePath });
      const text = result.value || "No content found";

      results.push({
        filename: file,
        content: text.trim().substring(0, 2000), // First 2000 chars
        size: fs.statSync(filePath).size,
      });

      successCount++;
      if ((i + 1) % 100 === 0) {
        console.log(`Progress: ${i + 1}/${files.length}`);
      }
    } catch (error) {
      errorCount++;
      console.log(`FAILED: ${file} - ${error.message}`);
      results.push({
        filename: file,
        content: `ERROR: ${error.message}`,
        error: true,
      });
    }
  }

  // Save results
  try {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
    console.log(`\nSaved to: ${outputPath}`);
    console.log(`Success: ${successCount}, Errors: ${errorCount}`);
    console.log(`Total processed: ${results.length}`);
  } catch (err) {
    console.log(`ERROR saving file: ${err.message}`);
  }
}

extractAllQuestions().catch((err) => console.error("Fatal error:", err));
