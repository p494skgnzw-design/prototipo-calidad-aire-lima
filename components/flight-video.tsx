"use client";

import { useState } from "react";

const videoSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/video/vuelo-dron.mp4`;

export function FlightVideo() {
  const [missing, setMissing] = useState(false);

  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      {missing ? (
        <div className="flex aspect-video items-center px-6 text-sm text-neutral-300">
          <p>
            El video del vuelo todavía no está en el sitio. Súbelo al repositorio con el nombre{" "}
            <span className="font-mono text-white">public/video/vuelo-dron.mp4</span>.
          </p>
        </div>
      ) : (
        <video
          className="aspect-video w-full bg-black object-cover"
          src={videoSrc}
          controls
          playsInline
          muted
          loop
          autoPlay
          preload="metadata"
          onError={() => setMissing(true)}
        >
          Este navegador no puede reproducir el video.
        </video>
      )}
      <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-neutral-400">
        Vuelo del dron con los sensores.
      </figcaption>
    </figure>
  );
}
