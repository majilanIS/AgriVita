import { useState } from "react";

const crops = [
  { id: "maize", name: "Maize (Corn)", emoji: "🌽" },
  { id: "wheat", name: "Wheat", emoji: "🌾" },
  { id: "tomato", name: "Tomato", emoji: "🍅" },
  { id: "teff", name: "Teff", emoji: "🌿" },
  { id: "coffee", name: "Coffee", emoji: "☕" },
  { id: "banana", name: "Banana", emoji: "🍌" },
  { id: "mango", name: "Mango", emoji: "🥭" },
  { id: "avocado", name: "Avocado", emoji: "🥑" },
  { id: "chili", name: "Chili", emoji: "🌶️" },
  { id: "onion", name: "Onion", emoji: "🧅" },
  { id: "potato", name: "Potato", emoji: "🥔" },
  { id: "beans", name: "Beans", emoji: "🫘" },
  { id: "groundnuts", name: "Groundnuts", emoji: "🥜" },
  { id: "sugarcane", name: "Sugarcane", emoji: "🎋" },
];

const growthStages = [
  { id: "early", label: "Early Growth", desc: "Just planted or sprouted" },
  { id: "vegetative", label: "Vegetative", desc: "Leaves and stems growing" },
  { id: "flowering", label: "Flowering", desc: "Flowers starting to show" },
  { id: "fruiting", label: "Fruiting", desc: "Fruits or grains appearing" },
];

const fertilizerData = {
  maize: { urea: 0.25, dap: 0.04, mop: 0.03 },
  wheat: { urea: 0.22, dap: 0.035, mop: 0.025 },
  tomato: { urea: 0.3, dap: 0.05, mop: 0.05 },
  teff: { urea: 0.18, dap: 0.03, mop: 0.02 },
  coffee: { urea: 0.28, dap: 0.04, mop: 0.04 },
  banana: { urea: 0.28, dap: 0.04, mop: 0.06 },
  mango: { urea: 0.22, dap: 0.035, mop: 0.04 },
  avocado: { urea: 0.2, dap: 0.03, mop: 0.035 },
  chili: { urea: 0.26, dap: 0.045, mop: 0.04 },
  onion: { urea: 0.2, dap: 0.04, mop: 0.035 },
  potato: { urea: 0.24, dap: 0.05, mop: 0.055 },
  beans: { urea: 0.1, dap: 0.06, mop: 0.03 },
  groundnuts: { urea: 0.08, dap: 0.055, mop: 0.025 },
  sugarcane: { urea: 0.32, dap: 0.05, mop: 0.07 },
};

const stageMultipliers = { early: 0.7, vegetative: 1.0, flowering: 1.2, fruiting: 1.1 };

function calcFertilizer(cropId, count, stage) {
  const base = fertilizerData[cropId] || fertilizerData.maize;
  const m = stageMultipliers[stage] || 1.0;
  return {
    urea: +(base.urea * count * m).toFixed(1),
    dap: +(base.dap * count * m).toFixed(1),
    mop: +(base.mop * count * m).toFixed(1),
  };
}

const fertilizerInfo = {
  urea: {
    why: "Boosts leaf growth and green color.",
    when: "Apply 3-4 weeks after planting.",
    how: "Side dressing (place near stem but not touching).",
    color: "#1a6b3c",
  },
  dap: {
    why: "Helps in strong root development.",
    when: "Apply at the time of planting.",
    how: "Soil application (mix with soil before planting).",
    color: "#2d7a5e",
  },
  mop: {
    why: "Improves fruit quality and disease resistance.",
    when: "Apply during flowering or fruiting stage.",
    how: "Broadcast and incorporate into soil.",
    color: "#3a8c72",
  },
};

