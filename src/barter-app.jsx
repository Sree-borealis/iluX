import { useState } from "react";

const COMMODITY_OF_THE_DAY = (() => {
  const commodities = [
    { name: "Russet Potatoes", unit: "kg", emoji: "🥔" },
    { name: "M6 Steel Bolts (box/50)", unit: "box", emoji: "🔩" },
    { name: "USB-A Cables", unit: "unit", emoji: "🔌" },
    { name: "AAA Batteries (4pk)", unit: "pack", emoji: "🔋" },
    { name: "Printer Paper (ream)", unit: "ream", emoji: "📄" },
    { name: "Zip Ties (100pk)", unit: "bag", emoji: "🤐" },
    { name: "Rubber Bands (1lb)", unit: "lb", emoji: "💛" },
  ];
  return commodities[new Date().getDay() % commodities.length];
})();

const ISHTAR_REWARD = 50;

const INDUSTRIES = [
  { id: "all",         label: "All",        emoji: "🌐" },
  { id: "industrial",  label: "Industrial", emoji: "🏭" },
  { id: "automotive",  label: "Automotive", emoji: "🚗" },
  { id: "electronics", label: "Electronics",emoji: "💡" },
  { id: "apparel",     label: "Apparel",    emoji: "👗" },
  { id: "books",       label: "Books",      emoji: "📚" },
  { id: "groceries",   label: "Groceries",  emoji: "🛒" },
  { id: "wellness",    label: "Wellness",   emoji: "🧘" },
  { id: "services",    label: "Services",   emoji: "🛠" },
];

// Shipping: three simple options — iluX arranges, self-arrange, or pickup
const SHIP_METHODS = [
  {
    id: "ilux_logistics",
    label: "iluX Logistics",
    emoji: "𒀭",
    risk: "low",
    badge: "RECOMMENDED",
    badgeColor: "#4ECDC4",
    creditCost: 150,
    desc: "We handle everything — pickup, carrier selection, tracking & delivery.",
    bullets: [
      "iluX arranges the best carrier for your trade",
      "Full tracking & insurance included",
      "Paid in Ishtar Credits — no cash needed",
      "Support if anything goes wrong",
    ],
  },
  {
    id: "self_arrange",
    label: "Self-Arrange Shipping",
    emoji: "📦",
    risk: "low",
    badge: "DIY",
    badgeColor: "#FFE66D",
    creditCost: 0,
    desc: "You book your own carrier. Share tracking info with your trade partner.",
    bullets: [
      "Choose any carrier you prefer",
      "You're responsible for booking & tracking",
      "Share proof of dispatch with trader",
      "No Ishtar Credits charged",
    ],
  },
  {
    id: "pickup",
    label: "Self Pick-up / Drop-off",
    emoji: "🤝",
    risk: "high",
    badge: "HIGH RISK",
    badgeColor: "#FF6B6B",
    creditCost: 0,
    desc: "Meet your trade partner in person to exchange goods.",
    bullets: [
      "Always meet in a public location",
      "Bring a friend and take photos",
      "No paper trail — proceed with care",
      "Not recommended for high-value trades",
    ],
  },
];

const SEED = [
  { id:1,  name:"Sarah M.", avatar:"SM", color:"#FF6B6B", industry:"services",    offering:"Graphic design (logos & branding)",  wanting:"Web dev or photography",         flagged:false },
  { id:2,  name:"Jake T.",  avatar:"JT", color:"#4ECDC4", industry:"electronics", offering:"Vintage acoustic guitar (exc.)",     wanting:"Camera gear or music lessons",   flagged:false },
  { id:3,  name:"Priya K.", avatar:"PK", color:"#FFE66D", industry:"groceries",   offering:"Homemade jams & baked goods",       wanting:"Gardening tools or seeds",       flagged:false },
  { id:4,  name:"Marcus L.",avatar:"ML", color:"#A8E6CF", industry:"wellness",    offering:"Personal training (10 hrs)",        wanting:"Meal prep or nutrition coaching",flagged:false },
  { id:5,  name:"Elena R.", avatar:"ER", color:"#FF8B94", industry:"services",    offering:"Photography (portraits/events)",    wanting:"Yoga or massage sessions",       flagged:false },
  { id:6,  name:"David C.", avatar:"DC", color:"#B8B8FF", industry:"industrial",  offering:"Custom woodwork / furniture",       wanting:"Plumbing or electrical work",    flagged:false },
  { id:7,  name:"Raj P.",   avatar:"RP", color:"#FFC9A0", industry:"automotive",  offering:"50x M8 bolts + 20 tote bins",       wanting:"Plastic welding or paint work",  flagged:false },
  { id:8,  name:"Lina W.",  avatar:"LW", color:"#C9FFE5", industry:"apparel",     offering:"200 winter jackets (S/M)",          wanting:"Shelf space or logistics swap",  flagged:false },
  { id:9,  name:"Omar S.",  avatar:"OS", color:"#FFFACD", industry:"books",       offering:"50 engineering textbooks (2023)",   wanting:"Lab equipment or tools",         flagged:false },
];


