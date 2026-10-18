import { SignatureBlock } from '../types/meeting';

export interface MandatorySignatureResult {
  isComplete: boolean;
  isRapporteurSigned: boolean;
  isChairmanSigned: boolean;
  missingRoles: string[];
}

/**
 * Checks if both "مقرر الاجتماع" and "رئيس الاجتماع" signatures are present.
 */
export function checkMandatorySignatures(signatures: SignatureBlock[]): MandatorySignatureResult {
  if (!signatures || signatures.length === 0) {
    return {
      isComplete: false,
      isRapporteurSigned: false,
      isChairmanSigned: false,
      missingRoles: ['مقرر الاجتماع', 'رئيس الاجتماع'],
    };
  }

  // Find rapporteur signature block (or first block)
  const rapporteurSig = signatures.find(
    (s) => s.role.includes('مقرر') || s.role.includes('أمانة') || s.role.includes('معد')
  ) || signatures[0];

  // Find chairman signature block (or second block)
  const chairmanSig = signatures.find(
    (s) => s.role.includes('رئيس') || s.role.includes('اعتماد') || s.role.includes('مدير')
  ) || signatures[1];

  const isRapporteurSigned = Boolean(rapporteurSig?.sigImage && rapporteurSig.sigImage.trim() !== '');
  const isChairmanSigned = Boolean(chairmanSig?.sigImage && chairmanSig.sigImage.trim() !== '');

  const missingRoles: string[] = [];

  if (!isRapporteurSigned) {
    missingRoles.push(rapporteurSig?.role || 'مقرر الاجتماع');
  }

  if (!isChairmanSigned) {
    missingRoles.push(chairmanSig?.role || 'رئيس الاجتماع');
  }

  const isComplete = isRapporteurSigned && isChairmanSigned;

  return {
    isComplete,
    isRapporteurSigned,
    isChairmanSigned,
    missingRoles,
  };
}
