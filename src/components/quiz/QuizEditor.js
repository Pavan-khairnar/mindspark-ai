import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../utils/firebase';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import './QuizEditor.css';

const QuizEditor = ({ onQuizCreated }) => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    if (!currentQuestion.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill in all fields for the question');
      return;
    }

    const newQuestion = {
      question: currentQuestion,
      options: [...options],
      correctAnswer: correctAnswer,
      explanation: `The correct answer is: ${options[correctAnswer]}`
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const saveQuiz = async () => {
    if (!title.trim()) {
      alert('Please enter a quiz title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    setLoading(true);
    try {
      const quizData = {
        title: title,
        questions: questions,
        questionCount: questions.length,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Remove the unused variable assignment
      await addDoc(collection(db, 'quizzes'), quizData);
      
      alert(`✅ Quiz "${title}" created successfully with ${questions.length} questions!`);
      setTitle('');
      setQuestions([]);
      onQuizCreated();
    } catch (error) {
      alert('Error creating quiz: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="quiz-editor" padding="large" glow={true}>
      <div className="editor-header">
        <h2 className="gradient-text">Create New Quiz</h2>
        <p>Build your custom quiz with multiple choice questions</p>
      </div>

      <div className="editor-content">
        <div className="input-group">
          <label className="input-label">Quiz Title</label>
          <input
            type="text"
            className="input-field"
            placeholder="Enter quiz title (e.g., 'JavaScript Basics', 'Science Quiz')"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="questions-section">
          <h3>Questions ({questions.length})</h3>
          
          <GlassCard className="question-form" padding="medium" hover={true}>
            <div className="input-group">
              <label className="input-label">Question Text</label>
              <textarea
                className="input-field"
                placeholder="Enter your question here..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                rows="3"
              />
            </div>

            <div className="options-grid">
              {options.map((option, index) => (
                <div key={index} className="option-input-group">
                  <label className="option-label">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={correctAnswer === index}
                      onChange={() => setCorrectAnswer(index)}
                      className="correct-answer-radio"
                    />
                    <span className={`option-letter ${correctAnswer === index ? 'correct' : ''}`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input-field option-input"
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      newOptions[index] = e.target.value;
                      setOptions(newOptions);
                    }}
                  />
                </div>
              ))}
            </div>

            <GradientButton 
              onClick={addQuestion}
              disabled={!currentQuestion.trim()}
              variant="success"
            >
              ➕ Add Question
            </GradientButton>
          </GlassCard>

          {questions.length > 0 && (
            <div className="questions-list">
              {questions.map((q, index) => (
                <GlassCard key={index} className="question-item" padding="medium" hover={true}>
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <GradientButton
                      onClick={() => removeQuestion(index)}
                      variant="error"
                      size="small"
                    >
                      🗑️
                    </GradientButton>
                  </div>
                  <p className="question-text">{q.question}</p>
                  <div className="options-preview">
                    {q.options.map((opt, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`option-preview ${optIndex === q.correctAnswer ? 'correct' : ''}`}
                      >
                        {String.fromCharCode(65 + optIndex)}. {opt}
                        {optIndex === q.correctAnswer && ' ✅'}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="editor-actions">
            <GradientButton 
              onClick={saveQuiz}
              disabled={loading || !title.trim()}
              loading={loading}
              variant="primary"
              size="large"
              className="save-btn"
            >
              {loading ? 'Saving...' : `💾 Save Quiz (${questions.length} questions)`}
            </GradientButton>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default QuizEditor;