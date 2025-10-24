import React from 'react';
import { theme } from '../styles/theme';

const AnimatedBackground = () => {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: theme.gradients.background,
        zIndex: -1
      }}></div>

      {/* Animated Orbs */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: `radial-gradient(circle, ${theme.colors.primary.main}20 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'floatOrb 15s ease-in-out infinite',
        zIndex: -1
      }}></div>

      <div style={{
        position: 'fixed',
        top: '60%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: `radial-gradient(circle, ${theme.colors.secondary.main}15 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'floatOrb 20s ease-in-out infinite reverse',
        zIndex: -1
      }}></div>

      <div style={{
        position: 'fixed',
        bottom: '20%',
        left: '20%',
        width: '250px',
        height: '250px',
        background: `radial-gradient(circle, ${theme.colors.accent.main}10 0%, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'floatOrb 12s ease-in-out infinite',
        zIndex: -1
      }}></div>

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            background: theme.colors.primary.light,
            borderRadius: '50%',
            animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: -1
          }}
        />
      ))}

      {/* Animated Grid */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridMove 20s linear infinite',
        zIndex: -1,
        opacity: 0.3
      }}></div>

      <style>
        {`
          @keyframes floatOrb {
            0%, 100% { 
              transform: translate(0, 0) scale(1); 
              opacity: 0.6;
            }
            25% { 
              transform: translate(20px, -20px) scale(1.1); 
              opacity: 0.8;
            }
            50% { 
              transform: translate(-15px, 15px) scale(0.9); 
              opacity: 0.5;
            }
            75% { 
              transform: translate(10px, 10px) scale(1.05); 
              opacity: 0.7;
            }
          }

          @keyframes twinkle {
            0%, 100% { 
              opacity: 0; 
              transform: scale(0.5);
            }
            50% { 
              opacity: 1; 
              transform: scale(1.2);
              box-shadow: 0 0 10px ${theme.colors.primary.light};
            }
          }

          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
        `}
      </style>
    </>
  );
};

export default AnimatedBackground;