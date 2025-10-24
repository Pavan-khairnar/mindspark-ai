// src/services/firebaseServices.js
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where,
  setDoc,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Quiz Services
export const quizService = {

    // Add this temporary debug function
  getAllQuizzes: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'quizzes'));
      const quizzes = [];
      querySnapshot.forEach((doc) => {
        quizzes.push({ id: doc.id, ...doc.data() });
      });
      console.log('📋 All quizzes in database:', quizzes);
      return quizzes;
    } catch (error) {
      console.error('Error getting all quizzes:', error);
      return [];
    }
  },

  // Create a new quiz
  async createQuiz(quizData) {
    try {
      console.log('🔥 Creating quiz in Firestore...');
      
      // Validate required fields for security rules
      if (!quizData.teacherId) {
        throw new Error('teacherId is required for security rules');
      }
      
      const docRef = await addDoc(collection(db, 'quizzes'), {
        ...quizData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: quizData.isActive !== undefined ? quizData.isActive : true
      });
      
      console.log('🎉 Quiz created successfully with ID:', docRef.id);
      return docRef.id;
      
    } catch (error) {
      console.error('💥 Firestore create error:', {
        code: error.code,
        message: error.message,
        quizData: quizData
      });
      
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Make sure you are logged in and teacherId is correct.');
      }
      throw error;
    }
  },

  // Get all quizzes for a teacher
  async getQuizzesByTeacher(teacherId) {
    try {
      const q = query(
        collection(db, 'quizzes'), 
        where('teacherId', '==', teacherId)
      );
      const querySnapshot = await getDocs(q);
      const quizzes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return quizzes.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error getting quizzes:', error);
      throw error;
    }
  },

  

  // Get a single quiz by ID
  async getQuizById(quizId) {
    try {
         console.log('🔍 getQuizById called with ID:', quizId);
      console.log('🔍 ID type:', typeof quizId);
      console.log('🔍 ID length:', quizId.length);
      const docRef = doc(db, 'quizzes', quizId);
      const docSnap = await getDoc(docRef);
       if (docSnap.exists()) {
        console.log('✅ Quiz found in database');
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log('❌ Quiz not found in database');
        throw new Error('Quiz not found');
      }
    } catch (error) {
      console.error('Error getting quiz:', error);
      throw error;
    }
  },

  // Update a quiz
  async updateQuiz(quizId, quizData) {
    try {
      const docRef = doc(db, 'quizzes', quizId);
      const updateData = {
        ...quizData,
        updatedAt: new Date()
      };
      
      delete updateData.id;
      await updateDoc(docRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  // Update quiz using setDoc (more reliable)
  async updateQuizWithSet(quizId, quizData) {
    try {
      console.log('🔄 Updating quiz with setDoc:', quizId);
      
      const docRef = doc(db, 'quizzes', quizId);
      
      // Prepare data for Firestore
      const firestoreData = {
        ...quizData,
        updatedAt: new Date()
      };
      
      // Remove any undefined values that might cause issues
      Object.keys(firestoreData).forEach(key => {
        if (firestoreData[key] === undefined) {
          delete firestoreData[key];
        }
      });
      
      await setDoc(docRef, firestoreData, { merge: true });
      
      console.log('✅ Quiz updated/created successfully with setDoc');
      return true;
    } catch (error) {
      console.error('❌ Error updating quiz with setDoc:', error);
      
      // If setDoc fails, try the regular update method as fallback
      try {
        console.log('🔄 Trying fallback update method...');
        await this.updateQuiz(quizId, quizData);
        console.log('✅ Fallback update successful');
        return true;
      } catch (fallbackError) {
        console.error('❌ Fallback update also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
  },

  // Delete a quiz
  async deleteQuiz(quizId) {
    try {
      console.log('Deleting quiz:', quizId);
      const docRef = doc(db, 'quizzes', quizId);
      await deleteDoc(docRef);
      console.log('Delete successful');
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      return false;
    }
  },

  // Real-time listeners
  subscribeToQuizzes(teacherId, callback) {
    const q = query(
      collection(db, 'quizzes'),
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const quizzes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(quizzes);
    });
  }
};

// Student Services
export const studentService = {
  // Submit quiz response
  async submitQuizResponse(quizId, studentId, answers, isAutoSubmitted = false) {
    try {
      const quiz = await quizService.getQuizById(quizId);
      let score = 0;
      let totalQuestions = quiz.questions.length;

      quiz.questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          score++;
        }
      });

      const resultData = {
        quizId,
        studentId,
        studentName: 'Student',
        answers,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        submittedAt: new Date(),
        teacherId: quiz.teacherId,
        quizTitle: quiz.title,
        isAutoSubmitted
      };

      const docRef = await addDoc(collection(db, 'studentResults'), resultData);
      return { id: docRef.id, ...resultData };
    } catch (error) {
      console.error('Error submitting quiz response:', error);
      throw error;
    }
  },

  // Get student results for a teacher
  async getStudentResultsByTeacher(teacherId) {
    try {
      const q = query(
        collection(db, 'studentResults'), 
        where('teacherId', '==', teacherId),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting student results:', error);
      throw error;
    }
  },

  // Get student results for a quiz
  async getStudentResultsByQuiz(quizId) {
    try {
      const q = query(
        collection(db, 'studentResults'), 
        where('quizId', '==', quizId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting student results:', error);
      throw error;
    }
  }
};

// Real-time Dashboard Services
export const realtimeService = {
  // Subscribe to live quiz results
  subscribeToLiveResults(quizId, callback) {
    const q = query(
      collection(db, 'studentResults'),
      where('quizId', '==', quizId),
      orderBy('submittedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(results);
    });
  }
};

