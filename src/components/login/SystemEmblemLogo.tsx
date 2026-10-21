import React from 'react';

interface SystemEmblemLogoProps {
  className?: string;
}

/**
 * Original SVG Vector Emblem representing an official meeting minutes document
 * and a group of meeting participants in Corporate Navy (#073763 / #0B2E59) and Gold (#C9A15A).
 */
export const SystemEmblemLogo: React.FC<SystemEmblemLogoProps> = ({ className = 'w-20 h-20' }) => {
  return (
    <div className="relative inline-flex items-center justify-center select-none">
      {/* Subtle outer ambient halo */}
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-b from-[#073763]/6 via-[#C9A15A]/12 to-transparent blur-md pointer-events-none" />

      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative z-10 ${className}`}
        role="img"
        aria-label="شعار نظام إدارة وتوثيق محاضر الاجتماعات - Meeting Minutes Management System Emblem"
      >
        <defs>
          <linearGradient id="navyGrad" x1="15" y1="10" x2="105" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#073763" />
            <stop offset="100%" stopColor="#0B2E59" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="20" y1="15" x2="100" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DEC082" />
            <stop offset="50%" stopColor="#C9A15A" />
            <stop offset="100%" stopColor="#A67E38" />
          </linearGradient>
          <linearGradient id="docSurface" x1="30" y1="16" x2="90" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F3F6FA" />
          </linearGradient>
          <filter id="emblemShadow" x="5" y="5" width="110" height="112" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#073763" floodOpacity="0.14" />
          </filter>
        </defs>

        {/* Outer Octagonal / Shield-like Institutional Ring */}
        <circle
          cx="60"
          cy="60"
          r="54"
          fill="#FFFFFF"
          stroke="url(#goldGrad)"
          strokeWidth="1.75"
          filter="url(#emblemShadow)"
        />
        <circle
          cx="60"
          cy="60"
          r="49.5"
          fill="none"
          stroke="#073763"
          strokeWidth="0.9"
          strokeDasharray="3 2"
          opacity="0.35"
        />

        {/* Background Navy Crest Arc */}
        <path
          d="M20 62C20 38.804 37.9086 20 60 20C82.0914 20 100 38.804 100 62C100 74.5 93.8 85.4 84.5 92.2H35.5C26.2 85.4 20 74.5 20 62Z"
          fill="url(#navyGrad)"
          opacity="0.06"
        />

        {/* Official Meeting Document Sheet (Back Layer, Tilted slightly) */}
        <rect
          x="36"
          y="19"
          width="46"
          height="56"
          rx="5"
          transform="rotate(4 59 47)"
          fill="url(#goldGrad)"
          opacity="0.32"
        />

        {/* Main Official Meeting Document Sheet */}
        <rect
          x="33"
          y="18"
          width="48"
          height="58"
          rx="5.5"
          fill="url(#docSurface)"
          stroke="url(#navyGrad)"
          strokeWidth="2.4"
        />

        {/* Gold Top Document Clip / Header Bar */}
        <path
          d="M46 18H68C69.6569 18 71 19.3431 71 21V22.5C71 23.3284 70.3284 24 69.5 24H44.5C43.6716 24 43 23.3284 43 22.5V21C43 19.3431 44.3431 18 46 18Z"
          fill="url(#goldGrad)"
        />

        {/* Document Checkboxes & Minutes Lines */}
        {/* Item 1 */}
        <rect x="40" y="30" width="4.5" height="4.5" rx="1" fill="url(#goldGrad)" />
        <line x1="48" y1="32.25" x2="72" y2="32.25" stroke="#073763" strokeWidth="2.2" strokeLinecap="round" />

        {/* Item 2 */}
        <rect x="40" y="39" width="4.5" height="4.5" rx="1" fill="url(#goldGrad)" />
        <line x1="48" y1="41.25" x2="68" y2="41.25" stroke="#073763" strokeWidth="2.2" strokeLinecap="round" />

        {/* Item 3 */}
        <rect x="40" y="48" width="4.5" height="4.5" rx="1" fill="#073763" opacity="0.7" />
        <line x1="48" y1="50.25" x2="63" y2="50.25" stroke="#073763" strokeWidth="2" strokeLinecap="round" opacity="0.65" />

        {/* Gold Official Approval Badge on Document Corner */}
        <circle cx="75" cy="50" r="8.5" fill="url(#goldGrad)" stroke="#FFFFFF" strokeWidth="1.8" />
        <path
          d="M71.5 50.2L74 52.6L78.8 47.6"
          stroke="#073763"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Group of 3 Meeting Participants (Foreground Executive Silhouettes) */}
        {/* Left Participant (Gold Accent) */}
        <circle cx="38" cy="69" r="6.2" fill="url(#goldGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
        <path
          d="M25.5 89.5C25.5 81.8 31.1 77.2 38 77.2C44.9 77.2 50.5 81.8 50.5 89.5"
          fill="url(#goldGrad)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Right Participant (Gold Accent) */}
        <circle cx="82" cy="69" r="6.2" fill="url(#goldGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
        <path
          d="M69.5 89.5C69.5 81.8 75.1 77.2 82 77.2C88.9 77.2 94.5 81.8 94.5 89.5"
          fill="url(#goldGrad)"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Center Executive / Chairman Participant (Primary Corporate Navy) */}
        <circle cx="60" cy="65" r="8" fill="url(#navyGrad)" stroke="#FFFFFF" strokeWidth="2" />
        <path
          d="M43 92C43 81.8 50.4 75.5 60 75.5C69.6 75.5 77 81.8 77 92"
          fill="url(#navyGrad)"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Gold Collar/Tie Executive Detail on Center Figure */}
        <path d="M60 77.5L57.8 83.5L60 86.5L62.2 83.5L60 77.5Z" fill="url(#goldGrad)" />

        {/* Curved Conference Table Rim Base */}
        <path
          d="M22 92.5C34 97 86 97 98 92.5"
          stroke="url(#goldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M28 96.5C40 100 80 100 92 96.5"
          stroke="#073763"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  );
};

interface CornerGeometricOrnamentProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  variant?: 'light' | 'dark';
}

/**
 * Calm institutional geometric decorative ornament for corners and edges.
 */
export const CornerGeometricOrnament: React.FC<CornerGeometricOrnamentProps> = ({
  position,
  variant = 'light',
}) => {
  const posClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0 -scale-x-100',
    'bottom-right': 'bottom-0 right-0 -scale-y-100',
    'bottom-left': 'bottom-0 left-0 -scale-x-100 -scale-y-100',
  }[position];

  const primaryStroke = variant === 'light' ? '#073763' : '#FFFFFF';
  const goldStroke = '#C9A15A';

  return (
    <div className={`pointer-events-none select-none absolute ${posClasses} z-10 overflow-hidden w-36 h-36 sm:w-48 sm:h-48 opacity-40`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Subtle geometric corner lines */}
        <path d="M200 0L110 0L200 90V0Z" fill={primaryStroke} fillOpacity="0.03" />
        <path d="M200 18L125 18L182 75L182 0" stroke={goldStroke} strokeWidth="1.2" strokeOpacity="0.55" />
        <path d="M200 36L145 36L200 91" stroke={primaryStroke} strokeWidth="1" strokeOpacity="0.22" />
        <rect
          x="166"
          y="12"
          width="12"
          height="12"
          transform="rotate(45 166 12)"
          stroke={goldStroke}
          strokeWidth="1.2"
          strokeOpacity="0.65"
        />
        <circle cx="145" cy="18" r="2.5" fill={goldStroke} fillOpacity="0.6" />
        <circle cx="182" cy="55" r="2.5" fill={primaryStroke} fillOpacity="0.35" />
      </svg>
    </div>
  );
};
