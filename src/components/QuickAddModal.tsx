import React, { useState } from 'react';
import { PlusCircle, X, ListPlus, UserPlus } from 'lucide-react';
import { AgendaSection } from '../types/meeting';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: AgendaSection[];
  onAddTopic: (sectionId: string, item: { topic: string; recommendation: string; responsible: string; date: string }) => void;
  onAddAttendee: (attendee: { name: string; jobTitle: string; status: 'حاضر' | 'لم يحضر' | 'معتذر' }) => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  sections,
  onAddTopic,
  onAddAttendee,
}) => {
  const [addType, setAddType] = useState<'topic' | 'attendee'>('topic');
  const [targetSectionId, setTargetSectionId] = useState<string>(sections[0]?.id || '');
  
  // Topic inputs
  const [topic, setTopic] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [responsible, setResponsible] = useState('');
  const [date, setDate] = useState('');

  // Attendee inputs
  const [attName, setAttName] = useState('');
  const [attJob, setAttJob] = useState('');
  const [attStatus, setAttStatus] = useState<'حاضر' | 'لم يحضر' | 'معتذر'>('حاضر');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addType === 'topic') {
      const secId = targetSectionId || sections[0]?.id;
      if (!secId) return;
      onAddTopic(secId, { topic, recommendation, responsible, date });
      setTopic('');
      setRecommendation('');
      setResponsible('');
      setDate('');
    } else {
      if (!attName.trim()) return;
      onAddAttendee({ name: attName.trim(), jobTitle: attJob.trim() || 'ضابط خدمات مرافق وأصول', status: attStatus });
      setAttName('');
      setAttJob('');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 no-print backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-5 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <span>إضافة بند أو حاضر جديد سريعاً</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs md:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">نوع الإضافة:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAddType('topic')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition ${
                  addType === 'topic'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ListPlus className="w-4 h-4" />
                <span>بند في جدول القرارات</span>
              </button>
              <button
                type="button"
                onClick={() => setAddType('attendee')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition ${
                  addType === 'attendee'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>حاضر في قائمة الحضور</span>
              </button>
            </div>
          </div>

          {addType === 'topic' ? (
            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">القسم المستهدف:</label>
                <select
                  value={targetSectionId || sections[0]?.id}
                  onChange={(e) => setTargetSectionId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {sections.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {s.title ? s.title.replace(':', '') : `البنود الرئيسية الأولى (القسم ${idx + 1})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">الموضوع:</label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="اكتب عنوان أو تفاصيل الموضوع..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">التوصيات / القرارات:</label>
                <textarea
                  rows={2}
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  placeholder="اكتب التوصيات المعتمدة من اللجنة..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">مسؤولية التنفيذ:</label>
                  <input
                    type="text"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    placeholder="الاسم أو المنصب"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">تاريخ التنفيذ:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">اسم الحاضر:</label>
                <input
                  type="text"
                  required
                  value={attName}
                  onChange={(e) => setAttName(e.target.value)}
                  placeholder="الاستاذ / ..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">المسمى الوظيفي:</label>
                <input
                  type="text"
                  value={attJob}
                  onChange={(e) => setAttJob(e.target.value)}
                  placeholder="مثال: ضابط أول خدمات مرافق وأصول"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">حالة الحضور:</label>
                <select
                  value={attStatus}
                  onChange={(e) => setAttStatus(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="حاضر">حاضر</option>
                  <option value="لم يحضر">لم يحضر</option>
                  <option value="معتذر">معتذر رسمياً</option>
                </select>
              </div>
            </div>
          )}

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
              إضافة إلى المحضر
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
