"use client";

import { useEffect, useRef, useState } from "react";

const videoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/video/vuelo-drone.mp4`;

export function FlightVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || missing) return;

    video.muted = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const play = () => {
      if (reducedMotion || video.ended) return;
      void video.play().catch(() => undefined);
    };
    const pause = () => {
      video.pause();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
        else pause();
      },
      { threshold: 0.55 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [missing]);

  return (
    <figure className="w-full bg-black lg:h-full">
      {missing ? (
        <div className="flex aspect-video items-center px-6 text-sm text-neutral-300">
          <p>
            El video del vuelo todavía no está en el sitio. Súbelo al repositorio con el nombre{" "}
            <span className="font-mono text-white">public/video/vuelo-drone.mp4</span>.
          </p>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="block h-auto w-full bg-black"
          src={videoSrc}
          playsInline
          muted
          preload="metadata"
          onError={() => setMissing(true)}
        >
          Este navegador no puede reproducir el video.
        </video>
      )}
    </figure>
  );
}
