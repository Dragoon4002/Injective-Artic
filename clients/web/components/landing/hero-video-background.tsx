"use client";

import { useEffect, useRef } from "react";

const HLS_SRC =
  "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

/**
 * Full-screen hero background (CodeNest spec §1):
 * HLS video @60% opacity + left/bottom gradients + vertical grid lines + central glow.
 * Mount as a fixed layer behind hero content.
 */
export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: InstanceType<typeof import("hls.js").default> | null = null;

    // Native HLS (Safari) — use directly.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_SRC;
      video.play().catch(() => {});
      return;
    }

    let cancelled = false;
    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: false });
        hls.loadSource(HLS_SRC);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      }
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[#070b0a]">
      {/* Background video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />

      {/* Left-to-right dark gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-[#070b0a] to-transparent" />

      {/* Bottom-up gradient for readability */}
      <div className="absolute inset-0 bg-linear-to-t from-[#070b0a] via-[#070b0a]/40 to-transparent" />

      {/* Central glow (cyan / dark green ellipse, 25px gaussian blur) */}
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4"
        width="1200"
        height="600"
        viewBox="0 0 1200 600"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <filter id="cn-glow-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="25" />
          </filter>
          <radialGradient id="cn-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0e6b5a" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#0a3d36" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#070b0a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="600"
          cy="280"
          rx="520"
          ry="170"
          fill="url(#cn-glow-grad)"
          filter="url(#cn-glow-blur)"
        />
      </svg>

      {/* Vertical grid lines at 25% / 50% / 75% (desktop only) */}
      <div className="absolute inset-0 hidden md:block">
        <div className="absolute inset-y-0 left-1/4 w-px bg-white/10" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-white/10" />
      </div>
    </div>
  );
}
