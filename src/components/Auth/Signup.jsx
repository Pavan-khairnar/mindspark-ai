import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  updateProfile 
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    try {
      // 1. Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      console.log('User created with UID:', user.uid);

      // 2. Update profile with display name
      await updateProfile(user, {
        displayName: formData.name
      });

      // 3. ✅ CRITICAL: Save user data with TEACHER role to Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: formData.name,
        role: 'teacher', // ✅ HARDCODED AS TEACHER
        isTeacher: true, // ✅ Additional flag
        createdAt: new Date(),
        emailVerified: false
      };

      console.log('Saving user data to Firestore:', userData);
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('User data saved to Firestore successfully');

      // 4. Send email verification
      await sendEmailVerification(user);
      console.log('Verification email sent');

      // 5. Redirect to verify email page
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          message: 'Teacher account created successfully! Please verify your email to continue.' 
        } 
      });

    } catch (error) {
      console.error('Signup error:', error);
      
      // Better error messages
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Teacher Account</h2>
        <p className="auth-subtitle">Join MindSpark and create engaging quizzes for your students</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

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
              disabled={loading}
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
              placeholder="Enter your password (min. 6 characters)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          {/* Role information display - MAKE THIS MORE PROMINENT */}
          <div className="role-info" style={{ background: '#d4edda', borderColor: '#c3e6cb' }}>
            <p style={{ color: '#155724', fontWeight: 'bold' }}>
              <strong>🎯 Account Type:</strong> TEACHER
            </p>
            <p className="role-description" style={{ color: '#155724' }}>
              You are creating a <strong>Teacher Account</strong>. You will be able to create quizzes, manage classes, and view student analytics.
            </p>
          </div>

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Creating Teacher Account...' : 'Create Teacher Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Login here</Link>
          </p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            <em>Looking for student access? Students should get join codes from their teachers.</em>
          </p>
        </div>

        <div className="auth-info">
          <p>📧 You'll receive a verification email after signing up</p>
          <p>👨‍🏫 You'll have full access to create and manage quizzes</p>
          <p>📊 Access to student analytics and results</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;