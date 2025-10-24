// src/components/Auth/VerifyEmail.js
import React, { useState, useEffect } from 'react';
import { 
  sendEmailVerification, 
  onAuthStateChanged,
  signOut 
} from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Auth.css';

const VerifyEmail = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.emailVerified) {
          navigate('/dashboard');
        }
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Get message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    
    try {
      await sendEmailVerification(user);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      await user.reload();
      const updatedUser = auth.currentUser;
      
      if (updatedUser.emailVerified) {
        navigate('/dashboard');
      } else {
        setMessage('Email not verified yet. Please check your inbox and verify your email.');
      }
    } catch (error) {
      console.error('Error checking verification:', error);
      setError('Error checking verification status.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="verify-email-header">
          <h2>Verify Your Email</h2>
          <div className="email-icon">📧</div>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="verify-email-content">
          <p>
            We've sent a verification email to: <br />
            <strong>{user?.email}</strong>
          </p>
          
          <div className="verification-steps">
            <h4>Please follow these steps:</h4>
            <ol>
              <li>Check your email inbox</li>
              <li>Click the verification link in the email</li>
              <li>Return here and click "I've Verified My Email"</li>
            </ol>
          </div>

          <div className="verification-actions">
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="auth-button secondary"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <button
              onClick={handleCheckVerification}
              className="auth-button primary"
            >
              I've Verified My Email
            </button>

            <button
              onClick={handleSignOut}
              className="auth-button outline"
            >
              Sign Out
            </button>
          </div>

          <div className="verification-help">
            <p>
              <strong>Didn't receive the email?</strong>
              <br />
              • Check your spam folder
              <br />
              • Make sure you entered the correct email address
              <br />
              • Wait a few minutes and try again
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;