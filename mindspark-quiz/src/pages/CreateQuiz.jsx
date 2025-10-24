import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';
import { auth } from '../config/firebase';
import { quizService } from '../services/firebaseServices';
import { onAuthStateChanged } from 'firebase/auth';

// Professional theme access with CSS variables
const professionalTheme = {
  colors: {
    primary: theme?.colors?.primary || { main: '#667eea', light: '#764ba2' },
    secondary: theme?.colors?.secondary || { main: '#f093fb', light: '#f5576c' },
    success: theme?.colors?.success || { main: '#4ade80', light: '#86efac' },
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

function CreateQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: 'New Quiz',
    description: '',
    questions: [],
    timeLimit: 30,
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [uiState, setUiState] = useState({
    loading: true,
    saving: false,
    lastSaved: null,
    hasUnsavedChanges: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadQuizData();
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, quizId]);

  const loadQuizData = async () => {
    try {
      if (quizId && quizId !== 'undefined') {
        const quizData = await quizService.getQuizById(quizId);
        setQuiz({
          title: quizData.title || 'New Quiz',
          description: quizData.description || '',
          questions: quizData.questions || [],
          timeLimit: quizData.timeLimit || 30,
          isActive: quizData.isActive !== undefined ? quizData.isActive : true
        });
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      const localStorageQuiz = localStorage.getItem(`quiz_${quizId}`);
      if (localStorageQuiz) {
        const quizData = JSON.parse(localStorageQuiz);
        setQuiz({
          title: quizData.title || 'New Quiz',
          description: quizData.description || '',
          questions: quizData.questions || [],
          timeLimit: quizData.timeLimit || 30,
          isActive: quizData.isActive !== undefined ? quizData.isActive : true
        });
      }
    } finally {
      setLoading(false);
      setUiState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleSaveQuiz = async () => {
    try {
      setUiState(prev => ({ ...prev, saving: true }));
      setSaving(true);
      
      if (!quizId || quizId === 'undefined') {
        alert('❌ Invalid quiz ID. Please go back and create a new quiz.');
        return;
      }

      if (!quiz.questions || quiz.questions.length === 0) {
        alert('📝 Please add at least one question before saving.');
        return;
      }

      console.log('💾 Saving quiz...', quizId);
      
      const quizDataToSave = {
        ...quiz,
        isActive: true,
        updatedAt: new Date(),
        teacherId: user?.uid,
        teacherName: user?.displayName || 'Teacher'
      };

      Object.keys(quizDataToSave).forEach(key => {
        if (quizDataToSave[key] === undefined) {
          delete quizDataToSave[key];
        }
      });

      await quizService.updateQuizWithSet(quizId, quizDataToSave);
      
      console.log('✅ Quiz saved successfully with', quiz.questions.length, 'questions');
      
      setUiState(prev => ({
        ...prev, 
        saving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false
      }));

      alert(`🎉 Quiz "${quiz.title}" saved successfully!`);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('❌ Error saving quiz:', error);
      setUiState(prev => ({ ...prev, saving: false }));
      setSaving(false);
      
      let errorMessage = 'Failed to save quiz. Please try again.';
      if (error.code === 'permission-denied') {
        errorMessage = '🔐 Permission denied. Please check if you\'re logged in.';
      } else if (error.code === 'not-found') {
        errorMessage = '📄 Quiz not found. It may have been deleted.';
      } else if (error.message.includes('network') || error.message.includes('offline')) {
        errorMessage = '🌐 Network error. Please check your connection and try again.';
      }
      
      alert(`${errorMessage}\n\nError: ${error.message}`);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setQuiz(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
    setUiState(prev => ({ ...prev, hasUnsavedChanges: true }));
  };

  const autoSave = useCallback(async () => {
    if (!quizId || quizId === 'undefined' || saving || quiz.questions.length === 0) {
      return;
    }
    try {
      console.log('💾 Auto-saving quiz...');
      await quizService.updateQuizWithSet(quizId, {
        ...quiz,
        updatedAt: new Date()
      });
      console.log('✅ Auto-save completed');
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
    }
  }, [quizId, quiz, saving]);

  useEffect(() => {
    const autoSaveTimer = setInterval(autoSave, 30000);
    const handleBeforeUnload = () => {
      if (quiz.questions.length > 0) {
        autoSave();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearInterval(autoSaveTimer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [autoSave]);

  const updateQuestion = (questionId, field, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
    setUiState(prev => ({ ...prev, hasUnsavedChanges: true }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              )
            }
          : q
      )
    }));
    setUiState(prev => ({ ...prev, hasUnsavedChanges: true }));
  };

  const deleteQuestion = (questionId) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    setUiState(prev => ({ ...prev, hasUnsavedChanges: true }));
  };

  // Professional UI Styles
  const styles = {
    container: {
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--color-background)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: professionalTheme.spacing.xl,
      padding: `${professionalTheme.spacing.xl} 0`
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
      danger: {
        padding: `${professionalTheme.spacing.xs} ${professionalTheme.spacing.sm}`,
        background: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--color-error)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: professionalTheme.borderRadius.sm,
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }
    },
    questionCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      padding: professionalTheme.spacing.lg,
      borderRadius: professionalTheme.borderRadius.md,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: professionalTheme.spacing.lg,
      transition: 'all 0.3s ease'
    },
    optionRow: {
      display: 'flex',
      alignItems: 'center',
      gap: professionalTheme.spacing.md,
      marginBottom: professionalTheme.spacing.sm,
      padding: professionalTheme.spacing.sm,
      background: 'rgba(255, 255, 255, 0.03)',
      borderRadius: professionalTheme.borderRadius.sm
    }
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
            marginBottom: professionalTheme.spacing.md
          }}>
            📝
          </div>
          <h2>Loading Quiz Editor...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <AnimatedBackground />
      
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: professionalTheme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={styles.header}>
          <div>
            <h1 style={{ 
              color: 'var(--color-text-primary)',
              margin: 0,
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              {quizId ? 'Edit Quiz' : 'Create Quiz'}
            </h1>
            {uiState.lastSaved && (
              <p style={{
                color: 'var(--color-text-secondary)',
                margin: `${professionalTheme.spacing.xs} 0 0 0`,
                fontSize: '0.875rem'
              }}>
                Last saved: {uiState.lastSaved.toLocaleTimeString()}
                {uiState.hasUnsavedChanges && ' • Unsaved changes'}
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: professionalTheme.spacing.md }}>
            <button
              onClick={() => navigate('/dashboard')}
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
              ← Dashboard
            </button>
            <button
              onClick={handleSaveQuiz}
              disabled={saving}
              style={{
                ...styles.button.primary,
                opacity: saving ? 0.7 : 1,
                cursor: saving ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => {
                if (!saving) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 40px rgba(102, 126, 234, 0.6)';
                }
              }}
              onMouseOut={(e) => {
                if (!saving) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = styles.button.primary.boxShadow;
                }
              }}
            >
              {saving ? (
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
                  Saving...
                </>
              ) : (
                '💾 Save Quiz'
              )}
            </button>
          </div>
        </div>

        {/* Quiz Information Card */}
        <div style={styles.card}>
          <h3 style={{ 
            color: 'var(--color-text-primary)',
            marginBottom: professionalTheme.spacing.lg,
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            📋 Quiz Information
          </h3>
          
          <div style={{ marginBottom: professionalTheme.spacing.lg }}>
            <label style={{
              display: 'block',
              marginBottom: professionalTheme.spacing.md,
              color: 'var(--color-text-primary)',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              Quiz Title *
            </label>
            <input
              type="text"
              value={quiz.title}
              onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              placeholder="Enter an engaging quiz title..."
            />
          </div>

          <div style={{ marginBottom: professionalTheme.spacing.lg }}>
            <label style={{
              display: 'block',
              marginBottom: professionalTheme.spacing.md,
              color: 'var(--color-text-primary)',
              fontWeight: '600',
              fontSize: '1rem'
            }}>
              Description
            </label>
            <textarea
              value={quiz.description}
              onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
              rows="3"
              style={{
                ...styles.input,
                resize: 'vertical',
                minHeight: '80px'
              }}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              placeholder="Describe what this quiz is about..."
            />
          </div>

          <div>
  <label style={{
    display: 'block',
    marginBottom: professionalTheme.spacing.md,
    color: 'var(--color-text-primary)',
    fontWeight: '600',
    fontSize: '1rem'
  }}>
    ⏱️ Time Limit (minutes)
  </label>
  <input
    type="number"
    value={quiz.timeLimit}
    onChange={(e) => {
      const value = e.target.value;
      if (value === '') {
        setQuiz(prev => ({ ...prev, timeLimit: '' }));
      } else {
        const numValue = parseInt(value);
        setQuiz(prev => ({ ...prev, timeLimit: isNaN(numValue) ? 30 : numValue }));
      }
    }}
    min="1"
    max="180"
    style={{
      ...styles.input,
      width: '120px'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = 'var(--color-primary)';
      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.2)';
    }}
    onBlur={(e) => {
      // 1. Reset the input styling
      e.target.style.background = styles.input.background;
      e.target.style.border = styles.input.border;
      e.target.style.boxShadow = 'none';
      
      // 2. Validate and set default time limit if empty/invalid
      if (!e.target.value || isNaN(parseInt(e.target.value))) {
        setQuiz(prev => ({ ...prev, timeLimit: 30 }));
      }
    }}
  />
</div>
</div>

        {/* Questions Section */}
        <div style={styles.card}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: professionalTheme.spacing.lg
          }}>
            <div>
              <h3 style={{ 
                color: 'var(--color-text-primary)',
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '600'
              }}>
                ❓ Questions ({quiz.questions?.length || 0})
              </h3>
              <p style={{
                color: 'var(--color-text-secondary)',
                margin: `${professionalTheme.spacing.xs} 0 0 0`,
                fontSize: '0.875rem'
              }}>
                {quiz.questions?.length === 0 ? 'Add your first question to get started!' : 'Manage your quiz questions below'}
              </p>
            </div>
            <button
              onClick={addQuestion}
              style={{
                ...styles.button.primary,
                background: 'linear-gradient(135deg, var(--color-success) 0%, var(--color-success-dark) 100%)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 40px rgba(74, 222, 128, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'var(--shadow-glow)';
              }}
            >
              ➕ Add Question
            </button>
          </div>

          {(!quiz.questions || quiz.questions.length === 0) ? (
            <div style={{
              textAlign: 'center',
              padding: professionalTheme.spacing.xxl,
              color: 'var(--color-text-secondary)',
              border: '2px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: professionalTheme.borderRadius.md
            }}>
              <div style={{ fontSize: '4rem', marginBottom: professionalTheme.spacing.md }}>📝</div>
              <h4 style={{ color: 'var(--color-text-secondary)', marginBottom: professionalTheme.spacing.sm }}>
                No Questions Yet
              </h4>
              <p>Start by adding your first question to create an engaging quiz!</p>
            </div>
          ) : (
            <div>
              {quiz.questions.map((question, index) => (
                <div key={question.id} style={styles.questionCard}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: professionalTheme.spacing.md
                  }}>
                    <h4 style={{ 
                      color: 'var(--color-text-primary)',
                      margin: 0,
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}>
                      Question {index + 1}
                    </h4>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      style={styles.button.danger}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = styles.button.danger.background;
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  
                  <div style={{ marginBottom: professionalTheme.spacing.lg }}>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      placeholder="Enter your question here..."
                      style={{
                        ...styles.input,
                        marginBottom: professionalTheme.spacing.md,
                        fontSize: '1.1rem',
                        fontWeight: '500'
                      }}
                      onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, styles.input)}
                    />
                    
                    <div style={{ display: 'grid', gap: professionalTheme.spacing.sm }}>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} style={styles.optionRow}>
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            checked={question.correctAnswer === optIndex}
                            onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                            style={{ 
                              margin: 0,
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer'
                            }}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                            placeholder={`Option ${optIndex + 1}${question.correctAnswer === optIndex ? ' (Correct Answer)' : ''}`}
                            style={{
                              ...styles.input,
                              flex: 1,
                              border: question.correctAnswer === optIndex ? '2px solid var(--color-success)' : styles.input.border,
                              background: question.correctAnswer === optIndex ? 'rgba(74, 222, 128, 0.1)' : styles.input.background
                            }}
                            onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                            onBlur={(e) => Object.assign(e.target.style, {
                              ...styles.input,
                              border: question.correctAnswer === optIndex ? '2px solid var(--color-success)' : styles.input.border,
                              background: question.correctAnswer === optIndex ? 'rgba(74, 222, 128, 0.1)' : styles.input.background
                            })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateQuiz;