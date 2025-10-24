import React from 'react';
import ThemeToggle from './ThemeToggle';
import GradientButton from '../ui/GradientButton';
import './Header.css';

const Header = ({ user, onLogout, activeSession }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <div className="logo-icon">🧠</div>
          <h1 className="logo-text">
            <span className="gradient-text">MindSpark</span>
            <span className="logo-subtitle">AI Quiz</span>
          </h1>
        </div>
        
        <div className="header-actions">
          {activeSession && (
            <div className="live-session-badge">
              🎯 LIVE: PIN {activeSession.pin}
            </div>
          )}
          <ThemeToggle />
          {user && (
            <div className="user-menu">
              <span className="user-email">{user.email}</span>
              <GradientButton
                onClick={onLogout}
                variant="error"
                size="small"
              >
                Logout
              </GradientButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;