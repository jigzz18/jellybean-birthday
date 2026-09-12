import React, { useState, useRef, useEffect } from "react";
import { Heart, RefreshCw } from "lucide-react";
import { CONFIG } from "../config";

interface VideoIntroProps {
  key?: string;
  onFinished: () => void;
}

export default function VideoIntro({ onFinished }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Prevent background scrolling while in video intro
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleStart = async () => {
    if (!videoRef.current) return;
    try {
      videoRef.current.muted = false;
      await videoRef.current.play();
      setIsPlaying(true);
      setHasStarted(true);
    } catch (err) {
      console.warn("Autoplay with unmuted audio was blocked, falling back to muted play:", err);
      try {
        if (videoRef.current) {
          videoRef.current.muted = true;
          await videoRef.current.play();
          setIsPlaying(true);
          setHasStarted(true);
        }
      } catch (playErr) {
        console.error("Video play failed:", playErr);
        setHasError(true);
      }
    }
  };

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setHasStarted(false);
    setIsPlaying(false);
    setRetryCount((prev) => prev + 1);

    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleVideoEnded = () => {
    // Crucial requirement: listen to HTML5 video's `ended` event
    onFinished();
  };

  return (
    <div
      id="video-intro-container"
      className="fixed inset-0 z-40 flex h-full w-full items-center justify-center bg-[#0F080D] select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(68,24,42,0.35)_0%,rgba(15,8,13,0.95)_100%)] pointer-events-none" />

      {/* Video Player */}
      {!hasError && (
        <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            key={retryCount}
            src={CONFIG.introVideo}
            playsInline
            preload="auto"
            onCanPlay={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => {
              setIsLoading(false);
              setIsPlaying(true);
            }}
            onTimeUpdate={(e) => {
              const el = e.currentTarget;
              if (el.duration && el.currentTime >= el.duration - 0.25) {
                handleVideoEnded();
              }
            }}
            onEnded={handleVideoEnded}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className="h-full w-full object-cover md:object-contain transition-opacity duration-700 max-h-[100dvh]"
            style={{
              opacity: hasStarted ? 1 : 0.4,
              filter: hasStarted ? "none" : "blur(4px)",
            }}
          />

          {/* Loading indicator */}
          {isLoading && hasStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs">
              <div className="flex flex-col items-center gap-3">
                <div className="h-9 w-9 rounded-full border-2 border-[#E2B9C0]/30 border-t-[#D4AF37] animate-spin" />
                <span className="text-xs font-serif tracking-widest text-[#FAF5F0]/80">Loading surprise...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* "Tap to begin" Overlay */}
      {!hasStarted && !hasError && (
        <div
          id="tap-to-begin-overlay"
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/45 backdrop-blur-[2px] transition-all duration-500"
        >
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
            {/* Pulsing heart icon / Start button */}
            <button
              id="start-video-btn"
              type="button"
              onClick={handleStart}
              className="group relative mb-6 flex h-24 w-24 items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <div className="absolute h-full w-full rounded-full bg-gradient-to-tr from-[#B76E79]/40 to-[#D4AF37]/30 blur-xl animate-pulse-subtle" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#FAF5F0]/25 bg-[#25121E]/90 shadow-[0_0_35px_rgba(183,110,121,0.45)] backdrop-blur-md transition-all duration-300 group-hover:border-[#E2B9C0] group-hover:shadow-[0_0_45px_rgba(212,175,55,0.5)]">
                <Heart className="h-9 w-9 text-[#F5CCD2] fill-[#F5CCD2] drop-shadow-[0_0_12px_rgba(245,204,210,0.8)] transition-transform group-hover:scale-110" />
              </div>
            </button>

            <button
              type="button"
              onClick={handleStart}
              className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-[#FAF5F0] hover:text-[#E2B9C0] transition cursor-pointer"
            >
              Tap to begin
            </button>

            <p className="mt-2 text-xs tracking-widest uppercase text-[#E2B9C0]/80 font-sans">
              Best experienced with sound 🤍
            </p>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div
          id="video-error-state"
          className="relative z-30 mx-4 max-w-md rounded-2xl border border-[#E2B9C0]/20 bg-[#24131E]/95 p-8 text-center shadow-2xl backdrop-blur-xl"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
            <Heart className="h-7 w-7 text-rose-300 fill-rose-300/40" />
          </div>

          <h3 className="font-serif text-xl font-normal text-[#FAF5F0]">
            Something went wrong loading your surprise. ❤️
          </h3>

          <p className="mt-3 text-xs text-[#FAF5F0]/65 leading-relaxed font-sans">
            Please make sure <code className="text-[#E2C974]">{CONFIG.introVideo}</code> is located in your public assets directory, or tap below to retry.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              id="retry-video-btn"
              type="button"
              onClick={handleRetry}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#8C4A5A] px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4 animate-spin-reverse" />
              Try Again
            </button>

            {/* In case user is in preview and wants to continue to the website */}
            <button
              id="continue-without-video-btn"
              type="button"
              onClick={onFinished}
              className="text-xs text-[#FAF5F0]/50 hover:text-[#FAF5F0] transition underline underline-offset-4 py-1"
            >
              Continue to surprise →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
