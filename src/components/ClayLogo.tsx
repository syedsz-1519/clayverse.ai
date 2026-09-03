import React from 'react';

interface ClayLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function ClayLogo({ className = '', size = 48, showText = false }: ClayLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_8px_rgba(224,122,95,0.15)] hover:scale-105 transition-transform duration-300"
      >
        {/* Soft Shadow behind the bot */}
        <ellipse cx="50" cy="88" rx="30" ry="6" fill="#1C1917" fillOpacity="0.08" filter="blur(1px)" />

        {/* Rounded Orange Capsule Body (Clay Mascot Shape) */}
        <rect
          x="15"
          y="10"
          width="70"
          height="76"
          rx="35"
          fill="#E07A5F"
          stroke="#C56338"
          strokeWidth="1.5"
        />
        
        {/* Clay texture / 3D gradients inner highlights */}
        <rect
          x="18"
          y="13"
          width="64"
          height="70"
          rx="32"
          stroke="url(#clayGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="opacity-45"
        />

        {/* Dark Inner Hood Cavity shadow */}
        <rect
          x="22"
          y="18"
          width="56"
          height="56"
          rx="26"
          fill="#C55937"
          fillOpacity="0.85"
        />

        {/* Cream Face Plate */}
        <rect
          x="26"
          y="21"
          width="48"
          height="48"
          rx="21"
          fill="#F4EFE6"
          stroke="#E5DFD4"
          strokeWidth="1"
        />

        {/* Eye Left */}
        <g>
          {/* Main pupil */}
          <ellipse cx="40" cy="42" rx="4.5" ry="6.5" fill="#2E1810" />
          {/* Specular highlight */}
          <circle cx="38.5" cy="39.5" r="1.5" fill="#FFFFFF" />
          <circle cx="41.5" cy="44.5" r="0.5" fill="#FFFFFF" fillOpacity="0.7" />
        </g>

        {/* Eye Right */}
        <g>
          {/* Main pupil */}
          <ellipse cx="60" cy="42" rx="4.5" ry="6.5" fill="#2E1810" />
          {/* Specular highlight */}
          <circle cx="58.5" cy="39.5" r="1.5" fill="#FFFFFF" />
          <circle cx="61.5" cy="44.5" r="0.5" fill="#FFFFFF" fillOpacity="0.7" />
        </g>

        {/* Terracotta Smiley Mouth */}
        <path
          d="M 44,53 A 6,6 0 0,0 56,53"
          stroke="#9A4228"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="clayGrad" x1="15" y1="10" x2="85" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FF9E85" />
            <stop offset="1" stopColor="#9C3E23" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <span className="font-display text-base font-extrabold text-brand-charcoal tracking-tight flex items-center">
          CLAY<span className="font-light italic text-brand-slate ms-1.5">the explainer</span>
        </span>
      )}
    </div>
  );
}
