"use client";

/**
 * A fully original, hand-built SVG scene — no imagery, no imported art.
 * The samurai walks in place (silhouette, profile view); the landscape
 * scrolls past him in parallax bands to sell forward motion. Every panning
 * layer is drawn twice back-to-back and translated exactly one viewBox
 * width so the loop is seamless.
 */

const VIEW_W = 1600;
const VIEW_H = 700;

function Fireflies() {
  const flies = [
    { x: 220, y: 360, delay: 0 },
    { x: 340, y: 430, delay: 1.2 },
    { x: 480, y: 300, delay: 2.4 },
    { x: 610, y: 470, delay: 0.6 },
    { x: 940, y: 340, delay: 3.1 },
    { x: 1080, y: 460, delay: 1.8 },
    { x: 1220, y: 320, delay: 2.9 },
    { x: 1360, y: 440, delay: 0.3 },
    { x: 90, y: 500, delay: 3.6 },
    { x: 1480, y: 380, delay: 1.5 },
  ];
  return (
    <g className="sh-fireflies">
      {flies.map((f, i) => (
        <circle
          key={i}
          cx={f.x}
          cy={f.y}
          r={2.4}
          className="sh-firefly"
          style={{ animationDelay: `${f.delay}s` }}
        />
      ))}
    </g>
  );
}

