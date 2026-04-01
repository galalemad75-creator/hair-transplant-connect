/* ═══════════════════════════════════════════════════
   MOCK DATA — Hair Transplant Connect
   ═══════════════════════════════════════════════════ */

const COUNTRIES = {
  SA: 'السعودية', EG: 'مصر', AE: 'الإمارات', JO: 'الأردن',
  TR: 'تركيا', KW: 'الكويت', QA: 'قطر', BH: 'البحرين',
  OM: 'عُمان', LB: 'لبنان', IQ: 'العراق', MA: 'المغرب',
  DZ: 'الجزائر', other: 'أخرى'
};

const NORWOOD_DESC = {
  1: 'لا يوجد تراجع ملحوظ — خط شعر طبيعي',
  2: 'تراجع طفيف في زوايا الجبهة',
  3: 'تراجع واضح في زوايا الجبهة — بداية الصلع',
  4: 'تراجع أكبر مع بداية فراغ في القمة',
  5: 'الفصل بين منطقتي الجبهة والقمة يضيق',
  6: 'الفصل انكسر — الجبهة والقمة متصلتان',
  7: 'أشد درجات الصلع — حدوة حصان فقط'
};

const PHOTO_ANGLES = [
  { id: 'front', label: 'الأمامية المباشرة', hint: 'خط الشعر الأمامي ومنطقة M', icon: 'fa-face-viewfinder' },
  { id: 'top', label: 'القمة من الأعلى', hint: 'مساحة الصلع وكثافة Crown', icon: 'fa-arrow-down' },
  { id: 'right', label: 'الجانب الأيمن', hint: 'خط الانحسار الجانبي', icon: 'fa-arrow-right' },
  { id: 'left', label: 'الجانب الأيسر', hint: 'مقارنة التماثل', icon: 'fa-arrow-left' },
  { id: 'right45', label: 'نصف الجانب الأيمن', hint: 'الزاوية الأمامية الجانبية', icon: 'fa-angle-right' },
  { id: 'left45', label: 'نصف الجانب الأيسر', hint: 'مقارنة التماثل الكامل', icon: 'fa-angle-left' },
  { id: 'donor', label: 'المنطقة المانحة', hint: 'كثافة البصيلات في الخلف', icon: 'fa-circle-dot' }
];

const SPECIALTIES = {
  'hair-transplant': 'جراحة زراعة الشعر',
  'dermatology': 'طب الجلدية',
  'plastic-surgery': 'الجراحة التجميلية'
};

