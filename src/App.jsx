import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   NINJAPROMPTS V4 — Monochrome Editorial System
   5-Step Flow: Objetivo → Estilo (Visualizer) → Apariencia → Contenido → Embeds
   Aesthetic: Playfair Display, B&W, editorial luxury
   ═══════════════════════════════════════════════════════════════════════ */

// ── DATA ────────────────────────────────────────────────────────────

const OBJECTIVES = [
  { id:"landing", name:"Landing Page", desc:"Features, beneficios, pricing y CTA", sections:["hero","features","benefits","testimonials","pricing","cta","faq","footer"] },
  { id:"home-systems", name:"Sistemas del Hogar", desc:"Domótica, electricidad, plomería, HVAC", sections:["hero","services","gallery","process","benefits","testimonials","pricing","contact","faq","footer"] },
  { id:"construction", name:"Exteriores y Obras", desc:"Construcción, remodelación, paisajismo", sections:["hero","portfolio","services","process","team","testimonials","pricing","contact","faq","footer"] },
  { id:"health", name:"Salud Profesional", desc:"Clínicas, consultorios, terapias", sections:["hero","services","team","testimonials","booking","benefits","faq","footer"] },
  { id:"launch", name:"Lanzamiento Digital", desc:"Página de venta con VSL, countdown, bonos", sections:["hero","vsl","benefits","bonuses","pricing","countdown","testimonials","guarantee","faq","footer"] },
  { id:"webinar", name:"Registro de Webinar", desc:"Captura para webinar o masterclass", sections:["hero","presenter","agenda","countdown","registration","testimonials","urgency","footer"] },
  { id:"leadmagnet", name:"Lead Magnet", desc:"Captura de leads con recurso gratuito", sections:["hero","preview","benefits","author","form","footer"] },
  { id:"course", name:"Curso Online", desc:"Venta de curso con módulos e instructor", sections:["hero","instructor","modules","benefits","testimonials","pricing","guarantee","faq","footer"] },
  { id:"membership", name:"Membresía VIP", desc:"Membresía con niveles y exclusividad", sections:["hero","benefits","tiers","testimonials","faq","cta","footer"] },
  { id:"challenge", name:"Reto / Challenge", desc:"Registro para reto de varios días", sections:["hero","days","instructor","testimonials","registration","footer"] },
  { id:"saas", name:"SaaS / Software", desc:"Producto digital con features y pricing", sections:["hero","features","how-it-works","integrations","pricing","testimonials","faq","cta","footer"] },
  { id:"agency", name:"Agencia / Servicios", desc:"Agencia con portfolio y booking", sections:["hero","services","portfolio","process","team","testimonials","booking","footer"] },
  { id:"ecommerce", name:"E-commerce", desc:"Producto con galería y compra", sections:["hero","gallery","details","features","reviews","pricing","faq","footer"] },
  { id:"event", name:"Evento / Summit", desc:"Evento con speakers, agenda y tickets", sections:["hero","speakers","agenda","sponsors","tickets","venue","footer"] },
  { id:"portfolio", name:"Portfolio Personal", desc:"Portfolio con proyectos y contacto", sections:["hero","projects","about","skills","testimonials","contact","footer"] },
  { id:"coaching", name:"Coaching / Consultoría", desc:"Coach o consultor con booking", sections:["hero","story","results","methodology","testimonials","booking","footer"] },
];

