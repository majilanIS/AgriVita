import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const contentVariants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const visualVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  return (
    <section className="hero hero-animated">
      <motion.div className="hero-content" initial="hidden" animate="show" variants={contentVariants}>
        <div className="hero-badge">🌾 AI-Powered Farming Intelligence</div>
        <h1 className="hero-title">
          Grow Smarter, <br />Harvest Better <span>With AgriVita</span>
        </h1>
        <p className="hero-desc">
          Detect diseases in seconds, identify pests, calculate profits instantly, and get expert fertilizer recommendations. Your complete farming companion powered by advanced AI.
        </p>
        <div className="hero-buttons">
          <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Link to="/auth?mode=register" className="btn btn-primary">
              Start Free Trial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </motion.div>

          {/* <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}>
            <Link to="/dashboard" className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Explore Dashboard
            </Link>
          </motion.div> */}
        </div>
        
        <div className="hero-highlights">
          <div className="highlight-item">
            <span className="highlight-icon">✓</span>
            <span>95% Disease Detection Accuracy</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">✓</span>
            <span>Real-time Pest Identification</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">✓</span>
            <span>Instant Profit Analysis</span>
          </div>
        </div>
      </motion.div>

      <motion.div className="hero-visuals" initial="hidden" animate="show" variants={visualVariants}>
        <div className="hero-overlay" aria-hidden="true" />
        <motion.img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Smart Farming Field" 
          className="hero-main-img" 
          whileHover={{ scale: 1.03 }}
        />

        <motion.div className="hero-card-scan" animate={{ y: [-6, 0, -6] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
          <div style={{ color: '#156633' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: '#6b7280' }}>DISEASE SCAN</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Potato Blight Detected</div>
          </div>
        </motion.div>

        <motion.div className="hero-card-weather" animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
          <svg style={{ color: '#156633' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#156633', marginBottom: '0.25rem' }}>24°C</div>
          <div style={{ fontSize: '0.875rem', color: '#105028' }}>Optimal for planting</div>
        </motion.div>

        <motion.div className="hero-card-profit" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: '#6b7280' }}>PROFIT ESTIMATE</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#059669', marginBottom: '0.25rem' }}>+35% ROI</div>
          <div style={{ fontSize: '0.75rem', color: '#047857' }}>Better yields ahead</div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