// ── Default Mock Data ──
const DEFAULT_DOCTORS = [
  { id: 'd1', name: 'د. خالد الهاشمي', specialty: 'hair-transplant', country: 'TR', city: 'إسطنبول', license: 'TR-2019-4521', experience: 12, email: 'khaled@htc.com', bio: 'استشاري زراعة شعر بتقنية FUE و DHI. أكثر من 3000 عملية ناجحة. خبرة واسعة في التعامل مع حالات Norwood المتقدمة.', rating: 4.9, ratingCount: 87, active: true, createdAt: '2025-01-15' },
  { id: 'd2', name: 'د. أحمد المصري', specialty: 'hair-transplant', country: 'EG', city: 'القاهرة', license: 'EG-2017-3342', experience: 8, email: 'ahmed@htc.com', bio: 'متخصص في زراعة الشعر بتقنية FUE. عيادة مجهزة بأحدث الأجهزة. أسعار تنافسية مع جودة عالية.', rating: 4.7, ratingCount: 52, active: true, createdAt: '2025-02-10' },
  { id: 'd3', name: 'د. سارة العتيبي', specialty: 'dermatology', country: 'AE', city: 'دبي', license: 'AE-2020-1198', experience: 6, email: 'sara@htc.com', bio: 'أخصائية جلدية وتجميل. متخصصة في علاج تساقط الشعر بالحقن والمصل PRP قبل وبعد الزراعة.', rating: 4.8, ratingCount: 34, active: true, createdAt: '2025-03-05' },
  { id: 'd4', name: 'د. عمر التراكمة', specialty: 'hair-transplant', country: 'TR', city: 'أنطاليا', license: 'TR-2015-2876', experience: 15, email: 'omar@htc.com', bio: 'رائد في تقنية DHI بتركيا. أكثر من 5000 عملية. فريق طبي متكامل مع متابعة شاملة بعد العملية.', rating: 4.95, ratingCount: 120, active: true, createdAt: '2025-01-20' },
  { id: 'd5', name: 'د. فيصل الحمد', specialty: 'plastic-surgery', country: 'SA', city: 'الرياض', license: 'SA-2018-7765', experience: 10, email: 'faisal@htc.com', bio: 'استشاري جراحة تجميلية وزراعة شعر. عيادة حديثة في شمال الرياض. تخصص في خطوط الشعر الطبيعية.', rating: 4.6, ratingCount: 28, active: true, createdAt: '2025-04-01' },
  { id: 'd6', name: 'د. ليلى حسن', specialty: 'dermatology', country: 'JO', city: 'عمان', license: 'JO-2019-4421', experience: 7, email: 'layla@htc.com', bio: 'أخصائية جلدية وشعر. علاج تساقط الشعر للنساء والرجال بتقنيات حديثة.', rating: 4.5, ratingCount: 19, active: true, createdAt: '2025-05-15' },
  { id: 'd7', name: 'د. يوسف قاسم', specialty: 'hair-transplant', country: 'TR', city: 'إسطنبول', license: 'TR-2021-5567', experience: 5, email: 'youssef@htc.com', bio: 'طبيب شاب متخصص في زراعة الشعر بتقنية FUE. أسعار مناسبة مع نتائج ممتازة.', rating: 4.3, ratingCount: 11, active: false, createdAt: '2025-06-01' },
  { id: 'd8', name: 'د. نور الدين', specialty: 'hair-transplant', country: 'AE', city: 'أبوظبي', license: 'AE-2016-3312', experience: 11, email: 'nour@htc.com', bio: 'استشاري زراعة شعر بخبرة 11 سنة. متخصص في الحالات المعقدة وحالات الإصلاح.', rating: 4.85, ratingCount: 65, active: true, createdAt: '2025-02-28' }
];

const DEFAULT_PATIENTS = [
  { id: 'p1', name: 'أحمد محمد', age: 32, gender: 'male', country: 'SA', phone: '+966 555 1234', email: 'ahmed@mail.com', norwood: 4, description: 'تساقط شعر ملحوظ منذ 3 سنوات. المنطقة الأمامية والقمة متضررتان.', active: true, createdAt: '2025-10-01' },
  { id: 'p2', name: 'محمد العتيبي', age: 28, gender: 'male', country: 'SA', phone: '+966 555 5678', email: 'mohammed@mail.com', norwood: 3, description: 'تراجع في زوايا الجبهة. أريد تحسين خط الشعر.', active: true, createdAt: '2025-10-15' },
  { id: 'p3', name: 'عمر حسن', age: 35, gender: 'male', country: 'EG', phone: '+20 100 1234', email: 'omar@mail.com', norwood: 5, description: 'صلع متقدم في الجبهة والقمة. أبحث عن حل جذري.', active: true, createdAt: '2025-11-01' },
  { id: 'p4', name: 'سارة أحمد', age: 29, gender: 'female', country: 'AE', phone: '+971 50 1234', email: 'sara.p@mail.com', norwood: 2, description: 'تساقط شعر في منطقة الفرق. أريد تكثيف الشعر.', active: true, createdAt: '2025-11-20' },
  { id: 'p5', name: 'فيصل الدوسري', age: 40, gender: 'male', country: 'QA', phone: '+974 5555 1234', email: 'faisal@mail.com', norwood: 6, description: 'صلع شديد. حاولت علاجات كثيرة بدون نتيجة. أريد زراعة شاملة.', active: true, createdAt: '2025-12-01' }
];