const STYLES = [
  { id:"monochrome",name:"Monochrome",cat:"Editorial",c:["#fff","#000","#f5f5f5","#525252"],font:"Playfair Display",bg:"light",desc:"B&W editorial luxury. Serif typography as hero.",txt:"monochrome" },
  { id:"bauhaus",name:"Bauhaus",cat:"Artístico",c:["#F0F0F0","#D02020","#1040C0","#F0C020"],font:"Outfit",bg:"light",desc:"Constructivista con primarios puros, geométrico.",txt:"bauhaus" },
  { id:"modern-dark",name:"Modern Dark",cat:"Tech",c:["#050506","#5E6AD2","#0a0a0c","#EDEDEF"],font:"Inter",bg:"dark",desc:"Cinematic Linear/Vercel. Ambient blobs, multi-layer.",txt:"modern-dark" },
  { id:"newsprint",name:"Newsprint",cat:"Editorial",c:["#F9F9F7","#111","#CC0000","#E5E5E0"],font:"Playfair Display",bg:"light",desc:"Golden age of print. Drop caps, column grids.",txt:"newsprint" },
  { id:"tech-style",name:"Tech Style",cat:"Tech",c:["#FAFAFA","#0052FF","#4D7CFF","#0F172A"],font:"Calistoga",bg:"light",desc:"SaaS moderno con gradientes y diseño profesional.",txt:"tech-style" },
  { id:"swiss",name:"Swiss International",cat:"Tipográfico",c:["#fff","#000","#FF3000","#F2F2F2"],font:"Inter",bg:"light",desc:"Tipografía objetiva suiza. Massive scale, Swiss Red.",txt:"swiss" },
  { id:"kinetic",name:"Kinetic Typography",cat:"Brutalist",c:["#09090B","#DFE104","#FAFAFA","#27272A"],font:"Space Grotesk",bg:"dark",desc:"Marquees infinitos, viewport-width type, acid yellow.",txt:"kinetic" },
  { id:"flat",name:"Flat Design",cat:"Moderno",c:["#fff","#3B82F6","#10B981","#F59E0B"],font:"Outfit",bg:"light",desc:"Zero shadows, color blocking, poster energy.",txt:"flat-design" },
  { id:"art-deco",name:"Art Deco",cat:"Luxury",c:["#0A0A0A","#D4AF37","#F2F0E4","#1E3D59"],font:"Marcellus",bg:"dark",desc:"Gatsby gold on obsidian. Sunbursts, roman numerals.",txt:"art-deco" },
  { id:"material-you",name:"Material You",cat:"Friendly",c:["#FFFBFE","#6750A4","#E8DEF8","#7D5260"],font:"Roboto",bg:"light",desc:"Organic pills, tonal surfaces, Google's MD3.",txt:"material" },
  { id:"neo-brutal",name:"Neo-Brutalism",cat:"Punk",c:["#FFFDF5","#FF6B6B","#FFD93D","#C4B5FD"],font:"Space Grotesk",bg:"light",desc:"Sticker collage. Hard shadows, thick borders.",txt:"neo-brutalism" },
  { id:"bold-typo",name:"Bold Typography",cat:"Editorial",c:["#0A0A0A","#FF3D00","#FAFAFA","#1A1A1A"],font:"Inter Tight",bg:"dark",desc:"Poster design for web. Underline CTAs, vermillion.",txt:"bold-typography" },
  { id:"academia",name:"Academia Classical",cat:"Luxury",c:["#1C1714","#C9A962","#E8DFD4","#8B2635"],font:"Cormorant Garamond",bg:"dark",desc:"Library at night. Brass, arch-tops, wax seals.",txt:"academia" },
  { id:"cyberpunk",name:"Cyberpunk Glitch",cat:"Futurista",c:["#0a0a0f","#00ff88","#ff00ff","#00d4ff"],font:"Orbitron",bg:"dark",desc:"CRT scanlines, chromatic aberration, neon glow.",txt:"cyberpunk" },
  { id:"crypto",name:"Crypto DeFi",cat:"Fintech",c:["#030304","#F7931A","#FFD600","#0F1115"],font:"Space Grotesk",bg:"dark",desc:"Digital gold. Colored glow shadows, glass cards.",txt:"crypto" },
  { id:"retro",name:"Retro",cat:"Nostálgico",c:["#C0C0C0","#0000FF","#FF0000","#FFFF00"],font:"Arial Black",bg:"light",desc:"Vintage warmth con paletas nostálgicas.",txt:"retro" },
  { id:"maximalism",name:"Maximalism",cat:"Maximalista",c:["#0D0D1A","#FF3AF2","#00F5D4","#FFE600"],font:"Outfit",bg:"dark",desc:"Sensory overload. 5 accents, stacked shadows.",txt:"maximalism" },
  { id:"playful-geo",name:"Playful Geometric",cat:"Friendly",c:["#FFFDF5","#8B5CF6","#F472B6","#FBBF24"],font:"Outfit",bg:"light",desc:"Memphis sticker book. Candy buttons, confetti.",txt:"playful-geometric" },
  { id:"vaporwave",name:"Vaporwave",cat:"Retro",c:["#090014","#FF00FF","#00FFFF","#FF9900"],font:"Orbitron",bg:"dark",desc:"80s neon grid, CRT scanlines, sunset gradient.",txt:"vaporwave" },
  { id:"corporate",name:"Corporate Trust",cat:"Enterprise",c:["#F8FAFC","#4F46E5","#7C3AED","#10B981"],font:"Plus Jakarta Sans",bg:"light",desc:"Indigo-violet gradients, isometric depth.",txt:"corporate-trust" },
  { id:"botanical",name:"Botanical",cat:"Natural",c:["#F9F8F4","#8C9A84","#C27B66","#DCCFC2"],font:"Playfair Display",bg:"light",desc:"Arch imagery, sepia hover, sage green.",txt:"botanical" },
  { id:"hand-drawn",name:"Hand-Drawn",cat:"Artístico",c:["#fdfbf7","#2d2d2d","#ff4d4d","#2d5da1"],font:"Kalam",bg:"light",desc:"Wobbly borders, tape, thumbtacks, sketchy.",txt:"hand-drawn" },
  { id:"terminal-cli",name:"Terminal CLI",cat:"Futurista",c:["#0a0a0a","#33ff00","#ffb000","#1f521f"],font:"JetBrains Mono",bg:"dark",desc:"Command-line aesthetic. Green phosphor, scanlines.",txt:"terminal-cli" },
  { id:"industrial",name:"Industrial",cat:"Hardware",c:["#e0e5ec","#ff4757","#2d3436","#babecc"],font:"Inter",bg:"light",desc:"Raw concrete textures, metal accents, warehouse.",txt:"industrial" },
  { id:"neumorphism",name:"Neumorphism",cat:"3D",c:["#E0E5EC","#6C63FF","#38B2AC","#3D4852"],font:"Plus Jakarta Sans",bg:"light",desc:"Dual shadows, extruded/pressed, soft UI.",txt:"neumorphism" },
  { id:"clay",name:"Clay",cat:"3D",c:["#F4F1FA","#7C3AED","#DB2777","#0EA5E9"],font:"Nunito",bg:"light",desc:"Candy clay. 4-layer shadows, glass-blur.",txt:"clay" },
  { id:"organic",name:"Organic Natural",cat:"Natural",c:["#FDFCF8","#5D7052","#C18C5D","#E6DCCD"],font:"Fraunces",bg:"light",desc:"Blob shapes, moss shadows, wabi-sabi.",txt:"organic-natural" },
  { id:"business",name:"Business Style",cat:"Enterprise",c:["#FFFFFF","#1E40AF","#3B82F6","#1E293B"],font:"Plus Jakarta Sans",bg:"light",desc:"Corporate profesional, clean y trustworthy.",txt:"business-style" },
  { id:"simple-dark",name:"Simple Dark",cat:"Dark",c:["#0A0A0F","#F59E0B","#1A1A24","#FAFAFA"],font:"Space Grotesk",bg:"dark",desc:"Amber embers in void. Glass cards, glow orbs.",txt:"simple-dark" },
  { id:"luxury",name:"Luxury",cat:"Luxury",c:["#0A0A0A","#D4AF37","#1A1A1A","#F5F5F5"],font:"Playfair Display",bg:"dark",desc:"Dark backgrounds con gold accents. Premium refined.",txt:"luxury" },
];

const BACKGROUNDS = [
  { id:"from-style",name:"Del estilo elegido",type:"auto" },
  { id:"gradient-shift",name:"Gradient Shift",type:"css" },
  { id:"particles",name:"Partículas",type:"css" },
  { id:"mesh",name:"Mesh Gradient",type:"css" },
  { id:"grid",name:"Grid Futurista",type:"css" },
  { id:"aurora",name:"Aurora",type:"css" },
  { id:"none",name:"Sin fondo especial",type:"none" },
];

