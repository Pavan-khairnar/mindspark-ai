import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';
import { auth } from '../config/firebase';
import { quizService, studentService } from '../services/firebaseServices';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Professional theme access with CSS variables
const professionalTheme = {
  colors: {
    primary: theme?.colors?.primary || { main: '#667eea', light: '#764ba2' },
    secondary: theme?.colors?.secondary || { main: '#f093fb', light: '#f5576c' },
    accent: theme?.colors?.accent || { main: '#4facfe', light: '#00f2fe' },
    success: theme?.colors?.success || { main: '#4ade80', light: '#86efac' },
    warning: theme?.colors?.warning || { main: '#f59e0b', light: '#fcd34d' },
    error: theme?.colors?.error || { main: '#ef4444', light: '#fca5a5' },
    text: theme?.colors?.text || { primary: '#f8fafc', secondary: '#cbd5e1', muted: '#64748b' },
    background: theme?.colors?.background || { 
      card: 'rgba(30, 41, 59, 0.8)', 
      surface: 'rgba(15, 23, 42, 0.6)',
      secondary: 'rgba(255, 255, 255, 0.08)'
    }
  },
  spacing: {
    xs: '8px', sm: '12px', md: '16px', lg: '24px', xl: '32px', xxl: '48px'
  },
  borderRadius: {
    sm: '6px', md: '12px', lg: '16px', xl: '20px', full: '9999px'
  },
  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.1)',
    md: '0 4px 16px rgba(0,0,0,0.2)',
    lg: '0 8px 32px rgba(0,0,0,0.3)',
    glow: {
      primary: '0 4px 20px rgba(102, 126, 234, 0.4)',
      secondary: '0 4px 20px rgba(240, 147, 251, 0.4)',
      accent: '0 4px 20px rgba(79, 172, 254, 0.4)',
      success: '0 4px 20px rgba(74, 222, 128, 0.4)'
    }
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    success: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
  },
  typography: {
    h1: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
    h2: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.3' },
    h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
    body: { fontSize: '1rem', fontWeight: '400', lineHeight: '1.6' }
  },
  animations: {
    hover: 'all 0.3s ease',
    focus: 'all 0.2s ease'
  }
};

function TeacherDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateQuizModal, setShowCreateQuizModal] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    isActive: true
  });
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const navigate = useNavigate();

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
      boxShadow: professionalTheme.shadows.lg
    },
    statCard: {
      background: 'var(--color-surface)',
      backdropFilter: 'blur(20px)',
      borderRadius: professionalTheme.borderRadius.lg,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: professionalTheme.spacing.lg,
      textAlign: 'center',
      transition: professionalTheme.animations.hover
    },
    button: {
      primary: {
        padding: `${professionalTheme.spacing.md} ${professionalTheme.spacing.lg}`,
        background: professionalTheme.gradients.primary,
        color: 'white',
        border: 'none',
        borderRadius: professionalTheme.borderRadius.md,
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: professionalTheme.animations.hover,
        boxShadow: professionalTheme.shadows.glow.primary
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
        transition: professionalTheme.animations.hover
      },
      success: {
        padding: `${professionalTheme.spacing.md} ${professionalTheme.spacing.lg}`,
        background: professionalTheme.gradients.success,
        color: 'white',
        border: 'none',
        borderRadius: professionalTheme.borderRadius.md,
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: professionalTheme.animations.hover,
        boxShadow: professionalTheme.shadows.glow.success
      },
      danger: {
        padding: `${professionalTheme.spacing.xs} ${professionalTheme.spacing.sm}`,
        background: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--color-error)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: professionalTheme.borderRadius.sm,
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: professionalTheme.animations.hover
      }
    },
    input: {
      width: '100%',
      padding: professionalTheme.spacing.md,
      background: 'rgba(255, 255, 255, 0.08)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      borderRadius: professionalTheme.borderRadius.md,
      fontSize: '1rem',
      color: 'var(--color-text-primary)',
      transition: professionalTheme.animations.hover,
      outline: 'none',
      fontFamily: 'inherit'
    },
    inputFocus: {
      borderColor: 'var(--color-primary)',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
    }
  };

  // Keep all your existing functions (removeDuplicateQuizzes, cleanupLocalStorage, etc.)
  const removeDuplicateQuizzes = (quizList) => {
    const uniqueQuizzes = [];
    const seenIds = new Set();
    
    for (const quiz of quizList) {
      if (!seenIds.has(quiz.id)) {
        seenIds.add(quiz.id);
        uniqueQuizzes.push(quiz);
      }
    }
    
    if (uniqueQuizzes.length !== quizList.length) {
      console.log(`Cleaned ${quizList.length - uniqueQuizzes.length} duplicate quizzes`);
    }
    
    return uniqueQuizzes;
  };

  const cleanupLocalStorage = () => {
    console.log('🧹 Checking for old localStorage data...');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quiz_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log('🧹 Removed old quiz data:', key);
    });
    
    if (keysToRemove.length > 0) {
      console.log(`🧹 Cleaned up ${keysToRemove.length} old quizzes from localStorage`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (!currentUser.emailVerified) {
          navigate('/verify-email');
          return;
        }
        setUser(currentUser);
        cleanupLocalStorage();
        await loadTeacherData(currentUser.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadTeacherData = async (teacherId) => {
    try {
      setLoading(true);
      console.log('🔄 Loading quizzes for teacher:', teacherId);
      
      const teacherQuizzes = await quizService.getQuizzesByTeacher(teacherId);
      console.log('📥 Quizzes loaded from Firebase:', teacherQuizzes.length);
      
      const myQuizzes = teacherQuizzes.filter(quiz => quiz.teacherId === teacherId);
      console.log('👤 My quizzes after filtering:', myQuizzes.length);
      
      const cleanQuizzes = removeDuplicateQuizzes(myQuizzes);
      console.log('🧹 After deduplication:', cleanQuizzes.length);
      
      setQuizzes(cleanQuizzes);
      
      const results = await studentService.getStudentResultsByTeacher(teacherId);
      setStudentResults(results);
      
    } catch (error) {
      console.error('Error loading teacher data:', error);
      setQuizzes([]);
      setStudentResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    
    if (creatingQuiz) return;
    setCreatingQuiz(true);

    try {
      console.log('🚀 Creating new quiz...');
      
      if (!newQuiz.title.trim()) {
        alert('Please enter a quiz title');
        return;
      }

      const quizData = {
        title: newQuiz.title.trim(),
        description: newQuiz.description.trim(),
        timeLimit: parseInt(newQuiz.timeLimit) || 30,
        isActive: false,
        teacherId: user.uid,
        teacherName: user.displayName || 'Teacher',
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        studentCount: 0
      };

      console.log('📦 Quiz data:', quizData);

      const quizId = await quizService.createQuiz(quizData);
      console.log('✅ Quiz created with ID:', quizId);
      
      setNewQuiz({
        title: '',
        description: '',
        timeLimit: 30,
        isActive: true
      });
      setShowCreateQuizModal(false);
      
      console.log('🎯 Navigating to editor...');
      navigate(`/create-quiz/${quizId}`);

    } catch (error) {
      console.error('❌ Quiz creation failed:', error);
      alert(`Failed to create quiz: ${error.message}`);
    } finally {
      setCreatingQuiz(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    const quizToDelete = quizzes.find(quiz => quiz.id === quizId);
    
    if (!window.confirm(`Delete "${quizToDelete?.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
      localStorage.removeItem(`quiz_${quizId}`);
      const success = await quizService.deleteQuiz(quizId);
      
      if (success) {
        console.log('✅ Quiz deleted successfully from Firebase');
      } else {
        console.log('⚠️ Quiz removed from UI but Firebase delete may have failed');
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed: ' + error.message);
    }
  };

  const toggleQuizStatus = async (quizId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      
      setQuizzes(prev => prev.map(quiz => 
        quiz.id === quizId ? { ...quiz, isActive: newStatus } : quiz
      ));
      
      try {
        await quizService.updateQuiz(quizId, { isActive: newStatus });
      } catch (firebaseError) {
        const quizToSave = quizzes.find(q => q.id === quizId);
        if (quizToSave) {
          const quizWithNewStatus = { ...quizToSave, isActive: newStatus };
          await quizService.createQuiz(quizWithNewStatus);
        }
      }
      
    } catch (error) {
      console.error('Error updating quiz status:', error);
      setQuizzes(prev => prev.map(quiz => 
        quiz.id === quizId ? { ...quiz, isActive: currentStatus } : quiz
      ));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getTotalStudents = () => {
    if (studentResults.length > 0) {
      const uniqueStudents = new Set(studentResults.map(result => result.studentId || result.studentName));
      return uniqueStudents.size;
    }
    return quizzes.reduce((total, quiz) => total + (quiz.studentCount || 0), 0);
  };

  const getAverageScore = () => {
    if (studentResults.length > 0) {
      const average = studentResults.reduce((sum, result) => sum + result.score, 0) / studentResults.length;
      return Math.round(average);
    }
    return 0;
  };

  const getRecentActivity = () => {
    return studentResults
      .slice(0, 10)
      .sort((a, b) => new Date(b.submittedAt?.toDate?.() || b.submittedAt) - new Date(a.submittedAt?.toDate?.() || a.submittedAt));
  };

  const getPopularQuizzes = () => {
    const quizAttempts = {};
    studentResults.forEach(result => {
      quizAttempts[result.quizId] = (quizAttempts[result.quizId] || 0) + 1;
    });
    
    return quizzes
      .map(quiz => ({
        ...quiz,
        attempts: quizAttempts[quiz.id] || 0
      }))
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 5);
  };

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
            👨‍🏫
          </div>
          <h2>Loading Dashboard...</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: professionalTheme.spacing.sm }}>
            Preparing your teaching insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <AnimatedBackground />
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: professionalTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: professionalTheme.spacing.xxl
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: professionalTheme.spacing.lg,
            marginBottom: professionalTheme.spacing.md
          }}>
            <span style={{
              fontSize: '5rem',
              filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.6))'
            }}>
              👨‍🏫
            </span>
            <div>
              <h1 style={{
                ...professionalTheme.typography.h1,
                background: professionalTheme.gradients.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: `0 0 30px rgba(102, 126, 234, 0.4)`,
                marginBottom: professionalTheme.spacing.sm
              }}>
                Teacher Dashboard
              </h1>
              <p style={{
                ...professionalTheme.typography.body,
                color: 'var(--color-text-secondary)',
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Welcome back, <strong style={{ color: 'var(--color-text-primary)' }}>{user?.displayName || 'Teacher'}</strong>! Manage your classroom quizzes and track student progress
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: professionalTheme.spacing.lg,
          marginBottom: professionalTheme.spacing.xxl
        }}>
          <div 
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = professionalTheme.shadows.glow.primary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = professionalTheme.shadows.lg;
            }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: professionalTheme.gradients.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: professionalTheme.spacing.xs
            }}>
              {quizzes.length}
            </div>
            <div style={{ 
              color: 'var(--color-text-secondary)',
              fontWeight: '500'
            }}>
              📚 Total Quizzes
            </div>
          </div>
          
          <div 
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = professionalTheme.shadows.glow.secondary;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = professionalTheme.shadows.lg;
            }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: professionalTheme.gradients.secondary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: professionalTheme.spacing.xs
            }}>
              {getTotalStudents()}
            </div>
            <div style={{ 
              color: 'var(--color-text-secondary)',
              fontWeight: '500'
            }}>
              👥 Unique Students
            </div>
          </div>
          
          <div 
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = professionalTheme.shadows.glow.accent;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = professionalTheme.shadows.lg;
            }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: professionalTheme.gradients.accent,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: professionalTheme.spacing.xs
            }}>
              {studentResults.length}
            </div>
            <div style={{ 
              color: 'var(--color-text-secondary)',
              fontWeight: '500'
            }}>
              📊 Total Attempts
            </div>
          </div>
          
          <div 
            style={styles.statCard}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = professionalTheme.shadows.glow.success;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = professionalTheme.shadows.lg;
            }}
          >
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: professionalTheme.gradients.success,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: professionalTheme.spacing.xs
            }}>
              {getAverageScore()}%
            </div>
            <div style={{ 
              color: 'var(--color-text-secondary)',
              fontWeight: '500'
            }}>
              🎯 Avg. Score
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: professionalTheme.spacing.xl,
          alignItems: 'start'
        }}>
          {/* Left Column - Quizzes & Actions */}
          <div>
            {/* Quick Actions */}
            <div style={{
              ...styles.card,
              marginBottom: professionalTheme.spacing.xl,
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <h3 style={{ 
                ...professionalTheme.typography.h3, 
                color: 'var(--color-text-primary)',
                marginBottom: professionalTheme.spacing.lg,
                background: professionalTheme.gradients.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                🚀 Quick Actions
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: professionalTheme.spacing.md
              }}>
                <button 
                  onClick={() => setShowCreateQuizModal(true)}
                  style={styles.button.primary}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 40px rgba(102, 126, 234, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = professionalTheme.shadows.glow.primary;
                  }}
                >
                  ➕ New Quiz
                </button>
                <button 
                  onClick={() => navigate('/quiz-templates')}
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
                  📚 Templates
                </button>
                <button 
                  onClick={handleSignOut}
                  style={{
                    ...styles.button.secondary,
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--color-error)',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>

            {/* Your Quizzes */}
            <div style={{
              ...styles.card,
              border: '1px solid rgba(102, 126, 234, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: professionalTheme.spacing.lg
              }}>
                <h3 style={{ 
                  ...professionalTheme.typography.h3, 
                  color: 'var(--color-text-primary)',
                  background: professionalTheme.gradients.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}>
                  📝 Your Quizzes ({quizzes.length})
                </h3>
                <div style={{
                  display: 'flex',
                  gap: professionalTheme.spacing.md,
                  fontSize: '0.9rem',
                  color: 'var(--color-text-secondary)',
                  fontWeight: '500'
                }}>
                  <span>🟢 {quizzes.filter(q => q.isActive !== false).length} Active</span>
                  <span>🔴 {quizzes.filter(q => q.isActive === false).length} Inactive</span>
                </div>
              </div>

              {quizzes.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: professionalTheme.spacing.xxl,
                  color: 'var(--color-text-muted)',
                  border: '2px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: professionalTheme.borderRadius.lg
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: professionalTheme.spacing.md }}>📝</div>
                  <h3 style={{ marginBottom: professionalTheme.spacing.sm, color: 'var(--color-text-secondary)' }}>
                    No quizzes yet
                  </h3>
                  <p>Create your first quiz to get started with interactive assessments!</p>
                  <button 
                    onClick={() => setShowCreateQuizModal(true)}
                    style={{
                      ...styles.button.primary,
                      marginTop: professionalTheme.spacing.lg
                    }}
                  >
                    Create Your First Quiz
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: professionalTheme.spacing.md
                }}>
                  {quizzes.map((quiz, index) => (
                    <div key={`${quiz.id}-${quiz.isActive}-${index}`} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: professionalTheme.spacing.lg,
                      borderRadius: professionalTheme.borderRadius.lg,
                      border: `1px solid ${quiz.isActive ? 'rgba(74, 222, 128, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      transition: professionalTheme.animations.hover
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: professionalTheme.spacing.md
                      }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            color: 'var(--color-text-primary)',
                            marginBottom: professionalTheme.spacing.xs,
                            fontSize: '1.2rem',
                            fontWeight: '600'
                          }}>
                            {quiz.title}
                          </h4>
                          <p style={{
                            color: 'var(--color-text-secondary)',
                            marginBottom: professionalTheme.spacing.sm,
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                          }}>
                            {quiz.description || 'No description provided'}
                          </p>
                          <div style={{
                            display: 'flex',
                            gap: professionalTheme.spacing.md,
                            alignItems: 'center',
                            flexWrap: 'wrap'
                          }}>
                            <span style={{
                              background: 'rgba(102, 126, 234, 0.1)',
                              padding: '4px 8px',
                              borderRadius: professionalTheme.borderRadius.sm,
                              border: '1px solid rgba(102, 126, 234, 0.3)',
                              fontFamily: 'monospace',
                              fontSize: '0.7rem',
                              color: 'var(--color-text-secondary)'
                            }}>
                              ID: {quiz.id?.substring(0, 8)}...
                            </span>
                            <span style={{
                              color: 'var(--color-text-muted)',
                              fontSize: '0.8rem'
                            }}>
                              ⏱️ {quiz.timeLimit || 30}m
                            </span>
                            <span style={{
                              color: 'var(--color-text-muted)',
                              fontSize: '0.8rem'
                            }}>
                              ❓ {quiz.questions?.length || 0} questions
                            </span>
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          gap: professionalTheme.spacing.sm,
                          alignItems: 'center'
                        }}>
                          <button
                            onClick={() => toggleQuizStatus(quiz.id, quiz.isActive)}
                            style={{
                              ...styles.button.secondary,
                              padding: `${professionalTheme.spacing.xs} ${professionalTheme.spacing.sm}`,
                              fontSize: '0.8rem',
                              background: quiz.isActive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)',
                              color: quiz.isActive ? 'var(--color-error)' : 'var(--color-success)',
                              border: `1px solid ${quiz.isActive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(74, 222, 128, 0.3)'}`
                            }}
                          >
                            {quiz.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          
                          <Link 
                            to={`/create-quiz/${quiz.id}`}
                            style={{
                              ...styles.button.primary,
                              padding: `${professionalTheme.spacing.xs} ${professionalTheme.spacing.sm}`,
                              fontSize: '0.8rem',
                              textDecoration: 'none',
                              display: 'inline-block',
                              textAlign: 'center'
                            }}
                          >
                            Edit
                          </Link>
                          
                          <button 
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            style={styles.button.danger}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                        paddingTop: professionalTheme.spacing.sm,
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <span>📅 {new Date(quiz.createdAt?.toDate?.() || quiz.createdAt).toLocaleDateString()}</span>
                        <span style={{
                          padding: `${professionalTheme.spacing.xs} ${professionalTheme.spacing.sm}`,
                          background: quiz.isActive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: quiz.isActive ? 'var(--color-success)' : 'var(--color-error)',
                          borderRadius: professionalTheme.borderRadius.full,
                          fontWeight: '500',
                          fontSize: '0.7rem'
                        }}>
                          {quiz.isActive ? '🟢 Active' : '🔴 Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Analytics & Recent Activity */}
          <div>
            {/* Popular Quizzes */}
            <div style={{
              ...styles.card,
              marginBottom: professionalTheme.spacing.xl,
              border: '1px solid rgba(240, 147, 251, 0.2)'
            }}>
              <h3 style={{ 
                ...professionalTheme.typography.h3, 
                color: 'var(--color-text-primary)',
                marginBottom: professionalTheme.spacing.lg,
                background: professionalTheme.gradients.secondary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                📈 Popular Quizzes
              </h3>
              {getPopularQuizzes().length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: professionalTheme.spacing.lg,
                  color: 'var(--color-text-muted)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: professionalTheme.borderRadius.md
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: professionalTheme.spacing.sm }}>📊</div>
                  <p>No quiz attempts yet</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: professionalTheme.spacing.md }}>
                  {getPopularQuizzes().map((quiz, index) => (
                    <div key={quiz.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: professionalTheme.spacing.md,
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: professionalTheme.borderRadius.md,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: professionalTheme.animations.hover
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: '600', 
                          color: 'var(--color-text-primary)',
                          fontSize: '0.9rem',
                          marginBottom: professionalTheme.spacing.xs
                        }}>
                          {quiz.title}
                        </div>
                        <div style={{ 
                          color: 'var(--color-text-secondary)',
                          fontSize: '0.8rem'
                        }}>
                          {quiz.attempts} student attempts
                        </div>
                      </div>
                      <div style={{
                        padding: `${professionalTheme.spacing.xs} ${professionalTheme.spacing.md}`,
                        background: professionalTheme.gradients.accent,
                        color: 'white',
                        borderRadius: professionalTheme.borderRadius.full,
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        minWidth: '32px',
                        textAlign: 'center'
                      }}>
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div style={{
              ...styles.card,
              border: '1px solid rgba(74, 222, 128, 0.2)'
            }}>
              <h3 style={{ 
                ...professionalTheme.typography.h3, 
                color: 'var(--color-text-primary)',
                marginBottom: professionalTheme.spacing.lg,
                background: professionalTheme.gradients.success,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                🔄 Recent Activity
              </h3>
              {getRecentActivity().length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: professionalTheme.spacing.lg,
                  color: 'var(--color-text-muted)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: professionalTheme.borderRadius.md
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: professionalTheme.spacing.sm }}>⏰</div>
                  <p>No recent activity</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: professionalTheme.spacing.sm }}>
                  {getRecentActivity().map((result, index) => (
                    <div key={result.id} style={{
                      padding: professionalTheme.spacing.md,
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: professionalTheme.borderRadius.md,
                      borderLeft: `4px solid ${
                        result.score >= 70 ? 'var(--color-success)' :
                        result.score >= 50 ? 'var(--color-warning)' : 
                        'var(--color-error)'
                      }`,
                      transition: professionalTheme.animations.hover
                    }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: 'var(--color-text-primary)',
                        fontSize: '0.9rem',
                        marginBottom: professionalTheme.spacing.xs
                      }}>
                        {result.studentName || 'Anonymous Student'}
                      </div>
                      <div style={{ 
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.8rem',
                        marginBottom: professionalTheme.spacing.xs
                      }}>
                        {result.quizTitle}
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem'
                      }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                          {new Date(result.submittedAt?.toDate?.() || result.submittedAt).toLocaleDateString()}
                        </span>
                        <span style={{
                          fontWeight: '600',
                          color: result.score >= 70 ? 'var(--color-success)' :
                                 result.score >= 50 ? 'var(--color-warning)' : 
                                 'var(--color-error)',
                          background: result.score >= 70 ? 'rgba(74, 222, 128, 0.1)' :
                                    result.score >= 50 ? 'rgba(245, 158, 11, 0.1)' : 
                                    'rgba(239, 68, 68, 0.1)',
                          padding: '2px 8px',
                          borderRadius: professionalTheme.borderRadius.sm
                        }}>
                          {result.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Quiz Modal */}
        {showCreateQuizModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: professionalTheme.spacing.xl
          }}>
            <div style={{
              ...styles.card,
              width: '100%',
              maxWidth: '500px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: professionalTheme.spacing.lg
              }}>
                <h3 style={{ 
                  ...professionalTheme.typography.h3,
                  color: 'var(--color-text-primary)',
                  margin: 0,
                  background: professionalTheme.gradients.primary,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}>
                  🚀 Create New Quiz
                </h3>
                <button
                  onClick={() => setShowCreateQuizModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-secondary)',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'none';
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleCreateQuiz}>
                <div style={{ marginBottom: professionalTheme.spacing.lg }}>
                  <label style={{
                    display: 'block',
                    marginBottom: professionalTheme.spacing.sm,
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem'
                  }}>
                    📝 Quiz Title *
                  </label>
                  <input
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter an engaging quiz title..."
                    required
                    style={styles.input}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>

                <div style={{ marginBottom: professionalTheme.spacing.lg }}>
                  <label style={{
                    display: 'block',
                    marginBottom: professionalTheme.spacing.sm,
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem'
                  }}>
                    📋 Description
                  </label>
                  <textarea
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this quiz is about..."
                    rows="3"
                    style={{
                      ...styles.input,
                      resize: 'vertical',
                      minHeight: '80px'
                    }}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>

                <div style={{ marginBottom: professionalTheme.spacing.xl }}>
                  <label style={{
                    display: 'block',
                    marginBottom: professionalTheme.spacing.sm,
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    fontSize: '0.9rem'
                  }}>
                    ⏱️ Time Limit (minutes) *
                  </label>
                  <input
                    type="number"
                    value={newQuiz.timeLimit}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setNewQuiz(prev => ({ ...prev, timeLimit: '' }));
                      } else {
                        const numValue = parseInt(value);
                        setNewQuiz(prev => ({ ...prev, timeLimit: isNaN(numValue) ? 30 : numValue }));
                      }
                    }}
                    min="1"
                    max="180"
                    required
                    style={styles.input}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: professionalTheme.spacing.md,
                  justifyContent: 'flex-end'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateQuizModal(false)}
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingQuiz}
                    style={{
                      ...styles.button.primary,
                      opacity: creatingQuiz ? 0.7 : 1,
                      cursor: creatingQuiz ? 'not-allowed' : 'pointer'
                    }}
                    onMouseOver={(e) => {
                      if (!creatingQuiz) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 40px rgba(102, 126, 234, 0.6)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!creatingQuiz) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = professionalTheme.shadows.glow.primary;
                      }
                    }}
                  >
                    {creatingQuiz ? (
                      <>
                        <span style={{ 
                          display: 'inline-block',
                          width: '16px',
                          height: '16px',
                          border: '2px solid transparent',
                          borderTop: '2px solid currentColor',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginRight: '8px'
                        }}></span>
                        Creating...
                      </>
                    ) : (
                      '🎯 Create Quiz'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;