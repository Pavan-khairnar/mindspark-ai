import React, { useState, useEffect } from 'react';
import './TypewriterText.css';

const TypewriterText = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  cursor = true,
  onComplete,
  className = '' 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!isStarted || !text) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [currentIndex, isStarted, text, speed, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsStarted(false);
  }, [text]);

  return (
    <div className={`typewriter-container ${className}`}>
      <span className="typewriter-text">
        {displayText}
        {cursor && <span className="typewriter-cursor">|</span>}
      </span>
    </div>
  );
};

export default TypewriterText;