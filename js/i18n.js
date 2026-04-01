// Arabic/English translations
const translations = {
  ar: {
    // Header
    appName: "Hair Transplant Connect",
    appSlogan: "منصة ربط مرضى زراعة الشعر بالأطباء",
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      login: "تسجيل الدخول",
      register: "إنشاء حساب",
      dashboard: "لوحة التحكم",
      cases: "حالاتي",
      browse: "تصفح الحالات",
      offers: "عروضي",
      profile: "ملفي",
      messages: "الرسائل",
      logout: "تسجيل الخروج"
    },
    // Landing
    hero: {
      title: "ابدأ رحلتك نحو شعر صحي",
      subtitle: "منصة موثوقة تربطك بأفضل أطباء زراعة الشعر في المنطقة",
      cta: "ابدأ الآن",
      ctaDoctor: "انضم كطبيب"
    },
    features: {
      title: "لماذا تختارنا؟",
      f1: { title: "أطباء معتمدون", desc: "شبكة من أفضل أطباء زراعة الشعر المعتمدين" },
      f2: { title: "عروض متعددة", desc: "احصل على عروض من عدة أطباء واختر الأفضل" },
      f3: { title: "تقييمات حقيقية", desc: "تقييمات ومراجعات من مرضى حقيقيين" },
      f4: { title: "أسعار شفافة", desc: "أسعار واضحة بدون تكاليف خفية" },
      f5: { title: "متابعة مستمرة", desc: "تواصل مباشر مع طبيبك بعد العملية" },
      f6: { title: "خصوصية تامة", desc: "بياناتك ومعلوماتك محمية بالكامل" }
    },
    stats: {
      title: "أرقام تتحدث عن نفسها",
      patients: "مريض",
      doctors: "طبيب",
      cases: "حالة",
      countries: "دولة"
    },
    testimonials: {
      title: "ماذا يقول مرضانا"
    },
    ctaSection: {
      title: "هل أنت مستعد لتغيير حياتك؟",
      subtitle: "انضم إلى آلاف المرضى الذين وجدوا الحل المناسب",
      btn: "سجّل الآن"
    },
    // Auth
    login: {
      title: "تسجيل الدخول",
      asPatient: "كمريض",
      asDoctor: "كطبيب",
      asAdmin: "كمدير",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      btn: "دخول",
      noAccount: "ليس لديك حساب؟",
      signUp: "سجّل الآن",
      forgotPassword: "نسيت كلمة المرور؟",
      forgotTitle: "استعادة كلمة المرور",
      forgotDesc: "أدخل بريدك الإلكتروني وسنرسل لك رمز إعادة التعيين",
      sendReset: "إرسال رمز الاستعادة",
      resetSent: "تم إرسال رمز الاستعادة إلى بريدك الإلكتروني",
      resetNewPass: "كلمة المرور الجديدة",
      resetConfirmPass: "تأكيد كلمة المرور الجديدة",
      resetBtn: "تعيين كلمة المرور",
      resetSuccess: "تم تغيير كلمة المرور بنجاح! يمكنك تسجيل الدخول الآن",
      resetCode: "رمز التحقق",
      resetVerify: "تحقق من الرمز",
      invalidCode: "رمز التحقق غير صحيح",
      noEmailFound: "البريد الإلكتروني غير مسجل"
    },
    register: {
      patientTitle: "تسجيل حساب مريض",
      doctorTitle: "تسجيل حساب طبيب",
      name: "الاسم الكامل",
      age: "العمر",
      gender: "الجنس",
      male: "ذكر",
      female: "أنثى",
      country: "الدولة",
      city: "المدينة",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      specialty: "التخصص",
      license: "رقم الترخيص",
      experience: "سنوات الخبرة",
      clinicDesc: "وصف العيادة",
      photo: "صورة شخصية",
      btn: "إنشاء حساب",
      hasAccount: "لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول"
    },
    // Patient
    patient: {
      dashboard: "لوحة التحكم",
      welcome: "مرحباً",
      myCases: "حالاتي",
      newCase: "حالة جديدة",
      uploadPhotos: "رفع صور",
      viewOffers: "عرض العروض",
      selectDoctor: "اختيار طبيب",
      messages: "الرسائل",
      rate: "تقييم",
      status: {
        open: "مفتوحة",
        in_progress: "قيد التقدم",
        closed: "مغلقة"
      },
      noCases: "لا توجد حالات بعد",
      noOffers: "لا توجد عروض بعد",
      photosGuide: "دليل رفع الصور",
      photoAngles: [
        "الجبهة - خط الشعر الأمامي",
        "الأعلى - منطقة التاج",
        "الجانب الأيمن",
        "الجانب الأيسر",
        "نصف الجانب الأيمن (45°)",
        "نصف الجانب الأيسر (45°)",
        "المنطقة المانحة (مؤخرة الرأس)"
      ],
      norwood: "مقياس نوروود",
      norwoodDesc: "اختر درجة تساقط الشعر",
      selectOffer: "اختيار هذا العرض",
      doctorSelected: "تم اختيار الطبيب",
      giveRating: "أضف تقييمك",
      ratingComment: "تعليقك",
      submitRating: "إرسال التقييم",
      uploaded: "تم الرفع",
      selectFile: "اختر صورة",
      dragDrop: "اسحب الصورة هنا أو انقر للاختيار",
      photoUploaded: "تم رفع الصورة بنجاح",
      caseCreated: "تم إنشاء الحالة بنجاح",
      doctorSelectedMsg: "تم اختيار الطبيب بنجاح! يمكنك الآن التواصل معه",
      ratingSubmitted: "تم إرسال التقييم بنجاح",
      offerSelected: "تم اختيار العرض بنجاح"
    },
    // Doctor
    doctor: {
      dashboard: "لوحة التحكم",
      welcome: "مرحباً",
      browseCases: "تصفح الحالات",
      myOffers: "عروضي",
      myProfile: "ملفي",
      filterBy: "تصفية حسب",
      country: "الدولة",
      norwood: "مقياس نوروود",
      gender: "الجنس",
      date: "التاريخ",
      all: "الكل",
      viewCase: "عرض الحالة",
      submitOffer: "تقديم عرض",
      price: "السعر",
      currency: "العملة",
      procedureTime: "مدة العملية المتوقعة",
      arrivalTime: "وقت الوصول المتوقع",
      note: "ملاحظة للمريض",
      editOffer: "تعديل العرض",
      offerSubmitted: "تم تقديم العرض بنجاح",
      offerUpdated: "تم تحديث العرض بنجاح",
      noCases: "لا توجد حالات متاحة",
      noOffers: "لم تقدم أي عروض بعد",
      pending: "في الانتظار",
      accepted: "مقبول",
      rejected: "مرفوض",
      showPhone: "بعد اختيارك، سيظهر رقم هاتفك للمريض",
      experience: "سنوات خبرة",
      cases_count: "حالة"
    },
    // Admin
    admin: {
      dashboard: "لوحة التحكم",
      users: "إدارة المستخدمين",
      cases: "إدارة الحالات",
      totalPatients: "إجمالي المرضى",
      totalDoctors: "إجمالي الأطباء",
      openCases: "الحالات المفتوحة",
      closedCases: "الحالات المغلقة",
      totalOffers: "إجمالي العروض",
      activate: "تفعيل",
      deactivate: "تعطيل",
      active: "نشط",
      inactive: "غير نشط",
      deleteRating: "حذف التقييم",
      moderation: "إدارة المحتوى"
    },
    // Messages
    messages: {
      title: "الرسائل",
      typeMessage: "اكتب رسالتك...",
      send: "إرسال",
      noMessages: "لا توجد رسائل بعد",
      noConversation: "اختر محادثة للبدء"
    },
    // Common
    common: {
      loading: "جاري التحميل...",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      view: "عرض",
      back: "رجوع",
      next: "التالي",
      search: "بحث",
      filter: "تصفية",
      noResults: "لا توجد نتائج",
      confirm: "تأكيد",
      success: "نجاح",
      error: "خطأ",
      warning: "تحذير",
      selectCountry: "اختر الدولة",
      required: "مطلوب"
    },
    // Ad
    ad: "إعلان",
    // Cookie & Disclaimer
    cookie: {
      title: "ملفات تعريف الارتباط",
      text: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا.",
      accept: "قبول"
    },
    disclaimer: {
      title: "إخلاء مسؤولية طبية",
      text: "هذه المنصة هي لأغراض إعلامية فقط ولا تقدم نصائح طبية. استشر طبيبك المختص قبل اتخاذ أي قرارات.",
      accept: "فهمت"
    },
    // PWA
    pwa: {
      install: "تثبيت التطبيق",
      installed: "تم التثبيت"
    },
    // Footer
    footer: {
      rights: "جميع الحقوق محفوظة",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام"
    },
    // Toast
    toast: {
      loginSuccess: "تم تسجيل الدخول بنجاح",
      loginError: "خطأ في تسجيل الدخول",
      registerSuccess: "تم إنشاء الحساب بنجاح",
      logoutSuccess: "تم تسجيل الخروج",
      saved: "تم الحفظ",
      deleted: "تم الحذف",
      error: "حدث خطأ"
    }
  },
  en: {
    appName: "Hair Transplant Connect",
    appSlogan: "Connecting Hair Transplant Patients with Doctors",
    nav: {
      home: "Home",
      about: "About Us",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      cases: "My Cases",
      browse: "Browse Cases",
      offers: "My Offers",
      profile: "Profile",
      messages: "Messages",
      logout: "Logout"
    },
    hero: {
      title: "Start Your Journey to Healthy Hair",
      subtitle: "A trusted platform connecting you with the best hair transplant doctors in the region",
      cta: "Get Started",
      ctaDoctor: "Join as Doctor"
    },
    features: {
      title: "Why Choose Us?",
      f1: { title: "Certified Doctors", desc: "Network of certified top hair transplant specialists" },
      f2: { title: "Multiple Offers", desc: "Get offers from multiple doctors and choose the best" },
      f3: { title: "Real Reviews", desc: "Reviews and ratings from real patients" },
      f4: { title: "Transparent Pricing", desc: "Clear pricing with no hidden costs" },
      f5: { title: "Ongoing Follow-up", desc: "Direct communication with your doctor after the procedure" },
      f6: { title: "Full Privacy", desc: "Your data and information are fully protected" }
    },
    stats: {
      title: "Numbers Speak for Themselves",
      patients: "Patients",
      doctors: "Doctors",
      cases: "Cases",
      countries: "Countries"
    },
    testimonials: {
      title: "What Our Patients Say"
    },
    ctaSection: {
      title: "Ready to Change Your Life?",
      subtitle: "Join thousands of patients who found the right solution",
      btn: "Register Now"
    },
    login: {
      title: "Login",
      asPatient: "As Patient",
      asDoctor: "As Doctor",
      asAdmin: "As Admin",
      email: "Email",
      password: "Password",
      btn: "Login",
      noAccount: "Don't have an account?",
      signUp: "Sign Up",
      forgotPassword: "Forgot Password?",
      forgotTitle: "Reset Password",
      forgotDesc: "Enter your email and we'll send you a reset code",
      sendReset: "Send Reset Code",
      resetSent: "Reset code sent to your email",
      resetNewPass: "New Password",
      resetConfirmPass: "Confirm New Password",
      resetBtn: "Set Password",
      resetSuccess: "Password changed successfully! You can now login",
      resetCode: "Verification Code",
      resetVerify: "Verify Code",
      invalidCode: "Invalid verification code",
      noEmailFound: "Email not found"
    },
    register: {
      patientTitle: "Patient Registration",
      doctorTitle: "Doctor Registration",
      name: "Full Name",
      age: "Age",
      gender: "Gender",
      male: "Male",
      female: "Female",
      country: "Country",
      city: "City",
      phone: "Phone Number",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      specialty: "Specialty",
      license: "License Number",
      experience: "Years of Experience",
      clinicDesc: "Clinic Description",
      photo: "Profile Photo",
      btn: "Create Account",
      hasAccount: "Already have an account?",
      signIn: "Sign In"
    },
    patient: {
      dashboard: "Dashboard",
      welcome: "Welcome",
      myCases: "My Cases",
      newCase: "New Case",
      uploadPhotos: "Upload Photos",
      viewOffers: "View Offers",
      selectDoctor: "Select Doctor",
      messages: "Messages",
      rate: "Rate",
      status: {
        open: "Open",
        in_progress: "In Progress",
        closed: "Closed"
      },
      noCases: "No cases yet",
      noOffers: "No offers yet",
      photosGuide: "Photo Upload Guide",
      photoAngles: [
        "Front - Hairline",
        "Top - Vertex",
        "Right Profile",
        "Left Profile",
        "Right 45°",
        "Left 45°",
        "Donor Area (Back of Head)"
      ],
      norwood: "Norwood Scale",
      norwoodDesc: "Select hair loss grade",
      selectOffer: "Select This Offer",
      doctorSelected: "Doctor Selected",
      giveRating: "Add Your Rating",
      ratingComment: "Your Comment",
      submitRating: "Submit Rating",
      uploaded: "Uploaded",
      selectFile: "Select Photo",
      dragDrop: "Drag photo here or click to select",
      photoUploaded: "Photo uploaded successfully",
      caseCreated: "Case created successfully",
      doctorSelectedMsg: "Doctor selected! You can now communicate with them",
      ratingSubmitted: "Rating submitted successfully",
      offerSelected: "Offer selected successfully"
    },
    doctor: {
      dashboard: "Dashboard",
      welcome: "Welcome",
      browseCases: "Browse Cases",
      myOffers: "My Offers",
      myProfile: "My Profile",
      filterBy: "Filter By",
      country: "Country",
      norwood: "Norwood Scale",
      gender: "Gender",
      date: "Date",
      all: "All",
      viewCase: "View Case",
      submitOffer: "Submit Offer",
      price: "Price",
      currency: "Currency",
      procedureTime: "Estimated Procedure Time",
      arrivalTime: "Estimated Arrival Time",
      note: "Note to Patient",
      editOffer: "Edit Offer",
      offerSubmitted: "Offer submitted successfully",
      offerUpdated: "Offer updated successfully",
      noCases: "No cases available",
      noOffers: "You haven't submitted any offers yet",
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected",
      showPhone: "After selection, your phone number will be visible to the patient",
      experience: "Years of experience",
      cases_count: "cases"
    },
    admin: {
      dashboard: "Dashboard",
      users: "User Management",
      cases: "Case Management",
      totalPatients: "Total Patients",
      totalDoctors: "Total Doctors",
      openCases: "Open Cases",
      closedCases: "Closed Cases",
      totalOffers: "Total Offers",
      activate: "Activate",
      deactivate: "Deactivate",
      active: "Active",
      inactive: "Inactive",
      deleteRating: "Delete Rating",
      moderation: "Content Moderation"
    },
    messages: {
      title: "Messages",
      typeMessage: "Type your message...",
      send: "Send",
      noMessages: "No messages yet",
      noConversation: "Select a conversation to start"
    },
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      back: "Back",
      next: "Next",
      search: "Search",
      filter: "Filter",
      noResults: "No results",
      confirm: "Confirm",
      success: "Success",
      error: "Error",
      warning: "Warning",
      selectCountry: "Select Country",
      required: "Required"
    },
    ad: "Ad",
    cookie: {
      title: "Cookies",
      text: "We use cookies to improve your experience on our site.",
      accept: "Accept"
    },
    disclaimer: {
      title: "Medical Disclaimer",
      text: "This platform is for informational purposes only and does not provide medical advice. Consult your specialist before making any decisions.",
      accept: "I Understand"
    },
    pwa: {
      install: "Install App",
      installed: "Installed"
    },
    footer: {
      rights: "All Rights Reserved",
      privacy: "Privacy Policy",
      terms: "Terms of Service"
    },
    toast: {
      loginSuccess: "Logged in successfully",
      loginError: "Login error",
      registerSuccess: "Account created successfully",
      logoutSuccess: "Logged out successfully",
      saved: "Saved",
      deleted: "Deleted",
      error: "An error occurred"
    }
  }
};

const countries = {
  ar: ["مصر", "السعودية", "الإمارات", "الأردن", "تركيا", "الكويت", "قطر", "البحرين", "عُمان", "لبنان", "المغرب", "العراق"],
  en: ["Egypt", "Saudi Arabia", "UAE", "Jordan", "Turkey", "Kuwait", "Qatar", "Bahrain", "Oman", "Lebanon", "Morocco", "Iraq"]
};

const specialties = {
  ar: ["جراحة تجميل الشعر", "طب الجلدية", "جراحة التجميل", "طب التجميل"],
  en: ["Hair Transplant Surgery", "Dermatology", "Cosmetic Surgery", "Aesthetic Medicine"]
};

function t(key) {
  const lang = localStorage.getItem('lang') || 'ar';
  const keys = key.split('.');
  let val = translations[lang];
  for (const k of keys) {
    if (!val || !val[k]) return key;
    val = val[k];
  }
  return val;
}

function getCountries() {
  const lang = localStorage.getItem('lang') || 'ar';
  return countries[lang];
}

function getSpecialties() {
  const lang = localStorage.getItem('lang') || 'ar';
  return specialties[lang];
}
