import React, { useState, useEffect } from 'react';
import { auth } from './utils/firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import useTheme from './hooks/useTheme';
import './App.css';
import './styles/globals.css';
import './styles/themes.css';
import './styles/animations.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner-large"></div>
          <h2>Loading MindSpark AI...</h2>
          <p>Preparing your learning experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App" data-theme={theme}>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;