import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { Play, RotateCcw, ArrowLeft, Lightbulb, HelpCircle, Volume2, VolumeX } from "lucide-react";
import OceanGrid from "@/components/game/OceanGrid";
import OceanScene from "@/components/game/OceanScene";
import ShipScene from "@/components/game/ShipScene";
import StatusBar from "@/components/game/StatusBar";
import OutputConsole from "@/components/game/OutputConsole";
import TutorialOverlay from "@/components/game/TutorialOverlay";
import { useGameState, LEVELS } from "@/hooks/useGameState";
import { playRunSound, playCompleteSound } from "@/hooks/useSoundEffects";

const GamePage = () => {
  const { worldId, levelId } = useParams();
  const navigate = useNavigate();
  const wId = Number(worldId) || 1;
  const lId = Number(levelId) || 1;

  const levelData = LEVELS[`${wId}-${lId}`] || LEVELS["1-1"];

  const {
    grid,
    subPos,
    oxygen,
    collected,
    output,
    isRunning,
    isComplete,
    direction,
    runCode,
    reset,
  } = useGameState(levelData);

  const levelKey = `${wId}-${lId}`;
  const nextLevelKey = `${wId}-${lId + 1}`;
  const hasNextLevel = LEVELS[nextLevelKey] !== undefined;

  const [code, setCode] = useState(levelData.starterCode);
  const [showHint, setShowHint] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reset editor code when navigating to a new level
  useEffect(() => {
    setCode(levelData.starterCode);
    setShowHint(false);
  }, [levelData]);

  // Show tutorial when entering a level for the first time
  useEffect(() => {
    const seenKey = `ocean-tutorial-${levelKey}`;
    const seen = localStorage.getItem(seenKey);
    if (!seen) {
      setShowTutorial(true);
      localStorage.setItem(seenKey, "1");
    }
  }, [levelKey]);

  // Play completion sound
  useEffect(() => {
    if (isComplete && soundEnabled) playCompleteSound();
  }, [isComplete, soundEnabled]);

  const handleRun = useCallback(() => {
    if (soundEnabled) playRunSound();
    runCode(code);
  }, [code, runCode, soundEnabled]);

  /* ── Autocomplete extension for submarine commands ─────────── */
  const subCompletions = useMemo(() => {
    const commands = [
      { label: "sub.move_right()", type: "function", detail: "Move submarine right" },
      { label: "sub.move_left()", type: "function", detail: "Move submarine left" },
      { label: "sub.move_up()", type: "function", detail: "Move submarine up" },
      { label: "sub.move_down()", type: "function", detail: "Move submarine down" },
      { label: "sub.scan_right()", type: "function", detail: 'Scan right → "safe" or "danger"' },
      { label: "sub.scan_down()", type: "function", detail: 'Scan down → "safe" or "danger"' },
      { label: "for i in range():", type: "keyword", detail: "Loop N times" },
      { label: 'if sub.scan_right() == "safe":', type: "keyword", detail: "Check before moving" },
      { label: 'if sub.scan_down() == "safe":', type: "keyword", detail: "Check before moving" },
    ];

    function subComplete(context: CompletionContext) {
      // Match any word characters, dots, underscores, or parens typed so far
      const word = context.matchBefore(/[\w.()"]*/);
      if (!word || (word.from === word.to && !context.explicit)) return null;
      return {
        from: word.from,
        options: commands,
        filter: true,
      };
    }

    return autocompletion({
      override: [subComplete],
      activateOnTyping: true,
      defaultKeymap: true,
    });
  }, []);

  return (
    <div className="min-h-screen ocean-gradient-water flex flex-col">
      <TutorialOverlay isOpen={showTutorial} onClose={() => setShowTutorial(false)} levelKey={levelKey} />

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-card/40 backdrop-blur-sm" data-tutorial="status-bar">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/worlds")}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-sm font-semibold tracking-wider text-foreground">
              World {wId} – Level {lId}
            </h1>
            <p className="text-xs text-muted-foreground">{levelData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBar oxygen={oxygen} collected={collected} target={levelData.targetCollect} />
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-muted-foreground hover:text-primary transition-colors"
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Show tutorial"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content — Ocean grid LEFT, Code editor RIGHT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Full-bleed ocean world — no box, no border, edge-to-edge */}
        <div className="lg:w-[60%] relative overflow-hidden">
          {/* Animated scene background — changes per world */}
          {wId === 2 ? <ShipScene /> : <OceanScene />}
          {/* Game entities live directly in the ocean — no container */}
          <OceanGrid
            grid={grid}
            subPos={subPos}
            isRunning={isRunning}
            isComplete={isComplete}
            direction={direction}
          />
        </div>

        {/* Right: Code editor */}
        <div className="lg:w-[40%] flex flex-col border-l border-border/30">
          {/* Mission brief */}
          <div className="p-4 border-b border-border/30 bg-card/30" data-tutorial="mission-brief">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display tracking-wider text-primary uppercase">Mission Brief</span>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-xs flex items-center gap-1 text-warning hover:text-warning/80 transition-colors"
              >
                <Lightbulb className="w-3 h-3" /> Hint
              </button>
            </div>
            <p className="text-sm text-secondary-foreground">{levelData.mission}</p>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2"
              >
                <div className="text-xs text-warning/70 pl-3 border-l-2 border-warning/30 bg-warning/5 p-2 rounded-r-lg">
                  💡 {levelData.hint}
                </div>
              </motion.div>
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-auto" data-tutorial="code-editor">
            <CodeMirror
              value={code}
              onChange={setCode}
              extensions={[python(), subCompletions]}
              theme={oneDark}
              height="100%"
              className="h-full text-sm"
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                highlightActiveLine: true,
                completionKeymap: true,
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 p-3 border-t border-border/30 bg-card/30">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-display text-xs tracking-wider font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 box-glow-green"
              data-tutorial="run-button"
            >
              <Play className="w-4 h-4" /> RUN
            </button>
            <button
              onClick={() => { reset(); setCode(levelData.starterCode); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            {isComplete && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() =>
                  hasNextLevel
                    ? navigate(`/game/${wId}/${lId + 1}`)
                    : navigate("/worlds")
                }
                className="ml-auto px-5 py-2 rounded-lg font-display text-xs tracking-wider font-semibold bg-primary text-primary-foreground box-glow-cyan"
              >
                {hasNextLevel ? "NEXT LEVEL →" : "WORLD MAP →"}
              </motion.button>
            )}
          </div>

          {/* Console output */}
          <div data-tutorial="console-output">
            <OutputConsole output={output} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
