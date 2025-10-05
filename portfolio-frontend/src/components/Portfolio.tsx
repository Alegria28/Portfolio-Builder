import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/api';

interface PortfolioDetail {
  id: number;
  title: string;
  hero_title: string;
  hero_subtitle: string;
  about_content: string;
  template_name: string;
  created_at: string;
}

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check API health
      const healthData = await apiService.healthCheck();
      setApiStatus(healthData.message);
      
      // Fetch portfolio detail (modern API)
      if (id) {
        const detail = await apiService.getPortfolio(Number(id));
        setPortfolio(detail);
      }
      
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

  if (!portfolio) {
    return (
      <div className="portfolio-container">
        <h2>Portfolio</h2>
        <p>Not found.</p>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <h2>{portfolio.title}</h2>
      <div className="api-status" style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>✅ API Status:</strong> {apiStatus}
      </div>
      <p><strong>Template:</strong> {portfolio.template_name}</p>
      <p><strong>Created:</strong> {new Date(portfolio.created_at).toLocaleDateString()}</p>
      <hr />
      <h3>Hero</h3>
      <p>{portfolio.hero_title}</p>
      <p>{portfolio.hero_subtitle}</p>
      <h3>About</h3>
      <p>{portfolio.about_content}</p>
    </div>
  );
};

export default Portfolio;