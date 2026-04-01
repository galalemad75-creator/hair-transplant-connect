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

    // Dark/Light theme toggle
    initTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

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

    // Update font (graceful — works without Google Fonts too)
    const link = document.getElementById('fontLink');
    if (link) {
      if (lang === 'ar') {
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&display=swap';
      } else {
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
      }
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

  // ====== THEME (DARK/LIGHT) ======
  function initTheme() {
    const saved = localStorage.getItem('htc_theme') || 'light';
    applyTheme(saved);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');
    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = '';
    } else {
      if (sunIcon) sunIcon.style.display = '';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('htc_theme', next);
    applyTheme(next);
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
      html += `<a href="#/about">${t('nav.about') || 'من نحن'}</a>`;
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
    else if (route === '/forgot-password') { renderForgotPassword(); matched = true; }
    else if (route === '/about') { renderAbout(); matched = true; }
    else if (route === '/privacy') { renderPrivacy(); matched = true; }
    else if (route === '/terms') { renderTerms(); matched = true; }
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
      app.innerHTML = `<div class="container"><div class="empty-state"><h2>404</h2><p>${t('landing.notFound')}</p><a href="#/" class="btn btn-primary">${t('landing.home')}</a></div></div>`;
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
        <div class="hero-bg"></div>
        <div class="hero-gradient"></div>
        <div class="hero-particles"></div>

        <!-- SVG Illustrations (visible on large screens) -->
        <div class="hero-illustrations">
          <!-- Left: Happy patient with great hair -->
          <div class="hero-ill-left">
            <svg viewBox="0 0 260 380" width="260" height="380" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Body -->
              <ellipse cx="130" cy="340" rx="60" ry="30" fill="#14b8a6" opacity="0.15"/>
              <rect x="90" y="220" width="80" height="120" rx="30" fill="#14b8a6" opacity="0.2"/>
              <!-- Neck -->
              <rect x="115" y="190" width="30" height="40" rx="8" fill="#fcd5b5"/>
              <!-- Head -->
              <ellipse cx="130" cy="150" rx="52" ry="58" fill="#fcd5b5"/>
              <!-- Hair - full, thick, healthy -->
              <path d="M78 140 Q78 80 130 72 Q182 80 182 140 Q178 95 130 88 Q82 95 78 140Z" fill="#1a1a2e"/>
              <path d="M80 135 Q80 85 130 78 Q180 85 180 135" fill="#2d2d44"/>
              <!-- Hair sides -->
              <path d="M78 140 Q74 120 80 105 Q78 130 82 145Z" fill="#1a1a2e"/>
              <path d="M182 140 Q186 120 180 105 Q182 130 178 145Z" fill="#1a1a2e"/>
              <!-- Face -->
              <ellipse cx="112" cy="148" rx="6" ry="7" fill="#1a1a2e"/>
              <ellipse cx="148" cy="148" rx="6" ry="7" fill="#1a1a2e"/>
              <!-- Smile -->
              <path d="M115 170 Q130 185 145 170" stroke="#c9755d" stroke-width="3" fill="none" stroke-linecap="round"/>
              <!-- Eyebrows -->
              <path d="M102 134 Q112 128 120 133" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <path d="M140 133 Q148 128 158 134" stroke="#1a1a2e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <!-- Sparkles around hair -->
              <circle cx="65" cy="100" r="4" fill="#fbbf24" opacity="0.8">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="195" cy="90" r="3" fill="#fbbf24" opacity="0.6">
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/>
              </circle>
              <circle cx="170" cy="70" r="3.5" fill="#34d399" opacity="0.7">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
              </circle>
              <!-- Thumbs up -->
              <g transform="translate(180, 240) rotate(-15)">
                <rect x="0" y="10" width="20" height="40" rx="8" fill="#fcd5b5"/>
                <rect x="2" y="-10" width="14" height="25" rx="7" fill="#fcd5b5"/>
              </g>
              <!-- Success checkmark circle -->
              <circle cx="210" cy="200" r="18" fill="#059669" opacity="0.9"/>
              <path d="M202 200 L208 206 L220 194" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Right: Professional doctor -->
          <div class="hero-ill-right">
            <svg viewBox="0 0 260 380" width="260" height="380" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Body / Lab coat -->
              <ellipse cx="130" cy="345" rx="60" ry="28" fill="#0d9488" opacity="0.12"/>
              <path d="M80 230 L80 350 Q80 360 90 360 L170 360 Q180 360 180 350 L180 230 Q160 250 130 248 Q100 250 80 230Z" fill="white" opacity="0.9" stroke="#e2e8f0" stroke-width="1"/>
              <!-- Coat collar -->
              <path d="M100 230 L120 255 L130 240 L140 255 L160 230" fill="white" stroke="#e2e8f0" stroke-width="1"/>
              <!-- Stethoscope -->
              <path d="M110 250 Q100 280 115 295" stroke="#64748b" stroke-width="3" fill="none" stroke-linecap="round"/>
              <circle cx="115" cy="298" r="8" fill="#64748b"/>
              <circle cx="115" cy="298" r="4" fill="#94a3b8"/>
              <!-- Neck -->
              <rect x="117" y="195" width="26" height="38" rx="7" fill="#d4a574"/>
              <!-- Head -->
              <ellipse cx="130" cy="155" rx="48" ry="54" fill="#d4a574"/>
              <!-- Hair - professional, short -->
              <path d="M82 145 Q82 95 130 88 Q178 95 178 145 Q175 105 130 98 Q85 105 82 145Z" fill="#1a1a2e"/>
              <!-- Face -->
              <ellipse cx="113" cy="152" rx="5" ry="6" fill="#1a1a2e"/>
              <ellipse cx="147" cy="152" rx="5" ry="6" fill="#1a1a2e"/>
              <!-- Glasses -->
              <rect x="100" y="143" width="26" height="18" rx="9" stroke="#64748b" stroke-width="2" fill="none"/>
              <rect x="134" y="143" width="26" height="18" rx="9" stroke="#64748b" stroke-width="2" fill="none"/>
              <line x1="126" y1="152" x2="134" y2="152" stroke="#64748b" stroke-width="2"/>
              <!-- Smile -->
              <path d="M118 172 Q130 182 142 172" stroke="#a0694b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <!-- Medical cross on coat -->
              <rect x="124" y="260" width="12" height="30" rx="2" fill="#0d9488" opacity="0.7"/>
              <rect x="118" y="268" width="24" height="12" rx="2" fill="#0d9488" opacity="0.7"/>
              <!-- Clipboard in hand -->
              <g transform="translate(175, 260)">
                <rect x="0" y="0" width="30" height="40" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
                <rect x="8" y="-4" width="14" height="8" rx="3" fill="#94a3b8"/>
                <line x1="6" y1="12" x2="24" y2="12" stroke="#cbd5e1" stroke-width="1.5"/>
                <line x1="6" y1="18" x2="24" y2="18" stroke="#cbd5e1" stroke-width="1.5"/>
                <line x1="6" y1="24" x2="20" y2="24" stroke="#cbd5e1" stroke-width="1.5"/>
                <line x1="6" y1="30" x2="22" y2="30" stroke="#cbd5e1" stroke-width="1.5"/>
              </g>
            </svg>
          </div>
        </div>

        <div class="hero-content">
          <span class="hero-badge">✨ ${t('landing.trustedBadge')}</span>
          <h1 class="hero-title">${(() => { const lang = localStorage.getItem('lang') || 'ar'; const txt = t('hero.title'); return lang === 'en' ? txt.replace('Healthy Hair', '<span class="gradient-text">Healthy Hair</span>') : txt.replace('شعر صحي', '<span class="gradient-text">شعر صحي</span>'); })()}</h1>
          <p class="hero-subtitle">${t('hero.subtitle')}</p>
          <div class="hero-ctas">
            <a href="#/register/patient" class="btn btn-accent btn-lg pulse-btn">${t('hero.cta')}</a>
            <a href="#/register/doctor" class="btn btn-outline-light btn-lg">${t('hero.ctaDoctor')}</a>
          </div>
          <div class="hero-stats">
            <div class="stat-pill"><strong>${data.users.filter(u=>u.type==='patient').length * 150}+</strong> ${t('stats.patients')}</div>
            <div class="stat-pill"><strong>${data.users.filter(u=>u.type==='doctor').length * 80}+</strong> ${t('stats.doctors')}</div>
            <div class="stat-pill"><strong>12+</strong> ${t('stats.countries')}</div>
          </div>
        </div>
      </section>

      <!-- Ad Banner -->
      <div class="ad-banner">${t('ad')}</div>

      <section class="section section-dark" id="features">
        <div class="section-header light">
          <span class="section-badge">🏥 ${t('landing.whyUsBadge')}</span>
          <h2 class="section-title">${t('features.title')}</h2>
          <p class="section-sub">${t('landing.featuresSub')}</p>
        </div>
        <div class="features-grid">
          ${['f1','f2','f3','f4','f5','f6'].map((f,i) => `
            <div class="feature-card" style="animation: fadeInUp 0.6s ease ${i*0.1}s both">
              <div class="feature-icon ${['teal','blue','orange','green','purple','rose'][i]}">${['🏥','📋','⭐','💰','📞','🔒'][i]}</div>
              <h3>${t('features.'+f+'.title')}</h3>
              <p>${t('features.'+f+'.desc')}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="stats-section section-gradient">
        <div class="section-header">
          <span class="section-badge">📊 ${t('landing.statsBadge')}</span>
          <h2 class="section-title">${t('stats.title')}</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">${data.users.filter(u=>u.type==='patient').length * 150}+</div>
            <div class="stat-label">${t('stats.patients')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.users.filter(u=>u.type==='doctor').length * 80}+</div>
            <div class="stat-label">${t('stats.doctors')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">${data.cases.length * 200}+</div>
            <div class="stat-label">${t('stats.cases')}</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">12+</div>
            <div class="stat-label">${t('stats.countries')}</div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <span class="section-badge">💬 ${t('landing.reviewsBadge')}</span>
          <h2 class="section-title">${t('testimonials.title')}</h2>
        </div>
        <div class="testimonial-grid">
          ${[
            { name: 'أحمد م.', text: 'تجربة رائعة! وجدت أفضل طبيب في تركيا بسعر معقول. النتائج كانت مذهلة.', text_en: 'Amazing experience! Found the best doctor in Turkey at a reasonable price. The results were stunning.', rating: 5 },
            { name: 'خالد ع.', text: 'المنصة سهلة الاستخدام والنتائج فاقت توقعاتي. أنصح بها بشدة.', text_en: 'The platform is easy to use and results exceeded my expectations. Highly recommend.', rating: 5 },
            { name: 'عمر ح.', text: 'خدمة عملاء ممتازة وتواصل مستمر مع الطبيب. تجربة مميزة من البداية للنهاية.', text_en: 'Excellent customer service and continuous communication with the doctor. A premium experience from start to finish.', rating: 4 }
          ].map(t2 => `
            <div class="testimonial-card">
              <div class="testimonial-stars">${'⭐'.repeat(t2.rating)}</div>
              <p class="testimonial-text">"${localStorage.getItem('lang')==='en' ? t2.text_en : t2.text}"</p>
              <div class="testimonial-author">
                <div class="test-avatar">${t2.name.charAt(0)}</div>
                <div class="test-author">
                  <strong>${t2.name}</strong>
                  <small>${t('landing.verifiedPatient')}</small>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section class="cta-section">
        <div class="cta-card">
          <h2>${t('ctaSection.title')}</h2>
          <p>${t('ctaSection.subtitle')}</p>
          <div class="cta-buttons">
            <a href="#/register/patient" class="btn btn-accent btn-lg">${t('ctaSection.btn')}</a>
          </div>
        </div>
      </section>
    `;

    // Animate stat counters
    setTimeout(animateCounters, 300);
  }

  // Animate stat numbers on scroll
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const text = el.textContent;
      const num = parseInt(text.replace(/[^0-9]/g, ''));
      if (!num || num === 0) return;
      const suffix = text.replace(/[0-9]/g, '');
      let current = 0;
      const step = Math.ceil(num / 40);
      const interval = setInterval(() => {
        current += step;
        if (current >= num) {
          current = num;
          clearInterval(interval);
        }
        el.textContent = current + suffix;
      }, 30);
    });
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
            <p class="auth-footer"><a href="#/forgot-password" class="forgot-password-link">🔒 ${t('login.forgotPassword')}</a></p>
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
      if (email === 'emadh5156@gmail.com' && password === 'admin75') {
        // Ensure admin exists
        let admin = data.users.find(u => u.type === 'admin');
        if (!admin) {
          admin = { id: 'admin', type: 'admin', name: 'المدير', name_en: 'Admin', email: 'emadh5156@gmail.com', password: 'admin75', active: true };
          data.users.push(admin);
          saveData(data);
        } else {
          admin.email = 'emadh5156@gmail.com';
          admin.password = 'admin75';
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

    const hashedInput = simpleHash(password);
    const user = data.users.find(u => u.email === email && u.password === hashedInput && u.type === type);
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

  // ====== FORGOT PASSWORD ======
  function renderForgotPassword() {
    const app = document.getElementById('app');
    // Store a simulated reset code in sessionStorage
    window._resetStep = window._resetStep || 1;
    window._resetEmail = window._resetEmail || '';

    app.innerHTML = `
      <div class="container">
        <div class="auth-page">
          <div class="auth-card">
            <h2>🔒 ${t('login.forgotTitle')}</h2>
            <div id="forgotStep1">
              <p style="text-align:center;color:#6b7280;margin-bottom:20px">${t('login.forgotDesc')}</p>
              <form onsubmit="handleForgotStep1(event)">
                <div class="form-group">
                  <label>${t('login.email')}</label>
                  <input type="email" id="forgotEmail" required class="form-control" placeholder="email@example.com">
                </div>
                <button type="submit" class="btn btn-primary btn-block">${t('login.sendReset')}</button>
              </form>
            </div>
            <div id="forgotStep2" style="display:none">
              <p style="text-align:center;color:#6b7280;margin-bottom:20px">${t('login.resetSent')}</p>
              <form onsubmit="handleForgotStep2(event)">
                <div class="form-group">
                  <label>${t('login.resetCode')}</label>
                  <input type="text" id="resetCodeInput" required class="form-control" placeholder="123456" maxlength="6">
                </div>
                <button type="submit" class="btn btn-primary btn-block">${t('login.resetVerify')}</button>
              </form>
            </div>
            <div id="forgotStep3" style="display:none">
              <form onsubmit="handleForgotStep3(event)">
                <div class="form-group">
                  <label>${t('login.resetNewPass')}</label>
                  <input type="password" id="newPassword" required class="form-control" minlength="6">
                </div>
                <div class="form-group">
                  <label>${t('login.resetConfirmPass')}</label>
                  <input type="password" id="confirmNewPassword" required class="form-control" minlength="6">
                </div>
                <button type="submit" class="btn btn-primary btn-block">${t('login.resetBtn')}</button>
              </form>
            </div>
            <p class="auth-footer"><a href="#/login">${t('common.back')}</a></p>
          </div>
        </div>
      </div>
    `;
    window._resetStep = 1;
    window._resetEmail = '';
  }

  window.handleForgotStep1 = function(e) {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    const data = loadData();
    const user = data.users.find(u => u.email === email);
    if (!user) {
      showToast(t('login.noEmailFound'), 'error');
      return;
    }
    window._resetEmail = email;
    // Simulate sending a code (always "123456" for demo)
    window._resetCode = '123456';
    document.getElementById('forgotStep1').style.display = 'none';
    document.getElementById('forgotStep2').style.display = '';
    showToast(t('login.resetSent'), 'success');
  };

  window.handleForgotStep2 = function(e) {
    e.preventDefault();
    const code = document.getElementById('resetCodeInput').value;
    if (code !== window._resetCode) {
      showToast(t('login.invalidCode'), 'error');
      return;
    }
    document.getElementById('forgotStep2').style.display = 'none';
    document.getElementById('forgotStep3').style.display = '';
  };

  window.handleForgotStep3 = function(e) {
    e.preventDefault();
    const pass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmNewPassword').value;
    if (pass !== confirm) {
      showToast('كلمات المرور غير متطابقة / Passwords do not match', 'error');
      return;
    }
    const data = loadData();
    const user = data.users.find(u => u.email === window._resetEmail);
    if (user) {
      user.password = simpleHash(pass);
      saveData(data);
      showToast(t('login.resetSuccess'), 'success');
      window._resetStep = 1;
      window._resetEmail = '';
      window._resetCode = '';
      setTimeout(() => { location.hash = '#/login'; }, 1500);
    }
  };

  // ====== ABOUT US ======
  function renderAbout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="about-page">
          <div class="about-hero">
            <span class="section-badge">✨ ${t('about.badge')}</span>
            <h1>Hair Transplant Connect</h1>
            <p class="about-subtitle">${t('about.subtitle')}</p>
          </div>

          <div class="about-grid">
            <div class="about-card">
              <div class="about-card-icon">🎯</div>
              <h3>${t('about.vision')}</h3>
              <p>${t('about.visionDesc')}</p>
            </div>
            <div class="about-card">
              <div class="about-card-icon">💡</div>
              <h3>${t('about.mission')}</h3>
              <p>${t('about.missionDesc')}</p>
            </div>
            <div class="about-card">
              <div class="about-card-icon">🌟</div>
              <h3>${t('about.values')}</h3>
              <p>${t('about.valuesDesc')}</p>
            </div>
          </div>

          <div class="about-stats">
            <h2>${t('about.achievements')}</h2>
            <div class="stats-grid">
              <div class="stat-card"><div class="stat-number">2,500+</div><div class="stat-label">${t('about.happyPatients')}</div></div>
              <div class="stat-card"><div class="stat-number">150+</div><div class="stat-label">${t('about.certifiedDoctors')}</div></div>
              <div class="stat-card"><div class="stat-number">5,000+</div><div class="stat-label">${t('about.successfulOps')}</div></div>
              <div class="stat-card"><div class="stat-number">12+</div><div class="stat-label">${t('stats.countries')}</div></div>
            </div>
          </div>

          <div class="about-why">
            <h2>${t('about.whyChoose')}</h2>
            <div class="about-features">
              <div class="about-feature">
                <span class="about-feature-icon">✅</span>
                <div>
                  <h4>${t('about.certifiedOnly')}</h4>
                  <p>${t('about.certifiedOnlyDesc')}</p>
                </div>
              </div>
              <div class="about-feature">
                <span class="about-feature-icon">💰</span>
                <div>
                  <h4>${t('about.transparentPricing')}</h4>
                  <p>${t('about.transparentPricingDesc')}</p>
                </div>
              </div>
              <div class="about-feature">
                <span class="about-feature-icon">🔒</span>
                <div>
                  <h4>${t('about.fullPrivacy')}</h4>
                  <p>${t('about.fullPrivacyDesc')}</p>
                </div>
              </div>
              <div class="about-feature">
                <span class="about-feature-icon">📞</span>
                <div>
                  <h4>${t('about.support247')}</h4>
                  <p>${t('about.support247Desc')}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="about-cta">
            <h2>${t('about.readyStart')}</h2>
            <p>${t('about.joinThousands')}</p>
            <div class="hero-ctas">
              <a href="#/register/patient" class="btn btn-accent btn-lg">${t('about.registerPatient')}</a>
              <a href="#/register/doctor" class="btn btn-outline btn-lg">${t('about.joinDoctor')}</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ====== PRIVACY POLICY ======
  function renderPrivacy() {
    const lang = localStorage.getItem('lang') || 'ar';
    const app = document.getElementById('app');
    const isEn = lang === 'en';
    app.innerHTML = `
      <div class="container">
        <div class="about-page">
          <div class="about-hero">
            <h1>${isEn ? 'Privacy Policy' : 'سياسة الخصوصية'}</h1>
            <p class="about-subtitle">${isEn ? 'Last updated: April 2026' : 'آخر تحديث: أبريل 2026'}</p>
          </div>
          <div style="background:var(--bg-card);padding:32px;border-radius:14px;box-shadow:var(--shadow-md);line-height:2;color:var(--text)">
            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '1. Information We Collect' : '1. جمع المعلومات'}</h2>
            <p>${isEn ? 'We collect information you provide when registering, including your name, email address, phone number, and medical photos. This information is necessary to connect patients with certified hair transplant doctors.' : 'نقوم بجمع المعلومات التي تقدمها عند التسجيل، بما في ذلك الاسم، البريد الإلكتروني، رقم الهاتف، والصور الطبية. هذه المعلومات ضرورية لربط المرضى بالأطباء المعتمدين.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '2. How We Use Your Information' : '2. استخدام المعلومات'}</h2>
            <p>${isEn ? 'We use personal information to provide our platform services, including account management, displaying cases to doctors, and facilitating communication. We do not sell or share your personal information with third parties without your consent.' : 'نستخدم المعلومات الشخصية لتقديم خدمات المنصة، بما في ذلك إنشاء الحسابات، عرض الحالات للأطباء، وتسهيل التواصل. لا نبيع أو نشارك معلوماتك مع أطراف ثالثة دون موافقتك.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '3. Data Protection' : '3. حماية المعلومات'}</h2>
            <p>${isEn ? 'We implement appropriate security measures to protect your information from unauthorized access, modification, or disclosure. Sensitive data is encrypted and stored securely.' : 'نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به. يتم تشفير البيانات الحساسة وتخزينها بشكل آمن.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '4. Medical Photos' : '4. الصور الطبية'}</h2>
            <p>${isEn ? 'Medical photos uploaded to the platform are used solely for case evaluation by certified doctors. These photos are protected and are not shared with any third party.' : 'الصور الطبية تُستخدم فقط لتقييم حالتك من قبل الأطباء المعتمدين. هذه الصور محمية ولا يتم مشاركتها مع أي طرف ثالث.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '5. Cookies' : '5. ملفات تعريف الارتباط'}</h2>
            <p>${isEn ? 'We use cookies to improve your experience, save preferences, and analyze site usage.' : 'نستخدم الكوكيز لتحسين تجربتك، وحفظ تفضيلاتك، وتحليل استخدام الموقع.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '6. Your Rights' : '6. حقوقك'}</h2>
            <p>${isEn ? 'You have the right to access, modify, or delete your personal information at any time. You may also request complete account deletion.' : 'لديك الحق في الوصول إلى معلوماتك وتعديلها أو حذفها. يمكنك أيضاً طلب حذف حسابك بالكامل.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '7. Children\'s Privacy' : '7. خصوصية الأطفال'}</h2>
            <p>${isEn ? 'Our platform is not intended for users under 18 years of age. We do not knowingly collect information from minors.' : 'المنصة غير مخصصة للمستخدمين أقل من 18 عاماً. لا نجمع معلومات من القاصرين.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '8. Changes to This Policy' : '8. التغييرات'}</h2>
            <p>${isEn ? 'We may update this privacy policy from time to time. We will notify users of any significant changes.' : 'قد نحدّث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات جوهرية.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '9. Contact Us' : '9. التواصل'}</h2>
            <p>${isEn ? 'If you have questions about this privacy policy, contact us at:' : 'للاستفسارات:'} <strong>privacy@htc.com</strong></p>
          </div>
        </div>
      </div>
    `;
  }

  // ====== TERMS OF USE ======
  function renderTerms() {
    const lang = localStorage.getItem('lang') || 'ar';
    const app = document.getElementById('app');
    const isEn = lang === 'en';
    app.innerHTML = `
      <div class="container">
        <div class="about-page">
          <div class="about-hero">
            <h1>${isEn ? 'Terms of Use' : 'شروط الاستخدام'}</h1>
            <p class="about-subtitle">${isEn ? 'Last updated: April 2026' : 'آخر تحديث: أبريل 2026'}</p>
          </div>
          <div style="background:var(--bg-card);padding:32px;border-radius:14px;box-shadow:var(--shadow-md);line-height:2;color:var(--text)">
            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '1. Acceptance' : '1. القبول'}</h2>
            <p>${isEn ? 'By using Hair Transplant Connect, you agree to these terms and conditions. If you do not agree with any part, please do not use the platform.' : 'باستخدام المنصة، فإنك توافق على هذه الشروط. إذا كنت لا توافق على أي جزء، يرجى عدم استخدام المنصة.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '2. Service Description' : '2. وصف الخدمة'}</h2>
            <p>${isEn ? 'The platform is an intermediary connecting hair transplant patients with specialized doctors. We do not provide direct medical services and are not responsible for surgical outcomes.' : 'المنصة وسيط يربط مرضى زراعة الشعر بالأطباء المتخصصين. نحن لا نقدم خدمات طبية مباشرة ولا نتحمل مسؤولية نتائج العمليات.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '3. User Accounts' : '3. حسابات المستخدمين'}</h2>
            <p>${isEn ? 'Registration information must be accurate. You are responsible for maintaining the confidentiality of your password.' : 'يجب أن تكون المعلومات المقدمة صحيحة. أنت مسؤول عن سرية كلمة مرورك.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '4. Doctor Obligations' : '4. التزامات الأطباء'}</h2>
            <p>${isEn ? 'Doctors must provide accurate information about their qualifications and hold valid medical licenses.' : 'يجب على الأطباء تقديم معلومات دقيقة عن مؤهلاتهم ولديهم التراخيص اللازمة.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '5. Liability' : '5. المسؤولية'}</h2>
            <p>${isEn ? 'The platform is not responsible for disputes between patients and doctors. We are a communication platform only and do not guarantee treatment outcomes.' : 'المنصة غير مسؤولة عن النزاعات بين المرضى والأطباء. نحن منصة تواصل فقط ولا نضمن نتائج أي علاج.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '6. Content' : '6. المحتوى'}</h2>
            <p>${isEn ? 'Content must not contain illegal, offensive, or misleading material. We reserve the right to remove violating content.' : 'يجب ألا يحتوي المحتوى على مواد غير قانونية أو مضللة. نحتفظ بحق حذف أي محتوى مخالف.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '7. Payment' : '7. الدفع'}</h2>
            <p>${isEn ? 'Offers are advisory. Payment is made directly between patient and doctor. The platform does not charge commissions currently.' : 'العروض إرشادية. الدفع يتم مباشرة بين المريض والطبيب. المنصة لا تتقاضى عمولات حالياً.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '8. Reviews' : '8. التقييمات'}</h2>
            <p>${isEn ? 'Reviews must be honest. We reserve the right to remove abusive or misleading reviews.' : 'يجب أن تكون التقييمات صادقة. نحتفظ بحق حذف التقييمات المسيئة.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '9. Modifications' : '9. التعديلات'}</h2>
            <p>${isEn ? 'We reserve the right to modify these terms at any time with user notification.' : 'نحتفظ بحق تعديل هذه الشروط في أي وقت مع إخطار المستخدمين.'}</p>

            <h2 style="color:var(--primary);margin:20px 0 10px">${isEn ? '10. Governing Law' : '10. القانون المعمول به'}</h2>
            <p>${isEn ? 'These terms are governed by applicable laws.' : 'تخضع هذه الشروط للقوانين المعمول بها.'}</p>

            <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:10px;padding:16px;margin-top:24px">
              <strong style="color:#92400e">⚠️ ${isEn ? 'Medical Disclaimer' : 'إخلاء مسؤولية طبية'}:</strong>
              <p style="margin:8px 0 0;color:#92400e;font-size:0.95rem">${isEn ? 'This platform is for informational purposes only and does not provide medical advice. Consult your specialist before making any decisions. Hair transplant results vary by individual.' : 'هذه المنصة لأغراض إعلامية فقط ولا تقدم نصائح طبية. استشر طبيبك المختص قبل اتخاذ أي قرارات. نتائج زراعة الشعر تختلف من شخص لآخر.'}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

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
      password: simpleHash(password),
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
    showToast(t('common.noResults') + ' / No new notifications', 'info');
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
