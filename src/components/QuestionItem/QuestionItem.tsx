import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuestions } from '../../context';
import type { Question } from '../../types';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import './QuestionItem.css';

interface QuestionItemProps {
  question: Question;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({ question }) => {
  const { toggleLearned, isLearned, getCategory } = useQuestions();
  const { slug } = useParams<{ slug: string }>();
  const learned = isLearned(question.id);
  const category = useMemo(() => getCategory(slug || ''), [slug, getCategory]);

  const handleLearnedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLearned(question.id);
  };

  if (!category) return null;

  return (
    <Link
      to={`/category/${category.slug}/question/${question.id}`}
      className={`question-item ${learned ? 'learned' : ''}`}
    >
      <div className="question-content">
        <h3 className="question-title">{question.title}</h3>
        <p className="question-preview">
          {question.answer.substring(0, 100)}...
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
          {learned ? (
            <CheckCircleOutlined />
          ) : (
            <span className="circle-icon">○</span>
          )}
        </button>
        <div className="question-arrow">
          <ArrowRightOutlined />
        </div>
      </div>
    </Link>
  );
};
