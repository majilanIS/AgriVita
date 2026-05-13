import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.footer 
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.div className="footer-logo" variants={itemVariants}>
        🌾 AgriVita
      </motion.div>
      
      <motion.div className="footer-links" variants={itemVariants}>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
      </motion.div>

      <motion.div className="footer-socials" variants={itemVariants}>
        <a href="#twitter" title="Twitter" aria-label="Twitter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 10.42.2 13-4.72a17.9 17.9 0 001-4c0-.27-.05-.54-.15-.8a12.986 12.986 0 002-3.658z"/>
          </svg>
        </a>
        <a href="#facebook" title="Facebook" aria-label="Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z"/>
          </svg>
        </a>
        <a href="#instagram" title="Instagram" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37Z"/>
            <circle cx="17.5" cy="6.5" r="1.5"/>
          </svg>
        </a>
        <a href="#linkedin" title="LinkedIn" aria-label="LinkedIn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
      </motion.div>

      <motion.div className="footer-copyright" variants={itemVariants}>
        © {currentYear} AgriVita. All rights reserved. Empowering farmers through technology.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
