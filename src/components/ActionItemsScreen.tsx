import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  User,
  Filter,
  FileText,
  ExternalLink,
  ShieldCheck,
  Archive,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MeetingMinute, AgendaItem, SystemUser } from '../types/meeting';
import {
  getPermanentCompletedItems,
  savePermanentCompletedItem,
  syncAllCompletedFromMeetings,
  PermanentActionItem,
  areItemsEquivalent,
  normalizeArabicText,
} from '../utils/permanentActionItems';

interface ActionItemsScreenProps {
  meeting: MeetingMinute;
  allMeetings?: MeetingMinute[];
  currentUser?: SystemUser;
  onUpdateMeeting: (updated: MeetingMinute) => void;
  onUpdateMeetings?: (updatedList: MeetingMinute[]) => void;
  onGoToEditor: () => void;
  onSelectMeeting?: (meetingId: string) => void;
}

export interface MeetingOccurrence {
  meetingId: string;
  meetingNum: string;
  meetingYear: string;
  meetingDate: string;
  meetingTitle: string;
  sectionId: string;
  sectionTitle: string;
  itemId: string;
  itemNumber: string;
  topic: string;
  recommendation: string;
  status: AgendaItem['status'];
  date: string;
  responsible: string;
  isPreservedArchived: boolean;
}

export interface UnifiedActionItem {
  id: string; // unique identifier
  itemNumber: string;
  topic: string;
  recommendation: string;
  responsible: string;
  date: string;
  status: AgendaItem['status'];
  occurrences: MeetingOccurrence[];
  isPreservedArchived: boolean;
  hasActiveMeeting: boolean;
  primaryMeetingId: string;
  primaryMeetingNum: string;
  primarySectionTitle: string;
}

