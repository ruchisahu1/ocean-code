import { useMemo } from "react";
import { motion } from "framer-motion";

/* ── SVG Stalactite — hangs from ceiling ───────────────────────── */
const Stalactite = ({
  left,
  width,
  height,
  delay,
}: {
  left: string;
  width: number;
  height: number;
  delay: number;
}) => (
  <div className="absolute top-0" style={{ left }}>
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path
        d={`M0 0 L${width} 0 L${width * 0.6} ${height * 0.7} Q${width * 0.5} ${height} ${width * 0.5} ${height} Q${width * 0.5} ${height} ${width * 0.4} ${height * 0.7} Z`}
        fill="url(#stalGrad)"
        opacity="0.7"
      />
      <defs>
        <linearGradient id="stalGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a2535" />
          <stop offset="100%" stopColor="#1a1525" />
        </linearGradient>
      </defs>
    </svg>
    {/* drip from tip */}
    <motion.div
      className="absolute rounded-full"
      style={{
        left: width * 0.5 - 1.5,
        top: height - 2,
        width: 3,
        height: 6,
        borderRadius: "0 0 3px 3px",
        background: "linear-gradient(to bottom, rgba(120,160,200,0.4), rgba(100,150,200,0.6))",
      }}
      animate={{ y: [0, 300], opacity: [0.6, 0], scaleY: [1, 0.3] }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeIn",
      }}
    />
  </div>
);

/* ── SVG Stalagmite — rises from floor ─────────────────────────── */
const Stalagmite = ({
  left,
  width,
  height,
}: {
  left: string;
  width: number;
  height: number;
}) => (
  <div className="absolute bottom-0" style={{ left }}>
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <path
        d={`M0 ${height} L${width} ${height} L${width * 0.6} ${height * 0.3} Q${width * 0.5} 0 ${width * 0.5} 0 Q${width * 0.5} 0 ${width * 0.4} ${height * 0.3} Z`}
        fill="#1e1a28"
        opacity="0.65"
      />
    </svg>
  </div>
);

/* ── Crystal formation — glowing gem cluster ───────────────────── */
const Crystal = ({
  x,
  y,
  size,
  hue,
}: {
  x: string;
  y: string;
  size: number;
  hue: string;
}) => (
  <div className="absolute" style={{ left: x, top: y }}>
    <svg width={size} height={size * 1.5} viewBox="0 0 20 30" fill="none">
      {/* main crystal shard */}
      <path d="M10 0 L14 12 L12 28 L8 28 L6 12 Z" fill={hue} opacity="0.7" />
      {/* left shard */}
      <path d="M4 8 L8 14 L6 24 L3 24 L2 14 Z" fill={hue} opacity="0.5" />
      {/* right shard */}
      <path d="M16 6 L18 16 L16 26 L14 26 L13 14 Z" fill={hue} opacity="0.5" />
      {/* highlight */}
      <path d="M10 2 L11 10 L9 10 Z" fill="white" opacity="0.15" />
    </svg>
    {/* glow */}
    <div
      className="absolute animate-crystal-pulse"
      style={{
        left: -size * 0.5,
        top: -size * 0.3,
        width: size * 2,
        height: size * 2.5,
        background: `radial-gradient(circle, ${hue}30 0%, ${hue}08 50%, transparent 70%)`,
      }}
    />
  </div>
);

