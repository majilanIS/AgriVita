import React from 'react';
import { Link } from 'react-router-dom';

const Weather = () => {
  return (
    <div style={{ padding: '32px 36px 48px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a24', marginBottom: '6px' }}>Local Weather</h1>
          <p style={{ color: '#7a9680', margin: 0 }}>Current field conditions and short-term forecasts.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/dashboard/scan/disease" style={tabStyle(false)}>Disease</Link>
          <Link to="/dashboard/scan/pest" style={tabStyle(false)}>Pest</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', marginTop: '20px' }}>
        <div>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 6px 18px rgba(16,24,16,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '92px', height: '92px', borderRadius: '12px', backgroundColor: '#f1f9f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#156633', fontWeight: 700 }}>
                24°C
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>Light Rain</div>
                <div style={{ color: '#6b7c6b' }}>Wind 8 km/h • Humidity 84%</div>
              </div>
            </div>

            <div style={{ marginTop: '18px', display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, background: '#f7fff7', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700 }}>Next 2 hours</div>
                <div style={{ color: '#6b7c6b' }}>Light rain expected</div>
              </div>
              <div style={{ width: '220px', background: '#fff9f0', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700 }}>Risk</div>
                <div style={{ color: '#6b7c6b' }}>High humidity — disease risk up</div>
              </div>
            </div>
          </div>
        </div>

        <aside style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 6px 18px rgba(16,24,16,0.04)' }}>
          <div style={{ fontWeight: 700, marginBottom: '8px' }}>Local Conditions</div>
          <div style={{ fontSize: '14px', color: '#6b7c6b' }}>High Humidity (84%) — ideal conditions for blight propagation.</div>
          <div style={{ marginTop: '12px' }}>
            <button style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#e8f5e2', border: 'none', color: '#105028', fontWeight: 700 }}>View Forecast</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

function tabStyle(active) {
  return {
    padding: '8px 14px',
    borderRadius: '8px',
    textDecoration: 'none',
    backgroundColor: active ? '#e8f5e2' : 'transparent',
    color: active ? '#2d6b3e' : '#4b5b4b',
    fontWeight: active ? 700 : 600,
    border: '1px solid transparent'
  };
}

export default Weather;
