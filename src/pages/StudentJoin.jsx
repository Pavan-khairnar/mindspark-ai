import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';
import { quizService } from '../services/firebaseServices';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Safe theme access with fallbacks
const safeTheme = {
  colors: {
    primary: { 
      main: theme?.colors?.primary?.main || '#667eea',
      light: theme?.colors?.primary?.light || '#764ba2'
    },
    secondary: { 
      main: theme?.colors?.secondary?.main || '#f093fb',
      light: theme?.colors?.secondary?.light || '#f5576c'
    },
    accent: {
      main: theme?.colors?.accent?.main || '#4facfe'
    },
    text: {
      primary: theme?.colors?.text?.primary || '#333333',
      secondary: theme?.colors?.text?.secondary || '#666666',
      muted: theme?.colors?.text?.muted || '#999999'
    },
    background: {
      card: theme?.colors?.background?.card || 'rgba(255, 255, 255, 0.1)',
      surface: theme?.colors?.background?.surface || 'rgba(255, 255, 255, 0.05)',
      secondary: theme?.colors?.background?.secondary || 'rgba(255, 255, 255, 0.08)'
    }
  },
  spacing: {
    xs: theme?.spacing?.xs || '8px',
    sm: theme?.spacing?.sm || '12px',
    md: theme?.spacing?.md || '16px',
    lg: theme?.spacing?.lg || '24px',
    xl: theme?.spacing?.xl || '32px',
    xxl: theme?.spacing?.xxl || '48px'
  },
  borderRadius: {
    sm: theme?.borderRadius?.sm || '4px',
    md: theme?.borderRadius?.md || '8px',
    lg: theme?.borderRadius?.lg || '12px',
    xl: theme?.borderRadius?.xl || '16px',
    full: theme?.borderRadius?.full || '9999px'
  },
  shadows: {
    sm: theme?.shadows?.sm || '0 2px 4px rgba(0,0,0,0.1)',
    md: theme?.shadows?.md || '0 4px 8px rgba(0,0,0,0.1)',
    lg: theme?.shadows?.lg || '0 8px 16px rgba(0,0,0,0.1)',
    xl: theme?.shadows?.xl || '0 16px 32px rgba(0,0,0,0.1)',
    glow: theme?.shadows?.glow || '0 4px 20px rgba(102, 126, 234, 0.3)'
  },
  gradients: {
    student: theme?.gradients?.student || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  typography: {
    h2: theme?.typography?.h2 || {
      fontSize: '2rem',
      fontWeight: '700',
      lineHeight: '1.2'
    }
  },
  animations: {
    hover: theme?.animations?.hover || 'all 0.3s ease'
  }
};

function StudentJoin() {
  const [quizId, setQuizId] = useState('');
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  // Helper function to get all quizzes
  const getAllQuizzes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      const quizzes = [];
      querySnapshot.forEach((doc) => {
        quizzes.push({ id: doc.id, ...doc.data() });
      });
      return quizzes;
    } catch (error) {
      console.error('Error getting all quizzes:', error);
      return [];
    }
  };

  const handleJoinQuiz = async (e) => {
    e.preventDefault();
    
    try {
      if (!quizId.trim()) {
        alert('Please enter a Quiz ID');
        return;
      }

      if (!studentName.trim()) {
        alert('Please enter your name');
        return;
      }

      console.log('🔍 Searching for quiz ID:', quizId);
      
      // First try exact match
      let quizData = await quizService.getQuizById(quizId);
      
      // If not found, try case-insensitive search
      if (!quizData) {
        console.log('🔄 Trying case-insensitive search...');
        const allQuizzes = await getAllQuizzes();
        const foundQuiz = allQuizzes.find(q => 
          q.id.toLowerCase() === quizId.toLowerCase()
        );
        
        if (foundQuiz) {
          console.log('✅ Found quiz with case-insensitive match:', foundQuiz.id);
          quizData = foundQuiz;
          setQuizId(foundQuiz.id);
        }
      }
      
      if (quizData) {
        if (!quizData.isActive) {
          alert('This quiz is not active. Please contact your teacher.');
          return;
        }
        console.log('🎯 Navigating to quiz:', quizData.id);
        
        // Store student name for the quiz
        localStorage.setItem('studentName', studentName);
        
        navigate(`/student/quiz/${quizData.id}`);
      } else {
        alert('Quiz not found! Please check the Quiz ID.');
      }
    } catch (error) {
      console.error('Error joining quiz:', error);
      alert('Error joining quiz. Please try again.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground />
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: safeTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${safeTheme.colors.background.card}, ${safeTheme.colors.background.surface})`,
          padding: safeTheme.spacing.xxl,
          borderRadius: safeTheme.borderRadius.xl,
          border: `1px solid ${safeTheme.colors.secondary.main}30`,
          backdropFilter: 'blur(20px)',
          boxShadow: safeTheme.shadows.xl,
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: safeTheme.gradients.student
          }}></div>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: safeTheme.spacing.xl }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: safeTheme.spacing.lg,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              🎓
            </div>
            <h1 style={{
  ...safeTheme.typography.h2,
  //color: safeTheme.colors.text.primary,  // ← Remove this line
  marginBottom: safeTheme.spacing.sm,
  background: safeTheme.gradients.student,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent'  // ← Keep this one
}}>
            
              Join Quiz
            </h1>
            <p style={{
              color: safeTheme.colors.text.secondary,
              fontSize: '1.1rem'
            }}>
              Enter your details to join the quiz session
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoinQuiz}>
            {/* Name Input */}
            <div style={{ marginBottom: safeTheme.spacing.lg }}>
              <label style={{
                display: 'block',
                marginBottom: safeTheme.spacing.sm,
                color: safeTheme.colors.text.primary,
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                Your Name
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: safeTheme.spacing.md,
                  background: safeTheme.colors.background.secondary,
                  border: `2px solid ${safeTheme.colors.primary.main}30`, // 👈 COMMA ADDED
                  borderRadius: safeTheme.borderRadius.md,
                  fontSize: '1rem',
                  color: safeTheme.colors.text.primary,
                  transition: safeTheme.animations.hover,
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = safeTheme.colors.primary.main;
                  e.target.style.boxShadow = `0 0 0 3px ${safeTheme.colors.primary.main}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${safeTheme.colors.primary.main}30`;
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Quiz ID Input - FIXED UPPERCASE ISSUE */}
            <div style={{ marginBottom: safeTheme.spacing.xl }}>
              <label style={{
                display: 'block',
                marginBottom: safeTheme.spacing.sm,
                color: safeTheme.colors.text.primary,
                fontWeight: '600',
                fontSize: '1rem'
              }}>
                Quiz ID
              </label>
              <input
                type="text"
                value={quizId}
                onChange={(e) => setQuizId(e.target.value)}
                placeholder="Enter Quiz ID (e.g., ghGRK7Q8nV68I9d2zeG1)"
                style={{
                  width: '100%',
                  padding: safeTheme.spacing.md,
                  background: safeTheme.colors.background.secondary,
                  border: `2px solid ${safeTheme.colors.primary.main}30`, // 👈 COMMA ADDED
                  borderRadius: safeTheme.borderRadius.md,
                  fontSize: '1rem',
                  color: safeTheme.colors.text.primary,
                  transition: safeTheme.animations.hover,
                  outline: 'none',
                  fontFamily: 'monospace'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = safeTheme.colors.primary.main;
                  e.target.style.boxShadow = `0 0 0 3px ${safeTheme.colors.primary.main}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = `${safeTheme.colors.primary.main}30`;
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: safeTheme.spacing.lg,
                background: safeTheme.gradients.student,
                color: 'white',
                //border: 'none',
                borderRadius: safeTheme.borderRadius.full,
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: safeTheme.animations.hover,
                boxShadow: safeTheme.shadows.glow,
                border: `1px solid ${safeTheme.colors.secondary.light}40`
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 40px ${safeTheme.colors.secondary.main}60`;
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = safeTheme.shadows.glow;
              }}
            >
              Join Quiz Session
            </button>
          </form>

          {/* Help Text */}
          <div style={{
            marginTop: safeTheme.spacing.xl,
            padding: safeTheme.spacing.lg,
            background: safeTheme.colors.background.secondary,
            borderRadius: safeTheme.borderRadius.md,
            border: `1px solid ${safeTheme.colors.accent.main}20`,
            textAlign: 'center'
          }}>
            <p style={{
              margin: 0,
              color: safeTheme.colors.text.secondary,
              fontSize: '0.9rem'
            }}>
              <strong>Pro Tip:</strong> Quiz IDs are case-sensitive. Copy and paste exactly as provided.
            </p>
          </div>

          {/* Back to Home */}
          <div style={{ textAlign: 'center', marginTop: safeTheme.spacing.lg }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: `${safeTheme.spacing.sm} ${safeTheme.spacing.md}`,
                background: 'transparent',
                color: safeTheme.colors.text.secondary,
                border: `1px solid ${safeTheme.colors.text.muted}30`,
                borderRadius: safeTheme.borderRadius.full,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: safeTheme.animations.hover
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.color = safeTheme.colors.text.primary;
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = safeTheme.colors.text.secondary;
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentJoin;