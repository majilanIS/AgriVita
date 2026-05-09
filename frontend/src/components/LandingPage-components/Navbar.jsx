import React from 'react';

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
      <button className="btn btn-primary">
        Get Started
      </button>
    </nav>
  );
};

export default Navbar;
