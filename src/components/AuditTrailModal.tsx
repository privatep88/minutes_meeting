import React, { useState } from 'react';
import {
  History,
  ShieldCheck,
  Clock,
  User,
  FileText,
  AlertTriangle,
  X,
  CheckCircle2,
  Lock,
  Unlock,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { MeetingMinute, AuditRecord, ApprovalRecord } from '../types/meeting';

interface AuditTrailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingMinute;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  isOpen,
  onClose,
  meeting,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'approvals'>('audit');

  if (!isOpen) return null;

  const auditLog: AuditRecord[] = meeting.auditLog || [];
  const approvalHistory: ApprovalRecord[] = meeting.approvalHistory || [];

  return (
    <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shadow-xs">
              <History className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>سجل التدقيق والاعتمادات الرسمية</span>
                <span className="text-[11px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full font-sans">
                  {meeting.status}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                محضر اجتماع رقم ( {meeting.meetingNum} ) لسنة {meeting.meetingYear} — {meeting.companyName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>سجل التدقيق والعمليات ({auditLog.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approvals')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'approvals'
                ? 'border-emerald-600 text-emerald-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>سجل الاعتمادات التاريخية ({approvalHistory.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs md:text-sm">
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {auditLog.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">لا توجد عمليات تدقيق مسجلة حتى الآن</p>
                  <p className="text-xs text-slate-400 mt-1">
                    يتم تسجيل أي عملية اعتماد، أو فتح تعديل، أو إعادة اعتماد تلقائياً هنا.
                  </p>
                </div>
              ) : (
                <div className="relative border-r-2 border-slate-200 pr-4 space-y-4 mr-2">
                  {auditLog.map((item, idx) => {
                    const isApproval = item.action === 'اعتماد' || item.action === 'إعادة_اعتماد';
                    const isUnlock = item.action === 'فتح_تعديل';

                    return (
                      <div key={item.id || idx} className="relative group">
                        {/* Bullet Icon */}
                        <div
                          className={`absolute -right-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                            isApproval ? 'bg-emerald-600' : isUnlock ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                        />

                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                                isApproval
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isUnlock
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {isApproval ? (
                                <ShieldCheck className="w-3.5 h-3.5" />
                              ) : isUnlock ? (
                                <Unlock className="w-3.5 h-3.5" />
                              ) : (
                                <History className="w-3.5 h-3.5" />
                              )}
                              <span>{item.actionLabel || item.action}</span>
                            </span>

                            <span className="text-[11px] text-slate-500 font-sans flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{new Date(item.timestamp).toLocaleString('ar-SA')}</span>
                            </span>
                          </div>

                          <div className="text-xs text-slate-800 font-semibold mb-1 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>المستخدم المنفذ:</span>
                            <span className="text-slate-900 font-bold">{item.user}</span>
                            {item.userEmail && (
                              <span className="text-slate-500 font-mono text-[11px]">({item.userEmail})</span>
                            )}
                          </div>

                          {item.reason && (
                            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2.5 my-2 text-xs text-amber-900 font-medium">
                              <div className="font-bold text-[11px] text-amber-800 mb-0.5">سبب ومبررات التعديل:</div>
                              <div>{item.reason}</div>
                            </div>
                          )}

                          {item.details && (
                            <p className="text-xs text-slate-600 leading-relaxed mt-1 font-normal">
                              {item.details}
                            </p>
                          )}

                          {item.previousStatus && item.newStatus && (
                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-sans">
                              <span>الحالة السابقة:</span>
                              <span className="font-semibold text-slate-700">{item.previousStatus}</span>
                              <span>←</span>
                              <span>الحالة الجديدة:</span>
                              <span className="font-bold text-slate-900">{item.newStatus}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="space-y-3">
              {approvalHistory.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">لا توجد اعتمادات مسجلة لهذا المحضر حتى الآن</p>
                  <p className="text-xs text-slate-400 mt-1">
                    يتم حفظ كل عملية اعتماد كاملة مع اسم المعتمد وتاريخ الاعتماد وتواقيع المقرر والرئيس هنا.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {approvalHistory.map((appr, idx) => (
                    <div
                      key={appr.id || idx}
                      className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                            #{approvalHistory.length - idx}
                          </div>
                          <div>
                            <div className="font-bold text-emerald-950 text-xs">
                              اعتماد رسمي موثق (الإصدار {appr.versionNumber})
                            </div>
                            <div className="text-[11px] text-emerald-700 font-sans">
                              {new Date(appr.approvedAt || appr.timestamp || '').toLocaleString('ar-SA')}
                            </div>
                          </div>
                        </div>

                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          معتمد ومقفل رسمياً
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-slate-500 font-sans">المعتمد: </span>
                          <span className="font-bold text-slate-900">{appr.approvedBy}</span>
                          {appr.userEmail && (
                            <span className="block text-[11px] text-slate-500 font-mono">{appr.userEmail}</span>
                          )}
                        </div>
                        <div>
                          <span className="text-slate-500 font-sans">رئيس الاجتماع: </span>
                          <span className="font-bold text-slate-900">{appr.chairName || 'محدد'}</span>
                          <div className="text-[11px] text-slate-500">
                            مقرر الاجتماع: <span className="font-semibold text-slate-800">{appr.rapporteurName || 'محدد'}</span>
                          </div>
                        </div>
                      </div>

                      {appr.notes && (
                        <div className="bg-white/80 p-2 rounded-lg border border-emerald-100 text-xs text-slate-700">
                          <span className="font-semibold text-emerald-900">ملاحظات الاعتماد: </span>
                          {appr.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            سجل التدقيق محمي ومحفوظ ضمن بيانات الحوكمة في التطبيق.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
