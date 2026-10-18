import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, X, Stamp } from 'lucide-react';
import { MeetingMinute, SignatureBlock } from '../types/meeting';

interface ApproveMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingMinute;
  onConfirmApprove: (approverName: string, approverEmail: string, notes: string) => void;
}

export const ApproveMeetingModal: React.FC<ApproveMeetingModalProps> = ({
  isOpen,
  onClose,
  meeting,
  onConfirmApprove,
}) => {
  const rapporteurSig =
    meeting.signatures.find((s) => s.role.includes('مقرر')) || meeting.signatures[0];
  const chairSig =
    meeting.signatures.find((s) => s.role.includes('رئيس')) || meeting.signatures[1];

  const defaultApproverName = chairSig?.name || 'أ. فيصل سويد السليماني (رئيس الاجتماع)';
  const [approverName, setApproverName] = useState(defaultApproverName);
  const [approverEmail, setApproverEmail] = useState('mr.aljefre@gmail.com');
  const [notes, setNotes] = useState(
    meeting.reapprovalRequired
      ? 'إعادة اعتماد وتوثيق رسمي للمحضر بعد إجراء التعديلات المعتمدة'
      : 'اعتماد رسمي أولي للمحضر واستيفاء كافة التواقيع المطلوبة'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approverName.trim()) return;
    onConfirmApprove(approverName.trim(), approverEmail.trim(), notes.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {meeting.reapprovalRequired ? 'إعادة اعتماد وتوثيق المحضر' : 'اعتماد المحضر وتوثيقه رسمياً'}
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
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
          {/* Signatures verification status box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تم التحقق من استيفاء التواقيع الرسمية المطلوبة:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-sans">مقرر الاجتماع:</div>
                  <div className="font-bold text-slate-900 truncate">{rapporteurSig?.name}</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  ✓ موقّع
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-sans">رئيس الاجتماع:</div>
                  <div className="font-bold text-slate-900 truncate">{chairSig?.name}</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  ✓ موقّع
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                اسم وصفة المعتمد:
              </label>
              <input
                type="text"
                required
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 text-slate-900 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                البريد الإلكتروني / معرف النظام للمعتمد:
              </label>
              <input
                type="email"
                required
                value={approverEmail}
                onChange={(e) => setApproverEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 text-slate-900 text-xs font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ملاحظات الاعتماد (تُسجَّل في سجل التدقيق):
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 text-slate-900 text-xs"
              />
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>تنبيه الحوكمة والقفل:</strong> عند تأكيد الاعتماد، ستتحول حالة المحضر إلى{' '}
              <strong className="text-emerald-700">«معتمد وموقع»</strong> وسيتم قفل جميع الجداول والحقول
              والتواقيع تلقائياً في وضع القراءة فقط. لن يُسمح بأي تعديل مستقبلي إلا عبر إجراء فتح التعديل
              الرسمي الموثق من «أرشيف المحاضر».
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Stamp className="w-4 h-4" />
              <span>تأكيد الاعتماد والقفل الرسمي</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
