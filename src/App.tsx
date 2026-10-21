/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { initialMeetingData, sampleTemplates, OFFICIAL_SAAED_LOGO, DEFAULT_SYSTEM_USERS } from './data/defaultData';
import {
  MeetingMinute,
  ActiveScreen,
  AgendaItem,
  StaffMember,
  MeetingTemplate,
  SystemUser,
} from './types/meeting';
import { TopNavbar } from './components/TopNavbar';
import { SecondaryToolbar } from './components/SecondaryToolbar';
import { OfficialDocument } from './components/OfficialDocument';
import { QuickAddModal } from './components/QuickAddModal';
import { AddSectionModal } from './components/AddSectionModal';
import { SignatureModal } from './components/SignatureModal';
import { UsersManagementModal } from './components/UsersManagementModal';
import { ArchiveScreen } from './components/ArchiveScreen';
import { ActionItemsScreen } from './components/ActionItemsScreen';
import { DirectoryScreen } from './components/DirectoryScreen';
import { TemplatesScreen } from './components/TemplatesScreen';
import { LoginPage } from './components/login/LoginPage';
import { exportMeetingToWord } from './utils/exportWord';
import { exportMeetingToPdf } from './utils/exportPdf';
import { checkMandatorySignatures } from './utils/signatureUtils';
import { renumberSections } from './utils/numbering';
import { syncAllCompletedFromMeetings } from './utils/permanentActionItems';
import { AlertTriangle, CheckCircle2, RotateCcw, ShieldAlert } from 'lucide-react';

const STORAGE_KEY_MEETINGS = 'saaed_meetings_archive_v1';
const STORAGE_KEY_ACTIVE_ID = 'saaed_meetings_active_id_v1';
const STORAGE_KEY_STAFF = 'saaed_staff_directory_v2';
const STORAGE_KEY_TEMPLATES = 'saaed_templates_registry_v2';

