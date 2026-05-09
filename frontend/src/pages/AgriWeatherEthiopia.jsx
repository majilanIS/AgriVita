import { useState, useEffect, useCallback } from "react";

const WEATHER_API_KEY = "demo";

const ETHIOPIAN_LOCATIONS = [
  { name: "Addis Ababa", lat: 9.0320, lon: 38.7469, region: "Central Ethiopia", zone: "Addis Ababa City" },
  { name: "Jimma", lat: 7.6667, lon: 36.8333, region: "Oromia", zone: "Jimma Zone" },
  { name: "Hawassa", lat: 7.0621, lon: 38.4772, region: "Sidama", zone: "Hawassa" },
  { name: "Bahir Dar", lat: 11.5931, lon: 37.3907, region: "Amhara", zone: "West Gojjam" },
  { name: "Mekelle", lat: 13.4967, lon: 39.4772, region: "Tigray", zone: "Central Tigray" },
  { name: "Adama", lat: 8.5400, lon: 39.2700, region: "Oromia", zone: "East Shewa" },
  { name: "Dire Dawa", lat: 9.5900, lon: 41.8600, region: "Dire Dawa", zone: "Dire Dawa" },
  { name: "Gondar", lat: 12.6000, lon: 37.4667, region: "Amhara", zone: "North Gondar" },
];

const MOCK_WEATHER = {
  current: {
    temp: 22,
    feels_like: 20,
    humidity: 74,
    wind_speed: 3.2,
    wind_deg: 180,
    uvi: 6.2,
    weather: [{ main: "Clouds", description: "partly cloudy", icon: "02d" }],
    rain_prob: 0.65,
    visibility: 9000,
    dt: Date.now() / 1000,
  },
  daily: [
    { day: "Today", max: 24, min: 14, rain_prob: 0.65, icon: "02d", condition: "Partly Cloudy" },
    { day: "Tue", max: 20, min: 12, rain_prob: 0.85, icon: "10d", condition: "Rain" },
    { day: "Wed", max: 18, min: 11, rain_prob: 0.90, icon: "09d", condition: "Heavy Rain" },
    { day: "Thu", max: 22, min: 13, rain_prob: 0.40, icon: "03d", condition: "Cloudy" },
    { day: "Fri", max: 26, min: 15, rain_prob: 0.15, icon: "01d", condition: "Sunny" },
  ],
};

const WEATHER_ICONS = {
  "01d": "☀️", "01n": "🌙", "02d": "⛅", "02n": "🌤️",
  "03d": "☁️", "03n": "☁️", "04d": "☁️", "04n": "☁️",
  "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌦️",
  "11d": "⛈️", "11n": "⛈️", "13d": "❄️", "50d": "🌫️",
};

function generateInsights(weather) {
  const insights = [];
  const alerts = [];
  const { humidity, wind_speed, uvi, rain_prob, temp } = weather;

  if (humidity > 70 && temp > 18) {
    alerts.push({
      type: "disease",
      severity: "high",
      icon: "🍄",
      title: "Fungal Disease Risk",
      message: "High humidity and warm temperatures may favor fungal disease development. Monitor leaves for early symptoms of rust, blight, or mildew.",
      crops: ["Coffee", "Maize", "Teff"],
    });
  }

  if (rain_prob > 0.6) {
    insights.push({
      type: "spray",
      icon: "🚫",
      title: "Delay Pesticide Application",
      message: "Rain expected soon. Avoid spraying — rain will wash away pesticides before absorption.",
      action: "Schedule after rain clears",
    });
  }

  if (wind_speed > 5) {
    insights.push({
      type: "wind",
      icon: "💨",
      title: "Strong Wind Advisory",
      message: "Wind speed is elevated. Avoid spraying pesticides or fertilizers to prevent drift.",
      action: "Wait for calmer conditions",
    });
  }

  if (uvi > 6) {
    insights.push({
      type: "uv",
      icon: "☀️",
      title: "High UV Index",
      message: "Intense sunlight today. Young seedlings may experience heat stress. Consider mulching or light shade covers.",
      action: "Protect sensitive crops",
    });
  }

  if (rain_prob < 0.2 && temp > 24) {
    insights.push({
      type: "irrigation",
      icon: "💧",
      title: "Irrigation Recommended",
      message: "Hot, dry conditions expected. Soil moisture may drop significantly. Plan irrigation for early morning.",
      action: "irrigate within 24 hours",
    });
  }

  if (rain_prob > 0.7) {
    insights.push({
      type: "harvest",
      icon: "🌾",
      title: "Harvest Timing",
      message: "Heavy rain forecast. If crops are at harvest stage, prioritize collection before moisture causes quality loss.",
      action: "Prioritize harvesting",
    });
  }

  return { insights, alerts };
}

