import { useEffect, useState } from 'react';
import { getFirestore, collection, onSnapshot, query, orderBy, limit, DocumentData } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig, FIRESTORE_COLLECTIONS, APP_CONSTANTS } from '../config';
import { Insight } from '../types/insights';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const useInsights = () => {
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

  return { insights, loading, error };
}; 