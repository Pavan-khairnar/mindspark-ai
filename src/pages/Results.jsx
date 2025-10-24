import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';

function Results() {
  // Mock data - in real app, this would come from props or context
  const quizResult = {
    score: 8,
    totalQuestions: 10,
    timeTaken: '4:30',
    correctAnswers: 8,
    wrongAnswers: 2,
    rank: 15
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
        padding: theme.spacing.xl,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
          padding: theme.spacing.xxl,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.primary.main}30`,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.shadows.xl,
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          {/* Header Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: theme.gradients.accent
          }}></div>
          
          {/* Header */}
          <div style={{ marginBottom: theme.spacing.xl }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: theme.spacing.lg,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              📊
            </div>
            <h1 style={{
              ...theme.typography.h2,
              //color: theme.colors.text.primary,
              marginBottom: theme.spacing.sm,
              background: theme.gradients.accent,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              Quiz Results
            </h1>
            <p style={{
              color: theme.colors.text.secondary,
              fontSize: '1.1rem'
            }}>
              Detailed performance analysis
            </p>
          </div>

          {/* Main Score */}
          <div style={{
            background: theme.gradients.primary,
            color: 'white',
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.xl,
            boxShadow: theme.shadows.glow
          }}>
            <div style={{ fontSize: '3rem', marginBottom: theme.spacing.md }}>🎉</div>
            <h2 style={{ fontSize: '3rem', margin: '0 0 10px 0' }}>
              {quizResult.score}/{quizResult.totalQuestions}
            </h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
              {quizResult.score === quizResult.totalQuestions ? "Perfect Score! 🎯" : 
               quizResult.score >= quizResult.totalQuestions * 0.7 ? "Excellent Work! 🌟" : 
               "Good Effort! 💪"}
            </p>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl
          }}>
            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.status.success}30`
            }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: theme.colors.status.success,
                marginBottom: theme.spacing.xs
              }}>
                {quizResult.correctAnswers}
              </div>
              <div style={{
                color: theme.colors.text.secondary,
                fontSize: '0.8rem'
              }}>
                Correct
              </div>
            </div>

            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.status.error}30`
            }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: theme.colors.status.error,
                marginBottom: theme.spacing.xs
              }}>
                {quizResult.wrongAnswers}
              </div>
              <div style={{
                color: theme.colors.text.secondary,
                fontSize: '0.8rem'
              }}>
                Wrong
              </div>
            </div>

            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.status.info}30`
            }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: theme.colors.status.info,
                marginBottom: theme.spacing.xs
              }}>
                {quizResult.timeTaken}
              </div>
              <div style={{
                color: theme.colors.text.secondary,
                fontSize: '0.8rem'
              }}>
                Time
              </div>
            </div>

            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.status.warning}30`
            }}>
              <div style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: theme.colors.status.warning,
                marginBottom: theme.spacing.xs
              }}>
                #{quizResult.rank}
              </div>
              <div style={{
                color: theme.colors.text.secondary,
                fontSize: '0.8rem'
              }}>
                Rank
              </div>
            </div>
          </div>

          {/* Performance Bar */}
          <div style={{
            background: theme.colors.background.secondary,
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.xl,
            border: `1px solid ${theme.colors.primary.main}20`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: theme.spacing.sm
            }}>
              <span style={{ color: theme.colors.text.primary, fontWeight: '600' }}>
                Performance
              </span>
              <span style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
                {Math.round((quizResult.score / quizResult.totalQuestions) * 100)}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              background: theme.colors.background.card,
              borderRadius: theme.borderRadius.full,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(quizResult.score / quizResult.totalQuestions) * 100}%`,
                height: '100%',
                background: theme.gradients.primary,
                borderRadius: theme.borderRadius.full,
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: theme.spacing.md, 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/quiz"
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                background: theme.gradients.primary,
                color: 'white',
                textDecoration: 'none',
                borderRadius: theme.borderRadius.full,
                fontSize: '1rem',
                fontWeight: '600',
                transition: theme.animations.hover,
                boxShadow: theme.shadows.glow,
                border: `1px solid ${theme.colors.primary.light}40`
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 30px ${theme.colors.primary.main}60`;
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = theme.shadows.glow;
              }}
            >
              Try Another Quiz
            </Link>
            
            <Link 
              to="/"
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                background: 'rgba(255,255,255,0.1)',
                color: theme.colors.text.primary,
                textDecoration: 'none',
                borderRadius: theme.borderRadius.full,
                fontSize: '1rem',
                fontWeight: '600',
                transition: theme.animations.hover,
                border: `1px solid ${theme.colors.primary.main}30`,
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Back to Home
            </Link>
          </div>

          {/* Share Achievement */}
          <div style={{
            marginTop: theme.spacing.xl,
            padding: theme.spacing.lg,
            background: theme.colors.background.secondary,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.accent.main}20`,
            textAlign: 'center'
          }}>
            <p style={{
              margin: `0 0 ${theme.spacing.sm} 0`,
              color: theme.colors.text.secondary,
              fontSize: '0.9rem'
            }}>
              <strong>Share your achievement!</strong>
            </p>
            <div style={{ display: 'flex', gap: theme.spacing.sm, justifyContent: 'center' }}>
              <button style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: 'rgba(255,255,255,0.1)',
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.primary.main}30`,
                borderRadius: theme.borderRadius.sm,
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: theme.animations.hover
              }}>
                📱 Share
              </button>
              <button style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: 'rgba(255,255,255,0.1)',
                color: theme.colors.text.primary,
                border: `1px solid ${theme.colors.primary.main}30`,
                borderRadius: theme.borderRadius.sm,
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: theme.animations.hover
              }}>
                📧 Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;