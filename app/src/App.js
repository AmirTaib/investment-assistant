import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    async function fetchInsights() {
      const querySnapshot = await getDocs(collection(db, "daily_insights"));
      const data = querySnapshot.docs.map(doc => doc.data());
      setInsights(data);
    }
    fetchInsights();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Investment Insights</h1>
      <ul>
        {insights.map((insight, index) => (
          <li key={index}>{insight.timestamp} - {insight.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
