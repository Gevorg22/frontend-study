import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuestions } from '../../context';
import { CheckCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import MarkdownRenderer from './MarkdownRenderer';
import './QuestionDetailPage.css';

export const QuestionDetailPage: React.FC = () => {
  const { slug, questionId } = useParams<{
    slug: string;
    questionId: string;
  }>();
  const {
    getQuestion,
    getQuestionsInCategory,
    getCategory,
    toggleLearned,
    isLearned,
  } = useQuestions();

  if (!slug || !questionId) {
    return <div className="error">Вопрос не найден</div>;
  }

  const question = getQuestion(Number(questionId));
  const category = getCategory(slug);
  const allQuestions = getQuestionsInCategory(category?.id || 0);

  if (!question || !category) {
    return (
      <div className="error-container">
        <h2>Вопрос не найден</h2>
        <Link to={`/category/${slug}`}>Вернуться в категорию</Link>
      </div>
    );
  }

  const currentIndex = allQuestions.findIndex((q) => q.id === question.id);
  const previousQuestion =
    currentIndex > 0 ? allQuestions[currentIndex - 1] : null;
  const nextQuestion =
    currentIndex < allQuestions.length - 1
      ? allQuestions[currentIndex + 1]
      : null;
  const isLearned_ = isLearned(question.id);

  return (
    <div className="question-detail-page">
      <div className="breadcrumb">
        <Link to="/">Главная</Link>
        <span>/</span>
        <Link to={`/category/${slug}`}>{category.name}</Link>
        <span>/</span>
        <span className="current">
          Вопрос {currentIndex + 1} из {allQuestions.length}
        </span>
      </div>

      <div className="detail-container">
        <div className="detail-header">
          <h1 className="detail-title">{question.title}</h1>
        </div>

        <div className="answer-section">
          <div className="answer-content">
            <MarkdownRenderer content={question.answer} />
          </div>
        </div>

        <button
          className={`mark-learned-btn ${isLearned_ ? 'active' : ''}`}
          onClick={() => toggleLearned(question.id)}
          title={
            isLearned_
              ? 'Отметить как неизученное'
              : 'Отметить как изученное'
          }
        >
          {isLearned_ ? (
            <>
              <CheckCircleOutlined /> Изучено
            </>
          ) : (
            <>
              <span className="circle-icon">○</span> Отметить как изученное
            </>
          )}
        </button>

        <div className="navigation">
          {previousQuestion ? (
            <Link
              to={`/category/${slug}/question/${previousQuestion.id}`}
              className="nav-button prev"
            >
              <span><ArrowLeftOutlined /> Предыдущий</span>
              <span className="nav-title">{previousQuestion.title}</span>
            </Link>
          ) : (
            <div className="nav-button disabled">
              <span><ArrowLeftOutlined /> Предыдущий</span>
            </div>
          )}

          <div className="progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentIndex + 1) / allQuestions.length) * 100}%`,
                }}
              />
            </div>
            <span className="progress-text">
              {currentIndex + 1} / {allQuestions.length}
            </span>
          </div>

          {nextQuestion ? (
            <Link
              to={`/category/${slug}/question/${nextQuestion.id}`}
              className="nav-button next"
            >
              <span>Следующий <ArrowRightOutlined /></span>
              <span className="nav-title">{nextQuestion.title}</span>
            </Link>
          ) : (
            <div className="nav-button disabled">
              <span>Следующий <ArrowRightOutlined /></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
