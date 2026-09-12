import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { AppStep } from "../types";

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId?: string;
          height?: string | number;
          width?: string | number;
          playerVars?: Record<string, any>;
          events?: {
            onReady?: (event: { target: any }) => void;
            onStateChange?: (event: { data: number; target: any }) => void;
            onError?: (event: { data: number; target: any }) => void;
          };
        }
      ) => any;
      PlayerState?: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface BackgroundMusicProps {
  currentStep: AppStep;
}

// Target YouTube Video: Rishabh Syal - Pehla Nasha (Piano cover)
const YOUTUBE_VIDEO_ID = "aXbcirQvEp4";
const START_TIME_SECONDS = 0;

// Step-specific volume & motif profile based on emotional arc
const STEP_AUDIO_PROFILES: Record<
  AppStep,
  { ytVolume: number; localVolume: number; targetTime?: number }
> = {
  video: {
    ytVolume: 0,
    localVolume: 0,
  },
  transition: {
    ytVolume: 32, // Soft opening piano notes after brief silence
    localVolume: 0.22,
    targetTime: START_TIME_SECONDS,
  },
  welcome: {
    ytVolume: 44,
    localVolume: 0.32,
  },
  invitation: {
    ytVolume: 52,
    localVolume: 0.38,
  },
  choice: {
    ytVolume: 36, // Softer and dreamy for mystery
    localVolume: 0.26,
  },
  reaction: {
    ytVolume: 60,
    localVolume: 0.44,
  },
  date: {
    ytVolume: 78, // Melody becomes more prominent as date is revealed
    localVolume: 0.60,
  },
  final: {
    ytVolume: 95, // Celebratory peak for "IT'S OFFICIALLY A DATE ❤️"
    localVolume: 0.80,
  },
};

