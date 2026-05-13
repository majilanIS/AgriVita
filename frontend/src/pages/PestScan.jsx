import React from 'react'
import ScanComp from '../components/ScanComp'

const pestPrompt = `
You are an agricultural entomologist AI.

Analyze this crop/plant image for:
- insect pests
- larvae
- eggs
- chewing damage
- pest infestations

Respond ONLY with a valid JSON object (no markdown, no backticks):

{
  "name": "Pest name (e.g. Aphid Infestation, Whitefly, Healthy — No Pests)",
  "confidence": 64,
  "risk": "MODERATE RISK",
  "recommendations": [
    "Apply neem-based organic pesticide.",
    "Inspect nearby plants for spread.",
    "Monitor leaves daily for pest activity."
  ],
  "localCondition": "Warm conditions favor pest reproduction.",
  "humidity": 71
}
`

const PestScan = () => {
  return (
    <div
      style={{
        padding: '32px 36px 48px',
        backgroundColor: '#f6fbf4',
        minHeight: '100vh',
      }}
    >
      <ScanComp
        title="Crop Pest Detection"
        subtitle="Detect harmful crop pests instantly using AI-powered scanning."
        resultLabel="Detected Pest"
        expertTip="Capture close-up images of affected leaves for accurate pest detection."
        accentColor="#f5a623"
        conditionLabel="Pest Conditions"
        emptyMessage='Upload a crop image and click "Scan with AI" to detect pests.'
        apiPrompt={pestPrompt}
        fallback={{
          name: 'Aphid Infestation',
          confidence: 64,
          risk: 'MODERATE RISK',
          recommendations: [
            'Apply neem-based organic pesticide.',
            'Inspect nearby plants for spread.',
            'Monitor leaves daily for pest activity.',
          ],
          localCondition: 'Warm conditions favor pest reproduction.',
          humidity: 71,
        }}
      />
    </div>
  )
}

export default PestScan