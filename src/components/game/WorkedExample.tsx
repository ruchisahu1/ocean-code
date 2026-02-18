import { motion, AnimatePresence } from "framer-motion";
import { X, Eye } from "lucide-react";

interface WorkedExampleProps {
  isOpen: boolean;
  onClose: () => void;
  steps: { text: string; code: string }[];
  onTryIt: (code: string) => void;
}

const WorkedExample = ({ isOpen, onClose, steps, onTryIt }: WorkedExampleProps) => {
  const buildPartialSolution = () => {
    return steps
      .map((s) => `# ${s.text}\n${s.code}`)
      .join("\n\n");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="bg-card border border-accent/30 rounded-2xl p-5 shadow-2xl">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
                  <Eye className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold tracking-wider text-accent">
                    Worked Example
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Here's how to solve this level, step by step
                  </p>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3 mb-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="rounded-lg border border-border/30 overflow-hidden">
                    {/* Step header */}
                    <div className="px-3 py-2 bg-muted/30 border-b border-border/20">
                      <span className="text-xs font-display font-semibold text-foreground">
                        Step {idx + 1}:
                      </span>{" "}
                      <span className="text-xs text-secondary-foreground">{step.text}</span>
                    </div>
                    {/* Code */}
                    <div className="px-3 py-2 font-mono text-xs leading-relaxed bg-background/50">
                      {step.code.split("\n").map((line, li) => (
                        <div
                          key={li}
                          className={
                            line.trim().startsWith("#")
                              ? "text-muted-foreground"
                              : line.includes("___")
                              ? "text-warning"
                              : "text-cyan-300"
                          }
                        >
                          {line || "\u00A0"}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onTryIt(buildPartialSolution());
                    onClose();
                  }}
                  className="flex-1 rounded-lg bg-accent/15 border border-accent/30 px-4 py-2.5 font-display text-xs font-semibold tracking-wider text-accent transition-all hover:bg-accent/25"
                >
                  TRY THIS CODE
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-border/50 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
              </div>

              <p className="mt-3 text-[10px] text-muted-foreground text-center">
                Look for the ___ blanks — you fill in the missing numbers!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkedExample;
