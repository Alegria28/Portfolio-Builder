import React from 'react';
import { Link } from 'react-router-dom';

const Homepage: React.FC = () => {
  return (
    <div className="homepage">
      <section className="hero-section">
        <h1 className="hero-title">Build a Professional Portfolio</h1>
        <p className="hero-subtitle">
          Present your work with credibility. Create, customize, and publish a polished portfolio using a fast, modern stack.
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
          <h3 className="feature-title">Performance</h3>
          <p className="feature-description">
            Built with React and Django for optimal performance. Your site loads quickly and works seamlessly.
          </p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Design Quality</h3>
          <p className="feature-description">
            Choose from professionally designed templates or create your own style with flexible customization.
          </p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Responsive</h3>
          <p className="feature-description">
            Your portfolio adapts to every device with a mobile‑first design.
          </p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Data Integrity</h3>
          <p className="feature-description">
            Your data is safely stored and always available when you need it.
          </p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Real‑time Editing</h3>
          <p className="feature-description">
            Edit your portfolio and see updates immediately—no delays.
          </p>
        </div>

        <div className="feature-card">
          <h3 className="feature-title">Ease of Use</h3>
          <p className="feature-description">
            No coding required. An intuitive interface makes it simple to create and manage your site.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Homepage;