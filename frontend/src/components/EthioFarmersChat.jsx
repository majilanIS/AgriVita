import { useState, useEffect, useRef } from "react";

// ─── Language config ──────────────────────────────────────────────────────────
const LANGUAGES = {
  en: { label: "English",     flag: "🇬🇧" },
  am: { label: "አማርኛ",        flag: "🇪🇹" },
  or: { label: "Oromigna",    flag: "🇪🇹" },
  ti: { label: "ትግርኛ",        flag: "🇪🇹" },
};

const UI_TEXT = {
  en: {
    subtitle: "Ethiopian Crop Disease & Pest Assistant",
    placeholder: "Describe your crop problem… (e.g. 'My wheat leaves have orange powder')",
    footer: "Powered by Gemini AI · Consult your local DA (Development Agent) for serious issues",
    online: "Online",
    greeting:
      "Selam! 👋 I'm Agrivita — your Ethiopian farming AI assistant.\n\nI can help you identify crop diseases and pests, give treatment advice, and guide you on best farming practices for Ethiopian crops like teff, wheat, maize, coffee, enset, and more.\n\nDescribe what you're seeing on your crops and I'll help you diagnose the problem. Ayizoh! 🌱",
    quickQuestions: [
      "My maize leaves have holes and slime — what pest?",
      "Yellow rust on my wheat — how to treat?",
      "Coffee leaves turning yellow and falling off",
      "Fall armyworm — how to control it?",
      "My enset plants are rotting at the base",
      "When should I plant teff in Amhara region?",
    ],
    errorKey: "⚠️ Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.",
    errorGeneric: "⚠️ Failed to get response. Please try again.",
    errorQuota: "⚠️ Gemini quota exceeded for this API key/project. Enable billing or use another key, then try again.",
    clearChat: "Clear chat",
  },
  am: {
    subtitle: "የኢትዮጵያ ሰብል በሽታና ተባይ ረዳት",
    placeholder: "የሰብልዎን ችግር ይግለጹ… (ለምሳሌ፦ 'የስንዴ ቅጠሌ ብርቱካናማ ዱቄት አለ')",
    footer: "በ Gemini AI የተቀናጀ · ለከባድ ችግሮች የሀ/ሰ ባለሙያዎን ያማክሩ",
    online: "ተያይዟል",
    greeting:
      "ሰላም! 👋 እኔ Agrivita ነኝ — የኢትዮጵያ ገበሬዎች AI ረዳት።\n\nከጤፍ፣ ስንዴ፣ በቆሎ፣ ቡና፣ እንሰት እና ሌሎች ሰብሎች ጋር የተያያዙ በሽታዎችና ተባዮችን ለመለየት፣ ህክምና ለማቅረብ እና የእርሻ ምክር ለመስጠት ዝግጁ ነኝ።\n\nበሰብልዎ ላይ ምን እያዩ እንደሆነ ይንገሩኝ — እርዳዎታለሁ። አይዞህ! 🌱",
    quickQuestions: [
      "የበቆሎ ቅጠሌ ቀዳዳ አለበት — ምን ተባይ ነው?",
      "በስንዴዬ ቢጫ ዝገት አለ — እንዴት ማከም ይቻላል?",
      "የቡና ቅጠሌ ወደ ቢጫ ይቀየርና ይረግፋል",
      "Fall armyworm — እንዴት ይቆጣጠራሉ?",
      "የእንሰቴ ቡጢ ከስሩ ይበሰብሳል",
      "ጤፍ መቼ ለመዝራት ይሻላል?",
    ],
    errorKey: "⚠️ Gemini API key አልተገኘም። VITE_GEMINI_API_KEY ን .env ፋይልዎ ላይ ያስገቡ።",
    errorGeneric: "⚠️ ምላሽ ለማምጣት አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
    errorQuota: "⚠️ የ Gemini quota አልቋል። ቢሊንግ ያንቁ ወይም ሌላ API key ይጠቀሙ፣ ከዚያ ደግመው ይሞክሩ።",
    clearChat: "ውይይቱን አጽዱ",
  },
  or: {
    subtitle: "Gargaarsa Dhibee fi Ilbiisota Qonnaa Itoophiyaa",
    placeholder: "Rakkoo midhaan keessanii ibsaa… (fkn. 'Harreen qamadii koo halluu keelloo qaba')",
    footer: "Gemini AI tiin hojjetama · Rakkoo cimaa yoo ta'e ogeessa qonnaa tti dhiyaadhu",
    online: "Walqunnamtii jira",
    greeting:
      "Akkam! 👋 Ani Agrivita dha — gargaaraa AI qonnaa Itoophiyaa.\n\nDhibee fi ilbiisota midhaan irratti argamu adda baasuu, yaala kennuu, fi qajeelfama qonnaa sirrii kennuuf qophaa'eera — Teff, Qamadii, Boqqoloo, Bunaa, Inset, fi kanneen biroo.\n\nMidhaan keessan irratti maal argaa akka jirtan natti himaa — nan gargaara. Injifannoo! 🌱",
    quickQuestions: [
      "Harreen boqqolloo koo cuquliisa qaba — ilbiisa maalii?",
      "Qamadii koo irratti dhibee keelloo — akkamitti yaaluun danda'ama?",
      "Harreen bunaa koo keellootti geeddaramee kufaa jira",
      "Fall armyworm — akkamitti to'achuun danda'ama?",
      "Inset koo bu'uura irraa busheessaa jira",
      "Teff yoom facaasuun gaariidha?",
    ],
    errorKey: "⚠️ Gemini API key hin argamne. VITE_GEMINI_API_KEY .env file keessan itti dabalaa.",
    errorGeneric: "⚠️ Deebii argachuuf hin danda'amne. Irra deebi'ii yaalaa.",
    errorQuota: "⚠️ Quota Gemini darbeera. Billing bansi yookiin API key biraa fayyadami, sana booda irra deebi'i yaali.",
    clearChat: "Dubbii haqi",
  },
  ti: {
    subtitle: "ሓጋዚ ሕማምን ተባዕን ሕርሻ ኢትዮጵያ",
    placeholder: "ጸገም ሰብሊኹም ግለጹ… (ምሳሌ፦ 'ቅጠል ስርናይ ብጫ ሓሙኹሽቲ ኣሎ')",
    footer: "ብ Gemini AI ዝዳለወ · ንዓቢ ጸገም ናብ ሓባሪ ሕርሻ ሸፍ",
    online: "ተራኺቡ",
    greeting:
      "ሰላም! 👋 ኣነ Agrivita እየ — ሓጋዚ AI ሕርሻ ኢትዮጵያ።\n\nሕማምን ተባዕን ናይ ጤፍ፣ ስርናይ፣ ቆሎ፣ ቡን፣ ዕምቡባ ሙዝን ካልኦት ሰብሊ ንምፍላጥ፣ ሕክምና ንምሃብን ምኽሪ ሕርሻ ንምሃብን ድሉው እየ።\n\nኣብ ሰብሊኹም እንታይ ትርእዩ ሃቡኒ — ክሕግዘኩም እየ። ኣይትሰኣን! 🌱",
    quickQuestions: [
      "ቅጠል ቆሎ ኣብሓቱ ኣሎ — ምንታይ ተባዕ?",
      "ብጫ ዝግኣ ኣብ ስርናይ — ብኸመይ ይፍወስ?",
      "ቅጠል ቡን ብጫ ኮይኑ ይረግፍ ኣሎ",
      "Fall armyworm — ብኸመይ ይቆጻጸር?",
      "ዕምቡባ ሙዝ ካብ ሱሩ ይበሰብስ ኣሎ",
      "ጤፍ መዓስ ምዝራዕ ይምረጽ?",
    ],
    errorKey: "⚠️ Gemini API key ኣይተረኽበን። VITE_GEMINI_API_KEY ናብ .env ፋይልካ ወስኽ።",
    errorGeneric: "⚠️ መልሲ ምምጻእ ኣይተኻእለን። ደጊምካ ፈትን።",
    errorQuota: "⚠️ Quota Gemini ተወዲኡ ኣሎ። Billing ኣብርህ ወይ ካልእ API key ተጠቐም፣ ከምኡ ድማ ደጊምካ ፈትን።",
    clearChat: "ዕላል ጽረግ",
  },
};

