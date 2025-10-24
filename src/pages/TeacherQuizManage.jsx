import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';

function TeacherQuizManage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [showScores, setShowScores] = useState(true);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false); // Add this state for copy feedback

  useEffect(() => {
    loadQuizData();
  }, [quizId]);

  const loadQuizData = () => {
    const quizData = JSON.parse(localStorage.getItem(`quiz_${quizId}`));
    if (quizData) {
      setQuiz(quizData);
      setShowScores(quizData.showScoresToStudents || true);
    } else {
      const newQuiz = {
        id: quizId,
        title: "New Quiz",
        questions: [],
        isActive: true,
        showScoresToStudents: true,
        students: {},
        createdAt: new Date().toISOString()
      };
      setQuiz(newQuiz);
      localStorage.setItem(`quiz_${quizId}`, JSON.stringify(newQuiz));
    }
    setLoading(false);
  };

  const toggleScoreVisibility = () => {
    const newShowScores = !showScores;
    setShowScores(newShowScores);
    const updatedQuiz = { ...quiz, showScoresToStudents: newShowScores };
    setQuiz(updatedQuiz);
    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(updatedQuiz));
  };

  const startQuiz = () => {
    const updatedQuiz = { ...quiz, isActive: true };
    setQuiz(updatedQuiz);
    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(updatedQuiz));
  };

  const endQuiz = () => {
    const updatedQuiz = { ...quiz, isActive: false };
    setQuiz(updatedQuiz);
    localStorage.setItem(`quiz_${quizId}`, JSON.stringify(updatedQuiz));
  };

  const refreshStudentData = () => {
    loadQuizData();
  };

  const clearAllStudents = () => {
    if (window.confirm('Are you sure you want to clear all student data?')) {
      const updatedQuiz = { ...quiz, students: {} };
      setQuiz(updatedQuiz);
      localStorage.setItem(`quiz_${quizId}`, JSON.stringify(updatedQuiz));
    }
  };

  const handleCopyQuizId = async () => {
    try {
      await navigator.clipboard.writeText(quiz.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = quiz.id;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.primary
      }}>
        <AnimatedBackground />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <h1>Loading Quiz Data...</h1>
          <p>Please wait while we load your quiz information.</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div style={{ 
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.primary
      }}>
        <AnimatedBackground />
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <h1>Quiz Not Found</h1>
          <p>The quiz with ID "{quizId}" was not found.</p>
          <Link 
            to="/teacher"
            style={{ 
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              background: theme.gradients.primary,
              color: 'white',
              textDecoration: 'none',
              borderRadius: theme.borderRadius.full,
              fontSize: '1rem',
              display: 'inline-block',
              marginTop: theme.spacing.lg
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const studentCount = Object.keys(quiz.students || {}).length;
  const completedStudents = Object.values(quiz.students || {}).filter(student => student.completed).length;

  return (
    <div style={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: theme.spacing.xxl,
        position: 'relative',
        zIndex: 1
      }}>
        
        {/* Quiz Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: theme.spacing.xl,
          flexWrap: 'wrap',
          gap: theme.spacing.md
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              marginBottom: theme.spacing.xs
            }}>
              <span style={{
                fontSize: '2.5rem',
                filter: 'drop-shadow(0 2px 8px rgba(139, 92, 246, 0.6))'
              }}>
                👨‍🏫
              </span>
              <h1 style={{ 
                margin: 0,
                background: theme.gradients.primary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: '2rem'
              }}>
                {quiz.title}
              </h1>
            </div>
            <p style={{ 
              color: theme.colors.text.secondary, 
              margin: 0,
              fontSize: '0.9rem'
            }}>
              Quiz ID: <strong style={{ color: theme.colors.primary.light }}>{quiz.id}</strong> • {quiz.questions?.length || 0} questions
            </p>
          </div>
          <div style={{ display: 'flex', gap: theme.spacing.sm, alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={refreshStudentData}
              style={{ 
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: theme.gradients.accent,
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.full,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: theme.animations.hover
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              🔄 Refresh
            </button>
            <Link 
              to="/teacher"
              style={{ 
                padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                background: 'rgba(255,255,255,0.1)',
                color: theme.colors.text.primary,
                textDecoration: 'none',
                borderRadius: theme.borderRadius.full,
                fontSize: '0.9rem',
                border: `1px solid ${theme.colors.primary.main}30`,
                transition: theme.animations.hover
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Quiz Controls */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: theme.spacing.lg, 
          marginBottom: theme.spacing.xl 
        }}>
          {/* Quiz Status */}
          <div style={{ 
            background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.primary.main}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.md,
            textAlign: 'center'
          }}>
            <h3 style={{ color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>Quiz Status</h3>
            <div style={{ 
              padding: `${theme.spacing.sm} ${theme.spacing.md}`,
              background: quiz.isActive ? theme.colors.status.success : theme.colors.status.error,
              color: 'white',
              borderRadius: theme.borderRadius.full,
              display: 'inline-block',
              marginBottom: theme.spacing.md,
              fontWeight: '600'
            }}>
              {quiz.isActive ? 'ACTIVE' : 'ENDED'}
            </div>
            <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'center' }}>
              {quiz.isActive ? (
                <button 
                  onClick={endQuiz}
                  style={{ 
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.colors.status.error,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.sm,
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  End Quiz
                </button>
              ) : (
                <button 
                  onClick={startQuiz}
                  style={{ 
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.colors.status.success,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.sm,
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Start Quiz
                </button>
              )}
            </div>
          </div>

          {/* Score Visibility */}
          <div style={{ 
            background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.secondary.main}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.md,
            textAlign: 'center'
          }}>
            <h3 style={{ color: theme.colors.text.primary, marginBottom: theme.spacing.sm }}>Score Visibility</h3>
            <p style={{ color: theme.colors.text.secondary, fontSize: '0.8rem', marginBottom: theme.spacing.md }}>
              Control student score visibility
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm }}>
              <span style={{ color: showScores ? theme.colors.status.success : theme.colors.text.muted, fontWeight: '600', fontSize: '0.9rem' }}>
                {showScores ? 'Visible' : 'Hidden'}
              </span>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={showScores}
                  onChange={toggleScoreVisibility}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: showScores ? theme.colors.status.success : '#ccc',
                  transition: '0.4s',
                  borderRadius: '34px'
                }}>
                  <span style={{
                    position: 'absolute',
                    height: '16px',
                    width: '16px',
                    left: showScores ? '22px' : '4px',
                    bottom: '4px',
                    background: 'white',
                    transition: '0.4s',
                    borderRadius: '50%'
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          {/* Student Count */}
          <div style={{ 
            background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.accent.main}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.md,
            textAlign: 'center'
          }}>
            <h3 style={{ color: theme.colors.text.primary, marginBottom: theme.spacing.sm }}>Participants</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: theme.colors.accent.light, margin: `${theme.spacing.sm} 0` }}>
              {studentCount}
            </div>
            <p style={{ color: theme.colors.text.secondary, margin: 0, fontSize: '0.9rem' }}>Total Joined</p>
            <p style={{ color: theme.colors.status.success, margin: `${theme.spacing.xs} 0 0 0`, fontSize: '0.8rem' }}>
              {completedStudents} completed
            </p>
          </div>
        </div>

        {/* Real Student Leaderboard */}
        <div style={{ 
          background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.primary.main}30`,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.shadows.md,
          marginBottom: theme.spacing.xl
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: theme.spacing.lg,
            flexWrap: 'wrap',
            gap: theme.spacing.md
          }}>
            <h2 style={{ 
              margin: 0,
              background: theme.gradients.secondary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              📊 Real-time Leaderboard
            </h2>
            <span style={{ color: theme.colors.text.muted, fontSize: '0.9rem' }}>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
          
          {studentCount === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: theme.spacing.xl, 
              background: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.lg,
              border: `2px dashed ${theme.colors.primary.main}30`
            }}>
              <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md, opacity: 0.5 }}>👥</div>
              <h3 style={{ color: theme.colors.text.muted, marginBottom: theme.spacing.sm }}>No Students Yet</h3>
              <p style={{ color: theme.colors.text.muted, margin: 0 }}>
                Students will appear here when they join using your Quiz ID
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: theme.spacing.md }}>
              {Object.entries(quiz.students)
                .sort(([,a], [,b]) => (b.score || 0) - (a.score || 0))
                .map(([studentName, student], index) => (
                  <div key={studentName} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: theme.spacing.lg,
                    background: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.primary.main}20`,
                    transition: theme.animations.hover
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = theme.shadows.sm;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: index === 0 ? '#FFD700' : 
                                 index === 1 ? '#C0C0C0' : 
                                 index === 2 ? '#CD7F32' : theme.colors.background.card,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      marginRight: theme.spacing.md,
                      color: index < 3 ? 'white' : theme.colors.text.secondary,
                      fontSize: '0.8rem',
                      boxShadow: theme.shadows.sm
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong style={{ color: theme.colors.text.primary, fontSize: '1.1rem' }}>{student.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: theme.colors.text.secondary, marginTop: theme.spacing.xs }}>
                        {student.completed ? (
                          <span style={{ color: theme.colors.status.success }}>✅ Completed</span>
                        ) : (
                          <span style={{ color: theme.colors.status.warning }}>⏳ In Progress</span>
                        )}
                        {student.completedAt && (
                          <span style={{ marginLeft: theme.spacing.sm, color: theme.colors.text.muted }}>
                            at {new Date(student.completedAt).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      fontWeight: 'bold', 
                      color: student.completed ? theme.colors.status.success : theme.colors.text.muted, 
                      fontSize: '1.2rem',
                      minWidth: '60px',
                      textAlign: 'center'
                    }}>
                      {student.completed ? (
                        `${student.score || 0}/${quiz.questions?.length || 0}`
                      ) : (
                        '--'
                      )}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>

        {/* Share Quiz ID */}
        <div style={{ 
          background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.status.success}30`,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.shadows.md,
          textAlign: 'center'
        }}>
          <h3 style={{ color: theme.colors.status.success, marginBottom: theme.spacing.md }}>📢 Share with Students</h3>
          <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.lg, fontSize: '1rem' }}>
            Students can join using this Quiz ID:
          </p>
          
          {/* Quiz ID with Copy Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.md,
            flexWrap: 'wrap',
            marginBottom: theme.spacing.lg
          }}>
            <div style={{
              padding: theme.spacing.lg,
              background: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.lg,
              border: `2px dashed ${theme.colors.status.success}40`,
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: theme.colors.text.primary,
              letterSpacing: '1px',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              flex: '1',
              minWidth: '200px',
              maxWidth: '400px'
            }}>
              {quiz.id}
            </div>
            
            {/* Copy Button */}
            <button
              onClick={handleCopyQuizId}
              style={{
                background: copied ? 
                  `linear-gradient(135deg, ${theme.colors.status.success}40, ${theme.colors.primary.light}40)` :
                  `linear-gradient(135deg, ${theme.colors.status.success}20, ${theme.colors.primary.light}20)`,
                border: `1px solid ${theme.colors.status.success}40`,
                borderRadius: theme.borderRadius.lg,
                padding: `${theme.spacing.md} ${theme.spacing.lg}`,
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                color: copied ? theme.colors.status.success : theme.colors.status.success,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                whiteSpace: 'nowrap'
              }}
              onMouseOver={(e) => {
                if (!copied) {
                  e.target.style.background = `linear-gradient(135deg, ${theme.colors.status.success}30, ${theme.colors.primary.light}30)`;
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = theme.shadows.md;
                }
              }}
              onMouseOut={(e) => {
                if (!copied) {
                  e.target.style.background = `linear-gradient(135deg, ${theme.colors.status.success}20, ${theme.colors.primary.light}20)`;
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {copied ? '✓ Copied!' : '📋 Copy ID'}
            </button>
          </div>
          
          <p style={{ color: theme.colors.text.muted, fontSize: '0.9rem', margin: 0 }}>
            Share this link: <strong style={{ color: theme.colors.primary.light }}>https://your-vercel-url.vercel.app/student/join</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default TeacherQuizManage;