function WindDirection({ deg }) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const dir = dirs[Math.round(deg / 45) % 8];
  return <span className="wind-dir">{dir}</span>;
}

function UVBar({ uvi }) {
  const pct = Math.min((uvi / 11) * 100, 100);
  const color = uvi < 3 ? "#4a7c59" : uvi < 6 ? "#c8a96e" : uvi < 8 ? "#c8744a" : "#8b3a3a";
  const label = uvi < 3 ? "Low" : uvi < 6 ? "Moderate" : uvi < 8 ? "High" : "Very High";
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#7a6652" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color }}>{uvi.toFixed(1)}</span>
      </div>
      <div style={{ background: "#e8ddd0", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.length > 1) {
      setResults(ETHIOPIAN_LOCATIONS.filter(l =>
        l.name.toLowerCase().includes(q.toLowerCase()) ||
        l.zone.toLowerCase().includes(q.toLowerCase())
      ));
    } else {
      setResults([]);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 10, padding: "8px 14px", gap: 8, backdropFilter: "blur(8px)" }}>
        <span style={{ fontSize: 16, opacity: 0.8 }}>🔍</span>
        <input
          value={query}
          onChange={handleInput}
          placeholder="Search location, woreda, zone…"
          style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, flex: 1, fontFamily: "inherit" }}
        />
      </div>
      {results.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, background: "#fffdf8", border: "1px solid #d4c4a8", borderRadius: 10, boxShadow: "0 8px 24px rgba(80,56,30,0.15)", zIndex: 100, overflow: "hidden" }}>
          {results.map((loc) => (
            <button
              key={loc.name}
              onClick={() => { onSelect(loc); setQuery(""); setResults([]); }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", borderBottom: "1px solid #ede4d6", cursor: "pointer", fontFamily: "inherit" }}
            >
              <div style={{ fontWeight: 600, color: "#2d4a1e", fontSize: 14 }}>{loc.name}</div>
              <div style={{ color: "#7a6652", fontSize: 12 }}>{loc.zone} · {loc.region}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight, isAlert }) {
  const [hovered, setHovered] = useState(false);
  const bgColor = isAlert ? (hovered ? "#fdf0e8" : "#fef9f5") : (hovered ? "#f0f5eb" : "#f7faf3");
  const borderColor = isAlert ? "#c8744a" : "#5a8a3a";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: 14,
        padding: "16px 18px",
        cursor: "default",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 6px 20px rgba(${isAlert ? "200,116,74" : "90,138,58"},0.15)` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{insight.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: isAlert ? "#8b3a1a" : "#2d4a1e" }}>{insight.title}</span>
            {isAlert && (
              <span style={{ fontSize: 10, background: "#c8744a", color: "#fff", borderRadius: 6, padding: "2px 8px", fontWeight: 600, letterSpacing: 0.5 }}>ALERT</span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#5c4a32", lineHeight: 1.5 }}>{insight.message}</p>
          {(insight.action || insight.crops) && (
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {insight.action && (
                <span style={{ fontSize: 11, background: isAlert ? "#c8744a22" : "#5a8a3a22", color: isAlert ? "#8b3a1a" : "#2d5a14", borderRadius: 6, padding: "3px 10px", fontWeight: 600 }}>
                  → {insight.action}
                </span>
              )}
              {insight.crops && insight.crops.map(c => (
                <span key={c} style={{ fontSize: 11, background: "#e8d5b722", color: "#6b4f2a", borderRadius: 6, padding: "3px 10px", border: "1px solid #d4b87a" }}>{c}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, unit, icon, sub }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#f0ede6" : "#f7f4ee",
        border: "1px solid #ddd0be",
        borderRadius: 14,
        padding: "16px 18px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 4px 16px rgba(80,56,30,0.10)" : "none",
        cursor: "default",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: "#9a8570", fontWeight: 500, marginBottom: 6, letterSpacing: 0.3 }}>{label.toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#2d3a1e", letterSpacing: -0.5 }}>
            {value}<span style={{ fontSize: 14, fontWeight: 500, color: "#7a6652", marginLeft: 3 }}>{unit}</span>
          </div>
          {sub && <div style={{ fontSize: 12, color: "#9a8570", marginTop: 4 }}>{sub}</div>}
        </div>
        <span style={{ fontSize: 26, opacity: 0.75 }}>{icon}</span>
      </div>
    </div>
  );
}

function ForecastCard({ day, isFirst }) {
  const [selected, setSelected] = useState(false);
  return (
    <div
      onClick={() => setSelected(!selected)}
      style={{
        background: selected ? "#e8f0e0" : "#f7f4ee",
        border: selected ? "1.5px solid #5a8a3a" : "1px solid #ddd0be",
        borderRadius: 14,
        padding: "14px 10px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: selected ? "translateY(-3px)" : "none",
        boxShadow: selected ? "0 6px 18px rgba(90,138,58,0.18)" : "none",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: selected ? "#2d5a14" : "#7a6652", letterSpacing: 0.5, marginBottom: 8 }}>
        {day.day.toUpperCase()}
      </div>
      <div style={{ fontSize: 24, marginBottom: 6 }}>{WEATHER_ICONS[day.icon] || "🌤️"}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#2d3a1e" }}>{day.max}°</div>
      <div style={{ fontSize: 11, color: "#9a8570" }}>{day.min}°</div>
      <div style={{ marginTop: 6, fontSize: 11, color: day.rain_prob > 0.6 ? "#1e5ba0" : "#9a8570", fontWeight: day.rain_prob > 0.6 ? 600 : 400 }}>
        💧 {Math.round(day.rain_prob * 100)}%
      </div>
    </div>
  );
}

export default function AgriWeatherApp() {
  const [location, setLocation] = useState(null);
  const [weather] = useState(MOCK_WEATHER);
  const [locationStatus, setLocationStatus] = useState("requesting");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const nearest = ETHIOPIAN_LOCATIONS.reduce((prev, curr) => {
            const pd = Math.hypot(prev.lat - latitude, prev.lon - longitude);
            const cd = Math.hypot(curr.lat - latitude, curr.lon - longitude);
            return cd < pd ? curr : prev;
          });
          setLocation(nearest);
          setLocationStatus("granted");
        },
        () => {
          setLocation(ETHIOPIAN_LOCATIONS[0]);
          setLocationStatus("denied");
        }
      );
    } else {
      setLocation(ETHIOPIAN_LOCATIONS[0]);
      setLocationStatus("denied");
    }
  }, []);

  const { insights, alerts } = weather ? generateInsights(weather.current) : { insights: [], alerts: [] };
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-ET", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "forecast", label: "5-Day Forecast" },
    { id: "crop", label: "Crop Intelligence" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f2ece0", fontFamily: "'Georgia', 'Palatino', serif" }}>
      {/* Background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: "linear-gradient(160deg, #1e3d20 0%, #2d5a1e 30%, #4a7c35 55%, #6b8c4a 75%, #8fac60 100%)",
        opacity: 0.97,
      }} />
      {/* Subtle texture overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1,
        backgroundImage: `radial-gradient(ellipse at 20% 80%, rgba(139,90,43,0.3) 0%, transparent 50%),
                          radial-gradient(ellipse at 80% 20%, rgba(30,93,32,0.4) 0%, transparent 50%),
                          radial-gradient(ellipse at 60% 60%, rgba(200,169,110,0.12) 0%, transparent 40%)`,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto", padding: "0 16px 80px" }}>

        {/* Header */}
        <div style={{ padding: "24px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "1px solid rgba(255,255,255,0.3)" }}>
                🌱
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: 0.3 }}>AgroPulse Ethiopia</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5 }}>AGRICULTURAL INTELLIGENCE PLATFORM</div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
              {locationStatus === "granted" ? "📍 Auto-detected" : "📍 Manual"}
            </span>
          </div>
        </div>

        {/* Location + search */}
        <div style={{ marginBottom: 24 }}>
          <LocationSearch onSelect={setLocation} />
          {location && (
            <div style={{ marginTop: 10, display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>{location.name}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{location.zone} · {location.region}</span>
            </div>
          )}
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>{dateStr}</div>
        </div>

        {/* Hero weather */}
        <div style={{
          background: "rgba(255,255,255,0.12)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.25)", borderRadius: 22,
          padding: "28px 28px", marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div style={{ fontSize: 72, fontWeight: 300, color: "#fff", lineHeight: 1, letterSpacing: -2 }}>
                {weather.current.temp}°<span style={{ fontSize: 32, opacity: 0.6 }}>C</span>
              </div>
              <div style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", fontWeight: 500, marginTop: 4, textTransform: "capitalize" }}>
                {weather.current.weather[0].description}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>
                Feels like {weather.current.feels_like}°C · Visibility {(weather.current.visibility / 1000).toFixed(0)} km
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 72 }}>{WEATHER_ICONS[weather.current.weather[0].icon] || "🌤️"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                Updated {new Date().toLocaleTimeString("en-ET", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
          {/* Quick stats strip */}
          <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
            {[
              { label: "Humidity", value: `${weather.current.humidity}%`, icon: "💧" },
              { label: "Rain Prob.", value: `${Math.round(weather.current.rain_prob * 100)}%`, icon: "🌧️" },
              { label: "Wind", value: `${weather.current.wind_speed} m/s`, icon: "💨" },
              { label: "UV Index", value: weather.current.uvi.toFixed(1), icon: "☀️" },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, minWidth: 80, background: "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.18)", textAlign: "center" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", letterSpacing: 0.3 }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 18px", borderRadius: 22, border: "1px solid",
                borderColor: activeTab === tab.id ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)",
                background: activeTab === tab.id ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                color: activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.65)",
                fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.2s ease",
                backdropFilter: "blur(8px)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div style={{ background: "#fffdf8", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 32px rgba(30,40,15,0.18)", border: "1px solid #e8ddd0" }}>
          
          {activeTab === "overview" && (
            <div style={{ padding: "24px 24px" }}>
              <h2 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: "#2d4a1e", letterSpacing: 0.2 }}>Weather Metrics</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
                <MetricCard label="Humidity" value={weather.current.humidity} unit="%" icon="💧" sub="High — monitor crops" />
                <MetricCard label="Rain Probability" value={Math.round(weather.current.rain_prob * 100)} unit="%" icon="🌧️" sub="Rain likely today" />
                <MetricCard label="Wind Speed" value={weather.current.wind_speed} unit="m/s" icon="💨" sub={<WindDirection deg={weather.current.wind_deg} />} />
                <MetricCard label="UV Index" value={weather.current.uvi.toFixed(1)} unit="" icon="☀️" sub={<UVBar uvi={weather.current.uvi} />} />
              </div>

              {alerts.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#2d4a1e" }}>⚠️ Active Alerts</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {alerts.map((a, i) => <InsightCard key={i} insight={a} isAlert={true} />)}
                  </div>
                </div>
              )}

              <h2 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: "#2d4a1e" }}>Agricultural Insights</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {insights.map((ins, i) => <InsightCard key={i} insight={ins} isAlert={false} />)}
              </div>
            </div>
          )}

          {activeTab === "forecast" && (
            <div style={{ padding: "24px 24px" }}>
              <h2 style={{ margin: "0 0 18px", fontSize: 16, fontWeight: 700, color: "#2d4a1e" }}>5-Day Forecast</h2>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {weather.daily.map((day, i) => <ForecastCard key={i} day={day} isFirst={i === 0} />)}
              </div>
              <div style={{ marginTop: 24, padding: "16px 18px", background: "#f0f5eb", borderRadius: 14, border: "1px solid #c4d9a8" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#2d5a14", marginBottom: 8 }}>📊 Forecast Summary</div>
                <p style={{ margin: 0, fontSize: 13, color: "#3d5a2a", lineHeight: 1.6 }}>
                  Heavy rainfall expected Tuesday through Wednesday. Plan field operations accordingly — avoid soil tilling or spraying. Thursday and Friday show clearing, suitable for harvest and field inspection. Total weekly rainfall may exceed 40mm.
                </p>
              </div>
            </div>
          )}

          {activeTab === "crop" && (
            <div style={{ padding: "24px 24px" }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "#2d4a1e" }}>Crop Intelligence</h2>
              <p style={{ margin: "0 0 20px", fontSize: 13, color: "#7a6652" }}>Weather-based recommendations for Ethiopian crops based on current conditions near {location?.name || "your location"}.</p>
              
              {[
                {
                  crop: "Coffee (Coffea arabica)", emoji: "☕",
                  status: "attention", statusLabel: "Monitor",
                  conditions: "High humidity favorable for growth but increases disease pressure.",
                  actions: ["Inspect for Coffee Berry Disease (CBD) and Coffee Leaf Rust", "Ensure good shade-tree canopy management", "Delay fertilization — rain expected"],
                  region: "Jimma, Kaffa, Sidama Highlands",
                },
                {
                  crop: "Teff (Eragrostis tef)", emoji: "🌾",
                  status: "good", statusLabel: "Good",
                  conditions: "Moderate temperature and moisture levels are well-suited for teff growth stage.",
                  actions: ["Soil moisture adequate — monitor for waterlogging in low-lying areas", "Upcoming rain supports germination if recently planted"],
                  region: "Tigray, Amhara, Oromia Highlands",
                },
                {
                  crop: "Maize (Zea mays)", emoji: "🌽",
                  status: "attention", statusLabel: "Monitor",
                  conditions: "Risk of fall armyworm increases under humid conditions. Inspect weekly.",
                  actions: ["Scout fields for armyworm egg masses and larvae", "High humidity may favor leaf blight", "Do not spray today — rain expected"],
                  region: "Oromia, SNNPR, Amhara",
                },
                {
                  crop: "Enset (Ensete ventricosum)", emoji: "🌿",
                  status: "good", statusLabel: "Favorable",
                  conditions: "Current conditions are favorable for enset cultivation. Wet season supports growth.",
                  actions: ["Good time for planting or transplanting suckers", "Monitor Bacterial Wilt (Xanthomonas) during high-moisture periods"],
                  region: "SNNPR, Konso, Hadiya, Gurage",
                },
              ].map((crop) => (
                <div
                  key={crop.crop}
                  style={{
                    background: crop.status === "good" ? "#f4f9f0" : "#fdf7f2",
                    border: `1.5px solid ${crop.status === "good" ? "#b8d89a" : "#e2b08a"}`,
                    borderRadius: 16, padding: "16px 18px", marginBottom: 14,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 24 }}>{crop.emoji}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#2d3a1e" }}>{crop.crop}</div>
                        <div style={{ fontSize: 11, color: "#9a8570" }}>📍 {crop.region}</div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 8,
                      background: crop.status === "good" ? "#4a8a2a" : "#c8744a",
                      color: "#fff", letterSpacing: 0.5,
                    }}>{crop.statusLabel.toUpperCase()}</span>
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: 13, color: "#4a3a2a", lineHeight: 1.5 }}>{crop.conditions}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {crop.actions.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <span style={{ fontSize: 12, color: crop.status === "good" ? "#4a8a2a" : "#c8744a", flexShrink: 0, marginTop: 1 }}>→</span>
                        <span style={{ fontSize: 12, color: "#5c4a32", lineHeight: 1.5 }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 8, padding: "14px 18px", background: "#fef9f0", borderRadius: 14, border: "1px solid #e2c87a" }}>
                <div style={{ fontSize: 13, color: "#7a5a1a", fontWeight: 600, marginBottom: 6 }}>🔬 Connect with Pest & Disease Detection</div>
                <p style={{ margin: 0, fontSize: 12, color: "#8a6a30", lineHeight: 1.5 }}>
                  Elevated disease conditions detected. Use the AgroPulse camera tool to scan leaves and get instant diagnosis powered by our detection model.
                </p>
                <button style={{
                  marginTop: 10, padding: "8px 18px", background: "#c8a940", border: "none",
                  borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 12,
                  cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.3,
                }}>
                  Open Disease Scanner →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 0.3 }}>
          AgroPulse Ethiopia · Agricultural Intelligence Platform · Data updated hourly
        </div>
      </div>
    </div>
  );
}
