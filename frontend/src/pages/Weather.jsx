import React, { useState, useEffect, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE = 'https://api.openweathermap.org/data/2.5';

const ETHIOPIA_CITIES = [
  'Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Bahir Dar',
  'Hawassa', 'Adama', 'Jimma', 'Dessie', 'Jijiga',
  'Arba Minch', 'Harar', 'Shashamane', 'Nekemte', 'Axum'
];

const weatherIcon = (code, size = 40) => {
  const c = String(code);
  let emoji = '🌤';
  if (c.startsWith('2')) emoji = '⛈';
  else if (c.startsWith('3')) emoji = '🌦';
  else if (c.startsWith('5')) emoji = '🌧';
  else if (c.startsWith('6')) emoji = '❄️';
  else if (c.startsWith('7')) emoji = '🌫';
  else if (c === '800') emoji = '☀️';
  else if (c.startsWith('8')) emoji = '⛅';
  return <span style={{ fontSize: size }}>{emoji}</span>;
};

const getRisk = (weather) => {
  if (!weather) return null;
  const humidity = weather.main.humidity;
  const temp = weather.main.temp;
  const rain = weather.rain?.['1h'] || 0;
  if (humidity > 80 && temp > 20) return { level: 'HIGH', label: 'High Disease Risk', color: '#c62828', bg: '#ffebee' };
  if (humidity > 65 || rain > 0) return { level: 'MEDIUM', label: 'Moderate Risk', color: '#f57f17', bg: '#fff8e1' };
  return { level: 'LOW', label: 'Low Risk — Good Conditions', color: '#2e7d32', bg: '#e8f5e9' };
};

const StatCard = ({ label, value, icon }) => (
  <div style={{
    backgroundColor: '#f9fcf8', border: '1px solid #eef3eb',
    borderRadius: '14px', padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: '6px'
  }}>
    <div style={{ fontSize: '20px' }}>{icon}</div>
    <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e3a24' }}>{value}</div>
    <div style={{ fontSize: '12px', color: '#8faa8b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
  </div>
);

const Weather = () => {
  const [selectedCity, setSelectedCity] = useState('Addis Ababa');
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cityWeathers, setCityWeathers] = useState({});
  const [loadingCities, setLoadingCities] = useState(true);

  const fetchWeather = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const [curRes, foreRes] = await Promise.all([
        fetch(`${BASE}/weather?q=${encodeURIComponent(city)},ET&appid=${API_KEY}&units=metric`),
        fetch(`${BASE}/forecast?q=${encodeURIComponent(city)},ET&appid=${API_KEY}&units=metric&cnt=40`)
      ]);
      if (!curRes.ok) throw new Error(`City not found: ${city}`);
      const curData = await curRes.json();
      const foreData = await foreRes.json();

      setCurrent(curData);

      // Group forecast by day (noon readings)
      const days = {};
      foreData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const time = item.dt_txt.split(' ')[1];
        if (!days[date] || time === '12:00:00') days[date] = item;
      });
      setForecast(Object.values(days).slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch quick stats for all cities (just current)
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingCities(true);
      const results = {};
      await Promise.allSettled(
        ETHIOPIA_CITIES.map(async (city) => {
          try {
            const res = await fetch(`${BASE}/weather?q=${encodeURIComponent(city)},ET&appid=${API_KEY}&units=metric`);
            if (res.ok) results[city] = await res.json();
          } catch (_) {}
        })
      );
      setCityWeathers(results);
      setLoadingCities(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity, fetchWeather]);

  const risk = getRisk(current);

  const filteredCities = ETHIOPIA_CITIES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const formatDay = (dtTxt) => {
    const d = new Date(dtTxt);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif", backgroundColor: '#f2f6ed', minHeight: '100%', boxSizing: 'border-box' }}>

      {/* Header */}
      <div style={{ padding: '28px 40px 20px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#1e3a24', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
          🇪🇹 Ethiopia Weather Dashboard
        </h1>
        <p style={{ color: '#6b7c6b', margin: 0, fontSize: '14px' }}>
          Real-time weather for agricultural planning across Ethiopian regions.
        </p>
      </div>

      {/* Body: sidebar + content */}
      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', flex: 1, gap: '0', overflow: 'hidden', padding: '0 40px 40px' }}>

        {/* ── Left: City Selector (sticky, full height) ── */}
        <div style={{
          position: 'sticky',
          top: 0,
          height: 'calc(100vh - 120px)',
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          marginRight: '24px'
        }}>
          {/* Sidebar Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexShrink: 0 }}>
            <div style={{ fontWeight: 800, color: '#1e3a24', fontSize: '15px' }}>Ethiopian Cities</div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#8faa8b', backgroundColor: '#f2f7f1', padding: '3px 8px', borderRadius: '8px' }}>
              {ETHIOPIA_CITIES.length} cities
            </span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px', flexShrink: 0 }}>
            <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8faa8b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              placeholder="Search city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 32px', borderRadius: '10px',
                border: '1px solid #e4eadf', fontSize: '13px', outline: 'none',
                backgroundColor: '#f9fcf8', boxSizing: 'border-box', color: '#1e3a24'
              }}
            />
          </div>

          {/* City list — fills remaining height */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px', paddingRight: '2px' }}>
            {filteredCities.map(city => {
              const cw = cityWeathers[city];
              const isActive = city === selectedCity;
              const cityRisk = cw ? getRisk(cw) : null;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '11px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    backgroundColor: isActive ? '#e8f5e9' : 'transparent',
                    color: isActive ? '#156633' : '#4b5b4b',
                    fontWeight: isActive ? 700 : 500, fontSize: '13.5px',
                    transition: 'all 0.15s ease', textAlign: 'left', flexShrink: 0
                  }}
                  onMouseOver={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f2f7f1'; }}
                  onMouseOut={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span>{city}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {cityRisk && (
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: cityRisk.level === 'HIGH' ? '#c62828' : cityRisk.level === 'MEDIUM' ? '#f57f17' : '#2e7d32', flexShrink: 0 }} />
                    )}
                    {cw ? (
                      <span style={{ fontSize: '13px', color: '#156633', fontWeight: 700 }}>{Math.round(cw.main.temp)}°C</span>
                    ) : loadingCities ? (
                      <span style={{ fontSize: '11px', color: '#b0c8ae' }}>...</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Main weather panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }}>

          {loading && (
            <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '60px', textAlign: 'center', color: '#8faa8b', fontSize: '16px', fontWeight: 600 }}>
              ⏳ Loading weather data...
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: '#ffebee', borderRadius: '20px', padding: '24px', color: '#c62828', fontWeight: 700 }}>
              ⚠️ {error}
            </div>
          )}

          {current && !loading && (
            <>
              {/* Current Weather Card */}
              <div style={{
                background: 'linear-gradient(135deg, #1e3a24 0%, #156633 60%, #2d8a52 100%)',
                borderRadius: '24px', padding: '32px',
                boxShadow: '0 12px 40px rgba(21,102,51,0.2)',
                color: 'white', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', fontSize: '160px', opacity: 0.08, lineHeight: 1 }}>🌿</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, opacity: 0.75, marginBottom: '6px', letterSpacing: '0.5px' }}>
                      📍 {current.name}, Ethiopia
                    </div>
                    <div style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1, letterSpacing: '-2px' }}>
                      {Math.round(current.main.temp)}°C
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 600, marginTop: '8px', opacity: 0.9, textTransform: 'capitalize' }}>
                      {current.weather[0].description}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.7, marginTop: '4px' }}>
                      Feels like {Math.round(current.main.feels_like)}°C • H:{Math.round(current.main.temp_max)}° L:{Math.round(current.main.temp_min)}°
                    </div>
                  </div>
                  <div style={{ fontSize: '90px', lineHeight: 1 }}>
                    {weatherIcon(current.weather[0].id, 80)}
                  </div>
                </div>

                {/* Risk badge */}
                {risk && (
                  <div style={{
                    marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px',
                    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '20px', padding: '8px 16px',
                    fontSize: '13px', fontWeight: 700, backdropFilter: 'blur(4px)'
                  }}>
                    🌱 Agricultural Risk: <span style={{ color: risk.level === 'HIGH' ? '#ff8a80' : risk.level === 'MEDIUM' ? '#ffd54f' : '#b9f6ca' }}>{risk.label}</span>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <StatCard label="Humidity" value={`${current.main.humidity}%`} icon="💧" />
                <StatCard label="Wind Speed" value={`${Math.round(current.wind.speed * 3.6)} km/h`} icon="💨" />
                <StatCard label="Pressure" value={`${current.main.pressure} hPa`} icon="🌡" />
                <StatCard label="Visibility" value={`${(current.visibility / 1000).toFixed(1)} km`} icon="👁" />
              </div>

              {/* Agricultural Conditions Card */}
              <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#1e3a24', marginBottom: '16px' }}>🌾 Agricultural Conditions</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: current.main.humidity > 80 ? '#ffebee' : '#e8f5e9', border: `1px solid ${current.main.humidity > 80 ? '#ffcdd2' : '#c8e6c9'}` }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: current.main.humidity > 80 ? '#c62828' : '#2e7d32' }}>💧 Humidity Level</div>
                    <div style={{ fontWeight: 800, fontSize: '24px', color: '#1e3a24', margin: '4px 0' }}>{current.main.humidity}%</div>
                    <div style={{ fontSize: '12px', color: '#6b7c6b' }}>{current.main.humidity > 80 ? '⚠️ High — fungal disease risk elevated' : current.main.humidity > 65 ? '⚡ Moderate — monitor crops closely' : '✅ Optimal for most crops'}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: current.main.temp > 35 ? '#ffebee' : current.main.temp < 10 ? '#e3f2fd' : '#e8f5e9', border: '1px solid #c8e6c9' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#2e7d32' }}>🌡 Temperature</div>
                    <div style={{ fontWeight: 800, fontSize: '24px', color: '#1e3a24', margin: '4px 0' }}>{Math.round(current.main.temp)}°C</div>
                    <div style={{ fontSize: '12px', color: '#6b7c6b' }}>{current.main.temp > 35 ? '🔥 Heat stress risk for crops' : current.main.temp < 10 ? '❄️ Cold stress risk' : '✅ Suitable growing temperature'}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#f9fcf8', border: '1px solid #eef3eb' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#6b7c6b' }}>💨 Wind</div>
                    <div style={{ fontWeight: 800, fontSize: '24px', color: '#1e3a24', margin: '4px 0' }}>{Math.round(current.wind.speed * 3.6)} km/h</div>
                    <div style={{ fontSize: '12px', color: '#6b7c6b' }}>{current.wind.speed > 10 ? '⚠️ Strong wind — spray applications not advised' : '✅ Calm — good for field operations'}</div>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#f9fcf8', border: '1px solid #eef3eb' }}>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#6b7c6b' }}>☁️ Cloud Cover</div>
                    <div style={{ fontWeight: 800, fontSize: '24px', color: '#1e3a24', margin: '4px 0' }}>{current.clouds.all}%</div>
                    <div style={{ fontSize: '12px', color: '#6b7c6b' }}>{current.clouds.all > 80 ? '🌧 Heavy overcast — rain possible' : current.clouds.all > 40 ? '⛅ Partly cloudy' : '☀️ Clear skies'}</div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              {forecast.length > 0 && (
                <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: '#1e3a24', marginBottom: '16px' }}>📅 5-Day Forecast</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                    {forecast.map((day, i) => (
                      <div key={i} style={{
                        textAlign: 'center', padding: '16px 8px', borderRadius: '16px',
                        backgroundColor: i === 0 ? '#e8f5e9' : '#f9fcf8',
                        border: `1px solid ${i === 0 ? '#c8e6c9' : '#eef3eb'}`
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#8faa8b', marginBottom: '8px', textTransform: 'uppercase' }}>
                          {i === 0 ? 'Today' : formatDay(day.dt_txt)}
                        </div>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{weatherIcon(day.weather[0].id, 28)}</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#1e3a24' }}>{Math.round(day.main.temp)}°</div>
                        <div style={{ fontSize: '11px', color: '#8faa8b', marginTop: '4px', textTransform: 'capitalize' }}>{day.weather[0].description}</div>
                        <div style={{ fontSize: '11px', color: '#156633', fontWeight: 700, marginTop: '6px' }}>💧{day.main.humidity}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;

