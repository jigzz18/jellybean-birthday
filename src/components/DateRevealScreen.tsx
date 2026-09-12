import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Sparkles, Heart, CheckCircle2 } from "lucide-react";
import { CONFIG } from "../config";

interface DateRevealScreenProps {
  key?: string;
  onConfirm: () => void;
}

export default function DateRevealScreen({ onConfirm }: DateRevealScreenProps) {
  const instructions = [
    { num: "01", text: "Show up." },
    { num: "02", text: "Look cute." },
    { num: "03", text: "Trust me." },
    { num: "04", text: "Be ready for anything. ❤️" },
  ];

  return (
    <motion.div
      id="date-reveal-screen"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 sm:px-6 py-12"
    >
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Top Header Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E2B9C0]/25 bg-[#26131F]/90 px-4 py-1.5 text-xs tracking-widest uppercase text-[#F5CCD2] font-sans"
        >
          <Sparkles className="h-3 w-3 text-[#D4AF37]" />
          <span>OUR DATE</span>
          <Heart className="h-3 w-3 text-[#E28D9A] fill-[#E28D9A]" />
        </motion.div>

        {/* Elegant Calendar-Style Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="romantic-card w-full rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden"
        >
          {/* Subtle gold ribbon line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-75" />

          <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase font-sans text-[#E2C974] font-medium">
            Save The Date
          </p>

          <h3 className="mt-4 font-serif text-2xl sm:text-3xl font-medium text-[#FAF5F0]">
            {CONFIG.date}
          </h3>

          <div className="mt-2 inline-flex items-center gap-2 text-sm sm:text-base text-[#F5CCD2] font-sans font-light">
            <Clock className="h-4 w-4 text-[#D4AF37]" />
            <span>{CONFIG.time}</span>
          </div>

          <div className="my-6 border-t border-[#E2B9C0]/15" />

          {/* Meeting Point */}
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#FAF5F0]/60 font-sans">
              <MapPin className="h-3.5 w-3.5 text-[#E28D9A]" />
              <span>Meeting Point</span>
            </div>

            <p className="mt-1 font-serif text-lg sm:text-xl text-[#FAF5F0] font-normal">
              {CONFIG.location}
            </p>
          </div>
        </motion.div>

        {/* Date Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="mt-8 w-full max-w-md text-left"
        >
          <p className="text-center sm:text-left text-xs uppercase tracking-widest font-sans font-medium text-[#FAF5F0]/50 mb-4">
            Your only instructions:
          </p>

          <div className="space-y-3">
            {instructions.map((item, idx) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + idx * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 rounded-xl border border-[#E2B9C0]/10 bg-[#22121D]/60 px-4 py-3 backdrop-blur-sm"
              >
                <span className="font-mono text-xs text-[#D4AF37] font-semibold tracking-wider">
                  {item.num}
                </span>
                <span className="text-sm sm:text-base text-[#FAF5F0]/90 font-sans">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="mt-5 text-center text-xs text-[#F5CCD2]/70 italic font-serif">
            The rest is a surprise.
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8 }}
          className="mt-8 w-full max-w-xs"
        >
          <button
            id="im-in-btn"
            type="button"
            onClick={onConfirm}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#B76E79] via-[#9E5160] to-[#7A3645] px-8 py-4 text-base font-medium text-white shadow-[0_10px_30px_-5px_rgba(183,110,121,0.5)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_15px_35px_-5px_rgba(212,175,55,0.4)] active:scale-[0.98]"
          >
            <span className="relative z-10 tracking-wide font-medium">I'm In</span>
            <Heart className="relative z-10 h-4 w-4 fill-white text-white transition-transform duration-300 group-hover:scale-125" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
