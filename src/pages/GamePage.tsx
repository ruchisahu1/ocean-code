import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion, CompletionContext } from "@codemirror/autocomplete";
import { EditorView, Decoration, DecorationSet } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";
import { Play, RotateCcw, ArrowLeft, Lightbulb, HelpCircle, Volume2, VolumeX, BookOpen, ChevronRight, Gauge, FastForward, X } from "lucide-react";
import OceanGrid from "@/components/game/OceanGrid";
import OceanScene from "@/components/game/OceanScene";
import ShipScene from "@/components/game/ShipScene";
import CaveScene from "@/components/game/CaveScene";
import TrenchScene from "@/components/game/TrenchScene";
import AbyssScene from "@/components/game/AbyssScene";
import StatusBar from "@/components/game/StatusBar";
import OutputConsole from "@/components/game/OutputConsole";
import TutorialOverlay from "@/components/game/TutorialOverlay";
import ConceptPanel from "@/components/game/ConceptPanel";
import WorkedExample from "@/components/game/WorkedExample";
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
    scanWarning,
    functionWarning,
    nestedLoopWarning,
    elifWarning,
    direction,
    currentLine,
    failCount,
    speed,
    setSpeed,
    isStepping,
    runCode,
    startStep,
    executeStep,
    reset,
  } = useGameState(levelData);

  const levelKey = `${wId}-${lId}`;
  const nextLevelKey = `${wId}-${lId + 1}`;
  const hasNextLevel = LEVELS[nextLevelKey] !== undefined;

  const [code, setCode] = useState(levelData.starterCode);
  const [hintLevel, setHintLevel] = useState(0); // 0=hidden, 1-3=hint levels
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showConcepts, setShowConcepts] = useState(false);
  const [showWorkedExample, setShowWorkedExample] = useState(false);
  const [stuckDismissed, setStuckDismissed] = useState(false);
  const [hintToastVisible, setHintToastVisible] = useState(false);
  const hintToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMultiHints = !!levelData.hints;
  const maxHintLevel = hasMultiHints ? 3 : 1;

  // Reset editor code when navigating to a new level
  useEffect(() => {
    setCode(levelData.starterCode);
    setHintLevel(0);
    setStuckDismissed(false);
    setHintToastVisible(false);
  }, [levelData]);

  // Re-show stuck popup when failCount increases; hide hint toast so it doesn't overlap
  useEffect(() => {
    if (failCount > 0) {
      setStuckDismissed(false);
      setHintToastVisible(false);
    }
  }, [failCount]);

  // Hint button click: advance hint, show toast, dismiss stuck popup
  const handleHintClick = useCallback(() => {
    if (hintLevel >= maxHintLevel) return;
    const next = hintLevel + 1;
    setHintLevel(next);
    setStuckDismissed(true); // dismiss stuck popup
    setHintToastVisible(true);
    // auto-dismiss toast after 8 seconds
    if (hintToastTimer.current) clearTimeout(hintToastTimer.current);
    hintToastTimer.current = setTimeout(() => setHintToastVisible(false), 8000);
  }, [hintLevel, maxHintLevel]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => { if (hintToastTimer.current) clearTimeout(hintToastTimer.current); };
  }, []);

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

  const handleStep = useCallback(() => {
    if (!isStepping) {
      startStep(code);
    } else {
      executeStep(code);
    }
  }, [code, isStepping, startStep, executeStep]);

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

  /* ── Line highlight extension for step mode ──────────────────── */
  const setHighlightLine = useMemo(() => StateEffect.define<number | null>(), []);

  const highlightLineField = useMemo(() => StateField.define<DecorationSet>({
    create() { return Decoration.none; },
    update(decos, tr) {
      for (const e of tr.effects) {
        if (e.is(setHighlightLine)) {
          if (e.value === null) return Decoration.none;
          const lineNum = e.value + 1;
          if (lineNum < 1 || lineNum > tr.state.doc.lines) return Decoration.none;
          const line = tr.state.doc.line(lineNum);
          return Decoration.set([
            Decoration.line({ class: "cm-step-highlight" }).range(line.from),
          ]);
        }
      }
      return decos;
    },
    provide: (f) => EditorView.decorations.from(f),
  }), [setHighlightLine]);

  const editorRef = useRef<{ view?: EditorView }>(null);

  useEffect(() => {
    const view = editorRef.current?.view;
    if (view) {
      view.dispatch({ effects: setHighlightLine.of(currentLine) });
    }
  }, [currentLine, setHighlightLine]);

  return (
    <div className="min-h-screen ocean-gradient-water flex flex-col">
      <TutorialOverlay isOpen={showTutorial} onClose={() => setShowTutorial(false)} levelKey={levelKey} />
      <ConceptPanel isOpen={showConcepts} onClose={() => setShowConcepts(false)} worldId={wId} />

      {/* Top bar */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-border/40 backdrop-blur-sm ${wId === 5 ? "aurora-shimmer-bg" : "bg-card/40"}`} data-tutorial="status-bar">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/worlds")}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-display text-sm font-semibold tracking-wider text-foreground">
                World {wId} – Level {lId}
              </h1>
              <p className="text-xs text-muted-foreground">{levelData.title}</p>
            </div>
            {wId === 5 && (
              <span className="px-2 py-0.5 rounded text-[9px] font-display tracking-widest text-rose-300 border border-rose-400/30 bg-rose-500/10 uppercase">
                Final World
              </span>
            )}
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
            onClick={() => setShowConcepts(true)}
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Code reference"
          >
            <BookOpen className="w-4 h-4" />
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
          {wId === 5 ? <AbyssScene /> : wId === 4 ? <TrenchScene /> : wId === 3 ? <CaveScene /> : wId === 2 ? <ShipScene /> : <OceanScene />}
          {/* Game entities live directly in the ocean — no container */}
          <OceanGrid
            grid={grid}
            subPos={subPos}
            isRunning={isRunning}
            isComplete={isComplete}
            direction={direction}
            worldId={wId}
          />
        </div>

        {/* Right: Code editor */}
        <div className="lg:w-[40%] flex flex-col border-l border-border/30 relative">
          {/* Mission brief */}
          <div className="p-4 border-b border-border/30 bg-card/30" data-tutorial="mission-brief">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display tracking-wider text-primary uppercase">Mission Brief</span>
              <button
                onClick={handleHintClick}
                disabled={hintLevel >= maxHintLevel}
                className={`text-xs flex items-center gap-1 transition-colors ${
                  hintLevel >= maxHintLevel
                    ? "text-muted-foreground/50 cursor-default"
                    : "text-warning hover:text-warning/80"
                }`}
                data-hint-button
              >
                <Lightbulb className="w-3 h-3" />
                {hintLevel >= maxHintLevel
                  ? "All hints used"
                  : hintLevel === 0
                  ? "Hint"
                  : hasMultiHints
                  ? `Hint ${hintLevel}/${maxHintLevel}`
                  : "Hint"}
              </button>
            </div>
            <p className="text-sm text-secondary-foreground">{levelData.mission}</p>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0 overflow-hidden" data-tutorial="code-editor">
            <CodeMirror
              ref={editorRef as React.Ref<any>}
              value={code}
              onChange={setCode}
              extensions={[python(), subCompletions, highlightLineField]}
              theme={oneDark}
              height="100%"
              className="h-full text-sm [&_.cm-scroller]:overflow-auto"
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                highlightActiveLine: true,
                completionKeymap: true,
              }}
            />
          </div>

          {/* Floating hint toast */}
          <AnimatePresence>
            {hintToastVisible && hintLevel > 0 && (
              <motion.div
                key={`hint-toast-${hintLevel}`}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="absolute top-[72px] left-3 right-3 z-30"
              >
                <div
                  className={`relative rounded-xl border p-3 pr-8 backdrop-blur-md shadow-lg ${
                    hintLevel === 1
                      ? "border-warning/30 bg-warning/10 shadow-warning/10"
                      : hintLevel === 2
                      ? "border-primary/30 bg-primary/10 shadow-primary/10"
                      : "border-accent/30 bg-accent/10 shadow-accent/10"
                  }`}
                >
                  <button
                    onClick={() => setHintToastVisible(false)}
                    className="absolute top-2 right-2 text-muted-foreground/60 hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-start gap-2">
                    <span className="text-sm shrink-0">
                      {hintLevel === 1 ? "\uD83D\uDCA1" : hintLevel === 2 ? "\uD83D\uDD27" : "\uD83D\uDCDD"}
                    </span>
                    <div>
                      {hasMultiHints && (
                        <span className={`text-[10px] font-display tracking-wider uppercase mb-0.5 block ${
                          hintLevel === 1 ? "text-warning/70" : hintLevel === 2 ? "text-primary/70" : "text-accent/80"
                        }`}>
                          Hint {hintLevel}/{maxHintLevel}
                        </span>
                      )}
                      <p className={`text-xs leading-relaxed whitespace-pre-line ${
                        hintLevel === 1
                          ? "text-warning/90"
                          : hintLevel === 2
                          ? "text-primary/90"
                          : "text-accent/90 font-mono"
                      }`}>
                        {hasMultiHints ? levelData.hints![hintLevel - 1] : levelData.hint}
                      </p>
                    </div>
                  </div>
                  {hasMultiHints && hintLevel < maxHintLevel && (
                    <button
                      onClick={handleHintClick}
                      className="mt-2 text-[10px] text-muted-foreground hover:text-warning transition-colors"
                    >
                      Need more help? Click for next hint {"\u2192"}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center gap-2 p-3 border-t border-border/30 bg-card/30 flex-wrap">
            {!isStepping ? (
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-display text-xs tracking-wider font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 box-glow-green"
                data-tutorial="run-button"
              >
                <Play className="w-4 h-4" /> RUN
              </button>
            ) : (
              <button
                onClick={handleStep}
                disabled={!isRunning}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-display text-xs tracking-wider font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 box-glow-green"
              >
                <ChevronRight className="w-4 h-4" /> NEXT STEP
              </button>
            )}
            <button
              onClick={handleStep}
              disabled={isRunning && !isStepping}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-primary/30 text-primary/80 hover:text-primary hover:border-primary/50 transition-all disabled:opacity-40"
              title="Step through code line by line"
            >
              <FastForward className="w-3.5 h-3.5" /> {isStepping ? "STEPPING" : "STEP"}
            </button>
            <button
              onClick={() => { reset(); setCode(levelData.starterCode); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            {/* Speed toggle */}
            <button
              onClick={() => setSpeed(speed === "slow" ? "normal" : speed === "normal" ? "fast" : "slow")}
              className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-all"
              title={`Speed: ${speed}`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span className="uppercase text-[10px] font-display tracking-wider">{speed}</span>
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

          {/* Stuck popup — Phase 1: guide to hints (after 3 fails, hints not exhausted) */}
          <AnimatePresence>
            {failCount >= 3 && !isComplete && !stuckDismissed && hintLevel < maxHintLevel && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 pointer-events-none"
              >
                {/* Arrow sitting right below the Hint button, pointing up at it */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[38px] right-[10px]"
                >
                  <svg width="40" height="48" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id="arrowGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <path d="M20 0 L32 16 L24 16 L24 48 L16 48 L16 16 L8 16 Z" fill="#FBBF24" filter="url(#arrowGlow)" />
                    <path d="M20 0 L32 16 L24 16 L24 48 L16 48 L16 16 L8 16 Z" fill="#FCD34D" />
                  </svg>
                </motion.div>

                {/* Popup card centered in editor area */}
                <motion.div
                  initial={{ y: 10, scale: 0.95 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 6, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="absolute top-[100px] left-4 right-4 flex justify-center pointer-events-none"
                >
                  <div className="pointer-events-auto w-52 rounded-xl border border-warning/30 bg-card/95 backdrop-blur-md shadow-lg shadow-warning/15 p-3 relative">
                    <button
                      onClick={() => setStuckDismissed(true)}
                      className="absolute top-1.5 right-1.5 text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="text-xs text-muted-foreground leading-relaxed pr-4">
                      <span className="text-sm">{"\uD83E\uDD14"}</span> <span className="text-warning font-semibold">Are you stuck?</span>
                      <br />
                      Click the <span className="text-warning font-semibold">Hint</span> button above for help!
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stuck popup — Phase 2: offer worked example (all hints used + still failing) */}
          <AnimatePresence>
            {failCount >= 3 && !isComplete && !stuckDismissed && hintLevel >= maxHintLevel && levelData.walkedExample && !showWorkedExample && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="absolute inset-x-0 top-[80px] z-30 flex justify-center pointer-events-none"
              >
                <div className="pointer-events-auto w-60 rounded-xl border border-accent/30 bg-card/95 backdrop-blur-md shadow-lg shadow-accent/15 p-3.5 relative">
                  <button
                    onClick={() => setStuckDismissed(true)}
                    className="absolute top-2 right-2 text-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-2.5 pr-5">
                    <span className="text-sm">{"\uD83D\uDCAA"}</span> <span className="text-accent font-semibold">Still stuck?</span>
                    <br />
                    Let us walk you through it step by step!
                  </div>
                  <button
                    onClick={() => { setShowWorkedExample(true); setStuckDismissed(true); setHintToastVisible(false); }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-display font-semibold tracking-wider text-card bg-accent hover:bg-accent/90 transition-all"
                  >
                    Yes, show me how!
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Console output */}
          <div data-tutorial="console-output">
            <OutputConsole output={output} />
          </div>
        </div>
      </div>

      {/* Worked Example modal */}
      {levelData.walkedExample && (
        <WorkedExample
          isOpen={showWorkedExample}
          onClose={() => setShowWorkedExample(false)}
          steps={levelData.walkedExample.steps}
          onTryIt={(code) => setCode(code)}
        />
      )}

      {/* Scan-required warning popup */}
      <AnimatePresence>
        {scanWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative mx-4 max-w-md rounded-2xl border border-warning/40 bg-card p-6 shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(250,180,50,0.15)" }}
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-3xl">
                  {"\uD83D\uDD0D"}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold tracking-wide text-warning">
                  Sonar Scanner Required!
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  You reached the treasure — nice navigation! But in the{" "}
                  <span className="font-semibold text-foreground">Deep Sea Cave</span>,
                  you <span className="font-semibold text-foreground">must</span> use
                  your sonar to scan for danger.
                </p>
                <div className="mb-4 rounded-lg bg-muted/50 px-4 py-3 text-left font-mono text-xs leading-relaxed text-primary">
                  <span className="text-warning">if</span> sub.scan_right() =={" "}
                  <span className="text-green-400">{'"safe"'}</span>:<br />
                  {"    "}sub.move_right()<br />
                  <span className="text-warning">else</span>:<br />
                  {"    "}sub.move_down()
                </div>
                <p className="mb-5 text-xs text-muted-foreground">
                  Add an <span className="font-semibold text-warning">if sub.scan_*()</span> check
                  to your code and try again!
                </p>
                <button
                  onClick={() => { reset(); setCode(levelData.starterCode); }}
                  className="rounded-lg bg-warning px-6 py-2.5 font-display text-sm font-semibold tracking-wider text-black transition-all hover:brightness-110"
                >
                  GOT IT — TRY AGAIN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Function-required warning popup */}
      <AnimatePresence>
        {functionWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative mx-4 max-w-md rounded-2xl border border-cyan-400/40 bg-card p-6 shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(80,200,220,0.15)" }}
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/15 text-3xl">
                  {"\uD83D\uDCE6"}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold tracking-wide text-cyan-400">
                  Function Required!
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  You reached the treasure — great job! But in the{" "}
                  <span className="font-semibold text-foreground">Deep Trench</span>,
                  you <span className="font-semibold text-foreground">must</span> define
                  a function to organize your code.
                </p>
                <div className="mb-4 rounded-lg bg-muted/50 px-4 py-3 text-left font-mono text-xs leading-relaxed text-primary">
                  <span className="text-cyan-400">def</span> my_move():<br />
                  {"    "}sub.move_right()<br />
                  {"    "}sub.move_down()<br />
                  <br />
                  my_move()
                </div>
                <p className="mb-5 text-xs text-muted-foreground">
                  Define a function with <span className="font-semibold text-cyan-400">def name():</span> and
                  call it to complete the level!
                </p>
                <button
                  onClick={() => { reset(); setCode(levelData.starterCode); }}
                  className="rounded-lg bg-cyan-500 px-6 py-2.5 font-display text-sm font-semibold tracking-wider text-black transition-all hover:brightness-110"
                >
                  GOT IT — TRY AGAIN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nested-loop-required warning popup */}
      <AnimatePresence>
        {nestedLoopWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative mx-4 max-w-md rounded-2xl border border-rose-400/40 bg-card p-6 shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(255,100,150,0.15)" }}
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-400/15 text-3xl">
                  {"\uD83D\uDD01"}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold tracking-wide text-rose-400">
                  Nested Loop Required!
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  Great navigation! But this mission requires a{" "}
                  <span className="font-semibold text-foreground">nested loop</span>{" "}
                  — a loop inside another loop.
                </p>
                <div className="mb-4 rounded-lg bg-muted/50 px-4 py-3 text-left font-mono text-xs leading-relaxed text-primary">
                  <span className="text-rose-400">for</span> i in range(3):<br />
                  {"    "}<span className="text-rose-400">for</span> j in range(2):<br />
                  {"        "}sub.move_right()<br />
                  {"    "}sub.move_down()
                </div>
                <p className="mb-5 text-xs text-muted-foreground">
                  Put a <span className="font-semibold text-rose-400">for loop inside another for loop</span>{" "}
                  to complete this level!
                </p>
                <button
                  onClick={() => { reset(); setCode(levelData.starterCode); }}
                  className="rounded-lg bg-rose-500 px-6 py-2.5 font-display text-sm font-semibold tracking-wider text-black transition-all hover:brightness-110"
                >
                  GOT IT — TRY AGAIN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* elif-required warning popup */}
      <AnimatePresence>
        {elifWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative mx-4 max-w-md rounded-2xl border border-purple-400/40 bg-card p-6 shadow-2xl"
              style={{ boxShadow: "0 0 40px rgba(160,100,255,0.15)" }}
            >
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-purple-400/15 text-3xl">
                  {"\uD83D\uDEE4\uFE0F"}
                </div>
                <h3 className="mb-2 font-display text-lg font-bold tracking-wide text-purple-400">
                  elif Required!
                </h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  Nice work reaching the goal! But this mission needs{" "}
                  <span className="font-semibold text-foreground">elif</span>{" "}
                  for multi-branch decisions — checking more than two options.
                </p>
                <div className="mb-4 rounded-lg bg-muted/50 px-4 py-3 text-left font-mono text-xs leading-relaxed text-primary">
                  <span className="text-purple-400">if</span> sub.scan_down() =={" "}
                  <span className="text-green-400">{'"safe"'}</span>:<br />
                  {"    "}sub.move_down()<br />
                  <span className="text-purple-400">elif</span> sub.scan_right() =={" "}
                  <span className="text-green-400">{'"safe"'}</span>:<br />
                  {"    "}sub.move_right()<br />
                  <span className="text-purple-400">else</span>:<br />
                  {"    "}sub.move_left()
                </div>
                <p className="mb-5 text-xs text-muted-foreground">
                  Add <span className="font-semibold text-purple-400">elif</span> between your if and else
                  to check a second condition!
                </p>
                <button
                  onClick={() => { reset(); setCode(levelData.starterCode); }}
                  className="rounded-lg bg-purple-500 px-6 py-2.5 font-display text-sm font-semibold tracking-wider text-white transition-all hover:brightness-110"
                >
                  GOT IT — TRY AGAIN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePage;
