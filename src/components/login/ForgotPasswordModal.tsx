import React, { useState } from 'react';
import { KeyRound, Mail, X, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { requestPasswordReset } from '../../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUsername?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialUsername = '',
}) => {
  const [identifier, setIdentifier] = useState(initialUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    messageAr: string;
    messageEn: string;
  }>({
    type: 'idle',
    messageAr: '',
    messageEn: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'idle', messageAr: '', messageEn: '' });

    try {
      const response = await requestPasswordReset(identifier);
      if (response.success) {
        setStatus({
          type: 'success',
          messageAr: response.messageAr,
          messageEn: response.messageEn,
        });
      } else {
        setStatus({
          type: 'error',
          messageAr: response.messageAr,
          messageEn: response.messageEn,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05162B]/70 backdrop-blur-sm animate-in fade-in duration-200 select-text"
    >
      <div
        dir="rtl"
        className="relative w-full max-w-md bg-white rounded-3xl border border-[#C9A15A]/40 shadow-[0_24px_60px_rgba(7,55,99,0.28)] overflow-hidden"
      >
        {/* Top Gold & Navy Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#073763] via-[#C9A15A] to-[#0B2E59]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق نافذة استعادة كلمة المرور - Close"
          className="absolute top-5 left-5 p-2 rounded-full text-[#7C8CA5] hover:text-[#073763] hover:bg-[#F7F8FA] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Icon & Bilingual Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#073763] to-[#0B2E59] border border-[#C9A15A]/60 flex items-center justify-center shadow-md mb-3.5">
              <KeyRound className="w-7 h-7 text-[#C9A15A]" />
            </div>
            <h2 id="forgot-password-title" className="text-xl font-extrabold text-[#073763]">
              نسيت كلمة المرور؟
            </h2>
            <p
              dir="ltr"
              style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
              className="text-xs font-semibold text-[#7C8CA5] mt-0.5"
            >
              Forgot Password? — Account Recovery
            </p>
          </div>

          {status.type === 'success' ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-right">
                  <p className="text-xs font-bold text-emerald-900 leading-relaxed">
                    {status.messageAr}
                  </p>
                  <p
                    dir="ltr"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                    className="text-[11px] font-medium text-emerald-700 leading-relaxed text-left"
                  >
                    {status.messageEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#073763] to-[#0B2E59] hover:from-[#09447A] hover:to-[#073763] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>العودة إلى تسجيل الدخول / Back to Login</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="text-center space-y-1 mb-2">
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  أدخل اسم المستخدم أو البريد الإلكتروني المؤسسي لإرسال رابط إعادة تعيين كلمة المرور.
                </p>
                <p
                  dir="ltr"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                  className="text-[11px] text-[#7C8CA5]"
                >
                  Enter your username or corporate email to receive a reset link.
                </p>
              </div>

              <div>
                <label
                  htmlFor="recovery-identifier"
                  className="flex items-center justify-between text-xs font-bold text-[#073763] mb-1.5"
                >
                  <span>اسم المستخدم أو البريد المؤسسي</span>
                  <span
                    dir="ltr"
                    style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                    className="text-[11px] font-semibold text-[#7C8CA5]"
                  >
                    Username or Email
                  </span>
                </label>

                <div className="relative flex items-center">
                  <span className="absolute right-3.5 text-[#7C8CA5] pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="recovery-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="k.alhashmi@saaed.ae"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#F7F8FA] border border-slate-200 text-sm text-[#073763] font-medium focus:bg-white focus:outline-none focus:border-[#073763] focus:ring-2 focus:ring-[#073763]/15 transition"
                  />
                </div>
              </div>

              {status.type === 'error' && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-rose-800">{status.messageAr}</p>
                    <p
                      dir="ltr"
                      style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                      className="text-[11px] font-medium text-rose-600 text-left"
                    >
                      {status.messageEn}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#073763] to-[#0B2E59] hover:from-[#09447A] hover:to-[#073763] text-white font-bold text-xs sm:text-sm border border-[#C9A15A]/40 shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C9A15A]" />
                      <span>جاري الإرسال... / Sending...</span>
                    </>
                  ) : (
                    <span>إرسال طلب الاستعادة / Send Reset Link</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 rounded-xl bg-[#F7F8FA] hover:bg-slate-200/70 text-[#073763] font-bold text-xs sm:text-sm border border-slate-200 transition cursor-pointer"
                >
                  إلغاء / Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
