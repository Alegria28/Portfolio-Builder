import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface Template {
  id: number;
  name: string;
  description: string;
  template_type: string;
  is_premium: boolean;
  preview_image: string;
}

const TemplateGallery: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [creating, setCreating] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchTemplates();
  }, [isAuthenticated, navigate]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const templatesData = await apiService.getTemplates();
      setTemplates(templatesData);
    } catch (err) {
      setError('Failed to load templates');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async () => {
    if (!selectedTemplate || !portfolioTitle.trim()) {
      alert('Please select a template and enter a portfolio title');
      return;
    }

    setCreating(true);
    try {
      const portfolioData = {
        template: selectedTemplate.id,
        title: portfolioTitle,
        hero_title: 'Your Name',
        hero_subtitle: 'Your Professional Title',
        about_content: 'Tell your story here...'
      };

      const newPortfolio = await apiService.createPortfolio(portfolioData);
      navigate(`/editor/${newPortfolio.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create portfolio');
    } finally {
      setCreating(false);
    }
  };

  const getTemplatePreview = (template: Template) => {
    // Return placeholder preview images based on template type
    const previews: { [key: string]: string } = {
      minimal: '🎯',
      professional: '💼', 
      creative: '🎨',
      developer: '💻',
      designer: '🖌️',
      business: '📊'
    };
    return previews[template.template_type] || '📄';
  };

  if (loading) {
    return (
      <div className="template-gallery">
        <div className="loading">
          <h2>Loading Templates...</h2>
          <p>Finding the perfect templates for you</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="template-gallery">
        <div className="error-state">
          <h2>⚠️ Error Loading Templates</h2>
          <p>{error}</p>
          <button onClick={fetchTemplates} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="template-gallery">
      <div className="gallery-header">
        <h1>Choose Your Portfolio Template</h1>
        <p>Select a template that matches your style and profession</p>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="template-preview">
              <div className="preview-icon">
                {getTemplatePreview(template)}
              </div>
              {template.is_premium && (
                <div className="premium-badge">⭐ Premium</div>
              )}
            </div>
            
            <div className="template-info">
              <h3>{template.name}</h3>
              <p className="template-type">{template.template_type}</p>
              <p className="template-description">{template.description}</p>
            </div>
            
            <div className="template-actions">
              <button className="select-btn">
                {selectedTemplate?.id === template.id ? '✅ Selected' : '📋 Select'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="create-portfolio-section">
          <div className="create-form">
            <h3>🚀 Create Your Portfolio</h3>
            <p>Selected: <strong>{selectedTemplate.name}</strong></p>
            
            <div className="form-group">
              <label htmlFor="portfolioTitle">Portfolio Title</label>
              <input
                type="text"
                id="portfolioTitle"
                value={portfolioTitle}
                onChange={(e) => setPortfolioTitle(e.target.value)}
                placeholder="My Awesome Portfolio"
                className="portfolio-title-input"
              />
            </div>
            
            <div className="create-actions">
              <button 
                onClick={handleCreatePortfolio}
                disabled={creating || !portfolioTitle.trim()}
                className="create-button"
              >
                {creating ? '⏳ Creating...' : '✨ Create Portfolio'}
              </button>
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="gallery-footer">
        <div className="template-stats">
          <div className="stat">
            <strong>{templates.filter(t => !t.is_premium).length}</strong>
            <span>Free Templates</span>
          </div>
          <div className="stat">
            <strong>{templates.filter(t => t.is_premium).length}</strong>
            <span>Premium Templates</span>
          </div>
          <div className="stat">
            <strong>{new Set(templates.map(t => t.template_type)).size}</strong>
            <span>Categories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;