import React, { useState, useRef } from 'react'

/* ════════════════════════════════════════════
   SCANNING OVERLAY
════════════════════════════════════════════ */
const ScanningOverlay = ({ accentColor }) => (
  <div style={{
    position: 'absolute', inset: 0, borderRadius: '12px',
    background: 'rgba(0,0,0,0.48)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
  }}>
    <style>{`
      @keyframes agri-scan  { 0%{top:8%} 100%{top:86%} }
      @keyframes agri-pulse { 0%{transform:scale(.95);opacity:1} 100%{transform:scale(1.2);opacity:0} }
      @keyframes agri-spin  { to{transform:rotate(360deg)} }
    `}</style>

    {/* Scan line */}
    <div style={{
      position: 'absolute', left: '8%', right: '8%', height: '2px',
      background: `linear-gradient(90deg,transparent,${accentColor},#fff,${accentColor},transparent)`,
      boxShadow: `0 0 14px ${accentColor}`,
      animation: 'agri-scan 1.8s ease-in-out infinite alternate',
    }} />

    {/* Corner brackets */}
    {[
      { top: 12, left: 12,  borderTop: `3px solid ${accentColor}`, borderLeft:  `3px solid ${accentColor}`, borderRadius: '3px 0 0 0' },
      { top: 12, right: 12, borderTop: `3px solid ${accentColor}`, borderRight: `3px solid ${accentColor}`, borderRadius: '0 3px 0 0' },
      { bottom: 12, left: 12,  borderBottom: `3px solid ${accentColor}`, borderLeft:  `3px solid ${accentColor}`, borderRadius: '0 0 0 3px' },
      { bottom: 12, right: 12, borderBottom: `3px solid ${accentColor}`, borderRight: `3px solid ${accentColor}`, borderRadius: '0 0 3px 0' },
    ].map((s, i) => (
      <div key={i} style={{ position: 'absolute', width: 28, height: 28, ...s }} />
    ))}

    {/* Badge */}
    <div style={{
      position: 'absolute', top: 12, right: 56,
      background: '#1e3a24', color: '#fff',
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px',
      padding: '4px 12px', borderRadius: '20px',
      display: 'flex', alignItems: 'center', gap: '7px',
    }}>
      <span style={{
        display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
        backgroundColor: accentColor,
        animation: 'agri-pulse 1s ease infinite',
      }} />
      AI SCANNING...
    </div>
  </div>
)

