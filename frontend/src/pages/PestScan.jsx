import React from 'react'
import ScanComp from '../components/ScanComp'

const pestPrompt = `You are an agricultural entomologist AI.
Analyze this crop/plant image for any insect pests, larvae, eggs, or pest damage.
Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "name": "Pest name (e.g. 'Aphid Infestation', 'Whitefly', 'Healthy — No Pests')",
  import React from 'react';
  import { Link } from 'react-router-dom';

  const PestScan = () => {
    return (
      <div style={{ padding: '32px 36px 48px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a24', marginBottom: '6px' }}>Pest Detection</h1>
            <p style={{ color: '#7a9680', margin: 0 }}>Identify pests on your crops using advanced AI detection.</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/dashboard/scan/disease" style={tabStyle(false)}>Disease</Link>
            <Link to="/dashboard/scan/pest" style={tabStyle(true)}>Pest</Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', marginTop: '20px' }}>
          <div>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 6px 18px rgba(16,24,16,0.04)' }}>
              <div style={{ border: '2px dashed #e6efe4', borderRadius: '10px', padding: '28px', textAlign: 'center' }}>
                <img src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60" alt="pest" style={{ width: '100%', maxWidth: '520px', borderRadius: '8px' }} />
                <p style={{ color: '#666', marginTop: '12px' }}>Drag and drop or browse. For best results, ensure the subject is centered and well-lit.</p>
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
              <div style={{ padding: '6px 10px', borderRadius: '999px', backgroundColor: '#fef9e7', color: '#8a6b00', fontWeight: 700, fontSize: '12px' }}>MEDIUM</div>
            </div>

            <div style={{ marginTop: '12px', backgroundColor: '#fffaf6', padding: '12px', borderRadius: '8px' }}>
              <div style={{ fontWeight: 700 }}>Aphid Infestation</div>
              <div style={{ height: '8px', backgroundColor: '#fff3d9', borderRadius: '6px', marginTop: '8px' }}>
                <div style={{ width: '64%', height: '8px', backgroundColor: '#b26b00', borderRadius: '6px' }}></div>
              </div>
              <div style={{ marginTop: '8px', color: '#4b5b4b' }}>64% Confidence</div>
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

  export default PestScan;
