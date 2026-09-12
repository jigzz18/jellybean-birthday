import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  type: "heart" | "sparkle" | "bokeh" | "note";
  noteSymbol?: string;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export default function FloatingHearts({ intensity = "normal" }: { intensity?: "gentle" | "normal" | "festive" }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particleCount = intensity === "festive" ? 55 : intensity === "gentle" ? 25 : 38;
    const colors = [
      "rgba(245, 204, 210, ", // Soft blush
      "rgba(217, 136, 148, ", // Dusty rose
      "rgba(226, 201, 116, ", // Subtle gold
      "rgba(199, 130, 141, ", // Muted coral/pink
      "rgba(255, 240, 238, ", // Warm ivory
    ];

    const noteSymbols = ["♪", "♫", "♩", "♬"];
    const particles: Particle[] = [];

    const createParticle = (initialRandomY = false): Particle => {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      const randType = Math.random();
      const type: "heart" | "sparkle" | "bokeh" | "note" =
        randType < 0.38 ? "heart" : randType < 0.62 ? "sparkle" : randType < 0.82 ? "note" : "bokeh";

      return {
        x: Math.random() * width,
        y: initialRandomY ? Math.random() * height : height + 20,
        size:
          type === "heart"
            ? 8 + Math.random() * 14
            : type === "sparkle"
            ? 3 + Math.random() * 6
            : type === "note"
            ? 12 + Math.random() * 10
            : 14 + Math.random() * 26,
        speedY: -(0.35 + Math.random() * 0.9),
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: 0.15 + Math.random() * 0.45,
        fadeSpeed: 0.002 + Math.random() * 0.004,
        type,
        noteSymbol: type === "note" ? noteSymbols[Math.floor(Math.random() * noteSymbols.length)] : undefined,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: colorBase,
      };
    };

    // Initialize
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.scale(size / 18, size / 18);
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(-10, -10, -20, 5, 0, 18);
      c.bezierCurveTo(20, 5, 10, -10, 0, 0);
      c.fillStyle = `${color}${alpha})`;
      c.shadowColor = "rgba(226, 185, 192, 0.4)";
      c.shadowBlur = 8;
      c.fill();
      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      c.save();
      c.translate(x, y);
      c.beginPath();
      c.moveTo(0, -size);
      c.quadraticCurveTo(0, 0, size, 0);
      c.quadraticCurveTo(0, 0, 0, size);
      c.quadraticCurveTo(0, 0, -size, 0);
      c.quadraticCurveTo(0, 0, 0, -size);
      c.fillStyle = `${color}${alpha * 1.3})`;
      c.shadowColor = "rgba(249, 231, 185, 0.8)";
      c.shadowBlur = 10;
      c.fill();
      c.restore();
    };

    const drawBokeh = (c: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, alpha: number) => {
      c.save();
      c.beginPath();
      c.arc(x, y, size, 0, Math.PI * 2);
      c.fillStyle = `${color}${alpha * 0.4})`;
      c.shadowColor = `${color}0.5)`;
      c.shadowBlur = 15;
      c.fill();
      c.restore();
    };

    const drawNote = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      alpha: number,
      symbol: string,
      rot: number
    ) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot * 0.35);
      c.font = `bold ${Math.round(size)}px "Playfair Display", Georgia, serif`;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillStyle = `${color}${alpha * 0.95})`;
      c.shadowColor = "rgba(226, 201, 116, 0.6)";
      c.shadowBlur = 8;
      c.fillText(symbol, 0, 0);
      c.restore();
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.66, 2.0);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY * dt;
        p.x += (p.speedX + Math.sin(p.y * 0.01) * 0.3) * dt;
        p.rotation += p.rotationSpeed * dt;

        if (p.type === "heart") {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.opacity, p.rotation);
        } else if (p.type === "sparkle") {
          drawSparkle(ctx, p.x, p.y, p.size, p.color, p.opacity);
        } else if (p.type === "note" && p.noteSymbol) {
          drawNote(ctx, p.x, p.y, p.size, p.color, p.opacity, p.noteSymbol, p.rotation);
        } else {
          drawBokeh(ctx, p.x, p.y, p.size, p.color, p.opacity);
        }

        // Reset if off top or faded
        if (p.y < -30 || p.x < -30 || p.x > width + 30) {
          particles[i] = createParticle(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: 0.85 }}
    />
  );
}
