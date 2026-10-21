import React from 'react';
import { ShieldCheck, Globe, FileCheck2 } from 'lucide-react';

/**
 * Bottom horizontal feature strip displaying the three core enterprise pillars
 * with real selectable Arabic and English text and navy/gold icons.
 */
export const LoginFeaturesBar: React.FC = () => {
  const features = [
    {
      id: 'security',
      titleAr: 'أمان عالٍ للبيانات',
      titleEn: 'High Data Security',
      Icon: ShieldCheck,
    },
    {
      id: 'access',
      titleAr: 'سهولة الوصول',
      titleEn: 'Easy Access',
      Icon: Globe,
    },
    {
      id: 'organization',
      titleAr: 'تنظيم وتوثيق احترافي',
      titleEn: 'Professional Organization',
      Icon: FileCheck2,
    },
  ];

  return (
    <footer
      aria-label="مميزات النظام الرئيسية - Key System Features"
      className="relative z-30 w-full bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-[0_-4px_24px_rgba(7,55,99,0.06)] select-text"
    >
      {/* Top Gold Hairline Accent */}
      <div className="w-full h-[2px] bg-gradient-to-r from-[#073763]/20 via-[#C9A15A] to-[#073763]/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4">
        <div
          dir="rtl"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 items-center justify-items-center divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#E2E8F0]"
        >
          {features.map(({ id, titleAr, titleEn, Icon }) => (
            <div
              key={id}
              className="w-full flex items-center justify-center gap-3.5 pt-2.5 first:pt-0 sm:pt-0 px-3 group"
            >
              {/* Navy & Gold Emblematic Icon Box */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#073763] to-[#0B2E59] border border-[#C9A15A]/60 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Icon className="w-5 h-5 text-[#C9A15A]" strokeWidth={2.1} />
              </div>

              {/* Selectable Bilingual Text */}
              <div className="flex flex-col text-right">
                <p
                  dir="rtl"
                  className="text-sm sm:text-[15px] font-bold text-[#073763] leading-snug"
                >
                  {titleAr}
                </p>
                <p
                  dir="ltr"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'Cairo', sans-serif" }}
                  className="text-xs sm:text-[12.5px] font-medium text-[#7C8CA5] tracking-wide leading-tight mt-0.5 text-right"
                >
                  {titleEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
