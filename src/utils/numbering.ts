import { AgendaSection, MeetingMinute } from '../types/meeting';

/**
 * Re-numbers all items in the given sections sequentially.
 * - When continuous is true: numbers sequentially across all sections (01, 02, 03, 04...).
 * - When continuous is false: numbers sequentially within each individual section (01, 02... in sec 1; 01, 02... in sec 2).
 */
export function renumberSections(
  sections: AgendaSection[],
  continuous: boolean = false
): AgendaSection[] {
  let globalCounter = 1;

  return sections.map((section) => {
    let sectionCounter = 1;
    const renumberedItems = section.items.map((item) => {
      const num = continuous ? globalCounter++ : sectionCounter++;
      const itemNumber = String(num).padStart(2, '0');
      return {
        ...item,
        itemNumber,
      };
    });

    return {
      ...section,
      items: renumberedItems,
    };
  });
}

/**
 * Re-numbers a full MeetingMinute document's agenda items according to its continuousNumbering setting.
 */
export function renumberMeeting(meeting: MeetingMinute): MeetingMinute {
  return {
    ...meeting,
    sections: renumberSections(meeting.sections, meeting.continuousNumbering),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Checks whether text matches "المواضيع المستمرة :" or "المواضيع الجديدة :"
 * which are excluded from centering and must remain right-aligned.
 */
export function isExcludedFromCenter(text?: string): boolean {
  if (!text) return false;
  const clean = text.trim();
  return (
    clean === 'المواضيع المستمرة :' ||
    clean === 'المواضيع المستمرة:' ||
    clean === 'المواضيع المستمرة' ||
    clean === 'المواضيع الجديدة :' ||
    clean === 'المواضيع الجديدة:' ||
    clean === 'المواضيع الجديدة' ||
    clean.startsWith('المواضيع المستمرة') ||
    clean.startsWith('المواضيع الجديدة')
  );
}

