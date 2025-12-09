import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { useQuestions } from '../context';
import './CategoryPage.css';
import { QuestionItem } from './QuestionItem';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getCategory, getQuestionsInCategory, isLearned } = useQuestions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!slug) {
    return <div className="error">Категория не найдена</div>;
  }

  const category = getCategory(slug);
  const allQuestions = getQuestionsInCategory(category?.id || 0);

  // Фильтруем вопросы по поисковому запросу
  const filteredQuestions = useMemo(() => {
    let questions = allQuestions;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      questions = allQuestions.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.answer.toLowerCase().includes(query)
      );
    }

    // Сортируем: неизученные вначале, изученные в конец
    return questions.sort((a, b) => {
      const aLearned = isLearned(a.id) ? 1 : 0;
      const bLearned = isLearned(b.id) ? 1 : 0;
      return aLearned - bLearned;
    });
  }, [allQuestions, searchQuery, isLearned]);

  // Вычисляем пагинацию
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  // Сбрасываем страницу при поиске
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (!category) {
    return (
      <div className="error-container">
        <h2>Категория не найдена</h2>
        <Link to="/">Вернуться на главную</Link>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{category.name}</h1>
        <div className="category-meta">
          <span className="question-count">{allQuestions.length} вопросов</span>
        </div>
      </div>

      <div className="category-search-box">
        <input
          type="text"
          placeholder="🔍 Поиск в этом разделе..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="category-search-input"
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => handleSearch('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="search-results-info">
          Найдено: <strong>{filteredQuestions.length}</strong> из{' '}
          {allQuestions.length} вопросов
        </div>
      )}

      <div className="questions-list">
        {paginatedQuestions.length === 0 ? (
          <div className="no-questions">
            <p>
              {searchQuery
                ? 'Вопросы не найдены'
                : 'В этой категории пока нет вопросов'}
            </p>
          </div>
        ) : (
          paginatedQuestions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              categorySlug={slug}
            />
          ))
        )}
      </div>

      {filteredQuestions.length > 0 && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={filteredQuestions.length}
            pageSize={itemsPerPage}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} из ${total} вопросов`
            }
          />
        </div>
      )}
    </div>
  );
};
