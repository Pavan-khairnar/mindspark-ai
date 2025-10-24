import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import './Login.css';

// TEMPORARY SIMPLE LOGIN FOR DEBUGGING
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  console.log('Email:', email); // Debug log
  console.log('Password:', password); // Debug log

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password }); // Debug log
    setMessage('');
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('🎉 Login successful!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage('✅ Account created!');
      }
    } catch (error) {
      setMessage('❌ ' + error.message);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>MindSpark AI - DEBUG</h2>
      {message && <div style={{ padding: '10px', background: '#f0f0f0', marginBottom: '10px' }}>{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', margin: '10px 0' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <button onClick={() => setIsLogin(!isLogin)} style={{ width: '100%' }}>
        {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
      </button>
    </div>
  );
};

export default Login;