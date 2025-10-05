import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Portfolio {
  id: number;
  title: string;
  hero_title: string;
  hero_subtitle: string;
  about_content: string;
  contact_email: string;
  contact_phone: string;
  social_linkedin: string;
  social_github: string;
  social_twitter: string;
  template_name: string;
}

const PortfolioEditor: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [previewMode, setPreviewMode] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (portfolioId) {
      fetchPortfolio();
    }
  }, [isAuthenticated, portfolioId, navigate]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const portfolioData = await apiService.getPortfolio(Number(portfolioId));
      setPortfolio(portfolioData);
    } catch (err) {
      setError('Failed to load portfolio');
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!portfolio) return;
    
    setSaving(true);
    try {
      const updatedPortfolio = await apiService.updatePortfolio(portfolio.id, portfolio);
      setPortfolio(updatedPortfolio);
      alert('Portfolio saved successfully!');
    } catch (err) {
      setError('Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    if (!portfolio) return;
    
    try {
      await apiService.exportPortfolio(portfolio.id);
      alert('Portfolio exported successfully! Check your downloads folder.');
    } catch (err) {
      alert('Failed to export portfolio');
    }
  };

  const handleInputChange = (field: keyof Portfolio, value: string) => {
    if (portfolio) {
      setPortfolio({
        ...portfolio,
        [field]: value
      });
    }
  };

  if (loading) {
    return (
      <div className="editor-container">
        <div className="loading">
          <h2>Loading Portfolio Editor...</h2>
          <p>Setting up your workspace</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="editor-container">
        <div className="error-state">
          <h2>⚠️ Error</h2>
          <p>{error || 'Portfolio not found'}</p>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="editor-title">
          <h1>📝 Editing: {portfolio.title}</h1>
          <p>Template: {portfolio.template_name}</p>
        </div>
        
        <div className="editor-actions">
          <button onClick={handleSave} disabled={saving} className="save-button">
            {saving ? '⏳ Saving...' : '💾 Save'}
          </button>
          <button onClick={handleExport} className="export-button">
            📥 Export HTML
          </button>
          <button 
            onClick={() => setPreviewMode(!previewMode)} 
            className="preview-button"
          >
            {previewMode ? '✏️ Edit' : '👁️ Preview'}
          </button>
        </div>
      </div>

      <div className="editor-content">
        {!previewMode ? (
          <>
            <div className="editor-tabs">
              <button 
                className={activeTab === 'content' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('content')}
              >
                📝 Content
              </button>
              <button 
                className={activeTab === 'contact' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('contact')}
              >
                📞 Contact
              </button>
              <button 
                className={activeTab === 'social' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('social')}
              >
                🌐 Social
              </button>
            </div>

            <div className="editor-form">
              {activeTab === 'content' && (
                <div className="form-section">
                  <h3>Content Settings</h3>
                  
                  <div className="form-group">
                    <label>Portfolio Title</label>
                    <input
                      type="text"
                      value={portfolio.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="My Portfolio"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Hero Title (Your Name)</label>
                    <input
                      type="text"
                      value={portfolio.hero_title}
                      onChange={(e) => handleInputChange('hero_title', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Hero Subtitle (Your Role)</label>
                    <input
                      type="text"
                      value={portfolio.hero_subtitle}
                      onChange={(e) => handleInputChange('hero_subtitle', e.target.value)}
                      placeholder="Full Stack Developer"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>About Content</label>
                    <textarea
                      value={portfolio.about_content}
                      onChange={(e) => handleInputChange('about_content', e.target.value)}
                      placeholder="Tell your story here..."
                      rows={6}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="form-section">
                  <h3>Contact Information</h3>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={portfolio.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={portfolio.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="form-section">
                  <h3>Social Media Links</h3>
                  
                  <div className="form-group">
                    <label>LinkedIn Profile</label>
                    <input
                      type="url"
                      value={portfolio.social_linkedin}
                      onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>GitHub Profile</label>
                    <input
                      type="url"
                      value={portfolio.social_github}
                      onChange={(e) => handleInputChange('social_github', e.target.value)}
                      placeholder="https://github.com/yourname"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Twitter Profile</label>
                    <input
                      type="url"
                      value={portfolio.social_twitter}
                      onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                      placeholder="https://twitter.com/yourname"
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="preview-container">
            <div className="preview-frame">
              <h2>Portfolio Preview</h2>
              <div className="preview-content">
                <header className="preview-hero">
                  <h1>{portfolio.hero_title}</h1>
                  <h2>{portfolio.hero_subtitle}</h2>
                </header>
                
                <section className="preview-about">
                  <h3>About</h3>
                  <p>{portfolio.about_content}</p>
                </section>
                
                <section className="preview-contact">
                  <h3>Contact</h3>
                  {portfolio.contact_email && <p>📧 {portfolio.contact_email}</p>}
                  {portfolio.contact_phone && <p>📞 {portfolio.contact_phone}</p>}
                  
                  <div className="preview-social">
                    {portfolio.social_linkedin && <a href={portfolio.social_linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                    {portfolio.social_github && <a href={portfolio.social_github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                    {portfolio.social_twitter && <a href={portfolio.social_twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="editor-footer">
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
        <div className="editor-info">
          <span>Auto-save: Every 30 seconds</span>
          <span>Last saved: Just now</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;