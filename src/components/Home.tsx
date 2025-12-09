import React from 'react';
import { useQuestions } from '../context';
import { CategoryCard } from './CategoryCard';
import './Home.css';

export const Home: React.FC = () => {
  const { data, getQuestionsCountInCategory, getLearnedCount } = useQuestions();
  const learnedCount = getLearnedCount();

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Добро пожаловать в Q&A Hub</h1>
        <p>Полная шпаргалка для фронтенд разработчика</p>
        <p className="hero-stats">
          {data.categories.length} категорий • {data.totalQuestions} вопросов{' '}
          {learnedCount > 0 && `• ✓ ${learnedCount} изучено`}
        </p>
      </div>

      <div className="categories-grid">
        {data.categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            questionCount={getQuestionsCountInCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
};
