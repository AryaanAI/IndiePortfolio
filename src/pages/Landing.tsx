import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Image, Zap, Shield, Users, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAdmin } from '../context/AdminContext';
import './Landing.css';

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { plans } = useAdmin();

  const activePlans = plans.filter(plan => plan.isActive && plan.billingPeriod === 'monthly');

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <Link to="/" className="landing-logo">
            <Palette size={32} />
            <span>CreativePort</span>
          </Link>
          
          <nav className="landing-nav">
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>
            
            <div className="auth-buttons">
              <Link to="/auth/signin" className="btn-outline">
                Sign In
              </Link>
              <Link to="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <h1 className="hero-title">
            Showcase Your Creative Work Like Never Before
          </h1>
          <p className="hero-subtitle">
            Build stunning portfolios, manage projects, and grow your creative business with our all-in-one platform designed for artists, designers, and creative professionals.
          </p>
          
          <div className="hero-cta">
            <Link to="/auth/signup" className="btn-primary btn-large">
              Start Creating Free
              <ArrowRight size={20} style={{ marginLeft: '8px' }} />
            </Link>
            <Link to="#features" className="btn-outline btn-large">
              Learn More
            </Link>
          </div>
          
          <div className="hero-image">
            <img 
              src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Creative workspace with design tools and artwork"
            />
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="features-container">
            <h2 className="section-title">Everything You Need to Succeed</h2>
            <p className="section-subtitle">
              Powerful tools and features designed to help creative professionals showcase their work and grow their business.
            </p>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <Image size={32} />
                </div>
                <h3>Portfolio Management</h3>
                <p>Create stunning portfolios with drag-and-drop simplicity. Organize your work by categories, add descriptions, and showcase your best pieces.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Zap size={32} />
                </div>
                <h3>AI-Powered Tools</h3>
                <p>Leverage machine learning for face swapping, image enhancement, and automated tagging to streamline your creative workflow.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Users size={32} />
                </div>
                <h3>Client Collaboration</h3>
                <p>Share projects with clients, collect feedback, and manage revisions all in one place. Keep everyone on the same page.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Shield size={32} />
                </div>
                <h3>Secure & Reliable</h3>
                <p>Your work is protected with enterprise-grade security. Automatic backups ensure your portfolio is always safe.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Sparkles size={32} />
                </div>
                <h3>Professional Templates</h3>
                <p>Choose from beautiful, responsive templates designed specifically for creative professionals. Customize to match your brand.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Palette size={32} />
                </div>
                <h3>Creative Freedom</h3>
                <p>Full customization control with advanced styling options. Make your portfolio truly unique and reflect your creative vision.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing-section">
          <div className="pricing-container">
            <h2 className="section-title">Choose Your Plan</h2>
            <p className="section-subtitle">
              Select the perfect plan for your creative journey
            </p>
            
            <div className="pricing-grid">
              {activePlans.map(plan => (
                <div key={plan.id} className={`pricing-card ${plan.name === 'Pro' ? 'featured' : ''}`}>
                  {plan.name === 'Pro' && (
                    <div className="featured-badge">
                      <Zap size={16} />
                      Most Popular
                    </div>
                  )}
                  
                  <div className="plan-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <div className="plan-pricing">
                    <span className="plan-price">${plan.price}</span>
                    <span className="plan-period">/{plan.billingPeriod}</span>
                  </div>

                  <div className="plan-features">
                    <div className="feature-item">
                      <Check size={16} className="feature-icon" />
                      <span>
                        {plan.features.maxPublishedItems === -1 
                          ? 'Unlimited' 
                          : plan.features.maxPublishedItems} Published Items
                      </span>
                    </div>
                    
                    <div className="feature-item">
                      <Check size={16} className="feature-icon" />
                      <span>Portfolio Management</span>
                    </div>
                    
                    {plan.features.todoboardEnabled && (
                      <div className="feature-item">
                        <Check size={16} className="feature-icon" />
                        <span>Todo Board</span>
                      </div>
                    )}
                    
                    {plan.features.faceswapEnabled && (
                      <div className="feature-item">
                        <Check size={16} className="feature-icon" />
                        <span>AI Faceswap</span>
                      </div>
                    )}
                    
                    {plan.features.customDomain && (
                      <div className="feature-item">
                        <Check size={16} className="feature-icon" />
                        <span>Custom Domain</span>
                      </div>
                    )}
                    
                    {plan.features.prioritySupport && (
                      <div className="feature-item">
                        <Check size={16} className="feature-icon" />
                        <span>Priority Support</span>
                      </div>
                    )}
                  </div>

                  <div className="plan-action">
                    <Link to="/auth/signup" className={`plan-button ${plan.name === 'Pro' ? 'primary' : 'secondary'}`}>
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pricing-cta">
              <Link to="/pricing" className="btn-outline">
                View All Plans & Features
              </Link>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-container">
            <h2 className="cta-title">Ready to Elevate Your Creative Work?</h2>
            <p className="cta-subtitle">
              Join thousands of creative professionals who trust CreativePort to showcase their work and grow their business.
            </p>
            <Link to="/auth/signup" className="btn-white">
              Start Your Free Trial
            </Link>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#privacy" className="footer-link">Privacy Policy</a>
            <a href="#terms" className="footer-link">Terms of Service</a>
            <a href="#support" className="footer-link">Support</a>
            <a href="#blog" className="footer-link">Blog</a>
          </div>
          <p>&copy; 2024 CreativePort. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;