import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizData } from '../data/quizData';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQuiz = quizData[currentQuestion];

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, showResult]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuiz.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setTimeLeft(30);
  };

  if (showResult) {
    return (
      <div style={{ 
        padding: '40px', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
            📊 Quiz Completed!
          </h1>
          
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            padding: '30px',
            borderRadius: '15px',
            margin: '30px 0'
          }}>
            <h2 style={{ fontSize: '3rem', margin: '0' }}>{score}/{quizData.length}</h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
              {score === quizData.length ? "Perfect Score! 🎯" : 
               score >= quizData.length * 0.7 ? "Great Job! 👍" : 
               "Keep Practicing! 💪"}
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleRestartQuiz}
              style={{ 
                padding: '12px 25px', 
                backgroundColor: '#FF9800', 
                color: 'white', 
                border: 'none',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Try Again
            </button>
            
            <Link 
              to="/" 
              style={{ 
                padding: '12px 25px', 
                backgroundColor: '#2196F3', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              🏠 Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '1.1rem', color: '#666' }}>
            Question {currentQuestion + 1} of {quizData.length}
          </div>
          <div style={{
            padding: '8px 16px',
            background: timeLeft < 10 ? '#ff4444' : '#4CAF50',
            color: 'white',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}>
            ⏰ {timeLeft}s
          </div>
        </div>

        {/* Progress Bar Visual */}
        <div style={{
          width: '100%',
          height: '8px',
          background: '#f0f0f0',
          borderRadius: '4px',
          marginBottom: '30px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #4CAF50, #45a049)',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {/* Question */}
        <div style={{
          background: '#f8f9fa',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#555', marginBottom: '20px' }}>Question {currentQuestion + 1}</h2>
          <p style={{ 
            fontSize: '1.3rem', 
            marginBottom: '25px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            {currentQuiz.question}
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {currentQuiz.options.map((option, index) => (
              <button 
                key={index}
                onClick={() => handleAnswerSelect(index)}
                style={{
                  padding: '15px',
                  border: selectedAnswer === index ? '2px solid #4CAF50' : '2px solid #e0e0e0',
                  borderRadius: '10px',
                  background: selectedAnswer === index ? '#e8f5e8' : 'white',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/" 
            style={{ 
              padding: '12px 25px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            ← Home
          </Link>
          
          <button 
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            style={{ 
              padding: '12px 25px', 
              backgroundColor: selectedAnswer === null ? '#cccccc' : '#4CAF50', 
              color: 'white', 
              border: 'none',
              borderRadius: '25px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: selectedAnswer === null ? 'not-allowed' : 'pointer'
            }}
          >
            {currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'} →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;