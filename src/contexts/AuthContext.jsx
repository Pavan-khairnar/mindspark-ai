// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password, additionalData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(user, {
        displayName: additionalData.name
      });

      // Store additional user data in Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        displayName: additionalData.name,
        role: additionalData.role || 'student',
        createdAt: new Date(),
        emailVerified: false
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);
      setUserData(userDoc);
      
      // Send email verification
      await sendEmailVerification(user);
      
      return user;
    } catch (error) {
      console.error('Error in signup:', error);
      throw error;
    }
  };

  // Login function
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = () => {
    return signOut(auth);
  };

  // Check if user is teacher
  const isTeacher = () => {
    return userData?.role === 'teacher';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            // Create user document if it doesn't exist
            const userDocData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || 'User',
              role: 'student',
              createdAt: new Date(),
              emailVerified: user.emailVerified
            };
            await setDoc(doc(db, 'users', user.uid), userDocData);
            setUserData(userDocData);
            console.log('Created default user document with role: student');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('No user logged in');
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    signup,
    login,
    logout,
    isTeacher,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}