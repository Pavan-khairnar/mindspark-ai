import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';

function TeacherQuizBuilder() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quizTitle, setQuizTitle] = useState("My Awesome Quiz");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2
    }
  ]);

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    }
  };

  const saveQuiz = () => {
    const isValid = questions.every(q => 
      q.question.trim() !== "" && 
      q.options.every(opt => opt.trim() !== "") &&
      q.options[q.correctAnswer].trim() !== ""
    );

    if (!isValid) {
      alert("Please fill in all questions and options, and select correct answers!");
      return;
    }

    const quizData = {
      id: quizId,
      title: quizTitle,
      questions: questions,
      isActive: true,
      showScoresToStudents: true,
      students: {},
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(quizData));
    alert("🎉 Quiz saved successfully!");
    navigate(`/teacher/quiz/${quizId}`);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground />
      
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: theme.spacing.xxl,
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: theme.spacing.xl
        }}>
          <div style={{
            ...theme.typography.h1,
            background: theme.gradients.primary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: theme.spacing.md,
            textShadow: `0 0 30px ${theme.colors.primary.main}40`
          }}>
            📝 Create Your Quiz
          </div>
          <p style={{
            color: theme.colors.text.secondary,
            fontSize: '1.1rem'
          }}>
            Build an engaging quiz for your students
          </p>
        </div>

        {/* Quiz Title */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.primary.main}30`,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.shadows.lg,
          marginBottom: theme.spacing.xl
        }}>
          <label style={{
            display: 'block',
            marginBottom: theme.spacing.md,
            color: theme.colors.text.primary,
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            Quiz Title
          </label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            placeholder="Enter an engaging quiz title..."
            style={{
              width: '100%',
              padding: theme.spacing.md,
              background: theme.colors.background.secondary,
              border: `2px solid ${theme.colors.primary.main}30`,
              borderRadius: theme.borderRadius.md,
              fontSize: '1.1rem',
              color: theme.colors.text.primary,
              transition: theme.animations.hover,
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary.main;
              e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary.main}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = `${theme.colors.primary.main}30`;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Questions */}
        {questions.map((q, questionIndex) => (
          <div key={q.id} style={{ 
            background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.accent.main}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.md,
            marginBottom: theme.spacing.lg,
            transition: theme.animations.hover
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = theme.shadows.lg;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = theme.shadows.md;
          }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: theme.spacing.lg,
              paddingBottom: theme.spacing.md,
              borderBottom: `1px solid ${theme.colors.primary.main}20`
            }}>
              <h3 style={{ 
                color: theme.colors.text.primary, 
                margin: 0,
                fontSize: '1.3rem'
              }}>
                Question {questionIndex + 1}
              </h3>
              {questions.length > 1 && (
                <button 
                  onClick={() => removeQuestion(questionIndex)}
                  style={{ 
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.colors.error?.main || '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.sm,
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    transition: theme.animations.hover
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Question Text */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{ 
                display: 'block', 
                marginBottom: theme.spacing.sm, 
                color: theme.colors.text.primary,
                fontWeight: '600'
              }}>
                Question
              </label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                placeholder="Enter your question here..."
                style={{
                  width: '100%',
                  padding: theme.spacing.md,
                  background: theme.colors.background.secondary,
                  border: `2px solid ${theme.colors.primary.main}30`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: '1rem',
                  color: theme.colors.text.primary,
                  transition: theme.animations.hover,
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary.main;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary.main}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${theme.colors.primary.main}30`;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Options */}
            <div style={{ marginBottom: theme.spacing.lg }}>
              <label style={{ 
                display: 'block', 
                marginBottom: theme.spacing.md, 
                color: theme.colors.text.primary,
                fontWeight: '600'
              }}>
                Options (Select the correct answer)
              </label>
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: theme.spacing.sm,
                  padding: theme.spacing.sm,
                  background: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.md,
                  border: `1px solid ${theme.colors.primary.main}20`,
                  transition: theme.animations.hover
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary.main;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = `${theme.colors.primary.main}20`;
                }}
                >
                  <input
                    type="radio"
                    name={`correctAnswer-${questionIndex}`}
                    checked={q.correctAnswer === optionIndex}
                    onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                    style={{ 
                      marginRight: theme.spacing.md,
                      accentColor: theme.colors.primary.main
                    }}
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    style={{
                      flex: 1,
                      padding: theme.spacing.sm,
                      background: 'transparent',
                      border: 'none',
                      fontSize: '1rem',
                      color: theme.colors.text.primary,
                      outline: 'none'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Add Question Button */}
        <button 
          onClick={addQuestion}
          style={{ 
            width: '100%',
            padding: theme.spacing.lg,
            background: theme.gradients?.accent || 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            border: 'none',
            borderRadius: theme.borderRadius.lg,
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: theme.animations.hover,
            boxShadow: theme.shadows.glow,
            marginBottom: theme.spacing.xl,
            border: `1px solid ${theme.colors.accent.light}40`
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = `0 8px 40px ${theme.colors.accent.main}60`;
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = theme.shadows.glow;
          }}
        >
          + Add Another Question
        </button>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: theme.spacing.md, 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => navigate('/teacher')}
            style={{ 
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              background: 'rgba(255,255,255,0.1)',
              color: theme.colors.text.primary,
              border: `1px solid ${theme.colors.primary.main}30`,
              borderRadius: theme.borderRadius.full,
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: theme.animations.hover,
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Cancel
          </button>
          
          <button 
            onClick={saveQuiz}
            style={{ 
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              background: theme.gradients.primary,
              color: 'white',
              border: 'none',
              borderRadius: theme.borderRadius.full,
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: theme.animations.hover,
              boxShadow: theme.shadows.glow,
              border: `1px solid ${theme.colors.primary.light}40`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 8px 40px ${theme.colors.primary.main}60`;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = theme.shadows.glow;
            }}
          >
            💾 Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherQuizBuilder;