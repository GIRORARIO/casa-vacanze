import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://itbmqztqgqvrexdjqyme.supabase.co";
const SUPABASE_KEY = "sb_publishable_cgTt5_TJwEUNT4Ku8xJ-JA_hGpqIJxY";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handle = async () => {
    if (!email || !password) { setError("Inserisci email e password"); return; }
    setLoading(true); setError(""); setSuccess("");
    try {
      if (isRegister) {
        const { error: e } = await sb.auth.signUp({ email, password });
        if (e) throw e;
        setSuccess("Registrazione completata! Controlla la tua email per confermare.");
      } else {
        const { error: e } = await sb.auth.signInWithPassword({ email, password });
        if (e) throw e;
      }
    } catch (e) {
      setError(e.message === "Invalid login credentials" ? "Email o password errati" : e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:24, padding:40, width:400, maxWidth:"100%", boxShadow:"0 20px 60px #0003" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>🏡</div>
          <h1 style={{ fontSize:24, fontWeight:800, color:"#1e293b", margin:0 }}>Casa Vacanze</h1>
          <p style={{ color:"#94a3b8", fontSize:14, marginTop:4 }}>Gestionale · Brindisi</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <label style={{ display:"flex", flexDirection:"column", gap:4, fontSize:13, fontWeight:600, color:"#475569" }}>
            Email
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="nome@email.com"
              style={{ border:"1.5px solid #e2e8f0", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none" }}
              onKeyDown={e=>e.key==="Enter"&&handle()} />
          </label>
          <label style={{ display:"flex", flexDirection:"column", gap:4, fontSize:13, fontWeight:600, color:"#475569" }}>
            Password
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ border:"1.5px solid #e2e8f0", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none" }}
              onKeyDown={e=>e.key==="Enter"&&handle()} />
          </label>
          {error && <div style={{ background:"#fef2f2", color:"#ef4444", borderRadius:8, padding:"10px 14px", fontSize:13, fontWeight:600 }}>❌ {error}</div>}
          {success && <div style={{ background:"#ecfdf5", color:"#059669", borderRadius:8, padding:"10px 14px", fontSize:13, fontWeight:600 }}>✅ {success}</div>}
          <button onClick={handle} disabled={loading} style={{ background:"#6366f1", color:"#fff", border:"none", borderRadius:12, padding:"12px", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:4, opacity:loading?0.7:1 }}>
            {loading ? "..." : isRegister ? "Registrati" : "Accedi"}
          </button>
          <button onClick={()=>{setIsRegister(!isRegister);setError("");setSuccess("");}} style={{ background:"none", border:"none", color:"#6366f1", fontSize:13, cursor:"pointer", fontWeight:600, textAlign:"center" }}>
            {isRegister ? "Hai già un account? Accedi" : "Non hai un account? Registrati"}
          </button>
        </div>
      </div>
    </div>
  );
}const today = new Date();
const fmt = d => d.toISOString().split("T")[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const fmtDate = d => new Date(d + "T12:00").toLocaleDateString("it-IT");
const nightsBetween = (a, b) => Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
const getQuarter = d => Math.floor(new Date(d + "T12:00").getMonth() / 3) + 1;
const getYear = d => new Date(d + "T12:00").getFullYear();

const APARTMENT_PRICE = 100;
const CEDOLARE = 0.21;
const BOOKING_FEE = 0.15;
const AIRBNB_FEE = 0.03;
const CHILD_LIMIT = 12;
const SOGGIORNO_LOW = 1.50;
const SOGGIORNO_HIGH = 2.50;
const SOGGIORNO_MAX = 7;
const LOW_MONTHS = [0, 1, 2];

function calcSoggiorno(checkIn, adults, n) {
  const month = new Date(checkIn + "T12:00").getMonth();
  const rate = LOW_MONTHS.includes(month) ? SOGGIORNO_LOW : SOGGIORNO_HIGH;
  return +(rate * Number(adults) * Math.min(n, SOGGIORNO_MAX)).toFixed(2);
}

const CHANNELS = {
  booking: { label: "Booking.com", color: "#003580", bg: "#e8f0fb", emoji: "🔵" },
  airbnb:  { label: "Airbnb",      color: "#FF5A5F", bg: "#fff0f0", emoji: "🔴" },
  private: { label: "Privato",     color: "#00a86b", bg: "#e8f8f2", emoji: "🟢" },
};
const STATUSES = {
  confirmed: { label: "Confermata", color: "#3b82f6", bg: "#eff6ff" },
  checkin:   { label: "Check-in",   color: "#10b981", bg: "#ecfdf5" },
  checkout:  { label: "Check-out",  color: "#f59e0b", bg: "#fffbeb" },
  cancelled: { label: "Cancellata", color: "#ef4444", bg: "#fef2f2" },
};
const EXP_CATS = ["Pulizie","Utenze","Manutenzione","Forniture","Cedolare Secca","Tassa Soggiorno","Altro"];
const ROOMS_INV = [
  { id:"camera",    label:"Camera da letto",  icon:"🛏️" },
  { id:"bagno",     label:"Bagno",            icon:"🚿" },
  { id:"cucina",    label:"Cucina",           icon:"🍳" },
  { id:"soggiorno", label:"Soggiorno",        icon:"🛋️" },
  { id:"pulizie",   label:"Pulizie generali", icon:"🧹" },
];
const INIT_INVENTORY = [
  { room:"camera",    name:"Lenzuola",            needs_reorder:false },
  { room:"camera",    name:"Federe",              needs_reorder:false },
  { room:"camera",    name:"Coperte",             needs_reorder:false },
  { room:"camera",    name:"Asciugamani",         needs_reorder:false },
  { room:"camera",    name:"Cuscini extra",       needs_reorder:false },
  { room:"bagno",     name:"Carta igienica",      needs_reorder:false },
  { room:"bagno",     name:"Sapone mani",         needs_reorder:false },
  { room:"bagno",     name:"Shampoo",             needs_reorder:false },
  { room:"bagno",     name:"Gel doccia",          needs_reorder:false },
  { room:"bagno",     name:"Phon",                needs_reorder:false },
  { room:"cucina",    name:"Carta da cucina",     needs_reorder:false },
  { room:"cucina",    name:"Detersivo piatti",    needs_reorder:false },
  { room:"cucina",    name:"Spugne",              needs_reorder:false },
  { room:"cucina",    name:"Sacchetti spazzatura",needs_reorder:false },
  { room:"cucina",    name:"Sale / Zucchero",     needs_reorder:false },
  { room:"soggiorno", name:"Telecomando TV",      needs_reorder:false },
  { room:"soggiorno", name:"Pile telecomando",    needs_reorder:false },
  { room:"soggiorno", name:"Wi-Fi funzionante",   needs_reorder:false },
  { room:"pulizie",   name:"Detersivo pavimenti", needs_reorder:false },
  { room:"pulizie",   name:"Candeggina",          needs_reorder:false },
  { room:"pulizie",   name:"Panni microfibra",    needs_reorder:false },
  { room:"pulizie",   name:"Scopa / Mop",         needs_reorder:false },
  { room:"pulizie",   name:"Guanti",              needs_reorder:false },
  { room:"pulizie",   name:"Spray vetri",         needs_reorder:false },
  { room:"pulizie",   name:"Detergente superfici",needs_reorder:false },
];function Card({ children, style }) {
  return <div style={{ background:"#fff", borderRadius:16, boxShadow:"0 1px 4px #0001,0 4px 24px #0001", padding:24, ...style }}>{children}</div>;
}
function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#0007", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background:"#fff", borderRadius:20, padding:28, width:wide?640:500, maxWidth:"100%", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:"#1e293b" }}>{title}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:"#94a3b8" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Inp({ label, ...p }) {
  return (
    <label style={{ display:"flex", flexDirection:"column", gap:4, fontSize:13, fontWeight:600, color:"#475569" }}>
      {label}
      <input {...p} style={{ border:"1.5px solid #e2e8f0", borderRadius:8, padding:"8px 12px", fontSize:14, outline:"none", color:"#1e293b", background:"#f8fafc", ...p.style }} />
    </label>
  );
}
function Sel({ label, children, ...p }) {
  return (
    <label style={{ display:"flex", flexDirection:"column", gap:4, fontSize:13, fontWeight:600, color:"#475569" }}>
      {label}
      <select {...p} style={{ border:"1.5px solid #e2e8f0", borderRadius:8, padding:"8px 12px", fontSize:14, outline:"none", color:"#1e293b", background:"#f8fafc" }}>{children}</select>
    </label>
  );
}
function Btn({ children, variant="primary", ...p }) {
  const S = { primary:{background:"#6366f1",color:"#fff"}, secondary:{background:"#f1f5f9",color:"#475569"}, danger:{background:"#fee2e2",color:"#ef4444"} };
  return <button {...p} style={{ border:"none", borderRadius:10, padding:"9px 18px", cursor:"pointer", fontWeight:600, fontSize:13, ...S[variant], ...p.style }}>{children}</button>;
}
function ChBadge({ channel }) {
  const c = CHANNELS[channel] || CHANNELS.private;
  return <span style={{ background:c.bg, color:c.color, border:`1px solid ${c.color}44`, borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>{c.emoji} {c.label}</span>;
}
function StBadge({ status }) {
  const c = STATUSES[status] || STATUSES.confirmed;
  return <span style={{ background:c.bg, color:c.color, border:`1px solid ${c.color}44`, borderRadius:20, padding:"2px 10px", fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>{c.label}</span>;
}
function PieChart({ slices, size=180 }) {
  const total = slices.reduce((s,c) => s+c.value, 0);
  if (total === 0) return null;
  const cx=size/2, cy=size/2, r=size/2-10;
  const toRad = a => a*Math.PI/180;
  let cum = -90;
  const paths = slices.filter(s=>s.value>0).map(s => {
    const pct = s.value/total;
    const start = cum;
    cum = cum + pct*360;
    const end = cum;
    const x1=cx+r*Math.cos(toRad(start)), y1=cy+r*Math.sin(toRad(start));
    const x2=cx+r*Math.cos(toRad(end-0.01)), y2=cy+r*Math.sin(toRad(end-0.01));
    const d=`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${pct>.5?1:0},1 ${x2},${y2} Z`;
    const mid=start+(end-start)/2;
    return { ...s, d, pct, lx:cx+r*.65*Math.cos(toRad(mid)), ly:cy+r*.65*Math.sin(toRad(mid)) };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink:0 }}>
      {paths.map(s => (
        <g key={s.label}>
          <path d={s.d} fill={s.color} stroke="#fff" strokeWidth="3"/>
          {s.pct>0.07 && <text x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize:size>150?11:9, fill:"#fff", fontWeight:700 }}>{Math.round(s.pct*100)}%</text>}
        </g>
      ))}
    </svg>
  );
}function BookingForm({ booking, onSave, onClose }) {
  const empty = { guest_name:"", channel:"booking", check_in:fmt(today), check_out:fmt(addDays(today,3)), adults:2, children:0, nationality:"", status:"confirmed", paid:false, notes:"", partner_cost:0 };
  const [f, setF] = useState(booking ? {
    guest_name: booking.guest_name, channel: booking.channel, check_in: booking.check_in,
    check_out: booking.check_out, adults: booking.adults, children: booking.children,
    nationality: booking.nationality, status: booking.status, paid: booking.paid,
    notes: booking.notes, partner_cost: booking.partner_cost
  } : empty);
  const set = (k,v) => setF(p => ({ ...p, [k]:v }));
  const n = nightsBetween(f.check_in, f.check_out);
  const total = n * APARTMENT_PRICE;
  const sog = calcSoggiorno(f.check_in, f.adults, n);
  const ced = +(total * CEDOLARE).toFixed(2);
  const platFee = f.channel==="booking" ? +(total*BOOKING_FEE).toFixed(2) : f.channel==="airbnb" ? +(total*AIRBNB_FEE).toFixed(2) : 0;
  const platLabel = f.channel==="booking" ? "Commissione Booking 15%" : f.channel==="airbnb" ? "Commissione Airbnb 3%" : null;
  const netEst = Math.max(0, total-ced-platFee-Number(f.partner_cost||0));
  const season = LOW_MONTHS.includes(new Date(f.check_in+"T12:00").getMonth()) ? "Bassa stagione" : "Alta stagione";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <Inp label="Nome Ospite" value={f.guest_name} onChange={e=>set("guest_name",e.target.value)} placeholder="Mario Rossi"/>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Sel label="Canale" value={f.channel} onChange={e=>set("channel",e.target.value)}>
          {Object.entries(CHANNELS).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.label}</option>)}
        </Sel>
        <Inp label="Nazionalità" value={f.nationality} onChange={e=>set("nationality",e.target.value)} placeholder="es. Italiana"/>
        <Inp label="Check-in"  type="date" value={f.check_in}  onChange={e=>set("check_in",e.target.value)}/>
        <Inp label="Check-out" type="date" value={f.check_out} onChange={e=>set("check_out",e.target.value)}/>
        <Inp label="Adulti" type="number" min={1} max={20} value={f.adults} onChange={e=>set("adults",Number(e.target.value))}/>
        <Inp label={`Bambini (under ${CHILD_LIMIT}, esenti)`} type="number" min={0} max={20} value={f.children} onChange={e=>set("children",Number(e.target.value))}/>
        <Inp label="💼 Costo Partner (€)" type="number" min={0} step={0.01} value={f.partner_cost||0} onChange={e=>set("partner_cost",Number(e.target.value))}/>
        <Sel label="Stato" value={f.status} onChange={e=>set("status",e.target.value)}>
          {Object.entries(STATUSES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </Sel>
        <label style={{ display:"flex", flexDirection:"column", gap:4, fontSize:13, fontWeight:600, color:"#475569" }}>
          Pagato
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
            <input type="checkbox" checked={f.paid} onChange={e=>set("paid",e.target.checked)} style={{ width:18, height:18 }}/>
            <span style={{ color:f.paid?"#059669":"#ef4444", fontWeight:700 }}>{f.paid?"✅ Sì":"❌ No"}</span>
          </div>
        </label>
      </div>
      <Inp label="Note" value={f.notes} onChange={e=>set("notes",e.target.value)} placeholder="Richieste speciali, allergie..."/>
      <div style={{ background:"#f8fafc", borderRadius:12, padding:16, display:"flex", flexDirection:"column", gap:8 }}>
        {[
          [`${n} notti × €${APARTMENT_PRICE}/notte`, `€${total}`, "#1e293b"],
          [`🏛️ Tassa soggiorno (${season}) · ${f.adults} adulti`, `€${sog.toFixed(2)}`, "#8b5cf6"],
          ["🧾 Cedolare secca 21%", `€${ced.toFixed(2)}`, "#f59e0b"],
          ...(platLabel?[[`🏢 ${platLabel}`,`€${platFee.toFixed(2)}`,"#003580"]]:[]),
          ...(Number(f.partner_cost)>0?[["💼 Costo Partner",`€${Number(f.partner_cost).toFixed(2)}`,"#64748b"]]:[]),
        ].map(([k,v,c])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#64748b" }}>
            <span>{k}</span><span style={{ fontWeight:600, color:c }}>{v}</span>
          </div>
        ))}
        <div style={{ borderTop:"1px solid #e2e8f0", paddingTop:8, display:"flex", justifyContent:"space-between", fontWeight:800, fontSize:15 }}>
          <span>Netto stimato</span><span style={{ color:"#6366f1" }}>€{netEst.toFixed(2)}</span>
        </div>
        <div style={{ fontSize:11, color:"#94a3b8" }}>* Tassa soggiorno da incassare separatamente e versare al Comune trimestralmente</div>
      </div>
      <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>Annulla</Btn>
        <Btn onClick={()=>{ if(f.guest_name&&n>0) onSave({ ...f, total, soggiorno:sog, cedolare:ced, platform_fee:platFee, partner_cost:Number(f.partner_cost||0) }); }}>
          {booking?"Salva Modifiche":"Aggiungi Prenotazione"}
        </Btn>
      </div>
    </div>
  );
}function Dashboard({ bookings, expenses }) {
  const todayStr = fmt(today);
  const active   = bookings.find(b=>b.status!=="cancelled"&&b.check_in<=todayStr&&b.check_out>todayStr);
  const arriving = bookings.filter(b=>b.check_in===todayStr&&b.status!=="cancelled");
  const leaving  = bookings.filter(b=>b.check_out===todayStr&&b.status!=="cancelled");
  const upcoming = bookings.filter(b=>b.check_in>todayStr&&b.status!=="cancelled").sort((a,b)=>a.check_in.localeCompare(b.check_in)).slice(0,3);
  const paid     = bookings.filter(b=>b.paid&&b.status!=="cancelled");
  const income       = paid.reduce((s,b)=>s+b.total,0);
  const exps         = expenses.reduce((s,e)=>s+e.amount,0);
  const sog          = bookings.filter(b=>b.status!=="cancelled").reduce((s,b)=>s+(b.soggiorno||0),0);
  const cedolare     = paid.reduce((s,b)=>s+(b.cedolare||+(b.total*CEDOLARE).toFixed(2)),0);
  const platformFees = bookings.filter(b=>b.status!=="cancelled").reduce((s,b)=>s+(b.platform_fee||0),0);
  const partnerCosts = bookings.filter(b=>b.status!=="cancelled").reduce((s,b)=>s+(b.partner_cost||0),0);
  const net = Math.max(0,income-exps-cedolare-platformFees-partnerCosts);
  const pieSlices = [
    { label:"Utile Netto",       value:net,          color:"#6366f1" },
    { label:"Spese Generali",    value:exps,         color:"#ef4444" },
    { label:"Cedolare 21%",      value:cedolare,     color:"#f59e0b" },
    { label:"T.Soggiorno",       value:sog,          color:"#8b5cf6" },
    { label:"Comm. Piattaforme", value:platformFees, color:"#003580" },
    { label:"Costi Partner",     value:partnerCosts, color:"#64748b" },
  ].filter(s=>s.value>0);
  const legend = [
    { l:"💰 Entrate Incassate",  v:`€${income.toLocaleString()}`,        c:"#10b981" },
    { l:"📉 Spese Generali",     v:`€${exps.toLocaleString()}`,          c:"#ef4444" },
    { l:"🧾 Cedolare Secca 21%", v:`€${cedolare.toFixed(2)}`,            c:"#f59e0b" },
    { l:"🏛️ T.Soggiorno",        v:`€${sog.toFixed(2)}`,                 c:"#8b5cf6" },
    { l:"🏢 Comm. Piattaforme",  v:`€${platformFees.toFixed(2)}`,        c:"#003580" },
    { l:"💼 Costi Partner",      v:`€${partnerCosts.toFixed(2)}`,        c:"#64748b" },
    { l:"✨ Utile Netto Stimato", v:`€${net.toLocaleString()}`,           c:"#6366f1" },
  ];
  return (
    <div>
      <h2 style={{ fontSize:24, fontWeight:800, color:"#1e293b", marginBottom:4 }}>Dashboard</h2>
      <p style={{ color:"#64748b", marginBottom:20 }}>{today.toLocaleDateString("it-IT",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      <Card style={{ marginBottom:20, padding:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          {pieSlices.length>0 ? <PieChart slices={pieSlices} size={180}/> : (
            <div style={{ width:180, height:180, borderRadius:"50%", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:13, flexShrink:0 }}>Nessun dato</div>
          )}
          <div style={{ flex:1, minWidth:180 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
              <span style={{ fontSize:20 }}>{active?"🔴":"🟢"}</span>
              <span style={{ fontSize:15, fontWeight:700, color:"#1e293b" }}>Appartamento {active?"Occupato":"Libero"}</span>
            </div>
            {legend.map(s=>(
              <div key={s.l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #f8fafc", fontSize:13 }}>
                <span style={{ color:"#475569" }}>{s.l}</span>
                <span style={{ fontWeight:700, color:s.c }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
      {active&&(
        <Card style={{ marginBottom:16, borderLeft:"5px solid #ef4444", padding:16 }}>
          <div style={{ fontWeight:700, marginBottom:8, fontSize:14 }}>🛌 Ospite Attuale</div>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:13, alignItems:"center" }}>
            <b>{active.guest_name}</b>
            <span>🌍 {active.nationality}</span>
            <ChBadge channel={active.channel}/>
            <span>👤{active.adults}{active.children>0?` 👶${active.children}`:""}</span>
            <span>📅 fino al {fmtDate(active.check_out)}</span>
            <span style={{ color:"#6366f1", fontWeight:700 }}>€{active.total}</span>
          </div>
        </Card>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <Card style={{ padding:16 }}>
          <h3 style={{ margin:"0 0 10px", fontSize:14, fontWeight:700 }}>🛬 Arrivi Oggi</h3>
          {arriving.length===0?<p style={{ color:"#94a3b8", fontSize:13 }}>Nessun arrivo</p>:arriving.map(b=>(
            <div key={b.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f1f5f9" }}>
              <div><div style={{ fontWeight:600, fontSize:13 }}>{b.guest_name}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{b.nationality} · 👤{b.adults}{b.children>0?` 👶${b.children}`:""}</div></div>
              <ChBadge channel={b.channel}/>
            </div>
          ))}
        </Card>
        <Card style={{ padding:16 }}>
          <h3 style={{ margin:"0 0 10px", fontSize:14, fontWeight:700 }}>🛫 Partenze Oggi</h3>
          {leaving.length===0?<p style={{ color:"#94a3b8", fontSize:13 }}>Nessuna partenza</p>:leaving.map(b=>(
            <div key={b.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f1f5f9" }}>
              <div><div style={{ fontWeight:600, fontSize:13 }}>{b.guest_name}</div><div style={{ fontSize:11, color:"#94a3b8" }}>{b.nationality}</div></div>
              <span style={{ fontWeight:700, color:"#10b981" }}>€{b.total}</span>
            </div>
          ))}
        </Card>
      </div>
      {upcoming.length>0&&(
        <Card style={{ padding:16 }}>
          <h3 style={{ margin:"0 0 10px", fontSize:14, fontWeight:700 }}>📅 Prossime Prenotazioni</h3>
          {upcoming.map(b=>(
            <div key={b.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f1f5f9" }}>
              <div>
                <span style={{ fontWeight:600, fontSize:13 }}>{b.guest_name}</span>
                <span style={{ fontSize:12, color:"#94a3b8" }}> · {b.nationality}</span>
                <div style={{ fontSize:11, color:"#64748b" }}>{fmtDate(b.check_in)} → {fmtDate(b.check_out)} · {nightsBetween(b.check_in,b.check_out)}n · 👤{b.adults}{b.children>0?` 👶${b.children}`:""}</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <ChBadge channel={b.channel}/>
                <span style={{ fontWeight:700, color:"#6366f1" }}>€{b.total}</span>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}function Bookings({ bookings, onAdd, onUpdate, onDelete }) {
  const [search, setSearch] = useState("");
  const [fSt, setFSt] = useState("all");
  const [fCh, setFCh] = useState("all");
  const [modal, setModal] = useState(null);
  const filtered = bookings
    .filter(b=>(fSt==="all"||b.status===fSt)&&(fCh==="all"||b.channel===fCh)&&(b.guest_name.toLowerCase().includes(search.toLowerCase())||(b.nationality||"").toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>b.check_in.localeCompare(a.check_in));
  const save = async f => {
    if(modal==="new") await onAdd(f);
    else await onUpdate(modal.id, f);
    setModal(null);
  };
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontSize:24, fontWeight:800, color:"#1e293b", margin:0 }}>Prenotazioni</h2>
        <Btn onClick={()=>setModal("new")}>+ Nuova Prenotazione</Btn>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Cerca ospite o nazionalità..."
          style={{ flex:1, minWidth:180, border:"1.5px solid #e2e8f0", borderRadius:10, padding:"8px 14px", fontSize:14, outline:"none", background:"#f8fafc" }}/>
        <select value={fCh} onChange={e=>setFCh(e.target.value)} style={{ border:"1.5px solid #e2e8f0", borderRadius:10, padding:"8px 12px", fontSize:13, background:"#f8fafc", color:"#475569" }}>
          <option value="all">Tutti i canali</option>
          {Object.entries(CHANNELS).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.label}</option>)}
        </select>
        <select value={fSt} onChange={e=>setFSt(e.target.value)} style={{ border:"1.5px solid #e2e8f0", borderRadius:10, padding:"8px 12px", fontSize:13, background:"#f8fafc", color:"#475569" }}>
          <option value="all">Tutti gli stati</option>
          {Object.entries(STATUSES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Ospite","Nazionalità","Canale","Check-in","Check-out","Notti","Adulti","Bambini","Stato","Affitto","T.Sogg.","Pag.",""].map(h=>(
                  <th key={h} style={{ padding:"10px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#94a3b8", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b=>{
                const n=nightsBetween(b.check_in,b.check_out);
                const sog=b.soggiorno??calcSoggiorno(b.check_in,b.adults,n);
                return (
                  <tr key={b.id} style={{ borderTop:"1px solid #f1f5f9" }}
                    onMouseOver={e=>e.currentTarget.style.background="#fafafa"}
                    onMouseOut={e=>e.currentTarget.style.background=""}>
                    <td style={{ padding:"10px 12px", fontWeight:600, fontSize:13 }}>
                      {b.guest_name}
                      {b.notes&&<div style={{ fontSize:10, color:"#94a3b8" }}>📝 {b.notes}</div>}
                    </td>
                    <td style={{ padding:"10px 12px", fontSize:12, color:"#475569" }}>🌍 {b.nationality}</td>
                    <td style={{ padding:"10px 12px" }}><ChBadge channel={b.channel}/></td>
                    <td style={{ padding:"10px 12px", fontSize:12, whiteSpace:"nowrap" }}>{fmtDate(b.check_in)}</td>
                    <td style={{ padding:"10px 12px", fontSize:12, whiteSpace:"nowrap" }}>{fmtDate(b.check_out)}</td>
                    <td style={{ padding:"10px 12px", fontSize:13, textAlign:"center" }}>{n}</td>
                    <td style={{ padding:"10px 12px", fontSize:13, textAlign:"center" }}>👤{b.adults}</td>
                    <td style={{ padding:"10px 12px", fontSize:13, textAlign:"center" }}>{b.children>0?`👶${b.children}`:"—"}</td>
                    <td style={{ padding:"10px 12px" }}><StBadge status={b.status}/></td>
                    <td style={{ padding:"10px 12px", fontWeight:700 }}>€{b.total}</td>
                    <td style={{ padding:"10px 12px", fontSize:12, color:"#8b5cf6", fontWeight:600 }}>€{sog.toFixed(2)}</td>
                    <td style={{ padding:"10px 12px", fontSize:15, textAlign:"center" }}>{b.paid?"✅":"❌"}</td>
                    <td style={{ padding:"10px 12px" }}>
                      <div style={{ display:"flex", gap:5 }}>
                        <Btn variant="secondary" style={{ padding:"4px 8px" }} onClick={()=>setModal(b)}>✏️</Btn>
                        <Btn variant="danger" style={{ padding:"4px 8px" }} onClick={()=>{if(confirm("Eliminare?"))onDelete(b.id);}}>🗑️</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0&&<tr><td colSpan={13} style={{ padding:32, textAlign:"center", color:"#94a3b8" }}>Nessuna prenotazione</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      {modal&&(
        <Modal title={modal==="new"?"Nuova Prenotazione":"Modifica Prenotazione"} onClose={()=>setModal(null)} wide>
          <BookingForm booking={modal==="new"?null:modal} onSave={save} onClose={()=>setModal(null)}/>
        </Modal>
      )}
    </div>
  );
}function CalendarView({ bookings }) {
  const [vDate, setVDate] = useState(new Date(today.getFullYear(),today.getMonth(),1));
  const [sel, setSel] = useState(null);
  const year=vDate.getFullYear(), month=vDate.getMonth();
  const MONTHS=["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
  const DAYS=["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
  const firstDay=(new Date(year,month,1).getDay()+6)%7;
  const daysInMonth=new Date(year,month+1,0).getDate();
  const dStr=d=>`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const getB=d=>bookings.find(b=>b.status!=="cancelled"&&b.check_in<=dStr(d)&&b.check_out>dStr(d));
  const cells=[...Array(firstDay).fill(null),...Array.from({length:daysInMonth},(_,i)=>i+1)];
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <h2 style={{ fontSize:24, fontWeight:800, color:"#1e293b", margin:0 }}>Calendario</h2>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <Btn variant="secondary" style={{ padding:"7px 14px" }} onClick={()=>setVDate(new Date(year,month-1,1))}>←</Btn>
          <span style={{ fontWeight:700, fontSize:15, minWidth:160, textAlign:"center" }}>{MONTHS[month]} {year}</span>
          <Btn variant="secondary" style={{ padding:"7px 14px" }} onClick={()=>setVDate(new Date(year,month+1,1))}>→</Btn>
        </div>
      </div>
      <div style={{ display:"flex", gap:12, marginBottom:14, flexWrap:"wrap" }}>
        {Object.entries(CHANNELS).map(([k,v])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13 }}>
            <div style={{ width:12, height:12, borderRadius:3, background:v.color }}/>
            <span style={{ color:"#475569", fontWeight:600 }}>{v.label}</span>
          </div>
        ))}
      </div>
      <Card style={{ padding:16 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:6 }}>
          {DAYS.map(d=><div key={d} style={{ textAlign:"center", fontSize:12, fontWeight:700, color:"#94a3b8", padding:"4px 0" }}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
          {cells.map((day,i)=>{
            if(!day) return <div key={`e${i}`}/>;
            const isToday=dStr(day)===fmt(today);
            const b=getB(day);
            const ch=b?CHANNELS[b.channel]:null;
            return (
              <div key={day} onClick={()=>b&&setSel(b)} style={{
                minHeight:58, borderRadius:8, padding:"5px 6px", cursor:b?"pointer":"default",
                background:b?ch.color+"20":isToday?"#eef2ff":"#f8fafc",
                border:isToday?"2px solid #6366f1":b?`2px solid ${ch.color}55`:"2px solid transparent",
                transition:"transform .1s"
              }}
              onMouseOver={e=>b&&(e.currentTarget.style.transform="scale(1.05)")}
              onMouseOut={e=>e.currentTarget.style.transform="scale(1)"}>
                <div style={{ fontSize:12, fontWeight:isToday?800:600, color:isToday?"#6366f1":"#1e293b" }}>{day}</div>
                {b&&<>
                  <div style={{ fontSize:10, color:ch.color, fontWeight:700 }}>{ch.emoji}</div>
                  <div style={{ fontSize:9, color:"#1e293b", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.guest_name.split(" ")[0]}</div>
                  {b.check_in===dStr(day)&&<div style={{ fontSize:9, color:"#10b981", fontWeight:700 }}>IN</div>}
                  {b.check_out===dStr(day)&&<div style={{ fontSize:9, color:"#f59e0b", fontWeight:700 }}>OUT</div>}
                </>}
              </div>
            );
          })}
        </div>
      </Card>
      {sel&&(
        <Modal title="Dettaglio Prenotazione" onClose={()=>setSel(null)}>
          <div style={{ display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span style={{ fontSize:18, fontWeight:800 }}>{sel.guest_name}</span>
              <ChBadge channel={sel.channel}/>
            </div>
            {[
              ["🌍 Nazionalità",sel.nationality||"—"],
              ["📅 Check-in",fmtDate(sel.check_in)],
              ["📅 Check-out",fmtDate(sel.check_out)],
              ["🌙 Notti",nightsBetween(sel.check_in,sel.check_out)],
              ["👤 Adulti",sel.adults],
              [`👶 Bambini (under ${CHILD_LIMIT})`,sel.children||0],
              ["💰 Affitto",`€${sel.total}`],
              ["🏛️ T.Soggiorno",`€${(sel.soggiorno??calcSoggiorno(sel.check_in,sel.adults,nightsBetween(sel.check_in,sel.check_out))).toFixed(2)}`],
              ["✅ Pagato",sel.paid?"Sì":"No"],
            ].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid #f1f5f9", fontSize:14 }}>
                <span style={{ color:"#64748b" }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
              </div>
            ))}
            {sel.notes&&<div style={{ marginTop:10, background:"#fffbeb", borderRadius:8, padding:10, fontSize:13, color:"#78350f" }}>📝 {sel.notes}</div>}
          </div>
        </Modal>
      )}
    </div>
  );
}function Accounting({ bookings, expenses, onAddExpense, onDeleteExpense }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date:fmt(today), category:"Pulizie", description:"", amount:"" });
  const [fy, setFy] = useState(String(today.getFullYear()));
  const years=[...new Set([...bookings.map(b=>getYear(b.check_in)),...expenses.map(e=>getYear(e.date)),today.getFullYear()])].sort((a,b)=>b-a).map(String);
  const fB=bookings.filter(b=>b.paid&&b.status!=="cancelled"&&String(getYear(b.check_in))===fy);
  const fE=expenses.filter(e=>String(getYear(e.date))===fy);
  const income=fB.reduce((s,b)=>s+b.total,0);
  const sog=fB.reduce((s,b)=>s+(b.soggiorno??calcSoggiorno(b.check_in,b.adults,nightsBetween(b.check_in,b.check_out))),0);
  const exps=fE.reduce((s,e)=>s+e.amount,0);
  const ced=+(income*CEDOLARE).toFixed(2);
  const platformFees=fB.reduce((s,b)=>s+(b.platform_fee||0),0);
  const partnerCosts=fB.reduce((s,b)=>s+(b.partner_cost||0),0);
  const net=Math.max(0,income-exps-ced-platformFees-partnerCosts);
  const byChannel=Object.entries(CHANNELS).map(([k,v])=>({ k,label:v.label,color:v.color,emoji:v.emoji,total:fB.filter(b=>b.channel===k).reduce((s,b)=>s+b.total,0) }));
  const pieSlices=[
    { label:"Utile Netto",       value:net,          color:"#6366f1" },
    { label:"Spese Generali",    value:exps,         color:"#ef4444" },
    { label:"Cedolare 21%",      value:ced,          color:"#f59e0b" },
    { label:"T.Soggiorno",       value:+sog.toFixed(2), color:"#8b5cf6" },
    { label:"Comm. Piattaforme", value:platformFees, color:"#003580" },
    { label:"Costi Partner",     value:partnerCosts, color:"#64748b" },
  ].filter(s=>s.value>0);
  const quarters=[1,2,3,4].map(q=>{
    const amt=fB.filter(b=>getQuarter(b.check_in)===q).reduce((s,b)=>s+(b.soggiorno??calcSoggiorno(b.check_in,b.adults,nightsBetween(b.check_in,b.check_out))),0);
    return { q, amount:+amt.toFixed(2), deadline:{1:"15 Aprile",2:"15 Luglio",3:"15 Ottobre",4:"15 Gennaio"}[q], period:["Gen–Mar","Apr–Giu","Lug–Set","Ott–Dic"][q-1] };
  });
  const addExp=async()=>{
    if(!form.description||!form.amount) return;
    await onAddExpense({ ...form, amount:Number(form.amount) });
    setForm({ date:fmt(today), category:"Pulizie", description:"", amount:"" });
    setModal(false);
  };
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <h2 style={{ fontSize:24, fontWeight:800, color:"#1e293b", margin:0 }}>Contabilità</h2>
        <div style={{ display:"flex", gap:10 }}>
          <select value={fy} onChange={e=>setFy(e.target.value)} style={{ border:"1.5px solid #e2e8f0", borderRadius:10, padding:"8px 12px", fontSize:13, background:"#f8fafc", color:"#475569" }}>
            {years.map(y=><option key={y}>{y}</option>)}
          </select>
          <Btn onClick={()=>setModal(true)}>+ Aggiungi Spesa</Btn>
        </div>
      </div>
      <Card style={{ marginBottom:20, padding:20 }}>
        <h3 style={{ margin:"0 0 16px", fontSize:15, fontWeight:700 }}>🥧 Riepilogo Economico {fy}</h3>
        <div style={{ display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          {pieSlices.length>0?<PieChart slices={pieSlices} size={180}/>:(
            <div style={{ width:180, height:180, borderRadius:"50%", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", color:"#94a3b8", fontSize:13, flexShrink:0 }}>Nessun dato</div>
          )}
          <div style={{ flex:1, minWidth:200 }}>
            {[
              { l:"💰 Entrate Incassate",  v:`€${income.toLocaleString()}`,      c:"#10b981" },
              { l:"📉 Spese Generali",     v:`€${exps.toLocaleString()}`,        c:"#ef4444" },
              { l:"🧾 Cedolare Secca 21%", v:`€${ced.toFixed(2)}`,               c:"#f59e0b" },
              { l:"🏛️ T.Soggiorno",        v:`€${sog.toFixed(2)}`,               c:"#8b5cf6" },
              { l:"🏢 Comm. Piattaforme",  v:`€${platformFees.toFixed(2)}`,      c:"#003580" },
              { l:"💼 Costi Partner",      v:`€${partnerCosts.toFixed(2)}`,      c:"#64748b" },
              { l:"✨ Utile Netto Stimato", v:`€${net.toLocaleString()}`,         c:"#6366f1" },
            ].map(s=>(
              <div key={s.l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #f8fafc", fontSize:13 }}>
                <span style={{ color:"#475569" }}>{s.l}</span>
                <span style={{ fontWeight:700, color:s.c }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <Card style={{ padding:18 }}>
          <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>📊 Entrate per Canale</h3>
          {byChannel.reduce((s,c)=>s+c.total,0)===0?<p style={{ color:"#94a3b8", fontSize:13 }}>Nessuna entrata per {fy}</p>:(
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <PieChart slices={byChannel.filter(c=>c.total>0).map(c=>({label:c.label,value:c.total,color:c.color}))} size={130}/>
              <div style={{ flex:1 }}>
                {byChannel.map(c=>{
                  const tot=byChannel.reduce((s,x)=>s+x.total,0);
                  return (
                    <div key={c.k} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                        <span style={{ fontWeight:600 }}>{c.emoji} {c.label}</span>
                        <span style={{ fontWeight:700, color:c.color }}>€{c.total.toLocaleString()}</span>
                      </div>
                      <div style={{ height:5, borderRadius:3, background:"#f1f5f9" }}>
                        <div style={{ height:"100%", borderRadius:3, background:c.color, width:`${tot>0?(c.total/tot)*100:0}%`, transition:"width .5s" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
        <Card style={{ padding:18 }}>
          <h3 style={{ margin:"0 0 14px", fontSize:15, fontWeight:700 }}>🏛️ Scadenze T.Soggiorno {fy}</h3>
          {quarters.map(q=>(
            <div key={q.q} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #f1f5f9" }}>
              <div>
                <div style={{ fontWeight:600, fontSize:13 }}>Q{q.q} · {q.period}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Scadenza: {q.deadline}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontWeight:700, color:q.amount>0?"#f59e0b":"#94a3b8", fontSize:14 }}>€{q.amount.toFixed(2)}</div>
                {q.amount>0&&<div style={{ fontSize:9, color:"#ef4444", fontWeight:700 }}>DA VERSARE</div>}
              </div>
            </div>
          ))}
          <div style={{ marginTop:10, padding:"8px 10px", background:"#fffbeb", borderRadius:8, fontSize:11, color:"#78350f" }}>
            ⚠️ Versamento via PagoPA sul portale del Comune di Brindisi entro il 15 del mese successivo al trimestre.
          </div>
        </Card>
      </div>
      <h3 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>📋 Registro Spese {fy}</h3>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {[...fE].sort((a,b)=>b.date.localeCompare(a.date)).map(e=>(
          <Card key={e.id} style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontWeight:600, fontSize:14 }}>{e.description}</div>
              <div style={{ fontSize:12, color:"#94a3b8" }}>{fmtDate(e.date)} · {e.category}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontWeight:700, color:"#ef4444" }}>-€{e.amount}</span>
              <Btn variant="danger" style={{ padding:"4px 8px" }} onClick={()=>{if(confirm("Eliminare?"))onDeleteExpense(e.id);}}>🗑️</Btn>
            </div>
          </Card>
        ))}
        {fE.length===0&&<p style={{ color:"#94a3b8", fontSize:13 }}>Nessuna spesa per {fy}</p>}
      </div>
      {modal&&(
        <Modal title="Nuova Spesa" onClose={()=>setModal(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <Inp label="Data" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
              <Sel label="Categoria" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                {EXP_CATS.map(c=><option key={c}>{c}</option>)}
              </Sel>
            </div>
            <Inp label="Descrizione" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="es. Bolletta elettrica"/>
            <Inp label="Importo (€)" type="number" min={0} step={0.01} value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} placeholder="0.00"/>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="secondary" onClick={()=>setModal(false)}>Annulla</Btn>
              <Btn onClick={addExp}>Aggiungi</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}function Inventory({ inventory, onToggle, onAdd, onDelete }) {
  const [activeRoom, setActiveRoom] = useState("camera");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const items=inventory.filter(i=>i.room===activeRoom);
  const allAlerts=inventory.filter(i=>i.needs_reorder);
  const addItem=async()=>{
    if(!newName.trim()) return;
    await onAdd({ room:activeRoom, name:newName.trim(), needs_reorder:false });
    setNewName(""); setShowModal(false);
  };
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:24, fontWeight:800, color:"#1e293b", margin:0 }}>Magazzino</h2>
          {allAlerts.length>0&&(
            <div style={{ marginTop:6, display:"inline-flex", alignItems:"center", gap:6, background:"#fef2f2", border:"1px solid #fecaca", borderRadius:20, padding:"3px 12px", fontSize:12, color:"#ef4444", fontWeight:700 }}>
              🚨 {allAlerts.length} articolo{allAlerts.length>1?"i":""} da riordinare
            </div>
          )}
        </div>
        <Btn onClick={()=>setShowModal(true)}>+ Aggiungi Articolo</Btn>
      </div>
      {allAlerts.length>0&&(
        <Card style={{ marginBottom:16, borderLeft:"5px solid #ef4444", padding:16, background:"#fff5f5" }}>
          <div style={{ fontWeight:700, color:"#ef4444", marginBottom:10, fontSize:14 }}>🚨 Lista Riordino</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {allAlerts.map(i=>{
              const rm=ROOMS_INV.find(r=>r.id===i.room);
              return <span key={i.id} style={{ background:"#fee2e2", color:"#ef4444", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{rm?.icon} {i.name}</span>;
            })}
          </div>
        </Card>
      )}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {ROOMS_INV.map(r=>{
          const alerts=inventory.filter(i=>i.room===r.id&&i.needs_reorder).length;
          return (
            <button key={r.id} onClick={()=>setActiveRoom(r.id)} style={{
              border:"none", borderRadius:10, padding:"8px 16px", cursor:"pointer", fontSize:13, fontWeight:600,
              background:activeRoom===r.id?"#6366f1":"#fff", color:activeRoom===r.id?"#fff":"#475569",
              boxShadow:"0 1px 4px #0001", position:"relative"
            }}>
              {r.icon} {r.label}
              {alerts>0&&<span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{alerts}</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:12 }}>
        {items.map(item=>(
          <Card key={item.id} style={{ padding:16, borderLeft:`4px solid ${item.needs_reorder?"#ef4444":"#10b981"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div style={{ fontWeight:700, color:"#1e293b", fontSize:14 }}>{item.name}</div>
              <button onClick={()=>{if(confirm("Eliminare?"))onDelete(item.id);}} style={{ background:"none", border:"none", cursor:"pointer", color:"#cbd5e1", fontSize:16 }}>✕</button>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:12, fontWeight:600, color:item.needs_reorder?"#ef4444":"#10b981" }}>
                {item.needs_reorder?"🚨 Da riordinare":"✅ Disponibile"}
              </span>
              <button onClick={()=>onToggle(item.id,!item.needs_reorder)} style={{
                border:"none", borderRadius:20, padding:"5px 10px", cursor:"pointer", fontSize:11, fontWeight:700,
                background:item.needs_reorder?"#d1fae5":"#fee2e2", color:item.needs_reorder?"#059669":"#ef4444"
              }}>
                {item.needs_reorder?"✓ Riordinato":"⚠️ Riordina"}
              </button>
            </div>
          </Card>
        ))}
        {items.length===0&&<div style={{ gridColumn:"1/-1", padding:32, textAlign:"center", color:"#94a3b8" }}>Nessun articolo. Aggiungine uno!</div>}
      </div>
      {showModal&&(
        <Modal title={`Nuovo articolo — ${ROOMS_INV.find(r=>r.id===activeRoom)?.label}`} onClose={()=>setShowModal(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <Inp label="Nome articolo" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="es. Carta igienica"/>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <Btn variant="secondary" onClick={()=>setShowModal(false)}>Annulla</Btn>
              <Btn onClick={addItem}>Aggiungi</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [bookings,  setBookings]  = useState([]);
  const [expenses,  setExpenses]  = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadRole(session.user.id);
      else setAuthLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadRole(session.user.id);
      else { setUserRole(null); setAuthLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadRole = async (userId) => {
    const { data } = await sb.from("user_roles").select("role").eq("user_id", userId).single();
    setUserRole(data?.role || "partner");
    setAuthLoading(false);
  };

  useEffect(() => {
    if (!session) return;
    async function load() {
      const [{ data: b }, { data: e }, { data: i }] = await Promise.all([
        sb.from("bookings").select("*").order("check_in", { ascending:false }),
        sb.from("expenses").select("*").order("date", { ascending:false }),
        sb.from("inventory").select("*").order("id"),
      ]);
      setBookings(b || []);
      setExpenses(e || []);
      if (!i || i.length === 0) {
        const { data: inserted } = await sb.from("inventory").insert(INIT_INVENTORY).select();
        setInventory(inserted || []);
      } else {
        setInventory(i);
      }
      setLoading(false);
    }
    load();
  }, [session]);

  const addBooking = async f => { setSaving(true); const { data } = await sb.from("bookings").insert([f]).select(); if(data) setBookings(p=>[data[0],...p]); setSaving(false); };
  const updateBooking = async (id, f) => { setSaving(true); const { data } = await sb.from("bookings").update(f).eq("id",id).select(); if(data) setBookings(p=>p.map(b=>b.id===id?data[0]:b)); setSaving(false); };
  const deleteBooking = async id => { setSaving(true); await sb.from("bookings").delete().eq("id",id); setBookings(p=>p.filter(b=>b.id!==id)); setSaving(false); };
  const addExpense = async f => { setSaving(true); const { data } = await sb.from("expenses").insert([f]).select(); if(data) setExpenses(p=>[data[0],...p]); setSaving(false); };
  const deleteExpense = async id => { setSaving(true); await sb.from("expenses").delete().eq("id",id); setExpenses(p=>p.filter(e=>e.id!==id)); setSaving(false); };
  const addInventory = async f => { setSaving(true); const { data } = await sb.from("inventory").insert([f]).select(); if(data) setInventory(p=>[...p,data[0]]); setSaving(false); };
  const toggleInventory = async (id, val) => { await sb.from("inventory").update({ needs_reorder:val }).eq("id",id); setInventory(p=>p.map(i=>i.id===id?{...i,needs_reorder:val}:i)); };
  const deleteInventory = async id => { await sb.from("inventory").delete().eq("id",id); setInventory(p=>p.filter(i=>i.id!==id)); };

  if(authLoading) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }}>
      <span style={{ fontSize:52 }}>🏡</span>
      <div style={{ fontWeight:700, fontSize:17, color:"#fff" }}>Caricamento...</div>
    </div>
  );

  if(!session) return <LoginScreen />;

  if(loading) return (
    <div style={{ minHeight:"100vh", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:14 }}>
      <span style={{ fontSize:52 }}>🏡</span>
      <div style={{ fontWeight:700, fontSize:17, color:"#6366f1" }}>Connessione al database...</div>
    </div>
  );

  const isAdmin = userRole === "admin";
  const ALL_TABS = [
    { id:"dashboard",  label:"Dashboard",    icon:"🏠", adminOnly:true },
    { id:"bookings",   label:"Prenotazioni", icon:"📋", adminOnly:false },
    { id:"calendar",   label:"Calendario",   icon:"📅", adminOnly:false },
    { id:"accounting", label:"Contabilità",  icon:"💰", adminOnly:true },
    { id:"inventory",  label:"Magazzino",    icon:"📦", adminOnly:false },
  ];
  const TABS = ALL_TABS.filter(t => !t.adminOnly || isAdmin);
  const invAlerts = inventory.filter(i=>i.needs_reorder).length;

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:"100vh", background:"#f1f5f9" }}>
      <header style={{ background:"#fff", borderBottom:"1px solid #e2e8f0", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56, position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 4px #0001" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:24 }}>🏡</span>
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:"#1e293b", lineHeight:1 }}>Casa Vacanze</div>
            <div style={{ fontSize:10, color:"#94a3b8" }}>{isAdmin?"👑 Admin":"👤 Partner"} · Brindisi</div>
          </div>
        </div>
        <nav style={{ display:"flex", gap:2, alignItems:"center" }}>
          {TABS.map(t=>{
            const alert=t.id==="inventory"?invAlerts:0;
            return (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                border:"none", background:tab===t.id?"#eef2ff":"none", color:tab===t.id?"#6366f1":"#64748b",
                borderRadius:8, padding:"6px 12px", cursor:"pointer", fontWeight:tab===t.id?700:500,
                fontSize:13, display:"flex", alignItems:"center", gap:4, position:"relative"
              }}>
                <span>{t.icon}</span><span>{t.label}</span>
                {alert>0&&<span style={{ position:"absolute", top:2, right:2, background:"#ef4444", color:"#fff", borderRadius:"50%", width:14, height:14, fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{alert}</span>}
              </button>
            );
          })}
          <div style={{ marginLeft:6, fontSize:11, color:saving?"#f59e0b":"#10b981", fontWeight:600, background:saving?"#fffbeb":"#ecfdf5", borderRadius:20, padding:"3px 8px" }}>
            {saving?"⏳ Salvataggio...":"☁️ Sync"}
          </div>
          <button onClick={()=>sb.auth.signOut()} style={{ marginLeft:8, border:"1px solid #e2e8f0", borderRadius:8, padding:"5px 12px", cursor:"pointer", fontSize:12, fontWeight:600, color:"#ef4444", background:"#fff" }}>
            Esci
          </button>
        </nav>
      </header>
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"22px 16px" }}>
        {tab==="dashboard"  && isAdmin && <Dashboard  bookings={bookings} expenses={expenses}/>}
        {tab==="bookings"   && <Bookings   bookings={bookings} onAdd={addBooking} onUpdate={updateBooking} onDelete={deleteBooking}/>}
        {tab==="calendar"   && <CalendarView bookings={bookings}/>}
        {tab==="accounting" && isAdmin && <Accounting bookings={bookings} expenses={expenses} onAddExpense={addExpense} onDeleteExpense={deleteExpense}/>}
        {tab==="inventory"  && <Inventory  inventory={inventory} onToggle={toggleInventory} onAdd={addInventory} onDelete={deleteInventory}/>}
      </main>
    </div>
  );
}
