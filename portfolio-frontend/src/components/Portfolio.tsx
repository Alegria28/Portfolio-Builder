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
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check API health
      const healthData = await apiService.healthCheck();
      setApiStatus(healthData.message);
      
      // Fetch portfolio detail (modern API)
      if (id) {
        const portfolioId = Number(id);
        const detail = await apiService.getPortfolio(portfolioId);
        setPortfolio(detail);
        // Fetch server-rendered HTML for exact preview
        try {
          const html = await apiService.exportPortfolioHtml(portfolioId);
          setHtmlPreview(html);
        } catch (e) {
          console.warn('Preview HTML fetch failed, falling back to basic view');
        }
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
        <div className="error-message">
          <p><strong>Error:</strong> {error}</p>
          <p><strong>To fix this:</strong></p>
          <ol>
            <li>Navigate to your Django backend folder: <code>cd portfolio-backend</code></li>
            <li>Run: <code>python manage.py runserver</code></li>
            <li>Make sure the server starts on http://localhost:8000</li>
            <li>Refresh this page</li>
          </ol>
        </div>
        <div className="mt-10">
          <button onClick={fetchData} className="auth-button">
            Retry Connection
          </button>
        </div>
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
      <div className="api-status">
        <strong>✅ API Status:</strong> {apiStatus}
      </div>
      <p><strong>Template:</strong> {portfolio.template_name}</p>
      <p><strong>Created:</strong> {new Date(portfolio.created_at).toLocaleDateString()}</p>
      <hr />
      {htmlPreview ? (
        <div className="portfolio-preview">
          <iframe
            title={`Portfolio ${portfolio.id} Preview`}
            srcDoc={htmlPreview}
            sandbox="allow-popups allow-scripts allow-forms allow-same-origin"
          />
        </div>
      ) : (
        <>
          <h3>Hero</h3>
          <p>{portfolio.hero_title}</p>
          <p>{portfolio.hero_subtitle}</p>
          <h3>About</h3>
          <p>{portfolio.about_content}</p>
        </>
      )}
    </div>
  );
};

export default Portfolio;