import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import './QuizCard.css';

const QuizCard = ({ quiz, activeSession, onSessionStart, onRefresh }) => {
  const startLiveSession = async () => {
    try {
      const pin = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const sessionData = {
        quizId: quiz.id,
        quizTitle: quiz.title,
        pin: pin,
        isLive: true,
        createdBy: quiz.createdBy,
        createdAt: new Date(),
        participants: {},
        currentQuestion: 0,
        scores: {},
        status: 'waiting'
      };

      // You'll need to implement the session creation logic here
      // For now, we'll just show the PIN
      alert(`🎉 Live session ready!\n\n📟 PIN: ${pin}\n\nStudents can join using this PIN`);
      
    } catch (error) {
      alert('Error starting live session: ' + error.message);
    }
  };

  const deleteQuiz = async () => {
    if (window.confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      try {
        await deleteDoc(doc(db, 'quizzes', quiz.id));
        onRefresh();
        alert('Quiz deleted successfully!');
      } catch (error) {
        alert('Error deleting quiz: ' + error.message);
      }
    }
  };

  return (
    <div className="quiz-card glass-card">
      <div className="quiz-card-header">
        <h3 className="quiz-title">{quiz.title}</h3>
        <div className="quiz-meta">
          <span className="questions-count">📊 {quiz.questionCount || quiz.questions?.length || 0} questions</span>
          <span className="created-date">
            📅 {quiz.createdAt?.toLocaleDateString() || 'Recently'}
          </span>
        </div>
      </div>

      <div className="quiz-card-actions">
        <button 
          onClick={startLiveSession}
          disabled={activeSession}
          className={`btn-action ${activeSession ? 'disabled' : 'live'}`}
        >
          {activeSession ? '🎯 Session Active' : '🎯 Start Live'}
        </button>
        
        <button className="btn-action edit">
          ✏️ Edit
        </button>
        
        <button 
          onClick={deleteQuiz}
          className="btn-action delete"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default QuizCard;