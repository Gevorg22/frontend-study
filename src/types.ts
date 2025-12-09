export interface Category {
  id: number;
  name: string;
  slug: string;
  questions: number[];
}

export interface Question {
  id: number;
  categoryId: number;
  title: string;
  answer: string;
  categorySlug: string;
}

export interface QuestionsData {
  categories: Category[];
  questions: Question[];
  totalQuestions: number;
  totalCategories: number;
  generatedAt: string;
}
