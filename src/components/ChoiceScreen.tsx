import React, { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { VIBE_OPTIONS, VibeOption } from "../config";
import { VibeId } from "../types";
import { Sparkles } from "lucide-react";

interface ChoiceScreenProps {
  key?: string;
  onSelectVibe: (vibe: VibeOption) => void;
}

export default function ChoiceScreen({ onSelectVibe }: ChoiceScreenProps) {
  const [selectedId, setSelectedId] = useState<VibeId | null>(null);

  const handleSelect = (vibe: VibeOption, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedId(vibe.id);

    // Launch a delicate romantic mini-burst of sparkles and hearts from the tap position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { x, y },
        colors: ["#F5CCD2", "#D4AF37", "#B76E79", "#FAF5F0", "#E28D9A"],
        ticks: 200,
        gravity: 0.8,
        scalar: 0.9,
        shapes: ["circle"],
      });
    } catch (err) {
      console.log("Confetti trigger:", err);
    }

    // Brief delightful animation delay before transitioning to reaction
    setTimeout(() => {
      onSelectVibe(vibe);
    }, 750);
  };

  return (
    <motion.div
      id="choice-screen"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 sm:px-6 py-10"
    >
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Header Prompt */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E2B9C0]/20 bg-[#25131E]/80 px-3.5 py-1 text-xs text-[#E2C974] tracking-widest uppercase font-sans"
        >
          <Sparkles className="h-3 w-3" />
          <span>Step 1: The Mood</span>
        </motion.div>

        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#FAF5F0] leading-tight">
          Choose Your Vibe
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[#FAF5F0]/65 font-sans max-w-sm">
          Tap the one calling your name. Everything else is on me.
        </p>

        {/* 4 Interactive Cards Grid */}
        <div className="mt-8 grid w-full grid-cols-1 sm:grid-cols-2 gap-4">
          {VIBE_OPTIONS.map((vibe, index) => {
            const isSelected = selectedId === vibe.id;
            const isOtherSelected = selectedId !== null && !isSelected;

            return (
              <motion.button
                key={vibe.id}
                id={`vibe-card-${vibe.id}`}
                type="button"
                onClick={(e) => handleSelect(vibe, e)}
                disabled={selectedId !== null}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isOtherSelected ? 0.35 : 1,
                  scale: isSelected ? 1.05 : 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15 + index * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative flex flex-col items-start text-left rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer overflow-hidden border ${
                  isSelected
                    ? "border-[#D4AF37] bg-[#3B1F2D] shadow-[0_0_35px_rgba(212,175,55,0.4)] ring-2 ring-[#D4AF37]/50"
                    : "border-[#E2B9C0]/15 bg-[#251420]/80 hover:border-[#E2B9C0]/40 hover:bg-[#321A2A] shadow-[0_8px_24px_-6px_rgba(10,5,8,0.5)] active:scale-[0.98]"
                } backdrop-blur-xl`}
              >
                {/* Background soft ambient gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${vibe.gradient} opacity-40 transition-opacity duration-300 group-hover:opacity-70`}
                />

                {/* Top Row: Emoji & Badge */}
                <div className="relative z-10 flex w-full items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-2xl shadow-inner transition-transform duration-300 group-hover:scale-110">
                    {vibe.emoji}
                  </div>

                  <span className="text-[10px] uppercase font-sans font-medium tracking-wider px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[#FAF5F0]/70">
                    {vibe.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="relative z-10 mt-4 font-serif text-lg sm:text-xl font-medium tracking-wide text-[#FAF5F0] group-hover:text-white transition-colors">
                  {vibe.title}
                </h3>

                {/* Subtitle */}
                <p className="relative z-10 mt-1 text-xs sm:text-sm text-[#F5CCD2]/75 font-sans leading-snug">
                  {vibe.subtitle}
                </p>

                {/* Glowing selection ring animation */}
                {isSelected && (
                  <motion.div
                    layoutId="glow-ring"
                    className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37] pointer-events-none shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Small mystery reminder */}
        <p className="mt-6 text-[11px] uppercase tracking-widest text-[#FAF5F0]/40 font-sans">
          ✨ What happens stays between us
        </p>
      </div>
    </motion.div>
  );
}
