import { useEffect } from "react";
import { Sparkles, Heart } from "lucide-react";

interface CinematicTransitionProps {
  key?: string;
  onComplete: () => void;
}

export default function CinematicTransition({ onComplete }: CinematicTransitionProps) {
  useEffect(() => {
    // 800 - 1200ms cinematic transition window
    const timer = setTimeout(() => {
      onComplete();
    }, 1100);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      id="cinematic-transition-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F080D] transition-opacity duration-1000"
    >
      {/* Blurred romantic glow backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(97,35,60,0.5)_0%,rgba(15,8,13,1)_85%)] animate-pulse" />

      {/* Floating Sparkles & Heart flourish */}
      <div className="relative flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-[#B76E79]/40 blur-2xl animate-ping" />
          <Heart className="relative h-14 w-14 text-[#F5CCD2] fill-[#F5CCD2] drop-shadow-[0_0_20px_rgba(245,204,210,0.9)] animate-bounce" />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-serif tracking-widest text-[#FAF5F0]/80">
          <Sparkles className="h-4 w-4 text-[#D4AF37] animate-spin" />
          <span className="gold-gradient-text uppercase tracking-widest">Entering Your Surprise</span>
          <Sparkles className="h-4 w-4 text-[#D4AF37] animate-spin" />
        </div>
      </div>
    </div>
  );
}
