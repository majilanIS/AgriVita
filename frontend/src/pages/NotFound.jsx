import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#666' }}>Page not found</p>
      <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#156633', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
