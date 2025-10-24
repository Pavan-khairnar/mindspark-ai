// src/components/UI/Card.jsx
import React from 'react';

export const Card = ({ 
  children, 
  variant = 'default',
  padding = 'lg',
  ...props 
}) => {
  const baseStyles = {
    background: 'rgba(30, 41, 59, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden'
  };

  const variants = {
    default: {
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    },
    elevated: {
      boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    gradient: {
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)',
      border: '1px solid rgba(102, 126, 234, 0.3)',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
    }
  };

  const paddings = {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  };

  const styles = {
    ...baseStyles,
    ...variants[variant],
    padding: paddings[padding],
    ...props.style
  };

  return (
    <div style={styles} {...props}>
      {children}
    </div>
  );
};