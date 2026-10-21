import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { SystemUser } from '../../types/meeting';
import {
  authenticateUser,
  SYSTEM_ACCOUNT_PRESETS,
  ValidationError,
} from '../../services/authService';
import { SystemEmblemLogo } from './SystemEmblemLogo';

interface LoginFormCardProps {
  systemUsers: SystemUser[];
  onLoginSuccess: (user: SystemUser, sessionToken: string) => void;
  onOpenForgotPassword: (currentUsername: string) => void;
}

/**
 * Right-side institutional login card containing the ordered elements,
 * literal bilingual labels, interactive password visibility toggle,
 * bilingual validation messages, and role authentication.
 */
export const LoginFormCard: React.FC<LoginFormCardProps> = ({
  systemUsers,
  onLoginSuccess,
  onOpenForgotPassword,
}) => {
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [selectedPresetRole, setSelectedPresetRole] = useState<'rapporteur' | 'chairman' | 'regular'>('rapporteur');

  const usernameError = errors.find((err) => err.field === 'username');
  const passwordError = errors.find((err) => err.field === 'password');
  const generalError = errors.find((err) => err.field === 'general');

  const handleSelectPreset = (preset: (typeof SYSTEM_ACCOUNT_PRESETS)[number]) => {
    setSelectedPresetRole(preset.roleKey);
    setUsername(preset.username);
    setPassword(preset.defaultPassPreview);
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    try {
      const response = await authenticateUser(username, password, systemUsers, selectedPresetRole);
      if (!response.success || !response.user) {
        setErrors(
          response.errors || [
            {
              field: 'general',
              messageAr: 'تعذر تسجيل الدخول. يرجى التحقق من البيانات المدخلة.',
              messageEn: 'Unable to sign in. Please verify your credentials.',
            },
          ]
        );
        return;
      }

      onLoginSuccess(response.user, response.sessionToken || '');
    } catch {
      setErrors([
        {
          field: 'general',
          messageAr: 'حدث خطأ غير متوقع أثناء الاتصال بالخادم.',
          messageEn: 'An unexpected error occurred while connecting to the server.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-20 w-full max-w-[470px] mx-auto select-text">
      {/* Main Institutional Card */}
      <div className="relative bg-white rounded-[28px] border border-[#E2E8F0] shadow-[0_20px_60px_-15px_rgba(7,55,99,0.14),0_4px_20px_-4px_rgba(201,161,90,0.1)] px-6 sm:px-10 py-7 sm:py-9 overflow-hidden">
        {/* Subtle Top Gold & Navy Architectural Border */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#073763] via-[#C9A15A] to-[#0B2E59]" />

        {/* Subtle Inner Corner Gold Accents */}
        <div className="pointer-events-none absolute top-3.5 right-3.5 w-5 h-5 border-t-2 border-r-2 border-[#C9A15A]/45 rounded-tr-lg" />
        <div className="pointer-events-none absolute top-3.5 left-3.5 w-5 h-5 border-t-2 border-l-2 border-[#C9A15A]/45 rounded-tl-lg" />

        {/* 1. System Emblem SVG + 2. Arabic Title + 3. English Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <SystemEmblemLogo className="w-20 h-20 sm:w-[88px] sm:h-[88px] mb-3" />

          <h2
            dir="rtl"
            className="text-lg sm:text-[21px] font-extrabold text-[#073763] tracking-tight leading-snug"
          >
            نظام إدارة وتوثيق محاضر الاجتماعات
          </h2>

          <p
            dir="ltr"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
            className="mt-1 text-xs sm:text-[13px] font-semibold text-[#7C8CA5] tracking-wide leading-relaxed"
          >
            Meeting Minutes Management and Documentation System
          </p>

          {/* Gold Ornamental Divider */}
          <div className="mt-3.5 flex items-center justify-center gap-2 w-full">
            <span className="h-[1px] w-14 bg-gradient-to-l from-[#C9A15A] to-transparent" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C9A15A]" />
            <span className="h-[1px] w-14 bg-gradient-to-r from-[#C9A15A] to-transparent" />
          </div>
        </div>

        {/* General Authentication Error Banner */}
        {generalError && (
          <div
            role="alert"
            dir="rtl"
            className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-right space-y-0.5">
              <p className="text-xs font-bold text-rose-800">{generalError.messageAr}</p>
              <p
                dir="ltr"
                style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                className="text-[11px] font-medium text-rose-600 text-left"
              >
                {generalError.messageEn}
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* 4. USERNAME FIELD WITH USER ICON */}
          <div>
            <label
              htmlFor="login-username-input"
              className="flex items-center justify-between mb-1.5 px-0.5 cursor-pointer"
            >
              <span
                dir="rtl"
                className="text-xs sm:text-[13.5px] font-bold text-[#073763]"
              >
                اسم المستخدم
              </span>
              <span
                dir="ltr"
                style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                className="text-xs sm:text-[12.5px] font-semibold text-[#7C8CA5]"
              >
                Username
              </span>
            </label>

            <div className="relative flex items-center group">
              {/* Right User Icon */}
              <span
                className={`absolute right-3.5 pointer-events-none transition-colors ${
                  usernameError
                    ? 'text-rose-500'
                    : 'text-[#073763]/70 group-focus-within:text-[#073763]'
                }`}
              >
                <User className="w-[18px] h-[18px]" strokeWidth={2.1} />
              </span>

              <input
                id="login-username-input"
                name="username"
                type="text"
                autoComplete="username"
                dir="ltr"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.length > 0) setErrors([]);
                }}
                placeholder="اسم المستخدم / Username"
                aria-invalid={Boolean(usernameError)}
                aria-describedby={usernameError ? 'username-error-msg' : undefined}
                style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                className={`w-full pr-11 pl-4 py-3 rounded-xl bg-[#F7F8FA] text-sm font-semibold text-[#073763] placeholder:text-[#7C8CA5]/75 border transition-all duration-150 focus:bg-white focus:outline-none ${
                  usernameError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15'
                    : 'border-slate-200/90 hover:border-[#C9A15A]/70 focus:border-[#073763] focus:ring-3 focus:ring-[#073763]/12'
                }`}
              />
            </div>

            {/* Bilingual Field Validation Message */}
            {usernameError && (
              <div
                id="username-error-msg"
                role="alert"
                className="mt-1.5 px-1 flex items-center justify-between gap-2 text-[11px] font-bold text-rose-600"
              >
                <span dir="rtl">{usernameError.messageAr}</span>
                <span
                  dir="ltr"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                >
                  {usernameError.messageEn}
                </span>
              </div>
            )}
          </div>

          {/* 5. PASSWORD FIELD WITH LOCK ICON + SHOW/HIDE PASSWORD TOGGLE */}
          <div>
            <label
              htmlFor="login-password-input"
              className="flex items-center justify-between mb-1.5 px-0.5 cursor-pointer"
            >
              <span
                dir="rtl"
                className="text-xs sm:text-[13.5px] font-bold text-[#073763]"
              >
                كلمة المرور
              </span>
              <span
                dir="ltr"
                style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                className="text-xs sm:text-[12.5px] font-semibold text-[#7C8CA5]"
              >
                Password
              </span>
            </label>

            <div className="relative flex items-center group">
              {/* Right Lock Icon */}
              <span
                className={`absolute right-3.5 pointer-events-none transition-colors ${
                  passwordError
                    ? 'text-rose-500'
                    : 'text-[#073763]/70 group-focus-within:text-[#073763]'
                }`}
              >
                <Lock className="w-[18px] h-[18px]" strokeWidth={2.1} />
              </span>

              <input
                id="login-password-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                dir="ltr"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.length > 0) setErrors([]);
                }}
                placeholder="كلمة المرور / Password"
                aria-invalid={Boolean(passwordError)}
                aria-describedby={passwordError ? 'password-error-msg' : undefined}
                style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                className={`w-full pr-11 pl-11 py-3 rounded-xl bg-[#F7F8FA] text-sm font-semibold text-[#073763] placeholder:text-[#7C8CA5]/75 border transition-all duration-150 focus:bg-white focus:outline-none ${
                  passwordError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15'
                    : 'border-slate-200/90 hover:border-[#C9A15A]/70 focus:border-[#073763] focus:ring-3 focus:ring-[#073763]/12'
                }`}
              />

              {/* 6. SHOW / HIDE PASSWORD BUTTON */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? 'إخفاء كلمة المرور - Hide password'
                    : 'إظهار كلمة المرور - Show password'
                }
                title={
                  showPassword
                    ? 'إخفاء كلمة المرور / Hide Password'
                    : 'إظهار كلمة المرور / Show Password'
                }
                className="absolute left-3 p-1.5 rounded-lg text-[#7C8CA5] hover:text-[#073763] hover:bg-slate-200/60 transition cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
                ) : (
                  <Eye className="w-[18px] h-[18px]" strokeWidth={2} />
                )}
              </button>
            </div>

            {/* Bilingual Field Validation Message */}
            {passwordError && (
              <div
                id="password-error-msg"
                role="alert"
                className="mt-1.5 px-1 flex items-center justify-between gap-2 text-[11px] font-bold text-rose-600"
              >
                <span dir="rtl">{passwordError.messageAr}</span>
                <span
                  dir="ltr"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                >
                  {passwordError.messageEn}
                </span>
              </div>
            )}
          </div>

          {/* 7. LOGIN SUBMIT BUTTON */}
          <div className="pt-1.5">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#073763] via-[#0B2E59] to-[#073763] hover:from-[#09447A] hover:via-[#073763] hover:to-[#0B2E59] active:scale-[0.99] text-white font-bold shadow-[0_10px_25px_-5px_rgba(7,55,99,0.45)] hover:shadow-[0_14px_30px_-5px_rgba(7,55,99,0.55)] border border-[#C9A15A]/50 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#C9A15A]" />
                  <span className="text-sm font-extrabold">جاري تسجيل الدخول...</span>
                  <span
                    dir="ltr"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                    className="text-xs font-semibold text-[#F5DFB0]"
                  >
                    Signing in...
                  </span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#C9A15A] group-hover:-translate-x-0.5 transition-transform" />
                  <span dir="rtl" className="text-base font-extrabold tracking-wide">
                    تسجيل الدخول
                  </span>
                  <span className="text-[#C9A15A]/70 font-light">|</span>
                  <span
                    dir="ltr"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                    className="text-sm font-bold tracking-wider text-[#F5DFB0]"
                  >
                    Login
                  </span>
                </>
              )}
            </button>
          </div>

          {/* 8. FORGOT PASSWORD LINK */}
          <div className="pt-1 flex items-center justify-center">
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                onOpenForgotPassword(username);
              }}
              className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#073763] hover:text-[#C9A15A] transition-colors py-1 px-2 rounded-lg hover:bg-[#F7F8FA]"
            >
              <span dir="rtl">نسيت كلمة المرور؟</span>
              <span className="text-[#C9A15A]">•</span>
              <span
                dir="ltr"
                style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                className="font-semibold text-[#7C8CA5] hover:text-[#073763] transition-colors"
              >
                Forgot Password?
              </span>
            </a>
          </div>
        </form>

        {/* Quick Institutional Account Role Switcher (For Seamless Demo & Role Testing) */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-[#7C8CA5] font-semibold mb-2 px-0.5">
            <span className="flex items-center gap-1 text-[#073763]">
              <UserCheck className="w-3.5 h-3.5 text-[#C9A15A]" />
              <span>الحسابات المؤسسية المعتمدة:</span>
            </span>
            <span
              dir="ltr"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
              className="text-[10px]"
            >
              Authorized Roles
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {SYSTEM_ACCOUNT_PRESETS.map((preset) => {
              const isSelected = selectedPresetRole === preset.roleKey && username === preset.username;
              return (
                <button
                  key={preset.roleKey}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2 py-1.5 rounded-lg text-[10.5px] font-bold border transition text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#073763]/8 border-[#C9A15A] text-[#073763] shadow-2xs'
                      : 'bg-[#F7F8FA] border-slate-200/80 text-[#7C8CA5] hover:text-[#073763] hover:border-slate-300'
                  }`}
                >
                  <div className="truncate">
                    {preset.roleKey === 'rapporteur'
                      ? 'مقرر الاجتماع'
                      : preset.roleKey === 'chairman'
                      ? 'رئيس الاجتماع'
                      : 'مستخدم عادي'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
