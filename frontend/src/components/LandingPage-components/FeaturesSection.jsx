import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="features" id="features">
      <h2 className="section-title">Advanced Agricultural Intelligence</h2>
      <p className="section-subtitle">
        Empowering farmers with tools that combine decades of agronomic knowledge with state-of-the-art machine learning.
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="m19 19-3.2-3.2"/></svg>
          </div>
          <h3>AI Disease Detection</h3>
          <p>Simply point your camera at any crop. Our neural network identifies 200+ diseases with microscopic precision in under 3 seconds.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </div>
          <h3>Smart Weather Forecast</h3>
          <p>Hyper-local weather data aggregated from multiple satellites and ground stations, tailored specifically for your field's microclimate.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <h3>Farm Analytics</h3>
          <p>Comprehensive dashboards that track soil health, yield predictions, and resource usage to optimize your farm's bottom line.</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
