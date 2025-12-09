import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QuestionsProvider } from './context';
import { Sidebar } from './components/Sidebar';
import { Home } from './components/Home';
import { CategoryPage } from './components/CategoryPage';
import { QuestionDetailPage } from './components/QuestionDetailPage';
import { SearchResults } from './components/SearchResults';
import './App.css';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <QuestionsProvider>
      <BrowserRouter>
        <div className="app-layout">
          <div className={`sidebar-wrapper ${isSidebarOpen ? 'open' : ''}`}>
            <Sidebar
              onSearch={() => setIsSearchOpen(true)}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
          {isSidebarOpen && (
            <div
              className="sidebar-overlay"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <main className="main-content">
            <div className="mobile-header">
              <button
                className="hamburger"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                ☰
              </button>
              <h1 className="mobile-title">Q&A Hub</h1>
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route
                path="/category/:slug/question/:questionId"
                element={<QuestionDetailPage />}
              />
            </Routes>
          </main>
          <SearchResults
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        </div>
      </BrowserRouter>
    </QuestionsProvider>
  );
}
