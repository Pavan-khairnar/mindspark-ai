import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';
import { auth, db } from '../config/firebase';
import { quizService, studentService } from '../services/firebaseServices';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// Professional theme access with CSS variables
const professionalTheme = {
  colors: {
    primary: theme?.colors?.primary || { main: '#667eea', light: '#764ba2' },
    secondary: theme?.colors?.secondary || { main: '#f093fb', light: '#f5576c' },
    success: theme?.colors?.success || { main: '#4ade80', light: '#86efac' },
    warning: theme?.colors?.warning || { main: '#f59e0b', light: '#fcd34d' },
    error: theme?.colors?.error || { main: '#ef4444', light: '#fca5a5' },
    text: theme?.colors?.text || { primary: '#f8fafc', secondary: '#cbd5e1' },
    background: theme?.colors?.background || { card: 'rgba(30, 41, 59, 0.8)', surface: 'rgba(15, 23, 42, 0.6)' }
  },
  spacing: {
    xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', xxl: '48px'
  },
  borderRadius: {
    sm: '6px', md: '12px', lg: '16px', xl: '20px'
  }
};

function StudentQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [studentName, setStudentName] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Professional UI Styles
  const styles = {
    container: {
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--color-background)'
    },
    card: {
      background: 'var(--color-surface)',
      backdropFilter: 'blur(20px)',
      borderRadius: professionalTheme.borderRadius.lg,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: professionalTheme.spacing.xl,
      marginBottom: professionalTheme.spacing.xl,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    },
    input: {
      width: '100%',
      padding: professionalTheme.spacing.md,
      background: 'rgba(255, 255, 255, 0.08)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: professionalTheme.borderRadius.md,
      fontSize: '1rem',
      color: 'var(--color-text-primary)',
      transition: 'all 0.3s ease',
      outline: 'none',
      fontFamily: 'inherit'
    },
    inputFocus: {
      borderColor: 'var(--color-primary)',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
    },
    button: {
      primary: {
        padding: `${professionalTheme.spacing.md} ${professionalTheme.spacing.lg}`,
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        border: 'none',
        borderRadius: professionalTheme.borderRadius.md,
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: 'var(--shadow-glow)'
      },
      secondary: {
        padding: `${professionalTheme.spacing.md} ${professionalTheme.spacing.lg}`,
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'var(--color-text-primary)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: professionalTheme.borderRadius.md,
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      },
      success: {
        padding: `${professionalTheme.spacing.md} ${professionalTheme.spacing.lg}`,
        background: 'linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%)',
        color: 'white',
        border: 'none',
        borderRadius: professionalTheme.borderRadius.md,
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 20px rgba(74, 222, 128, 0.4)'
      },
      option: {
        padding: professionalTheme.spacing.lg,
        background: 'rgba(255, 255, 255, 0.05)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: professionalTheme.borderRadius.md,
        color: 'var(--color-text-primary)',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        width: '100%'
      },
      optionSelected: {
        background: 'rgba(102, 126, 234, 0.2)',
        border: '2px solid var(--color-primary)',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        transform: 'translateY(-2px)'
      }
    }
  };

  useEffect(() => {
    console.log('🔍 URL quizId parameter:', quizId);
    
    if (!quizId || quizId.length < 5) {
      setError('Invalid quiz ID provided in URL');
      setLoading(false);
      return;
    }
    
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Original quiz ID from URL:', quizId);
      
      let quizData = await quizService.getQuizById(quizId);
      
      if (!quizData) {
        console.log('🔄 Quiz not found with exact case, searching case-insensitive...');
        const allQuizzes = await getAllQuizzes();
        const foundQuiz = allQuizzes.find(q => 
          q.id.toLowerCase() === quizId.toLowerCase()
        );
        
        if (foundQuiz) {
          console.log('🎯 Found quiz with different case. Correcting URL...');
          navigate(`/student/quiz/${foundQuiz.id}`, { replace: true });
          return;
        }
      }
      
      if (!quizData) {
        setError(`Quiz "${quizId}" not found.`);
        return;
      }
      
      if (!quizData.isActive) {
        setError('This quiz is not active. Please contact your teacher.');
        return;
      }
      
      console.log('✅ Quiz loaded successfully:', quizData.title);
      setQuiz(quizData);
      setTimeLeft((quizData.timeLimit || 10) * 60);
      
    } catch (error) {
      console.error('❌ Error loading quiz:', error);
      setError(`Failed to load quiz: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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

  const createTestQuiz = async () => {
    try {
      const testQuiz = {
        title: "Sample Science Quiz",
        description: "Test your science knowledge with basic questions",
        timeLimit: 10,
        isActive: true,
        teacherId: "demo-teacher",
        questions: [
          {
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "O2", "NaCl"],
            correctAnswer: 0
          },
          {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1
          }
        ],
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'quizzes'), testQuiz);
      const newQuizId = docRef.id;
      console.log('✅ Test quiz created with ID:', newQuizId);
      navigate(`/student/quiz/${newQuizId}`);
      return newQuizId;
    } catch (error) {
      console.error('Error creating test quiz:', error);
      return null;
    }
  };

  const startQuiz = () => {
    if (!studentName.trim()) {
      alert('Please enter your name to start the quiz.');
      return;
    }
    if (!quiz) {
      alert('Quiz not loaded properly. Please refresh the page.');
      return;
    }
    setQuizStarted(true);
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quizStarted || quizCompleted || !quiz) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);

    try {
      await studentService.addStudentResult({
        quizId: quiz.id,
        quizTitle: quiz.title,
        studentName: studentName,
        studentId: auth.currentUser?.uid || 'anonymous',
        teacherId: quiz.teacherId,
        score: finalScore,
        totalQuestions: quiz.questions.length,
        correctAnswers: correctAnswers,
        answers: answers,
        timeSpent: (quiz.timeLimit * 60) - timeLeft,
        submittedAt: new Date()
      });
      console.log('✅ Quiz result saved successfully');
    } catch (error) {
      console.error('❌ Error saving quiz result:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Timer effect
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0 || !quiz) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, quiz]);

  if (loading) {
    return (
      <div style={styles.container}>
        <AnimatedBackground />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'var(--color-text-primary)'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: professionalTheme.spacing.md,
            animation: 'pulse 2s infinite'
          }}>
            📚
          </div>
          <h2>Loading Quiz...</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: professionalTheme.spacing.sm }}>
            Preparing your assessment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <AnimatedBackground />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: professionalTheme.spacing.xl
        }}>
          <div style={{
            ...styles.card,
            textAlign: 'center',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: professionalTheme.spacing.lg }}>🔍</div>
            <h2 style={{ 
              color: 'var(--color-error)',
              marginBottom: professionalTheme.spacing.lg,
              background: 'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              Quiz Not Found
            </h2>
            <p style={{ 
              color: 'var(--color-text-primary)',
              marginBottom: professionalTheme.spacing.lg,
              fontSize: '1.1rem'
            }}>
              {error}
            </p>
            <p style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: professionalTheme.spacing.xl,
              fontSize: '0.9rem',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: professionalTheme.spacing.md,
              borderRadius: professionalTheme.borderRadius.md
            }}>
              Quiz ID: <code style={{ 
                background: 'rgba(0,0,0,0.2)', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>{quizId}</code>
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: professionalTheme.spacing.md }}>
              <button
                onClick={createTestQuiz}
                style={styles.button.success}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 40px rgba(74, 222, 128, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(74, 222, 128, 0.4)';
                }}
              >
                🚀 Create Sample Quiz
              </button>
              
              <button
                onClick={() => navigate('/')}
                style={styles.button.secondary}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = styles.button.secondary.background;
                  e.target.style.transform = 'translateY(0)';
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

  if (!quiz) {
    return (
      <div style={styles.container}>
        <AnimatedBackground />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'var(--color-text-primary)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: professionalTheme.spacing.md }}>❌</div>
          <h2>Quiz Not Available</h2>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div style={styles.container}>
        <AnimatedBackground />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: professionalTheme.spacing.xl
        }}>
          <div style={{
            ...styles.card,
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: professionalTheme.spacing.lg,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              🎯
            </div>
            
            <h1 style={{ 
              color: 'var(--color-text-primary)',
              marginBottom: professionalTheme.spacing.md,
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              {quiz?.title || 'Untitled Quiz'}
            </h1>
            
            <p style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: professionalTheme.spacing.xl,
              fontSize: '1.1rem',
              lineHeight: '1.6'
            }}>
              {quiz?.description || 'Test your knowledge with this interactive quiz'}
            </p>

            <div style={{
              display: 'grid',
              gap: professionalTheme.spacing.md,
              marginBottom: professionalTheme.spacing.xl,
              textAlign: 'left'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: professionalTheme.spacing.md,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: professionalTheme.borderRadius.md,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>📝 Questions:</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>
                  {quiz?.questions?.length || 0}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: professionalTheme.spacing.md,
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: professionalTheme.borderRadius.md,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>⏱️ Time Limit:</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: '600', fontSize: '1.1rem' }}>
                  {quiz?.timeLimit || 0} minutes
                </span>
              </div>
            </div>

            <div style={{ marginBottom: professionalTheme.spacing.xl }}>
              <label style={{
                display: 'block',
                marginBottom: professionalTheme.spacing.md,
                color: 'var(--color-text-primary)',
                fontWeight: '600',
                fontSize: '1rem',
                textAlign: 'left'
              }}>
                👤 Enter Your Name *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            <button
              onClick={startQuiz}
              disabled={!studentName.trim() || !quiz}
              style={{
                ...styles.button.primary,
                width: '100%',
                padding: `${professionalTheme.spacing.lg} ${professionalTheme.spacing.xl}`,
                fontSize: '1.1rem',
                opacity: (!studentName.trim() || !quiz) ? 0.6 : 1,
                cursor: (!studentName.trim() || !quiz) ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => {
                if (studentName.trim() && quiz) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 40px rgba(102, 126, 234, 0.6)';
                }
              }}
              onMouseOut={(e) => {
                if (studentName.trim() && quiz) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'var(--shadow-glow)';
                }
              }}
            >
              🚀 Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const correctAnswers = Object.values(answers).filter((answer, index) => 
      answer === quiz.questions[index]?.correctAnswer
    ).length;
    
    return (
      <div style={styles.container}>
        <AnimatedBackground />
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: professionalTheme.spacing.xl
        }}>
          <div style={{
            ...styles.card,
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{
              fontSize: '5rem',
              marginBottom: professionalTheme.spacing.lg,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : score >= 40 ? '😊' : '😔'}
            </div>
            
            <h1 style={{ 
              color: 'var(--color-text-primary)',
              marginBottom: professionalTheme.spacing.md,
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>
              Quiz Completed!
            </h1>
            
            <p style={{ 
              color: 'var(--color-text-secondary)',
              marginBottom: professionalTheme.spacing.xl,
              fontSize: '1.2rem'
            }}>
              Great job, <strong style={{ color: 'var(--color-text-primary)' }}>{studentName}</strong>!
            </p>

            <div style={{
              background: score >= 80 ? 'rgba(74, 222, 128, 0.1)' : 
                         score >= 60 ? 'rgba(245, 158, 11, 0.1)' : 
                         score >= 40 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `2px solid ${score >= 80 ? 'var(--color-success)' : 
                        score >= 60 ? 'var(--color-warning)' : 
                        score >= 40 ? '#3b82f6' : 'var(--color-error)'}`,
              borderRadius: professionalTheme.borderRadius.lg,
              padding: professionalTheme.spacing.xl,
              marginBottom: professionalTheme.spacing.xl
            }}>
              <div style={{
                fontSize: '3.5rem',
                fontWeight: 'bold',
                color: score >= 80 ? 'var(--color-success)' : 
                       score >= 60 ? 'var(--color-warning)' : 
                       score >= 40 ? '#3b82f6' : 'var(--color-error)',
                marginBottom: professionalTheme.spacing.md,
                textShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}>
                {score}%
              </div>
              <div style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1.1rem',
                fontWeight: '500'
              }}>
                You got {correctAnswers} out of {quiz.questions.length} questions correct
              </div>
              <div style={{
                color: 'var(--color-text-secondary)',
                fontSize: '0.9rem',
                marginTop: professionalTheme.spacing.sm
              }}>
                {score >= 80 ? 'Outstanding! 🎯' : 
                 score >= 60 ? 'Good job! 👍' : 
                 score >= 40 ? 'Keep practicing! 📚' : 'Review the material and try again! 💪'}
              </div>
            </div>

            <button
              onClick={() => navigate('/')}
              style={styles.button.secondary}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = styles.button.secondary.background;
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div style={styles.container}>
      <AnimatedBackground />
      
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: professionalTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header with timer and progress */}
        <div style={{
          ...styles.card,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: professionalTheme.spacing.xl,
          padding: professionalTheme.spacing.lg
        }}>
          <div>
            <h2 style={{ 
              color: 'var(--color-text-primary)',
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              {quiz.title}
            </h2>
            <p style={{ 
              color: 'var(--color-text-secondary)',
              margin: 0,
              fontSize: '0.9rem',
              marginTop: professionalTheme.spacing.xs
            }}>
              👤 {studentName}
            </p>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: timeLeft < 60 ? 'var(--color-error)' : 'var(--color-text-primary)',
              textShadow: timeLeft < 60 ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none',
              animation: timeLeft < 60 ? 'pulse 1s infinite' : 'none'
            }}>
              {formatTime(timeLeft)}
            </div>
            <div style={{ 
              color: 'var(--color-text-secondary)', 
              fontSize: '0.8rem',
              fontWeight: '500'
            }}>
              ⏰ Time Left
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: professionalTheme.borderRadius.full,
          height: '8px',
          marginBottom: professionalTheme.spacing.xl,
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
            height: '100%',
            width: `${progress}%`,
            transition: 'width 0.5s ease',
            borderRadius: professionalTheme.borderRadius.full,
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
          }}></div>
        </div>

        {/* Question card */}
        <div style={styles.card}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: professionalTheme.spacing.lg
          }}>
            <h3 style={{ 
              color: 'var(--color-text-primary)',
              margin: 0,
              fontSize: '1.2rem',
              fontWeight: '600'
            }}>
              ❓ Question {currentQuestion + 1} of {quiz.questions.length}
            </h3>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: `${professionalTheme.spacing.xs} ${professionalTheme.spacing.md}`,
              borderRadius: professionalTheme.borderRadius.full,
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)',
              fontWeight: '500'
            }}>
              {Math.round(progress)}% Complete
            </div>
          </div>

          <h4 style={{ 
            color: 'var(--color-text-primary)',
            marginBottom: professionalTheme.spacing.xl,
            fontSize: '1.3rem',
            lineHeight: '1.6',
            fontWeight: '500'
          }}>
            {currentQ.question}
          </h4>

          <div style={{ display: 'grid', gap: professionalTheme.spacing.md }}>
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                style={{
                  ...styles.button.option,
                  ...(answers[currentQuestion] === index && styles.button.optionSelected)
                }}
                onMouseOver={(e) => {
                  if (answers[currentQuestion] !== index) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (answers[currentQuestion] !== index) {
                    e.target.style.background = styles.button.option.background;
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <span style={{ 
                  display: 'inline-block',
                  width: '24px',
                  height: '24px',
                  background: answers[currentQuestion] === index ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  textAlign: 'center',
                  lineHeight: '24px',
                  marginRight: professionalTheme.spacing.md,
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: answers[currentQuestion] === index ? 'white' : 'var(--color-text-secondary)'
                }}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: professionalTheme.spacing.md
        }}>
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            style={{
              ...styles.button.secondary,
              opacity: currentQuestion === 0 ? 0.5 : 1,
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => {
              if (currentQuestion !== 0) {
                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseOut={(e) => {
              if (currentQuestion !== 0) {
                e.target.style.background = styles.button.secondary.background;
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            ← Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              style={styles.button.success}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 40px rgba(74, 222, 128, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(74, 222, 128, 0.4)';
              }}
            >
              ✅ Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              style={styles.button.primary}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 40px rgba(102, 126, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-glow)';
              }}
            >
              Next Question →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentQuiz;