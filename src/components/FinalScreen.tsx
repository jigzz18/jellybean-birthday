import { useEffect } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Sparkles, Heart } from "lucide-react";
import { CONFIG, VibeOption } from "../config";

interface FinalScreenProps {
  key?: string;
  vibe: VibeOption | null;
  onReset?: () => void;
}

export default function FinalScreen({ vibe }: FinalScreenProps) {
  useEffect(() => {
    // Elegant layered celebration burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ["#F5CCD2", "#D4AF37", "#B76E79", "#FAF5F0", "#E28D9A", "#C5A059"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        gravity: 0.85,
        scalar: 1.1,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        gravity: 0.85,
        scalar: 1.1,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Secondary soft center burst
    setTimeout(() => {
      confetti({
        particleCount: 45,
        spread: 90,
        origin: { y: 0.55 },
        colors,
        ticks: 250,
      });
    }, 400);
  }, []);

  return (
    <motion.div
      id="final-screen"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 sm:px-6 py-12 text-center"
    >
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Celebration Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#2E1825]/90 px-5 py-2 text-xs sm:text-sm tracking-widest uppercase text-[#FAF5F0] shadow-[0_0_30px_rgba(212,175,55,0.3)]"
        >
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span className="gold-gradient-text font-semibold">
            🎉 IT'S OFFICIALLY A DATE 🎉
          </span>
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
        </motion.div>

        {/* Hero Welcome to the Date */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-serif text-3xl sm:text-5xl font-normal text-[#FAF5F0] leading-tight"
        >
          See you there, <br />
          <span className="rose-gradient-text italic font-medium">
            {CONFIG.herName}
          </span>{" "}
          <span className="inline-block text-[#E28D9A]">❤️</span>
        </motion.h2>

        {/* Selected Vibe Reminder */}
        {vibe && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 inline-flex items-center gap-2 text-xs text-[#E2C974]/90 font-sans tracking-wide"
          >
            <span>Vibe confirmed:</span>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-white font-medium">
              {vibe.emoji} {vibe.title}
            </span>
          </motion.div>
        )}

        {/* The Romantic Promise Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.8 }}
          className="romantic-card mt-8 w-full rounded-2xl p-7 sm:p-9 text-center relative overflow-hidden"
        >
          <p className="text-sm sm:text-base font-sans font-light text-[#F5CCD2]/90 leading-relaxed">
            The actual plan remains classified.
          </p>

          <p className="mt-4 text-base sm:text-lg font-serif text-[#FAF5F0] leading-relaxed">
            Your only job is to show up <br />
            and let me take care of the rest.
          </p>

          <div className="my-6 h-px w-20 mx-auto bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

          <div className="text-sm sm:text-base text-[#FAF5F0]/85 font-sans font-light">
            <p className="italic text-xs text-[#FAF5F0]/50 mb-1">With love,</p>
            <p className="font-serif text-xl sm:text-2xl text-white font-medium">
              {CONFIG.myName}
            </p>
          </div>
        </motion.div>

        {/* P.S. Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-6 flex items-center justify-center gap-1.5 text-sm sm:text-base text-[#E2C974] font-serif italic"
        >
          <span>P.S. No peeking.</span>
          <span>🤫</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