const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  { id: 'stf-1', name: 'الاستاذ / فيصل سويد السليماني', jobTitle: 'رئيس قسم ادارة المرافق', department: 'قسم إدارة المرافق', isHead: true },
  { id: 'stf-2', name: 'الاستاذ / معاذ حسين المصعبي', jobTitle: 'ضابط أول خدمات مرافق وأصول', department: 'قسم إدارة المرافق' },
  { id: 'stf-3', name: 'الاستاذ / خالد احمد الهاشمي', jobTitle: 'ضابط أول الدعم اللوجستي والاستقبال', department: 'الخدمات المساندة' },
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
            // Adopt official logo, ensure latest revision defaults & migrate name
            const migrated = parsed.map((m: MeetingMinute) => {
              m.logoSrc = 'logo.png';
            if (
              m.id === 'saaed-min-2026-00' ||
              m.id === 'saaed-min-2026-02' ||
              m.meetingNum === '00' ||
              (m.meetingNum === '02' && (m.title?.includes('( 02 )') || m.id?.includes('saaed-min-2026')))
            ) {
              m.meetingNum = '01';
              m.revisionNumber = '02';
              m.title = 'محضر اجتماع رقم ( 01 ) لسنة 2026';
              m.formNumber = '...../20- /-01/1-02:';
            }
            if (Array.isArray(m.attendees)) {
              m.attendees.forEach((att) => {
                if (att.name?.includes('الجفري')) {
                  att.name = att.name.replace(/الجفري/g, 'الهاشمي');
                }
              });
            }
            if (Array.isArray(m.signatures)) {
              m.signatures.forEach((sig) => {
                if (sig.name?.includes('الجفري')) {
                  sig.name = sig.name.replace(/الجفري/g, 'الهاشمي');
                }
              });
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
          return parsed.map((s: StaffMember) => ({
            ...s,
            name: s.name?.includes('الجفري') ? s.name.replace(/الجفري/g, 'الهاشمي') : s.name,
          }));
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

  // System Users state with persistence
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('saaed_system_users_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u: SystemUser) => ({
            ...u,
            name: u.name?.includes('الجفري') ? u.name.replace(/الجفري/g, 'الهاشمي') : u.name,
          }));
        }
      }
    } catch (e) {
      console.warn('Failed reading system users', e);
    }
    return DEFAULT_SYSTEM_USERS;
  });

  const [currentUser, setCurrentUser] = useState<SystemUser>(() => {
    try {
      const savedId = localStorage.getItem('saaed_active_user_id');
      if (savedId) {
        const found = systemUsers.find((u) => u.id === savedId);
        if (found) return found;
      }
    } catch (e) {
      console.warn('Failed reading active user', e);
    }
    return systemUsers[0] || DEFAULT_SYSTEM_USERS[0];
  });

  // Authentication state (starts at Login Page; no passwords stored in browser storage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Screen management & mode
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('editor');
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isLimitedPermission = (user: SystemUser) =>
    user.role === 'regular' || user.permissionType === 'limited';

  const handleLoginSuccess = (authenticatedUser: SystemUser) => {
    setCurrentUser(authenticatedUser);
    try {
      localStorage.setItem('saaed_active_user_id', authenticatedUser.id);
    } catch {
      // ignore
    }

    if (isLimitedPermission(authenticatedUser)) {
      setIsEditMode(false);
      setActiveScreen('archive');
    } else {
      setIsEditMode(true);
      setActiveScreen('editor');
    }

    setIsAuthenticated(true);
    showToast(`مرحباً بك (${authenticatedUser.name}) — تم تسجيل الدخول بنجاح بصلاحية: ${authenticatedUser.roleTitle}`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSelectUser = (user: SystemUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('saaed_active_user_id', user.id);
    } catch {
      // ignore
    }

    if (isLimitedPermission(user)) {
      setIsEditMode(false);
      setActiveScreen('archive');
      showToast(`تم التبديل إلى المستخدِم: (${user.roleTitle}) - صلاحية اطلاع فقط على الأرشيف والتكليفات.`);
    } else {
      showToast(`تم التبديل إلى المستخدِم: (${user.roleTitle}) - تتوفر كامل صلاحيات التحرير والتعديل والحذف والإضافة.`);
    }
  };

  const handleAddSystemUser = (newUser: SystemUser) => {
    const updated = [...systemUsers, newUser];
    setSystemUsers(updated);
    try {
      localStorage.setItem('saaed_system_users_v2', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast(`تمت إضافة المستخدِم الجديد (${newUser.roleTitle}) بنجاح!`);
  };

  const handleUpdateSystemUser = (updatedUser: SystemUser) => {
    const updated = systemUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setSystemUsers(updated);
    if (currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      if (isLimitedPermission(updatedUser)) {
        setIsEditMode(false);
        setActiveScreen('archive');
      }
    }
    try {
      localStorage.setItem('saaed_system_users_v2', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast(`تم تحديث صلاحيات المستخدِم (${updatedUser.roleTitle}) بنجاح!`);
  };

  const handleDeleteSystemUser = (userId: string) => {
    const updated = systemUsers.filter((u) => u.id !== userId);
    setSystemUsers(updated);
    if (currentUser.id === userId && updated.length > 0) {
      handleSelectUser(updated[0]);
    }
    try {
      localStorage.setItem('saaed_system_users_v2', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('تم حذف المستخدِم بنجاح.');
  };

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isUsersManagementOpen, setIsUsersManagementOpen] = useState(false);
  const [signatureModalTargetId, setSignatureModalTargetId] = useState<string | undefined>(undefined);
  const [appConfirm, setAppConfirm] = useState<{
    type?: 'approval_confirm' | 'missing_signature_alert' | 'general';
    title: string;
    message: string;
    missingRoles?: string[];
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

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

  const handleUpdateActiveMeeting = (updated: MeetingMinute, forceEditMode?: boolean) => {
    const updatedMeetings = meetings.map((m) => (m.id === updated.id ? updated : m));
    setMeetings(updatedMeetings);
    persistMeetings(updatedMeetings);

    if (forceEditMode) {
      setIsEditMode(true);
    } else if (updated.status === 'معتمد وموقع' && updated.id === activeMeetingId) {
      if (isEditMode) {
        setIsEditMode(false);
        showToast('تم تحويل المحضر تلقائياً لنمط المعاينة بعد اعتماده وتوقيعه رسمياً.');
      }
    }
  };

  // Switch meeting
  const handleSelectMeeting = (id: string, forceEditMode?: boolean) => {
    setActiveMeetingId(id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    setActiveScreen('editor');

    const selected = meetings.find((m) => m.id === id);
    if (selected) {
      if (forceEditMode) {
        setIsEditMode(true);
      } else if (selected.status === 'معتمد وموقع') {
        setIsEditMode(false);
      } else {
        setIsEditMode(true);
      }
    }
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
        meetingNum: '01',
        title: 'محضر اجتماع رقم ( 01 ) لسنة 2026',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMeetings([freshMeeting]);
      setActiveMeetingId(freshMeeting.id);
      persistMeetings([freshMeeting], freshMeeting.id);
      syncAllCompletedFromMeetings([freshMeeting]);
      return;
    }

    const updated = meetings.filter((m) => m.id !== id);
    setMeetings(updated);
    const nextId = updated[0].id;
    setActiveMeetingId(nextId);
    persistMeetings(updated, nextId);
    syncAllCompletedFromMeetings(updated);
  };

  // Reset active meeting to default
  const handleResetTemplate = () => {
    setAppConfirm({
      title: 'استعادة النموذج الأصلي المعتمد',
      message:
        'هل ترغب في استعادة النموذج الأصلي المعتمد بالكامل؟ سيتم إعادة ضبط المحضر إلى بيانات النموذج القياسي الافتراضي لشركة ساعد (مع كشف الحضور المعتمد، والأقسام الثلاثة بكافة بنودها، والتواقيع الرسمية) وإلغاء أي تعديلات حالية.',
      confirmText: 'نعم، استعادة النموذج بالكامل',
      onConfirm: () => {
        const resetMinute: MeetingMinute = {
          ...JSON.parse(JSON.stringify(initialMeetingData)),
          id: activeMeeting.id,
          updatedAt: new Date().toISOString(),
        };
        handleUpdateActiveMeeting(resetMinute);
        try {
          localStorage.setItem('saaed_signature_layout_pref', 'table');
        } catch {
          // ignore
        }
        showToast('تمت استعادة النموذج الأصلي المعتمد بالكامل بنجاح!');
      },
    });
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
    setAppConfirm({
      title: 'استعادة دليل الموظفين الافتراضي',
      message: 'هل ترغب في استعادة دليل الموظفين الافتراضي لقسم إدارة المرافق؟ سيتم استرجاع قائمة الموظفين والمسميات الرسمية.',
      confirmText: 'نعم، استعادة الدليل',
      onConfirm: () => {
        handleUpdateStaffList(INITIAL_STAFF_MEMBERS);
        showToast('تمت استعادة دليل الموظفين الافتراضي بنجاح');
      },
    });
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
    showToast('تم حفظ المحضر الحالي بنجاح كقالب معتمد في مكتبة القوالب!');
  };

  const handleResetTemplates = () => {
    setAppConfirm({
      title: 'استعادة القوالب الافتراضية',
      message: 'هل تريد استعادة قائمة القوالب المعتمدة الافتراضية لقسم إدارة المرافق؟',
      confirmText: 'نعم، استعادة القوالب',
      onConfirm: () => {
        setTemplates(sampleTemplates);
        try {
          localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(sampleTemplates));
        } catch (e) {
          console.error('Failed resetting templates', e);
        }
        showToast('تمت استعادة القوالب الافتراضية بنجاح');
      },
    });
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
    const renumbered = renumberSections(updatedSections, activeMeeting.continuousNumbering);
    handleUpdateActiveMeeting({
      ...activeMeeting,
      sections: renumbered,
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
    const updatedSections = [...activeMeeting.sections, { id: newSectionId, title, items }];
    const renumbered = renumberSections(updatedSections, activeMeeting.continuousNumbering);
    handleUpdateActiveMeeting({
      ...activeMeeting,
      sections: renumbered,
    });
  };

  // Handler for status change request (e.g. from status dropdown)
  const handleRequestStatusChange = (newStatus: MeetingMinute['status']) => {
    if (newStatus === 'معتمد وموقع') {
      const { isComplete, missingRoles } = checkMandatorySignatures(activeMeeting.signatures);
      if (!isComplete) {
        setAppConfirm({
          type: 'missing_signature_alert',
          title: 'يتعذر اعتماد المحضر رسمياً',
          message:
            'لا يمكن تحويل المحضر إلى حالة (معتمد وموقع رسمياً) إلا بعد إضافة توقيع كلا من "مقرر الاجتماع" و "رئيس الاجتماع" بشكل إلزامي.',
          missingRoles,
        });
        return;
      }

      // If complete, trigger official confirmation modal!
      setAppConfirm({
        type: 'approval_confirm',
        title: 'تأكيد اعتماد وتوقيع المحضر رسمياً',
        message:
          'تم استكمال التواقيع الإلزامية لكل من (مقرر الاجتماع) و(رئيس الاجتماع). هل تؤكد الاعتماد النهائي للمحضر وقفل التعديل المباشر لتحويله لنمط المعاينة الرسمي؟',
        confirmText: 'نعم، تأكيد الاعتماد النهائي',
        cancelText: 'إلغاء',
        onConfirm: () => {
          handleUpdateActiveMeeting({
            ...activeMeeting,
            status: 'معتمد وموقع',
            updatedAt: new Date().toISOString(),
          });
          setIsEditMode(false);
          showToast('تم اعتماد المحضر وتوقيعه رسمياً بنجاح وتحويله لنمط المعاينة.');
        },
      });
    } else {
      handleUpdateActiveMeeting({
        ...activeMeeting,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Apply Signature
  const handleApplySignature = (sigId: string, dataUrl: string, scale?: number) => {
    const updatedSignatures = activeMeeting.signatures.map((s) =>
      s.id === sigId
        ? {
            ...s,
            sigImage: dataUrl,
            signedAt: new Date().toISOString(),
            ...(scale !== undefined ? { scale } : {}),
          }
        : s
    );

    const updatedMeeting: MeetingMinute = {
      ...activeMeeting,
      signatures: updatedSignatures,
      updatedAt: new Date().toISOString(),
    };

    handleUpdateActiveMeeting(updatedMeeting);

    // Check if mandatory signatures are now complete!
    const { isComplete } = checkMandatorySignatures(updatedSignatures);

    // If both required signatures exist and status is not yet 'معتمد وموقع', prompt confirmation modal
    if (isComplete && activeMeeting.status !== 'معتمد وموقع') {
      setIsSignatureModalOpen(false);
      setAppConfirm({
        type: 'approval_confirm',
        title: 'استكمال التواقيع الإلزامية - تأكيد الاعتماد',
        message:
          'تم إضافة توقيع كلا من (مقرر الاجتماع) و(رئيس الاجتماع) بنجاح! هل ترغب في اعتماد وتوقيع المحضر رسمياً الآن وتحويله لنمط المعاينة؟',
        confirmText: 'نعم، اعتماد وتوقيع المحضر رسمياً',
        cancelText: 'الاحتفاظ كقيد المراجعة',
        onConfirm: () => {
          handleUpdateActiveMeeting({
            ...updatedMeeting,
            status: 'معتمد وموقع',
          });
          setIsEditMode(false);
          showToast('تم اعتماد وتوقيع المحضر رسمياً بنجاح وتحويله إلى نمط المعاينة.');
        },
      });
    }
  };

  const handleRemoveSignature = (sigId: string) => {
    const updatedSignatures = activeMeeting.signatures.map((s) =>
      s.id === sigId ? { ...s, sigImage: null } : s
    );
    handleUpdateActiveMeeting({
      ...activeMeeting,
      signatures: updatedSignatures,
    });
  };

  const handleOpenSignatureModal = (targetSigId?: string) => {
    setSignatureModalTargetId(targetSigId);
    setIsSignatureModalOpen(true);
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

  // Export Word Document (.docx)
  const [, setIsExportingWord] = useState(false);

  const handleExportWord = async (meetingToExport?: MeetingMinute) => {
    const targetMeeting = meetingToExport || activeMeeting;
    try {
      setIsExportingWord(true);
      showToast('جاري إنشاء وتصدير محضر الاجتماع بصيغة Word (.docx)...');
      await exportMeetingToWord(targetMeeting);
      showToast('تم تصدير محضر الاجتماع بصيغة Word (.docx) بنجاح!');
    } catch (err) {
      console.error('Failed to export Word document:', err);
      showToast('حدث خطأ أثناء تصدير محضر الاجتماع بصيغة Word');
    } finally {
      setIsExportingWord(false);
    }
  };

  // Print A4 (Prints the official meeting minutes with exact formatting)
  const handlePrint = async () => {
    const originalMode = isEditMode;
    const originalScreen = activeScreen;

    if (activeScreen !== 'editor') {
      setActiveScreen('editor');
    }
    setIsEditMode(false);
    // Do not show preparing print message; clear any active toast immediately
    setToastMessage(null);

    // Wait for document to mount in preview mode
    await new Promise((resolve) => setTimeout(resolve, 300));

    const restoreState = () => {
      setIsEditMode(originalMode);
      if (originalScreen !== 'editor') {
        setActiveScreen(originalScreen);
      }
      window.removeEventListener('afterprint', restoreState);
    };

    window.addEventListener('afterprint', restoreState);

    setTimeout(() => {
      window.print();
      // Backup restore timeout if afterprint is cancelled or not fired
      setTimeout(restoreState, 2000);
    }, 150);
  };

  // Direct PDF Export with 100% exact design and Cairo font
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPDF = async () => {
    if (isExportingPdf) return;
    const originalMode = isEditMode;
    const originalScreen = activeScreen;

    try {
      setIsExportingPdf(true);
      if (activeScreen !== 'editor') {
        setActiveScreen('editor');
      }
      setIsEditMode(false);
      showToast('جاري تجهيز وتصدير محضر الاجتماع إلى ملف PDF رسمي عالي الدقة...');

      // Wait for React re-render in preview mode
      await new Promise((resolve) => setTimeout(resolve, 350));

      await exportMeetingToPdf(activeMeeting, 'printableDocument');
      showToast('تم تصدير محضر الاجتماع بصيغة PDF بنجاح بكامل التنسيقات والتصميم المعتمد!');
    } catch (err) {
      console.error('PDF Export Error:', err);
      showToast('حدث خطأ أثناء تصدير محضر الاجتماع إلى PDF');
    } finally {
      setIsExportingPdf(false);
      setIsEditMode(originalMode);
      if (originalScreen !== 'editor') {
        setActiveScreen(originalScreen);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        systemUsers={systemUsers}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. TOP MAIN APPLICATION NAVBAR */}
      <TopNavbar
        activeScreen={activeScreen}
        setActiveScreen={(scr) => {
          if (isLimitedPermission(currentUser) && scr !== 'archive' && scr !== 'action_items') {
            showToast('صلاحيات المستخدِم مقتصرة على تبويب "أرشيف المحاضر" و"سجل التكليفات" فقط.');
            return;
          }
          setActiveScreen(scr);
        }}
        isEditMode={isLimitedPermission(currentUser) ? false : isEditMode}
        setIsEditMode={(edit) => {
          if (isLimitedPermission(currentUser) && edit) {
            showToast('عفواً، التعديل المباشر مقتصر على المستخدمين ذوي الصلاحيات الكاملة.');
            return;
          }
          setIsEditMode(edit);
        }}
        meetingStatus={activeMeeting.status}
        currentUser={currentUser}
        systemUsers={systemUsers}
        onSelectUser={handleSelectUser}
        onOpenUsersManagement={() => setIsUsersManagementOpen(true)}
        onLogout={handleLogout}
        onLockedEditAttempt={() =>
          showToast('المحضر معتمد وموقع رسمياً ولا يمكن التعديل عليه إلا من خلال تبويب "أرشيف المحاضر"')
        }
        onRestrictedScreenAttempt={() =>
          showToast('صلاحيات المستخدِم مقتصرة على تبويب "أرشيف المحاضر" و"سجل التكليفات" فقط.')
        }
        onOpenQuickAdd={() => {
          if (isLimitedPermission(currentUser)) {
            showToast('إضافة البنود السريعة مقتصرة على المستخدمين ذوي الصلاحيات الكاملة.');
            return;
          }
          setIsQuickAddOpen(true);
        }}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onResetTemplate={handleResetTemplate}
        onExportWord={() => handleExportWord(activeMeeting)}
        onExportPDF={handleExportPDF}
        onPrint={handlePrint}
        saveStatus={saveStatus}
      />

      {/* 2. SECONDARY CONTROLS BAR (Shown in Editor Mode) */}
      {activeScreen === 'editor' && !isLimitedPermission(currentUser) && (
        <SecondaryToolbar
          meeting={activeMeeting}
          onUpdateMeeting={handleUpdateActiveMeeting}
          onRequestStatusChange={handleRequestStatusChange}
          isEditMode={isEditMode}
          onOpenAddSection={() => setIsAddSectionOpen(true)}
          onResetTemplate={handleResetTemplate}
          onExportWord={() => handleExportWord(activeMeeting)}
        />
      )}

      {/* 3. MAIN WORKSPACE / VIEWS */}
      <main className="flex-1 overflow-x-auto py-4 sm:py-6">
        {activeScreen === 'editor' && (
          <OfficialDocument
            meeting={activeMeeting}
            isEditMode={currentUser.role === 'regular' ? false : isEditMode}
            onUpdateMeeting={handleUpdateActiveMeeting}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onOpenAddSection={() => setIsAddSectionOpen(true)}
            onOpenSignatureModal={handleOpenSignatureModal}
          />
        )}

        {activeScreen === 'archive' && (
          <ArchiveScreen
            meetings={meetings}
            activeMeetingId={activeMeetingId}
            currentUser={currentUser}
            onSelectMeeting={(id, forceEdit) =>
              handleSelectMeeting(id, currentUser.role === 'regular' ? false : forceEdit)
            }
            onCreateNewMeeting={handleCreateNewMeeting}
            onCloneMeeting={handleCloneMeeting}
            onDeleteMeeting={handleDeleteMeeting}
            onUpdateMeeting={(updated, forceEdit) => handleUpdateActiveMeeting(updated, forceEdit)}
            onExportWord={(m) => handleExportWord(m)}
          />
        )}

        {activeScreen === 'action_items' && (
          <ActionItemsScreen
            meeting={activeMeeting}
            allMeetings={meetings}
            currentUser={currentUser}
            onUpdateMeeting={handleUpdateActiveMeeting}
            onUpdateMeetings={(updatedMeetings) => {
              setMeetings(updatedMeetings);
              persistMeetings(updatedMeetings);
            }}
            onSelectMeeting={(mId) => handleSelectMeeting(mId, true)}
            onGoToEditor={() => {
              if (currentUser.role === 'regular') {
                showToast('بصفتك مستخدم عادي، يقتصر وصولك على أرشيف المحاضر وسجل التكليفات.');
                return;
              }
              setActiveScreen('editor');
            }}
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
        initialSigId={signatureModalTargetId}
        onApplySignature={handleApplySignature}
        onRemoveSignature={handleRemoveSignature}
      />

      <UsersManagementModal
        isOpen={isUsersManagementOpen}
        onClose={() => setIsUsersManagementOpen(false)}
        systemUsers={systemUsers}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onAddUser={handleAddSystemUser}
        onUpdateUser={handleUpdateSystemUser}
        onDeleteUser={handleDeleteSystemUser}
      />

      {/* Universal App Modal (Approval Confirmation, Missing Signatures Alert, General Actions) */}
      {appConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
          <div
            className={`bg-white rounded-2xl shadow-2xl max-w-md w-full border overflow-hidden text-right p-6 animate-in fade-in zoom-in-95 duration-150 ${
              appConfirm.type === 'missing_signature_alert'
                ? 'border-amber-200'
                : appConfirm.type === 'approval_confirm'
                ? 'border-emerald-200'
                : 'border-slate-200'
            }`}
          >
            {/* Header Icon & Title */}
            <div className="flex items-center gap-3 mb-3">
              {appConfirm.type === 'missing_signature_alert' && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-600">
                  <ShieldAlert className="w-7 h-7" />
                </div>
              )}
              {appConfirm.type === 'approval_confirm' && (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              )}
              {(!appConfirm.type || appConfirm.type === 'general') && (
                <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-rose-600">
                  <RotateCcw className="w-7 h-7" />
                </div>
              )}

              <h3 className="text-base font-bold text-slate-900">
                {appConfirm.title}
              </h3>
            </div>

            {/* Message Body */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
              {appConfirm.message}
            </p>

            {/* Missing Roles List if Alert */}
            {appConfirm.missingRoles && appConfirm.missingRoles.length > 0 && (
              <div className="bg-amber-50/90 p-3 rounded-xl border border-amber-200 mb-5">
                <div className="text-xs font-bold text-amber-900 mb-1">
                  التواقيع المطلوبة الناقصة:
                </div>
                <ul className="space-y-1">
                  {appConfirm.missingRoles.map((role, idx) => (
                    <li key={idx} className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>توقيع {role} (غير مكتمل)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 mt-2">
              {appConfirm.type === 'missing_signature_alert' ? (
                <button
                  type="button"
                  onClick={() => setAppConfirm(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  حسناً، فهمت
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setAppConfirm(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    {appConfirm.cancelText || 'إلغاء'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const action = appConfirm.onConfirm;
                      setAppConfirm(null);
                      if (action) action();
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition flex items-center gap-1.5 cursor-pointer ${
                      appConfirm.type === 'approval_confirm'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-rose-600 hover:bg-rose-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{appConfirm.confirmText || 'تأكيد'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 no-print print:hidden pointer-events-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
