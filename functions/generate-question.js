const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  console.log('=== 🚨 AI FUNCTION DEBUG START ===');
  
  // Debug: Check if API key is loading
  console.log('API Key exists:', !!process.env.GOOGLE_AI_KEY);
  console.log('API Key length:', process.env.GOOGLE_AI_KEY?.length);
  console.log('API Key first 10 chars:', process.env.GOOGLE_AI_KEY?.substring(0, 10) + '...');
  
  if (event.httpMethod !== 'POST') {
    console.log('❌ Wrong HTTP method');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { topic, difficulty = 'medium' } = JSON.parse(event.body);
    console.log('Received topic:', topic);
    
    if (!topic) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Topic is required' })
      };
    }

    // Check if we have a valid API key
    if (!process.env.GOOGLE_AI_KEY || process.env.GOOGLE_AI_KEY.length < 10) {
      console.log('❌ No valid API key found, using mock data');
      const mockQuestion = getMockQuestion(topic);
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          data: mockQuestion,
          note: "Using mock data - no valid API key"
        })
      };
    }

    console.log('✅ Attempting real AI generation...');
    
    // Initialize Google AI with your REAL API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create one multiple-choice question about "${topic}". Return ONLY JSON: {"question": "...", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "..."}`;

    console.log('Sending request to Google AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('✅ AI Raw Response:', text);

    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    let questionData;
    try {
      questionData = JSON.parse(cleanText);
      console.log('✅ AI Success - Question:', questionData.question);
    } catch (parseError) {
      console.log('❌ JSON parse error, using mock data');
      questionData = getMockQuestion(topic);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        data: questionData 
      })
    };

  } catch (error) {
    console.log('❌ AI Generation Error:', error.message);
    // Fallback to mock data
    const mockQuestion = getMockQuestion(topic);
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        data: mockQuestion,
        error: error.message 
      })
    };
  }
};

// Mock data fallback
function getMockQuestion(topic) {
  return {
    question: `What is the fundamental process involved in ${topic}?`,
    options: [
      `The core mechanism of ${topic}`,
      `Historical development of ${topic}`,
      `Practical applications of ${topic}`,
      `Theoretical framework of ${topic}`
    ],
    correctAnswer: 0,
    explanation: `Mock data - real AI not available`
  };
}