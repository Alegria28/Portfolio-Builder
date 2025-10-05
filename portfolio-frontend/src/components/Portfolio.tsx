import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  technology: string;
  created_at: string;
}

const Portfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check API health
      const healthData = await apiService.healthCheck();
      setApiStatus(healthData.message);
      
      // Fetch portfolio items
      const items = await apiService.getPortfolioItems();
      setPortfolioItems(items);
      
      setError(null);
    } catch (err) {
      setError('Failed to connect to the backend API. Make sure Django server is running on http://localhost:8000');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="portfolio-container">
        <h2>Portfolio</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-container">
        <h2>Portfolio</h2>
        <div className="error-message" style={{ color: 'red', padding: '20px', border: '1px solid red', borderRadius: '5px' }}>
          <p><strong>Error:</strong> {error}</p>
          <p><strong>To fix this:</strong></p>
          <ol>
            <li>Navigate to your Django backend folder: <code>cd portfolio-backend</code></li>
            <li>Run: <code>python manage.py runserver</code></li>
            <li>Make sure the server starts on http://localhost:8000</li>
            <li>Refresh this page</li>
          </ol>
        </div>
        <button onClick={fetchData} style={{ marginTop: '10px', padding: '10px', cursor: 'pointer' }}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <h2>Portfolio Builder</h2>
      
      <div className="api-status" style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>✅ API Status:</strong> {apiStatus}
      </div>

      <h3>Portfolio Items</h3>
      
      {portfolioItems.length === 0 ? (
        <p>No portfolio items found.</p>
      ) : (
        <div className="portfolio-items">
          {portfolioItems.map((item) => (
            <div key={item.id} className="portfolio-item" style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              margin: '10px 0', 
              borderRadius: '5px',
              backgroundColor: '#f9f9f9'
            }}>
              <h4>{item.title}</h4>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Technology:</strong> {item.technology}</p>
              <p><strong>Created:</strong> {item.created_at}</p>
            </div>
          ))}
        </div>
      )}
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
        <h4>🎉 Success! React ↔ Django Connection Working</h4>
        <p>Your React frontend is successfully communicating with your Django backend!</p>
        <ul>
          <li>✅ React app running on http://localhost:3000</li>
          <li>✅ Django API responding from http://localhost:8000</li>
          <li>✅ CORS configured properly</li>
          <li>✅ SQLite database ready for use</li>
        </ul>
      </div>
    </div>
  );
};

export default Portfolio;