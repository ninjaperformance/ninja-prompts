import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   NINJAPROMPTS V3 — Phase 1 Production Build
   Landing + Access Gate + 7-Step Wizard + 28 Design Systems
   Ultra-modern 2026 aesthetic • Zero AI tokens
   ═══════════════════════════════════════════════════════════════════════ */

// ── DATA ────────────────────────────────────────────────────────────

const OBJECTIVES = [
  { id:"launch", name:"Lanzamiento Digital", icon:"🚀", desc:"Venta con VSL, countdown, urgencia y bonos", sections:["hero","vsl","benefits","bonuses","pricing","countdown","testimonials","guarantee","faq","footer"] },
  { id:"webinar", name:"Registro de Webinar", icon:"📺", desc:"Captura para webinar con countdown y registro", sections:["hero","presenter","agenda","countdown","registration","testimonials","urgency","footer"] },
  { id:"leadmagnet", name:"Lead Magnet", icon:"🧲", desc:"Captura de leads con recurso gratuito", sections:["hero","preview","benefits","author","form","footer"] },
  { id:"course", name:"Curso Online", icon:"📚", desc:"Venta de curso con módulos y testimonios", sections:["hero","instructor","modules","benefits","testimonials","pricing","guarantee","faq","footer"] },
  { id:"membership", name:"Membresía VIP", icon:"👑", desc:"Membresía con niveles y exclusividad", sections:["hero","benefits","tiers","testimonials","faq","cta","footer"] },
  { id:"challenge", name:"Reto / Challenge", icon:"🔥", desc:"Reto gratuito de varios días", sections:["hero","days","instructor","testimonials","registration","footer"] },
  { id:"saas", name:"SaaS / Software", icon:"⚡", desc:"Producto digital con features y pricing", sections:["hero","features","how-it-works","integrations","pricing","testimonials","faq","cta","footer"] },
  { id:"agency", name:"Agencia / Servicios", icon:"🏢", desc:"Agencia con portfolio y booking", sections:["hero","services","portfolio","process","team","testimonials","booking","footer"] },
  { id:"ecommerce", name:"E-commerce", icon:"🛍️", desc:"Producto con galería y compra", sections:["hero","gallery","details","features","reviews","pricing","faq","footer"] },
  { id:"event", name:"Evento / Summit", icon:"🎪", desc:"Evento con speakers y tickets", sections:["hero","speakers","agenda","sponsors","tickets","venue","footer"] },
  { id:"portfolio", name:"Portfolio Personal", icon:"✨", desc:"Portfolio con proyectos y contacto", sections:["hero","projects","about","skills","testimonials","contact","footer"] },
  { id:"coaching", name:"Coaching / Consultoría", icon:"🎯", desc:"Coach con historia y booking", sections:["hero","story","results","methodology","testimonials","booking","footer"] },
];

const STYLES = [
  { id:"monochrome",name:"Monochrome",cat:"Editorial",c:["#fff","#000","#f5f5f5","#525252"],font:"Playfair Display",bg:"light",desc:"B&W editorial luxury. Serif typography as hero." },
  { id:"bauhaus",name:"Bauhaus",cat:"Artístico",c:["#F0F0F0","#D02020","#1040C0","#F0C020"],font:"Outfit",bg:"light",desc:"Constructivista con primarios puros, geométrico." },
  { id:"modern-dark",name:"Modern Dark",cat:"Tech",c:["#050506","#5E6AD2","#0a0a0c","#EDEDEF"],font:"Inter",bg:"dark",desc:"Cinematic Linear/Vercel. Ambient blobs, multi-layer." },
  { id:"newsprint",name:"Newsprint",cat:"Editorial",c:["#F9F9F7","#111","#CC0000","#E5E5E0"],font:"Playfair Display",bg:"light",desc:"Golden age of print. Drop caps, column grids." },
  { id:"saas-modern",name:"SaaS Modern",cat:"Tech",c:["#FAFAFA","#0052FF","#4D7CFF","#0F172A"],font:"Calistoga",bg:"light",desc:"Electric Blue gradient. Pulsing badges, floating hero." },
  { id:"swiss",name:"Swiss International",cat:"Tipográfico",c:["#fff","#000","#FF3000","#F2F2F2"],font:"Inter",bg:"light",desc:"Tipografía objetiva suiza. Massive scale, Swiss Red." },
  { id:"kinetic",name:"Kinetic Typography",cat:"Brutalist",c:["#09090B","#DFE104","#FAFAFA","#27272A"],font:"Space Grotesk",bg:"dark",desc:"Marquees infinitos, viewport-width type, acid yellow." },
  { id:"flat",name:"Flat Design",cat:"Moderno",c:["#fff","#3B82F6","#10B981","#F59E0B"],font:"Outfit",bg:"light",desc:"Zero shadows, color blocking, poster energy." },
  { id:"art-deco",name:"Art Deco",cat:"Luxury",c:["#0A0A0A","#D4AF37","#F2F0E4","#1E3D59"],font:"Marcellus",bg:"dark",desc:"Gatsby gold on obsidian. Sunbursts, roman numerals." },
  { id:"material-you",name:"Material You",cat:"Friendly",c:["#FFFBFE","#6750A4","#E8DEF8","#7D5260"],font:"Roboto",bg:"light",desc:"Organic pills, tonal surfaces, Google's MD3." },
  { id:"neo-brutal",name:"Neo-Brutalism",cat:"Punk",c:["#FFFDF5","#FF6B6B","#FFD93D","#C4B5FD"],font:"Space Grotesk",bg:"light",desc:"Sticker collage. Hard shadows, thick borders." },
  { id:"bold-typo",name:"Bold Typography",cat:"Editorial",c:["#0A0A0A","#FF3D00","#FAFAFA","#1A1A1A"],font:"Inter Tight",bg:"dark",desc:"Poster design for web. Underline CTAs, vermillion." },
  { id:"academia",name:"Academia Classical",cat:"Luxury",c:["#1C1714","#C9A962","#E8DFD4","#8B2635"],font:"Cormorant Garamond",bg:"dark",desc:"Library at night. Brass, arch-tops, wax seals." },
  { id:"cyberpunk",name:"Cyberpunk Glitch",cat:"Futurista",c:["#0a0a0f","#00ff88","#ff00ff","#00d4ff"],font:"Orbitron",bg:"dark",desc:"CRT scanlines, chromatic aberration, neon glow." },
  { id:"bitcoin",name:"Bitcoin DeFi",cat:"Fintech",c:["#030304","#F7931A","#FFD600","#0F1115"],font:"Space Grotesk",bg:"dark",desc:"Digital gold. Colored glow shadows, glass cards." },
  { id:"retro-90s",name:"Retro 90s",cat:"Nostálgico",c:["#C0C0C0","#0000FF","#FF0000","#FFFF00"],font:"Arial Black",bg:"light",desc:"Windows 95 bevels, rainbow text, marquee." },
  { id:"maximalism",name:"Maximalism",cat:"Maximalista",c:["#0D0D1A","#FF3AF2","#00F5D4","#FFE600"],font:"Outfit",bg:"dark",desc:"Sensory overload. 5 accents, stacked shadows." },
  { id:"playful-geo",name:"Playful Geometric",cat:"Friendly",c:["#FFFDF5","#8B5CF6","#F472B6","#FBBF24"],font:"Outfit",bg:"light",desc:"Memphis sticker book. Candy buttons, confetti." },
  { id:"vaporwave",name:"Vaporwave",cat:"Retro",c:["#090014","#FF00FF","#00FFFF","#FF9900"],font:"Orbitron",bg:"dark",desc:"80s neon grid, CRT scanlines, sunset gradient." },
  { id:"corporate",name:"Corporate Trust",cat:"Enterprise",c:["#F8FAFC","#4F46E5","#7C3AED","#10B981"],font:"Plus Jakarta Sans",bg:"light",desc:"Indigo-violet gradients, isometric depth." },
  { id:"botanical",name:"Botanical",cat:"Natural",c:["#F9F8F4","#8C9A84","#C27B66","#DCCFC2"],font:"Playfair Display",bg:"light",desc:"Arch imagery, sepia hover, sage green." },
  { id:"hand-drawn",name:"Hand-Drawn",cat:"Artístico",c:["#fdfbf7","#2d2d2d","#ff4d4d","#2d5da1"],font:"Kalam",bg:"light",desc:"Wobbly borders, tape, thumbtacks, sketchy." },
  { id:"serif-edit",name:"Serif Editorial",cat:"Editorial",c:["#FAFAF8","#1A1A1A","#B8860B","#E8E4DF"],font:"Playfair Display",bg:"light",desc:"Burnished gold, rule lines, small caps." },
  { id:"industrial",name:"Industrial",cat:"Hardware",c:["#e0e5ec","#ff4757","#2d3436","#babecc"],font:"Inter",bg:"light",desc:"Neumorphic chassis, screws, vents, LEDs." },
  { id:"neumorphism",name:"Neumorphism",cat:"3D",c:["#E0E5EC","#6C63FF","#38B2AC","#3D4852"],font:"Plus Jakarta Sans",bg:"light",desc:"Dual shadows, extruded/pressed, soft UI." },
  { id:"claymorphism",name:"Claymorphism",cat:"3D",c:["#F4F1FA","#7C3AED","#DB2777","#0EA5E9"],font:"Nunito",bg:"light",desc:"Candy clay. 4-layer shadows, glass-blur." },
  { id:"organic",name:"Organic Natural",cat:"Natural",c:["#FDFCF8","#5D7052","#C18C5D","#E6DCCD"],font:"Fraunces",bg:"light",desc:"Blob shapes, moss shadows, wabi-sabi." },
  { id:"minimal-dark",name:"Minimalist Dark",cat:"Dark",c:["#0A0A0F","#F59E0B","#1A1A24","#FAFAFA"],font:"Space Grotesk",bg:"dark",desc:"Amber embers in void. Glass cards, glow orbs." },
];

const BACKGROUNDS = [
  { id:"from-style",name:"Del estilo elegido",type:"auto",preview:"linear-gradient(135deg,#1a1a2e,#2a2040)" },
  { id:"gradient-shift",name:"Gradient Shift",type:"css",preview:"linear-gradient(-45deg,#0f0c29,#302b63,#24243e)" },
  { id:"particles",name:"Partículas",type:"css",preview:"radial-gradient(circle at 20% 50%,rgba(120,119,198,.3),transparent 50%),#0a0a0a" },
  { id:"mesh",name:"Mesh Gradient",type:"css",preview:"radial-gradient(at 40% 20%,hsla(240,100%,74%,.3),transparent 50%),#0d0d0d" },
  { id:"grid",name:"Grid Futurista",type:"css",preview:"linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px),#0a0a0a" },
  { id:"aurora",name:"Aurora",type:"css",preview:"linear-gradient(180deg,#0a0a2e,#1a0a3e 30%,#0a2a2e 60%,#0a0a2e)" },
  { id:"blob",name:"Blob Morphing",type:"css",preview:"radial-gradient(circle at 30% 50%,rgba(108,99,255,.2),transparent 60%),#0d0d0d" },
  { id:"stars",name:"Estrellas",type:"css",preview:"radial-gradient(ellipse at bottom,#1B2735,#090A0F)" },
  { id:"video-dark",name:"Video Loop",type:"video",preview:"linear-gradient(135deg,#0c0c0c,#1a1a2e)" },
  { id:"none",name:"Sin fondo",type:"none",preview:"#111" },
];

const PALETTES = [
  { id:"from-style",name:"Del estilo",colors:null,desc:"Paleta original del design system" },
  { id:"midnight",name:"Midnight",colors:["#0a0a0a","#1a1a2e","#6C63FF","#e0e0e0","#fff"] },
  { id:"ocean",name:"Ocean",colors:["#0a192f","#112240","#64ffda","#8892b0","#ccd6f6"] },
  { id:"ember",name:"Ember",colors:["#1a0000","#2d0000","#ff4d4d","#ffaa80","#fff"] },
  { id:"forest",name:"Forest",colors:["#0a1a0a","#1a2e1a","#4ade80","#a3e4a3","#f0fff0"] },
  { id:"royal",name:"Royal",colors:["#0f0a1a","#1a1030","#a855f7","#c084fc","#f3e8ff"] },
  { id:"sunset",name:"Sunset",colors:["#1a0a0a","#2e1a1a","#f97316","#fb923c","#fff7ed"] },
  { id:"gold",name:"Black & Gold",colors:["#0a0a0a","#1a1a1a","#d4af37","#f5e6a3","#fff"] },
  { id:"neon",name:"Neon",colors:["#0a0a0a","#1a1a2e","#00ff88","#ff00ff","#fff"] },
  { id:"custom",name:"Custom ✏️",colors:["#0a0a0a","#1a1a1a","#6C63FF","#e0e0e0","#fff"] },
];

