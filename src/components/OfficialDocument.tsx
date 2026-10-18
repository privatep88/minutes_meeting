import React, { useRef, useState } from 'react';
import {
  Upload,
  UserPlus,
  FolderPlus,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  X,
  Building2,
  Table as TableIcon,
  AlignJustify,
  PenTool,
} from 'lucide-react';
import { MeetingMinute, Attendee, AgendaSection, AgendaItem, SignatureBlock } from '../types/meeting';
import { OFFICIAL_SAAED_LOGO } from '../data/defaultData';

interface OfficialDocumentProps {
  meeting: MeetingMinute;
  isEditMode: boolean;
  onUpdateMeeting: (updated: MeetingMinute) => void;
  onOpenQuickAdd: () => void;
  onOpenAddSection: () => void;
  onOpenSignatureModal: () => void;
}

export const OfficialDocument: React.FC<OfficialDocumentProps> = ({
  meeting,
  isEditMode,
  onUpdateMeeting,
  onOpenAddSection,
  onOpenSignatureModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [signatureLayout, setSignatureLayout] = useState<'lines' | 'table'>('lines');

  // Field updater
  const updateField = <K extends keyof MeetingMinute>(key: K, value: MeetingMinute[K]) => {
    onUpdateMeeting({
      ...meeting,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateField('logoSrc', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Attendees management
  const updateAttendee = (id: string, field: keyof Attendee, val: string) => {
    const updated = meeting.attendees.map((att) =>
      att.id === id ? { ...att, [field]: val } : att
    );
    updateField('attendees', updated);
  };

  const addAttendee = () => {
    const newAtt: Attendee = {
      id: `att-${Date.now()}`,
      name: 'الاستاذ / ...',
      jobTitle: 'ضابط خدمات مرافق وأصول',
      status: 'حاضر',
    };
    updateField('attendees', [...meeting.attendees, newAtt]);
  };

  const deleteAttendee = (id: string) => {
    updateField(
      'attendees',
      meeting.attendees.filter((att) => att.id !== id)
    );
  };

  const moveAttendee = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= meeting.attendees.length) return;
    const newAttendees = [...meeting.attendees];
    const temp = newAttendees[index];
    newAttendees[index] = newAttendees[targetIdx];
    newAttendees[targetIdx] = temp;
    updateField('attendees', newAttendees);
  };

  // Sections and items management
  const updateSectionTitle = (secId: string, title: string) => {
    const updated = meeting.sections.map((sec) =>
      sec.id === secId ? { ...sec, title } : sec
    );
    updateField('sections', updated);
  };

  const deleteSection = (secId: string) => {
    if (window.confirm('هل تريد بالتأكيد حذف هذا التصنيف وجميع البنود المدرجة تحته؟')) {
      updateField(
        'sections',
        meeting.sections.filter((sec) => sec.id !== secId)
      );
    }
  };

  const updateItem = (secId: string, itemId: string, field: keyof AgendaItem, val: string) => {
    const updated = meeting.sections.map((sec) => {
      if (sec.id !== secId) return sec;
      return {
        ...sec,
        items: sec.items.map((item) =>
          item.id === itemId ? { ...item, [field]: val } : item
        ),
      };
    });
    updateField('sections', updated);
  };

  const addItemToSection = (secId: string) => {
    const newItem: AgendaItem = {
      id: `itm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      topic: '',
      recommendation: '',
      responsible: '',
      date: '',
      status: 'جديد',
    };
    const updated = meeting.sections.map((sec) =>
      sec.id === secId ? { ...sec, items: [...sec.items, newItem] } : sec
    );
    updateField('sections', updated);
  };

  const duplicateItem = (secId: string, itemId: string) => {
    const updated = meeting.sections.map((sec) => {
      if (sec.id !== secId) return sec;
      const idx = sec.items.findIndex((i) => i.id === itemId);
      if (idx === -1) return sec;
      const original = sec.items[idx];
      const clone: AgendaItem = {
        ...original,
        id: `itm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      };
      const items = [...sec.items];
      items.splice(idx + 1, 0, clone);
      return { ...sec, items };
    });
    updateField('sections', updated);
  };

  const deleteItem = (secId: string, itemId: string) => {
    const updated = meeting.sections.map((sec) => {
      if (sec.id !== secId) return sec;
      return {
        ...sec,
        items: sec.items.filter((item) => item.id !== itemId),
      };
    });
    updateField('sections', updated);
  };

  // Signatures
  const updateSignature = (sigId: string, field: keyof SignatureBlock, val: string) => {
    const updated = meeting.signatures.map((sig) =>
      sig.id === sigId ? { ...sig, [field]: val } : sig
    );
    updateField('signatures', updated);
  };

  const removeSignatureImage = (sigId: string) => {
    const updated = meeting.signatures.map((sig) =>
      sig.id === sigId ? { ...sig, sigImage: null } : sig
    );
    updateField('signatures', updated);
  };

  const addSignatureBlock = () => {
    const newSig: SignatureBlock = {
      id: `sig-${Date.now()}`,
      role: 'عضو اللجنة / الاعتماد',
      name: 'الاستاذ / ...',
      sigImage: null,
    };
    updateField('signatures', [...meeting.signatures, newSig]);
  };

  const deleteSignatureBlock = (sigId: string) => {
    if (meeting.signatures.length <= 1) return;
    updateField(
      'signatures',
      meeting.signatures.filter((s) => s.id !== sigId)
    );
  };

  // Global numbering counter for continuous numbering
  let continuousCounter = 1;

  return (
    <div
      id="printableDocument"
      className={`a4-page doc-font text-slate-900 border border-slate-300 ${
        isEditMode ? 'edit-mode' : ''
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />

      {/* 1. OFFICIAL TOP HEADER TABLE (Crisp Black Borders) */}
      <header className="w-full mb-6">
        <table className="w-full table-official text-center text-sm md:text-base leading-snug">
          <tbody>
            <tr>
              {/* Col 1 (Right in RTL): Form Code & Revision Control */}
              <td className="w-[28%] p-2 text-center align-middle text-xs md:text-sm font-semibold space-y-1 bg-white">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-slate-600 font-sans">رقم النموذج:</span>
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField('formNumber', e.currentTarget.innerText)}
                    className="editable-cell font-mono font-bold px-1 text-center"
                  >
                    {meeting.formNumber}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1.5 pt-1 border-t border-black">
                  <span className="text-slate-600 font-sans">رقم الإصدار:</span>
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField('revisionNumber', e.currentTarget.innerText)}
                    className="editable-cell font-mono font-bold px-1 text-center"
                  >
                    {meeting.revisionNumber}
                  </div>
                </div>
              </td>

              {/* Col 2 (Middle in RTL): Company Name & Department */}
              <td className="w-[47%] p-2 align-middle text-center bg-white">
                <div className="text-base md:text-lg font-bold tracking-tight text-slate-900 pb-1.5 text-center">
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField('companyName', e.currentTarget.innerText)}
                    className="editable-cell text-center"
                  >
                    {meeting.companyName}
                  </div>
                </div>
                <div className="grid grid-cols-2 text-xs md:text-sm border-t border-black pt-1 font-semibold text-center">
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField('departmentName', e.currentTarget.innerText)}
                    className="editable-cell px-1 text-center"
                  >
                    {meeting.departmentName}
                  </div>
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateField('docTypeTitle', e.currentTarget.innerText)}
                    className="editable-cell border-r border-black px-1 text-center"
                  >
                    {meeting.docTypeTitle}
                  </div>
                </div>
              </td>

              {/* Col 3 (Left in RTL): Official Company Logo */}
              <td className="w-[25%] p-2 align-middle text-center bg-white relative group">
                <div className="flex items-center justify-center min-h-[58px]">
                  <img
                    src={meeting.logoSrc || OFFICIAL_SAAED_LOGO}
                    alt="شعار شركة ساعد للأنظمة المرورية"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = OFFICIAL_SAAED_LOGO;
                    }}
                    className="max-h-16 max-w-full object-contain mx-auto select-none"
                  />
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="تغيير الشعار"
                    className="no-print absolute top-1 left-1 opacity-0 group-hover:opacity-100 bg-slate-900/80 hover:bg-slate-900 text-white rounded p-1 text-[10px] flex items-center gap-1 transition shadow-sm cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>تغيير</span>
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      {/* 2. MEETING TITLE & DETAILS */}
      <section className="mb-5">
        {/* Title Underlined */}
        <div className="text-center mb-4">
          <h2 className="text-lg md:text-xl font-bold inline-block border-b-2 border-black pb-0.5 px-3 text-center">
            <span>محضر اجتماع رقم ( </span>
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => updateField('meetingNum', e.currentTarget.innerText)}
              className="editable-cell text-blue-900 underline font-extrabold px-1 text-center"
            >
              {meeting.meetingNum}
            </span>
            <span> ) لسنة </span>
            <span
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => updateField('meetingYear', e.currentTarget.innerText)}
              className="editable-cell text-blue-900 underline font-extrabold px-1 text-center"
            >
              {meeting.meetingYear}
            </span>
          </h2>
        </div>

        {/* Meeting Metadata: Location, Date, Time (Right-Aligned Rows) */}
        <div className="flex flex-col items-start justify-start gap-1.5 text-sm md:text-base font-semibold max-w-xl mr-2 text-right">
          <div className="flex items-center gap-2 text-right">
            <span className="font-bold min-w-[125px] text-right">مكان الاجتماع :</span>
            <div
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => updateField('meetingLocation', e.currentTarget.innerText)}
              className="editable-cell text-slate-800 text-right min-w-[200px]"
            >
              {meeting.meetingLocation}
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className="font-bold min-w-[125px] text-right">تاريخ الاجتماع :</span>
            <div
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => updateField('meetingDate', e.currentTarget.innerText)}
              className="editable-cell text-slate-800 text-right min-w-[200px]"
            >
              {meeting.meetingDate}
            </div>
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className="font-bold min-w-[125px] text-right">وقت الاجتماع :</span>
            <div
              contentEditable={isEditMode}
              suppressContentEditableWarning
              onBlur={(e) => updateField('meetingTime', e.currentTarget.innerText)}
              className="editable-cell text-slate-800 text-right min-w-[200px]"
            >
              {meeting.meetingTime}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ATTENDANCE SECTION (الحضور) */}
      <section className="mb-6">
        {/* Banner with light blue color #85b8db from the original document */}
        <div className="w-full bg-[#85b8db] text-slate-900 font-bold px-3 py-1.5 text-sm md:text-base border border-b-0 border-black rounded-t-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>الحضور :</span>
            <span className="text-xs bg-white/80 px-2.5 py-0.5 rounded-full font-sans font-bold shadow-xs">
              {meeting.attendees.length}
            </span>
          </div>

          {isEditMode && (
            <button
              type="button"
              onClick={addAttendee}
              className="no-print text-xs bg-white hover:bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded shadow-xs border border-slate-300 font-sans font-medium flex items-center gap-1 transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-700" />
              <span>إضافة حاضر</span>
            </button>
          )}
        </div>

        {/* Attendees Table with Right-Aligned Text in Rows */}
        <table className="w-full table-official text-xs md:text-sm">
          <thead>
            <tr className="bg-[#85b8db] text-black font-bold">
              <th className="w-10 py-1.5 px-2 text-center">م.</th>
              <th className="w-1/2 py-1.5 px-3 text-right">الاسم</th>
              <th className="w-1/2 py-1.5 px-3 text-right">المسمى الوظيفي</th>
              {isEditMode && (
                <th className="w-16 py-1 px-1 text-center no-print bg-[#72a6cc]">إجراءات</th>
              )}
            </tr>
          </thead>
          <tbody>
            {meeting.attendees.map((att, idx) => (
              <tr
                key={att.id}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f4f9fd]'}
              >
                <td className="text-center font-bold font-sans py-1.5 px-2 text-black align-middle">
                  {idx + 1}.
                </td>
                <td className="py-1.5 px-3 text-right align-middle">
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateAttendee(att.id, 'name', e.currentTarget.innerText)}
                    className="editable-cell font-semibold text-right"
                  >
                    {att.name}
                  </div>
                </td>
                <td className="py-1.5 px-3 text-right align-middle">
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateAttendee(att.id, 'jobTitle', e.currentTarget.innerText)}
                    className="editable-cell text-slate-800 text-right"
                  >
                    {att.jobTitle}
                  </div>
                </td>
                {isEditMode && (
                  <td className="text-center py-1 px-1 align-middle no-print">
                    <div className="flex items-center justify-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveAttendee(idx, 'up')}
                        disabled={idx === 0}
                        title="تحريك لأعلى"
                        className={`p-1 text-slate-500 hover:text-blue-600 transition ${
                          idx === 0 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveAttendee(idx, 'down')}
                        disabled={idx === meeting.attendees.length - 1}
                        title="تحريك لأسفل"
                        className={`p-1 text-slate-500 hover:text-blue-600 transition ${
                          idx === meeting.attendees.length - 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAttendee(att.id)}
                        title="حذف الحاضر"
                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 4. AGENDA & OUTCOMES TABLE (مدخلات ونتائج الاجتماع مفصلة أدناه) */}
      <section className="mb-8">
        {/* Banner with light blue color */}
        <div className="w-full bg-[#85b8db] text-slate-900 font-bold px-3 py-1.5 text-sm md:text-base border border-b-0 border-black rounded-t-xs flex items-center justify-between">
          <span className="w-full text-center font-bold">مدخلات ونتائج الاجتماع مفصلة أدناه:</span>

          {isEditMode && (
            <button
              type="button"
              onClick={onOpenAddSection}
              className="no-print text-xs bg-white hover:bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded shadow-xs border border-slate-300 font-sans font-medium flex items-center gap-1 transition cursor-pointer shrink-0"
            >
              <FolderPlus className="w-3.5 h-3.5 text-blue-700" />
              <span>إضافة تصنيف جديد</span>
            </button>
          )}
        </div>

        {/* Decisions Table with Right-Aligned Text in Rows */}
        <table className="w-full table-official text-xs md:text-sm">
          <thead>
            <tr className="bg-[#85b8db] text-black font-bold">
              <th className="w-10 py-1.5 px-1 text-center">م</th>
              <th className="w-[30%] py-1.5 px-2.5 text-right">الموضوع</th>
              <th className="w-[38%] py-1.5 px-2.5 text-right">التوصيات</th>
              <th className="w-[18%] py-1.5 px-2 text-right">مسؤولية التنفيذ</th>
              <th className="w-[14%] py-1.5 px-2 text-center">تاريخ التنفيذ</th>
              {isEditMode && (
                <th className="w-14 py-1 px-1 no-print bg-[#72a6cc] text-center">تحكم</th>
              )}
            </tr>
          </thead>
          <tbody>
            {meeting.sections.map((section) => (
              <React.Fragment key={section.id}>
                {/* Optional dark navy section divider banner */}
                {section.title && section.title.trim() !== '' && (
                  <tr className="bg-[#0c2a59] text-white font-bold">
                    <td
                      colSpan={5}
                      className="py-1.5 px-3 text-right"
                    >
                      <div className="flex items-center justify-between relative">
                        <div
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateSectionTitle(section.id, e.currentTarget.innerText)}
                          className="editable-cell text-sm tracking-wide text-white text-right flex-1 font-bold pr-1"
                        >
                          {section.title}
                        </div>

                        {isEditMode && (
                          <div className="no-print flex items-center gap-2 mr-2">
                            <button
                              type="button"
                              onClick={() => addItemToSection(section.id)}
                              className="text-[11px] bg-blue-600/70 hover:bg-blue-600 px-2 py-0.5 rounded text-white flex items-center gap-1 transition cursor-pointer font-sans"
                            >
                              <Plus className="w-3 h-3" />
                              <span>صف جديد</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSection(section.id)}
                              title="حذف هذا القسم"
                              className="text-slate-300 hover:text-rose-300 p-0.5 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    {isEditMode && <td className="no-print bg-[#092043]"></td>}
                  </tr>
                )}

                {/* Section rows with Right-Aligned Text */}
                {section.items.map((item, itemIdx) => {
                  const rowNumber = meeting.continuousNumbering
                    ? continuousCounter++
                    : itemIdx + 1;

                  return (
                    <tr
                      key={item.id}
                      className={itemIdx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}
                    >
                      <td className="text-center font-bold font-sans py-2 px-1 text-black align-middle">
                        {rowNumber}
                      </td>
                      <td className="py-2 px-2.5 text-right align-top">
                        <div
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateItem(section.id, item.id, 'topic', e.currentTarget.innerText)}
                          className="editable-cell text-slate-900 leading-relaxed min-h-[24px] text-right"
                        >
                          {item.topic}
                        </div>
                      </td>
                      <td className="py-2 px-2.5 text-right align-top">
                        <div
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateItem(section.id, item.id, 'recommendation', e.currentTarget.innerText)}
                          className="editable-cell text-slate-800 leading-relaxed min-h-[24px] text-right"
                        >
                          {item.recommendation}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-right align-middle">
                        <div
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateItem(section.id, item.id, 'responsible', e.currentTarget.innerText)}
                          className="editable-cell text-slate-800 min-h-[24px] text-right"
                        >
                          {item.responsible}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center align-middle font-sans text-xs">
                        <div
                          contentEditable={isEditMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateItem(section.id, item.id, 'date', e.currentTarget.innerText)}
                          className="editable-cell text-slate-700 min-h-[24px] text-center"
                        >
                          {item.date}
                        </div>
                      </td>
                      {isEditMode && (
                        <td className="text-center py-1.5 px-1 align-middle no-print">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => duplicateItem(section.id, item.id)}
                              title="تكرار البند"
                              className="p-1 text-slate-400 hover:text-blue-600 transition cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteItem(section.id, item.id)}
                              title="حذف البند"
                              className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}

                {/* Add row helper row inside section */}
                {isEditMode && (
                  <tr className="no-print bg-slate-50/70 border-b border-slate-300 text-xs">
                    <td colSpan={isEditMode ? 6 : 5} className="p-1 text-center">
                      <button
                        type="button"
                        onClick={() => addItemToSection(section.id)}
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 py-0.5 px-3 rounded hover:bg-blue-50 transition cursor-pointer font-sans"
                      >
                        <Plus className="w-3 h-3" />
                        <span>إضافة سطر جديد هنا</span>
                      </button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>

      {/* 5. SIGNATURES & APPROVAL SECTION */}
      <footer className="mt-8 pt-4 border-t-2 border-black w-full max-w-full overflow-hidden">
        {/* Controls bar above signature area */}
        <div className="flex items-center justify-between mb-3 no-print flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">منطقة الاعتماد والتواقيع الرسمية:</span>
            
            {/* Layout Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-300 text-[11px] font-medium font-sans">
              <button
                type="button"
                onClick={() => setSignatureLayout('lines')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition cursor-pointer ${
                  signatureLayout === 'lines'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlignJustify className="w-3 h-3" />
                <span>أسطر متوازية</span>
              </button>
              <button
                type="button"
                onClick={() => setSignatureLayout('table')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition cursor-pointer ${
                  signatureLayout === 'table'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3 h-3" />
                <span>جدول اعتماد مؤطر</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSignatureModal}
              className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded border border-indigo-200 flex items-center gap-1 transition font-sans cursor-pointer font-medium"
            >
              <PenTool className="w-3 h-3" />
              <span>لوحة التوقيع الحي</span>
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={addSignatureBlock}
                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 flex items-center gap-1 transition font-sans cursor-pointer font-medium"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة جهة توقيع</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. TABLE LAYOUT (Strictly bounded table matching official document style) */}
        {signatureLayout === 'table' ? (
          <div className="w-full">
            <table className="w-full table-official text-xs md:text-sm text-center">
              <thead>
                <tr className="bg-[#85b8db] text-black font-bold">
                  <th className="py-2 px-2 w-12 text-center">م.</th>
                  <th className="py-2 px-3 w-1/4 text-center">الصفة / الدور</th>
                  <th className="py-2 px-3 w-1/3 text-center">الاسم الكريم</th>
                  <th className="py-2 px-4 text-center">التوقيع والاعتماد الرسمي</th>
                  {isEditMode && <th className="py-1 px-2 w-14 no-print bg-[#72a6cc]">تحكم</th>}
                </tr>
              </thead>
              <tbody>
                {meeting.signatures.map((sig, idx) => (
                  <tr key={sig.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}>
                    <td className="py-2 px-2 font-mono font-bold text-black align-middle text-center">
                      {idx + 1}.
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900 text-center align-middle">
                      <div
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => updateSignature(sig.id, 'role', e.currentTarget.innerText)}
                        className="editable-cell font-bold text-center"
                      >
                        {sig.role}
                      </div>
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-800 text-center align-middle">
                      <div
                        contentEditable={isEditMode}
                        suppressContentEditableWarning
                        onBlur={(e) => updateSignature(sig.id, 'name', e.currentTarget.innerText)}
                        className="editable-cell text-center"
                      >
                        {sig.name}
                      </div>
                    </td>
                    <td className="py-2 px-4 text-center align-middle">
                      <div className="flex items-center justify-center">
                        {sig.sigImage ? (
                          <div className="relative inline-block py-1">
                            <img
                              src={sig.sigImage}
                              alt={`توقيع ${sig.name}`}
                              className="h-9 max-w-[170px] object-contain inline-block"
                            />
                            {isEditMode && (
                              <button
                                type="button"
                                onClick={() => removeSignatureImage(sig.id)}
                                title="إزالة التوقيع"
                                className="no-print absolute -top-1 -right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-0.5 transition cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div
                            onClick={isEditMode ? onOpenSignatureModal : undefined}
                            className={`w-36 sm:w-44 border-b border-dotted border-black h-8 flex items-end justify-center pb-0.5 ${
                              isEditMode ? 'hover:bg-blue-50/50 cursor-pointer' : ''
                            }`}
                            title={isEditMode ? 'انقر للتوقيع الإلكتروني' : ''}
                          >
                            <span className="text-slate-400 text-xs font-mono select-none tracking-widest">
                              ...........................
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    {isEditMode && (
                      <td className="text-center py-1 px-1 align-middle no-print">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={onOpenSignatureModal}
                            title="توقيع إلكتروني"
                            className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                          >
                            <PenTool className="w-3.5 h-3.5" />
                          </button>
                          {meeting.signatures.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteSignatureBlock(sig.id)}
                              title="حذف جهة التوقيع"
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* 2. BOUNDED LINEAR LAYOUT (Classic Clean Row Layout strictly within margins) */
          <div className="w-full space-y-3 pt-1">
            {meeting.signatures.map((sig) => (
              <div
                key={sig.id}
                className="flex items-center justify-between gap-3 text-sm md:text-base font-semibold py-1.5 px-2 border-b border-slate-200 w-full"
              >
                {/* Right: Role & Name */}
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateSignature(sig.id, 'role', e.currentTarget.innerText)}
                    className="editable-cell text-slate-900 font-bold whitespace-nowrap shrink-0"
                  >
                    {sig.role}:
                  </span>
                  <div
                    contentEditable={isEditMode}
                    suppressContentEditableWarning
                    onBlur={(e) => updateSignature(sig.id, 'name', e.currentTarget.innerText)}
                    className="editable-cell text-slate-800 font-semibold truncate px-1"
                  >
                    {sig.name}
                  </div>
                </div>

                {/* Left: Signature Line strictly bounded */}
                <div className="flex items-center gap-2 shrink-0 justify-end">
                  <span className="font-bold text-slate-900 whitespace-nowrap">التوقيع:</span>
                  
                  <div
                    onClick={isEditMode ? onOpenSignatureModal : undefined}
                    className={`relative w-44 sm:w-56 h-10 flex items-end justify-center border-b border-dotted border-black pb-0.5 ${
                      isEditMode ? 'hover:bg-blue-50/50 cursor-pointer' : ''
                    }`}
                    title={isEditMode ? 'انقر للتوقيع الإلكتروني' : ''}
                  >
                    {sig.sigImage ? (
                      <div className="relative inline-block mb-1">
                        <img
                          src={sig.sigImage}
                          alt={`توقيع ${sig.name}`}
                          className="h-8 max-w-[150px] object-contain inline-block"
                        />
                        {isEditMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSignatureImage(sig.id);
                            }}
                            title="إزالة التوقيع"
                            className="no-print absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-0.5 transition cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-mono select-none tracking-widest pb-0.5">
                        ...........................
                      </span>
                    )}
                  </div>

                  {/* Edit Controls */}
                  {isEditMode && (
                    <div className="flex items-center gap-0.5 no-print">
                      <button
                        type="button"
                        onClick={onOpenSignatureModal}
                        title="توقيع إلكتروني"
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                      </button>
                      {meeting.signatures.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteSignatureBlock(sig.id)}
                          title="حذف جهة التوقيع"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </footer>
    </div>
  );
};
