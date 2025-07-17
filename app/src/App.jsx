import { useEffect, useState } from 'react';
import { db, collection, getDocs } from './firebase';

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const snapshot = await getDocs(collection(db, "daily_logs"));
      setLogs(snapshot.docs.map(doc => doc.data()));
    }
    fetchLogs();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Hello Firestore Logs</h1>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log.timestamp} – {log.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
