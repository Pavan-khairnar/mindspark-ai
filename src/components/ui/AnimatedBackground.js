import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      <div className="bg-blur-1"></div>
      <div className="bg-blur-2"></div>
      <div className="bg-blur-3"></div>
      <div className="bg-blur-4"></div>
    </div>
  );
};

export default AnimatedBackground;