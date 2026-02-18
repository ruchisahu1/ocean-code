import { useMemo } from "react";

/* ── Randomised element generators ──────────────────────────── */

function makeStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2,
    opacity: 0.2 + Math.random() * 0.6,
    delay: Math.random() * 6,
    dur: 3 + Math.random() * 4,
  }));
}

function makePlankton(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    hue: Math.random() > 0.5 ? "cyan" : "teal",
    delay: Math.random() * 14,
    dur: 10 + Math.random() * 8,
    opacity: 0.3 + Math.random() * 0.5,
  }));
}

function makeBubbles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 12,
    dur: 8 + Math.random() * 6,
    opacity: 0.15 + Math.random() * 0.25,
  }));
}

function makeCurrentLines(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    y: 10 + Math.random() * 80,
    width: 80 + Math.random() * 180,
    delay: Math.random() * 16,
    dur: 12 + Math.random() * 10,
    opacity: 0.06 + Math.random() * 0.1,
  }));
}

function makeJellyfish(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 15 + Math.random() * 55,
    scale: 0.5 + Math.random() * 0.6,
    delay: Math.random() * 10,
    dur: 6 + Math.random() * 5,
    hue: [180, 200, 260, 290, 320][i % 5],
    opacity: 0.25 + Math.random() * 0.3,
  }));
}

