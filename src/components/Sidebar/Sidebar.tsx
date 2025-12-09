import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuestions } from '../../context';
import { HomeOutlined, BarsOutlined } from '@ant-design/icons';
import './Sidebar.css';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
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
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          onClick={onClose}
        >
          <span className="nav-icon"><HomeOutlined /></span>
          <span>Все категории</span>
        </Link>

        <div className="nav-section">
          <h3 className="nav-section-title"><BarsOutlined /> Разделы</h3>
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
        <p className="footer-text">Created by <strong>gevorg.kara</strong></p>
      </div>
    </aside>
  );
};
