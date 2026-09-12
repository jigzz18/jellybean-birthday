import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { AppStep } from "./types";
import { VibeOption, VIBE_OPTIONS } from "./config";
import VideoIntro from "./components/VideoIntro";
import CinematicTransition from "./components/CinematicTransition";
import WelcomeScreen from "./components/WelcomeScreen";
import InvitationScreen from "./components/InvitationScreen";
import ChoiceScreen from "./components/ChoiceScreen";
import ReactionScreen from "./components/ReactionScreen";
import DateRevealScreen from "./components/DateRevealScreen";
import FinalScreen from "./components/FinalScreen";
import FloatingHearts from "./components/FloatingHearts";
import BackgroundMusic from "./components/BackgroundMusic";

const STORAGE_KEY = "birthday_surprise_state";

export default function App() {
  const [step, setStep] = useState<AppStep>("video");
  const [selectedVibe, setSelectedVibe] = useState<VibeOption | null>(null);

  // Check if there was a saved state in localStorage for convenience
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.vibeId) {
          const matched = VIBE_OPTIONS.find((v) => v.id === parsed.vibeId);
          if (matched) setSelectedVibe(matched);
        }
      }
    } catch (e) {
      console.warn("Storage check failed:", e);
    }
  }, []);

  const handleVideoFinished = () => {
    // 5. Sequence: VIDEO FINISHES -> CINEMATIC TRANSITION -> BIRTHDAY WEBSITE
    setStep("transition");
  };

  const handleTransitionFinished = () => {
    setStep("welcome");
  };

  const handleSelectVibe = (vibe: VibeOption) => {
    setSelectedVibe(vibe);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ vibeId: vibe.id }));
    } catch {
      // safe fallback
    }
    setStep("reaction");
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // safe fallback
    }
    setSelectedVibe(null);
    setStep("video");
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#140E13] text-[#FAF5F0] overflow-x-hidden selection:bg-[#B76E79]/40">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(183,110,121,0.18)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute -bottom-[20%] right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(140,74,90,0.14)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* Floating hearts and gentle sparkles after video begins */}
      {step !== "video" && (
        <FloatingHearts intensity={step === "final" ? "festive" : "normal"} />
      )}

      {/* Headless romantic background music (no buttons or toggles) */}
      <BackgroundMusic currentStep={step} />

      {/* Main Flow Controller with AnimatePresence */}
      <main className="relative z-10 w-full min-h-[100dvh]">
        <AnimatePresence mode="wait">
          {step === "video" && (
            <VideoIntro key="video" onFinished={handleVideoFinished} />
          )}

          {step === "transition" && (
            <CinematicTransition
              key="transition"
              onComplete={handleTransitionFinished}
            />
          )}

          {step === "welcome" && (
            <WelcomeScreen
              key="welcome"
              onNext={() => setStep("invitation")}
            />
          )}

          {step === "invitation" && (
            <InvitationScreen
              key="invitation"
              onNext={() => setStep("choice")}
            />
          )}

          {step === "choice" && (
            <ChoiceScreen
              key="choice"
              onSelectVibe={handleSelectVibe}
            />
          )}

          {step === "reaction" && (
            <ReactionScreen
              key="reaction"
              vibe={selectedVibe || VIBE_OPTIONS[0]}
              onNext={() => setStep("date")}
            />
          )}

          {step === "date" && (
            <DateRevealScreen
              key="date"
              onConfirm={() => setStep("final")}
            />
          )}

          {step === "final" && (
            <FinalScreen
              key="final"
              vibe={selectedVibe || VIBE_OPTIONS[0]}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
