import React, { useRef, useState, useEffect } from 'react';
import { PenTool, X, Trash2, Check } from 'lucide-react';
import { SignatureBlock } from '../types/meeting';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatures: SignatureBlock[];
  onApplySignature: (sigId: string, dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  signatures,
  onApplySignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedSigId, setSelectedSigId] = useState<string>(signatures[0]?.id || '');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (signatures.length > 0 && (!selectedSigId || !signatures.find(s => s.id === selectedSigId))) {
      setSelectedSigId(signatures[0].id);
    }
  }, [signatures, selectedSigId]);

  useEffect(() => {
    if (isOpen) {
      clearCanvas();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedSigId || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    onApplySignature(selectedSigId, dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 no-print backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600" />
            <span>لوحة التوقيع الإلكتروني</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-3">
          اختر المسؤول الذي ترغب في اعتماد توقيعه، ثم ارسم التوقيع بالقلم أو الإصبع أدناه:
        </p>

        <div className="mb-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            جهة التوقيع:
          </label>
          <select
            value={selectedSigId}
            onChange={(e) => setSelectedSigId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
          >
            {signatures.map((s) => (
              <option key={s.id} value={s.id}>
                {s.role} : {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Canvas pad */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 relative overflow-hidden mb-3 select-none">
          <canvas
            ref={canvasRef}
            width={400}
            height={160}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-40 cursor-crosshair block touch-none"
          />
          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
              ارسم التوقيع هنا (بالماوس أو الشاشة اللمسية)
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 font-medium transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>مسح التوقيع</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!hasDrawn}
              onClick={handleApply}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow transition flex items-center gap-1.5 ${
                hasDrawn
                  ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>اعتماد التوقيع</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
