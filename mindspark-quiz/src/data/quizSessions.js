export const quizSessions = {
  "QUIZ123": {
    id: "QUIZ123",
    title: "Science Quiz 1",
    teacher: "Mr. Smith",
    questions: [
      {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
      },
      {
        id: 2, 
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1
      }
    ],
    students: {},
    isActive: true,
    showScoresToStudents: true, // NEW: Control score visibility
    createdAt: new Date().toISOString()
  }
};