/** Animated deep-sea cave background */
const CaveScene = () => {
  /* ── bioluminescent particles ────────────────────────────────── */
  const bioParticles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 8,
        color: Math.random() > 0.5 ? "rgba(140,120,220,0.6)" : "rgba(80,200,200,0.5)",
      })),
    []
  );

  /* ── extra water drips ──────────────────────────────────────── */
  const drips = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: 15 + Math.random() * 70,
        duration: 3.5 + Math.random() * 3,
        delay: Math.random() * 5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* ── Base gradient — deep purple/blue cave interior ──── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0a0812 0%, #0d0a18 15%, #100c1e 35%, #0c0e1a 55%, #080a14 80%, #060810 100%)",
        }}
      />

      {/* ── Rocky wall texture (subtle horizontal layers) ──── */}
      <div className="absolute inset-0 opacity-20">
        {[10, 22, 34, 46, 58, 70, 82, 94].map((top) => (
          <div
            key={top}
            className="absolute left-0 w-full"
            style={{
              top: `${top}%`,
              height: "1px",
              background: `linear-gradient(90deg, transparent 3%, rgba(60,50,80,0.5) 15%, rgba(50,40,70,0.7) 40%, rgba(60,50,80,0.4) 60%, rgba(50,40,70,0.6) 80%, transparent 97%)`,
            }}
          />
        ))}
      </div>

      {/* ── Cave ceiling (dark rock) ──────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-16">
        <div
          className="absolute top-0 w-full h-14"
          style={{
            background:
              "linear-gradient(to bottom, #08060e 0%, #0c0a16 50%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Stalactites from ceiling ─────────────────────────── */}
      <Stalactite left="6%" width={16} height={55} delay={0} />
      <Stalactite left="18%" width={12} height={40} delay={1.2} />
      <Stalactite left="32%" width={18} height={60} delay={0.5} />
      <Stalactite left="50%" width={14} height={45} delay={2.0} />
      <Stalactite left="65%" width={16} height={52} delay={0.8} />
      <Stalactite left="78%" width={12} height={38} delay={1.5} />
      <Stalactite left="90%" width={15} height={48} delay={0.3} />

      {/* ── Cave floor (dark rock) ───────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full h-16">
        <div
          className="absolute bottom-0 w-full h-14"
          style={{
            background:
              "linear-gradient(to top, #0a0814 0%, #0e0c1a 50%, transparent 100%)",
          }}
        />
      </div>

      {/* ── Stalagmites from floor ───────────────────────────── */}
      <Stalagmite left="10%" width={14} height={35} />
      <Stalagmite left="25%" width={18} height={45} />
      <Stalagmite left="42%" width={12} height={30} />
      <Stalagmite left="58%" width={16} height={40} />
      <Stalagmite left="73%" width={14} height={38} />
      <Stalagmite left="88%" width={18} height={42} />

      {/* ── Crystal formations ───────────────────────────────── */}
      <Crystal x="15%" y="55%" size={14} hue="rgba(120,80,220,0.8)" />
      <Crystal x="40%" y="70%" size={12} hue="rgba(80,200,200,0.7)" />
      <Crystal x="72%" y="60%" size={16} hue="rgba(140,100,240,0.75)" />
      <Crystal x="85%" y="45%" size={10} hue="rgba(100,220,180,0.65)" />
      <Crystal x="55%" y="25%" size={11} hue="rgba(160,100,220,0.7)" />

      {/* ── Bioluminescent floating particles ────────────────── */}
      {bioParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full animate-biolum-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 4px ${p.color}`,
          }}
          animate={{
            y: [0, -18, 6, -12, 0],
            x: [0, 8, -5, 3, 0],
            opacity: [0.2, 0.6, 0.3, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Extra water drips from stalactites ────────────────── */}
      {drips.map((d) => (
        <motion.div
          key={`caveDrip-${d.id}`}
          className="absolute"
          style={{
            left: `${d.left}%`,
            top: 0,
            width: 2,
            height: 10,
            borderRadius: "0 0 2px 2px",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(100,140,200,0.3) 50%, rgba(120,160,220,0.5) 100%)",
          }}
          animate={{ y: [0, 500], opacity: [0.5, 0], scaleY: [1, 0.3] }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}

      {/* ── Mist/fog layer near the floor ────────────────────── */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 opacity-30"
        style={{
          background:
            "linear-gradient(to top, rgba(40,35,60,0.6) 0%, rgba(30,25,50,0.3) 40%, transparent 100%)",
        }}
      />
      <motion.div
        className="absolute bottom-4 left-0 w-full h-20 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 400px 60px at 30% 50%, rgba(80,70,120,0.3), transparent)," +
            "radial-gradient(ellipse 350px 50px at 70% 50%, rgba(60,80,100,0.25), transparent)",
        }}
        animate={{ x: [0, 30, -20, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Murky ambient caustic (very subtle, purple tint) ─── */}
      <div
        className="absolute inset-0 animate-water-caustics opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 220px 160px at 25% 35%, rgba(100,80,160,0.3), transparent)," +
            "radial-gradient(ellipse 180px 180px at 65% 55%, rgba(60,100,140,0.25), transparent)," +
            "radial-gradient(ellipse 200px 140px at 45% 75%, rgba(80,60,140,0.2), transparent)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* ── Heavy vignette (dark enclosed cave) ──────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, transparent 35%, rgba(8,6,14,0.55) 70%, rgba(4,3,8,0.8) 100%)",
        }}
      />
    </div>
  );
};

export default CaveScene;
