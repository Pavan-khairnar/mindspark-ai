import React from 'react';
import './GlassCard.css';

const GlassCard = ({ 
  children, 
  className = '', 
  hover = false,
  glow = false,
  padding = 'medium',
  border = true,
  ...props 
}) => {
  return (
    <div
      className={`
        glass-card
        ${hover ? 'glass-card--hover' : ''}
        ${glow ? 'glass-card--glow' : ''}
        glass-card--padding-${padding}
        ${border ? 'glass-card--bordered' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;