// src/components/QuizEditor.js - CREATE THIS FILE IF MISSING
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';

function QuizEditor({ onQuizCreated }) {
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  // AI Question Generation Function
  const generateAIQuestion = async (topic) => {
    try {
      setGeneratingAI(true);
      
      // Try Netlify function first, fallback to mock
      try {
        const response = await fetch('http://localhost:9999/.netlify/functions/generate-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic, difficulty: 'medium' })
        });

        const result = await response.json();
        
        if (result.success) {
          const aiQuestion = result.data;
          setCurrentQuestion(aiQuestion.question);
          setOptions(aiQuestion.options);
          setCorrectAnswer(aiQuestion.correctAnswer);
          alert(`🧠 AI generated a question about "${topic}"!`);
        } else {
          throw new Error(result.error || 'AI generation failed');
        }
      } catch (networkError) {
        // Fallback to mock data
        console.log('Using mock AI data:', networkError.message);
        const mockQuestion = getMockQuestion(topic);
        setCurrentQuestion(mockQuestion.question);
        setOptions(mockQuestion.options);
        setCorrectAnswer(mockQuestion.correctAnswer);
        alert(`🧠 Demo: AI would generate a real question about "${topic}"!`);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      alert('AI feature ready - need functions server for real AI');
    } finally {
      setGeneratingAI(false);
    }
  };

  // Mock AI fallback
  const getMockQuestion = (topic) => {
    const mockTemplates = [
      {
        question: `What is the fundamental process involved in ${topic}?`,
        options: [
          `The core mechanism of ${topic}`,
          `Historical development of ${topic}`,
          `Practical applications of ${topic}`,
          `Theoretical framework of ${topic}`
        ],
        correctAnswer: 0,
        explanation: `The fundamental process represents the essential operation that defines ${topic}.`
      }
    ];
    return mockTemplates[Math.floor(Math.random() * mockTemplates.length)];
  };

  const addQuestion = () => {
    if (!currentQuestion.trim() || options.some(opt => !opt.trim())) {
      alert('Please fill in the question and all options');
      return;
    }

    const newQuestion = {
      question: currentQuestion,
      options: options.map(opt => opt.trim()),
      correctAnswer: correctAnswer
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const saveQuiz = async () => {
    if (!quizTitle.trim() || questions.length === 0) {
      alert('Please add a quiz title and at least one question');
      return;
    }

    setIsCreating(true);
    try {
      const quizData = {
        title: quizTitle,
        questions: questions,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        questionCount: questions.length
      };

      await addDoc(collection(db, 'quizzes'), quizData);
      alert(`✅ Quiz "${quizTitle}" created successfully with ${questions.length} questions!`);
      
      // Reset form
      setQuizTitle('');
      setQuestions([]);
      setIsCreating(false);
      
      if (onQuizCreated) {
        onQuizCreated();
      }
    } catch (error) {
      alert('Error creating quiz: ' + error.message);
      setIsCreating(false);
    }
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '20px auto', 
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      backgroundColor: 'white'
    }}>
      <h2>📝 Create New Quiz</h2>
      
      {/* Quiz Title */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Quiz Title:
        </label>
        <input
          type="text"
          placeholder="Enter quiz title (e.g., 'Science Quiz')"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px'
          }}
        />
      </div>

      {/* AI Question Generator Section */}
      <div style={{ 
        padding: '15px', 
        border: '2px dashed #17a2b8', 
        borderRadius: '5px',
        marginBottom: '20px',
        backgroundColor: '#e3f2fd'
      }}>
        <h4>🧠 Generate Question with AI</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Enter topic for AI (e.g., 'Photosynthesis', 'World War II')"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            style={{ 
              flex: 1,
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #17a2b8',
              borderRadius: '5px'
            }}
          />
          <button 
            onClick={() => generateAIQuestion(aiTopic)}
            disabled={generatingAI}
            style={{
              padding: '10px 15px',
              backgroundColor: generatingAI ? '#6c757d' : '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: generatingAI ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {generatingAI ? '🔄 Generating...' : '🧠 Generate AI Question'}
          </button>
        </div>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
          AI will create a question with 4 options and mark the correct answer automatically.
        </p>
      </div>

      {/* Add Question Section */}
      <div style={{ 
        padding: '20px', 
        border: '1px solid #eee', 
        borderRadius: '5px',
        marginBottom: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>➕ Add Question</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Question:
          </label>
          <input
            type="text"
            placeholder="Enter your question"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px',
              fontSize: '16px',
              border: '1px solid #ddd',
              borderRadius: '5px'
            }}
          />
        </div>

        {/* Options */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Options (mark correct answer):
          </label>
          {options.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <input
                type="radio"
                name="correctAnswer"
                checked={correctAnswer === index}
                onChange={() => setCorrectAnswer(index)}
                style={{ marginRight: '10px' }}
              />
              <input
                type="text"
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                style={{ 
                  flex: 1,
                  padding: '8px',
                  fontSize: '14px',
                  border: '1px solid #ddd',
                  borderRadius: '5px'
                }}
              />
            </div>
          ))}
        </div>

        <button 
          onClick={addQuestion}
          style={{
            padding: '10px 20px',
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Add This Question
        </button>
      </div>

      {/* Questions List */}
      {questions.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>📋 Questions ({questions.length})</h3>
          {questions.map((q, index) => (
            <div 
              key={index}
              style={{ 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '5px',
                marginBottom: '10px',
                backgroundColor: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <strong>Q{index + 1}: {q.question}</strong>
                  <div style={{ marginTop: '8px' }}>
                    {q.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        style={{ 
                          color: optIndex === q.correctAnswer ? '#28a745' : '#666',
                          fontWeight: optIndex === q.correctAnswer ? 'bold' : 'normal'
                        }}
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {optIndex === q.correctAnswer && ' ✅'}
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => removeQuestion(index)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginLeft: '10px'
                  }}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Quiz Button */}
      <button 
        onClick={saveQuiz}
        disabled={isCreating}
        style={{
          padding: '12px 30px',
          backgroundColor: isCreating ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: isCreating ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
      >
        {isCreating ? '🔄 Creating Quiz...' : '💾 Save Quiz'}
      </button>
    </div>
  );
}

export default QuizEditor;