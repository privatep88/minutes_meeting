import { MeetingMinute, SystemUser } from '../types/meeting';

export const OFFICIAL_SAAED_LOGO = 'logo.png';

export const initialMeetingData: MeetingMinute = {
  id: 'saaed-min-2026-01',
  title: 'محضر اجتماع رقم ( 01 ) لسنة 2026',
  formNumber: '...../20- /-01/1-02:',
  revisionNumber: '02',
  companyName: 'شركة ساعد للأنظمة المرورية',
  departmentName: 'إدارة الخدمات العامة – قسم إدارة المرافق',
  docTypeTitle: 'محضر اجتماع',
  meetingNum: '01',
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
    { id: 'att-3', name: 'الاستاذ / خالد احمد الهاشمي', jobTitle: 'ضابط أول الدعم اللوجستي والاستقبال', status: 'حاضر' },
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
        { id: 'itm-1', itemNumber: '01', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
        { id: 'itm-2', itemNumber: '02', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
        { id: 'itm-3', itemNumber: '03', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
        { id: 'itm-4', itemNumber: '04', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
      ],
    },
    {
      id: 'sec-ongoing',
      title: 'المواضيع المستمرة :',
      items: [
        { id: 'itm-5', itemNumber: '01', topic: '', recommendation: '', responsible: '', date: '', status: 'قيد الإجراء' },
        { id: 'itm-6', itemNumber: '02', topic: '', recommendation: '', responsible: '', date: '', status: 'قيد الإجراء' },
        { id: 'itm-7', itemNumber: '03', topic: '', recommendation: '', responsible: '', date: '', status: 'قيد الإجراء' },
      ],
    },
    {
      id: 'sec-new',
      title: 'المواضيع الجديدة :',
      items: [
        { id: 'itm-8', itemNumber: '01', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
        { id: 'itm-9', itemNumber: '02', topic: '', recommendation: '', responsible: '', date: '', status: 'جديد' },
      ],
    },
  ],
  signatures: [
    {
      id: 'sig-1',
      role: 'مقرر الاجتماع',
      name: 'الاستاذ / خالد احمد الهاشمي',
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

export const DEFAULT_SYSTEM_USERS: SystemUser[] = [
  {
    id: 'user-rapporteur',
    name: 'الاستاذ / خالد احمد الهاشمي',
    jobTitle: 'مقرر الاجتماع - قسم إدارة المرافق',
    role: 'rapporteur',
    roleTitle: 'مقرر الاجتماع',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    id: 'user-chairman',
    name: 'الاستاذ / فيصل سويد السليماني',
    jobTitle: 'رئيس الاجتماع - رئيس قسم إدارة المرافق',
    role: 'chairman',
    roleTitle: 'رئيس الاجتماع',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'user-regular',
    name: 'مستخدم عادي (اطلاع فقط)',
    jobTitle: 'مستخدم عادي - صلاحية الأرشيف والتكليفات فقط',
    role: 'regular',
    roleTitle: 'مستخدم عادي',
    badgeColor: 'bg-slate-600 text-white',
  },
];
