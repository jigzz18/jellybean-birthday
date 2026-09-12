import { motion } from "motion/react";
import { VibeOption } from "../config";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

interface ReactionScreenProps {
  key?: string;
  vibe: VibeOption;
  onNext: () => void;
}

export default function ReactionScreen({ vibe, onNext }: ReactionScreenProps) {
  return (
    <motion.div
      id="reaction-screen"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Animated chosen mood pill */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E2B9C0]/25 bg-[#2A1522]/90 px-4 py-2 text-xs uppercase tracking-widest text-[#F5CCD2] shadow-[0_0_20px_rgba(183,110,121,0.25)]"
        >
          <span className="text-base">{vibe.emoji}</span>
          <span className="font-semibold text-white">{vibe.title}</span>
        </motion.div>

        {/* Reaction Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="romantic-card w-full rounded-2xl p-7 sm:p-9"
        >
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#FAF5F0] leading-snug">
            {vibe.reactionHeader}
          </h2>

          <p className="mt-4 font-serif text-lg sm:text-xl text-[#F5CCD2] italic">
            "{vibe.reactionMessage}"
          </p>

          <div className="my-6 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#E2B9C0]/40 to-transparent" />

          <div className="space-y-2 text-sm sm:text-base text-[#FAF5F0]/80 font-sans font-light">
            <p>One thing I can promise...</p>
            <p className="text-base sm:text-lg font-medium text-white">
              It's going to be worth it. <span className="text-[#E28D9A]">❤️</span>
            </p>
          </div>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mt-8 w-full max-w-xs"
        >
          <button
            id="tell-me-btn"
            type="button"
            onClick={onNext}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#9E5160] to-[#7A3645] px-6 py-4 text-sm sm:text-base font-medium text-white shadow-[0_10px_30px_-5px_rgba(183,110,121,0.5)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_35px_-5px_rgba(212,175,55,0.35)] active:scale-[0.98]"
          >
            <span className="relative z-10 tracking-wide">
              Tell Me What I Need To Know
            </span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
