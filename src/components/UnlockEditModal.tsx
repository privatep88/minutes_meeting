import React, { useState } from 'react';
import { Lock, Unlock, AlertTriangle, X, ShieldAlert, FileEdit } from 'lucide-react';
import { MeetingMinute } from '../types/meeting';

interface UnlockEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingMinute | null;
  onConfirmUnlock: (meetingId: string, reason: string, user: string, userEmail: string) => void;
}

export const UnlockEditModal: React.FC<UnlockEditModalProps> = ({
  isOpen,
  onClose,
  meeting,
  onConfirmUnlock,
}) => {
  const [reason, setReason] = useState('');
  const [userName, setUserName] = useState('أ. خالد احمد الهاشمي (مقرر الاجتماع)');
  const [userEmail, setUserEmail] = useState('mr.aljefre@gmail.com');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !meeting) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('يرجى كتابة سبب ومبررات فتح التعديل على هذا المحضر المعتمد.');
      return;
    }
    setErrorMsg('');
    onConfirmUnlock(meeting.id, reason.trim(), userName.trim(), userEmail.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-amber-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                طلب تحرير وتعديل محضر معتمد
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                محضر اجتماع رقم ( {meeting.meetingNum} ) لسنة {meeting.meetingYear}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs md:text-sm">
          {/* Important Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2 text-amber-950">
            <div className="text-xs font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>ضوابط تعديل المحاضر المعتمدة رسمياً:</span>
            </div>
            <ul className="text-[11px] space-y-1 list-disc list-inside text-amber-900 leading-relaxed pr-1">
              <li>هذا المحضر معتمد ومقفل رسمياً، ولن يُسمح بالتعديل إلا بتوثيق المبررات.</li>
              <li>
                <strong>لن يُحذف سجل الاعتماد الأصلي</strong>، وسيتم حفظ هذه العملية بالكامل في{' '}
                <strong>سجل التدقيق (Audit Log)</strong> شاملاً البيانات السابقة وهوية المستخدم.
              </li>
              <li>
                ستتحول حالة المحضر تلقائياً إلى <strong>«قيد المراجعة»</strong> ولن يعود لحالة «معتمد»
                إلا بعد استكمال التعديلات وإعادة الاعتماد من زر «اعتماد المحضر».
              </li>
            </ul>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 p-2.5 rounded-lg border border-rose-200 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                سبب ومبررات فتح التعديل <span className="text-rose-600">*</span>:
              </label>
              <textarea
                required
                rows={3}
                placeholder="مثال: تعديل مسمى مسؤولية التنفيذ للبند رقم 2 بناءً على توجيهات رئيس الاجتماع..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 text-slate-900 text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                اسم المستخدم المنفذ للتعديل:
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 text-slate-900 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                البريد الإلكتروني / معرف الحساب:
              </label>
              <input
                type="email"
                required
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 text-slate-900 text-xs font-mono font-medium"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              إلغاء التراجع
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>الموافقة وفتح التعديل في المحرر</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
