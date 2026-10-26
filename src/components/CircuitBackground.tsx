import React from 'react';

export default function CircuitBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none -z-10" aria-hidden="true">
      {/* Ambient Marsala / Crimson Top Backlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(190,18,60,0.18),transparent_70%)]" />

      {/* High-Tech Circuit Board / Motherboard Traces SVG */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[550px] opacity-40 mix-blend-screen"
        viewBox="0 0 1400 550"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="traceGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="50%" stopColor="#be123c" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="traceGrad2" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#9f1239" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central Top Processing Core Nodes */}
        <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
          {/* Vertical Highway Buses */}
          <path d="M 700 0 L 700 120 L 730 150 L 730 220 L 770 260 L 770 340" />
          <path d="M 680 0 L 680 90 L 640 130 L 640 210 L 600 250 L 600 360" />
          <path d="M 720 0 L 720 80 L 780 140 L 780 200 L 840 260 L 840 320" />
          <path d="M 660 0 L 660 70 L 590 140 L 590 190 L 520 260 L 520 350" />

          {/* Left Wing Traces */}
          <path d="M 640 0 L 640 50 L 550 140 L 420 140 L 380 180 L 380 280 L 320 340 L 220 340" />
          <path d="M 620 0 L 620 40 L 510 150 L 440 150 L 390 200 L 390 310 L 340 360" />
          <path d="M 580 0 L 580 30 L 480 130 L 360 130 L 300 190 L 250 190 L 200 240 L 140 240" />
          <path d="M 540 0 L 540 20 L 450 110 L 310 110 L 260 160 L 180 160 L 120 220 L 60 220" />

          {/* Right Wing Traces */}
          <path d="M 760 0 L 760 50 L 850 140 L 980 140 L 1020 180 L 1020 280 L 1080 340 L 1180 340" />
          <path d="M 780 0 L 780 40 L 890 150 L 960 150 L 1010 200 L 1010 310 L 1060 360" />
          <path d="M 820 0 L 820 30 L 920 130 L 1040 130 L 1100 190 L 1150 190 L 1200 240 L 1260 240" />
          <path d="M 860 0 L 860 20 L 950 110 L 1090 110 L 1140 160 L 1220 160 L 1280 220 L 1340 220" />
        </g>

        {/* Marsala Glowing Active Traces */}
        <g stroke="url(#traceGrad2)" strokeWidth="1.5" filter="url(#glow)">
          <path d="M 700 30 L 700 110 L 730 140 L 730 210" />
          <path d="M 680 20 L 680 80 L 640 120 L 640 190 L 590 240" />
          <path d="M 720 40 L 720 90 L 780 150 L 780 210 L 830 260" />
          <path d="M 640 10 L 640 40 L 550 130 L 430 130 L 390 170" />
          <path d="M 760 10 L 760 40 L 850 130 L 970 130 L 1010 170" />
        </g>

        {/* Circuit Terminal Pads / Micro Vias */}
        <g fill="#e11d48">
          <circle cx="700" cy="110" r="2.5" />
          <circle cx="730" cy="210" r="2.5" />
          <circle cx="640" cy="190" r="2.5" />
          <circle cx="590" cy="240" r="3" filter="url(#glow)" />
          <circle cx="780" cy="210" r="2.5" />
          <circle cx="830" cy="260" r="3" filter="url(#glow)" />
          <circle cx="390" cy="170" r="2.5" />
          <circle cx="1010" cy="170" r="2.5" />
          <circle cx="520" cy="350" r="2.5" />
          <circle cx="770" cy="340" r="2.5" />
          <circle cx="600" cy="360" r="2.5" />
        </g>

        {/* White / Gray Passive Micro Vias */}
        <g fill="rgba(255,255,255,0.25)">
          <circle cx="380" cy="280" r="2" />
          <circle cx="320" cy="340" r="2" />
          <circle cx="1020" cy="280" r="2" />
          <circle cx="1080" cy="340" r="2" />
          <circle cx="480" cy="130" r="1.5" />
          <circle cx="920" cy="130" r="1.5" />
          <circle cx="200" cy="240" r="2" />
          <circle cx="1200" cy="240" r="2" />
        </g>
      </svg>
    </div>
  );
}
