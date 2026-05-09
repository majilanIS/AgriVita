import React from 'react';

const StatsSection = () => {
  return (
    <section className="stats container" id="stats">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">95%</div>
          <div className="stat-label">Detection Accuracy</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">10K+</div>
          <div className="stat-label">Active Farmers</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">Real-time</div>
          <div className="stat-label">Field Monitoring</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">AI</div>
          <div className="stat-label">Recommendations</div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
