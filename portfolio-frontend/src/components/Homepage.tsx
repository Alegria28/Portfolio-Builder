import React from 'react';
import { Link } from 'react-router-dom';

const Homepage: React.FC = () => {
  return (
    <div className="homepage">
      <section className="hero-section">
        <h1 className="hero-title">Portfolio Builder</h1>
        <p className="hero-subtitle">
          Create stunning portfolios with ease. Showcase your work, skills, and achievements 
          with our powerful and intuitive platform powered by React and Django.
        </p>
        
        <div className="cta-buttons">
          <Link to="/dashboard" className="cta-button cta-primary">
            Get Started Free
          </Link>
          <Link to="/pricing" className="cta-button cta-secondary">
            View Pricing
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🚀</div>
          <h3 className="feature-title">Lightning Fast</h3>
          <p className="feature-description">
            Built with React and Django for optimal performance. 
            Your portfolio loads instantly and works seamlessly.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎨</div>
          <h3 className="feature-title">Beautiful Designs</h3>
          <p className="feature-description">
            Choose from professionally designed templates or create 
            your own unique style with our customization tools.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3 className="feature-title">Mobile Responsive</h3>
          <p className="feature-description">
            Your portfolio looks perfect on all devices. 
            Mobile-first design ensures great user experience everywhere.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💾</div>
          <h3 className="feature-title">Secure Database</h3>
          <p className="feature-description">
            Your data is safely stored with SQLite database. 
            Reliable, fast, and always available when you need it.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Real-time Updates</h3>
          <p className="feature-description">
            Changes appear instantly. Edit your portfolio and see 
            updates in real-time without any delays.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🔧</div>
          <h3 className="feature-title">Easy to Use</h3>
          <p className="feature-description">
            No coding required. Intuitive interface makes it simple 
            to create and manage your professional portfolio.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Homepage;