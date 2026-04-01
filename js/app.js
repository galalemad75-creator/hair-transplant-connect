// Hair Transplant Connect - Main Application
(function() {
  'use strict';

  // State
  let currentRoute = '';
  let deferredPrompt = null;

  // ====== INIT ======
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Language
    if (!localStorage.getItem('lang')) localStorage.setItem('lang', 'ar');
    applyLanguage();

    // Modal checks
    if (!localStorage.getItem('htc_disclaimer_accepted')) {
      showDisclaimer();
    }
    if (!localStorage.getItem('htc_cookie_accepted')) {
      setTimeout(showCookieBanner, 1000);
    }

    // Language toggle
    document.getElementById('langToggle').addEventListener('click', toggleLanguage);

    // Navigation
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);

    // Hash routing
    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    // PWA Install
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallBtn();
    });

    // Notification bell
    document.getElementById('notifBell').addEventListener('click', toggleNotifications);
  }

  // ====== LANGUAGE ======
  function applyLanguage() {
    const lang = localStorage.getItem('lang') || 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.className = lang === 'ar' ? 'rtl' : 'ltr';

    // Update font
    const link = document.getElementById('fontLink');
    if (lang === 'ar') {
      link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap';
      document.body.style.fontFamily = "'Cairo', sans-serif";
    } else {
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      document.body.style.fontFamily = "'Inter', sans-serif";
    }

    // Update all text
    updateTexts();
    updateNav();
    renderNotifBell();
  }

  function toggleLanguage() {
    const current = localStorage.getItem('lang') || 'ar';
    localStorage.setItem('lang', current === 'ar' ? 'en' : 'ar');
    applyLanguage();
    handleRoute();
  }

  function updateTexts() {
    document.querySelectorAll('[data-t]').forEach(el => {
      el.textContent = t(el.dataset.t);
    });
    document.querySelectorAll('[data-t-placeholder]').forEach(el => {
      el.placeholder = t(el.dataset.tPlaceholder);
    });
  }

  // ====== NAVIGATION ======
  function updateNav() {
    const user = getCurrentUser();
    const nav = document.getElementById('navLinks');
    let html = `<a href="#/" data-t="nav.home">${t('nav.home')}</a>`;

    if (user) {
      if (user.type === 'patient') {
        html += `<a href="#/patient/dashboard">${t('nav.dashboard')}</a>`;
        html += `<a href="#/patient/cases">${t('nav.cases')}</a>`;
        html += `<a href="#/patient/messages">${t('nav.messages')}</a>`;
      } else if (user.type === 'doctor') {
        html += `<a href="#/doctor/dashboard">${t('nav.dashboard')}</a>`;
        html += `<a href="#/doctor/browse">${t('nav.browse')}</a>`;
        html += `<a href="#/doctor/offers">${t('nav.offers')}</a>`;
      } else if (user.type === 'admin') {
        html += `<a href="#/admin/dashboard">${t('nav.dashboard')}</a>`;
        html += `<a href="#/admin/users">${t('nav.users')}</a>`;
        html += `<a href="#/admin/cases">${t('nav.cases')}</a>`;
      }
    } else {
      html += `<a href="#/login">${t('nav.login')}</a>`;
      html += `<a href="#/register/patient">${t('nav.register')}</a>`;
    }
    nav.innerHTML = html;

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (user) {
      logoutBtn.style.display = '';
      logoutBtn.onclick = () => {
        localStorage.removeItem('htc_currentUser');
        showToast(t('toast.logoutSuccess'), 'success');
        location.hash = '#/';
        updateNav();
      };
    } else {
      logoutBtn.style.display = 'none';
    }

    // User badge
    const badge = document.getElementById('userBadge');
    if (user) {
      badge.style.display = '';
      const label = user.type === 'patient' ? '👤' : user.type === 'doctor' ? '🩺' : '🛡️';
      badge.textContent = `${label} ${user.name}`;
    } else {
      badge.style.display = 'none';
    }
  }

  function toggleMobileMenu() {
    document.getElementById('navLinks').classList.toggle('open');
  }

  // ====== ROUTING ======
  function handleRoute() {
    const hash = location.hash || '#/';
    const route = hash.replace('#', '');
    currentRoute = route;
    const app = document.getElementById('app');

    // Close mobile menu
    document.getElementById('navLinks').classList.remove('open');

    // Route matching
    let matched = false;

    // Public routes
    if (route === '/') { renderLanding(); matched = true; }
    else if (route === '/login') { renderLogin(); matched = true; }
    else if (route === '/register/patient') { renderRegister('patient'); matched = true; }
    else if (route === '/register/doctor') { renderRegister('doctor'); matched = true; }

    // Patient routes
    else if (route === '/patient/dashboard') { renderPatientDashboard(); matched = true; }
    else if (route === '/patient/upload') { renderPatientUpload(); matched = true; }
    else if (route === '/patient/cases') { renderPatientCases(); matched = true; }
    else if (route.match(/^\/patient\/case\/(.+)$/)) { renderPatientCase(route.match(/^\/patient\/case\/(.+)$/)[1]); matched = true; }
    else if (route === '/patient/messages') { renderPatientMessages(); matched = true; }

    // Doctor routes
    else if (route === '/doctor/dashboard') { renderDoctorDashboard(); matched = true; }
    else if (route === '/doctor/browse') { renderDoctorBrowse(); matched = true; }
    else if (route.match(/^\/doctor\/case\/(.+)$/)) { renderDoctorCase(route.match(/^\/doctor\/case\/(.+)$/)[1]); matched = true; }
    else if (route === '/doctor/offers') { renderDoctorOffers(); matched = true; }
    else if (route === '/doctor/profile') { renderDoctorProfile(); matched = true; }

    // Admin routes
    else if (route === '/admin/dashboard') { renderAdminDashboard(); matched = true; }
    else if (route === '/admin/users') { renderAdminUsers(); matched = true; }
    else if (route === '/admin/cases') { renderAdminCases(); matched = true; }

    if (!matched) {
      app.innerHTML = `<div class="container"><div class="empty-state"><h2>404</h2><p>الصفحة غير موجودة</p><a href="#/" class="btn btn-primary">الرئيسية</a></div></div>`;
    }

    window.scrollTo(0, 0);
    renderNotifBell();
  }

  // ====== LANDING PAGE ======
  function renderLanding() {
    const app = document.getElementById('app');
    const data = loadData();
    app.innerHTML = `
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 data-t="hero.title">${t('hero.title')}</h1>
            <p data-t="hero.subtitle">${t('hero.subtitle')}</p>
            <div class="hero-buttons">
              <a href="#/register/patient" class="btn btn-primary btn-lg">${t('hero.cta')}</a>
              <a href="#/register/doctor" class="btn btn-outline btn-lg">${t('hero.ctaDoctor')}</a>
            </div>
          </div>
          <div class="hero-image">
            <div class="hero-graphic">
              <svg viewBox="0 0 200 200" class="hero-svg">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#2ecc71" stroke-width="2" opacity="0.3"/>
                <circle cx="100" cy="100" r="70" fill="none" stroke="#1a5276" stroke-width="2" opacity="0.5"/>
                <circle cx="100" cy="60" r="25" fill="#1a5276" opacity="0.8"/>
                <path d="M70 100 Q100 70 130 100 Q140 130 100 150 Q60 130 70 100" fill="#2ecc71" opacity="0.6"/>
                <text x="100" y="110" text-anchor="middle" fill="white" font-size="14" font-weight="bold">HTC</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <!-- Ad Banner -->
      <div class="ad-banner">${t('ad')}</div>

      <section class="features" id="features">
        <div class="container">
          <h2 class="section-title">${t('features.title')}</h2>
          <div class="features-grid">
            ${['f1','f2','f3','f4','f5','f6'].map((f,i) => `
              <div class="feature-card" style="animation-delay:${i*0.1}s">
                <div class="feature-icon">${['🏥','📋','⭐','💰','📞','🔒'][i]}</div>
                <h3>${t('features.'+f+'.title')}</h3>
                <p>${t('features.'+f+'.desc')}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="container">
          <h2 class="section-title">${t('stats.title')}</h2>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-number">${data.users.filter(u=>u.type==='patient').length * 150}+</div><div class="stat-label">${t('stats.patients')}</div></div>
            <div class="stat-card"><div class="stat-number">${data.users.filter(u=>u.type==='doctor').length * 80}+</div><div class="stat-label">${t('stats.doctors')}</div></div>
            <div class="stat-card"><div class="stat-number">${data.cases.length * 200}+</div><div class="stat-label">${t('stats.cases')}</div></div>
            <div class="stat-card"><div class="stat-number">12+</div><div class="stat-label">${t('stats.countries')}</div></div>
          </div>
        </div>
      </section>

      <section class="testimonials">
        <div class="container">
          <h2 class="section-title">${t('testimonials.title')}</h2>
          <div class="testimonial-grid">
            ${[
              { name: 'أحمد م.', text: 'تجربة رائعة! وجدت أفضل طبيب في تركيا بسعر معقول.', text_en: 'Amazing experience! Found the best doctor in Turkey at a reasonable price.', rating: 5 },
              { name: 'خالد ع.', text: 'المنصة سهلة الاستخدام والنتائج فاقت توقعاتي.', text_en: 'The platform is easy to use and results exceeded my expectations.', rating: 5 },
              { name: 'عمر ح.', text: 'خدمة عملات ممتازة وتواصل مستمر مع الطبيب.', text_en: 'Excellent customer service and continuous communication with the doctor.', rating: 4 }
            ].map(t2 => `
              <div class="testimonial-card">
                <div class="testimonial-stars">${'⭐'.repeat(t2.rating)}</div>
                <p class="testimonial-text">"${localStorage.getItem('lang')==='en' ? t2.text_en : t2.text}"</p>
                <div class="testimonial-author">— ${t2.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="container">
          <h2>${t('ctaSection.title')}</h2>
          <p>${t('ctaSection.subtitle')}</p>
          <a href="#/register/patient" class="btn btn-primary btn-lg">${t('ctaSection.btn')}</a>
        </div>
      </section>
    `;
  }

  // ====== LOGIN ======
  function renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="auth-page">
          <div class="auth-card">
            <h2>${t('login.title')}</h2>
            <div class="account-type-selector">
              <button class="type-btn active" data-type="patient" onclick="selectLoginType('patient')">${t('login.asPatient')}</button>
              <button class="type-btn" data-type="doctor" onclick="selectLoginType('doctor')">${t('login.asDoctor')}</button>
              <button class="type-btn" data-type="admin" onclick="selectLoginType('admin')">${t('login.asAdmin')}</button>
            </div>
            <form id="loginForm" onsubmit="handleLogin(event)">
              <div class="form-group">
                <label>${t('login.email')}</label>
                <input type="email" id="loginEmail" required class="form-control" placeholder="email@example.com">
              </div>
              <div class="form-group">
                <label>${t('login.password')}</label>
                <input type="password" id="loginPassword" required class="form-control" placeholder="••••••">
              </div>
              <button type="submit" class="btn btn-primary btn-block">${t('login.btn')}</button>
            </form>
            <p class="auth-footer">${t('login.noAccount')} <a href="#/register/patient">${t('login.signUp')}</a></p>
          </div>
        </div>
      </div>
    `;
    window._loginType = 'patient';
  }

  window.selectLoginType = function(type) {
    window._loginType = type;
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.type-btn[data-type="${type}"]`).classList.add('active');
  };

  window.handleLogin = function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const type = window._loginType;
    const data = loadData();

    if (type === 'admin') {
      if (email === 'admin@htc.com' && password === 'admin123') {
        // Ensure admin exists
        let admin = data.users.find(u => u.type === 'admin');
        if (!admin) {
          admin = { id: 'admin', type: 'admin', name: 'المدير', name_en: 'Admin', email: 'admin@htc.com', password: 'admin123', active: true };
          data.users.push(admin);
          saveData(data);
        }
        localStorage.setItem('htc_currentUser', admin.id);
        showToast(t('toast.loginSuccess'), 'success');
        location.hash = '#/admin/dashboard';
        updateNav();
        return;
      }
      showToast(t('toast.loginError'), 'error');
      return;
    }

    const user = data.users.find(u => u.email === email && u.password === password && u.type === type);
    if (user) {
      if (!user.active) {
        showToast(t('admin.inactive'), 'error');
        return;
      }
      localStorage.setItem('htc_currentUser', user.id);
      showToast(t('toast.loginSuccess'), 'success');
      location.hash = type === 'patient' ? '#/patient/dashboard' : '#/doctor/dashboard';
      updateNav();
    } else {
      showToast(t('toast.loginError'), 'error');
    }
  };

  // ====== REGISTER ======
  function renderRegister(type) {
    const app = document.getElementById('app');
    const isPatient = type === 'patient';
    const countriesList = getCountries();
    const lang = localStorage.getItem('lang') || 'ar';

    app.innerHTML = `
      <div class="container">
        <div class="auth-page">
          <div class="auth-card register-card">
            <h2>${isPatient ? t('register.patientTitle') : t('register.doctorTitle')}</h2>
            <div class="account-type-selector">
              <a href="#/register/patient" class="type-btn ${isPatient ? 'active' : ''}">${t('login.asPatient')}</a>
              <a href="#/register/doctor" class="type-btn ${!isPatient ? 'active' : ''}">${t('login.asDoctor')}</a>
            </div>
            <form id="registerForm" onsubmit="handleRegister(event, '${type}')">
              <div class="form-row">
                <div class="form-group">
                  <label>${t('register.name')} *</label>
                  <input type="text" id="regName" required class="form-control">
                </div>
                <div class="form-group">
                  <label>${t('register.email')} *</label>
                  <input type="email" id="regEmail" required class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>${t('register.password')} *</label>
                  <input type="password" id="regPassword" required class="form-control" minlength="6">
                </div>
                <div class="form-group">
                  <label>${t('register.confirmPassword')} *</label>
                  <input type="password" id="regConfirm" required class="form-control">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>${t('register.phone')} *</label>
                  <input type="tel" id="regPhone" required class="form-control">
                </div>
                <div class="form-group">
                  <label>${t('register.country')} *</label>
                  <select id="regCountry" required class="form-control">
                    <option value="">${t('common.selectCountry')}</option>
                    ${countriesList.map(c => `<option value="${c}">${c}</option>`).join('')}
                  </select>
                </div>
              </div>
              ${isPatient ? `
              <div class="form-row">
                <div class="form-group">
                  <label>${t('register.age')} *</label>
                  <input type="number" id="regAge" required class="form-control" min="18" max="80">
                </div>
                <div class="form-group">
                  <label>${t('register.gender')} *</label>
                  <select id="regGender" required class="form-control">
                    <option value="male">${t('register.male')}</option>
                    <option value="female">${t('register.female')}</option>
                  </select>
                </div>
              </div>
              ` : `
              <div class="form-row">
                <div class="form-group">
                  <label>${t('register.city')} *</label>
                  <input type="text" id="regCity" required class="form-control">
                </div>
                <div class="form-group">
                  <label>${t('register.specialty')} *</label>
                  <select id="regSpecialty" required class="form-control">
                    ${getSpecialties().map(s => `<option value="${s}">${s}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>${t('register.license')} *</label>
                  <input type="text" id="regLicense" required class="form-control">
                </div>
                <div class="form-group">
                  <label>${t('register.experience')} *</label>
                  <input type="number" id="regExperience" required class="form-control" min="1" max="50">
                </div>
              </div>
              <div class="form-group">
                <label>${t('register.clinicDesc')} *</label>
                <textarea id="regClinicDesc" required class="form-control" rows="3"></textarea>
              </div>
              `}
              <button type="submit" class="btn btn-primary btn-block">${t('register.btn')}</button>
            </form>
            <p class="auth-footer">${t('register.hasAccount')} <a href="#/login">${t('register.signIn')}</a></p>
          </div>
        </div>
      </div>
    `;
  }

  window.handleRegister = function(e, type) {
    e.preventDefault();
    const data = loadData();
    const lang = localStorage.getItem('lang') || 'ar';
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const phone = document.getElementById('regPhone').value;
    const countryIdx = document.getElementById('regCountry').selectedIndex;
    const countryVal = document.getElementById('regCountry').value;

    if (password !== confirm) {
      showToast('كلمات المرور غير متطابقة / Passwords do not match', 'error');
      return;
    }

    if (data.users.find(u => u.email === email)) {
      showToast('البريد مستخدم بالفعل / Email already in use', 'error');
      return;
    }

    const newUser = {
      id: generateId(type === 'patient' ? 'p' : 'd'),
      type,
      name,
      name_en: name,
      email,
      password,
      phone,
      country: countryVal,
      country_en: countryVal,
      active: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (type === 'patient') {
      newUser.age = parseInt(document.getElementById('regAge').value);
      newUser.gender = document.getElementById('regGender').value;
    } else {
      const specialtiesArr = getSpecialties();
      newUser.city = document.getElementById('regCity').value;
      newUser.city_en = document.getElementById('regCity').value;
      newUser.specialty = document.getElementById('regSpecialty').value;
      newUser.specialty_en = document.getElementById('regSpecialty').value;
      newUser.license = document.getElementById('regLicense').value;
      newUser.experience = parseInt(document.getElementById('regExperience').value);
      newUser.clinicDesc = document.getElementById('regClinicDesc').value;
      newUser.clinicDesc_en = document.getElementById('regClinicDesc').value;
      newUser.rating = 0;
      newUser.ratingCount = 0;
    }

    data.users.push(newUser);
    saveData(data);
    localStorage.setItem('htc_currentUser', newUser.id);
    showToast(t('toast.registerSuccess'), 'success');
    location.hash = type === 'patient' ? '#/patient/dashboard' : '#/doctor/dashboard';
    updateNav();
  };

  // ====== PATIENT DASHBOARD ======
  function renderPatientDashboard() {
    const user = getCurrentUser();
    if (!user || user.type !== 'patient') { location.hash = '#/login'; return; }
    const data = loadData();
    const myCases = data.cases.filter(c => c.patientId === user.id);
    const openCases = myCases.filter(c => c.status === 'open').length;
    const inProgress = myCases.filter(c => c.status === 'in_progress').length;
    const closed = myCases.filter(c => c.status === 'closed').length;
    const totalOffers = myCases.reduce((sum, c) => sum + data.offers.filter(o => o.caseId === c.id).length, 0);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="dashboard">
          <div class="dashboard-header">
            <h2>${t('patient.welcome')}, ${user.name}</h2>
            <a href="#/patient/upload" class="btn btn-primary">${t('patient.newCase')}</a>
          </div>
          <div class="stats-grid">
            <div class="stat-card mini"><div class="stat-number">${openCases}</div><div class="stat-label">${t('patient.status.open')}</div></div>
            <div class="stat-card mini"><div class="stat-number">${inProgress}</div><div class="stat-label">${t('patient.status.in_progress')}</div></div>
            <div class="stat-card mini"><div class="stat-number">${closed}</div><div class="stat-label">${t('patient.status.closed')}</div></div>
            <div class="stat-card mini"><div class="stat-number">${totalOffers}</div><div class="stat-label">${t('admin.totalOffers')}</div></div>
          </div>
          <h3>${t('patient.myCases')}</h3>
          ${myCases.length ? myCases.map(c => renderCaseCard(c, 'patient')).join('') : `<div class="empty-state"><p>${t('patient.noCases')}</p><a href="#/patient/upload" class="btn btn-primary">${t('patient.newCase')}</a></div>`}
        </div>
      </div>
    `;
  }

  function renderCaseCard(c, viewType) {
    const data = loadData();
    const lang = localStorage.getItem('lang') || 'ar';
    const offers = data.offers.filter(o => o.caseId === c.id);
    const statusMap = { open: { class: 'badge-open', text: t('patient.status.open') }, in_progress: { class: 'badge-progress', text: t('patient.status.in_progress') }, closed: { class: 'badge-closed', text: t('patient.status.closed') } };
    const status = statusMap[c.status] || statusMap.open;
    const desc = lang === 'en' ? (c.description_en || c.description) : c.description;
    const norwoodLabel = `Norwood ${c.norwood}`;

    return `
      <div class="case-card">
        <div class="case-header">
          <span class="badge ${status.class}">${status.text}</span>
          <span class="case-date">${c.createdAt}</span>
        </div>
        <div class="case-body">
          <div class="case-info">
            <span>📊 ${norwoodLabel}</span>
            <span>📸 ${c.photos.filter(Boolean).length}/7 ${t('patient.uploaded')}</span>
            <span>📋 ${offers.length} ${t('admin.totalOffers')}</span>
          </div>
          <p class="case-desc">${desc}</p>
        </div>
        <div class="case-actions">
          ${viewType === 'patient' ? `<a href="#/patient/case/${c.id}" class="btn btn-sm btn-primary">${t('patient.viewOffers')}</a>` : `<a href="#/doctor/case/${c.id}" class="btn btn-sm btn-primary">${t('doctor.viewCase')}</a>`}
        </div>
      </div>
    `;
  }

  // ====== PATIENT UPLOAD ======
  function renderPatientUpload() {
    const user = getCurrentUser();
    if (!user || user.type !== 'patient') { location.hash = '#/login'; return; }

    const angles = t('patient.photoAngles');
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="upload-page">
          <h2>${t('patient.uploadPhotos')}</h2>
          <p>${t('patient.photosGuide')}</p>
          <div class="norwood-selector">
            <label>${t('patient.norwoodDesc')}</label>
            <div class="norwood-grid">
              ${[1,2,3,4,5,6,7].map(n => `
                <div class="norwood-option" data-norwood="${n}" onclick="selectNorwood(${n})">
                  <div class="norwood-icon">
                    <svg viewBox="0 0 60 60">
                      <circle cx="30" cy="25" r="15" fill="none" stroke="#1a5276" stroke-width="2"/>
                      ${n >= 2 ? `<path d="M20 20 Q30 ${15+n} 40 20" fill="none" stroke="#e74c3c" stroke-width="2"/>` : ''}
                      ${n >= 3 ? `<path d="M18 22 Q30 ${12+n*2} 42 22" fill="none" stroke="#e74c3c" stroke-width="1.5"/>` : ''}
                      ${n >= 5 ? `<path d="M22 30 Q30 ${25+n} 38 30" fill="none" stroke="#e74c3c" stroke-width="1.5"/>` : ''}
                    </svg>
                  </div>
                  <span>NW ${n}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="form-group">
            <label>وصف الحالة / Case Description</label>
            <textarea id="caseDesc" class="form-control" rows="3" placeholder="صف حالة تساقط شعرك..."></textarea>
          </div>
          <div class="photo-upload-grid">
            ${Array.isArray(angles) ? angles.map((angle, i) => `
              <div class="photo-upload-card" data-angle="${i}">
                <div class="photo-placeholder" id="photoPreview${i}" onclick="simulateUpload(${i})">
                  <svg viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="#f0f0f0"/><path d="M25 55 L40 35 L50 45 L65 25" stroke="#1a5276" stroke-width="2" fill="none"/><circle cx="55" cy="28" r="5" fill="#2ecc71"/></svg>
                </div>
                <span class="photo-label">${angle}</span>
                <button class="btn btn-sm btn-outline" onclick="simulateUpload(${i})">${t('patient.selectFile')}</button>
                <span class="upload-status" id="uploadStatus${i}"></span>
              </div>
            `).join('') : ''}
          </div>
          <button class="btn btn-primary btn-block" onclick="submitCase()" style="margin-top:20px">${t('patient.newCase')}</button>
        </div>
      </div>
    `;
    window._uploadedPhotos = [false,false,false,false,false,false,false];
    window._selectedNorwood = 0;
  }

  window.selectNorwood = function(n) {
    window._selectedNorwood = n;
    document.querySelectorAll('.norwood-option').forEach(o => o.classList.remove('selected'));
    document.querySelector(`.norwood-option[data-norwood="${n}"]`).classList.add('selected');
  };

  window.simulateUpload = function(i) {
    window._uploadedPhotos[i] = true;
    const preview = document.getElementById(`photoPreview${i}`);
    preview.innerHTML = `<div class="photo-uploaded"><svg viewBox="0 0 80 80"><rect width="80" height="80" rx="8" fill="#2ecc71" opacity="0.2"/><path d="M25 40 L35 50 L55 30" stroke="#2ecc71" stroke-width="4" fill="none" stroke-linecap="round"/></svg></div>`;
    document.getElementById(`uploadStatus${i}`).textContent = t('patient.uploaded');
    document.getElementById(`uploadStatus${i}`).classList.add('uploaded');
    showToast(t('patient.photoUploaded'), 'success');
  };

  window.submitCase = function() {
    const user = getCurrentUser();
    if (!user) return;
    if (window._selectedNorwood === 0) {
      showToast('اختر مقياس نوروود / Select Norwood scale', 'warning');
      return;
    }
    const data = loadData();
    const desc = document.getElementById('caseDesc').value || 'حالة زراعة شعر';
    const lang = localStorage.getItem('lang') || 'ar';
    const newCase = {
      id: generateId('c'),
      patientId: user.id,
      norwood: window._selectedNorwood,
      country: user.country,
      country_en: user.country_en || user.country,
      status: 'open',
      photos: window._uploadedPhotos,
      description: desc,
      description_en: desc,
      createdAt: new Date().toISOString().split('T')[0]
    };
    data.cases.push(newCase);
    saveData(data);
    showToast(t('patient.caseCreated'), 'success');
    location.hash = `#/patient/case/${newCase.id}`;
  };

  // ====== PATIENT CASES ======
  function renderPatientCases() {
    const user = getCurrentUser();
    if (!user || user.type !== 'patient') { location.hash = '#/login'; return; }
    const data = loadData();
    const myCases = data.cases.filter(c => c.patientId === user.id);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="dashboard">
          <div class="dashboard-header">
            <h2>${t('patient.myCases')}</h2>
            <a href="#/patient/upload" class="btn btn-primary">${t('patient.newCase')}</a>
          </div>
          ${myCases.length ? myCases.map(c => renderCaseCard(c, 'patient')).join('') : `<div class="empty-state"><p>${t('patient.noCases')}</p></div>`}
        </div>
      </div>
    `;
  }

  // ====== PATIENT SINGLE CASE ======
  function renderPatientCase(caseId) {
    const user = getCurrentUser();
    if (!user) { location.hash = '#/login'; return; }
    const data = loadData();
    const c = data.cases.find(x => x.id === caseId);
    if (!c) { location.hash = '#/patient/cases'; return; }

    const offers = data.offers.filter(o => o.caseId === caseId);
    const lang = localStorage.getItem('lang') || 'ar';

    let selectedDoctor = null;
    if (c.selectedDoctorId) {
      selectedDoctor = data.users.find(u => u.id === c.selectedDoctorId);
    }

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="case-detail">
          <a href="#/patient/cases" class="btn btn-outline btn-sm">${t('common.back')}</a>
          <div class="case-detail-header">
            <h2>${t('patient.myCases')} #${caseId.split('_')[1]}</h2>
            ${renderStatusBadge(c.status)}
          </div>
          <div class="case-info-panel">
            <div><strong>${t('patient.norwood')}:</strong> NW ${c.norwood}</div>
            <div><strong>📸:</strong> ${c.photos.filter(Boolean).length}/7</div>
            <div><strong>📍:</strong> ${lang === 'en' ? (c.country_en || c.country) : c.country}</div>
            <div><strong>📅:</strong> ${c.createdAt}</div>
          </div>
          <p>${lang === 'en' ? (c.description_en || c.description) : c.description}</p>

          ${selectedDoctor ? `
            <div class="selected-doctor-panel">
              <h3>${t('patient.doctorSelected')}</h3>
              <div class="doctor-profile-card">
                <div class="doctor-avatar">🩺</div>
                <div>
                  <h4>${selectedDoctor.name}</h4>
                  <p>📞 ${selectedDoctor.phone}</p>
                  <p>📍 ${selectedDoctor.city}, ${selectedDoctor.country}</p>
                  ${selectedDoctor.rating ? `<p>⭐ ${selectedDoctor.rating} (${selectedDoctor.ratingCount})</p>` : ''}
                </div>
              </div>
              ${c.status !== 'closed' ? `<a href="#/patient/messages" class="btn btn-primary">${t('nav.messages')}</a>` : ''}
              ${c.status === 'in_progress' && !c.rating ? `
                <div class="rating-panel" style="margin-top:15px">
                  <h4>${t('patient.giveRating')}</h4>
                  <div class="star-rating" id="starRating">
                    ${[1,2,3,4,5].map(s => `<span class="star" data-star="${s}" onclick="setRating(${s})">☆</span>`).join('')}
                  </div>
                  <textarea id="ratingComment" class="form-control" rows="2" placeholder="${t('patient.ratingComment')}"></textarea>
                  <button class="btn btn-primary btn-sm" onclick="submitRating('${caseId}')">${t('patient.submitRating')}</button>
                </div>
              ` : ''}
              ${c.rating ? `
                <div class="rating-display" style="margin-top:15px">
                  <h4>${t('patient.rate')}</h4>
                  <div>${'⭐'.repeat(c.rating.stars)}</div>
                  <p>${lang === 'en' ? (c.rating.comment_en || c.rating.comment) : c.rating.comment}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <h3 style="margin-top:25px">${t('patient.viewOffers')} (${offers.length})</h3>
          ${offers.length ? offers.map((o, idx) => {
            const doctor = data.users.find(u => u.id === o.doctorId);
            if (!doctor) return '';
            const offerStatus = o.status === 'accepted' ? t('doctor.accepted') : o.status === 'rejected' ? t('doctor.rejected') : t('doctor.pending');
            const offerClass = o.status === 'accepted' ? 'badge-accepted' : o.status === 'rejected' ? 'badge-rejected' : 'badge-pending';

            let html = `
              <div class="offer-card">
                <div class="offer-header">
                  <div class="offer-doctor">
                    <div class="doctor-avatar small">🩺</div>
                    <div>
                      <strong>${doctor.name}</strong>
                      <span>${doctor.specialty}</span>
                      ${doctor.rating ? `<span>⭐ ${doctor.rating} (${doctor.ratingCount})</span>` : ''}
                    </div>
                  </div>
                  <span class="badge ${offerClass}">${offerStatus}</span>
                </div>
                <div class="offer-body">
                  <div class="offer-detail"><strong>${t('doctor.price')}:</strong> ${o.price} ${lang === 'en' ? (o.currency_en || o.currency) : o.currency}</div>
                  <div class="offer-detail"><strong>${t('doctor.procedureTime')}:</strong> ${lang === 'en' ? (o.procedureTime_en || o.procedureTime) : o.procedureTime}</div>
                  <div class="offer-detail"><strong>${t('doctor.arrivalTime')}:</strong> ${lang === 'en' ? (o.arrivalTime_en || o.arrivalTime) : o.arrivalTime}</div>
                  <p class="offer-note">${lang === 'en' ? (o.note_en || o.note) : o.note}</p>
                </div>
                ${c.status === 'open' ? `<div class="offer-actions"><button class="btn btn-primary btn-sm" onclick="selectOffer('${caseId}','${o.id}','${doctor.id}')">${t('patient.selectOffer')}</button></div>` : ''}
              </div>
            `;
            // Ad after 2nd offer
            if (idx === 1) {
              html += `<div class="ad-inline">${t('ad')}</div>`;
            }
            return html;
          }).join('') : `<div class="empty-state"><p>${t('patient.noOffers')}</p></div>`}
        </div>
      </div>
    `;
  }

  function renderStatusBadge(status) {
    const map = { open: 'badge-open', in_progress: 'badge-progress', closed: 'badge-closed' };
    const text = t(`patient.status.${status}`);
    return `<span class="badge ${map[status] || 'badge-open'}">${text}</span>`;
  }

  window._selectedRating = 0;
  window.setRating = function(s) {
    window._selectedRating = s;
    document.querySelectorAll('#starRating .star').forEach((el, i) => {
      el.textContent = i < s ? '★' : '☆';
      el.classList.toggle('active', i < s);
    });
  };

  window.submitRating = function(caseId) {
    if (window._selectedRating === 0) { showToast('اختر تقييم / Select a rating', 'warning'); return; }
    const data = loadData();
    const c = data.cases.find(x => x.id === caseId);
    if (!c) return;
    const comment = document.getElementById('ratingComment').value || '';
    c.rating = { stars: window._selectedRating, comment, comment_en: comment, date: new Date().toISOString().split('T')[0] };
    c.status = 'closed';
    // Update doctor rating
    if (c.selectedDoctorId) {
      const doc = data.users.find(u => u.id === c.selectedDoctorId);
      if (doc) {
        const total = (doc.rating || 0) * (doc.ratingCount || 0);
        doc.ratingCount = (doc.ratingCount || 0) + 1;
        doc.rating = Math.round(((total + window._selectedRating) / doc.ratingCount) * 10) / 10;
      }
    }
    saveData(data);
    showToast(t('patient.ratingSubmitted'), 'success');
    renderPatientCase(caseId);
  };

  window.selectOffer = function(caseId, offerId, doctorId) {
    const data = loadData();
    const c = data.cases.find(x => x.id === caseId);
    if (!c) return;
    c.status = 'in_progress';
    c.selectedDoctorId = doctorId;
    // Update offer statuses
    data.offers.forEach(o => {
      if (o.caseId === caseId) {
        if (o.id === offerId) o.status = 'accepted';
        else o.status = 'rejected';
      }
    });
    saveData(data);
    showToast(t('patient.offerSelected'), 'success');
    renderPatientCase(caseId);
  };

  // ====== PATIENT MESSAGES ======
  function renderPatientMessages() {
    const user = getCurrentUser();
    if (!user) { location.hash = '#/login'; return; }
    const data = loadData();
    const convos = getConversations(user.id);
    const lang = localStorage.getItem('lang') || 'ar';

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="messages-page">
          <h2>${t('messages.title')}</h2>
          <div class="messages-layout">
            <div class="conversations-list">
              ${convos.length ? convos.map(conv => {
                const other = data.users.find(u => u.id === conv.otherId);
                if (!other) return '';
                return `
                  <div class="conversation-item" onclick="openConversation('${conv.caseId}','${conv.otherId}')">
                    <div class="conv-avatar">🩺</div>
                    <div class="conv-info">
                      <strong>${other.name}</strong>
                      <p>${conv.lastMessage.text.substring(0, 30)}...</p>
                    </div>
                  </div>
                `;
              }).join('') : `<p class="empty-state">${t('messages.noMessages')}</p>`}
            </div>
            <div class="chat-area" id="chatArea">
              <div class="empty-state"><p>${t('messages.noConversation')}</p></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  window.openConversation = function(caseId, otherId) {
    const user = getCurrentUser();
    const data = loadData();
    const msgs = data.messages.filter(m => m.caseId === caseId && (m.fromId === user.id || m.toId === user.id) && (m.fromId === otherId || m.toId === otherId));
    const other = data.users.find(u => u.id === otherId);
    const lang = localStorage.getItem('lang') || 'ar';

    const chatArea = document.getElementById('chatArea');
    chatArea.innerHTML = `
      <div class="chat-header"><strong>${other ? other.name : ''}</strong></div>
      <div class="chat-messages" id="chatMessages">
        ${msgs.map(m => `
          <div class="message ${m.fromId === user.id ? 'sent' : 'received'}">
            <div class="message-bubble">${lang === 'en' ? (m.text_en || m.text) : m.text}</div>
            <div class="message-time">${new Date(m.createdAt).toLocaleTimeString()}</div>
          </div>
        `).join('')}
      </div>
      <div class="chat-input">
        <input type="text" id="msgInput" class="form-control" placeholder="${t('messages.typeMessage')}" onkeydown="if(event.key==='Enter')sendMessage('${caseId}','${otherId}')">
        <button class="btn btn-primary" onclick="sendMessage('${caseId}','${otherId}')">${t('messages.send')}</button>
      </div>
    `;
    document.getElementById('chatMessages').scrollTop = 99999;
  };

  window.sendMessage = function(caseId, otherId) {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text) return;
    const user = getCurrentUser();
    const data = loadData();
    data.messages.push({
      id: generateId('m'),
      fromId: user.id,
      toId: otherId,
      caseId,
      text,
      text_en: text,
      createdAt: new Date().toISOString()
    });
    saveData(data);
    input.value = '';
    openConversation(caseId, otherId);
  };

  // ====== DOCTOR DASHBOARD ======
  function renderDoctorDashboard() {
    const user = getCurrentUser();
    if (!user || user.type !== 'doctor') { location.hash = '#/login'; return; }
    const data = loadData();
    const myOffers = data.offers.filter(o => o.doctorId === user.id);
    const accepted = myOffers.filter(o => o.status === 'accepted').length;
    const pending = myOffers.filter(o => o.status === 'pending').length;
    const rejected = myOffers.filter(o => o.status === 'rejected').length;

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="dashboard">
          <div class="dashboard-header">
            <h2>${t('doctor.welcome')}, ${user.name}</h2>
            <a href="#/doctor/browse" class="btn btn-primary">${t('doctor.browseCases')}</a>
          </div>
          <div class="stats-grid">
            <div class="stat-card mini"><div class="stat-number">${myOffers.length}</div><div class="stat-label">${t('admin.totalOffers')}</div></div>
            <div class="stat-card mini"><div class="stat-number">${pending}</div><div class="stat-label">${t('doctor.pending')}</div></div>
            <div class="stat-card mini"><div class="stat-number">${accepted}</div><div class="stat-label">${t('doctor.accepted')}</div></div>
            <div class="stat-card mini"><div class="stat-number">${user.rating || 0}</div><div class="stat-label">⭐ (${user.ratingCount || 0})</div></div>
          </div>
          <h3>${t('doctor.myOffers')}</h3>
          ${myOffers.length ? myOffers.slice(0, 5).map(o => {
            const c = data.cases.find(x => x.id === o.caseId);
            if (!c) return '';
            const lang = localStorage.getItem('lang') || 'ar';
            const offerStatus = o.status === 'accepted' ? t('doctor.accepted') : o.status === 'rejected' ? t('doctor.rejected') : t('doctor.pending');
            const offerClass = o.status === 'accepted' ? 'badge-accepted' : o.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
            return `
              <div class="offer-card compact">
                <div class="offer-header">
                  <span>NW ${c.norwood} - ${lang === 'en' ? (c.country_en || c.country) : c.country}</span>
                  <span class="badge ${offerClass}">${offerStatus}</span>
                </div>
                <div>${t('doctor.price')}: ${o.price} ${lang === 'en' ? (o.currency_en || o.currency) : o.currency}</div>
              </div>
            `;
          }).join('') : `<div class="empty-state"><p>${t('doctor.noOffers')}</p></div>`}
        </div>
      </div>
    `;
  }

  // ====== DOCTOR BROWSE ======
  function renderDoctorBrowse() {
    const user = getCurrentUser();
    if (!user || user.type !== 'doctor') { location.hash = '#/login'; return; }
    const data = loadData();
    const lang = localStorage.getItem('lang') || 'ar';
    const openCases = data.cases.filter(c => c.status === 'open');
    const countriesList = getCountries();

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="browse-page">
          <h2>${t('doctor.browseCases')}</h2>
          <div class="filter-bar">
            <select id="filterCountry" class="form-control" onchange="filterCases()">
              <option value="">${t('doctor.all')} ${t('doctor.country')}</option>
              ${countriesList.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <select id="filterNorwood" class="form-control" onchange="filterCases()">
              <option value="">${t('doctor.all')} ${t('doctor.norwood')}</option>
              ${[1,2,3,4,5,6,7].map(n => `<option value="${n}">NW ${n}</option>`).join('')}
            </select>
            <select id="filterGender" class="form-control" onchange="filterCases()">
              <option value="">${t('doctor.all')} ${t('doctor.gender')}</option>
              <option value="male">${t('register.male')}</option>
              <option value="female">${t('register.female')}</option>
            </select>
          </div>
          <div id="casesList">
            ${openCases.length ? openCases.map(c => {
              const patient = data.users.find(u => u.id === c.patientId);
              const myOffer = data.offers.find(o => o.caseId === c.id && o.doctorId === user.id);
              return `
                <div class="case-card" data-country="${c.country}" data-norwood="${c.norwood}" data-gender="${patient ? patient.gender : ''}">
                  <div class="case-header">
                    <span class="badge badge-open">${t('patient.status.open')}</span>
                    <span class="case-date">${c.createdAt}</span>
                  </div>
                  <div class="case-body">
                    <div class="case-info">
                      <span>📊 NW ${c.norwood}</span>
                      <span>📸 ${c.photos.filter(Boolean).length}/7</span>
                      <span>📍 ${lang === 'en' ? (c.country_en || c.country) : c.country}</span>
                      ${patient ? `<span>👤 ${patient.gender === 'male' ? t('register.male') : t('register.female')}</span>` : ''}
                    </div>
                    <p class="case-desc">${lang === 'en' ? (c.description_en || c.description) : c.description}</p>
                  </div>
                  <div class="case-actions">
                    <a href="#/doctor/case/${c.id}" class="btn btn-sm btn-primary">${t('doctor.viewCase')}</a>
                    ${myOffer ? `<span class="badge badge-pending">${t('doctor.pending')}</span>` : ''}
                  </div>
                </div>
              `;
            }).join('') : `<div class="empty-state"><p>${t('doctor.noCases')}</p></div>`}
          </div>
        </div>
      </div>
    `;
  }

  window.filterCases = function() {
    const country = document.getElementById('filterCountry').value;
    const norwood = document.getElementById('filterNorwood').value;
    const gender = document.getElementById('filterGender').value;
    document.querySelectorAll('#casesList .case-card').forEach(card => {
      let show = true;
      if (country && card.dataset.country !== country) show = false;
      if (norwood && card.dataset.norwood !== norwood) show = false;
      if (gender && card.dataset.gender !== gender) show = false;
      card.style.display = show ? '' : 'none';
    });
  };

  // ====== DOCTOR CASE VIEW ======
  function renderDoctorCase(caseId) {
    const user = getCurrentUser();
    if (!user || user.type !== 'doctor') { location.hash = '#/login'; return; }
    const data = loadData();
    const c = data.cases.find(x => x.id === caseId);
    if (!c) { location.hash = '#/doctor/browse'; return; }
    const lang = localStorage.getItem('lang') || 'ar';
    const patient = data.users.find(u => u.id === c.patientId);
    const myOffer = data.offers.find(o => o.caseId === caseId && o.doctorId === user.id);
    const canEdit = myOffer && (Date.now() - new Date(myOffer.createdAt).getTime()) < 24 * 60 * 60 * 1000;

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="case-detail">
          <a href="#/doctor/browse" class="btn btn-outline btn-sm">${t('common.back')}</a>
          <div class="case-detail-header">
            <h2>${t('doctor.viewCase')} #${caseId.split('_')[1]}</h2>
            ${renderStatusBadge(c.status)}
          </div>
          <div class="case-info-panel">
            <div><strong>${t('patient.norwood')}:</strong> NW ${c.norwood}</div>
            <div><strong>📸:</strong> ${c.photos.filter(Boolean).length}/7</div>
            <div><strong>📍:</strong> ${lang === 'en' ? (c.country_en || c.country) : c.country}</div>
            ${patient ? `<div><strong>👤:</strong> ${patient.gender === 'male' ? t('register.male') : t('register.female')}, ${patient.age}</div>` : ''}
          </div>
          <p>${lang === 'en' ? (c.description_en || c.description) : c.description}</p>

          ${c.status === 'open' ? `
            <div class="offer-form" style="margin-top:20px">
              <h3>${myOffer ? t('doctor.editOffer') : t('doctor.submitOffer')}</h3>
              <div class="form-row">
                <div class="form-group">
                  <label>${t('doctor.price')}</label>
                  <input type="number" id="offerPrice" class="form-control" value="${myOffer ? myOffer.price : ''}">
                </div>
                <div class="form-group">
                  <label>${t('doctor.currency')}</label>
                  <input type="text" id="offerCurrency" class="form-control" value="${myOffer ? (myOffer.currency) : ''}" placeholder="USD / ر.س / ج.م">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>${t('doctor.procedureTime')}</label>
                  <input type="text" id="offerProcTime" class="form-control" value="${myOffer ? (lang === 'en' ? (myOffer.procedureTime_en || myOffer.procedureTime) : myOffer.procedureTime) : ''}" placeholder="6 ساعات / 6 hours">
                </div>
                <div class="form-group">
                  <label>${t('doctor.arrivalTime')}</label>
                  <input type="text" id="offerArrival" class="form-control" value="${myOffer ? (lang === 'en' ? (myOffer.arrivalTime_en || myOffer.arrivalTime) : myOffer.arrivalTime) : ''}" placeholder="خلال أسبوع / Within a week">
                </div>
              </div>
              <div class="form-group">
                <label>${t('doctor.note')}</label>
                <textarea id="offerNote" class="form-control" rows="3">${myOffer ? (lang === 'en' ? (myOffer.note_en || myOffer.note) : myOffer.note) : ''}</textarea>
              </div>
              <p class="hint">${t('doctor.showPhone')}</p>
              <button class="btn btn-primary" onclick="submitOffer('${caseId}', ${myOffer ? `'${myOffer.id}'` : 'null'})">${myOffer ? t('doctor.editOffer') : t('doctor.submitOffer')}</button>
            </div>
          ` : `
            <div class="case-closed-notice">
              <p>${c.status === 'closed' ? t('patient.status.closed') : t('patient.status.in_progress')}</p>
            </div>
          `}
        </div>
      </div>
    `;
  }

  window.submitOffer = function(caseId, existingOfferId) {
    const user = getCurrentUser();
    const data = loadData();
    const price = parseInt(document.getElementById('offerPrice').value);
    const currency = document.getElementById('offerCurrency').value;
    const procTime = document.getElementById('offerProcTime').value;
    const arrival = document.getElementById('offerArrival').value;
    const note = document.getElementById('offerNote').value;

    if (!price || !currency) {
      showToast(t('common.required'), 'warning');
      return;
    }

    if (existingOfferId) {
      const offer = data.offers.find(o => o.id === existingOfferId);
      if (offer) {
        offer.price = price;
        offer.currency = currency;
        offer.currency_en = currency;
        offer.procedureTime = procTime;
        offer.procedureTime_en = procTime;
        offer.arrivalTime = arrival;
        offer.arrivalTime_en = arrival;
        offer.note = note;
        offer.note_en = note;
      }
      showToast(t('doctor.offerUpdated'), 'success');
    } else {
      data.offers.push({
        id: generateId('o'),
        caseId,
        doctorId: user.id,
        price,
        currency,
        currency_en: currency,
        procedureTime: procTime,
        procedureTime_en: procTime,
        arrivalTime: arrival,
        arrivalTime_en: arrival,
        note,
        note_en: note,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0]
      });
      showToast(t('doctor.offerSubmitted'), 'success');
    }
    saveData(data);
    location.hash = '#/doctor/browse';
  };

  // ====== DOCTOR OFFERS ======
  function renderDoctorOffers() {
    const user = getCurrentUser();
    if (!user || user.type !== 'doctor') { location.hash = '#/login'; return; }
    const data = loadData();
    const lang = localStorage.getItem('lang') || 'ar';
    const myOffers = data.offers.filter(o => o.doctorId === user.id);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="dashboard">
          <h2>${t('doctor.myOffers')}</h2>
          ${myOffers.length ? myOffers.map(o => {
            const c = data.cases.find(x => x.id === o.caseId);
            if (!c) return '';
            const offerStatus = o.status === 'accepted' ? t('doctor.accepted') : o.status === 'rejected' ? t('doctor.rejected') : t('doctor.pending');
            const offerClass = o.status === 'accepted' ? 'badge-accepted' : o.status === 'rejected' ? 'badge-rejected' : 'badge-pending';
            return `
              <div class="offer-card">
                <div class="offer-header">
                  <span>NW ${c.norwood} - ${lang === 'en' ? (c.country_en || c.country) : c.country}</span>
                  <span class="badge ${offerClass}">${offerStatus}</span>
                </div>
                <div class="offer-body">
                  <div>${t('doctor.price')}: ${o.price} ${lang === 'en' ? (o.currency_en || o.currency) : o.currency}</div>
                  <div>${t('doctor.procedureTime')}: ${lang === 'en' ? (o.procedureTime_en || o.procedureTime) : o.procedureTime}</div>
                  <p>${lang === 'en' ? (o.note_en || o.note) : o.note}</p>
                </div>
                <div class="offer-actions">
                  <a href="#/doctor/case/${o.caseId}" class="btn btn-sm btn-outline">${t('common.view')}</a>
                </div>
              </div>
            `;
          }).join('') : `<div class="empty-state"><p>${t('doctor.noOffers')}</p></div>`}
        </div>
      </div>
    `;
  }

  // ====== DOCTOR PROFILE ======
  function renderDoctorProfile() {
    const user = getCurrentUser();
    if (!user || user.type !== 'doctor') { location.hash = '#/login'; return; }
    const lang = localStorage.getItem('lang') || 'ar';

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="profile-page">
          <div class="profile-header">
            <div class="profile-avatar">🩺</div>
            <h2>${user.name}</h2>
            <p>${user.specialty}</p>
            ${user.rating ? `<div class="profile-rating">⭐ ${user.rating} (${user.ratingCount} ${t('doctor.cases_count')})</div>` : ''}
          </div>
          <div class="profile-details">
            <div><strong>📍:</strong> ${user.city}, ${user.country}</div>
            <div><strong>🏥:</strong> ${lang === 'en' ? (user.clinicDesc_en || user.clinicDesc) : user.clinicDesc}</div>
            <div><strong>📋:</strong> ${user.license}</div>
            <div><strong>⏱️:</strong> ${user.experience} ${t('doctor.experience')}</div>
            <div><strong>📞:</strong> ${user.phone}</div>
          </div>
          <div class="ad-sidebar">${t('ad')}</div>
        </div>
      </div>
    `;
  }

  // ====== ADMIN DASHBOARD ======
  function renderAdminDashboard() {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') { location.hash = '#/login'; return; }
    const data = loadData();
    const patients = data.users.filter(u => u.type === 'patient').length;
    const doctors = data.users.filter(u => u.type === 'doctor').length;
    const openCases = data.cases.filter(c => c.status === 'open').length;
    const closedCases = data.cases.filter(c => c.status === 'closed').length;
    const inProgress = data.cases.filter(c => c.status === 'in_progress').length;
    const totalOffers = data.offers.length;

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="dashboard admin-dashboard">
          <h2>${t('admin.dashboard')}</h2>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-number">${patients}</div><div class="stat-label">${t('admin.totalPatients')}</div></div>
            <div class="stat-card"><div class="stat-number">${doctors}</div><div class="stat-label">${t('admin.totalDoctors')}</div></div>
            <div class="stat-card"><div class="stat-number">${openCases}</div><div class="stat-label">${t('admin.openCases')}</div></div>
            <div class="stat-card"><div class="stat-number">${inProgress}</div><div class="stat-label">${t('patient.status.in_progress')}</div></div>
            <div class="stat-card"><div class="stat-number">${closedCases}</div><div class="stat-label">${t('admin.closedCases')}</div></div>
            <div class="stat-card"><div class="stat-number">${totalOffers}</div><div class="stat-label">${t('admin.totalOffers')}</div></div>
          </div>
          <div class="admin-quick-links">
            <a href="#/admin/users" class="btn btn-outline">${t('nav.users')}</a>
            <a href="#/admin/cases" class="btn btn-outline">${t('nav.cases')}</a>
          </div>
        </div>
      </div>
    `;
  }

  // ====== ADMIN USERS ======
  function renderAdminUsers() {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') { location.hash = '#/login'; return; }
    const data = loadData();
    const lang = localStorage.getItem('lang') || 'ar';
    const users = data.users.filter(u => u.type !== 'admin');

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="dashboard">
          <h2>${t('admin.users')}</h2>
          <div class="users-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>الاسم</th>
                  <th>النوع</th>
                  <th>البريد</th>
                  <th>الدولة</th>
                  <th>الحالة</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td>${u.name}</td>
                    <td><span class="badge ${u.type === 'patient' ? 'badge-open' : 'badge-progress'}">${u.type === 'patient' ? 'مريض' : 'طبيب'}</span></td>
                    <td>${u.email}</td>
                    <td>${u.country}</td>
                    <td><span class="badge ${u.active ? 'badge-accepted' : 'badge-rejected'}">${u.active ? t('admin.active') : t('admin.inactive')}</span></td>
                    <td>
                      <button class="btn btn-sm ${u.active ? 'btn-danger' : 'btn-primary'}" onclick="toggleUserActive('${u.id}')">${u.active ? t('admin.deactivate') : t('admin.activate')}</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  window.toggleUserActive = function(userId) {
    const data = loadData();
    const u = data.users.find(x => x.id === userId);
    if (u) {
      u.active = !u.active;
      saveData(data);
      showToast(t('toast.saved'), 'success');
      renderAdminUsers();
    }
  };

  // ====== ADMIN CASES ======
  function renderAdminCases() {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') { location.hash = '#/login'; return; }
    const data = loadData();
    const lang = localStorage.getItem('lang') || 'ar';

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="dashboard">
          <h2>${t('admin.cases')}</h2>
          <div class="users-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>المريض</th>
                  <th>NW</th>
                  <th>الدولة</th>
                  <th>العروض</th>
                  <th>الحالة</th>
                  <th>التقييم</th>
                  <th>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                ${data.cases.map(c => {
                  const patient = data.users.find(u => u.id === c.patientId);
                  const offers = data.offers.filter(o => o.caseId === c.id);
                  return `
                    <tr>
                      <td>${c.id.split('_')[1]}</td>
                      <td>${patient ? patient.name : '-'}</td>
                      <td>NW ${c.norwood}</td>
                      <td>${c.country}</td>
                      <td>${offers.length}</td>
                      <td>${renderStatusBadge(c.status)}</td>
                      <td>${c.rating ? '⭐'.repeat(c.rating.stars) : '-'}</td>
                      <td>
                        ${c.rating ? `<button class="btn btn-sm btn-danger" onclick="deleteRating('${c.id}')">${t('admin.deleteRating')}</button>` : '-'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  window.deleteRating = function(caseId) {
    const data = loadData();
    const c = data.cases.find(x => x.id === caseId);
    if (c && c.rating) {
      // Adjust doctor rating
      if (c.selectedDoctorId) {
        const doc = data.users.find(u => u.id === c.selectedDoctorId);
        if (doc && doc.ratingCount > 0) {
          const total = doc.rating * doc.ratingCount - c.rating.stars;
          doc.ratingCount--;
          doc.rating = doc.ratingCount > 0 ? Math.round((total / doc.ratingCount) * 10) / 10 : 0;
        }
      }
      delete c.rating;
      saveData(data);
      showToast(t('toast.deleted'), 'success');
      renderAdminCases();
    }
  };

  // ====== NOTIFICATIONS ======
  function renderNotifBell() {
    const user = getCurrentUser();
    const bell = document.getElementById('notifBell');
    const count = document.getElementById('notifCount');
    if (!user) { bell.style.display = 'none'; return; }
    bell.style.display = '';
    // Count: new offers for patients, new messages for doctors
    const data = loadData();
    let n = 0;
    if (user.type === 'patient') {
      const myCases = data.cases.filter(c => c.patientId === user.id && c.status === 'open');
      myCases.forEach(c => { n += data.offers.filter(o => o.caseId === c.id).length; });
    } else if (user.type === 'doctor') {
      n = data.offers.filter(o => o.doctorId === user.id && o.status === 'accepted').length;
    }
    count.textContent = n;
    count.style.display = n > 0 ? '' : 'none';
  }

  function toggleNotifications() {
    showToast('لا توجد إشعارات جديدة / No new notifications', 'info');
  }

  // ====== TOAST ======
  function showToast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${msg}</span><button onclick="this.parentElement.remove()">×</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  // ====== DISCLAIMER & COOKIES ======
  function showDisclaimer() {
    const modal = document.getElementById('disclaimerModal');
    modal.innerHTML = `
      <div class="modal-overlay" onclick="closeDisclaimer()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <h3>⚠️ ${t('disclaimer.title')}</h3>
          <p>${t('disclaimer.text')}</p>
          <button class="btn btn-primary" onclick="closeDisclaimer()">${t('disclaimer.accept')}</button>
        </div>
      </div>
    `;
    modal.style.display = '';
  }

  window.closeDisclaimer = function() {
    localStorage.setItem('htc_disclaimer_accepted', 'true');
    document.getElementById('disclaimerModal').style.display = 'none';
  };

  function showCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    banner.innerHTML = `
      <div class="cookie-banner">
        <span>🍪 ${t('cookie.text')}</span>
        <button class="btn btn-primary btn-sm" onclick="closeCookieBanner()">${t('cookie.accept')}</button>
      </div>
    `;
    banner.style.display = '';
  }

  window.closeCookieBanner = function() {
    localStorage.setItem('htc_cookie_accepted', 'true');
    document.getElementById('cookieBanner').style.display = 'none';
  };

  // ====== PWA ======
  function showInstallBtn() {
    const btn = document.getElementById('installBtn');
    btn.style.display = '';
    btn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          btn.textContent = t('pwa.installed');
          btn.disabled = true;
        }
        deferredPrompt = null;
      }
    });
  }

})();
