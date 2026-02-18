import { useMemo } from "react";
import { motion } from "framer-motion";

/* ── Trench wall — jagged vertical rock face ──────────────────── */
const TrenchWall = ({
  side,
  width,
}: {
  side: "left" | "right";
  width: number;
}) => {
  const jaggedEdge =
    side === "left"
      ? `0,0 ${width},0 ${width * 0.6},8 ${width * 0.85},16 ${width * 0.45},26 ${width * 0.75},36 ${width * 0.35},46 ${width * 0.8},56 ${width * 0.4},66 ${width * 0.7},76 ${width * 0.5},86 ${width * 0.65},94 0,100`
      : `${width},0 0,0 ${width * 0.4},8 ${width * 0.15},16 ${width * 0.55},26 ${width * 0.25},36 ${width * 0.65},46 ${width * 0.2},56 ${width * 0.6},66 ${width * 0.3},76 ${width * 0.5},86 ${width * 0.35},94 ${width},100`;

  const gradId = `wallGrad-${side}`;

  return (
    <div
      className="absolute top-0 h-full"
      style={{ [side]: 0, width: `${width}px` }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} 100`}
        preserveAspectRatio="none"
        className="h-full"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            {side === "left" ? (
              <>
                <stop offset="0%" stopColor="#0c1020" />
                <stop offset="60%" stopColor="#141830" />
                <stop offset="100%" stopColor="#0a0e1c" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#0a0e1c" />
                <stop offset="40%" stopColor="#141830" />
                <stop offset="100%" stopColor="#0c1020" />
              </>
            )}
          </linearGradient>
        </defs>
        <polygon points={jaggedEdge} fill={`url(#${gradId})`} opacity="0.85" />
      </svg>

      {/* Glowing vein lines along the wall */}
      {[20, 40, 60, 80].map((pct) => (
        <motion.div
          key={pct}
          className="absolute"
          style={{
            [side]: side === "left" ? `${width * 0.3}px` : `${width * 0.3}px`,
            top: `${pct}%`,
            width: width * 0.4,
            height: 2,
            borderRadius: "1px",
            background: `linear-gradient(${side === "left" ? "to right" : "to left"}, rgba(80,200,220,0.5), transparent)`,
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{
            duration: 3 + pct * 0.02,
            delay: pct * 0.03,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

/* ── Anglerfish lure — glowing warm orb ──────────────────────── */
const AnglerLure = ({
  x,
  y,
  size,
  delay,
}: {
  x: string;
  y: string;
  size: number;
  delay: number;
}) => (
  <motion.div
    className="absolute"
    style={{ left: x, top: y }}
    animate={{
      scale: [1, 1.3, 0.9, 1.2, 1],
      opacity: [0.6, 1, 0.5, 0.9, 0.6],
    }}
    transition={{
      duration: 3 + delay * 0.5,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {/* outer glow halo */}
    <div
      className="absolute rounded-full"
      style={{
        left: -size * 1.5,
        top: -size * 1.5,
        width: size * 4,
        height: size * 4,
        background: `radial-gradient(circle, rgba(255,180,60,0.25) 0%, rgba(255,140,30,0.1) 40%, transparent 70%)`,
      }}
    />
    {/* core orb */}
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(255,240,180,1) 0%, rgba(255,200,80,0.9) 30%, rgba(255,140,40,0.5) 60%, transparent 80%)`,
        boxShadow: `0 0 ${size * 3}px rgba(255,200,80,0.6), 0 0 ${size * 6}px rgba(255,160,40,0.3), 0 0 ${size * 10}px rgba(255,120,20,0.15)`,
      }}
    />
  </motion.div>
);

/* ── Thermal vent column — visible rising heat ───────────────── */
const ThermalVent = ({
  x,
  width: w,
}: {
  x: string;
  width: number;
}) => (
  <div className="absolute bottom-0" style={{ left: x, width: w }}>
    {/* base glow */}
    <div
      className="absolute bottom-0 w-full"
      style={{
        height: "45%",
        background: `radial-gradient(ellipse 100% 100% at 50% 100%, rgba(255,120,30,0.35) 0%, rgba(255,80,20,0.15) 40%, transparent 75%)`,
      }}
    />
    {/* rising heat column */}
    <motion.div
      className="absolute bottom-0 w-full"
      style={{
        height: "70%",
        background: `linear-gradient(to top, rgba(255,140,50,0.2) 0%, rgba(255,100,30,0.08) 40%, transparent 100%)`,
        filter: "blur(3px)",
      }}
      animate={{
        scaleX: [1, 1.15, 0.9, 1.1, 1],
        opacity: [0.6, 0.9, 0.5, 0.8, 0.6],
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

/** Animated deep-sea trench background */
const TrenchScene = () => {
  /* ── Deep-sea particles (cyan/green bioluminescent) ──────────── */
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: 8 + Math.random() * 84,
        y: Math.random() * 100,
        size: 2.5 + Math.random() * 4,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 8,
        color:
          Math.random() > 0.6
            ? "rgba(80,255,200,0.7)"
            : Math.random() > 0.3
            ? "rgba(60,200,255,0.6)"
            : "rgba(120,180,255,0.5)",
      })),
    []
  );

  /* ── Bubbles rising from thermal vents ──────────────────────── */
  const ventBubbles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: 25 + Math.random() * 50,
        size: 3 + Math.random() * 5,
        duration: 3.5 + Math.random() * 3.5,
        delay: Math.random() * 5,
      })),
    []
  );

  /* ── Slow drifting jellyfish-like bioluminescent blobs ───────── */
  const bioBlobs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 65,
        size: 12 + Math.random() * 18,
        duration: 15 + Math.random() * 10,
        delay: Math.random() * 8,
        hue: Math.random() > 0.5 ? "rgba(80,220,200,0.15)" : "rgba(120,140,255,0.12)",
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* ── Base gradient — dark deep-blue trench ─────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #060a1a 0%, #08102a 20%, #0a1430 40%, #0c1835 60%, #0a1228 80%, #060e20 100%)",
        }}
      />

      {/* ── Subtle rock texture lines ─────────────────────────── */}
      <div className="absolute inset-0 opacity-30">
        {[6, 14, 22, 32, 42, 52, 63, 74, 85, 94].map((top) => (
          <div
            key={top}
            className="absolute left-0 w-full"
            style={{
              top: `${top}%`,
              height: "1px",
              background: `linear-gradient(90deg, rgba(40,50,80,0.9) 0%, rgba(30,40,70,0.4) 20%, transparent 40%, transparent 60%, rgba(30,40,70,0.4) 80%, rgba(40,50,80,0.9) 100%)`,
            }}
          />
        ))}
      </div>

      {/* ── Trench rock walls on sides ─────────────────────────── */}
      <TrenchWall side="left" width={70} />
      <TrenchWall side="right" width={65} />

      {/* ── Thermal vents at bottom ────────────────────────────── */}
      <ThermalVent x="20%" width={80} />
      <ThermalVent x="55%" width={100} />
      <ThermalVent x="75%" width={60} />

      {/* ── Overall warm underglow from vents ──────────────────── */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: "35%",
          background:
            "radial-gradient(ellipse 120% 100% at 50% 100%, rgba(255,100,30,0.18) 0%, rgba(200,60,10,0.08) 40%, transparent 75%)",
        }}
      />

      {/* ── Anglerfish lure lights (bigger, brighter) ──────────── */}
      <AnglerLure x="8%" y="25%" size={12} delay={0} />
      <AnglerLure x="85%" y="18%" size={10} delay={1.2} />
      <AnglerLure x="20%" y="60%" size={14} delay={0.5} />
      <AnglerLure x="72%" y="45%" size={11} delay={2.0} />
      <AnglerLure x="45%" y="12%" size={9} delay={1.8} />
      <AnglerLure x="90%" y="68%" size={12} delay={0.3} />
      <AnglerLure x="55%" y="78%" size={10} delay={2.5} />
      <AnglerLure x="30%" y="38%" size={8} delay={1.0} />

      {/* ── Large bioluminescent blobs (ambient glow) ──────────── */}
      {bioBlobs.map((b) => (
        <motion.div
          key={`blob-${b.id}`}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle, ${b.hue} 0%, transparent 70%)`,
            filter: "blur(6px)",
          }}
          animate={{
            y: [0, -20, 8, -15, 0],
            x: [0, 12, -8, 6, 0],
            opacity: [0.3, 0.7, 0.4, 0.8, 0.3],
            scale: [1, 1.2, 0.9, 1.15, 1],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Deep-sea glowing particles ─────────────────────────── */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [0, -15, 6, -10, 0],
            x: [0, 8, -5, 4, 0],
            opacity: [0.3, 0.8, 0.4, 0.9, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Bubbles rising from vents ──────────────────────────── */}
      {ventBubbles.map((b) => (
        <motion.div
          key={`ventBub-${b.id}`}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: 0,
            width: b.size,
            height: b.size,
            border: "1px solid rgba(255,180,80,0.3)",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255,200,120,0.4) 0%, rgba(255,140,60,0.15) 50%, transparent 100%)",
          }}
          animate={{
            y: [0, -400 - Math.random() * 200],
            opacity: [0.6, 0],
            scale: [1, 0.4],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      {/* ── Ambient blue-green side glow (bioluminescence on walls) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 25% 60% at 5% 50%, rgba(40,180,200,0.15) 0%, transparent 100%)," +
            "radial-gradient(ellipse 25% 60% at 95% 50%, rgba(40,180,200,0.15) 0%, transparent 100%)",
        }}
      />

      {/* ── Subtle water caustic (very dim, blue tint) ─────────── */}
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 200px 160px at 30% 30%, rgba(60,120,200,0.3), transparent)," +
            "radial-gradient(ellipse 180px 140px at 70% 60%, rgba(40,100,180,0.25), transparent)," +
            "radial-gradient(ellipse 160px 120px at 50% 80%, rgba(80,140,220,0.2), transparent)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "50% 30%", "30% 60%", "0% 0%"],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Vignette — moderate, not crushing ──────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 50%, transparent 40%, rgba(4,6,16,0.4) 70%, rgba(2,4,10,0.65) 100%)",
        }}
      />
    </div>
  );
};

export default TrenchScene;
