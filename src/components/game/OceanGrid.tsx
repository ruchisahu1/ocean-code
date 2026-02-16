import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type CellType = "empty" | "sub" | "sample" | "rock" | "goal" | "hazard" | "collected";

interface OceanGridProps {
  grid: CellType[][];
  subPos: { row: number; col: number };
  isRunning: boolean;
  isComplete: boolean;
  direction: "right" | "left" | "up" | "down";
}

/* ═══════════════════════════════════════════════════════════════
   SVG SPRITE COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/** Submarine — side-profile with porthole, hull, propeller, and glow */
const SubmarineSprite = ({ isRunning }: { isRunning: boolean }) => (
  <svg width="56" height="28" viewBox="0 0 56 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="subGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="hullGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5ED4F5" />
        <stop offset="100%" stopColor="#2A7A9B" />
      </linearGradient>
    </defs>
    {/* hull */}
    <ellipse cx="26" cy="16" rx="22" ry="10" fill="url(#hullGrad)" filter="url(#subGlow)" />
    {/* top fin / sail */}
    <rect x="20" y="4" width="10" height="6" rx="2" fill="#3BA8CC" />
    {/* porthole */}
    <circle cx="18" cy="16" r="4.5" fill="#0B2540" stroke="#FFD93D" strokeWidth="1.5" />
    <circle cx="17" cy="15" r="1.5" fill="rgba(255,255,200,0.5)" />
    {/* rear porthole (smaller) */}
    <circle cx="30" cy="16" r="3" fill="#0B2540" stroke="#FFD93D" strokeWidth="1" />
    {/* propeller hub */}
    <circle cx="49" cy="16" r="2.5" fill="#4A7A8A" />
    {/* propeller blades */}
    <g className={isRunning ? "animate-spin origin-center" : ""} style={{ transformOrigin: "49px 16px" }}>
      <rect x="48" y="8" width="2" height="6" rx="1" fill="#6AACBC" />
      <rect x="48" y="20" width="2" height="6" rx="1" fill="#6AACBC" />
      <rect x="51" y="13" width="5" height="2" rx="1" fill="#6AACBC" transform="rotate(30 53 14)" />
      <rect x="44" y="17" width="5" height="2" rx="1" fill="#6AACBC" transform="rotate(30 46 18)" />
    </g>
    {/* front light */}
    <ellipse cx="5" cy="16" rx="2" ry="1.5" fill="#FFE082" opacity="0.7" />
    {/* hull highlight */}
    <ellipse cx="22" cy="11" rx="12" ry="3" fill="rgba(255,255,255,0.12)" />
  </svg>
);

/** Seashell sample — warm peach/gold spiral */
const ShellSprite = () => (
  <svg width="32" height="30" viewBox="0 0 32 30" fill="none">
    <defs>
      <filter id="shellGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* shell body */}
    <path d="M16 2 Q28 4 28 16 Q28 26 16 28 Q8 26 4 20 Q0 14 4 8 Q8 2 16 2 Z" fill="#FFBF69" filter="url(#shellGlow)" />
    {/* spiral ridges */}
    <path d="M16 6 Q24 8 24 16 Q24 22 16 24" stroke="#E8943A" strokeWidth="1.2" fill="none" />
    <path d="M16 10 Q20 11 20 16 Q20 20 16 21" stroke="#D4813A" strokeWidth="1" fill="none" />
    <path d="M16 14 Q18 14.5 18 16 Q18 18 16 18.5" stroke="#C07030" strokeWidth="0.8" fill="none" />
    {/* highlight */}
    <ellipse cx="12" cy="10" rx="4" ry="3" fill="rgba(255,255,255,0.2)" />
    {/* base */}
    <path d="M6 22 Q10 28 18 28 Q12 26 8 22 Z" fill="#E89850" opacity="0.6" />
  </svg>
);

/** Rock / coral formation — muted grey-brown */
const RockSprite = () => (
  <svg width="44" height="38" viewBox="0 0 44 38" fill="none">
    {/* main rock */}
    <path d="M8 36 L2 22 L6 12 L14 6 L24 4 L34 8 L40 16 L42 28 L38 36 Z" fill="#4A5568" />
    <path d="M8 36 L2 22 L6 12 L14 6 L24 4 L34 8 L40 16 L42 28 L38 36 Z" fill="url(#rockTex)" opacity="0.4" />
    {/* highlight edge */}
    <path d="M14 6 L24 4 L34 8 L40 16" stroke="#6B7B8F" strokeWidth="1.5" fill="none" />
    {/* moss/algae patches */}
    <circle cx="12" cy="20" r="3" fill="#3D6B4F" opacity="0.4" />
    <circle cx="30" cy="14" r="2.5" fill="#3D6B4F" opacity="0.35" />
    <circle cx="24" cy="28" r="2" fill="#3D6B4F" opacity="0.3" />
    {/* shadow */}
    <path d="M8 36 L38 36 L36 38 L10 38 Z" fill="rgba(0,0,0,0.2)" />
    <defs>
      <pattern id="rockTex" patternUnits="userSpaceOnUse" width="8" height="8">
        <circle cx="2" cy="2" r="0.5" fill="#3A4A5A" />
        <circle cx="6" cy="6" r="0.4" fill="#3A4A5A" />
      </pattern>
    </defs>
  </svg>
);

/** Jellyfish hazard — translucent dome with tentacles */
const JellyfishSprite = () => (
  <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
    <defs>
      <filter id="jellyGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="jellyGrad" cx="50%" cy="40%">
        <stop offset="0%" stopColor="#FF9A9A" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FF4C4C" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    {/* dome */}
    <path d="M2 18 Q2 2 17 2 Q32 2 32 18 L28 20 L24 18 L20 20 L17 18 L14 20 L10 18 L6 20 Z"
      fill="url(#jellyGrad)" filter="url(#jellyGlow)" />
    {/* dome highlight */}
    <ellipse cx="14" cy="10" rx="6" ry="4" fill="rgba(255,255,255,0.15)" />
    {/* tentacles */}
    <path d="M8 20 Q6 28 8 36" stroke="#FF7070" strokeWidth="1.5" fill="none" opacity="0.7" className="animate-sway" />
    <path d="M14 20 Q12 30 14 38" stroke="#FF8080" strokeWidth="1.2" fill="none" opacity="0.6" className="animate-sway" style={{ animationDelay: "0.3s" }} />
    <path d="M20 20 Q22 30 20 38" stroke="#FF7070" strokeWidth="1.2" fill="none" opacity="0.6" className="animate-sway" style={{ animationDelay: "0.6s" }} />
    <path d="M26 20 Q28 28 26 36" stroke="#FF8080" strokeWidth="1.5" fill="none" opacity="0.7" className="animate-sway" style={{ animationDelay: "0.9s" }} />
    {/* inner glow spots */}
    <circle cx="12" cy="14" r="1.5" fill="#FFD0D0" opacity="0.5" />
    <circle cx="22" cy="12" r="1" fill="#FFD0D0" opacity="0.4" />
  </svg>
);

/** Treasure / goal beacon — chest with pulsing light ring */
const TreasureSprite = () => (
  <svg width="36" height="34" viewBox="0 0 36 34" fill="none">
    <defs>
      <filter id="treasureGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* beacon ring */}
    <circle cx="18" cy="17" r="16" stroke="#4AE68A" strokeWidth="1.5" fill="none" opacity="0.4" className="animate-beacon-pulse" />
    {/* chest body */}
    <rect x="6" y="16" width="24" height="14" rx="2" fill="#8B6914" />
    <rect x="6" y="16" width="24" height="7" rx="2" fill="#A67C1A" />
    {/* chest lid */}
    <path d="M6 16 Q18 8 30 16 Z" fill="#C49A2A" />
    <path d="M10 15 Q18 10 26 15" stroke="#DAB042" strokeWidth="1" fill="none" />
    {/* lock */}
    <rect x="15" y="18" width="6" height="5" rx="1" fill="#FFD93D" filter="url(#treasureGlow)" />
    <circle cx="18" cy="20" r="1" fill="#8B6914" />
    {/* sparkle hints */}
    <circle cx="10" cy="12" r="1" fill="#FFE082" opacity="0.6">
      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="26" cy="10" r="0.8" fill="#FFE082" opacity="0.5">
      <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.6s" repeatCount="indefinite" />
    </circle>
    {/* gold gleam */}
    <ellipse cx="18" cy="14" rx="8" ry="2" fill="rgba(255,217,61,0.15)" />
  </svg>
);

/** Sparkle for collected cell */
const CollectedSparkle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" fill="#FFE082" opacity="0.5" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   OCEAN GRID COMPONENT
   ═══════════════════════════════════════════════════════════════ */

/** Map movement direction to submarine rotation angle */
const DIRECTION_ROTATION: Record<string, number> = {
  right: 0,
  left: 180,
  down: 90,
  up: -90,
};

