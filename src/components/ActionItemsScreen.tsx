import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  Filter,
} from 'lucide-react';
import { MeetingMinute, AgendaItem, SystemUser } from '../types/meeting';

interface ActionItemsScreenProps {
  meeting: MeetingMinute;
  currentUser?: SystemUser;
  onUpdateMeeting: (updated: MeetingMinute) => void;
  onGoToEditor: () => void;
}

export const ActionItemsScreen: React.FC<ActionItemsScreenProps> = ({
  meeting,
  currentUser,
  onUpdateMeeting,
  onGoToEditor,
}) => {
  const [filterResponsible, setFilterResponsible] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Collect all items across sections
  const allItems: { sectionTitle: string; sectionId: string; item: AgendaItem }[] = [];
  meeting.sections.forEach((sec) => {
    sec.items.forEach((item) => {
      if (item.topic.trim() || item.recommendation.trim() || item.responsible.trim()) {
        allItems.push({
          sectionTitle: sec.title ? sec.title.replace(':', '') : 'البنود الرئيسية الأولى',
          sectionId: sec.id,
          item,
        });
      }
    });
  });

  const responsibles = Array.from(
    new Set(allItems.map((i) => i.item.responsible.trim()).filter(Boolean))
  );

  const filtered = allItems.filter(({ item }) => {
    const matchResp = filterResponsible === 'all' || item.responsible.trim() === filterResponsible;
    const matchStatus = filterStatus === 'all' || (item.status || 'جديد') === filterStatus;
    return matchResp && matchStatus;
  });

  const updateItemStatus = (sectionId: string, itemId: string, status: AgendaItem['status']) => {
    const updatedSections = meeting.sections.map((sec) => {
      if (sec.id !== sectionId) return sec;
      return {
        ...sec,
        items: sec.items.map((it) => (it.id === itemId ? { ...it, status } : it)),
      };
    });
    onUpdateMeeting({
      ...meeting,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    });
  };

  const completedCount = allItems.filter((i) => i.item.status === 'مكتمل').length;
  const inProgressCount = allItems.filter((i) => i.item.status === 'قيد الإجراء').length;
  const newCount = allItems.filter((i) => !i.item.status || i.item.status === 'جديد').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span>سجل القرارات ومتابعة التكليفات</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة حالة تنفيذ التوصيات والمهام المسندة لمسؤولي قسم إدارة المرافق
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToEditor}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <span>العودة لنموذج المحضر المطبوع</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1">إجمالي التكليفات</div>
          <div className="text-2xl font-bold font-mono text-slate-900">{allItems.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs bg-blue-50/30">
          <div className="text-xs font-semibold text-blue-600 mb-1">بنود جديدة</div>
          <div className="text-2xl font-bold font-mono text-blue-700">{newCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-amber-50/30">
          <div className="text-xs font-semibold text-amber-600 mb-1">قيد الإجراء والتنفيذ</div>
          <div className="text-2xl font-bold font-mono text-amber-700">{inProgressCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/30">
          <div className="text-xs font-semibold text-emerald-600 mb-1">مكتملة ومحققة</div>
          <div className="text-2xl font-bold font-mono text-emerald-700">{completedCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-600">مسؤول التنفيذ:</span>
            <select
              value={filterResponsible}
              onChange={(e) => setFilterResponsible(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1 bg-slate-50 font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">جميع المسؤولين ({responsibles.length})</option>
              {responsibles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">حالة الإنجاز:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1 bg-slate-50 font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">جميع الحالات</option>
              <option value="جديد">جديد</option>
              <option value="قيد الإجراء">قيد الإجراء</option>
              <option value="مكتمل">مكتمل</option>
              <option value="متأخر">متأخر</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Items Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            لا توجد بنود تطابق معايير البحث الحالية. يمكنك كتابة بنود في المحضر أو إضافة بند سريع.
          </div>
        ) : (
          <table className="w-full text-center text-xs md:text-sm">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">م.</th>
                <th className="py-3 px-4 w-1/4 text-center">الموضوع والتصنيف</th>
                <th className="py-3 px-4 w-1/3 text-center">التوصيات المعتمدة</th>
                <th className="py-3 px-4 text-center">مسؤولية التنفيذ</th>
                <th className="py-3 px-4 text-center">تاريخ الإنجاز</th>
                <th className="py-3 px-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(({ sectionTitle, sectionId, item }, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block mb-1">
                      {sectionTitle}
                    </span>
                    <span className="font-semibold text-slate-900 block leading-snug text-center">
                      {item.topic || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 leading-relaxed text-center">
                    {item.recommendation || '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 font-medium text-slate-800">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.responsible || 'غير محدد'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-600">
                    <div className="inline-flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{item.date || '—'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {currentUser?.role === 'regular' ? (
                      <span
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border inline-block ${
                          item.status === 'مكتمل'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'قيد الإجراء'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : item.status === 'متأخر'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {item.status || 'جديد'}
                      </span>
                    ) : (
                      <select
                        value={item.status || 'جديد'}
                        onChange={(e) => updateItemStatus(sectionId, item.id, e.target.value as any)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                          item.status === 'مكتمل'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'قيد الإجراء'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : item.status === 'متأخر'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="جديد">جديد</option>
                        <option value="قيد الإجراء">قيد الإجراء</option>
                        <option value="مكتمل">مكتمل</option>
                        <option value="متأخر">متأخر</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