const PALETTES = [
  { id:"from-style",name:"Del estilo",colors:null,desc:"Paleta original del design system" },
  // Dark backgrounds
  { id:"midnight",name:"Midnight",colors:["#0a0a0a","#1a1a2e","#6C63FF","#e0e0e0","#fff"],desc:"Violeta profundo sobre negro" },
  { id:"ocean",name:"Ocean",colors:["#0a192f","#112240","#64ffda","#8892b0","#ccd6f6"],desc:"Teal neón sobre navy" },
  { id:"ember",name:"Ember",colors:["#1a0000","#2d0000","#ff4d4d","#ffaa80","#fff"],desc:"Rojo fuego sobre dark" },
  { id:"forest",name:"Forest",colors:["#0a1a0a","#1a2e1a","#4ade80","#a3e4a3","#f0fff0"],desc:"Verde bosque natural" },
  { id:"gold",name:"Black & Gold",colors:["#0a0a0a","#1a1a1a","#d4af37","#f5e6a3","#fff"],desc:"Luxury gold sobre negro" },
  { id:"rose",name:"Rosé",colors:["#1a0a10","#2d1020","#f43f5e","#fda4af","#fff1f2"],desc:"Rosa elegante sobre dark" },
  { id:"lavender",name:"Lavender",colors:["#0f0a1a","#1a1030","#a855f7","#c4b5fd","#faf5ff"],desc:"Púrpura suave premium" },
  { id:"neon",name:"Neon",colors:["#0a0a0a","#1a1a2e","#00ff88","#ff00ff","#fff"],desc:"Neón dual verde + magenta" },
  { id:"slate",name:"Slate",colors:["#0f172a","#1e293b","#94a3b8","#cbd5e1","#f8fafc"],desc:"Gris profesional neutro" },
  { id:"crimson",name:"Crimson",colors:["#0d0000","#1a0505","#dc2626","#fca5a5","#fef2f2"],desc:"Rojo intenso dramático" },
  { id:"electric",name:"Electric",colors:["#020617","#0f172a","#38bdf8","#7dd3fc","#f0f9ff"],desc:"Azul eléctrico tech" },
  { id:"bronze",name:"Bronze",colors:["#0c0a08","#1c1814","#cd7f32","#deb887","#fdf8f0"],desc:"Bronce cálido metalizado" },
  { id:"cyber",name:"Cyber",colors:["#0a0a0f","#12121f","#00d4ff","#ff6b35","#f0f0f0"],desc:"Cyan + naranja futurista" },
  { id:"wine",name:"Wine",colors:["#1a0a12","#2d1020","#9f1239","#fda4af","#fff1f2"],desc:"Vino tinto sofisticado" },
  // Light backgrounds
  { id:"arctic",name:"Arctic",colors:["#f0f4f8","#e2e8f0","#3b82f6","#1e40af","#0f172a"],desc:"Azul frío sobre blanco" },
  { id:"coral",name:"Coral",colors:["#fff7ed","#fed7aa","#f97316","#ea580c","#1c1917"],desc:"Coral cálido sobre crema" },
  { id:"earth",name:"Earth",colors:["#fdfcf8","#e6dccd","#5d7052","#c18c5d","#2c2c24"],desc:"Tonos tierra orgánicos" },
  { id:"mint",name:"Mint Fresh",colors:["#f0fdfa","#ccfbf1","#14b8a6","#0d9488","#134e4a"],desc:"Verde menta fresco" },
  { id:"sunset",name:"Sunset",colors:["#fffbeb","#fef3c7","#f59e0b","#d97706","#1c1917"],desc:"Naranja cálido sunset" },
  { id:"blush",name:"Blush",colors:["#fdf2f8","#fce7f3","#ec4899","#be185d","#1a1a2e"],desc:"Rosa femenino delicado" },
  { id:"sage",name:"Sage",colors:["#f8faf5","#e8efe0","#6b8f5e","#4a6741","#1a2e1a"],desc:"Sage green botánico" },
  { id:"cream",name:"Cream",colors:["#fefcf3","#f5f0e1","#b8860b","#8b6914","#1a1a0a"],desc:"Crema con dorado antiguo" },
  { id:"cloud",name:"Cloud",colors:["#f8fafc","#f1f5f9","#6366f1","#4f46e5","#1e1b4b"],desc:"Indigo suave corporativo" },
  { id:"peach",name:"Peach",colors:["#fef7f0","#fde8d8","#fb923c","#c2410c","#1c1917"],desc:"Durazno cálido friendly" },
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
  { name:"Lovable",url:"https://lovable.dev",icon:"♡" },
  { name:"v0.dev",url:"https://v0.dev",icon:"▲" },
  { name:"Claude",url:"https://claude.ai",icon:"◈" },
  { name:"ChatGPT",url:"https://chat.openai.com",icon:"◉" },
];

const SMETA = {
  hero:{l:"Hero",h:"Headline, sub, CTA"},vsl:{l:"VSL",h:"Video headline y URL"},
  benefits:{l:"Beneficios",h:"3-6 beneficios"},bonuses:{l:"Bonos",h:"Bonos con valor"},
  pricing:{l:"Pricing",h:"Planes y precios"},countdown:{l:"Countdown",h:"Fecha límite"},
  testimonials:{l:"Testimonios",h:"2-3 testimonios"},guarantee:{l:"Garantía",h:"Tipo y condiciones"},
  faq:{l:"FAQ",h:"5-8 preguntas"},footer:{l:"Footer",h:"Links y redes"},
  presenter:{l:"Presentador",h:"Bio y credenciales"},instructor:{l:"Instructor",h:"Bio y logros"},
  agenda:{l:"Agenda",h:"Temas y horarios"},registration:{l:"Registro",h:"Formulario"},
  urgency:{l:"Urgencia",h:"Escasez"},preview:{l:"Preview",h:"Qué recibirán"},
  author:{l:"Autor",h:"Bio del autor"},form:{l:"Formulario",h:"Campos"},
  modules:{l:"Módulos",h:"Contenido del curso"},tiers:{l:"Niveles",h:"Membresía"},
  days:{l:"Días",h:"Contenido por día"},features:{l:"Features",h:"3-6 features"},
  "how-it-works":{l:"Cómo Funciona",h:"Pasos"},integrations:{l:"Integraciones",h:"Herramientas"},
  cta:{l:"CTA Final",h:"Headline y botón"},services:{l:"Servicios",h:"Lista"},
  portfolio:{l:"Portfolio",h:"Proyectos"},process:{l:"Proceso",h:"Pasos"},
  team:{l:"Equipo",h:"Miembros"},booking:{l:"Booking",h:"Calendario"},
  gallery:{l:"Galería",h:"Imágenes"},details:{l:"Detalles",h:"Specs"},
  reviews:{l:"Reseñas",h:"Clientes"},speakers:{l:"Speakers",h:"Ponentes"},
  sponsors:{l:"Sponsors",h:"Patrocinadores"},tickets:{l:"Tickets",h:"Entradas"},
  venue:{l:"Lugar",h:"Ubicación"},projects:{l:"Proyectos",h:"Portfolio"},
  about:{l:"Sobre mí",h:"Bio"},skills:{l:"Skills",h:"Tecnologías"},
  contact:{l:"Contacto",h:"Datos"},story:{l:"Historia",h:"Tu historia"},
  results:{l:"Resultados",h:"Métricas"},methodology:{l:"Metodología",h:"Método"},
};