// ─── System prompt builder (matches the full AgriVita prompt) ─────────────────
function buildSystemPrompt(lang) {
  const langRule = {
    en: "Always respond ONLY in English.",
    am: "Always respond ONLY in Amharic (አማርኛ) using Ethiopic script.",
    or: "Always respond ONLY in Afaan Oromoo.",
    ti: "Always respond ONLY in Tigrigna (ትግርኛ) using Ethiopic script.",
  }[lang];

  return `You are AgriVita AI, an intelligent Ethiopian agriculture assistant designed to help farmers, buyers, and agricultural workers across Ethiopia.

Your purpose is to guide farmers using simple, practical, and localized agricultural advice.

LANGUAGE RULE (CRITICAL): ${langRule} Do not switch languages under any circumstance.

IMPORTANT RULES:
1. Always answer in the user's selected language.
2. Keep explanations simple and farmer-friendly.
3. Use practical agricultural advice suitable for Ethiopia.
4. Focus mainly on Ethiopian farming conditions, climate, crops, pests, and diseases.
5. Never use overly technical scientific language unless the user asks for it.
6. Be respectful, supportive, and educational.
7. Give step-by-step guidance whenever possible.
8. If the user asks unrelated questions, politely redirect toward agriculture and app guidance.
9. Do NOT invent dangerous chemical recommendations.
10. Encourage safe farming practices and sustainable agriculture.

APP GUIDANCE SUPPORT:
You help users understand how to use the AgriVita platform. You can explain: how to create an account, upload farm documents, update farmer profile, add crops, upload crop images, check crop disease information, communicate with buyers, switch language, use AI assistant features, manage farm details, upload farm certificates, navigate the dashboard. Give short step-by-step instructions, be beginner-friendly.

CROP DISEASE & PEST EXPERTISE (Ethiopia-specific):
- Teff: stalk borer (Chilo partellus), head smut, leaf blight
- Wheat & Barley: stem rust (Puccinia graminis), yellow rust, loose smut, Septoria, Hessian fly, aphids
- Maize: fall armyworm (Spodoptera frugiperda), maize streak virus, grey leaf spot, weevil
- Sorghum: shoot fly, head bug (Eurystylus oldi), grain mold, downy mildew
- Coffee: CBD (Colletotrichum kahawae), coffee wilt, leaf rust, antestia bug, berry borer
- Enset: Xanthomonas wilt (XW) — devastating bacterial disease in southern Ethiopia
- Potato: late blight (Phytophthora infestans), bacterial wilt, tuber moth
- Chickpea/Lentil: Ascochyta blight, Fusarium wilt, aphids, pod borers
- Sesame: Phytophthora blight, bacterial blight, webworm
- Tomato, Onion, Barley also supported.

For disease/pest questions: 1) Explain possible causes 2) Explain visible symptoms 3) Suggest prevention 4) Suggest safe treatment 5) Suggest natural/affordable local solutions 6) Encourage contacting local DA (Development Agent) for severe outbreaks.

CROP GUIDANCE: Planting seasons (Belg, Kiremt/Meher, Bega), soil prep, spacing, fertilizer (urea, DAP), irrigation, post-harvest storage.

REGIONS: Highlands (Amhara, Oromia) — wheat/barley/teff/potato/enset; Midlands — maize/sorghum/coffee; Lowlands (Afar, Somali, Gambella) — sorghum/sesame; SNNPR — enset/coffee/horticulture.

IPM: Early warning signs, biological controls, cultural practices, chemical control (safe use only), local remedies.

When farmer describes symptoms, if needed ask: which crop? which part? what color/pattern? how much of field affected? when did it start? Then give: diagnosis + severity assessment + step-by-step action plan.

COMMUNICATION STYLE:
- Friendly, helpful, professional, encouraging, clear and simple.
- Prefer bullet points and step-by-step guidance over long paragraphs.
- Avoid complex terminology.
- Never recommend banned pesticides. If unsure, say so and refer to local DA.
- Never give unsafe medical advice or false guarantees.
- Always prioritize farmer safety.`;
}

