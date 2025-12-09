import React, { createContext, useContext, useState, useEffect } from 'react';
import questionsData from './questions-data.json';
import type { QuestionsData, Category, Question } from './types';

interface QuestionsContextType {
  data: QuestionsData;
  getCategory: (slug: string) => Category | undefined;
  getQuestionsInCategory: (categoryId: number) => Question[];
  getQuestionsCountInCategory: (categoryId: number) => number;
  getQuestion: (id: number) => Question | undefined;
  toggleLearned: (questionId: number) => void;
  isLearned: (questionId: number) => boolean;
  learnedQuestions: Set<number>;
  getLearnedCount: () => number;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(
  undefined
);

const LEARNED_STORAGE_KEY = 'learned_questions';

export const QuestionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const data = questionsData as QuestionsData;
  const [learnedQuestions, setLearnedQuestions] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    const stored = localStorage.getItem(LEARNED_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLearnedQuestions(new Set(parsed));
      } catch {
        // Silently ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      LEARNED_STORAGE_KEY,
      JSON.stringify(Array.from(learnedQuestions))
    );
  }, [learnedQuestions]);

  const getCategory = (slug: string) => {
    return data.categories.find((cat) => cat.slug === slug);
  };

  const getQuestionsInCategory = (categoryId: number) => {
    return data.questions.filter((q) => q.categoryId === categoryId);
  };

  const getQuestionsCountInCategory = (categoryId: number) => {
    return data.questions.filter((q) => q.categoryId === categoryId).length;
  };

  const getQuestion = (id: number) => {
    return data.questions.find((q) => q.id === id);
  };

  const toggleLearned = (questionId: number) => {
    setLearnedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const isLearned = (questionId: number) => {
    return learnedQuestions.has(questionId);
  };

  const getLearnedCount = () => {
    return learnedQuestions.size;
  };

  return (
    <QuestionsContext.Provider
      value={{
        data,
        getCategory,
        getQuestionsInCategory,
        getQuestionsCountInCategory,
        getQuestion,
        toggleLearned,
        isLearned,
        learnedQuestions,
        getLearnedCount,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within QuestionsProvider');
  }
  return context;
};
