// Mock Data — Hair Transplant Connect
// All mock data + localStorage helpers

// Simple hash function for password storage (not cryptographic, but better than plain text)
function simpleHash(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + str.length;
}

const defaultData = {
  users: [
    // ===== PATIENTS =====
    { id:'p1', type:'patient', name:'أحمد محمد', name_en:'Ahmed Mohamed', age:35, gender:'male', country:'مصر', country_en:'Egypt', phone:'+201012345678', email:'ahmed@demo.com', password:simpleHash('123456'), active:true, createdAt:'2025-12-01' },
    { id:'p2', type:'patient', name:'خالد العتيبي', name_en:'Khaled Al-Otaibi', age:42, gender:'male', country:'السعودية', country_en:'Saudi Arabia', phone:'+966501234567', email:'khaled@demo.com', password:simpleHash('123456'), active:true, createdAt:'2025-12-05' },
    { id:'p3', type:'patient', name:'عمر حسن', name_en:'Omar Hassan', age:28, gender:'male', country:'الإمارات', country_en:'UAE', phone:'+971501234567', email:'omar@demo.com', password:simpleHash('123456'), active:true, createdAt:'2025-12-10' },
    { id:'p4', type:'patient', name:'سارة أحمد', name_en:'Sara Ahmed', age:30, gender:'female', country:'الأردن', country_en:'Jordan', phone:'+962791234567', email:'sara@demo.com', password:simpleHash('123456'), active:true, createdAt:'2025-12-15' },
    { id:'p5', type:'patient', name:'محمد التركي', name_en:'Mohammed Al-Turki', age:38, gender:'male', country:'تركيا', country_en:'Turkey', phone:'+905012345678', email:'mohammed@demo.com', password:simpleHash('123456'), active:true, createdAt:'2025-12-20' },
    // ===== DOCTORS =====
    { id:'d1', type:'doctor', name:'د. يوسف إبراهيم', name_en:'Dr. Youssef Ibrahim', specialty:'جراحة تجميل الشعر', specialty_en:'Hair Transplant Surgery', country:'مصر', country_en:'Egypt', city:'القاهرة', city_en:'Cairo', license:'EG-2018-4521', experience:12, email:'youssef@demo.com', password:simpleHash('123456'), phone:'+201234567890', clinicDesc:'عيادة متخصصة في زراعة الشعر بأحدث التقنيات FUE و DHI', clinicDesc_en:'Specialized clinic in hair transplant using latest FUE and DHI techniques', active:true, rating:4.8, ratingCount:45, createdAt:'2025-11-01' },
    { id:'d2', type:'doctor', name:'د. عمر الشمري', name_en:'Dr. Omar Al-Shammari', specialty:'جراحة تجميل الشعر', specialty_en:'Hair Transplant Surgery', country:'السعودية', country_en:'Saudi Arabia', city:'الرياض', city_en:'Riyadh', license:'SA-2016-3210', experience:15, email:'omar.d@demo.com', password:simpleHash('123456'), phone:'+966512345678', clinicDesc:'مركز متقدم لزراعة الشعر مع تقنيات الروبوت', clinicDesc_en:'Advanced hair transplant center with robot techniques', active:true, rating:4.6, ratingCount:38, createdAt:'2025-11-02' },
    { id:'d3', type:'doctor', name:'د. فاطمة القاسمي', name_en:'Dr. Fatima Al-Qassimi', specialty:'طب الجلدية', specialty_en:'Dermatology', country:'الإمارات', country_en:'UAE', city:'دبي', city_en:'Dubai', license:'AE-2019-7845', experience:8, email:'fatima@demo.com', password:simpleHash('123456'), phone:'+971523456789', clinicDesc:'عيادة جلدية وشعر متخصصة في علاج تساقط الشعر', clinicDesc_en:'Dermatology and hair clinic specializing in hair loss', active:true, rating:4.9, ratingCount:52, createdAt:'2025-11-03' },
    { id:'d4', type:'doctor', name:'د. علي حسن', name_en:'Dr. Ali Hassan', specialty:'جراحة تجميل الشعر', specialty_en:'Hair Transplant Surgery', country:'الأردن', country_en:'Jordan', city:'عمان', city_en:'Amman', license:'JO-2017-1567', experience:10, email:'ali@demo.com', password:simpleHash('123456'), phone:'+962781234567', clinicDesc:'مركز رائد في زراعة الشعر بتقنية FUE', clinicDesc_en:'Leading center in FUE hair transplant', active:true, rating:4.5, ratingCount:29, createdAt:'2025-11-04' },
    { id:'d5', type:'doctor', name:'د. محمد أوز', name_en:'Dr. Mehmet Oz', specialty:'جراحة تجميل الشعر', specialty_en:'Hair Transplant Surgery', country:'تركيا', country_en:'Turkey', city:'إسطنبول', city_en:'Istanbul', license:'TR-2015-9823', experience:18, email:'mehmet@demo.com', password:simpleHash('123456'), phone:'+905323456789', clinicDesc:'أشهر عيادة زراعة شعر في إسطنبول', clinicDesc_en:'Most famous hair transplant clinic in Istanbul', active:true, rating:4.7, ratingCount:89, createdAt:'2025-11-05' },
    { id:'d6', type:'doctor', name:'د. نور الدين', name_en:'Dr. Noureddine', specialty:'جراحة التجميل', specialty_en:'Cosmetic Surgery', country:'مصر', country_en:'Egypt', city:'الإسكندرية', city_en:'Alexandria', license:'EG-2020-3344', experience:6, email:'nour@demo.com', password:simpleHash('123456'), phone:'+201134567890', clinicDesc:'عيادة حديثة لزراعة الشعر مع متابعة شاملة', clinicDesc_en:'Modern hair transplant clinic with comprehensive follow-up', active:true, rating:4.3, ratingCount:15, createdAt:'2025-11-06' },
    { id:'d7', type:'doctor', name:'د. سامي الكويتي', name_en:'Dr. Sami Al-Kuwaiti', specialty:'جراحة تجميل الشعر', specialty_en:'Hair Transplant Surgery', country:'السعودية', country_en:'Saudi Arabia', city:'جدة', city_en:'Jeddah', license:'SA-2014-5567', experience:20, email:'sami@demo.com', password:simpleHash('123456'), phone:'+966533456789', clinicDesc:'خبير زراعة شعر بخبرة 20 عاماً', clinicDesc_en:'Hair transplant expert with 20 years experience', active:true, rating:4.9, ratingCount:67, createdAt:'2025-11-07' },
    { id:'d8', type:'doctor', name:'د. ليلى الأردنية', name_en:'Dr. Layla Al-Urduni', specialty:'طب الجلدية', specialty_en:'Dermatology', country:'الأردن', country_en:'Jordan', city:'إربد', city_en:'Irbid', license:'JO-2021-8890', experience:5, email:'layla@demo.com', password:simpleHash('123456'), phone:'+962771234567', clinicDesc:'متخصصة في علاج تساقط الشعر بالحقن المجهري', clinicDesc_en:'Specialist in micro-injection hair loss treatment', active:true, rating:4.4, ratingCount:22, createdAt:'2025-11-08' }
  ],
  cases: [
    { id:'c1', patientId:'p1', norwood:4, country:'مصر', country_en:'Egypt', status:'open', photos:[true,true,true,true,true,true,true], description:'تساقط شعر متوسط في منطقة الأمام والتاج', description_en:'Moderate hair loss in frontal and crown area', createdAt:'2025-12-15' },
    { id:'c2', patientId:'p2', norwood:5, country:'السعودية', country_en:'Saudi Arabia', status:'open', photos:[true,true,true,true,true,true,true], description:'تساقط شعر متقدم في الجزء الأمامي', description_en:'Advanced hair loss in the frontal part', createdAt:'2025-12-18' },
    { id:'c3', patientId:'p3', norwood:3, country:'الإمارات', country_en:'UAE', status:'in_progress', photos:[true,true,true,true,true,true,true], description:'بداية تساقط الشعر في خط الشعر', description_en:'Early hair loss at the hairline', createdAt:'2025-12-20', selectedDoctorId:'d3' },
    { id:'c4', patientId:'p4', norwood:2, country:'الأردن', country_en:'Jordan', status:'open', photos:[true,true,true,true,true,false,false], description:'تساقط طفيف في منطقة الفروة', description_en:'Minor hair thinning in the scalp area', createdAt:'2026-01-05' },
    { id:'c5', patientId:'p5', norwood:6, country:'تركيا', country_en:'Turkey', status:'closed', photos:[true,true,true,true,true,true,true], description:'تساقط شعر شامل في الأمام والتاج', description_en:'Extensive hair loss in frontal and crown area', createdAt:'2025-11-25', selectedDoctorId:'d5', rating:{stars:5, comment:'عمل ممتاز ونتائج رائعة', comment_en:'Excellent work and amazing results', date:'2026-01-10'} }
  ],
  offers: [
    { id:'o1', caseId:'c1', doctorId:'d1', price:25000, currency:'ج.م', currency_en:'EGP', procedureTime:'6 ساعات', procedureTime_en:'6 hours', arrivalTime:'خلال أسبوع', arrivalTime_en:'Within a week', note:'ننصح بتقنية FUE لحالتك', note_en:'We recommend FUE technique for your case', status:'pending', createdAt:'2025-12-16' },
    { id:'o2', caseId:'c1', doctorId:'d6', price:20000, currency:'ج.م', currency_en:'EGP', procedureTime:'5 ساعات', procedureTime_en:'5 hours', arrivalTime:'خلال 3 أيام', arrivalTime_en:'Within 3 days', note:'عرض خاص مع متابعة مجانية 6 أشهر', note_en:'Special offer with 6 months free follow-up', status:'pending', createdAt:'2025-12-17' },
    { id:'o3', caseId:'c2', doctorId:'d2', price:15000, currency:'ر.س', currency_en:'SAR', procedureTime:'7 ساعات', procedureTime_en:'7 hours', arrivalTime:'خلال أسبوعين', arrivalTime_en:'Within two weeks', note:'حالة تحتاج جلستين', note_en:'Case needs two sessions', status:'pending', createdAt:'2025-12-19' },
    { id:'o4', caseId:'c2', doctorId:'d7', price:18000, currency:'ر.س', currency_en:'SAR', procedureTime:'8 ساعات', procedureTime_en:'8 hours', arrivalTime:'خلال أسبوع', arrivalTime_en:'Within a week', note:'تقنية DHI مع ضمان 95%', note_en:'DHI technique with 95% guarantee', status:'pending', createdAt:'2025-12-20' },
    { id:'o5', caseId:'c3', doctorId:'d3', price:8000, currency:'د.إ', currency_en:'AED', procedureTime:'4 ساعات', procedureTime_en:'4 hours', arrivalTime:'متاح حالياً', arrivalTime_en:'Available now', note:'علاج بالبلازما أولاً ثم زراعة', note_en:'Plasma treatment first then transplant', status:'accepted', createdAt:'2025-12-21' },
    { id:'o6', caseId:'c3', doctorId:'d4', price:6500, currency:'د.إ', currency_en:'AED', procedureTime:'5 ساعات', procedureTime_en:'5 hours', arrivalTime:'خلال 5 أيام', arrivalTime_en:'Within 5 days', note:'سعر شامل مع إقامة فندقية', note_en:'All-inclusive price with hotel stay', status:'rejected', createdAt:'2025-12-22' },
    { id:'o7', caseId:'c4', doctorId:'d4', price:3000, currency:'د.أ', currency_en:'JOD', procedureTime:'3 ساعات', procedureTime_en:'3 hours', arrivalTime:'متاح حالياً', arrivalTime_en:'Available now', note:'حالة بسيطة تحتاج جلسة واحدة', note_en:'Simple case needs only one session', status:'pending', createdAt:'2026-01-06' },
    { id:'o8', caseId:'c4', doctorId:'d8', price:2800, currency:'د.أ', currency_en:'JOD', procedureTime:'3 ساعات', procedureTime_en:'3 hours', arrivalTime:'خلال 4 أيام', arrivalTime_en:'Within 4 days', note:'علاج بالحقن المجهري مع زراعة', note_en:'Micro-injection treatment with transplant', status:'pending', createdAt:'2026-01-07' },
    { id:'o9', caseId:'c5', doctorId:'d5', price:35000, currency:'ل.ت', currency_en:'TRY', procedureTime:'8 ساعات', procedureTime_en:'8 hours', arrivalTime:'متاح حالياً', arrivalTime_en:'Available now', note:'حالة معقدة نضمن نتيجة ممتازة', note_en:'Complex case, we guarantee excellent results', status:'accepted', createdAt:'2025-11-26' },
    { id:'o10', caseId:'c1', doctorId:'d7', price:30000, currency:'ج.م', currency_en:'EGP', procedureTime:'7 ساعات', procedureTime_en:'7 hours', arrivalTime:'خلال 10 أيام', arrivalTime_en:'Within 10 days', note:'تقنية حديثة مع تغذية البصيلات', note_en:'Latest technique with follicle nutrition', status:'pending', createdAt:'2025-12-18' },
    { id:'o11', caseId:'c2', doctorId:'d1', price:22000, currency:'ر.س', currency_en:'SAR', procedureTime:'6 ساعات', procedureTime_en:'6 hours', arrivalTime:'خلال أسبوع', arrivalTime_en:'Within a week', note:'سأكون في الرياض الشهر القادم', note_en:'I will be in Riyadh next month', status:'pending', createdAt:'2025-12-21' },
    { id:'o12', caseId:'c4', doctorId:'d2', price:4000, currency:'د.أ', currency_en:'JOD', procedureTime:'4 ساعات', procedureTime_en:'4 hours', arrivalTime:'خلال أسبوعين', arrivalTime_en:'Within two weeks', note:'أحدث تقنية مع كفالة النتيجة', note_en:'Latest technique with result warranty', status:'pending', createdAt:'2026-01-08' }
  ],
  messages: [
    { id:'m1', fromId:'p3', toId:'d3', caseId:'c3', text:'مرحباً دكتورة، متى يمكنني الحجز؟', text_en:'Hello Doctor, when can I book?', createdAt:'2025-12-22T10:00:00' },
    { id:'m2', fromId:'d3', toId:'p3', caseId:'c3', text:'أهلاً! يمكنك الحجز من الآن.', text_en:'Hello! You can book now.', createdAt:'2025-12-22T10:05:00' },
    { id:'m3', fromId:'p3', toId:'d3', caseId:'c3', text:'ما هي الأشياء التي يجب تجهيزها؟', text_en:'What should I prepare?', createdAt:'2025-12-22T10:10:00' },
    { id:'m4', fromId:'d3', toId:'p3', caseId:'c3', text:'توقف عن التدخين لمدة أسبوعين وتجنب الأسبرين.', text_en:'Stop smoking for two weeks and avoid aspirin.', createdAt:'2025-12-22T10:15:00' },
    { id:'m5', fromId:'p5', toId:'d5', caseId:'c5', text:'شكراً جزيلاً يا دكتور!', text_en:'Thank you so much Doctor!', createdAt:'2026-01-10T14:00:00' },
    { id:'m6', fromId:'d5', toId:'p5', caseId:'c5', text:'العفو! يسعدني أنك راضٍ.', text_en:'You are welcome! Glad you are happy.', createdAt:'2026-01-10T14:30:00' }
  ]
};

