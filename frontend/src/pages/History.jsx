import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/history/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data);
        console.log (response.data)
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Your Generated Images</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {history.map((item) => (
          <div key={item.id} style={{ margin: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <p><strong>Prompt:</strong> {item.prompt}</p>
            <img src={item.image_url} alt="Generated" style={{ width: '200px' }} />
            <p><i>{new Date(item.created_at).toLocaleString()}</i></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
