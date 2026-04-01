# 🏥 Hair Transplant Connect | زراعة الشعر

منصة تفاعلية لربط مرضى زراعة الشعر بالأطباء المعتمدين

![HTML5](https://img.shields.io/badge/HTML5-PWA-orange) ![CSS3](https://img.shields.io/badge/CSS3-Responsive-blue) ![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)

---

## 🚀 مميزات المنصة

- 🌐 **عربي RTL** + تبديل إنجليزي LTR
- 👤 **3 أنواع حسابات:** مريض / طبيب / مدير
- 📸 **رفع صور 7 زوايا** مع مقياس Norwood (1-7)
- 💰 **نظام عروض** — الأطباء يقدموا عروض والمرضى يختاروا
- ⭐ **تقييم 1-5 نجوم** مع تعليقات
- 💬 **نظام رسائل داخلي** بين المريض والطبيب
- 🔒 **نسيت كلمة المرور** (3 خطوات)
- 📱 **PWA كامل** — يشتغل بدون نت + تثبيت كتطبيق
- 🔔 إشعارات + كوكيز + إخلاء مسؤولية طبية

---

## 🔐 حسابات تجريبية

| النوع | البريد | كلمة المرور |
|-------|--------|-------------|
| مريض | `ahmed@demo.com` | `123456` |
| طبيب | `youssef@demo.com` | `123456` |
| مدير | `admin@htc.com` | `admin123` |

---

## ▶️ التشغيل

```bash
# الطريقة 1: Python
python3 -m http.server 8080

# الطريقة 2: Node.js
npx serve .

# الطريقة 3: PHP
php -S localhost:8080
```

ثم افتح: **http://localhost:8080**

---

## 📁 هيكل المشروع

```
├── index.html          ← التطبيق الرئيسي (SPA)
├── privacy.html        ← سياسة الخصوصية
├── terms.html          ← شروط الاستخدام
├── css/style.css       ← التنسيقات
├── js/
│   ├── app.js          ← منطق التطبيق + التوجيه
│   ├── data.js         ← بيانات تجريبية
│   └── i18n.js         ← ترجمة عربي/إنجليزي
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker
└── icons/icon.svg      ← أيقونة التطبيق
```

---

## 📄 الرخصة

MIT License
