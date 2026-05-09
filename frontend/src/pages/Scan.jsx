import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SCAN_DATA = {
  disease: {
    title: "Crop Disease Detection",
    subtitle: "Identify issues instantly with our high-precision AI model.",
    image: "https://images.unsplash.com/photo-1587824855909-086c52a0a2eb?w=600&q=80",
    resultTitle: "Tomato Early Blight",
    riskBadge: "HIGH RISK",
    riskColor: "#ffffff",
    riskBg: "#c0392b",
    confidence: 96,
    recommendations: [
      "Apply fungicide immediately to stop the spread.",
      "Avoid overwatering and improve air circulation.",
      "Prune infected lower leaves to prevent spore splash."
    ],
    expertTip: "For diseases, focus the camera on spots, lesions, and the leaf underside.",
    localCondTitle: "Humid Evenings",
    localCondDesc: "High humidity increases fungal spore viability.",
    localCondBg: "#8fbf56"
  },
  pest: {
    title: "Pest Detection",
    subtitle: "Detect common pests quickly and get treatment suggestions.",
    image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=600&q=80",
    resultTitle: "Fall Armyworm",
    riskBadge: "MEDIUM RISK",
    riskColor: "#ffffff",
    riskBg: "#e5a32a",
    confidence: 82,
    recommendations: [
      "Deploy pheromone traps to monitor adult moth activity.",
      "Apply targeted bio-pesticides (Bt) during early instar stages.",
      "Clear surrounding weed hosts to reduce alternative breeding sites."
    ],
    expertTip: "For pests, capture images of larvae or leaf damage near the whorl.",
    localCondTitle: "Warm Nights (68°F)",
    localCondDesc: "Accelerates pest life cycle and feeding rates.",
    localCondBg: "#b55a2a"
  }
};

