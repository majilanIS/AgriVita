import React from 'react'
import ScanComp from '../components/ScanComp'

const diseasePrompt = `You are an agricultural plant pathologist AI.
Analyze this crop/plant image for any fungal, bacterial, or viral diseases.
Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "name": "Disease name (e.g. 'Tomato Early Blight', 'Healthy Leaf')",
  import React from 'react';
  import { Link } from 'react-router-dom';

  const DiseaseScan = () => {
    return (
      <div style={{ padding: '32px 36px 48px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a24', marginBottom: '6px' }}>Crop Disease Detection</h1>
            <p style={{ color: '#7a9680', margin: 0 }}>Identify issues instantly with our high-precision AI model.</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/dashboard/scan/disease" style={tabStyle(true)}>Disease</Link>
            <Link to="/dashboard/scan/pest" style={tabStyle(false)}>Pest</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', marginTop: '20px' }}>
          <div>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 6px 18px rgba(16,24,16,0.04)' }}>
              <div style={{ border: '2px dashed #e6efe4', borderRadius: '10px', padding: '28px', textAlign: 'center' }}>
                <img src="https://images.unsplash.com/photo-1524594154902-3f5a5b6c4e0d?auto=format&fit=crop&w=800&q=60" alt="leaf" style={{ width: '100%', maxWidth: '520px', borderRadius: '8px' }} />
                <p style={{ color: '#666', marginTop: '12px' }}>Drag and drop or browse. For best results, ensure the leaf is centered and well-lit.</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '12px' }}>
                  <button style={actionButtonStyle}>Upload Image</button>
                  <button style={secondaryButtonStyle}>Camera Capture</button>
                </div>
              </div>
            </div>
          </div>

          <aside style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '18px', boxShadow: '0 6px 18px rgba(16,24,16,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>Analysis Results</div>
              <div style={{ padding: '6px 10px', borderRadius: '999px', backgroundColor: '#fee2e2', color: '#9b1c1c', fontWeight: 700, fontSize: '12px' }}>HIGH RISK</div>
            </div>

            <div style={{ marginTop: '12px', backgroundColor: '#f6fff6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontWeight: 700 }}>Tomato Early Blight</div>
              <div style={{ height: '8px', backgroundColor: '#e6f4ea', borderRadius: '6px', marginTop: '8px' }}>
                <div style={{ width: '96%', height: '8px', backgroundColor: '#2d6b3e', borderRadius: '6px' }}></div>
              </div>
              <div style={{ marginTop: '8px', color: '#4b5b4b' }}>96% Confidence</div>
            </div>

            <div style={{ marginTop: '14px' }}>
              <button style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#dafff0', border: 'none', color: '#105028', fontWeight: 700 }}>Full Diagnostic Report</button>
              <button style={{ width: '100%', padding: '10px', borderRadius: '8px', marginTop: '8px', border: '1px solid #e6efe4', background: 'white' }}>Save to History</button>
            </div>
          </aside>
        </div>
      </div>
    );
  };

  const actionButtonStyle = {
    backgroundColor: '#156633',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  };

  const secondaryButtonStyle = {
    backgroundColor: 'white',
    color: '#156633',
    border: '2px solid #156633',
    padding: '12px 24px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
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

  export default DiseaseScan;
