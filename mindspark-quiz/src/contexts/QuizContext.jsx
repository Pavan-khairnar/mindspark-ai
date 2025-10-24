// src/contexts/QuizContext.jsx
import React, { createContext, useContext, useState } from 'react';

const QuizContext = createContext();

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

export function QuizProvider({ children }) {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [studentAnswers, setStudentAnswers] = useState({});

  const value = {
    // Quiz management
    currentQuiz,
    setCurrentQuiz,
    
    // Results
    quizResults,
    setQuizResults,
    
    // Active quiz session
    activeQuiz,
    setActiveQuiz,
    
    // Student answers
    studentAnswers,
    setStudentAnswers
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}