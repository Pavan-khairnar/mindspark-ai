import React from 'react';
import './OptionCard.css';

const OptionCard = ({ 
  option, 
  index, 
  isSelected, 
  isCorrect, 
  isIncorrect, 
  onSelect, 
  disabled 
}) => {
  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getStateClass = () => {
    if (isCorrect) return 'correct';
    if (isIncorrect) return 'incorrect';
    if (isSelected) return 'selected';
    return '';
  };

  return (
    <div
      className={`option-card ${getStateClass()} glass-card-hover`}
      onClick={!disabled ? onSelect : undefined}
    >
      <div className="option-content">
        <div className="option-letter">
          {getOptionLetter(index)}
        </div>
        <div className="option-text">
          {option}
        </div>
        <div className="option-state">
          {isCorrect && '✅'}
          {isIncorrect && '❌'}
          {isSelected && !isCorrect && !isIncorrect && '⚪'}
        </div>
      </div>
    </div>
  );
};

export default OptionCard;