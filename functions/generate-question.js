const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  console.log('🚀 Function called with topic cleaning');
  
  const apiKey = process.env.GOOGLE_AI_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          question: "API KEY MISSING",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          explanation: "Check GOOGLE_AI_KEY environment variable"
        }
      })
    };
  }

  try {
    const { topic, difficulty = "medium" } = JSON.parse(event.body);
    console.log(`📚 Original topic: "${topic}"`);
    
    // Clean and extract the actual subject from the input
    const cleanTopic = cleanTopicInput(topic);
    console.log(`🧹 Cleaned topic: "${cleanTopic}"`);
    
    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Create a high-quality multiple choice question about "${cleanTopic}" at ${difficulty} difficulty level.
      
      IMPORTANT: Focus on the core subject "${cleanTopic}" and create educational content.
      
      REQUIREMENTS:
      - Question should test understanding of ${cleanTopic}
      - Options must be DISTINCT and meaningful
      - Only ONE correct answer
      - Wrong options should be plausible but incorrect
      - Make it educational and clear
      
      Return ONLY a JSON object in this exact format:
      {
        "question": "Clear, specific question text here?",
        "options": [
          "Specific correct answer",
          "Plausible but incorrect alternative 1", 
          "Plausible but incorrect alternative 2",
          "Clearly wrong alternative"
        ],
        "correctAnswer": 0,
        "explanation": "Brief educational explanation"
      }
      
      Example for "DSA":
      {
        "question": "What is the primary goal of studying Data Structures and Algorithms?",
        "options": [
          "To write efficient and optimized computer programs",
          "To learn programming language syntax",
          "To design user interfaces",
          "To manage database connections"
        ],
        "correctAnswer": 0,
        "explanation": "DSA focuses on writing efficient code by choosing appropriate data structures and algorithms for optimal performance."
      }
    `;

    console.log('🤖 Calling Google AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📨 AI Response:', text);

    // Try to parse the AI response as JSON
    try {
      const questionData = JSON.parse(text.trim());
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: questionData
        })
      };
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', text);
      
      // Smart fallback based on cleaned topic
      const mockData = getFallbackQuestion(cleanTopic);
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: mockData,
          note: "Using fallback - JSON parsing failed"
        })
      };
    }

  } catch (error) {
    console.error('💥 Function error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

// Helper function to clean topic input
function cleanTopicInput(topic) {
  if (!topic) return "computer science";
  
  const lowerTopic = topic.toLowerCase().trim();
  
  // Remove question phrases and extract the main subject
  const questionPhrases = [
    "what is", "what are", "explain", "define", "describe", 
    "tell me about", "can you explain"
  ];
  
  let cleaned = lowerTopic;
  questionPhrases.forEach(phrase => {
    if (cleaned.startsWith(phrase)) {
      cleaned = cleaned.replace(phrase, '').trim();
    }
  });
  
  // Handle common acronyms and expand them
  const acronyms = {
    "dsa": "Data Structures and Algorithms",
    "ai": "Artificial Intelligence",
    "ml": "Machine Learning",
    "oop": "Object Oriented Programming",
    "dbms": "Database Management Systems",
    "os": "Operating Systems"
  };
  
  if (acronyms[cleaned]) {
    return acronyms[cleaned];
  }
  
  // Capitalize first letter of each word for better presentation
  return cleaned.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Smart fallback question generator
function getFallbackQuestion(topic) {
  const fallbacks = {
    "Data Structures and Algorithms": {
      question: "What is the primary purpose of studying Data Structures and Algorithms?",
      options: [
        "To write efficient and optimized computer programs",
        "To memorize programming syntax",
        "To design graphical user interfaces", 
        "To configure network settings"
      ],
      correctAnswer: 0,
      explanation: "DSA focuses on writing efficient code through appropriate data organization and algorithm selection."
    },
    "Computer Science": {
      question: "What is computer science primarily concerned with?",
      options: [
        "The study of algorithms, data structures, and computational systems",
        "Building computer hardware components",
        "Repairing computer hardware",
        "Creating marketing websites"
      ],
      correctAnswer: 0,
      explanation: "Computer science is the study of algorithmic processes, computational machines, and computation itself."
    }
  };
  
  return fallbacks[topic] || {
    question: `What is a key concept in ${topic}?`,
    options: [
      "Fundamental principle with educational value",
      "Related but incorrect concept",
      "Common misconception", 
      "Unrelated distractor option"
    ],
    correctAnswer: 0,
    explanation: `This question tests understanding of core ${topic} concepts.`
  };
}