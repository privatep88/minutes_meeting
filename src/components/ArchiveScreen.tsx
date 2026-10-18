import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  Copy,
  Trash2,
  ExternalLink,
  Clock,
  Edit3,
  X,
  Check,
  Building,
  CheckSquare,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { MeetingMinute } from '../types/meeting';

interface ArchiveScreenProps {
  meetings: MeetingMinute[];
  activeMeetingId: string;
  onSelectMeeting: (id: string) => void;
  onCreateNewMeeting: () => void;
  onCloneMeeting: (id: string) => void;
  onDeleteMeeting: (id: string) => void;
  onUpdateMeeting: (updated: MeetingMinute) => void;
}

export const ArchiveScreen: React.FC<ArchiveScreenProps> = ({
  meetings,
  activeMeetingId,
  onSelectMeeting,
  onCreateNewMeeting,
  onCloneMeeting,
  onDeleteMeeting,
  onUpdateMeeting,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Edit Modal State
  const [editingMeeting, setEditingMeeting] = useState<MeetingMinute | null>(null);

  // Delete Confirmation Modal State
  const [meetingToDelete, setMeetingToDelete] = useState<MeetingMinute | null>(null);

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.meetingLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.meetingNum.includes(searchTerm) ||
      m.attendees.some((a) => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMeeting) return;
    onUpdateMeeting({
      ...editingMeeting,
      updatedAt: new Date().toISOString(),
    });
    setEditingMeeting(null);
  };

  const handleConfirmDelete = () => {
    if (!meetingToDelete) return;
    onDeleteMeeting(meetingToDelete.id);
    setMeetingToDelete(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>سجل وأرشيف محاضر الاجتماعات</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة وتوثيق وأرشفة المحاضر الرسمية لشركة ساعد وقسم إدارة المرافق، مع إمكانية التحرير والحذف
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNewMeeting}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs md:text-sm font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء محضر جديد</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم المحضر، الموضوع أو الحاضرين..."
            className="w-full pr-9 pl-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">تصفية حسب الحالة:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white font-medium focus:ring-1 focus:ring-blue-500 cursor-pointer text-xs"
            >
              <option value="all">جميع المحاضر ({meetings.length})</option>
              <option value="مسودة">مسودات</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="معتمد وموقع">معتمد وموقع</option>
            </select>
          </div>

          {/* Table / Cards View Switcher */}
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

      {/* Official Centered Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-center text-xs md:text-sm">
            <thead className="bg-[#85b8db] text-black font-bold">
              <tr>
                <th className="py-2.5 px-2 text-center w-10">م.</th>
                <th className="py-2.5 px-3 text-center w-24">رقم المحضر</th>
                <th className="py-2.5 px-4 text-center">عنوان المحضر والإدارة</th>
                <th className="py-2.5 px-3 text-center w-28">تاريخ الانعقاد</th>
                <th className="py-2.5 px-3 text-center w-36">مكان الاجتماع</th>
                <th className="py-2.5 px-2 text-center w-24">الحضور</th>
                <th className="py-2.5 px-3 text-center w-28">حالة المحضر</th>
                <th className="py-2.5 px-3 text-center w-32">الإجراءات والتحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMeetings.map((meeting, idx) => {
                const isActive = meeting.id === activeMeetingId;
                return (
                  <tr
                    key={meeting.id}
                    className={`hover:bg-blue-50/50 transition ${
                      isActive ? 'bg-blue-50/30 font-semibold' : idx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'
                    }`}
                  >
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-600 align-middle">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 text-center align-middle font-mono font-bold text-blue-700">
                      {meeting.meetingNum} / {meeting.meetingYear}
                    </td>
                    <td className="py-3 px-4 text-center align-middle">
                      <div className="font-bold text-slate-900 text-center leading-snug">{meeting.title}</div>
                      <div className="text-[11px] text-slate-500 font-normal text-center mt-0.5">{meeting.departmentName}</div>
                    </td>
                    <td className="py-3 px-3 text-center align-middle font-mono text-slate-700 text-xs">
                      <div>{meeting.meetingDate}</div>
                      <div className="text-[11px] text-slate-500">{meeting.meetingTime}</div>
                    </td>
                    <td className="py-3 px-3 text-center align-middle text-slate-700 truncate max-w-[150px]">
                      {meeting.meetingLocation}
                    </td>
                    <td className="py-3 px-2 text-center align-middle">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                        {meeting.attendees.length} أعضاء
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center align-middle">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block ${
                          meeting.status === 'معتمد وموقع'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : meeting.status === 'قيد المراجعة'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {meeting.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectMeeting(meeting.id)}
                          title="فتح في المحرر"
                          className="p-1.5 text-blue-600 hover:bg-blue-100/60 rounded-md transition cursor-pointer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingMeeting({ ...meeting })}
                          title="تحرير وتعديل بيانات المحضر"
                          className="p-1.5 text-amber-600 hover:bg-amber-100/60 rounded-md transition cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onCloneMeeting(meeting.id)}
                          title="تكرار المحضر كنسخة جديدة"
                          className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-md transition cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMeetingToDelete(meeting)}
                          title="حذف هذا المحضر"
                          className="p-1.5 text-rose-500 hover:bg-rose-100/60 rounded-md transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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
        /* Minutes Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMeetings.map((meeting) => {
          const isActive = meeting.id === activeMeetingId;
          const totalTopics = meeting.sections.reduce(
            (acc, s) => acc + s.items.filter((i) => i.topic.trim() !== '').length,
            0
          );

          return (
            <div
              key={meeting.id}
              className={`bg-white rounded-xl border p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                isActive ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    رقم ({meeting.meetingNum}) / {meeting.meetingYear}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        meeting.status === 'معتمد وموقع'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : meeting.status === 'قيد المراجعة'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                  {meeting.title}
                </h3>
                <p className="text-[11px] text-slate-500 mb-4">{meeting.departmentName}</p>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>التاريخ: {meeting.meetingDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>الوقت: {meeting.meetingTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{meeting.meetingLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      الحضور: {meeting.attendees.length} أعضاء · القرارات: {totalTopics}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons (Open, Edit, Clone, Delete) */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectMeeting(meeting.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح في المحرر</span>
                </button>

                <div className="flex items-center gap-1">
                  {/* Edit Meeting Metadata Button */}
                  <button
                    type="button"
                    onClick={() => setEditingMeeting({ ...meeting })}
                    title="تحرير وتعديل بيانات المحضر"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Clone Meeting */}
                  <button
                    type="button"
                    onClick={() => onCloneMeeting(meeting.id)}
                    title="تكرار المحضر كنموذج جديد"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-md transition cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Delete Meeting */}
                  <button
                    type="button"
                    onClick={() => setMeetingToDelete(meeting)}
                    title="حذف هذا المحضر من الأرشيف"
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

      {/* EDIT MEETING MODAL */}
      {editingMeeting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>تحرير بيانات سجل المحضر</span>
              </h3>
              <button
                onClick={() => setEditingMeeting(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs md:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">عنوان المحضر:</label>
                <input
                  type="text"
                  required
                  value={editingMeeting.title}
                  onChange={(e) =>
                    setEditingMeeting({ ...editingMeeting, title: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">رقم المحضر:</label>
                  <input
                    type="text"
                    required
                    value={editingMeeting.meetingNum}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, meetingNum: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">سنة المحضر:</label>
                  <input
                    type="text"
                    required
                    value={editingMeeting.meetingYear}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, meetingYear: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">رمز النموذج:</label>
                  <input
                    type="text"
                    value={editingMeeting.formNumber}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, formNumber: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">رقم الإصدار:</label>
                  <input
                    type="text"
                    value={editingMeeting.revisionNumber}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, revisionNumber: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">مكان الاجتماع:</label>
                <input
                  type="text"
                  value={editingMeeting.meetingLocation}
                  onChange={(e) =>
                    setEditingMeeting({ ...editingMeeting, meetingLocation: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">تاريخ الاجتماع:</label>
                  <input
                    type="text"
                    value={editingMeeting.meetingDate}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, meetingDate: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">وقت الاجتماع:</label>
                  <input
                    type="text"
                    value={editingMeeting.meetingTime}
                    onChange={(e) =>
                      setEditingMeeting({ ...editingMeeting, meetingTime: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">حالة المحضر:</label>
                <select
                  value={editingMeeting.status}
                  onChange={(e) =>
                    setEditingMeeting({
                      ...editingMeeting,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="مسودة">مسودة عمل</option>
                  <option value="قيد المراجعة">قيد المراجعة</option>
                  <option value="معتمد وموقع">معتمد وموقع رسمياً</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMeeting(null)}
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
      {meetingToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                تأكيد حذف المحضر
              </h3>
            </div>
            
            <p className="text-xs md:text-sm text-slate-600 mb-2 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف المحضر:
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 mb-4">
              {meetingToDelete.title}
              <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                تاريخ: {meetingToDelete.meetingDate} | الحضور: {meetingToDelete.attendees.length} أعضاء
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMeetingToDelete(null)}
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
                <span>نعم، حذف نهائي</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
