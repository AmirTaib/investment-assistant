import React, { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot, query, orderBy, limit, DocumentData } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig, FIRESTORE_COLLECTIONS, APP_CONSTANTS, UI_CONSTANTS } from './config';

interface Insight {
  timestamp: string;
  message: string;
  id?: string;
  doc_id?: string;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App(): JSX.Element {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create a query for real-time updates
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.DAILY_INSIGHTS),
      orderBy("timestamp", "desc"), // Most recent first
      limit(APP_CONSTANTS.INSIGHTS_LIMIT) // Limit to last 20 insights
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        try {
          const data: Insight[] = querySnapshot.docs.map(doc => ({
            ...doc.data() as Insight,
            id: doc.id,
            doc_id: doc.id
          }));
          setInsights(data);
          setLoading(false);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : APP_CONSTANTS.ERROR_MESSAGES.LOADING_FAILED);
          setLoading(false);
        }
      },
      (err) => {
        // Handle real-time listener errors
        setError(`Real-time listener error: ${err.message}`);
        setLoading(false);
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div>Loading insights...</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
          Real-time updates enabled - new insights will appear automatically
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: 'red' }}>
        <div>Error: {error}</div>
        <div style={{ fontSize: '12px', marginTop: '10px' }}>
          Try refreshing the page or check your connection
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: '800px', margin: '0 auto' }}>
      <h1>{APP_CONSTANTS.APP_NAME} Insights</h1>
      <div style={{ 
        fontSize: '14px', 
        color: '#666', 
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f0f8ff',
        borderRadius: '5px',
        border: '1px solid #d0e7ff'
      }}>
        ✅ Real-time updates enabled - new insights will appear automatically when added
      </div>
      
      {insights.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666',
          backgroundColor: '#f9f9f9',
          borderRadius: '5px'
        }}>
          <div>No insights available yet.</div>
          <div style={{ fontSize: '12px', marginTop: '10px' }}>
            Insights will appear here when they are generated
          </div>
        </div>
      ) : (
        <div>
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginBottom: '10px' 
          }}>
            Showing {insights.length} insights (most recent first)
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {insights.map((insight, index) => (
              <li 
                key={insight.id || insight.doc_id || index}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: index === 0 ? '#fff3cd' : '#f8f9fa',
                  border: index === 0 ? '2px solid #ffc107' : '1px solid #dee2e6',
                  borderRadius: '5px',
                  borderLeft: index === 0 ? '4px solid #ffc107' : '4px solid #007bff'
                }}
              >
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginBottom: '5px' 
                }}>
                  {formatTimestamp(insight.timestamp)}
                  {index === 0 && (
                    <span style={{ 
                      backgroundColor: '#ffc107', 
                      color: '#000', 
                      padding: '2px 6px', 
                      borderRadius: '3px', 
                      marginLeft: '10px',
                      fontSize: '10px'
                    }}>
                      NEWEST
                    </span>
                  )}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap'
                }}>
                  {insight.message}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App; 