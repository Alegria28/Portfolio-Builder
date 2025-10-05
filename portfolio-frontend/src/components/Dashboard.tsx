import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

interface PortfolioItem {
  id: number;
  title: string;
  template_name: string;
  created_at: string;
  is_published?: boolean;
}

const Dashboard: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('');
  const navigate = useNavigate();
  const [creating, setCreating] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState({
    template: 0,
    title: 'New Portfolio',
    hero_title: 'Your Name',
    hero_subtitle: 'Your Role',
    about_content: 'Tell your story here...',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check API health
      const healthData = await apiService.healthCheck();
      setApiStatus(healthData.message);
      
  // Fetch portfolios (modern API)
  const items = await apiService.getPortfolios();
  setPortfolioItems(items);
      
      setError(null);
    } catch (err) {
      setError('Failed to connect to the backend API. Make sure Django server is running on http://localhost:8000');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = async () => {
    try {
      setLoadingTemplates(true);
      const list = await apiService.getTemplates();
      setTemplates(list);
      const defaultTpl = list.find((t: any) => !t.is_premium) || list[0];
      setCreateForm((prev) => ({ ...prev, template: defaultTpl ? defaultTpl.id : 0 }));
      setShowCreateModal(true);
    } catch (e) {
      console.error('Failed to load templates', e);
      setError('Failed to load templates');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const submitCreate = async () => {
    try {
      setCreating(true);
      if (!createForm.template) throw new Error('Please choose a template');
      await apiService.createPortfolio(createForm);
      setShowCreateModal(false);
      await fetchData();
    } catch (err) {
      console.error('Failed to create portfolio', err);
      setError('Failed to create project. Are you logged in?');
    } finally {
      setCreating(false);
    }
  };

  const handleView = (id: number) => {
    navigate(`/portfolio/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/editor/${id}`);
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm('Delete this portfolio? This cannot be undone.');
    if (!ok) return;
    try {
      await apiService.deletePortfolio(id);
      await fetchData();
    } catch (e) {
      console.error('Delete failed', e);
      setError('Failed to delete portfolio');
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
          <h3>Published</h3>
          <p className="stat-number">{portfolioItems.filter(i => i.is_published).length}</p>
        </div>
        <div className="stat-card">
          <h3>Database</h3>
          <p className="stat-number">SQLite</p>
        </div>
      </div>

      <div className="list-header">
        <h3>Your Portfolio Projects</h3>
        {portfolioItems.length > 0 && (
          <button className="cta-button cta-primary" onClick={openCreateModal} disabled={creating}>
            {creating ? 'Adding…' : 'Add Project'}
          </button>
        )}
      </div>
      
      {portfolioItems.length === 0 ? (
        <div className="empty-state">
          <h4>🎨 No projects yet!</h4>
          <p>Start building your portfolio by adding your first project.</p>
          <button className="cta-button cta-primary" onClick={openCreateModal} disabled={creating}>
            {creating ? 'Adding…' : 'Add First Project'}
          </button>
        </div>
      ) : (
        <div className="portfolio-items">
          {portfolioItems.map((item) => (
            <div key={item.id} className="portfolio-item">
              <h4>📁 {item.title}</h4>
              <p><strong>Template:</strong> {item.template_name || '—'}</p>
              <p><strong>Created:</strong> {new Date(item.created_at).toLocaleDateString()}</p>
              <div className="item-actions">
                <button className="action-btn edit" onClick={() => handleEdit(item.id)}>✏️ Edit</button>
                <button className="action-btn view" onClick={() => handleView(item.id)}>👁️ View</button>
                <button className="action-btn delete" onClick={() => handleDelete(item.id)}>🗑️ Delete</button>
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

      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Portfolio</h3>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Template</label>
                <select
                  value={createForm.template}
                  onChange={(e) => setCreateForm({ ...createForm, template: Number(e.target.value) })}
                  disabled={loadingTemplates}
                  aria-label="Template"
                  title="Template"
                >
                  {templates.map((t) => (
                    <option value={t.id} key={t.id}>
                      {t.name} {t.is_premium ? '(Premium)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="New Portfolio"
                  aria-label="Title"
                  title="Title"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Hero Title</label>
                  <input
                    type="text"
                    value={createForm.hero_title}
                    onChange={(e) => setCreateForm({ ...createForm, hero_title: e.target.value })}
                    placeholder="Your Name"
                    aria-label="Hero Title"
                    title="Hero Title"
                  />
                </div>
                <div className="form-group">
                  <label>Hero Subtitle</label>
                  <input
                    type="text"
                    value={createForm.hero_subtitle}
                    onChange={(e) => setCreateForm({ ...createForm, hero_subtitle: e.target.value })}
                    placeholder="Your Role"
                    aria-label="Hero Subtitle"
                    title="Hero Subtitle"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>About</label>
                <textarea
                  rows={3}
                  value={createForm.about_content}
                  onChange={(e) => setCreateForm({ ...createForm, about_content: e.target.value })}
                  placeholder="Tell your story here..."
                  aria-label="About content"
                  title="About content"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="cta-button" onClick={() => setShowCreateModal(false)} disabled={creating}>Cancel</button>
              <button className="cta-button cta-primary" onClick={submitCreate} disabled={creating}>
                {creating ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;