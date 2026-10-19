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
 * Prepares the cloned document for html2canvas/html2pdf:
 * - Strips external stylesheets that contain modern Tailwind v4 oklch colors
 * - Injects a complete, self-contained, high-fidelity print stylesheet with pure HEX/RGB colors
 * - Keeps only the #printableDocument element in the body
 * - Hides all edit controls and no-print items
 */
function sanitizeClonedDocumentForPdf(clonedDoc: Document) {
  // 1. Remove all external stylesheets (<link rel="stylesheet">) that cause oklch parse crashes
  const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
  linkTags.forEach((link) => link.remove());

  // 2. Remove any internal <style> tags containing unsupported modern color formats
  const styleTags = clonedDoc.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    if (isModernColorFormat(styleTag.textContent || '')) {
      styleTag.remove();
    }
  });

  // 3. Inject dedicated, high-fidelity styles with pure hex colors matching the exact design
  const printStyle = clonedDoc.createElement('style');
  printStyle.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Noto+Naskh+Arabic:wght@400;600;700&display=swap');

    * {
      box-sizing: border-box !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #0f172a !important;
      font-family: 'Cairo', 'Noto Naskh Arabic', sans-serif !important;
      direction: rtl !important;
      text-align: right;
    }

    .no-print, [role="dialog"], button.no-print {
      display: none !important;
    }

    #printableDocument, .a4-page {
      width: 100% !important;
      max-width: 100% !important;
      min-height: auto !important;
      margin: 0 auto !important;
      padding: 10px 14px !important;
      background: #ffffff !important;
      box-shadow: none !important;
      border: none !important;
    }

    table.table-official {
      width: 100% !important;
      border-collapse: collapse !important;
      border: 1.5px solid #000000 !important;
      margin-bottom: 14px !important;
    }

    table.table-official th,
    table.table-official td {
      border: 1px solid #000000 !important;
      padding: 6px 8px !important;
      font-size: 11px !important;
      line-height: 1.4 !important;
    }

    /* Navy divider banner */
    .bg-\\[\\#0c2a59\\],
    tr[class*="0c2a59"] {
      background-color: #0c2a59 !important;
      color: #ffffff !important;
    }

    tr[class*="0c2a59"] td,
    tr[class*="0c2a59"] div {
      color: #ffffff !important;
      font-weight: bold !important;
    }

    /* Blue table headers */
    thead[class*="85b8db"],
    th[class*="85b8db"],
    th[class*="72a6cc"],
    .bg-\\[\\#85b8db\\] {
      background-color: #85b8db !important;
      color: #1e293b !important;
      font-weight: bold !important;
    }

    /* Alternating row styling */
    .bg-\\[\\#f8fafc\\],
    tr:nth-child(even):not(.bg-\\[\\#0c2a59\\]) {
      background-color: #f8fafc !important;
    }

    .bg-white {
      background-color: #ffffff !important;
    }

    /* Text alignment helpers */
    .text-center { text-align: center !important; }
    .text-right { text-align: right !important; }
    .text-left { text-align: left !important; }

    /* Execution status badge */
    .bg-emerald-50 {
      background-color: #ecfdf5 !important;
      color: #047857 !important;
      border: 1px solid #6ee7b7 !important;
      border-radius: 4px !important;
      padding: 2px 6px !important;
      font-weight: bold !important;
      display: inline-block !important;
    }

    /* Editable cell clean display */
    .editable-cell {
      outline: none !important;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
    }
  `;
  clonedDoc.head.appendChild(printStyle);

  // 4. Keep ONLY the printable container inside cloned document body
  const targetElement = clonedDoc.getElementById('printableDocument');
  if (targetElement) {
    clonedDoc.body.innerHTML = '';
    clonedDoc.body.appendChild(targetElement);

    // Remove box shadow, borders from printable element for clean rendering
    targetElement.style.boxShadow = 'none';
    targetElement.style.border = 'none';
    targetElement.style.padding = '8px 12px';
    targetElement.style.margin = '0 auto';
    targetElement.style.width = '100%';
    targetElement.style.maxWidth = '100%';
    targetElement.classList.remove('edit-mode');

    // Remove any lingering no-print elements in the cloned subtree
    const noPrintNodes = targetElement.querySelectorAll('.no-print');
    noPrintNodes.forEach((node) => node.remove());

    // Clean inline styles of children
    const allDescendants = targetElement.querySelectorAll('*');
    allDescendants.forEach((node) => {
      if (node instanceof HTMLElement) {
        node.style.boxShadow = 'none';
        node.removeAttribute('contenteditable');

        // Fallback for modern colors on inline styles
        if (isModernColorFormat(node.style.backgroundColor)) {
          node.style.backgroundColor = '#ffffff';
        }
        if (isModernColorFormat(node.style.color)) {
          node.style.color = '#0f172a';
        }
        if (isModernColorFormat(node.style.borderColor)) {
          node.style.borderColor = '#000000';
        }
      }
    });
  }
}

/**
 * Exports a meeting to an official high-resolution PDF document.
 * If html2pdf encounters an environment limitation, gracefully falls back to native high-res print.
 */
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
    margin: [6, 8, 6, 8],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth || 800,
      onclone: (clonedDoc: Document) => {
        sanitizeClonedDocumentForPdf(clonedDoc);
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
    await (html2pdf as any)().set(opt).from(element).save();
  } catch (error) {
    console.warn('html2pdf encountered an error, falling back to browser vector PDF print:', error);
    // Graceful fallback to browser's native vector print-to-PDF
    window.print();
  }
}