// ── PROMPT BUILDER ──────────────────────────────────────────────────
function buildPrompt({objective,style,background,palette,sections,content,embeds,language,tone,socials,dsText}) {
  const langName = LANGUAGES.find(l=>l.id===language)?.name || "Español";
  const toneName = TONES.find(t=>t.id===tone)?.name || "Profesional";
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

${dsText ? `═══ FULL DESIGN SYSTEM ═══\n${dsText}\n═══ END DESIGN SYSTEM ═══` : `DESIGN SYSTEM: ${style.name.toUpperCase()}\n${style.desc}\nApply the FULL ${style.name} design system: typography (${style.font}), colors, shadows, radius, borders, animations, responsive strategy, and ALL signature "bold factor" elements.\nImport fonts via Google Fonts <link>.`}

PALETTE: ${palette.id==="from-style"?`Use ${style.name}'s original palette`:palette.colors?`Override: BG=${palette.colors[0]} Surface=${palette.colors[1]} Accent=${palette.colors[2]} Text2=${palette.colors[3]} Text1=${palette.colors[4]}`:"Default"}

BACKGROUND: ${background.type==="auto"?`Use ${style.name}'s defined background effects`:background.type==="css"?`CSS animated: "${background.name}"`:background.type==="none"?"Solid with subtle accents":"Default"}

LANGUAGE: ${langName}
TONE: ${toneName}
All text in the specified language with matching tone.

SECTIONS:
${sBlocks}

${socials?`SOCIAL LINKS (include in footer):\n${socials}`:""} 

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

// ── MAIN APP ────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("landing");
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
  const [svFilter, setSvFilter] = useState("All");
  const [dsCache, setDsCache] = useState({});

  useEffect(() => { if (localStorage.getItem("np_access") === "granted") setView("wizard"); }, []);

  const svFiltered = svFilter==="All" ? STYLES : svFilter==="Light" ? STYLES.filter(s=>s.bg==="light") : STYLES.filter(s=>s.bg==="dark");
  const activeIdx = data.style ? STYLES.findIndex(s=>s.id===data.style.id) : 0;
  const activeStyle = data.style || STYLES[0];
  const prevS = activeIdx > 0 ? STYLES[activeIdx-1] : null;
  const nextS = activeIdx < STYLES.length-1 ? STYLES[activeIdx+1] : null;

  const canNext = () => {
    if(step===0) return !!data.objective;
    if(step===1) return !!data.style;
    return true;
  };

  const handleGate = () => {
    if (code === "NINJA$") { localStorage.setItem("np_access","granted"); setView("wizard"); setCodeErr(false); }
    else setCodeErr(true);
  };

  const handleGenerate = async () => {
    let dsText = dsCache[data.style?.txt] || "";
    if (!dsText && data.style?.txt) {
      try {
        const r = await fetch(`/design-systems/${data.style.txt}.txt`);
        if (r.ok) { dsText = await r.text(); setDsCache(c => ({...c, [data.style.txt]: dsText})); }
      } catch(e) { console.warn("Could not load design system txt:", e); }
    }
    setPrompt(buildPrompt({...data, dsText}));
    setGenerated(true);
  };

  const handleDownload = () => {
    const b = new Blob([prompt],{type:"text/plain;charset=utf-8"});
    const u = URL.createObjectURL(b);
    Object.assign(document.createElement("a"),{href:u,download:`NinjaPrompt_${data.style?.id}_${data.objective?.id}_${Date.now()}.txt`}).click();
    URL.revokeObjectURL(u);
  };

  const handleCopy = () => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const toggleSec = s => setData(d=>({...d,sections:d.sections.includes(s)?d.sections.filter(x=>x!==s):[...d.sections,s]}));

  const STEPS = ["Configurar","Estilo","Apariencia","Contenido","Generar"];

  // ═══════════════════════════════════════════════════════════════════
  // CSS — Monochrome Editorial Aesthetic
  // ═══════════════════════════════════════════════════════════════════
  const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=JetBrains+Mono:wght@400;500&display=swap');
:root{
  --bg:#FFFFFF;--fg:#000000;--muted:#F5F5F5;--muted-fg:#525252;
  --border:#000000;--border-light:#E5E5E5;
  --sans:'Inter Tight',system-ui,sans-serif;
  --mono:'JetBrains Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box;}
body,#root{background:var(--bg);color:var(--fg);font-family:var(--sans);min-height:100vh;-webkit-font-smoothing:antialiased;}

/* ── NOISE TEXTURE ── */
body::before{content:'';position:fixed;inset:0;z-index:9999;pointer-events:none;opacity:.02;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

/* ── LANDING ── */
.ld{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 24px;}
.ld-rule{width:80px;height:4px;background:var(--fg);margin-bottom:32px;}
.ld h1{font-family:var(--sans);font-size:clamp(40px,8vw,80px);font-weight:900;line-height:1;letter-spacing:-.04em;margin-bottom:20px;}
.ld h1 em{font-style:italic;font-weight:400;}
.ld p{font-size:18px;color:var(--muted-fg);max-width:480px;line-height:1.7;margin-bottom:40px;}
.ld-stats{display:flex;gap:40px;margin-bottom:48px;}
.ld-stat{text-align:center;}
.ld-stat b{font-family:var(--sans);font-size:32px;display:block;}
.ld-stat span{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--muted-fg);}
.ld-cta{font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.15em;font-weight:500;
  background:var(--fg);color:var(--bg);padding:16px 40px;border:none;cursor:pointer;transition:all 100ms;}
.ld-cta:hover{background:var(--bg);color:var(--fg);outline:2px solid var(--fg);outline-offset:-2px;}
.ld-footer{margin-top:60px;font-family:var(--mono);font-size:10px;color:var(--muted-fg);letter-spacing:.1em;text-transform:uppercase;}

/* ── GATE ── */
.gate{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;}
.gate-box{width:100%;max-width:380px;text-align:center;}
.gate-box h2{font-family:var(--sans);font-size:28px;font-weight:700;margin-bottom:4px;}
.gate-sub{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.2em;color:var(--muted-fg);margin-bottom:32px;}
.gate-input{width:100%;padding:14px;border:2px solid var(--fg);background:var(--bg);font-family:var(--mono);
  font-size:14px;text-align:center;letter-spacing:2px;outline:none;}
.gate-input:focus{border-width:4px;padding:12px;}
.gate-input.err{border-color:#c00;animation:shake .3s ease;}
@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}
.gate-btn{width:100%;padding:14px;background:var(--fg);color:var(--bg);font-family:var(--mono);font-size:11px;
  text-transform:uppercase;letter-spacing:.15em;border:none;cursor:pointer;margin-top:12px;transition:all 100ms;}
.gate-btn:hover{background:var(--bg);color:var(--fg);outline:2px solid var(--fg);outline-offset:-2px;}
.gate-err{font-family:var(--mono);font-size:11px;color:#c00;margin-bottom:10px;}
.gate-back{font-family:var(--mono);font-size:10px;color:var(--muted-fg);margin-top:20px;cursor:pointer;background:none;border:none;}
.gate-back:hover{color:var(--fg);}

/* ── SYSTEM NAV ── */
.sys{display:flex;flex-direction:column;min-height:100vh;}
.sys-nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 24px;height:52px;border-bottom:2px solid var(--fg);flex-shrink:0;background:var(--bg);}
.sys-logo{font-family:var(--sans);font-size:16px;font-weight:700;letter-spacing:-.02em;}
.sys-logo em{font-style:italic;font-weight:400;}
.sys-steps{display:flex;height:100%;}
.sys-step{display:flex;align-items:center;gap:6px;padding:0 20px;font-family:var(--mono);font-size:11px;
  text-transform:uppercase;letter-spacing:.1em;color:var(--muted-fg);border-left:1px solid var(--border-light);
  cursor:pointer;transition:all 100ms;position:relative;}
.sys-step:first-child{border-left:none;}
.sys-step:hover{color:var(--fg);}
.sys-step.on{color:var(--fg);font-weight:500;}
.sys-step.on::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:var(--fg);}
.sys-step.done{color:var(--fg);}
.sys-step-n{font-size:9px;opacity:.4;}
.sys-right{display:flex;align-items:center;gap:12px;}
.sys-exit{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted-fg);
  background:none;border:1px solid var(--border-light);padding:6px 14px;cursor:pointer;transition:all 100ms;}
