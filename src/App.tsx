/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { initialMeetingData, sampleTemplates, OFFICIAL_SAAED_LOGO } from './data/defaultData';
import {
  MeetingMinute,
  ActiveScreen,
  AgendaItem,
  StaffMember,
  MeetingTemplate,
} from './types/meeting';
import { TopNavbar } from './components/TopNavbar';
import { SecondaryToolbar } from './components/SecondaryToolbar';
import { OfficialDocument } from './components/OfficialDocument';
import { QuickAddModal } from './components/QuickAddModal';
import { AddSectionModal } from './components/AddSectionModal';
import { SignatureModal } from './components/SignatureModal';
import { ArchiveScreen } from './components/ArchiveScreen';
import { ActionItemsScreen } from './components/ActionItemsScreen';
import { DirectoryScreen } from './components/DirectoryScreen';
import { TemplatesScreen } from './components/TemplatesScreen';

const STORAGE_KEY_MEETINGS = 'saaed_meetings_archive_v1';
const STORAGE_KEY_ACTIVE_ID = 'saaed_meetings_active_id_v1';
const STORAGE_KEY_STAFF = 'saaed_staff_directory_v2';
const STORAGE_KEY_TEMPLATES = 'saaed_templates_registry_v2';

const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  { id: 'stf-1', name: 'الاستاذ / فيصل سويد السليماني', jobTitle: 'رئيس قسم ادارة المرافق', department: 'قسم إدارة المرافق', isHead: true },
  { id: 'stf-2', name: 'الاستاذ / معاذ حسين المصعبي', jobTitle: 'ضابط أول خدمات مرافق وأصول', department: 'قسم إدارة المرافق' },
  { id: 'stf-3', name: 'الاستاذ / خالد احمد الجفري', jobTitle: 'ضابط أول الدعم اللوجستي والاستقبال', department: 'الخدمات المساندة' },
  { id: 'stf-4', name: 'الاستاذة / ندى حسن العامري', jobTitle: 'ضابط أول سلامة وامن وحماية المرافق', department: 'السلامة والأمن' },
  { id: 'stf-5', name: 'الاستاذ / خالد خميس اليحيائي', jobTitle: 'ضابط خدمات مرافق واصول', department: 'قسم إدارة المرافق' },
  { id: 'stf-6', name: 'الاستاذ / مالك سرور راشد اليحيائي', jobTitle: 'ضابط خدمات مرافق واصول', department: 'قسم إدارة المرافق' },
  { id: 'stf-7', name: 'الاستاذ / ابراهيم عبدربه اديب', jobTitle: 'ضابط خدمات مرافق واصول', department: 'قسم إدارة المرافق' },
  { id: 'stf-8', name: 'الأستاذ / م . علي يحيى سعيد', jobTitle: 'ضابط خدمات مرافق واصول', department: 'قسم إدارة المرافق' },
];

