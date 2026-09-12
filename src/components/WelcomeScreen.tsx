import { motion } from "motion/react";
import { Lock, Sparkles, Heart, ArrowRight } from "lucide-react";
import { CONFIG } from "../config";

interface WelcomeScreenProps {
  key?: string;
  onNext: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <motion.div
      id="welcome-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-12 text-center"
    >
      <div className="w-full max-w-xl mx-auto flex flex-col items-center">
        {/* Soft decorative badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E2B9C0]/25 bg-[#251520]/70 px-4 py-1.5 text-xs tracking-widest uppercase text-[#F5CCD2] backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span>A Special Day For You</span>
          <Heart className="h-3 w-3 text-[#B76E79] fill-[#B76E79]" />
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#FAF5F0] leading-[1.15]"
        >
          Happy Birthday, <br />
          <span className="rose-gradient-text italic font-medium">
            {CONFIG.herName}
          </span>{" "}
          <span className="inline-block text-[#E28D9A] align-middle">❤️</span>
        </motion.h1>

        {/* Supporting Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 max-w-md space-y-4 text-base sm:text-lg text-[#FAF5F0]/85 font-sans leading-relaxed font-light"
        >
          <p>I have something planned for us...</p>
          <p className="text-[#F5CCD2]/80 text-sm sm:text-base">
            But before I tell you anything...
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-10 flex flex-col items-center w-full max-w-xs"
        >
          <button
            id="open-surprise-btn"
            type="button"
            onClick={onNext}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#9E5160] to-[#7A3645] px-8 py-4 text-base font-medium text-white shadow-[0_10px_30px_-5px_rgba(183,110,121,0.5)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_35px_-5px_rgba(212,175,55,0.35)] active:scale-[0.98]"
          >
            {/* Shimmer light effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            
            <span className="relative z-10 tracking-wide">Open Your Surprise</span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Classified Lock Note */}
          <div className="mt-5 inline-flex items-center gap-2 text-xs text-[#FAF5F0]/50 tracking-wider font-sans">
            <Lock className="h-3 w-3 text-[#D4AF37]" />
            <span>The plan is classified.</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
