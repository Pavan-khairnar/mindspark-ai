import React, { useState } from 'react';
import Header from '../components/common/Header';
import QuizGenerator from '../components/quiz/QuizGenerator';
import QuestionCard from '../components/quiz/QuestionCard';
import QuizActions from '../components/quiz/QuizActions';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import './QuizStudio.css';

const QuizStudio = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleQuestionGenerated = (question) => {
    setCurrentQuestion(question);
    setSelectedOption(null);
    setShowResults(false);
    setIsSaved(false);
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
    setShowResults(true);
  };

  const handleNewQuestion = () => {
    setCurrentQuestion(null);
    setSelectedOption(null);
    setShowResults(false);
    setIsSaved(false);
  };

  const handleSaveQuiz = () => {
    // TODO: Implement save functionality
    setIsSaved(true);
    // Show success message
    setTimeout(() => {
      // Auto-generate new question after save
      handleNewQuestion();
    }, 2000);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    alert('Quiz link copied to clipboard!');
  };

  return (
    <div className="quiz-studio">
      <AnimatedBackground />
      <Header />
      
      <main className="studio-main">
        <div className="studio-container">
          <div className="studio-content">
            <QuizGenerator onQuestionGenerated={handleQuestionGenerated} />
            
            {currentQuestion && (
              <>
                <QuestionCard
                  question={currentQuestion}
                  selectedOption={selectedOption}
                  onOptionSelect={handleOptionSelect}
                  showResults={showResults}
                />
                
                <QuizActions
                  onSaveQuiz={handleSaveQuiz}
                  onShare={handleShare}
                  onNewQuestion={handleNewQuestion}
                  hasQuestion={!!currentQuestion}
                  isSaved={isSaved}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizStudio;