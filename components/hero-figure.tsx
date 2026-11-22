export function HeroFigure() {
  return (
    <figure className="relative overflow-hidden rounded-2xl bg-pacific text-mist shadow-sm">
      <svg viewBox="0 0 640 460" className="h-auto w-full" role="img" aria-labelledby="hero-fig-title">
        <title id="hero-fig-title">Esquema del transecto entre el Pacífico y el este de Lima</title>
        <rect width="640" height="460" fill="#0E2A33" />
        <path d="M0 300 C80 250 120 280 180 300 L180 460 L0 460 Z" fill="#14343c" />
        <path d="M0 330 C90 300 140 340 200 318 L200 460 L0 460 Z" fill="#1a4c58" />
        <path d="M470 250 L560 180 L640 210 L640 460 L470 460 Z" fill="#16323a" />
        <path d="M500 270 L575 205 L640 230" fill="none" stroke="#355860" strokeWidth="1" />
        <g fill="none" stroke="#9FD3D6" strokeWidth="1.2" opacity="0.7">
          <path d="M40 150 H220" />
          <path d="M40 190 H240" />
          <path d="M40 230 H200" />
        </g>
        <path
          d="M70 250 C140 120 210 210 280 150 C350 90 400 200 470 130 C520 80 560 160 600 110"
          fill="none"
          stroke="#E0A070"
          strokeWidth="3"
        />
        <circle cx="70" cy="250" r="5" fill="#2E9D4F" />
        <circle cx="250" cy="168" r="5" fill="#C6A317" />
        <circle cx="430" cy="168" r="5" fill="#F08A24" />
        <circle cx="575" cy="128" r="5" fill="#E23B3B" />
        <path d="M560 118 l8 6 -8 1.2 -2.2 6.2 -3.2-7.4z" fill="#F4E7DB" />
        <g fill="#d5e6e8" fontFamily="Source Sans 3, sans-serif" fontSize="13">
          <text x="28" y="42">Pacífico</text>
          <text x="250" y="42">Lima</text>
          <text x="520" y="42">Este, más seco</text>
          <text x="28" y="430">Costa</text>
          <text x="500" y="430">Hacia Ate</text>
        </g>
        <g fill="#9fd3d6" fontFamily="IBM Plex Mono, monospace" fontSize="11">
          <text x="28" y="78">alt. 200 m</text>
          <text x="28" y="268">alt. 55 m</text>
        </g>
      </svg>
      <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-mist/80">
        Esquema del vuelo: el color del trayecto real, en el mapa, sigue la concentración de PM2.5.
      </figcaption>
    </figure>
  );
}
