import React, { useState } from 'react';
import { CornerGeometricOrnament } from './SystemEmblemLogo';

/**
 * Left-side Visual Showcase for the Meeting Minutes Management and Documentation System.
 * Features a 4K-ready sunset corporate boardroom scene with city skyline view,
 * UAE flag, executive meeting table, laptop, dark notebook, luxury pen,
 * conference microphone, and glass of water, topped with real selectable HTML titles and taglines.
 */
export const LoginVisualShowcase: React.FC = () => {
  const [bgLoaded, setBgLoaded] = useState(true);

  return (
    <section
      aria-label="المشهد البصري والتعريفي للنظام - System Visual Showcase"
      className="relative w-full h-full min-h-[440px] lg:min-h-full overflow-hidden bg-[#071C35] flex flex-col justify-between select-text"
    >
      {/* 1. 4K High-Resolution Sunset Skyline & Boardroom Photographic Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Base Golden-Hour Sunset Sky & Architectural Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(165deg, #05162B 0%, #07294D 28%, #1C3B5E 52%, #7D4E38 74%, #C98A4B 88%, #231815 100%)',
          }}
        />

        {/* High-Resolution 4K Sunset City Skyline & Glass Boardroom Photo */}
        {bgLoaded && (
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=3840&q=90"
            srcSet="
              https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1280&q=85 1280w,
              https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=88 1920w,
              https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2560&q=90 2560w,
              https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=3840&q=92 3840w
            "
            sizes="(max-width: 1024px) 100vw, 60vw"
            alt="قاعة اجتماعات مؤسسية وقت الغروب - Executive Corporate Boardroom at Sunset"
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
            onError={() => setBgLoaded(false)}
            className="w-full h-full object-cover object-center opacity-50 mix-blend-luminosity scale-[1.02] transition-transform duration-1000"
          />
        )}

        {/* Secondary Sunset Metropolitan Skyline Layer for Golden Hour Depth */}
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=3840&q=90"
          srcSet="
            https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1280&q=85 1280w,
            https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=88 1920w,
            https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=3840&q=92 3840w
          "
          sizes="(max-width: 1024px) 100vw, 60vw"
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-bottom opacity-45 mix-blend-screen"
        />

        {/* Warm Golden Sunset Glow & Cinematic Color Grading */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 38% 54%, rgba(245, 176, 86, 0.34) 0%, rgba(201, 161, 90, 0.16) 35%, rgba(7, 55, 99, 0.65) 78%, rgba(5, 22, 43, 0.9) 100%)',
          }}
        />

        {/* Top Navy Reading Scrim for Crystal-Clear Typography Contrast */}
        <div
          className="absolute inset-x-0 top-0 h-[58%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(6, 26, 51, 0.92) 0%, rgba(7, 45, 84, 0.78) 52%, rgba(7, 45, 84, 0.25) 85%, transparent 100%)',
          }}
        />

        {/* 2. Ultra-Crisp 4K Architectural & Boardroom Scene Illustration (Skyline Mullions, UAE Flag, Table, Laptop, Dark Notebook, Luxury Pen, Conference Mic, Water Glass) */}
        <svg
          viewBox="0 0 1440 960"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <defs>
            {/* Sunset Glow Gradients */}
            <radialGradient id="sunsetOrb" cx="0.38" cy="0.56" r="0.42">
              <stop offset="0%" stopColor="#FFE4A3" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#F2A950" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#C9A15A" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#073763" stopOpacity="0" />
            </radialGradient>

            {/* Executive Conference Table Surface Gradient */}
            <linearGradient id="tableTopGrad" x1="150" y1="620" x2="1350" y2="960" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2A1D17" />
              <stop offset="28%" stopColor="#3D291E" />
              <stop offset="55%" stopColor="#1E1410" />
              <stop offset="100%" stopColor="#0E0907" />
            </linearGradient>

            {/* Golden Table Reflection */}
            <linearGradient id="tableSunReflection" x1="300" y1="630" x2="880" y2="900" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFD27D" stopOpacity="0.38" />
              <stop offset="45%" stopColor="#C9A15A" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#C9A15A" stopOpacity="0" />
            </linearGradient>

            {/* Gold Trim Bevel */}
            <linearGradient id="goldBevel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F5DFB0" />
              <stop offset="50%" stopColor="#C9A15A" />
              <stop offset="100%" stopColor="#8E6928" />
            </linearGradient>

            {/* Laptop Metallic Body */}
            <linearGradient id="laptopMetal" x1="250" y1="500" x2="620" y2="750" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="45%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Laptop Screen Glow */}
            <linearGradient id="laptopScreen" x1="280" y1="470" x2="540" y2="690" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B2E59" />
              <stop offset="60%" stopColor="#073763" />
              <stop offset="100%" stopColor="#1E4E8C" />
            </linearGradient>

            {/* Dark Leather Notebook */}
            <linearGradient id="darkNotebook" x1="600" y1="680" x2="860" y2="830" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1B2432" />
              <stop offset="50%" stopColor="#111823" />
              <stop offset="100%" stopColor="#090D14" />
            </linearGradient>

            {/* Crystal Water Glass */}
            <linearGradient id="crystalGlass" x1="1020" y1="590" x2="1100" y2="740" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#CBE7FF" stopOpacity="0.22" />
              <stop offset="85%" stopColor="#FFE1A8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
            </linearGradient>

            {/* UAE Flag Shading for Realistic Fabric Folds */}
            <linearGradient id="flagFabricShade" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
              <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.14" />
              <stop offset="52%" stopColor="#000000" stopOpacity="0.22" />
              <stop offset="78%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
            </linearGradient>
          </defs>

          {/* Warm Sunset Horizon Glow */}
          <circle cx="540" cy="540" r="420" fill="url(#sunsetOrb)" />

          {/* Modern City Skyline Silhouette in Distant Window View */}
          <g opacity="0.38">
            {/* Iconic Tall Spire Tower */}
            <path d="M470 590L478 250L482 175L484 120L486 175L490 250L498 590H470Z" fill="#0B2239" />
            <rect x="442" y="340" width="24" height="250" fill="#0D2844" />
            <rect x="504" y="310" width="32" height="280" fill="#0B2239" />
            <path d="M555 590V285L595 260V590H555Z" fill="#102C4A" />
            <rect x="610" y="330" width="42" height="260" fill="#0B2239" />
            <path d="M668 590V300C668 300 705 275 712 305V590H668Z" fill="#0E2742" />
            <rect x="360" y="365" width="46" height="225" fill="#0D2640" />
            <rect x="295" y="390" width="52" height="200" fill="#0A1E33" />
            <rect x="735" y="355" width="48" height="235" fill="#0C243D" />
            <rect x="800" y="380" width="58" height="210" fill="#0A1F35" />
          </g>

          {/* Floor-to-Ceiling Boardroom Panoramic Window Mullions */}
          <g opacity="0.32">
            <line x1="260" y1="0" x2="260" y2="700" stroke="#C9A15A" strokeWidth="2" />
            <line x1="620" y1="0" x2="620" y2="680" stroke="#C9A15A" strokeWidth="2" />
            <line x1="980" y1="0" x2="980" y2="680" stroke="#C9A15A" strokeWidth="2" />
            <line x1="0" y1="565" x2="1280" y2="565" stroke="#C9A15A" strokeWidth="1.5" strokeOpacity="0.6" />
          </g>

          {/* ============================================================== */}
          {/* OFFICIAL UNITED ARAB EMIRATES (UAE) FLAG ON EXECUTIVE FLAGPOLE */}
          {/* ============================================================== */}
          <g transform="translate(88, 175)">
            {/* Flagpole Shadow / Glow */}
            <line x1="42" y1="18" x2="42" y2="560" stroke="#040D1A" strokeWidth="9" opacity="0.6" />
            {/* Polished Gold & Brass Flagpole */}
            <line x1="40" y1="22" x2="40" y2="560" stroke="url(#goldBevel)" strokeWidth="6" strokeLinecap="round" />
            {/* Gold Finial Ball & Spire at Top of Pole */}
            <path d="M40 2L44 14H36L40 2Z" fill="url(#goldBevel)" />
            <circle cx="40" cy="18" r="7.5" fill="url(#goldBevel)" />
            <ellipse cx="40" cy="26" rx="9" ry="3" fill="#A67E38" />

            {/* Draped Indoor Protocol UAE Flag */}
            <g>
              {/* Red Vertical Band (Top/Hoist section of UAE Flag) */}
              <path
                d="M43 28C68 38 98 62 122 92C96 104 68 112 43 118V28Z"
                fill="#CE1126"
              />
              {/* Green Stripe (Right/Outer Drape) */}
              <path
                d="M122 92C148 135 168 198 182 285C162 292 142 296 124 298C115 215 104 148 92 103L122 92Z"
                fill="#007A3D"
              />
              {/* White Middle Stripe */}
              <path
                d="M92 103C104 148 115 215 124 298C105 300 86 299 68 296C64 212 59 150 56 113L92 103Z"
                fill="#F8FAFC"
              />
              {/* Black Stripe (Inner Drape Next to Pole) */}
              <path
                d="M56 113C59 150 64 212 68 296C56 293 48 289 43 284V118L56 113Z"
                fill="#0F172A"
              />
              {/* Realistic Fabric Folds & Sunset Specular Highlights Overlay */}
              <path
                d="M43 28C68 38 98 62 122 92C148 135 168 198 182 285C142 302 82 303 43 284V28Z"
                fill="url(#flagFabricShade)"
              />
              {/* Gold Protocol Fringe Along Flag Edge */}
              <path
                d="M122 92C148 135 168 198 182 285C142 302 82 303 43 284"
                stroke="url(#goldBevel)"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                fill="none"
              />
            </g>
          </g>

          {/* ============================================================== */}
          {/* EXECUTIVE BOARDROOM CHAIRS (SILHOUETTES AROUND THE TABLE)      */}
          {/* ============================================================== */}
          <g opacity="0.85">
            {/* Left Executive Leather Chair Back */}
            <path
              d="M165 660C165 595 190 565 240 565H305C345 565 368 595 368 655H165Z"
              fill="#121A26"
              stroke="url(#goldBevel)"
              strokeWidth="1.5"
            />
            {/* Center-Right Executive Leather Chair Back */}
            <path
              d="M690 635C690 582 715 556 760 556H825C865 556 888 582 888 635H690Z"
              fill="#141E2B"
              stroke="url(#goldBevel)"
              strokeWidth="1.5"
            />
          </g>

          {/* ============================================================== */}
          {/* LUXURY POLISHED CONFERENCE TABLE WITH SUNSET REFLECTIONS       */}
          {/* ============================================================== */}
          <g>
            {/* Main Angled Conference Table Surface */}
            <path
              d="M-40 675L580 612L1460 665L1460 980L-40 980Z"
              fill="url(#tableTopGrad)"
            />
            {/* Warm Sunset Specular Reflection Across Table Polish */}
            <path
              d="M80 668L580 612L1180 652L960 960L120 960Z"
              fill="url(#tableSunReflection)"
            />
            {/* Polished Gold & Walnut Inlay Line Along Table Edge */}
            <path
              d="M-40 675L580 612L1460 665"
              stroke="url(#goldBevel)"
              strokeWidth="2.5"
              strokeOpacity="0.8"
            />
            <path
              d="M-20 715L585 645L1450 705"
              stroke="#C9A15A"
              strokeWidth="1"
              strokeOpacity="0.32"
            />
          </g>

          {/* ============================================================== */}
          {/* 1. EXECUTIVE LAPTOP ON THE MEETING TABLE                       */}
          {/* ============================================================== */}
          <g transform="translate(210, 485)">
            {/* Table Drop Shadow & Golden Reflection Under Laptop */}
            <ellipse cx="195" cy="242" rx="165" ry="22" fill="#05070B" opacity="0.72" />
            <ellipse cx="205" cy="248" rx="135" ry="12" fill="#F4B660" opacity="0.16" />

            {/* Laptop Screen Lid (Angled Open) */}
            <path
              d="M48 30C48 22 54 16 62 16H278C286 16 292 22 292 30L308 196H32L48 30Z"
              fill="#1E293B"
              stroke="url(#laptopMetal)"
              strokeWidth="3"
            />
            {/* Illuminated Display Panel */}
            <path
              d="M58 28H282L296 184H44L58 28Z"
              fill="url(#laptopScreen)"
            />
            {/* Subtle UI Dashboard Lines on Laptop Display */}
            <rect x="74" y="46" width="85" height="8" rx="4" fill="#C9A15A" opacity="0.85" />
            <rect x="74" y="64" width="180" height="5" rx="2.5" fill="#FFFFFF" opacity="0.4" />
            <rect x="74" y="78" width="155" height="5" rx="2.5" fill="#FFFFFF" opacity="0.3" />
            <rect x="74" y="98" width="95" height="56" rx="6" fill="#FFFFFF" opacity="0.12" stroke="#C9A15A" strokeOpacity="0.35" />
            <rect x="180" y="98" width="88" height="56" rx="6" fill="#FFFFFF" opacity="0.1" />

            {/* Laptop Base & Keyboard Deck */}
            <path
              d="M32 196H308L368 232C374 236 371 244 363 244H12C4 244 1 236 7 232L32 196Z"
              fill="url(#laptopMetal)"
            />
            {/* Backlit Keyboard Grid */}
            <path
              d="M46 202H296L330 223H26L46 202Z"
              fill="#1E293B"
              stroke="#E2E8F0"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Trackpad */}
            <path d="M148 226H212L220 238H140L148 226Z" fill="#94A3B8" opacity="0.7" />
          </g>

          {/* ============================================================== */}
          {/* 2. DARK LEATHER NOTEBOOK & LUXURY GOLD/BLACK PEN               */}
          {/* ============================================================== */}
          <g transform="translate(595, 682)">
            {/* Notebook Drop Shadow */}
            <path
              d="M18 42L218 22L286 98L76 126L18 42Z"
              fill="#04060A"
              opacity="0.75"
            />
            {/* Cream/Gilded Page Edges */}
            <path
              d="M15 34L212 14L276 86L72 114L15 34Z"
              fill="#F3E5C8"
              stroke="#C9A15A"
              strokeWidth="1.5"
            />
            {/* Dark Navy/Charcoal Leather Cover */}
            <path
              d="M12 26L210 6L272 78L68 106L12 26Z"
              fill="url(#darkNotebook)"
              stroke="#C9A15A"
              strokeWidth="1.5"
              strokeOpacity="0.65"
            />
            {/* Gold Foil Emblem/Border on Notebook Cover */}
            <path
              d="M24 31L204 13L258 74L74 98L24 31Z"
              stroke="#C9A15A"
              strokeWidth="0.9"
              strokeDasharray="3 2"
              strokeOpacity="0.55"
              fill="none"
            />
            {/* Gold Bookmark Ribbon */}
            <path
              d="M168 92L182 124L192 120L200 125L184 90"
              fill="url(#goldBevel)"
            />

            {/* Luxury Executive Pen (Black Lacquer & 24K Gold Trim) Resting on Notebook */}
            <g transform="rotate(-16 140 55)">
              {/* Pen Shadow */}
              <rect x="48" y="54" width="186" height="10" rx="5" fill="#000000" opacity="0.55" />
              {/* Main Black Lacquer Barrel */}
              <rect x="45" y="48" width="160" height="10" rx="5" fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
              {/* Gold Center Band */}
              <rect x="132" y="47.5" width="12" height="11" rx="1.5" fill="url(#goldBevel)" />
              {/* Gold End Finial */}
              <rect x="42" y="49" width="10" height="8" rx="3" fill="url(#goldBevel)" />
              {/* Gold Pocket Clip */}
              <path d="M58 46H106L102 49H58V46Z" fill="url(#goldBevel)" />
              {/* Gold Nib Cone & Tip */}
              <path d="M205 48.5L232 53L205 57.5V48.5Z" fill="url(#goldBevel)" />
            </g>
          </g>

          {/* ============================================================== */}
          {/* 3. PROFESSIONAL CONFERENCE MICROPHONE WITH GLOWING RING        */}
          {/* ============================================================== */}
          <g transform="translate(835, 480)">
            {/* Base Shadow on Table */}
            <ellipse cx="82" cy="240" rx="56" ry="14" fill="#04070C" opacity="0.8" />
            {/* Heavy Metallic Microphone Console Base */}
            <path
              d="M36 226C36 214 56 206 82 206C108 206 128 214 128 226L134 238C134 244 110 250 82 250C54 250 30 244 30 238L36 226Z"
              fill="#1E293B"
              stroke="url(#goldBevel)"
              strokeWidth="1.5"
            />
            {/* Illuminated Speak Button on Base */}
            <ellipse cx="82" cy="228" rx="14" ry="5" fill="#C9A15A" opacity="0.85" />

            {/* Sleek Curved Gooseneck Stem */}
            <path
              d="M82 210V135C82 88 64 62 32 45"
              stroke="#CBD5E1"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M82 210V135C82 88 64 62 32 45"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Glowing LED Ring on Microphone Neck */}
            <ellipse
              cx="34"
              cy="46"
              rx="5"
              ry="7"
              transform="rotate(-28 34 46)"
              fill="#F59E0B"
            />
            {/* Microphone Foam Head / Capsule */}
            <rect
              x="4"
              y="26"
              width="34"
              height="18"
              rx="9"
              transform="rotate(26 4 26)"
              fill="#0F172A"
              stroke="#C9A15A"
              strokeWidth="1.2"
            />
          </g>

          {/* ============================================================== */}
          {/* 4. CRYSTAL GLASS OF WATER WITH SUNSET SPECULAR HIGHLIGHTS      */}
          {/* ============================================================== */}
          <g transform="translate(1015, 585)">
            {/* Glass Base Shadow & Golden Caustic Reflection on Table */}
            <ellipse cx="48" cy="152" rx="38" ry="11" fill="#05080F" opacity="0.65" />
            <ellipse cx="56" cy="154" rx="28" ry="7" fill="#FFD27D" opacity="0.32" />

            {/* Crystal Tumbler Body */}
            <path
              d="M14 18H82L74 146C74 152 62 157 48 157C34 157 22 152 22 146L14 18Z"
              fill="url(#crystalGlass)"
              stroke="#FFFFFF"
              strokeWidth="1.8"
              strokeOpacity="0.65"
            />
            {/* Water Fill Level & Meniscus */}
            <path
              d="M17 56C30 61 66 61 79 56L74 142C74 148 62 153 48 153C34 153 22 148 22 142L17 56Z"
              fill="#BAE6FD"
              fillOpacity="0.24"
            />
            <ellipse cx="48" cy="56" rx="31" ry="6.5" fill="#E0F2FE" fillOpacity="0.42" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.6" />
            {/* Top Rim Ellipse */}
            <ellipse cx="48" cy="18" rx="34" ry="7" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeOpacity="0.75" />
            {/* Thick Crystal Base */}
            <path d="M22 134H74L73 148C73 153 62 157 48 157C34 157 23 153 23 148L22 134Z" fill="#FFFFFF" fillOpacity="0.38" />
            {/* Vertical Specular Highlight */}
            <line x1="25" y1="26" x2="29" y2="138" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.65" />
            <line x1="69" y1="28" x2="66" y2="136" stroke="#FFE1A8" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.55" />
          </g>
        </svg>
      </div>

      {/* Subtle Top-Left Geometric Ornament on the Visual Showcase */}
      <CornerGeometricOrnament position="top-left" variant="dark" />

      {/* ================================================================== */}
      {/* 3. REAL SELECTABLE & COPYABLE HTML TEXT OVERLAY (TOP / UPPER AREA) */}
      {/* ================================================================== */}
      <div className="relative z-20 w-full px-6 sm:px-10 xl:px-16 pt-8 sm:pt-12 lg:pt-14 pb-6 flex flex-col items-center lg:items-start text-center lg:text-right">
        {/* Decorative Gold Institutional Top Rule */}
        <div className="inline-flex items-center gap-2.5 mb-4">
          <span className="h-[2px] w-10 bg-gradient-to-r from-[#C9A15A] to-[#F3D899] rounded-full" />
          <span className="w-2 h-2 rotate-45 bg-[#C9A15A]" />
          <span className="h-[2px] w-10 bg-gradient-to-l from-[#C9A15A] to-[#F3D899] rounded-full" />
        </div>

        {/* Main Arabic Title (h1 - Real HTML Text) */}
        <h1
          dir="rtl"
          className="text-2xl sm:text-3xl xl:text-[38px] font-extrabold text-white tracking-tight leading-[1.35] drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)] max-w-2xl"
        >
          نظام إدارة وتوثيق محاضر الاجتماعات
        </h1>

        {/* Main English Title (h2 - Real HTML Text) */}
        <h2
          dir="ltr"
          style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
          className="mt-2 text-sm sm:text-base xl:text-[19px] font-semibold text-[#E8EEF5] tracking-wide leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] max-w-2xl"
        >
          Meeting Minutes Management and Documentation System
        </h2>

        {/* Gold Divider Accent */}
        <div className="my-4 sm:my-5 w-28 sm:w-36 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A15A] to-transparent lg:from-[#C9A15A] lg:via-[#C9A15A]/70 lg:to-transparent" />

        {/* Tagline Box with Glassmorphic Contrast Layer */}
        <div className="inline-flex flex-col items-center lg:items-start bg-[#072342]/65 backdrop-blur-md border border-[#C9A15A]/35 rounded-2xl px-5 py-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.38)]">
          {/* Arabic Tagline (p - Real HTML Text) */}
          <p
            dir="rtl"
            className="text-base sm:text-lg xl:text-[21px] font-bold text-[#F5DFB0] tracking-normal leading-relaxed"
          >
            توثيق أكثر .. لقرارات أفضل
          </p>

          {/* English Tagline (p - Real HTML Text) */}
          <p
            dir="ltr"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
            className="mt-0.5 text-xs sm:text-sm xl:text-[15px] font-medium text-[#CBD5E1] tracking-wider"
          >
            Better Documentation .. For Better Decisions
          </p>
        </div>
      </div>

      {/* Bottom Subtle Ambient Vignette */}
      <div className="relative z-10 h-10 bg-gradient-to-t from-[#041020]/80 to-transparent pointer-events-none" />
    </section>
  );
};
