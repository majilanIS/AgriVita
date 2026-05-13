import React, { useState } from 'react'

/* ─── tiny helpers ─── */
const Badge = ({ type, label }) => {
  const styles = {
    high:     { bg: '#fde8e8', color: '#c0392b', border: '#f5c6c6' },
    healthy:  { bg: '#e6f4ea', color: '#2d6b3e', border: '#b7dfc4' },
    moderate: { bg: '#fef3e2', color: '#7c5a00', border: '#f5dcaa' },
  }
  const s = styles[type] || styles.moderate
  return (
    <span style={{
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  )
}

/* ─── Bar Chart ─── */
const BarChart = ({ period }) => {
  const weekData = [
    { day: 'Mon',   val: 52 },
    { day: 'Tue',   val: 68 },
    { day: 'Wed',   val: 62 },
    { day: 'Today', val: 88, highlight: true },
    { day: 'Fri',   val: 74 },
    { day: 'Sat',   val: 58 },
  ]
  const monthData = [
    { day: 'Wk 1', val: 60 },
    { day: 'Wk 2', val: 75 },
    { day: 'Wk 3', val: 70 },
    { day: 'Wk 4', val: 85, highlight: true },
  ]
  const data = period === 'Weekly' ? weekData : monthData
  const max = 100

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', paddingBottom: '28px', position: 'relative' }}>
      {data.map((d) => (
        <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
          <div
            style={{
              width: '100%',
              height: `${(d.val / max) * 100}%`,
              borderRadius: '8px 8px 0 0',
              background: d.highlight
                ? 'linear-gradient(180deg, #3a8a48 0%, #2d6b3e 100%)'
                : 'linear-gradient(180deg, #a8d5b0 0%, #c5e3cb 100%)',
              transition: 'height 0.5s ease',
              position: 'relative',
            }}
          >
            {d.highlight && (
              <div style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#2d6b3e',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
              }}>
                {d.val}%
              </div>
            )}
          </div>
          <span style={{
            marginTop: '8px',
            fontSize: '12px',
            color: d.highlight ? '#2d6b3e' : '#8faa8b',
            fontWeight: d.highlight ? 700 : 400,
            position: 'absolute',
            bottom: 0,
          }}>
            {d.day}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Quick Action Card ─── */
const ActionCard = ({ icon, iconBg, title, desc }) => (
  <div
    style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '24px 20px',
      cursor: 'pointer',
      border: '1px solid #e8f0e4',
      transition: 'all 0.2s ease',
      flex: '1',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(45,107,62,0.1)' }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
  >
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px',
      backgroundColor: iconBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '14px',
    }}>
      {icon}
    </div>
    <div style={{ fontWeight: 700, fontSize: '15px', color: '#1e3a24', marginBottom: '6px' }}>{title}</div>
    <div style={{ fontSize: '13px', color: '#7a9680', lineHeight: 1.5 }}>{desc}</div>
  </div>
)

/* ─── Activity Row ─── */
const ActivityRow = ({ img, title, subtitle, badge, badgeType, detail }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 0',
    borderBottom: '1px solid #f0f5ed',
  }}>
    <img
      src={img}
      alt={title}
      style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e3a24' }}>{title}</div>
      <div style={{ fontSize: '12px', color: '#8faa8b', marginTop: '2px' }}>{subtitle}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
      <Badge type={badgeType} label={badge} />
      <span style={{ fontSize: '12px', color: '#7a9680' }}>{detail}</span>
    </div>
  </div>
)

