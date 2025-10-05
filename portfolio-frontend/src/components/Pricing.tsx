import React from 'react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "Forever",
      features: [
        "Up to 3 projects",
        "Basic templates",
        "SQLite database",
        "Community support",
        "Mobile responsive"
      ],
      buttonText: "Get Started",
      featured: false
    },
    {
      name: "Professional",
      price: "$9",
      period: "per month",
      features: [
        "Unlimited projects",
        "Premium templates",
        "Custom domains",
        "Analytics dashboard",
        "Priority support",
        "Advanced customization",
        "Export options"
      ],
      buttonText: "Choose Professional",
      featured: true
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "per month",
      features: [
        "Everything in Professional",
        "Team collaboration",
        "White-label solution",
        "API access",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee"
      ],
      buttonText: "Contact Sales",
      featured: false
    }
  ];

  return (
    <div className="pricing">
      <div className="pricing-header">
        <h2 className="pricing-title">Choose Your Plan</h2>
        <p className="pricing-subtitle">
          Start free and upgrade as you grow. All plans include our core features.
        </p>
      </div>

      <div className="pricing-cards">
        {plans.map((plan, index) => (
          <div key={index} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
            <h3 className="pricing-plan">{plan.name}</h3>
            <div className="pricing-price">{plan.price}</div>
            <div className="pricing-period">{plan.period}</div>
            
            <ul className="pricing-features">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex}>✅ {feature}</li>
              ))}
            </ul>
            
            <button className="pricing-button">
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className="pricing-faq">
        <h3>Frequently Asked Questions</h3>
        
        <div className="faq-item">
          <h4>🤔 Can I change my plan anytime?</h4>
          <p>Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
        </div>

        <div className="faq-item">
          <h4>💳 What payment methods do you accept?</h4>
          <p>We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
        </div>

        <div className="faq-item">
          <h4>🔒 Is my data secure?</h4>
          <p>Absolutely! We use enterprise-grade security with SQLite database and encrypted connections.</p>
        </div>

        <div className="faq-item">
          <h4>🚀 Do you offer a free trial?</h4>
          <p>Our Starter plan is free forever! Upgrade anytime to unlock premium features.</p>
        </div>
      </div>

      <div className="pricing-contact">
        <h3>Need a Custom Solution?</h3>
        <p>Contact our sales team for enterprise pricing and custom features.</p>
        <button className="cta-button cta-primary">Contact Sales</button>
      </div>
    </div>
  );
};

export default Pricing;