// ─── Format AI reply for readability ─────────────────────────────────────────
function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")   // strip bold markdown
    .replace(/\*(.*?)\*/g, "$1")        // strip italic markdown
    .replace(/#{1,6}\s/g, "")           // strip headers
    .replace(/\n{3,}/g, "\n\n")         // max 2 newlines
    .trim();
}

// ─── Gemini API caller ────────────────────────────────────────────────────────
async function callGemini(apiKey, systemPrompt, conversationHistory, preferredModel) {
  // Build the `contents` array: alternating user / model turns
  // Gemini requires strict user→model→user→model alternation
  const contents = conversationHistory.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
      topP: 0.9,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  const modelCandidates = [
    preferredModel || "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-flash-latest",
    "gemini-2.5-flash",
  ].filter(Boolean);

  let lastError = null;

  for (const model of modelCandidates) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      const message = errData?.error?.message || `Gemini API error ${res.status}`;
      lastError = new Error(message);

      const lower = message.toLowerCase();
      const modelNotSupported =
        lower.includes("not found for api version") ||
        lower.includes("is not supported for generatecontent") ||
        lower.includes("not found");

      if (modelNotSupported) {
        continue;
      }

      throw lastError;
    }

    const data = await res.json();

    // Extract text — handle known Gemini response shapes
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.[0]?.text ||
      data?.candidates?.[0]?.message?.content?.[0]?.text ||
      null;

    if (!reply) {
      const blockReason = data?.promptFeedback?.blockReason;
      if (blockReason) {
        throw new Error(`Request blocked by Gemini: ${blockReason}`);
      }
      throw new Error("No response text received from Gemini.");
    }

    return formatMessage(reply);
  }

  throw lastError || new Error("No compatible Gemini model found for this API key.");
}

