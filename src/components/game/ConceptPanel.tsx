import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen } from "lucide-react";

interface ConceptEntry {
  title: string;
  description: string;
  code: string;
  indent?: string;
}

const CONCEPTS_BY_WORLD: Record<number, ConceptEntry[]> = {
  1: [
    {
      title: "Movement Commands",
      description: "Move the submarine one square in any direction",
      code: "sub.move_right()\nsub.move_left()\nsub.move_down()\nsub.move_up()",
    },
  ],
  2: [
    {
      title: "Movement Commands",
      description: "Move the submarine one square in any direction",
      code: "sub.move_right()\nsub.move_left()\nsub.move_down()\nsub.move_up()",
    },
    {
      title: "For Loop",
      description: "Repeat commands N times",
      code: "for i in range(3):\n    sub.move_right()",
      indent: "The indented line (4 spaces) is what gets repeated",
    },
    {
      title: "Multi-Command Loop",
      description: "Repeat multiple commands together",
      code: "for i in range(3):\n    sub.move_right()\n    sub.move_down()",
      indent: "Both indented lines repeat together each time",
    },
    {
      title: "Chaining Loops",
      description: "Run multiple loops one after another",
      code: "for i in range(2):\n    sub.move_right()\nfor i in range(3):\n    sub.move_down()",
    },
  ],
  3: [
    {
      title: "Movement Commands",
      description: "Move the submarine one square in any direction",
      code: "sub.move_right()\nsub.move_left()\nsub.move_down()\nsub.move_up()",
    },
    {
      title: "For Loop",
      description: "Repeat commands N times",
      code: "for i in range(3):\n    sub.move_right()",
      indent: "Indented line (4 spaces) repeats",
    },
    {
      title: "Sonar Scanning",
      description: "Check the next cell before moving",
      code: 'sub.scan_right()  # Returns "safe" or "danger"\nsub.scan_down()\nsub.scan_left()\nsub.scan_up()',
    },
    {
      title: "If / Else",
      description: "Make a decision based on a scan result",
      code: 'if sub.scan_right() == "safe":\n    sub.move_right()\nelse:\n    sub.move_down()',
      indent: "if-body = 4 spaces, else-body = 4 spaces",
    },
    {
      title: "If Inside a Loop",
      description: "Scan and decide at every step automatically",
      code: 'for i in range(8):\n    if sub.scan_right() == "safe":\n        sub.move_right()\n    else:\n        sub.move_down()',
      indent: "Loop body = 4 spaces, if/else body = 8 spaces",
    },
  ],
  4: [
    {
      title: "Movement Commands",
      description: "Move the submarine one square in any direction",
      code: "sub.move_right()\nsub.move_left()\nsub.move_down()\nsub.move_up()",
    },
    {
      title: "For Loop",
      description: "Repeat commands N times",
      code: "for i in range(3):\n    sub.move_right()",
    },
    {
      title: "If / Else + Scanning",
      description: "Scan then decide which way to go",
      code: 'if sub.scan_right() == "safe":\n    sub.move_right()\nelse:\n    sub.move_down()',
    },
    {
      title: "Define a Function",
      description: "Create a reusable block of code with a name",
      code: "def my_move():\n    sub.move_right()\n    sub.move_down()",
      indent: "Function body = 4 spaces (just like a loop!)",
    },
    {
      title: "Call a Function",
      description: "Run the code inside a function by using its name",
      code: "my_move()\nmy_move()\nmy_move()",
    },
    {
      title: "Function + Loop",
      description: "Call a function inside a for loop",
      code: "for i in range(3):\n    my_move()",
      indent: "The function call is indented inside the loop",
    },
    {
      title: "Smart Function",
      description: "Put scanning logic inside a function",
      code: 'def smart_step():\n    if sub.scan_right() == "safe":\n        sub.move_right()\n    else:\n        sub.move_down()',
      indent: "def body = 4 spaces, if/else body = 8 spaces",
    },
  ],
  5: [
    {
      title: "Movement Commands",
      description: "Move the submarine one square in any direction",
      code: "sub.move_right()\nsub.move_left()\nsub.move_down()\nsub.move_up()",
    },
    {
      title: "For Loop",
      description: "Repeat commands N times",
      code: "for i in range(3):\n    sub.move_right()",
    },
    {
      title: "If / Else + Scanning",
      description: "Scan then decide which way to go",
      code: 'if sub.scan_right() == "safe":\n    sub.move_right()\nelse:\n    sub.move_down()',
    },
    {
      title: "Define & Call a Function",
      description: "Create reusable code and call it by name",
      code: "def my_move():\n    sub.move_right()\n    sub.move_down()\n\nmy_move()",
      indent: "Function body = 4 spaces",
    },
    {
      title: "Nested Loops (NEW!)",
      description: "A loop inside another loop — for 2D patterns!",
      code: "for i in range(3):\n    for j in range(2):\n        sub.move_right()\n    sub.move_down()",
      indent: "Outer body = 4 spaces, inner body = 8 spaces. The move_down is inside the outer loop but OUTSIDE the inner loop (4 spaces).",
    },
    {
      title: "elif — Multi-Branch Decisions (NEW!)",
      description: "Check a SECOND condition if the first fails. Like three doors!",
      code: 'if sub.scan_down() == "safe":\n    sub.move_down()\nelif sub.scan_right() == "safe":\n    sub.move_right()\nelse:\n    sub.move_left()',
      indent: "elif goes between if and else. Each branch body = 4 spaces (or 8 inside a loop).",
    },
    {
      title: "Smart Function + Nested Loop",
      description: "Combine elif scanning in a function with nested loops",
      code: 'def explore():\n    if sub.scan_right() == "safe":\n        sub.move_right()\n    elif sub.scan_down() == "safe":\n        sub.move_down()\n    else:\n        sub.move_left()\n\nfor i in range(3):\n    for j in range(4):\n        explore()',
      indent: "Function body = 4 spaces, elif body = 8 spaces. Nested loop inner body = 8 spaces.",
    },
  ],
};

