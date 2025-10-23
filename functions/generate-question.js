const { GoogleGenerativeAI } = require("@google/generative-ai");

let questionHistory = new Map();

exports.handler = async (event) => {
  console.log('🚀 Function called with PATTERN BREAKER mode');
  
  const apiKey = process.env.GOOGLE_AI_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: getPatternBreakerFallback("general")
      })
    };
  }

  try {
    const { topic, difficulty = "medium" } = JSON.parse(event.body);
    console.log(`📚 Topic: "${topic}"`);
    
    const cleanTopic = cleanTopicInput(topic);
    console.log(`🧹 Cleaned: "${cleanTopic}"`);
    
    const previousQuestions = questionHistory.get(cleanTopic) || [];
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      CRITICAL: YOU MUST ABSOLUTELY AVOID THIS TERRIBLE QUESTION PATTERN:
      "What is the fundamental process involved in [topic]?"
      Options: ["The core mechanism of [topic]", "Historical development of [topic]", "Practical applications of [topic]", "Theoretical framework of [topic]"]
      
      THIS PATTERN IS BANNED! DO NOT USE IT EVER!
      
      CREATE A COMPLETELY DIFFERENT QUESTION ABOUT "${cleanTopic}" THAT:
      - Is specific and concrete, NOT abstract or generic
      - Tests practical knowledge or application
      - Has options that are REAL, SPECIFIC answers, not meta-descriptions
      - Cannot be answered by simply rephrasing the topic
      
      BANNED PHRASES:
      - "fundamental process"
      - "core mechanism" 
      - "historical development"
      - "practical applications"
      - "theoretical framework"
      - "main purpose"
      - "primary goal"
      - "basic concept"
      
      REQUIRED QUESTION CHARACTERISTICS:
      ✅ Must include SPECIFIC examples or scenarios
      ✅ Must test APPLIED knowledge, not definitions
      ✅ Options must be SUBSTANTIVE answers, not categories
      ✅ Question should make someone think, not recall
      
      EXAMPLE FOR "Astronomy":
      ❌ BAD: "What is the fundamental process involved in astronomy?"
      ✅ GOOD: "Which celestial phenomenon occurs when a massive star collapses under its own gravity, creating an object so dense that not even light can escape?"
      Options: ["Black hole formation", "Supernova explosion", "Planetary nebula creation", "White dwarf cooling"]
      
      EXAMPLE FOR "Human Evolution":
      ❌ BAD: "What is the core mechanism of human evolution?"
      ✅ GOOD: "Which genetic discovery in the 21st century provided crucial evidence about interbreeding between Homo sapiens and Neanderthals?"
      Options: ["DNA analysis of fossil remains", "Carbon dating of tools", "Comparative anatomy studies", "Language development patterns"]
      
      EXAMPLE FOR "Indian Songs":
      ❌ BAD: "What is the theoretical framework of Indian songs?"
      ✅ GOOD: "In Indian classical music, which rhythmic cycle consisting of 16 beats is commonly used in compositions and improvisations?"
      Options: ["Teental", "Raga Yaman", "Harmonium accompaniment", "Bollywood playback"]
      
      CREATE YOUR QUESTION:
      - Make it about SPECIFIC knowledge of "${cleanTopic}"
      - Include concrete details, names, events, or techniques
      - Ensure options are factual answers, not abstract categories
      - Place correct answer randomly (0-3)
      
      Return JSON:
      {
        "question": "Your specific, non-generic question?",
        "options": ["Specific answer A", "Specific answer B", "Specific answer C", "Specific answer D"],
        "correctAnswer": 0,
        "explanation": "Why the correct answer is right"
      }
      
      NOW CREATE A QUESTION THAT BREAKS THE TERRIBLE PATTERN COMPLETELY!
    `;

    console.log('💥 Calling AI with pattern breaker...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📨 AI Raw Response:', text);

    try {
      let questionData = JSON.parse(text.trim());
      
      // PATTERN DETECTION AND REJECTION
      const badPatternDetected = detectBadPattern(questionData, cleanTopic);
      if (badPatternDetected) {
        console.log('🚨 BAD PATTERN DETECTED! Using emergency fallback');
        throw new Error('AI used banned pattern');
      }
      
      // Validate structure
      if (!questionData.question || !questionData.options || questionData.options.length !== 4) {
        throw new Error('Invalid structure');
      }
      
      // Ensure valid correctAnswer
      if (questionData.correctAnswer < 0 || questionData.correctAnswer > 3) {
        questionData.correctAnswer = Math.floor(Math.random() * 4);
      }
      
      console.log(`🎯 Question: ${questionData.question}`);
      console.log(`📊 Options: ${questionData.options.join(' | ')}`);
      
      // Store history
      const history = questionHistory.get(cleanTopic) || [];
      history.push(questionData.question);
      if (history.length > 10) history.shift();
      questionHistory.set(cleanTopic, history);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: questionData,
          patternCheck: "passed"
        })
      };
      
    } catch (parseError) {
      console.error('❌ Pattern violation or parse error, using emergency fallback');
      const fallback = getPatternBreakerFallback(cleanTopic, previousQuestions);
      
      const history = questionHistory.get(cleanTopic) || [];
      history.push(fallback.question);
      questionHistory.set(cleanTopic, history);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          data: fallback,
          note: "Emergency fallback due to pattern violation"
        })
      };
    }

  } catch (error) {
    console.error('💥 Function error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: getPatternBreakerFallback("error", [])
      })
    };
  }
};

// Detect and reject the bad pattern
function detectBadPattern(questionData, topic) {
  const question = questionData.question.toLowerCase();
  const options = questionData.options.map(opt => opt.toLowerCase());
  
  // Check for banned phrases in question
  const bannedPhrases = [
    "fundamental process", "core mechanism", "historical development",
    "practical applications", "theoretical framework", "main purpose",
    "primary goal", "basic concept", "what is the", "what are the"
  ];
  
  for (const phrase of bannedPhrases) {
    if (question.includes(phrase)) {
      console.log(`🚨 Banned phrase detected: ${phrase}`);
      return true;
    }
  }
  
  // Check for meta-option patterns
  const metaPatterns = options.some(opt => 
    opt.includes("core mechanism") || 
    opt.includes("historical development") ||
    opt.includes("practical applications") ||
    opt.includes("theoretical framework") ||
    opt.includes("of " + topic.toLowerCase())
  );
  
  if (metaPatterns) {
    console.log('🚨 Meta-option pattern detected');
    return true;
  }
  
  // Check if options are too generic
  const allOptionsGeneric = options.every(opt => 
    opt.length < 20 || // Too short
    opt.split(' ').length < 4 // Too few words
  );
  
  if (allOptionsGeneric) {
    console.log('🚨 Options too generic');
    return true;
  }
  
  return false;
}

// Topic cleaning
function cleanTopicInput(topic) {
  if (!topic) return "General Knowledge";
  
  const lowerTopic = topic.toLowerCase().trim();
  const questionPhrases = ["what is", "what are", "explain", "define", "describe"];
  let cleaned = lowerTopic;
  questionPhrases.forEach(phrase => {
    if (cleaned.startsWith(phrase)) {
      cleaned = cleaned.replace(phrase, '').trim();
    }
  });
  
  const acronyms = {
    "dsa": "Data Structures and Algorithms",
    "ai": "Artificial Intelligence", 
    "ml": "Machine Learning"
  };
  
  return acronyms[cleaned] || 
    cleaned.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

// Emergency fallbacks that actually break the pattern
function getPatternBreakerFallback(topic, previousQuestions) {
  const emergencyQuestions = {
    "Astronomy": {
      question: "Which spacecraft provided the first detailed images of Pluto's surface in 2015, revealing heart-shaped glaciers and mountains?",
      options: [
        "New Horizons",
        "Voyager 1", 
        "Hubble Space Telescope",
        "Cassini-Huygens"
      ],
      correctAnswer: 0,
      explanation: "NASA's New Horizons spacecraft conducted a flyby of Pluto in July 2015, capturing unprecedented images of its surface features."
    },
    "Human Evolution": {
      question: "The discovery of which hominin species in Siberia's Denisova Cave revealed interbreeding with both Neanderthals and modern humans?",
      options: [
        "Denisovans",
        "Homo erectus", 
        "Australopithecus afarensis",
        "Homo habilis"
      ],
      correctAnswer: 0,
      explanation: "Denisovans, identified through DNA analysis in 2010, interbred with both Neanderthals and Homo sapiens, leaving genetic traces in modern human populations."
    },
    "Indian Songs": {
      question: "Which legendary Indian composer created the raga-based background score for the 1955 film 'Pyaasa' that revolutionized Bollywood music?",
      options: [
        "S.D. Burman",
        "R.D. Burman", 
        "Naushad Ali",
        "A.R. Rahman"
      ],
      correctAnswer: 0,
      explanation: "S.D. Burman's innovative use of classical ragas in 'Pyaasa' created a new standard for film music composition in Indian cinema."
    },
    "Data Structures and Algorithms": {
      question: "In distributed systems, which consensus algorithm allows multiple servers to agree on data values despite network failures?",
      options: [
        "Raft Protocol",
        "QuickSort algorithm", 
        "Dijkstra's algorithm",
        "Binary search trees"
      ],
      correctAnswer: 0,
      explanation: "The Raft consensus algorithm enables distributed systems to maintain consistency and agree on operations even when some servers fail or networks partition."
    }
  };
  
  // Try to get topic-specific question
  if (emergencyQuestions[topic]) {
    return emergencyQuestions[topic];
  }
  
  // Generic emergency question
  const genericQuestions = [
    {
      question: `What recent breakthrough in ${topic} has significantly changed our understanding or capabilities in this field?`,
      options: [
        "CRISPR gene editing technology development",
        "Deep learning neural network advancements", 
        "Quantum computing experimental verification",
        "Mars rover geological discoveries"
      ],
      correctAnswer: 1,
      explanation: `Recent advances in ${topic} continue to push the boundaries of what's possible in scientific and technological innovation.`
    }
  ];
  
  return genericQuestions[0];
}