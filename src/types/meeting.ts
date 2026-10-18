export interface Attendee {
  id: string;
  name: string;
  jobTitle: string;
  status: 'حاضر' | 'لم يحضر' | 'معتذر';
}

export interface AgendaItem {
  id: string;
  itemNumber?: string;
  topic: string;
  recommendation: string;
  responsible: string;
  date: string;
  status?: 'جديد' | 'قيد الإجراء' | 'مكتمل' | 'متأخر';
}

export interface AgendaSection {
  id: string;
  title: string; // e.g., "" for primary top, "المواضيع المستمرة :", "المواضيع الجديدة :"
  items: AgendaItem[];
}

export interface SignatureBlock {
  id: string;
  role: string;
  name: string;
  sigImage: string | null;
  signedAt?: string;
  scale?: number;
}

export interface AuditRecord {
  id: string;
  action: string;
  userName: string;
  timestamp: string;
  details?: string;
  actionLabel?: string;
  user?: string;
  userEmail?: string;
  reason?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface ApprovalRecord {
  id: string;
  approverName: string;
  approverEmail: string;
  timestamp: string;
  notes?: string;
  versionNumber?: string | number;
  approvedAt?: string;
  approvedBy?: string;
  userEmail?: string;
  chairName?: string;
  rapporteurName?: string;
}

export interface MeetingMinute {
  id: string;
  title: string;
  formNumber: string;
  revisionNumber: string;
  companyName: string;
  departmentName: string;
  docTypeTitle: string;
  meetingNum: string;
  meetingYear: string;
  meetingLocation: string;
  meetingDate: string;
  meetingTime: string;
  status: 'مسودة' | 'قيد المراجعة' | 'معتمد وموقع';
  continuousNumbering: boolean;
  logoSrc: string;
  attendees: Attendee[];
  sections: AgendaSection[];
  signatures: SignatureBlock[];
  reapprovalRequired?: boolean;
  auditLog?: AuditRecord[];
  approvalHistory?: ApprovalRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  jobTitle: string;
  department: string;
  isHead?: boolean;
}

export interface MeetingTemplate {
  id: string;
  name: string;
  description: string;
  data: Partial<MeetingMinute>;
}

export type ActiveScreen = 'editor' | 'archive' | 'action_items' | 'attendees_dir' | 'templates';

export type UserRole = 'rapporteur' | 'chairman' | 'regular';

export interface SystemUser {
  id: string;
  name: string;
  jobTitle: string;
  role: UserRole;
  roleTitle: string;
  badgeColor: string;
  permissionType?: 'full' | 'limited';
}
