import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
  ShadingType,
  VerticalAlign,
  ImageRun,
  UnderlineType,
  ITableCellBorders,
} from 'docx';
import { MeetingMinute } from '../types/meeting';
import { OFFICIAL_SAAED_LOGO } from '../data/defaultData';
import { isExcludedFromCenter } from './numbering';

/**
 * Safely converts a base64 Data URL or fetches a relative URL into a Uint8Array for docx ImageRun.
 */
async function getImageBytes(src?: string): Promise<Uint8Array | null> {
  if (!src || typeof src !== 'string') return null;
  try {
    if (src.startsWith('data:')) {
      return dataUrlToUint8Array(src);
    }
    const response = await fetch(src);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  } catch (err) {
    console.warn('Could not fetch image bytes for Word export:', err);
    return null;
  }
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array | null {
  try {
    if (!dataUrl || typeof dataUrl !== 'string') return null;
    const base64Index = dataUrl.indexOf('base64,');
    const base64 = base64Index !== -1 ? dataUrl.substring(base64Index + 7) : dataUrl;
    const binary = atob(base64.trim());
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (err) {
    console.warn('Could not convert image data URL to Uint8Array:', err);
    return null;
  }
}

const BLACK_BORDER = { style: BorderStyle.SINGLE, size: 8, color: '000000' };
const LIGHT_BORDER = { style: BorderStyle.SINGLE, size: 4, color: '000000' };

const ALL_BLACK_BORDERS: ITableCellBorders = {
  top: BLACK_BORDER,
  bottom: BLACK_BORDER,
  left: BLACK_BORDER,
  right: BLACK_BORDER,
};

const ALL_LIGHT_BORDERS: ITableCellBorders = {
  top: LIGHT_BORDER,
  bottom: LIGHT_BORDER,
  left: LIGHT_BORDER,
  right: LIGHT_BORDER,
};

const NO_BORDERS: ITableCellBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
};

/**
 * Exports a MeetingMinute object into a fully-styled Microsoft Word (.docx) document.
 * Contains all elements of the official document matching the exact design and structure.
 */
export async function exportMeetingToWord(meeting: MeetingMinute): Promise<void> {
  const arabicFont = 'Cairo';

  // 1. Prepare Logo image
  const logoBytes = await getImageBytes(meeting.logoSrc || OFFICIAL_SAAED_LOGO);
  const logoCellParagraphs: Paragraph[] = logoBytes
    ? [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new ImageRun({
              type: 'png',
              data: logoBytes,
              transformation: { width: 140, height: 48 },
            }),
          ],
        }),
      ]
    : [
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: meeting.companyName || 'SAAED',
              bold: true,
              size: 20,
              font: arabicFont,
              rightToLeft: true,
            }),
          ],
        }),
      ];

  // Helper for RTL Arabic paragraph
  const createRtlParagraph = (
    text: string,
    options?: {
      bold?: boolean;
      size?: number; // half-points (24 = 12pt)
      color?: string;
      alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
      underline?: boolean;
      spacingBefore?: number;
      spacingAfter?: number;
    }
  ) => {
    return new Paragraph({
      bidirectional: true,
      alignment: options?.alignment || AlignmentType.RIGHT,
      spacing: {
        before: options?.spacingBefore ?? 60,
        after: options?.spacingAfter ?? 60,
      },
      children: [
        new TextRun({
          text,
          bold: options?.bold ?? false,
          size: options?.size ?? 22,
          color: options?.color,
          font: arabicFont,
          rightToLeft: true,
          underline: options?.underline ? { type: UnderlineType.SINGLE } : undefined,
        }),
      ],
    });
  };

  // Helper for Table Cells
  const createCell = (
    paragraphs: Paragraph[],
    options?: {
      widthPercent?: number;
      columnSpan?: number;
      bgColor?: string;
      borders?: ITableCellBorders;
      vAlign?: 'bottom' | 'center' | 'top';
    }
  ) => {
    return new TableCell({
      width: options?.widthPercent
        ? { size: options.widthPercent, type: WidthType.PERCENTAGE }
        : undefined,
      columnSpan: options?.columnSpan,
      borders: options?.borders || ALL_LIGHT_BORDERS,
      verticalAlign: options?.vAlign || VerticalAlign.CENTER,
      shading: options?.bgColor
        ? { fill: options.bgColor, type: ShadingType.CLEAR }
        : undefined,
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: paragraphs,
    });
  };

  // -------------------------------------------------------------
  // SECTION 1: OFFICIAL TOP HEADER TABLE (3 Columns)
  // -------------------------------------------------------------
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    visuallyRightToLeft: true,
    rows: [
      new TableRow({
        children: [
          // Cell 1 (Right in RTL): Form & Revision Number
          createCell(
            [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'رقم النموذج: ', font: arabicFont, size: 19, rightToLeft: true }),
                  new TextRun({ text: meeting.formNumber || '...../20- /-01/1-02:', bold: true, size: 19 }),
                ],
              }),
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: '000000' } },
                children: [
                  new TextRun({ text: 'رقم الإصدار: ', font: arabicFont, size: 19, rightToLeft: true }),
                  new TextRun({ text: meeting.revisionNumber || '02', bold: true, size: 19 }),
                ],
              }),
            ],
            { widthPercent: 28, borders: ALL_BLACK_BORDERS }
          ),

          // Cell 2 (Middle in RTL): Company Name & Department
          createCell(
            [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({
                    text: meeting.companyName || 'شركة ساعد للأنظمة المرورية',
                    bold: true,
                    size: 26,
                    font: arabicFont,
                    rightToLeft: true,
                  }),
                ],
              }),
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 40, after: 40 },
                border: { top: { style: BorderStyle.SINGLE, size: 4, color: '000000' } },
                children: [
                  new TextRun({
                    text: `${meeting.departmentName || 'قسم إدارة المرافق'}   |   ${meeting.docTypeTitle || 'محضر اجتماع'}`,
                    bold: true,
                    size: 20,
                    font: arabicFont,
                    rightToLeft: true,
                  }),
                ],
              }),
            ],
            { widthPercent: 47, borders: ALL_BLACK_BORDERS }
          ),

          // Cell 3 (Left in RTL): Logo
          createCell(logoCellParagraphs, {
            widthPercent: 25,
            borders: ALL_BLACK_BORDERS,
            vAlign: VerticalAlign.CENTER,
          }),
        ],
      }),
    ],
  });

  // -------------------------------------------------------------
  // SECTION 2: TITLE & DETAILS
  // -------------------------------------------------------------
  const titleParagraph = new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 180 },
    children: [
      new TextRun({
        text: `محضر اجتماع رقم ( ${meeting.meetingNum || '01'} ) لسنة ${meeting.meetingYear || '2026'}`,
        bold: true,
        size: 30, // 15pt
        font: arabicFont,
        rightToLeft: true,
        underline: { type: UnderlineType.SINGLE },
      }),
    ],
  });

  const metadataTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    visuallyRightToLeft: true,
    rows: [
      new TableRow({
        children: [
          createCell(
            [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.RIGHT,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'مكان الاجتماع :  ', bold: true, size: 21, font: arabicFont, rightToLeft: true }),
                  new TextRun({ text: meeting.meetingLocation || '—', size: 21, font: arabicFont, rightToLeft: true }),
                ],
              }),
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.RIGHT,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'تاريخ الاجتماع :  ', bold: true, size: 21, font: arabicFont, rightToLeft: true }),
                  new TextRun({ text: meeting.meetingDate || '—', size: 21, font: arabicFont, rightToLeft: true }),
                ],
              }),
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.RIGHT,
                spacing: { before: 40, after: 40 },
                children: [
                  new TextRun({ text: 'وقت الاجتماع :  ', bold: true, size: 21, font: arabicFont, rightToLeft: true }),
                  new TextRun({ text: meeting.meetingTime || '—', size: 21, font: arabicFont, rightToLeft: true }),
                ],
              }),
            ],
            {
              widthPercent: 100,
              borders: NO_BORDERS,
            }
          ),
        ],
      }),
    ],
  });

  // -------------------------------------------------------------
  // SECTION 3: ATTENDEES TABLE (الحضور)
  // -------------------------------------------------------------
  const attendeeBannerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    visuallyRightToLeft: true,
    rows: [
      new TableRow({
        children: [
          createCell(
            [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.RIGHT,
                spacing: { before: 50, after: 50 },
                children: [
                  new TextRun({
                    text: `الحضور :  (${meeting.attendees.length})`,
                    bold: true,
                    size: 24,
                    color: '000000',
                    font: arabicFont,
                    rightToLeft: true,
                  }),
                ],
              }),
            ],
            { widthPercent: 100, bgColor: '85B8DB', borders: ALL_BLACK_BORDERS }
          ),
        ],
      }),
    ],
  });

  const attendeeRows: TableRow[] = [
    // Header Row
    new TableRow({
      children: [
        createCell([createRtlParagraph('م.', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 10,
          bgColor: '85B8DB',
        }),
        createCell([createRtlParagraph('الاسم', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 45,
          bgColor: '85B8DB',
        }),
        createCell([createRtlParagraph('المسمى الوظيفي', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 45,
          bgColor: '85B8DB',
        }),
      ],
    }),
  ];

  meeting.attendees.forEach((att, idx) => {
    const isEven = idx % 2 === 0;
    attendeeRows.push(
      new TableRow({
        children: [
          createCell(
            [
              createRtlParagraph(String(idx + 1).padStart(2, '0') + '.', {
                bold: true,
                size: 20,
                alignment: AlignmentType.CENTER,
              }),
            ],
            { widthPercent: 10, bgColor: isEven ? 'FFFFFF' : 'F4F9FD' }
          ),
          createCell(
            [createRtlParagraph(att.name || '', { bold: true, size: 20, alignment: AlignmentType.CENTER })],
            { widthPercent: 45, bgColor: isEven ? 'FFFFFF' : 'F4F9FD' }
          ),
          createCell(
            [createRtlParagraph(att.jobTitle || '', { size: 20, alignment: AlignmentType.CENTER })],
            { widthPercent: 45, bgColor: isEven ? 'FFFFFF' : 'F4F9FD' }
          ),
        ],
      })
    );
  });

  const attendeeTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    visuallyRightToLeft: true,
    rows: attendeeRows,
  });

  // -------------------------------------------------------------
  // SECTION 4: AGENDA & OUTCOMES TABLE (مدخلات ونتائج الاجتماع)
  // -------------------------------------------------------------
  const decisionsBannerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    visuallyRightToLeft: true,
    rows: [
      new TableRow({
        children: [
          createCell(
            [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.CENTER,
                spacing: { before: 50, after: 50 },
                children: [
                  new TextRun({
                    text: 'مدخلات ونتائج الاجتماع مفصلة أدناه:',
                    bold: true,
                    size: 24,
                    color: '000000',
                    font: arabicFont,
                    rightToLeft: true,
                  }),
                ],
              }),
            ],
            { widthPercent: 100, bgColor: '85B8DB', borders: ALL_BLACK_BORDERS }
          ),
        ],
      }),
    ],
  });

  const decisionRows: TableRow[] = [
    // Column Headers
    new TableRow({
      children: [
        createCell([createRtlParagraph('م', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 8,
          bgColor: '85B8DB',
        }),
        createCell([createRtlParagraph('الموضوع', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 32,
          bgColor: '85B8DB',
        }),
        createCell([createRtlParagraph('التوصيات', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 36,
          bgColor: '85B8DB',
        }),
        createCell([createRtlParagraph('مسؤولية التنفيذ', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 14,
          bgColor: '85B8DB',
        }),
        createCell([createRtlParagraph('تاريخ التنفيذ', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 10,
          bgColor: '85B8DB',
        }),
      ],
    }),
  ];

  let continuousCounter = 1;

  meeting.sections.forEach((section) => {
    // Navy Divider Banner for Section
    if (section.title && section.title.trim() !== '') {
      decisionRows.push(
        new TableRow({
          children: [
            createCell(
              [
                new Paragraph({
                  bidirectional: true,
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 40, after: 40 },
                  children: [
                    new TextRun({
                      text: section.title,
                      bold: true,
                      size: 22,
                      color: 'FFFFFF',
                      font: arabicFont,
                      rightToLeft: true,
                    }),
                  ],
                }),
              ],
              {
                columnSpan: 5,
                widthPercent: 100,
                bgColor: '0C2A59',
                borders: ALL_BLACK_BORDERS,
              }
            ),
          ],
        })
      );
    }

    // Section Items
    section.items.forEach((item, itemIdx) => {
      const defaultNum = meeting.continuousNumbering
        ? String(continuousCounter++).padStart(2, '0')
        : String(itemIdx + 1).padStart(2, '0');
      const rowNumber = item.itemNumber || defaultNum;
      const isEven = itemIdx % 2 === 0;

      decisionRows.push(
        new TableRow({
          children: [
            createCell(
              [createRtlParagraph(rowNumber, { bold: true, size: 20, alignment: AlignmentType.CENTER })],
              { widthPercent: 8, bgColor: isEven ? 'FFFFFF' : 'F8FAFC' }
            ),
            createCell(
              [
                createRtlParagraph(item.topic || '', {
                  bold: true,
                  size: 20,
                  alignment: isExcludedFromCenter(item.topic) ? AlignmentType.RIGHT : AlignmentType.CENTER,
                }),
              ],
              { widthPercent: 32, bgColor: isEven ? 'FFFFFF' : 'F8FAFC' }
            ),
            createCell(
              [
                createRtlParagraph(item.recommendation || '', {
                  size: 20,
                  alignment: isExcludedFromCenter(item.recommendation) ? AlignmentType.RIGHT : AlignmentType.CENTER,
                }),
              ],
              { widthPercent: 36, bgColor: isEven ? 'FFFFFF' : 'F8FAFC' }
            ),
            createCell(
              [
                createRtlParagraph(item.responsible || '', {
                  size: 20,
                  alignment: isExcludedFromCenter(item.responsible) ? AlignmentType.RIGHT : AlignmentType.CENTER,
                }),
              ],
              { widthPercent: 14, bgColor: isEven ? 'FFFFFF' : 'F8FAFC' }
            ),
            createCell(
              [createRtlParagraph(item.date || '', { size: 19, alignment: AlignmentType.CENTER })],
              { widthPercent: 10, bgColor: isEven ? 'FFFFFF' : 'F8FAFC' }
            ),
          ],
        })
      );
    });
  });

  const decisionsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    visuallyRightToLeft: true,
    rows: decisionRows,
  });

  // -------------------------------------------------------------
  // SECTION 5: SIGNATURES & OFFICIAL APPROVAL
  // -------------------------------------------------------------
  const signatureHeading = new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text: 'منطقة الاعتماد والتواقيع الرسمية:',
        bold: true,
        size: 24,
        font: arabicFont,
        rightToLeft: true,
      }),
    ],
  });

  const signatureRows: TableRow[] = [
    // Header
    new TableRow({
      children: [
        createCell([createRtlParagraph('م.', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 8,
          bgColor: '85B8DB',
        }),
        createCell([createRtlParagraph('الصفة / الدور', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 28,
          bgColor: '85B8DB',
        }),
        createCell([createRtlParagraph('الاسم الكريم', { bold: true, size: 21, alignment: AlignmentType.CENTER })], {
          widthPercent: 34,
          bgColor: '85B8DB',
        }),
        createCell(
          [createRtlParagraph('التوقيع والاعتماد الرسمي', { bold: true, size: 21, alignment: AlignmentType.CENTER })],
          {
            widthPercent: 30,
            bgColor: '85B8DB',
          }
        ),
      ],
    }),
  ];

  meeting.signatures.forEach((sig, idx) => {
    const isEven = idx % 2 === 0;

    // Check if signature has an image
    let sigCellContent: Paragraph;
    const sigBytes = sig.sigImage ? dataUrlToUint8Array(sig.sigImage) : null;
    if (sigBytes) {
      const scalePercent = (sig.scale ?? 100) / 100;
      const targetWidth = Math.min(180, Math.max(70, Math.round(140 * scalePercent)));
      const targetHeight = Math.min(65, Math.max(25, Math.round(36 * scalePercent)));

      sigCellContent = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 30, after: 30 },
        children: [
          new ImageRun({
            type: 'png',
            data: sigBytes,
            transformation: { width: targetWidth, height: targetHeight },
          }),
        ],
      });
    } else {
      sigCellContent = new Paragraph({
        bidirectional: true,
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: '...........................',
            color: '666666',
            size: 20,
          }),
        ],
      });
    }

    signatureRows.push(
      new TableRow({
        children: [
          createCell(
            [createRtlParagraph(`${idx + 1}.`, { bold: true, size: 20, alignment: AlignmentType.CENTER })],
            { widthPercent: 8, bgColor: isEven ? 'FFFFFF' : 'F8FAFC' }
          ),
          createCell(
            [createRtlParagraph(sig.role || '', { bold: true, size: 20, alignment: AlignmentType.CENTER })],
            { widthPercent: 28, bgColor: isEven ? 'FFFFFF' : 'F8FAFC' }
          ),
          createCell(
            [createRtlParagraph(sig.name || '', { bold: true, size: 20, alignment: AlignmentType.CENTER })],
            { widthPercent: 34, bgColor: isEven ? 'FFFFFF' : 'F8FAFC' }
          ),
          createCell([sigCellContent], {
            widthPercent: 30,
            bgColor: isEven ? 'FFFFFF' : 'F8FAFC',
            vAlign: VerticalAlign.CENTER,
          }),
        ],
      })
    );
  });

  const signaturesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    visuallyRightToLeft: true,
    rows: signatureRows,
  });

  // Empty spacing paragraphs
  const spacerParagraph = (pts: number = 100) =>
    new Paragraph({ spacing: { before: pts, after: pts }, children: [] });

  // -------------------------------------------------------------
  // BUILD DOCUMENT
  // -------------------------------------------------------------
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: arabicFont,
            size: 22,
            rightToLeft: true,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 900, bottom: 900, left: 900, right: 900 },
          },
        },
        children: [
          headerTable,
          titleParagraph,
          metadataTable,
          spacerParagraph(120),
          attendeeBannerTable,
          attendeeTable,
          spacerParagraph(180),
          decisionsBannerTable,
          decisionsTable,
          spacerParagraph(160),
          signatureHeading,
          signaturesTable,
        ],
      },
    ],
  });

  // -------------------------------------------------------------
  // PACK & TRIGGER DOWNLOAD
  // -------------------------------------------------------------
  const blob = await Packer.toBlob(doc);
  const fileName = `محضر_اجتماع_${meeting.meetingNum || '01'}_${meeting.meetingYear || '2026'}.docx`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