const DEFAULT_CASES = [
  { id: 'c1', patientId: 'p1', norwood: 4, status: 'open', description: 'أريد زراعة في المنطقة الأمامية والقمة. عدد تقريبي 4000 بصيلة.', photos: { front: true, top: true, right: true, left: true, right45: true, left45: true, donor: true }, createdAt: '2026-01-10', selectedDoctorId: null },
  { id: 'c2', patientId: 'p2', norwood: 3, status: 'open', description: 'تحسين خط الشعر الأمامي فقط. تقريباً 2500 بصيلة.', photos: { front: true, top: true, right: true, left: true, right45: false, left45: false, donor: true }, createdAt: '2026-01-15', selectedDoctorId: null },
  { id: 'c3', patientId: 'p3', norwood: 5, status: 'progress', description: 'زراعة شاملة للجبهة والقمة مع تكثيف المنطقة الوسطى.', photos: { front: true, top: true, right: true, left: true, right45: true, left45: true, donor: true }, createdAt: '2026-01-20', selectedDoctorId: 'd1' },
  { id: 'c4', patientId: 'p4', norwood: 2, status: 'open', description: 'تكثيف منطقة الفرق الأمامية. عدد قليل من البصيلات.', photos: { front: true, top: true, right: false, left: false, right45: false, left45: false, donor: true }, createdAt: '2026-02-01', selectedDoctorId: null },
  { id: 'c5', patientId: 'p5', norwood: 6, status: 'closed', description: 'زراعة شاملة 5000 بصيلة. منطقتي المانحة جيدة.', photos: { front: true, top: true, right: true, left: true, right45: true, left45: true, donor: true }, createdAt: '2025-11-01', selectedDoctorId: 'd4' }
];

const DEFAULT_OFFERS = [
  { id: 'o1', caseId: 'c1', doctorId: 'd1', price: 2500, currency: 'USD', duration: '6-8 ساعات', timeline: 'خلال أسبوعين', note: 'نستخدم تقنية DHI للحصول على كثافة عالية. تشمل الجلساتتين والمتابعة لمدة سنة.', status: 'pending', createdAt: '2026-01-11' },
  { id: 'o2', caseId: 'c1', doctorId: 'd2', price: 1800, currency: 'USD', duration: '5-7 ساعات', timeline: 'خلال 10 أيام', note: 'تقنية FUE مع麻醉 موضعي. النتيجة طبيعية 100%.', status: 'pending', createdAt: '2026-01-12' },
  { id: 'o3', caseId: 'c1', doctorId: 'd4', price: 3000, currency: 'USD', duration: '7-9 ساعات', timeline: 'خلال 3 أسابيع', note: 'زراعة بتقنية DHI مع فريق كامل. ضمان النتيجة.', status: 'pending', createdAt: '2026-01-13' },
  { id: 'o4', caseId: 'c2', doctorId: 'd5', price: 12000, currency: 'SAR', duration: '4-5 ساعات', timeline: 'خلال أسبوع', note: 'عيادة في الرياض. خط شعر طبيعي مع تصميم مخصص.', status: 'pending', createdAt: '2026-01-16' },
  { id: 'o5', caseId: 'c2', doctorId: 'd2', price: 1200, currency: 'USD', duration: '3-4 ساعات', timeline: 'أي وقت', note: 'عملية بسيطة لخط الشعر. نتيجة مضمونة.', status: 'pending', createdAt: '2026-01-17' },
  { id: 'o6', caseId: 'c3', doctorId: 'd1', price: 3500, currency: 'USD', duration: '8-10 ساعات', timeline: 'خلال شهر', note: 'حالة متقدمة تحتاج جلستين. الأولى للجبهة والثانية للقمة.', status: 'accepted', createdAt: '2026-01-21' },
  { id: 'o7', caseId: 'c3', doctorId: 'd4', price: 4200, currency: 'USD', duration: '10-12 ساعة', timeline: 'خلال 3 أسابيع', note: 'جلسة واحدة مكثفة. فريق متكامل.', status: 'rejected', createdAt: '2026-01-22' },
  { id: 'o8', caseId: 'c4', doctorId: 'd3', price: 5000, currency: 'AED', duration: '2-3 ساعات', timeline: 'متاح فوراً', note: 'علاج PRP + تكثيف بالبصيلات. مناسب لحالتك.', status: 'pending', createdAt: '2026-02-02' },
  { id: 'o9', caseId: 'c4', doctorId: 'd6', price: 400, currency: 'USD', duration: '2 ساعات', timeline: 'متاح', note: 'علاج متكامل مع متابعة.', status: 'pending', createdAt: '2026-02-03' },
  { id: 'o10', caseId: 'c5', doctorId: 'd4', price: 5000, currency: 'USD', duration: '12 ساعة', timeline: 'تم التنفيذ', note: 'زراعة شاملة 5000 بصيلة بجلسة واحدة.', status: 'accepted', createdAt: '2025-11-05' },
  { id: 'o11', caseId: 'c5', doctorId: 'd1', price: 4500, currency: 'USD', duration: '10 ساعات', timeline: 'مرفوض', note: 'جلستين على يومين.', status: 'rejected', createdAt: '2025-11-06' },
  { id: 'o12', caseId: 'c5', doctorId: 'd8', price: 4800, currency: 'USD', duration: '10-12 ساعة', timeline: 'مرفوض', note: 'فريق إماراتي متخصص.', status: 'rejected', createdAt: '2025-11-07' }
];

