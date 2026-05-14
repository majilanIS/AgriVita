import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "../utils/api";

const toast = (() => {
  let container = null;
  function getContainer() {
    if (container) return container;
    container = document.createElement("div");
    container.style.cssText =
      "position:fixed;top:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;";
    document.body.appendChild(container);
    return container;
  }
  return function show(msg, type = "success") {
    const c = getContainer();
    const el = document.createElement("div");
    const isOk = type === "success";
    el.style.cssText = `
      background:${isOk ? "linear-gradient(135deg,#0ea5e9,#06b6d4)" : "linear-gradient(135deg,#ef4444,#dc2626)"};
      color:#fff;padding:12px 20px;border-radius:12px;font-size:13.5px;font-weight:500;
      font-family:'Outfit',sans-serif;letter-spacing:0.2px;
      box-shadow:0 8px 32px rgba(0,0,0,0.18);pointer-events:auto;
      transform:translateX(120px);opacity:0;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
      max-width:280px;line-height:1.4;
    `;
    el.textContent = msg;
    c.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = "translateX(0)";
      el.style.opacity = "1";
    });
    setTimeout(() => {
      el.style.transform = "translateX(120px)";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 350);
    }, 3500);
  };
})();

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ animation: "spin 0.7s linear infinite" }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

function ParticleField() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: i % 3 === 0 ? "3px" : "2px",
          height: i % 3 === 0 ? "3px" : "2px",
          borderRadius: "50%",
          background: i % 4 === 0 ? "rgba(6,182,212,0.6)" : i % 4 === 1 ? "rgba(14,165,233,0.5)" : "rgba(99,102,241,0.4)",
          left: `${(i * 37 + 11) % 95}%`,
          top: `${(i * 53 + 7) % 90}%`,
          animation: `float ${4 + (i % 4)}s ease-in-out ${(i * 0.4) % 3}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

function GridLines() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}>
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#06b6d4" strokeWidth="0.8"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function InputField({ label, type, value, onChange, placeholder, error, action }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{
        display: "block", fontSize: "10.5px", fontWeight: 700,
        letterSpacing: "1.4px", textTransform: "uppercase",
        color: error ? "#f87171" : "#64748b", marginBottom: "7px",
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: "100%", height: "50px",
            background: error ? "rgba(239,68,68,0.04)" : "rgba(248,250,252,0.8)",
            border: `1.5px solid ${error ? "rgba(248,113,113,0.6)" : "rgba(203,213,225,0.6)"}`,
            borderRadius: "14px",
            padding: action ? "0 48px 0 16px" : "0 16px",
            fontSize: "14.5px", color: "#0f172a",
            fontFamily: "'Outfit', sans-serif",
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
          }}
          onFocus={e => {
            e.target.style.borderColor = "#0ea5e9";
            e.target.style.boxShadow = "0 0 0 4px rgba(14,165,233,0.12)";
            e.target.style.background = "#fff";
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? "rgba(248,113,113,0.6)" : "rgba(203,213,225,0.6)";
            e.target.style.boxShadow = "none";
            e.target.style.background = error ? "rgba(239,68,68,0.04)" : "rgba(248,250,252,0.8)";
          }}
        />
        {action && (
          <button onClick={action.fn} type="button" style={{
            position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
            display: "flex", alignItems: "center", padding: 0, transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#0ea5e9"}
            onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
          >
            <EyeIcon open={action.show} />
          </button>
        )}
      </div>
      {error && (
        <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#f87171", fontWeight: 500 }}>{error}</p>
      )}
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!phoneNumber) e.phoneNumber = "Phone number is required";
    else if (!/^(09|07|\+251[79]|00251[79])[0-9]{8}$/.test(phoneNumber.replace(/\s/g, ""))) e.phoneNumber = "Phone must start with 09 or 07";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setErrors({});
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phoneNumber, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("phone_number", phoneNumber);
      toast("Logged in successfully! Redirecting...", "success");
      setTimeout(() => { navigate("/dashboard"); }, 1500);

    } catch (err) {
      toast(err.message || "Something went wrong", "error");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: "6px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "linear-gradient(135deg,rgba(14,165,233,0.12),rgba(6,182,212,0.08))",
          border: "1px solid rgba(14,165,233,0.2)", borderRadius: "20px",
          padding: "4px 12px", marginBottom: "18px",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#0ea5e9", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#0ea5e9", letterSpacing: "0.8px", textTransform: "uppercase" }}>
            Decentralized Network
          </span>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: "6px" }}>
          Welcome Back
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "28px", fontWeight: 400 }}>
          Initialize your session to manage your assets.
        </p>
      </div>

      <InputField
        label="Phone Number" type="tel" value={phoneNumber}
        onChange={e => { setPhoneNumber(e.target.value); setErrors(prev => ({ ...prev, phoneNumber: "" })); }}
        placeholder="+251912345678" error={errors.phoneNumber}
      />
      <InputField
        label="Password" type={showPw ? "text" : "password"} value={password}
        onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }}
        placeholder="••••••••" error={errors.password}
        action={{ fn: () => setShowPw(s => !s), show: showPw }}
      />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-8px", marginBottom: "22px" }}>
        <button type="button" style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "13px", color: "#0ea5e9", fontWeight: 600,
          fontFamily: "'Outfit',sans-serif", padding: 0,
        }}>Forgot ID?</button>
      </div>

      <button type="submit" disabled={loading} style={{
        width: "100%", height: "52px",
        background: loading ? "rgba(14,165,233,0.6)" : "linear-gradient(135deg,#0ea5e9 0%,#06b6d4 100%)",
        border: "none", borderRadius: "16px", color: "#fff",
        fontFamily: "'Outfit',sans-serif", fontSize: "13.5px", fontWeight: 700,
        letterSpacing: "2px", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        transition: "all 0.2s", boxShadow: loading ? "none" : "0 4px 24px rgba(14,165,233,0.35)",
        marginBottom: "22px",
      }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(14,165,233,0.45)"; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 24px rgba(14,165,233,0.35)"; }}
      >
        {loading ? <><Spinner /> Authenticating...</> : "Login"}
      </button>

      <p style={{ textAlign: "center", fontSize: "13.5px", color: "#64748b" }}>
        Don't have an account?{" "}
        <button type="button" onClick={onSwitch} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#0ea5e9", fontWeight: 700, fontFamily: "'Outfit',sans-serif",
          fontSize: "13.5px", padding: 0,
        }}>Create Account</button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({ name: "", phoneNumber: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function set(k) { return e => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(p => ({ ...p, [k]: "" })); }; }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phoneNumber) e.phoneNumber = "Phone number is required";
    else if (!/^(09|07|\+251[79]|00251[79])[0-9]{8}$/.test(form.phoneNumber.replace(/\s/g, ""))) e.phoneNumber = "Phone must start with 09 or 07";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setErrors({});
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: form.phoneNumber, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed");
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("phone_number", form.phoneNumber);
      toast("Account created! Welcome to AgriVita.", "success");
      setTimeout(onSwitch, 1800);
    } catch (err) {
      toast(err.message || "Something went wrong", "error");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ marginBottom: "6px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "linear-gradient(135deg,rgba(14,165,233,0.12),rgba(6,182,212,0.08))",
          border: "1px solid rgba(14,165,233,0.2)", borderRadius: "20px",
          padding: "4px 12px", marginBottom: "18px",
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#06b6d4", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#06b6d4", letterSpacing: "0.8px", textTransform: "uppercase" }}>
            Join the Network
          </span>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: "6px" }}>
          Create Account
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", fontWeight: 400 }}>
          Register your farm in the decentralized network.
        </p>
      </div>

      <InputField label="Full Name" type="text" value={form.name} onChange={set("name")} placeholder="Fanu Elnegasi" error={errors.name} />
      <InputField label="Phone Number" type="tel" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="+251912345678" error={errors.phoneNumber} />

      <div style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <InputField label="Password" type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
            placeholder="••••••••" error={errors.password} action={{ fn: () => setShowPw(s => !s), show: showPw }} />
        </div>
        <div style={{ flex: 1 }}>
          <InputField label="Confirm" type={showCf ? "text" : "password"} value={form.confirm} onChange={set("confirm")}
            placeholder="••••••••" error={errors.confirm} action={{ fn: () => setShowCf(s => !s), show: showCf }} />
        </div>
      </div>

      <button type="submit" disabled={loading} style={{
        width: "100%", height: "52px",
        background: loading ? "rgba(14,165,233,0.6)" : "linear-gradient(135deg,#0ea5e9 0%,#06b6d4 100%)",
        border: "none", borderRadius: "16px", color: "#fff",
        fontFamily: "'Outfit',sans-serif", fontSize: "13.5px", fontWeight: 700,
        letterSpacing: "2px", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
        transition: "all 0.2s", boxShadow: loading ? "none" : "0 4px 24px rgba(14,165,233,0.35)",
        marginTop: "6px", marginBottom: "22px",
      }}
        onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(14,165,233,0.45)"; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 24px rgba(14,165,233,0.35)"; }}
      >
        {loading ? <><Spinner /> Creating account...</> : "Create Account"}
      </button>

      <p style={{ textAlign: "center", fontSize: "13.5px", color: "#64748b" }}>
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#0ea5e9", fontWeight: 700, fontFamily: "'Outfit',sans-serif",
          fontSize: "13.5px", padding: 0,
        }}>Log In</button>
      </p>
    </form>
  );
}

export default function AgriVitaAuth() {
  const [isRegister, setIsRegister] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'register') {
      setIsRegister(true);
    }
  }, [location]);

  function switchMode(toRegister) {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => { setIsRegister(toRegister); setFlipping(false); }, 350);
  }


  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
      @keyframes float {
        0%{transform:translateY(0) translateX(0)}
        33%{transform:translateY(-8px) translateX(4px)}
        66%{transform:translateY(4px) translateX(-6px)}
        100%{transform:translateY(-4px) translateX(2px)}
      }
      @keyframes gradShift {
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
      }
      @keyframes fadeUp {
        from{opacity:0;transform:translateY(24px)}
        to{opacity:1;transform:translateY(0)}
      }
      @keyframes orb1 {
        0%,100%{transform:translate(0,0) scale(1)}
        33%{transform:translate(40px,-30px) scale(1.1)}
        66%{transform:translate(-20px,20px) scale(0.95)}
      }
      @keyframes orb2 {
        0%,100%{transform:translate(0,0) scale(1)}
        33%{transform:translate(-35px,25px) scale(0.9)}
        66%{transform:translate(30px,-15px) scale(1.05)}
      }
      * { box-sizing: border-box; }
      input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #f8fafc inset !important;
        -webkit-text-fill-color: #0f172a !important;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "#f0f6ff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Outfit', sans-serif",
      position: "relative", overflow: "hidden",
      padding: "20px",
    }}>
      <GridLines />
      <ParticleField />

      {/* Animated orbs */}
      <div style={{
        position: "absolute", width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(14,165,233,0.18) 0%,transparent 70%)",
        top: "-120px", left: "-100px", animation: "orb1 12s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(6,182,212,0.15) 0%,transparent 70%)",
        bottom: "-100px", right: "-80px", animation: "orb2 10s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: "260px", height: "260px", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)",
        top: "40%", right: "10%", animation: "orb1 14s ease-in-out 2s infinite",
        pointerEvents: "none",
      }} />

      {/* Logo strip */}
      <div style={{
        position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "linear-gradient(135deg,#0ea5e9,#06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(14,165,233,0.3)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif", fontSize: "20px", fontWeight: 700,
          color: "#0f172a", letterSpacing: "1px",
        }}>AGRIVITA</span>
        <span style={{
          fontSize: "10px", fontWeight: 600, color: "#0ea5e9", letterSpacing: "1.5px",
          textTransform: "uppercase", background: "rgba(14,165,233,0.1)",
          border: "1px solid rgba(14,165,233,0.2)", borderRadius: "6px", padding: "2px 7px",
        }}>AI</span>
      </div>

      {/* Auth card */}
      <div style={{
        width: "100%", maxWidth: "460px",
        background: "rgba(255,255,255,0.88)",
        backdropFilter: "blur(24px)",
        borderRadius: "28px",
        border: "1px solid rgba(255,255,255,0.9)",
        boxShadow: "0 16px 64px rgba(14,165,233,0.1), 0 4px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
        padding: "clamp(28px, 5vw, 40px) clamp(24px, 5vw, 40px)",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        opacity: flipping ? 0 : 1,
        transform: flipping ? "scale(0.97) rotateY(6deg)" : "scale(1) rotateY(0deg)",
        animation: "fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Card shimmer line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "1px",
          background: "linear-gradient(90deg,transparent,rgba(14,165,233,0.4),rgba(6,182,212,0.4),transparent)",
        }} />

        {/* CPU icon */}
        <div style={{
          width: "52px", height: "52px", borderRadius: "16px",
          background: "linear-gradient(135deg,rgba(14,165,233,0.12),rgba(6,182,212,0.08))",
          border: "1.5px solid rgba(14,165,233,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
            <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
            <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
          </svg>
        </div>

        {/* Return button */}
        <button
          type="button"
          onClick={() => navigate("/")}

          style={{
            position: "absolute", top: "28px", right: "32px",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px",
            textTransform: "uppercase", color: "#94a3b8",
            fontFamily: "'Outfit',sans-serif",
            display: "flex", alignItems: "center", gap: "5px",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#0ea5e9"}
          onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
          </svg>
          Return
        </button>

        {isRegister
          ? <RegisterForm onSwitch={() => switchMode(false)} />
          : <LoginForm onSwitch={() => switchMode(true)} />
        }
      </div>

      {/* Bottom caption */}
      <p style={{
        position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
        fontSize: "11.5px", color: "#94a3b8", letterSpacing: "0.3px", whiteSpace: "nowrap",
      }}>
        © 2025 AgriVita · Smart Agriculture Platform
      </p>
    </div>
  );
}