export default function FertilizerExpert() {
  const [step, setStep] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [plantCount, setPlantCount] = useState("");
  const [growthStage, setGrowthStage] = useState(null);
  const [result, setResult] = useState(null);

  const handleCropSelect = (crop) => setSelectedCrop(crop);

  const handleContinue = () => {
    if (selectedCrop) setStep(2);
  };

  const handleNextStep = () => {
    if (plantCount && parseInt(plantCount) > 0) setStep(3);
  };

  const handleShowResult = () => {
    const stage = growthStage || "vegetative";
    const res = calcFertilizer(selectedCrop.id, parseInt(plantCount), stage);
    setResult(res);
    setStep(4);
  };

  const handleSkip = () => {
    const res = calcFertilizer(selectedCrop.id, parseInt(plantCount), "vegetative");
    setResult(res);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCrop(null);
    setPlantCount("");
    setGrowthStage(null);
    setResult(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0faf4 0%, #e6f5ec 50%, #f5faf0 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "24px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1e7e3e 0%, #2d9e5a 100%)",
          borderRadius: "18px 18px 0 0",
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 4px 24px rgba(30,126,62,0.18)",
        }}>
          <span style={{ fontSize: 26 }}>🌱</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 22, letterSpacing: 0.3 }}>Fertilizer Expert</div>
            <div style={{ color: "rgba(255,255,255,0.82)", fontSize: 13, fontFamily: "sans-serif", marginTop: 2 }}>Calculate the best mix for your farm</div>
          </div>
        </div>

        {/* Step Dots */}
        <div style={{
          background: "#fff",
          borderRadius: "0 0 18px 18px",
          boxShadow: "0 6px 32px rgba(30,126,62,0.10)",
          padding: "28px 28px 24px",
          marginBottom: 24,
        }}>
          {/* Progress */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            {[1, 2, 3].map((s) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: step > s ? "#1e7e3e" : step === s ? "#1e7e3e" : "#d4e8da",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: step >= s ? "#fff" : "#5a9e6f",
                  fontWeight: 700, fontSize: 13, fontFamily: "sans-serif",
                  transition: "all 0.3s",
                  boxShadow: step === s ? "0 0 0 3px rgba(30,126,62,0.2)" : "none",
                }}>
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && <div style={{ width: 36, height: 3, background: step > s ? "#1e7e3e" : "#d4e8da", borderRadius: 4, transition: "all 0.3s" }} />}
              </div>
            ))}
            <div style={{ marginLeft: "auto", fontFamily: "sans-serif", fontSize: 12, color: "#5a9e6f", fontWeight: 600 }}>
              {step <= 3 ? `STEP ${Math.min(step, 3)} OF 3` : "COMPLETE"}
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#1a3d29", marginBottom: 18 }}>1. Choose your crop</div>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, maxHeight: 380, overflowY: "auto",
                paddingRight: 4,
              }}>
                {crops.map((crop) => (
                  <button key={crop.id} onClick={() => handleCropSelect(crop)} style={{
                    background: selectedCrop?.id === crop.id ? "linear-gradient(135deg, #e6f9ee, #d0f0de)" : "#f8fdf9",
                    border: selectedCrop?.id === crop.id ? "2.5px solid #1e7e3e" : "2px solid #d4e8da",
                    borderRadius: 14, padding: "18px 10px 14px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    cursor: "pointer", transition: "all 0.18s",
                    boxShadow: selectedCrop?.id === crop.id ? "0 4px 16px rgba(30,126,62,0.15)" : "none",
                    transform: selectedCrop?.id === crop.id ? "scale(1.03)" : "scale(1)",
                  }}>
                    <span style={{ fontSize: 32 }}>{crop.emoji}</span>
                    <span style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, color: "#1a3d29" }}>{crop.name}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleContinue} disabled={!selectedCrop} style={{
                marginTop: 20, width: "100%", padding: "15px 0",
                background: selectedCrop ? "linear-gradient(135deg, #1e7e3e, #2d9e5a)" : "#c8e6d0",
                color: selectedCrop ? "#fff" : "#9ac9aa",
                border: "none", borderRadius: 12, fontFamily: "sans-serif",
                fontWeight: 700, fontSize: 16, cursor: selectedCrop ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: selectedCrop ? "0 4px 16px rgba(30,126,62,0.25)" : "none",
              }}>
                Continue →
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div style={{ textAlign: "center" }}>
              <button onClick={() => setStep(1)} style={{
                background: "none", border: "none", color: "#1e7e3e", fontFamily: "sans-serif",
                fontSize: 14, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 4, marginBottom: 24,
              }}>← Back</button>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #d0f0de, #a8e0bf)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: 32,
                boxShadow: "0 4px 20px rgba(30,126,62,0.18)",
              }}>🌿</div>
              <div style={{ fontWeight: 700, fontSize: 20, color: "#1a3d29", marginBottom: 6 }}>How many plants/trees?</div>
              <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a9e6f", marginBottom: 24 }}>
                Enter the total count for <strong>{selectedCrop?.name}</strong>
              </div>
              <div style={{ position: "relative", marginBottom: 20 }}>
                <input
                  type="number" min="1" value={plantCount}
                  onChange={(e) => setPlantCount(e.target.value)}
                  placeholder="e.g. 34"
                  style={{
                    width: "100%", padding: "16px 80px 16px 20px",
                    border: "2px solid #b8dfc8", borderRadius: 12,
                    fontFamily: "sans-serif", fontSize: 18, fontWeight: 700, color: "#1a3d29",
                    outline: "none", boxSizing: "border-box",
                    background: "#f8fdf9",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#1e7e3e"}
                  onBlur={(e) => e.target.style.borderColor = "#b8dfc8"}
                />
                <span style={{
                  position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
                  fontFamily: "sans-serif", fontSize: 12, fontWeight: 700, color: "#1e7e3e",
                  letterSpacing: 1,
                }}>PLANTS</span>
              </div>
              <button onClick={handleNextStep} disabled={!plantCount || parseInt(plantCount) < 1} style={{
                width: "100%", padding: "15px 0",
                background: plantCount ? "linear-gradient(135deg, #1e7e3e, #2d9e5a)" : "#c8e6d0",
                color: plantCount ? "#fff" : "#9ac9aa",
                border: "none", borderRadius: 12, fontFamily: "sans-serif",
                fontWeight: 700, fontSize: 16, cursor: plantCount ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: plantCount ? "0 4px 16px rgba(30,126,62,0.25)" : "none",
              }}>
                Next Step →
              </button>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#1a3d29", marginBottom: 6 }}>Current growth stage?</div>
                <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#5a9e6f" }}>This helps us refine the mix</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {growthStages.map((s) => (
                  <button key={s.id} onClick={() => setGrowthStage(s.id)} style={{
                    background: growthStage === s.id ? "linear-gradient(135deg, #e6f9ee, #d0f0de)" : "#f8fdf9",
                    border: growthStage === s.id ? "2.5px solid #1e7e3e" : "2px solid #d4e8da",
                    borderRadius: 12, padding: "16px 20px", textAlign: "left",
                    cursor: "pointer", transition: "all 0.18s",
                    transform: growthStage === s.id ? "scale(1.01)" : "scale(1)",
                    boxShadow: growthStage === s.id ? "0 4px 12px rgba(30,126,62,0.12)" : "none",
                  }}>
                    <div style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: "#1a3d29" }}>{s.label}</div>
                    <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#5a9e6f", marginTop: 3 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handleSkip} style={{
                  flex: 1, padding: "14px 0",
                  background: "#f0f8f2", border: "2px solid #d4e8da",
                  borderRadius: 12, fontFamily: "sans-serif",
                  fontWeight: 600, fontSize: 15, color: "#1a3d29", cursor: "pointer",
                }}>Skip</button>
                <button onClick={handleShowResult} disabled={!growthStage} style={{
                  flex: 2, padding: "14px 0",
                  background: growthStage ? "linear-gradient(135deg, #1e7e3e, #2d9e5a)" : "#c8e6d0",
                  color: growthStage ? "#fff" : "#9ac9aa",
                  border: "none", borderRadius: 12, fontFamily: "sans-serif",
                  fontWeight: 700, fontSize: 15, cursor: growthStage ? "pointer" : "not-allowed",
                  boxShadow: growthStage ? "0 4px 16px rgba(30,126,62,0.25)" : "none",
                }}>Show Result</button>
              </div>
            </div>
          )}

          {/* STEP 4 — RESULT */}
          {step === 4 && result && (
            <div>
              <div style={{
                background: "linear-gradient(135deg, #e6f9ee, #d0f0de)",
                borderRadius: 14, padding: "20px 24px", marginBottom: 20,
                textAlign: "center", position: "relative", overflow: "hidden",
              }}>
                <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "#5a9e6f", fontWeight: 700, letterSpacing: 2, marginBottom: 6, textTransform: "uppercase" }}>Your Recipe</div>
                <div style={{ fontWeight: 700, fontSize: 18, color: "#1a3d29" }}>
                  For {plantCount} Plants of {selectedCrop?.name} {selectedCrop?.emoji}
                </div>
                {growthStage && (
                  <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#5a9e6f", marginTop: 4 }}>
                    {growthStages.find(s => s.id === growthStage)?.label} stage
                  </div>
                )}
                <div style={{ position: "absolute", right: -20, top: -20, fontSize: 80, opacity: 0.08 }}>🌱</div>
              </div>

              {[
                { key: "urea", label: "Urea", amount: result.urea },
                { key: "dap", label: "DAP", amount: result.dap },
                { key: "mop", label: "MOP (Potash)", amount: result.mop },
              ].map(({ key, label, amount }) => {
                const info = fertilizerInfo[key];
                return (
                  <div key={key} style={{
                    background: "#fff", border: "1.5px solid #d4e8da", borderRadius: 14,
                    padding: "18px 20px", marginBottom: 14,
                    boxShadow: "0 2px 12px rgba(30,126,62,0.07)",
                  }}>
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                      <div style={{ fontFamily: "sans-serif", fontSize: 13, fontWeight: 700, color: info.color, letterSpacing: 1 }}>{label}</div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: "#1a3d29", lineHeight: 1.2 }}>{amount} <span style={{ fontSize: 16 }}>kg</span></div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {[
                        { q: "Why?", a: info.why, color: "#1e7e3e" },
                        { q: "When?", a: info.when, color: "#2d7a5e" },
                        { q: "How?", a: info.how, color: "#3a8c72" },
                      ].map(({ q, a, color }) => (
                        <div key={q} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ fontFamily: "sans-serif", fontSize: 11, fontWeight: 800, color, minWidth: 38, paddingTop: 1, letterSpacing: 0.5 }}>{q}</span>
                          <span style={{ fontFamily: "sans-serif", fontSize: 12, color: "#3a5a45", lineHeight: 1.5 }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              <button onClick={handleReset} style={{
                width: "100%", padding: "14px 0", marginTop: 6,
                background: "linear-gradient(135deg, #1e7e3e, #2d9e5a)",
                color: "#fff", border: "none", borderRadius: 12,
                fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(30,126,62,0.25)",
              }}>
                🔄 Calculate Another Crop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
