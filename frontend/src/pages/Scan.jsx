import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../utils/api';

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
  const [preview, setPreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
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

  const toBase64 = (f) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(f);
  });

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    // Convert to base64 so it persists in localStorage
    const b64 = await toBase64(f);
    setBase64Image(b64);
    runAnalysis(f);
  };

  const onFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    handleFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    handleFile(f);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const triggerFile = (capture = false) => {
    if (!fileInputRef.current) return;
    if (capture) fileInputRef.current.setAttribute('capture', 'environment');
    else fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.click();
  };

  const runAnalysis = async (f) => {
    setAnalyzing(true);
    setResult(null);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Please login first to analyze images');
      }

      const formData = new FormData();
      formData.append('file', f);
      // The backend expects 'disease' or 'insect'
      const backendType = activeType === 'pest' ? 'insect' : 'disease';
      formData.append('type', backendType);

      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        let detail = 'Backend error';
        try {
          const err = await res.json();
          detail = err?.detail || detail;
        } catch {
          // ignore parse errors and keep fallback detail
        }
        throw new Error(detail);
      }

      const dataJson = await res.json();
      const ai = dataJson.data || {};

      setResult({
        type: dataJson.type === 'disease' ? 'Disease' : 'Pest',
        title: ai.disease || ai.insect || 'Unknown',
        description: ai.description || '',
        solution: ai.solution || ''
      });
    } catch (err) {
      alert('Scan failed: ' + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const saveToHistory = () => {
    if (!result) return;
    const entry = {
      id: Date.now(),
      type: result.type,
      title: result.title,
      description: result.description,
      solution: result.solution,
      image: base64Image || null,   // real persistent base64 image
      timestamp: new Date().toISOString(),
    };
    const raw = localStorage.getItem('scanHistory');
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(entry);
    localStorage.setItem('scanHistory', JSON.stringify(arr.slice(0, 30)));
    alert('✅ Saved to history!');
  };

  return (
    <div style={{ padding: '36px 40px 60px', fontFamily: "'DM Sans', sans-serif", backgroundColor: '#f2f6ed', minHeight: '100%', boxSizing: 'border-box' }}>
      
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
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <style>{`
            @keyframes pulse-ring {
              0% { box-shadow: 0 0 0 0 rgba(21,102,51,0.15); }
              70% { box-shadow: 0 0 0 10px rgba(21,102,51,0); }
              100% { box-shadow: 0 0 0 0 rgba(21,102,51,0); }
            }
            @keyframes bounce-up {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            @keyframes scan-line {
              0% { top: 0%; }
              100% { top: 100%; }
            }
            .upload-btn-primary:hover { background: linear-gradient(135deg, #1a7a3e, #156633) !important; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(21,102,51,0.3) !important; }
            .upload-btn-secondary:hover { background-color: #d6e4d1 !important; transform: translateY(-1px); }
          `}</style>

          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 800, color: '#1e3a24', fontSize: '17px' }}>Upload Crop Image</div>
              <div style={{ fontSize: '12px', color: '#8faa8b', marginTop: '2px' }}>AI-powered analysis in seconds</div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ backgroundColor: '#edf7ed', color: '#2d6b3e', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>JPG</span>
              <span style={{ backgroundColor: '#edf7ed', color: '#2d6b3e', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>PNG</span>
              <span style={{ backgroundColor: '#edf7ed', color: '#2d6b3e', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>HEIC</span>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => !file && triggerFile(false)}
            style={{
              border: dragOver ? '2.5px dashed #156633' : '2px dashed #d4e8d0',
              borderRadius: '20px',
              background: dragOver
                ? 'linear-gradient(145deg, #edf7ed, #f5fbf5)'
                : file ? '#000' : 'linear-gradient(145deg, #f9fcf8, #f2f7f1)',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: file ? 'default' : 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              transform: dragOver ? 'scale(1.01)' : 'scale(1)',
            }}
          >
            {file && preview ? (
              /* ── Image Preview State ── */
              <>
                <img
                  src={preview}
                  alt="Crop scan"
                  style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block' }}
                />
                {/* Scanning overlay */}
                {analyzing && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '12px'
                  }}>
                    <div style={{
                      position: 'absolute', left: '8%', right: '8%', height: '2px',
                      background: 'linear-gradient(90deg,transparent,#4ade80,#fff,#4ade80,transparent)',
                      boxShadow: '0 0 16px #4ade80',
                      animation: 'scan-line 1.6s ease-in-out infinite alternate',
                      top: '20%'
                    }} />
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px', letterSpacing: '1px', marginTop: '60px', background: 'rgba(21,102,51,0.8)', padding: '8px 20px', borderRadius: '20px' }}>🔬 AI SCANNING...</span>
                  </div>
                )}
                {/* Status badge */}
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  backgroundColor: analyzing ? '#f59e0b' : '#156633',
                  color: 'white', padding: '5px 12px', borderRadius: '20px',
                  fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  animation: analyzing ? 'pulse-ring 1.5s infinite' : 'none'
                }}>
                  {analyzing ? '⏳ Analyzing' : '✅ Ready'}
                </div>
                {/* Re-upload button overlay */}
                {!analyzing && (
                  <button
                    onClick={(e) => { e.stopPropagation(); triggerFile(false); }}
                    style={{
                      position: 'absolute', bottom: '12px', right: '12px',
                      backgroundColor: 'rgba(255,255,255,0.92)',
                      color: '#156633', border: 'none',
                      padding: '7px 14px', borderRadius: '10px',
                      fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Change Image
                  </button>
                )}
              </>
            ) : (
              /* ── Empty / Drag-over State ── */
              <div style={{ textAlign: 'center', padding: '40px 24px', pointerEvents: 'none' }}>
                {/* Icon */}
                <div style={{
                  width: '80px', height: '80px',
                  borderRadius: '22px',
                  background: dragOver
                    ? 'linear-gradient(135deg, #156633, #2d8a52)'
                    : 'linear-gradient(135deg, #edf7ed, #d4edda)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  transition: 'all 0.3s ease',
                  animation: dragOver ? 'none' : 'bounce-up 2.5s ease-in-out infinite',
                  boxShadow: dragOver ? '0 12px 30px rgba(21,102,51,0.25)' : '0 4px 14px rgba(21,102,51,0.12)'
                }}>
                  {dragOver ? (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#156633" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>

                <div style={{ fontSize: '18px', fontWeight: 800, color: dragOver ? '#156633' : '#1e3a24', marginBottom: '8px', transition: 'color 0.3s' }}>
                  {dragOver ? 'Drop to Analyze! 🌿' : 'Drop your crop image here'}
                </div>
                <div style={{ fontSize: '13px', color: '#8faa8b', lineHeight: 1.6, maxWidth: '220px', margin: '0 auto 20px' }}>
                  {dragOver
                    ? 'Release to start AI analysis'
                    : 'or use the buttons below to upload or take a photo'}
                </div>

                {!dragOver && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', fontSize: '11px', color: '#b0c8ae' }}>
                    <span>📷 JPG</span>
                    <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#c8dfc8', display: 'inline-block' }} />
                    <span>🖼 PNG</span>
                    <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#c8dfc8', display: 'inline-block' }} />
                    <span>📱 HEIC</span>
                    <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#c8dfc8', display: 'inline-block' }} />
                    <span>Max 10MB</span>
                  </div>
                )}
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
            <button
              type="button"
              className="upload-btn-primary"
              onClick={() => triggerFile(false)}
              style={{
                background: 'linear-gradient(135deg, #156633, #1a7a3e)',
                color: 'white', border: 'none',
                padding: '14px', borderRadius: '14px',
                fontWeight: 700, fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(21,102,51,0.2)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload Image
            </button>
            <button
              type="button"
              className="upload-btn-secondary"
              onClick={() => triggerFile(true)}
              style={{
                backgroundColor: '#e4eadf', color: '#1e3a24',
                border: 'none', padding: '14px', borderRadius: '14px',
                fontWeight: 700, fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
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
          </div>

          {result ? (
            <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
              <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .save-btn:hover { background-color: #f2f6ed !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
              `}</style>

              {/* Detected Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'space-between', 
                marginBottom: '24px',
                paddingBottom: '20px',
                borderBottom: '1px solid #f0f5ed'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ 
                      backgroundColor: result.type.toLowerCase() === 'disease' ? '#ffebee' : '#fff8e1', 
                      color: result.type.toLowerCase() === 'disease' ? '#c62828' : '#f57f17', 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase'
                    }}>
                      {result.type}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#1e3a24', lineHeight: 1.2 }}>
                    {result.title}
                  </h3>
                </div>
                <div style={{ 
                  width: '48px', height: '48px', 
                  borderRadius: '14px', 
                  backgroundColor: '#f2f6ed', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#156633'
                }}>
                  {result.type.toLowerCase() === 'disease' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H9v2h6V2zm-4 4H9v2h2V6zm4 0h-2v2h2V6zM9 10h6v2H9v-2zm-2 4h10v2H7v-2zm-2 4h14v2H5v-2z"/></svg>
                  )}
                </div>
              </div>

              {/* Description Card */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7c6b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#6b7c6b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</span>
                </div>
                <div style={{ 
                  backgroundColor: '#fafcf9', 
                  border: '1px solid #eef3eb',
                  borderRadius: '16px', 
                  padding: '20px',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
                }}>
                  <p style={{ margin: 0, fontSize: '14.5px', color: '#4b5b4b', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                    {result.description}
                  </p>
                </div>
              </div>

              {/* Solution Card */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#156633" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#156633', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommended Solution</span>
                </div>
                <div style={{ 
                  background: 'linear-gradient(145deg, #156633 0%, #1e3a24 100%)', 
                  borderRadius: '16px', 
                  padding: '20px',
                  color: 'white',
                  boxShadow: '0 8px 16px rgba(21, 102, 51, 0.15)'
                }}>
                  <p style={{ margin: 0, fontSize: '14.5px', color: '#e8f4eb', lineHeight: 1.65, whiteSpace: 'pre-line', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    {result.solution}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <button 
                className="save-btn"
                onClick={saveToHistory}
                style={{
                  width: '100%',
                  backgroundColor: '#ffffff',
                  color: '#156633',
                  border: '2px solid #e4eadf',
                  padding: '16px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Save to History
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8faa8b', fontSize: '14px' }}>
              {analyzing ? 'Analyzing image...' : 'Upload an image to see analysis results'}
            </div>
          )}
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