const Scan = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  
  // Default to disease if invalid type
  const activeType = (type === 'pest' || type === 'disease') ? type : 'disease';
  const data = SCAN_DATA[activeType];

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(data.image);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (type !== 'disease' && type !== 'pest') {
      navigate('/dashboard/scan/disease', { replace: true });
    }
  }, [type, navigate]);

  useEffect(() => {
    // when active type changes, clear previous result but keep preview
    setResult(null);
  }, [activeType]);

  useEffect(() => {
    // cleanup preview URL when file changes or component unmounts
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    runAnalysis(f);
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(f);
  };

  const onDragOver = (e) => e.preventDefault();

  const triggerFile = (capture = false) => {
    if (!fileInputRef.current) return;
    if (capture) fileInputRef.current.setAttribute('capture', 'environment');
    else fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.click();
  };

  const runAnalysis = (f) => {
    // simulate upload + analysis
    setAnalyzing(true);
    setResult(null);
    // fake processing time
    setTimeout(() => {
      const confidence = Math.min(98, Math.floor(70 + Math.random() * 30));
      setResult({
        title: data.resultTitle,
        confidence,
        recommendations: data.recommendations,
        riskBadge: data.riskBadge
      });
      setAnalyzing(false);
    }, 1400);
  };

  const saveToHistory = () => {
    const entry = {
      id: Date.now(),
      type: activeType,
      title: result ? result.title : data.resultTitle,
      confidence: result ? result.confidence : null,
      image: preview,
      timestamp: new Date().toISOString(),
    };
    const raw = localStorage.getItem('scanHistory');
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(entry);
    localStorage.setItem('scanHistory', JSON.stringify(arr.slice(0, 50)));
    alert('Saved to history');
  };

  return (
    <div style={{ padding: '36px 40px 60px', fontFamily: "'DM Sans', sans-serif", backgroundColor: '#f2f6ed', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e3a24', margin: '0 0 8px 0', letterSpacing: '-0.5px' }}>
            {data.title}
          </h1>
          <p style={{ color: '#6b7c6b', margin: 0, fontSize: '15px' }}>
            {data.subtitle}
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#e4eadf',
          padding: '8px 16px',
          borderRadius: '8px',
          color: '#1e3a24',
          fontWeight: 700,
          fontSize: '13px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6b3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
          AI Status: Ready
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Left Card: Upload */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#1e3a24', fontSize: '16px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload Crop Image
            </div>
            <span style={{ backgroundColor: '#cbe7d3', color: '#2d6b3e', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
              Supports JPG, PNG
            </span>
          </div>

          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            style={{
              border: '2px dashed #e4eedd',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              cursor: 'pointer'
            }}
            onClick={() => triggerFile(false)}
          >
              <div style={{
                width: '100%',
                height: '320px',
                backgroundColor: '#f6f7f4',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img src={preview} alt="Crop scan" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: file ? 1 : 0.95 }} />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#156633',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}>
                  {analyzing ? 'AI SCANNING...' : 'READY'}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: '#1e3a24', fontSize: '15px', marginBottom: '4px' }}>Drag and drop or browse</div>
                <div style={{ color: '#6b7c6b', fontSize: '13px', lineHeight: 1.5, maxWidth: '250px' }}>
                  For best results, ensure the leaf is centered and well-lit.
                </div>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
            </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => triggerFile(false)} style={{
              backgroundColor: '#156633',
              color: 'white',
              border: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload Image
            </button>
            <button type="button" onClick={() => triggerFile(true)} style={{
              backgroundColor: '#e4eadf',
              color: '#1e3a24',
              border: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
              Camera Capture
            </button>
          </div>
        </div>

        {/* Right Card: Results */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e3a24' }}>Analysis Results</h2>
            <span style={{ backgroundColor: data.riskBg, color: data.riskColor, padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
              {data.riskBadge}
            </span>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7c6b', marginBottom: '8px' }}>Detected {activeType === 'pest' ? 'Pest' : 'Disease'}</div>
            <div style={{ backgroundColor: '#f2f6ed', borderRadius: '12px', padding: '16px 20px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e3a24', marginBottom: '12px' }}>
                {data.resultTitle}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#d0dfcb', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${data.confidence}%`, height: '100%', backgroundColor: '#156633', borderRadius: '4px' }}></div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#156633' }}>{data.confidence}% Confidence</div>
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7c6b', marginBottom: '12px' }}>AI Recommendation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {data.recommendations.map((rec, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 16px', border: '1px solid #f0f5ed', borderRadius: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? "#c0392b" : "#156633"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span style={{ fontSize: '14px', color: '#4b5b4b', lineHeight: 1.5 }}>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '28px' }}>
            <button style={{
              backgroundColor: '#95f2a1',
              color: '#156633',
              border: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Full Diagnostic Report
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#4b5b4b',
              border: '1px solid #d0dfcb',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              Save to History
            </button>
          </div>
        </div>

      </div>

      {/* ── Bottom Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Expert Tip */}
        <div style={{
          backgroundColor: '#eaf4e5',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          <div style={{ backgroundColor: '#156633', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path>
              <path d="M12 2v1"></path>
              <path d="M12 7v1"></path>
              <path d="M19 12h1"></path>
              <path d="M4 12H3"></path>
              <path d="M17.65 17.65l.71.71"></path>
              <path d="M5.64 5.64l.71.71"></path>
              <path d="M17.65 5.64l-.71.71"></path>
              <path d="M5.64 17.65l.71-.71"></path>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#156633', fontSize: '12px', marginBottom: '4px' }}>Expert Tip</div>
            <div style={{ color: '#4b5b4b', fontSize: '13px', lineHeight: 1.5 }}>
              {data.expertTip}
            </div>
          </div>
        </div>

        {/* Local Conditions */}
        <div style={{
          backgroundColor: data.localCondBg,
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', opacity: 0.8, marginBottom: '6px' }}>Local Conditions</div>
            <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>{data.localCondTitle}</div>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>{data.localCondDesc}</div>
          </div>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
        </div>

      </div>
    </div>
  );
};

export default Scan;
