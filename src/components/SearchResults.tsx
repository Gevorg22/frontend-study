import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuestions } from "../context";
import "./SearchResults.css";

interface SearchResultsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const { data } = useQuestions();

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    return data.questions
      .filter((q) => q.title.toLowerCase().includes(lowerQuery) || q.answer.toLowerCase().includes(lowerQuery))
      .slice(0, 10);
  }, [query, data.questions]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          type="text"
          placeholder="Поиск вопроса по названию или содержимому..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />

        <div className="search-results">
          {results.length === 0 && query && <div className="no-results">Вопросы не найдены</div>}

          {results.map((question) => {
            const category = data.categories.find((c) => c.id === question.categoryId);
            return (
              <Link
                key={question.id}
                to={`/category/${category?.slug}/question/${question.id}`}
                className="search-result-item"
                onClick={onClose}>
                <span className="result-category">{category?.name}</span>
                <span className="result-title">{question.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
