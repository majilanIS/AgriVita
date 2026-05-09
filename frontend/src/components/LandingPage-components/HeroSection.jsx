import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-badge">AI-Driven Precision</div>
        <h1 className="hero-title">
          Smart Farming <br />Powered by <span>AI</span>
        </h1>
        <p className="hero-desc">
          Detect crop diseases instantly, monitor weather conditions, and improve farming decisions with AgriVita's modern-organic precision platform.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary">
            Get Started 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button className="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Scan Crop
          </button>
        </div>
      </div>
      <div className="hero-visuals">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Smart Farming Field" 
          className="hero-main-img" 
        />
        
        <div className="hero-card-scan">
          <div style={{ color: '#156633' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: '#6b7280' }}>DISEASE SCAN</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Potato Blight Detected</div>
          </div>
        </div>

        <div className="hero-card-weather">
          <svg style={{ color: '#156633' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#156633', marginBottom: '0.25rem' }}>24°C</div>
          <div style={{ fontSize: '0.875rem', color: '#105028' }}>Light rain in 2 hours</div>
        </div>

        <div className="hero-card-stats">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