const DEFAULT_RATINGS = [
  { id: 'r1', caseId: 'c5', patientId: 'p5', doctorId: 'd4', stars: 5, comment: 'تجربة رائعة! د. عمر محترف جداً والنتيجة فاقت توقعاتي. أنصح به بشدة.', createdAt: '2026-02-15' },
  { id: 'r2', caseId: 'c3', patientId: 'p3', doctorId: 'd1', stars: 5, comment: 'عملية سلسة ونتائج ممتازة. الطبيب والمتابعة ممتازة.', createdAt: '2026-03-10' }
];

const DEFAULT_MESSAGES = [
  { id: 'm1', caseId: 'c3', fromId: 'p3', toId: 'd1', text: 'مرحباً د. خالد، شكراً على القبول. متى يمكنني الحجز؟', createdAt: '2026-01-25 10:00' },
  { id: 'm2', caseId: 'c3', fromId: 'd1', toId: 'p3', text: 'أهلاً بك يا عمر! يمكنك الحجز لأي وقت يناسبك. ننصح بالفترة الصباحية.', createdAt: '2026-01-25 10:30' },
  { id: 'm3', caseId: 'c3', fromId: 'p3', toId: 'd1', text: 'ممتاز. أريد الحجز الأسبوع القادم إذا أمكن.', createdAt: '2026-01-25 11:00' },
  { id: 'm4', caseId: 'c3', fromId: 'd1', toId: 'p3', text: 'تمام، سأرسل لك تفاصيل الموعد والتحضيرات المطلوبة.', createdAt: '2026-01-25 11:15' }
];

// ── Data Manager ──
class DataManager {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('htc_init')) {
      localStorage.setItem('htc_doctors', JSON.stringify(DEFAULT_DOCTORS));
      localStorage.setItem('htc_patients', JSON.stringify(DEFAULT_PATIENTS));
      localStorage.setItem('htc_cases', JSON.stringify(DEFAULT_CASES));
      localStorage.setItem('htc_offers', JSON.stringify(DEFAULT_OFFERS));
      localStorage.setItem('htc_ratings', JSON.stringify(DEFAULT_RATINGS));
      localStorage.setItem('htc_messages', JSON.stringify(DEFAULT_MESSAGES));
      localStorage.setItem('htc_init', 'true');
    }
  }

  get(key) { return JSON.parse(localStorage.getItem('htc_' + key) || '[]'); }
  set(key, val) { localStorage.setItem('htc_' + key, JSON.stringify(val)); }

  getById(key, id) { return this.get(key).find(x => x.id === id); }

  add(key, item) {
    const arr = this.get(key);
    arr.push(item);
    this.set(key, arr);
    return item;
  }

  update(key, id, data) {
    const arr = this.get(key);
    const idx = arr.findIndex(x => x.id === id);
    if (idx >= 0) { Object.assign(arr[idx], data); this.set(key, arr); }
    return arr[idx];
  }

  genId(prefix) { return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6); }
}

const DB = new DataManager();
