import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Add this import
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  
  // Use AuthContext instead of direct Firebase
  const { login, currentUser, userData } = useAuth();

  // In your Login component, make sure you're using this redirect logic:
useEffect(() => {
  if (currentUser && currentUser.emailVerified) {
    // Wait a moment for userData to load from Firestore
    const timer = setTimeout(() => {
      console.log('Redirecting based on role:', userData?.role);
      if (userData?.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/'); // Or student dashboard
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }
}, [currentUser, userData, navigate]);

  // Load remembered email from localStorage
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use AuthContext login instead of direct Firebase
      await login(formData.email, formData.password);
      
      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      // Note: The redirect will happen automatically via the useEffect above
      // because AuthContext will update currentUser and userData

    } catch (error) {
      console.error('Login error:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later');
          break;
        default:
          setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }

    try {
      // You might want to add password reset to AuthContext too
      const { sendPasswordResetEmail } = await import('firebase/auth');
      const { auth } = await import('../../config/firebase');
      
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);
      setShowResetModal(false);
      setError('');
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Failed to send reset email. Please check your email address.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Teacher Login</h2>
        <p className="auth-subtitle">Welcome back to MindSpark</p>
        
        {error && <div className="error-message">{error}</div>}
        {resetEmailSent && (
          <div className="success-message">
            Password reset email sent! Check your inbox.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            
            <button 
              type="button"
              className="forgot-password"
              onClick={() => setShowResetModal(true)}
            >
              Forgot password?
            </button>
          </div>

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/signup" className="auth-link">Sign up here</Link>
          </p>
        </div>

        <div className="auth-info">
          <p>🔒 Your data is securely stored with Firebase</p>
          <p>👨‍🏫 Teacher accounts have access to quiz creation and analytics</p>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="auth-button secondary"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="auth-button primary"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;