/* ─── MAIN COMPONENT ─── */
const MainDashboard = () => {
  const [period, setPeriod] = useState('Weekly')

  return (
    <main
      style={{
        minHeight: '100%',
        backgroundColor: '#f2f6ed',
        padding: '32px 36px 48px',
        fontFamily: "'DM Sans', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {/* ── Top Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a24', margin: 0, letterSpacing: '-0.5px' }}>
            Welcome back, Farmer
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#7a9680' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="currentColor"/>
              </svg>
              Central Valley, CA
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#7a9680' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="#f5a623"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="#f5a623" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              74°F Sunny
            </span>
          </div>
        </div>

        {/* Farm Health Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '14px 20px',
          border: '1px solid #e8f0e4',
          boxShadow: '0 2px 8px rgba(45,107,62,0.06)',
        }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#8faa8b', letterSpacing: '1px', textTransform: 'uppercase' }}>Farm Health</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a24' }}>85%</span>
              <Badge type="healthy" label="Healthy" />
            </div>
          </div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid #e8f0e4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'conic-gradient(#3a8a48 0% 85%, #e8f0e4 85% 100%)',
            position: 'relative',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              backgroundColor: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M12 3C8 3 4 7 4 12c0 3 1.5 5.5 4 7" stroke="#2d6b3e" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 3c4 0 8 4 8 9 0 3-1.5 5.5-4 7" stroke="#2d6b3e" strokeWidth="2" strokeLinecap="round"/>
                <path d="M12 3v18" stroke="#2d6b3e" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row: Quick Actions + Chart ── */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '280px', flexShrink: 0 }}>
          <ActionCard
            iconBg="#e8f5e2"
            title="Scan Crop"
            desc="Identify diseases and pests using AI imaging in the field."
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="#2d6b3e" strokeWidth="1.8"/>
                <circle cx="12" cy="12" r="3" stroke="#2d6b3e" strokeWidth="1.8"/>
                <path d="M9 4h6" stroke="#2d6b3e" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            }
          />
          <ActionCard
            iconBg="#e8f5e2"
            title="Weather Forecast"
            desc="10-day precision agricultural weather insights."
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M18 10a6 6 0 10-11.8 1.5A4 4 0 106 18h12a4 4 0 000-8z" stroke="#2d6b3e" strokeWidth="1.8" strokeLinejoin="round"/>
              </svg>
            }
          />
          <ActionCard
            iconBg="#fde8ea"
            title="Crop Health"
            desc="Review historical health trends for your active fields."
            icon={
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M4 20V9l8-6 8 6v11" stroke="#c0392b" strokeWidth="1.8" strokeLinejoin="round"/>
                <rect x="9" y="14" width="6" height="6" rx="1" stroke="#c0392b" strokeWidth="1.8"/>
              </svg>
            }
          />
        </div>

        {/* Farm Health Chart */}
        <div style={{
          flex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '24px 28px',
          border: '1px solid #e8f0e4',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px', color: '#1e3a24' }}>Today's Farm Health</div>
              <div style={{ fontSize: '12px', color: '#8faa8b', marginTop: '3px' }}>Aggregated vitality index across all sectors</div>
            </div>
            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f2f6ed', borderRadius: '10px', padding: '4px' }}>
              {['Weekly', 'Monthly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: period === p ? '#ffffff' : 'transparent',
                    color: period === p ? '#2d6b3e' : '#8faa8b',
                    boxShadow: period === p ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <BarChart period={period} />
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '24px 28px',
        border: '1px solid #e8f0e4',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div style={{ fontWeight: 700, fontSize: '18px', color: '#1e3a24' }}>Recent Activity</div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '13px', color: '#2d6b3e', fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            View All History
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <ActivityRow
          img="https://images.unsplash.com/photo-1601564921647-b446839a013f?w=120&q=80"
          title="Corn Leaf - Sector B4"
          subtitle="Scan completed 2 hours ago"
          badge="High Risk"
          badgeType="high"
          detail="Rust Detected"
        />
        <ActivityRow
          img="https://images.unsplash.com/photo-1561519396-8e82f0d5e521?w=120&q=80"
          title="Soybean Analytics - Sector A1"
          subtitle="Yield prediction updated yesterday"
          badge="Healthy"
          badgeType="healthy"
          detail="Expected 102%"
        />
        <ActivityRow
          img="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=120&q=80"
          title="Soil Moisture Analysis"
          subtitle="Irrigation check scheduled"
          badge="Moderate Risk"
          badgeType="moderate"
          detail="Low Nitrogen"
        />
      </div>

      {/* ── Footer ── */}
      <footer style={{ textAlign: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e4eedd' }}>
        <div style={{ fontWeight: 700, fontSize: '15px', color: '#2d6b3e', marginBottom: '6px' }}>AgriVita AI</div>
        <div style={{ fontSize: '12px', color: '#8faa8b', marginBottom: '12px' }}>
          © 2024 AgriVita AI. Precision Farming for a Greener Planet.
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Contact Support'].map((link) => (
            <a key={link} href="#" style={{ fontSize: '12px', color: '#7a9680', textDecoration: 'none' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#2d6b3e'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#7a9680'}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </main>
  )
}

export default MainDashboard
