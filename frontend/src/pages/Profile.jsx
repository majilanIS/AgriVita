import { useState, useEffect, useRef } from "react";

const API_BASE = "http://localhost:8000";

// ─── Toast (same as auth) ────────────────────────────────────────────────────
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
      background:${isOk ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#ef4444,#dc2626)"};
      color:#fff;padding:12px 20px;border-radius:12px;font-size:13.5px;font-weight:500;
      font-family:'Outfit',sans-serif;letter-spacing:0.2px;
      box-shadow:0 8px 32px rgba(0,0,0,0.18);pointer-events:auto;
      transform:translateX(120px);opacity:0;transition:all 0.35s cubic-bezier(0.4,0,0.2,1);
      max-width:300px;line-height:1.4;
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

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner({ size = 18, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5"
      style={{ animation: "spin 0.7s linear infinite", flexShrink: 0 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function Icon({ d, size = 16, stroke = "currentColor", sw = 2, fill = "none" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
      stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const ICONS = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  pin: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  plant: "M12 22V12M12 12C12 12 7 9 7 4a5 5 0 0 1 10 0c0 5-5 8-5 8zM12 12c0 0-5-3-5-8",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  check: "M20 6L9 17l-5-5",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z",
  id: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z",
  globe: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  lang: "M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6",
  calendar: "M3 4h18v18H3V4zM16 2v4M8 2v4M3 10h18",
  image: "M21 15l-5-5L5 21M3 3h18v18H3V3zM8.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  x: "M18 6L6 18M6 6l12 12",
  save: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  grain: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8v8M8 12h8",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useToken() {
  return typeof localStorage !== "undefined" ? localStorage.getItem("access_token") : null;
}

function authHeaders(token) {
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ profile, onClose, onSaved }) {
  const token = useToken();
  const [form, setForm] = useState({
    full_name: profile.full_name || "",
    phone_number: profile.phone_number || "",
    national_id: profile.national_id || "",
    country: profile.country || "",
    preferred_language: profile.preferred_language || "English",
    farm_location: profile.farm_location || "",
    field_size: profile.field_size || "",
    planting_date: profile.planting_date || "",
    main_crops: (profile.main_crops || []).join(", "),
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function set(k) {
    return e => {
      setForm(f => ({ ...f, [k]: e.target.value }));
      setErrors(p => ({ ...p, [k]: "" }));
    };
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        ...form,
        field_size: form.field_size ? parseFloat(form.field_size) : null,
        main_crops: form.main_crops.split(",").map(s => s.trim()).filter(Boolean),
      };
      const res = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: authHeaders(token),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Save failed");
      }
      const updated = await res.json();
      toast("Profile updated successfully!", "success");
      onSaved(updated);
      onClose();
    } catch (err) {
      toast(err.message || "Something went wrong", "error");
    }
    setSaving(false);
  }

  const inputStyle = {
    width: "100%", height: "44px",
    background: "rgba(248,250,252,0.9)",
    border: "1.5px solid rgba(203,213,225,0.7)",
    borderRadius: "12px",
    padding: "0 14px",
    fontSize: "14px", color: "#0f172a",
    fontFamily: "'Outfit', sans-serif",
    outline: "none", boxSizing: "border-box",
    transition: "all 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "10px", fontWeight: 700,
    letterSpacing: "1.2px", textTransform: "uppercase",
    color: "#64748b", marginBottom: "6px",
  };

  const fieldStyle = { marginBottom: "14px" };

  function Field({ label, k, type = "text", placeholder = "" }) {
    return (
      <div style={fieldStyle}>
        <label style={labelStyle}>{label}</label>
        <input
          type={type}
          value={form[k]}
          onChange={set(k)}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = "#22c55e"; e.target.style.boxShadow = "0 0 0 4px rgba(34,197,94,0.12)"; e.target.style.background = "#fff"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(203,213,225,0.7)"; e.target.style.boxShadow = "none"; e.target.style.background = "rgba(248,250,252,0.9)"; }}
        />
      </div>
    );
  }

  return (
    // Faux modal viewport — normal flow so iframe sizes correctly
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,23,42,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%", maxWidth: "560px",
        background: "white",
        borderRadius: "24px",
        border: "1px solid rgba(34,197,94,0.15)",
        boxShadow: "0 24px 80px rgba(34,197,94,0.12), 0 8px 32px rgba(0,0,0,0.1)",
        overflow: "hidden",
        maxHeight: "90vh",
        display: "flex", flexDirection: "column",
      }}>
        {/* Modal header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "0.5px solid #e8f0ea",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "linear-gradient(135deg, rgba(34,197,94,0.06), rgba(22,163,74,0.03))",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
            }}>
              <Icon d={ICONS.edit} size={17} stroke="#fff" sw={2} />
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "#1a3d25" }}>Edit Profile</div>
              <div style={{ fontSize: "11px", color: "#9cb8a3" }}>Update your farm information</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#94a3b8", padding: "4px", borderRadius: "8px",
            display: "flex", transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
            onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}
          >
            <Icon d={ICONS.x} size={20} sw={2.5} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>
          {/* Personal Info */}
          <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#22c55e", marginBottom: "14px" }}>
            Personal Information
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="Full Name" k="full_name" placeholder="Abebe Girma" />
            <Field label="Phone Number" k="phone_number" placeholder="+251 9 12 345 678" />
            <Field label="National ID Number" k="national_id" placeholder="ETH-123456" />
            <Field label="Country" k="country" placeholder="Ethiopia" />
          </div>
          {/* Farm Details */}
          <div style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "1.2px",
            textTransform: "uppercase", color: "#22c55e",
            margin: "20px 0 14px", paddingTop: "16px",
            borderTop: "0.5px solid #e8f0ea",
          }}>
            Farm Details
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="Farm Location (Kebele/GPS)" k="farm_location" placeholder="Oromia, Kebele 05" />
            <Field label="Field Size (Hectares)" k="field_size" type="number" placeholder="2.5" />
            <Field label="Planting Date" k="planting_date" type="date" />
            <Field label="Main Crops (comma separated)" k="main_crops" placeholder="Corn, Teff, Coffee" />
          </div>
        </div>

        {/* Modal footer */}
        <div style={{
          padding: "16px 24px",
          borderTop: "0.5px solid #e8f0ea",
          display: "flex", justifyContent: "flex-end", gap: "10px",
          background: "#fafdfb",
          flexShrink: 0,
        }}>
          <button onClick={onClose} style={{
            height: "42px", padding: "0 20px",
            background: "none", border: "1.5px solid rgba(203,213,225,0.8)",
            borderRadius: "12px", cursor: "pointer",
            fontSize: "13px", fontWeight: 600, color: "#64748b",
            fontFamily: "'Outfit', sans-serif",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#9cb8a3"; e.currentTarget.style.color = "#2d5a38"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(203,213,225,0.8)"; e.currentTarget.style.color = "#64748b"; }}
          >
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} style={{
            height: "42px", padding: "0 24px",
            background: saving ? "rgba(34,197,94,0.6)" : "linear-gradient(135deg,#22c55e,#16a34a)",
            border: "none", borderRadius: "12px", cursor: saving ? "not-allowed" : "pointer",
            fontSize: "13px", fontWeight: 700, color: "#fff",
            fontFamily: "'Outfit', sans-serif",
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: saving ? "none" : "0 4px 16px rgba(34,197,94,0.35)",
            transition: "all 0.2s",
            letterSpacing: "0.5px",
          }}
            onMouseEnter={e => { if (!saving) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,0.45)"; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = saving ? "none" : "0 4px 16px rgba(34,197,94,0.35)"; }}
          >
            {saving ? <><Spinner size={15} /> Saving...</> : <><Icon d={ICONS.save} size={15} stroke="#fff" sw={2} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Document Upload Item ─────────────────────────────────────────────────────
function DocItem({ label, subtitle, preview, verified, onUpload }) {
  const fileRef = useRef();

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }

  return (
    <div
      style={{
        padding: "14px 20px",
        display: "flex", alignItems: "center", gap: "12px",
        borderBottom: "0.5px solid #f0f7f2",
        cursor: "pointer", transition: "background 0.12s",
      }}
      onClick={() => fileRef.current?.click()}
      onMouseEnter={e => e.currentTarget.style.background = "#f9fdfb"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={handleFileChange} />

      {/* Thumb */}
      <div style={{
        width: "44px", height: "44px", borderRadius: "10px",
        background: "#e8f5e9", border: "0.5px solid #d1e0d6",
        overflow: "hidden", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {preview
          ? <img src={preview} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ color: "#9cb8a3" }}><Icon d={ICONS.upload} size={18} sw={1.8} /></span>
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#2d5a38", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        <div style={{ fontSize: "11px", color: "#9cb8a3", marginTop: "2px" }}>{subtitle}</div>
      </div>

      {/* Status */}
      <div style={{
        width: "22px", height: "22px", borderRadius: "50%",
        background: verified ? "#22c55e" : "#e8f0ea",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: verified ? "0 2px 8px rgba(34,197,94,0.3)" : "none",
        transition: "all 0.2s",
      }}>
        {verified
          ? <Icon d={ICONS.check} size={11} stroke="#fff" sw={3} />
          : <Icon d={ICONS.upload} size={11} stroke="#9cb8a3" sw={2} />
        }
      </div>
    </div>
  );
}

// ─── Stat Badge ───────────────────────────────────────────────────────────────
function InfoField({ label, value, empty }) {
  return (
    <div>
      <div style={{
        fontSize: "10px", fontWeight: 700,
        letterSpacing: "1.2px", textTransform: "uppercase",
        color: "#9cb8a3", marginBottom: "6px",
      }}>{label}</div>
      <div style={{
        fontSize: "14px",
        color: empty ? "#bdd4c4" : "#2d4a34",
        fontStyle: empty ? "italic" : "normal",
        fontWeight: empty ? 400 : 500,
      }}>
        {value || "Not provided"}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FarmerProfile({ navigate, onLogout }) {
  const token = useToken();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [farmImagePreview, setFarmImagePreview] = useState(null);
  const [idDocPreview, setIdDocPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarRef = useRef();


  // ── Inject global styles ──
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
      @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes shimmerSlide {
        from { transform: translateX(-100%); }
        to   { transform: translateX(200%); }
      }
      * { box-sizing: border-box; }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // ── Fetch profile ──
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/profile`, {
          headers: authHeaders(token),
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(data);
        if (data.avatar_url) setAvatarPreview(data.avatar_url);
        if (data.farm_image_url) setFarmImagePreview(data.farm_image_url);
        if (data.id_document_url) setIdDocPreview(data.id_document_url);
      } catch {
        // Demo fallback when API unavailable
        setProfile({
          full_name: "Abebe Girma",
          phone_number: "",
          national_id: "",
          country: "Ethiopia",
          preferred_language: "English",
          farm_location: "",
          field_size: null,
          planting_date: "2024-05-15",
          main_crops: ["Corn"],
          avatar_url: null,
          farm_image_url: null,
          id_document_url: null,
          profile_complete: 35,
        });
      }
      setLoading(false);
    }
    fetchProfile();
  }, [token]);

  // ── Avatar upload ──
  async function handleAvatarUpload(file) {
    setUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = e => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/profile/avatar`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      toast("Profile picture updated!", "success");
    } catch {
      toast("Avatar saved locally (API offline)", "success");
    }
    setUploadingAvatar(false);
  }

  // ── Doc upload ──
  async function handleDocUpload(type, file) {
    const reader = new FileReader();
    reader.onload = e => {
      if (type === "farm_image") setFarmImagePreview(e.target.result);
      if (type === "id_document") setIdDocPreview(e.target.result);
    };
    reader.readAsDataURL(file);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("doc_type", type);
      await fetch(`${API_BASE}/profile/document`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      toast("Document uploaded!", "success");
    } catch {
      toast("Document saved locally (API offline)", "success");
    }
  }

  // ── Profile saved ──
  function handleProfileSaved(updated) {
    setProfile(updated);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  }

  // ── Completion ──
  const completion = (() => {
    if (!profile) return 0;
    const fields = [
      profile.full_name, profile.phone_number, profile.national_id,
      profile.country, profile.farm_location, profile.field_size,
      profile.planting_date, profile.main_crops?.length,
      avatarPreview, farmImagePreview,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  })();

  const crops = profile?.main_crops || [];

  // ─── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f0f4f1", fontFamily: "'Outfit', sans-serif" }}>
        <div style={{
          height: "56px", background: "white",
          borderBottom: "0.5px solid #d1e0d6",
          display: "flex", alignItems: "center", padding: "0 2rem", gap: "12px",
        }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#e8f5e9" }} />
          <div style={{ width: "120px", height: "16px", borderRadius: "8px", background: "#e8f5e9" }} />
        </div>
        <div style={{ maxWidth: "1040px", margin: "28px auto", padding: "0 24px", display: "grid", gridTemplateColumns: "300px 1fr", gap: "20px" }}>
          {[1, 2].map(i => (
            <div key={i} style={{ background: "white", borderRadius: "16px", height: "280px", border: "0.5px solid #d1e0d6", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.04), transparent)", animation: "shimmerSlide 1.8s infinite" }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Main render ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f1", fontFamily: "'Outfit', sans-serif" }}>

      {/* Success banner */}
      {showSuccess && (
        <div style={{
          background: "#f0fdf4", borderBottom: "0.5px solid #bbf7d0",
          padding: "9px", textAlign: "center",
          fontSize: "13px", color: "#16a34a",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
          animation: "fadeDown 0.3s ease",
        }}>
          <Icon d={ICONS.check} size={14} stroke="#16a34a" sw={2.5} />
          Profile updated successfully!
        </div>
      )}

      {/* Navbar */}
      <nav style={{
        background: "white",
        borderBottom: "0.5px solid #d1e0d6",
        padding: "0 2rem", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 8px rgba(34,197,94,0.06)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "9px",
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 10px rgba(34,197,94,0.3)",
          }}>
            <Icon d={ICONS.plant} size={18} stroke="#fff" sw={2} />
          </div>
          <span style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "18px", fontWeight: 700, color: "#1a3d25", letterSpacing: "1px",
          }}>AGRIVITA</span>
          <span style={{
            fontSize: "9px", fontWeight: 700, color: "#22c55e",
            letterSpacing: "1.5px", background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)", borderRadius: "5px", padding: "2px 6px",
            textTransform: "uppercase",
          }}>AI</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => setShowEdit(true)}
            style={{
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "white", border: "none", borderRadius: "9px",
              padding: "8px 16px", fontSize: "13px", fontWeight: 600,
              fontFamily: "'Outfit', sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px",
              boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(34,197,94,0.3)"; }}
          >
            <Icon d={ICONS.edit} size={14} stroke="#fff" sw={2} />
            Edit Profile
          </button>
        </div>
      </nav>

      {/* Main grid */}
      <main style={{
        maxWidth: "1040px", margin: "0 auto",
        padding: "28px 24px",
        display: "grid", gridTemplateColumns: "300px 1fr",
        gap: "20px", alignItems: "start",
      }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Profile Card */}
          <div style={{
            background: "white", borderRadius: "18px",
            border: "0.5px solid #d1e0d6", overflow: "hidden",
            animation: "fadeUp 0.5s ease both",
          }}>
            {/* Banner */}
            <div style={{
              height: "124px", position: "relative",
              background: "linear-gradient(135deg,#14532d 0%,#166534 40%,#22c55e 100%)",
              overflow: "hidden",
            }}>
              {/* Decorative circles */}
              <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <div style={{ position: "absolute", right: "20px", bottom: "-30px", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "absolute", left: "10px", bottom: "-10px", width: "50px", height: "50px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            </div>

            {/* Avatar */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "-46px", paddingBottom: 0 }}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    width: "90px", height: "90px", borderRadius: "50%",
                    border: "3px solid white", overflow: "hidden",
                    background: "#e8f5e9", cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(34,197,94,0.2)",
                    position: "relative",
                  }}
                  onClick={() => avatarRef.current?.click()}
                  title="Click to change photo"
                >
                  {avatarPreview
                    ? <img src={avatarPreview} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "4px" }}>
                        <Icon d={ICONS.camera} size={24} stroke="#9cb8a3" sw={1.5} />
                        <span style={{ fontSize: "9px", color: "#9cb8a3", fontWeight: 600 }}>ADD PHOTO</span>
                      </div>
                  }
                  {uploadingAvatar && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Spinner size={20} color="#22c55e" />
                    </div>
                  )}
                </div>
                <input ref={avatarRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); e.target.value = ""; }} />
                {/* Verified badge */}
                <div style={{
                  position: "absolute", bottom: "3px", right: "3px",
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: "#22c55e", border: "2px solid white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(34,197,94,0.4)",
                }}>
                  <Icon d={ICONS.check} size={11} stroke="#fff" sw={3} />
                </div>
              </div>
            </div>

            {/* Profile info */}
            <div style={{ padding: "12px 20px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#1a3d25", marginBottom: "4px" }}>
                {profile?.full_name || "—"}
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "5px",
                background: "#f0fdf4", color: "#16a34a",
                border: "0.5px solid #bbf7d0", borderRadius: "20px",
                padding: "4px 13px", fontSize: "12px", fontWeight: 600,
                marginTop: "6px",
              }}>
                <Icon d={ICONS.pin} size={11} stroke="#16a34a" sw={2} />
                {profile?.country || "Ethiopia"}
              </div>
            </div>
          </div>

          {/* Secure Documents */}
          <div style={{
            background: "white", borderRadius: "18px",
            border: "0.5px solid #d1e0d6", overflow: "hidden",
            animation: "fadeUp 0.5s ease 0.1s both",
          }}>
            <div style={{
              padding: "16px 20px 13px",
              display: "flex", alignItems: "center", gap: "9px",
              borderBottom: "0.5px solid #e8f0ea",
              fontSize: "14px", fontWeight: 700, color: "#2d5a38",
            }}>
              <div style={{
                width: "28px", height: "28px", background: "#f0fdf4",
                borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon d={ICONS.shield} size={14} stroke="#22c55e" sw={2} />
              </div>
              Secure Documents
            </div>

            <DocItem
              label="Profile Picture"
              subtitle={avatarPreview ? "Verified · Image" : "Click to upload"}
              preview={avatarPreview}
              verified={!!avatarPreview}
              onUpload={handleAvatarUpload}
            />
            <DocItem
              label="National ID"
              subtitle={idDocPreview ? "Uploaded · PDF/Image" : "Pending upload"}
              preview={idDocPreview}
              verified={!!idDocPreview}
              onUpload={f => handleDocUpload("id_document", f)}
            />
            <DocItem
              label="Land Certificate"
              subtitle="Pending upload"
              preview={null}
              verified={false}
              onUpload={f => handleDocUpload("land_cert", f)}
            />
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Personal Information */}
          <div style={{
            background: "white", borderRadius: "18px",
            border: "0.5px solid #d1e0d6", padding: "22px 24px",
            animation: "fadeUp 0.5s ease 0.05s both",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "18px", paddingBottom: "14px",
              borderBottom: "0.5px solid #e8f0ea",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "15px", fontWeight: 700, color: "#1a3d25" }}>
                <div style={{ width: "28px", height: "28px", background: "#f0fdf4", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ICONS.user} size={14} stroke="#22c55e" sw={2} />
                </div>
                Personal Information
              </div>
              <button onClick={() => setShowEdit(true)} style={{
                background: "none", border: "0.5px solid #d1e0d6", borderRadius: "8px",
                padding: "5px 11px", fontSize: "12px", color: "#4a6b52", fontWeight: 600,
                fontFamily: "'Outfit', sans-serif", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "5px", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#16a34a"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1e0d6"; e.currentTarget.style.color = "#4a6b52"; }}
              >
                <Icon d={ICONS.edit} size={12} sw={2} /> Edit
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
              <InfoField label="Phone Number" value={profile?.phone_number} empty={!profile?.phone_number} />
              <InfoField label="National ID Number" value={profile?.national_id} empty={!profile?.national_id} />
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#9cb8a3", marginBottom: "6px" }}>Country</div>
                {profile?.country ? (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: "#f0fdf4", color: "#16a34a",
                    border: "0.5px solid #bbf7d0", borderRadius: "20px",
                    padding: "4px 12px", fontSize: "12px", fontWeight: 600,
                  }}>
                    <Icon d={ICONS.pin} size={11} stroke="#16a34a" sw={2} /> {profile.country}
                  </span>
                ) : <span style={{ fontSize: "14px", color: "#bdd4c4", fontStyle: "italic" }}>Not provided</span>}
              </div>

            </div>
          </div>

          {/* Farm Details */}
          <div style={{
            background: "white", borderRadius: "18px",
            border: "0.5px solid #d1e0d6", padding: "22px 24px",
            animation: "fadeUp 0.5s ease 0.1s both",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "18px", paddingBottom: "14px",
              borderBottom: "0.5px solid #e8f0ea",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "9px", fontSize: "15px", fontWeight: 700, color: "#1a3d25" }}>
                <div style={{ width: "28px", height: "28px", background: "#f0fdf4", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ICONS.plant} size={14} stroke="#22c55e" sw={2} />
                </div>
                Farm Details
              </div>
              <button onClick={() => setShowEdit(true)} style={{
                background: "none", border: "0.5px solid #d1e0d6", borderRadius: "8px",
                padding: "5px 11px", fontSize: "12px", color: "#4a6b52", fontWeight: 600,
                fontFamily: "'Outfit', sans-serif", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "5px", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#16a34a"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1e0d6"; e.currentTarget.style.color = "#4a6b52"; }}
              >
                <Icon d={ICONS.edit} size={12} sw={2} /> Edit
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
              <InfoField label="Farm Location (Kebele/GPS)" value={profile?.farm_location} empty={!profile?.farm_location} />
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#9cb8a3", marginBottom: "6px" }}>Field Size (Hectares)</div>
                {profile?.field_size
                  ? <span style={{ fontSize: "16px", fontWeight: 600, color: "#1a3d25" }}>
                      {profile.field_size} <span style={{ fontSize: "11px", color: "#9cb8a3", fontWeight: 400 }}>ha</span>
                    </span>
                  : <span style={{ fontSize: "14px", color: "#bdd4c4", fontStyle: "italic" }}>Not provided</span>
                }
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#9cb8a3", marginBottom: "6px" }}>Planting Date</div>
                {profile?.planting_date
                  ? <span style={{
                      display: "inline-flex", alignItems: "center", gap: "6px",
                      background: "#f0fdf4", color: "#2d5a38",
                      border: "0.5px solid #d1fae5", borderRadius: "9px",
                      padding: "4px 11px", fontSize: "13px", fontWeight: 600,
                    }}>
                      <Icon d={ICONS.calendar} size={13} stroke="#22c55e" sw={2} />
                      {profile.planting_date}
                    </span>
                  : <span style={{ fontSize: "14px", color: "#bdd4c4", fontStyle: "italic" }}>Not set</span>
                }
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "1.2px", textTransform: "uppercase", color: "#9cb8a3", marginBottom: "6px" }}>Main Crops</div>
                {crops.length > 0
                  ? <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {crops.map(crop => (
                        <span key={crop} style={{
                          display: "inline-flex", alignItems: "center", gap: "4px",
                          background: "#f0fdf4", color: "#166534",
                          border: "0.5px solid #bbf7d0", borderRadius: "7px",
                          padding: "3px 10px", fontSize: "12px", fontWeight: 600,
                        }}>
                          <Icon d={ICONS.grain} size={11} stroke="#22c55e" sw={2} />
                          {crop}
                        </span>
                      ))}
                    </div>
                  : <span style={{ fontSize: "14px", color: "#bdd4c4", fontStyle: "italic" }}>Not specified</span>
                }
              </div>
            </div>

            {/* Farm Image */}
            <div style={{
              marginTop: "18px", paddingTop: "16px",
              borderTop: "0.5px solid #e8f0ea",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: farmImagePreview ? "12px" : "0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#4a6b52", fontWeight: 600 }}>
                  <div style={{ width: "24px", height: "24px", background: "#f0fdf4", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICONS.image} size={12} stroke="#22c55e" sw={2} />
                  </div>
                  Farm Field Image
                </div>
                <label style={{
                  fontSize: "12px", color: "#22c55e", cursor: "pointer",
                  fontWeight: 600, display: "flex", alignItems: "center", gap: "4px",
                  transition: "color 0.15s",
                }}>
                  <input type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleDocUpload("farm_image", f); e.target.value = ""; }} />
                  <Icon d={ICONS.upload} size={12} stroke="#22c55e" sw={2} />
                  {farmImagePreview ? "Replace Image" : "Upload Image"}
                </label>
              </div>
              {farmImagePreview && (
                <div style={{ borderRadius: "12px", overflow: "hidden", border: "0.5px solid #d1e0d6", height: "140px" }}>
                  <img src={farmImagePreview} alt="Farm field" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main> 

      {/* Edit Modal */}
      {showEdit && (
        <EditModal
          profile={profile}
          onClose={() => setShowEdit(false)}
          onSaved={handleProfileSaved}
        />
      )}
    </div>
  );
}