export default function BackgroundMusic({ currentStep }: BackgroundMusicProps) {
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const ytVolumeFadeRef = useRef<number | null>(null);
  const currentYtVolRef = useRef<number>(0);

  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const localFadeRef = useRef<number | null>(null);

  const [useFallback, setUseFallback] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const delayTimeoutRef = useRef<number | null>(null);

  // Smoothly fade YouTube player volume
  const fadeYtVolume = useCallback((targetVol: number, durationMs = 1200) => {
    if (!ytPlayerRef.current || !isYtReadyRef.current) return;
    if (ytVolumeFadeRef.current) cancelAnimationFrame(ytVolumeFadeRef.current);

    const startVol = currentYtVolRef.current;
    const startTime = performance.now();

    const stepFade = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 0.5 * (1 - Math.cos(Math.PI * progress));
      const current = Math.round(startVol + (targetVol - startVol) * eased);

      currentYtVolRef.current = current;
      try {
        ytPlayerRef.current.setVolume(current);
      } catch {
        // ignore
      }

      if (progress < 1) {
        ytVolumeFadeRef.current = requestAnimationFrame(stepFade);
      } else {
        currentYtVolRef.current = targetVol;
        try {
          ytPlayerRef.current.setVolume(targetVol);
        } catch {
          // ignore
        }
        ytVolumeFadeRef.current = null;
      }
    };

    ytVolumeFadeRef.current = requestAnimationFrame(stepFade);
  }, []);

  // Smoothly fade local audio element volume (fallback)
  const fadeLocalVolume = useCallback((targetVol: number, durationMs = 1200) => {
    const audio = localAudioRef.current;
    if (!audio) return;
    if (localFadeRef.current) cancelAnimationFrame(localFadeRef.current);

    const startVol = audio.volume;
    const startTime = performance.now();

    const updateFade = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 0.5 * (1 - Math.cos(Math.PI * progress));
      audio.volume = Math.max(0, Math.min(1, startVol + (targetVol - startVol) * eased));

      if (progress < 1) {
        localFadeRef.current = requestAnimationFrame(updateFade);
      } else {
        audio.volume = targetVol;
        localFadeRef.current = null;
      }
    };

    localFadeRef.current = requestAnimationFrame(updateFade);
  }, []);

  // Initialize YouTube Iframe Player targeting the stable mount in index.html
  useEffect(() => {
    let isDestroyed = false;

    const onPlayerReady = (event: { target: any }) => {
      if (isDestroyed) return;
      isYtReadyRef.current = true;
      ytPlayerRef.current = event.target;
      try {
        event.target.unMute();
        event.target.setVolume(0);
        event.target.seekTo(START_TIME_SECONDS, true);
      } catch {
        // ignore
      }
    };

    const onPlayerStateChange = (event: { data: number }) => {
      if (isDestroyed) return;
      const playingState = window.YT?.PlayerState?.PLAYING ?? 1;
      const pausedState = window.YT?.PlayerState?.PAUSED ?? 2;
      const endedState = window.YT?.PlayerState?.ENDED ?? 0;

      if (event.data === playingState) {
        setIsPlaying(true);
      } else if (event.data === pausedState) {
        setIsPlaying(false);
      } else if (event.data === endedState) {
        // Clean seamless loop
        if (ytPlayerRef.current) {
          try {
            ytPlayerRef.current.seekTo(START_TIME_SECONDS, true);
            ytPlayerRef.current.playVideo();
          } catch {
            setIsPlaying(false);
          }
        }
      }
    };

    const onPlayerError = (err: any) => {
      console.warn("YouTube player notice, engaging audio engine:", err);
      if (!isDestroyed) {
        setUseFallback(true);
      }
    };

    const initYt = () => {
      if (!window.YT || !window.YT.Player) return;
      const mountElement = document.getElementById("youtube-audio-engine");
      if (!mountElement) return;

      try {
        new window.YT.Player("youtube-audio-engine", {
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            start: START_TIME_SECONDS,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            playsinline: 1,
            rel: 0,
            iv_load_policy: 3,
            enablejsapi: 1,
            origin: window.location.origin && window.location.origin !== "null" ? window.location.origin : undefined,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
            onError: onPlayerError,
          },
        });
      } catch (e) {
        console.warn("YouTube player init:", e);
        setUseFallback(true);
      }
    };

    if (window.YT && window.YT.Player) {
      initYt();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        if (!isDestroyed) initYt();
      };
    }

    return () => {
      isDestroyed = true;
      if (ytVolumeFadeRef.current) cancelAnimationFrame(ytVolumeFadeRef.current);
    };
  }, []);

  // Initialize Local Audio Element for fallback
  useEffect(() => {
    const audio = new Audio("/assets/romantic-music.mp3?v=pehla_nasha_master_v4");
    audio.loop = true;
    audio.volume = 0;
    localAudioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      if (localFadeRef.current) cancelAnimationFrame(localFadeRef.current);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      localAudioRef.current = null;
    };
  }, []);

  // Orchestrate music progression across app steps
  useEffect(() => {
    if (delayTimeoutRef.current) {
      clearTimeout(delayTimeoutRef.current);
      delayTimeoutRef.current = null;
    }

    const profile = STEP_AUDIO_PROFILES[currentStep];

    // If currently on Video Intro, keep background music silent & paused
    if (currentStep === "video") {
      if (ytPlayerRef.current && isYtReadyRef.current) {
        fadeYtVolume(0, 300);
        setTimeout(() => {
          try {
            ytPlayerRef.current.pauseVideo();
          } catch {
            // ignore
          }
        }, 350);
      }
      if (localAudioRef.current) {
        fadeLocalVolume(0, 300);
        setTimeout(() => {
          if (localAudioRef.current && currentStep === "video") {
            localAudioRef.current.pause();
            localAudioRef.current.currentTime = 0;
          }
        }, 350);
      }
      return;
    }

    // When transitioning from video, maintain the requested brief silence before music begins
    const isBeginning = currentStep === "transition";
    const delayMs = isBeginning ? 700 : 50;

    delayTimeoutRef.current = window.setTimeout(() => {
      if (isMuted) return;

      // 1. Primary: YouTube Player
      if (!useFallback && ytPlayerRef.current && isYtReadyRef.current) {
        try {
          if (isBeginning) {
            ytPlayerRef.current.seekTo(START_TIME_SECONDS, true);
          }

          ytPlayerRef.current.unMute();
          ytPlayerRef.current.playVideo();
          fadeYtVolume(profile.ytVolume, isBeginning ? 1800 : 900);
          return;
        } catch (ytErr) {
          console.warn("YouTube play fallback:", ytErr);
          setUseFallback(true);
        }
      }

      // 2. Fallback: Local Audio Engine
      const localAudio = localAudioRef.current;
      if (localAudio) {
        if (isBeginning) {
          localAudio.currentTime = 0;
        }

        const promise = localAudio.play();
        if (promise !== undefined) {
          promise
            .then(() => {
              fadeLocalVolume(profile.localVolume, isBeginning ? 1800 : 900);
            })
            .catch((err) => {
              console.warn("Autoplay deferred until touch:", err);
            });
        }
      }
    }, delayMs);
  }, [currentStep, useFallback, isMuted, fadeYtVolume, fadeLocalVolume]);

  // Global user interaction gesture listener to unlock audio if autoplay was blocked by browser
  useEffect(() => {
    if (currentStep === "video" || isMuted) return;

    const unlockPlayback = () => {
      if (!useFallback && ytPlayerRef.current && isYtReadyRef.current) {
        try {
          const state = ytPlayerRef.current.getPlayerState?.();
          if (state !== 1) {
            ytPlayerRef.current.unMute();
            ytPlayerRef.current.playVideo();
            const profile = STEP_AUDIO_PROFILES[currentStep];
            fadeYtVolume(profile.ytVolume, 800);
          }
        } catch {
          // ignore
        }
      } else if (localAudioRef.current && localAudioRef.current.paused) {
        localAudioRef.current.play().then(() => {
          const profile = STEP_AUDIO_PROFILES[currentStep];
          fadeLocalVolume(profile.localVolume, 800);
        }).catch(() => {});
      }
    };

    window.addEventListener("click", unlockPlayback, { passive: true });
    window.addEventListener("touchstart", unlockPlayback, { passive: true });

    return () => {
      window.removeEventListener("click", unlockPlayback);
      window.removeEventListener("touchstart", unlockPlayback);
    };
  }, [currentStep, useFallback, isMuted, fadeYtVolume, fadeLocalVolume]);

  // Manual Toggle Play/Mute handler
  const handleToggleSound = () => {
    if (isPlaying && !isMuted) {
      // Mute/Pause
      setIsMuted(true);
      setIsPlaying(false);
      if (ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {
          // ignore
        }
      }
      if (localAudioRef.current) {
        localAudioRef.current.pause();
      }
    } else {
      // Unmute/Resume
      setIsMuted(false);
      setIsPlaying(true);
      const profile = STEP_AUDIO_PROFILES[currentStep];
      if (!useFallback && ytPlayerRef.current && isYtReadyRef.current) {
        try {
          ytPlayerRef.current.unMute();
          ytPlayerRef.current.playVideo();
          fadeYtVolume(profile.ytVolume, 500);
        } catch {
          setUseFallback(true);
        }
      } else if (localAudioRef.current) {
        localAudioRef.current.play().then(() => {
          fadeLocalVolume(profile.localVolume, 500);
        }).catch(() => {});
      }
    }
  };

  // Do not show sound toggle during video intro
  if (currentStep === "video") {
    return null;
  }

  return (
    /* Minimal circular sound toggle at top right (NO song name or text as requested) */
    <button
      id="soundtrack-audio-toggle"
      type="button"
      onClick={handleToggleSound}
      aria-label={isPlaying ? "Mute background music" : "Play background music"}
      title={isPlaying ? "Mute sound" : "Play sound"}
      className="fixed top-4 right-4 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#140E13]/85 text-[#FAF5F0] shadow-[0_4px_20px_rgba(0,0,0,0.6),0_0_15px_rgba(212,175,55,0.12)] backdrop-blur-md transition-all duration-300 hover:border-[#D4AF37]/60 hover:bg-[#1C131B] active:scale-95 cursor-pointer select-none"
    >
      {isPlaying && !isMuted ? (
        <div className="relative flex items-center justify-center">
          <Volume2 className="h-4 w-4 text-[#E2C974]" />
          {/* Subtle pulsating equalizer indicator */}
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E2C974] opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E2C974]/90"></span>
          </span>
        </div>
      ) : (
        <VolumeX className="h-4 w-4 text-[#D98894]/80" />
      )}
    </button>
  );
}
