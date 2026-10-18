import { MeetingMinute } from '../types/meeting';

export const OFFICIAL_SAAED_LOGO =
  'data:image/png;base64,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';

export const initialMeetingData: MeetingMinute = {
  id: 'saaed-min-2026-02',
  title: 'محضر اجتماع رقم ( 02 ) لسنة 2026',
  formNumber: '...../20- /-01/1-02:',
  revisionNumber: '02',
  companyName: 'شركة ساعد للأنظمة المرورية',
  departmentName: 'إدارة الخدمات العامة – قسم إدارة المرافق',
  docTypeTitle: 'محضر اجتماع',
  meetingNum: '02',
  meetingYear: '2026',
  meetingLocation: 'Microsoft Teams Meeting',
  meetingDate: '25/03/2026',
  meetingTime: '10:30 ص',
  status: 'مسودة',
  continuousNumbering: false,
  logoSrc: OFFICIAL_SAAED_LOGO,
  attendees: [
    { id: 'att-1', name: 'الاستاذ / فيصل سويد السليماني', jobTitle: 'رئيس قسم ادارة المرافق', status: 'حاضر' },
    { id: 'att-2', name: 'الاستاذ / معاذ حسين المصعبي', jobTitle: 'ضابط أول خدمات مرافق وأصول', status: 'حاضر' },
    { id: 'att-3', name: 'الاستاذ / خالد احمد الجفري', jobTitle: 'ضابط أول الدعم اللوجستي والاستقبال', status: 'حاضر' },
    { id: 'att-4', name: 'الاستاذة / ندى حسن العامري', jobTitle: 'ضابط أول سلامة وامن وحماية المرافق', status: 'حاضر' },
    { id: 'att-5', name: 'الاستاذ / خالد خميس اليحيائي', jobTitle: 'ضابط خدمات مرافق واصول', status: 'حاضر' },
    { id: 'att-6', name: 'الاستاذ / مالك سرور راشد اليحيائي', jobTitle: 'ضابط خدمات مرافق واصول', status: 'حاضر' },
    { id: 'att-7', name: 'الاستاذ / ابراهيم عبدربه اديب', jobTitle: 'ضابط خدمات مرافق واصول (لم يحضر)', status: 'لم يحضر' },
    { id: 'att-8', name: 'الأستاذ / م . علي يحيى سعيد', jobTitle: 'ضابط خدمات مرافق واصول', status: 'حاضر' },
  ],
  sections: [
    {
      id: 'sec-main',
      title: '', // Top unnamed table section in original document
      items: [
        { id: 'itm-1', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
        { id: 'itm-2', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
        { id: 'itm-3', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
        { id: 'itm-4', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
      ],
    },
    {
      id: 'sec-ongoing',
      title: 'المواضيع المستمرة :',
      items: [
        { id: 'itm-5', topic: '', recommendation: '', responsible: '', date: '', status: 'قيد الإجراء' },
        { id: 'itm-6', topic: '', recommendation: '', responsible: '', date: '', status: 'قيد الإجراء' },
        { id: 'itm-7', topic: '', recommendation: '', responsible: '', date: '', status: 'قيد الإجراء' },
      ],
    },
    {
      id: 'sec-new',
      title: 'المواضيع الجديدة :',
      items: [
        { id: 'itm-8', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
        { id: 'itm-9', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
      ],
    },
  ],
  signatures: [
    {
      id: 'sig-1',
      role: 'مقرر الاجتماع',
      name: 'الاستاذ / خالد احمد الجفري',
      sigImage: null,
      signedAt: '',
    },
    {
      id: 'sig-2',
      role: 'رئيس الاجتماع',
      name: 'الاستاذ / فيصل سويد السليماني',
      sigImage: null,
      signedAt: '',
    },
  ],
  createdAt: '2026-03-25T10:30:00Z',
  updatedAt: '2026-03-25T11:45:00Z',
};

export const sampleTemplates: { id: string; name: string; description: string; data: Partial<MeetingMinute> }[] = [
  {
    id: 'tmpl-facilities-routine',
    name: 'محضر الاجتماع الدوري لقسم إدارة المرافق',
    description: 'النموذج القياسي المعتمد للاجتماعات الأسبوعية والدورية لقسم المرافق والخدمات العامة والأصول.',
    data: {
      meetingLocation: 'Microsoft Teams Meeting',
      meetingTime: '10:30 ص',
      sections: [
        {
          id: 'sec-main',
          title: '',
          items: [
            { id: 't-1', topic: 'متابعة خطة صيانة المباني والمنشآت المركزية', recommendation: 'اعتماد جدول الصيانة الوقائية للفصل الثاني والتنسيق مع المقاولين', responsible: 'ضابط خدمات مرافق وأصول', date: '2026-04-05', status: 'قيد الإجراء' },
            { id: 't-2', topic: 'تحديث سجل الأصول والممتلكات المنقولة', recommendation: 'استكمال الجرد الميداني في كافة الفروع ورفع التقرير النهائي', responsible: 'ضابط أول خدمات مرافق وأصول', date: '2026-04-12', status: 'جديد' },
          ],
        },
        {
          id: 'sec-ongoing',
          title: 'المواضيع المستمرة :',
          items: [
            { id: 't-3', topic: 'عقود النظافة والخدمات المساندة', recommendation: 'تقييم أداء مزود الخدمة وفق مؤشرات قياس الأداء SLAs', responsible: 'رئيس قسم إدارة المرافق', date: '2026-04-15', status: 'قيد الإجراء' },
          ],
        },
        {
          id: 'sec-new',
          title: 'المواضيع الجديدة :',
          items: [
            { id: 't-4', topic: 'ترقية منظومة بطاقات الدخول الذكية لمقر الشركة', recommendation: 'طلب عروض أسعار للترقية التقنية بالتنسيق مع تقنية المعلومات', responsible: 'ضابط أول أمن وسلامة', date: '2026-04-20', status: 'جديد' },
          ],
        },
      ],
    },
  },
  {
    id: 'tmpl-safety-security',
    name: 'محضر اجتماع لجنة السلامة والصحة المهنية',
    description: 'مخصص لاجتماعات تقييم مخاطر بيئة العمل، فحص أنظمة مكافحة الحريق، وإجراءات الإخلاء.',
    data: {
      meetingLocation: 'قاعة الاجتماعات الرئيسية - المبنى الرئيسي',
      meetingTime: '09:00 ص',
      sections: [
        {
          id: 'sec-main',
          title: 'بنود التفتيش والسلامة المهنية :',
          items: [
            { id: 's-1', topic: 'فحص أنظمة إنذار وإطفاء الحريق في المستودعات', recommendation: 'تنفيذ الفحص الدوري بالتعاون مع الدفاع المدني وتحديث الشهادات', responsible: 'ضابط أول سلامة وأمن وحماية المرافق', date: '2026-04-10', status: 'قيد الإجراء' },
            { id: 's-2', topic: 'تجهيز خطة تمرين الإخلاء الوهمي السنوي', recommendation: 'توزيع أدوار مسؤولي الطوارئ وتحديد نقاط التجمع الخارجية', responsible: 'لجنة السلامة العامة', date: '2026-04-18', status: 'جديد' },
          ],
        },
      ],
    },
  },
  {
    id: 'tmpl-urgent-action',
    name: 'محضر اجتماع طارئ للخدمات اللوجستية',
    description: 'نموذج سريع لمعالجة الأعطال الطارئة وسلاسل التوريد والخدمات اللوجستية العاجلة.',
    data: {
      meetingLocation: 'Microsoft Teams Meeting / غرفة العمليات',
      meetingTime: '12:00 م',
      sections: [
        {
          id: 'sec-main',
          title: 'القرارات والإجراءات العاجلة :',
          items: [
            { id: 'u-1', topic: 'تأمين التجهيزات الطارئة لمحطات المراقبة المرورية', recommendation: 'صرف الاحتياطي اللوجستي فوراً واستكمال أوامر الشراء المباشر', responsible: 'ضابط أول الدعم اللوجستي والاستقبال', date: '2026-03-28', status: 'جديد' },
          ],
        },
      ],
    },
  },
];