.sys-exit:hover{border-color:var(--fg);color:var(--fg);}
@media(max-width:768px){
  .sys-steps{overflow-x:auto;}
  .sys-step{padding:0 12px;font-size:9px;white-space:nowrap;}
}

/* ── MAIN CONTENT ── */
.sys-panel{max-width:900px;width:100%;margin:0 auto;padding:40px 24px 80px;}
.sys-panel h2{font-family:var(--sans);font-size:clamp(24px,4vw,36px);font-weight:700;letter-spacing:-.03em;margin-bottom:6px;}
.sys-panel .sub{font-size:16px;color:var(--muted-fg);margin-bottom:28px;line-height:1.6;}
.sys-rule{width:100%;height:2px;background:var(--fg);margin:20px 0;}
.sys-rule-light{height:1px;background:var(--border-light);}

/* ── STEP 0: CONFIGURAR ── */
.cfg-section{margin-bottom:32px;}
.cfg-label{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--muted-fg);margin-bottom:10px;}
.cfg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;}
.cfg-card{padding:14px;border:1px solid var(--border-light);cursor:pointer;transition:all 100ms;text-align:left;}
.cfg-card:hover{border-color:var(--fg);}
.cfg-card.sel{border-color:var(--fg);border-width:2px;background:var(--muted);}
.cfg-card h4{font-family:var(--sans);font-size:15px;font-weight:600;margin-bottom:2px;}
.cfg-card p{font-size:13px;color:var(--muted-fg);line-height:1.4;}
.cfg-chips{display:flex;flex-wrap:wrap;gap:5px;}
.cfg-chip{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.08em;
  padding:6px 12px;border:1px solid var(--border-light);cursor:pointer;transition:all 100ms;}
.cfg-chip:hover{border-color:var(--fg);}
.cfg-chip.on{background:var(--fg);color:var(--bg);border-color:var(--fg);}
.cfg-lang{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;}
.cfg-lang-item{padding:10px 14px;border:1px solid var(--border-light);cursor:pointer;font-size:14px;transition:all 100ms;}
.cfg-lang-item:hover{border-color:var(--fg);}
.cfg-lang-item.sel{border-color:var(--fg);border-width:2px;font-weight:600;}

/* ── STEP 1: STYLE VISUALIZER ── */
.sv{flex:1;display:flex;overflow:hidden;}
.sv-side{width:280px;flex-shrink:0;border-right:1px solid var(--border-light);display:flex;flex-direction:column;background:var(--bg);}
.sv-side-hdr{padding:14px 16px;border-bottom:1px solid var(--border-light);}
.sv-side-title{font-family:var(--sans);font-size:14px;font-weight:700;margin-bottom:2px;}
.sv-side-sub{font-size:11px;color:var(--muted-fg);}
.sv-filters{display:flex;gap:0;border-bottom:1px solid var(--border-light);}
.sv-ftag{flex:1;padding:8px;font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;
  text-align:center;background:none;border:none;border-right:1px solid var(--border-light);color:var(--muted-fg);cursor:pointer;transition:all 100ms;}
