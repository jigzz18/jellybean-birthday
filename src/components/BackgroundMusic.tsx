import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AppStep } from "../types";

interface BackgroundMusicProps {
  currentStep: AppStep;
}

// Local MP3 is now the ONLY audio source.
// The YouTube player has been completely removed.
const LOCAL_AUDIO_URL =
  "assets/romantic-music.mp3";

// Step-specific volume profile based on emotional arc
const STEP_AUDIO_PROFILES: Record<
  AppStep,
  { localVolume: number; targetTime?: number }
> = {
  video: {
    localVolume: 0,
  },
  transition: {
    localVolume: 0.22,
    targetTime: 0,
  },
  welcome: {
    localVolume: 0.32,
  },
  invitation: {
    localVolume: 0.38,
  },
  choice: {
    localVolume: 0.26,
  },
  reaction: {
    localVolume: 0.44,
  },
  date: {
    localVolume: 0.60,
  },
  final: {
    localVolume: 0.80,
  },
};

export default function BackgroundMusic({
  currentStep,
}: BackgroundMusicProps) {
  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const localFadeRef = useRef<number | null>(null);
  const delayTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Smoothly fade local audio volume
  const fadeLocalVolume = useCallback(
    (targetVol: number, durationMs = 1200) => {
      const audio = localAudioRef.current;
      if (!audio) return;

      if (localFadeRef.current) {
        cancelAnimationFrame(localFadeRef.current);
      }

      const startVol = audio.volume;
      const startTime = performance.now();

      const updateFade = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);

        // Smooth ease-in/ease-out
        const eased = 0.5 * (1 - Math.cos(Math.PI * progress));

        audio.volume = Math.max(
          0,
          Math.min(1, startVol + (targetVol - startVol) * eased)
        );

        if (progress < 1) {
          localFadeRef.current = requestAnimationFrame(updateFade);
        } else {
          audio.volume = targetVol;
          localFadeRef.current = null;
        }
      };

      localFadeRef.current = requestAnimationFrame(updateFade);
    },
    []
  );

  // Initialize local MP3 audio
  useEffect(() => {
    const audio = new Audio(LOCAL_AUDIO_URL);

    audio.loop = true;
    audio.volume = 0;
    audio.preload = "auto";

    localAudioRef.current = audio;

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      // Extra protection even though loop=true
      try {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch {
        // Ignore
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      if (localFadeRef.current) {
        cancelAnimationFrame(localFadeRef.current);
        localFadeRef.current = null;
      }

      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);

      audio.pause();
      audio.src = "";

      localAudioRef.current = null;
    };
  }, []);

  // Orchestrate music progression across app steps
  useEffect(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }

    const audio = localAudioRef.current;
    const profile = STEP_AUDIO_PROFILES[currentStep];

    if (!audio) return;

    // Video intro:
    // Music should be completely silent and paused.
    if (currentStep === "video") {
      fadeLocalVolume(0, 300);

      delayTimeoutRef.current = window.setTimeout(() => {
        if (localAudioRef.current) {
          localAudioRef.current.pause();
          localAudioRef.current.currentTime = 0;
          localAudioRef.current.volume = 0;
        }
      }, 350);

      return;
    }

    // Brief silence after video before music starts.
    const isBeginning = currentStep === "transition";
    const delayMs = isBeginning ? 700 : 50;

    delayTimeoutRef.current = window.setTimeout(() => {
      const localAudio = localAudioRef.current;

      if (!localAudio || isMuted) return;

      if (isBeginning) {
        try {
          localAudio.currentTime = profile.targetTime ?? 0;
        } catch {
          // Ignore
        }
      }

      localAudio
        .play()
        .then(() => {
          fadeLocalVolume(
            profile.localVolume,
            isBeginning ? 1800 : 900
          );
        })
        .catch((err) => {
          // Browser may block autoplay until the user interacts.
          console.warn(
            "Audio playback deferred until user interaction:",
            err
          );
        });
    }, delayMs);

    return () => {
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
    };
  }, [
    currentStep,
    isMuted,
    fadeLocalVolume,
  ]);

  // Global user interaction listener.
  // This allows the local MP3 to start after browser autoplay restrictions.
  useEffect(() => {
    if (currentStep === "video" || isMuted) return;

    const unlockPlayback = () => {
      const audio = localAudioRef.current;

      if (!audio || !audio.paused) return;

      const profile = STEP_AUDIO_PROFILES[currentStep];

      audio
        .play()
        .then(() => {
          fadeLocalVolume(profile.localVolume, 800);
        })
        .catch(() => {
          // Ignore autoplay errors.
        });
    };

    window.addEventListener("click", unlockPlayback, {
      passive: true,
    });

    window.addEventListener("touchstart", unlockPlayback, {
      passive: true,
    });

    return () => {
      window.removeEventListener("click", unlockPlayback);
      window.removeEventListener("touchstart", unlockPlayback);
    };
  }, [
    currentStep,
    isMuted,
    fadeLocalVolume,
  ]);

  // Manual Toggle Play/Mute handler
  const handleToggleSound = () => {
    const audio = localAudioRef.current;

    if (!audio) return;

    if (isPlaying && !isMuted) {
      // Mute / Pause
      setIsMuted(true);
      setIsPlaying(false);

      fadeLocalVolume(0, 250);

      window.setTimeout(() => {
        if (localAudioRef.current) {
          localAudioRef.current.pause();
        }
      }, 280);
    } else {
      // Unmute / Resume
      setIsMuted(false);

      const profile = STEP_AUDIO_PROFILES[currentStep];

      audio
        .play()
        .then(() => {
          setIsPlaying(true);

          fadeLocalVolume(profile.localVolume, 500);
        })
        .catch(() => {
          // Browser may require another user interaction.
        });
    }
  };

  // Do not show sound toggle during video intro
  if (currentStep === "video") {
    return null;
  }

  return (
    /* Minimal circular sound toggle at top right */
    <button
      id="soundtrack-audio-toggle"
      type="button"
      onClick={handleToggleSound}
      aria-label={
        isPlaying && !isMuted
          ? "Mute background music"
          : "Play background music"
      }
      title={
        isPlaying && !isMuted
          ? "Mute sound"
          : "Play sound"
      }
      className="fixed top-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#140E13]/85 text-[#FAF5F0] shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(212,175,55,0.12)] backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/60 hover:bg-[#1C131B] active:scale-95 cursor-pointer select-none"
    >
      {isPlaying && !isMuted ? (
        <div className="relative flex items-center justify-center">
          <Volume2 className="h-4 w-4 text-[#E2C974]" />

          {/* Subtle pulsating indicator */}
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E2C974] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E2C974]/90" />
          </span>
        </div>
      ) : (
        <VolumeX className="h-4 w-4 text-[#D98894]/80" />
      )}
    </button>
  );
}