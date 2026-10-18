import React, { useRef } from 'react';
import { Info, Image, CheckSquare, Sparkles, Hash, FolderPlus, RotateCcw, FileText } from 'lucide-react';
import { MeetingMinute } from '../types/meeting';

interface SecondaryToolbarProps {
  meeting: MeetingMinute;
  onUpdateMeeting: (updated: MeetingMinute) => void;
  onRequestStatusChange?: (status: MeetingMinute['status']) => void;
  isEditMode: boolean;
  onOpenAddSection?: () => void;
  onResetTemplate?: () => void;
  onExportWord?: () => void;
}

export const SecondaryToolbar: React.FC<SecondaryToolbarProps> = ({
  meeting,
  onUpdateMeeting,
  onRequestStatusChange,
  isEditMode,
  onOpenAddSection,
  onResetTemplate,
  onExportWord,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isEditMode) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateMeeting({
            ...meeting,
            logoSrc: event.target.result as string,
            updatedAt: new Date().toISOString(),
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleContinuous = (checked: boolean) => {
    onUpdateMeeting({
      ...meeting,
      continuousNumbering: checked,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleStatusChange = (status: MeetingMinute['status']) => {
    if (onRequestStatusChange) {
      onRequestStatusChange(status);
    } else {
      onUpdateMeeting({
        ...meeting,
        status,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="no-print bg-white border-b border-slate-200 shadow-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            <Info className="w-3.5 h-3.5" />
            <span>التحرير التفاعلي مفعّل:</span>
          </span>
          <span className="hidden sm:inline text-slate-600">
            انقر مباشرة داخل أي نص لتعديله، أو استخدم أزرار التحكم لإضافة وحذف الصفوف.
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Continuous numbering toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={meeting.continuousNumbering}
              onChange={(e) => toggleContinuous(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
            />
            <span className="font-medium">ترقيم تسلسلي مستمر عبر جميع الأقسام</span>
          </label>

          {/* Meeting Number & Count Manual Control */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
            <Hash className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-700 font-semibold">رقم المحضر (العدد):</span>
            <input
              type="text"
              value={meeting.meetingNum}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateMeeting({
                  ...meeting,
                  meetingNum: val,
                  title: `محضر اجتماع رقم ( ${val} ) لسنة ${meeting.meetingYear}`,
                  updatedAt: new Date().toISOString(),
                });
              }}
              className="w-12 text-center font-mono font-extrabold bg-white border border-slate-300 rounded px-1 py-0.5 text-blue-900 focus:ring-1 focus:ring-blue-500 text-xs shadow-2xs"
              title="تعديل رقم المحضر والعدد يدوياً"
              placeholder="01"
            />
            <span className="text-slate-500 font-semibold">لسنة:</span>
            <input
              type="text"
              value={meeting.meetingYear}
              onChange={(e) => {
                const val = e.target.value;
                onUpdateMeeting({
                  ...meeting,
                  meetingYear: val,
                  title: `محضر اجتماع رقم ( ${meeting.meetingNum} ) لسنة ${val}`,
                  updatedAt: new Date().toISOString(),
                });
              }}
              className="w-16 text-center font-mono font-bold bg-white border border-slate-300 rounded px-1 py-0.5 text-slate-800 focus:ring-1 focus:ring-blue-500 text-xs shadow-2xs"
              title="تعديل سنة المحضر يدوياً"
              placeholder="2026"
            />
          </div>

          {/* Meeting Status Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">حالة المحضر:</span>
            <select
              value={meeting.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="border border-slate-300 rounded px-2 py-0.5 text-xs bg-slate-50 font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="مسودة">مسودة عمل</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="معتمد وموقع">معتمد وموقع رسمياً</option>
            </select>
          </div>

          {/* Add Section button */}
          {onOpenAddSection && (
            <button
              type="button"
              onClick={onOpenAddSection}
              className="text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition cursor-pointer text-xs"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>إضافة قسم جديد</span>
            </button>
          )}

          {/* Logo upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition cursor-pointer"
          >
            <Image className="w-3.5 h-3.5" />
            <span>تغيير الشعار</span>
          </button>

          {/* Export Word button */}
          {onExportWord && (
            <button
              type="button"
              onClick={onExportWord}
              className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition cursor-pointer relative group"
              title="تصدير محضر الاجتماع بصيغة Word (.docx) بجميع عناصره وتنسيقاته"
              aria-label="تصدير إلى Word"
            >
              <div className="relative flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="absolute -bottom-1 -right-1 text-[6.5px] font-black bg-blue-600 text-white rounded-[1.5px] px-0.5 leading-none">
                  W
                </span>
              </div>
            </button>
          )}

          {/* Restore Template button */}
          {onResetTemplate && (
            <button
              type="button"
              onClick={onResetTemplate}
              className="p-1.5 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition cursor-pointer"
              title="استعادة النموذج الأصلي"
              aria-label="استعادة النموذج الأصلي"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
