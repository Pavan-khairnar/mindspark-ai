import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ 
  icon, 
  title, 
  description, 
  action, 
  actionText, 
  gradient = 'primary',
  stats,
  className = '' 
}) => {
  return (
    <div className={`dashboard-card glass-card dashboard-card--${gradient} ${className}`}>
      <div className="dashboard-card__icon">{icon}</div>
      
      <div className="dashboard-card__content">
        <h3 className="dashboard-card__title">{title}</h3>
        <p className="dashboard-card__description">{description}</p>
        
        {stats && (
          <div className="dashboard-card__stats">
            {stats}
          </div>
        )}
      </div>
      
      <button 
        onClick={action}
        className="dashboard-card__action btn-secondary"
      >
        {actionText}
      </button>
      
      <div className="dashboard-card__gradient-overlay"></div>
    </div>
  );
};

export default DashboardCard;