import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="cta">
      <motion.div 
        className="cta-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="cta-badge">🚀 Limited Time Offer</div>
        <h2>Transform Your Farm Today</h2>
        <p>Join thousands of progressive farmers using AgriVita to detect diseases faster, reduce pest damage, and maximize profits. Start your free trial now!</p>
        
        <div className="cta-features">
          <div className="cta-feature-item">
            <span className="cta-check">✓</span>
            <span>No credit card required</span>
          </div>
          <div className="cta-feature-item">
            <span className="cta-check">✓</span>
            <span>Free 30-day trial</span>
          </div>
          <div className="cta-feature-item">
            <span className="cta-check">✓</span>
            <span>24/7 Farmer Support</span>
          </div>
        </div>

        <div className="cta-buttons">
          <Link to="/auth?mode=register" className="btn btn-primary btn-lg">
            Start Free Trial
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link to="/dashboard" className="btn btn-secondary btn-lg">
            Explore Features
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
