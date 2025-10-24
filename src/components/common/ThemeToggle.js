import React from 'react';
import useTheme from '../../hooks/useTheme';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <div className="theme-toggle-track">
        <div className={`theme-toggle-thumb ${theme}`}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;