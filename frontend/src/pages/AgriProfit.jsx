import { useState } from "react";

// ─── Tokens ──────────────────────────────────────────────────────────────────
const G = {
  dark:        "#1b4332",
  mid:         "#2d6a4f",
  accent:      "#40b077",
  accentLight: "#74c69d",
  accentPale:  "#d8f3dc",
  bgPage:      "#f1f4f2",
  bgCard:      "#ffffff",
  border:      "#e4eae6",
  textPrimary: "#111827",
  textSec:     "#4b5563",
  textMuted:   "#9ca3af",
  up:          "#16a34a",
  down:        "#dc2626",
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #f1f4f2; color: #111827; min-height: 100vh; }

  /* Navbar */
  .nav {
    background: #fff; border-bottom: 1px solid #e4eae6;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 60px; position: sticky; top: 0; z-index: 200;
    box-shadow: 0 1px 8px rgba(0,0,0,.05);
  }
  .nav-brand { display: flex; align-items: center; gap: 10px; font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; color: #1b4332; }
  .nav-logo { width: 36px; height: 36px; background: #40b077; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .nav-btn { background: none; border: none; cursor: pointer; color: #4b5563; padding: 7px; border-radius: 8px; transition: background .15s; display: flex; }
  .nav-btn:hover { background: #f1f4f2; }

  /* Page */
  .page { max-width: 1100px; margin: 0 auto; padding: 28px 20px 80px; }

  /* Hero */
  .hero {
    background: linear-gradient(130deg, #1b4332 0%, #2d6a4f 60%, #52b788 100%);
    border-radius: 22px; padding: 42px 44px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 40px; overflow: hidden; position: relative; gap: 28px; min-height: 210px;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M50 50v-6h-4v6h-6v4h6v6h4v-6h6v-4h-6zm0-40V4h-4v6h-6v4h6v6h4v-6h6v-4h-6zM10 50v-6H6v6H0v4h6v6h4v-6h6v-4h-6zM10 10V4H6v6H0v4h6v6h4v-6h6v-4h-6z'/%3E%3C/g%3E%3C/svg%3E");
  }
  .hero-text { position: relative; z-index: 1; flex: 1; max-width: 520px; }
  .hero-main-title { font-family: 'Playfair Display', serif; font-size: 2.5rem; color: #fff; font-weight: 700; line-height: 1.18; margin-bottom: 16px; }
  .hero-subtitle { font-size: .93rem; color: rgba(255,255,255,.78); line-height: 1.7; margin-bottom: 24px; font-weight: 300; }
  .hero-tip-label { font-size: .68rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #74c69d; margin-bottom: 5px; }
  .hero-tip-text { font-size: .88rem; color: rgba(255,255,255,.82); }

  .hero-mockup {
    position: relative; z-index: 1; flex-shrink: 0; width: 296px;
    background: rgba(255,255,255,.11); border: 1px solid rgba(255,255,255,.22);
    border-radius: 16px; padding: 13px; backdrop-filter: blur(8px);
  }
  .mockup-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px; }
  .mockup-dots { display: flex; gap: 4px; }
  .mockup-dot { width: 6px; height: 6px; border-radius: 50%; background: #74c69d; }
  .mockup-label { font-size: .58rem; color: rgba(255,255,255,.55); }
  .mockup-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; }
  .m-cell { background: rgba(255,255,255,.09); border-radius: 7px; padding: 7px 6px 6px; display: flex; flex-direction: column; justify-content: space-between; min-height: 60px; }
  .m-pct { font-size: .72rem; font-weight: 700; color: #fff; }
  .m-lbl { font-size: .5rem; color: rgba(255,255,255,.45); margin-top: 1px; }
  .m-bars { display: flex; align-items: flex-end; gap: 2px; height: 20px; margin-top: 3px; }
  .m-bar { flex: 1; border-radius: 1px 1px 0 0; opacity: .75; }
  .m-emoji { font-size: 1.5rem; margin: 2px 0; }
  .m-donut { width: 26px; height: 26px; border-radius: 50%; margin: 3px auto 0; background: conic-gradient(#74c69d 0% 58%, rgba(255,255,255,.14) 58% 100%); }

  @media (max-width: 720px) {
    .hero { flex-direction: column; padding: 30px 22px; }
    .hero-mockup { width: 100%; }
    .hero-main-title { font-size: 1.8rem; }
  }

  /* Section head */
  .section-head { display: flex; align-items: center; gap: 9px; margin-bottom: 16px; }
  .section-icon { width: 26px; height: 26px; color: #40b077; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.18rem; font-weight: 700; color: #111827; }

  /* Tool grid */
  .tool-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 40px; }
  @media (max-width: 580px) { .tool-grid { grid-template-columns: 1fr; } }

  .tool-card {
    background: #fff; border: 1px solid #e4eae6; border-radius: 16px;
    padding: 22px 20px 20px; cursor: pointer;
    transition: box-shadow .2s, transform .15s, border-color .2s;
    display: flex; align-items: flex-start; gap: 14px;
  }
  .tool-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.08); transform: translateY(-2px); border-color: #74c69d; }
  .tool-icon-wrap { width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.3rem; }
  .tool-info { flex: 1; }
  .tool-name { font-weight: 600; font-size: .97rem; color: #111827; margin-bottom: 4px; }
  .tool-desc { font-size: .78rem; color: #9ca3af; line-height: 1.45; }
  .tool-arrow { color: #9ca3af; font-size: 1.2rem; flex-shrink: 0; align-self: center; }

  /* Detail view */
  .detail-view { animation: fadeIn .22s ease; margin-bottom: 40px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

  .detail-back-btn {
    display: inline-flex; align-items: center; gap: 8px; background: none; border: none;
    cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 1.1rem; font-weight: 700;
    color: #111827; padding: 0; margin-bottom: 22px; transition: color .15s;
  }
  .detail-back-btn:hover { color: #40b077; }
  .detail-back-btn svg { width: 20px; height: 20px; }

  .detail-card { background: #fff; border-radius: 18px; border: 1px solid #e4eae6; overflow: hidden; box-shadow: 0 2px 18px rgba(0,0,0,.05); }
  .detail-top-bar { height: 5px; background: linear-gradient(90deg, #40b077, #74c69d); }
  .detail-body { padding: 32px 32px 30px; }

  .detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
  .detail-icon { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.7rem; flex-shrink: 0; }
  .detail-head-title { font-size: 1.35rem; font-weight: 700; color: #111827; }
  .detail-desc { font-size: .88rem; color: #4b5563; line-height: 1.65; margin-bottom: 28px; }

  /* Form */
  .d-form-group { margin-bottom: 20px; }
  .d-label { display: block; font-size: .88rem; font-weight: 600; color: #111827; margin-bottom: 8px; }
  .d-input-wrap {
    display: flex; align-items: center;
    border: 1.5px solid #e4eae6; border-radius: 10px; background: #fff;
    transition: border-color .15s, box-shadow .15s; overflow: hidden;
  }
  .d-input-wrap:focus-within { border-color: #40b077; box-shadow: 0 0 0 3px rgba(64,176,119,.12); }
  .d-prefix {
    padding: 0 13px; font-size: .88rem; color: #9ca3af; font-weight: 500;
    border-right: 1.5px solid #e4eae6; height: 48px; display: flex; align-items: center;
    background: #fafafa; white-space: nowrap; flex-shrink: 0;
  }
  .d-input {
    flex: 1; padding: 0 14px; height: 48px; border: none; outline: none;
    font-family: 'DM Sans', sans-serif; font-size: .93rem; color: #111827; background: transparent;
  }
  .d-input::placeholder { color: #c5cdd1; font-style: italic; }
  .d-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 500px) { .d-form-row { grid-template-columns: 1fr; } }

  .calc-btn {
    width: 100%; padding: 13px; background: #40b077; color: #fff;
    border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-size: .95rem; font-weight: 600; cursor: pointer; margin-top: 8px;
    transition: background .15s, transform .1s, box-shadow .15s;
  }
  .calc-btn:hover { background: #2d6a4f; box-shadow: 0 4px 14px rgba(45,106,79,.28); transform: translateY(-1px); }
  .calc-btn:active { transform: none; }

  /* Result */
  .result-box { margin-top: 22px; padding: 18px 20px; background: linear-gradient(135deg,#f0fdf4,#dcfce7); border: 1.5px solid #a7f3d0; border-radius: 12px; }
  .result-loss { background: linear-gradient(135deg,#fff1f2,#fecdd3) !important; border-color: #fda4af !important; }
  .result-label { font-size: .72rem; font-weight: 700; color: #2d6a4f; margin-bottom: 4px; letter-spacing: .05em; text-transform: uppercase; }
  .result-label-loss { color: #991b1b !important; }
  .result-value { font-size: 1.9rem; font-weight: 700; color: #1b4332; line-height: 1.1; }
  .result-value-loss { color: #b91c1c !important; }
  .result-note { font-size: .79rem; color: #4b5563; margin-top: 6px; }
  .result-meta { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 10px; }
  .result-meta-item { font-size: .79rem; color: #4b5563; }
  .result-meta-item strong { color: #111827; }

  /* Formula hint */
  .formula-hint {
    display: flex; align-items: flex-start; gap: 10px;
    margin-top: 24px; padding: 13px 16px;
    background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px;
  }
  .formula-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
  .formula-text { font-size: .8rem; color: #92400e; line-height: 1.55; }

  /* Market */
  .market-card { background: #fff; border: 1px solid #e4eae6; border-radius: 16px; overflow: hidden; }
  .market-header { padding: 16px 22px; border-bottom: 1px solid #e4eae6; display: flex; align-items: center; justify-content: space-between; }
  .market-tag { font-size: .69rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; background: #d8f3dc; color: #40b077; padding: 4px 11px; border-radius: 20px; border: 1px solid #74c69d; }
  .market-refresh { font-size: .74rem; color: #9ca3af; }
  .market-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; border-bottom: 1px solid #f3f6f4; transition: background .12s; }
  .market-row:last-child { border-bottom: none; }
  .market-row:hover { background: #f9fdf9; }
  .market-crop { display: flex; align-items: center; gap: 12px; }
  .crop-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; }
  .crop-name { font-weight: 500; font-size: .92rem; }
  .crop-unit { font-size: .73rem; color: #9ca3af; margin-top: 2px; }
  .market-right { display: flex; align-items: center; gap: 18px; }
  .sparkline { display: flex; align-items: flex-end; gap: 3px; height: 26px; }
  .spark-bar { width: 5px; border-radius: 2px 2px 0 0; }
  .market-price { text-align: right; }
  .price-val { font-weight: 700; font-size: .97rem; }
  .price-change { font-size: .73rem; font-weight: 600; margin-top: 2px; display: flex; align-items: center; justify-content: flex-end; gap: 3px; }
  .price-up { color: #16a34a; }
  .price-down { color: #dc2626; }
`;

// ─── Market Data ─────────────────────────────────────────────────────────────
const MARKET_DATA = [
  { name: "Corn (Maize)",   unit: "per quintal", price: 2_800, change: +2.4, icon: "🌽", bg: "#fef9c3", sparks: [60,75,55,80,72,90,85] },
  { name: "Soybeans",       unit: "per quintal", price: 5_400, change: -1.1, icon: "🫘", bg: "#fce7f3", sparks: [80,90,95,88,70,65,60] },
  { name: "Wheat",          unit: "per quintal", price: 3_950, change: +0.8, icon: "🌾", bg: "#fef3c7", sparks: [50,60,65,70,68,75,80] },
  { name: "Coffee (Green)", unit: "per kg",      price: 680,   change: +3.2, icon: "☕", bg: "#ede9fe", sparks: [40,55,60,72,78,85,95] },
  { name: "Teff",           unit: "per quintal", price: 7_200, change: -0.5, icon: "🌿", bg: "#d1fae5", sparks: [90,85,88,82,80,75,78] },
];

// ─── Tool Definitions ─────────────────────────────────────────────────────────
const TOOLS = [
  {
    id: "required_yield", name: "Required Yield", desc: "Calculate minimum production to break even.",
    icon: "🌱", iconBg: "#ecfdf5",
    detailTitle: "Break-Even Yield",
    detailDesc: "Find out the minimum quantity you must produce to cover all costs.",
  },
  {
    id: "max_budget", name: "Max Budget", desc: "Safe investment limit based on targets.",
    icon: "💼", iconBg: "#fffbeb",
    detailTitle: "Maximum Budget",
    detailDesc: "Determine the highest amount you can safely invest given your expected yield and profit margin target.",
  },
  {
    id: "no_loss_price", name: "No-Loss Price", desc: "Minimum selling price to avoid financial loss.",
    icon: "🧮", iconBg: "#eff6ff",
    detailTitle: "No-Loss Price",
    detailDesc: "Calculate the minimum price per unit you must sell at to fully recover your costs.",
  },
  {
    id: "profit_estimator", name: "Profit Estimator", desc: "Full analysis of your potential earnings.",
    icon: "📊", iconBg: "#faf5ff",
    detailTitle: "Profit Estimator",
    detailDesc: "Get a complete breakdown of your revenue, net profit, ROI percentage, and earnings per hectare.",
  },
];

// ─── Calculations ─────────────────────────────────────────────────────────────
const doCalc = {
  required_yield: ({ totalExpenses, sellingPrice }) => {
    const te = parseFloat(totalExpenses), sp = parseFloat(sellingPrice);
    if (!te || !sp || sp === 0) return null;
    return { yield: (te / sp).toFixed(2) };
  },
  max_budget: ({ expectedYield, pricePerUnit, profitMargin }) => {
    const y = parseFloat(expectedYield), p = parseFloat(pricePerUnit), m = (parseFloat(profitMargin) || 0) / 100;
    if (!y || !p) return null;
    const revenue = y * p;
    return { budget: (revenue * (1 - m)).toFixed(2), revenue: revenue.toFixed(2) };
  },
  no_loss_price: ({ totalCost, expectedYield }) => {
    const tc = parseFloat(totalCost), y = parseFloat(expectedYield);
    if (!tc || !y || y === 0) return null;
    return { price: (tc / y).toFixed(2) };
  },
  profit_estimator: ({ totalCost, expectedYield, sellingPrice, area }) => {
    const tc = parseFloat(totalCost), y = parseFloat(expectedYield), sp = parseFloat(sellingPrice), a = parseFloat(area) || 1;
    if (!tc || !y || !sp) return null;
    const revenue = y * sp, profit = revenue - tc;
    return { revenue: revenue.toFixed(2), profit: profit.toFixed(2), roi: (profit / tc * 100).toFixed(1), perHa: (profit / a).toFixed(2), isProfit: profit >= 0 };
  },
};

// ─── Shared Input Component ───────────────────────────────────────────────────
function Inp({ label, id, placeholder, value, onChange, prefix = "ETB" }) {
  return (
    <div className="d-form-group">
      <label className="d-label" htmlFor={id}>{label}</label>
      <div className="d-input-wrap">
        <span className="d-prefix">{prefix}</span>
        <input id={id} className="d-input" type="number" placeholder={placeholder} value={value} onChange={onChange} />
      </div>
    </div>
  );
}

// ─── Detail Form Panels ───────────────────────────────────────────────────────
function RequiredYieldDetail() {
  const [f, setF] = useState({ totalExpenses: "", sellingPrice: "" });
  const [res, setRes] = useState(null);
  const s = k => e => { setF(p => ({ ...p, [k]: e.target.value })); setRes(null); };
  return (
    <>
      <Inp label="Total Expenses (ETB)" id="te" placeholder="e.g. 50000" value={f.totalExpenses} onChange={s("totalExpenses")} />
      <Inp label="Selling Price (per Unit)" id="sp" placeholder="e.g. 200" value={f.sellingPrice} onChange={s("sellingPrice")} />
      <button className="calc-btn" onClick={() => setRes(doCalc.required_yield(f))}>Calculate Break-Even Yield</button>
      {res && (
        <div className="result-box">
          <div className="result-label">Minimum Yield to Break Even</div>
          <div className="result-value">{Number(res.yield).toLocaleString()} units</div>
          <div className="result-note">You must produce at least this many units to recover all expenses.</div>
        </div>
      )}
      <div className="formula-hint">
        <span className="formula-icon">⚠️</span>
        <span className="formula-text">Formula: Total Expenses ÷ Selling Price. Ensure you include labor and equipment depreciation.</span>
      </div>
    </>
  );
}

function MaxBudgetDetail() {
  const [f, setF] = useState({ expectedYield: "", pricePerUnit: "", profitMargin: "20" });
  const [res, setRes] = useState(null);
  const s = k => e => { setF(p => ({ ...p, [k]: e.target.value })); setRes(null); };
  return (
    <>
      <div className="d-form-row">
        <Inp label="Expected Yield (units)" id="ey" placeholder="e.g. 300" value={f.expectedYield} onChange={s("expectedYield")} prefix="#" />
        <Inp label="Price per Unit (ETB)" id="ppu" placeholder="e.g. 2800" value={f.pricePerUnit} onChange={s("pricePerUnit")} />
      </div>
      <Inp label="Target Profit Margin (%)" id="pm" placeholder="e.g. 20" value={f.profitMargin} onChange={s("profitMargin")} prefix="%" />
      <button className="calc-btn" onClick={() => setRes(doCalc.max_budget(f))}>Calculate Max Budget</button>
      {res && (
        <div className="result-box">
          <div className="result-label">Maximum Safe Investment</div>
          <div className="result-value">ETB {Number(res.budget).toLocaleString()}</div>
          <div className="result-note">Based on projected revenue of ETB {Number(res.revenue).toLocaleString()}</div>
        </div>
      )}
      <div className="formula-hint">
        <span className="formula-icon">⚠️</span>
        <span className="formula-text">Formula: (Yield × Price) × (1 − Margin%). Spending above this risks missing your target profit.</span>
      </div>
    </>
  );
}

function NoLossPriceDetail() {
  const [f, setF] = useState({ totalCost: "", expectedYield: "" });
  const [res, setRes] = useState(null);
  const s = k => e => { setF(p => ({ ...p, [k]: e.target.value })); setRes(null); };
  return (
    <>
      <div className="d-form-row">
        <Inp label="Total Cost (ETB)" id="tc" placeholder="e.g. 50000" value={f.totalCost} onChange={s("totalCost")} />
        <Inp label="Expected Yield (units)" id="ey2" placeholder="e.g. 300" value={f.expectedYield} onChange={s("expectedYield")} prefix="#" />
      </div>
      <button className="calc-btn" onClick={() => setRes(doCalc.no_loss_price(f))}>Calculate No-Loss Price</button>
      {res && (
        <div className="result-box">
          <div className="result-label">Minimum Selling Price</div>
          <div className="result-value">ETB {Number(res.price).toLocaleString()} / unit</div>
          <div className="result-note">Selling below this price results in a financial loss.</div>
        </div>
      )}
      <div className="formula-hint">
        <span className="formula-icon">⚠️</span>
        <span className="formula-text">Formula: Total Cost ÷ Expected Yield. Factor in post-harvest losses for a safer price margin.</span>
      </div>
    </>
  );
}

function ProfitEstimatorDetail() {
  const [f, setF] = useState({ totalCost: "", expectedYield: "", sellingPrice: "", area: "" });
  const [res, setRes] = useState(null);
  const s = k => e => { setF(p => ({ ...p, [k]: e.target.value })); setRes(null); };
  return (
    <>
      <div className="d-form-row">
        <Inp label="Total Cost (ETB)" id="tc2" placeholder="e.g. 50000" value={f.totalCost} onChange={s("totalCost")} />
        <Inp label="Expected Yield (units)" id="ey3" placeholder="e.g. 300" value={f.expectedYield} onChange={s("expectedYield")} prefix="#" />
      </div>
      <div className="d-form-row">
        <Inp label="Selling Price / Unit (ETB)" id="sp2" placeholder="e.g. 2800" value={f.sellingPrice} onChange={s("sellingPrice")} />
        <Inp label="Farm Area (hectares)" id="ar" placeholder="e.g. 5" value={f.area} onChange={s("area")} prefix="ha" />
      </div>
      <button className="calc-btn" onClick={() => setRes(doCalc.profit_estimator(f))}>Estimate Profit</button>
      {res && (
        <div className={`result-box${res.isProfit ? "" : " result-loss"}`}>
          <div className={`result-label${res.isProfit ? "" : " result-label-loss"}`}>{res.isProfit ? "Estimated Profit" : "Estimated Loss"}</div>
          <div className={`result-value${res.isProfit ? "" : " result-value-loss"}`}>ETB {Number(Math.abs(res.profit)).toLocaleString()}</div>
          <div className="result-meta">
            <span className="result-meta-item">Revenue: <strong>ETB {Number(res.revenue).toLocaleString()}</strong></span>
            <span className="result-meta-item">ROI: <strong>{res.roi}%</strong></span>
            <span className="result-meta-item">Per hectare: <strong>ETB {Number(res.perHa).toLocaleString()}</strong></span>
          </div>
        </div>
      )}
      <div className="formula-hint">
        <span className="formula-icon">⚠️</span>
        <span className="formula-text">Formula: (Yield × Price) − Total Cost. Cross-check prices with the Recommended Crops section below.</span>
      </div>
    </>
  );
}

const DETAIL_PANELS = {
  required_yield:   <RequiredYieldDetail />,
  max_budget:       <MaxBudgetDetail />,
  no_loss_price:    <NoLossPriceDetail />,
  profit_estimator: <ProfitEstimatorDetail />,
};

// ─── Market Row ───────────────────────────────────────────────────────────────
function MarketRow({ crop }) {
  const up = crop.change >= 0;
  return (
    <div className="market-row">
      <div className="market-crop">
        <div className="crop-icon" style={{ background: crop.bg }}>{crop.icon}</div>
        <div>
          <div className="crop-name">{crop.name}</div>
          <div className="crop-unit">{crop.unit}</div>
        </div>
      </div>
      <div className="market-right">
        <div className="sparkline">
          {crop.sparks.map((h, i) => (
            <div key={i} className="spark-bar" style={{ height: `${h}%`, background: up ? "#74c69d" : "#fca5a5" }} />
          ))}
        </div>
        <div className="market-price">
          <div className="price-val">ETB {crop.price.toLocaleString()}</div>
          <div className={`price-change ${up ? "price-up" : "price-down"}`}>
            {up ? "▲" : "▼"} {Math.abs(crop.change)}% this week
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTool, setActiveTool] = useState(null);
  const tool = activeTool ? TOOLS.find(t => t.id === activeTool) : null;

  return (
    <>
      <style>{css}</style>

      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-logo">🌱</div>
          AgriProfit
        </div>
        <div className="nav-actions">
          <button className="nav-btn" title="Profile">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </button>
          <button className="nav-btn" title="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      <div className="page">

        {/* Hero */}
        <div className="hero">
          <div className="hero-text">
            <div className="hero-main-title">Maximize Your<br/>Farm Profit</div>
            <div className="hero-subtitle">
              Data-driven decisions for modern agriculture. Use our smart calculators
              to analyze risks and optimize your harvest.
            </div>
            <div className="hero-tip-label">Today's Tip</div>
            <div className="hero-tip-text">Check market prices before finalizing your budget.</div>
          </div>
          <div className="hero-mockup">
            <div className="mockup-topbar">
              <div className="mockup-dots">
                {[1, .5, .3].map((o, i) => <div key={i} className="mockup-dot" style={{ opacity: o }} />)}
              </div>
              <span className="mockup-label">AgriProfit Dashboard</span>
            </div>
            <div className="mockup-grid">
              <div className="m-cell" style={{ gridColumn: "span 2", minHeight: 68 }}>
                <div className="m-pct">349 %</div>
                <div className="m-emoji">🚜</div>
              </div>
              <div className="m-cell"><div className="m-emoji" style={{ fontSize: "1.3rem" }}>🌾</div></div>
              <div className="m-cell" style={{ minHeight: 72 }}>
                <div><div className="m-pct">68 %</div><div className="m-lbl">Total Production</div></div>
                <div className="m-bars">{[40,70,55,80,65,90].map((h,i)=><div key={i} className="m-bar" style={{ height:`${h}%`, background:"#74c69d" }} />)}</div>
              </div>
              <div className="m-cell" style={{ minHeight: 72 }}>
                <div><div className="m-pct">76 %</div><div className="m-lbl">Profit Rates</div></div>
                <div className="m-emoji" style={{ fontSize: "1.2rem" }}>👨‍🌾</div>
              </div>
              <div className="m-cell" style={{ minHeight: 72 }}>
                <div><div className="m-pct">518 %</div><div className="m-lbl">Yield Bonus</div></div>
                <div className="m-bars">{[30,50,80,60,90,75].map((h,i)=><div key={i} className="m-bar" style={{ height:`${h}%`, background:"#fcd34d" }} />)}</div>
              </div>
              <div className="m-cell">
                <div><div className="m-pct">58 %</div><div className="m-lbl">Sustainability</div></div>
                <div className="m-donut" />
              </div>
              <div className="m-cell">
                <div><div className="m-pct">49 %</div><div className="m-lbl">Yield Pressure</div></div>
                <div className="m-bars">{[60,45,70,55,80].map((h,i)=><div key={i} className="m-bar" style={{ height:`${h}%`, background:"#86efac" }} />)}</div>
              </div>
              <div className="m-cell">
                <div><div className="m-pct">64 %</div><div className="m-lbl">Analytics</div></div>
                <div style={{ width:22, height:22, borderRadius:"50%", border:"3px solid rgba(255,255,255,.25)", borderTopColor:"#74c69d", margin:"4px auto 0" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Tools */}
        <div className="section-head">
          <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            <polyline points="17 6 23 6 23 12"/>
          </svg>
          <span className="section-title">Financial Tools</span>
        </div>

        {!activeTool ? (
          /* 2×2 grid of cards */
          <div className="tool-grid">
            {TOOLS.map(t => (
              <div key={t.id} className="tool-card" onClick={() => setActiveTool(t.id)}>
                <div className="tool-icon-wrap" style={{ background: t.iconBg }}>{t.icon}</div>
                <div className="tool-info">
                  <div className="tool-name">{t.name}</div>
                  <div className="tool-desc">{t.desc}</div>
                </div>
                <span className="tool-arrow">›</span>
              </div>
            ))}
          </div>
        ) : (
          /* Full detail panel for one tool */
          <div className="detail-view">
            <button className="detail-back-btn" onClick={() => setActiveTool(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              {tool.name}
            </button>
            <div className="detail-card">
              <div className="detail-top-bar" />
              <div className="detail-body">
                <div className="detail-header">
                  <div className="detail-icon" style={{ background: tool.iconBg }}>{tool.icon}</div>
                  <div className="detail-head-title">{tool.detailTitle}</div>
                </div>
                <div className="detail-desc">{tool.detailDesc}</div>
                {DETAIL_PANELS[tool.id]}
              </div>
            </div>
          </div>
        )}

        {/* Market Data */}
        <div className="section-head">
          <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span className="section-title">Recommended Crops (Market Data)</span>
        </div>

        <div className="market-card">
          <div className="market-header">
            <span className="market-tag">Live Prices</span>
            <span className="market-refresh">Updated today · Prices in ETB</span>
          </div>
          {MARKET_DATA.map(crop => <MarketRow key={crop.name} crop={crop} />)}
        </div>

      </div>
    </>
  );
}
