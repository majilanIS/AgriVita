import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  const stats = [
    {
      value: "95%",
      label: "Disease Detection Accuracy",
      icon: "🎯"
    },
    {
      value: "10K+",
      label: "Active Farming Families",
      icon: "👨‍🌾"
    },
    {
      value: "15 Cr",
      label: "Total ROI Generated",
      icon: "💰"
    },
    {
      value: "48hrs",
      label: "Average Pest Response Time",
      icon: "⚡"
    }
  ];

  return (
    <section className="stats container" id="stats">
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            className="stat-item"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
