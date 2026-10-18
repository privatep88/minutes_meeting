import html2pdf from 'html2pdf.js';
import { MeetingMinute } from '../types/meeting';

/**
 * Detects modern CSS color formats (oklab, oklch, lab, lch, color(), hwb)
 */
function isModernColorFormat(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  return (
    str.includes('oklab') ||
    str.includes('oklch') ||
    str.includes('lab(') ||
    str.includes('lch(') ||
    str.includes('color(') ||
    str.includes('hwb(')
  );
}

/**
 * Converts any oklab, oklch, lab, lch, color() or hwb color into standard rgb/rgba using canvas
 */
function fixModernColorsInDocument(clonedDoc: Document) {
  const canvas = clonedDoc.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  const toRgb = (colorStr: string): string => {
    if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit' || colorStr === 'initial' || colorStr === 'none') {
      return colorStr;
    }
    if (!isModernColorFormat(colorStr)) {
      return colorStr;
    }
    if (!ctx) return colorStr;

    try {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = colorStr;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      if (a === 255) {
        return `rgb(${r}, ${g}, ${b})`;
      }
      return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(2)})`;
    } catch {
      return colorStr;
    }
  };

  // 1. Process all inline styles and computed styles of all elements in printable document
  const targetElem = clonedDoc.getElementById('printableDocument') || clonedDoc.body;
  if (targetElem) {
    const elements = [targetElem, ...Array.from(targetElem.querySelectorAll('*'))];

    elements.forEach((node) => {
      if (node instanceof HTMLElement) {
        const computed = window.getComputedStyle(node);

        // Remove box shadows for clean A4 printing/PDF canvas
        node.style.boxShadow = 'none';

        const colorProps: Array<{ key: keyof CSSStyleDeclaration; styleKey: string }> = [
          { key: 'backgroundColor', styleKey: 'backgroundColor' },
          { key: 'color', styleKey: 'color' },
          { key: 'borderTopColor', styleKey: 'borderTopColor' },
          { key: 'borderRightColor', styleKey: 'borderRightColor' },
          { key: 'borderBottomColor', styleKey: 'borderBottomColor' },
          { key: 'borderLeftColor', styleKey: 'borderLeftColor' },
          { key: 'outlineColor', styleKey: 'outlineColor' },
        ];

        colorProps.forEach(({ key, styleKey }) => {
          const val = computed[key] as string;
          if (val && isModernColorFormat(val)) {
            (node.style as any)[styleKey] = toRgb(val);
          }
        });
      }
    });
  }

  // 2. Also replace 'oklab(...)' and 'oklch(...)' in any <style> tags in clonedDoc
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    if (styleTag.textContent && isModernColorFormat(styleTag.textContent)) {
      styleTag.textContent = styleTag.textContent.replace(/(oklab|oklch|lab|lch|color|hwb)\([^)]+\)/gi, (match) => {
        return toRgb(match);
      });
    }
  });
}

export async function exportMeetingToPdf(
  meeting: MeetingMinute,
  elementId: string = 'printableDocument'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('عنصر المحضر المطلوب للطباعة والتصدير غير موجود');
  }

  // Sanitize filename
  const cleanNum = (meeting.meetingNum || '01').replace(/[^a-zA-Z0-9]/g, '_');
  const cleanYear = meeting.meetingYear || '2026';
  const filename = `محضر_اجتماع_رقم_${cleanNum}_لسنة_${cleanYear}.pdf`;

  const opt = {
    margin: [8, 10, 8, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      letterRendering: true,
      windowWidth: element.scrollWidth || 800,
      onclone: (clonedDoc: Document) => {
        fixModernColorsInDocument(clonedDoc);
      },
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  try {
    // Call html2pdf
    await (html2pdf as any)().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}
