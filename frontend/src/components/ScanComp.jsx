import React, { useState, useRef } from 'react'

/* ════════════════════════════════════════════
   SCANNING OVERLAY
════════════════════════════════════════════ */
const ScanningOverlay = ({ accentColor }) => (
  <div style={{
    position: 'absolute',
    inset: 0,
    borderRadius: '12px',
    background: 'rgba(0,0,0,0.48)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  }}>
    <style>{`
      @keyframes agri-scan {
        0% { top: 8% }
        100% { top: 86% }
      }
    `}</style>

    <div style={{
      position: 'absolute',
      left: '8%',
      right: '8%',
      height: '2px',
      background: `linear-gradient(90deg,transparent,${accentColor},#fff,${accentColor},transparent)`,
      boxShadow: `0 0 14px ${accentColor}`,
      animation: 'agri-scan 1.8s ease-in-out infinite alternate',
    }} />
  </div>
)

/* ════════════════════════════════════════════
   INFO CARD
════════════════════════════════════════════ */
const InfoCard = ({ title, children }) => (
  <div style={{
    background: '#f8fcf7',
    border: '1px solid #e4eee1',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '12px',
  }}>
    <div style={{
      fontSize: '11px',
      fontWeight: 800,
      color: '#8faa8b',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
    }}>
      {title}
    </div>
    <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#3a5a3a', whiteSpace: 'pre-line' }}>
      {children}
    </div>
  </div>
)

/* ════════════════════════════════════════════
   RESULTS PANEL (FULL DYNAMIC FIX)
════════════════════════════════════════════ */
const ResultsPanel = ({ result, onSave }) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '18px',
      }}>
        <div style={{
          fontWeight: 800,
          fontSize: '20px',
          color: '#1e3a24',
        }}>
          Analysis Results
        </div>
      </div>

      {/* TYPE */}
      <InfoCard title="Detected Type">
        {result?.type || 'Not detected'}
      </InfoCard>

      {/* NAME */}
      <InfoCard title="Detected Issue">
        <div style={{ fontSize: '18px', fontWeight: 800 }}>
          {result?.name || 'Unknown'}
        </div>
      </InfoCard>

      {/* DESCRIPTION */}
      <InfoCard title="Description">
        {result?.description || 'No description available from AI model.'}
      </InfoCard>

      {/* SOLUTION */}
      <InfoCard title="Solution">
        {result?.solution || 'No recommendation available.'}
      </InfoCard>

      <button
        onClick={onSave}
        style={{
          width: '100%',
          padding: '13px',
          borderRadius: '12px',
          border: '1px solid #dce8d9',
          background: '#fff',
          color: '#2d6b3e',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Save to History
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
const ScanComp = ({ scanType = 'disease' }) => {

  const [image, setImage] = useState(null)
  const [imgFile, setImgFile] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const fileRef = useRef()

  const loadFile = (file) => {
    if (!file) return
    setImgFile(file)

    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target.result)
    reader.readAsDataURL(file)
  }

  /* ═══════════════════════════════════════
     BACKEND CALL (FIXED MAPPING)
  ═══════════════════════════════════════ */
  const runScan = async () => {
    if (!imgFile) return

    setScanning(true)
    setResult(null)

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('Please login first to analyze images')
      }

      const formData = new FormData()
      formData.append('file', imgFile)
      formData.append('type', scanType)

      const res = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        let detail = 'Backend error'
        try {
          const err = await res.json()
          detail = err?.detail || detail
        } catch {
          // ignore parse errors and keep fallback detail
        }
        throw new Error(detail)
      }

      const data = await res.json()

      const ai = data.data || {}

      // SAFE mapping (important fix)
      const mappedResult = {
        type: data.type === 'disease' ? 'Disease' : 'Insect',
        name: ai.disease || ai.insect || 'Unknown',
        description: ai.description || '',
        solution: ai.solution || '',
        confidence: 85,
        risk: data.type === 'disease'
          ? 'HIGH RISK'
          : 'MODERATE RISK',
      }

      setResult(mappedResult)

    } catch (err) {
      alert('Scan failed: ' + err.message)
    } finally {
      setScanning(false)
    }
  }

  return (
    <div style={{ padding: '30px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 360px',
        gap: '20px',
      }}>

        {/* LEFT */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e8f0e4',
        }}>

          <div
            onClick={() => fileRef.current.click()}
            style={{
              border: '2px dashed #c8dfc8',
              borderRadius: '14px',
              minHeight: '260px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {image ? (
              <>
                <img src={image} style={{
                  width: '100%',
                  height: '260px',
                  objectFit: 'contain',
                }} />

                {scanning && (
                  <ScanningOverlay accentColor="#4ade80" />
                )}
              </>
            ) : (
              <div>Upload Image</div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) => loadFile(e.target.files[0])}
          />

          <button
            onClick={runScan}
            disabled={scanning}
            style={{
              marginTop: '18px',
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: scanning ? '#ccc' : '#2d6b3e',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {scanning ? 'Scanning...' : 'Submit & Scan'}
          </button>
        </div>

        {/* RIGHT */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e8f0e4',
        }}>
          {result ? (
            <ResultsPanel
              result={result}
              onSave={() => alert('Saved')}
            />
          ) : (
            <div style={{
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8faa8b',
            }}>
              No Analysis Yet
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default ScanComp