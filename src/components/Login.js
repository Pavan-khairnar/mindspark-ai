// src/components/Login.js - REPLACE EVERYTHING with this code:
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully!');
      }
    } catch (error) {
      alert(error.message);
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
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        {isLogin ? 'Login to MindSpark AI' : 'Create Account'}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ 
            width: '100%', 
            margin: '10px 0', 
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxSizing: 'border-box'
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ 
            width: '100%', 
            margin: '10px 0', 
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxSizing: 'border-box'
          }}
          required
        />
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <button 
        onClick={() => setIsLogin(!isLogin)}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#007bff', 
          marginTop: '15px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'center'
        }}
      >
        {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
      </button>
    </div>
  );
}

// THIS LINE IS CRITICAL - DON'T FORGET IT!
export default Login;