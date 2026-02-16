import { useRef, useEffect } from "react";

interface OutputConsoleProps {
  output: string[];
}

const OutputConsole = ({ output }: OutputConsoleProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <div className="h-28 overflow-auto bg-background/80 border-t border-border/30 p-3 font-mono text-xs">
      <div className="text-muted-foreground mb-1 font-display text-[10px] tracking-wider uppercase">
        Console Output
      </div>
      {output.length === 0 ? (
        <div className="text-muted-foreground/50 italic">Run your code to see output...</div>
      ) : (
        output.map((line, i) => (
          <div
            key={i}
            className={`${
              line.startsWith("✓") ? "text-success" :
              line.startsWith("✗") ? "text-danger" :
              line.startsWith("🐚") || line.startsWith("⚠") ? "text-warning" :
              "text-foreground/80"
            }`}
          >
            {line}
          </div>
        ))
      )}
      <div ref={endRef} />
    </div>
  );
};

export default OutputConsole;
