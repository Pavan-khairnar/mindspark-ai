import React from 'react';
import './GradientButton.css';

const GradientButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`
        gradient-btn 
        gradient-btn--${variant} 
        gradient-btn--${size}
        ${loading ? 'gradient-btn--loading' : ''}
        ${disabled ? 'gradient-btn--disabled' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="gradient-btn-spinner"></div>
      )}
      
      {icon && !loading && (
        <span className="gradient-btn-icon">{icon}</span>
      )}
      
      <span className="gradient-btn-text">
        {children}
      </span>
      
      {/* Gradient overlay */}
      <div className="gradient-btn-overlay"></div>
    </button>
  );
};

export default GradientButton;