async function callGroq(apiKey, systemPrompt, conversationHistory) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Groq API error ${response.status}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) {
    throw new Error("No response text received from Groq.");
  }

  return formatMessage(reply);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AgrivitaChat() {
  const [lang, setLang] = useState("en");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fullTypingTarget, setFullTypingTarget] = useState("");
  const messagesEndRef = useRef(null);
  const dropdownRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  // Typing animation
  useEffect(() => {
    if (!isTyping || !fullTypingTarget) return;
    let i = 0;
    setTypingText("");
    const interval = setInterval(() => {
      i++;
      if (i <= fullTypingTarget.length) {
        setTypingText(fullTypingTarget.substring(0, i));
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setTypingText("");
        setFullTypingTarget("");
      }
    }, 10);
    return () => clearInterval(interval);
  }, [isTyping, fullTypingTarget]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function switchLanguage(newLang) {
    setLang(newLang);
    setDropdownOpen(false);
    setMessages([]);
    setInput("");
    setIsTyping(false);
    setTypingText("");
    setFullTypingTarget("");
  }

  function clearChat() {
    setMessages([]);
    setInput("");
    setIsTyping(false);
    setTypingText("");
    setFullTypingTarget("");
  }

  async function sendMessage(text) {
    if (!text.trim() || isLoading) return;

    const userMsg = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const ui = UI_TEXT[lang];

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error(ui.errorKey);

      const systemPrompt = buildSystemPrompt(lang);
      const reply = await callGemini(
        apiKey,
        systemPrompt,
        updatedMessages,
        import.meta.env.VITE_GEMINI_MODEL
      );

      // Add placeholder assistant message, then trigger typing animation
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setFullTypingTarget(reply);
      setIsTyping(true);
    } catch (err) {
      console.error("AgriVita chat error:", err);
      const rawMessage = String(err?.message || "");
      const isQuotaError =
        rawMessage.includes("RESOURCE_EXHAUSTED") ||
        rawMessage.includes("quota") ||
        rawMessage.includes("429");

      if (isQuotaError && import.meta.env.VITE_GROQ_API_KEY) {
        try {
          const fallbackReply = await callGroq(
            import.meta.env.VITE_GROQ_API_KEY,
            buildSystemPrompt(lang),
            updatedMessages
          );

          setMessages((prev) => [...prev, { role: "assistant", content: fallbackReply }]);
          setFullTypingTarget(fallbackReply);
          setIsTyping(true);
          return;
        } catch (fallbackErr) {
          console.error("Groq fallback error:", fallbackErr);
        }
      }

      const normalized = isQuotaError ? ui.errorQuota : rawMessage;
      const errorMsg = normalized?.startsWith("⚠️")
        ? normalized
        : `${ui.errorGeneric}\n${normalized || ""}`;
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e?.preventDefault();
    sendMessage(input);
  }

  const ui = UI_TEXT[lang];
  const lastIdx = messages.length - 1;

  // Greeting message (shown when no messages yet)
  const showGreeting = messages.length === 0 && !isLoading;

  return (
    <div style={{
      height: "100%",
      minHeight: 0,
      background: "linear-gradient(160deg,#0a1f0a 0%,#0d2b0d 40%,#111f0a 100%)",
      display: "flex", flexDirection: "column",
      fontFamily: "Georgia, serif",
      overflow: "hidden",
    }}>

      {/* ── Header ── */}
      <div style={{
        width: "100%",
        background: "rgba(14,38,9,0.97)",
        borderBottom: "1px solid rgba(120,180,60,0.22)",
        padding: "11px 14px",
        display: "flex", alignItems: "center", gap: 11,
        boxSizing: "border-box",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "linear-gradient(135deg,#4a9e1a,#2d6e0a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 19, flexShrink: 0,
          border: "2px solid rgba(120,180,60,0.38)",
        }}>🌾</div>

        {/* Title */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#a8d84a", letterSpacing: "0.3px" }}>Agrivita</div>
          <div style={{ fontSize: 11, color: "rgba(168,216,74,0.5)", fontFamily: "sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ui.subtitle}
          </div>
        </div>

        {/* Online indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "sans-serif", fontSize: 11, color: "#5aba20", flexShrink: 0 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#5aba20", animation: "pulse 2s infinite" }} />
          {ui.online}
        </div>

        {/* Clear chat button */}
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            title={ui.clearChat}
            style={{
              padding: "5px 9px", borderRadius: 8,
              border: "1px solid rgba(120,180,50,0.28)",
              background: "rgba(25,55,8,0.65)",
              color: "rgba(168,216,74,0.7)", fontSize: 11,
              cursor: "pointer", fontFamily: "sans-serif",
              flexShrink: 0, transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(55,105,18,0.55)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(25,55,8,0.65)"}
          >
            🗑 {ui.clearChat}
          </button>
        )}

        {/* Language picker */}
        <div ref={dropdownRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 9px", borderRadius: 8,
              border: "1px solid rgba(120,180,50,0.38)",
              background: dropdownOpen ? "rgba(55,105,18,0.55)" : "rgba(25,55,8,0.65)",
              color: "#a8d84a", fontSize: 12, cursor: "pointer",
              fontFamily: "sans-serif", transition: "background 0.15s",
            }}
          >
            <span>{LANGUAGES[lang].flag}</span>
            <span>{LANGUAGES[lang].label}</span>
            <span style={{ fontSize: 8, opacity: 0.65, marginLeft: 2 }}>▼</span>
          </button>

          {dropdownOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0,
              background: "rgba(10,30,7,0.98)",
              border: "1px solid rgba(100,160,40,0.32)",
              borderRadius: 10, overflow: "hidden",
              zIndex: 200, minWidth: 148,
              boxShadow: "0 10px 28px rgba(0,0,0,0.55)",
            }}>
              {Object.entries(LANGUAGES).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => switchLanguage(code)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 9,
                    padding: "9px 13px", border: "none",
                    borderBottom: "1px solid rgba(80,130,30,0.13)",
                    background: code === lang ? "rgba(55,105,18,0.48)" : "transparent",
                    color: code === lang ? "#a8d84a" : "rgba(175,215,95,0.7)",
                    fontSize: 13, cursor: "pointer",
                    fontFamily: "sans-serif", textAlign: "left",
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => { if (code !== lang) e.currentTarget.style.background = "rgba(35,75,12,0.4)"; }}
                  onMouseLeave={e => { if (code !== lang) e.currentTarget.style.background = "transparent"; }}
                >
                  <span>{info.flag}</span>
                  <span style={{ flex: 1 }}>{info.label}</span>
                  {code === lang && <span style={{ fontSize: 10, color: "#7ecf30" }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick-question chips ── */}
      <div style={{
        width: "100%", padding: "8px 13px", boxSizing: "border-box",
        background: "rgba(9,26,7,0.72)",
        borderBottom: "1px solid rgba(100,160,40,0.11)",
        overflowX: "auto", display: "flex", gap: 6, flexWrap: "nowrap",
      }}>
        {ui.quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => !isLoading && sendMessage(q)}
            disabled={isLoading}
            style={{
              whiteSpace: "nowrap", flexShrink: 0,
              padding: "5px 11px", borderRadius: 20,
              border: "1px solid rgba(110,170,45,0.28)",
              background: "rgba(45,85,13,0.32)",
              color: "#98cc3a", fontSize: 11,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontFamily: "sans-serif", transition: "all 0.18s",
              opacity: isLoading ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "rgba(65,115,20,0.5)"; }}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(45,85,13,0.32)"}
          >
            {q}
          </button>
        ))}
      </div>

      {/* ── Message area ── */}
      <div style={{
        flex: 1, width: "100%", overflowY: "auto",
        padding: "14px 13px", boxSizing: "border-box",
        display: "flex", flexDirection: "column", gap: 10,
        minHeight: 0,
      }}>

        {/* Greeting card (no messages yet) */}
        {showGreeting && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
            <div style={{
              width: 27, height: 27, borderRadius: "50%",
              background: "linear-gradient(135deg,#3d8c14,#1e5009)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, flexShrink: 0,
              border: "1px solid rgba(100,180,40,0.35)",
            }}>🌱</div>
            <div style={{
              maxWidth: "80%", padding: "11px 14px",
              borderRadius: "17px 17px 17px 4px",
              background: "rgba(16,40,9,0.92)",
              border: "1px solid rgba(95,155,38,0.2)",
              color: "#c4e590", fontSize: 13.5, lineHeight: 1.7,
              fontFamily: "sans-serif", whiteSpace: "pre-wrap",
            }}>
              {ui.greeting}
            </div>
          </div>
        )}

        {/* Conversation messages */}
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          const isLastAsst = idx === lastIdx && !isUser && isTyping;
          const text = isLastAsst ? typingText : msg.content;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
                alignItems: "flex-end", gap: 7,
              }}
            >
              {/* AI avatar */}
              {!isUser && (
                <div style={{
                  width: 27, height: 27, borderRadius: "50%",
                  background: "linear-gradient(135deg,#3d8c14,#1e5009)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, flexShrink: 0,
                  border: "1px solid rgba(100,180,40,0.35)",
                }}>🌱</div>
              )}

              {/* Bubble */}
              <div style={{
                maxWidth: "78%", padding: "9px 13px",
                borderRadius: isUser ? "17px 17px 4px 17px" : "17px 17px 17px 4px",
                background: isUser
                  ? "linear-gradient(135deg,#2d6e0a,#3d8c14)"
                  : "rgba(16,40,9,0.92)",
                border: isUser ? "none" : "1px solid rgba(95,155,38,0.2)",
                color: isUser ? "#e8f8d0" : "#c4e590",
                fontSize: 13.5, lineHeight: 1.68,
                fontFamily: "sans-serif",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {text}
                {isLastAsst && (
                  <span style={{
                    display: "inline-block", width: 2, height: 13,
                    background: "#8dd430", marginLeft: 2,
                    animation: "blink 1s infinite", verticalAlign: "middle",
                  }} />
                )}
              </div>
            </div>
          );
        })}

        {/* Loading dots */}
        {isLoading && !isTyping && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7 }}>
            <div style={{
              width: 27, height: 27, borderRadius: "50%",
              background: "linear-gradient(135deg,#3d8c14,#1e5009)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12,
            }}>🌱</div>
            <div style={{
              padding: "10px 14px",
              background: "rgba(16,40,9,0.92)",
              border: "1px solid rgba(95,155,38,0.2)",
              borderRadius: "17px 17px 17px 4px",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#5aba20",
                  animation: `bounce 1.2s ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div style={{
        width: "100%", padding: "10px 13px", boxSizing: "border-box",
        background: "rgba(7,19,5,0.97)",
        borderTop: "1px solid rgba(95,155,38,0.17)",
        position: "sticky", bottom: 0,
      }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={ui.placeholder}
            disabled={isLoading}
            rows={1}
            style={{
              flex: 1, resize: "none", overflowY: "hidden",
              padding: "9px 13px",
              background: "rgba(16,46,8,0.78)",
              border: "1px solid rgba(95,155,38,0.3)",
              borderRadius: 13,
              color: "#d5ee99", fontSize: 13.5,
              fontFamily: "sans-serif", outline: "none",
              lineHeight: 1.5, minHeight: 40,
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(120,200,50,0.6)"}
            onBlur={e => e.target.style.borderColor = "rgba(95,155,38,0.3)"}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
            style={{
              width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
              background: (!isLoading && input.trim())
                ? "linear-gradient(135deg,#4a9e1a,#2d6e0a)"
                : "rgba(32,62,12,0.42)",
              border: "none",
              cursor: (!isLoading && input.trim()) ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!isLoading && input.trim()) e.currentTarget.style.transform = "scale(1.08)"; }}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {isLoading ? "⏳" : "📤"}
          </button>
        </div>
        <div style={{
          textAlign: "center", marginTop: 5, fontSize: 10.5,
          color: "rgba(125,175,50,0.32)", fontFamily: "sans-serif",
        }}>
          {ui.footer}
        </div>
      </div>

      <style>{`
        @keyframes pulse  { 0%,100%{opacity:1}          50%{opacity:0.35} }
        @keyframes blink  { 0%,100%{opacity:1}          50%{opacity:0}    }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(95,155,38,0.22); border-radius: 4px; }
      `}</style>
    </div>
  );
}
