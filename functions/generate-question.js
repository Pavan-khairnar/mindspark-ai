const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  console.log('🚨 Function called - checking API key');
  
  // Simple API key check
  const apiKey = process.env.GOOGLE_AI_KEY;
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  
  if (!apiKey) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: {
          question: "API KEY MISSING - Check environment variable",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0,
          explanation: "The GOOGLE_AI_KEY environment variable is not set"
        }
      })
    };
  }

  try {
    const { topic } = JSON.parse(event.body);
    
    // Use mock data for now to test the function works
    const mockData = {
      question: `Test question about ${topic}`,
      options: ["Correct answer", "Wrong 1", "Wrong 2", "Wrong 3"],
      correctAnswer: 0,
      explanation: "This is test data - function is working"
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: mockData,
        note: "Function working - API key found"
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Function error",
        details: error.message
      })
    };
  }
};