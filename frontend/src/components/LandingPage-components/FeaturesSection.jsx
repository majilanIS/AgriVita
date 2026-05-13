import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
          <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
          <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
          <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="m19 19-3.2-3.2"/>
        </svg>
      ),
      title: "🌿 Disease Detection",
      desc: "Identify crop diseases in real-time using advanced AI. Scan leaf images to detect 200+ plant diseases with 95% accuracy.",
      link: "/dashboard/scan/disease",
      color: "#059669"
    },
    {
      id: 2,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 12h8M12 8v8"/>
          <path d="M9 15a3 3 0 1 0 6 0"/>
        </svg>
      ),
      title: "🐛 Pest Detection",
      desc: "Detect harmful insects and pests threatening your crops. Get instant recommendations for organic and chemical treatments.",
      link: "/dashboard/scan/pest",
      color: "#d97706"
    },
    {
      id: 3,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      title: "💰 Profit Calculator",
      desc: "Calculate your farm's potential ROI. Track expenses, estimate yields, and maximize profitability with data-driven insights.",
      link: "/dashboard/profit",
      color: "#059669"
    },
    {
      id: 4,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12h18M3 6h18M3 18h18"/>
          <path d="M7 12v6h10v-6"/>
          <path d="M7 6v0"/>
        </svg>
      ),
      title: "🌾 Fertilizer Expert",
      desc: "Get personalized fertilizer recommendations based on soil analysis. Optimize nutrient levels for maximum crop health.",
      link: "/dashboard",
      color: "#8b5cf6"
    }
  ];

  return (
    <section className="features" id="features">
      <h2 className="section-title">Complete Farming Solution</h2>
      <p className="section-subtitle">
        Everything you need to grow better crops, reduce losses, and increase profits. AgriVita combines AI detection, profit analysis, and expert guidance.
      </p>

      <div className="features-grid">
        {features.map((feature, idx) => (
          <motion.div 
            key={feature.id}
            className="feature-card" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, boxShadow: `0 20px 35px -5px rgba(0, 0, 0, 0.1)` }}
          >
            <div className="feature-icon" style={{ color: feature.color, borderColor: feature.color }}>
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
            <Link to={feature.link} className="feature-link">
              Explore →
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