const AbyssScene = () => {
  const stars = useMemo(() => makeStars(70), []);
  const plankton = useMemo(() => makePlankton(45), []);
  const bubbles = useMemo(() => makeBubbles(12), []);
  const currentLines = useMemo(() => makeCurrentLines(8), []);
  const jellyfish = useMemo(() => makeJellyfish(6), []);

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>

      {/* ── Layer 1: Deep gradient background ──────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #020818 0%, #061228 25%, #0a1a3a 50%, #081630 75%, #030a18 100%)",
        }}
      />

      {/* ── Layer 2: Underwater Aurora Borealis ────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Aurora band 1 — teal */}
        <div
          className="absolute abyss-aurora"
          style={{
            top: "5%",
            left: "-20%",
            width: "140%",
            height: "18%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,210,200,0.12) 20%, rgba(0,255,220,0.18) 50%, rgba(0,200,210,0.10) 80%, transparent 100%)",
            filter: "blur(30px)",
            animationDelay: "0s",
            animationDuration: "28s",
          }}
        />
        {/* Aurora band 2 — cyan-blue */}
        <div
          className="absolute abyss-aurora"
          style={{
            top: "12%",
            left: "-30%",
            width: "160%",
            height: "14%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(60,130,255,0.10) 25%, rgba(80,200,255,0.16) 50%, rgba(60,140,255,0.08) 75%, transparent 100%)",
            filter: "blur(35px)",
            animationDelay: "-8s",
            animationDuration: "34s",
          }}
        />
        {/* Aurora band 3 — purple-magenta */}
        <div
          className="absolute abyss-aurora"
          style={{
            top: "8%",
            left: "-10%",
            width: "120%",
            height: "16%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(160,60,220,0.08) 30%, rgba(220,80,200,0.14) 55%, rgba(180,60,240,0.07) 80%, transparent 100%)",
            filter: "blur(28px)",
            animationDelay: "-16s",
            animationDuration: "32s",
          }}
        />
        {/* Aurora band 4 — green shimmer */}
        <div
          className="absolute abyss-aurora abyss-aurora-color"
          style={{
            top: "3%",
            left: "-15%",
            width: "130%",
            height: "12%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,255,150,0.06) 30%, rgba(0,255,200,0.12) 60%, rgba(0,200,150,0.05) 90%, transparent 100%)",
            filter: "blur(25px)",
            animationDelay: "-4s",
            animationDuration: "24s",
          }}
        />
      </div>

      {/* ── Layer 3: Distant star-field (bioluminescent dots) ─── */}
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="absolute rounded-full abyss-star-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: `rgba(180,220,255,${s.opacity})`,
            boxShadow: `0 0 ${s.size + 2}px rgba(180,220,255,${s.opacity * 0.6})`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}

      {/* ── Layer 4: Volumetric light beams from above ─────────── */}
      {[0, 1, 2, 3, 4].map((i) => {
        const positions = [15, 32, 50, 68, 85];
        const widths = [60, 50, 70, 45, 55];
        const opacities = [0.04, 0.03, 0.05, 0.03, 0.04];
        const delays = [0, -3, -7, -11, -5];
        return (
          <div
            key={`beam-${i}`}
            className="absolute abyss-beam-sway"
            style={{
              left: `${positions[i]}%`,
              top: "-10%",
              width: widths[i],
              height: "120%",
              background: `linear-gradient(180deg, rgba(150,200,255,${opacities[i] * 3}) 0%, rgba(100,180,255,${opacities[i]}) 40%, transparent 80%)`,
              filter: "blur(20px)",
              transformOrigin: "top center",
              animationDelay: `${delays[i]}s`,
              animationDuration: `${10 + i * 2}s`,
            }}
          />
        );
      })}

      {/* ── Layer 5: Whale silhouette ──────────────────────────── */}
      <div className="absolute abyss-whale-drift" style={{ top: "28%", left: 0, width: "100%", height: "100%" }}>
        <svg
          viewBox="0 0 300 80"
          className="absolute"
          style={{ width: "22%", height: "auto", opacity: 0.12 }}
        >
          <path
            d="M10,45 Q30,20 70,25 Q110,20 150,30 Q200,15 250,28 Q270,32 285,40
               Q290,45 285,50 Q270,56 250,52 Q200,60 150,55 Q110,58 70,52
               Q40,58 20,52 Q12,50 10,45 Z"
            fill="#4080a0"
          />
          {/* Tail */}
          <path
            d="M10,45 Q0,35 5,25 Q8,30 10,38 Z"
            fill="#3a7590"
          />
          <path
            d="M10,45 Q0,55 5,65 Q8,58 10,50 Z"
            fill="#3a7590"
          />
          {/* Eye */}
          <circle cx="260" cy="38" r="3" fill="#1a2a3a" />
          {/* Fin */}
          <path
            d="M140,50 Q145,70 155,65 Q150,55 148,50 Z"
            fill="#3a7590"
          />
        </svg>
      </div>

      {/* ── Layer 6: Manta ray silhouette ─────────────────────── */}
      <div className="absolute abyss-manta-glide" style={{ top: "55%", right: 0, width: "100%", height: "100%" }}>
        <svg
          viewBox="0 0 200 60"
          className="absolute"
          style={{ width: "14%", height: "auto", opacity: 0.10 }}
        >
          <path
            d="M100,30 Q80,5 30,10 Q10,15 5,25 Q10,22 30,20 Q60,18 80,28 L100,30 Z"
            fill="#5090b0"
          />
          <path
            d="M100,30 Q80,55 30,50 Q10,45 5,35 Q10,38 30,40 Q60,42 80,32 L100,30 Z"
            fill="#5090b0"
          />
          {/* Tail */}
          <path
            d="M100,30 L160,28 L170,22 L165,30 L170,38 L160,32 Z"
            fill="#4580a0"
          />
          {/* Eye */}
          <circle cx="45" cy="28" r="2" fill="#1a2a3a" />
        </svg>
      </div>

      {/* ── Layer 7: Jellyfish swarm ──────────────────────────── */}
      {jellyfish.map((jf) => (
        <div
          key={`jelly-${jf.id}`}
          className="absolute abyss-jellyfish-float"
          style={{
            left: `${jf.x}%`,
            top: `${jf.y}%`,
            transform: `scale(${jf.scale})`,
            animationDelay: `${jf.delay}s`,
            animationDuration: `${jf.dur}s`,
            opacity: jf.opacity,
          }}
        >
          <svg viewBox="0 0 40 70" width="36" height="62">
            {/* Bell / dome */}
            <ellipse
              cx="20" cy="18" rx="16" ry="14"
              fill={`hsla(${jf.hue}, 70%, 65%, 0.35)`}
              stroke={`hsla(${jf.hue}, 80%, 75%, 0.3)`}
              strokeWidth="0.5"
            />
            <ellipse
              cx="20" cy="18" rx="10" ry="9"
              fill={`hsla(${jf.hue}, 80%, 80%, 0.15)`}
            />
            {/* Tentacles */}
            {[10, 15, 20, 25, 30].map((tx, ti) => (
              <path
                key={ti}
                d={`M${tx},30 Q${tx + (ti % 2 === 0 ? 3 : -3)},45 ${tx},60 Q${tx + (ti % 2 === 0 ? -2 : 2)},65 ${tx},70`}
                stroke={`hsla(${jf.hue}, 60%, 70%, 0.25)`}
                fill="none"
                strokeWidth="0.8"
                className="abyss-jellyfish-tentacle"
                style={{ animationDelay: `${ti * 0.4}s` }}
              />
            ))}
            {/* Glow */}
            <ellipse
              cx="20" cy="18" rx="18" ry="16"
              fill="none"
              style={{
                filter: `drop-shadow(0 0 6px hsla(${jf.hue}, 80%, 70%, 0.3))`,
              }}
            />
          </svg>
        </div>
      ))}

      {/* ── Layer 8: Bioluminescent plankton clouds ───────────── */}
      {plankton.map((p) => (
        <div
          key={`plk-${p.id}`}
          className="absolute rounded-full abyss-plankton-drift"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.hue === "cyan"
              ? `rgba(0,220,255,${p.opacity})`
              : `rgba(0,200,180,${p.opacity})`,
            boxShadow: p.hue === "cyan"
              ? `0 0 ${p.size + 4}px rgba(0,220,255,${p.opacity * 0.5})`
              : `0 0 ${p.size + 4}px rgba(0,200,180,${p.opacity * 0.5})`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}

      {/* ── Layer 9: Current flow lines ───────────────────────── */}
      {currentLines.map((cl) => (
        <div
          key={`flow-${cl.id}`}
          className="absolute abyss-current-sweep"
          style={{
            top: `${cl.y}%`,
            left: "-10%",
            width: cl.width,
            height: 1,
            background: `linear-gradient(90deg, transparent, rgba(100,200,255,${cl.opacity}), transparent)`,
            animationDelay: `${cl.delay}s`,
            animationDuration: `${cl.dur}s`,
          }}
        />
      ))}

      {/* ── Layer 10: Rising bubbles ──────────────────────────── */}
      {bubbles.map((b) => (
        <div
          key={`bub-${b.id}`}
          className="absolute rounded-full"
          style={{
            left: `${b.x}%`,
            bottom: "-5%",
            width: b.size,
            height: b.size,
            border: `1px solid rgba(150,210,255,${b.opacity})`,
            backgroundColor: `rgba(150,210,255,${b.opacity * 0.3})`,
            animation: `bubble-rise ${b.dur}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* ── Layer 11: Ambient glow pools ──────────────────────── */}
      <div
        className="absolute"
        style={{
          bottom: "5%",
          left: "20%",
          width: 200,
          height: 100,
          background: "radial-gradient(ellipse, rgba(0,180,200,0.06) 0%, transparent 70%)",
          filter: "blur(20px)",
          animation: "pulse-glow 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "8%",
          right: "15%",
          width: 160,
          height: 80,
          background: "radial-gradient(ellipse, rgba(100,60,200,0.05) 0%, transparent 70%)",
          filter: "blur(18px)",
          animation: "pulse-glow 10s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />

      {/* ── Layer 12: Subtle vignette ─────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(2,8,24,0.5) 100%)",
        }}
      />

      {/* ── Water caustics (very subtle deep-blue) ────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 30% 40%, rgba(60,120,200,0.04) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 70% 60%, rgba(40,100,180,0.03) 0%, transparent 50%)",
          backgroundSize: "60% 60%, 50% 50%",
          animation: "water-caustics 14s ease-in-out infinite",
          opacity: 0.7,
        }}
      />
    </div>
  );
};

export default AbyssScene;