export default function App() {
  // 1. All meetings in state with persistence & migration
  const [meetings, setMeetings] = useState<MeetingMinute[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEETINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Adopt official logo and ensure latest revision defaults
          const migrated = parsed.map((m: MeetingMinute) => {
            if (!m.logoSrc || m.logoSrc.includes('googleusercontent.com') || m.logoSrc.includes('placeholder') || m.logoSrc === '/logo.png') {
              m.logoSrc = OFFICIAL_SAAED_LOGO;
            }
            if (m.id === 'saaed-min-2026-00' || (m.meetingNum === '00' && m.revisionNumber === '01')) {
              m.meetingNum = '02';
              m.revisionNumber = '02';
              m.title = 'محضر اجتماع رقم ( 02 ) لسنة 2026';
              m.formNumber = '...../20- /-01/1-02:';
            }
            return m;
          });
          return migrated;
        }
      }
    } catch (e) {
      console.warn('Failed reading from localStorage', e);
    }
    return [initialMeetingData];
  });

  // 2. Active meeting ID
  const [activeMeetingId, setActiveMeetingId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (savedId) return savedId;
    } catch (e) {
      console.warn('Failed reading active ID', e);
    }
    return initialMeetingData.id;
  });

  // 3. Staff Directory with persistence
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STAFF);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading staff directory', e);
    }
    return INITIAL_STAFF_MEMBERS;
  });

  // 4. Templates Registry with persistence
  const [templates, setTemplates] = useState<MeetingTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading templates registry', e);
    }
    return sampleTemplates;
  });

  // Screen management & mode
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('editor');
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  // Active meeting object
  const activeMeeting =
    meetings.find((m) => m.id === activeMeetingId) || meetings[0] || initialMeetingData;

  // Persist meetings to localStorage
  const persistMeetings = (updatedMeetings: MeetingMinute[], activeId?: string) => {
    setSaveStatus('saving');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_MEETINGS, JSON.stringify(updatedMeetings));
        if (activeId) {
          localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activeId);
        }
        setSaveStatus('saved');
      } catch (err) {
        console.error('LocalStorage write failed', err);
        setSaveStatus('saved');
      }
    }, 400);
  };

  const handleUpdateActiveMeeting = (updated: MeetingMinute) => {
    const updatedMeetings = meetings.map((m) => (m.id === updated.id ? updated : m));
    setMeetings(updatedMeetings);
    persistMeetings(updatedMeetings);
  };

  // Switch meeting
  const handleSelectMeeting = (id: string) => {
    setActiveMeetingId(id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    setActiveScreen('editor');
  };

  // Create new meeting
  const handleCreateNewMeeting = () => {
    const newNum = String(meetings.length + 1).padStart(2, '0');
    const newMeeting: MeetingMinute = {
      ...initialMeetingData,
      id: `saaed-min-2026-${Date.now()}`,
      meetingNum: newNum,
      revisionNumber: '02',
      formNumber: `...../20- /-01/1-02:`,
      title: `محضر اجتماع رقم ( ${newNum} ) لسنة 2026`,
      meetingDate: new Date().toLocaleDateString('en-GB'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'sec-main',
          title: '',
          items: [
            { id: `itm-1-${Date.now()}`, topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
            { id: `itm-2-${Date.now()}`, topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
            { id: `itm-3-${Date.now()}`, topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
          ],
        },
        {
          id: 'sec-ongoing',
          title: 'المواضيع المستمرة :',
          items: [
            { id: `itm-4-${Date.now()}`, topic: '', recommendation: '', responsible: '', date: '', status: 'قيد الإجراء' },
          ],
        },
        {
          id: 'sec-new',
          title: 'المواضيع الجديدة :',
          items: [
            { id: `itm-5-${Date.now()}`, topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
          ],
        },
      ],
    };

    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    setActiveMeetingId(newMeeting.id);
    persistMeetings(updated, newMeeting.id);
    setActiveScreen('editor');
  };

  // Clone existing meeting
  const handleCloneMeeting = (id: string) => {
    const target = meetings.find((m) => m.id === id);
    if (!target) return;

    const newMeeting: MeetingMinute = {
      ...JSON.parse(JSON.stringify(target)),
      id: `saaed-min-${Date.now()}`,
      title: `${target.title} (نسخة جديدة)`,
      status: 'مسودة',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      signatures: target.signatures.map((s) => ({ ...s, sigImage: null })),
    };

    const updated = [newMeeting, ...meetings];
    setMeetings(updated);
    setActiveMeetingId(newMeeting.id);
    persistMeetings(updated, newMeeting.id);
    setActiveScreen('editor');
  };

  // Delete meeting
  const handleDeleteMeeting = (id: string) => {
    if (meetings.length <= 1) {
      // If deleting the only meeting, reset to a fresh clean minutes record
      const freshMeeting: MeetingMinute = {
        ...initialMeetingData,
        id: `saaed-min-2026-${Date.now()}`,
        meetingNum: '02',
        title: 'محضر اجتماع رقم ( 02 ) لسنة 2026',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMeetings([freshMeeting]);
      setActiveMeetingId(freshMeeting.id);
      persistMeetings([freshMeeting], freshMeeting.id);
      return;
    }

    const updated = meetings.filter((m) => m.id !== id);
    setMeetings(updated);
    const nextId = updated[0].id;
    setActiveMeetingId(nextId);
    persistMeetings(updated, nextId);
  };

  // Reset active meeting to default
  const handleResetTemplate = () => {
    if (
      window.confirm(
        'هل ترغب في استعادة النموذج الأصلي المعتمد وإعادة تعيين الحقول الافتراضية؟'
      )
    ) {
      const resetMinute = JSON.parse(JSON.stringify(initialMeetingData));
      resetMinute.id = activeMeeting.id;
      handleUpdateActiveMeeting(resetMinute);
    }
  };

  // Staff Directory Management
  const handleUpdateStaffList = (updated: StaffMember[]) => {
    setStaffList(updated);
    try {
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed saving staff directory', e);
    }
  };

  const handleResetStaffList = () => {
    if (window.confirm('هل ترغب في استعادة دليل الموظفين الافتراضي لقسم إدارة المرافق؟')) {
      handleUpdateStaffList(INITIAL_STAFF_MEMBERS);
    }
  };

  // Templates Management
  const handleUpdateTemplate = (updated: MeetingTemplate) => {
    const updatedTemplates = templates.map((t) => (t.id === updated.id ? updated : t));
    setTemplates(updatedTemplates);
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updatedTemplates));
    } catch (e) {
      console.error('Failed saving templates', e);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter((t) => t.id !== templateId);
    setTemplates(updatedTemplates);
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updatedTemplates));
    } catch (e) {
      console.error('Failed deleting template', e);
    }
  };

  const handleCreateTemplate = (newTmpl: MeetingTemplate) => {
    const updated = [newTmpl, ...templates];
    setTemplates(updated);
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed creating template', e);
    }
  };

  const handleSaveCurrentAsTemplate = () => {
    const newTmpl: MeetingTemplate = {
      id: `tmpl-custom-${Date.now()}`,
      name: `قالب مخصص: ${activeMeeting.title}`,
      description: `قالب مشتق من محضر الاجتماع رقم (${activeMeeting.meetingNum}) - ${activeMeeting.departmentName}`,
      data: {
        meetingLocation: activeMeeting.meetingLocation,
        meetingTime: activeMeeting.meetingTime,
        sections: JSON.parse(JSON.stringify(activeMeeting.sections)),
      },
    };
    handleCreateTemplate(newTmpl);
    alert('تم حفظ المحضر الحالي بنجاح كقالب معتمد في مكتبة القوالب!');
  };

  const handleResetTemplates = () => {
    if (window.confirm('هل تريد استعادة قائمة القوالب المعتمدة الافتراضية؟')) {
      setTemplates(sampleTemplates);
      try {
        localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(sampleTemplates));
      } catch (e) {
        console.error('Failed resetting templates', e);
      }
    }
  };

  // Quick Add Topic
  const handleAddTopic = (
    secId: string,
    item: { topic: string; recommendation: string; responsible: string; date: string }
  ) => {
    const newItem: AgendaItem = {
      id: `itm-${Date.now()}`,
      topic: item.topic,
      recommendation: item.recommendation,
      responsible: item.responsible,
      date: item.date,
      status: 'جديد',
    };
    const updatedSections = activeMeeting.sections.map((sec) =>
      sec.id === secId ? { ...sec, items: [...sec.items, newItem] } : sec
    );
    handleUpdateActiveMeeting({
      ...activeMeeting,
      sections: updatedSections,
    });
  };

  // Quick Add Attendee
  const handleAddAttendee = (attendee: {
    name: string;
    jobTitle: string;
    status: 'حاضر' | 'لم يحضر' | 'معتذر';
  }) => {
    const newAtt = {
      id: `att-${Date.now()}`,
      name: attendee.name,
      jobTitle: attendee.jobTitle,
      status: attendee.status,
    };
    handleUpdateActiveMeeting({
      ...activeMeeting,
      attendees: [...activeMeeting.attendees, newAtt],
    });
  };

  // Add Section
  const handleAddSection = (title: string, rowCount: number) => {
    const newSectionId = `sec-${Date.now()}`;
    const items: AgendaItem[] = [];
    for (let i = 0; i < rowCount; i++) {
      items.push({
        id: `itm-${Date.now()}-${i}`,
        topic: '',
        recommendation: '',
        responsible: '',
        date: '',
        status: 'جديد',
      });
    }
    handleUpdateActiveMeeting({
      ...activeMeeting,
      sections: [...activeMeeting.sections, { id: newSectionId, title, items }],
    });
  };

  // Apply Signature
  const handleApplySignature = (sigId: string, dataUrl: string) => {
    const updatedSignatures = activeMeeting.signatures.map((s) =>
      s.id === sigId ? { ...s, sigImage: dataUrl, signedAt: new Date().toISOString() } : s
    );
    handleUpdateActiveMeeting({
      ...activeMeeting,
      signatures: updatedSignatures,
    });
  };

  // Apply Predefined Template
  const handleApplyTemplate = (templateData: Partial<MeetingMinute>) => {
    handleUpdateActiveMeeting({
      ...activeMeeting,
      ...templateData,
      updatedAt: new Date().toISOString(),
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = '\uFEFFم,القسم,الموضوع,التوصيات,مسؤولية التنفيذ,تاريخ التنفيذ,الحالة\n';
    let rowNum = 1;
    activeMeeting.sections.forEach((sec) => {
      const secTitle = sec.title ? sec.title.replace(/:/g, '') : 'البنود الرئيسية الأولى';
      sec.items.forEach((item) => {
        const clean = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
        csvContent += `${rowNum},${clean(secTitle)},${clean(item.topic)},${clean(
          item.recommendation
        )},${clean(item.responsible)},${clean(item.date)},${clean(item.status || 'جديد')}\n`;
        rowNum++;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `محضر_اجتماع_${activeMeeting.meetingNum}_${activeMeeting.meetingYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print & PDF Export
  const handlePrint = () => {
    const originalMode = isEditMode;
    setIsEditMode(false);
    setTimeout(() => {
      window.print();
      setIsEditMode(originalMode);
    }, 200);
  };

  const handleExportPDF = () => {
    handlePrint();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP MAIN APPLICATION NAVBAR */}
      <TopNavbar
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onResetTemplate={handleResetTemplate}
        onExportCSV={handleExportCSV}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        saveStatus={saveStatus}
      />

      {/* 2. SECONDARY CONTROLS BAR (Shown in Editor Mode) */}
      {activeScreen === 'editor' && (
        <SecondaryToolbar
          meeting={activeMeeting}
          onUpdateMeeting={handleUpdateActiveMeeting}
          isEditMode={isEditMode}
        />
      )}

      {/* 3. MAIN WORKSPACE / VIEWS */}
      <main className="flex-1 overflow-x-auto py-4 sm:py-6">
        {activeScreen === 'editor' && (
          <OfficialDocument
            meeting={activeMeeting}
            isEditMode={isEditMode}
            onUpdateMeeting={handleUpdateActiveMeeting}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onOpenAddSection={() => setIsAddSectionOpen(true)}
            onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
          />
        )}

        {activeScreen === 'archive' && (
          <ArchiveScreen
            meetings={meetings}
            activeMeetingId={activeMeetingId}
            onSelectMeeting={handleSelectMeeting}
            onCreateNewMeeting={handleCreateNewMeeting}
            onCloneMeeting={handleCloneMeeting}
            onDeleteMeeting={handleDeleteMeeting}
            onUpdateMeeting={handleUpdateActiveMeeting}
          />
        )}

        {activeScreen === 'action_items' && (
          <ActionItemsScreen
            meeting={activeMeeting}
            onUpdateMeeting={handleUpdateActiveMeeting}
            onGoToEditor={() => setActiveScreen('editor')}
          />
        )}

        {activeScreen === 'attendees_dir' && (
          <DirectoryScreen
            meeting={activeMeeting}
            onUpdateMeeting={handleUpdateActiveMeeting}
            onGoToEditor={() => setActiveScreen('editor')}
            staffList={staffList}
            onUpdateStaffList={handleUpdateStaffList}
            onResetStaffList={handleResetStaffList}
          />
        )}

        {activeScreen === 'templates' && (
          <TemplatesScreen
            templates={templates}
            onApplyTemplate={handleApplyTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onCreateTemplate={handleCreateTemplate}
            onSaveCurrentAsTemplate={handleSaveCurrentAsTemplate}
            onResetTemplates={handleResetTemplates}
            onGoToEditor={() => setActiveScreen('editor')}
          />
        )}
      </main>

      {/* 4. MODALS */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        sections={activeMeeting.sections}
        onAddTopic={handleAddTopic}
        onAddAttendee={handleAddAttendee}
      />

      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        onAddSection={handleAddSection}
      />

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        signatures={activeMeeting.signatures}
        onApplySignature={handleApplySignature}
      />
    </div>
  );
}