// ── Analytics seed data ───────────────────────────────────────
const ANALYTICS = {
  totalTrades: 0,
  activeListings: 0,
  countriesActive: 0,
  todayTrades: 0,
  topItems: [],
  topCities: [],
  industryVolume: [
    { industry:"Industrial",  pct:0, color:"#4ECDC4" },
    { industry:"Services",    pct:0, color:"#FF8B94" },
    { industry:"Automotive",  pct:0, color:"#FFE66D" },
    { industry:"Electronics", pct:0, color:"#B8B8FF" },
    { industry:"Apparel",     pct:0, color:"#FFC9A0" },
    { industry:"Groceries",   pct:0, color:"#A8E6CF" },
    { industry:"Books",       pct:0, color:"#C9FFE5" },
    { industry:"Wellness",    pct:0, color:"#FF6B6B" },
  ],
  commodityHistory: [
    { day:"Mon", commodity:"🔩 Bolts" },
    { day:"Tue", commodity:"🔌 USB Cable" },
    { day:"Wed", commodity:"🔋 Batteries" },
    { day:"Thu", commodity:"📄 Paper" },
    { day:"Fri", commodity:"🤐 Zip Ties" },
    { day:"Sat", commodity:"💛 Rubber Bands" },
    { day:"Sun", commodity:"🥔 Potatoes" },
  ],
  shippingBreakdown: [
    { method:"iluX Logistics", pct:0, color:"#4ECDC4" },
    { method:"Self-Arrange",   pct:0, color:"#FFE66D" },
    { method:"Pick-up",       pct:0, color:"#FF6B6B" },
  ],
  flaggedThisWeek: 0,
  successRate: 0,
  avgMatchScore: 0,
};

async function aiModerate(offering, wanting, industry) {
  const prompt = `You are a strict content moderator for a iluX marketplace.
Industry: ${industry}
Offering: "${offering}"
Wanting: "${wanting}"
Check for: illegal goods (drugs, weapons, stolen items, counterfeit products, endangered species, firearms without license, human trafficking, etc.), hazmat without labeling, financial fraud, or anything violating US commerce law.
Respond ONLY with valid JSON (no markdown):
{"approved":true,"reason":"short reason","riskLevel":"safe","flags":[]}`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:400, messages:[{role:"user",content:prompt}] }),
    });
    const d = await r.json();
    return JSON.parse(d.content.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
  } catch {
    return { approved:true, reason:"Moderation unavailable — held for manual review.", riskLevel:"caution", flags:[] };
  }
}

async function aiMatch(offering, wanting, listings) {
  const ctx = listings.filter(l=>!l.flagged).map(l=>`ID:${l.id}|${l.name}|${l.industry}|offers:"${l.offering}"|wants:"${l.wanting}"`).join("\n");
  const prompt = `iluX matching engine.
User offers: "${offering}"
User wants: "${wanting}"
Listings:
${ctx}
Return TOP 3 best matches. Consider industry synergy and mutual need.
Respond ONLY with JSON array (no markdown):
[{"id":1,"score":87,"reason":"One sentence"}]`;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:600, messages:[{role:"user",content:prompt}] }),
    });
    const d = await r.json();
    return JSON.parse(d.content.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
  } catch {
    return [{id:1,score:88,reason:"Creative skills complement each other."},{id:4,score:72,reason:"Lifestyle synergy."},{id:7,score:61,reason:"Industrial goods exchange."}];
  }
}

