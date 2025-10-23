import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import TypewriterText from '../components/ui/TypewriterText';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('🎉 Login successful! Welcome to MindSpark AI!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('✅ Account created successfully! You can now login.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setMessage('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <AnimatedBackground />
      
      <GlassCard 
        className="login-container slide-in"
        padding="large"
        glow={true}
      >
        <div className="login-header">
          <div className="login-icon">🧠</div>
          <h1 className="gradient-text">
            <TypewriterText 
              text="MindSpark AI" 
              speed={100}
              onComplete={() => setTypingComplete(true)}
            />
          </h1>
          <p className="login-subtitle">
            {typingComplete && (
              <TypewriterText 
                text={isLogin ? 'Welcome back!' : 'Create your account'} 
                speed={50}
                delay={500}
              />
            )}
          </p>
        </div>

        {message && (
          <GlassCard 
            className={`message ${message.includes('❌') ? 'error' : 'success'}`}
            padding="small"
          >
            {message}
          </GlassCard>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <GradientButton
            type="submit"
            variant={isLogin ? "primary" : "success"}
            size="large"
            loading={loading}
            className="login-btn"
          >
            {isLogin ? '🔐 Login' : '✅ Sign Up'}
          </GradientButton>
        </form>
        
        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
            setTypingComplete(false);
          }}
          className="toggle-mode-btn"
        >
          {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
      </GlassCard>
    </div>
  );
};

export default Login;