function loadData() {
  var data = localStorage.getItem('htc_data');
  if (!data) {
    localStorage.setItem('htc_data', JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
  }
  return JSON.parse(data);
}

function saveData(data) {
  localStorage.setItem('htc_data', JSON.stringify(data));
}

function getUser(id) {
  return loadData().users.find(function(u) { return u.id === id; });
}

function getCurrentUser() {
  var id = localStorage.getItem('htc_currentUser');
  if (!id) return null;
  return getUser(id);
}

function getCases() { return loadData().cases; }

function getCase(id) {
  return loadData().cases.find(function(c) { return c.id === id; });
}

function getOffersForCase(caseId) {
  return loadData().offers.filter(function(o) { return o.caseId === caseId; });
}

function getOffersForDoctor(doctorId) {
  return loadData().offers.filter(function(o) { return o.doctorId === doctorId; });
}

function getMessages(caseId) {
  return loadData().messages.filter(function(m) { return m.caseId === caseId; });
}

function getConversations(userId) {
  var data = loadData();
  var msgs = data.messages.filter(function(m) { return m.fromId === userId || m.toId === userId; });
  var convMap = {};
  msgs.forEach(function(m) {
    var otherId = m.fromId === userId ? m.toId : m.fromId;
    var key = m.caseId + '_' + otherId;
    if (!convMap[key] || new Date(m.createdAt) > new Date(convMap[key].createdAt)) {
      convMap[key] = { caseId: m.caseId, otherId: otherId, lastMessage: m };
    }
  });
  return Object.values(convMap);
}

function generateId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}