function Torii({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`} className="sh-landmark">
      <rect x={-8} y={454} width={13} height={92} rx={2} />
      <rect x={71} y={454} width={13} height={92} rx={2} />
      <rect x={-22} y={440} width={120} height={13} rx={2.5} />
      <rect x={-10} y={462} width={96} height={9} rx={2.5} />
    </g>
  );
}

function Pagoda({ x }: { x: number }) {
  const tiers = [0, 1, 2, 3].map((i) => {
    const w = 104 - i * 18;
    const y = 545 - i * 38;
    return (
      <path key={i} d={`M ${x - w / 2} ${y} L ${x} ${y - 26} L ${x + w / 2} ${y} Z`} />
    );
  });
  return (
    <g className="sh-landmark">
      {tiers}
      <rect x={x - 8} y={548} width={16} height={58} />
      <rect x={x - 2} y={430} width={4} height={38} />
      <circle cx={x} cy={426} r={4} />
    </g>
  );
}

/** One tile of a parallax layer, duplicated at x=0 and x=VIEW_W by the caller. */
function ParallaxLayer({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <g className={className}>
      <g transform="translate(0 0)">{children}</g>
      <g transform={`translate(${VIEW_W} 0)`}>{children}</g>
    </g>
  );
}

export function SamuraiHero() {
  return (
    <div className="sh-root">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMax slice"
        className="sh-svg"
        role="img"
        aria-label="A lone samurai walking beneath a full moon toward a mountain temple at night"
      >
        <defs>
          <linearGradient id="sh-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050813" />
            <stop offset="45%" stopColor="#0b1029" />
            <stop offset="80%" stopColor="#111737" />
            <stop offset="100%" stopColor="#171f47" />
          </linearGradient>
          <radialGradient id="sh-moon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#faf92a" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#faf92a" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#faf92a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sh-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e1433" />
            <stop offset="100%" stopColor="#050712" />
          </linearGradient>
        </defs>

        {/* sky */}
        <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="url(#sh-sky)" />

        {/* stars */}
        <g className="sh-stars">
          {Array.from({ length: 46 }).map((_, i) => {
            const x = (i * 137) % VIEW_W;
            const y = (i * 71) % 340;
            const r = 0.6 + ((i * 13) % 10) / 10;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={r}
                className="sh-star"
                style={{ animationDelay: `${(i % 10) * 0.4}s` }}
              />
            );
          })}
        </g>

        {/* moon */}
        <circle cx={1180} cy={170} r={230} fill="url(#sh-moon-glow)" />
        <circle cx={1180} cy={170} r={92} className="sh-moon" />

        {/* far mountains */}
        <ParallaxLayer className="sh-layer sh-mountains-far">
          <path d="M0,480 L120,380 L260,440 L420,340 L560,430 L720,360 L860,440 L1020,370 L1180,430 L1340,390 L1480,440 L1600,410 L1600,700 L0,700 Z" />
        </ParallaxLayer>

        {/* mist band (behind hills) */}
        <ParallaxLayer className="sh-layer sh-mist-back">
          <ellipse cx={280} cy={510} rx={260} ry={22} />
          <ellipse cx={780} cy={525} rx={320} ry={26} />
          <ellipse cx={1300} cy={505} rx={240} ry={20} />
        </ParallaxLayer>

        {/* hills with torii + pagoda */}
        <ParallaxLayer className="sh-layer sh-hills">
          <path d="M0,560 Q160,500 320,545 T680,530 Q860,500 1040,540 T1600,525 L1600,700 L0,700 Z" />
          <Torii x={480} />
          <Pagoda x={1280} />
        </ParallaxLayer>

        {/* mist band (front of hills) */}
        <ParallaxLayer className="sh-layer sh-mist-front">
          <ellipse cx={150} cy={585} rx={220} ry={18} />
          <ellipse cx={620} cy={598} rx={280} ry={20} />
          <ellipse cx={1150} cy={588} rx={260} ry={18} />
        </ParallaxLayer>

        <Fireflies />

        {/* ground */}
        <ParallaxLayer className="sh-layer sh-ground">
          <rect x={0} y={598} width={VIEW_W} height={102} fill="url(#sh-ground)" />
          <path
            d="M0,602 Q220,590 440,604 T880,600 Q1100,592 1320,606 T1600,600"
            className="sh-path-line"
          />
        </ParallaxLayer>

        {/* ===== samurai — fixed position, walk-cycle only ===== */}
        <g transform="translate(760 0)" className="sh-samurai">
          {/* trailing coat, behind the legs */}
          <path
            d="M28,468 Q-6,520 -2,592 Q34,606 66,592 Q54,530 48,468 Z"
            className="sh-coat"
          />

          {/* back leg (opposite phase) */}
          <g className="sh-leg-back" style={{ transformOrigin: "40px 480px" }}>
            <path d="M32,480 L26,592 L54,592 L46,480 Z" className="sh-solid" />
          </g>

          {/* back arm */}
          <g className="sh-arm-back" style={{ transformOrigin: "36px 410px" }}>
            <path d="M36,410 L18,466 L30,470 L44,414 Z" className="sh-solid" />
          </g>

          {/* torso + head, gentle bob */}
          <g className="sh-torso">
            <path d="M18,410 Q40,398 62,410 L58,480 L22,480 Z" className="sh-solid" />
            {/* katana across the back */}
            <rect x={4} y={432} width={92} height={7} rx={3} transform="rotate(-18 40 460)" className="sh-solid" />
            <circle cx={40} cy={378} r={24} className="sh-solid" />
            {/* kasa hat */}
            <path d="M2,372 Q40,326 78,372 Q56,362 40,362 Q24,362 2,372 Z" className="sh-solid" />
          </g>

          {/* front arm */}
          <g className="sh-arm-front" style={{ transformOrigin: "44px 410px" }}>
            <path d="M44,410 L60,464 L48,470 L34,414 Z" className="sh-solid" />
          </g>

          {/* front leg */}
          <g className="sh-leg-front" style={{ transformOrigin: "48px 480px" }}>
            <path d="M40,480 L34,592 L64,592 L56,480 Z" className="sh-solid" />
          </g>
        </g>
      </svg>

      <div className="sh-vignette" />

      <style>{`
        .sh-root {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #050712;
        }
        .sh-svg { display: block; width: 100%; height: 100%; }
        .sh-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse 80% 60% at 50% 100%, transparent 40%, rgba(0,0,0,0.45) 100%);
        }

        .sh-moon { fill: #faf92a; }
        .sh-star { fill: #edf0fa; animation: sh-twinkle 3.2s ease-in-out infinite; }
        @keyframes sh-twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.95; }
        }

        .sh-solid { fill: #060812; }
        .sh-coat { fill: #070a17; }

        .sh-mountains-far path { fill: #212c5e; }
        .sh-hills path { fill: #131b3f; }
        .sh-landmark rect, .sh-landmark path, .sh-landmark circle {
          fill: #04050c;
          stroke: #4a5480;
          stroke-width: 1;
          stroke-opacity: 0.55;
        }
        .sh-mist-back ellipse, .sh-mist-front ellipse {
          fill: #9aa3c4;
          filter: blur(10px);
        }
        .sh-mist-back ellipse { opacity: 0.08; }
        .sh-mist-front ellipse { opacity: 0.14; }
        .sh-path-line {
          fill: none;
          stroke: #1b2450;
          stroke-width: 2;
        }

        .sh-firefly {
          fill: #faf92a;
          animation: sh-firefly-flicker 2.6s ease-in-out infinite, sh-firefly-drift 7s ease-in-out infinite;
          filter: drop-shadow(0 0 3px #faf92a);
        }
        @keyframes sh-firefly-flicker {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
        @keyframes sh-firefly-drift {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(10px, -14px); }
          50%  { transform: translate(-6px, -22px); }
          75%  { transform: translate(-14px, -6px); }
          100% { transform: translate(0, 0); }
        }

        .sh-layer { will-change: transform; }
        .sh-mountains-far { animation: sh-pan 90s linear infinite; }
        .sh-mist-back      { animation: sh-pan 60s linear infinite; }
        .sh-hills          { animation: sh-pan 42s linear infinite; }
        .sh-mist-front     { animation: sh-pan 26s linear infinite; }
        .sh-ground         { animation: sh-pan 14s linear infinite; }
        @keyframes sh-pan {
          from { transform: translateX(0); }
          to   { transform: translateX(-${VIEW_W}px); }
        }

        /* walk cycle — one stride = 1.1s */
        .sh-samurai { animation: sh-torso-bob 1.1s ease-in-out infinite; }
        @keyframes sh-torso-bob {
          0%, 100% { transform: translate(760px, 0) translateY(0); }
          50%      { transform: translate(760px, 0) translateY(-5px); }
        }
        .sh-leg-front { animation: sh-leg-front 1.1s ease-in-out infinite; }
        .sh-leg-back  { animation: sh-leg-back 1.1s ease-in-out infinite; }
        .sh-arm-front { animation: sh-arm-front 1.1s ease-in-out infinite; }
        .sh-arm-back  { animation: sh-arm-back 1.1s ease-in-out infinite; }
        @keyframes sh-leg-front {
          0%, 100% { transform: rotate(24deg); }
          50%      { transform: rotate(-26deg); }
        }
        @keyframes sh-leg-back {
          0%, 100% { transform: rotate(-26deg); }
          50%      { transform: rotate(24deg); }
        }
        @keyframes sh-arm-front {
          0%, 100% { transform: rotate(-20deg); }
          50%      { transform: rotate(18deg); }
        }
        @keyframes sh-arm-back {
          0%, 100% { transform: rotate(18deg); }
          50%      { transform: rotate(-20deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sh-layer, .sh-samurai, .sh-leg-front, .sh-leg-back,
          .sh-arm-front, .sh-arm-back, .sh-star, .sh-firefly {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
