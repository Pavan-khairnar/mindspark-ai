import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';

// Import all page components
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Profile from './pages/Profile';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import TeacherQuizManage from './pages/TeacherQuizManage';
import TeacherQuizBuilder from './pages/TeacherQuizBuilder';
import StudentJoin from './pages/StudentJoin';
import StudentQuiz from './pages/StudentQuiz';
import GlobalStyles from './styles/GlobalStyles';
import Signup from './components/Auth/Signup.jsx';
import VerifyEmail from './components/Auth/VerifyEmail.jsx';
import Login from './components/Auth/Login.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import CreateQuiz from './pages/CreateQuiz'; 

// Protected Route Components
const ProtectedRoute = ({ children, requireTeacher = false }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requireTeacher && userData?.role !== 'teacher') {
    return <Navigate to="/" />;
  }
  
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <GlobalStyles />
      <ErrorBoundary>
        <AuthProvider>
          <QuizProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/results" element={<Results />} />
                  
                  {/* Auth Routes - Public Only */}
                  <Route 
                    path="/login" 
                    element={
                      <PublicOnlyRoute>
                        <Login />
                      </PublicOnlyRoute>
                    } 
                  />
                  <Route 
                    path="/signup" 
                    element={
                      <PublicOnlyRoute>
                        <Signup />
                      </PublicOnlyRoute>
                    } 
                  />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Teacher Routes - Protected & Teacher Only */}
                  <Route 
                    path="/teacher" 
                    element={
                      <ProtectedRoute requireTeacher={true}>
                        <TeacherDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute requireTeacher={true}>
                        <TeacherDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teacher/quiz/:quizId" 
                    element={
                      <ProtectedRoute requireTeacher={true}>
                        <TeacherQuizManage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/teacher/create/:quizId" 
                    element={
                      <ProtectedRoute requireTeacher={true}>
                        <TeacherQuizBuilder />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/create-quiz/:quizId" 
                    element={
                      <ProtectedRoute requireTeacher={true}>
                        <CreateQuiz />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Student Routes - Protected */}
                  <Route 
                    path="/student/join" 
                    element={
                      <ProtectedRoute>
                        <StudentJoin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/student/quiz/:quizId" 
                    element={
                      <ProtectedRoute>
                        <StudentQuiz />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </Router>
          </QuizProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}

export default App;" " 
