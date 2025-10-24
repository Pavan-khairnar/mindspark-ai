// src/components/UI/Button.jsx
import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
      '&:hover': !disabled && {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 40px rgba(102, 126, 234, 0.6)'
      }
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#f8fafc',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      '&:hover': !disabled && {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-1px)'
      }
    },
    success: {
      background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(74, 222, 128, 0.4)',
      '&:hover': !disabled && {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 40px rgba(74, 222, 128, 0.6)'
      }
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '0.875rem' },
    md: { padding: '12px 24px', fontSize: '1rem' },
    lg: { padding: '16px 32px', fontSize: '1.125rem' },
    xl: { padding: '20px 40px', fontSize: '1.25rem' }
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    opacity: disabled ? 0.6 : 1,
    ...props.style
  };

  return (
    <button
      type={type}
      style={styles}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span style={{ marginRight: '8px' }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: '2px solid currentColor',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </span>
      )}
      {children}
    </button>
  );
};