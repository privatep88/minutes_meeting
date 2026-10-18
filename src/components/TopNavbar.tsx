import React from 'react';
import {
  FileCheck2,
  Edit3,
  Eye,
  PlusCircle,
  PenTool,
  RotateCcw,
  Sheet,
  Printer,
  Download,
  Archive,
  CheckSquare,
  Users,
  LayoutTemplate,
  FileText,
} from 'lucide-react';
import { ActiveScreen } from '../types/meeting';

interface TopNavbarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  onOpenQuickAdd: () => void;
  onOpenSignatureModal: () => void;
  onResetTemplate: () => void;
  onExportCSV: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  saveStatus: 'saved' | 'saving';
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeScreen,
  setActiveScreen,
  isEditMode,
  setIsEditMode,
  onOpenQuickAdd,
  onOpenSignatureModal,
  onResetTemplate,
  onExportCSV,
  onExportPDF,
  onPrint,
  saveStatus,
}) => {
  return (
    <header className="no-print sticky top-0 z-50 bg-slate-900 text-white shadow-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Department */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center shadow-md">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-bold tracking-wide">
                نظام إدارة وتوثيق محاضر الاجتماعات
              </h1>
              <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-500/30 font-medium">
                شركة ساعد
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              إدارة الخدمات العامة — قسم إدارة المرافق
            </p>
          </div>
        </div>

        {/* Center: System Screens Navigation */}
        <nav className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveScreen('editor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeScreen === 'editor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>المحضر الحالي</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('archive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeScreen === 'archive'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>أرشيف المحاضر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('action_items')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeScreen === 'action_items'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>سجل التكليفات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('attendees_dir')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeScreen === 'attendees_dir'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>فريق العمل</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('templates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              activeScreen === 'templates'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            <span>القوالب الرسمية</span>
          </button>
        </nav>

        {/* Right side: Save indicator & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Live Auto Save Status */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                saveStatus === 'saved'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-amber-400 animate-ping'
              }`}
            />
            <span className="text-slate-200 font-medium">
              {saveStatus === 'saved' ? 'تم الحفظ تلقائياً' : 'قيد الحفظ...'}
            </span>
          </div>

          {activeScreen === 'editor' && (
            <>
              {/* Edit / Preview Mode Switcher */}
              <div className="bg-slate-800 p-1 rounded-lg flex items-center border border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                    isEditMode
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>وضع التحرير</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                    !isEditMode
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة الطباعة</span>
                </button>
              </div>

              {/* Quick Add Modal Button */}
              <button
                type="button"
                onClick={onOpenQuickAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>إضافة سريع</span>
              </button>

              {/* Electronic Signature Pad */}
              <button
                type="button"
                onClick={onOpenSignatureModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-amber-400" />
                <span>التوقيع الإلكتروني</span>
              </button>

              <div className="h-5 w-px bg-slate-700 mx-0.5" />

              {/* Reset to initial */}
              <button
                type="button"
                onClick={onResetTemplate}
                title="استعادة النموذج الأصلي"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Export CSV */}
              <button
                type="button"
                onClick={onExportCSV}
                title="تصدير جدول القرارات إلى CSV"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition cursor-pointer"
              >
                <Sheet className="w-4 h-4" />
              </button>

              {/* Print A4 */}
              <button
                type="button"
                onClick={onPrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة A4</span>
              </button>

              {/* Export PDF */}
              <button
                type="button"
                onClick={onExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تصدير PDF</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