.sv-ftag:last-child{border-right:none;}
.sv-ftag:hover{color:var(--fg);}
.sv-ftag.on{background:var(--fg);color:var(--bg);}
.sv-list{flex:1;overflow-y:auto;}
.sv-list::-webkit-scrollbar{width:3px;}
.sv-list::-webkit-scrollbar-thumb{background:var(--border-light);}
.sv-item{display:flex;align-items:center;gap:10px;padding:10px 16px;cursor:pointer;transition:all 100ms;border-bottom:1px solid var(--border-light);border-left:3px solid transparent;}
.sv-item:hover{background:var(--muted);}
.sv-item.on{border-left-color:var(--fg);background:var(--muted);}
.sv-item-dot{width:20px;height:20px;border-radius:50%;flex-shrink:0;border:1px solid var(--border-light);}
.sv-item-name{font-size:13px;font-weight:500;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.sv-item-tag{font-family:var(--mono);font-size:9px;color:var(--muted-fg);text-transform:uppercase;letter-spacing:.05em;}
.sv-item-num{font-family:var(--mono);font-size:9px;color:var(--muted-fg);flex-shrink:0;}

.sv-preview{flex:1;display:flex;flex-direction:column;background:#f8f8f8;}
.sv-preview-bar{display:flex;align-items:center;gap:12px;padding:10px 16px;background:var(--bg);border-bottom:1px solid var(--border-light);flex-shrink:0;}
.sv-dots{display:flex;gap:5px;}
.sv-dot{width:10px;height:10px;border-radius:50%;}
.sv-dot-r{background:#ff5f57;}.sv-dot-y{background:#ffbd2e;}.sv-dot-g{background:#28c840;}
.sv-tab{display:flex;align-items:center;gap:5px;padding:4px 12px;background:var(--muted);font-family:var(--mono);font-size:10px;}
.sv-tab-dot{width:8px;height:8px;border-radius:50%;}
.sv-url{flex:1;display:flex;align-items:center;gap:6px;padding:4px 12px;background:var(--muted);}
.sv-url span{font-family:var(--mono);font-size:10px;color:var(--muted-fg);}
.sv-nav-arrows{display:flex;gap:2px;}
.sv-arrow{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-light);
  background:none;cursor:pointer;font-size:14px;color:var(--muted-fg);transition:all 100ms;}
.sv-arrow:hover{border-color:var(--fg);color:var(--fg);}
.sv-arrow:disabled{opacity:.2;cursor:not-allowed;}
.sv-iframe{flex:1;width:100%;border:none;background:#fff;}
.sv-info{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;border-top:1px solid var(--border-light);
  background:var(--bg);flex-shrink:0;}
.sv-info-left{font-family:var(--mono);font-size:10px;color:var(--muted-fg);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.sv-info-left b{color:var(--fg);font-weight:600;}
.sv-info-right{display:flex;gap:6px;align-items:center;flex-shrink:0;}
.sv-btn{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.1em;padding:7px 16px;cursor:pointer;transition:all 100ms;}
.sv-btn-primary{background:var(--fg);color:var(--bg);border:none;}
.sv-btn-primary:hover{background:var(--bg);color:var(--fg);outline:2px solid var(--fg);outline-offset:-2px;}
.sv-btn-ghost{background:none;color:var(--fg);border:1px solid var(--border-light);}
.sv-btn-ghost:hover{border-color:var(--fg);}
@media(max-width:768px){
  .sv{flex-direction:column;}
  .sv-side{width:100%;max-height:200px;border-right:none;border-bottom:1px solid var(--border-light);}
}

/* ── STEP 2: APARIENCIA ── */
.ap-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px;}
.ap-card{padding:14px;border:1px solid var(--border-light);cursor:pointer;transition:all 100ms;}
.ap-card:hover{border-color:var(--fg);}
.ap-card.sel{border-color:var(--fg);border-width:2px;}
.ap-card h5{font-size:13px;font-weight:600;margin-bottom:2px;}
.ap-card p{font-size:11px;color:var(--muted-fg);}
.ap-swatches{display:flex;gap:3px;margin-top:6px;}
.ap-swatch{width:16px;height:16px;border:1px solid var(--border-light);}

/* ── STEP 3: CONTENIDO ── */
.ct-block{border:1px solid var(--border-light);margin-bottom:8px;}
.ct-block-h{padding:10px 14px;border-bottom:1px solid var(--border-light);display:flex;justify-content:space-between;align-items:center;}
.ct-block-h h4{font-family:var(--sans);font-size:14px;font-weight:600;}
.ct-block-h span{font-family:var(--mono);font-size:10px;color:var(--muted-fg);}
.ct-ta{width:100%;min-height:60px;padding:12px 14px;border:none;background:var(--bg);font-family:var(--sans);font-size:14px;
  color:var(--fg);resize:vertical;outline:none;line-height:1.6;}
.ct-ta::placeholder{color:var(--muted-fg);font-style:italic;}
.ct-hint{padding:12px 14px;background:var(--muted);font-size:13px;color:var(--muted-fg);line-height:1.6;
  font-style:italic;border-top:1px solid var(--border-light);}

/* ── STEP 4: EMBEDS + RESULT ── */
.res-prompt{background:var(--muted);border:1px solid var(--border-light);padding:16px;
  font-family:var(--mono);font-size:11px;line-height:1.7;color:var(--muted-fg);max-height:350px;
  overflow-y:auto;white-space:pre-wrap;word-break:break-word;margin-bottom:16px;}
.res-actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;}
.res-btn{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.1em;
  padding:12px 24px;cursor:pointer;transition:all 100ms;}
.res-btn-p{background:var(--fg);color:var(--bg);border:none;}
.res-btn-p:hover{background:var(--bg);color:var(--fg);outline:2px solid var(--fg);outline-offset:-2px;}
.res-btn-s{background:none;color:var(--fg);border:1px solid var(--fg);}
.res-btn-s:hover{background:var(--fg);color:var(--bg);}
.res-ai{margin-top:16px;}
.res-ai-label{font-family:var(--mono);font-size:10px;text-transform:uppercase;letter-spacing:.15em;color:var(--muted-fg);margin-bottom:8px;}
.res-ai-grid{display:flex;gap:6px;flex-wrap:wrap;}
.res-ai-link{display:flex;align-items:center;gap:5px;padding:8px 14px;border:1px solid var(--border-light);
  font-family:var(--mono);font-size:11px;text-decoration:none;color:var(--fg);transition:all 100ms;}
.res-ai-link:hover{border-color:var(--fg);background:var(--muted);}

/* ── BOTTOM NAV (Sticky Footer) ── */
.sys-bottom{position:fixed;bottom:0;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;
  padding:12px 24px;border-top:2px solid var(--fg);background:var(--bg);backdrop-filter:blur(12px);}
.sys-bottom-btn{font-family:var(--mono);font-size:11px;text-transform:uppercase;letter-spacing:.1em;padding:10px 24px;cursor:pointer;transition:all 100ms;}
.sys-bottom-btn:disabled{opacity:.2;cursor:not-allowed;}
.sys-bottom-next{background:var(--fg);color:var(--bg);border:none;}
.sys-bottom-next:hover:not(:disabled){background:var(--bg);color:var(--fg);outline:2px solid var(--fg);outline-offset:-2px;}
.sys-bottom-prev{background:none;color:var(--fg);border:1px solid var(--fg);}
.sys-bottom-prev:hover:not(:disabled){background:var(--fg);color:var(--bg);}
.sys-bottom-info{font-family:var(--mono);font-size:10px;color:var(--muted-fg);}

/* Add padding to main content so it doesn't hide behind sticky footer */
.sys-main{flex:1;display:flex;flex-direction:column;padding-bottom:60px;}
`;

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: LANDING
  // ═══════════════════════════════════════════════════════════════════
  if (view === "landing") return (
    <>
      <style>{css}</style>
      <div className="ld">
        <div className="ld-rule"/>
        <h1>Ninja<em>Prompts</em></h1>
        <p>30 design systems completos. 16 tipos de página. Un prompt perfecto para tu landing page en minutos.</p>
        <div className="ld-stats">
          <div className="ld-stat"><b>30</b><span>Design Systems</span></div>
          <div className="ld-stat"><b>16</b><span>Tipos de Página</span></div>
          <div className="ld-stat"><b>∞</b><span>Combinaciones</span></div>
        </div>
        <button className="ld-cta" onClick={()=>setView("gate")}>Ingresar →</button>
        <div className="ld-footer">© {new Date().getFullYear()} NinjaPerformance LLC</div>
      </div>
    </>
  );

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: GATE
  // ═══════════════════════════════════════════════════════════════════
  if (view === "gate") return (
    <>
      <style>{css}</style>
      <div className="gate">
        <div className="gate-box">
          <h2>NinjaPrompts</h2>
          <div className="gate-sub">Acceso privado</div>
          {codeErr && <div className="gate-err">Código incorrecto</div>}
          <input className={`gate-input ${codeErr?"err":""}`} type="password" placeholder="Código de acceso"
            value={code} onChange={e=>{setCode(e.target.value);setCodeErr(false);}} onKeyDown={e=>e.key==="Enter"&&handleGate()}/>
          <button className="gate-btn" onClick={handleGate}>Ingresar</button>
          <button className="gate-back" onClick={()=>setView("landing")}>← Volver</button>
        </div>
      </div>
    </>
  );

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: WIZARD SYSTEM
  // ═══════════════════════════════════════════════════════════════════

  const renderStep = () => {
    switch(step) {
      // ── STEP 0: CONFIGURAR ──
      case 0: return (
        <div className="sys-panel">
          <h2>Configurar proyecto</h2>
          <p className="sub">Define el tipo de página, secciones e idioma en un solo paso.</p>

          <div className="cfg-section">
            <div className="cfg-label">Tipo de página</div>
            <div className="cfg-grid">
              {OBJECTIVES.map(o=>(
                <div key={o.id} className={`cfg-card ${data.objective?.id===o.id?"sel":""}`}
                  onClick={()=>setData(d=>({...d,objective:o,sections:[...o.sections]}))}>
                  <h4>{o.name}</h4>
                  <p>{o.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {data.objective && (<>
            <div className="cfg-section">
              <div className="cfg-label">Secciones</div>
              <div className="cfg-chips">
                {Object.keys(SMETA).map(s=>(
                  <div key={s} className={`cfg-chip ${data.sections.includes(s)?"on":""}`} onClick={()=>toggleSec(s)}>
                    {SMETA[s].l}
                  </div>
                ))}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
              <div className="cfg-section">
                <div className="cfg-label">Idioma</div>
                <div className="cfg-lang">
                  {LANGUAGES.map(l=>(
                    <div key={l.id} className={`cfg-lang-item ${data.language===l.id?"sel":""}`}
                      onClick={()=>setData(d=>({...d,language:l.id}))}>{l.name}</div>
                  ))}
                </div>
              </div>
              <div className="cfg-section">
                <div className="cfg-label">Tono</div>
                <div className="cfg-lang">
                  {TONES.map(t=>(
                    <div key={t.id} className={`cfg-lang-item ${data.tone===t.id?"sel":""}`}
                      onClick={()=>setData(d=>({...d,tone:t.id}))}>{t.name}</div>
                  ))}
                </div>
              </div>
            </div>
          </>)}
        </div>
      );

      // ── STEP 1: STYLE VISUALIZER ──
      case 1: return (
        <div className="sv">
          <div className="sv-side">
            <div className="sv-side-hdr">
              <div className="sv-side-title">Design Systems</div>
              <div className="sv-side-sub">30 estilos premium</div>
            </div>
            <div className="sv-filters">
              {["All","Light","Dark"].map(f=><button key={f} className={`sv-ftag ${svFilter===f?"on":""}`} onClick={()=>setSvFilter(f)}>{f}</button>)}
            </div>
            <div className="sv-list">
              {svFiltered.map(s=>(
                <div key={s.id} className={`sv-item ${data.style?.id===s.id?"on":""}`}
                  onClick={()=>setData(d=>({...d,style:s}))}>
                  <div className="sv-item-dot" style={{background:s.c[1]}}/>
                  <div className="sv-item-name">{s.name}</div>
                  <div className="sv-item-tag">{s.bg==="light"?"Light":"Dark"}</div>
                  <div className="sv-item-num">{String(STYLES.indexOf(s)+1).padStart(2,'0')}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="sv-preview">
            <iframe className="sv-iframe" src={`/previews/${activeStyle.txt}.html`} title={activeStyle.name} key={activeStyle.id}/>
            <div className="sv-info">
              <div className="sv-info-left"><b>{activeStyle.name}</b> — {activeStyle.desc}</div>
              <div className="sv-info-right">
                <div className="sv-nav-arrows">
                  <button className="sv-arrow" disabled={!prevS} onClick={()=>prevS&&setData(d=>({...d,style:prevS}))}>‹</button>
                  <button className="sv-arrow" disabled={!nextS} onClick={()=>nextS&&setData(d=>({...d,style:nextS}))}>›</button>
                </div>
                <button className="sv-btn sv-btn-ghost" onClick={()=>window.open(`/previews/${activeStyle.txt}.html`,'_blank')}>Abrir ↗</button>
              </div>
            </div>
          </div>
        </div>
      );

      // ── STEP 2: APARIENCIA ──
      case 2: return (
        <div className="sys-panel">
          <h2>Apariencia</h2>
          <p className="sub">Ajusta la paleta de colores y los efectos de fondo. "Del estilo" es lo recomendado.</p>

          <div className="cfg-section">
            <div className="cfg-label">Paleta de colores</div>
            <div className="ap-grid">
              {PALETTES.map(p=>(
                <div key={p.id} className={`ap-card ${data.palette?.id===p.id?"sel":""}`} onClick={()=>setData(d=>({...d,palette:p}))}>
                  <h5>{p.name}</h5>
                  {p.desc&&<p>{p.desc}</p>}
                  {p.colors&&<div className="ap-swatches">{p.colors.map((c,i)=><div key={i} className="ap-swatch" style={{background:c}}/>)}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="cfg-section">
            <div className="cfg-label">Efecto de fondo</div>
            <div className="ap-grid">
              {BACKGROUNDS.map(bg=>(
                <div key={bg.id} className={`ap-card ${data.background?.id===bg.id?"sel":""}`} onClick={()=>setData(d=>({...d,background:bg}))}>
                  <h5>{bg.name}</h5>
                  <p>{bg.type==="auto"?"Recomendado":bg.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

      // ── STEP 3: CONTENIDO ──
      case 3: return (
        <div className="sys-panel">
          <h2>Contenido</h2>
          <p className="sub">Escribe la información de cada sección. Si no tienes los datos aún, déjalo vacío — el prompt incluirá instrucciones para completarlo después.</p>

          <div className="ct-hint" style={{marginBottom:16,border:"1px solid var(--border-light)"}}>
            Copia y pega aquí los datos esenciales de tu negocio: nombre, propuesta de valor, servicios, precios, testimonios, y cualquier texto que quieras incluir en la landing.
          </div>

          {data.sections.map(s=>{const m=SMETA[s]||{l:s,h:""};return(
            <div key={s} className="ct-block">
              <div className="ct-block-h"><h4>{m.l}</h4><span>{m.h}</span></div>
              <textarea className="ct-ta" placeholder={`${m.l}: ${m.h}...`} value={data.content[s]||""}
                onChange={e=>setData(d=>({...d,content:{...d.content,[s]:e.target.value}}))}/>
            </div>
          );})}

          <div className="ct-block" style={{marginTop:20}}>
            <div className="ct-block-h"><h4>Redes Sociales</h4><span>URLs para el footer</span></div>
            <textarea className="ct-ta" placeholder="Instagram: https://instagram.com/...&#10;Facebook: https://facebook.com/..." 
              value={data.socials||""} onChange={e=>setData(d=>({...d,socials:e.target.value}))}/>
          </div>
        </div>
      );

      // ── STEP 4: EMBEDS + GENERAR ──
      case 4: {
        if (generated) return (
          <div className="sys-panel">
            <h2>Prompt listo</h2>
            <p className="sub">Copia y pega en tu IA favorita, o descarga como .txt</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
              {[data.objective?.name, data.style?.name, data.palette?.name, LANGUAGES.find(l=>l.id===data.language)?.name].filter(Boolean).map((t,i)=>(
                <span key={i} style={{fontFamily:"var(--mono)",fontSize:10,padding:"4px 10px",border:"1px solid var(--border-light)",textTransform:"uppercase",letterSpacing:".05em"}}>{t}</span>
              ))}
            </div>
            <div className="res-prompt">{prompt}</div>
            <div className="res-actions">
              <button className="res-btn res-btn-p" onClick={handleDownload}>Descargar .txt</button>
              <button className="res-btn res-btn-s" onClick={handleCopy}>{copied?"Copiado ✓":"Copiar"}</button>
            </div>
            <div className="res-ai">
              <div className="res-ai-label">Pega en tu IA</div>
              <div className="res-ai-grid">{AI_TOOLS.map(t=>(
                <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="res-ai-link">
                  <span>{t.icon}</span>{t.name}
                </a>
              ))}</div>
            </div>
            <div style={{marginTop:24,display:"flex",gap:8}}>
              <button className="res-btn res-btn-s" onClick={()=>{setGenerated(false);setStep(0);}}>← Nuevo prompt</button>
              <button className="res-btn res-btn-s" onClick={()=>setGenerated(false)}>Editar embeds</button>
            </div>
          </div>
        );

        const emb = data.sections.filter(s=>["hero","cta","registration","form","booking","contact","vsl","pricing","urgency"].includes(s));
        return (
          <div className="sys-panel">
            <h2>Embeds & Generar</h2>
            <p className="sub">Pega código HTML de GHL, Calendly, Typeform, etc. Es opcional — puedes generar sin embeds.</p>

            {emb.length>0 ? emb.map(s=>{const m=SMETA[s]||{l:s};return(
              <div key={s} className="ct-block">
                <div className="ct-block-h"><h4>{m.l}</h4><span>HTML/iframe del widget</span></div>
                <textarea className="ct-ta" style={{fontFamily:"var(--mono)",fontSize:11}} placeholder='<iframe src="..." ...></iframe>'
                  value={data.embeds[s]||""} onChange={e=>setData(d=>({...d,embeds:{...d.embeds,[s]:e.target.value}}))}/>
              </div>
            );}) : <div className="ct-hint">No hay secciones de embed disponibles. Puedes generar directamente.</div>}
          </div>
        );
      }
      default: return null;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="sys">
        <div className="sys-nav">
          <div className="sys-logo">Ninja<em>Prompts</em></div>
          <div className="sys-steps">
            {STEPS.map((s,i)=>(
              <div key={i} className={`sys-step ${i===step?"on":i<step?"done":""}`}
                onClick={()=>{if(i<step||(i<=step+1&&canNext()))setStep(i);}}>
                <span className="sys-step-n">{String(i+1).padStart(2,'0')}</span>{s}
              </div>
            ))}
          </div>
          <div className="sys-right">
            <button className="sys-exit" onClick={()=>{localStorage.removeItem("np_access");setView("landing");setGenerated(false);setStep(0);}}>Salir</button>
          </div>
        </div>

        <div className="sys-main">
          {renderStep()}
        </div>

        {step !== 1 && (
          <div className="sys-bottom">
            <button className="sys-bottom-btn sys-bottom-prev" disabled={step===0} onClick={()=>setStep(s=>s-1)}>← Anterior</button>
            <div className="sys-bottom-info">{step+1} / {STEPS.length}</div>
            {step<4?
              <button className="sys-bottom-btn sys-bottom-next" disabled={!canNext()} onClick={()=>setStep(s=>s+1)}>Siguiente →</button>
              :<button className="sys-bottom-btn sys-bottom-next" onClick={handleGenerate}>Generar prompt →</button>
            }
          </div>
        )}
        {step === 1 && (
          <div className="sys-bottom">
            <button className="sys-bottom-btn sys-bottom-prev" onClick={()=>setStep(0)}>← Anterior</button>
            <div className="sys-bottom-info">Selecciona un estilo para continuar</div>
            <button className="sys-bottom-btn sys-bottom-next" disabled={!data.style} onClick={()=>setStep(2)}>Usar {data.style?.name || "estilo"} →</button>
          </div>
        )}
      </div>
    </>
  );
}
