import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="cta">
      <div className="cta-card">
        <h2>Ready to modernize your harvest?</h2>
        <p>Join thousands of farmers who are already making smarter, data-driven decisions with AgriVita.</p>
        <Link to="/dashboard" className="btn btn-primary">
          Get AgriVita Free
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
