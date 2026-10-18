import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  X,
  Trash2,
  Check,
  Upload,
  Image as ImageIcon,
  Minus,
  Plus,
  RotateCcw,
  Sliders,
  Eye,
} from 'lucide-react';
import { SignatureBlock } from '../types/meeting';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  signatures: SignatureBlock[];
  initialSigId?: string;
  onApplySignature: (sigId: string, dataUrl: string, scale?: number) => void;
  onRemoveSignature?: (sigId: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  signatures,
  initialSigId,
  onApplySignature,
  onRemoveSignature,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedSigId, setSelectedSigId] = useState<string>(
    initialSigId || signatures[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [drawnDataUrl, setDrawnDataUrl] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Selected block
  const currentBlock = signatures.find((s) => s.id === selectedSigId) || signatures[0];

  // Scale state (50% to 200%)
  const [scale, setScale] = useState<number>(100);

  // Sync initialSigId and scale when modal opens or target changes
  useEffect(() => {
    if (isOpen) {
      const targetId = initialSigId && signatures.some((s) => s.id === initialSigId)
        ? initialSigId
        : signatures[0]?.id || '';
      setSelectedSigId(targetId);

      const blk = signatures.find((s) => s.id === targetId);
      setScale(blk?.scale ?? 100);

      // Clear new drawings
      clearCanvas();
      setUploadedImage(null);
      setDrawnDataUrl(null);
    }
  }, [isOpen, initialSigId, signatures]);

  // Sync scale when selectedSigId changes within modal
  const handleSelectSig = (newId: string) => {
    setSelectedSigId(newId);
    const blk = signatures.find((s) => s.id === newId);
    setScale(blk?.scale ?? 100);
    clearCanvas();
    setUploadedImage(null);
    setDrawnDataUrl(null);
  };

  if (!isOpen) return null;

  // Drawing Canvas logic
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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
    ctx.strokeStyle = '#0c2a59';
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
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
    if (isDrawing && canvasRef.current) {
      setIsDrawing(false);
      setDrawnDataUrl(canvasRef.current.toDataURL('image/png'));
    } else {
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setDrawnDataUrl(null);
  };

  // Image Upload logic
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Scale modifications
  const adjustScale = (delta: number) => {
    setScale((prev) => Math.min(220, Math.max(50, prev + delta)));
  };

  const setPresetScale = (val: number) => {
    setScale(val);
  };

  // Active preview image source (priority: newly drawn > newly uploaded > existing signature)
  const activePreviewSrc =
    activeTab === 'draw'
      ? drawnDataUrl || (currentBlock?.sigImage && !hasDrawn ? currentBlock.sigImage : null)
      : uploadedImage || (currentBlock?.sigImage && !uploadedImage ? currentBlock.sigImage : null);

  const hasExistingSignature = Boolean(currentBlock?.sigImage);
  const canApply =
    (activeTab === 'draw' && hasDrawn) ||
    (activeTab === 'upload' && Boolean(uploadedImage)) ||
    hasExistingSignature;

  const handleApply = () => {
    if (!selectedSigId) return;

    if (activeTab === 'draw' && hasDrawn && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onApplySignature(selectedSigId, dataUrl, scale);
    } else if (activeTab === 'upload' && uploadedImage) {
      onApplySignature(selectedSigId, uploadedImage, scale);
    } else if (currentBlock?.sigImage) {
      // User only updated the scale of the existing signature
      onApplySignature(selectedSigId, currentBlock.sigImage, scale);
    }

    onClose();
  };

  const handleRemoveExisting = () => {
    if (onRemoveSignature && selectedSigId) {
      onRemoveSignature(selectedSigId);
      clearCanvas();
      setUploadedImage(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 no-print backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                لوحة التوقيع الإلكتروني وتعديل الحجم
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                رسم التوقيع أو رفع صورته مع التحكم الكامل في حجم العرض بالمحضر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsible Person Selector */}
        <div className="mb-3.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-800 mb-1">
            جهة التوقيع والاعتماد:
          </label>
          <select
            value={selectedSigId}
            onChange={(e) => handleSelectSig(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
          >
            {signatures.map((s) => (
              <option key={s.id} value={s.id}>
                {s.role} : {s.name} {s.sigImage ? '✓ (موقّع)' : '(غير موقّع)'}
              </option>
            ))}
          </select>
        </div>

        {/* Tab switcher: Draw signature vs Upload image */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3.5 border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('draw')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'draw'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>رسم التوقيع بالقلم</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>رفع صورة التوقيع</span>
          </button>
        </div>

        {/* Draw Tab: Canvas pad */}
        {activeTab === 'draw' ? (
          <div className="space-y-1.5 mb-3.5">
            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 relative overflow-hidden select-none hover:border-slate-400 transition">
              <canvas
                ref={canvasRef}
                width={420}
                height={150}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 cursor-crosshair block touch-none"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 text-xs font-medium gap-1">
                  <span>ارسم التوقيع هنا (باستخدام الماوس أو اللمس)</span>
                  <span className="text-[10px] text-slate-400">
                    يمكنك ضبط الحجم المناسب أدناه قبل الاعتماد
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-[11px] px-1">
              <span className="text-slate-500">
                {hasDrawn ? 'تم تسجيل رسم التوقيع' : 'المساحة جاهزة للرسم'}
              </span>
              {hasDrawn && (
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>مسح وإعادة الرسم</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Upload Tab: Image uploader with preview and dropzone */
          <div className="mb-3.5">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 relative overflow-hidden p-3 text-center min-h-[140px] flex flex-col items-center justify-center hover:border-blue-300 transition"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              {uploadedImage ? (
                <div className="flex flex-col items-center justify-center gap-2 w-full py-1">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs max-w-full flex items-center justify-center min-h-[70px]">
                    <img
                      src={uploadedImage}
                      alt="معاينة صورة التوقيع"
                      className="max-h-20 max-w-full object-contain mx-auto"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded-md transition cursor-pointer font-medium"
                    >
                      تغيير الصورة
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadedImage(null)}
                      className="text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-md transition cursor-pointer font-medium"
                    >
                      إلغاء التحديد
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1.5 cursor-pointer w-full py-3 text-slate-500 hover:text-blue-600 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    انقر لاختيار ملف صورة التوقيع أو اسحبها هنا
                  </div>
                  <p className="text-[10px] text-slate-400">
                    PNG, JPG, WEBP (يُفضل صورة بخلفية مفرغة وشفافة)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SIGNATURE SIZE CONTROL PANEL ----------------- */}
        <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/50 rounded-xl p-3.5 border border-blue-200/80 mb-4 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-700" />
              <span>التحكم في حجم التوقيع في المحضر الرسمي:</span>
            </span>
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs">
              <span className="font-mono font-bold text-xs text-blue-800">{scale}%</span>
            </div>
          </div>

          {/* Slider and +/- Controls */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <button
              type="button"
              onClick={() => adjustScale(-5)}
              disabled={scale <= 50}
              className="w-7 h-7 rounded-lg bg-white hover:bg-blue-100/70 border border-blue-200 flex items-center justify-center text-blue-800 disabled:opacity-30 cursor-pointer shadow-2xs transition"
              title="تصغير الحجم (-5%)"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <input
              type="range"
              min={50}
              max={220}
              step={5}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-blue-200 rounded-lg"
            />

            <button
              type="button"
              onClick={() => adjustScale(5)}
              disabled={scale >= 220}
              className="w-7 h-7 rounded-lg bg-white hover:bg-blue-100/70 border border-blue-200 flex items-center justify-center text-blue-800 disabled:opacity-30 cursor-pointer shadow-2xs transition"
              title="تكبير الحجم (+5%)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] font-sans">
              <span className="text-slate-500 text-[10px] ml-1">أحجام سريعة:</span>
              <button
                type="button"
                onClick={() => setPresetScale(75)}
                className={`px-2 py-0.5 rounded border transition cursor-pointer font-medium ${
                  scale === 75
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                75% (صغير)
              </button>
              <button
                type="button"
                onClick={() => setPresetScale(100)}
                className={`px-2 py-0.5 rounded border transition cursor-pointer font-medium ${
                  scale === 100
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                100% (الافتراضي)
              </button>
              <button
                type="button"
                onClick={() => setPresetScale(125)}
                className={`px-2 py-0.5 rounded border transition cursor-pointer font-medium ${
                  scale === 125
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                125% (متوسط)
              </button>
              <button
                type="button"
                onClick={() => setPresetScale(150)}
                className={`px-2 py-0.5 rounded border transition cursor-pointer font-medium ${
                  scale === 150
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                150% (كبير)
              </button>
            </div>

            {scale !== 100 && (
              <button
                type="button"
                onClick={() => setPresetScale(100)}
                className="text-[11px] text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>إعادة للقياسي</span>
              </button>
            )}
          </div>

          {/* Live Document Box Simulation Preview */}
          <div className="mt-3 pt-2.5 border-t border-blue-200/70">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
              <span className="flex items-center gap-1 text-slate-700">
                <Eye className="w-3 h-3 text-blue-600" />
                <span>معاينة الحجم الفعلي في خانة الاعتماد بالمحضر:</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {Math.round(38 * (scale / 100))}px × {Math.round(180 * (scale / 100))}px
              </span>
            </div>

            <div className="bg-white rounded-lg border border-slate-300 p-2 min-h-[58px] flex items-center justify-center relative overflow-hidden shadow-inner">
              {/* Dotted guideline matching official document */}
              <div className="w-full max-w-[240px] border-b border-dotted border-slate-400 flex items-center justify-center pb-0.5 min-h-[46px]">
                {activePreviewSrc ? (
                  <img
                    src={activePreviewSrc}
                    alt="معاينة الحجم"
                    style={{
                      height: `${Math.round(38 * (scale / 100))}px`,
                      maxWidth: `${Math.round(180 * (scale / 100))}px`,
                    }}
                    className="object-contain inline-block transition-all duration-100 select-none drop-shadow-xs"
                  />
                ) : (
                  <span className="text-slate-400 text-xs font-mono tracking-widest select-none">
                    ...........................
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Existing Signature Note and Actions */}
        {hasExistingSignature && !hasDrawn && !uploadedImage && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 mb-3.5 flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-medium">
              يوجد توقيع معتمد مسبقاً لهذا العضو. يمكنك حفظ الحجم الجديد مباشرة أو استبداله برسم/صورة جديدة.
            </span>
            {onRemoveSignature && (
              <button
                type="button"
                onClick={handleRemoveExisting}
                className="text-rose-600 hover:text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded hover:bg-rose-100/60 transition cursor-pointer whitespace-nowrap ml-1"
              >
                مسح التوقيع
              </button>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            إلغاء
          </button>

          <button
            type="button"
            disabled={!canApply}
            onClick={handleApply}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition flex items-center gap-1.5 ${
              canApply
                ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-blue-500/25'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>
              {hasExistingSignature && !hasDrawn && !uploadedImage
                ? 'اعتماد تعديل الحجم'
                : 'اعتماد التوقيع والحجم'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
