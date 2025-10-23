const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  console.log('🚀 Function called with enhanced AI prompting');
  
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
    console.log(`📚 Generating question for: ${topic}, difficulty: ${difficulty}`);
    
    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Create a high-quality multiple choice question about "${topic}" at ${difficulty} difficulty level.
      
      CRITICAL REQUIREMENTS:
      - The question must be clear and specific
      - Options must be DISTINCT and not overlapping
      - Only ONE option should be correct
      - Wrong options should be plausible but clearly incorrect
      - Correct answer should be educational
      
      Return ONLY a JSON object in this exact format:
      {
        "question": "Clear, specific question text here?",
        "options": [
          "Specific correct answer with educational value",
          "Plausible but incorrect alternative 1", 
          "Plausible but incorrect alternative 2",
          "Clearly wrong alternative for differentiation"
        ],
        "correctAnswer": 0,
        "explanation": "Brief educational explanation of why the correct answer is right"
      }
      
      Example for "stack data structure":
      {
        "question": "Which principle describes the fundamental operation of a stack data structure?",
        "options": [
          "Last-In-First-Out (LIFO)",
          "First-In-First-Out (FIFO)", 
          "Random Access",
          "Priority-Based Processing"
        ],
        "correctAnswer": 0,
        "explanation": "Stacks follow LIFO principle where the last element added is the first one removed, unlike queues which use FIFO."
      }
    `;

    console.log('🤖 Calling Google AI with enhanced prompt...');
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
      
      // Enhanced fallback data
      const mockData = {
        question: `What is the key characteristic of ${topic}?`,
        options: [
          "Clear correct answer with educational value",
          "Plausible but incorrect alternative", 
          "Another incorrect but reasonable option",
          "Obviously wrong option for contrast"
        ],
        correctAnswer: 0,
        explanation: "Enhanced fallback - AI response format issue"
      };

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: mockData,
          note: "AI responded but JSON parsing failed - using enhanced fallback"
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