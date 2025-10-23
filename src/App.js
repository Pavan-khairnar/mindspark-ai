// src/App.js - CLEANED VERSION
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import QuizEditor from './components/QuizEditor';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
// import useTheme from './hooks/useTheme';
//import './App.css';
import './styles/globals.css';
import './styles/themes.css';
import './styles/animations.css';
import { 
  collection, 
  addDoc,
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
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
      setMessage('❌ Error: ' + error.message);
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
      <div style={{ 
        padding: '10px', 
        backgroundColor: isLogin ? '#007bff' : '#28a745',
        color: 'white',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        {isLogin ? '🔐 LOGIN' : '✅ SIGN UP'}
      </div>

      {message && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: message.includes('❌') ? '#f8d7da' : '#d4edda',
          border: '1px solid',
          borderColor: message.includes('❌') ? '#f5c6cb' : '#c3e6cb',
          borderRadius: '5px',
          marginBottom: '15px',
          color: message.includes('❌') ? '#721c24' : '#155724'
        }}>
          {message}
        </div>
      )}

      <h2 style={{ textAlign: 'center', color: '#333' }}>MindSpark AI</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ 
            width: '100%', 
            margin: '10px 0', 
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px'
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
            borderRadius: '5px'
          }}
          required
        />
        <button 
          type="submit"
          style={{ 
            width: '100%', 
            padding: '12px',
            backgroundColor: isLogin ? '#007bff' : '#28a745',
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
        onClick={() => {
          setIsLogin(!isLogin);
          setMessage('');
        }}
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

function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const loadQuizzes = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'quizzes'),
        where('createdBy', '==', auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      const userQuizzes = [];
      querySnapshot.forEach((doc) => {
        userQuizzes.push({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        });
      });
      
      userQuizzes.sort((a, b) => b.createdAt - a.createdAt);
      setQuizzes(userQuizzes);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      alert('Error loading quizzes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSession = async () => {
    if (!auth.currentUser) return;
    
    try {
      const q = query(
        collection(db, 'sessions'),
        where('createdBy', '==', auth.currentUser.uid),
        where('isLive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const session = querySnapshot.docs[0];
        setActiveSession({ id: session.id, ...session.data() });
      } else {
        setActiveSession(null);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'myQuizzes') {
      loadQuizzes();
      loadActiveSession();
    }
  }, [activeTab]);

  const handleQuizCreated = () => {
    setActiveTab('myQuizzes');
    loadQuizzes();
  };

  const startLiveSession = async (quizId, quizTitle) => {
    try {
      const pin = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const sessionData = {
        quizId: quizId,
        quizTitle: quizTitle,
        pin: pin,
        isLive: true,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        participants: {},
        currentQuestion: 0,
        scores: {},
        status: 'waiting'
      };

      // FIXED: Using proper variable name
      const sessionDoc = await addDoc(collection(db, 'sessions'), sessionData);
      
      setActiveSession({ 
        id: sessionDoc.id,
        ...sessionData,
        joinUrl: `${window.location.origin}/join/${pin}`
      });

      alert(`🎉 Live session started!\n\n📟 PIN: ${pin}\n\nStudents can join using this PIN at: ${window.location.origin}/join`);
      
    } catch (error) {
      alert('Error starting live session: ' + error.message);
    }
  };

  const endLiveSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to end this live session?')) {
      try {
        await updateDoc(doc(db, 'sessions', sessionId), {
          isLive: false,
          endedAt: serverTimestamp()
        });
        setActiveSession(null);
        alert('Live session ended!');
      } catch (error) {
        alert('Error ending session: ' + error.message);
      }
    }
  };

  const deleteQuiz = async (quizId, quizTitle) => {
    if (window.confirm(`Are you sure you want to delete "${quizTitle}"?`)) {
      try {
        await deleteDoc(doc(db, 'quizzes', quizId));
        loadQuizzes();
        alert('Quiz deleted successfully!');
      } catch (error) {
        alert('Error deleting quiz: ' + error.message);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px 20px', 
        borderBottom: '1px solid #ddd',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, color: '#333' }}>🎯 MindSpark AI</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {activeSession && (
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              🎯 LIVE: PIN {activeSession.pin}
            </div>
          )}
          <button 
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white', 
        padding: '0 20px',
        borderBottom: '1px solid #ddd',
        display: 'flex',
        gap: '10px'
      }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{
            padding: '12px 20px',
            backgroundColor: activeTab === 'dashboard' ? '#007bff' : 'transparent',
            color: activeTab === 'dashboard' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'dashboard' ? '3px solid #0056b3' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📊 Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('createQuiz')}
          style={{
            padding: '12px 20px',
            backgroundColor: activeTab === 'createQuiz' ? '#007bff' : 'transparent',
            color: activeTab === 'createQuiz' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'createQuiz' ? '3px solid #0056b3' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📝 Create Quiz
        </button>
        <button 
          onClick={() => setActiveTab('myQuizzes')}
          style={{
            padding: '12px 20px',
            backgroundColor: activeTab === 'myQuizzes' ? '#007bff' : 'transparent',
            color: activeTab === 'myQuizzes' ? 'white' : '#333',
            border: 'none',
            borderBottom: activeTab === 'myQuizzes' ? '3px solid #0056b3' : '3px solid transparent',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📚 My Quizzes ({quizzes.length})
        </button>
      </div>

      {activeSession && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          padding: '15px 20px', 
          borderBottom: '2px solid #28a745',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <div>
            <strong>🎯 Live Session Active</strong>
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              <strong>PIN:</strong> {activeSession.pin} • 
              <strong> Quiz:</strong> {activeSession.quizTitle} •
              <strong> Join URL:</strong> {window.location.origin}/join/{activeSession.pin}
            </div>
          </div>
          <button 
            onClick={() => endLiveSession(activeSession.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            ❌ End Session
          </button>
        </div>
      )}

      <div style={{ padding: '20px' }}>
        {activeTab === 'dashboard' && (
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h2>🚀 Welcome to MindSpark AI!</h2>
            <p>Create engaging quizzes with AI-powered question generation and run live sessions.</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
                <h3>📝 Create Quiz</h3>
                <p>Build custom quizzes with multiple choice questions</p>
                <button 
                  onClick={() => setActiveTab('createQuiz')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Start Creating
                </button>
              </div>
              
              <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px' }}>
                <h3>🎯 Live Sessions</h3>
                <p>Run real-time quiz sessions with student participation</p>
                <button 
                  onClick={() => setActiveTab('myQuizzes')}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Start Live Quiz
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'createQuiz' && (
          <QuizEditor onQuizCreated={handleQuizCreated} />
        )}

        {activeTab === 'myQuizzes' && (
          <div style={{ 
            maxWidth: '1000px', 
            margin: '0 auto'
          }}>
            {activeSession && (
              <div style={{ 
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '10px',
                marginBottom: '20px',
                border: '2px solid #28a745'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#28a745' }}>🎯 Active Live Session</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <strong>Quiz:</strong> {activeSession.quizTitle}<br/>
                    <strong>PIN:</strong> <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{activeSession.pin}</span><br/>
                    <strong>Status:</strong> <span style={{ color: '#28a745' }}>Waiting for players...</span>
                  </div>
                  <div>
                    <strong>Join URL:</strong><br/>
                    <code style={{ 
                      backgroundColor: '#f8f9fa', 
                      padding: '5px 10px', 
                      borderRadius: '3px',
                      fontSize: '12px',
                      wordBreak: 'break-all'
                    }}>
                      {window.location.origin}/join/{activeSession.pin}
                    </code>
                  </div>
                </div>
                <button 
                  onClick={() => endLiveSession(activeSession.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginTop: '15px'
                  }}
                >
                  ❌ End Session
                </button>
              </div>
            )}

            <div style={{ 
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>📚 My Quizzes</h2>
                <button 
                  onClick={loadQuizzes}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Refresh
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>Loading your quizzes...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <h3>No quizzes yet</h3>
                  <p>Create your first quiz to get started!</p>
                  <button 
                    onClick={() => setActiveTab('createQuiz')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    📝 Create Your First Quiz
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '15px' }}>
                  {quizzes.map((quiz) => (
                    <div 
                      key={quiz.id}
                      style={{
                        padding: '20px',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{quiz.title}</h3>
                          <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '14px' }}>
                            <span>📊 Questions: {quiz.questionCount || quiz.questions?.length || 0}</span>
                            <span>📅 Created: {quiz.createdAt?.toLocaleDateString() || 'Recently'}</span>
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                          <button 
                            onClick={() => startLiveSession(quiz.id, quiz.title)}
                            disabled={activeSession}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: activeSession ? '#6c757d' : '#28a745',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: activeSession ? 'not-allowed' : 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            {activeSession ? '🎯 Session Active' : '🎯 Start Live'}
                          </button>
                          <button 
                            style={{
                              padding: '8px 12px',
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => deleteQuiz(quiz.id, quiz.title)}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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