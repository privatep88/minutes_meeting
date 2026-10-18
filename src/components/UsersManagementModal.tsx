import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  X,
  CheckCircle2,
  UserCheck,
  Edit3,
  Shield,
  Lock,
  Unlock,
} from 'lucide-react';
import { SystemUser } from '../types/meeting';

interface UsersManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemUsers: SystemUser[];
  currentUser: SystemUser;
  onSelectUser: (user: SystemUser) => void;
  onAddUser: (newUser: SystemUser) => void;
  onUpdateUser: (updatedUser: SystemUser) => void;
  onDeleteUser: (userId: string) => void;
}

export const UsersManagementModal: React.FC<UsersManagementModalProps> = ({
  isOpen,
  onClose,
  systemUsers,
  currentUser,
  onSelectUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [roleTitleInput, setRoleTitleInput] = useState('');
  const [permissionTypeInput, setPermissionTypeInput] = useState<'full' | 'limited'>('full');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitleInput.trim()) return;

    const title = roleTitleInput.trim();
    const isLimited = permissionTypeInput === 'limited';

    const newUser: SystemUser = {
      id: `usr-${Date.now()}`,
      name: title,
      jobTitle: isLimited ? `${title} - صلاحيات محدودة (أرشيف وتكليفات)` : `${title} - كامل الصلاحيات`,
      role: isLimited ? 'regular' : title.includes('رئيس') ? 'chairman' : 'rapporteur',
      roleTitle: title,
      permissionType: permissionTypeInput,
      badgeColor: isLimited ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white',
    };

    onAddUser(newUser);
    setRoleTitleInput('');
    setPermissionTypeInput('full');
  };

  const togglePermission = (user: SystemUser) => {
    const isCurrentlyFull = user.permissionType === 'full' || user.role !== 'regular';
    const newPermission: 'full' | 'limited' = isCurrentlyFull ? 'limited' : 'full';

    const updatedUser: SystemUser = {
      ...user,
      permissionType: newPermission,
      role: newPermission === 'limited' ? 'regular' : user.role === 'regular' ? 'rapporteur' : user.role,
      jobTitle: newPermission === 'limited' ? `${user.roleTitle} - صلاحيات محدودة (أرشيف وتكليفات)` : `${user.roleTitle} - كامل الصلاحيات`,
      badgeColor: newPermission === 'limited' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white',
    };

    onUpdateUser(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden text-right flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                إدارة مستخدمي النظام والصلاحيات
              </h3>
              <p className="text-xs text-slate-300">
                منح وإضافة مستخدمين آخرين مع تحديد الصلاحيات (كاملة أو محدودة)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-slate-900 text-xs sm:text-sm">
          {/* Add New User Form */}
          <form
            onSubmit={handleAddSubmit}
            className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
          >
            <div className="font-bold text-slate-800 flex items-center gap-2 text-xs sm:text-sm">
              <UserPlus className="w-4 h-4 text-blue-600" />
              <span>إضافة مستخدِم جديد للنظام:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  صفة أو مسمى المستخدم (مثل: مقرر الاجتماع، رئيس الاجتماع، نائب الرئيس...):
                </label>
                <input
                  type="text"
                  required
                  value={roleTitleInput}
                  onChange={(e) => setRoleTitleInput(e.target.value)}
                  placeholder="مثال: مقرر الاجتماع الثاني"
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  نوع الصلاحية الممنوحة:
                </label>
                <select
                  value={permissionTypeInput}
                  onChange={(e) => setPermissionTypeInput(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="full">كامل الصلاحيات (التحرير والتعديل والحذف والإضافة)</option>
                  <option value="limited">صلاحيات محدودة (الاطلاع على الأرشيف والتكليفات فقط)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة المستخدم للنظام</span>
              </button>
            </div>
          </form>

          {/* Current System Users List */}
          <div>
            <div className="font-bold text-slate-800 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>قائمة المستخدمين المتاحين بالنظام ({systemUsers.length}):</span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                (يظهر مسمى المستخدم فقط في القائمة دون الاسم الشخصي)
              </span>
            </div>

            <div className="space-y-2">
              {systemUsers.map((usr) => {
                const isCurrent = usr.id === currentUser.id;
                const isFullPermission = usr.permissionType === 'full' || (usr.role !== 'regular' && usr.permissionType !== 'limited');

                return (
                  <div
                    key={usr.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 flex-wrap ${
                      isCurrent
                        ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg font-bold text-xs ${
                          isFullPermission ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isFullPermission ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">
                            {usr.roleTitle}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                              <UserCheck className="w-3 h-3" />
                              <span>المستخدِم الحالي</span>
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                              isFullPermission
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {isFullPermission
                              ? 'كامل الصلاحيات (تحرير/تعديل/حذف/إضافة)'
                              : 'صلاحيات محدودة (اطلاع فقط على الأرشيف والتكليفات)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Switch Permission Toggle */}
                      <button
                        type="button"
                        onClick={() => togglePermission(usr)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border flex items-center gap-1 cursor-pointer ${
                          isFullPermission
                            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title="تغيير مستوى الصلاحية"
                      >
                        {isFullPermission ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{isFullPermission ? 'تقييد الصلاحية' : 'منح صلاحيات كاملة'}</span>
                      </button>

                      {/* Select User Button */}
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectUser(usr);
                          }}
                          className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-2xs transition cursor-pointer"
                        >
                          تبديل إليه
                        </button>
                      )}

                      {/* Delete User Button (for non-default extra users) */}
                      {usr.id.startsWith('usr-') && (
                        <button
                          type="button"
                          onClick={() => onDeleteUser(usr.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="حذف هذا المستخدم"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            يتم تطبيق تغيير الصلاحيات والمستخدم المختار فوراً على جميع شاشات النظام.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
