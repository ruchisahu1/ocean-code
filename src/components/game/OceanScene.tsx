import { useMemo } from "react";
import { motion } from "framer-motion";

/* ── SVG Fish component ─────────────────────────────────────────── */
const SvgFish = ({ color, accentColor, size }: { color: string; accentColor: string; size: number }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 60 33" fill="none">
    {/* body */}
    <ellipse cx="28" cy="16" rx="20" ry="12" fill={color} />
    {/* tail */}
    <path d="M48 16 L60 4 L60 28 Z" fill={accentColor} className="animate-tail-flick origin-left" />
    {/* eye */}
    <circle cx="16" cy="13" r="3" fill="#fff" />
    <circle cx="15" cy="12.5" r="1.5" fill="#111" />
    {/* fin */}
    <path d="M26 4 Q30 0 34 6" stroke={accentColor} strokeWidth="2" fill="none" />
    {/* gill line */}
    <path d="M22 10 Q20 16 22 22" stroke={accentColor} strokeWidth="1" fill="none" opacity="0.5" />
  </svg>
);

/* ── Seaweed strand ─────────────────────────────────────────────── */
const Seaweed = ({ left, height, delay }: { left: string; height: number; delay: number }) => (
  <div
    className="absolute bottom-0 animate-sway"
    style={{ left, animationDelay: `${delay}s`, transformOrigin: "bottom center" }}
  >
    <svg width="18" height={height} viewBox={`0 0 18 ${height}`} fill="none">
      <path
        d={`M9 ${height} Q2 ${height * 0.7} 12 ${height * 0.5} Q4 ${height * 0.3} 10 ${height * 0.15} Q7 ${height * 0.05} 9 0`}
        stroke="#34d278"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <path
        d={`M9 ${height} Q14 ${height * 0.65} 6 ${height * 0.45} Q13 ${height * 0.25} 8 ${height * 0.1} Q9 ${height * 0.02} 9 0`}
        stroke="#5ee89a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  </div>
);

/** Animated underwater scene background with SVG fish, caustics, seabed, waves */
const OceanScene = () => {
  /* ── fish data ──────────────────────────────────────────────── */
  const fish = useMemo(
    () => [
      { id: 0, y: 15, size: 38, duration: 14, delay: 0, flip: false, color: "#FFD93D", accent: "#F0A500" },
      { id: 1, y: 30, size: 28, duration: 18, delay: 4, flip: true, color: "#FF6B6B", accent: "#C23B22" },
      { id: 2, y: 55, size: 34, duration: 11, delay: 2, flip: false, color: "#4ECDC4", accent: "#2BA89E" },
      { id: 3, y: 70, size: 26, duration: 16, delay: 7, flip: true, color: "#FF9A3C", accent: "#D46A00" },
      { id: 4, y: 42, size: 32, duration: 20, delay: 10, flip: false, color: "#A8E6CF", accent: "#56C596" },
      { id: 5, y: 82, size: 22, duration: 13, delay: 5, flip: true, color: "#FFE66D", accent: "#C4A500" },
      { id: 6, y: 22, size: 20, duration: 22, delay: 12, flip: false, color: "#FC5C7D", accent: "#B5304A" },
      { id: 7, y: 65, size: 30, duration: 15, delay: 8, flip: true, color: "#45E0A7", accent: "#1DB87E" },
    ],
    []
  );

  /* ── plankton particles ─────────────────────────────────────── */
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        duration: 5 + Math.random() * 7,
        delay: Math.random() * 6,
      })),
    []
  );

  /* ── bubble data ────────────────────────────────────────────── */
  const bubbles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: 8 + Math.random() * 84,
        size: 5 + Math.random() * 12,
        duration: 7 + Math.random() * 9,
        delay: Math.random() * 12,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* ── Base water gradient (the ocean color!) ─────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #0a5e7a 0%, #0c4a6e 15%, #0e3d5e 35%, #0a2e4a 55%, #071e34 80%, #051525 100%)",
        }}
      />

      {/* ── Animated water color shift ─────────────────────────── */}
      <div
        className="absolute inset-0 animate-water-caustics opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 300px 200px at 20% 25%, rgba(0,180,220,0.5), transparent)," +
            "radial-gradient(ellipse 250px 250px at 65% 45%, rgba(0,160,200,0.4), transparent)," +
            "radial-gradient(ellipse 350px 150px at 80% 15%, rgba(20,140,190,0.35), transparent)," +
            "radial-gradient(ellipse 200px 200px at 35% 75%, rgba(0,120,180,0.3), transparent)," +
            "radial-gradient(ellipse 280px 180px at 70% 65%, rgba(10,160,170,0.35), transparent)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* ── Second caustics layer (brighter, slower) ───────────── */}
      <div
        className="absolute inset-0 animate-water-caustics-alt opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 220px 160px at 45% 35%, rgba(40,200,230,0.5), transparent)," +
            "radial-gradient(ellipse 180px 220px at 20% 65%, rgba(20,170,210,0.4), transparent)," +
            "radial-gradient(ellipse 260px 120px at 75% 30%, rgba(60,190,220,0.4), transparent)",
          backgroundSize: "250% 250%",
        }}
      />

      {/* ── Light rays from surface (much more visible) ────────── */}
      <div className="absolute top-0 left-[10%] w-48 h-[70%] opacity-[0.18] bg-gradient-to-b from-cyan-200 via-cyan-400/20 to-transparent rotate-[8deg] blur-lg animate-ray-drift" />
      <div className="absolute top-0 right-[20%] w-36 h-[65%] opacity-[0.14] bg-gradient-to-b from-sky-200 via-sky-400/15 to-transparent -rotate-[5deg] blur-lg animate-ray-drift-slow" />
      <div className="absolute top-0 left-[45%] w-32 h-[60%] opacity-[0.20] bg-gradient-to-b from-cyan-100 via-cyan-300/20 to-transparent rotate-[3deg] blur-xl animate-ray-drift" style={{ animationDelay: "3s" }} />
      <div className="absolute top-0 left-[70%] w-28 h-[55%] opacity-[0.12] bg-gradient-to-b from-teal-200 via-teal-400/15 to-transparent -rotate-[10deg] blur-xl animate-ray-drift-slow" style={{ animationDelay: "5s" }} />
      <div className="absolute top-0 left-[30%] w-24 h-[50%] opacity-[0.10] bg-gradient-to-b from-blue-200 via-blue-300/10 to-transparent rotate-[12deg] blur-xl animate-ray-drift" style={{ animationDelay: "7s" }} />

      {/* ── Wave layer at top ──────────────────────────────────── */}
      <div className="absolute top-0 left-0 w-[200%] h-16 animate-wave-drift">
        <svg viewBox="0 0 1200 50" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 25 Q150 5 300 25 T600 25 T900 25 T1200 25 V50 H0 Z" fill="rgba(20,140,180,0.35)" />
          <path d="M0 32 Q150 15 300 32 T600 32 T900 32 T1200 32 V50 H0 Z" fill="rgba(15,120,160,0.25)" />
          <path d="M0 18 Q100 8 200 18 T400 18 T600 18 T800 18 T1000 18 T1200 18 V0 H0 Z" fill="rgba(30,160,200,0.2)" />
        </svg>
      </div>
      {/* second wave layer offset */}
      <div className="absolute top-0 left-[-50%] w-[200%] h-14 animate-wave-drift" style={{ animationDuration: "12s" }}>
        <svg viewBox="0 0 1200 45" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 22 Q180 8 360 22 T720 22 T1080 22 T1200 22 V45 H0 Z" fill="rgba(25,150,190,0.2)" />
        </svg>
      </div>

      {/* ── Floating plankton particles ────────────────────────── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: "rgba(180,235,255,0.7)",
            boxShadow: "0 0 3px rgba(150,220,255,0.4)",
          }}
          animate={{
            y: [0, -25, 8, -15, 0],
            x: [0, 10, -6, 4, 0],
            opacity: [0.3, 0.7, 0.4, 0.8, 0.3],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* ── SVG fish swimming across ───────────────────────────── */}
      {fish.map((f) => (
        <motion.div
          key={f.id}
          className="absolute"
          style={{
            top: `${f.y}%`,
            transform: f.flip ? "scaleX(-1)" : undefined,
            filter: `drop-shadow(0 0 8px ${f.color}88)`,
          }}
          animate={{ x: f.flip ? ["110vw", "-10vw"] : ["-10vw", "110vw"] }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: "linear" }}
        >
          <SvgFish color={f.color} accentColor={f.accent} size={f.size} />
        </motion.div>
      ))}

      {/* ── Bubbles rising (brighter) ──────────────────────────── */}
      {bubbles.map((b) => (
        <motion.div
          key={`b-${b.id}`}
          className="absolute rounded-full"
          style={{
            left: `${b.left}%`,
            bottom: 0,
            width: b.size,
            height: b.size,
            border: "1.5px solid rgba(200,240,255,0.5)",
            background: "radial-gradient(circle at 30% 30%, rgba(220,250,255,0.3), rgba(150,220,255,0.05))",
            boxShadow: "inset 0 -2px 4px rgba(255,255,255,0.1), 0 0 6px rgba(150,220,255,0.15)",
          }}
          animate={{ y: [0, -700 - Math.random() * 300], opacity: [0.7, 0] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* ── Seabed ─────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full h-24">
        {/* sand gradient */}
        <div
          className="absolute bottom-0 w-full h-20"
          style={{
            background: "linear-gradient(to top, #1a3a2a 0%, #143828 30%, #0e2e22 60%, transparent 100%)",
          }}
        />
        {/* sandy bumps */}
        <div className="absolute bottom-0 w-full h-10 opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 50px 14px at 10% 85%, #2a5a3a, transparent)," +
              "radial-gradient(ellipse 60px 16px at 30% 80%, #1e4a2e, transparent)," +
              "radial-gradient(ellipse 40px 12px at 55% 88%, #2a5a3a, transparent)," +
              "radial-gradient(ellipse 55px 14px at 75% 82%, #1e4a2e, transparent)," +
              "radial-gradient(ellipse 45px 13px at 92% 86%, #2a5a3a, transparent)",
          }}
        />
        {/* small coral accents */}
        <svg className="absolute bottom-2 left-[12%] opacity-70" width="24" height="20" viewBox="0 0 24 20" fill="none">
          <path d="M12 20 L8 8 Q6 2 10 4 L12 0 L14 4 Q18 2 16 8 Z" fill="#c45a6a" />
        </svg>
        <svg className="absolute bottom-2 left-[45%] opacity-60" width="20" height="16" viewBox="0 0 20 16" fill="none">
          <path d="M10 16 L6 6 Q4 0 10 2 Q16 0 14 6 Z" fill="#b45a7a" />
        </svg>
        <svg className="absolute bottom-2 right-[18%] opacity-65" width="22" height="18" viewBox="0 0 22 18" fill="none">
          <path d="M11 18 L7 7 Q5 1 11 3 Q17 1 15 7 Z" fill="#c46a5a" />
        </svg>
        <svg className="absolute bottom-1 left-[65%] opacity-55" width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path d="M9 14 L5 5 Q3 0 9 2 Q15 0 13 5 Z" fill="#a55a6a" />
        </svg>
      </div>

      {/* ── Seaweed ────────────────────────────────────────────── */}
      <Seaweed left="8%" height={75} delay={0} />
      <Seaweed left="22%" height={58} delay={0.8} />
      <Seaweed left="38%" height={68} delay={1.5} />
      <Seaweed left="52%" height={52} delay={0.3} />
      <Seaweed left="67%" height={62} delay={2.0} />
      <Seaweed left="82%" height={76} delay={1.2} />
      <Seaweed left="93%" height={50} delay={0.6} />

      {/* ── Very subtle vignette (just edges, not heavy) ────────── */}
      <div className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(5,15,30,0.35) 100%)",
        }}
      />
    </div>
  );
};

export default OceanScene;
