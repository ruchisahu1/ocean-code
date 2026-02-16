import { motion } from "framer-motion";

interface StatusBarProps {
  oxygen: number;
  collected: number;
  target: number;
}

const StatusBar = ({ oxygen, collected, target }: StatusBarProps) => {
  const oxygenColor =
    oxygen > 60 ? "bg-oxygen" : oxygen > 30 ? "bg-warning" : "bg-danger";

  return (
    <div className="flex items-center gap-6">
      {/* Oxygen */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-display tracking-wider text-muted-foreground">O₂</span>
        <div className="w-24 h-2.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${oxygenColor} transition-colors`}
            animate={{ width: `${oxygen}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono">{oxygen}%</span>
      </div>

      {/* Collected */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm">🐚</span>
        <span className="text-xs font-display tracking-wider text-foreground">
          {collected}/{target}
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
