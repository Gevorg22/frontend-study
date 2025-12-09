import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuestions } from '../context';
import './Sidebar.css';

interface SidebarProps {
  onSearch: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSearch, onClose }) => {
  const { data, getQuestionsCountInCategory } = useQuestions();
  const location = useLocation();

  const isActive = (slug: string) => {
    return location.pathname.includes(slug);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Q&A Hub</h1>
        <p className="sidebar-subtitle">Шпаргалка для разработчика</p>
        <button className="search-button" onClick={onSearch}>
          🔍 Поиск
        </button>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          onClick={onClose}
        >
          <span className="nav-icon">🏠</span>
          <span>Все категории</span>
        </Link>

        <div className="nav-section">
          <h3 className="nav-section-title">Разделы</h3>
          {data.categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className={`nav-item ${isActive(category.slug) ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="nav-item-name">{category.name}</span>
              <span className="nav-item-count">
                {getQuestionsCountInCategory(category.id)}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <p className="footer-text">Created for developers 💻</p>
      </div>
    </aside>
  );
};
