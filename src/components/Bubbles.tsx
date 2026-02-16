import { useMemo } from "react";

const Bubbles = ({ count = 20 }: { count?: number }) => {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 12,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 8,
        opacity: 0.1 + Math.random() * 0.3,
      })),
    [count]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0 rounded-full border border-primary/20 bg-primary/5 animate-bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default Bubbles;
