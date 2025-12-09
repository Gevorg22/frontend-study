import React from "react";

/**
 * Простой рендерер маркдауна для форматированных ответов
 */
export const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const elements: React.ReactNode[] = [];
  const lines = content.split("\n");
  let i = 0;
  let elementKey = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Обрабатываем заголовки уровня 2
    if (line.startsWith("## ")) {
      const title = line.replace(/^## /, "").trim();
      elements.push(
        <h3 key={elementKey++} className="section-title">
          {title}
        </h3>
      );
      i++;
      continue;
    }

    // Обрабатываем блоки кода
    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i++; // Пропускаем открывающий ```
      
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      
      if (i < lines.length) {
        i++; // Пропускаем закрывающий ```
      }

      elements.push(
        <pre key={elementKey++} className="code-block">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Пропускаем пустые строки
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Обычный текст как абзац
    if (line.trim()) {
      elements.push(
        <p key={elementKey++} className="answer-paragraph">
          {line}
        </p>
      );
      i++;
      continue;
    }

    i++;
  }

  // Если остался незавершенный блок кода
  if (elements.length === 0) {
    return (
      <div className="markdown-content">
        <p className="answer-paragraph">{content}</p>
      </div>
    );
  }

  return <div className="markdown-content">{elements}</div>;
};

export default MarkdownRenderer;
