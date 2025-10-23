// src/components/Dashboard.js - CREATE NEW FILE with this:
import React from 'react';

function Dashboard() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>🎉 Welcome to MindSpark AI!</h1>
      <p>You have successfully logged in!</p>
      <p>This is your teacher dashboard.</p>
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '10px',
        backgroundColor: '#f8f9fa'
      }}>
        <h3>Coming Soon Features:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ Create Quizzes</li>
          <li>✅ Generate AI Questions</li>
          <li>✅ Live Quiz Sessions</li>
          <li>✅ Student Join System</li>
        </ul>
      </div>
    </div>
  );
}

// DON'T FORGET THIS EXPORT!
export default Dashboard;