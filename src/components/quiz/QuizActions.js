import React from 'react';
import './QuizActions.css';

const QuizActions = ({ 
  onSaveQuiz, 
  onShare, 
  onNewQuestion, 
  hasQuestion,
  isSaved 
}) => {
  return (
    <div className="quiz-actions">
      <button 
        className="btn-secondary action-btn"
        onClick={onNewQuestion}
        disabled={!hasQuestion}
      >
        <span className="action-icon">🔄</span>
        New Question
      </button>
      
      <button 
        className={`action-btn ${isSaved ? 'btn-saved' : 'btn-primary'}`}
        onClick={onSaveQuiz}
        disabled={!hasQuestion || isSaved}
      >
        <span className="action-icon">
          {isSaved ? '✅' : '💾'}
        </span>
        {isSaved ? 'Saved to Quiz' : 'Save to Quiz'}
      </button>
      
      <button 
        className="btn-secondary action-btn"
        onClick={onShare}
        disabled={!hasQuestion}
      >
        <span className="action-icon">📤</span>
        Share
      </button>
    </div>
  );
};

export default QuizActions;