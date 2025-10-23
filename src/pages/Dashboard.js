import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import QuizEditor from '../components/quiz/QuizEditor';
import LiveSessionPanel from '../components/quiz/LiveSessionPanel';
import DashboardCard from '../components/ui/DashboardCard';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import GlassCard from '../components/ui/GlassCard';
import GradientButton from '../components/ui/GradientButton';
import { 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db, auth } from '../utils/firebase';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);

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

  const handleSessionUpdate = (session) => {
    setActiveSession(session);
  };

  const QuizCard = ({ quiz }) => (
    <GlassCard hover={true} glow={true} className="quiz-card">
      <div className="quiz-card-header">
        <h3 className="quiz-title">{quiz.title}</h3>
        <div className="quiz-meta">
          <span className="questions-count">
            📊 {quiz.questionCount || quiz.questions?.length || 0} questions
          </span>
          <span className="created-date">
            📅 {quiz.createdAt?.toLocaleDateString() || 'Recently'}
          </span>
        </div>
      </div>

      <div className="quiz-card-actions">
        <GradientButton
          variant="success"
          size="small"
          disabled={!!activeSession}
          onClick={() => {/* Add start session logic */}}
        >
          {activeSession ? '🎯 Session Active' : '🎯 Start Live'}
        </GradientButton>
        
        <GradientButton
          variant="accent"
          size="small"
          onClick={() => {/* Add edit logic */}}
        >
          ✏️ Edit
        </GradientButton>
        
        <GradientButton
          variant="error"
          size="small"
          onClick={() => {/* Add delete logic */}}
        >
          🗑️ Delete
        </GradientButton>
      </div>
    </GlassCard>
  );

  return (
    <div className="dashboard">
      <AnimatedBackground />
      <Header user={user} onLogout={onLogout} activeSession={activeSession} />
      
      <nav className="dashboard-nav">
        <GradientButton
          variant={activeTab === 'dashboard' ? 'primary' : 'secondary'}
          size="medium"
          onClick={() => setActiveTab('dashboard')}
          className="nav-btn"
        >
          📊 Dashboard
        </GradientButton>
        
        <GradientButton
          variant={activeTab === 'createQuiz' ? 'primary' : 'secondary'}
          size="medium"
          onClick={() => setActiveTab('createQuiz')}
          className="nav-btn"
        >
          📝 Create Quiz
        </GradientButton>
        
        <GradientButton
          variant={activeTab === 'myQuizzes' ? 'primary' : 'secondary'}
          size="medium"
          onClick={() => setActiveTab('myQuizzes')}
          className="nav-btn"
        >
          📚 My Quizzes ({quizzes.length})
        </GradientButton>
      </nav>

      <main className="dashboard-main">
        {activeSession && (
          <LiveSessionPanel 
            session={activeSession} 
            onSessionEnd={handleSessionUpdate}
          />
        )}

        <div className="dashboard-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-grid">
              <DashboardCard
                icon="📝"
                title="Create Quiz"
                description="Build engaging quizzes with AI-powered questions and multiple choice formats"
                action={() => setActiveTab('createQuiz')}
                actionText="Start Creating"
                gradient="primary"
              />
              
              <DashboardCard
                icon="🎯"
                title="Live Sessions"
                description="Run real-time quiz sessions with student participation and live scoring"
                action={() => setActiveTab('myQuizzes')}
                actionText="Start Live Quiz"
                gradient="secondary"
              />
              
              <DashboardCard
                icon="📊"
                title="Quiz Analytics"
                description="View performance insights, student progress, and detailed statistics"
                action={() => setActiveTab('myQuizzes')}
                actionText="View Analytics"
                gradient="accent"
              />
              
              <DashboardCard
                icon="🚀"
                title="Quick Start"
                description="Create your first quiz in under 2 minutes with our intuitive builder"
                action={() => setActiveTab('createQuiz')}
                actionText="Get Started"
                gradient="success"
              />
            </div>
          )}

          {activeTab === 'createQuiz' && (
            <QuizEditor onQuizCreated={handleQuizCreated} />
          )}

          {activeTab === 'myQuizzes' && (
            <GlassCard className="quizzes-container" padding="large">
              <div className="section-header">
                <h2 className="gradient-text">📚 My Quizzes</h2>
                <GradientButton
                  variant="accent"
                  onClick={loadQuizzes}
                  loading={loading}
                >
                  🔄 Refresh
                </GradientButton>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading your quizzes...</p>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No quizzes yet</h3>
                  <p>Create your first quiz to get started!</p>
                  <GradientButton
                    variant="primary"
                    onClick={() => setActiveTab('createQuiz')}
                  >
                    Create Your First Quiz
                  </GradientButton>
                </div>
              ) : (
                <div className="quizzes-grid">
                  {quizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
                </div>
              )}
            </GlassCard>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;