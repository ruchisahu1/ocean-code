import { useMemo } from "react";
import { motion } from "framer-motion";

/* ── SVG Porthole — circular window showing ocean outside ──────── */
const Porthole = ({ x, y, size }: { x: string; y: string; size: number }) => (
  <div
    className="absolute"
    style={{ left: x, top: y, width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {/* outer ring (brass/bronze frame) */}
      <circle cx="40" cy="40" r="38" stroke="#6b5a3a" strokeWidth="4" fill="none" />
      <circle cx="40" cy="40" r="36" stroke="#8a7450" strokeWidth="1.5" fill="none" />
      {/* glass — faint blue ocean glow */}
      <circle cx="40" cy="40" r="34" fill="url(#portholeGlass)" />
      {/* cross-bar frame */}
      <line x1="6" y1="40" x2="74" y2="40" stroke="#6b5a3a" strokeWidth="3" />
      <line x1="40" y1="6" x2="40" y2="74" stroke="#6b5a3a" strokeWidth="3" />
      {/* glass highlight */}
      <ellipse cx="30" cy="30" rx="12" ry="8" fill="rgba(130,200,230,0.12)" />
      {/* rivets on the frame */}
      <circle cx="12" cy="40" r="2" fill="#5a4a30" />
      <circle cx="68" cy="40" r="2" fill="#5a4a30" />
      <circle cx="40" cy="12" r="2" fill="#5a4a30" />
      <circle cx="40" cy="68" r="2" fill="#5a4a30" />
      <defs>
        <radialGradient id="portholeGlass" cx="40%" cy="35%">
          <stop offset="0%" stopColor="rgba(60,140,180,0.35)" />
          <stop offset="60%" stopColor="rgba(20,80,120,0.25)" />
          <stop offset="100%" stopColor="rgba(10,40,60,0.3)" />
        </radialGradient>
      </defs>
    </svg>
    {/* animated glow behind the porthole */}
    <div
      className="absolute inset-0 rounded-full animate-lantern-flicker"
      style={{
        background: "radial-gradient(circle, rgba(50,140,190,0.15) 0%, transparent 70%)",
        transform: "scale(1.6)",
      }}
    />
  </div>
);

/* ── SVG Lantern — warm amber wall light ───────────────────────── */
const Lantern = ({ x, y }: { x: string; y: string }) => (
  <div className="absolute" style={{ left: x, top: y }}>
    <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
      {/* bracket */}
      <path d="M10 0 L10 8" stroke="#6b5a3a" strokeWidth="2" />
      <path d="M6 8 L14 8" stroke="#6b5a3a" strokeWidth="2" />
      {/* glass body */}
      <rect x="5" y="10" width="10" height="16" rx="2" fill="#2a2010" stroke="#6b5a3a" strokeWidth="1" />
      {/* flame */}
      <ellipse cx="10" cy="18" rx="3" ry="5" fill="#c89030" opacity="0.8" />
      <ellipse cx="10" cy="17" rx="1.5" ry="3" fill="#e8b040" opacity="0.9" />
      {/* bottom cap */}
      <rect x="6" y="26" width="8" height="3" rx="1" fill="#5a4a30" />
    </svg>
    {/* warm glow */}
    <div
      className="absolute animate-lantern-flicker"
      style={{
        left: -30,
        top: -10,
        width: 80,
        height: 80,
        background: "radial-gradient(circle, rgba(200,140,50,0.18) 0%, rgba(180,120,40,0.06) 40%, transparent 70%)",
      }}
    />
  </div>
);

/** Animated sunken ship interior background */
const ShipScene = () => {
  /* ── dust motes (replacing plankton) ─────────────────────────── */
  const dustMotes = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 8,
      })),
    []
  );

  /* ── water drips from ceiling ────────────────────────────────── */
  const drips = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 6,
        height: 8 + Math.random() * 12,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* ── Base gradient — dark ship interior ─────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #1a1408 0%, #14100a 15%, #100e08 35%, #0d1210 55%, #0a0f0c 80%, #080c08 100%)",
        }}
      />

      {/* ── Wood plank texture (horizontal lines) ─────────────── */}
      <div className="absolute inset-0 opacity-30">
        {[8, 18, 28, 38, 48, 58, 68, 78, 88].map((top) => (
          <div
            key={top}
            className="absolute left-0 w-full"
            style={{
              top: `${top}%`,
              height: "1px",
              background: `linear-gradient(90deg, transparent 0%, rgba(90,70,40,0.5) 10%, rgba(70,55,30,0.7) 30%, rgba(90,70,40,0.4) 50%, rgba(70,55,30,0.6) 70%, rgba(90,70,40,0.5) 90%, transparent 100%)`,
            }}
          />
        ))}
      </div>

      {/* ── Wood grain accent lines (thinner, varied) ─────────── */}
      <div className="absolute inset-0 opacity-15">
        {[13, 23, 33, 43, 53, 63, 73, 83, 93].map((top) => (
          <div
            key={top}
            className="absolute left-0 w-full"
            style={{
              top: `${top}%`,
              height: "1px",
              background: `linear-gradient(90deg, transparent 5%, rgba(100,80,45,0.3) 20%, rgba(80,60,35,0.5) 45%, transparent 55%, rgba(100,80,45,0.4) 75%, transparent 95%)`,
            }}
          />
        ))}
      </div>

      {/* ── Ship structural beams (vertical) ──────────────────── */}
      <div
        className="absolute left-[3%] top-0 h-full w-8 opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(50,40,25,0.7) 30%, rgba(60,48,30,0.9) 50%, rgba(50,40,25,0.7) 70%, transparent)",
        }}
      />
      <div
        className="absolute right-[3%] top-0 h-full w-8 opacity-40"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(50,40,25,0.7) 30%, rgba(60,48,30,0.9) 50%, rgba(50,40,25,0.7) 70%, transparent)",
        }}
      />
      {/* center beam (lighter) */}
      <div
        className="absolute left-[48%] top-0 h-full w-6 opacity-20"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(60,48,30,0.6) 40%, rgba(60,48,30,0.6) 60%, transparent)",
        }}
      />

      {/* ── Rivets along beams ────────────────────────────────── */}
      {[10, 25, 40, 55, 70, 85].map((top) => (
        <div key={`rivet-l-${top}`}>
          <div
            className="absolute rounded-full"
            style={{
              left: "4.5%",
              top: `${top}%`,
              width: 5,
              height: 5,
              background: "radial-gradient(circle, #7a6a4a 0%, #4a3a20 100%)",
              boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 1px rgba(140,120,80,0.15)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              right: "4.5%",
              top: `${top}%`,
              width: 5,
              height: 5,
              background: "radial-gradient(circle, #7a6a4a 0%, #4a3a20 100%)",
              boxShadow: "inset 0 -1px 1px rgba(0,0,0,0.4), 0 1px 1px rgba(140,120,80,0.15)",
            }}
          />
        </div>
      ))}

      {/* ── Porthole windows ──────────────────────────────────── */}
      <Porthole x="12%" y="15%" size={70} />
      <Porthole x="78%" y="35%" size={60} />
      <Porthole x="8%" y="60%" size={55} />

      {/* ── Lanterns ─────────────────────────────────────────── */}
      <Lantern x="30%" y="8%" />
      <Lantern x="68%" y="12%" />

      {/* ── Warm ambient glow from lanterns ───────────────────── */}
      <div
        className="absolute animate-lantern-flicker opacity-25"
        style={{
          left: "20%",
          top: "5%",
          width: 260,
          height: 220,
          background:
            "radial-gradient(ellipse, rgba(200,150,60,0.25) 0%, rgba(180,120,40,0.08) 40%, transparent 70%)",
        }}
      />
      <div
        className="absolute animate-lantern-flicker opacity-20"
        style={{
          right: "15%",
          top: "8%",
          width: 240,
          height: 200,
          background:
            "radial-gradient(ellipse, rgba(190,140,50,0.2) 0%, rgba(170,110,30,0.06) 45%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />

      {/* ── Ship floor (dark wood planks) ─────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full h-20">
        <div
          className="absolute bottom-0 w-full h-16"
          style={{
            background:
              "linear-gradient(to top, #18120a 0%, #1e160e 40%, #201810 70%, transparent 100%)",
          }}
        />
        {/* floor plank lines */}
        {[92, 95, 98].map((top) => (
          <div
            key={`floor-${top}`}
            className="absolute left-0 w-full"
            style={{
              top: `${top}%`,
              height: "1px",
              background: "linear-gradient(90deg, rgba(80,60,35,0.4) 0%, rgba(100,75,40,0.6) 50%, rgba(80,60,35,0.4) 100%)",
            }}
          />
        ))}
      </div>

      {/* ── Ship ceiling (dark wood) ──────────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-12">
        <div
          className="absolute top-0 w-full h-10"
          style={{
            background:
              "linear-gradient(to bottom, #14100a 0%, #1a140e 50%, transparent 100%)",
          }}
        />
        {/* ceiling plank lines */}
        {[2, 5].map((top) => (
          <div
            key={`ceil-${top}`}
            className="absolute left-0 w-full"
            style={{
              top: `${top}%`,
              height: "1px",
              background: "linear-gradient(90deg, rgba(80,60,35,0.3) 0%, rgba(100,75,40,0.5) 50%, rgba(80,60,35,0.3) 100%)",
            }}
          />
        ))}
      </div>

      {/* ── Floating dust motes ───────────────────────────────── */}
      {dustMotes.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full animate-dust-drift"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            background: "rgba(200,180,140,0.5)",
            boxShadow: "0 0 3px rgba(180,160,110,0.2)",
          }}
          animate={{
            y: [0, -15, 5, -10, 0],
            x: [0, 6, -4, 3, 0],
            opacity: [0.2, 0.5, 0.3, 0.6, 0.2],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Water drips from ceiling ──────────────────────────── */}
      {drips.map((d) => (
        <motion.div
          key={`drip-${d.id}`}
          className="absolute"
          style={{
            left: `${d.left}%`,
            top: 0,
            width: 2,
            height: d.height,
            borderRadius: "0 0 2px 2px",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(100,160,200,0.3) 40%, rgba(120,180,220,0.5) 100%)",
          }}
          animate={{
            y: [0, 600],
            opacity: [0.6, 0],
            scaleY: [1, 0.3],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}

      {/* ── Murky water caustic (very subtle, greenish) ───────── */}
      <div
        className="absolute inset-0 animate-water-caustics opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 250px 180px at 30% 40%, rgba(80,140,80,0.3), transparent)," +
            "radial-gradient(ellipse 200px 200px at 70% 60%, rgba(60,120,90,0.25), transparent)," +
            "radial-gradient(ellipse 180px 150px at 50% 25%, rgba(90,130,70,0.2), transparent)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* ── Heavy vignette (enclosed, dark edges) ─────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(10,8,4,0.5) 75%, rgba(5,4,2,0.75) 100%)",
        }}
      />
    </div>
  );
};

export default ShipScene;
