import React from 'react';
import { Link } from 'react-router-dom';
import { theme } from '../styles/theme';
import AnimatedBackground from '../components/AnimatedBackground';

function Home() {
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
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: theme.spacing.xxl
        }}>
          <div style={{
            ...theme.typography.h1,
            background: theme.gradients.primary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: theme.spacing.md,
            display: 'inline-block',
            textShadow: `0 0 30px ${theme.colors.primary.main}40`
          }}>
            🌟 MindSpark Classroom
          </div>
          <p style={{
            ...theme.typography.body,
            color: theme.colors.text.secondary,
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto',
            textShadow: `0 2px 4px rgba(0,0,0,0.3)`
          }}>
            Elevate learning with intelligent quizzes, real-time insights, and immersive educational experiences.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: theme.spacing.xl,
          marginBottom: theme.spacing.xxl
        }}>
          {/* Teacher Card */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.primary.main}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.lg,
            transition: theme.animations.hover,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme.gradients.teacher
            }}></div>
            
            <div style={{
              fontSize: '4rem',
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              👨‍🏫
            </div>
            
            <h3 style={{
              ...theme.typography.h3,
              color: theme.colors.text.primary,
              textAlign: 'center',
              marginBottom: theme.spacing.md
            }}>
              For Educators
            </h3>
            
            <p style={{
              ...theme.typography.body,
              color: theme.colors.text.secondary,
              textAlign: 'center',
              marginBottom: theme.spacing.xl
            }}>
              Craft engaging quizzes, monitor student progress in real-time, and create dynamic learning environments.
            </p>
            
            <div style={{
              display: 'flex',
              gap: theme.spacing.sm,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/teacher"
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                  background: theme.gradients.teacher,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: theme.borderRadius.full,
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  transition: theme.animations.hover,
                  boxShadow: theme.shadows.glow,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  border: `1px solid ${theme.colors.primary.light}40`
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
                🎯 Teacher Dashboard
              </Link>
            </div>
          </div>

          {/* Student Card */}
          <div style={{
            background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.secondary.main}30`,
            backdropFilter: 'blur(20px)',
            boxShadow: theme.shadows.lg,
            transition: theme.animations.hover,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme.gradients.student
            }}></div>
            
            <div style={{
              fontSize: '4rem',
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}>
              🎓
            </div>
            
            <h3 style={{
              ...theme.typography.h3,
              color: theme.colors.text.primary,
              textAlign: 'center',
              marginBottom: theme.spacing.md
            }}>
              For Students
            </h3>
            
            <p style={{
              ...theme.typography.body,
              color: theme.colors.text.secondary,
              textAlign: 'center',
              marginBottom: theme.spacing.xl
            }}>
              Join interactive sessions, receive instant feedback, and track your educational journey with precision.
            </p>
            
            <div style={{
              display: 'flex',
              gap: theme.spacing.sm,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/student/join"
                style={{
                  padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                  background: theme.gradients.student,
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: theme.borderRadius.full,
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  transition: theme.animations.hover,
                  boxShadow: theme.shadows.glow,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  border: `1px solid ${theme.colors.secondary.light}40`
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 8px 40px ${theme.colors.secondary.main}60`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = theme.shadows.glow;
                }}
              >
                ✨ Join a Quiz
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.colors.background.card}99, ${theme.colors.background.surface}99)`,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.xl,
          border: `1px solid ${theme.colors.primary.main}20`,
          backdropFilter: 'blur(20px)',
          boxShadow: theme.shadows.md
        }}>
          <h2 style={{
            ...theme.typography.h2,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
            background: theme.gradients.primary,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: `0 0 20px ${theme.colors.primary.main}30`
          }}>
            Premium Features
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: theme.spacing.lg
          }}>
            {[
              { icon: '⚡', title: 'Real-time Analytics', desc: 'Live tracking and performance insights' },
              { icon: '🎯', title: 'Smart Assessment', desc: 'AI-powered adaptive learning paths' },
              { icon: '👁️', title: 'Score Control', desc: 'Flexible result visibility settings' },
              { icon: '📊', title: 'Deep Insights', desc: 'Comprehensive learning analytics' },
              { icon: '🚀', title: 'Rapid Setup', desc: 'Create and deploy in minutes' },
              { icon: '💫', title: 'Engaging UI', desc: 'Beautiful, intuitive interface' }
            ].map((feature, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: theme.spacing.lg,
                background: theme.colors.background.secondary,
                borderRadius: theme.borderRadius.lg,
                transition: theme.animations.hover,
                border: `1px solid ${theme.colors.primary.main}15`,
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = theme.shadows.md;
                e.currentTarget.style.borderColor = `${theme.colors.primary.main}30`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = `${theme.colors.primary.main}15`;
              }}
              >
                <div style={{
                  fontSize: '2.5rem',
                  marginBottom: theme.spacing.md,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}>
                  {feature.icon}
                </div>
                <h4 style={{
                  ...theme.typography.h3,
                  fontSize: '1.25rem',
                  color: theme.colors.text.primary,
                  marginBottom: theme.spacing.sm
                }}>
                  {feature.title}
                </h4>
                <p style={{
                  ...theme.typography.small,
                  color: theme.colors.text.secondary,
                  lineHeight: '1.5'
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: theme.spacing.xxl,
          padding: theme.spacing.xl,
          background: theme.gradients.primary,
          borderRadius: theme.borderRadius.xl,
          boxShadow: theme.shadows.lg,
          border: `1px solid ${theme.colors.primary.light}30`,
          backdropFilter: 'blur(20px)'
        }}>
          <h3 style={{
            ...theme.typography.h3,
            color: 'white',
            marginBottom: theme.spacing.md,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            Ready to Transform Education?
          </h3>
          <p style={{
            ...theme.typography.body,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: theme.spacing.lg,
            fontSize: '1.1rem',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            Join educators worldwide using MindSpark to create exceptional learning experiences.
          </p>
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              to="/teacher"
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: theme.borderRadius.full,
                fontWeight: '600',
                fontSize: '1.1rem',
                border: '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)',
                transition: theme.animations.hover,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Start Teaching
            </Link>
            <Link 
              to="/student/join"
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                background: 'white',
                color: theme.colors.primary.dark,
                textDecoration: 'none',
                borderRadius: theme.borderRadius.full,
                fontWeight: '600',
                fontSize: '1.1rem',
                transition: theme.animations.hover,
                textShadow: 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255,255,255,0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Join as Student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;