const LANGUAGES = [
  { id:"es-casual",name:"Español (tú)" },{ id:"es-formal",name:"Español (usted)" },
  { id:"es-neutro",name:"Español LATAM" },{ id:"en",name:"English" },{ id:"pt",name:"Português" },
];
const TONES = [
  { id:"urgente",name:"Urgente" },{ id:"profesional",name:"Profesional" },
  { id:"inspirador",name:"Inspirador" },{ id:"educativo",name:"Educativo" },
  { id:"exclusivo",name:"Exclusivo" },{ id:"amigable",name:"Amigable" },
];
const AI_TOOLS = [
  { name:"bolt.new",url:"https://bolt.new",icon:"⚡" },
  { name:"Lovable",url:"https://lovable.dev",icon:"💜" },
  { name:"v0.dev",url:"https://v0.dev",icon:"▲" },
  { name:"Claude",url:"https://claude.ai",icon:"🧠" },
  { name:"ChatGPT",url:"https://chat.openai.com",icon:"💬" },
  { name:"Google AI Studio",url:"https://aistudio.google.com",icon:"🔷" },
];

const SMETA = {
  hero:{i:"🏠",l:"Hero",h:"Headline, sub, CTA"},vsl:{i:"🎬",l:"VSL",h:"Video headline y URL"},
  benefits:{i:"✅",l:"Beneficios",h:"3-6 beneficios"},bonuses:{i:"🎁",l:"Bonos",h:"Bonos con valor"},
  pricing:{i:"💰",l:"Pricing",h:"Planes y precios"},countdown:{i:"⏰",l:"Countdown",h:"Fecha límite"},
  testimonials:{i:"💬",l:"Testimonios",h:"2-3 testimonios"},guarantee:{i:"🛡️",l:"Garantía",h:"Tipo y condiciones"},
  faq:{i:"❓",l:"FAQ",h:"5-8 preguntas"},footer:{i:"📄",l:"Footer",h:"Links y redes"},
  presenter:{i:"👤",l:"Presentador",h:"Bio y credenciales"},instructor:{i:"🎓",l:"Instructor",h:"Bio y logros"},
  agenda:{i:"📋",l:"Agenda",h:"Temas y horarios"},registration:{i:"📝",l:"Registro",h:"Formulario"},
  urgency:{i:"⚡",l:"Urgencia",h:"Escasez"},preview:{i:"👁️",l:"Preview",h:"Qué recibirán"},
  author:{i:"✍️",l:"Autor",h:"Bio del autor"},form:{i:"📋",l:"Formulario",h:"Campos"},
  modules:{i:"📦",l:"Módulos",h:"Contenido del curso"},tiers:{i:"🏅",l:"Niveles",h:"Membresía"},
  days:{i:"📅",l:"Días",h:"Contenido por día"},features:{i:"⚡",l:"Features",h:"3-6 features"},
  "how-it-works":{i:"🔄",l:"Cómo Funciona",h:"Pasos"},integrations:{i:"🔗",l:"Integraciones",h:"Herramientas"},
  cta:{i:"🎯",l:"CTA Final",h:"Headline y botón"},services:{i:"🛠️",l:"Servicios",h:"Lista"},
  portfolio:{i:"📸",l:"Portfolio",h:"Proyectos"},process:{i:"🔄",l:"Proceso",h:"Pasos"},
  team:{i:"👥",l:"Equipo",h:"Miembros"},booking:{i:"📅",l:"Booking",h:"Calendario"},
  gallery:{i:"🖼️",l:"Galería",h:"Imágenes"},details:{i:"📋",l:"Detalles",h:"Specs"},
  reviews:{i:"⭐",l:"Reseñas",h:"Clientes"},speakers:{i:"🎤",l:"Speakers",h:"Ponentes"},
  sponsors:{i:"🤝",l:"Sponsors",h:"Patrocinadores"},tickets:{i:"🎟️",l:"Tickets",h:"Entradas"},
  venue:{i:"📍",l:"Lugar",h:"Ubicación"},projects:{i:"💼",l:"Proyectos",h:"Portfolio"},
  about:{i:"🙋",l:"Sobre mí",h:"Bio"},skills:{i:"🧰",l:"Skills",h:"Tecnologías"},
  contact:{i:"📧",l:"Contacto",h:"Datos"},story:{i:"📖",l:"Historia",h:"Tu historia"},
  results:{i:"📊",l:"Resultados",h:"Métricas"},methodology:{i:"🧭",l:"Metodología",h:"Método"},
};

