import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";


// ── Global styles ─────────────────────────────────────────────────────────────
function useGlobalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sora:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: #0a0010; }
      ::-webkit-scrollbar-thumb { background: #A855F7; border-radius: 4px; }
      @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      @keyframes grain-anim {
        0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)}
        20%{transform:translate(-5%,2%)} 30%{transform:translate(3%,-4%)}
        40%{transform:translate(-1%,6%)} 50%{transform:translate(4%,2%)}
        60%{transform:translate(-4%,-1%)} 70%{transform:translate(2%,5%)}
        80%{transform:translate(-2%,-2%)} 90%{transform:translate(4%,-3%)}
      }
      @keyframes float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
    `;
    document.head.appendChild(style);
  }, []);
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useGlobalStyles();
  return (
    <div style={{ fontFamily: "'Sora', system-ui, sans-serif" }}
      className="bg-[#08000f] text-white min-h-screen overflow-x-hidden relative">
      <GrainOverlay />
      <CustomCursor />
      <ScrollProgressBar />
      <Navbar />
      <Hero />
      <RunningBanner />
      <Stats />
      <Services />
      <Portfolio />
      <Testimonials />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}

// ── Grain overlay ─────────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none"
      style={{
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
        animation: "grain-anim 0.4s steps(1) infinite",
        mixBlendMode: "overlay",
      }} />
  );
}

// ── Custom cursor ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    const onOver = (e) => setHov(!!e.target.closest("a,button"));
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseover", onOver); };
  }, []);
  return (
    <>
      <motion.div className="fixed z-[999] pointer-events-none rounded-full"
        style={{ width: 8, height: 8, background: "#A855F7", top: 0, left: 0 }}
        animate={{ x: pos.x - 4, y: pos.y - 4, scale: hov ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 900, damping: 40, mass: 0.1 }} />
      <motion.div className="fixed z-[999] pointer-events-none rounded-full"
        style={{ width: 38, height: 38, border: "1px solid rgba(168,85,247,0.45)", top: 0, left: 0 }}
        animate={{ x: pos.x - 19, y: pos.y - 19, scale: hov ? 2 : 1, borderColor: hov ? "#A855F7" : "rgba(168,85,247,0.45)" }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }} />
    </>
  );
}

// ── Scroll progress ───────────────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div className="fixed top-0 left-0 right-0 z-[200] h-[2px] origin-left"
      style={{ scaleX, background: "linear-gradient(to right,#7C3AED,#A855F7,#D946EF)" }} />
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [["Home", "#hero"], ["Services", "#services"], ["Work", "#portfolio"], ["Pricing", "#pricing"], ["Contact", "#contact"]];
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[150] flex justify-between items-center px-6 transition-all duration-500 ${scrolled ? "py-3 bg-[#08000f]/90 backdrop-blur-xl border-b border-purple-900/30" : "py-6"}`}>
        <a href="#" style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          className="text-3xl tracking-wider bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
          DevCraft
        </a>
        <div className="hidden md:flex items-center gap-8">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="text-xs text-gray-400 hover:text-purple-400 transition-colors tracking-[0.25em] uppercase">{l}</a>
          ))}
          <motion.a href="#contact" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="px-5 py-2.5 text-xs font-bold tracking-[0.2em] uppercase rounded-full text-white"
            style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>
            Start Project
          </motion.a>
        </div>
        <button className="md:hidden flex flex-col gap-1.5 p-1 z-[160]" onClick={() => setMenuOpen(!menuOpen)}>
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }} className="block w-6 h-[2px] bg-purple-400 origin-center" />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="block w-6 h-[2px] bg-purple-400" />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }} className="block w-6 h-[2px] bg-purple-400 origin-center" />
        </button>
      </nav>
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[140] bg-[#08000f] flex flex-col items-center justify-center gap-8 md:hidden">
            {links.map(([l, h]) => (
              <a key={l} href={h} onClick={() => setMenuOpen(false)}
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                className="text-6xl text-white hover:text-purple-400 transition-colors tracking-wider">{l}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)}
              className="mt-4 px-8 py-3 rounded-full text-white font-bold text-sm tracking-widest uppercase"
              style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>
              Start Project
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const words = ["We", "Design", "Dreams."];
  return (
    <div ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6">
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "radial-gradient(circle, #A855F7 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(217,70,239,0.15) 0%, transparent 70%)", filter: "blur(70px)" }} />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-purple-400 text-xs tracking-[0.5em] uppercase mb-8 font-medium flex items-center gap-3">
          <span className="inline-block w-8 h-[1px] bg-purple-500" /> Premium Web Studio · Est. 2020
        </motion.p>

        {words.map((word, i) => (
          <div key={i} className="overflow-hidden">
            <motion.div
              initial={{ y: "110%" }} animate={{ y: "0%" }}
              transition={{ duration: 1, delay: 0.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(58px,10vw,155px)", lineHeight: 0.9 }}
              className="block leading-none text-white">
              {i === 2
                ? <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">Dreams.</span>
                : word}
            </motion.div>
          </div>
        ))}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="text-gray-500 max-w-md text-sm leading-relaxed mt-8 mb-10">
          We craft ultra-modern digital experiences — weddings, birthdays, businesses & beyond — that convert visitors into loyal clients.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="flex flex-wrap gap-4">
          <motion.a href="#contact" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="px-7 py-3.5 text-white text-xs font-bold tracking-[0.25em] uppercase rounded-full shadow-lg shadow-purple-900/40"
            style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>
            Start Project →
          </motion.a>
          <motion.a href="#portfolio" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className="px-7 py-3.5 border border-purple-700/40 text-purple-300 text-xs font-medium tracking-[0.25em] uppercase rounded-full hover:border-purple-500 transition-colors">
            View Work
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] text-gray-700 tracking-[0.4em] uppercase">Scroll</span>
        <motion.div animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent origin-top" />
      </motion.div>
    </div>
  );
}

