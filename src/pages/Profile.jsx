import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';

function Profile() {
  // Mock user data - in real app, this would come from context or API
  const userData = {
    name: 'QuizMaster',
    role: 'Pro Member',
    quizzesTaken: 25,
    averageScore: 87,
    currentStreak: 15,
    leaderboardRank: 8,
    joinDate: '2024-01-15',
    achievements: ['Fast Learner', 'Quiz Champion', 'Perfect Score']
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground />
      
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: theme.spacing.xxl,
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: theme.spacing.xxl
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.lg,
            marginBottom: theme.spacing.md
          }}>
            <span style={{
              fontSize: '4rem',
              filter: 'drop-shadow(0 4px 12px rgba(139, 92, 246, 0.6))'
            }}>
              👤
            </span>
            <div style={{
              ...theme.typography.h1,
              background: theme.gradients.primary,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: `0 0 30px ${theme.colors.primary.main}40`
            }}>
              Your Profile
            </div>
          </div>
          <p style={{
            ...theme.typography.body,
            color: theme.colors.text.secondary,
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Track your learning journey and achievements
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: theme.spacing.xl,
          marginBottom: theme.spacing.xl
        }}>
          {/* Profile Card */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.primary.main}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.lg
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme.gradients.primary
            }}></div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: theme.spacing.lg
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: theme.gradients.primary,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white',
                marginRight: theme.spacing.lg,
                boxShadow: theme.shadows.glow
              }}>
                QM
              </div>
              <div>
                <h2 style={{
                  color: theme.colors.text.primary,
                  margin: `0 0 ${theme.spacing.xs} 0`,
                  fontSize: '1.5rem'
                }}>
                  {userData.name}
                </h2>
                <p style={{
                  color: theme.colors.primary.light,
                  margin: 0,
                  fontWeight: '600'
                }}>
                  {userData.role}
                </p>
                <p style={{
                  color: theme.colors.text.muted,
                  margin: `${theme.spacing.xs} 0 0 0`,
                  fontSize: '0.8rem'
                }}>
                  Member since {new Date(userData.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div style={{
              background: theme.colors.background.secondary,
              padding: theme.spacing.lg,
              borderRadius: theme.borderRadius.lg,
              border: `1px solid ${theme.colors.primary.main}20`
            }}>
              <h4 style={{
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md
              }}>
                🏆 Achievements
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                {userData.achievements.map((achievement, index) => (
                  <span key={index} style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                    background: theme.gradients.accent,
                    color: 'white',
                    borderRadius: theme.borderRadius.full,
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.secondary.main}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.lg
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme.gradients.secondary
            }}></div>
            
            <h3 style={{
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
              textAlign: 'center'
            }}>
              📈 Your Stats
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: theme.spacing.md
            }}>
              <div style={{
                textAlign: 'center',
                padding: theme.spacing.lg,
                background: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.lg
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: theme.colors.primary.light,
                  marginBottom: theme.spacing.xs
                }}>
                  {userData.quizzesTaken}
                </div>
                <div style={{
                  color: theme.colors.text.secondary,
                  fontSize: '0.8rem'
                }}>
                  Quizzes Taken
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: theme.spacing.lg,
                background: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.lg
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: theme.colors.secondary.light,
                  marginBottom: theme.spacing.xs
                }}>
                  {userData.averageScore}%
                </div>
                <div style={{
                  color: theme.colors.text.secondary,
                  fontSize: '0.8rem'
                }}>
                  Average Score
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: theme.spacing.lg,
                background: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.lg
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: theme.colors.accent.light,
                  marginBottom: theme.spacing.xs
                }}>
                  {userData.currentStreak}
                </div>
                <div style={{
                  color: theme.colors.text.secondary,
                  fontSize: '0.8rem'
                }}>
                  Current Streak
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: theme.spacing.lg,
                background: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.lg
              }}>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: 'bold',
                  color: theme.colors.status.warning,
                  marginBottom: theme.spacing.xs
                }}>
                  #{userData.leaderboardRank}
                </div>
                <div style={{
                  color: theme.colors.text.secondary,
                  fontSize: '0.8rem'
                }}>
                  Global Rank
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.accent.main}30`,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.shadows.md,
          marginBottom: theme.spacing.xl
        }}>
          <h3 style={{
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
            textAlign: 'center'
          }}>
            📊 Learning Progress
          </h3>
          
          <div style={{ display: 'grid', gap: theme.spacing.lg }}>
            {[
              { label: 'Mathematics', progress: 85, color: theme.colors.primary.main },
              { label: 'Science', progress: 72, color: theme.colors.secondary.main },
              { label: 'History', progress: 68, color: theme.colors.accent.main },
              { label: 'Literature', progress: 91, color: theme.colors.status.success }
            ].map((subject, index) => (
              <div key={index}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.sm
                }}>
                  <span style={{ color: theme.colors.text.primary, fontWeight: '500' }}>
                    {subject.label}
                  </span>
                  <span style={{ color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
                    {subject.progress}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: theme.colors.background.secondary,
                  borderRadius: theme.borderRadius.full,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${subject.progress}%`,
                    height: '100%',
                    background: subject.color,
                    borderRadius: theme.borderRadius.full,
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            ))}
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
            ← Back to Home
          </Link>
          
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
              boxShadow: theme.shadows.glow
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
            Take Another Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Profile;