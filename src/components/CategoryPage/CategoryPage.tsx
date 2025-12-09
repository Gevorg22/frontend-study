import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { useQuestions } from '../../context';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import './CategoryPage.css';
import { QuestionItem } from '../QuestionItem/QuestionItem';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getCategory, getQuestionsInCategory, isLearned } = useQuestions();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const category = getCategory(slug || '');
  const allQuestions = getQuestionsInCategory(category?.id || 0);

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

    return questions.sort((a, b) => {
      const aLearned = isLearned(a.id) ? 1 : 0;
      const bLearned = isLearned(b.id) ? 1 : 0;
      return aLearned - bLearned;
    });
  }, [allQuestions, searchQuery, isLearned]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (!slug || !category) {
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
        <SearchOutlined className="search-icon" />
        <input
          type="text"
          placeholder="Поиск в этом разделе..."
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
            <CloseOutlined />
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
          <div className="no-results">
            <p>Ничего не найдено</p>
          </div>
        ) : (
          paginatedQuestions.map((question) => (
            <QuestionItem key={question.id} question={question} />
          ))
        )}
      </div>

      {filteredQuestions.length > itemsPerPage && (
        <div className="pagination-container">
          <Pagination
            current={currentPage}
            total={filteredQuestions.length}
            pageSize={itemsPerPage}
            onChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            showSizeChanger={false}
            locale={{
              items_per_page: '/ странице',
              label: '',
              jump_to: 'Перейти на',
              jump_to_confirm: 'подтвердить',
              page: '',
            }}
          />
          <div className="pagination-info">
            Показано {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)} из{' '}
            {filteredQuestions.length}
          </div>
        </div>
      )}
    </div>
  );
};
