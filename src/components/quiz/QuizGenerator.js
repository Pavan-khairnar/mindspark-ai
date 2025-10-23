import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { generateQuestion } from '../../utils/api';
import './QuizGenerator.css';

const QuizGenerator = ({ onQuestionGenerated }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const question = await generateQuestion(topic, difficulty);
      onQuestionGenerated(question);
    } catch (err) {
      setError('Failed to generate question. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickTopics = ['JavaScript', 'Python', 'Machine Learning', 'History', 'Science', 'Mathematics'];

  return (
    <div className="quiz-generator glass-card slide-in">
      <div className="generator-header">
        <h2 className="gradient-text">AI Quiz Generator</h2>
        <p className="generator-subtitle">Create engaging quizzes with artificial intelligence</p>
      </div>

      <div className="generator-content">
        <div className="input-group">
          <label className="input-label">Topic</label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter any topic (e.g., 'Artificial Intelligence', 'World History')"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Difficulty</label>
          <div className="difficulty-buttons">
            {['easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                onClick={() => setDifficulty(level)}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="quick-topics">
          <label className="input-label">Quick Topics</label>
          <div className="topic-chips">
            {quickTopics.map((quickTopic) => (
              <button
                key={quickTopic}
                className="topic-chip"
                onClick={() => setTopic(quickTopic)}
              >
                {quickTopic}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <button
          className="btn-primary generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="small" text="" />
          ) : (
            <>
              <span className="btn-icon">🧠</span>
              Generate Smart Question
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizGenerator;