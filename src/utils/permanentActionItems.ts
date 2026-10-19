import { MeetingMinute, AgendaItem } from '../types/meeting';

export interface PermanentActionItem {
  id: string; // AgendaItem id
  meetingId: string;
  meetingNum: string;
  meetingYear?: string;
  meetingDate?: string;
  meetingTitle?: string;
  sectionId?: string;
  sectionTitle?: string;
  itemNumber?: string;
  topic: string;
  recommendation: string;
  responsible: string;
  date: string;
  status: 'مكتمل';
  completedAt: string;
  isPreservedAfterMeetingDeletion?: boolean;
}

export const STORAGE_KEY_PERMANENT_COMPLETED = 'saaed_permanent_completed_action_items_v1';

/**
 * Normalize Arabic text for reliable comparison and deduplication
 */
export function normalizeArabicText(text: string): string {
  return (text || '')
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove Arabic diacritics / tashkeel
    .replace(/[إأآا]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\.,:;؛!?\-_/\\()\[\]{}'"`~^&*+=#@$%<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Checks whether two action items refer to the same task across meetings
 */
export function areItemsEquivalent(
  a: { id?: string; topic?: string; recommendation?: string },
  b: { id?: string; topic?: string; recommendation?: string }
): boolean {
  if (a.id && b.id && a.id === b.id) return true;

  const recA = normalizeArabicText(a.recommendation || '');
  const recB = normalizeArabicText(b.recommendation || '');
  const topA = normalizeArabicText(a.topic || '');
  const topB = normalizeArabicText(b.topic || '');

  // 1. Both have matching non-empty recommendations
  if (recA && recB && recA === recB) {
    if (!topA || !topB || topA === topB || topA.includes(topB) || topB.includes(topA)) {
      return true;
    }
    if (recA.length >= 10) {
      return true;
    }
  }

  // 2. Both have matching topics and non-conflicting recommendations
  if (topA && topB && topA === topB && topA.length >= 3) {
    if (!recA || !recB || recA === recB || recA.includes(recB) || recB.includes(recA)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all permanently preserved completed action items from localStorage
 */
export function getPermanentCompletedItems(): PermanentActionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERMANENT_COMPLETED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed reading permanent completed action items:', e);
  }
  return [];
}

/**
 * Save a single completed action item permanently into localStorage
 */
export function savePermanentCompletedItem(item: PermanentActionItem): void {
  try {
    const existing = getPermanentCompletedItems();
    const idx = existing.findIndex((e) => e.id === item.id);
    let updated: PermanentActionItem[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = { ...existing[idx], ...item };
    } else {
      updated = [item, ...existing];
    }
    localStorage.setItem(STORAGE_KEY_PERMANENT_COMPLETED, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed saving permanent completed item:', e);
  }
}

/**
 * Synchronize completed items from active meetings:
 * Only stores completed items that actually exist in the currently active meetings.
 * If a meeting is deleted or an item is deleted from a meeting,
 * any completed item that no longer exists in any active meeting is removed from storage!
 */
export function syncAllCompletedFromMeetings(meetings: MeetingMinute[]): void {
  try {
    const activeCompletedItems: PermanentActionItem[] = [];
    const nowIso = new Date().toISOString();

    meetings.forEach((m) => {
      m.sections.forEach((sec) => {
        sec.items.forEach((it) => {
          const isCompleted = it.status === 'مكتمل' || it.date?.includes('تم التنفيذ');
          if (isCompleted && (it.topic?.trim() || it.recommendation?.trim())) {
            activeCompletedItems.push({
              id: it.id,
              meetingId: m.id,
              meetingNum: m.meetingNum || '01',
              meetingYear: m.meetingYear || '',
              meetingDate: m.meetingDate || '',
              meetingTitle: m.title || `محضر اجتماع رقم (${m.meetingNum || '01'})`,
              sectionId: sec.id,
              sectionTitle: sec.title ? sec.title.replace(':', '').trim() : 'البنود الرئيسية الأولى',
              itemNumber: it.itemNumber || '',
              topic: it.topic || '',
              recommendation: it.recommendation || '',
              responsible: it.responsible || '',
              date: it.date || 'تم التنفيذ',
              status: 'مكتمل',
              completedAt: nowIso,
              isPreservedAfterMeetingDeletion: false,
            });
          }
        });
      });
    });

    localStorage.setItem(
      STORAGE_KEY_PERMANENT_COMPLETED,
      JSON.stringify(activeCompletedItems)
    );
  } catch (e) {
    console.warn('Failed syncing completed items from meetings:', e);
  }
}

/**
 * Backward compatibility stub:
 * Does not preserve items when deleted, following the requirement to remove recommendations
 * when a meeting is deleted or when the item is deleted from its meeting.
 */
export function preserveCompletedItemsOnDeletion(
  _meeting: MeetingMinute,
  _deletedItems: AgendaItem[],
  _sectionTitle?: string
): void {
  // No-op: Items deleted from a meeting are removed from Task Register unless present in another meeting
}

