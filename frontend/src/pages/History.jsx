import React, { useState, useEffect } from 'react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('scanHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your scan history?')) {
      localStorage.removeItem('scanHistory');
      setHistory([]);
    }
  };

  const deleteItem = (id) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('scanHistory', JSON.stringify(updated));
    if (expandedId === id) setExpandedId(null);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getFallbackImage = () => null;

  return (
    <div style={{ padding: '36px 40px 60px', fontFamily: "'DM Sans', sans-serif", backgroundColor: '#f2f6ed', minHeight: '100%', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e3a24', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            Scan History
          </h1>
          <p style={{ color: '#6b7c6b', margin: 0, fontSize: '15px' }}>
            View your past plant analyses and saved field logs.
          </p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ffebee',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              color: '#c62828',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '60px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          color: '#8faa8b'
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d0dfcb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#6b7c6b', marginBottom: '8px' }}>No History Found</div>
          <p style={{ margin: 0, fontSize: '14px', textAlign: 'center', maxWidth: '300px' }}>Your saved scan results will appear here. Head over to the Scanner to analyze your first crop.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {history.map((item) => {
            const isDisease = (item.type || '').toLowerCase() === 'disease';
            const badgeBg = isDisease ? '#ffebee' : '#fff8e1';
            const badgeColor = isDisease ? '#c62828' : '#f57f17';
            const isExpanded = expandedId === item.id;
            const imageUrl = item.image || null;

            return (
              <div key={item.id} style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: isExpanded ? '0 8px 30px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ height: '180px', width: '100%', overflow: 'hidden', backgroundColor: '#f2f6ed', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={item.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#b0c8ae' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c8dfc8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="3"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span style={{ fontSize: '11px', fontWeight: 600 }}>No image saved</span>
                    </div>
                  )}
                  {/* Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: badgeBg,
                    color: badgeColor,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {item.type || 'Unknown'}
                  </div>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    title="Delete this entry"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                      transition: 'all 0.2s ease',
                      color: '#c62828'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffebee';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.92)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
                
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#8faa8b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {formatDate(item.timestamp)}
                  </div>
                  
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800, color: '#1e3a24', lineHeight: 1.3 }}>
                    {item.title}
                  </h3>
                  
                  {isExpanded && (
                    <div style={{ marginTop: '4px', marginBottom: '20px', animation: 'fadeIn 0.3s ease-out' }}>
                      <style>{`
                        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
                      `}</style>
                      
                      {item.description && (
                        <div style={{ marginBottom: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#6b7c6b', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Description</div>
                          <p style={{ margin: 0, fontSize: '13.5px', color: '#4b5b4b', lineHeight: 1.5 }}>
                            {item.description}
                          </p>
                        </div>
                      )}
                      
                      {item.solution && (
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#156633', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>Solution</div>
                          <div style={{ 
                            backgroundColor: '#eaf4e5', 
                            padding: '12px', 
                            borderRadius: '10px',
                            borderLeft: '4px solid #156633'
                          }}>
                            <p style={{ margin: 0, fontSize: '13.5px', color: '#156633', lineHeight: 1.5, fontWeight: 500 }}>
                              {item.solution}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: 'auto' }}>
                    <button 
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      style={{
                        width: '100%',
                        backgroundColor: isExpanded ? '#f2f6ed' : 'transparent',
                        color: '#156633',
                        border: '1px solid #d0dfcb',
                        padding: '10px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                      <svg 
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
