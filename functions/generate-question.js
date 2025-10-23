const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  console.log('🚀 Function called with real AI');
  
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
      Generate a multiple choice question about ${topic} at ${difficulty} difficulty level.
      
      Return ONLY a JSON object in this exact format:
      {
        "question": "The question text here",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Brief explanation of why the correct answer is right"
      }
      
      Make sure the correctAnswer is an integer (0-3) representing the index of the correct option.
      The question should be educational and clear.
    `;

    console.log('🤖 Calling Google AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📨 AI Response:', text);

    // Try to parse the AI response as JSON
    try {
      const questionData = JSON.parse(text);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: questionData
        })
      };
      
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', text);
      
      // Fallback to mock data if JSON parsing fails
      const mockData = {
        question: `AI Generated: ${topic} Question`,
        options: ["Correct Answer", "Incorrect 1", "Incorrect 2", "Incorrect 3"],
        correctAnswer: 0,
        explanation: "AI response format issue - using fallback"
      };

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: mockData,
          note: "AI responded but JSON parsing failed"
        })
      };
    }

  } catch (error) {
    console.error('💥 Function error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        stack: error.stack
      })
    };
  }
};