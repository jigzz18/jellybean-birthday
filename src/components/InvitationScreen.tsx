import { motion } from "motion/react";
import { Sparkles, Heart, Compass, ArrowRight } from "lucide-react";

interface InvitationScreenProps {
  key?: string;
  onNext: () => void;
}

export default function InvitationScreen({ onNext }: InvitationScreenProps) {
  return (
    <motion.div
      id="invitation-screen"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Soft icon flourish */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#E2B9C0]/20 bg-[#2C1824]/80 shadow-[0_0_25px_rgba(183,110,121,0.2)]"
        >
          <Compass className="h-6 w-6 text-[#E2C974]" />
        </motion.div>

        {/* Narrative Flow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-sm sm:text-base font-medium tracking-widest uppercase text-[#F5CCD2]/80 font-sans"
        >
          Your birthday deserves something special.
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#FAF5F0] leading-snug"
        >
          So... I'm taking you out. <span className="text-[#E28D9A]">❤️</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-6 text-sm sm:text-base text-[#FAF5F0]/75 font-sans font-light italic"
        >
          But there's one thing you get to decide.
        </motion.p>

        {/* Prominent Card Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="romantic-card mt-8 w-full rounded-2xl p-6 sm:p-8"
        >
          <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF5F0] leading-tight">
            What kind of birthday date <br className="hidden sm:inline" />
            <span className="gold-gradient-text italic font-normal">are you in the mood for?</span>
          </h3>

          <div className="mt-5 border-t border-[#E2B9C0]/15 pt-5 text-sm sm:text-base text-[#F5CCD2]/85 font-sans">
            <p className="font-normal text-white">You choose the vibe.</p>
            <p className="text-xs sm:text-sm text-[#FAF5F0]/65 mt-1 font-light">
              I'll take care of everything else.
            </p>
          </div>
        </motion.div>

        {/* Action button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="mt-8 w-full max-w-xs"
        >
          <button
            id="choose-vibe-btn"
            type="button"
            onClick={onNext}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#A05362] to-[#7E3747] px-8 py-4 text-base font-medium text-white shadow-[0_10px_30px_-5px_rgba(183,110,121,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_35px_-5px_rgba(212,175,55,0.35)] active:scale-[0.98]"
          >
            <span className="relative z-10 tracking-wide">Pick Our Vibe</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
