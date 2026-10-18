import React, { useState } from 'react';
import {
  LayoutTemplate,
  Check,
  FileCheck,
  ArrowRight,
  Plus,
  Edit3,
  Trash2,
  X,
  RotateCcw,
  BookmarkPlus,
  Search,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { MeetingMinute, MeetingTemplate } from '../types/meeting';

interface TemplatesScreenProps {
  templates: MeetingTemplate[];
  onApplyTemplate: (templateData: Partial<MeetingMinute>) => void;
  onUpdateTemplate: (template: MeetingTemplate) => void;
  onDeleteTemplate: (templateId: string) => void;
  onCreateTemplate: (template: MeetingTemplate) => void;
  onSaveCurrentAsTemplate: () => void;
  onResetTemplates: () => void;
  onGoToEditor: () => void;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({
  templates,
  onApplyTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onCreateTemplate,
  onSaveCurrentAsTemplate,
  onResetTemplates,
  onGoToEditor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Edit Modal State
  const [editingTemplate, setEditingTemplate] = useState<MeetingTemplate | null>(null);

  // Create Modal State
  const [isCreating, setIsCreating] = useState(false);
  const [newTmplName, setNewTmplName] = useState('');
  const [newTmplDesc, setNewTmplDesc] = useState('');
  const [newTmplLoc, setNewTmplLoc] = useState('Microsoft Teams Meeting');
  const [newTmplTime, setNewTmplTime] = useState('10:30 ص');

  // Delete Modal State
  const [templateToDelete, setTemplateToDelete] = useState<MeetingTemplate | null>(null);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    onUpdateTemplate(editingTemplate);
    setEditingTemplate(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTmplName.trim()) return;
    const newTmpl: MeetingTemplate = {
      id: `tmpl-${Date.now()}`,
      name: newTmplName.trim(),
      description: newTmplDesc.trim() || 'نموذج محضر اجتماع مخصص',
      data: {
        meetingLocation: newTmplLoc.trim() || 'Microsoft Teams Meeting',
        meetingTime: newTmplTime.trim() || '10:30 ص',
        sections: [
          {
            id: `sec-main-${Date.now()}`,
            title: '',
            items: [
              { id: `itm-1-${Date.now()}`, topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
              { id: `itm-2-${Date.now()}`, topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
            ],
          },
          {
            id: `sec-new-${Date.now()}`,
            title: 'المواضيع الجديدة :',
            items: [
              { id: `itm-3-${Date.now()}`, topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
            ],
          },
        ],
      },
    };
    onCreateTemplate(newTmpl);
    setIsCreating(false);
    setNewTmplName('');
    setNewTmplDesc('');
  };

  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    onDeleteTemplate(templateToDelete.id);
    setTemplateToDelete(null);
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            <span>قوالب محاضر الاجتماعات الرسمية المعتمدة</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            نماذج جاهزة ومعتمدة — إمكانية التحرير والحذف وإنشاء قوالب مخصصة جديدة
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Save current meeting as template */}
          <button
            type="button"
            onClick={onSaveCurrentAsTemplate}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>حفظ المحضر الحالي كقالب</span>
          </button>

          {/* Create new template */}
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء قالب جديد</span>
          </button>

          {/* Reset templates */}
          <button
            type="button"
            onClick={onResetTemplates}
            title="استعادة القوالب الافتراضية"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Return to editor */}
          <button
            type="button"
            onClick={onGoToEditor}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>العودة للمحضر</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Bar & View Switcher */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في القوالب المعتمدة..."
            className="w-full pr-9 pl-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-slate-500 font-semibold text-xs">
            إجمالي القوالب: {templates.length}
          </div>

          {/* Table / Cards toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>جدول رسمي</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>بطاقات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Centered Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-center text-xs md:text-sm">
            <thead className="bg-[#85b8db] text-black font-bold">
              <tr>
                <th className="py-2.5 px-2 text-center w-10">م.</th>
                <th className="py-2.5 px-4 text-center">اسم القالب الرسمي المعتمد</th>
                <th className="py-2.5 px-4 text-center">وصف القالب ومجال الاستخدام</th>
                <th className="py-2.5 px-3 text-center">المكان الافتراضي</th>
                <th className="py-2.5 px-3 text-center">التوقيت</th>
                <th className="py-2.5 px-2 text-center w-24">الأقسام</th>
                <th className="py-2.5 px-3 text-center w-40">الإجراءات والتحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTemplates.map((template, idx) => (
                <tr
                  key={template.id}
                  className={`hover:bg-blue-50/50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f8fafc]'}`}
                >
                  <td className="py-3 px-2 text-center font-mono font-bold text-slate-600 align-middle">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 text-center align-middle font-bold text-slate-900">
                    <div className="flex items-center justify-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{template.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center align-middle text-slate-600 leading-snug max-w-xs">
                    {template.description}
                  </td>
                  <td className="py-3 px-3 text-center align-middle text-slate-700">
                    {template.data.meetingLocation || 'Microsoft Teams'}
                  </td>
                  <td className="py-3 px-3 text-center align-middle font-mono text-slate-700">
                    {template.data.meetingTime || '10:30 ص'}
                  </td>
                  <td className="py-3 px-2 text-center align-middle">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                      {template.data.sections?.length || 1} تصنيف
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center align-middle">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onApplyTemplate(template.data);
                          onGoToEditor();
                        }}
                        title="تطبيق النموذج فوراً على المحضر"
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>تطبيق</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTemplate({ ...template })}
                        title="تحرير وتعديل القالب"
                        className="p-1.5 text-amber-600 hover:bg-amber-100/60 rounded-md transition cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTemplateToDelete(template)}
                        title="حذف القالب"
                        className="p-1.5 text-rose-500 hover:bg-rose-100/60 rounded-md transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Templates Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                
                {/* Edit & Delete Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingTemplate({ ...template })}
                    title="تحرير القالب"
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemplateToDelete(template)}
                    title="حذف القالب"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                {template.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 min-h-[38px]">
                {template.description}
              </p>

              <div className="space-y-1.5 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div>• الأقسام: {template.data.sections?.length || 1} تصنيفات رئيسية</div>
                <div>• المكان: {template.data.meetingLocation || 'Microsoft Teams'}</div>
                <div>• التوقيت: {template.data.meetingTime || '10:30 ص'}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onApplyTemplate(template.data);
                onGoToEditor();
              }}
              className="mt-5 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>تطبيق هذا النموذج على المحضر</span>
            </button>
          </div>
        ))}
      </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
          لا توجد قوالب مطابقة. يمكنك إنشاء قالب جديد أو استعادة القوالب الافتراضية.
        </div>
      )}

      {/* CREATE NEW TEMPLATE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>إنشاء قالب محضر جديد</span>
              </h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs md:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">اسم القالب:</label>
                <input
                  type="text"
                  required
                  value={newTmplName}
                  onChange={(e) => setNewTmplName(e.target.value)}
                  placeholder="مثال: محضر اجتماع الجرد السنوي للأصول"
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">وصف القالب واستخدامه:</label>
                <textarea
                  rows={2}
                  value={newTmplDesc}
                  onChange={(e) => setNewTmplDesc(e.target.value)}
                  placeholder="اكتب وصفاً موجزاً للهدف من هذا النموذج..."
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">المكان الافتراضي:</label>
                  <input
                    type="text"
                    value={newTmplLoc}
                    onChange={(e) => setNewTmplLoc(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">التوقيت الافتراضي:</label>
                  <input
                    type="text"
                    value={newTmplTime}
                    onChange={(e) => setNewTmplTime(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء القالب</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>تحرير بيانات القالب</span>
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs md:text-sm">
              <div>
                <label className="block font-medium text-slate-700 mb-1">اسم القالب:</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.name}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">وصف القالب:</label>
                <textarea
                  rows={2}
                  value={editingTemplate.description}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, description: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">المكان الافتراضي:</label>
                  <input
                    type="text"
                    value={editingTemplate.data.meetingLocation || ''}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        data: {
                          ...editingTemplate.data,
                          meetingLocation: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">التوقيت الافتراضي:</label>
                  <input
                    type="text"
                    value={editingTemplate.data.meetingTime || ''}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        data: {
                          ...editingTemplate.data,
                          meetingTime: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE TEMPLATE CONFIRMATION MODAL */}
      {templateToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs no-print">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                تأكيد حذف القالب
              </h3>
            </div>
            
            <p className="text-xs md:text-sm text-slate-600 mb-2 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا القالب نهائياً:
            </p>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 mb-4">
              {templateToDelete.name}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف القالب</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
