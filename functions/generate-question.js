const { GoogleGenerativeAI } = require("@google/generative-ai");

// Store question history
let questionHistory = new Map();

exports.handler = async (event) => {
  console.log('🚀 Function called with AI creativity mode');
  
  const apiKey = process.env.GOOGLE_AI_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: getCreativeFallback("general")
      })
    };
  }

  try {
    const { topic, difficulty = "medium" } = JSON.parse(event.body);
    console.log(`📚 Topic: "${topic}"`);
    
    const cleanTopic = cleanTopicInput(topic);
    console.log(`🧹 Cleaned: "${cleanTopic}"`);
    
    // Get previous questions to avoid repetition
    const previousQuestions = questionHistory.get(cleanTopic) || [];
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert quiz master and educator. Create a COMPLETELY UNIQUE and ENGAGING multiple choice question about "${cleanTopic}".

      BE CREATIVE AND ORIGINAL!
      
      IMPORTANT GUIDELINES:
      - Create a question that hasn't been asked before
      - Make it thought-provoking and educational
      - Ensure exactly 4 distinct options
      - Place the correct answer in a RANDOM position (0-3)
      - Make wrong options plausible but clearly incorrect
      - Provide an insightful explanation

      DO NOT USE THESE OVERUSED QUESTION PATTERNS:
      - "What is the fundamental process of X?"
      - "What is the main purpose of X?"
      - "Which describes the core concept of X?"
      - Any generic "what is" questions

      INSTEAD, CREATE QUESTIONS LIKE:
      - Real-world scenarios and applications
      - Comparative analysis between concepts
      - Problem-solving situations
      - "What would happen if..." scenarios
      - Historical context or evolution
      - Common misconceptions debunking
      - Performance trade-off analysis
      - Future implications or trends

      ${previousQuestions.length > 0 ? `
      RECENT QUESTIONS TO AVOID REPEATING:
      ${previousQuestions.slice(-5).join('\n')}
      ` : ''}

      Return your response as a JSON object with this structure:
      {
        "question": "Your creative question here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Clear explanation that teaches something valuable"
      }

      Now create the most interesting and unique question you can think of about "${cleanTopic}"!
    `;

    console.log('🎨 Calling AI with creative freedom...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📨 AI Raw Response:', text);

    try {
      let questionData = JSON.parse(text.trim());
      
      // Validate the basic structure
      if (!questionData.question || !questionData.options || questionData.options.length !== 4) {
        throw new Error('Invalid question structure from AI');
      }
      
      // Ensure correctAnswer is valid
      if (questionData.correctAnswer < 0 || questionData.correctAnswer > 3) {
        questionData.correctAnswer = Math.floor(Math.random() * 4);
      }
      
      console.log(`🎯 Question: ${questionData.question}`);
      console.log(`📊 Correct answer at index: ${questionData.correctAnswer}`);
      
      // Store to avoid repetition
      const history = questionHistory.get(cleanTopic) || [];
      history.push(questionData.question);
      if (history.length > 15) history.shift();
      questionHistory.set(cleanTopic, history);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: questionData,
          creativity: {
            historySize: history.length,
            topic: cleanTopic
          }
        })
      };
      
    } catch (parseError) {
      console.error('❌ AI returned invalid JSON, using creative fallback');
      const fallback = getCreativeFallback(cleanTopic, previousQuestions);
      
      const history = questionHistory.get(cleanTopic) || [];
      history.push(fallback.question);
      questionHistory.set(cleanTopic, history);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: fallback,
          note: "AI creativity needed some help"
        })
      };
    }

  } catch (error) {
    console.error('💥 Function error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: getCreativeFallback("error recovery", [])
      })
    };
  }
};

// Topic cleaning
function cleanTopicInput(topic) {
  if (!topic) return "Computer Science";
  
  const lowerTopic = topic.toLowerCase().trim();
  
  // Remove question phrases
  const questionPhrases = ["what is", "what are", "explain", "define", "describe", "tell me about"];
  let cleaned = lowerTopic;
  questionPhrases.forEach(phrase => {
    if (cleaned.startsWith(phrase)) {
      cleaned = cleaned.replace(phrase, '').trim();
    }
  });
  
  // Expand acronyms
  const acronyms = {
    "dsa": "Data Structures and Algorithms",
    "ai": "Artificial Intelligence", 
    "ml": "Machine Learning",
    "oop": "Object Oriented Programming",
    "dbms": "Database Management Systems",
    "os": "Operating Systems",
    "cn": "Computer Networks"
  };
  
  return acronyms[cleaned] || 
    cleaned.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

// Creative fallback questions that are actually diverse
function getCreativeFallback(topic, previousQuestions) {
  const creativeQuestions = [
    {
      question: `If ${topic} principles were applied to urban traffic management, which approach would most likely reduce congestion?`,
      options: [
        "Implementing priority queues for emergency vehicles",
        "Using stacks to manage intersection flow",
        "Applying graph theory to optimize route planning",
        "Creating binary trees for traffic light timing"
      ],
      correctAnswer: 2,
      explanation: `Graph theory excels at route optimization problems, making it ideal for traffic management where multiple paths and connections need to be considered.`
    },
    {
      question: `A startup is building a social media app and needs to store user connections efficiently. Which ${topic} concept would be most appropriate?`,
      options: [
        "Hash tables for O(1) user lookup",
        "Graph structures to represent follower relationships", 
        "Arrays for sequential post storage",
        "Stacks for managing user sessions"
      ],
      correctAnswer: 1,
      explanation: `Graph structures naturally represent network relationships like followers and friends, allowing efficient traversal and connection analysis.`
    },
    {
      question: `In the evolution of ${topic}, which breakthrough most significantly changed how developers approach problem-solving?`,
      options: [
        "The shift from procedural to object-oriented paradigms",
        "Introduction of dynamic programming techniques",
        "Development of efficient sorting algorithms", 
        "Creation of database indexing methods"
      ],
      correctAnswer: 1,
      explanation: `Dynamic programming revolutionized problem-solving by enabling efficient solutions to complex problems through optimal substructure and memoization.`
    },
    {
      question: `When designing a recommendation system for an e-commerce platform, which ${topic} approach would provide the most personalized suggestions?`,
      options: [
        "Collaborative filtering using matrix operations",
        "Content-based filtering with keyword matching",
        "Popularity-based trending items",
        "Random selection from user's purchase history"
      ],
      correctAnswer: 0,
      explanation: `Collaborative filtering analyzes user behavior patterns and similarities to provide highly personalized recommendations based on what similar users liked.`
    },
    {
      question: `Which ${topic} misconception often leads to performance issues in large-scale applications?`,
      options: [
        "Assuming all operations have constant time complexity",
        "Using the most recently learned data structure for every problem",
        "Prioritizing code readability over all performance considerations", 
        "Ignoring memory allocation patterns in recursive functions"
      ],
      correctAnswer: 1,
      explanation: `Applying data structures without considering their specific strengths and weaknesses for the problem domain often leads to suboptimal performance at scale.`
    }
  ];
  
  // Filter out recently used questions
  const usedQuestions = new Set(previousQuestions);
  const available = creativeQuestions.filter(q => !usedQuestions.has(q.question));
  
  const selected = available.length > 0 
    ? available[Math.floor(Math.random() * available.length)]
    : creativeQuestions[Math.floor(Math.random() * creativeQuestions.length)];
  
  return selected;
}