const OceanGrid = ({ grid, subPos, isRunning, isComplete, direction }: OceanGridProps) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(64);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  /* Dynamically compute cell size to fill parent */
  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    /* leave a small margin for the legend at bottom */
    const availH = height - 40;
    const size = Math.floor(Math.min(width / cols, availH / rows));
    const clampedSize = Math.max(48, Math.min(size, 100));
    setCellSize(clampedSize);
    setOffset({
      x: Math.floor((width - cols * clampedSize) / 2),
      y: Math.floor((availH - rows * clampedSize) / 2),
    });
  }, [rows, cols]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <div ref={containerRef} className="absolute inset-0" data-tutorial="ocean-grid">
      {/* Sonar ping effect when running */}
      {isRunning && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-16 h-16 rounded-full border-2 border-primary/40 animate-sonar" />
        </div>
      )}

      {/* Completion overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                className="text-5xl mb-3 flex justify-center"
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                <TreasureSprite />
              </motion.div>
              <div className="font-display text-xl text-accent glow-green tracking-wider">
                MISSION COMPLETE
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-0.5 bg-accent/50 mt-2 rounded-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Entities positioned directly in the full-bleed area ─── */}
      {grid.map((row, r) =>
        row.map((cell, c) => {
          if (cell === "empty" || cell === "sub") return null;
          const x = offset.x + c * cellSize;
          const y = offset.y + r * cellSize;

          return (
            <AnimatePresence key={`entity-${r}-${c}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
                className="absolute flex items-center justify-center"
                style={{ left: x, top: y, width: cellSize, height: cellSize }}
              >
                {cell === "sample" && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], y: [-1, 1, -1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ShellSprite />
                  </motion.div>
                )}
                {cell === "rock" && <RockSprite />}
                {cell === "hazard" && (
                  <motion.div
                    animate={{ y: [-3, 3, -3], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <JellyfishSprite />
                  </motion.div>
                )}
                {cell === "goal" && (
                  <motion.div
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <TreasureSprite />
                  </motion.div>
                )}
                {cell === "collected" && (
                  <motion.div
                    initial={{ scale: 1.5, opacity: 0.8 }}
                    animate={{ scale: 0.5, opacity: 0.15, rotate: 180 }}
                    transition={{ duration: 1 }}
                  >
                    <CollectedSparkle />
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          );
        })
      )}

      {/* ── Submarine (animated to its position) ──────────────── */}
      <motion.div
        className="absolute z-10 flex items-center justify-center"
        style={{ width: cellSize, height: cellSize }}
        animate={{
          left: offset.x + subPos.col * cellSize,
          top: offset.y + subPos.row * cellSize,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      >
        {/* Glow halo under submarine */}
        <div
          className="absolute w-14 h-8 rounded-full blur-md"
          style={{ background: "radial-gradient(ellipse, rgba(94,212,245,0.25), transparent)" }}
        />
        <motion.div
          animate={{
            y: [-2, 2, -2],
            rotate: DIRECTION_ROTATION[direction] ?? 0,
          }}
          transition={{
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { type: "spring", stiffness: 180, damping: 18 },
          }}
        >
          <SubmarineSprite isRunning={isRunning} />
        </motion.div>

        {/* Propeller bubbles when running */}
        {isRunning && (
          <>
            <motion.div
              className="absolute right-1 rounded-full bg-cyan-300/40"
              style={{ width: 5, height: 5 }}
              animate={{ x: [0, 18], opacity: [0.6, 0], scale: [1, 0.3] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute right-2 top-3 rounded-full bg-cyan-200/30"
              style={{ width: 3, height: 3 }}
              animate={{ x: [0, 14], opacity: [0.4, 0], scale: [1, 0.2] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: 0.15 }}
            />
            <motion.div
              className="absolute right-0 bottom-3 rounded-full bg-cyan-300/30"
              style={{ width: 4, height: 4 }}
              animate={{ x: [0, 20], opacity: [0.5, 0], scale: [1, 0.2] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </motion.div>

      {/* ── Legend (floating at bottom of the full area) ────────── */}
      <div className="absolute bottom-2 left-0 right-0 flex gap-4 justify-center flex-wrap z-20 pointer-events-none">
        {[
          { sprite: <SubmarineSprite isRunning={false} />, label: "Submarine", w: 26 },
          { sprite: <ShellSprite />, label: "Sample", w: 16 },
          { sprite: <RockSprite />, label: "Rock", w: 20 },
          { sprite: <JellyfishSprite />, label: "Hazard", w: 16 },
          { sprite: <TreasureSprite />, label: "Goal", w: 18 },
        ].map(({ sprite, label, w }) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-white/60 bg-black/25 px-2 py-1 rounded-full backdrop-blur-sm">
            <div style={{ width: w, height: w * 0.8 }} className="flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
              {sprite}
            </div>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OceanGrid;
