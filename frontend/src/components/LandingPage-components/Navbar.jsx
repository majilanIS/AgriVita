import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        AgriVita
      </div>
      <div className="navbar-links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How It Works</a>
        <a href="#stats">Stats</a>
      </div>
      <Link to="/dashboard" className="btn btn-primary">
        Get Started
      </Link>
    </nav>
  );
};

export default Navbar;
