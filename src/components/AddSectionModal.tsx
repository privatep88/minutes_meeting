import React, { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (title: string, rowCount: number) => void;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection,
}) => {
  const [title, setTitle] = useState('');
  const [rowCount, setRowCount] = useState(2);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const formattedTitle = title.trim().endsWith(':') || title.trim().endsWith('：') ? title.trim() : `${title.trim()} :`;
    onAddSection(formattedTitle, rowCount);
    setTitle('');
    setRowCount(2);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 no-print backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            <span>إضافة تصنيف جديد في جدول القرارات</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
          <div>
            <label className="block font-medium text-slate-700 mb-1 text-right">عنوان التصنيف الجديد:</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: المواضيع العاجلة والطارئة :"
              className="w-full border border-slate-300 rounded-lg p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 text-right"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1 text-right">عدد الصفوف المبدئية:</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rowCount}
              onChange={(e) => setRowCount(Number(e.target.value) || 1)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 text-right"
              dir="rtl"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition cursor-pointer"
            >
              إنشاء التصنيف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