/* ════════════════════════════════════════════
   RESULTS PANEL
════════════════════════════════════════════ */
const ResultsPanel = ({ result, onSave, resultLabel }) => {
  const riskMeta = {
    'HIGH RISK':     { bg: '#c0392b', text: '#fff' },
    'MODERATE RISK': { bg: '#f5a623', text: '#fff' },
    'LOW RISK':      { bg: '#2d6b3e', text: '#fff' },
    'HEALTHY':       { bg: '#2d6b3e', text: '#fff' },
  }
  const rm = riskMeta[result.risk] || riskMeta['LOW RISK']

  return (
    <div style={{ animation: 'agri-fadein .45s ease', display: 'flex', flexDirection: 'column' }}>
      <style>{`@keyframes agri-fadein{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <span style={{ fontWeight: 700, fontSize: '18px', color: '#1e3a24' }}>Analysis Results</span>
        <span style={{
          backgroundColor: rm.bg, color: rm.text,
          fontSize: '11px', fontWeight: 800, padding: '4px 13px', borderRadius: '20px', letterSpacing: '0.4px',
        }}>{result.risk}</span>
      </div>

      {/* Detected label */}
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#8faa8b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
        {resultLabel}
      </div>

      {/* Disease / Pest card */}
      <div style={{ backgroundColor: '#f4f8f1', borderRadius: '12px', padding: '16px 18px', marginBottom: '22px' }}>
        <div style={{ fontWeight: 800, fontSize: '20px', color: '#1e3a24', marginBottom: '12px', fontFamily: "'DM Serif Display', serif" }}>
          {result.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '6px', borderRadius: '10px', backgroundColor: '#ddeedd', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${result.confidence}%`,
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #4a9456, #2d6b3e)',
              transition: 'width 1s ease',
            }} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#2d6b3e', whiteSpace: 'nowrap' }}>
            {result.confidence}% Confidence
          </span>
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#8faa8b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
        AI Recommendation
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '26px' }}>
        {result.recommendations.map((rec, i) => (
          <div key={i} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: '2px solid #4a9456',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '1px',
            }}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="#2d6b3e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '14px', color: '#3a5a3a', lineHeight: 1.55 }}>{rec}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <button style={{
        width: '100%', padding: '13px', marginBottom: '10px',
        borderRadius: '12px', border: 'none', cursor: 'pointer',
        backgroundColor: '#e8f5e2', color: '#2d6b3e',
        fontWeight: 700, fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        transition: 'background .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#d0ecd8' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#e8f5e2' }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <path d="M9 12h6M9 16h4M5 4h4l2-2h4l2 2h4v16H5V4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        </svg>
        Full Diagnostic Report
      </button>

      <button onClick={onSave} style={{
        width: '100%', padding: '13px',
        borderRadius: '12px', border: '1.5px solid #ddeedd',
        cursor: 'pointer', backgroundColor: 'transparent', color: '#3a5a3a',
        fontWeight: 600, fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
        transition: 'background .15s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f4f8f1' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
      >
        Save to History
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════════ */
const EmptyResults = ({ emptyMessage }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', flex: 1, gap: '12px',
    padding: '40px 20px', textAlign: 'center',
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: '50%',
      backgroundColor: '#f4f8f1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke="#8faa8b" strokeWidth="1.8"/>
        <path d="M16.5 16.5L21 21" stroke="#8faa8b" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
    <div style={{ fontWeight: 700, fontSize: '16px', color: '#3a5a3a' }}>No Analysis Yet</div>
    <div style={{ fontSize: '13px', color: '#8faa8b', lineHeight: 1.65, maxWidth: '220px' }}>
      {emptyMessage}
    </div>
  </div>
)

/* ════════════════════════════════════════════
   SCAN COMP  ← main export
   ─────────────────────────────────────────
   Props:
   • title          string   – page heading
   • subtitle       string   – page sub-heading
   • resultLabel    string   – e.g. "Detected Disease" / "Detected Pest"
   • expertTip      string   – tip text at the bottom
   • accentColor    string   – scan-line / pulse color  (default #4ade80)
   • conditionLabel string   – local conditions title
   • conditionIcon  ReactNode– icon on the right of conditions card
   • emptyMessage   string   – placeholder when no scan done yet
   • apiPrompt      string   – full prompt sent to Claude vision API
   • fallback       object   – { name, confidence, risk, recommendations,
                                localCondition, humidity }
════════════════════════════════════════════ */
const ScanComp = ({
  title         = 'Crop Scan',
  subtitle      = 'Identify issues instantly with our high-precision AI model.',
  resultLabel   = 'Detected Issue',
  expertTip     = 'Take photos during the day for natural lighting.',
  accentColor   = '#4ade80',
  conditionLabel = 'Local Conditions',
  conditionIcon,
  emptyMessage  = 'Upload a crop image and click "Scan with AI" to get results.',
  apiPrompt,
  fallback,
}) => {
  const [image,    setImage]   = useState(null)
  const [imgFile,  setImgFile] = useState(null)
  const [scanning, setScanning]= useState(false)
  const [result,   setResult]  = useState(null)
  const [saved,    setSaved]   = useState(false)
  const [dragOver, setDragOver]= useState(false)
  const fileRef = useRef()

  /* ── file helpers ── */
  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImgFile(file)
    setResult(null)
    setSaved(false)
    const r = new FileReader()
    r.onload = (e) => setImage(e.target.result)
    r.readAsDataURL(file)
  }

  /* ── AI scan ── */
  const runScan = async () => {
    if (!imgFile) return
    setScanning(true)
    setResult(null)

    try {
      const base64 = await new Promise((res) => {
        const r = new FileReader()
        r.onload = (e) => res(e.target.result.split(',')[1])
        r.readAsDataURL(imgFile)
      })

      const prompt = apiPrompt || `You are an agricultural AI expert.
Analyze this crop/plant image.
Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "name": "Issue name",
  "confidence": 94,
  "risk": "HIGH RISK" | "MODERATE RISK" | "LOW RISK" | "HEALTHY",
  "recommendations": ["rec1","rec2","rec3"],
  "localCondition": "One-line condition note",
  "humidity": 78
}`

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: imgFile.type, data: base64 } },
              { type: 'text',  text: prompt },
            ],
          }],
        }),
      })

      const data = await res.json()
      const text = data.content.map(b => b.text || '').join('')
      const clean = text.replace(/```json|```/g, '').trim()
      setResult(JSON.parse(clean))
    } catch (_) {
      setResult(fallback || {
        name: 'Unknown Issue',
        confidence: 80,
        risk: 'MODERATE RISK',
        recommendations: [
          'Consult a local agronomist for a detailed diagnosis.',
          'Monitor the affected area over the next 48 hours.',
          'Avoid applying treatments until identified.',
        ],
        localCondition: 'Environmental conditions unclear.',
        humidity: 70,
      })
    } finally {
      setScanning(false)
    }
  }

  /* ── default condition icon ── */
  const defaultConditionIcon = (
    <svg width="40" height="40" fill="none" viewBox="0 0 24 24" style={{ opacity: .85 }}>
      <path d="M12 2C9 2 6.5 4.5 6.5 7.5c0 4.5 5.5 10.5 5.5 10.5s5.5-6 5.5-10.5C17.5 4.5 15 2 12 2z"
        stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/>
      <circle cx="12" cy="7.5" r="2" stroke="#fff" strokeWidth="1.8"/>
    </svg>
  )

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=DM+Serif+Display&display=swap" rel="stylesheet"/>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a24', margin: 0, letterSpacing: '-0.5px' }}>
            {title}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#7a9680' }}>{subtitle}</p>
        </div>

        {/* AI status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: '#fff', borderRadius: '12px', padding: '10px 18px',
          border: '1px solid #e4eedd', boxShadow: '0 2px 8px rgba(45,107,62,.06)',
        }}>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            backgroundColor: scanning ? '#f5a623' : '#2d6b3e',
          }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#2d6b3e' }}>
            AI Status: {scanning ? 'Scanning…' : 'Ready'}
          </span>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>

        {/* LEFT – Upload panel */}
        <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #e8f0e4' }}>

          {/* Upload header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M14 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9" stroke="#2d6b3e" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M14 3l5 5-8 8H8v-3l8-8z" stroke="#2d6b3e" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#1e3a24' }}>Upload Crop Image</span>
            </div>
            <span style={{
              fontSize: '12px', fontWeight: 600, color: '#4a9456',
              backgroundColor: '#e8f5e2', padding: '4px 10px', borderRadius: '8px',
            }}>Supports JPG, PNG</span>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); loadFile(e.dataTransfer.files[0]) }}
            onClick={() => !image && fileRef.current.click()}
            style={{
              position: 'relative',
              border: `2px dashed ${dragOver ? '#4a9456' : image ? 'transparent' : '#c8dfc8'}`,
              borderRadius: '14px', overflow: 'hidden',
              minHeight: '300px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: image ? 'default' : 'pointer',
              backgroundColor: dragOver ? '#f0faf0' : image ? '#000' : '#f8fdf6',
              transition: 'all .2s', marginBottom: '16px',
            }}
          >
            {image ? (
              <>
                <img src={image} alt="Uploaded" style={{ width: '100%', height: '300px', objectFit: 'contain' }} />
                {scanning && <ScanningOverlay accentColor={accentColor} />}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 24px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  backgroundColor: '#e8f5e2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                    <path d="M12 16V4M8 8l4-4 4 4" stroke="#2d6b3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 20h16" stroke="#2d6b3e" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e3a24', marginBottom: '6px' }}>
                  Drag and drop or browse
                </div>
                <div style={{ fontSize: '13px', color: '#8faa8b' }}>
                  For best results, ensure the leaf is centered and well-lit.
                </div>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={(e) => loadFile(e.target.files[0])} />

          {image && !scanning && (
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e3a24', marginBottom: '3px' }}>
                Image ready for analysis
              </div>
              <div style={{ fontSize: '12px', color: '#8faa8b' }}>
                Click "Scan with AI" to detect issues.
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => fileRef.current.click()}
              style={{
                flex: 1, padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #4a9456, #2d6b3e)', color: '#fff',
                fontWeight: 700, fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 12px rgba(45,107,62,.3)', transition: 'all .2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                <path d="M12 16V4M8 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Upload Image
            </button>

            {image ? (
              <button
                onClick={runScan}
                disabled={scanning}
                style={{
                  flex: 1, padding: '13px', borderRadius: '12px', border: 'none',
                  cursor: scanning ? 'not-allowed' : 'pointer',
                  background: scanning ? '#c8dfc8' : 'linear-gradient(135deg, #2d6b3e, #1a4226)',
                  color: '#fff', fontWeight: 700, fontSize: '14px',
                  fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'all .2s',
                }}
              >
                {scanning ? (
                  <>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"
                      style={{ animation: 'agri-spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"
                        strokeDasharray="28 56" strokeLinecap="round"/>
                    </svg>
                    Scanning…
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Scan with AI
                  </>
                )}
              </button>
            ) : (
              <button style={{
                flex: 1, padding: '13px', borderRadius: '12px',
                border: '1.5px solid #ddeedd', cursor: 'pointer',
                backgroundColor: '#f4f8f1', color: '#3a5a3a',
                fontWeight: 600, fontSize: '14px', fontFamily: "'DM Sans', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
                  <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
                Camera Capture
              </button>
            )}
          </div>
        </div>

        {/* RIGHT – Results panel */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '20px', padding: '24px',
          border: '1px solid #e8f0e4', minHeight: '400px',
          display: 'flex', flexDirection: 'column',
        }}>
          {result
            ? <ResultsPanel result={result} resultLabel={resultLabel} onSave={() => setSaved(true)} />
            : <EmptyResults emptyMessage={emptyMessage} />
          }
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', marginTop: '20px' }}>

        {/* Expert tip */}
        <div style={{
          backgroundColor: '#fff', borderRadius: '16px', padding: '20px 24px',
          border: '1px solid #e8f0e4', display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px', backgroundColor: '#e8f5e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" stroke="#2d6b3e" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#2d6b3e" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#4a9456', letterSpacing: '.8px', textTransform: 'uppercase', marginBottom: '4px' }}>
              Expert Tip
            </div>
            <div style={{ fontSize: '13px', color: '#3a5a3a', lineHeight: 1.6 }}>{expertTip}</div>
          </div>
        </div>

        {/* Local conditions */}
        <div style={{
          background: 'linear-gradient(135deg, #7b2d5e, #9b3d74)',
          borderRadius: '16px', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,.65)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
              {conditionLabel}
            </div>
            <div style={{ fontWeight: 800, fontSize: '18px', color: '#fff', marginBottom: '4px' }}>
              High Humidity ({result?.humidity ?? 84}%)
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.75)' }}>
              {result?.localCondition ?? 'Monitor field conditions regularly.'}
            </div>
          </div>
          {conditionIcon || defaultConditionIcon}
        </div>
      </div>

      {/* ── Toast ── */}
      {saved && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#2d6b3e', color: '#fff',
          padding: '12px 24px', borderRadius: '40px',
          fontSize: '14px', fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,.15)',
          display: 'flex', alignItems: 'center', gap: '8px',
          zIndex: 999, animation: 'agri-fadein .3s ease',
        }}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Saved to history
        </div>
      )}
    </div>
  )
}

export default ScanComp
