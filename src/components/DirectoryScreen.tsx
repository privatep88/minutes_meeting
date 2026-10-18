import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Check,
  Plus,
  ShieldCheck,
  Edit3,
  Trash2,
  X,
  Search,
  RotateCcw,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { MeetingMinute, Attendee, StaffMember } from '../types/meeting';

interface DirectoryScreenProps {
  meeting: MeetingMinute;
  onUpdateMeeting: (updated: MeetingMinute) => void;
  onGoToEditor: () => void;
  staffList: StaffMember[];
  onUpdateStaffList: (updated: StaffMember[]) => void;
  onResetStaffList: () => void;
}

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({
  meeting,
  onUpdateMeeting,
  onGoToEditor,
  staffList,
  onUpdateStaffList,
  onResetStaffList,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // New staff inputs
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('قسم إدارة المرافق');
  const [newIsHead, setNewIsHead] = useState(false);

  // Edit staff state
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Delete staff confirmation state
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  const isAlreadyInMeeting = (name: string) => {
    return meeting.attendees.some((a) => a.name.trim() === name.trim());
  };

  const handleAddToMeeting = (staff: StaffMember) => {
    if (isAlreadyInMeeting(staff.name)) return;
    const newAtt: Attendee = {
      id: `att-${Date.now()}`,
      name: staff.name,
      jobTitle: staff.jobTitle,
      status: 'حاضر',
    };
    onUpdateMeeting({
      ...meeting,
      attendees: [...meeting.attendees, newAtt],
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const item: StaffMember = {
      id: `stf-${Date.now()}`,
      name: newName.trim(),
      jobTitle: newTitle.trim() || 'ضابط خدمات مرافق وأصول',
      department: newDept.trim() || 'إدارة الخدمات العامة',
      isHead: newIsHead,
    };
    onUpdateStaffList([...staffList, item]);
    setNewName('');
    setNewTitle('');
    setNewDept('قسم إدارة المرافق');
    setNewIsHead(false);
  };

  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    const updated = staffList.map((s) => (s.id === editingStaff.id ? editingStaff : s));
    onUpdateStaffList(updated);
    
    // Also update in active meeting if attendee matches
    const updatedAttendees = meeting.attendees.map((att) => {
      if (att.name.trim() === editingStaff.name.trim() || att.id === editingStaff.id) {
        return { ...att, name: editingStaff.name, jobTitle: editingStaff.jobTitle };
      }
      return att;
    });
    onUpdateMeeting({
      ...meeting,
      attendees: updatedAttendees,
      updatedAt: new Date().toISOString(),
    });

    setEditingStaff(null);
  };

  const handleConfirmDelete = () => {
    if (!staffToDelete) return;
    const updated = staffList.filter((s) => s.id !== staffToDelete.id);
    onUpdateStaffList(updated);
    setStaffToDelete(null);
  };

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>دليل أعضاء قسم إدارة المرافق والخدمات العامة</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            سجل المسؤولين والموظفين — إمكانية التحرير والحذف والإدراج السريع في محاضر الاجتماعات
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetStaffList}
            title="استعادة الدليل الافتراضي"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>

          <button
            type="button"
            onClick={onGoToEditor}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>العودة لنموذج المحضر المطبوع</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Cards List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search bar & View switcher inside directory */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="بحث عن عضو، مسمى وظيفي أو قسم..."
                className="w-full pr-9 pl-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-semibold shrink-0">
                الأعضاء: {staffList.length}
              </span>

              {/* Table / Cards toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>جدول رسمي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>بطاقات</span>
                </button>
              </div>
            </div>
          </div>

          {/* Centered Table View */}
          {viewMode === 'table' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-center text-xs md:text-sm">
                <thead className="bg-[#85b8db] text-black font-bold">
                  <tr>
                    <th className="py-2.5 px-2 text-center w-10">م.</th>
                    <th className="py-2.5 px-4 text-center">الاسم الكريم</th>
                    <th className="py-2.5 px-3 text-center">المسمى الوظيفي</th>
                    <th className="py-2.5 px-3 text-center">القسم / الإدارة</th>
                    <th className="py-2.5 px-3 text-center">الحالة في المحضر</th>
                    <th className="py-2.5 px-2 text-center w-20">التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((stf, idx) => {
                    const present = isAlreadyInMeeting(stf.name);
                    return (
                      <tr
                        key={stf.id}
                        className={`hover:bg-blue-50/50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}`}
                      >
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-slate-600 align-middle">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 text-center align-middle font-bold text-slate-900">
                          <div className="flex items-center justify-center gap-1.5">
                            <span>{stf.name}</span>
                            {stf.isHead && (
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3" />
                                <span>رئيس</span>
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center align-middle text-slate-700">
                          {stf.jobTitle}
                        </td>
                        <td className="py-2.5 px-3 text-center align-middle text-slate-600">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                            {stf.department}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center align-middle">
                          <button
                            type="button"
                            disabled={present}
                            onClick={() => handleAddToMeeting(stf)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 transition ${
                              present
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs cursor-pointer'
                            }`}
                          >
                            {present ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>مضاف للمحضر</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>إدراج في المحضر</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-2 text-center align-middle">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingStaff({ ...stf })}
                              title="تحرير وتعديل العضو"
                              className="p-1.5 text-amber-600 hover:bg-amber-100/60 rounded-md transition cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setStaffToDelete(stf)}
                              title="حذف العضو من الدليل"
                              className="p-1.5 text-rose-500 hover:bg-rose-100/60 rounded-md transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredStaff.map((stf) => {
              const present = isAlreadyInMeeting(stf.name);
              return (
                <div
                  key={stf.id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {stf.department}
                      </span>
                      {stf.isHead && (
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>رئاسة القسم</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mb-1">{stf.name}</h4>
                    <p className="text-xs text-slate-600 mb-3">{stf.jobTitle}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Add to current meeting button */}
                    <button
                      type="button"
                      disabled={present}
                      onClick={() => handleAddToMeeting(stf)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition ${
                        present
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs cursor-pointer'
                      }`}
                    >
                      {present ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>مضاف للمحضر</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>إدراج في المحضر</span>
                        </>
                      )}
                    </button>

                    {/* Edit & Delete Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingStaff({ ...stf })}
                        title="تحرير وتعديل بيانات العضو"
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setStaffToDelete(stf)}
                        title="حذف العضو من الدليل"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}

          {filteredStaff.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
              لم يتم العثور على أعضاء مطابقين للبحث. يمكنك إضافة عضو جديد من النموذج المجاور.
            </div>
          )}
        </div>

        {/* Add New Staff Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs h-fit sticky top-20">
          <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>إضافة عضو جديد للدليل</span>
          </h3>
          <form onSubmit={handleCreateStaff} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">الاسم واللقب:</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="الاستاذ / ..."
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">المسمى الوظيفي:</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: ضابط خدمات مساندة"
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">الإدارة / القسم:</label>
              <input
                type="text"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                placeholder="قسم إدارة المرافق"
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
              <input
                type="checkbox"
                checked={newIsHead}
                onChange={(e) => setNewIsHead(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
              />
              <span className="font-semibold text-slate-700">تحديد كمسؤول / رئيس قسم</span>
            </label>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>حفظ العضو في الدليل</span>
            </button>
          </form>
        </div>
      </div>

      {/* EDIT STAFF MODAL */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>تحرير بيانات العضو</span>
              </h3>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStaff} className="space-y-3.5 text-xs md:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">الاسم واللقب:</label>
                <input
                  type="text"
                  required
                  value={editingStaff.name}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">المسمى الوظيفي:</label>
                <input
                  type="text"
                  required
                  value={editingStaff.jobTitle}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, jobTitle: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">الإدارة / القسم:</label>
                <input
                  type="text"
                  value={editingStaff.department}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, department: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1 select-none">
                <input
                  type="checkbox"
                  checked={Boolean(editingStaff.isHead)}
                  onChange={(e) =>
                    setEditingStaff({ ...editingStaff, isHead: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                />
                <span className="font-semibold text-slate-700 text-xs">رئاسة القسم / مسؤول قيادي</span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {staffToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                تأكيد حذف العضو من الدليل
              </h3>
            </div>
            
            <p className="text-xs md:text-sm text-slate-600 mb-2 leading-relaxed">
              هل أنت متأكد من حذف العضو التالي من سجل الدليل:
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 mb-4">
              {staffToDelete.name}
              <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                {staffToDelete.jobTitle} · {staffToDelete.department}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف العضو</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