// ── PROMPT BUILDER ──────────────────────────────────────────────────
function buildPrompt({objective,style,background,palette,sections,content,embeds,language,tone,socials}) {
  const sBlocks = sections.map(s => {
    const m = SMETA[s]||{l:s,h:""};
    const c = content[s]||"";
    const e = embeds[s]||"";
    return `### ${m.l?.toUpperCase()}\n${c?`Content: ${c}`:`[TO ADD: ${m.h}]`}${e?`\nEMBED:\n\`\`\`\n${e}\n\`\`\``:""}`; 
  }).join("\n\n");

  return `════════════════════════════════════════════════════════
NINJAPROMPTS — Landing Page Prompt
${new Date().toLocaleDateString("es-PE")} | ${objective.name} | ${style.name}
════════════════════════════════════════════════════════

Create a complete, production-ready single-page landing page as a SINGLE HTML FILE with inline CSS and JS.

DESIGN SYSTEM: ${style.name.toUpperCase()}
${style.desc}
Apply the FULL ${style.name} design system: typography (${style.font}), colors, shadows, radius, borders, animations, responsive strategy, and ALL signature "bold factor" elements.
Import fonts via Google Fonts <link>.

PALETTE: ${palette.id==="from-style"?`Use ${style.name}'s original palette`:palette.colors?`Override: BG=${palette.colors[0]} Surface=${palette.colors[1]} Accent=${palette.colors[2]} Text2=${palette.colors[3]} Text1=${palette.colors[4]}`:"Default"}

BACKGROUND: ${background.type==="auto"?`Use ${style.name}'s defined background effects`:background.type==="css"?`CSS animated: "${background.name}"`:background.type==="video"?"Video loop in hero with dark overlay":"Solid with subtle accents"}

LANGUAGE: ${LANGUAGES.find(l=>l.id===language)?.name || "Español"}
TONE: ${TONES.find(t=>t.id===tone)?.name || "Profesional"}
All text in the specified language with matching tone.

SECTIONS:
${sBlocks}

${socials?`SOCIAL LINKS (include in footer and/or hero):
${socials}`:""} 

REQUIREMENTS:
- Single HTML file, all CSS in <style>, all JS in <script>
- Mobile-first responsive
- Scroll animations via IntersectionObserver
- Fixed nav with scroll effect
- CSS Grid + Flexbox
- Semantic HTML5
- No external JS libraries
- Hover + focus states on all interactive elements

Make it look like a $10,000 custom website. The ${style.name} aesthetic must be unmistakable.

═══ Generated by NinjaPrompts (NinjaPerformance LLC) ═══`;
}

// ── COMBINATORICS ───────────────────────────────────────────────────
const TOTAL_COMBOS = OBJECTIVES.length * STYLES.length * BACKGROUNDS.length * PALETTES.length * LANGUAGES.length * TONES.length;
function formatNumber(n) {
  return n.toLocaleString("en-US");
}

// ── ANIMATED COUNTER ────────────────────────────────────────────────
function AnimCounter({ target, duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.floor(eased * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{formatNumber(val)}</span>;
}

// ── MAIN APP ────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing"); // landing | gate | wizard
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    objective:null, style:null, background:BACKGROUNDS[0], palette:PALETTES[0],
    sections:[], content:{}, embeds:{}, language:"es-casual", tone:"profesional", socials:"",
  });
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [codeErr, setCodeErr] = useState(false);
  const [sCat, setSCat] = useState("Todas");
  const [sSearch, setSSearch] = useState("");

  // Check stored access
  useEffect(() => {
    if (localStorage.getItem("np_access") === "granted") setView("wizard");
  }, []);

  const cats = ["Todas", ...new Set(STYLES.map(s=>s.cat))];
  const filtered = STYLES.filter(s => {
    return (sCat==="Todas"||s.cat===sCat) && (!sSearch||s.name.toLowerCase().includes(sSearch.toLowerCase())||s.desc.toLowerCase().includes(sSearch.toLowerCase()));
  });

  const canNext = () => { if(step===0)return!!data.objective; if(step===1)return!!data.style; return true; };

  const handleGate = () => {
    if (code === "NINJA$") { localStorage.setItem("np_access","granted"); setView("wizard"); setCodeErr(false); }
    else setCodeErr(true);
  };

  const handleGenerate = () => { setPrompt(buildPrompt(data)); setGenerated(true); };
  const handleDownload = () => {
    const b = new Blob([prompt],{type:"text/plain;charset=utf-8"});
    const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"),{href:u,download:`NinjaPrompt_${data.style?.id}_${data.objective?.id}_${Date.now()}.txt`}).click();
    URL.revokeObjectURL(u);
  };
  const handleCopy = () => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const toggleSec = s => setData(d=>({...d,sections:d.sections.includes(s)?d.sections.filter(x=>x!==s):[...d.sections,s]}));

  const STEPS = ["Objetivo","Estilo","Fondo","Colores","Contenido","Embeds","Idioma"];

  // ═══════════════════════════════════════════════════════════════════
  // CSS
  // ═══════════════════════════════════════════════════════════════════
  const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
:root{
  --bg:#06060a;--bg2:#0d0d14;--bg3:#14141f;--s:rgba(255,255,255,.03);--s2:rgba(255,255,255,.06);
  --b:rgba(255,255,255,.06);--b2:rgba(255,255,255,.1);--t:#eeeef2;--t2:#6e6e82;
  --a:#7c6aff;--a2:#a78bfa;--ag:rgba(124,106,255,.2);--r:14px;
  --font:'Outfit',system-ui,sans-serif;--mono:'JetBrains Mono',monospace;
  --font-size:19px;
}
*{margin:0;padding:0;box-sizing:border-box;}
body,#root{background:var(--bg);color:var(--t);font-family:var(--font);min-height:100vh;overflow-x:hidden;font-size:19px;}

/* LANDING */
.ld{position:relative;}.wz-card-d{font-size:20px;color:#9e9eb4;line-height:1.5;}
.ld-grain{position:fixed;inset:0;z-index:999;pointer-events:none;opacity:.018;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
.ld-orb{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0;}
.ld-orb-1{width:600px;height:600px;background:rgba(124,106,255,.08);top:-200px;right:-100px;}
.ld-orb-2{width:500px;height:500px;background:rgba(167,139,250,.06);bottom:-150px;left:-100px;}
.ld-orb-3{width:400px;height:400px;background:rgba(59,130,246,.05);top:40%;left:50%;transform:translateX(-50%);}
.ld-inner{max-width:1000px;margin:0 auto;padding:0 20px;position:relative;z-index:1;}

/* HERO */
.ld-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:60px 0;}
.ld-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:99px;
  background:var(--s2);border:1px solid var(--b2);font-size:12px;color:var(--a2);margin-bottom:32px;
  font-family:var(--mono);letter-spacing:.5px;}
.ld-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--a);animation:pulse 2s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.4);}}
.ld-h1{font-size:clamp(36px,6vw,72px);font-weight:800;letter-spacing:-.03em;line-height:1.05;margin-bottom:20px;}
.ld-h1 em{font-style:normal;background:linear-gradient(135deg,var(--a),var(--a2),#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.ld-p{font-size:clamp(16px,2vw,20px);color:var(--t2);max-width:560px;line-height:1.6;margin-bottom:40px;font-weight:300;}
.ld-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border-radius:99px;background:var(--a);color:#fff;font-weight:600;font-size:15px;border:none;cursor:pointer;transition:all .25s;box-shadow:0 0 30px var(--ag);font-family:var(--font);}
.ld-cta:hover{transform:translateY(-2px);box-shadow:0 0 50px rgba(124,106,255,.35);filter:brightness(1.1);}

/* STATS */
.ld-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin:60px 0;border-radius:16px;overflow:hidden;background:var(--b);}
.ld-stat{background:var(--bg2);padding:32px 20px;text-align:center;}
.ld-stat-n{font-size:clamp(28px,4vw,42px);font-weight:800;letter-spacing:-.02em;
  background:linear-gradient(135deg,var(--t),var(--t2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.ld-stat-l{font-size:12px;color:var(--t2);margin-top:4px;font-family:var(--mono);letter-spacing:1px;text-transform:uppercase;}

/* HOW IT WORKS */
.ld-section{padding:80px 0;}
.ld-sh{font-size:clamp(24px,3vw,36px);font-weight:700;letter-spacing:-.02em;text-align:center;margin-bottom:12px;}
.ld-sh em{font-style:normal;background:linear-gradient(135deg,var(--a),var(--a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.ld-sp{text-align:center;color:var(--t2);font-size:15px;margin-bottom:48px;font-weight:300;}
.ld-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;}
.ld-step{background:var(--bg2);border:1px solid var(--b);border-radius:16px;padding:28px 24px;transition:all .3s;position:relative;overflow:hidden;}
.ld-step:hover{border-color:var(--b2);transform:translateY(-2px);}
.ld-step-n{font-size:48px;font-weight:800;color:rgba(124,106,255,.08);position:absolute;top:-8px;right:12px;font-family:var(--mono);}
.ld-step-t{font-weight:600;font-size:15px;margin-bottom:6px;position:relative;}
.ld-step-d{font-size:13px;color:var(--t2);line-height:1.5;position:relative;}

/* GALLERY PREVIEW */
.ld-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:6px;margin-top:40px;}
.ld-gal-item{height:56px;border-radius:8px;border:1px solid var(--b);transition:all .3s;cursor:default;position:relative;overflow:hidden;}
.ld-gal-item:hover{border-color:var(--a);transform:scale(1.05);}
.ld-gal-name{position:absolute;bottom:0;left:0;right:0;padding:3px 6px;font-size:8px;font-weight:600;
  background:rgba(0,0,0,.7);color:#fff;text-align:center;opacity:0;transition:opacity .2s;}
.ld-gal-item:hover .ld-gal-name{opacity:1;}

/* GATE */
.gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;position:relative;z-index:1;}
.gate-box{width:100%;max-width:400px;background:var(--bg2);border:1px solid var(--b);border-radius:20px;padding:40px 32px;text-align:center;}
.gate-logo{font-size:22px;font-weight:700;margin-bottom:4px;}
.gate-logo em{font-style:normal;background:linear-gradient(135deg,var(--a),var(--a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.gate-sub{font-size:12px;color:var(--t2);font-family:var(--mono);letter-spacing:2px;text-transform:uppercase;margin-bottom:28px;}
.gate-input{width:100%;padding:14px 18px;border-radius:12px;border:1px solid var(--b);background:var(--bg);color:var(--t);font-size:16px;font-family:inherit;outline:none;text-align:center;letter-spacing:2px;margin-bottom:12px;}
.gate-input:focus{border-color:var(--a);box-shadow:0 0 0 3px var(--ag);}
.gate-input.err{border-color:#ef4444;animation:shake .4s ease;}
@keyframes shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-6px);}40%,80%{transform:translateX(6px);}}
.gate-btn{width:100%;padding:14px;border-radius:12px;background:var(--a);color:#fff;font-weight:600;font-size:15px;border:none;cursor:pointer;transition:all .2s;font-family:inherit;margin-bottom:16px;}
.gate-btn:hover{filter:brightness(1.1);transform:translateY(-1px);}
.gate-link{font-size:13px;color:var(--t2);}
.gate-link a{color:var(--a2);text-decoration:none;}
.gate-link a:hover{text-decoration:underline;}
.gate-err{font-size:12px;color:#ef4444;margin-bottom:8px;}

/* WIZARD */
.wz{max-width:960px;margin:0 auto;padding:16px 16px 60px;}
.wz-hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 0 20px;border-bottom:1px solid var(--b);margin-bottom:20px;}
.wz-logo{font-size:18px;font-weight:700;}
.wz-logo em{font-style:normal;background:linear-gradient(135deg,var(--a),var(--a2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.wz-logout{font-size:12px;color:var(--t2);cursor:pointer;padding:6px 12px;border-radius:8px;border:1px solid var(--b);background:transparent;font-family:inherit;transition:all .2s;}
.wz-logout:hover{border-color:var(--b2);color:var(--t);}

.wz-stepper{display:flex;gap:3px;margin-bottom:24px;overflow-x:auto;padding-bottom:2px;}
.wz-st{flex:1;min-width:70px;padding:10px 4px;text-align:center;border-radius:10px;font-size:11px;font-weight:500;
  color:var(--t2);background:var(--s);border:1px solid var(--b);cursor:pointer;transition:all .2s;white-space:nowrap;}
.wz-st:hover{border-color:var(--b2);}
.wz-st.on{background:var(--a);color:#fff;border-color:var(--a);box-shadow:0 0 16px var(--ag);}
.wz-st.done{background:rgba(124,106,255,.08);color:var(--a);border-color:rgba(124,106,255,.15);}
.wz-st-n{font-family:var(--mono);font-size:9px;opacity:.4;display:block;margin-bottom:1px;}

.wz-title{font-size:22px;font-weight:700;letter-spacing:-.02em;margin-bottom:4px;}
.wz-sub{font-size:13px;color:var(--t2);margin-bottom:20px;line-height:1.5;}

/* CARDS */
.wz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;}
.wz-card{background:var(--bg2);border:1px solid var(--b);border-radius:var(--r);padding:16px;cursor:pointer;transition:all .25s;}
.wz-card:hover{border-color:var(--a);transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,.3);}
.wz-card.sel{border-color:var(--a);background:rgba(124,106,255,.06);box-shadow:0 0 0 1px var(--a);}
.wz-card-i{font-size:22px;margin-bottom:4px;}
.wz-card-n{font-weight:600;font-size:13px;margin-bottom:2px;}
.wz-card-d{font-size:11px;color:var(--t2);line-height:1.4;}

/* STYLE CARDS */
.wz-sg{display:grid;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));gap:10px;}
.wz-sc{border-radius:var(--r);border:1px solid var(--b);overflow:hidden;cursor:pointer;transition:all .25s;background:var(--bg2);}
.wz-sc:hover{border-color:var(--a);transform:translateY(-2px);box-shadow:0 4px 24px rgba(124,106,255,.08);}
.wz-sc.sel{border-color:var(--a);box-shadow:0 0 0 1px var(--a);}
.wz-sc-prev{height:80px;padding:8px;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;position:relative;}
.wz-sc-dots{display:flex;gap:3px;}
.wz-sc-dot{width:10px;height:10px;border-radius:2px;}
.wz-sc-aa{font-size:24px;font-weight:700;opacity:.6;line-height:1;}
.wz-sc-bar{width:40px;height:6px;border-radius:3px;opacity:.7;}
.wz-sc-info{padding:8px 10px;}
.wz-sc-name{font-weight:600;font-size:12px;}
.wz-sc-cat{font-size:9px;color:var(--a);text-transform:uppercase;letter-spacing:.8px;margin-top:1px;font-family:var(--mono);}
.wz-sc-detail{margin-top:10px;padding:12px;background:var(--s);border-radius:var(--r);border:1px solid var(--b);}
.wz-sc-detail p{font-size:12px;color:var(--t2);line-height:1.5;}
.wz-sc-detail span{font-size:10px;color:var(--a);font-family:var(--mono);display:block;margin-top:4px;}

/* FILTERS */
.wz-filters{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;}
.wz-fb{padding:5px 11px;border-radius:14px;border:1px solid var(--b);background:transparent;color:var(--t2);font-size:10px;cursor:pointer;transition:all .15s;font-family:inherit;}
.wz-fb:hover{border-color:var(--a);}
.wz-fb.on{background:var(--a);color:#fff;border-color:var(--a);}
.wz-search{width:100%;padding:10px 14px;border-radius:var(--r);border:1px solid var(--b);background:var(--bg2);color:var(--t);font-size:13px;font-family:inherit;outline:none;margin-bottom:10px;}
.wz-search:focus{border-color:var(--a);box-shadow:0 0 0 3px var(--ag);}
.wz-search::placeholder{color:var(--t2);}

/* BG / PALETTE */
.wz-bg{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;}
.wz-bgc{border-radius:var(--r);border:1px solid var(--b);overflow:hidden;cursor:pointer;transition:all .2s;}
.wz-bgc:hover{border-color:var(--a);}
.wz-bgc.sel{border-color:var(--a);box-shadow:0 0 0 1px var(--a);}
.wz-bgp{height:48px;}
.wz-bgl{padding:6px 8px;font-size:10px;font-weight:500;background:var(--bg2);display:flex;justify-content:space-between;align-items:center;}
.wz-bgt{font-size:8px;padding:2px 5px;border-radius:3px;background:var(--s);color:var(--t2);text-transform:uppercase;letter-spacing:.3px;font-family:var(--mono);}
.wz-pal{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:8px;}
.wz-palc{border-radius:var(--r);border:1px solid var(--b);padding:12px;cursor:pointer;transition:all .2s;background:var(--bg2);}
.wz-palc:hover{border-color:var(--a);}
.wz-palc.sel{border-color:var(--a);box-shadow:0 0 0 1px var(--a);}
.wz-palc-n{font-weight:600;font-size:11px;margin-bottom:2px;}
.wz-palc-d{font-size:9px;color:var(--t2);margin-bottom:6px;}
.wz-sw{display:flex;gap:3px;}
.wz-swi{width:20px;height:20px;border-radius:4px;border:1px solid rgba(255,255,255,.08);}

/* SECTIONS */
.wz-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;}
.wz-chip{padding:5px 10px;border-radius:16px;font-size:10px;border:1px solid var(--b);background:var(--s);cursor:pointer;transition:all .15s;user-select:none;}
.wz-chip.on{background:rgba(124,106,255,.12);border-color:rgba(124,106,255,.25);color:var(--a2);}
.wz-chip:hover{border-color:var(--a);}
.wz-cl{font-size:11px;font-weight:600;color:var(--t2);margin-top:14px;margin-bottom:5px;}

/* CONTENT */
.wz-block{background:var(--bg2);border:1px solid var(--b);border-radius:var(--r);padding:12px;margin-bottom:8px;}
.wz-block-h{font-weight:600;font-size:12px;margin-bottom:2px;display:flex;align-items:center;gap:5px;}
.wz-block-hint{font-size:10px;color:var(--t2);margin-bottom:6px;}
.wz-ta{width:100%;min-height:56px;padding:10px;border-radius:8px;border:1px solid var(--b);background:var(--bg);color:var(--t);font-size:12px;font-family:inherit;resize:vertical;outline:none;}
.wz-ta:focus{border-color:var(--a);box-shadow:0 0 0 3px var(--ag);}
.wz-ta::placeholder{color:var(--t2);}
.wz-ta-code{font-family:var(--mono);font-size:11px;}

/* LANG */
.wz-lang{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:16px;}
.wz-lc{padding:12px;border-radius:var(--r);border:1px solid var(--b);background:var(--s);cursor:pointer;transition:all .2s;}
.wz-lc:hover{border-color:var(--a);}
.wz-lc.sel{border-color:var(--a);background:rgba(124,106,255,.06);box-shadow:0 0 0 1px var(--a);}
.wz-lc-n{font-weight:600;font-size:12px;}

/* RESULT */
.wz-prompt{background:var(--bg2);border:1px solid var(--b);border-radius:var(--r);padding:14px;
  font-family:var(--mono);font-size:11px;line-height:1.6;color:var(--t2);max-height:300px;overflow-y:auto;white-space:pre-wrap;word-break:break-word;margin-bottom:14px;}
.wz-actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.wz-btn{padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;border:none;font-family:inherit;display:inline-flex;align-items:center;gap:6px;}
.wz-btn-p{background:var(--a);color:#fff;box-shadow:0 0 20px var(--ag);}
.wz-btn-p:hover{filter:brightness(1.1);transform:translateY(-1px);}
.wz-btn-s{background:var(--s);color:var(--t);border:1px solid var(--b);}
.wz-btn-s:hover{border-color:var(--a);}
.wz-btn:disabled{opacity:.3;cursor:not-allowed;transform:none!important;}
.wz-ai-t{font-size:12px;color:var(--t2);margin-bottom:8px;font-weight:500;}
.wz-ai-g{display:flex;flex-wrap:wrap;gap:6px;}
.wz-ai-a{display:flex;align-items:center;gap:5px;padding:8px 12px;border-radius:8px;background:var(--s);border:1px solid var(--b);color:var(--t);text-decoration:none;font-size:11px;font-weight:500;transition:all .2s;}
.wz-ai-a:hover{border-color:var(--a);transform:translateY(-1px);}

.wz-nav{display:flex;justify-content:space-between;margin-top:20px;padding-top:14px;border-top:1px solid var(--b);}
.wz-summary{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;}
.wz-stag{display:flex;align-items:center;gap:4px;padding:4px 10px;border-radius:14px;background:var(--s);border:1px solid var(--b);font-size:10px;color:var(--t2);}
.wz-stag b{color:var(--t);font-weight:600;}
.wz-cnt{font-size:10px;color:var(--t2);margin-bottom:6px;font-family:var(--mono);}

/* SOCIAL INPUT */
.wz-social-block{background:var(--bg2);border:1px solid var(--b);border-radius:var(--r);padding:12px;margin-top:16px;}
`;

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: LANDING PAGE
  // ═══════════════════════════════════════════════════════════════════
  if (view === "landing") return (
    <>
      <style>{css}</style>
      <div className="ld">
        <div className="ld-grain"/>
        <div className="ld-orb ld-orb-1"/>
        <div className="ld-orb ld-orb-2"/>
        <div className="ld-orb ld-orb-3"/>
        <div className="ld-inner">
          <div className="ld-hero">
            <div className="ld-badge"><div className="ld-badge-dot"/>NinjaPerformance LLC</div>
            <h1 className="ld-h1">Genera landing pages<br/><em>con un solo prompt</em></h1>
            <p className="ld-p">Elige entre 28 estilos de diseño, 12 tipos de página y cientos de combinaciones. Tu landing page premium, lista en minutos.</p>
            <button className="ld-cta" onClick={()=>setView("gate")}>Acceder a NinjaPrompts →</button>
          </div>

          <div className="ld-stats">
            <div className="ld-stat">
              <div className="ld-stat-n"><AnimCounter target={TOTAL_COMBOS}/></div>
              <div className="ld-stat-l">Combinaciones</div>
            </div>
            <div className="ld-stat">
              <div className="ld-stat-n">{STYLES.length}</div>
              <div className="ld-stat-l">Design Systems</div>
            </div>
            <div className="ld-stat">
              <div className="ld-stat-n">{OBJECTIVES.length}</div>
              <div className="ld-stat-l">Tipos de Página</div>
            </div>
          </div>

          <div className="ld-section">
            <div className="ld-sh">Cómo <em>funciona</em></div>
            <div className="ld-sp">7 pasos guiados. Sin IA. Sin costo por uso. Solo automatización inteligente.</div>
            <div className="ld-steps">
              {["Define el objetivo de tu página","Elige un estilo visual premium","Personaliza fondo y colores","Agrega tu contenido y embeds","Configura idioma y tono","Recibe tu prompt listo","Pégalo en bolt.new, Lovable o Claude"].map((t,i)=>(
                <div key={i} className="ld-step">
                  <div className="ld-step-n">0{i+1}</div>
                  <div className="ld-step-t">{t.split(" ").slice(0,3).join(" ")}</div>
                  <div className="ld-step-d">{t}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ld-section">
            <div className="ld-sh">28 <em>estilos</em> premium</div>
            <div className="ld-sp">Cada uno es un design system completo con tipografía, colores, animaciones y personalidad.</div>
            <div className="ld-gal">
              {STYLES.map(s=>(
                <div key={s.id} className="ld-gal-item" style={{background:s.c[0]}}>
                  <div style={{position:"absolute",top:4,left:4,display:"flex",gap:2}}>
                    {s.c.slice(1).map((cl,i)=><div key={i} style={{width:6,height:6,borderRadius:2,background:cl}}/>)}
                  </div>
                  <div className="ld-gal-name">{s.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="ld-section" style={{textAlign:"center"}}>
            <div className="ld-sh">¿Listo para <em>crear</em>?</div>
            <div className="ld-sp">Accede con tu código de invitación.</div>
            <button className="ld-cta" onClick={()=>setView("gate")}>Ingresar →</button>
          </div>

          <div style={{textAlign:"center",padding:"40px 0",color:"var(--t2)",fontSize:12}}>
            © {new Date().getFullYear()} NinjaPerformance LLC. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </>
  );

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: ACCESS GATE
  // ═══════════════════════════════════════════════════════════════════
  if (view === "gate") return (
    <>
      <style>{css}</style>
      <div className="ld-grain"/>
      <div className="ld-orb ld-orb-1"/>
      <div className="ld-orb ld-orb-2"/>
      <div className="gate">
        <div className="gate-box">
          <div className="gate-logo"><em>Ninja</em>Prompts</div>
          <div className="gate-sub">Acceso privado</div>
          {codeErr && <div className="gate-err">Código incorrecto. Intenta de nuevo.</div>}
          <input className={`gate-input ${codeErr?"err":""}`} type="password" placeholder="Código de acceso"
            value={code} onChange={e=>{setCode(e.target.value);setCodeErr(false);}}
            onKeyDown={e=>e.key==="Enter"&&handleGate()}/>
          <button className="gate-btn" onClick={handleGate}>Ingresar</button>
          <div className="gate-link">¿No tienes código? <a href="https://ninjasuite.ai/acceso-a-ninja-prompts" target="_blank" rel="noopener noreferrer">Solicitar acceso</a></div>
          <div style={{marginTop:16}}><span style={{fontSize:11,color:"var(--t2)",cursor:"pointer"}} onClick={()=>setView("landing")}>← Volver</span></div>
        </div>
      </div>
    </>
  );

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: WIZARD
  // ═══════════════════════════════════════════════════════════════════
  const renderStep = () => {
    switch(step) {
      case 0: return (<>
        <div className="wz-title">¿Qué quieres construir?</div>
        <div className="wz-sub">Elige el tipo de página. Define las secciones de tu landing.</div>
        <div className="wz-grid">
          {OBJECTIVES.map(o=>(
            <div key={o.id} className={`wz-card ${data.objective?.id===o.id?"sel":""}`}
              onClick={()=>setData(d=>({...d,objective:o,sections:[...o.sections]}))}>
              <div className="wz-card-i">{o.icon}</div>
              <div className="wz-card-n">{o.name}</div>
              <div className="wz-card-d">{o.desc}</div>
            </div>
          ))}
        </div>
        {data.objective&&(<>
          <div className="wz-cl">Secciones (clic para agregar/quitar):</div>
          <div className="wz-chips">
            {Object.keys(SMETA).map(s=>(
              <div key={s} className={`wz-chip ${data.sections.includes(s)?"on":""}`} onClick={()=>toggleSec(s)}>
                {SMETA[s].i} {SMETA[s].l}
              </div>
            ))}
          </div>
        </>)}
      </>);
      case 1: return (<>
        <div className="wz-title">Estilo visual</div>
        <div className="wz-sub">28 design systems completos. Cada uno transforma completamente la apariencia.</div>
        <input className="wz-search" placeholder="🔍 Buscar..." value={sSearch} onChange={e=>setSSearch(e.target.value)}/>
        <div className="wz-filters">{cats.map(c=><button key={c} className={`wz-fb ${sCat===c?"on":""}`} onClick={()=>setSCat(c)}>{c}</button>)}</div>
        <div className="wz-cnt">{filtered.length} estilos</div>
        <div className="wz-sg">
          {filtered.map(s=>(
            <div key={s.id} className={`wz-sc ${data.style?.id===s.id?"sel":""}`} onClick={()=>setData(d=>({...d,style:s}))}>
              <div className="wz-sc-prev" style={{background:s.c[0]}}>
                <div className="wz-sc-dots">{s.c.slice(1).map((cl,i)=><div key={i} className="wz-sc-dot" style={{background:cl}}/>)}</div>
                <div className="wz-sc-aa" style={{color:s.c[3]||"#fff",fontFamily:s.font}}>Aa</div>
                <div className="wz-sc-bar" style={{background:s.c[2]||s.c[1]}}/>
              </div>
              <div className="wz-sc-info"><div className="wz-sc-name">{s.name}</div><div className="wz-sc-cat">{s.cat}</div></div>
            </div>
          ))}
        </div>
        {data.style&&<div className="wz-sc-detail"><p>{data.style.desc}</p><span>Font: {data.style.font} • {data.style.bg}</span></div>}
      </>);
      case 2: return (<>
        <div className="wz-title">Efecto de fondo</div>
        <div className="wz-sub">"Del estilo elegido" aplica los efectos del design system (recomendado).</div>
        <div className="wz-bg">{BACKGROUNDS.map(bg=>(
          <div key={bg.id} className={`wz-bgc ${data.background?.id===bg.id?"sel":""}`} onClick={()=>setData(d=>({...d,background:bg}))}>
            <div className="wz-bgp" style={{background:bg.preview}}/><div className="wz-bgl">{bg.name}<span className="wz-bgt">{bg.type==="auto"?"AUTO":bg.type==="css"?"CSS":bg.type==="video"?"VIDEO":"—"}</span></div>
          </div>
        ))}</div>
      </>);
      case 3: return (<>
        <div className="wz-title">Paleta de colores</div>
        <div className="wz-sub">"Del estilo" usa la paleta original. Puedes override con otra.</div>
        <div className="wz-pal">{PALETTES.map(p=>(
          <div key={p.id} className={`wz-palc ${data.palette?.id===p.id?"sel":""}`} onClick={()=>setData(d=>({...d,palette:p}))}>
            <div className="wz-palc-n">{p.name}</div>
            {p.desc&&<div className="wz-palc-d">{p.desc}</div>}
            {p.colors&&<div className="wz-sw">{p.colors.map((c,i)=><div key={i} className="wz-swi" style={{background:c}}/>)}</div>}
          </div>
        ))}</div>
      </>);
      case 4: return (<>
        <div className="wz-title">Contenido</div>
        <div className="wz-sub">Escribe la info de cada sección. Lo vacío se marca como placeholder.</div>
        {data.sections.map(s=>{const m=SMETA[s]||{i:"📝",l:s,h:""};return(
          <div key={s} className="wz-block">
            <div className="wz-block-h">{m.i} {m.l}</div><div className="wz-block-hint">{m.h}</div>
            <textarea className="wz-ta" placeholder={`${m.l}...`} value={data.content[s]||""}
              onChange={e=>setData(d=>({...d,content:{...d.content,[s]:e.target.value}}))}/>
          </div>
        );})}
      </>);
      case 5: {
        const emb = data.sections.filter(s=>["hero","cta","registration","form","booking","contact","vsl","pricing","urgency"].includes(s));
        return (<>
          <div className="wz-title">Embeds & Widgets</div>
          <div className="wz-sub">Pega código HTML de GHL, Calendly, Typeform, etc. Es opcional.</div>
          {emb.length>0?emb.map(s=>{const m=SMETA[s]||{i:"🔗",l:s};return(
            <div key={s} className="wz-block">
              <div className="wz-block-h">🔗 {m.l}</div><div className="wz-block-hint">HTML/iframe del widget</div>
              <textarea className="wz-ta wz-ta-code" placeholder='<iframe src="..." ...></iframe>' value={data.embeds[s]||""}
                onChange={e=>setData(d=>({...d,embeds:{...d.embeds,[s]:e.target.value}}))}/>
            </div>
          );}):<div className="wz-block"><div className="wz-block-hint">No hay secciones de embed. Continúa.</div></div>}
          <div className="wz-social-block">
            <div className="wz-block-h">📱 Redes Sociales</div>
            <div className="wz-block-hint">URLs de Instagram, Facebook, TikTok, YouTube, LinkedIn, X, etc. (se incluyen en el footer)</div>
            <textarea className="wz-ta" placeholder="Instagram: https://instagram.com/tu_cuenta&#10;Facebook: https://facebook.com/tu_pagina&#10;TikTok: https://tiktok.com/@tu_usuario" 
              value={data.socials||""} onChange={e=>setData(d=>({...d,socials:e.target.value}))}/>
          </div>
        </>);
      }
      case 6: return (<>
        <div className="wz-title">Idioma y Tono</div>
        <div className="wz-sub">Define el idioma y estilo de comunicación.</div>
        <div className="wz-cl">Idioma</div>
        <div className="wz-lang">{LANGUAGES.map(l=>(
          <div key={l.id} className={`wz-lc ${data.language===l.id?"sel":""}`} onClick={()=>setData(d=>({...d,language:l.id}))}>
            <div className="wz-lc-n">{l.name}</div>
          </div>
        ))}</div>
        <div className="wz-cl">Tono</div>
        <div className="wz-lang">{TONES.map(t=>(
          <div key={t.id} className={`wz-lc ${data.tone===t.id?"sel":""}`} onClick={()=>setData(d=>({...d,tone:t.id}))}>
            <div className="wz-lc-n">{t.name}</div>
          </div>
        ))}</div>
      </>);
      default: return null;
    }
  };

  const renderResult = () => (<>
    <div className="wz-title">Prompt listo 🎉</div>
    <div className="wz-sub">Copia y pega en tu IA favorita, o descarga como .txt</div>
    <div className="wz-summary">
      <div className="wz-stag">{data.objective?.icon} <b>{data.objective?.name}</b></div>
      <div className="wz-stag"><b>{data.style?.name}</b></div>
      <div className="wz-stag"><b>{data.background?.name}</b></div>
      <div className="wz-stag"><b>{data.palette?.name}</b></div>
      <div className="wz-stag"><b>{LANGUAGES.find(l=>l.id===data.language)?.name}</b></div>
      <div className="wz-stag"><b>{TONES.find(t=>t.id===data.tone)?.name}</b></div>
    </div>
    <div className="wz-prompt">{prompt}</div>
    <div className="wz-actions">
      <button className="wz-btn wz-btn-p" onClick={handleDownload}>📥 Descargar .txt</button>
      <button className="wz-btn wz-btn-s" onClick={handleCopy}>{copied?"✅ Copiado":"📋 Copiar"}</button>
    </div>
    <div className="wz-ai-t">Pega en tu IA:</div>
    <div className="wz-ai-g">{AI_TOOLS.map(t=>(
      <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="wz-ai-a"><span>{t.icon}</span>{t.name}</a>
    ))}</div>
  </>);

  return (
    <>
      <style>{css}</style>
      <div className="wz">
        <div className="wz-hdr">
          <div className="wz-logo"><em>Ninja</em>Prompts</div>
          <button className="wz-logout" onClick={()=>{localStorage.removeItem("np_access");setView("landing");setGenerated(false);setStep(0);}}>Salir</button>
        </div>
        {!generated ? (<>
          <div className="wz-stepper">{STEPS.map((s,i)=>(
            <div key={i} className={`wz-st ${i===step?"on":i<step?"done":""}`}
              onClick={()=>{if(i<step||(i<=step+1&&canNext()))setStep(i);}}>
              <span className="wz-st-n">0{i+1}</span>{s}
            </div>
          ))}</div>
          {renderStep()}
          <div className="wz-nav">
            <button className="wz-btn wz-btn-s" disabled={step===0} onClick={()=>setStep(s=>s-1)}>← Anterior</button>
            {step<6?<button className="wz-btn wz-btn-p" disabled={!canNext()} onClick={()=>setStep(s=>s+1)}>Siguiente →</button>
            :<button className="wz-btn wz-btn-p" onClick={handleGenerate}>🚀 Generar Prompt</button>}
          </div>
        </>) : (<>
          {renderResult()}
          <div className="wz-nav">
            <button className="wz-btn wz-btn-s" onClick={()=>{setGenerated(false);setStep(0);}}>← Nuevo prompt</button>
            <button className="wz-btn wz-btn-s" onClick={()=>{setGenerated(false);setStep(6);}}>✏️ Editar</button>
          </div>
        </>)}
      </div>
    </>
  );
}