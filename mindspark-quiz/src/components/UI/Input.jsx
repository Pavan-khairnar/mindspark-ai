// src/components/UI/Input.jsx
import React from 'react';

export const Input = ({
  label,
  error,
  variant = 'default',
  ...props
}) => {
  const baseStyles = {
    width: '100%',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    fontSize: '1rem',
    color: '#f8fafc',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit'
  };

  const variants = {
    default: {
      '&:focus': {
        borderColor: '#667eea',
        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)'
      }
    },
    success: {
      borderColor: 'rgba(74, 222, 128, 0.5)',
      '&:focus': {
        borderColor: '#4ade80',
        boxShadow: '0 0 0 3px rgba(74, 222, 128, 0.2)'
      }
    },
    error: {
      borderColor: 'rgba(239, 68, 68, 0.5)',
      '&:focus': {
        borderColor: '#ef4444',
        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.2)'
      }
    }
  };

  const inputStyles = {
    ...baseStyles,
    ...variants[variant],
    ...(error && variants.error),
    ...props.style
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '8px',
          color: '#f8fafc',
          fontWeight: '600',
          fontSize: '1rem'
        }}>
          {label}
        </label>
      )}
      <input
        style={inputStyles}
        {...props}
      />
      {error && (
        <div style={{
          color: '#ef4444',
          fontSize: '0.875rem',
          marginTop: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};