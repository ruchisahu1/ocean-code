import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Star, ChevronDown, ChevronRight } from "lucide-react";
import Bubbles from "@/components/Bubbles";
import { LEVELS } from "@/hooks/useGameState";

interface World {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  levels: number;
  unlocked: boolean;
  concept: string;
  glowClass: string;
  icon: string;
}

const worlds: World[] = [
  {
    id: 1,
    name: "Coral Reef",
    subtitle: "Shallow Waters",
    description: "Learn basic movement commands and collect your first ocean samples among vibrant coral formations.",
    levels: 5,
    unlocked: true,
    concept: "Variables & Movement",
    glowClass: "box-glow-cyan",
    icon: "🐠",
  },
  {
    id: 2,
    name: "Sunken Ship",
    subtitle: "The Wreckage",
    description: "Navigate through ship corridors using loops to systematically explore every room and find hidden treasure.",
    levels: 5,
    unlocked: true,
    concept: "Loops",
    glowClass: "box-glow-green",
    icon: "🚢",
  },
  {
    id: 3,
    name: "Deep Sea Cave",
    subtitle: "Dark Passages",
    description: "Use conditionals to detect and avoid dangers lurking in the dark caves of the ocean floor.",
    levels: 5,
    unlocked: true,
    concept: "Conditionals",
    glowClass: "box-glow-purple",
    icon: "🦑",
  },
  {
    id: 4,
    name: "Trench Exploration",
    subtitle: "The Abyss",
    description: "Create functions for complex submarine maneuvers as you descend into the deepest ocean trench.",
    levels: 5,
    unlocked: false,
    concept: "Functions",
    glowClass: "box-glow-amber",
    icon: "🐙",
  },
  {
    id: 5,
    name: "Rescue Mission",
    subtitle: "Final Challenge",
    description: "Combine all your skills to navigate treacherous waters and rescue trapped deep-sea divers.",
    levels: 5,
    unlocked: false,
    concept: "Combined Skills",
    glowClass: "box-glow-cyan",
    icon: "🏊",
  },
];

/** Get the available level keys for a given world id from LEVELS */
function getWorldLevels(worldId: number) {
  const levels: { key: string; levelNum: number; title: string }[] = [];
  for (let l = 1; l <= 10; l++) {
    const key = `${worldId}-${l}`;
    if (LEVELS[key]) {
      levels.push({ key, levelNum: l, title: LEVELS[key].title });
    }
  }
  return levels;
}

const WorldSelection = () => {
  const navigate = useNavigate();
  const [expandedWorld, setExpandedWorld] = useState<number | null>(null);

  const handleWorldClick = (world: World) => {
    if (!world.unlocked) return;
    setExpandedWorld(expandedWorld === world.id ? null : world.id);
  };

  return (
    <div className="relative min-h-screen ocean-gradient-deep overflow-hidden">
      <Bubbles count={15} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-primary transition-colors text-sm mb-6 inline-flex items-center gap-1"
          >
            ← Back to Surface
          </button>
          <h1 className="font-display text-3xl md:text-4xl font-bold glow-cyan tracking-wider">
            SELECT YOUR WORLD
          </h1>
          <p className="text-muted-foreground mt-2">
            Choose an ocean zone to begin your coding adventure
          </p>
        </motion.div>

        {/* World cards */}
        <div className="grid gap-5">
          {worlds.map((world, i) => {
            const isExpanded = expandedWorld === world.id;
            const levels = getWorldLevels(world.id);

            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`w-full text-left rounded-xl border transition-all ${
                    world.unlocked
                      ? `border-border/50 bg-card/60 backdrop-blur-sm ${isExpanded ? "border-primary/40" : "hover:border-primary/40"}`
                      : "border-border/20 bg-card/20 opacity-50"
                  }`}
                >
                  {/* World header — click to expand */}
                  <button
                    onClick={() => handleWorldClick(world)}
                    disabled={!world.unlocked}
                    className="w-full text-left p-5 md:p-6 cursor-pointer disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="text-4xl md:text-5xl">{world.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="font-display text-lg font-semibold text-foreground tracking-wide">
                            World {world.id}: {world.name}
                          </h2>
                          {!world.unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                        </div>
                        <div className="text-sm text-primary/70 font-medium mb-1">{world.subtitle}</div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{world.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {world.concept}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="w-3 h-3" /> {world.levels} levels
                          </span>
                        </div>
                      </div>
                      {world.unlocked && (
                        <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </motion.div>
                      )}
                    </div>
                  </button>

                  {/* Level selector — expands below the header */}
                  <AnimatePresence>
                    {isExpanded && world.unlocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 md:px-6 md:pb-6 pt-0">
                          <div className="border-t border-border/30 pt-4">
                            <p className="text-xs text-muted-foreground mb-3 font-display tracking-wider uppercase">
                              Select a Level
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                              {Array.from({ length: world.levels }, (_, idx) => {
                                const levelNum = idx + 1;
                                const levelInfo = levels.find((l) => l.levelNum === levelNum);
                                const available = !!levelInfo;

                                return (
                                  <button
                                    key={levelNum}
                                    onClick={() => available && navigate(`/game/${world.id}/${levelNum}`)}
                                    disabled={!available}
                                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                                      available
                                        ? "border-border/40 bg-background/30 hover:border-primary/50 hover:bg-primary/10 cursor-pointer group"
                                        : "border-border/20 bg-background/10 opacity-40 cursor-not-allowed"
                                    }`}
                                  >
                                    <span
                                      className={`font-display text-lg font-bold ${
                                        available
                                          ? "text-primary group-hover:text-primary/90"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      {levelNum}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground leading-tight text-center truncate w-full">
                                      {available ? levelInfo.title : "Coming soon"}
                                    </span>
                                    {available && (
                                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary absolute top-1.5 right-1.5 transition-colors" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorldSelection;