export const ActionItemsScreen: React.FC<ActionItemsScreenProps> = ({
  meeting,
  allMeetings,
  currentUser,
  onUpdateMeeting,
  onUpdateMeetings,
  onGoToEditor,
  onSelectMeeting,
}) => {
  const meetingsList = allMeetings && allMeetings.length > 0 ? allMeetings : [meeting];

  const [selectedMeetingFilter, setSelectedMeetingFilter] = useState<string>('all');
  const [filterResponsible, setFilterResponsible] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [permanentRecords, setPermanentRecords] = useState<PermanentActionItem[]>(() =>
    getPermanentCompletedItems()
  );

  // Sync any completed items present in meetings to permanent storage
  useEffect(() => {
    syncAllCompletedFromMeetings(meetingsList);
    setPermanentRecords(getPermanentCompletedItems());
  }, [meetingsList]);

  // Aggregate and Deduplicate Items across all meetings and permanent records
  const { unifiedItems, totalRawItems, duplicatesMergedCount, multiMeetingCount } = useMemo(() => {
    interface RawItemOccurrence {
      meetingId: string;
      meetingNum: string;
      meetingYear: string;
      meetingDate: string;
      meetingTitle: string;
      sectionId: string;
      sectionTitle: string;
      item: AgendaItem;
      isPreservedArchived: boolean;
    }

    const rawOccurrences: RawItemOccurrence[] = [];

    // Gather all active items from all current meetings
    meetingsList.forEach((m) => {
      m.sections.forEach((sec) => {
        sec.items.forEach((item) => {
          if (
            item.topic?.trim() ||
            item.recommendation?.trim() ||
            item.responsible?.trim() ||
            item.date?.trim()
          ) {
            rawOccurrences.push({
              meetingId: m.id,
              meetingNum: m.meetingNum || '01',
              meetingYear: m.meetingYear || '',
              meetingDate: m.meetingDate || '',
              meetingTitle: m.title || `محضر اجتماع رقم (${m.meetingNum || '01'})`,
              sectionTitle: sec.title ? sec.title.replace(':', '').trim() : 'البنود الرئيسية الأولى',
              sectionId: sec.id,
              item,
              isPreservedArchived: false,
            });
          }
        });
      });
    });

    const groups: UnifiedActionItem[] = [];

    // Deduplication grouping: If an item is mentioned in more than one meeting, consolidate into ONE item!
    rawOccurrences.forEach((raw) => {
      // Find matching group by equivalence (matching ID, or matching recommendation & topic)
      let matchedGroup = groups.find((g) =>
        g.occurrences.some((occ) =>
          areItemsEquivalent(
            { id: occ.itemId, topic: occ.topic, recommendation: occ.recommendation },
            { id: raw.item.id, topic: raw.item.topic, recommendation: raw.item.recommendation }
          )
        )
      );

      const occData: MeetingOccurrence = {
        meetingId: raw.meetingId,
        meetingNum: raw.meetingNum,
        meetingYear: raw.meetingYear,
        meetingDate: raw.meetingDate,
        meetingTitle: raw.meetingTitle,
        sectionId: raw.sectionId,
        sectionTitle: raw.sectionTitle,
        itemId: raw.item.id,
        itemNumber: raw.item.itemNumber || '',
        topic: raw.item.topic || '',
        recommendation: raw.item.recommendation || '',
        responsible: raw.item.responsible || '',
        date: raw.item.date || '',
        status: raw.item.status || 'جديد',
        isPreservedArchived: raw.isPreservedArchived,
      };

      if (matchedGroup) {
        // Prevent duplicate occurrence for the exact same meeting
        const existingOccIndex = matchedGroup.occurrences.findIndex(
          (o) => o.meetingId === raw.meetingId
        );

        if (existingOccIndex >= 0) {
          const prevOcc = matchedGroup.occurrences[existingOccIndex];
          // If the incoming one is completed and prev is not, update occurrence
          if (raw.item.status === 'مكتمل' && prevOcc.status !== 'مكتمل') {
            matchedGroup.occurrences[existingOccIndex] = occData;
          }
        } else {
          matchedGroup.occurrences.push(occData);
        }

        // Merge status with priority: مكتمل > قيد الإجراء > متأخر > جديد
        if (raw.item.status === 'مكتمل' || matchedGroup.status === 'مكتمل') {
          matchedGroup.status = 'مكتمل';
        } else if (raw.item.status === 'قيد الإجراء' || matchedGroup.status === 'قيد الإجراء') {
          matchedGroup.status = 'قيد الإجراء';
        } else if (raw.item.status === 'متأخر' || matchedGroup.status === 'متأخر') {
          matchedGroup.status = 'متأخر';
        }

        // Merge date
        if (raw.item.date?.includes('تم التنفيذ') && !matchedGroup.date?.includes('تم التنفيذ')) {
          matchedGroup.date = raw.item.date;
        } else if (!matchedGroup.date && raw.item.date) {
          matchedGroup.date = raw.item.date;
        }

        // Prefer longer/more descriptive text
        if ((raw.item.recommendation?.trim().length || 0) > matchedGroup.recommendation.length) {
          matchedGroup.recommendation = raw.item.recommendation;
        }
        if ((raw.item.topic?.trim().length || 0) > matchedGroup.topic.length) {
          matchedGroup.topic = raw.item.topic;
        }
        if (!matchedGroup.responsible && raw.item.responsible) {
          matchedGroup.responsible = raw.item.responsible;
        }

        if (!raw.isPreservedArchived) {
          matchedGroup.hasActiveMeeting = true;
          matchedGroup.primaryMeetingId = raw.meetingId;
          matchedGroup.primaryMeetingNum = raw.meetingNum;
          matchedGroup.primarySectionTitle = raw.sectionTitle;
        }

        // An item is permanently archived only if ALL its occurrences have been deleted from meetings
        matchedGroup.isPreservedArchived = matchedGroup.occurrences.every(
          (o) => o.isPreservedArchived
        );
      } else {
        // Create new unified item
        groups.push({
          id: raw.item.id || `unified-${Date.now()}-${groups.length}`,
          itemNumber: raw.item.itemNumber || '',
          topic: raw.item.topic || '',
          recommendation: raw.item.recommendation || '',
          responsible: raw.item.responsible || '',
          date: raw.item.date || '',
          status: raw.item.status || 'جديد',
          occurrences: [occData],
          isPreservedArchived: raw.isPreservedArchived,
          hasActiveMeeting: !raw.isPreservedArchived,
          primaryMeetingId: raw.meetingId,
          primaryMeetingNum: raw.meetingNum,
          primarySectionTitle: raw.sectionTitle,
        });
      }
    });

    const totalRaw = rawOccurrences.length;
    const mergedCount = Math.max(0, totalRaw - groups.length);
    const multiCount = groups.filter((g) => g.occurrences.length > 1).length;

    return {
      unifiedItems: groups,
      totalRawItems: totalRaw,
      duplicatesMergedCount: mergedCount,
      multiMeetingCount: multiCount,
    };
  }, [meetingsList, permanentRecords]);

  // Unique list of responsibles for filtering
  const responsibles = useMemo(() => {
    return Array.from(
      new Set(unifiedItems.map((i) => i.responsible.trim()).filter(Boolean))
    );
  }, [unifiedItems]);

  // Filtered unified items
  const filtered = useMemo(() => {
    return unifiedItems.filter((item) => {
      // Meeting filter:
      // 'all': matches all
      // 'multi': matches items mentioned in more than one meeting
      // specific meeting id: matches if item is mentioned in that meeting
      let matchMeeting = true;
      if (selectedMeetingFilter === 'multi') {
        matchMeeting = item.occurrences.length > 1;
      } else if (selectedMeetingFilter !== 'all') {
        matchMeeting = item.occurrences.some((occ) => occ.meetingId === selectedMeetingFilter);
      }

      const matchResp =
        filterResponsible === 'all' || item.responsible.trim() === filterResponsible;
      const matchStatus =
        filterStatus === 'all' || (item.status || 'جديد') === filterStatus;

      return matchMeeting && matchResp && matchStatus;
    });
  }, [unifiedItems, selectedMeetingFilter, filterResponsible, filterStatus]);

  // Update Status for a Unified Item across all meetings it is mentioned in!
  const updateUnifiedItemStatus = (
    unifiedItem: UnifiedActionItem,
    newStatus: AgendaItem['status']
  ) => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const formattedToday = `${dd}/${mm}/${yyyy}`;

    const affectedItemIds = new Set(unifiedItem.occurrences.map((o) => o.itemId));
    const affectedMeetingIds = new Set(unifiedItem.occurrences.map((o) => o.meetingId));

    // Update all meetings containing this item
    const updatedMeetingsList = meetingsList.map((m) => {
      if (!affectedMeetingIds.has(m.id)) {
        // Also check if any item in this meeting matches by equivalence
        const hasEquivalentItem = m.sections.some((s) =>
          s.items.some(
            (it) =>
              affectedItemIds.has(it.id) ||
              areItemsEquivalent(
                { id: it.id, topic: it.topic, recommendation: it.recommendation },
                { id: unifiedItem.id, topic: unifiedItem.topic, recommendation: unifiedItem.recommendation }
              )
          )
        );
        if (!hasEquivalentItem) return m;
      }

      let meetingModified = false;
      const updatedSections: MeetingMinute['sections'] = m.sections.map((sec) => {
        let secModified = false;
        const updatedItems: AgendaItem[] = sec.items.map((it): AgendaItem => {
          const isTarget =
            affectedItemIds.has(it.id) ||
            areItemsEquivalent(
              { id: it.id, topic: it.topic, recommendation: it.recommendation },
              { id: unifiedItem.id, topic: unifiedItem.topic, recommendation: unifiedItem.recommendation }
            );

          if (!isTarget) return it;

          secModified = true;
          meetingModified = true;

          if (newStatus === 'مكتمل') {
            return {
              ...it,
              status: 'مكتمل',
              date: `تم التنفيذ (${formattedToday})`,
            };
          } else {
            const cleanDate = it.date
              ? it.date.replace(/^[✓\s]*تم التنفيذ[\s:(-]*/, '').replace(/\)$/, '').trim()
              : it.date;
            return {
              ...it,
              status: newStatus,
              date: cleanDate,
            };
          }
        });

        return secModified ? { ...sec, items: updatedItems } : sec;
      });

      return meetingModified
        ? { ...m, sections: updatedSections, updatedAt: new Date().toISOString() }
        : m;
    });

    // Save permanently if completed
    if (newStatus === 'مكتمل') {
      unifiedItem.occurrences.forEach((occ) => {
        savePermanentCompletedItem({
          id: occ.itemId,
          meetingId: occ.meetingId,
          meetingNum: occ.meetingNum,
          meetingYear: occ.meetingYear,
          meetingDate: occ.meetingDate,
          meetingTitle: occ.meetingTitle,
          sectionId: occ.sectionId,
          sectionTitle: occ.sectionTitle,
          itemNumber: occ.itemNumber || unifiedItem.itemNumber,
          topic: unifiedItem.topic,
          recommendation: unifiedItem.recommendation,
          responsible: unifiedItem.responsible,
          date: `تم التنفيذ (${formattedToday})`,
          status: 'مكتمل',
          completedAt: new Date().toISOString(),
          isPreservedAfterMeetingDeletion: false,
        });
      });
      setPermanentRecords(getPermanentCompletedItems());
    }

    // Persist changes across meetings
    if (onUpdateMeetings) {
      onUpdateMeetings(updatedMeetingsList);
    } else {
      const activeUpdated = updatedMeetingsList.find((m) => m.id === meeting.id);
      if (activeUpdated) {
        onUpdateMeeting(activeUpdated);
      }
    }

    // Show descriptive confirmation toast
    const meetingNumbers = Array.from(
      new Set(unifiedItem.occurrences.map((o) => `محضر (${o.meetingNum})`))
    ).join('، ');

    if (newStatus === 'مكتمل') {
      setToastMessage(
        `تم تحويل الحالة إلى (مكتمل) واعتماد تاريخ التنفيذ الفعلي تلقائياً (${formattedToday}) وعكسه في جميع المحاضر المعنية (${meetingNumbers}).`
      );
    } else if (unifiedItem.occurrences.length > 1) {
      setToastMessage(
        `تم تحويل الحالة إلى (${newStatus}) وتحديثها بجميع المحاضر المذكور فيها هذا البند (${meetingNumbers}).`
      );
    } else {
      const singleNum = unifiedItem.occurrences[0]?.meetingNum || '01';
      setToastMessage(
        `تم تحويل الحالة إلى (${newStatus}) وعكسها في المحضر رقم (${singleNum}) بسجل التكليفات.`
      );
    }

    setTimeout(() => setToastMessage(null), 5500);
  };

  const completedCount = unifiedItems.filter((i) => i.status === 'مكتمل').length;
  const inProgressCount = unifiedItems.filter((i) => i.status === 'قيد الإجراء').length;
  const newCount = unifiedItems.filter((i) => !i.status || i.status === 'جديد').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <span>سجل القرارات ومتابعة التكليفات</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            متابعة حالة تنفيذ التوصيات والمهام وتوحيد البنود المشتركة بين المحاضر بدون تكرار، مع حفظ التوصيات المكتملة بشكل دائم.
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

      {/* Preservation & Deduplication Policy Banner */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">سياسة توحيد البنود والأرشفة الدائمة:</span> يتم دمج البنود المذكورة في أكثر من محضر تلقائياً في سجل التكليفات لعرضها <strong className="underline font-bold">مرة واحدة دون أي تكرار</strong> مع إيضاح جميع أرقام المحاضر المذكورة فيها. وأي توصية تتحول إلى <strong className="text-emerald-800 font-bold">"مكتمل"</strong> تُحفظ بشكل دائم ولا تُحذف أبداً حتى لو حُذفت من أي محضر.
          </div>
        </div>

        {duplicatesMergedCount > 0 && (
          <div className="shrink-0 bg-emerald-100/90 border border-emerald-300 text-emerald-800 font-bold px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>تم دمج وتوحيد ({duplicatesMergedCount}) بنود مكررة عبر المحاضر</span>
          </div>
        )}
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center justify-between">
            <span>إجمالي التكليفات الموحدة</span>
            {multiMeetingCount > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono font-bold">
                {multiMeetingCount} مشتركة
              </span>
            )}
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{unifiedItems.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {duplicatesMergedCount > 0 ? `(تم دمج ${duplicatesMergedCount} بنود مكررة)` : 'لا توجد بنود مكررة'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs bg-blue-50/30">
          <div className="text-xs font-semibold text-blue-600 mb-1">بنود جديدة</div>
          <div className="text-2xl font-bold font-mono text-blue-700">{newCount}</div>
          <div className="text-[11px] text-blue-400 mt-0.5">بانتظار بدء الإجراءات</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs bg-amber-50/30">
          <div className="text-xs font-semibold text-amber-600 mb-1">قيد الإجراء والتنفيذ</div>
          <div className="text-2xl font-bold font-mono text-amber-700">{inProgressCount}</div>
          <div className="text-[11px] text-amber-400 mt-0.5">مهام جارية المتابعة</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs bg-emerald-50/30">
          <div className="text-xs font-semibold text-emerald-600 mb-1">مكتملة وموثقة بالسجل</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 flex items-center gap-2">
            <span>{completedCount}</span>
          </div>
          <div className="text-[11px] text-emerald-500 mt-0.5">توصيات منجزة وموثقة</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter by Meeting Number */}
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-600">رقم المحضر:</span>
            <select
              value={selectedMeetingFilter}
              onChange={(e) => setSelectedMeetingFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1 bg-slate-50 font-medium focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">جميع المحاضر ({meetingsList.length})</option>
              {multiMeetingCount > 0 && (
                <option value="multi" className="font-bold text-indigo-700 bg-indigo-50">
                  ⚡ البنود المشتركة في أكثر من محضر ({multiMeetingCount})
                </option>
              )}
              {meetingsList.map((m) => (
                <option key={m.id} value={m.id}>
                  محضر رقم ({m.meetingNum || '01'}) {m.meetingDate ? `- ${m.meetingDate}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Responsible */}
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

          {/* Filter by Status */}
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

        {/* Counter of shown items */}
        <div className="text-slate-500 font-medium">
          المعروض: <span className="font-bold font-mono text-slate-800">{filtered.length}</span> من أصل{' '}
          <span className="font-bold font-mono text-slate-800">{unifiedItems.length}</span> توصية موحدة
          {duplicatesMergedCount > 0 && (
            <span className="text-[11px] text-emerald-600 mr-1.5 font-semibold">
              (بدون تكرار)
            </span>
          )}
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
            <thead className="bg-[#85b8db]/30 text-slate-800 font-bold border-b border-slate-300">
              <tr>
                <th className="py-3 px-3 w-12 text-center">م.</th>
                <th className="py-3 px-4 w-1/4 text-center">الموضوع والتصنيف</th>
                <th className="py-3 px-4 w-1/3 text-center">التوصيات المعتمدة</th>
                <th className="py-3 px-4 text-center">مسؤولية التنفيذ</th>
                <th className="py-3 px-3 w-52 text-center">
                  <div className="inline-flex items-center justify-center gap-1.5 text-slate-800">
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>رقم المحضر</span>
                  </div>
                </th>
                <th className="py-3 px-4 text-center">تاريخ التنفيذ</th>
                <th className="py-3 px-4 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, idx) => {
                const isMultiMeeting = item.occurrences.length > 1;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/70 transition ${
                      item.isPreservedArchived ? 'bg-emerald-50/20' : ''
                    } ${isMultiMeeting ? 'bg-blue-50/15' : ''}`}
                  >
                    {/* Index */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-500">
                      {idx + 1}
                    </td>

                    {/* Topic and Section */}
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block mb-1">
                        {item.primarySectionTitle}
                      </span>
                      <span className="font-semibold text-slate-900 block leading-snug text-center">
                        {item.topic || '—'}
                      </span>
                    </td>

                    {/* Recommendation */}
                    <td className="py-3 px-4 text-slate-700 leading-relaxed text-center">
                      {item.recommendation || '—'}
                    </td>

                    {/* Responsible */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-medium text-slate-800">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.responsible || 'غير محدد'}</span>
                      </div>
                    </td>

                    {/* Meeting Number Column (رقم المحضر - بتنسيق احترافي وأنيق) */}
                    <td className="py-3 px-3 text-center align-middle">
                      {isMultiMeeting ? (
                        <div className="flex flex-col items-center justify-center gap-1.5 max-w-[220px] mx-auto">
                          <div
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50/90 border border-indigo-200/80 px-2 py-0.5 rounded-full shadow-2xs"
                            title={`هذا البند نفسه مذكور في (${item.occurrences.length}) محاضر مختلفة تم توحيده بدون تكرار`}
                          >
                            <Layers className="w-3 h-3 text-indigo-600" />
                            <span>مشترك في ({item.occurrences.length}) محاضر</span>
                          </div>

                          <div className="flex flex-col gap-1 w-full">
                            {item.occurrences.map((occ, occIdx) => {
                              const isMeetingActive = meetingsList.some((m) => m.id === occ.meetingId);

                              return (
                                <div
                                  key={`${occ.meetingId}-${occ.itemId}-${occIdx}`}
                                  className="flex items-center justify-between gap-1.5 w-full px-2 py-1 rounded-lg text-xs bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200/90 hover:border-blue-300 transition-all shadow-2xs group"
                                >
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                                    <span className="text-[11px] text-slate-500">محضر</span>
                                    <span className="font-mono font-bold text-slate-800 group-hover:text-blue-700">
                                      #{occ.meetingNum}
                                    </span>
                                    {occ.isPreservedArchived && (
                                      <span
                                        className="inline-flex items-center text-emerald-600 shrink-0"
                                        title="محفوظ بالسجل بعد حذف البند من هذا المحضر"
                                      >
                                        <ShieldCheck className="w-3 h-3" />
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    {occ.meetingDate && (
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {occ.meetingDate}
                                      </span>
                                    )}
                                    {isMeetingActive && onSelectMeeting ? (
                                      <button
                                        type="button"
                                        onClick={() => onSelectMeeting(occ.meetingId)}
                                        title={`الانتقال إلى المحضر رقم (${occ.meetingNum})`}
                                        className="p-0.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded transition cursor-pointer"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const occ = item.occurrences[0];
                          if (!occ) return <span className="text-slate-400 text-xs">—</span>;
                          const isMeetingActive = meetingsList.some((m) => m.id === occ.meetingId);

                          return (
                            <div className="flex flex-col items-center justify-center gap-1">
                              {isMeetingActive && onSelectMeeting ? (
                                <button
                                  type="button"
                                  onClick={() => onSelectMeeting(occ.meetingId)}
                                  className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs cursor-pointer"
                                  title={`الانتقال إلى المحضر رقم (${occ.meetingNum}) لسنة ${occ.meetingYear || '2026'}`}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></span>
                                  <span className="text-[11px] text-slate-500 group-hover:text-blue-600">محضر</span>
                                  <span className="font-mono font-bold text-slate-800 group-hover:text-blue-700">#{occ.meetingNum}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                                  <span className="text-[11px] text-slate-500">محضر</span>
                                  <span className="font-mono font-bold text-slate-800">#{occ.meetingNum}</span>
                                </span>
                              )}

                              {occ.meetingDate && (
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {occ.meetingDate}
                                </span>
                              )}

                              {occ.isPreservedArchived && (
                                <span
                                  className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md shadow-2xs"
                                  title="محفوظ بالسجل بعد حذف البند من هذا المحضر"
                                >
                                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                                  <span>محفوظ بالسجل</span>
                                </span>
                              )}
                            </div>
                          );
                        })()
                      )}
                    </td>

                    {/* Execution Date (تاريخ التنفيذ - التاريخ الفعلي للوقت الحالي تلقائياً) */}
                    <td className="py-3 px-4 text-center font-mono">
                      {(() => {
                        const now = new Date();
                        const dd = String(now.getDate()).padStart(2, '0');
                        const mm = String(now.getMonth() + 1).padStart(2, '0');
                        const yyyy = now.getFullYear();
                        const currentActualDate = `${dd}/${mm}/${yyyy}`;

                        const rawCleanDate = (item.date || '')
                          .replace(/^[✓\s]*تم التنفيذ[\s:(-]*/, '')
                          .replace(/\)$/, '')
                          .trim();

                        const isCompleted = item.status === 'مكتمل';
                        const displayDate = isCompleted
                          ? (rawCleanDate || currentActualDate)
                          : (rawCleanDate || item.date || '—');

                        return (
                          <div className="inline-flex items-center justify-center gap-1.5 flex-wrap">
                            <Calendar className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                            {isCompleted ? (
                              <span
                                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md shadow-2xs font-mono"
                                title={`تاريخ التنفيذ الفعلي المعتمد: ${displayDate}`}
                              >
                                <span>✓ {displayDate}</span>
                              </span>
                            ) : (
                              <span className="text-slate-600 text-xs font-mono">{displayDate}</span>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      {item.isPreservedArchived ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>مكتمل (محفوظ دائماً)</span>
                          </span>
                          <span className="text-[10px] text-emerald-700 font-medium">
                            محفوظ بعد حذفه من المحاضر
                          </span>
                        </div>
                      ) : currentUser?.role === 'regular' ? (
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
                          onChange={(e) =>
                            updateUnifiedItemStatus(
                              item,
                              e.target.value as AgendaItem['status']
                            )
                          }
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border focus:ring-1 focus:ring-blue-500 cursor-pointer ${
                            item.status === 'مكتمل'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : item.status === 'قيد الإجراء'
                              ? 'bg-amber-50 text-amber-700 border-amber-300'
                              : item.status === 'متأخر'
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
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
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-600 animate-fade-in no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
