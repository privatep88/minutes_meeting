import React, { useState } from 'react';
import { SystemUser } from '../../types/meeting';
import { LoginVisualShowcase } from './LoginVisualShowcase';
import { LoginFormCard } from './LoginFormCard';
import { LoginFeaturesBar } from './LoginFeaturesBar';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { CornerGeometricOrnament } from './SystemEmblemLogo';

interface LoginPageProps {
  systemUsers: SystemUser[];
  onLoginSuccess: (user: SystemUser, sessionToken: string) => void;
}

/**
 * Main Enterprise Login Page for the Meeting Minutes Management and Documentation System.
 * Preserves the exact visual hierarchy:
 * - Physical Left Side: Large sunset corporate boardroom visual showcase with real HTML titles & taglines.
 * - Diagonal Divider Line separating the left visual area and right login panel on desktop/laptop viewports.
 * - Physical Right Side: Ivory/white login panel with subtle geometric ornaments and the centered login card.
 * - Bottom Strip: Horizontal bar with the three core system features.
 */
export const LoginPage: React.FC<LoginPageProps> = ({
  systemUsers,
  onLoginSuccess,
}) => {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [recoveryUsername, setRecoveryUsername] = useState('');

  const handleOpenForgotPassword = (currentUsername: string) => {
    setRecoveryUsername(currentUsername);
    setForgotPasswordOpen(true);
  };

  return (
    <div
      dir="ltr"
      className="min-h-screen w-full bg-[#F7F8FA] text-[#073763] flex flex-col justify-between overflow-x-hidden select-text"
    >
      {/* MAIN SPLIT VIEWPORT: Left Visual Showcase + Diagonal Separator + Right Login Panel */}
      <main className="relative flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-76px)] overflow-hidden">
        {/* ================================================================ */}
        {/* PHYSICAL LEFT SIDE: LARGE VISUAL SHOWCASE (56% width on Desktop) */}
        {/* ================================================================ */}
        <div className="relative w-full lg:w-[57%] xl:w-[58%] min-h-[430px] sm:min-h-[480px] lg:min-h-full shrink-0 z-10">
          <LoginVisualShowcase />

          {/* Diagonal Architectural Divider Overlay (Visible on Desktop lg+) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-0 -right-1 bottom-0 w-28 xl:w-36 z-20 pointer-events-none select-none"
          >
            <svg
              viewBox="0 0 140 1000"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="diagGoldLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DEC082" />
                  <stop offset="50%" stopColor="#C9A15A" />
                  <stop offset="100%" stopColor="#9B732C" />
                </linearGradient>
                <linearGradient id="diagNavyRibbon" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#073763" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0B2E59" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Ivory Right-Side Wedge creating the Diagonal Split */}
              <polygon points="140,0 140,1000 18,1000 108,0" fill="#F7F8FA" />

              {/* Secondary Navy Architectural Ribbon */}
              <polygon
                points="108,0 118,0 28,1000 18,1000"
                fill="url(#diagNavyRibbon)"
              />

              {/* Primary Gold Diagonal Bevel Line */}
              <polygon
                points="102,0 109,0 19,1000 12,1000"
                fill="url(#diagGoldLine)"
              />

              {/* Fine Inner Gold Accent Hairline */}
              <line
                x1="124"
                y1="0"
                x2="34"
                y2="1000"
                stroke="#C9A15A"
                strokeWidth="1.5"
                strokeOpacity="0.45"
              />
            </svg>
          </div>
        </div>

        {/* ================================================================ */}
        {/* PHYSICAL RIGHT SIDE: ELEGANT LOGIN PANEL (43% width on Desktop)  */}
        {/* ================================================================ */}
        <section
          aria-label="لوحة تسجيل الدخول - Login Panel"
          dir="rtl"
          className="relative flex-1 w-full lg:w-[43%] xl:w-[42%] bg-gradient-to-br from-[#FFFFFF] via-[#F7F8FA] to-[#EFF3F8] flex flex-col items-center justify-center px-4 sm:px-8 lg:px-10 xl:px-14 py-8 sm:py-12 z-20"
        >
          {/* Calm Geometric Corner Ornaments */}
          <CornerGeometricOrnament position="top-right" variant="light" />
          <CornerGeometricOrnament position="bottom-right" variant="light" />
          <CornerGeometricOrnament position="bottom-left" variant="light" />

          {/* Subtle Ambient Radial Glow Behind Card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#073763]/5 via-[#C9A15A]/8 to-transparent blur-3xl"
          />

          {/* Centered Login Card */}
          <LoginFormCard
            systemUsers={systemUsers}
            onLoginSuccess={onLoginSuccess}
            onOpenForgotPassword={handleOpenForgotPassword}
          />
        </section>
      </main>

      {/* ================================================================== */}
      {/* BOTTOM HORIZONTAL FEATURE STRIP (3 Key Features with Icons)        */}
      {/* ================================================================== */}
      <LoginFeaturesBar />

      {/* ================================================================== */}
      {/* INTERACTIVE FORGOT PASSWORD MODAL                                  */}
      {/* ================================================================== */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        initialUsername={recoveryUsername}
      />
    </div>
  );
};
