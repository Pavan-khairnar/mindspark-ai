// functions/generate-question.js - REAL AI VERSION
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { topic, difficulty = 'medium' } = JSON.parse(event.body);
    
    if (!topic) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Topic is required' })
      };
    }

    console.log('Generating AI question for topic:', topic);

    // Initialize Google AI with your REAL API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create exactly one multiple-choice question about "${topic}" at ${difficulty} difficulty level.

IMPORTANT: Return ONLY valid JSON with this exact structure:
{
  "question": "The question text here?",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "correctAnswer": 0,
  "explanation": "Brief explanation of why the correct answer is right"
}

Requirements:
- Question must be clear and educational
- 4 options labeled A, B, C, D
- Only one correct answer (correctAnswer should be 0, 1, 2, or 3)
- Wrong options should be plausible but incorrect
- Explanation should be helpful and educational
- Make the question appropriate for college students`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('AI Raw Response:', text);

    // Clean the response (remove markdown code blocks)
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    
    let questionData;
    try {
      questionData = JSON.parse(cleanText);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        questionData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create a basic question
        questionData = {
          question: `What is the most important aspect of ${topic}?`,
          options: [
            `Fundamental principles of ${topic}`,
            `Historical background of ${topic}`,
            `Practical applications of ${topic}`,
            `Theoretical concepts in ${topic}`
          ],
          correctAnswer: 0,
          explanation: `This question covers key aspects of ${topic}. The fundamental principles are typically the most important for understanding.`
        };
      }
    }

    // Validate the response structure
    if (!questionData.question || !Array.isArray(questionData.options)) {
      throw new Error('Invalid question format from AI');
    }

    console.log('AI Success:', questionData.question);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        data: questionData 
      })
    };

  } catch (error) {
    console.error('AI Generation Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to generate question",
        details: error.message 
      })
    };
  }
};