// ── Running banner ────────────────────────────────────────────────────────────
function RunningBanner() {
  const items = ["Business Websites", "Wedding Sites", "Birthday Pages", "Event Portals", "E-commerce", "Portfolios", "Anniversary Sites", "Corporate Pages"];
  const doubled = [...items, ...items];
  return (
    <div className="py-4 overflow-hidden" style={{ background: "linear-gradient(135deg,#7C3AED,#A855F7)" }}>
      <div className="flex gap-10 whitespace-nowrap" style={{ animation: "marquee-scroll 24s linear infinite" }}>
        {doubled.map((item, i) => (
          <span key={i} className="text-white font-bold text-xs tracking-[0.3em] uppercase flex items-center gap-10 shrink-0">
            {item} <span className="opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function Counter({ end, suffix, label }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const inc = end / 80;
    const t = setInterval(() => {
      v += inc;
      if (v >= end) { setVal(end); clearInterval(t); } else setVal(Math.floor(v));
    }, 18);
    return () => clearInterval(t);
  }, [inView, end]);
  return (
    <div ref={ref} className="text-center p-6 rounded-2xl border border-purple-900/30 bg-purple-950/10">
      <div style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        className="text-6xl bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
        {val}{suffix}
      </div>
      <div className="text-gray-600 text-[10px] tracking-[0.35em] uppercase mt-2">{label}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-20 px-6">
      <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto">
        <Counter end={120} suffix="+" label="Projects Delivered" />
        <Counter end={94} suffix="%" label="Client Satisfaction" />
        <Counter end={5} suffix="★" label="Average Rating" />
        <Counter end={6} suffix="+" label="Years Experience" />
      </div>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { num: "01", icon: "🏢", title: "Business Websites", desc: "Professional corporate presence that commands authority and trust — built for speed, designed for conversion.", tags: ["Next.js", "Webflow", "CMS"] },
  { num: "02", icon: "💍", title: "Wedding Websites", desc: "Elegant, romantic digital experiences to celebrate your special day — RSVP, gallery, schedule and more.", tags: ["Elegant", "RSVP", "Gallery"] },
  { num: "03", icon: "🎂", title: "Birthday Websites", desc: "Fun, vibrant birthday pages with invitations, countdowns, photo galleries and event details.", tags: ["Invitations", "Countdown", "Fun"] },
  { num: "04", icon: "🎪", title: "Event Websites", desc: "High-impact event pages for concerts, launches, conferences and parties with ticketing and schedules.", tags: ["Ticketing", "Schedule", "Live"] },
  { num: "05", icon: "🛒", title: "E-commerce Stores", desc: "High-converting online stores with seamless checkout experiences that maximize revenue.", tags: ["Shopify", "WooCommerce", "Custom"] },
  { num: "06", icon: "🖼️", title: "Portfolio Design", desc: "Standout personal sites for creatives and professionals that make a lasting impression.", tags: ["Creative", "Animation", "CMS"] },
];

function Services() {
  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-purple-400 text-[10px] tracking-[0.5em] uppercase mb-3">What We Do</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl md:text-7xl leading-none">Our Services</h2>
        </div>
        <div className="divide-y divide-purple-900/20">
          {SERVICES.map((s, i) => <ServiceRow key={i} s={s} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceRow({ s, i }) {
  const [hov, setHov] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.07 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex items-center justify-between py-6 cursor-pointer">
      <div className="flex items-start gap-5 flex-1 min-w-0">
        <span className="text-2xl shrink-0">{s.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-purple-800 font-mono text-[10px] shrink-0">{s.num}</span>
            <h3 className={`text-base font-semibold transition-colors duration-300 ${hov ? "text-purple-400" : "text-white"}`}>{s.title}</h3>
          </div>
          <AnimatePresence>
            {hov && (
              <motion.p initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 6 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }} className="text-gray-500 text-sm overflow-hidden leading-relaxed">
                {s.desc}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <div className="flex gap-1.5 flex-wrap justify-end">
          {s.tags.map(t => (
            <span key={t} className="text-[9px] px-2.5 py-1 border border-purple-900/40 text-purple-700 rounded-full tracking-wide">{t}</span>
          ))}
        </div>
        <motion.span animate={{ x: hov ? 5 : 0 }} className="text-purple-400 text-lg">→</motion.span>
      </div>
    </motion.div>
  );
}

// ── Portfolio ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  { title: "Royal Wedding Co.", cat: "Wedding Website", year: "2025", grad: "from-pink-500/20 to-rose-500/10", icon: "💍" },
  { title: "Aisha's Sweet 16", cat: "Birthday Website", year: "2025", grad: "from-purple-500/20 to-fuchsia-500/10", icon: "🎂" },
  { title: "Luminary Brand", cat: "Business Website", year: "2025", grad: "from-violet-500/20 to-purple-500/10", icon: "🏢" },
  { title: "NovaMart Store", cat: "E-commerce Store", year: "2024", grad: "from-indigo-500/20 to-blue-500/10", icon: "🛒" },
  { title: "TechConf 2025", cat: "Event Website", year: "2024", grad: "from-fuchsia-500/20 to-pink-500/10", icon: "🎪" },
  { title: "Alex Creative", cat: "Portfolio Design", year: "2024", grad: "from-purple-600/20 to-violet-500/10", icon: "🖼️" },
];
const CATS = ["All", "Wedding Website", "Birthday Website", "Business Website", "E-commerce Store", "Event Website"];

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.cat === filter);
  return (
    <section id="portfolio" className="py-20 px-6 bg-purple-950/10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <p className="text-purple-400 text-[10px] tracking-[0.5em] uppercase mb-3">Selected Work</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl md:text-7xl leading-none mb-8">Our Projects</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {CATS.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase rounded-full transition-all duration-300 ${filter === c ? "text-white font-bold" : "border border-purple-900/30 text-purple-600 hover:border-purple-500/50 hover:text-purple-400"}`}
                style={filter === c ? { background: "linear-gradient(135deg,#7C3AED,#A855F7)" } : {}}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function ProjectCard({ p, i }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div layout
      initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93 }} transition={{ duration: 0.35, delay: i * 0.05 }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="relative overflow-hidden rounded-2xl cursor-pointer border border-purple-900/20"
      style={{ aspectRatio: "4/3" }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${p.grad} transition-all duration-500 ${hov ? "opacity-100" : "opacity-60"}`} />
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "linear-gradient(rgba(168,85,247,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,0.3) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute inset-5 bg-[#0a0015]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/30">
        <div className="h-7 bg-[#120020] flex items-center px-3 gap-1.5 border-b border-purple-900/20">
          {["#ef4444","#eab308","#22c55e"].map(c => <div key={c} style={{ background: c }} className="w-2 h-2 rounded-full opacity-50" />)}
          <div className="flex-1 mx-3 h-3 rounded-sm bg-purple-900/30" />
        </div>
        <div className="p-4 flex flex-col items-center justify-center h-[calc(100%-28px)] gap-3">
          <span className="text-4xl" style={{ animation: "float 3s ease-in-out infinite" }}>{p.icon}</span>
          <div className="space-y-1.5 w-full">
            <div className="h-2 bg-purple-500/20 rounded w-3/4 mx-auto" />
            <div className="h-2 bg-purple-500/10 rounded w-full" />
            <div className="h-2 bg-purple-500/10 rounded w-2/3 mx-auto" />
          </div>
          <div className="h-5 rounded-full w-24 bg-purple-500/30" />
        </div>
      </div>
      <motion.div animate={{ opacity: hov ? 1 : 0 }} transition={{ duration: 0.25 }}
        className="absolute inset-0 rounded-2xl flex flex-col justify-end p-5 z-10"
        style={{ background: "linear-gradient(to top,rgba(10,0,20,0.95) 0%,rgba(10,0,20,0.5) 60%,transparent 100%)" }}>
        <span className="text-purple-400 text-[10px] tracking-[0.4em] uppercase mb-1">{p.cat}</span>
        <h3 className="text-white text-lg font-semibold mb-1">{p.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-xs">{p.year}</span>
          <span className="text-purple-400 text-sm">View →</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Rohan Mehta", role: "CEO, Luminary Brand", text: "DevCraft delivered a website that exceeded every expectation. The attention to detail and speed of delivery was remarkable. Best investment we've made.", avatar: "👨‍💼" },
  { name: "Sneha & Arjun", role: "Wedding Clients", text: "Our wedding website was absolutely magical! Guests loved the RSVP feature and the gallery looked stunning. Got so many compliments!", avatar: "💑" },
  { name: "Priya Sharma", role: "Birthday Party Host", text: "The birthday countdown page was a huge hit! Everyone was talking about how beautiful and unique it was. Will definitely use again!", avatar: "🎂" },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);
  const cur = TESTIMONIALS[active];
  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-purple-400 text-[10px] tracking-[0.5em] uppercase mb-3">Client Voices</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl md:text-7xl leading-none mb-14">What They Say</h2>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <div className="text-5xl mb-5">{cur.avatar}</div>
            <div className="flex justify-center gap-1 mb-6">
              {"★★★★★".split("").map((s, i) => <span key={i} className="text-purple-400 text-lg">{s}</span>)}
            </div>
            <p className="text-lg text-gray-300 leading-relaxed mb-8 font-light italic">"{cur.text}"</p>
            <p className="text-white font-semibold">{cur.name}</p>
            <p className="text-purple-600 text-xs tracking-wider mt-1">{cur.role}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`h-[2px] rounded-full transition-all duration-500 ${i === active ? "w-10 bg-purple-400" : "w-4 bg-purple-900 hover:bg-purple-700"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
const PLANS = [
  { name: "Starter", monthly: "₹4,999", annual: "₹3,999", desc: "Perfect for events, birthdays & small projects.", highlight: false, features: ["3–5 page website", "Mobile responsive", "Contact / RSVP form", "1 month support", "Basic SEO"] },
  { name: "Pro", monthly: "₹9,999", annual: "₹7,999", desc: "Ideal for weddings, businesses & growing brands.", highlight: true, features: ["Up to 15 pages", "Custom animations", "Gallery + Media", "3 months support", "Advanced SEO", "Analytics setup"] },
  { name: "Enterprise", monthly: "₹19,999", annual: "₹15,999", desc: "Full-scale stores, platforms & complex projects.", highlight: false, features: ["Unlimited pages", "E-commerce ready", "CMS integration", "6 months support", "Priority delivery", "Dedicated manager"] },
];

function Pricing() {
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" className="py-20 px-6 bg-purple-950/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-purple-400 text-[10px] tracking-[0.5em] uppercase mb-3">Investment</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl md:text-7xl leading-none mb-8">Pricing Plans</h2>
          <div className="inline-flex border border-purple-900/40 p-1 rounded-full">
            {[["Monthly", false], ["Annual · Save 20%", true]].map(([label, val]) => (
              <button key={String(val)} onClick={() => setAnnual(val)}
                className={`px-5 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 ${annual === val ? "text-white font-bold" : "text-purple-600 hover:text-purple-400"}`}
                style={annual === val ? { background: "linear-gradient(135deg,#7C3AED,#A855F7)" } : {}}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLANS.map((p, i) => (
            <motion.div key={i} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`relative p-7 rounded-2xl overflow-hidden ${p.highlight ? "text-white" : "border border-purple-900/25 bg-purple-950/10"}`}
              style={p.highlight ? { background: "linear-gradient(135deg,#6D28D9,#A855F7,#D946EF)" } : {}}>
              {p.highlight && (
                <span className="absolute top-4 right-4 bg-white/20 text-white text-[9px] px-3 py-1 rounded-full tracking-widest uppercase">Popular</span>
              )}
              <h3 className={`text-xs font-bold tracking-[0.3em] uppercase mb-1.5 ${p.highlight ? "text-white/70" : "text-purple-600"}`}>{p.name}</h3>
              <AnimatePresence mode="wait">
                <motion.div key={annual ? "a" : "m"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }} className="text-5xl mb-1">
                  {annual ? p.annual : p.monthly}
                </motion.div>
              </AnimatePresence>
              <p className={`text-xs mb-7 leading-relaxed ${p.highlight ? "text-white/60" : "text-gray-600"}`}>{p.desc}</p>
              <ul className="space-y-3 mb-8">
                {p.features.map(f => (
                  <li key={f} className={`text-sm flex items-center gap-2.5 ${p.highlight ? "text-white/90" : "text-gray-400"}`}>
                    <span className={`text-xs ${p.highlight ? "text-white" : "text-purple-400"}`}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`w-full py-3 text-xs font-bold tracking-[0.25em] uppercase rounded-full transition-all duration-300 ${p.highlight ? "bg-white text-purple-700 hover:bg-purple-50" : "border border-purple-700/50 text-purple-400 hover:bg-purple-900/30"}`}>
                Get Started →
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "",
    budget: ""
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputCls =
    "w-full bg-transparent border-b border-purple-900/40 py-4 text-white placeholder:text-gray-700 text-sm outline-none focus:border-purple-500 transition-colors duration-300";

  const handleSubmit = async () => {
    setError("");

    if (!form.name || !form.email) {
      setError("Please fill required fields");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: `Type: ${form.type}, Budget: ${form.budget}`,
        }),
      });

      const data = await res.json().catch(() => ({}));

      console.log("Backend response:", data);

      if (!res.ok) {
        throw new Error(data.detail || data.message || "Server error");
      }

      setSent(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        type: "",
        budget: ""
      });

    } catch (err) {
      console.error("CONTACT ERROR:", err);
      setError(err.message || "Error sending message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* LEFT SIDE */}
        <div>
          <p className="text-purple-400 text-[10px] tracking-[0.5em] uppercase mb-3">
            Get In Touch
          </p>

          <h2
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            className="text-5xl md:text-7xl leading-none mb-5"
          >
            Let's Build<br />Something.
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed mb-10">
            Whether it's a wedding, birthday, or business — tell us your vision and we'll craft it into reality.
          </p>

          {error && (
            <p className="text-red-400 text-sm mb-4">
              ⚠️ {error}
            </p>
          )}

          <div className="space-y-6">

            

            {[
              ["Email", "devcraft.jr@gmail.com"],
              ["Phone", "+91 9941827228"],
              ["Location", "Chennai, India"],
            ].map(([l, v]) => (

              <div key={l}>
                <p className="text-[10px] text-purple-800 tracking-[0.4em] uppercase mb-1">
                  {l}
                </p>
                <p className="text-gray-300 text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE  */}
        <div className="bg-purple-950/20 rounded-2xl border border-purple-900/25 p-7">

          {sent ? (
            <div className="min-h-[340px] flex flex-col items-center justify-center text-center gap-4">
              <div className="text-6xl">✨</div>

              <h3
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                className="text-4xl bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text"
              >
                Message Sent!
              </h3>

              <p className="text-gray-500 text-sm">
                We'll respond within 24 hours.
              </p>

              <button
                onClick={() => setSent(false)}
                className="mt-4 text-purple-400 text-sm underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="space-y-5">

              <input
                placeholder="Full Name *"
                value={form.name}
                onChange={set("name")}
                className={inputCls}
              />

              <input
                placeholder="Phone Number *"
                value={form.phone}
                onChange={set("phone")}
                className={inputCls}
              />

              <input
                placeholder="Email Address *"
                value={form.email}
                onChange={set("email")}
                className={inputCls}
              />

              <select
                value={form.type}
                onChange={set("type")}
                className={`${inputCls} bg-transparent`}
              >
                <option value="">Project Type</option>
                {[
                  "Business Website",
                  "Wedding Website",
                  "Birthday Website",
                  "Event Website",
                  "E-commerce",
                  "Portfolio",
                ].map((o) => (
                  <option key={o} value={o} className="bg-[#08000f]">{o}</option>
                ))}
              </select>

              <select
                value={form.budget}
                onChange={set("budget")}
                className={`${inputCls} bg-transparent`}
              >
                <option value="">Budget Range</option>
                {[
                  "Under ₹5,000",
                  "₹5,000 – ₹10,000",
                  "₹10,000 – ₹20,000",
                  "₹20,000+",
                ].map((o) => (
                  <option key={o} value={o} className="bg-[#08000f]">{o}</option>
                ))}
              </select>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 text-white text-xs font-bold tracking-[0.3em] uppercase rounded-full mt-2 shadow-lg shadow-purple-900/40"
                style={{
                  background: "linear-gradient(135deg,#7C3AED,#A855F7)",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer"
                }}
              >
                {loading ? "Sending..." : "Send Message →"}
              </button>

              <p className="text-purple-900 text-xs text-center">
                No spam. We only reply about your project.
              </p>

            </div>
          )}
        </div>
      </div>
    </section>
  );
}
// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-purple-900/25 px-6 pt-12 pb-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              className="text-5xl bg-gradient-to-r from-purple-400 to-fuchsia-400 text-transparent bg-clip-text mb-1">
              DevCraft
            </h2>
            <p className="text-purple-900 text-xs tracking-wider">Future Web Studio · Mumbai, India</p>
          </div>
          <div className="flex gap-12 flex-wrap">
            <div>
              <p className="text-purple-900 text-[10px] tracking-[0.4em] uppercase mb-3">Navigation</p>
              <div className="flex flex-col gap-2">
                {[["Services","#services"],["Work","#portfolio"],["Pricing","#pricing"],["Contact","#contact"]].map(([l,h]) => (
                  <a key={l} href={h} className="text-gray-600 text-sm hover:text-purple-400 transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-purple-900 text-[10px] tracking-[0.4em] uppercase mb-3">Services</p>
              <div className="flex flex-col gap-2">
                {["Business Sites","Wedding Sites","Birthday Pages","Event Pages","E-commerce"].map(s => (
                  <span key={s} className="text-gray-600 text-sm">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-purple-900 text-[10px] tracking-[0.4em] uppercase mb-3">Social</p>
              <div className="flex flex-col gap-2">
                {["Instagram","Twitter","Behance"].map(s => (
                  <a key={s} href="https://www.instagram.com/webstudio.jr/" className="text-gray-600 text-sm hover:text-purple-400 transition-colors">{s}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-purple-900/20 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-purple-900 text-xs">© 2026 DevCraft. All rights reserved.</span>
          <span className="text-purple-900 text-xs">Crafted with ✦ in India</span>
        </div>
      </div>
    </footer>
  );
}
