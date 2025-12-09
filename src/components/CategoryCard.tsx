import React from "react";
import { Link } from "react-router-dom";
import type { Category } from "../types";
import "./CategoryCard.css";

interface CategoryCardProps {
  category: Category;
  questionCount: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, questionCount }) => {
  return (
    <Link to={`/category/${category.slug}`} className="category-card">
      <div className="card-header">
        <h3>{category.name}</h3>
        <span className="question-badge">{questionCount}</span>
      </div>
      <div className="card-footer">
        <span className="card-link">Изучить →</span>
      </div>
    </Link>
  );
};