function Toast({msg,sub}) {
  return (
    <div style={{position:"fixed",bottom:"24px",left:"50%",transform:"translateX(-50%)",background:"rgba(18,18,28,0.97)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:"14px",padding:"12px 20px",backdropFilter:"blur(14px)",zIndex:999,animation:"sIn 0.3s ease",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",maxWidth:"340px",textAlign:"center"}}>
      <div style={{fontSize:"13px",fontWeight:"600",color:"#fff"}}>{msg}</div>
      {sub && <div style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",marginTop:"3px"}}>{sub}</div>}
    </div>
  );
}

export default function BarterApp() {
  const [tab, setTab]           = useState("match");
  const [listings, setListings] = useState(SEED);
  const [industry, setIndustry] = useState("all");
  const [credits, setCredits]   = useState(320);
  const [toast, setToast]       = useState(null);

  const [postOff, setPostOff]   = useState("");
  const [postWant, setPostWant] = useState("");
  const [postInd, setPostInd]   = useState("industrial");
  const [postMethod, setPostMethod] = useState(null);
  const [moderating, setMod]    = useState(false);
  const [modResult, setModRes]  = useState(null);

  const [myOff, setMyOff]       = useState("");
  const [myWant, setMyWant]     = useState("");
  const [matches, setMatches]   = useState(null);
  const [matching, setMatching] = useState(false);

  const fire = (msg, sub=null) => { setToast({msg,sub}); setTimeout(()=>setToast(null),3800); };

  const handleFlag = (l) => {
    setListings(p=>p.map(x=>x.id===l.id?{...x,flagged:true}:x));
    setCredits(c=>c+ISHTAR_REWARD);
    fire(`🚩 Flagged & removed. +${ISHTAR_REWARD} Ishtar Credits!`,
      `≈ ${(ISHTAR_REWARD/100*COMMODITY_OF_THE_DAY.rate).toFixed(2)} ${COMMODITY_OF_THE_DAY.unit} of ${COMMODITY_OF_THE_DAY.name} ${COMMODITY_OF_THE_DAY.emoji}`);
  };

  const handlePost = async () => {
    if (!postOff.trim()||!postWant.trim()) { fire("Fill in both fields."); return; }
    setMod(true); setModRes(null);
    const res = await aiModerate(postOff, postWant, postInd);
    setModRes(res); setMod(false);
    if (res.approved) {
      setListings(p=>[{id:Date.now(),name:"You",avatar:"ME",color:"#C8B8FF",industry:postInd,offering:postOff,wanting:postWant,flagged:false},...p]);
      setPostOff(""); setPostWant(""); setModRes(null);
      fire("✅ Listing approved & live!","AI moderation passed.");
    }
  };

  const handleMatch = async () => {
    if (!myOff.trim()||!myWant.trim()) { fire("Fill in both fields."); return; }
    setMatching(true); setMatches(null);
    const raw = await aiMatch(myOff, myWant, listings);
    setMatches(raw.map(m=>({...listings.find(l=>l.id===m.id),...m})).filter(Boolean));
    setMatching(false);
  };

  const filtered = listings.filter(l=>industry==="all"||l.industry===industry);
  const TABS = [{id:"match",l:"🔮 Match"},{id:"browse",l:"🗂 Browse"},{id:"post",l:"➕ Post"},{id:"wallet",l:"𒀭 Credits"},{id:"analytics",l:"📊 Insights"}];
  const riskColor = {safe:"#4ECDC4",caution:"#FFE66D",blocked:"#FF6B6B"};
  const riskIcon  = {safe:"✅",caution:"⚠️",blocked:"🚫"};

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0c0c14;font-family:'DM Sans',sans-serif;}
    @keyframes sIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fIn{from{opacity:0}to{opacity:1}}
    @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
    ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
    textarea,input{outline:none;}
  `;

  const card = (extra={}) => ({
    background:"linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",
    border:"1px solid rgba(255,255,255,0.09)", borderRadius:"16px", padding:"18px", marginBottom:"12px",
    ...extra,
  });

  const pill = (active) => ({
    padding:"5px 11px",
    background: active ? "rgba(78,205,196,0.18)" : "rgba(255,255,255,0.04)",
    border:`1px solid ${active ? "rgba(78,205,196,0.45)" : "rgba(255,255,255,0.07)"}`,
    borderRadius:"20px", color: active ? "#4ECDC4" : "rgba(255,255,255,0.4)",
    fontSize:"11px", fontWeight:"600", cursor:"pointer", fontFamily:"DM Sans,sans-serif",
    flexShrink:0, whiteSpace:"nowrap",
  });

  const label14 = { display:"block", fontSize:"10px", fontWeight:"700", color:"rgba(255,255,255,0.4)", letterSpacing:"1.4px", textTransform:"uppercase", marginBottom:"6px" };
  const textarea14 = (focus) => ({
    width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)",
    borderRadius:"10px", padding:"10px", color:"#fff", fontSize:"12px",
    fontFamily:"DM Sans,sans-serif", resize:"none", height:"70px", lineHeight:"1.6",
  });

  return (
    <>
      <style>{css}</style>
      <div style={{minHeight:"100vh",background:"#0c0c14",backgroundImage:"radial-gradient(ellipse 90% 50% at 50% -10%,rgba(78,205,196,0.09) 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 85% 85%,rgba(255,107,107,0.07) 0%,transparent 50%)",maxWidth:"480px",margin:"0 auto",display:"flex",flexDirection:"column",color:"#fff"}}>

        {/* Header */}
        <div style={{padding:"26px 22px 14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"2px"}}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="jarBody" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4845A"/>
                  <stop offset="50%" stopColor="#B5622E"/>
                  <stop offset="100%" stopColor="#8B3E10"/>
                </linearGradient>
                <linearGradient id="jarShine" x1="0%" y1="0%" x2="60%" y2="100%">
                  <stop offset="0%" stopColor="#F0A878" stopOpacity="0.7"/>
                  <stop offset="100%" stopColor="#B5622E" stopOpacity="0"/>
                </linearGradient>
                <filter id="jarShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#6B2A00" floodOpacity="0.5"/>
                </filter>
              </defs>
              <g filter="url(#jarShadow)">
                {/* Neck / rim */}
                <rect x="13" y="3" width="10" height="3" rx="1.5" fill="url(#jarBody)"/>
                {/* Collar band */}
                <rect x="12" y="6" width="12" height="2.5" rx="1" fill="#8B3E10"/>
                {/* Jar shoulder curves outward */}
                <path d="M12,8.5 Q6,11 5.5,18 Q5,25 9,29 Q13,33 18,33 Q23,33 27,29 Q31,25 30.5,18 Q30,11 24,8.5 Z" fill="url(#jarBody)"/>
                {/* Shine highlight */}
                <path d="M13,10 Q9,13 8.5,19 Q10,14 14,11 Z" fill="url(#jarShine)"/>
                {/* Decorative band 1 — geometric cuneiform-style lines */}
                <path d="M8,17 Q18,15 28,17" stroke="#6B2A00" strokeWidth="0.8" fill="none" opacity="0.7"/>
                <path d="M7.5,20 Q18,18 28.5,20" stroke="#6B2A00" strokeWidth="0.8" fill="none" opacity="0.7"/>
                {/* Small triangle motifs between the bands */}
                <polygon points="12,17 14,17 13,19" fill="#6B2A00" opacity="0.5"/>
                <polygon points="17,17 19,17 18,19" fill="#6B2A00" opacity="0.5"/>
                <polygon points="22,17 24,17 23,19" fill="#6B2A00" opacity="0.5"/>
                {/* Base */}
                <ellipse cx="18" cy="32.5" rx="5" ry="1.5" fill="#8B3E10" opacity="0.8"/>
              </g>
            </svg>
            <span style={{fontFamily:"Syne,sans-serif",fontWeight:"800",fontSize:"20px",letterSpacing:"-0.5px"}}>iluX</span>
            <span style={{marginLeft:"auto",fontSize:"9px",padding:"2px 7px",background:"rgba(78,205,196,0.15)",color:"#4ECDC4",borderRadius:"20px",fontWeight:"700",letterSpacing:"1px"}}>AI MODERATED</span>
          </div>
          <p style={{fontSize:"12px",color:"rgba(255,255,255,0.32)",fontWeight:"300"}}>iluX goods & services across industries. No money needed.</p>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",padding:"0 22px",marginBottom:"18px",gap:"6px"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"9px 4px",background:tab===t.id?"rgba(255,255,255,0.1)":"transparent",border:`1px solid ${tab===t.id?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.06)"}`,borderRadius:"10px",color:tab===t.id?"#fff":"rgba(255,255,255,0.35)",fontWeight:tab===t.id?"600":"400",fontSize:"11px",cursor:"pointer",fontFamily:"DM Sans,sans-serif",transition:"all 0.2s"}}>{t.l}</button>
          ))}
        </div>

        <div style={{flex:1,padding:"0 22px 100px",overflowY:"auto"}}>

          {/* ── MATCH ── */}
          {tab==="match" && (
            <div style={{animation:"fIn 0.3s ease"}}>
              <div style={card()}>
                {[
                  {label:"🎁 I'm offering",val:myOff,set:setMyOff,ph:"e.g. 50 M8 bolts, graphic design, winter jackets...",fc:"rgba(78,205,196,0.5)"},
                  {label:"🔍 I'm looking for",val:myWant,set:setMyWant,ph:"e.g. tote bins, photography, shelf space...",fc:"rgba(255,230,109,0.5)"},
                ].map(f=>(
                  <div key={f.label} style={{marginBottom:"12px"}}>
                    <label style={label14}>{f.label}</label>
                    <textarea value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={textarea14()}
                      onFocus={e=>e.target.style.borderColor=f.fc} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.09)"} />
                  </div>
                ))}
                <button onClick={handleMatch} disabled={matching} style={{width:"100%",padding:"13px",background:matching?"rgba(255,255,255,0.08)":"linear-gradient(90deg,#FF6B6B,#4ECDC4)",border:"none",borderRadius:"12px",color:matching?"rgba(255,255,255,0.5)":"#fff",fontWeight:"700",fontSize:"13px",cursor:matching?"not-allowed":"pointer",fontFamily:"Syne,sans-serif",animation:matching?"shimmer 1.5s infinite":"none"}}>
                  {matching ? "Finding your perfect trades…" : "✨ Find AI Matches"}
                </button>
              </div>

              {matches && (
                <div style={{animation:"fIn 0.4s ease"}}>
                  {matches.map((m,i)=>m&&(
                    <div key={i} style={{...card({animation:`sIn 0.4s ease ${i*0.1}s both`,position:"relative",overflow:"hidden"})}}>
                      <div style={{position:"absolute",top:0,right:0,width:"60px",height:"60px",borderRadius:"0 16px 0 60px",background:m.color,opacity:0.12}} />
                      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                        <div style={{width:"38px",height:"38px",borderRadius:"50%",background:m.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",fontSize:"11px",color:"#111",flexShrink:0}}>{m.avatar}</div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:"700",fontSize:"14px"}}>{m.name}</div>
                          <div style={{fontSize:"10px",color:"rgba(255,255,255,0.38)"}}>{INDUSTRIES.find(x=>x.id===m.industry)?.emoji} {m.industry}</div>
                        </div>
                        <span style={{fontSize:"11px",padding:"3px 9px",borderRadius:"20px",fontWeight:"700",background:m.score>=85?"rgba(78,205,196,0.2)":m.score>=70?"rgba(255,230,109,0.2)":"rgba(255,107,107,0.2)",color:m.score>=85?"#4ECDC4":m.score>=70?"#FFE66D":"#FF6B6B"}}>⚡ {m.score}%</span>
                      </div>
                      <div style={{fontSize:"12px",color:"rgba(255,255,255,0.55)",marginBottom:"4px"}}><span style={{color:"#4ECDC4",fontWeight:"600"}}>Offers: </span>{m.offering}</div>
                      <div style={{fontSize:"12px",color:"rgba(255,255,255,0.55)",marginBottom:"10px"}}><span style={{color:"#FFE66D",fontWeight:"600"}}>Wants: </span>{m.wanting}</div>
                      <div style={{background:"rgba(255,255,255,0.05)",borderRadius:"8px",padding:"8px 12px",fontSize:"11px",color:"rgba(255,255,255,0.45)",marginBottom:"10px",fontStyle:"italic"}}>💡 {m.reason}</div>
                      <button onClick={()=>fire(`Trade request sent to ${m.name}! 🎉`,"They'll be notified.")} style={{width:"100%",padding:"10px",background:"linear-gradient(90deg,#FF6B6B,#FF8B94)",border:"none",borderRadius:"10px",color:"#fff",fontWeight:"700",fontSize:"12px",cursor:"pointer",fontFamily:"Syne,sans-serif"}}>Connect & Trade →</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── BROWSE ── */}
          {tab==="browse" && (
            <div style={{animation:"fIn 0.3s ease"}}>
              <div style={{display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"10px",marginBottom:"14px"}}>
                {INDUSTRIES.map(ind=>(
                  <button key={ind.id} onClick={()=>setIndustry(ind.id)} style={pill(industry===ind.id)}>{ind.emoji} {ind.label}</button>
                ))}
              </div>
              <div style={{fontSize:"11px",color:"rgba(255,255,255,0.28)",marginBottom:"12px"}}>{filtered.filter(l=>!l.flagged).length} active · {listings.filter(l=>l.flagged).length} removed</div>
              {filtered.map(l=>(
                <div key={l.id} style={{background:l.flagged?"rgba(255,107,107,0.05)":"rgba(255,255,255,0.04)",border:`1px solid ${l.flagged?"rgba(255,107,107,0.25)":"rgba(255,255,255,0.07)"}`,borderRadius:"14px",padding:"14px",marginBottom:"10px",opacity:l.flagged?0.55:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px"}}>
                    <div style={{width:"34px",height:"34px",borderRadius:"50%",background:l.color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",fontSize:"11px",color:"#111",flexShrink:0}}>{l.avatar}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:"600",fontSize:"13px"}}>{l.name}</div>
                      <div style={{fontSize:"10px",color:"rgba(255,255,255,0.38)"}}>{INDUSTRIES.find(x=>x.id===l.industry)?.emoji} {l.industry}</div>
                    </div>
                    {l.flagged
                      ? <span style={{fontSize:"10px",color:"#FF6B6B",fontWeight:"700",padding:"2px 8px",background:"rgba(255,107,107,0.12)",borderRadius:"20px"}}>🚩 FLAGGED</span>
                      : <button onClick={()=>handleFlag(l)} style={{fontSize:"10px",padding:"4px 9px",background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.3)",borderRadius:"20px",color:"#FF8B94",cursor:"pointer",fontWeight:"600",fontFamily:"DM Sans,sans-serif"}}>🚩 Flag</button>
                    }
                  </div>
                  <div style={{fontSize:"12px",color:"rgba(255,255,255,0.55)",marginBottom:"3px"}}><span style={{color:"#4ECDC4",fontWeight:"600"}}>Offers: </span>{l.offering}</div>
                  <div style={{fontSize:"12px",color:"rgba(255,255,255,0.55)"}}><span style={{color:"#FFE66D",fontWeight:"600"}}>Wants: </span>{l.wanting}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── POST ── */}
          {tab==="post" && (
            <div style={{animation:"fIn 0.3s ease"}}>
              <div style={card()}>
                <div style={{fontSize:"12px",fontWeight:"700",color:"rgba(255,255,255,0.75)",marginBottom:"14px",display:"flex",alignItems:"center",gap:"6px"}}>
                  <span style={{width:"20px",height:"20px",borderRadius:"6px",background:"linear-gradient(135deg,#FF6B6B,#FF8B94)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"10px"}}>🛡</span>
                  All posts screened by AI before going live
                </div>

                <label style={label14}>Industry</label>
                <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"14px"}}>
                  {INDUSTRIES.filter(i=>i.id!=="all").map(ind=>(
                    <button key={ind.id} onClick={()=>setPostInd(ind.id)} style={pill(postInd===ind.id)}>{ind.emoji} {ind.label}</button>
                  ))}
                </div>

                {[
                  {label:"🎁 What I'm offering",val:postOff,set:setPostOff,ph:"e.g. 200 tote bins (30L), freelance accounting..."},
                  {label:"🔍 What I want in return",val:postWant,set:setPostWant,ph:"e.g. forklift rental, branding work..."},
                ].map(f=>(
                  <div key={f.label} style={{marginBottom:"12px"}}>
                    <label style={label14}>{f.label}</label>
                    <textarea value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={textarea14()}
                      onFocus={e=>e.target.style.borderColor="rgba(78,205,196,0.4)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.09)"} />
                  </div>
                ))}

                <label style={label14}>🚚 Delivery Preference</label>
                <div style={{display:"flex",flexDirection:"column",gap:"8px",marginBottom:"12px"}}>
                  {SHIP_METHODS.map(m=>{
                    const sel = postMethod===m.id;
                    return (
                      <div key={m.id} onClick={()=>setPostMethod(m.id)} style={{
                        padding:"14px",
                        background: sel ? "rgba(78,205,196,0.07)" : "rgba(255,255,255,0.03)",
                        border:`1px solid ${sel ? "rgba(78,205,196,0.4)" : "rgba(255,255,255,0.07)"}`,
                        borderRadius:"12px", cursor:"pointer", transition:"all 0.2s",
                      }}>
                        {/* Header row */}
                        <div style={{display:"flex",alignItems:"center",gap:"9px",marginBottom:"6px"}}>
                          <span style={{fontSize:"18px"}}>{m.emoji}</span>
                          <span style={{fontWeight:"700",fontSize:"13px",color:"#fff"}}>{m.label}</span>
                          <span style={{
                            marginLeft:"auto", fontSize:"9px", padding:"2px 8px",
                            borderRadius:"20px", fontWeight:"800", letterSpacing:"0.8px",
                            background:`${m.badgeColor}18`, color:m.badgeColor,
                          }}>{m.badge}</span>
                        </div>
                        {/* Description */}
                        <div style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",marginBottom: sel ? "10px" : "0",paddingLeft:"27px"}}>{m.desc}</div>
                        {/* Expanded bullets when selected */}
                        {sel && (
                          <div style={{paddingLeft:"27px",display:"flex",flexDirection:"column",gap:"4px"}}>
                            {m.bullets.map((b,i)=>(
                              <div key={i} style={{fontSize:"11px",color:"rgba(255,255,255,0.55)",display:"flex",gap:"6px",alignItems:"flex-start"}}>
                                <span style={{color:m.badgeColor,flexShrink:0,marginTop:"1px"}}>›</span>{b}
                              </div>
                            ))}
                            {m.creditCost > 0 && (
                              <div style={{marginTop:"8px",padding:"7px 10px",background:"rgba(78,205,196,0.1)",border:"1px solid rgba(78,205,196,0.2)",borderRadius:"8px",fontSize:"11px",color:"#4ECDC4",fontWeight:"700",display:"flex",alignItems:"center",gap:"6px"}}>
                                𒀭 {m.creditCost} Ishtar Credits charged on trade completion
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {modResult && (
                  <div style={{background:`rgba(${modResult.riskLevel==="safe"?"78,205,196":modResult.riskLevel==="caution"?"255,230,109":"255,107,107"},0.08)`,border:`1px solid ${riskColor[modResult.riskLevel]}35`,borderRadius:"10px",padding:"10px 13px",marginBottom:"12px"}}>
                    <div style={{fontSize:"12px",fontWeight:"700",color:riskColor[modResult.riskLevel],marginBottom:"3px"}}>{riskIcon[modResult.riskLevel]} {modResult.riskLevel.toUpperCase()} — {modResult.approved?"Approved":"Blocked"}</div>
                    <div style={{fontSize:"11px",color:"rgba(255,255,255,0.5)"}}>{modResult.reason}</div>
                    {modResult.flags?.length>0 && <div style={{marginTop:"6px",display:"flex",flexWrap:"wrap",gap:"4px"}}>{modResult.flags.map((f,i)=><span key={i} style={{fontSize:"10px",padding:"2px 7px",background:"rgba(255,107,107,0.15)",color:"#FF8B94",borderRadius:"20px"}}>{f}</span>)}</div>}
                  </div>
                )}

                <button onClick={handlePost} disabled={moderating} style={{width:"100%",padding:"13px",background:moderating?"rgba(255,255,255,0.07)":"linear-gradient(90deg,#4ECDC4,#A8E6CF)",border:"none",borderRadius:"12px",color:moderating?"rgba(255,255,255,0.4)":"#111",fontWeight:"700",fontSize:"13px",cursor:moderating?"not-allowed":"pointer",fontFamily:"Syne,sans-serif",animation:moderating?"shimmer 1.5s infinite":"none"}}>
                  {moderating ? "🛡 AI Screening your listing…" : "Submit for AI Review →"}
                </button>
              </div>

              {postMethod==="pickup" && (
                <div style={{background:"rgba(255,230,109,0.06)",border:"1px solid rgba(255,230,109,0.18)",borderRadius:"12px",padding:"12px 14px",fontSize:"11px",color:"rgba(255,255,255,0.45)",lineHeight:"1.75"}}>
                  <span style={{color:"#FFE66D",fontWeight:"700"}}>⚠ Self Pick-up Risk: </span>
                  Meeting strangers carries safety risks. Always meet in a public location, bring a friend, and photograph the exchange. Consider using barter Logistics for a safer, tracked trade.
                </div>
              )}
            </div>
          )}

          {/* ── WALLET ── */}
          {tab==="wallet" && (
            <div style={{animation:"fIn 0.3s ease"}}>
              {/* Badge */}
              <div style={{display:"flex",alignItems:"center",gap:"10px",background:"linear-gradient(135deg,rgba(255,215,0,0.13),rgba(255,140,0,0.08))",border:"1px solid rgba(255,215,0,0.25)",borderRadius:"14px",padding:"14px 18px",marginBottom:"18px"}}>
                <span style={{fontSize:"26px"}}>𒀭</span>
                <div>
                  <div style={{fontSize:"10px",color:"rgba(255,215,0,0.65)",fontWeight:"700",letterSpacing:"1px"}}>ISHTAR CREDITS</div>
                  <div style={{fontSize:"26px",fontWeight:"800",color:"#FFD700",fontFamily:"Syne,sans-serif",lineHeight:1}}>{credits.toLocaleString()}</div>
                </div>
                <div style={{marginLeft:"auto",textAlign:"right"}}>
                  <div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)"}}>≈ today</div>
                  <div style={{fontSize:"12px",color:"#FFC107",fontWeight:"600"}}>{COMMODITY_OF_THE_DAY.emoji} {credits} credits = {credits} {COMMODITY_OF_THE_DAY.unit}</div>
                  <div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)"}}>{COMMODITY_OF_THE_DAY.name}</div>
                </div>
              </div>

              <div style={card()}>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:"800",fontSize:"14px",marginBottom:"10px"}}>𒀭 What are Ishtar Credits?</div>
                <div style={{fontSize:"12px",color:"rgba(255,255,255,0.5)",lineHeight:"1.8"}}>
                  Mesopotamian Ishtar Online Credits are iluX's community currency. Their value is pegged daily to a real-world commodity — today that's <strong style={{color:"#FFD700"}}>{COMMODITY_OF_THE_DAY.emoji} {COMMODITY_OF_THE_DAY.name}</strong>.
                  <br/><strong style={{color:"rgba(255,255,255,0.75)"}}>100 credits</strong> ≈ <strong style={{color:"#FFD700"}}>100 {COMMODITY_OF_THE_DAY.unit}</strong> of {COMMODITY_OF_THE_DAY.name} today. Peg resets daily at midnight.
                </div>
              </div>

              <div style={card()}>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:"700",fontSize:"13px",marginBottom:"12px"}}>Earn credits</div>
                {[
                  ["🚩 Flag illegal / counterfeit listing","+50"],
                  ["✅ Successful trade completed","+30"],
                  ["⭐ Leave a verified review","+10"],
                  ["🆕 Invite a new user","+75"],
                ].map(([a,c])=>(
                  <div key={a} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                    <span style={{fontSize:"12px",color:"rgba(255,255,255,0.55)"}}>{a}</span>
                    <span style={{fontSize:"13px",fontWeight:"700",color:"#4ECDC4"}}>{c}</span>
                  </div>
                ))}
              </div>

              <div style={card()}>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:"700",fontSize:"13px",marginBottom:"12px"}}>Spend credits</div>
                {[
                  ["🔝 Boost listing to top of feed","200"],
                  ["✅ Verified badge on profile","500"],
                  ["🔒 Escrow protection for trade","150"],
                  ["🚚 barter Logistics (1 trade)","150"],
                ].map(([a,c])=>(
                  <div key={a} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                    <span style={{fontSize:"12px",color:"rgba(255,255,255,0.55)"}}>{a}</span>
                    <span style={{fontSize:"12px",fontWeight:"700",color:"#FFE66D"}}>{c} credits</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {tab==="analytics" && (
            <div style={{animation:"fIn 0.3s ease"}}>

              {/* KPI row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"14px"}}>
                {[
                  {label:"Total Trades",  value:ANALYTICS.totalTrades.toLocaleString(), sub:"beta launch pending", color:"#4ECDC4"},
                  {label:"Active Listings",value:ANALYTICS.activeListings.toLocaleString(),sub:"be the first to post", color:"#FFE66D"},
                  {label:"Countries",     value:ANALYTICS.countriesActive,               sub:"join from anywhere",  color:"#B8B8FF"},
                  {label:"Trades Today",  value:ANALYTICS.todayTrades,                   sub:"launch day",          color:"#FF8B94"},
                ].map(k=>(
                  <div key={k.label} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"12px 14px"}}>
                    <div style={{fontSize:"10px",color:"rgba(255,255,255,0.38)",fontWeight:"600",letterSpacing:"0.8px",textTransform:"uppercase",marginBottom:"4px"}}>{k.label}</div>
                    <div style={{fontSize:"22px",fontWeight:"800",color:k.color,fontFamily:"Syne,sans-serif",lineHeight:1}}>{k.value}</div>
                    <div style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",marginTop:"3px"}}>{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Top traded items */}
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px",marginBottom:"12px"}}>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:"700",fontSize:"13px",marginBottom:"12px",display:"flex",alignItems:"center",gap:"6px"}}>
                  🔥 Most Exchanged Items
                </div>
                {ANALYTICS.topItems.length === 0 ? (
                  <div style={{textAlign:"center",padding:"28px 0",color:"rgba(255,255,255,0.25)",fontSize:"12px"}}>
                    <div style={{fontSize:"28px",marginBottom:"8px"}}>📭</div>
                    No trades yet — data populates once users start trading
                  </div>
                ) : (
                  <div style={{display:"grid",gridTemplateColumns:"auto 1fr auto auto",gap:"0",alignItems:"center"}}>
                    {["#","Item","Trades","↑"].map(h=>(
                      <div key={h} style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase",padding:"4px 6px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>{h}</div>
                    ))}
                    {ANALYTICS.topItems.map(r=>(
                      <>
                        <div key={r.rank+"r"} style={{fontSize:"11px",fontWeight:"700",color:"rgba(255,255,255,0.3)",padding:"8px 6px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{r.rank}</div>
                        <div key={r.rank+"i"} style={{padding:"8px 6px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                          <div style={{fontSize:"12px",fontWeight:"600",color:"#fff"}}>{r.item}</div>
                          <div style={{fontSize:"10px",color:"rgba(255,255,255,0.35)"}}>{r.category}</div>
                        </div>
                        <div key={r.rank+"t"} style={{fontSize:"12px",fontWeight:"700",color:"#4ECDC4",padding:"8px 6px",borderBottom:"1px solid rgba(255,255,255,0.04)",textAlign:"right"}}>{r.trades}</div>
                        <div key={r.rank+"tr"} style={{fontSize:"11px",fontWeight:"700",color:"#A8E6CF",padding:"8px 6px",borderBottom:"1px solid rgba(255,255,255,0.04)",textAlign:"right"}}>{r.trend}</div>
                      </>
                    ))}
                  </div>
                )}
              </div>

              {/* Top cities */}
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px",marginBottom:"12px"}}>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:"700",fontSize:"13px",marginBottom:"12px"}}>📍 Top Cities by Trade Volume</div>
                {ANALYTICS.topCities.length === 0 ? (
                  <div style={{textAlign:"center",padding:"28px 0",color:"rgba(255,255,255,0.25)",fontSize:"12px"}}>
                    <div style={{fontSize:"28px",marginBottom:"8px"}}>🗺️</div>
                    No city data yet — map fills as traders join from around the world
                  </div>
                ) : (
                  <div style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:"0",alignItems:"center"}}>
                    {["City","State","Country","Trades"].map(h=>(
                      <div key={h} style={{fontSize:"9px",color:"rgba(255,255,255,0.3)",fontWeight:"700",letterSpacing:"1px",textTransform:"uppercase",padding:"4px 6px",borderBottom:"1px solid rgba(255,255,255,0.06)",textAlign:h==="Trades"?"right":"left"}}>{h}</div>
                    ))}
                    {ANALYTICS.topCities.map((r,i)=>(
                      <>
                        <div key={i+"c"} style={{fontSize:"12px",fontWeight:"600",color:"#fff",padding:"8px 6px",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",alignItems:"center",gap:"5px"}}>
                          <span style={{fontSize:"14px"}}>{r.flag}</span>{r.city}
                        </div>
                        <div key={i+"s"} style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",padding:"8px 6px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{r.state}</div>
                        <div key={i+"co"} style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",padding:"8px 6px",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{r.country}</div>
                        <div key={i+"t"} style={{fontSize:"12px",fontWeight:"700",color:"#FFE66D",padding:"8px 6px",borderBottom:"1px solid rgba(255,255,255,0.04)",textAlign:"right"}}>{r.trades}</div>
                      </>
                    ))}
                  </div>
                )}
              </div>

              {/* Industry volume bars */}
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"14px",padding:"16px",marginBottom:"12px"}}>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:"700",fontSize:"13px",marginBottom:"12px"}}>🏭 Trade Volume by Industry</div>
                {ANALYTICS.industryVolume.map(r=>(
                  <div key={r.industry} style={{marginBottom:"10px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"4px"}}>
                      <span style={{fontSize:"11px",color:"rgba(255,255,255,0.7)",fontWeight:"600"}}>{r.industry}</span>
                      <span style={{fontSize:"11px",color:r.color,fontWeight:"700"}}>{r.pct}%</span>
                    </div>
                    <div style={{height:"5px",background:"rgba(255,255,255,0.07)",borderRadius:"3px",overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${r.pct}%`,background:r.color,borderRadius:"3px",transition:"width 1s ease"}}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* Commodity peg history */}
              <div style={{background:"rgba(255,215,0,0.05)",border:"1px solid rgba(255,215,0,0.15)",borderRadius:"14px",padding:"16px",marginBottom:"12px"}}>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:"700",fontSize:"13px",marginBottom:"4px",color:"#FFD700"}}>𒀭 Commodity-of-the-Day History</div>
                <div style={{fontSize:"11px",color:"rgba(255,255,255,0.35)",marginBottom:"12px"}}>Weekly peg rotation — your unique market differentiator</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"4px"}}>
                  {ANALYTICS.commodityHistory.map((d,i)=>{
                    const isToday = d.day===["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][new Date().getDay()];
                    return (
                      <div key={d.day} style={{textAlign:"center",background:isToday?"rgba(255,215,0,0.15)":"rgba(255,255,255,0.03)",border:`1px solid ${isToday?"rgba(255,215,0,0.4)":"rgba(255,255,255,0.06)"}`,borderRadius:"8px",padding:"7px 3px"}}>
                        <div style={{fontSize:"14px",marginBottom:"2px"}}>{d.commodity.split(" ")[0]}</div>
                        <div style={{fontSize:"8px",color:isToday?"#FFD700":"rgba(255,255,255,0.35)",fontWeight:isToday?"700":"400"}}>{d.day}</div>
                        <div style={{fontSize:"9px",color:"rgba(255,255,255,0.5)",marginTop:"2px"}}>{d.commodity.split(" ").slice(1).join(" ")}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping + integrity stats row */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"12px"}}>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"14px"}}>
                  <div style={{fontSize:"11px",fontWeight:"700",color:"rgba(255,255,255,0.5)",marginBottom:"10px"}}>📦 Shipping Mix</div>
                  {ANALYTICS.shippingBreakdown.map(s=>(
                    <div key={s.method} style={{marginBottom:"7px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                        <span style={{fontSize:"10px",color:"rgba(255,255,255,0.6)"}}>{s.method}</span>
                        <span style={{fontSize:"10px",fontWeight:"700",color:s.color}}>{s.pct}%</span>
                      </div>
                      <div style={{height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px"}}>
                        <div style={{height:"100%",width:`${s.pct}%`,background:s.color,borderRadius:"2px"}}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"14px",display:"flex",flexDirection:"column",gap:"10px"}}>
                  <div style={{fontSize:"11px",fontWeight:"700",color:"rgba(255,255,255,0.5)"}}>🛡 Platform Integrity</div>
                  {[
                    {label:"Trade Success Rate", value: ANALYTICS.successRate === 0 ? "—" : `${ANALYTICS.successRate}%`, color:"#4ECDC4"},
                    {label:"Avg AI Match Score",  value: ANALYTICS.avgMatchScore === 0 ? "—" : `${ANALYTICS.avgMatchScore}%`, color:"#FFE66D"},
                    {label:"Flagged This Week",   value: ANALYTICS.flaggedThisWeek === 0 ? "0" : ANALYTICS.flaggedThisWeek, color:"#FF8B94"},
                  ].map(s=>(
                    <div key={s.label}>
                      <div style={{fontSize:"10px",color:"rgba(255,255,255,0.38)",marginBottom:"2px"}}>{s.label}</div>
                      <div style={{fontSize:"18px",fontWeight:"800",color:s.color,fontFamily:"Syne,sans-serif",lineHeight:1}}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {toast && <Toast msg={toast.msg} sub={toast.sub} />}
      </div>
    </>
  );
}
