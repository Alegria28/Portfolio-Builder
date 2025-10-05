import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  technology: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
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
      <div className="dashboard">
        <div className="loading">
          <h2>Dashboard</h2>
          <p>Loading your portfolio data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">Manage your portfolio items</p>
        </div>
        
        <div className="error-message">
          <p><strong>⚠️ Connection Error:</strong> {error}</p>
          <p><strong>Quick Fix:</strong></p>
          <ol>
            <li>Open terminal in your Django backend folder</li>
            <li>Run: <code>python manage.py runserver</code></li>
            <li>Ensure server starts on http://localhost:8000</li>
            <li>Click retry below</li>
          </ol>
        </div>
        <button onClick={fetchData} className="retry-button">
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Portfolio Dashboard</h2>
        <p className="dashboard-subtitle">Manage and showcase your projects</p>
      </div>
      
      <div className={`api-status ${error ? 'error' : ''}`}>
        <strong>🟢 API Status:</strong> {apiStatus}
        <br />
        <small>✅ React frontend connected to Django backend successfully!</small>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p className="stat-number">{portfolioItems.length}</p>
        </div>
        <div className="stat-card">
          <h3>Technologies</h3>
          <p className="stat-number">{new Set(portfolioItems.flatMap(item => item.technology.split(', '))).size}</p>
        </div>
        <div className="stat-card">
          <h3>Database</h3>
          <p className="stat-number">SQLite</p>
        </div>
      </div>

      <h3>Your Portfolio Projects</h3>
      
      {portfolioItems.length === 0 ? (
        <div className="empty-state">
          <h4>🎨 No projects yet!</h4>
          <p>Start building your portfolio by adding your first project.</p>
          <button className="cta-button cta-primary">Add First Project</button>
        </div>
      ) : (
        <div className="portfolio-items">
          {portfolioItems.map((item) => (
            <div key={item.id} className="portfolio-item">
              <h4>📁 {item.title}</h4>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Tech Stack:</strong> <span className="tech-tags">{item.technology}</span></p>
              <p><strong>Created:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
              <div className="item-actions">
                <button className="action-btn edit">✏️ Edit</button>
                <button className="action-btn view">👁️ View</button>
                <button className="action-btn delete">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="success-message">
        <h4>🎉 Full Stack Success!</h4>
        <div className="tech-stack">
          <span className="tech-badge react">⚛️ React + TypeScript</span>
          <span className="tech-badge django">🐍 Django REST API</span>
          <span className="tech-badge sqlite">💾 SQLite Database</span>
          <span className="tech-badge cors">🔄 CORS Enabled</span>
        </div>
        <p>Your portfolio builder is running perfectly with all components connected!</p>
      </div>
    </div>
  );
};

export default Dashboard;