interface ConceptPanelProps {
  isOpen: boolean;
  onClose: () => void;
  worldId: number;
}

const ConceptPanel = ({ isOpen, onClose, worldId }: ConceptPanelProps) => {
  const concepts = CONCEPTS_BY_WORLD[worldId] || CONCEPTS_BY_WORLD[1];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex justify-end"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-sm bg-card border-l border-primary/20 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border/30 bg-card/95 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h2 className="font-display text-sm tracking-wider text-primary uppercase">
                  Code Reference
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Concept list */}
            <div className="p-4 space-y-4">
              <p className="text-xs text-muted-foreground">
                All commands you can use in World {worldId}:
              </p>

              {concepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border/30 bg-background/50 overflow-hidden"
                >
                  {/* Title */}
                  <div className="px-3 py-2 bg-primary/5 border-b border-border/20">
                    <h3 className="text-xs font-display font-semibold tracking-wider text-primary">
                      {concept.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {concept.description}
                    </p>
                  </div>

                  {/* Code example */}
                  <div className="px-3 py-2 font-mono text-xs leading-relaxed">
                    {concept.code.split("\n").map((line, li) => {
                      const indent = line.match(/^(\s*)/)?.[1].length || 0;
                      const isComment = line.trim().startsWith("#");
                      return (
                        <div key={li} className="flex">
                          {/* Indent guide dots */}
                          {indent > 0 && (
                            <span className="text-border/60 select-none" style={{ width: indent * 7 }}>
                              {Array.from({ length: indent / 4 }).map((_, d) => (
                                <span key={d} className="inline-block w-[4px] text-center text-border">
                                  {"·"}
                                </span>
                              ))}
                            </span>
                          )}
                          <span className={isComment ? "text-muted-foreground" : "text-cyan-300"}>
                            {line.trimStart()}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Indent note */}
                  {concept.indent && (
                    <div className="px-3 py-1.5 border-t border-border/20 bg-accent/5">
                      <p className="text-[10px] text-accent/80">{concept.indent}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConceptPanel;
