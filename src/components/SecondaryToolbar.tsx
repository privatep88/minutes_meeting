import React, { useRef } from 'react';
import { Info, Image, CheckSquare, Sparkles, Hash } from 'lucide-react';
import { MeetingMinute } from '../types/meeting';

interface SecondaryToolbarProps {
  meeting: MeetingMinute;
  onUpdateMeeting: (updated: MeetingMinute) => void;
  isEditMode: boolean;
}

export const SecondaryToolbar: React.FC<SecondaryToolbarProps> = ({
  meeting,
  onUpdateMeeting,
  isEditMode,
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
    onUpdateMeeting({
      ...meeting,
      status,
      updatedAt: new Date().toISOString(),
    });
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

          {/* Logo upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition cursor-pointer"
          >
            <Image className="w-3.5 h-3.5" />
            <span>تغيير الشعار</span>
          </button>
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
