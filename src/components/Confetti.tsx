import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Confetti = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    delay: number;
    color: string;
    size: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const colors = [
      "hsl(var(--primary))",
      "hsl(var(--accent))",
      "hsl(var(--success))",
      "hsl(var(--warning))",
    ];

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      duration: Math.random() * 2 + 2,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: "-20px",
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            animation: `confetti-fall ${particle.duration}s linear ${particle.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};
