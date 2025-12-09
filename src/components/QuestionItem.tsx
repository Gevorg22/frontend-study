import React from 'react';
import { Link } from 'react-router-dom';
import { useQuestions } from '../context';
import type { Question } from '../types';
import './QuestionItem.css';

interface QuestionItemProps {
  question: Question;
  categorySlug: string;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  categorySlug,
}) => {
  const { toggleLearned, isLearned } = useQuestions();
  const learned = isLearned(question.id);

  const handleLearnedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLearned(question.id);
  };

  return (
    <Link
      to={`/category/${categorySlug}/question/${question.id}`}
      className={`question-item ${learned ? 'learned' : ''}`}
    >
      <div className="question-content">
        <h3 className="question-title">{question.title}</h3>
        <p className="question-preview">
          {question.answer.substring(0, 120)}...
        </p>
      </div>
      <div className="question-actions">
        <button
          className={`learned-btn ${learned ? 'active' : ''}`}
          onClick={handleLearnedClick}
          title={
            learned ? 'Отметить как неизученное' : 'Отметить как изученное'
          }
        >
          {learned ? '✓' : '○'}
        </button>
        <div className="question-arrow">→</div>
      </div>
    </Link>
  );
};
