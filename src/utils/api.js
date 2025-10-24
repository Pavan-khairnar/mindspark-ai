const API_BASE = '/.netlify/functions';

export const generateQuestion = async (topic, difficulty = 'medium') => {
  try {
    const response = await fetch(`${API_BASE}/generate-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, difficulty }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error || 'Failed to generate question');
    }
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Fallback mock data for development
export const mockGenerateQuestion = async (topic, difficulty = 'medium') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        question: `What is a key concept in ${topic}?`,
        options: [
          "Fundamental principle with educational value",
          "Related but incorrect concept",
          "Common misconception",
          "Unrelated distractor option"
        ],
        correctAnswer: Math.floor(Math.random() * 4),
        explanation: `This question tests understanding of core ${topic} concepts.`,
        difficulty
      });
    }, 1000);
  });
};