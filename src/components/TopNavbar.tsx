import React, { useState } from 'react';
import {
  FileCheck2,
  Edit3,
  Eye,
  PlusCircle,
  PenTool,
  RotateCcw,
  Printer,
  Download,
  Archive,
  CheckSquare,
  Users,
  LayoutTemplate,
  FileText,
  Lock,
  UserCheck,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { ActiveScreen, SystemUser } from '../types/meeting';

interface TopNavbarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
  meetingStatus?: string;
  currentUser: SystemUser;
  systemUsers: SystemUser[];
  onSelectUser: (user: SystemUser) => void;
  onLockedEditAttempt?: () => void;
  onRestrictedScreenAttempt?: () => void;
  onOpenQuickAdd: () => void;
  onOpenSignatureModal: () => void;
  onResetTemplate: () => void;
  onExportWord: () => void;
  onExportCSV?: () => void;
  onExportPDF: () => void;
  onPrint: () => void;
  saveStatus: 'saved' | 'saving';
  onOpenUsersManagement?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeScreen,
  setActiveScreen,
  isEditMode,
  setIsEditMode,
  meetingStatus,
  currentUser,
  systemUsers,
  onSelectUser,
  onLockedEditAttempt,
  onRestrictedScreenAttempt,
  onOpenQuickAdd,
  onOpenSignatureModal,
  onResetTemplate,
  onExportWord,
  onExportPDF,
  onPrint,
  saveStatus,
  onOpenUsersManagement,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (screen: ActiveScreen) => {
    if (currentUser.role === 'regular' && screen !== 'archive' && screen !== 'action_items') {
      if (onRestrictedScreenAttempt) onRestrictedScreenAttempt();
    } else {
      setActiveScreen(screen);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="no-print sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md text-white shadow-2xl border-b border-slate-800/80 transition-all header-font">
      {/* TIER 1: TOP CENTERED SYSTEM BRAND & DEPARTMENT BAR */}
      <div className="relative w-full text-center border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 py-2.5 px-3 sm:px-6 flex flex-col items-center justify-center shadow-inner">
        {/* Top-Right Official Logo (Vertically Centered) */}
        <div className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
          <img
            src="/logo.png"
            alt="شعار شركة ساعد للأنظمة المرورية"
            className="h-8 sm:h-10 max-w-[150px] object-contain select-none"
          />
        </div>

        {/* Compact Top-Left User Selector */}
        <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-900/95 px-1.5 py-0.5 rounded-lg border border-slate-800 shadow-xs z-10">
          <div className="p-0.5 bg-blue-500/15 rounded text-blue-400 shrink-0">
            <UserCheck className="w-3 h-3" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-slate-400 font-semibold leading-none">المستخدِم الحالي:</span>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = systemUsers.find((u) => u.id === e.target.value);
                if (selected) onSelectUser(selected);
              }}
              className="bg-transparent text-slate-100 font-bold text-[10px] focus:outline-none cursor-pointer pr-0 py-0"
            >
              {systemUsers.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-950 text-white font-medium py-1 text-xs">
                  {u.roleTitle} {u.permissionType === 'limited' || u.role === 'regular' ? '(صلاحيات محدودة)' : '(كامل الصلاحيات)'}
                </option>
              ))}
            </select>
          </div>
          <span
            className={`hidden sm:inline-block text-[8px] font-bold px-1 py-0 rounded border ${
              currentUser.role === 'regular' || currentUser.permissionType === 'limited'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {currentUser.roleTitle}
          </span>
          {onOpenUsersManagement && (
            <button
              type="button"
              onClick={onOpenUsersManagement}
              title="إدارة المستخدمين والصلاحيات"
              className="p-0.5 rounded bg-blue-600/25 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 transition cursor-pointer flex items-center gap-1 text-[9px] font-bold px-1 shrink-0"
            >
              <Users className="w-2.5 h-2.5" />
              <span className="hidden md:inline">إدارة المستخدمين</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-center mb-0.5 px-24 sm:px-36 mx-auto">
          <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight leading-tight text-white text-center">
            نظام إدارة وتوثيق محاضر الاجتماعات
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 text-center mt-0.5 px-24 sm:px-36 mx-auto">
          <span className="text-xs text-slate-300 font-medium">
            إدارة الخدمات العامة — قسم إدارة المرافق
          </span>
          <span className="bg-gradient-to-r from-blue-500/25 to-indigo-500/25 text-blue-300 text-xs px-3 py-0.5 rounded-full border border-blue-400/30 font-bold shadow-2xs">
            شركة ساعد
          </span>
        </div>
      </div>

      {/* TIER 2: MAIN SYSTEM NAVIGATION TABS ROW (Independent Row) */}
      <div className="hidden lg:block border-b border-slate-800/60 bg-slate-900/60 py-1.5 px-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => handleNavClick('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeScreen === 'editor'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-400/30'
                : currentUser.role === 'regular'
                ? 'text-slate-500 hover:text-slate-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title={currentUser.role === 'regular' ? 'متاح فقط لمقرر ورئيس الاجتماع' : 'المحضر الحالي'}
          >
            <FileText className="w-4 h-4" />
            <span>المحضر الحالي</span>
            {currentUser.role === 'regular' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('archive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeScreen === 'archive'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="أرشيف المحاضر (متاح لجميع المستخدمين)"
          >
            <Archive className="w-4 h-4" />
            <span>أرشيف المحاضر</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('action_items')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeScreen === 'action_items'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title="سجل التكليفات (متاح لجميع المستخدمين)"
          >
            <CheckSquare className="w-4 h-4" />
            <span>سجل التكليفات</span>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('attendees_dir')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeScreen === 'attendees_dir'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-400/30'
                : currentUser.role === 'regular'
                ? 'text-slate-500 hover:text-slate-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title={currentUser.role === 'regular' ? 'متاح فقط لمقرر ورئيس الاجتماع' : 'فريق العمل'}
          >
            <Users className="w-4 h-4" />
            <span>فريق العمل</span>
            {currentUser.role === 'regular' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeScreen === 'templates'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-400/30'
                : currentUser.role === 'regular'
                ? 'text-slate-500 hover:text-slate-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
            }`}
            title={currentUser.role === 'regular' ? 'متاح فقط لمقرر ورئيس الاجتماع' : 'القوالب الرسمية'}
          >
            <LayoutTemplate className="w-4 h-4" />
            <span>القوالب الرسمية</span>
            {currentUser.role === 'regular' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </nav>
      </div>

      {/* TIER 3: ACTION TOOLBAR ROW (CENTERED IN HEADER PAGE) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-center gap-3 flex-wrap text-center">
        {/* Centered Document Actions & Mode Switcher Group */}
        <div className="hidden lg:flex items-center justify-center gap-2 flex-wrap mx-auto">
          {/* Live Auto Save Indicator */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1.5 rounded-full border border-slate-800 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                saveStatus === 'saved' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'
              }`}
            />
            <span className="text-slate-300 font-medium text-[11px]">
              {saveStatus === 'saved' ? 'محفوظ' : 'قيد الحفظ...'}
            </span>
          </div>

          {activeScreen === 'editor' && currentUser.role !== 'regular' && (
            <>
              <div className="h-5 w-px bg-slate-800 mx-0.5" />

              {/* Mode Switcher */}
              <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    if (meetingStatus === 'معتمد وموقع') {
                      if (onLockedEditAttempt) onLockedEditAttempt();
                    } else {
                      setIsEditMode(true);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isEditMode
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                      : meetingStatus === 'معتمد وموقع'
                      ? 'text-slate-500 hover:text-slate-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={
                    meetingStatus === 'معتمد وموقع'
                      ? 'المحضر معتمد وموقع رسمياً ولا يمكن التعديل عليه إلا من خلال أرشيف المحاضر'
                      : 'تفعيل التعديل المباشر على المحضر'
                  }
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>وضع التحرير</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    !isEditMode
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="معاينة المستند النهائية للطباعة والتصدير"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>نمط المعاينة</span>
                </button>
              </div>

              {/* Lock Indicator Badge */}
              {meetingStatus === 'معتمد وموقع' && (
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-600/80 shadow-xs"
                  title="المحضر معتمد وموقع رسمياً - مقفل لنمط المعاينة."
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">معتمد وموقع</span>
                </div>
              )}



              <div className="h-5 w-px bg-slate-800 mx-0.5" />

              {/* Reset to initial */}
              <button
                type="button"
                onClick={onResetTemplate}
                title="استعادة النموذج الأصلي"
                aria-label="استعادة النموذج الأصلي"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Export Word */}
              <button
                type="button"
                onClick={onExportWord}
                title="تصدير محضر الاجتماع بصيغة Word (.docx)"
                aria-label="تصدير محضر الاجتماع بصيغة Word"
                className="p-1.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition cursor-pointer relative group"
              >
                <div className="relative flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                  <span className="absolute -bottom-1 -right-1 text-[7px] font-black bg-blue-600 text-white rounded-[2px] px-0.5 leading-none shadow-xs font-sans">
                    W
                  </span>
                </div>
              </button>

              {/* Print A4 */}
              <button
                type="button"
                onClick={onPrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة A4</span>
              </button>

              {/* Export PDF */}
              <button
                type="button"
                onClick={onExportPDF}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تصدير PDF</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Controls (< lg) */}
        <div className="flex lg:hidden items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                saveStatus === 'saved' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
            <span className="text-[11px] text-slate-300 font-bold">
              {currentUser.roleTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeScreen === 'editor' && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onPrint}
                  className="p-2 rounded-lg bg-indigo-600 text-white text-xs font-bold transition"
                  title="طباعة A4"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onExportPDF}
                  className="p-2 rounded-lg bg-indigo-600 text-white text-xs font-bold transition"
                  title="تصدير PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-200 hover:text-white border border-slate-800 transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
              aria-label="القائمة التفاعلية"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span>{mobileMenuOpen ? 'إغلاق' : 'القائمة'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER / OVERLAY PANEL */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 p-4 animate-in slide-in-from-top-2 duration-150 space-y-4">
          {/* Mobile User Identity Switcher */}
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>مستخدِم النظام الحالي:</span>
              </span>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    currentUser.role === 'regular' || currentUser.permissionType === 'limited'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {currentUser.roleTitle}
                </span>

                {onOpenUsersManagement && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenUsersManagement();
                      setMobileMenuOpen(false);
                    }}
                    className="p-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[10px] font-bold px-1.5"
                  >
                    إدارة المستخدمين
                  </button>
                )}
              </div>
            </div>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const selected = systemUsers.find((u) => u.id === e.target.value);
                if (selected) {
                  onSelectUser(selected);
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full bg-slate-900 text-white font-bold text-xs p-2 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
            >
              {systemUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.roleTitle} {u.permissionType === 'limited' || u.role === 'regular' ? '(صلاحيات محدودة)' : '(كامل الصلاحيات)'}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Screens Navigation Links */}
          <div className="space-y-1 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
            <div className="text-[11px] font-bold text-slate-400 px-2 py-1">تبويبات النظام الرئيسية:</div>
            <button
              type="button"
              onClick={() => handleNavClick('editor')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition ${
                activeScreen === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>المحضر الحالي</span>
              </div>
              {currentUser.role === 'regular' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('archive')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition ${
                activeScreen === 'archive' ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                <span>أرشيف المحاضر</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('action_items')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition ${
                activeScreen === 'action_items' ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                <span>سجل التكليفات</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('attendees_dir')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition ${
                activeScreen === 'attendees_dir' ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>فريق العمل</span>
              </div>
              {currentUser.role === 'regular' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('templates')}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-bold transition ${
                activeScreen === 'templates' ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4" />
                <span>القوالب الرسمية</span>
              </div>
              {currentUser.role === 'regular' && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>

          {/* Mobile Document Tools (if in editor) */}
          {activeScreen === 'editor' && currentUser.role !== 'regular' && (
            <div className="space-y-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
              <div className="font-bold text-slate-400 text-[11px]">أدوات وإجراءات المحضر:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenQuickAdd();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-semibold"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>إضافة سريع</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenSignatureModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-semibold"
                >
                  <PenTool className="w-4 h-4 text-amber-400" />
                  <span>التوقيع الإلكتروني</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportWord();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-semibold"
                >
                  <FileText className="w-4 h-4" />
                  <span>تصدير Word</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportPDF();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>تصدير PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onPrint();
                    setMobileMenuOpen(false);
                  }}
                  className="col-span-2 flex items-center justify-center gap-1.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة A4 معتمدة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
