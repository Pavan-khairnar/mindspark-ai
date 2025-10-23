import React from 'react';
import OptionCard from './OptionCard';
import './QuestionCard.css';

const QuestionCard = ({ question, selectedOption, onOptionSelect, showResults }) => {
  if (!question) return null;

  return (
    <div className="question-card glass-card slide-in">
      <div className="question-header">
        <div className="question-badge">Question</div>
        <div className="question-meta">
          <span className="difficulty-badge">{question.difficulty}</span>
        </div>
      </div>
      
      <div className="question-content">
        <h3 className="question-text">{question.question}</h3>
        
        <div className="options-grid">
          {question.options.map((option, index) => (
            <OptionCard
              key={index}
              option={option}
              index={index}
              isSelected={selectedOption === index}
              isCorrect={showResults && index === question.correctAnswer}
              isIncorrect={showResults && selectedOption === index && selectedOption !== question.correctAnswer}
              onSelect={() => onOptionSelect(index)}
              disabled={showResults}
            />
          ))}
        </div>
      </div>
      
      {showResults && (
        <div className="question-results">
          <div className={`result-feedback ${selectedOption === question.correctAnswer ? 'correct' : 'incorrect'}`}>
            <div className="feedback-icon">
              {selectedOption === question.correctAnswer ? '🎉' : '💡'}
            </div>
            <div className="feedback-content">
              <h4>
                {selectedOption === question.correctAnswer 
                  ? 'Correct! Well done!' 
                  : 'Not quite right!'}
              </h4>
              <p className="explanation">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;