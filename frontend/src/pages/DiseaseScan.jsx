import React from 'react'
import ScanComp from '../components/ScanComp'

const diseasePrompt = `
You are an agricultural plant pathologist AI.
Analyze this crop/plant image for any fungal, bacterial, or viral diseases.

Respond ONLY with a valid JSON object (no markdown, no backticks):

{
  "name": "Disease name (e.g. Tomato Early Blight, Healthy Leaf)",
  "confidence": 96,
  "risk": "HIGH RISK",
  "recommendations": [
    "Apply appropriate fungicide treatment.",
    "Remove infected leaves immediately.",
    "Monitor humidity levels carefully."
  ],
  "localCondition": "High humidity increases fungal spread.",
  "humidity": 84
}
`

const DiseaseScan = () => {
  return (
    <div
      style={{
        padding: '32px 36px 48px',
        backgroundColor: '#f6fbf4',
        minHeight: '100vh',
      }}
    >
      <ScanComp
        title="Crop Disease Detection"
        subtitle="Identify crop diseases instantly using AI-powered analysis."
        resultLabel="Detected Disease"
        expertTip="Ensure the leaf is centered and captured in natural daylight."
        accentColor="#4ade80"
        conditionLabel="Disease Conditions"
        emptyMessage='Upload a crop image and click "Scan with AI" to detect diseases.'
        apiPrompt={diseasePrompt}
        fallback={{
          name: 'Tomato Early Blight',
          confidence: 96,
          risk: 'HIGH RISK',
          recommendations: [
            'Apply copper-based fungicide.',
            'Remove infected leaves immediately.',
            'Improve field air circulation.',
          ],
          localCondition: 'Warm humid conditions favor fungal spread.',
          humidity: 84,
        }}
      />
    </div>
  )
}

export default DiseaseScan